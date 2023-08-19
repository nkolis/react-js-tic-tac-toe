/* eslint-disable react/prop-types */
import { useState } from "react";
import "./App.css";
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
  function handleClick(i) {
    if (squares[i] || calculateWinner(squares)) return false;
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? "x" : "o";
    onPlay(nextSquares);
  }

  return (
    <>
      <div className="board">
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
      <li key={move}>
        <button onClick={() => setCurrentMove(move)}>{description}</button>
      </li>
    );
  });

  const winner = calculateWinner(currentSquares);
  let status = "";
  status = winner
    ? `Winner: ${winner.toUpperCase()}`
    : `Next player: ${xIsNext ? "X" : "O"}`;
  if (winner == "draw") {
    status = "Draw";
  }

  return (
    <>
      <div className="header">
        <h1>Tic Tac Toe</h1>
        <h4>{status}</h4>
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
  const rules = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let rule of rules) {
    const [a, b, c] = rule;

    if (
      squares[a] === squares[b] &&
      squares[a] === squares[c] &&
      squares[b] === squares[c]
    ) {
      return squares[a];
    }
  }
  if (!squares.includes(null)) return "draw";
  return false;
}
