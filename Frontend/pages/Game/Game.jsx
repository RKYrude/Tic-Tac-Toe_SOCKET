import './Game.scss'
import PlayerTurn from '../../components/playerTurn/PlayerTurn'
import Tile from '../../components/tiles/Tile'
import BackButton from '../../components/backButton/BackButton'
import RestartButton from '../../components/restartButton/RestartButton'

function Game() {
    return (
        <div className="game-cont">
            < PlayerTurn />

            <div className="tile-cont">
                {Array.from({ length: 9 }).map((_, index) => (
                    <Tile
                        key={index}
                    />
                ))}
            </div>

            <div className="butt-cont">
                < BackButton />
                < RestartButton />
            </div>
        </div>

    )
}

export default Game;