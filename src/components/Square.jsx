import React, { Component } from 'react'
import ENUMS from '../others/enums';
import './../css/square.css'
import Piece from './Piece';

export class Square extends Component {
    constructor(props){
        super(props);
        this.state = {
            pieceSymbol: this.props.pieceSymbol,
            isPossibleMoveSquare : this.props.isPossibleMoveSquare,
        }

        this.generatePieceIfExist = this.generatePieceIfExist.bind(this);
    }

    generatePieceIfExist(pieceSymbol){
        if(pieceSymbol != null){
            return <Piece pieceSymbol={pieceSymbol}></Piece>
        }
    }

    render() {
        let className = 'square';
        className += this.props.color == ENUMS.CHESS_COLOR.BLACK ? " square--black" : " square--white";
        
        if(this.props.isPossibleMoveSquare){
            className += " square--possible";
        }

        return (
            <div className={className} onClick={this.props.checkMove}>
                {this.generatePieceIfExist(this.props.pieceSymbol)}
            </div>
        )
    }
}

export default Square
