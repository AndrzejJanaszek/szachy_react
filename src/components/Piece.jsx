import React, { Component } from 'react'
import './../css/piece.css'

export class Piece extends Component {
    constructor(props){
        super(props);
        this.state = {
            pieceSymbol: this.props.pieceSymbol,
        }
        
        this.generatePieceClass = this.generatePieceClass.bind(this);
    }

    generatePieceClass(pieceSymbol) {
        // is lowercase
        let color = null;
        let pieceType = null;

        if(pieceSymbol.toLowerCase() == pieceSymbol){
            // black - dark
            color = 'dark';
        }
        else{
            // white - light
            color = 'light';
        }

        switch (pieceSymbol.toLowerCase()) {
            case 'p':
                pieceType = 'pawn';
                break;
            case 'r':
                pieceType = 'rook';
                break;
            case 'n':
                pieceType = 'knight';
                break;
            case 'b':
                pieceType = 'bishop';
                break;
            case 'q':
                pieceType = 'queen';
                break;
            case 'k':
                pieceType = 'king';
                break;
            default:
                break;
        }

        return "piece piece--"+pieceType+" piece--"+color;
    }
    render() {
        // let className = "piece " + "piece--"+this.props.type + " piece--"+this.props.color;
        let className = this.generatePieceClass(this.state.pieceSymbol);
        // pawn, rook, bishop, knight, queen, king
        return (
            <div className={className}>
            </div>
        )
    }
}

export default Piece
