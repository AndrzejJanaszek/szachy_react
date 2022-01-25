import ENUM from "./enum";

export class Piece{
    constructor(){
        this.type = undefined;
        this.color = undefined;
        this.symbol = undefined;
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
            if(this.isPiceSymbol(symbol)){
                this.symbol = symbol;
                this.color = symbol == symbol.toLowerCase() ? ENUM.CHESS_COLOR.BLACK : ENUM.CHESS_COLOR.WHITE;
                switch(symbol.toLowerCase()){
                    case 'p':
                        this.type = ENUM.PIECE_TYPE.PAWN;
                        break;
                    case 'r':
                        this.type = ENUM.PIECE_TYPE.ROOK;
                        break;
                    case 'n':
                        this.type = ENUM.PIECE_TYPE.KNIGHT;
                        break;
                    case 'b':
                        this.type = ENUM.PIECE_TYPE.BISHOP;
                        break;
                    case 'q':
                        this.type = ENUM.PIECE_TYPE.QUEEN;
                        break;
                    case 'k':
                        this.type = ENUM.PIECE_TYPE.KING;
                        break;
                }
                return true;
            }
            else{
                return false;
            }
        }
        this.initByValues = (type, color)=>{
            this.type = type;
            this.color = color;
            switch(type){
                case ENUM.PIECE_TYPE.PAWN:
                    this.symbol = 'p';
                    break;
                case ENUM.PIECE_TYPE.ROOK:
                    this.symbol = 'r';
                    break;
                case ENUM.PIECE_TYPE.KNIGHT:
                    this.symbol = 'n';
                    break;
                case ENUM.PIECE_TYPE.BISHOP:
                    this.symbol = 'b';
                    break;
                case ENUM.PIECE_TYPE.QUEEN:
                    this.symbol = 'q';
                    break;
                case ENUM.PIECE_TYPE.KING:
                    this.symbol = 'k';
                    break;
            }
            if(this.color == ENUM.CHESS_COLOR.WHITE){
                this.symbol.toUpperCase();
            }
        }
        this.isPiceSymbol = symbol=>{
            const pSmbs = ['p','r','n','b','q','k'];
            try{
                if(pSmbs.includes( symbol.toLowerCase() )){
                    return true
                }
            }
            catch(error){
                console.log(error);
            }
            return false;
        }
        this.getEnemyColor = ()=>{
            return this.color == ENUM.CHESS_COLOR.WHITE ? ENUM.CHESS_COLOR.BLACK : ENUM.CHESS_COLOR.WHITE;
        }
    }
}

export class FenObject{
    constructor(fen){

        this.getPositionArrayFromFEN = (fen)=>{
            fen = fen.split(' ')[0];
            let rows = fen.split('/');
    
            let positionArray = [
                [null,null,null,null,null,null,null,null],
                [null,null,null,null,null,null,null,null],
                [null,null,null,null,null,null,null,null],
                [null,null,null,null,null,null,null,null],
                [null,null,null,null,null,null,null,null],
                [null,null,null,null,null,null,null,null],
                [null,null,null,null,null,null,null,null],
                [null,null,null,null,null,null,null,null],
            ];
    
            // row, col - indexs of 8x8 array; pointer real index of FEN'S STRING 
            for(let row = 0; row < 8; row++){
                let pointer = 0;
                for(let col = 0; col < 8; col++){
                    if(isNaN(rows[row][pointer])){
                        let piece = new Piece();
                        piece.initBySymbol(rows[row][pointer]);
    
                        positionArray[row][col] = piece;
                    }
                    else{
                        col+= parseInt(rows[row][pointer]-1);
                    }
                    pointer++;
                }
    
            }
    
            return positionArray;
        }

        const arrFen = fen.split(" ");
        this.positionArr = this.getPositionArrayFromFEN(fen);
        this.onMove = arrFen[1] = "w" ? ENUM.CHESS_COLOR.WHITE : ENUM.CHESS_COLOR.BLACK;
        this.castles = arrFen[2];
        this.enPassant = arrFen[3];
        this.TOP = parseInt(arrFen[4]);
        this.moveNr = parseInt(arrFen[5]);
    }
}

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

export class Move{
    // from, to : Cords()
    constructor(from ,to , enPassant, castle, promotion, TOP){
        this.from = from;
        this.to = to;
        this.enPassant = enPassant;
        this.castle = castle;
        this.promotion = promotion;
        this.TOP = TOP;
        this.promotionPiece = null;
        this.setPromotion = (piece)=>{
            this.promotionPiece = piece;
            this.promotion = true;
        }
    }
}