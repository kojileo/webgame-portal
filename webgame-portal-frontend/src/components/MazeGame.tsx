import React, { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import { setCurrentScore, resetScore } from "../store/scoreSlice";

const GameContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Canvas = styled.canvas`
  border: 1px solid #000;
`;

interface Position {
  x: number;
  y: number;
}

const CELL_SIZE = 20;
const ROWS = 15;
const COLS = 15;

const MazeGame: React.FC = () => {
  const dispatch = useDispatch();
  const [playerPos, setPlayerPos] = useState<Position>({ x: 0, y: 0 });
  const [maze, setMaze] = useState<number[][]>([]);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    if (gameOver) {
      dispatch(setCurrentScore(playerPos.x + playerPos.y));
    }
  }, [gameOver, playerPos, dispatch]);

  const generateMaze = useCallback(() => {
    const newMaze = Array(ROWS)
      .fill(null)
      .map(() => Array(COLS).fill(0));
    // 簡単な迷路生成ロジック（ランダムに壁を配置）
    for (let i = 0; i < ROWS; i++) {
      for (let j = 0; j < COLS; j++) {
        if (Math.random() < 0.3 && !(i === 0 && j === 0)) {
          newMaze[i][j] = 1;
        }
      }
    }
    newMaze[ROWS - 1][COLS - 1] = 2; // ゴールを設定
    setMaze(newMaze);
    setPlayerPos({ x: 0, y: 0 });
    setGameOver(false);
    dispatch(resetScore());
  }, [dispatch]);

  const movePlayer = useCallback(
    (dx: number, dy: number) => {
      setPlayerPos((prev) => {
        const newX = Math.max(0, Math.min(COLS - 1, prev.x + dx));
        const newY = Math.max(0, Math.min(ROWS - 1, prev.y + dy));
        if (maze[newY][newX] !== 1) {
          if (maze[newY][newX] === 2) {
            setGameOver(true);
          }
          return { x: newX, y: newY };
        }
        return prev;
      });
    },
    [maze]
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameOver) return;
      switch (e.key) {
        case "ArrowUp":
          movePlayer(0, -1);
          break;
        case "ArrowDown":
          movePlayer(0, 1);
          break;
        case "ArrowLeft":
          movePlayer(-1, 0);
          break;
        case "ArrowRight":
          movePlayer(1, 0);
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [movePlayer, gameOver]);

  useEffect(() => {
    const canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 迷路を描画
    maze.forEach((row, y) => {
      row.forEach((cell, x) => {
        ctx.fillStyle = cell === 1 ? "#000" : cell === 2 ? "#0f0" : "#fff";
        ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
      });
    });

    // プレイヤーを描画
    ctx.fillStyle = "#f00";
    ctx.fillRect(
      playerPos.x * CELL_SIZE,
      playerPos.y * CELL_SIZE,
      CELL_SIZE,
      CELL_SIZE
    );
  }, [maze, playerPos]);

  return (
    <GameContainer>
      <Canvas
        id="gameCanvas"
        width={COLS * CELL_SIZE}
        height={ROWS * CELL_SIZE}
      />
      {gameOver && <p>ゴール！おめでとうございます！</p>}
      <button onClick={generateMaze}>新しい迷路を生成</button>
    </GameContainer>
  );
};

export default MazeGame;
