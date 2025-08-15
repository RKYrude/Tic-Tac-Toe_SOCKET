import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

const port = 3000;
const app = express();
const server = http.createServer(app);

const MAX_ROOM_LIMIT = 2;

let rooms = []

// app.use(cors({
//     origin: 'http://localhost:5173',
//     methods: ['GET', 'POST']
// }));

const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST']
    }
});



io.on('connection', (socket) => {

    function handleRoomCreation(roomData) {
        const roomCode = roomData.roomCode;

        socket.join(roomCode);
        socket.roomCode = roomCode;

        rooms.push(
            {
                roomID: roomCode,
                p1: socket.id,
                p2: null,
                board: Array(9).fill(null),
                playerTurn: socket.id,
                moveID: 1,
            }
        )

        console.log(rooms);

        io.to(roomCode).emit("roomJoined", roomCode, socket.id);
    }

    function handleRoomJoin(roomCode) {
        const socketRoom = io.sockets.adapter.rooms.get(roomCode);
        const numClients = socketRoom ? socketRoom.size : 0;

        const room = rooms.find(r => r.roomID === roomCode);

        //Room Not Found
        if (!room) {
            socket.emit('roomNotFound', { msg: `ERROR: Room ${roomCode} Not Found!` });
            return;
        }

        //Room Full
        if (numClients >= MAX_ROOM_LIMIT) {
            socket.emit("roomFull", { msg: `ERROR: Room ${roomCode} is Full!` }); //sockeet.on for this is still no added to front end
            return;
        }

        //Room Join
        socket.join(roomCode);
        socket.roomCode = roomCode;

        const roomObj = rooms.find(r => r.roomID === roomCode);

        if (roomObj.p1 == null) roomObj.p1 = socket.id;
        if (roomObj.p2 == null) roomObj.p2 = socket.id;


        io.to(roomCode).emit("roomJoined", roomCode, socket.id);
    }

    function handleRoomExit(roomCode) {
        const existingRoom = rooms.find(r => r.roomID === roomCode);

        console.log(existingRoom);


        if (existingRoom) {
            console.log("handleRoomExit");
            socket.leave(roomCode);

            if (existingRoom.p1 === socket.id) existingRoom.p1 = null;
            if (existingRoom.p2 === socket.id) existingRoom.p2 = null;

            // console.log(`${socket.id} Left Room ${roomCode} `);

            if (!existingRoom.p1 && !existingRoom.p2) {
                const index = rooms.findIndex(r => r.roomID === roomCode);

                if (index !== -1) rooms.splice(index, 1);

                console.log(`Room ${roomCode} deleted`);
                console.log("\n", rooms);

            } else {
                socket.to(roomCode).emit("userLeft", { msg: `Player ${socket.id} Left.` });
                //* Not functional yet as no leave button added and no listener in frontend
            }
        }

        socket.emit("roomExited", roomCode);
    }

    function handleRoomDisconnect() {
        const roomCode = socket.roomCode;

        if (roomCode == null) return;

        const room = rooms.find(r => r.roomID === roomCode);

        io.to(roomCode).emit('userDisconnected', socket.id);

        console.log(`user ${socket.id} left room ${roomCode}`);

        socket.leave(roomCode);

        if (room.p1 === socket.id) room.p1 = null;
        if (room.p2 === socket.id) room.p2 = null;

        if (!room.p1 && !room.p2) {
            const index = rooms.findIndex(r => r.roomID === roomCode);
            if (index !== -1) rooms.splice(index, 1);
            console.log(`Room ${roomCode} deleted`);
        }

        console.log(rooms);
    }

    function handleDataRequest(data) {
        console.log(`Client ${socket.id} requested: ${data.info} from room ${data.roomCode}`);

        const room = rooms.find(r => r.roomID === data.roomCode);

        console.log('\n\nhandleRoomJoinedataRequest --- room', room);

        io.to(data.roomCode).emit('responseData', room);
    }

    function handlePlayerMove(updatedRoomData) {
        
        let room = rooms.find(r => r.roomID === updatedRoomData.roomCode);
        
        if (!room) return; // Room not found
        
        console.log("inside handlePlayerMove");

        const playerID = socket.id; // The player making the move
        const isPlayer1 = playerID === room.p1;
        const isPlayer2 = playerID === room.p2;

        // 1️⃣ Validate turn based on playerTurn
        if (room.playerTurn !== playerID) {
            console.log("Invalid turn - not your turn!");
            return;
        }

        // 2️⃣ Validate moveID parity
        const shouldBeP1Turn = room.moveID % 2 !== 0;
        if (shouldBeP1Turn && !isPlayer1) {
            console.log("Invalid move - it's Player 1's turn!");
            return;
        }
        if (!shouldBeP1Turn && !isPlayer2) {
            console.log("Invalid move - it's Player 2's turn!");
            return;
        }

        // 3️⃣ Apply board changes (from client move)
        room.board = updatedRoomData.board;

        // 4️⃣ Increment moveID and switch turn
        room.moveID += 1;
        room.playerTurn = isPlayer1 ? room.p2 : room.p1;

        // 5️⃣ Broadcast updated state to both players
        io.to(room.roomID).emit("roomDataUpdated", 
            {
                roomCode: room.roomID,
                p1: room.p1,
                p2: room.p2,
                board: room.board,
                playerTurn: room.playerTurn,
                moveID: room.moveID,
            }
        );

        // console.log(`Move accepted. Next turn: ${room.playerTurn}`);

    }




    socket.on("createRoom", handleRoomCreation);
    socket.on("joinRoom", handleRoomJoin);

    socket.on("exitRoom", handleRoomExit);
    socket.on("disconnect", handleRoomDisconnect);

    socket.on("requestData", handleDataRequest);

    socket.on("playerMove", handlePlayerMove);




    socket.on("test", () => { console.log('Test') });

});




















server.listen(port, () => {
    console.log(`Server Running at port ${port}`);

})