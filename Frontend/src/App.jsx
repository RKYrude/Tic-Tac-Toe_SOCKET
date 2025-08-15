import { Routes, Route, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import socket from "./utils/socket.js";
import Home from '../pages/Home/Home.jsx';
import Game from '../pages/Game/Game.jsx';
import Lobby from '../pages/Lobby/Lobby.jsx';
import Waiting from "../pages/Waiting/Waiting.jsx";

function App() {

    const navigate = useNavigate();

    useEffect(() => {
        const handleBeforeUnload = () => {
            console.log("Page RELOADED");
            sessionStorage.removeItem("roomData");
            //* Navigation code at waiting.
        }

        const handleDisconnection = () => {
            console.log("Disconnected");
            sessionStorage.removeItem("roomData");
            //* Navigation code at waiting.
        }

        window.addEventListener("beforeunload", handleBeforeUnload);
        socket.on("disconnect", handleDisconnection);

        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
            socket.off("disconnect", handleDisconnection);
        }
    },[])

    return (
        <Routes>
            <Route path='/' element={< Home />} />
            <Route path='/lobby' element={< Lobby />} />
            <Route path='/waiting' element={< Waiting />} />
            <Route path='/game' element={< Game />} />
        </Routes>
    )
}

export default App
