import React from 'react'
import { Piece as PieceClass } from './../other/classes';
import ENUM from '../other/enum'
import '../style/square.css';
import Piece from './Piece';

export default function Square({color, piece, manageMove, isPossibleSquare}) {

    const colorClass= color == ENUM.CHESS_COLOR.WHITE ? "square--white" : "square--black";
    const moveSquareClass = isPossibleSquare == true ? " square--possible" : ""; 
    function genPieceIfExist(){
        if(piece instanceof PieceClass){
            return <Piece piece={piece}></Piece>;
        }
    }

    return (
        <div className={'square '+colorClass+moveSquareClass} onClick={manageMove}>
            {genPieceIfExist()}
        </div>
    )
}
