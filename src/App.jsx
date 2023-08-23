/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import O_shape from "./components/O_shape";
import X_shape from "./components/X_shape";

function Square({ onSquareClick, value }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value == "x" ? <X_shape /> : ""}
      {value == "o" ? <O_shape /> : ""}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  const [winLineStyle, setWinLineStyle] = useState("");
  const winner = calculateWinner(squares);
  useEffect(() => {
    let winLine;
    if (winner.status && winner.message != "draw") {
      winLine = winner.line;
      const line = winLine.line[0];
      setWinLineStyle(`win-line-${squares[line]}-${winLine.position}`);
    } else {
      setWinLineStyle("");
    }
  }, [winner]);

  function handleClick(i) {
    if (squares[i] || winner.status) return false;
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? "x" : "o";
    onPlay(nextSquares);
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
  const xIsNext = currentMove % 2 == 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  const moves = history.map((squares, move) => {
    let description = "";
    if (move > 0) {
      description = "Go to move#" + move;
    } else {
      description = "Go to game start";
    }

    return (
      <li key={move} className="history">
        <button onClick={() => setCurrentMove(move)}>{description}</button>
      </li>
    );
  });

  let status = `Next Player: ${xIsNext ? "X" : "O"}`;
  const winner = calculateWinner(currentSquares);
  if (winner.status && winner.message != "draw") {
    status = "Winner: " + winner.message.toUpperCase();
  }
  if (winner.status && winner.message == "draw") {
    status = "Draw";
  }

  return (
    <>
      <div className="header">
        <h1 className="game-title">Tic Tac Toe</h1>
        <h4 className="game-status">{status}</h4>
      </div>
      <div className="game">
        <div className="game-board">
          <Board
            xIsNext={xIsNext}
            squares={currentSquares}
            onPlay={handlePlay}
          />
        </div>
        <div className="game-info">
          <ul>{moves}</ul>
        </div>
      </div>
    </>
  );
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
