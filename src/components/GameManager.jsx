import React, { useState } from "react";
import { useEffect } from "react";
import { Castles, Cords, FenObject, Move, Piece } from "../other/classes";
import ENUM from "../other/enum";
import PIECE_MOVES from "../other/pieceMoves";
import Board from "./Board";
import SidePanel from "./SidePanel";

import "../style/game_manager.css";

export default function GameManager() {
  // const [gameHistory, setGameHistory] = useState(["rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1","rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1","rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2","rnbqkbnr/pppp1ppp/8/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2","r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3"]);
  const [gameHistory, setGameHistory] = useState([
    "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
  ]);
  const [movesList, setMovesList] = useState("");
  // const [gameHistory, setGameHistory] = useState([
  //   "rnbqkbnr/pppppppp/8/1NNN4/1N1NNNN1/1NNNNNN1/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
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
    setActivePiece(null);
    setActivePiecePosition(null);
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

  function PGN2Array(pgn) {
    let str = pgn.split(" ");
    let moveList = [[]];
    let moveIndex = 0;
    for (let i = 0; i < str.length; i++) {
      if (i % 3 == 0) {
        if (i > 0) {
          moveIndex++;
          moveList.push([]);
        }
        // moveList.push([]);
      } else {
        // moveList[moveIndex].push(str[i]);
        moveList[moveIndex].push(str[i]);
      }
    }
    return moveList;
  }

  function getMoveNotation(move) {
    if (move.castle) {
      if (
        move.castleObj.fromRook.equals(new Cords(0, 0)) ||
        move.castleObj.fromRook.equals(new Cords(7, 0))
      ) {
        // O-O-O
        return "O-O-O";
      } else {
        // O-O
        return "O-O";
      }
    } else {
      if (move.TOP) {
        if (
          move.piece.type == ENUM.PIECE_TYPE.PAWN &&
          move.from.col != move.to.col
        ) {
          // PAWN
          if (move.promotion) {
            // gxh8=Q
            return (
              String.fromCharCode(move.from.col + 97) +
              "x" +
              cordsToNotation(move.to) +
              "=" +
              move.promotionPiece.symbol.toUpperCase()
            );
          } else {
            // dxe4
            return (
              String.fromCharCode(move.from.col + 97) +
              "x" +
              cordsToNotation(move.to)
            );
          }
        } else if (move.piece.type != ENUM.PIECE_TYPE.PAWN) {
          //FIGURE
          // Qxb2
          return (
            move.piece.symbol.toUpperCase() + "x" + cordsToNotation(move.to)
          );
        }
        // PAWN
        // e4
        return cordsToNotation(move.to);
      } else {
        //Nc3
        return move.piece.symbol.toUpperCase() + cordsToNotation(move.to);
      }
    }
  }

  function getCastlesFromFen() {
    return gameHistory[currentMoveNr].split(" ")[2];
  }

  function getEnPassantFromFen() {
    return gameHistory[currentMoveNr].split(" ")[3];
  }

  function notationToCords(squareNot) {
    let colNot = squareNot.charCodeAt(0) - 97;
    let row = 8 - parseInt(squareNot[1]);
    return new Cords(row, colNot);
  }
  function cordsToNotation(cords) {
    let row, col;
    row = 8 - cords.row;
    col = String.fromCharCode(cords.col + 97);
    return col + row;
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
        return { status: ENUM.GAME_STATUS.WIN, color: attackingColor };
      } else {
        //pat
        return { status: ENUM.GAME_STATUS.PAT, color: attackingColor };
      }

      return null;
    }
  }

  //moves
  function makeMoveOnBoard(move) {
    // add new FEN to gameHistory
    // new FenObject();
    let piece = position[move.from.row][move.from.col];
    let oldFen = new FenObject(gameHistory[currentMoveNr]);
    let castleFen = oldFen.castles;
    if (piece.type == ENUM.PIECE_TYPE.KING) {
      let cObj = new Castles(castleFen);
      if (piece.color == ENUM.CHESS_COLOR.WHITE) {
        cObj.whiteKing = false;
        cObj.whiteQueen = false;
        castleFen = cObj.getFen();
      } else {
        cObj.blackKing = false;
        cObj.blackQueen = false;
        castleFen = cObj.getFen();
      }
    } else if (piece.type == ENUM.PIECE_TYPE.ROOK) {
      let cObj = new Castles(castleFen);
      if (move.from.equals(new Cords(0, 0))) {
        cObj.blackQueen = false;
      } else if (move.from.equals(new Cords(0, 7))) {
        cObj.blackKing = false;
      } else if (move.from.equals(new Cords(7, 0))) {
        cObj.whiteQueen = false;
      } else if (move.from.equals(new Cords(7, 7))) {
        cObj.whiteKing = false;
      }
      castleFen = cObj.getFen();
    }

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

    let epFen = "-";
    if (move.enPassant) {
      epFen = cordsToNotation(move.enPassantCords);
    }

    let newGameHistory = gameHistory;

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

    let TOP = gameHistory[currentMoveNr].split(" ")[4];
    if (move.TOP) {
      TOP = 0;
    } else {
      TOP++;
    }

    newGameHistory.push(
      genFEN(
        newPositon,
        activePiece.getEnemyColor(),
        castleFen,
        epFen,
        TOP,
        Math.floor(currentMoveNr / 2) + 1
      )
    );

    setMovesList((prev) => {
      if (prev.trim() === "") {
        return "1. " + getMoveNotation(move);
      } else {
        let prevSplited = prev.split(" ");
        if (prevSplited.length >= 3) {
          if (
            prevSplited[prevSplited.length - 3].charAt(
              prevSplited[prevSplited.length - 3].length - 1
            ) == "."
          ) {
            return (
              prev +
              " " +
              (parseInt(prevSplited[prevSplited.length - 3]) + 1) +
              ". " +
              getMoveNotation(move)
            );
          }
        }
        return prev + " " + getMoveNotation(move);
      }
    });
    setGameHistory(newGameHistory);
    resetPossibleMoves();
    setActivePiece(null);
    setActivePiecePosition(null);
    setColorOnMove(() =>
      colorOnMove == ENUM.CHESS_COLOR.WHITE
        ? ENUM.CHESS_COLOR.BLACK
        : ENUM.CHESS_COLOR.WHITE
    );
    setCurrentMoveNr(currentMoveNr + 1);
  }

  function getPossibleMoves(piece, cords, castles = "-", enPassant = "-") {
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
            tryMoves.push(
              new Move(cords, move, false, false, false, true, piece)
            );
            // pawnMoves.push(move);
          }
        }

        let colorDir = piece.color == ENUM.CHESS_COLOR.WHITE ? -1 : 1;
        let colorFirst = piece.color == ENUM.CHESS_COLOR.WHITE ? 6 : 1;

        // +1 +2 (forward) moves
        let oneMove = cords.add(new Cords(1 * colorDir, 0));
        if (!(position[oneMove.row][oneMove.col] instanceof Piece)) {
          tryMoves.push(
            new Move(cords, oneMove, false, false, false, true, piece)
          );
          if (cords.row == colorFirst) {
            let dMove = cords.add(new Cords(2 * colorDir, 0));
            if (!(position[dMove.row][dMove.col] instanceof Piece)) {
              let epMove = new Move(
                cords,
                dMove,
                true,
                false,
                false,
                true,
                piece
              );
              epMove.setEnPassant(oneMove);
              tryMoves.push(epMove);
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
        if (enPassant != "-") {
          for (let move of trySquares) {
            if (move.equals(notationToCords(enPassant))) {
              tryMoves.push(
                new Move(
                  cords,
                  notationToCords(enPassant),
                  false,
                  false,
                  false,
                  true,
                  piece
                )
              );
            }
          }
        }
      } else if (piece.type == ENUM.PIECE_TYPE.KING) {
        for (let sq of trySquares) {
          tryMoves.push(new Move(cords, sq, false, false, false, false, piece));
        }

        // castles
        if (!isCheck(position, piece.getEnemyColor())) {
          let castleObj = new Castles(castles);
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
                      false,
                      piece
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
            // QUEENS SIDE
            const oneS = cords.add(new Cords(0, -1));
            const twoS = cords.add(new Cords(0, -2));
            if (areCordsOnBoard(oneS) && areCordsOnBoard(twoS)) {
              if (
                squaresUnderAttack[oneS.row][oneS.col] == false &&
                !(position[oneS.row][oneS.col] instanceof Piece) &&
                squaresUnderAttack[twoS.row][twoS.col] == false
              ) {
                let anotherS = cords.add(new Cords(0, -2));
                while (areCordsOnBoard(anotherS)) {
                  if (
                    !(position[anotherS.row][anotherS.col] instanceof Piece)
                  ) {
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
                      false,
                      piece
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
          tryMoves.push(new Move(cords, sq, false, false, false, false, piece));
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
                  true,
                  piece
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

  useEffect(() => {
    setPosition(new FenObject(gameHistory[currentMoveNr]).positionArr);
  }, [currentMoveNr]);

  // NEW FUNCTIONS FOR REWRITE
  function onPieceClick(piece, cords) {
    if (currentMoveNr == gameHistory.length - 1) {
      setActivePiece(piece);
      // setActivePiece(position[cords.row][cords.col]);
      const possMoves = getPossibleMoves(
        piece,
        cords,
        getCastlesFromFen(),
        getEnPassantFromFen()
      );
      if (possMoves.length > 0) {
        setActivePiecePosition(cords);
      } else {
        setActivePiecePosition(null);
      }
      setPossibleMoves(possMoves);
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
    <div className="game_manager">
      <Board
        gameEnd={isGameEnd(position)}
        colorOnMove={colorOnMove}
        onPieceClick={onPieceClick}
        onPossibleSquareClick={onPossibleSquareClick}
        onEmptySquareClick={onEmptySquareClick}
        possibleMoves={possibleMoves}
        activePiecePosition={activePiecePosition}
        // manageMove={manageMove}
        position={new FenObject(gameHistory[currentMoveNr]).positionArr}
      />
      <SidePanel
        currentMoveNr={currentMoveNr}
        movesList={PGN2Array(movesList)}
        goToStart={goToStart}
        goOneBack={goOneBack}
        goOneForward={goOneForward}
        goToEnd={goToEnd}
        setMoveNr={setCurrentMoveNr}
      />
    </div>
  );
}
