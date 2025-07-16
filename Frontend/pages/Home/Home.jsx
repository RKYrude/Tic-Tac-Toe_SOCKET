import './Home.scss'
import { useNavigate } from 'react-router-dom';


function Lobby() {
    const navigate = useNavigate();

    function startGameClick() {
        let audio = new Audio('../../src/assets/sounds/clear-mouse-clicks.wav');
        audio.playbackRate = 1.9;
        audio.play();
        setTimeout(() => {  //game starts after full sound is played
            navigate('/lobby')
        }, 180);
    }


    return (
        <div className="home_container">
            <img draggable="false" className="homeBG" src="../src/assets/HOME.svg" alt="lobby image" />
            
            <button className="butt_start" onClick={startGameClick}>
                <img draggable="false" src="../src/assets/BUTT_START.svg" alt="start button" />
            </button>
        </div>
    );
}

export default Lobby;
