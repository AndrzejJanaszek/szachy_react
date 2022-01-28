import React, { useState } from "react";
import "../style/side_panel.css";
import FirstPage from "@mui/icons-material/FirstPage";
import NavigateBefore from "@mui/icons-material/NavigateBefore";
import NavigateNext from "@mui/icons-material/NavigateNext";
import LastPage from "@mui/icons-material/LastPage";
/* import {
  FirstPage,
  NavigateBefore,
  NavigateNext,
  LastPage,
} from "@mui/icons-material"; */

export default function SidePanel({
  goToStart,
  goOneBack,
  goOneForward,
  goToEnd,
  movesList,
  currentMoveNr,
  setMoveNr,
}) {
  /* const [moves, setMoves] = useState([]);

  function generateMovesHistoryArray() {
    for(let turn of movesList){

    }
  } */

  function generateMoves() {
    if (movesList.length > 0) {
      let elements = [];
      const moves = movesList.split(" ");
      for (let i = 0; i < moves.length; i++) {
        let markClass = "";
        if (currentMoveNr - 1 == i) {
          markClass = "currentMove";
        }
        elements.push(
          <li
            className={markClass}
            onClick={() => {
              setMoveNr(i + 1);
            }}
          >
            {Math.floor(i / 2) + 1 + ". " + moves[i] + " "}
          </li>
        );
      }
      return elements;
      /* let moves = [];

      const movesArr = movesList.split(" ");
      for (let i = 0; i < movesArr.length; i++) {
        moves[Math.floor(i / 2)] = [];
        moves[Math.floor(i / 2)].push(movesArr[i]);
      }

      let elements;
      for (let i = 0; i < moves.length; i++) {
        elements += <div>{parseInt(i + 1) + moves[i].join(" ")}</div>;
      }
      return elements; */
    }
  }

  return (
    <div className="side_panel tile">
      <div className="game_history">
        <ul>{generateMoves()}</ul>
      </div>
      <div className="manager">
        <button className="manager_btn" onClick={goToStart}>
          <FirstPage></FirstPage>
        </button>
        <button className="manager_btn" onClick={goOneBack}>
          <NavigateBefore></NavigateBefore>
        </button>
        <button className="manager_btn" onClick={goOneForward}>
          <NavigateNext></NavigateNext>
        </button>
        <button className="manager_btn" onClick={goToEnd}>
          <LastPage></LastPage>
        </button>
      </div>
    </div>
  );
}
