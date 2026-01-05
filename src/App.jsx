import React, { useState, useEffect, useCallback } from 'react';

// Game Selection Menu
const GameMenu = ({ onSelectGame }) => {
  const games = [
    { id: 'snake', name: 'Snake', emoji: '🐍', color: 'from-green-500 to-emerald-600' },
    { id: 'memory', name: 'Memory Match', emoji: '🧠', color: 'from-purple-500 to-violet-600' },
    { id: 'tictactoe', name: 'Tic Tac Toe', emoji: '⭕', color: 'from-blue-500 to-cyan-600' },
    { id: 'reaction', name: 'Reaction Time', emoji: '⚡', color: 'from-yellow-500 to-orange-600' },
    { id: 'whackamole', name: 'Whack-a-Mole', emoji: '🔨', color: 'from-red-500 to-pink-600' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col items-center justify-center p-6">
      <h1 className="text-5xl font-bold text-white mb-2 tracking-tight">🎮 Game Arcade</h1>
      <p className="text-slate-400 mb-10 text-lg">Choose a game to play</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-4xl">
        {games.map((game) => (
          <button
            key={game.id}
            onClick={() => onSelectGame(game.id)}
            className={`bg-gradient-to-br ${game.color} p-6 rounded-2xl shadow-xl hover:scale-105 transition-all duration-200 hover:shadow-2xl group`}
          >
            <div className="text-5xl mb-3 group-hover:scale-110 transition-transform">{game.emoji}</div>
            <div className="text-white text-xl font-semibold">{game.name}</div>
          </button>
        ))}
      </div>
    </div>
  );
};

// Snake Game
const SnakeGame = ({ onBack }) => {
  const [snake, setSnake] = useState([[5, 5]]);
  const [food, setFood] = useState([10, 10]);
  const [direction, setDirection] = useState([0, 1]);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(2);
  const [gameStarted, setGameStarted] = useState(false);
  const [hitFlash, setHitFlash] = useState(false);
  const gridSize = 20;

  const resetGame = () => {
    setSnake([[5, 5]]);
    setFood([Math.floor(Math.random() * gridSize), Math.floor(Math.random() * gridSize)]);
    setDirection([0, 1]);
    setGameOver(false);
    setScore(0);
    setLives(2);
    setGameStarted(true);
  };

  const loseLife = () => {
    setLives((l) => {
      if (l <= 1) {
        setGameOver(true);
        return 0;
      }
      return l - 1;
    });
    setHitFlash(true);
    setTimeout(() => setHitFlash(false), 300);
    setSnake([[5, 5]]);
    setDirection([0, 1]);
  };

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!gameStarted) return;
      switch (e.key) {
        case 'ArrowUp': if (direction[0] !== 1) setDirection([-1, 0]); break;
        case 'ArrowDown': if (direction[0] !== -1) setDirection([1, 0]); break;
        case 'ArrowLeft': if (direction[1] !== 1) setDirection([0, -1]); break;
        case 'ArrowRight': if (direction[1] !== -1) setDirection([0, 1]); break;
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [direction, gameStarted]);

  useEffect(() => {
    if (!gameStarted || gameOver) return;
    const moveSnake = () => {
      setSnake((prev) => {
        const newHead = [prev[0][0] + direction[0], prev[0][1] + direction[1]];
        if (newHead[0] < 0 || newHead[0] >= gridSize || newHead[1] < 0 || newHead[1] >= gridSize) {
          loseLife();
          return prev;
        }
        if (prev.some(([r, c]) => r === newHead[0] && c === newHead[1])) {
          loseLife();
          return prev;
        }
        const newSnake = [newHead, ...prev];
        if (newHead[0] === food[0] && newHead[1] === food[1]) {
          setScore((s) => s + 10);
          setFood([Math.floor(Math.random() * gridSize), Math.floor(Math.random() * gridSize)]);
        } else {
          newSnake.pop();
        }
        return newSnake;
      });
    };
    const interval = setInterval(moveSnake, 150);
    return () => clearInterval(interval);
  }, [direction, food, gameOver, gameStarted]);

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-900 via-green-900 to-slate-900 flex flex-col items-center justify-center p-4 transition-all ${hitFlash ? 'bg-red-900' : ''}`}>
      <div className="flex items-center gap-4 mb-4">
        <button onClick={onBack} className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg">← Back</button>
        <h2 className="text-3xl font-bold text-white">🐍 Snake</h2>
        <div className="text-white text-xl">Score: {score}</div>
        <div className="text-red-400 text-xl">{'❤️'.repeat(lives)}</div>
      </div>
      <div className={`bg-slate-800 p-2 rounded-xl shadow-2xl ${hitFlash ? 'ring-4 ring-red-500' : ''}`}>
        <div className="grid gap-px" style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}>
          {Array.from({ length: gridSize * gridSize }).map((_, i) => {
            const row = Math.floor(i / gridSize);
            const col = i % gridSize;
            const isSnake = snake.some(([r, c]) => r === row && c === col);
            const isHead = snake[0][0] === row && snake[0][1] === col;
            const isFood = food[0] === row && food[1] === col;
            return (
              <div
                key={i}
                className={`w-4 h-4 rounded-sm ${isHead ? 'bg-green-400' : isSnake ? 'bg-green-500' : isFood ? 'bg-red-500' : 'bg-slate-700'}`}
              />
            );
          })}
        </div>
      </div>
      {!gameStarted && (
        <button onClick={resetGame} className="mt-6 bg-green-600 hover:bg-green-500 text-white px-8 py-3 rounded-xl text-xl font-semibold">
          Start Game
        </button>
      )}
      {gameOver && (
        <div className="mt-6 text-center">
          <p className="text-red-400 text-2xl font-bold mb-4">Game Over! Score: {score}</p>
          <button onClick={resetGame} className="bg-green-600 hover:bg-green-500 text-white px-8 py-3 rounded-xl text-xl font-semibold">
            Play Again
          </button>
        </div>
      )}
      {gameStarted && !gameOver && <p className="text-slate-400 mt-4">Use arrow keys to move • {lives} {lives === 1 ? 'life' : 'lives'} left</p>}
    </div>
  );
};

// Memory Match Game
const MemoryGame = ({ onBack }) => {
  const emojis = ['🎮', '🎲', '🎯', '🎪', '🎨', '🎭', '🎵', '🎸'];
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);

  useEffect(() => {
    const shuffled = [...emojis, ...emojis].sort(() => Math.random() - 0.5);
    setCards(shuffled);
  }, []);

  const handleClick = (index) => {
    if (flipped.length === 2 || flipped.includes(index) || matched.includes(index)) return;
    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);
    if (newFlipped.length === 2) {
      setMoves((m) => m + 1);
      if (cards[newFlipped[0]] === cards[newFlipped[1]]) {
        setMatched((m) => [...m, ...newFlipped]);
        setFlipped([]);
      } else {
        setTimeout(() => setFlipped([]), 1000);
      }
    }
  };

  const resetGame = () => {
    const shuffled = [...emojis, ...emojis].sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setFlipped([]);
    setMatched([]);
    setMoves(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col items-center justify-center p-4">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={onBack} className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg">← Back</button>
        <h2 className="text-3xl font-bold text-white">🧠 Memory Match</h2>
        <div className="text-white text-xl">Moves: {moves}</div>
      </div>
      <div className="grid grid-cols-4 gap-3 max-w-md">
        {cards.map((emoji, index) => (
          <button
            key={index}
            onClick={() => handleClick(index)}
            className={`w-16 h-16 sm:w-20 sm:h-20 rounded-xl text-3xl font-bold transition-all duration-300 ${
              flipped.includes(index) || matched.includes(index)
                ? 'bg-purple-500 rotate-0'
                : 'bg-slate-700 hover:bg-slate-600'
            }`}
          >
            {flipped.includes(index) || matched.includes(index) ? emoji : '?'}
          </button>
        ))}
      </div>
      {matched.length === cards.length && cards.length > 0 && (
        <div className="mt-6 text-center">
          <p className="text-green-400 text-2xl font-bold mb-4">🎉 You Won in {moves} moves!</p>
          <button onClick={resetGame} className="bg-purple-600 hover:bg-purple-500 text-white px-8 py-3 rounded-xl text-xl font-semibold">
            Play Again
          </button>
        </div>
      )}
    </div>
  );
};

// Tic Tac Toe
const TicTacToe = ({ onBack }) => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isX, setIsX] = useState(true);
  const [winner, setWinner] = useState(null);

  const checkWinner = (squares) => {
    const lines = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
    for (let [a, b, c] of lines) {
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return squares.every(Boolean) ? 'Draw' : null;
  };

  const handleClick = (index) => {
    if (board[index] || winner) return;
    const newBoard = [...board];
    newBoard[index] = isX ? 'X' : 'O';
    setBoard(newBoard);
    setIsX(!isX);
    setWinner(checkWinner(newBoard));
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsX(true);
    setWinner(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex flex-col items-center justify-center p-4">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={onBack} className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg">← Back</button>
        <h2 className="text-3xl font-bold text-white">⭕ Tic Tac Toe</h2>
      </div>
      <div className="text-white text-xl mb-4">
        {winner ? (winner === 'Draw' ? "It's a Draw!" : `${winner} Wins! 🎉`) : `${isX ? 'X' : 'O'}'s Turn`}
      </div>
      <div className="grid grid-cols-3 gap-2 bg-slate-800 p-4 rounded-xl">
        {board.map((cell, index) => (
          <button
            key={index}
            onClick={() => handleClick(index)}
            className={`w-20 h-20 rounded-lg text-4xl font-bold transition-all ${
              cell ? (cell === 'X' ? 'bg-blue-500' : 'bg-pink-500') : 'bg-slate-700 hover:bg-slate-600'
            }`}
          >
            {cell}
          </button>
        ))}
      </div>
      {winner && (
        <button onClick={resetGame} className="mt-6 bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-xl text-xl font-semibold">
          Play Again
        </button>
      )}
    </div>
  );
};

