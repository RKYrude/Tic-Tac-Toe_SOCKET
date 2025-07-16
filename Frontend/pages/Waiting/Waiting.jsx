import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import socket from '../../src/utils/socket';
import './Waiting.scss'

function Waiting() {

    const [roomData, setRoomData] = useState(JSON.parse(sessionStorage.getItem("roomData")));
    const [hideRoomCode, setHideRoomCode] = useState(true)
    const [countdown, setCountdown] = useState(null); // null = not started


    const navigate = useNavigate();


    useEffect(() => {
        if (roomData?.p1 && roomData?.p2 && countdown === null) {
            setCountdown(5); // start countdown from 5 seconds
        }


    }, [roomData]);

    useEffect(() => {
        if (countdown === null) return;

        if (countdown === 0) {
            
            navigate('/game');
            return;
        }

        const interval = setInterval(() => {
            setCountdown((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(interval); // cleanup
    }, [countdown]);


    useEffect(() => {
        const wasDisconnected = sessionStorage.getItem('wasDisconnected');

        if (!wasDisconnected) {
            navigate("/lobby");
        }

    }, []);




    useEffect(() => {

        function handleRoomJoin(roomCode, socketID) {
            console.log(`${socketID} - JOINED ROOM ${roomCode}`);
            socket.emit("requestData", { info: "Player List", roomCode: roomCode });
        }

        function handleRoomExit(roomID) {
            console.log(`Exited Room ${roomID}`);
            navigate("/lobby");
        }

        function handleUserDisconnect(socketID) {
            console.log(`${socketID} disconnected`);

            if (socket.id === socketID) {
                sessionStorage.removeItem("wasDisconnected");
                navigate("/lobby");
            }
            else {
                socket.emit("requestData", { info: "Player List", roomCode: roomData.roomCode });
                setCountdown(null);
            }
        }

        function handleresponseData(room) {            
            sessionStorage.setItem("roomData", JSON.stringify({
                roomCode: room.roomID,
                p1: room.p1,
                p2: room.p2
            }));

            setRoomData(JSON.parse(sessionStorage.getItem("roomData")));
        }

        function handleBeforeUnload() {
            sessionStorage.removeItem("wasDisconnected");
            console.log("Disconnected");
            navigate('/lobby');
        }

        socket.on("roomJoined", handleRoomJoin);
        socket.on('roomExited', handleRoomExit);
        socket.on("userLeft", handleUserDisconnect);
        socket.on("responseData", handleresponseData);
        window.addEventListener("beforeunload", handleBeforeUnload);

        return () => { //dosent run immediatetly...Runs when the componented is unmounted or rerendered
            socket.off("roomJoined", handleRoomJoin);
            socket.off('roomExited', handleRoomExit);
            socket.off("userLeft", handleUserDisconnect);
            socket.off("responseData", handleresponseData);
            window.addEventListener("beforeunload", handleBeforeUnload);
        }
    }, []);

    function copyText() {
        const text = roomData.roomCode || roomData.roomID;
        navigator.clipboard.writeText(text)
            .then(() => console.log("Copied ", text))
            .catch(err => console.error("Failed to copy:", err));
    }


    return (
        <div className="waiting-cont">
            <section className='top'>
                <h1>WAITING FOR PLAYERS</h1>
                <div className="roomcode-cont">
                    <div className="roomdata">
                        <p>ROOM CODE</p>
                        <h3>{hideRoomCode ? <div>* * * * * *</div> : roomData.roomCode}</h3>

                        <button onClick={() => { setHideRoomCode(!hideRoomCode) }}>
                            {hideRoomCode ?
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-eye-slash-fill hidepass" viewBox="0 0 16 16">
                                    <path d="m10.79 12.912-1.614-1.615a3.5 3.5 0 0 1-4.474-4.474l-2.06-2.06C.938 6.278 0 8 0 8s3 5.5 8 5.5a7 7 0 0 0 2.79-.588M5.21 3.088A7 7 0 0 1 8 2.5c5 0 8 5.5 8 5.5s-.939 1.721-2.641 3.238l-2.062-2.062a3.5 3.5 0 0 0-4.474-4.474z" />
                                    <path d="M5.525 7.646a2.5 2.5 0 0 0 2.829 2.829zm4.95.708-2.829-2.83a2.5 2.5 0 0 1 2.829 2.829zm3.171 6-12-12 .708-.708 12 12z" />
                                </svg>
                                :
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-eye-fill" viewBox="0 0 16 16">
                                    <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0" />
                                    <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8m8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7" />
                                </svg>
                            }

                        </button>
                    </div>

                    <button className="cpyButt-cont" onClick={copyText}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="currentColor" className="bi bi-copy cpybutt" viewBox="0 0 16 16">
                            <path fillRule="evenodd" d="M4 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1h1v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1v1z" />
                        </svg>
                    </button>
                </div>
            </section>

            <section className='bottom'>
                <h3>Connected Players</h3>
                <div className="connectedPlayers">
                    <p>{roomData.p1 == socket.id ? `${roomData.p1} (you)` : roomData.p1 || 'Waiting . . .'}</p>
                    <p>{roomData.p2 == socket.id ? `${roomData.p2} (you)` : roomData.p2 || 'Waiting . . .'}</p>
                </div>

                {countdown !== null && (
                    <h2>Game starts in {countdown} seconds</h2>
                )}

            </section>
        </div>
    )
}

export default Waiting;