import React from 'react'
import ENUM from '../other/enum';
import Square from './Square';
import '../style/board.css';

export default function Board({position}) {
    const squares = [
        [],[],[],[],[],[],[],[]
    ];
    for(let i = 0; i < 8; i++){
        for(let j = 0; j < 8; j++){
            const color = (i+j)%2==0 ? ENUM.CHESS_COLOR.WHITE : ENUM.CHESS_COLOR.BLACK;
            squares[i][j] = <Square color={color} piece={position[i][j]}></Square>
        }   
    }

    return (
        <div className='board'>
            {squares}
        </div>
    )
}