// Reaction Time Game
const ReactionGame = ({ onBack }) => {
  const [state, setState] = useState('waiting');
  const [startTime, setStartTime] = useState(0);
  const [reactionTime, setReactionTime] = useState(null);
  const [bestTime, setBestTime] = useState(null);

  const startGame = () => {
    setState('ready');
    const delay = Math.random() * 3000 + 2000;
    setTimeout(() => {
      setState('go');
      setStartTime(Date.now());
    }, delay);
  };

  const handleClick = () => {
    if (state === 'waiting') {
      startGame();
    } else if (state === 'ready') {
      setState('early');
    } else if (state === 'go') {
      const time = Date.now() - startTime;
      setReactionTime(time);
      if (!bestTime || time < bestTime) setBestTime(time);
      setState('result');
    } else {
      setState('waiting');
    }
  };

  const bgColor = {
    waiting: 'from-slate-800 to-slate-900',
    ready: 'from-red-600 to-red-800',
    go: 'from-green-500 to-green-700',
    early: 'from-orange-500 to-orange-700',
    result: 'from-blue-600 to-blue-800',
  }[state];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-yellow-900 to-slate-900 flex flex-col items-center justify-center p-4">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={onBack} className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg z-10">← Back</button>
        <h2 className="text-3xl font-bold text-white">⚡ Reaction Time</h2>
      </div>
      {bestTime && <div className="text-yellow-400 text-xl mb-4">Best: {bestTime}ms</div>}
      <button
        onClick={handleClick}
        className={`w-80 h-80 rounded-3xl bg-gradient-to-br ${bgColor} flex flex-col items-center justify-center transition-all shadow-2xl hover:scale-105`}
      >
        {state === 'waiting' && <><div className="text-6xl mb-4">⚡</div><div className="text-white text-2xl">Click to Start</div></>}
        {state === 'ready' && <><div className="text-6xl mb-4">🔴</div><div className="text-white text-2xl">Wait for green...</div></>}
        {state === 'go' && <><div className="text-6xl mb-4">🟢</div><div className="text-white text-2xl">CLICK NOW!</div></>}
        {state === 'early' && <><div className="text-6xl mb-4">😬</div><div className="text-white text-2xl">Too early!</div><div className="text-white text-lg mt-2">Click to try again</div></>}
        {state === 'result' && <><div className="text-6xl mb-4">🎯</div><div className="text-white text-4xl font-bold">{reactionTime}ms</div><div className="text-white text-lg mt-2">Click to try again</div></>}
      </button>
    </div>
  );
};

