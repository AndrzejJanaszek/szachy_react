import React, { Component } from 'react'
import './../css/piece.css'
import ENUMS from '../others/enums';

export class Piece extends Component {
    constructor(props){
        super(props);
        this.state = {
            // pieceSymbol: this.props.pieceSymbol,
        }
        
        this.generatePieceClass = this.generatePieceClass.bind(this);
        // this.followCursor = this.followCursor.bind(this);
    }

    generatePieceClass(pieceSymbol) {
        // is lowercase
        let color = null;
        let pieceType = null;

        if(pieceSymbol.toLowerCase() == pieceSymbol){
            // black - dark
            color = ENUMS.CHESS_COLOR.BLACK;
        }
        else{
            // white - light
            color = ENUMS.CHESS_COLOR.WHITE;
        }

        switch (pieceSymbol.toLowerCase()) {
            case 'p':
                pieceType = ENUMS.PIECE_TYPE.PAWN;
                break;
            case 'r':
                pieceType = ENUMS.PIECE_TYPE.ROOK;
                break;
            case 'n':
                pieceType = ENUMS.PIECE_TYPE.KNIGHT;
                break;
            case 'b':
                pieceType = ENUMS.PIECE_TYPE.BISHOP;
                break;
            case 'q':
                pieceType = ENUMS.PIECE_TYPE.QUEEN;
                break;
            case 'k':
                pieceType = ENUMS.PIECE_TYPE.KING;
                break;
            default:
                break;
        }

        return "piece piece--"+pieceType+" piece--"+color;
    }

    render() {
        // let className = "piece " + "piece--"+this.props.type + " piece--"+this.props.color;
        let className = this.generatePieceClass(this.props.pieceSymbol);
        // pawn, rook, bishop, knight, queen, king
        return (
            <div className={className}>
            </div>
        )
    }
}

export default Piece
