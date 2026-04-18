import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Trophy, RotateCcw, Play } from 'lucide-react';

interface SnakeGameProps {
  onScoreChange: (score: number) => void;
}

const GRID_SIZE = 20;
const TILE_SIZE = 20;
const INITIAL_SPEED = 150;

export const SnakeGame: React.FC<SnakeGameProps> = ({ onScoreChange }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  
  const snake = useRef<{ x: number; y: number }[]>([{ x: 10, y: 10 }]);
  const food = useRef<{ x: number; y: number }>({ x: 15, y: 15 });
  const direction = useRef<{ x: number; y: number }>({ x: 1, y: 0 });
  const nextDirection = useRef<{ x: number; y: number }>({ x: 1, y: 0 });
  
  const generateFood = useCallback(() => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // Check if food spawned on snake
      const onSnake = snake.current.some(segment => segment.x === newFood!.x && segment.y === newFood!.y);
      if (!onSnake) break;
    }
    food.current = newFood;
  }, []);

  const resetGame = () => {
    snake.current = [{ x: 10, y: 10 }];
    direction.current = { x: 1, y: 0 };
    nextDirection.current = { x: 1, y: 0 };
    setScore(0);
    onScoreChange(0);
    setGameOver(false);
    setGameStarted(true);
    generateFood();
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          if (direction.current.y === 0) nextDirection.current = { x: 0, y: -1 };
          break;
        case 'ArrowDown':
          if (direction.current.y === 0) nextDirection.current = { x: 0, y: 1 };
          break;
        case 'ArrowLeft':
          if (direction.current.x === 0) nextDirection.current = { x: -1, y: 0 };
          break;
        case 'ArrowRight':
          if (direction.current.x === 0) nextDirection.current = { x: 1, y: 0 };
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const moveSnake = () => {
      direction.current = nextDirection.current;
      const head = { 
        x: snake.current[0].x + direction.current.x,
        y: snake.current[0].y + direction.current.y
      };

      // Collision detection (walls)
      if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
        setGameOver(true);
        return;
      }

      // Collision detection (self)
      if (snake.current.some(segment => segment.x === head.x && segment.y === head.y)) {
        setGameOver(true);
        return;
      }

      const newSnake = [head, ...snake.current];

      // Check food
      if (head.x === food.current.x && head.y === food.current.y) {
        setScore(s => {
          const newScore = s + 10;
          onScoreChange(newScore);
          return newScore;
        });
        generateFood();
      } else {
        newSnake.pop();
      }

      snake.current = newSnake;
    };

    const draw = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Clear canvas
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw grid lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 0.5;
      for (let i = 0; i <= GRID_SIZE; i++) {
        ctx.beginPath();
        ctx.moveTo(i * TILE_SIZE, 0);
        ctx.lineTo(i * TILE_SIZE, canvas.height);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i * TILE_SIZE);
        ctx.lineTo(canvas.width, i * TILE_SIZE);
        ctx.stroke();
      }

      // Draw food
      ctx.fillStyle = '#ff00ff';
      ctx.shadowBlur = 15;
      ctx.shadowColor = '#ff00ff';
      ctx.beginPath();
      ctx.arc(
        food.current.x * TILE_SIZE + TILE_SIZE / 2,
        food.current.y * TILE_SIZE + TILE_SIZE / 2,
        TILE_SIZE / 2 - 2,
        0,
        Math.PI * 2
      );
      ctx.fill();

      // Draw snake
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#39ff14';
      snake.current.forEach((segment, index) => {
        ctx.fillStyle = index === 0 ? '#39ff14' : '#28b40e';
        ctx.fillRect(
          segment.x * TILE_SIZE + 1,
          segment.y * TILE_SIZE + 1,
          TILE_SIZE - 2,
          TILE_SIZE - 2
        );
      });
      ctx.shadowBlur = 0; // Reset shadow for other drawings
    };

    const gameLoop = setInterval(() => {
      moveSnake();
      draw();
    }, INITIAL_SPEED);

    return () => clearInterval(gameLoop);
  }, [gameStarted, gameOver, generateFood, onScoreChange]);

  return (
    <div className="relative flex flex-col items-center">
      <div className="mb-4 flex items-center gap-4">
        <div className="flex items-center gap-2 px-4 py-2 bg-black/40 border border-[#ff00ff]/30 rounded-full">
          <Trophy className="w-4 h-4 text-[#ff00ff]" />
          <span className="text-[#ff00ff] font-mono font-bold">{score}</span>
        </div>
      </div>

      <div className="relative p-1 bg-[#000000] border-2 border-[#00f3ff] rounded-sm shadow-[0_0_30px_rgba(0,243,255,0.2)]">
        <canvas
          ref={canvasRef}
          width={GRID_SIZE * TILE_SIZE}
          height={GRID_SIZE * TILE_SIZE}
          className="cursor-none"
        />

        {(!gameStarted || gameOver) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 backdrop-blur-sm rounded-lg">
            <h2 className="text-3xl font-black text-[#00f3ff] mb-4 tracking-tighter text-neon-cyan">
              {gameOver ? 'SYSTEM FAILURE' : 'NEON SYNTH'}
            </h2>
            {gameOver && (
              <p className="text-[#ff00ff] font-mono text-xl mb-6 text-neon-pink">DATA CORRUPTED: {score}</p>
            )}
            <button
              onClick={resetGame}
              className="group relative px-8 py-3 bg-[transparent] text-[#00f3ff] border border-[#00f3ff] font-bold rounded-full overflow-hidden transition-all hover:bg-[#00f3ff] hover:text-black hover:shadow-[0_0_15px_#00f3ff] active:scale-95"
            >
              <div className="flex items-center gap-2 pointer-events-none">
                {gameOver ? <RotateCcw className="w-5 h-4" /> : <Play className="w-5 h-4 fill-current" />}
                {gameOver ? 'REBOOT' : 'INITIALIZE'}
              </div>
            </button>
            {!gameOver && (
              <p className="mt-8 text-white/40 text-[10px] font-mono uppercase tracking-[0.3em]">
                Translate logic units via arrow inputs
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
