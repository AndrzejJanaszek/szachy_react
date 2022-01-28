import React from "react";
import ENUM from "../other/enum";
import Square from "./Square";
import "../style/board.css";
import { Cords, Piece } from "../other/classes";

export default function Board({
  position,
  possibleMoves,
  onPieceClick,
  onPossibleSquareClick,
  onEmptySquareClick,
  colorOnMove,
}) {
  const squares = [[], [], [], [], [], [], [], []];
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      let isPromotion = false;
      let onClickFunction = onEmptySquareClick;
      if (position[i][j] instanceof Piece) {
        onClickFunction = () => {
          onPieceClick(position[i][j], new Cords(i, j));
        };
      }
      let isPossibleSquare = false;
      for (let move of possibleMoves) {
        if (move.to.equals(new Cords(i, j))) {
          isPossibleSquare = true;
          if (move.promotion) {
            // promotion function  thats show selection window
            isPromotion = true;
            onClickFunction = (piece) => {
              let nMove = move.clone();
              console.log(move.promotionPiece);
              console.log(nMove.promotionPiece);
              nMove.setPromotion(piece);
              console.log(nMove.promotionPiece);
              console.log(nMove);
              onPossibleSquareClick(nMove);
            };
          } else {
            onClickFunction = () => {
              onPossibleSquareClick(move);
            };
          }
          break;
        }
      }

      const color =
        (i + j) % 2 == 0 ? ENUM.CHESS_COLOR.WHITE : ENUM.CHESS_COLOR.BLACK;
      squares[i][j] = (
        <Square
          colorOnMove={colorOnMove}
          isPromotion={isPromotion}
          onSquareClick={onClickFunction}
          // manageMove={ ()=>{manageMove(new Cords(i,j)) } }
          color={color}
          isPossibleSquare={isPossibleSquare}
          piece={position[i][j]}
        />
      );
    }
  }

  return (
    <div className="gameView">
      <div className="player">Player 1 +0</div>
      <div className="board tile">{squares}</div>
      <div className="player">Player 2 +0</div>
    </div>
  );
}
