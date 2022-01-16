import React from 'react'
import { Piece as PieceClass } from './../other/classes';
import ENUM from '../other/enum'
import '../style/square.css';
import Piece from './Piece';

export default function Square({color, piece}) {

    const colorClass= color == ENUM.CHESS_COLOR.WHITE ? "square--white" : "square--black";
    function genPieceIfExist(){
        if(piece instanceof PieceClass){
            return <Piece piece={piece}></Piece>;
        }
    }

    return (
        <div className={'square '+colorClass}>
            {genPieceIfExist()}
        </div>
    )
}
