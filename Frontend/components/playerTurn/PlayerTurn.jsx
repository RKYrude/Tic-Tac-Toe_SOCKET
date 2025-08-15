import socket from "../../src/utils/socket";
import "./PlayerTurn.scss";
import { useEffect, useState } from "react";

export default function PlayerTurn(props) {



    //* This state holds the current player's display info
    const [playerSrc, setPlayerSrc] = useState({});

    // //* This code ONLY runs when playerTurn changes
    useEffect(() => {
        if (!props.roomData) return;

        if (props.roomData.moveID % 2 != 0) {
            setPlayerSrc({
                player: 1,
                src: "../src/assets/GREEN_INSET_CIRCLE.svg",
                color: "#12cdc0",
            });
        } else {
            setPlayerSrc({
                player: 2,
                src: "../src/assets/RED_INSET_CROSS.svg",
                color: "#ff625c",
            });
        }
    }, [props.roomData?.playerTurn]); //* <-- Dependency: run when this value changes

    return (
        <h1 className="playerTurn-cont">
            Player <span style={{color: `${playerSrc.color}`}}>{playerSrc.player}</span> Turn{" "}
            <img draggable="false" src={playerSrc.src} alt="playerTurnIndicator" />
        </h1>
    );
}
