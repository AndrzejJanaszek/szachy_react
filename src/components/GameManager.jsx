import React, { useState } from 'react'
import { useEffect } from 'react/cjs/react.development';
import { FenObject } from '../other/classes';
import Board from './Board'

export default function GameManager() {

    const [gameHistory, setGameHistory] = useState(["rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1","rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1","rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2","rnbqkbnr/pppp1ppp/8/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2","r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3"])
    const [currentMoveNr, setCurrentMoveNr] = useState(0);
    // const [position, setPosition] = useState(new FenObject(gameHistory[currentMoveNr]).positionArr);
    // function fenToObject(fen){
        // positions: ["rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"],
        // const arrFen = fen.split(" ");

        // 1: fen to position : Array 8x8
        // onMove : str.ENUM {WHITE, BLACK}
        // castles : str for eg. "KQkq"
        // en passant : str  for eg. e3
        // TOP : number
        // moveNr : number
    // }

    function oneBack(){
        if(currentMoveNr-1>=0){
            setCurrentMoveNr(currentMoveNr-1);
        }
    }
    function oneForward(){
        if(currentMoveNr+1 < gameHistory.length){
            setCurrentMoveNr(currentMoveNr+1);
        }
    }

    return (
        <div>
            {/* TODO: 
                do Board dajemy 2 metody: getMove() makeMove()
                + potrzebne state robimy i to powinno dać możliwość robienia ruchów
                uwaga: problem bedzie dotyczył dobrego napisania metody odpowiedzialnej za robienie ruchu - musi przekawyzać dane o en passant, roszadach itd.
            */}
            <Board position={new FenObject(gameHistory[currentMoveNr]).positionArr}/>

            <button onClick={oneBack}>{"<<<"}</button>
            <button onClick={oneForward}>{">>>"}</button>
        </div>
    )
}
