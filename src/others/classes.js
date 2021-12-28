import ENUMS from "./enums";

export class Cords{
    constructor(row, col){
        this.row = row;
        this.col = col;
        this.add = (cords)=>{
            return new Cords(this.row + cords.row,this.col + cords.col);
        }
        this.equals = (cords)=>{
            if(cords.row == this.row && cords.col == this.col){
                return true;
            }
            return false;
        }
    }
}

export class Piece{
    constructor(){
        this.type;
        this.color;
        this.symbol;
        this.setType = (type)=>{
            this.type = type;
        }
        this.setColor = (color)=>{
            this.color = color;
        }
        this.setSymbol = (symbol)=>{
            this.symbol = symbol;
        }
        this.initBySymbol = (symbol)=>{
            this.color = symbol == symbol.toLowerCase() ? ENUMS.CHESS_COLOR.BLACK : ENUMS.CHESS_COLOR.BLACK;
            switch(symbol.toLowerCase()){
                case 'p':
                    this.type = ENUMS.PIECE_TYPE.PAWN;
                    break;
                case 'r':
                    this.type = ENUMS.PIECE_TYPE.ROOK;
                    break;
                case 'n':
                    this.type = ENUMS.PIECE_TYPE.KNIGHT;
                    break;
                case 'b':
                    this.type = ENUMS.PIECE_TYPE.BISHOP;
                    break;
                case 'q':
                    this.type = ENUMS.PIECE_TYPE.QUEEN;
                    break;
                case 'k':
                    this.type = ENUMS.PIECE_TYPE.KING;
                    break;
            }
        }
        this.iniyByValues = (type, color)=>{
            this.type = type;
            this.color = color;
            switch(type){
                case ENUMS.PIECE_TYPE.PAWN:
                    this.symbol = 'p';
                    break;
                case ENUMS.PIECE_TYPE.ROOK:
                    this.symbol = 'r';
                    break;
                case ENUMS.PIECE_TYPE.KNIGHT:
                    this.symbol = 'n';
                    break;
                case ENUMS.PIECE_TYPE.BISHOP:
                    this.symbol = 'b';
                    break;
                case ENUMS.PIECE_TYPE.QUEEN:
                    this.symbol = 'q';
                    break;
                case ENUMS.PIECE_TYPE.KING:
                    this.symbol = 'k';
                    break;
            }
            if(this.color == ENUMS.CHESS_COLOR.WHITE){
                this.symbol.toUpperCase();
            }
        }
    }
}