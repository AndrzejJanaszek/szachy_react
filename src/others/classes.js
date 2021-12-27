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