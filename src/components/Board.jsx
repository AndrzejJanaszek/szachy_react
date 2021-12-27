import React, { Component } from 'react'
import Square from './Square'
import './../css/board.css'
import { Fragment } from 'react/cjs/react.production.min';
import ENUMS from '../others/enums';
import PIECE_MOVES from '../others/pieceMoves';
import { Cords } from '../others/classes';

export class Board extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // array of FENs from every turn
            positions: ["rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"],
            currentPosition: [],
            possibleMoves : [],
            movingPieceCords : null,
        }
        // sets -> this.state.currentPosition as an array[][]
        for (let i = 0; i < 8; i++) {
            this.state.currentPosition[i] = [];
            for (let j = 0; j < 8; j++) {
                this.state.currentPosition[i][j] = null;
            }
        }

        // let startingPositionFEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
        this.currentPosition = this.fenAnalis(this.state.positions[0]);
        // binds
        this.fenAnalis = this.fenAnalis.bind(this);
        this.pieceSymbol2PieceType = this.pieceSymbol2PieceType.bind(this);
        this.pieceSymbol2PieceColor = this.pieceSymbol2PieceColor.bind(this);
        this.getPossibleMoves = this.getPossibleMoves.bind(this);
        this.arrayToFEN = this.arrayToFEN.bind(this);
        this.makeMove = this.makeMove.bind(this);
        this.manageMove = this.manageMove.bind(this);
    }

    fenAnalis(fen) {
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

        let fenPosition = this.state.currentPosition;
        for (let row = 0; row < 8; row++) {
            let strColIndex = 0;
            for (let col = 0; col < 8; col++) {
                if (isNaN(possitionRows[row][strColIndex]) == true) {
                    // piece
                    // this.state.currentPosition[row][col] = possitionRows[row][strColIndex];
                    fenPosition[row][col] = possitionRows[row][strColIndex];
                }
                else {
                    // nothin - skip
                    col += parseInt(possitionRows[row][strColIndex] - 1);
                }
                strColIndex++;
            }
        }
        // this.setState({currentPosition : curPos});
        return fenPosition;
    }

    pieceSymbol2PieceType(symbol) {
        if(symbol != null){
            switch (symbol.toLowerCase()) {
                case 'p':
                    return ENUMS.PIECE_TYPE.PAWN;
                    break;
                case 'r':
                    return ENUMS.PIECE_TYPE.ROOK;
                    break;
                case 'n':
                    return ENUMS.PIECE_TYPE.KNIGHT;
                    break;
                case 'b':
                    return ENUMS.PIECE_TYPE.BISHOP;
                    break;
                case 'q':
                    return ENUMS.PIECE_TYPE.QUEEN;
                    break;
                case 'k':
                    return ENUMS.PIECE_TYPE.KING;
                    break;
                default:
                    break;
            }
        }
        return 0;
    }

    pieceSymbol2PieceColor(symbol){
        if(symbol != null){
            return symbol == symbol.toLowerCase() ? ENUMS.CHESS_COLOR.BLACK : ENUMS.CHESS_COLOR.WHITE;
        }
        return 0;
    }

    getPossibleMoves(cords, onMove) {        
        
        function validateMove(move) {
            if(move.row > 7 || move.row < 0 || move.col > 7 || move.col < 0){
                return false;
            }

            return true;
        }

        const pieceSymbol = this.state.currentPosition[cords.row][cords.col];
        if(pieceSymbol != null){
            const pieceColor = this.pieceSymbol2PieceColor(pieceSymbol);
            if (onMove == pieceColor) {
                // continue

                this.state.movingPieceCords = cords;

                let possibleMoves= [];
                switch (this.pieceSymbol2PieceType(pieceSymbol)) {
                    case ENUMS.PIECE_TYPE.PAWN:
                        let pColorNumber = pieceColor == ENUMS.CHESS_COLOR.WHITE ? -1 : 1;
                        
                        // TODO: pamiętać o zmianie znaku przy kolorze
                        // zwykłe +1
                        let basic = cords.add(new Cords(pColorNumber*1,0))
                        if(validateMove(basic)){
                            if( this.pieceSymbol2PieceColor(this.state.currentPosition[basic.row][basic.col]) == 0 ){
                                possibleMoves.push(basic);
                            }
                        }

                        // pierwszy podwójny
                        let firstLine = onMove == ENUMS.CHESS_COLOR.WHITE ? 6 : 1;
                        if(cords.row == firstLine){
                            let firstPawnMove = cords.add(new Cords(pColorNumber*2,0))
                            if(validateMove(firstPawnMove)){
                                if( this.pieceSymbol2PieceColor(this.state.currentPosition[firstPawnMove.row][firstPawnMove.col]) == 0 ){
                                    possibleMoves.push(firstPawnMove);
                                    // TODO: w FEN trzeba zapisać że jest możliwe bicie w przelocie
                                }
                            }
                        }

                        // bicia
                        let captures = [cords.add(new Cords(pColorNumber*1,-1)),cords.add(new Cords(pColorNumber*1,1))];
                        for(let move of captures){
                            if(validateMove(move)){
                                let enemyColor = pieceColor == ENUMS.CHESS_COLOR.WHITE ? ENUMS.CHESS_COLOR.BLACK : ENUMS.CHESS_COLOR.WHITE;
                                if( this.pieceSymbol2PieceColor(this.state.currentPosition[move.row][move.col]) == enemyColor){
                                    possibleMoves.push(move);
                                }
                            }
                        }


                        break;
                    case ENUMS.PIECE_TYPE.ROOK:
                        for(let direction of PIECE_MOVES.ROOK){
                            for(let move of direction){
                                let checkingMove = move.add(cords);
                                if(validateMove(checkingMove)){
                                    if(this.pieceSymbol2PieceColor(this.state.currentPosition[checkingMove.row][checkingMove.col]) != pieceColor){
                                        possibleMoves.push(checkingMove);
                                       
                                    }
                                    else{
                                        break;
                                    }
                                }
                                else{
                                    break;
                                }
                            }
                        }
                        break;
                    case ENUMS.PIECE_TYPE.KNIGHT:
                        for(let move of PIECE_MOVES.KNIGHT){
                            let checkingMove = move.add(cords);
                            // is move on a board
                            if(validateMove(checkingMove)){
                                // is not attacking ally
                                if(this.pieceSymbol2PieceColor(this.state.currentPosition[checkingMove.row][checkingMove.col]) != pieceColor){
                                    possibleMoves.push(checkingMove);

                                    // TODO: general chcecing is move possible -> is king in check is game over ...
                                }
                            }
                        }
                        break;
                    case ENUMS.PIECE_TYPE.BISHOP:
                        for(let direction of PIECE_MOVES.BISHOP){
                            for(let move of direction){
                                let checkingMove = move.add(cords);
                                if(validateMove(checkingMove)){
                                    if(this.pieceSymbol2PieceColor(this.state.currentPosition[checkingMove.row][checkingMove.col]) != pieceColor){
                                        possibleMoves.push(checkingMove);
                                       
                                    }
                                    else{
                                        break;
                                    }
                                }
                                else{
                                    break;
                                }
                            }
                        }
                        break;
                    case ENUMS.PIECE_TYPE.QUEEN:
                        for(let direction of PIECE_MOVES.QUEEN){
                            for(let move of direction){
                                let checkingMove = move.add(cords);
                                if(validateMove(checkingMove)){
                                    if(this.pieceSymbol2PieceColor(this.state.currentPosition[checkingMove.row][checkingMove.col]) != pieceColor){
                                        possibleMoves.push(checkingMove);
                                       
                                    }
                                    else{
                                        break;
                                    }
                                }
                                else{
                                    break;
                                }
                            }
                        }
                        break;
                    case ENUMS.PIECE_TYPE.KING:
                        for(let move of PIECE_MOVES.KING){
                            let checkingMove = move.add(cords);
                            if(validateMove(checkingMove)){
                                if(this.pieceSymbol2PieceColor(this.state.currentPosition[checkingMove.row][checkingMove.col]) != pieceColor){
                                    possibleMoves.push(checkingMove);
                                    
                                }
                            }
                        }
                        break;

                    default:
                        break;
                }
                this.setState({possibleMoves : possibleMoves});
                return possibleMoves;
            }
        }
        this.setState({possibleMoves : []});
        return 0;
    }

    arrayToFEN(arr){
        let newFen = "";
        for(let row of arr){
            let nulls = 0;
            for(let col of row){
                if(col != null){
                    if(nulls > 0){
                        newFen += nulls;
                        nulls = 0;
                    }
                    newFen += col;
                }
                else{
                    nulls++;
                }
            }
            if(nulls > 0){
                newFen += nulls;
                nulls = 0;
            }
            newFen += "/";
        }

        return newFen.slice(0,-1);
    }

    makeMove(from, to){
        for(let move of this.state.possibleMoves){
            if(move.equals(to)){
                // wykonaj ruch
                let newPosition = this.state.currentPosition;
                newPosition[to.row][to.col] = this.state.currentPosition[from.row][from.col];
                
                newPosition[from.row][from.col] = null;

                this.state.positions.push( this.arrayToFEN(newPosition) );

                // this.state.currentPosition = newPosition;


                // this.setState((prevState)=>{return {positions: prevState.positions.push(this.arrayToFEN(newPosition))}});
                this.setState({currentPosition: newPosition});

            }
        }
        this.setState({possibleMoves: []});
    }

    manageMove(currentSquareCords ,onMove){
        if(this.state.possibleMoves.length > 0){
            // try to make move
            this.makeMove(this.state.movingPieceCords, currentSquareCords);
        }
        else{
            // check possible moves
            this.getPossibleMoves(currentSquareCords, onMove);
        }
    }

    render() {
        // let startingPositionFEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
        // let startingPositionFEN = "1rbqr1k1/2p1bpp1/2np1n1p/1p1Np3/4P3/1B1P1N1P/1PP2PP1/R1BQR1K1 b - - 3 13";
        // let startingPositionFEN = "8/5p2/2p5/4n3/6p1/3p4/8/1K4k1 w - - 0 1";
        // let magnus_nepo_game9 = "r2rb1k1/1Bp2pp1/4p3/4P2p/2P3nP/1N4P1/P4P2/R3R1K1 b - - 0 26";
        // let magnus_nepo_game10 = "4r1k1/pp4np/2p1b3/3p1pp1/3P2P1/2PB1P1P/PP2NK2/R7 b - - 0 25";
        // let magnus_nepo_game7 = "1rbqr1k1/2p1bpp1/2np1n1p/1p1Np3/4P3/1B1P1N1P/1PP2PP1/R1BQR1K1 b - - 3 13";

        // this.fenAnalis(this.state.positions[this.state.positions.length-1]);
        let squares = [];

        for (let row = 0; row < 8; row++) {
            squares[row] = [];
            for (let col = 0; col < 8; col++) {
                let color = (row + col) % 2 == 1 ? ENUMS.CHESS_COLOR.BLACK : ENUMS.CHESS_COLOR.WHITE;
                // pieceSymbol -> p - pawn, r - rook, R - rook etc. ...
                let pieceSymbol = this.state.currentPosition[row][col];

                let isPossibleMoveSquare = false;
                for(let move of this.state.possibleMoves){
                    if(move.equals(new Cords(row,col))){
                        isPossibleMoveSquare = true;
                        break;
                    }
                }
                // create square | color -> squareColor
                squares[row].push(<Square
                    color={color}
                    pieceSymbol={pieceSymbol}
                    isPossibleMoveSquare={isPossibleMoveSquare}
                    checkMove={()=>{
                            this.manageMove(new Cords(row,col),ENUMS.CHESS_COLOR.WHITE);
                            // this.getPossibleMoves(new Cords(row,col),ENUMS.CHESS_COLOR.WHITE))
                    }}
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