import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Trophy, RefreshCw, Play as PlayIcon } from 'lucide-react';
import { Point } from '../types';

const GRID_SIZE = 20;
const INITIAL_SPEED = 150;
const SPEED_INCREMENT = 2;

export const SnakeGame: React.FC = () => {
  const [snake, setSnake] = useState<Point[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Point>({ x: 15, y: 15 });
  const [direction, setDirection] = useState<Point>({ x: 1, y: 0 });
  const [nextDirection, setNextDirection] = useState<Point>({ x: 1, y: 0 });
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [speed, setSpeed] = useState(INITIAL_SPEED);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);

  const generateFood = useCallback((currentSnake: Point[]): Point => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE)
      };
      // Ensure food doesn't spawn on snake
      const onSnake = currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
      if (!onSnake) break;
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setFood({ x: 15, y: 15 });
    setDirection({ x: 1, y: 0 });
    setNextDirection({ x: 1, y: 0 });
    setScore(0);
    setIsGameOver(false);
    setIsStarted(true);
    setSpeed(INITIAL_SPEED);
  };

  const moveSnake = useCallback(() => {
    if (isGameOver || !isStarted) return;

    setSnake(prevSnake => {
      const head = prevSnake[0];
      const newHead = {
        x: (head.x + nextDirection.x + GRID_SIZE) % GRID_SIZE,
        y: (head.y + nextDirection.y + GRID_SIZE) % GRID_SIZE
      };

      // Set direction for the next frame
      setDirection(nextDirection);

      // Check collision with self
      if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        setIsGameOver(true);
        if (score > highScore) setHighScore(score);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check if food eaten
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(s => s + 10);
        setFood(generateFood(newSnake));
        setSpeed(prev => Math.max(prev - SPEED_INCREMENT, 80)); // Speed up
      } else {
        newSnake.pop(); // Remove tail
      }

      return newSnake;
    });
  }, [nextDirection, isGameOver, isStarted, food, generateFood, score, highScore]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      switch (key) {
        case 'arrowup':
        case 'w':
          if (direction.y !== 1) setNextDirection({ x: 0, y: -1 });
          break;
        case 'arrowdown':
        case 's':
          if (direction.y !== -1) setNextDirection({ x: 0, y: 1 });
          break;
        case 'arrowleft':
        case 'a':
          if (direction.x !== 1) setNextDirection({ x: -1, y: 0 });
          break;
        case 'arrowright':
        case 'd':
          if (direction.x !== -1) setNextDirection({ x: 1, y: 0 });
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  useEffect(() => {
    if (isStarted && !isGameOver) {
      gameLoopRef.current = setInterval(moveSnake, speed);
    } else {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    }
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [isStarted, isGameOver, moveSnake, speed]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#050505';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid lines (subtle)
    ctx.strokeStyle = 'rgba(16, 185, 129, 0.1)';
    ctx.lineWidth = 0.5;
    const cellSize = canvas.width / GRID_SIZE;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * cellSize, 0);
      ctx.lineTo(i * cellSize, canvas.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * cellSize);
      ctx.lineTo(canvas.width, i * cellSize);
      ctx.stroke();
    }

    // Draw food
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#f43f5e';
    ctx.fillStyle = '#f43f5e';
    ctx.beginPath();
    ctx.arc(
      food.x * cellSize + cellSize / 2,
      food.y * cellSize + cellSize / 2,
      cellSize / 2.5,
      0,
      Math.PI * 2
    );
    ctx.fill();

    // Draw snake
    snake.forEach((segment, index) => {
      const isHead = index === 0;
      ctx.shadowBlur = isHead ? 15 : 8;
      ctx.shadowColor = '#10b981';
      ctx.fillStyle = isHead ? '#ffffff' : '#10b981';
      
      const padding = 1;
      ctx.fillRect(
        segment.x * cellSize + padding,
        segment.y * cellSize + padding,
        cellSize - padding * 2,
        cellSize - padding * 2
      );
    });

    // Reset shadow for text/other elements
    ctx.shadowBlur = 0;

  }, [snake, food]);

  return (
    <div className="flex flex-col items-center bg-transparent p-2">
      <div className="flex justify-between w-full mb-6 text-zinc-100 font-mono uppercase tracking-widest text-[10px]">
        <div className="flex flex-col items-start gap-1 bg-zinc-900/50 py-3 px-6 rounded-xl border border-zinc-800 backdrop-blur-md">
          <span className="text-zinc-500 font-bold">SCORE</span>
          <span className="font-black text-2xl text-emerald-400 leading-none">{score.toLocaleString()}</span>
        </div>
        <div className="flex flex-col items-end gap-1 bg-zinc-900/50 py-3 px-6 rounded-xl border border-zinc-800 backdrop-blur-md">
          <span className="text-zinc-500 font-bold">SESSION_BEST</span>
          <span className="font-black text-2xl text-white leading-none">{highScore.toLocaleString()}</span>
        </div>
      </div>

      <div className="relative group p-1 bg-zinc-800/20 rounded-2xl border border-zinc-800">
        <canvas 
          ref={canvasRef}
          width={400}
          height={400}
          className="rounded-xl border border-emerald-500/20 shadow-[0_0_40px_rgba(16,185,129,0.05)] transition-all group-hover:border-emerald-500/40"
        />

        {!isStarted && !isGameOver && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm rounded-xl">
            <button 
              onClick={resetGame}
              className="group flex flex-col items-center gap-4 text-white hover:text-emerald-400 transition-colors"
            >
              <div className="w-20 h-20 rounded-full bg-emerald-500 flex items-center justify-center text-emerald-950 shadow-[0_0_30px_#10b981] group-hover:scale-110 transition-all">
                <PlayIcon size={40} fill="currentColor" />
              </div>
              <span className="font-mono text-[10px] tracking-[0.5em] uppercase font-black">Initiate Link</span>
            </button>
          </div>
        )}

        {isGameOver && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/90 backdrop-blur-md rounded-xl">
            <div className="flex flex-col items-center gap-6 animate-in fade-in zoom-in duration-300">
              <div className="text-center">
                <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-orange-500 drop-shadow-[0_0_15px_rgba(244,63,94,0.5)] italic uppercase">
                  System Halted
                </h2>
                <p className="text-[10px] text-zinc-500 font-mono tracking-widest mt-1 uppercase">Illegal Memory Access</p>
              </div>
              
              <div className="bg-zinc-900/50 p-4 rounded-xl border border-zinc-800 w-48 text-center">
                <p className="text-[10px] text-zinc-500 uppercase font-black mb-1">Final Score</p>
                <p className="text-3xl font-mono font-black text-white">{score}</p>
              </div>

              <button 
                onClick={resetGame}
                className="flex items-center gap-2 bg-emerald-500 text-emerald-950 font-black py-4 px-10 rounded-full hover:bg-emerald-400 transition-all shadow-[0_0_30px_rgba(16,185,129,0.3)] uppercase tracking-widest text-xs"
              >
                <RefreshCw size={18} />
                System Reset
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="mt-8 flex justify-between w-full text-[10px] items-center text-zinc-500 uppercase font-mono px-2">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_5px_#10b981]"></div>
          <span className="tracking-widest">W/A/S/D CONTROL</span>
        </div>
        <div className="tracking-[0.3em]">
          GRID_LATENCY: <span className="text-white">LOW</span>
        </div>
      </div>
    </div>
  );
};
