import './Lobby.scss'
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import socket from '../../src/utils/socket';

function Lobby() {    

    const [inputValue, setInputValue] = useState('')

    const navigate = useNavigate();

    function generateRoomCode() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let code = '';
        for (let i = 0; i < 6; i++) {
            code += chars[Math.floor(Math.random() * chars.length)];
        }
        return code;
    }

    useEffect(() => {

        function handleConnection() {
            console.log(`connected with socket id ${socket.id}`);
        }

        // function handleDisconnection() {
        //     sessionStorage.removeItem("roomData");
        //     console.log("Disconnected");
        // }

        function handleRoomExit(roomCode) {
            console.log(`Exited Room ${roomCode}`);
        }

        function handleRoomNotFound({msg}) {
            console.log(msg);
        }

        function handleRoomFull({msg}) {
            console.log(msg);
        }

        // function handleBeforeUnload() {
        //     sessionStorage.removeItem("roomData");
        //     console.log("Disconnected");
        // }

        socket.on("connect", handleConnection);
        socket.on('roomExited', handleRoomExit); //* Move this to waiting.jsx and game.jsx
        socket.on("roomNotFound", handleRoomNotFound);
        socket.on("roomFull", handleRoomFull);
        // window.addEventListener("beforeunload", handleBeforeUnload);

        return () => { // * dosent run immediatetly...Runs when the componented is unmounted or rerendered
            socket.off("connect", handleConnection);
            socket.off('roomExited', handleRoomExit);
            socket.off("roomNotFound", handleRoomNotFound);
            socket.off("roomFull", handleRoomFull);
            // window.removeEventListener("beforeunload", handleBeforeUnload);

        }
    }, []);

    function handleRoomCreation() {
        const createRoomID = generateRoomCode();
        const storedRoomData = JSON.parse(sessionStorage.getItem('roomData'));

        const finalizeRoomCreation = () => {
            
            const roomData = {
                roomCode: createRoomID,
                p1: socket.id,
                p2: null,
                board: Array(9).fill(null),
                playerTurn: socket.id,
                moveID: 1,
            }

            socket.emit("createRoom", roomData);

            sessionStorage.setItem("roomData", JSON.stringify(roomData));
            // sessionStorage.setItem("wasDisconnected", "false");

            navigate("/waiting");
        };

        if (storedRoomData) { // * In a Room
            socket.once("roomExited", finalizeRoomCreation);           
            socket.emit("exitRoom", storedRoomData.roomCode);
        } else {
            finalizeRoomCreation();
        }
    }

    function handleRoomJoining() {
        const storedRoomData = JSON.parse(sessionStorage.getItem('roomData'));

        const joinLogic = () => {
            socket.emit("joinRoom", inputValue);

            socket.once("responseData", (data) => {

                const roomData = {
                    roomCode: data.roomID,
                    p1: data.p1,
                    p2: data.p2,
                    board: Array(9).fill(null),
                    playerTurn: data.p1,
                }

                sessionStorage.setItem("roomData", JSON.stringify(roomData));

                console.log(`Joined room ${data.roomID}`);

                navigate('/waiting');
            });

            socket.emit("requestData", { info: "Player List", roomCode: inputValue });
        };

        if (storedRoomData) {
            socket.once("roomExited", joinLogic);            
            socket.emit("exitRoom", storedRoomData.roomCode);
            console.log(storedRoomData.roomCode);
            
        } else {
            joinLogic();
        }
    }

    return (
        <div className="lobby_container">
            <h1>JOIN GAME</h1>

            <p>{socket.id}</p>

            <h3>Enter Room Code</h3>

            <div className="join-cont">
                <input type="text" value={inputValue} maxLength={6} onChange={(e) => setInputValue(e.target.value.toUpperCase())} />
                <button onClick={handleRoomJoining} disabled={inputValue.length < 6}>JOIN</button>
            </div>

            <button onClick={handleRoomCreation}>CREATE ROOM</button>
        </div>
    )
}

export default Lobby;