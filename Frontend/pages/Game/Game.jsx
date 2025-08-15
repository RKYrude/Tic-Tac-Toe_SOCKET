import './Game.scss'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PlayerTurn from '../../components/playerTurn/PlayerTurn'
import Tile from '../../components/tiles/Tile'
import BackButton from '../../components/backButton/BackButton'
import RestartButton from '../../components/restartButton/RestartButton'
import socket from '../../src/utils/socket';


function Game() {
    const [storedRoomData, setRoomData] = useState(JSON.parse(sessionStorage.getItem("roomData")));
    
    const navigate = useNavigate();

    useEffect(() => {

        if (!storedRoomData){
            navigate("/lobby");
        }
    }, [storedRoomData]);

    const handleMove = (index) => {

        if (storedRoomData.board[index] !== null || storedRoomData.playerTurn !== socket.id) return; //* If not null or my move, return

        if (socket.id === storedRoomData.p1) {
            if (storedRoomData.moveID % 2 == 0) return
        }

        const updatedboard = [...storedRoomData.board];
        updatedboard[index] = socket.id === storedRoomData.p1 ? "p1" : "p2";

        const nextTurn = socket.id === storedRoomData.p1 ? storedRoomData.p2 : storedRoomData.p1;

        const updatedRoomData = {
            ...storedRoomData,
            board: updatedboard,
            playerTurn: nextTurn,
        };

        socket.emit("playerMove", updatedRoomData);
    };

    


    // Optional: listen for socket updates to roomData (e.g., after move)
    useEffect(() => {
        socket.on("roomDataUpdated", (updatedDataServer) => {
            setRoomData(updatedDataServer);

            sessionStorage.setItem("roomData", JSON.stringify(updatedDataServer));
        });

        return () => {
            socket.off("roomDataUpdated");
        };
    }, []);


    return (
        <div className="game-cont">
            <PlayerTurn
                roomData={storedRoomData}
            />

            <div className="tile-cont">
                {storedRoomData?.board.map((value, index) => (
                    <Tile
                        key={index}
                        value={value}
                        index={index}
                        onClick={() => handleMove(index)}
                        isPlayerTurn={storedRoomData.playerTurn === socket.id}
                        socketId={socket.id}
                        p1={storedRoomData.p1}
                    />
                ))}
            </div>

            <div className="butt-cont">
                <BackButton />
                <RestartButton />
            </div>
        </div>
    );
}

export default Game;
