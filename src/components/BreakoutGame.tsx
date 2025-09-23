"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Trophy, Heart, Zap } from "lucide-react";

interface GameProps {
  onScoreUpdate?: (score: number) => void;
  onGameComplete?: (score: number) => void;
}

export const BreakoutGame = ({ onScoreUpdate, onGameComplete }: GameProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameState, setGameState] = useState<"difficulty" | "ready" | "playing" | "paused" | "gameover" | "won">("difficulty");
  const [highScore, setHighScore] = useState(0);
  const [difficulty, setDifficulty] = useState<"easy" | "hard">("easy");
  const [chainMultiplier, setChainMultiplier] = useState(1);
  const [currentChain, setCurrentChain] = useState(0);

  // Game objects refs to persist across renders
  const gameRef = useRef({
    paddle: { x: 150, y: 380, width: 75, height: 12, speed: 8 },
    ball: { x: 200, y: 250, vx: 2, vy: -2, radius: 6 },
    bricks: [] as {x: number, y: number, width: number, height: number, color: string, hits: number, points: number, text?: string}[],
    particles: [] as {x: number, y: number, vx: number, vy: number, color: string, life: number}[],
    powerUps: [] as {x: number, y: number, type: string, falling: boolean}[],
    touchX: null as number | null,
    keys: { left: false, right: false },
  });

  // Initialize bricks with professional themes
  const initializeBricks = useCallback(() => {
    const bricks = [];
    const rows = 5;
    const cols = 8;
    const brickWidth = 45;
    const brickHeight = 20;
    const padding = 2;
    const offsetX = 10;
    const offsetY = 50;

    // Professional skill categories as bricks
    const brickThemes = [
      { color: "#60a5fa", points: 100, text: "ROI" },        // Blue
      { color: "#a78bfa", points: 80, text: "CODE" },      // Purple
      { color: "#f472b6", points: 60, text: "SHIP" },      // Pink
      { color: "#34d399", points: 40, text: "SCALE" },     // Green
      { color: "#fbbf24", points: 20, text: "VIBE" },      // Yellow
    ];

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const theme = brickThemes[r];
        bricks.push({
          x: c * (brickWidth + padding) + offsetX,
          y: r * (brickHeight + padding) + offsetY,
          width: brickWidth,
          height: brickHeight,
          color: theme.color,
          hits: 1,
          points: theme.points,
          text: c === 0 ? theme.text : undefined,
        });
      }
    }

    return bricks;
  }, []);

  // Handle touch/mouse controls
  const handleTouchMove = useCallback((clientX: number) => {
    if (!canvasRef.current) {
      return;
    }
    const rect = canvasRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const scaleX = canvasRef.current.width / rect.width;
    gameRef.current.touchX = x * scaleX;
  }, []);

  const handleTouchEnd = useCallback(() => {
    gameRef.current.touchX = null;
  }, []);

  // Particle effects
  const createParticles = (x: number, y: number, color: string) => {
    for (let i = 0; i < 8; i++) {
      gameRef.current.particles.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 4,
        vy: (Math.random() - 0.5) * 4,
        color,
        life: 20,
      });
    }
  };

  // Game loop
  const gameLoop = useCallback((ctx: CanvasRenderingContext2D) => {
    const game = gameRef.current;
    const canvas = ctx.canvas;

    // Clear canvas
    ctx.fillStyle = "rgba(15, 23, 42, 0.95)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid background
    ctx.strokeStyle = "rgba(100, 116, 139, 0.1)";
    ctx.lineWidth = 1;
    for (let i = 0; i < canvas.width; i += 20) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, canvas.height);
      ctx.stroke();
    }
    for (let i = 0; i < canvas.height; i += 20) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(canvas.width, i);
      ctx.stroke();
    }

    if (gameState === "playing") {
      // Update paddle position
      if (game.touchX !== null) {
        game.paddle.x = game.touchX - game.paddle.width / 2;
      } else {
        if (game.keys.left && game.paddle.x > 0) {
          game.paddle.x -= game.paddle.speed;
        }
        if (game.keys.right && game.paddle.x < canvas.width - game.paddle.width) {
          game.paddle.x += game.paddle.speed;
        }
      }

      // Keep paddle in bounds
      game.paddle.x = Math.max(0, Math.min(canvas.width - game.paddle.width, game.paddle.x));

      // Update ball position
      game.ball.x += game.ball.vx;
      game.ball.y += game.ball.vy;

      // Ball collision with walls
      if (game.ball.x + game.ball.radius > canvas.width || game.ball.x - game.ball.radius < 0) {
        game.ball.vx = -game.ball.vx;
      }
      if (game.ball.y - game.ball.radius < 0) {
        game.ball.vy = -game.ball.vy;
      }

      // Ball collision with paddle
      if (
        game.ball.y + game.ball.radius > game.paddle.y &&
        game.ball.y - game.ball.radius < game.paddle.y + game.paddle.height &&
        game.ball.x > game.paddle.x &&
        game.ball.x < game.paddle.x + game.paddle.width
      ) {
        game.ball.vy = -Math.abs(game.ball.vy);
        // Add english based on where ball hits paddle
        const hitPos = (game.ball.x - game.paddle.x) / game.paddle.width;
        game.ball.vx = 4 * (hitPos - 0.5);

        // Reset chain when ball hits paddle
        setChainMultiplier(1);
        setCurrentChain(0);

        createParticles(game.ball.x, game.ball.y, "#60a5fa");
      }

      // Ball falls off screen
      if (game.ball.y - game.ball.radius > canvas.height) {
        setLives(prev => {
          const newLives = prev - 1;
          if (newLives <= 0) {
            setGameState("gameover");
            if (onGameComplete) {
              onGameComplete(score);
            }
          }
          return newLives;
        });
        // Reset ball with correct speed based on difficulty
        const ballSpeed = difficulty === "easy" ? 2 : 4;
        game.ball.x = canvas.width / 2;
        game.ball.y = canvas.height / 2;
        game.ball.vx = ballSpeed;
        game.ball.vy = -ballSpeed;
        // Reset chain when ball is lost
        setChainMultiplier(1);
        setCurrentChain(0);
      }

      // Ball collision with bricks
      game.bricks = game.bricks.filter(brick => {
        if (
          game.ball.x + game.ball.radius > brick.x &&
          game.ball.x - game.ball.radius < brick.x + brick.width &&
          game.ball.y + game.ball.radius > brick.y &&
          game.ball.y - game.ball.radius < brick.y + brick.height
        ) {
          game.ball.vy = -game.ball.vy;

          createParticles(brick.x + brick.width / 2, brick.y + brick.height / 2, brick.color);

          // Update chain and calculate bonus score
          setCurrentChain(prev => {
            const newChain = prev + 1;
            setChainMultiplier(Math.max(1, newChain));
            
            setScore(prevScore => {
              const basePoints = brick.points;
              const bonusPoints = basePoints * Math.max(1, newChain);
              const newScore = prevScore + bonusPoints;
              
              if (onScoreUpdate) {
                onScoreUpdate(newScore);
              }
              return newScore;
            });
            
            return newChain;
          });

          return false; // Remove brick
        }
        return true; // Keep brick
      });

      // Check win condition
      if (game.bricks.length === 0) {
        setGameState("won");
        if (onGameComplete) {
          onGameComplete(score);
        }
      }
    }

    // Update particles
    game.particles = game.particles.filter(particle => {
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.vy += 0.2; // Gravity
      particle.life--;
      return particle.life > 0;
    });

    // Draw particles
    game.particles.forEach(particle => {
      ctx.globalAlpha = particle.life / 20;
      ctx.fillStyle = particle.color;
      ctx.fillRect(particle.x - 2, particle.y - 2, 4, 4);
    });
    ctx.globalAlpha = 1;

    // Draw bricks
    game.bricks.forEach(brick => {
      // Gradient fill
      const gradient = ctx.createLinearGradient(brick.x, brick.y, brick.x, brick.y + brick.height);
      gradient.addColorStop(0, brick.color);
      gradient.addColorStop(1, brick.color + "99");
      ctx.fillStyle = gradient;
      ctx.fillRect(brick.x, brick.y, brick.width, brick.height);

      // Border
      ctx.strokeStyle = brick.color;
      ctx.lineWidth = 2;
      ctx.strokeRect(brick.x, brick.y, brick.width, brick.height);

      // Text label
      if (brick.text) {
        ctx.fillStyle = "#fff";
        ctx.font = "bold 8px monospace";
        ctx.textAlign = "center";
        ctx.fillText(brick.text, brick.x + brick.width / 2, brick.y + brick.height / 2 + 3);
      }
    });

    // Draw paddle with gradient
    const paddleGradient = ctx.createLinearGradient(game.paddle.x, game.paddle.y, game.paddle.x, game.paddle.y + game.paddle.height);
    paddleGradient.addColorStop(0, "#60a5fa");
    paddleGradient.addColorStop(1, "#a78bfa");
    ctx.fillStyle = paddleGradient;
    ctx.fillRect(game.paddle.x, game.paddle.y, game.paddle.width, game.paddle.height);

    // Draw ball with glow effect
    ctx.beginPath();
    ctx.arc(game.ball.x, game.ball.y, game.ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = "#fff";
    ctx.fill();
    ctx.strokeStyle = "#60a5fa";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Glow effect
    ctx.shadowBlur = 10;
    ctx.shadowColor = "#60a5fa";
    ctx.stroke();
    ctx.shadowBlur = 0;
  }, [gameState, score, onScoreUpdate, onGameComplete]);

  // Animation loop
  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return;
    }

    gameLoop(ctx);
    requestRef.current = requestAnimationFrame(animate);
  }, [gameLoop]);

  // Start game
  const startGame = useCallback(() => {
    // Set ball speed based on difficulty
    const ballSpeed = difficulty === "easy" ? 2 : 4; // Easy: 2 (current), Hard: 3 (original)

    gameRef.current.bricks = initializeBricks();
    gameRef.current.ball = { x: 200, y: 250, vx: ballSpeed, vy: -ballSpeed, radius: 6 };
    gameRef.current.paddle = { x: 150, y: 380, width: 90, height: 12, speed: 8 };
    gameRef.current.particles = [];
    setScore(0);
    setLives(3);
    setChainMultiplier(1);
    setCurrentChain(0);
    setGameState("playing");
  }, [initializeBricks, difficulty]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        gameRef.current.keys.left = true;
      }
      if (e.key === "ArrowRight") {
        gameRef.current.keys.right = true;
      }
      if (e.key === " " && gameState === "ready") {
        startGame();
      }
      if (e.key === "p" && gameState === "playing") {
        setGameState("paused");
      }
      if (e.key === "p" && gameState === "paused") {
        setGameState("playing");
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        gameRef.current.keys.left = false;
      }
      if (e.key === "ArrowRight") {
        gameRef.current.keys.right = false;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [gameState, initializeBricks, startGame]);

  // Start animation loop
  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [animate]);

  // Load high score
  useEffect(() => {
    const saved = localStorage.getItem("breakout-highscore");
    if (saved) {
      setHighScore(parseInt(saved));
    }
  }, []);

  // Save high score
  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem("breakout-highscore", score.toString());
    }
  }, [score, highScore]);

  return (
    <div className="relative w-full max-w-md mx-auto">
      {/* Game header */}
      <div className="bg-gray-900/80 rounded-t-lg p-3 border border-gray-700">
        <div className="flex justify-between items-center text-sm">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Trophy className="w-4 h-4 text-yellow-400" />
              <span className="text-yellow-400 font-mono">{highScore}</span>
            </div>
            <div className="flex items-center gap-1">
              <Zap className="w-4 h-4 text-blue-400" />
              <span className="text-blue-400 font-mono">{score}</span>
            </div>
            {currentChain > 1 && (
              <div className="flex items-center gap-1">
                <span className="text-purple-400 font-mono text-xs">
                  {currentChain}x CHAIN
                </span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-1">
            {Array.from({ length: 3 }, (_, i) => (
              <Heart
                key={i}
                className={`w-4 h-4 ${i < lives ? "text-red-500 fill-red-500" : "text-gray-600"}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Game canvas */}
      <div className="relative bg-gray-950 rounded-b-lg border-x border-b border-gray-700 overflow-hidden">
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          className="w-full touch-none"
          onTouchMove={(e) => {
            e.preventDefault();
            handleTouchMove(e.touches[0].clientX);
          }}
          onTouchEnd={handleTouchEnd}
          onMouseMove={(e) => handleTouchMove(e.clientX)}
          onMouseLeave={handleTouchEnd}
        />

        {/* Game overlay messages */}
        {gameState === "difficulty" && (
          <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-white">
            <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              BLOCKER BREAKER
            </h3>
            <p className="text-sm mb-6">Choose your vibe level:</p>

            <div className="flex gap-6">
              {/* Easy mode - Chill */}
              <button
                onClick={() => {
                  setDifficulty("easy");
                  setGameState("ready");
                }}
                className="flex flex-col items-center gap-2 px-8 py-6 bg-gray-800/80 border-2 border-green-500/50 rounded-lg hover:bg-gray-700/80 hover:border-green-400 hover:scale-105 transition-all"
              >
                <span className="text-4xl">🥱</span>
                <span className="text-lg font-semibold text-green-400">CHILL</span>
                <span className="text-xs text-gray-400">Slow ball</span>
              </button>

              {/* Hard mode - Intense */}
              <button
                onClick={() => {
                  setDifficulty("hard");
                  setGameState("ready");
                }}
                className="flex flex-col items-center gap-2 px-8 py-6 bg-gray-800/80 border-2 border-red-500/50 rounded-lg hover:bg-gray-700/80 hover:border-red-400 hover:scale-105 transition-all"
              >
                <span className="text-4xl">🤪</span>
                <span className="text-lg font-semibold text-red-400">INTENSE</span>
                <span className="text-xs text-gray-400">Fast ball</span>
              </button>
            </div>
          </div>
        )}

        {gameState === "ready" && (
          <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-white">
            <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              BLOCKER BREAKER
            </h3>
            <p className="text-sm mb-2">
              {difficulty === "easy" ? "🥱 Chill Mode" : "🤪 Intense Mode"}
            </p>
            <p className="text-xs text-gray-400 mb-4">Use arrow keys or touch to move</p>
            <button
              onClick={startGame}
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg font-semibold hover:scale-105 transition-transform"
            >
              START GAME
            </button>
            <button
              onClick={() => setGameState("difficulty")}
              className="mt-2 text-xs text-gray-400 hover:text-white transition-colors"
            >
              Change Difficulty
            </button>
          </div>
        )}

        {gameState === "paused" && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
            <p className="text-white text-xl font-bold">PAUSED</p>
          </div>
        )}

        {gameState === "gameover" && (
          <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-white">
            <h3 className="text-2xl font-bold mb-4 text-red-500">GAME OVER</h3>
            <p className="text-lg mb-2">Score: {score}</p>
            <p className="text-sm mb-4 text-gray-400">
              {difficulty === "easy" ? "🥱 Chill Mode" : "🤪 Intense Mode"}
            </p>
            {score > 1500 && (
              <p className="text-sm text-yellow-400 mb-4">Impressive skills! 🎮</p>
            )}
            <button
              onClick={() => {
                setGameState("ready");
              }}
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg font-semibold hover:scale-105 transition-transform"
            >
              TRY AGAIN
            </button>
            <button
              onClick={() => setGameState("difficulty")}
              className="mt-2 text-xs text-gray-400 hover:text-white transition-colors"
            >
              Change Difficulty
            </button>
          </div>
        )}

        {gameState === "won" && (
          <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-white">
            <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-green-400 bg-clip-text text-transparent">
              YOU WIN! 🏆
            </h3>
            <p className="text-lg mb-2">Final Score: {score}</p>
            <p className="text-sm mb-2 text-gray-400">
              {difficulty === "easy" ? "🥱 Chill Mode" : "🤪 Intense Mode"}
            </p>
            <p className="text-sm text-gray-400 mb-4">You've got the touch!</p>
            <button
              onClick={() => {
                setGameState("ready");
              }}
              className="px-6 py-2 bg-gradient-to-r from-green-600 to-blue-600 rounded-lg font-semibold hover:scale-105 transition-transform"
            >
              PLAY AGAIN
            </button>
            <button
              onClick={() => setGameState("difficulty")}
              className="mt-2 text-xs text-gray-400 hover:text-white transition-colors"
            >
              Change Difficulty
            </button>
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="mt-3 text-center">
        <p className="text-xs text-gray-500">
          Break the blockers • Chain breaks for bonus • Ship faster
        </p>
      </div>
    </div>
  );
};