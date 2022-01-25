import React from 'react';
import { Piece } from '../other/classes';
import ENUM from '../other/enum';
import '../style/promotion.css'

export default function PromotionBox({pieceColor, onSquareClick}) {
  return (
      <ul className='promotionList'>
          <li className='promotionList__element' onClick={()=>{
              let p = new Piece()
              p.initByValues(ENUM.PIECE_TYPE.QUEEN, pieceColor);
              onSquareClick(p);
          }}
          ><div className={"piece piece--"+pieceColor+" piece--"+ENUM.PIECE_TYPE.QUEEN}></div></li>

          <li className='promotionList__element' onClick={()=>{
              let p = new Piece()
              p.initByValues(ENUM.PIECE_TYPE.ROOK, pieceColor);
              onSquareClick(p);
          }}
          ><div className={"piece piece--"+pieceColor+" piece--"+ENUM.PIECE_TYPE.ROOK}></div></li>

          <li className='promotionList__element' onClick={()=>{
              let p = new Piece()
              p.initByValues(ENUM.PIECE_TYPE.BISHOP, pieceColor);
              onSquareClick(p);
          }}
          ><div className={"piece piece--"+pieceColor+" piece--"+ENUM.PIECE_TYPE.BISHOP}></div></li>

          <li className='promotionList__element' onClick={()=>{
              let p = new Piece()
              p.initByValues(ENUM.PIECE_TYPE.KNIGHT, pieceColor);
              onSquareClick(p);
          }}
          ><div className={"piece piece--"+pieceColor+" piece--"+ENUM.PIECE_TYPE.KNIGHT}></div></li>

      </ul>);
}
