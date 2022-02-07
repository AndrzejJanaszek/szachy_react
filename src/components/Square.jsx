import React, { useState } from "react";
import { Cords, Piece as PieceClass } from "./../other/classes";
import ENUM from "../other/enum";
import "../style/square.css";
import Piece from "./Piece";
import PromotionBox from "./PromotionBox";

export default function Square({
  color,
  piece,
  isPossibleSquare,
  onSquareClick,
  isPromotion,
  colorOnMove,
  isActive,
}) {
  const [promotionBox, setPromotionBox] = useState(null);

  const colorClass =
    color == ENUM.CHESS_COLOR.WHITE ? "square--white" : "square--black";
  let moveSquareClass = "";
  let activeSquareClass = isActive ? " square--active " : "";

  function genPieceIfExist() {
    if (piece instanceof PieceClass) {
      return <Piece piece={piece}></Piece>;
    }
  }

  let onClick = onSquareClick;
  if (isPossibleSquare == true) {
    if (piece instanceof PieceClass) {
      moveSquareClass = " square--possible_capture";
    } else {
      moveSquareClass = " square--possible";
    }

    if (isPromotion) {
      onClick = () => {
        setPromotionBox(
          <PromotionBox
            pieceColor={colorOnMove}
            onSquareClick={onSquareClick}
            onSquareClick={onSquareClick}
          />
        );
      };
    }
  } else {
    if (promotionBox != null) {
      setPromotionBox(null);
    }
  }

  return (
    <div
      className={"square " + colorClass + moveSquareClass + activeSquareClass}
      onClick={onClick}
    >
      {promotionBox}
      {genPieceIfExist()}
    </div>
  );
}
