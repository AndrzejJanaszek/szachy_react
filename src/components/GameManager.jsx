import React, { useState } from 'react'
import { useEffect } from 'react/cjs/react.development';
import { Cords, FenObject, Piece } from '../other/classes';
import ENUM from '../other/enum';
import PIECE_MOVES from '../other/pieceMoves';
import Board from './Board'

export default function GameManager() {

    // const [gameHistory, setGameHistory] = useState(["rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1","rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1","rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2","rnbqkbnr/pppp1ppp/8/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2","r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3"]);
    const [gameHistory, setGameHistory] = useState(["rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"]);
    const [currentMoveNr, setCurrentMoveNr] = useState(0);
    const [position, setPosition] = useState(new FenObject(gameHistory[currentMoveNr]).positionArr);
    const [possibleMoves, setPossibleMoves] = useState([]);
    const [activePiece, setActivePiece] = useState(null)
    const [activePiecePosition, setActivePiecePosition] = useState(null)
    const [colorOnMove, setColorOnMove] = useState(ENUM.CHESS_COLOR.WHITE)
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

    // UI functions
    function goToStart(){
        setCurrentMoveNr(0);
    }
    function goOneForward(){
        if(currentMoveNr+1 < gameHistory.length){
            setCurrentMoveNr(currentMoveNr+1);
        }
    }
    function goOneBack(){
        if(currentMoveNr-1>=0){
            setCurrentMoveNr(currentMoveNr-1);
        }
    }
    function goToEnd(){
        setCurrentMoveNr(gameHistory.length-1);
    }

    //moves

    function areCordsOnBoard(cords){
        if(cords.row < 0 || cords.row > 7 || cords.col < 0 || cords.col > 7){
            return false;
        }
        return true;
    }
    
    function genFEN(posArr, color, castles, enPassant, TOP, moveNr){
        // return FEN
        // posArr, newPositon
        // color, currentMovingColor
        // castles, castlesPossibleInNewFEN (new move)
        // enPassant, TOP, moveNr

        let strPos = "";
        let fenColor = "";
        let fenCastles= "";
        let fenEnPassant = "";
        let fenTOP = "";
        let fenMoveNr = "";

        for(let row = 0; row < 8; row++){
            let emptySquares = 0;
            for(let col = 0; col < 8; col++){
                if(posArr[row][col] instanceof Piece){
                    if(emptySquares > 0){
                        strPos += emptySquares;
                    }
                    strPos += posArr[row][col].symbol;
                }
                else{
                    emptySquares++;
                }

                if(col == 7 && emptySquares > 0){
                    strPos += emptySquares;
                }
            }
            if(row != 7)strPos+="/";
        }

        fenColor = color = ENUM.CHESS_COLOR.WHITE ? "w" : "b";
        fenCastles= castles;
        fenEnPassant = enPassant;
        fenTOP = TOP;
        fenMoveNr = color == ENUM.CHESS_COLOR.WHITE ? moveNr+1: moveNr;

        return (strPos +" "+ fenColor +" "+ fenCastles +" "+ fenEnPassant +" "+ fenTOP +" "+ fenMoveNr);
    }

    function squaresUnderPieceAttack(piece, cords){
        let finalSquares = [];
        switch (piece.type) {
            case ENUM.PIECE_TYPE.PAWN:
                {
                    const colorDirectionY = piece.color == ENUM.CHESS_COLOR.WHITE ? -1 : 1;
                    const attSquares = [new Cords(1 * colorDirectionY, -1), new Cords(1 * colorDirectionY, 1)];

                    for (let move of attSquares) {
                        move = move.add(cords);
                        if (areCordsOnBoard(move)) {
                            finalSquares.push(move);
                        }
                    }
                }
                break;
            case ENUM.PIECE_TYPE.ROOK:
                for(let direction of PIECE_MOVES.ROOK){
                    for(let move of direction){
                        move = move.add(cords);
                        if(areCordsOnBoard(move)){
                            finalSquares.push(move);

                            if(position[move.row][move.col] instanceof Piece){
                                // break direction loop
                                break;
                            }
                        }
                        else{
                            // break direction loop
                            break;
                        }
                    }
                }
                break;
            case ENUM.PIECE_TYPE.KNIGHT:
                for (let move of PIECE_MOVES.KNIGHT) {
                    move = move.add(cords);
                    if (areCordsOnBoard(move)) {
                        finalSquares.push(move);
                    }
                }
                break;
            case ENUM.PIECE_TYPE.BISHOP:
                for(let direction of PIECE_MOVES.BISHOP){
                    for(let move of direction){
                        move = move.add(cords);
                        if(areCordsOnBoard(move)){
                            finalSquares.push(move);

                            if(position[move.row][move.col] instanceof Piece){
                                // break direction loop
                                break;
                            }
                        }
                        else{
                            // break direction loop
                            break;
                        }
                    }
                }
                break;
            case ENUM.PIECE_TYPE.QUEEN:
                for(let direction of PIECE_MOVES.QUEEN){
                    for(let move of direction){
                        move = move.add(cords);
                        if(areCordsOnBoard(move)){
                            finalSquares.push(move);

                            if(position[move.row][move.col] instanceof Piece){
                                // break direction loop
                                break;
                            }
                        }
                        else{
                            // break direction loop
                            break;
                        }
                    }
                }
                break;
            case ENUM.PIECE_TYPE.KING:
                for (let move of PIECE_MOVES.KING) {
                    move = move.add(cords);
                    if (areCordsOnBoard(move)) {
                        finalSquares.push(move);
                    }
                }
                break;
        }
        return finalSquares;
    }

    function makeMove(cords){
        // add new FEN to gameHistory
        // new FenObject();

        let newPositon = position;
        newPositon[cords.row][cords.col] = activePiece;
        newPositon[activePiecePosition.row][activePiecePosition.row] = null;

        genFEN(newPositon, activePiece.getEnemyColor, "TODO", "TODO", "TODO", currentMoveNr);

        setCurrentMoveNr(currentMoveNr+1)
    }
    
    function getPossibleMoves(piece, cords) {
        const finalMoves = [];
        if (piece.color == colorOnMove) {
            const tryMoves = squaresUnderPieceAttack(piece, cords);

            // move : Cords()
            for (let move of tryMoves) {
                // ally?
                if (position[move.row][move.col] instanceof Piece && position[move.row][move.col].color == piece.color) {
                    // dont add
                }
                else {
                    // add move
                    finalMoves.push(move);
                }

            }

            // ally?
            // związanie
            // FOR KING: isDefended?  ---- roszady
        }
        return finalMoves;

    }

    function manageMove(squareCords){

        if(position[squareCords.row][squareCords.col] instanceof Piece){
            // we're taking a piece
            setActivePiece(position[squareCords.row][squareCords.col]);
            setActivePiecePosition(squareCords);
            setPossibleMoves(getPossibleMoves(position[squareCords.row][squareCords.col], squareCords));
        }
        else{
            // we're taping a square / trying make a move

            let isPossible = false;
            for(let move of possibleMoves){
                if(move.equals(squareCords)){
                    isPossible = true;
                    makeMove(move);
                }
            }

            if(!isPossible){
                setPossibleMoves([]);
            }
        }
    }

    return (
        <div>
            {/* TODO: 
                do Board dajemy 2 metody: getMove() makeMove()
                + potrzebne state robimy i to powinno dać możliwość robienia ruchów
                uwaga: problem bedzie dotyczył dobrego napisania metody odpowiedzialnej za robienie ruchu - musi przekawyzać dane o en passant, roszadach itd.
            */}
            <Board 
            possibleMoves={possibleMoves}
            manageMove={manageMove}
            position={new FenObject(gameHistory[currentMoveNr]).positionArr}/>

            <button onClick={goToStart}>{"<<<"}</button>
            <button onClick={goOneBack}>{"<"}</button>
            <button onClick={goOneForward}>{">"}</button>
            <button onClick={goToEnd}>{">>>"}</button>
        </div>
    )
}
