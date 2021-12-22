import React, { Component } from 'react'
import Square from './Square'
import './../css/board.css'
import { Fragment } from 'react/cjs/react.production.min';

export class Board extends Component {
    constructor(props){
        super(props);
        this.state = {
            // array of FENs from every turn
            positions : [],
            currentPosition : [],

        }
        for(let i = 0; i < 8; i++){
            this.state.currentPosition[i] = [];
            for(let j = 0; j < 8; j++){
                this.state.currentPosition[i][j] = null;
            }
        }

        this.fenAnalis = this.fenAnalis.bind(this);
    }

    fenAnalis(fen){
        /* 
        rnbqkbnr/
        pppppppp/
        8/
        8/
        8/
        8/
        PPPPPPPP/
        RNBQKBNR
        */
        let splitedFen = fen.split(' ');

        let position = splitedFen[0], colorOnMove = splitedFen[1], castles = splitedFen[2], enPassant = splitedFen[3], moves = splitedFen[4], moveNr = splitedFen[5];

        let possitionRows = position.split('/');


        for(let row = 0; row < 8; row++){
            let strColIndex = 0;
            for(let col = 0; col < 8; col++){
                if(isNaN(possitionRows[row][strColIndex]) == true){
                    // piece
                    this.state.currentPosition[row][col] = possitionRows[row][strColIndex];
                }
                else{
                    // nothin - skip
                    col += parseInt(possitionRows[row][strColIndex]-1);
                    // console.log( "row: "+row+" col:"+col+ possitionRows[row][col] + " --- " + (parseInt(possitionRows[row][col])-1));
                }
                strColIndex++;
            }
        }
    }

    render() {
        let startingPositionFEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
        let magnus_nepo_game9 = "r2rb1k1/1Bp2pp1/4p3/4P2p/2P3nP/1N4P1/P4P2/R3R1K1 b - - 0 26";
        let magnus_nepo_game10 = "4r1k1/pp4np/2p1b3/3p1pp1/3P2P1/2PB1P1P/PP2NK2/R7 b - - 0 25";
        let magnus_nepo_game7 = "1rbqr1k1/2p1bpp1/2np1n1p/1p1Np3/4P3/1B1P1N1P/1PP2PP1/R1BQR1K1 b - - 3 13";

        this.fenAnalis(startingPositionFEN);
        let squares = [];

        for(let row = 0; row < 8; row++){
            squares[row] = [];
            for(let col = 0; col < 8; col++){
                let color = (row+col)%2 == 1 ? "dark" : "ligth";
                let pieceSymbol = this.state.currentPosition[row][col];

                // create square
                squares[row].push(<Square 
                color={color} 
                content={"row: "+row + "; col:"+col}
                pieceSymbol={pieceSymbol}
                ></Square>);
            }
        }

        return (
            <div className='board'>
                {squares}
            </div>
        )
    }
}

export default Board