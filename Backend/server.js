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

    function handleRoomCreation(roomCode) {

        const existingRoom = rooms.find(r => r.p1 === socket.id || r.p2 === socket.id);

        if (existingRoom) {
            socket.leave(existingRoom.roomID);

            if (existingRoom.p1 === socket.id) existingRoom.p1 = null;
            if (existingRoom.p2 === socket.id) existingRoom.p2 = null;

            console.log("Existing ROOM :- ",existingRoom);

            if (!existingRoom.p1 && !existingRoom.p2) {
                const index = rooms.findIndex(r => r.roomID === existingRoom.roomID);
                if (index !== -1) rooms.splice(index, 1);
                console.log(`Room ${existingRoom.roomID} deleted`);
            }
        }



        socket.join(roomCode);
        socket.roomCode = roomCode;

        rooms.push(
            {
                roomID: roomCode,
                p1: socket.id,
                p2: null
            }
        )

        console.log(rooms);

        io.to(roomCode).emit("roomJoined", roomCode, socket.id);
    }

    function handleRoomJoin(roomCode) {
        const room = io.sockets.adapter.rooms.get(roomCode);
        const numClients = room ? room.size : 0;

        //Room Not Found
        if (!room) {
            socket.emit('roomNotFound', roomCode);
            return;
        }

        //Room Full
        if (numClients >= MAX_ROOM_LIMIT) {
            socket.emit("roomFull", roomCode); //sockeet.on for this is still no added to front end
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

    function handleRoomExit(roomCode) { //Not functional yet as no leave button added
        socket.to(roomCode).emit("userLeft", socket.id);

        socket.emit("roomExited", roomCode);

        socket.leave(roomCode);
    }

    function handleRoomDisconnect() {
        const roomCode = socket.roomCode;

        // console.log(rooms);


        if (!roomCode) {
            console.log(`no Room Code to disconnect`);
            return;
        }

        const room = rooms.find(r => r.roomID === roomCode);
        if (!room) {
            console.log(`no ${roomCode} room available`)
            return;
        }

        io.to(roomCode).emit('userLeft', socket.id);

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

        console.log('handleRoomJoinedataRequest --- room', room);

        io.to(data.roomCode).emit('responseData', room);
    }



    socket.on("createRoom", handleRoomCreation);
    socket.on("joinRoom", handleRoomJoin);

    socket.on("exitRoom", handleRoomExit);
    socket.on("disconnect", handleRoomDisconnect);

    socket.on("requestData", handleDataRequest);

});




















server.listen(port, () => {
    console.log(`Server Running at port ${port}`);

})