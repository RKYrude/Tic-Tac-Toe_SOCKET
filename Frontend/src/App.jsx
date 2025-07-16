import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from '../pages/Home/Home.jsx';
import Game from '../pages/Game/Game.jsx';
import Lobby from '../pages/Lobby/Lobby.jsx';
import Waiting from "../pages/Waiting/Waiting.jsx";

function App() {

    return (

        <Router>
            <Routes>
                <Route path='/' element={< Home />} />
                <Route path='/lobby' element={< Lobby />} />
                <Route path='/waiting' element={< Waiting />} />
                <Route path='/game' element={< Game />} />
            </Routes>
        </Router>





    )
}

export default App
