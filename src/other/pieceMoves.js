import { Cords } from "./classes";
const PIECE_MOVES = {
    ROOK: [
        [new Cords(1, 0),
        new Cords(2, 0),
        new Cords(3, 0),
        new Cords(4, 0),
        new Cords(5, 0),
        new Cords(6, 0),
        new Cords(7, 0)],
        [new Cords(0, 1),
        new Cords(0, 2),
        new Cords(0, 3),
        new Cords(0, 4),
        new Cords(0, 5),
        new Cords(0, 6),
        new Cords(0, 7)],
        [new Cords(-1, 0),
        new Cords(-2, 0),
        new Cords(-3, 0),
        new Cords(-4, 0),
        new Cords(-5, 0),
        new Cords(-6, 0),
        new Cords(-7, 0)],
        [new Cords(0, -1),
        new Cords(0, -2),
        new Cords(0, -3),
        new Cords(0, -4),
        new Cords(0, -5),
        new Cords(0, -6),
        new Cords(0, -7)],
    ],
    KNIGHT: [
        new Cords(2,1),
        new Cords(1,2),
        new Cords(-1,2),
        new Cords(-2,1),
        new Cords(-2,-1),
        new Cords(-1,-2),
        new Cords(1,-2),
        new Cords(2,-1),
        // {row: 2, col: 1},
        // {row: 1, col: 2},
        // {row: -1, col: 2},
        // {row: -2, col: 1},
        // {row: -2, col: -1},
        // {row: -1, col: -2},
        // {row: 1, col: -2},
        // {row: 2, col: -1}
    ],
    BISHOP: [
        [new Cords(1, 1),
        new Cords(2, 2),
        new Cords(3, 3),
        new Cords(4, 4),
        new Cords(5, 5),
        new Cords(6, 6),
        new Cords(7, 7)],
        [new Cords(-1, 1),
        new Cords(-2, 2),
        new Cords(-3, 3),
        new Cords(-4, 4),
        new Cords(-5, 5),
        new Cords(-6, 6),
        new Cords(-7, 7)],
        [new Cords(-1, -1),
        new Cords(-2, -2),
        new Cords(-3, -3),
        new Cords(-4, -4),
        new Cords(-5, -5),
        new Cords(-6, -6),
        new Cords(-7, -7)],
        [new Cords(1, -1),
        new Cords(2, -2),
        new Cords(3, -3),
        new Cords(4, -4),
        new Cords(5, -5),
        new Cords(6, -6),
        new Cords(7, -7)],
    ],
    QUEEN : [
        [new Cords(1, 0),
        new Cords(2, 0),
        new Cords(3, 0),
        new Cords(4, 0),
        new Cords(5, 0),
        new Cords(6, 0),
        new Cords(7, 0)],
        [new Cords(0, 1),
        new Cords(0, 2),
        new Cords(0, 3),
        new Cords(0, 4),
        new Cords(0, 5),
        new Cords(0, 6),
        new Cords(0, 7)],
        [new Cords(-1, 0),
        new Cords(-2, 0),
        new Cords(-3, 0),
        new Cords(-4, 0),
        new Cords(-5, 0),
        new Cords(-6, 0),
        new Cords(-7, 0)],
        [new Cords(0, -1),
        new Cords(0, -2),
        new Cords(0, -3),
        new Cords(0, -4),
        new Cords(0, -5),
        new Cords(0, -6),
        new Cords(0, -7)],

        [new Cords(1, 1),
        new Cords(2, 2),
        new Cords(3, 3),
        new Cords(4, 4),
        new Cords(5, 5),
        new Cords(6, 6),
        new Cords(7, 7)],
        [new Cords(-1, 1),
        new Cords(-2, 2),
        new Cords(-3, 3),
        new Cords(-4, 4),
        new Cords(-5, 5),
        new Cords(-6, 6),
        new Cords(-7, 7)],
        [new Cords(-1, -1),
        new Cords(-2, -2),
        new Cords(-3, -3),
        new Cords(-4, -4),
        new Cords(-5, -5),
        new Cords(-6, -6),
        new Cords(-7, -7)],
        [new Cords(1, -1),
        new Cords(2, -2),
        new Cords(3, -3),
        new Cords(4, -4),
        new Cords(5, -5),
        new Cords(6, -6),
        new Cords(7, -7)],
    ],
    KING: [
        new Cords(1,0),
        new Cords(1,1),
        new Cords(0,1),
        new Cords(-1,1),
        new Cords(-1,0),
        new Cords(-1,-1),
        new Cords(0,-1),
        new Cords(1,-1),
    ],
}

export default PIECE_MOVES;