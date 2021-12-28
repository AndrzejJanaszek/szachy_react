import React, { Component } from 'react'
import ENUMS from '../others/enums';
import Board from './Board';
import Piece from './Piece';

export class GameManager extends Component {
    constructor(props) {
        super(props);
        this.state = {
            positions: [],
            colorOnMove: ENUMS.CHESS_COLOR.WHITE,
            currentPosition: [
                ['','','','','','','',''],
                ['','','','','','','',''],
                ['','','','','','','',''],
                ['','','','','','','',''],
                ['','','','','','','',''],
                ['','','','','','','',''],
                ['','','','','','','',''],
                ['','','','','','','',''],
            ],
            possibleMoves : [],
        }
        
    }
    getPositionArrayFromFEN(fen){
        fen = fen.split(' ')[0];
        let rows = fen.split('/');

        let positionArray = [
            ['','','','','','','',''],
            ['','','','','','','',''],
            ['','','','','','','',''],
            ['','','','','','','',''],
            ['','','','','','','',''],
            ['','','','','','','',''],
            ['','','','','','','',''],
            ['','','','','','','',''],
        ];

        let rowIndex = 0;
        for(row of rows){
            for(let colIndex = 0; colIndex < 8; colIndex++){
                if(isNaN(row[colIndex])){
                    let piece = new Piece();
                    piece.initBySymbol(row[colIndex]);

                    positionArray[rowIndex][colIndex] = piece;
                }
            }

            rowIndex++;
        }

        return positionArray;
    }

    // TODO: przenieść management - funkcjonalności do tego komponentu

    render() {
        return (
            <div>
                {/* position - current position on board - 2D array [8][8] */}
                <Board position={currentPosition} possibleMoves={}></Board>
            </div>
        )
    }
}

export default GameManager
