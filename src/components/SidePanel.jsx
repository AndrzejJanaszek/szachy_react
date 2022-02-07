import React, { useState } from "react";
import "../style/side_panel.css";
import FirstPage from "@mui/icons-material/FirstPage";
import NavigateBefore from "@mui/icons-material/NavigateBefore";
import NavigateNext from "@mui/icons-material/NavigateNext";
import LastPage from "@mui/icons-material/LastPage";
import Settings from "@mui/icons-material/Settings";
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
  function generateMoves() {
    if (movesList.length > 0 && movesList[0].length > 0) {
      let elements = [];

      let index = 1;
      let cmNr = 0;
      for (let move of movesList) {
        elements.push(
          <li>
            {<div>{index + "."}</div>}
            {(() => {
              let zmm = [];
              for (let element of move) {
                const locNr = cmNr;
                let classNameCurrenMove = "";
                if (cmNr == currentMoveNr - 1) {
                  classNameCurrenMove = " currentMove ";
                }
                zmm.push(
                  <div
                    className={"game_history__move" + classNameCurrenMove}
                    onClick={() => {
                      setMoveNr(locNr + 1);
                    }}
                  >
                    {element}
                  </div>
                );
                cmNr++;
              }
              return zmm;
            })()}
          </li>
        );

        index++;
      }
      return elements;
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

        {/*TODO:
         <button className="manager_btn" onClick={openSettings}>
          <Settings></Settings>
        </button> */}
      </div>
    </div>
  );
}
