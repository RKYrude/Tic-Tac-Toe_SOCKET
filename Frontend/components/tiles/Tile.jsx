import "./Tile.scss";
import { useState, useEffect } from "react";

export default function Tile({ value, onClick, isPlayerTurn, socketId, index, p1 }) {

    const [tileSrc, setTileSrc] = useState("../src/assets/GREY_GRID_BLOCK.svg");

    useEffect(() => {
        if (value === null) {
            setTileSrc("../src/assets/GREY_GRID_BLOCK.svg");
        } else if (value === "p1") {
            setTileSrc("../src/assets/GREEN_CIRCLE.svg");
        } else {
            setTileSrc("../src/assets/RED_CROSS.svg");
        }
    }, [value, p1]);

    const handleTileClick = () => {
        if (!isPlayerTurn || value !== null) return;
        onClick(index);        
        
    };

    return (
        <button className="grid" onClick={handleTileClick} disabled={value !== null}>
        {/* <button className="grid" onClick={()=>onClick(index)} > */}
            <img draggable="false" className={`box box${index} ${value === "p1" ? "green-shadow" : ""} ${value === "p2" ? "red-shadow" : ""}`} src={tileSrc} alt="grid" />
        </button>
    );
}