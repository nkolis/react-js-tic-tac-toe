/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import OShape from "./components/OShape";
import XShape from "./components/XShape";
import MenuSound from "./assets/sounds/interface-click.wav";
import CharSound from "./assets/sounds/char-sound.mp3";

const menuClick = new Audio(MenuSound);
const charClick = new Audio(CharSound);
function Square({ onSquareClick, value }) {
  function handleClicked() {
    return onSquareClick();
  }

  return (
    <button className="square" onClick={handleClicked}>
      {value == "x" ? <XShape /> : ""}
      {value == "o" ? <OShape /> : ""}
    </button>
  );
}

function Board({
  playerIsNext,
  player1,
  player2,
  squares,
  onPlay,
  winner,
  winLineStyle,
  numPlayers,
}) {
  function handleClick(i) {
    if (squares[i] || winner.status || numPlayers == 2) return false;

    const nextSquares = squares.slice();

    if (numPlayers === 0 && playerIsNext) {
      nextSquares[i] = player1;
      onPlay(nextSquares);
    }

    if (numPlayers == 1) {
      nextSquares[i] = playerIsNext ? player1 : player2;
      onPlay(nextSquares);
    }
  }

  return (
    <>
      <div className={`board ${winLineStyle}`}>
        {squares.map((val, i) => (
          <Square key={i} onSquareClick={() => handleClick(i)} value={val} />
        ))}
      </div>
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  let player1 = "o";
  let player2 = "x";
  const [firstMove, setFirstMove] = useState(0);
  const player1IsNext = currentMove % 2 == firstMove;
  const currentSquares = history[currentMove];
  const [winLineStyle, setWinLineStyle] = useState("");
  const delay = 400;
  const [clicked, setClicked] = useState(false);
  const difficulty = ["easy", "medium", "impossible"];
  const [indexDifficulty, setIndexDifficulty] = useState(2);
  const [numPlayers, setnumPlayers] = useState(0);
  const numPlayersStr = ["1P", "2P", "2Bot"];
  const [status, setStatus] = useState("");
  const [visibilityState, setVisibilityState] = useState(true);
  const winner = calculateWinner(currentSquares);
  const [score, setScore] = useState({
    player1: 0,
    draw: 0,
    player2: 0,
  });
  const [sound, setSound] = useState("off");

  const oStyle = {
    width: 7,
    height: 7,
    padding: 3,
    animation: "unset",
    backgroundColor: "var(--shape-color-o)",
  };

  const xStyle = {
    width: 14,
    height: 3,
    animation: "unset",
  };

  const smallCharPlayer1 =
    player1 == "x" ? <XShape style={xStyle} /> : <OShape style={oStyle} />;
  const smallCharPlayer2 =
    player2 == "x" ? <XShape style={xStyle} /> : <OShape style={oStyle} />;

  function handlenumPlayers() {
    if (sound == "on") {
      menuClick.play().then(() => {});
    }
    restart();
    numPlayers > 1 ? setnumPlayers(0) : setnumPlayers((n) => n + 1);
  }

  function handlePlay(nextSquares) {
    setTimeout(() => {
      if (sound == "on") {
        charClick.play().then();
      }
      const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
      setHistory(nextHistory);
      setCurrentMove(nextHistory.length - 1);
    }, delay - delay - 100);
  }

  function clearAllTimer() {
    const highestTimeoutId = setTimeout(";");
    for (var i = 0; i < highestTimeoutId; i++) {
      clearTimeout(i);
    }
  }

  function refresh() {
    setTimeout(() => {
      clearAllTimer();
      setCurrentMove(0);
      setClicked(false);
    }, delay + 100);
  }

  function restart() {
    clearAllTimer();
    setClicked(false);
    setHistory([Array(9).fill(null)]);
    setCurrentMove(0);
    setFirstMove(0);
    setScore({
      player1: 0,
      draw: 0,
      player2: 0,
    });
  }

  function swapPlayer() {
    clearAllTimer();
    if (sound === "on") {
      menuClick.play().then(() => {});
      if (!clicked) {
        setFirstMove(firstMove === 0 ? 1 : 0);
        setClicked(true);
      }
      setClicked(false);
    }
  }

  function handleDifficulty() {
    if (sound == "on") {
      menuClick.play().then(() => {});
      indexDifficulty > 1
        ? setIndexDifficulty(0)
        : setIndexDifficulty((n) => n + 1);
    }
  }

  function toggleSound() {
    if (sound == "off") {
      menuClick.play().then(() => {});
    }
    sound == "on" ? setSound("off") : setSound("on");
  }

  function startBotPlay() {
    if (numPlayers == 1) return false;
    if (!player1IsNext && !winner.status) {
      setTimeout(() => {
        handlePlay(
          botPlay(currentSquares, player2, difficulty[indexDifficulty])
        );
      });
    }

    if (numPlayers == 2 && player1IsNext && !winner.status) {
      setTimeout(() => {
        handlePlay(
          botPlay(currentSquares, player1, difficulty[indexDifficulty])
        );
      });
    }

    setTimeout(() => {
      if (winner.status) {
        refresh();
      }
    });
  }

  useEffect(() => {
    document.addEventListener("visibilitychange", () => {
      setVisibilityState(document.visibilityState == "visible");
    });
    if (visibilityState) {
      clearAllTimer();
      startBotPlay();
      setStatus(
        <>
          {player1IsNext ? smallCharPlayer1 : smallCharPlayer2}
          <span style={{ position: "relative", left: 4 }}>Turn</span>
        </>
      );
      if (winner.status && winner.message != "draw") {
        const line = winner.line.line[0];
        setWinLineStyle(
          `win-line-${currentSquares[line]}-${winner.line.position}`
        );
        setStatus(
          <>
            <span style={{ position: "relative", right: 4 }}>Winner</span>
            {winner.message == "x" ? (
              <XShape style={xStyle} />
            ) : (
              <OShape style={oStyle} />
            )}
          </>
        );
        winner.message == player1
          ? setScore({ ...score, player1: score.player1 + 1 })
          : setScore({ ...score, player2: score.player2 + 1 });
      } else {
        setWinLineStyle("");
      }
      if (winner.status && winner.message == "draw") {
        setStatus("Draw");
        const newScore = score.draw + 1;
        setScore({ ...score, draw: newScore });
      }
    }

    return () => {};
  }, [currentMove, firstMove, numPlayers, visibilityState]);

  return (
    <>
      <button className="game-sound" onClick={toggleSound}>
        {sound == "off" ? (
          <svg
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
            height="1em"
            viewBox="0 0 576 512"
          >
            <path d="M301.1 34.8C312.6 40 320 51.4 320 64V448c0 12.6-7.4 24-18.9 29.2s-25 3.1-34.4-5.3L131.8 352H64c-35.3 0-64-28.7-64-64V224c0-35.3 28.7-64 64-64h67.8L266.7 40.1c9.4-8.4 22.9-10.4 34.4-5.3zM425 167l55 55 55-55c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-55 55 55 55c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-55-55-55 55c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l55-55-55-55c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0z" />
          </svg>
        ) : (
          <svg
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
            height="1em"
            viewBox="0 0 448 512"
          >
            <path d="M301.1 34.8C312.6 40 320 51.4 320 64V448c0 12.6-7.4 24-18.9 29.2s-25 3.1-34.4-5.3L131.8 352H64c-35.3 0-64-28.7-64-64V224c0-35.3 28.7-64 64-64h67.8L266.7 40.1c9.4-8.4 22.9-10.4 34.4-5.3zM412.6 181.5C434.1 199.1 448 225.9 448 256s-13.9 56.9-35.4 74.5c-10.3 8.4-25.4 6.8-33.8-3.5s-6.8-25.4 3.5-33.8C393.1 284.4 400 271 400 256s-6.9-28.4-17.7-37.3c-10.3-8.4-11.8-23.5-3.5-33.8s23.5-11.8 33.8-3.5z" />
          </svg>
        )}
      </button>
      <div className="header">
        <h1 className="game-title">Tic Tac Toe</h1>
        <h4 className="game-status">{status}</h4>
      </div>
      <div className="game">
        <div
          className="game-board"
          onClick={winner.status && currentMove > 0 ? refresh : () => false}
        >
          <Board
            playerIsNext={player1IsNext}
            player1={player1}
            player2={player2}
            squares={currentSquares}
            onPlay={handlePlay}
            winner={winner}
            winLineStyle={winLineStyle}
            numPlayers={numPlayers}
          />
        </div>

        <div className="game-info">
          <div className="game-score">
            <div
              className="difficult"
              style={{ order: 1 }}
              onClick={handleDifficulty}
            >
              <svg
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
                height="1em"
                viewBox="0 0 320 512"
              >
                <path d="M137.4 374.6c12.5 12.5 32.8 12.5 45.3 0l128-128c9.2-9.2 11.9-22.9 6.9-34.9s-16.6-19.8-29.6-19.8L32 192c-12.9 0-24.6 7.8-29.6 19.8s-2.2 25.7 6.9 34.9l128 128z" />
              </svg>
              {numPlayers != 1 && <span>{difficulty[indexDifficulty]}</span>}
            </div>
            <div
              className="score-info"
              style={{ order: firstMove == 0 ? 2 : 4 }}
            >
              <div className="name">
                {numPlayers == 2 ? <BotIcon /> : <UserIcon />}(
                {player1 == "o" ? (
                  <OShape style={oStyle} />
                ) : (
                  <XShape style={xStyle} />
                )}
                )
              </div>
              <p className="score">{score.player1}</p>
            </div>
            <div className="score-info" style={{ order: 3 }}>
              {history.length == 1 ? (
                <button
                  className="swap-player"
                  onClick={swapPlayer}
                  disabled={clicked}
                >
                  <svg
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                    height="1em"
                    viewBox="0 0 512 512"
                  >
                    <path d="M32 96l320 0V32c0-12.9 7.8-24.6 19.8-29.6s25.7-2.2 34.9 6.9l96 96c6 6 9.4 14.1 9.4 22.6s-3.4 16.6-9.4 22.6l-96 96c-9.2 9.2-22.9 11.9-34.9 6.9s-19.8-16.6-19.8-29.6V160L32 160c-17.7 0-32-14.3-32-32s14.3-32 32-32zM480 352c17.7 0 32 14.3 32 32s-14.3 32-32 32H160v64c0 12.9-7.8 24.6-19.8 29.6s-25.7 2.2-34.9-6.9l-96-96c-6-6-9.4-14.1-9.4-22.6s3.4-16.6 9.4-22.6l96-96c9.2-9.2 22.9-11.9 34.9-6.9s19.8 16.6 19.8 29.6l0 64H480z" />
                  </svg>
                </button>
              ) : (
                <>
                  <p className="name">Draw</p>
                  <p className="score">{score.draw}</p>
                </>
              )}
            </div>
            <div
              className="score-info"
              style={{ order: firstMove == 1 ? 2 : 4 }}
            >
              <div className="name">
                {numPlayers != 1 ? <BotIcon /> : <UserIcon />}(
                {player2 == "o" ? (
                  <OShape style={oStyle} />
                ) : (
                  <XShape style={xStyle} />
                )}
                )
              </div>
              <p className="score">{score.player2}</p>
            </div>
            <div
              style={{ order: 5 }}
              className="player"
              onClick={handlenumPlayers}
            >
              <svg
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
                height="1em"
                viewBox="0 0 320 512"
              >
                <path d="M137.4 374.6c12.5 12.5 32.8 12.5 45.3 0l128-128c9.2-9.2 11.9-22.9 6.9-34.9s-16.6-19.8-29.6-19.8L32 192c-12.9 0-24.6 7.8-29.6 19.8s-2.2 25.7 6.9 34.9l128 128z" />
              </svg>
              <span>{numPlayersStr[numPlayers]}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="footer">
        <p>Created using ReactJS by Nkholis &copy; 2023</p>
      </div>
    </>
  );
}

function UserIcon() {
  return (
    <svg
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      height="1em"
      viewBox="0 0 448 512"
    >
      <path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z" />
    </svg>
  );
}

function BotIcon() {
  return (
    <svg
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      height="1em"
      viewBox="0 0 640 512"
    >
      <path d="M320 0c17.7 0 32 14.3 32 32V96H472c39.8 0 72 32.2 72 72V440c0 39.8-32.2 72-72 72H168c-39.8 0-72-32.2-72-72V168c0-39.8 32.2-72 72-72H288V32c0-17.7 14.3-32 32-32zM208 384c-8.8 0-16 7.2-16 16s7.2 16 16 16h32c8.8 0 16-7.2 16-16s-7.2-16-16-16H208zm96 0c-8.8 0-16 7.2-16 16s7.2 16 16 16h32c8.8 0 16-7.2 16-16s-7.2-16-16-16H304zm96 0c-8.8 0-16 7.2-16 16s7.2 16 16 16h32c8.8 0 16-7.2 16-16s-7.2-16-16-16H400zM264 256a40 40 0 1 0 -80 0 40 40 0 1 0 80 0zm152 40a40 40 0 1 0 0-80 40 40 0 1 0 0 80zM48 224H64V416H48c-26.5 0-48-21.5-48-48V272c0-26.5 21.5-48 48-48zm544 0c26.5 0 48 21.5 48 48v96c0 26.5-21.5 48-48 48H576V224h16z" />
    </svg>
  );
}

function botPlay(currentSquares, char, difficulty) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  const squares = currentSquares.slice();

  const newSquares = [];
  function botTodo(todo) {
    for (let line of lines) {
      const [a, b, c] = line;
      if (todo == "choose-win-line") {
        if (
          squares[a] != null &&
          squares[a] == char &&
          squares[c] == char &&
          squares[b] == null
        ) {
          squares[b] = char;
          newSquares[0] = squares;
          return true;
        }
        if (
          squares[a] != null &&
          squares[a] == char &&
          squares[b] == char &&
          squares[c] == null
        ) {
          squares[c] = char;
          newSquares[0] = squares;
          return true;
        }
        if (
          squares[c] != null &&
          squares[c] == char &&
          squares[b] == char &&
          squares[a] == null
        ) {
          squares[a] = char;
          newSquares[0] = squares;
          return true;
        }
      }
      if (todo == "intercept") {
        if (
          squares[a] != null &&
          squares[a] == squares[c] &&
          squares[b] == null
        ) {
          squares[b] = char;
          newSquares[0] = squares;
          return true;
        }
        if (
          squares[a] != null &&
          squares[a] == squares[b] &&
          squares[c] == null
        ) {
          squares[c] = char;
          newSquares[0] = squares;
          return true;
        }
        if (
          squares[c] != null &&
          squares[c] == squares[b] &&
          squares[a] == null
        ) {
          squares[a] = char;
          newSquares[0] = squares;
          return true;
        }
      }
      if (todo == "win-probability") {
        if (squares[a] == char && squares[b] == null && squares[c] == null) {
          squares[c] = char;
          newSquares[0] = squares;
          return true;
        }
        if (squares[a] == null && squares[b] == char && squares[c] == null) {
          const rand = Math.floor(Math.random() * 2);
          if (rand == 0) {
            squares[a] = char;
          } else {
            squares[c] = char;
          }
          newSquares[0] = squares;
          return true;
        }
        if (squares[a] == null && squares[b] == null && squares[c] == char) {
          squares[a] = char;
          newSquares[0] = squares;
          return true;
        }
      }
    }

    const sideLines = [lines[0], lines[2], lines[3], lines[5]];
    const indexCornerSquares = [0, 2, 6, 8];
    const cornerSquares = indexCornerSquares.map((val) => squares[val]);
    const nullLengthCornerSquares = cornerSquares.filter(
      (val) => val == null
    ).length;
    const cornerSquaresLength = indexCornerSquares.length;

    if (
      todo == "intercept-corner" &&
      nullLengthCornerSquares == cornerSquaresLength &&
      squares[4] != null &&
      squares[4] != char
    ) {
      const indexRand =
        indexCornerSquares[Math.floor(Math.random() * cornerSquaresLength)];
      squares[indexRand] = char;

      newSquares[0] = squares;
      return true;
    }

    if (
      todo == "intercept-middle" &&
      nullLengthCornerSquares < cornerSquaresLength &&
      squares[4] == null
    ) {
      squares[4] = char;
      newSquares[0] = squares;
      return true;
    }

    if (todo == "intercept-side-corner") {
      for (let line of sideLines) {
        const [a, b, c] = line;
        if (squares[b] != null && squares[a] == null && squares[c] == null) {
          const rand = Math.floor(Math.random() * 2);
          if (rand == 0) {
            squares[a] = char;
          } else {
            squares[c] = char;
          }
          newSquares[0] = squares;
          return true;
        }
      }
    }

    return false;
  }

  if (
    (difficulty == "medium" || difficulty == "impossible") &&
    botTodo("choose-win-line")
  ) {
    return newSquares[0];
  }
  if (
    (difficulty == "medium" || difficulty == "impossible") &&
    botTodo("intercept")
  ) {
    return newSquares[0];
  }

  if (difficulty == "impossible" && botTodo("intercept-corner")) {
    return newSquares[0];
  }
  if (difficulty == "impossible" && botTodo("intercept-middle")) {
    return newSquares[0];
  }
  if (difficulty == "impossible" && botTodo("intercept-side-corner")) {
    return newSquares[0];
  }

  if (
    (difficulty == "medium" || difficulty == "impossible") &&
    botTodo("win-probability")
  ) {
    return newSquares[0];
  }
  //choose a square randomly
  const nullSquares = [];
  squares.forEach((square, i) => {
    if (square == null) {
      nullSquares.push(i);
    }
  });
  const index = Math.floor(Math.random() * (nullSquares.length - 1));
  const randomSquare = nullSquares[index];
  squares[randomSquare] = char;
  return squares;
}

function calculateWinner(squares) {
  const lines = [
    { line: [0, 1, 2], position: "h-1" },
    { line: [3, 4, 5], position: "h-2" },
    { line: [6, 7, 8], position: "h-3" },
    { line: [0, 3, 6], position: "v-1" },
    { line: [1, 4, 7], position: "v-2" },
    { line: [2, 5, 8], position: "v-3" },
    { line: [0, 4, 8], position: "d-l" },
    { line: [2, 4, 6], position: "d-r" },
  ];

  for (let line of lines) {
    const [a, b, c] = line.line;

    if (
      squares[a] != null &&
      squares[a] === squares[b] &&
      squares[c] != null &&
      squares[c] === squares[a] &&
      squares[b] != null &&
      squares[b] === squares[c]
    ) {
      return {
        status: true,
        message: squares[a],
        line: line,
      };
    }
  }
  if (!squares.includes(null)) return { status: true, message: "draw" };
  return { status: false };
}
