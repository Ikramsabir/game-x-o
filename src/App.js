import React, { useState, useEffect } from "react";
import Confetti from "react-confetti";
import "./App.css";

function App() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [mode, setMode] = useState(null);
  const [winner, setWinner] = useState(null);
  const [winningSquares, setWinningSquares] = useState([]);
  const [showConfetti, setShowConfetti] = useState(false);

  const handleClick = (index) => {
    if (board[index] || winner) return;

    const newBoard = board.slice();
    newBoard[index] = xIsNext ? "X" : "O";
    setBoard(newBoard);
    setXIsNext(!xIsNext);
  };

  // Smart PC move
  useEffect(() => {
    if (mode === 1 && !xIsNext && !winner) {
      const emptyIndexes = board
        .map((val, idx) => (val === null ? idx : null))
        .filter((val) => val !== null);
      if (emptyIndexes.length === 0) return;

      const findBestMove = (player) => {
        for (let idx of emptyIndexes) {
          const newBoard = board.slice();
          newBoard[idx] = player;
          if (calculateWinner(newBoard)?.winner === player) return idx;
        }
        return null;
      };

      const move = findBestMove("O") || findBestMove("X") || emptyIndexes[Math.floor(Math.random() * emptyIndexes.length)];

      const timer = setTimeout(() => {
        setBoard((prevBoard) => {
          const newBoard = prevBoard.slice();
          newBoard[move] = "O";
          return newBoard;
        });
        setXIsNext(true);
      }, 400);

      return () => clearTimeout(timer);
    }
  }, [board, xIsNext, mode, winner]);

  // Check winner
  useEffect(() => {
    const result = calculateWinner(board);
    if (result) {
      setWinner(result.winner);
      setWinningSquares(result.line);
      setShowConfetti(true); // show confetti on win
    }
  }, [board]);

  const renderSquare = (index) => (
    <button
      className={`square ${winningSquares.includes(index) ? "winner-square" : ""}`}
      onClick={() => handleClick(index)}
    >
      {board[index]}
    </button>
  );

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setXIsNext(true);
    setWinner(null);
    setWinningSquares([]);
    setMode(null);
    setShowConfetti(false);
  };

  if (!mode) {
    return (
      <div className="game">
        <h1>Tic-Tac-Toe</h1>
        <p>Choose Mode:</p>
        <div className="mode-buttons">
          <button onClick={() => setMode(1)}>1 Player (vs PC)</button>
          <button onClick={() => setMode(2)}>2 Players</button>
        </div>
      </div>
    );
  }

  return (
    <div className="game">
      {showConfetti && <Confetti />}
      <h1>Tic-Tac-Toe</h1>
      <div className="status">
        {winner
          ? `Winner: ${winner}`
          : `Next player: ${xIsNext ? "X" : mode === 1 ? "PC" : "O"}`}
      </div>
      <div className="board">
        <div className="board-row">
          {renderSquare(0)}
          {renderSquare(1)}
          {renderSquare(2)}
        </div>
        <div className="board-row">
          {renderSquare(3)}
          {renderSquare(4)}
          {renderSquare(5)}
        </div>
        <div className="board-row">
          {renderSquare(6)}
          {renderSquare(7)}
          {renderSquare(8)}
        </div>
      </div>
      <button className="reset" onClick={resetGame}>
        Restart
      </button>
    </div>
  );
}

function calculateWinner(board) {
  const lines = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  for (let [a,b,c] of lines) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], line: [a,b,c] };
    }
  }
  return null;
}

export default App;
