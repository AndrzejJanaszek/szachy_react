import React from 'react'
import ENUM from '../other/enum';
import Square from './Square';
import '../style/board.css';
import { Cords } from '../other/classes';

export default function Board({position, manageMove, possibleMoves}) {
    const squares = [
        [],[],[],[],[],[],[],[]
    ];
    for(let i = 0; i < 8; i++){
        for(let j = 0; j < 8; j++){
            let isPossibleSquare = false;
            for(let move of possibleMoves){
                if(move.equals(new Cords(i,j))){
                    isPossibleSquare = true;
                    break;
                }
            }
            const color = (i+j)%2==0 ? ENUM.CHESS_COLOR.WHITE : ENUM.CHESS_COLOR.BLACK;
            squares[i][j] = 
                <Square 
                manageMove={ ()=>{manageMove(new Cords(i,j)) } }
                color={color} 
                isPossibleSquare={isPossibleSquare}
                piece={position[i][j]}/>
        }   
    }

    return (
        <div className='board'>
            {squares}
        </div>
    )
}
