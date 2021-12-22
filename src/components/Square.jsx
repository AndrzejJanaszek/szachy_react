import React, { Component } from 'react'
import './../css/square.css'
import Piece from './Piece';

export class Square extends Component {
    constructor(props){
        super(props);
        this.state = {
            pieceSymbol: this.props.pieceSymbol,
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
        className += this.props.color == "dark" ? " square--dark" : " square--light";

        return (
            <div className={className}>
                {this.generatePieceIfExist(this.state.pieceSymbol)}
            </div>
        )
    }
}

export default Square
