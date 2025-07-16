import { useState } from "react";
import "./Tile.scss";

export default function Tile() {

    const [count, setCount] = useState(0)

    function ttt(){
        setCount(prev => prev+1)
        console.log(count);
        
    }

    return (
        <button className="grid" onClick={ttt}>
            <img draggable="false" className="box box0" src="../src/assets/GREY_GRID_BLOCK.svg" alt="grid" />
        </button>
    )
}