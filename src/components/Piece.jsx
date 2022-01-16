import React from 'react'
import '../style/piece.css';

export default function Piece({piece}) {
    function genPieceClass(){
        // color and type are enums so for eg. 
        // "piece piece--white piece--knight"
        return "piece piece--"+piece.color+" piece--"+piece.type;
    }
    return (
        <div className={genPieceClass()}>
            
        </div>
    )
}
