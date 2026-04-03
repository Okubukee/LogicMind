
import React, { useEffect, useRef } from 'react';

const GridVisualizer = ({ 
  grid = [], 
  startNode = null, 
  endNode = null,
  visitedNodes = [],
  pathNodes = [],
  cellSize = 30,
  onCellClick = null,
  onCellDrag = null
}) => {
  const canvasRef = useRef(null);

  const drawGrid = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const rows = grid.length;
    const cols = grid[0]?.length || 0;
    
    canvas.width = cols * cellSize;
    canvas.height = rows * cellSize;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x = col * cellSize;
        const y = row * cellSize;
        const cell = grid[row][col];
        
        
        if (startNode && startNode.row === row && startNode.col === col) {
          ctx.fillStyle = '#22c55e'; 
        } else if (endNode && endNode.row === row && endNode.col === col) {
          ctx.fillStyle = '#ef4444'; 
        } else if (pathNodes.some(node => node.row === row && node.col === col)) {
          ctx.fillStyle = '#fbbf24'; 
        } else if (visitedNodes.some(node => node.row === row && node.col === col)) {
          ctx.fillStyle = '#3b82f6'; 
        } else if (cell?.isWall) {
          ctx.fillStyle = '#1f2937'; 
        } else {
          ctx.fillStyle = '#ffffff'; 
        }
        
        ctx.fillRect(x, y, cellSize - 1, cellSize - 1);
        
        
        ctx.strokeStyle = '#e5e7eb';
        ctx.strokeRect(x, y, cellSize - 1, cellSize - 1);
      }
    }
  };

  const handleCanvasClick = (e) => {
    if (!onCellClick) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const scaleX = canvasRef.current.width / rect.width;
    const scaleY = canvasRef.current.height / rect.height;
    
    const mouseX = (e.clientX - rect.left) * scaleX;
    const mouseY = (e.clientY - rect.top) * scaleY;
    
    const col = Math.floor(mouseX / cellSize);
    const row = Math.floor(mouseY / cellSize);
    
    if (row >= 0 && row < grid.length && col >= 0 && col < grid[0]?.length) {
      onCellClick(row, col);
    }
  };

  useEffect(() => {
    drawGrid();
  }, [grid, startNode, endNode, visitedNodes, pathNodes, cellSize]);

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center',
      backgroundColor: '#111827',
      padding: '20px',
      borderRadius: '12px'
    }}>
      <canvas
        ref={canvasRef}
        onClick={handleCanvasClick}
        style={{
          cursor: 'pointer',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.5)',
          borderRadius: '8px'
        }}
      />
    </div>
  );
};

export default GridVisualizer;