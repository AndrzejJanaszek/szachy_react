import React, { useState } from "react";
import { useEffect } from "react";
import { Castles, Cords, FenObject, Move, Piece } from "../other/classes";
import ENUM from "../other/enum";
import PIECE_MOVES from "../other/pieceMoves";
import Board from "./Board";

export default function GameManager() {
  // const [gameHistory, setGameHistory] = useState(["rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1","rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1","rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2","rnbqkbnr/pppp1ppp/8/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2","r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3"]);
  const [gameHistory, setGameHistory] = useState([
    "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
  ]);
  // const [gameHistory, setGameHistory] = useState([
  //   "r3k2r/pppbqppp/2nb1n2/3pp3/3PP3/2NB1N2/PPPBQPPP/R3K2R w KQkq - 4 10",
  // ]);
  const [currentMoveNr, setCurrentMoveNr] = useState(0);
  const [position, setPosition] = useState(
    new FenObject(gameHistory[currentMoveNr]).positionArr
  );
  const [possibleMoves, setPossibleMoves] = useState([]);
  const [activePiece, setActivePiece] = useState(null);
  const [activePiecePosition, setActivePiecePosition] = useState(null);
  const [colorOnMove, setColorOnMove] = useState(ENUM.CHESS_COLOR.WHITE);

  function resetPossibleMoves() {
    setPossibleMoves([]);
  }

  // UI functions
  function goToStart() {
    setCurrentMoveNr(0);
    resetPossibleMoves();
  }
  function goOneForward() {
    if (currentMoveNr + 1 < gameHistory.length) {
      setCurrentMoveNr(currentMoveNr + 1);
      resetPossibleMoves();
    }
  }
  function goOneBack() {
    if (currentMoveNr - 1 >= 0) {
      setCurrentMoveNr(currentMoveNr - 1);
      resetPossibleMoves();
    }
  }
  function goToEnd() {
    setCurrentMoveNr(gameHistory.length - 1);
    resetPossibleMoves();
  }

  // helper functions

  function getCastlesFromFen() {
    return gameHistory[currentMoveNr].split(" ")[2];
  }

  function clone2DArray(twoDimArr) {
    let newArr = [];
    for (let i = 0; i < twoDimArr.length; i++) {
      newArr[i] = [];
      for (let j = 0; j < twoDimArr[i].length; j++) {
        newArr[i][j] = twoDimArr[i][j];
      }
    }
    return newArr;
  }

  function areCordsOnBoard(cords) {
    if (cords.row < 0 || cords.row > 7 || cords.col < 0 || cords.col > 7) {
      return false;
    }
    return true;
  }

  function isCheck(positionArr, attackingColor) {
    let king = undefined;
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        if (
          positionArr[row][col] instanceof Piece &&
          positionArr[row][col].type == ENUM.PIECE_TYPE.KING &&
          positionArr[row][col].color != attackingColor
        ) {
          king = new Cords(row, col);
        }
      }
    }

    if (
      getAllSquaresUnderAttack(positionArr, attackingColor)[king.row][king.col]
    ) {
      return true;
    }

    return false;
  }

  function genFEN(posArr, color, castles, enPassant, TOP, moveNr) {
    // return FEN
    // posArr, newPositon
    // color, currentMovingColor
    // castles, castlesPossibleInNewFEN (new move)
    // enPassant, TOP, moveNr

    let strPos = "";
    let fenColor = "";
    let fenCastles = "";
    let fenEnPassant = "";
    let fenTOP = "";
    let fenMoveNr = "";

    for (let row = 0; row < 8; row++) {
      let emptySquares = 0;
      for (let col = 0; col < 8; col++) {
        if (posArr[row][col] instanceof Piece) {
          if (emptySquares > 0) {
            strPos += emptySquares;
            emptySquares = 0;
          }
          strPos += posArr[row][col].symbol;
        } else {
          emptySquares++;
        }

        if (col == 7 && emptySquares > 0) {
          strPos += emptySquares;
        }
      }
      if (row != 7) strPos += "/";
    }

    fenColor = color == ENUM.CHESS_COLOR.WHITE ? "w" : "b";
    fenCastles = castles;
    fenEnPassant = enPassant;
    fenTOP = TOP;
    fenMoveNr = color == ENUM.CHESS_COLOR.WHITE ? moveNr + 1 : moveNr;

    return (
      strPos +
      " " +
      fenColor +
      " " +
      fenCastles +
      " " +
      fenEnPassant +
      " " +
      fenTOP +
      " " +
      fenMoveNr
    );
  }

  function getAllSquaresUnderAttack(positionArr, attackingColor) {
    let finalArray = [
      [false, false, false, false, false, false, false, false],
      [false, false, false, false, false, false, false, false],
      [false, false, false, false, false, false, false, false],
      [false, false, false, false, false, false, false, false],
      [false, false, false, false, false, false, false, false],
      [false, false, false, false, false, false, false, false],
      [false, false, false, false, false, false, false, false],
      [false, false, false, false, false, false, false, false],
    ];
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        let checkingPiece = positionArr[row][col];
        if (
          checkingPiece instanceof Piece &&
          checkingPiece.color == attackingColor
        ) {
          for (let square of squaresUnderPieceAttack(
            checkingPiece,
            new Cords(row, col),
            positionArr
          )) {
            finalArray[square.row][square.col] = true;
          }
        }
      }
    }
    return finalArray;
  }

  function squaresUnderPieceAttack(piece, cords, possitionArr) {
    let finalSquares = [];
    switch (piece.type) {
      case ENUM.PIECE_TYPE.PAWN:
        {
          const colorDirectionY =
            piece.color == ENUM.CHESS_COLOR.WHITE ? -1 : 1;
          const attSquares = [
            new Cords(1 * colorDirectionY, -1),
            new Cords(1 * colorDirectionY, 1),
          ];

          for (let move of attSquares) {
            move = move.add(cords);
            if (areCordsOnBoard(move)) {
              finalSquares.push(move);
            }
          }
        }
        break;
      case ENUM.PIECE_TYPE.ROOK:
        for (let direction of PIECE_MOVES.ROOK) {
          for (let move of direction) {
            move = move.add(cords);
            if (areCordsOnBoard(move)) {
              finalSquares.push(move);

              if (possitionArr[move.row][move.col] instanceof Piece) {
                // break direction loop
                break;
              }
            } else {
              // break direction loop
              break;
            }
          }
        }
        break;
      case ENUM.PIECE_TYPE.KNIGHT:
        for (let move of PIECE_MOVES.KNIGHT) {
          move = move.add(cords);
          if (areCordsOnBoard(move)) {
            finalSquares.push(move);
          }
        }
        break;
      case ENUM.PIECE_TYPE.BISHOP:
        for (let direction of PIECE_MOVES.BISHOP) {
          for (let move of direction) {
            move = move.add(cords);
            if (areCordsOnBoard(move)) {
              finalSquares.push(move);

              if (possitionArr[move.row][move.col] instanceof Piece) {
                // break direction loop
                break;
              }
            } else {
              // break direction loop
              break;
            }
          }
        }
        break;
      case ENUM.PIECE_TYPE.QUEEN:
        for (let direction of PIECE_MOVES.QUEEN) {
          for (let move of direction) {
            move = move.add(cords);
            if (areCordsOnBoard(move)) {
              finalSquares.push(move);

              if (possitionArr[move.row][move.col] instanceof Piece) {
                // break direction loop
                break;
              }
            } else {
              // break direction loop
              break;
            }
          }
        }
        break;
      case ENUM.PIECE_TYPE.KING:
        for (let move of PIECE_MOVES.KING) {
          move = move.add(cords);
          if (areCordsOnBoard(move)) {
            finalSquares.push(move);
          }
        }
        break;
    }
    return finalSquares;
  }

  function getPositionAfterMove(curPos, move, moveingPieceCords) {
    // tymczasowo tylko przestawienie figury, move traktujemy jako cords
    let newPositon = clone2DArray(curPos);
    newPositon[move.to.row][move.to.col] =
      curPos[moveingPieceCords.row][moveingPieceCords.col];
    newPositon[moveingPieceCords.row][moveingPieceCords.col] = null;

    return newPositon;
  }

  function isGameEnd(positionArr) {
    let isMovePossible = false;
    loop: {
      for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
          if (positionArr[row][col] instanceof Piece) {
            let moves = getPossibleMoves(
              positionArr[row][col],
              new Cords(row, col)
            );
            if (moves.length > 0) {
              isMovePossible = true;
              break loop;
            }
          }
        }
      }
    }

    if (!isMovePossible) {
      let attackingColor =
        colorOnMove == ENUM.CHESS_COLOR.WHITE
          ? ENUM.CHESS_COLOR.BLACK
          : ENUM.CHESS_COLOR.WHITE;
      if (isCheck(positionArr, attackingColor)) {
        // mate
        console.log("KONIEC GRY: MAT");
        console.log("WYGRAŁY");
        console.log(attackingColor);
      } else {
        // pat
        console.log("KONIEC GRY: PAT");
      }
    }

    /* if(){
            // looking for mate
        }
        else{
            // looking for pat
        } */
  }

  //moves
  function makeMoveOnBoard(move) {
    // add new FEN to gameHistory
    // new FenObject();

    // move | castle | promotion | enpassant
    let newPositon = clone2DArray(position);
    if (move.promotion) {
      newPositon[move.to.row][move.to.col] = move.promotionPiece;
      newPositon[activePiecePosition.row][activePiecePosition.col] = null;
    } else if (move.castle) {
      // set nulls
      newPositon[move.castleObj.fromRook.row][move.castleObj.fromRook.col] =
        null;
      newPositon[move.castleObj.fromKing.row][move.castleObj.fromKing.col] =
        null;
      // move king
      newPositon[move.castleObj.toKing.row][move.castleObj.toKing.col] =
        position[move.castleObj.fromKing.row][move.castleObj.fromKing.col];
      // move rook
      newPositon[move.castleObj.toRook.row][move.castleObj.toRook.col] =
        position[move.castleObj.fromRook.row][move.castleObj.fromRook.col];
    } else {
      newPositon[move.to.row][move.to.col] = activePiece;
      newPositon[activePiecePosition.row][activePiecePosition.col] = null;
    }

    let newGameHistory = gameHistory;
    let oldFen = new FenObject(gameHistory[currentMoveNr]);
    let castleFen = oldFen.castles;
    if (move.castle) {
      let cObj = new Castles(castleFen);
      if (move.castleObj.color == ENUM.CHESS_COLOR.WHITE) {
        cObj.whiteKing = false;
        cObj.whiteQueen = false;
        castleFen = cObj.getFen();
      } else {
        cObj.blackKing = false;
        cObj.blackQueen = false;
        castleFen = cObj.getFen();
      }
    }

    newGameHistory.push(
      genFEN(
        newPositon,
        activePiece.getEnemyColor(),
        castleFen,
        "TODO",
        "TODO",
        currentMoveNr
      )
    );

    setGameHistory(newGameHistory);
    resetPossibleMoves();
    setActivePiece(null);
    setColorOnMove(() =>
      colorOnMove == ENUM.CHESS_COLOR.WHITE
        ? ENUM.CHESS_COLOR.BLACK
        : ENUM.CHESS_COLOR.WHITE
    );
    setCurrentMoveNr(currentMoveNr + 1);
  }

  function getPossibleMoves(piece, cords, castles = "-") {
    const finalMoves = [];
    let trySquares = squaresUnderPieceAttack(piece, cords, position);
    let tryMoves = []; //squaresUnderPieceAttack(piece, cords, position);

    // TODO srpawdzić czy działa jak się wywali sprawdzenie poniższego warunku : if (piece.color == colorOnMove) {
    if (piece.color == colorOnMove) {
      if (piece.type == ENUM.PIECE_TYPE.PAWN) {
        for (let move of trySquares) {
          if (
            position[move.row][move.col] instanceof Piece &&
            position[move.row][move.col].color != piece.color
          ) {
            // gucci
            tryMoves.push(new Move(cords, move, false, false, false, true));
            // pawnMoves.push(move);
          }
        }

        let colorDir = piece.color == ENUM.CHESS_COLOR.WHITE ? -1 : 1;
        let colorFirst = piece.color == ENUM.CHESS_COLOR.WHITE ? 6 : 1;

        // +1 +2 (forward) moves
        let oneMove = cords.add(new Cords(1 * colorDir, 0));
        if (!(position[oneMove.row][oneMove.col] instanceof Piece)) {
          tryMoves.push(new Move(cords, oneMove, false, false, false, true));
          if (cords.row == colorFirst) {
            let dMove = cords.add(new Cords(2 * colorDir, 0));
            if (!(position[dMove.row][dMove.col] instanceof Piece)) {
              tryMoves.push(new Move(cords, dMove, true, false, false, true));
            }
          }
        }

        // checking promotion
        let tmpMoves = [];
        for (let move of tryMoves) {
          if (
            (move.to.row == 0 && piece.color == ENUM.CHESS_COLOR.WHITE) ||
            (move.to.row == 7 && piece.color == ENUM.CHESS_COLOR.BLACK)
          ) {
            // promotion
            let tmp = move;
            move.promotion = true;
            tmpMoves.push(tmp);
          } else {
            tmpMoves.push(move);
          }
        }
        tryMoves = tmpMoves;
      } else if (piece.type == ENUM.PIECE_TYPE.KING) {
        for (let sq of trySquares) {
          tryMoves.push(new Move(cords, sq, false, false, false, false));
        }

        // castles
        if (!isCheck(position, piece.getEnemyColor())) {
          let castleObj = new Castles(castles);
          console.log(castleObj);
          const squaresUnderAttack = getAllSquaresUnderAttack(
            position,
            piece.getEnemyColor()
          );
          if (
            (piece.color == ENUM.CHESS_COLOR.WHITE && castleObj.whiteKing) ||
            (piece.color == ENUM.CHESS_COLOR.BLACK && castleObj.blackKing)
          ) {
            // KINGS SIDE
            const oneS = cords.add(new Cords(0, 1));
            const twoS = cords.add(new Cords(0, 2));
            if (areCordsOnBoard(oneS) && areCordsOnBoard(twoS)) {
              if (
                squaresUnderAttack[oneS.row][oneS.col] == false &&
                !(position[oneS.row][oneS.col] instanceof Piece) &&
                squaresUnderAttack[twoS.row][twoS.col] == false
              ) {
                let anotherS = cords.add(new Cords(0, 2));
                while (areCordsOnBoard(anotherS)) {
                  if (
                    !(position[anotherS.row][anotherS.col] instanceof Piece)
                  ) {
                    // next
                    anotherS = anotherS.add(new Cords(0, 1));
                  } else if (
                    position[anotherS.row][anotherS.col].type ==
                      ENUM.PIECE_TYPE.ROOK &&
                    position[anotherS.row][anotherS.col].color == piece.color
                  ) {
                    // castle poss
                    let castleMove = new Move(
                      cords,
                      twoS,
                      false,
                      true,
                      false,
                      false
                    );
                    castleMove.setCastle(
                      anotherS,
                      cords,
                      oneS,
                      twoS,
                      piece.color
                    );
                    tryMoves.push(castleMove);
                    break;
                  }
                }
              }
            }
            // KINGS SIDE END
          }

          if (
            (piece.color == ENUM.CHESS_COLOR.WHITE && castleObj.whiteQueen) ||
            (piece.color == ENUM.CHESS_COLOR.BLACK && castleObj.blackQueen)
          ) {
            console.log("1");
            // QUEENS SIDE
            const oneS = cords.add(new Cords(0, -1));
            const twoS = cords.add(new Cords(0, -2));
            if (areCordsOnBoard(oneS) && areCordsOnBoard(twoS)) {
              if (
                squaresUnderAttack[oneS.row][oneS.col] == false &&
                !(position[oneS.row][oneS.col] instanceof Piece) &&
                squaresUnderAttack[twoS.row][twoS.col] == false
              ) {
                console.log("2");
                let anotherS = cords.add(new Cords(0, -2));
                while (areCordsOnBoard(anotherS)) {
                  if (
                    !(position[anotherS.row][anotherS.col] instanceof Piece)
                  ) {
                    console.log("3");
                    // next
                    anotherS = anotherS.add(new Cords(0, -1));
                  } else if (
                    position[anotherS.row][anotherS.col].type ==
                      ENUM.PIECE_TYPE.ROOK &&
                    position[anotherS.row][anotherS.col].color == piece.color
                  ) {
                    // castle poss
                    let castleMove = new Move(
                      cords,
                      twoS,
                      false,
                      true,
                      false,
                      false
                    );
                    castleMove.setCastle(
                      anotherS,
                      cords,
                      oneS,
                      twoS,
                      piece.color
                    );
                    tryMoves.push(castleMove);
                    break;
                  } else {
                    break;
                  }
                }
              }
            }
            // QUEENS SIDE END
          }
        }
      } else {
        for (let sq of trySquares) {
          tryMoves.push(new Move(cords, sq, false, false, false, false));
        }
      }

      // move : Cords() _____ sqCords -> squareCords
      for (let move of tryMoves) {
        // ally?
        if (
          !(
            position[move.to.row][move.to.col] instanceof Piece &&
            position[move.to.row][move.to.col].color == piece.color
          )
        ) {
          // is not pinned
          if (
            !isCheck(
              getPositionAfterMove(position, move, cords),
              piece.getEnemyColor()
            )
          ) {
            // add move
            if (
              position[move.to.row][move.to.col] instanceof Piece &&
              position[move.to.row][move.to.col].color != piece.color
            ) {
              finalMoves.push(
                new Move(
                  cords,
                  move.to,
                  move.enPassant,
                  move.castle,
                  move.promotion,
                  true
                )
              );
            } else {
              finalMoves.push(move);
            }
          }
        }
      }
    }

    return finalMoves;
  }

  /* useEffect(() => {
    document.title = `Klknięto ${currentMoveNr} razy`;
  }, [currentMoveNr]); */
  /* useEffect(() => {
    console.log(gameHistory);
  }); */
  useEffect(() => {
    setPosition(new FenObject(gameHistory[currentMoveNr]).positionArr);
    /*  isGameEnd(position);
    console.log(position);
    console.log(gameHistory);
    console.log(currentMoveNr); */
  }, [currentMoveNr]);

  // NEW FUNCTIONS FOR REWRITE
  function onPieceClick(piece, cords) {
    if (currentMoveNr == gameHistory.length - 1) {
      setActivePiece(piece);
      // setActivePiece(position[cords.row][cords.col]);
      setActivePiecePosition(cords);
      setPossibleMoves(getPossibleMoves(piece, cords, getCastlesFromFen()));
    }
  }

  // TODO: W sumie nie potrzebne dodatkowe funkcje - można je wywalić i dać bezpośrednio "makeMoveOnBoard" i "resetPossibleMoves"
  function onPossibleSquareClick(move) {
    if (currentMoveNr == gameHistory.length - 1) {
      makeMoveOnBoard(move);
    }
  }

  function onEmptySquareClick() {
    resetPossibleMoves();
  }

  return (
    <div>
      {/* TODO: 
                do Board dajemy 2 metody: getMove() makeMoveOnBoard()
                + potrzebne state robimy i to powinno dać możliwość robienia ruchów
                uwaga: problem bedzie dotyczył dobrego napisania metody odpowiedzialnej za robienie ruchu - musi przekawyzać dane o en passant, roszadach itd.
            */}
      <Board
        colorOnMove={colorOnMove}
        onPieceClick={onPieceClick}
        onPossibleSquareClick={onPossibleSquareClick}
        onEmptySquareClick={onEmptySquareClick}
        possibleMoves={possibleMoves}
        // manageMove={manageMove}
        position={new FenObject(gameHistory[currentMoveNr]).positionArr}
      />

      <button onClick={goToStart}>{"<<<"}</button>
      <button onClick={goOneBack}>{"<"}</button>
      <button onClick={goOneForward}>{">"}</button>
      <button onClick={goToEnd}>{">>>"}</button>
    </div>
  );
}