// Whack-a-Mole Game
const WhackAMole = ({ onBack }) => {
  const [moles, setMoles] = useState(Array(9).fill(false));
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameActive, setGameActive] = useState(false);

  useEffect(() => {
    if (!gameActive) return;
    const moleInterval = setInterval(() => {
      setMoles((prev) => {
        const newMoles = Array(9).fill(false);
        const randomIndex = Math.floor(Math.random() * 9);
        newMoles[randomIndex] = true;
        return newMoles;
      });
    }, 800);
    return () => clearInterval(moleInterval);
  }, [gameActive]);

  useEffect(() => {
    if (!gameActive || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          setGameActive(false);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [gameActive, timeLeft]);

  const whackMole = (index) => {
    if (moles[index] && gameActive) {
      setScore((s) => s + 1);
      setMoles((prev) => {
        const newMoles = [...prev];
        newMoles[index] = false;
        return newMoles;
      });
    }
  };

  const startGame = () => {
    setScore(0);
    setTimeLeft(30);
    setGameActive(true);
    setMoles(Array(9).fill(false));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-red-900 to-slate-900 flex flex-col items-center justify-center p-4">
      <div className="flex items-center gap-4 mb-4">
        <button onClick={onBack} className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg">← Back</button>
        <h2 className="text-3xl font-bold text-white">🔨 Whack-a-Mole</h2>
      </div>
      <div className="flex gap-8 mb-6 text-white text-xl">
        <div>Score: {score}</div>
        <div>Time: {timeLeft}s</div>
      </div>
      <div className="grid grid-cols-3 gap-3 bg-amber-900 p-4 rounded-xl">
        {moles.map((hasMole, index) => (
          <button
            key={index}
            onClick={() => whackMole(index)}
            className={`w-20 h-20 rounded-full transition-all duration-100 ${
              hasMole ? 'bg-amber-600 scale-110' : 'bg-amber-800'
            } flex items-center justify-center text-4xl hover:scale-95 active:scale-90`}
          >
            {hasMole ? '🐹' : '🕳️'}
          </button>
        ))}
      </div>
      {!gameActive && (
        <button onClick={startGame} className="mt-6 bg-red-600 hover:bg-red-500 text-white px-8 py-3 rounded-xl text-xl font-semibold">
          {timeLeft === 0 ? `Game Over! Score: ${score} - Play Again` : 'Start Game'}
        </button>
      )}
    </div>
  );
};

// Main App
export default function GameArcade() {
  const [currentGame, setCurrentGame] = useState(null);

  const renderGame = () => {
    switch (currentGame) {
      case 'snake': return <SnakeGame onBack={() => setCurrentGame(null)} />;
      case 'memory': return <MemoryGame onBack={() => setCurrentGame(null)} />;
      case 'tictactoe': return <TicTacToe onBack={() => setCurrentGame(null)} />;
      case 'reaction': return <ReactionGame onBack={() => setCurrentGame(null)} />;
      case 'whackamole': return <WhackAMole onBack={() => setCurrentGame(null)} />;
      default: return <GameMenu onSelectGame={setCurrentGame} />;
    }
  };

  return renderGame();
}
