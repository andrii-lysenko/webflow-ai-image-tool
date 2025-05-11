import { useEffect, useRef, useState } from "react";
import { Box, Button, Typography } from "@mui/material";

type Position = {
  x: number;
  y: number;
};

type Props = {
  onExit: () => void;
};

export function SnakeGame({ onExit }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const gridSize = 15;
    const width = canvas.width;
    const height = canvas.height;

    let snake: Position[] = [{ x: 5, y: 5 }];
    let food: Position = {
      x: Math.floor(Math.random() * (width / gridSize)),
      y: Math.floor(Math.random() * (height / gridSize)),
    };
    let dx = 1;
    let dy = 0;
    let isPaused = false;

    function drawSnake() {
      if (!ctx) return;
      ctx.fillStyle = "#4caf50";
      snake.forEach((segment) => {
        ctx.fillRect(
          segment.x * gridSize,
          segment.y * gridSize,
          gridSize,
          gridSize
        );
      });
    }

    function drawFood() {
      if (!ctx) return;
      ctx.fillStyle = "#f44336";
      ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);
    }

    function moveSnake() {
      const head = {
        x: snake[0].x + dx,
        y: snake[0].y + dy,
      };

      // Check for collisions
      if (
        head.x < 0 ||
        head.x >= width / gridSize ||
        head.y < 0 ||
        head.y >= height / gridSize ||
        snake.some((segment) => segment.x === head.x && segment.y === head.y)
      ) {
        setGameOver(true);
        isPaused = true;
        return;
      }

      snake.unshift(head);

      // Check if snake eats food
      if (head.x === food.x && head.y === food.y) {
        setScore((prev) => prev + 1);
        food = {
          x: Math.floor(Math.random() * (width / gridSize)),
          y: Math.floor(Math.random() * (height / gridSize)),
        };
      } else {
        snake.pop();
      }
    }

    function gameLoop() {
      if (isPaused) return;

      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);

      drawFood();
      drawSnake();
      moveSnake();
    }

    const interval = setInterval(gameLoop, 150);

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onExit();
        return;
      }

      switch (e.key) {
        case "ArrowUp":
          if (dy !== 1) {
            dx = 0;
            dy = -1;
          }
          break;
        case "ArrowDown":
          if (dy !== -1) {
            dx = 0;
            dy = 1;
          }
          break;
        case "ArrowLeft":
          if (dx !== 1) {
            dx = -1;
            dy = 0;
          }
          break;
        case "ArrowRight":
          if (dx !== -1) {
            dx = 1;
            dy = 0;
          }
          break;
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      clearInterval(interval);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onExit]);

  const handleRestart = () => {
    setScore(0);
    setGameOver(false);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        bgcolor: "grey.100",
        p: 2,
      }}
    >
      <Typography variant="h5" sx={{ mb: 1 }}>
        Snake Game
      </Typography>

      <Typography variant="body2" sx={{ mb: 2, color: "text.secondary" }}>
        Press ESC to return to chat
      </Typography>

      <Box sx={{ position: "relative" }}>
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          style={{
            border: "1px solid #ccc",
            backgroundColor: "#f5f5f5",
          }}
        />

        {gameOver && (
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: "rgba(0, 0, 0, 0.7)",
            }}
          >
            <Typography variant="h5" sx={{ color: "white", mb: 2 }}>
              Game Over!
            </Typography>
            <Typography variant="h6" sx={{ color: "white", mb: 3 }}>
              Score: {score}
            </Typography>
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleRestart}
              >
                Play Again
              </Button>
              <Button
                variant="outlined"
                sx={{ color: "white", borderColor: "white" }}
                onClick={onExit}
              >
                Return to Chat
              </Button>
            </Box>
          </Box>
        )}
      </Box>

      <Typography variant="h6" sx={{ mt: 2 }}>
        Score: {score}
      </Typography>
    </Box>
  );
}
