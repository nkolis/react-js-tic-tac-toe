/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import O_shape from "./components/O_shape";
import X_shape from "./components/X_shape";

function Square({ onSquareClick, value }) {
  function handleClicked() {
    return onSquareClick();
  }

  return (
    <button className="square" onClick={handleClicked}>
      {value == "x" ? <X_shape /> : ""}
      {value == "o" ? <O_shape /> : ""}
    </button>
  );
}

function Board({
  playerIsNext,
  player,
  squares,
  onPlay,
  winner,
  winLineStyle,
}) {
  function handleClick(i) {
    if (squares[i] || winner.status) return false;

    let nextSquares = squares.slice();
    if (playerIsNext) {
      nextSquares[i] = player;
      onPlay(nextSquares);
    }
  }

  return (
    <>
      <div className={`board ${winLineStyle}`}>
        {squares.map((val, i) => (
          <Square
            key={i}
            onSquareClick={playerIsNext ? () => handleClick(i) : () => false}
            value={val}
          />
        ))}
      </div>
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [player, setPlayer] = useState("o");
  const [computer, setComputer] = useState("x");
  const [status, setStatus] = useState("");
  const [firstMove, setFirstMove] = useState(0);
  const playerIsNext = currentMove % 2 == firstMove;
  const currentSquares = history[currentMove];
  const winner = calculateWinner(currentSquares);
  const [winLineStyle, setWinLineStyle] = useState("");
  const [animationDelay, setAnimationDelay] = useState(true);
  const delay = 600;
  const [clicked, setClicked] = useState(false);

  const [score, setScore] = useState({
    player: 0,
    draw: 0,
    computer: 0,
  });

  function handlePlay(nextSquares) {
    setTimeout(() => {
      const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
      setHistory(nextHistory);
      setCurrentMove(nextHistory.length - 1);
    }, delay - delay - 100);
  }

  function refresh() {
    setCurrentMove(0);
    setClicked(false);
    return false;
  }

  function restart() {
    setClicked(false);
    setHistory([Array(9).fill(null)]);
    setCurrentMove(0);
    setFirstMove(0);
    setScore({
      player: 0,
      draw: 0,
      computer: 0,
    });
    return false;
  }

  function swapPlayer() {
    if (!clicked) {
      restart();
      firstMove == 0 ? setFirstMove(1) : setFirstMove(0);
      setClicked(true);
    }

    setTimeout(() => {
      setClicked(false);
    }, 1000);
  }

  useEffect(() => {
    if (!playerIsNext && !winner.status) {
      setTimeout(() => {
        handlePlay(botPlay(currentSquares, computer));
      }, delay);
    }
    setStatus(`Next player: ${playerIsNext ? player : computer}`);
    if (winner.status && winner.message != "draw") {
      const line = winner.line.line[0];
      setWinLineStyle(
        `win-line-${currentSquares[line]}-${winner.line.position}`
      );
      setStatus("Winner: " + winner.message.toUpperCase());
      if (winner.message == player) {
        const newScore = score.player + 1;
        setScore({ ...score, player: newScore });
      }
      if (winner.message == computer) {
        const newScore = score.computer + 1;
        setScore({ ...score, computer: newScore });
      }
      setTimeout(() => {
        setAnimationDelay(false);
      }, 1050);
    } else {
      setWinLineStyle("");
    }
    if (winner.status && winner.message == "draw") {
      setStatus("Draw");
      const newScore = score.draw + 1;
      setScore({ ...score, draw: newScore });
      setTimeout(() => {
        setAnimationDelay(false);
      }, 500);
    }

    return () => {
      setAnimationDelay(true);
    };
  }, [currentMove, firstMove]);

  return (
    <>
      <div className="header">
        <h1 className="game-title">Tic Tac Toe</h1>
        <h4 className="game-status">{status}</h4>
      </div>
      <div className="game">
        <div
          className="game-board"
          onClick={
            !animationDelay && winner.status && currentMove > 0
              ? refresh
              : false
          }
        >
          <Board
            playerIsNext={playerIsNext}
            player={player}
            squares={currentSquares}
            onPlay={playerIsNext ? handlePlay : () => false}
            winner={winner}
            winLineStyle={winLineStyle}
          />
        </div>
        <div className="game-info">
          <div className="game-reset">
            <button
              onClick={restart}
              disabled={history.length == 1 ? true : false}
            >
              Restart Game
            </button>
          </div>
          <div className="game-score">
            <div
              className="score-info"
              style={{ order: firstMove == 0 ? 1 : 3 }}
            >
              <p className="name">Player</p>
              <p className="score">{score.player}</p>
            </div>
            <div className="score-info" style={{ order: 2 }}>
              {history.length == 1 ? (
                <button
                  className="swap-player"
                  onClick={swapPlayer}
                  disabled={clicked}
                >
                  <svg
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
              style={{ order: firstMove == 1 ? 1 : 3 }}
            >
              <p className="name">Computer</p>
              <p className="score">{score.computer}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function botPlay(currentSquares, char, difficulty = "hard") {
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
  // to choose the winning square line
  for (let line of lines) {
    const [a, b, c] = line;
    if (
      squares[a] != null &&
      squares[a] == char &&
      squares[c] == char &&
      squares[b] == null
    ) {
      squares[b] = char;
      return squares;
    }
    if (
      squares[a] != null &&
      squares[a] == char &&
      squares[b] == char &&
      squares[c] == null
    ) {
      squares[c] = char;
      return squares;
    }
    if (
      squares[c] != null &&
      squares[c] == char &&
      squares[b] == char &&
      squares[a] == null
    ) {
      squares[a] = char;
      return squares;
    }
  }

  // to intercept the oppenent win
  for (let line of lines) {
    const [a, b, c] = line;
    if (squares[a] != null && squares[a] == squares[c] && squares[b] == null) {
      squares[b] = char;
      return squares;
    }
    if (squares[a] != null && squares[a] == squares[b] && squares[c] == null) {
      squares[c] = char;
      return squares;
    }
    if (squares[c] != null && squares[c] == squares[b] && squares[a] == null) {
      squares[a] = char;
      return squares;
    }
  }

  //to create a win probability line
  for (let line of lines) {
    const [a, b, c] = line;
    if (squares[a] == char && squares[b] == null && squares[c] == null) {
      const rand = Math.floor(Math.random() * 2);
      if (rand == 0) {
        squares[b] = char;
      } else {
        squares[c] = char;
      }
      return squares;
    }
    if (squares[a] == null && squares[b] == char && squares[c] == null) {
      const rand = Math.floor(Math.random() * 2);
      if (rand == 0) {
        squares[a] = char;
      } else {
        squares[c] = char;
      }
      return squares;
    }
    if (squares[a] == null && squares[b] == null && squares[c] == char) {
      const rand = Math.floor(Math.random() * 2);
      if (rand == 0) {
        squares[a] = char;
      } else {
        squares[b] = char;
      }
      return squares;
    }
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
