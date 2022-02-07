import React from "react";
import ENUM from "../other/enum";
import Square from "./Square";
import "../style/board.css";
import { Cords, Piece } from "../other/classes";
import Autorenew from "@mui/icons-material/Autorenew";
import { useState } from "react";
import { Preview } from "@mui/icons-material";

export default function Board({
  position,
  possibleMoves,
  onPieceClick,
  onPossibleSquareClick,
  onEmptySquareClick,
  colorOnMove,
  activePiecePosition,
  gameEnd,
}) {
  const [rotation, setRotation] = useState(false);

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
              nMove.setPromotion(piece);
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
      const isActive =
        activePiecePosition instanceof Cords &&
        activePiecePosition.equals(new Cords(i, j))
          ? true
          : false;
      squares[i][j] = (
        <Square
          isActive={isActive}
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

  function getPlayersMaterial() {
    let wm = 0,
      bm = 0;
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        let piece = position[row][col];
        if (piece instanceof Piece) {
          let pieceMat = 0;
          if (piece.type == ENUM.PIECE_TYPE.PAWN) pieceMat += 1;
          if (piece.type == ENUM.PIECE_TYPE.ROOK) pieceMat += 5;
          if (
            piece.type == ENUM.PIECE_TYPE.KNIGHT ||
            piece.type == ENUM.PIECE_TYPE.BISHOP
          )
            pieceMat += 3;
          if (piece.type == ENUM.PIECE_TYPE.QUEEN) pieceMat += 9;

          if (piece.color == ENUM.CHESS_COLOR.WHITE) {
            wm += pieceMat;
          } else {
            bm += pieceMat;
          }
        }
      }
    }

    return { white: wm, black: bm, dif: wm - bm };
  }

  let wm, bm;
  if (getPlayersMaterial().dif > 0) {
    wm = "+" + Math.abs(getPlayersMaterial().dif);
  } else if (getPlayersMaterial().dif < 0) {
    bm = "+" + Math.abs(getPlayersMaterial().dif);
  }

  let rotationClass = "";
  if (rotation) {
    rotationClass = " board--rotate ";
  }

  function genEndGame() {
    if (gameEnd) {
      if (gameEnd.status == ENUM.GAME_STATUS.WIN) {
        let color =
          gameEnd.color == ENUM.CHESS_COLOR.WHITE ? " biały" : " czarny";
        return (
          <div className="gameEndBox">
            <h1>Wygrał kolor {color}</h1>
          </div>
        );
      } else if (gameEnd.status == ENUM.GAME_STATUS.PAT) {
        <div className="gameEndBox">
          <h1>Gra zakończyła się patem</h1>
        </div>;
      }
    }
  }

  const player1 = (
    <>
      <span>Player 1</span> <span>{wm}</span>
    </>
  );
  const player2 = (
    <>
      <span>Player 2</span> <span>{bm}</span>
    </>
  );

  function genPlayer(isWhitePlayer = false) {
    if (rotation) {
      isWhitePlayer = !isWhitePlayer;
    }
    if (isWhitePlayer) {
      return player1;
    } else {
      return player2;
    }
  }

  return (
    <div className="gameView">
      <div className="player">{genPlayer(false)}</div>
      <div className={"board tile" + rotationClass}>{squares}</div>
      <div className="player">{genPlayer(true)}</div>
      <button
        className="manager_btn"
        onClick={() => {
          setRotation((prev) => {
            return !prev;
          });
        }}
      >
        <Autorenew></Autorenew>
      </button>
      {genEndGame()}
    </div>
  );
}
