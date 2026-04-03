import { useState } from 'react';
import GridVisualizer from './components/GridVisualizer';
import AlgorithmCards from './components/AlgorithmCards';
import pathfindingAlgorithms from './data/pathfindingAlgorithms.json';

const ROWS = 15;
const COLS = 25;
const CELL_SIZE = 32;

const createEmptyGrid = () => {
  return Array(ROWS).fill().map(() => Array(COLS).fill().map(() => ({ isWall: false })));
};

const PathfindingPage = () => {
  const [mode, setMode] = useState('selecting');
  const [algorithm, setAlgorithm] = useState('dijkstra');
  const [grid, setGrid] = useState(createEmptyGrid);
  const [startNode, setStartNode] = useState({ row: 2, col: 3 });
  const [endNode, setEndNode] = useState({ row: 12, col: 21 });
  const [visitedNodes, setVisitedNodes] = useState([]);
  const [pathNodes, setPathNodes] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [speed, setSpeed] = useState(30);
  const [error, setError] = useState(null);
  const [stopAnimation, setStopAnimation] = useState(false);

  const handleSelectAlgorithm = (algoId) => {
    setAlgorithm(algoId);
    setMode('visualizing');
    resetVisualization();
  };

  const resetVisualization = () => {
    setVisitedNodes([]);
    setPathNodes([]);
    setStopAnimation(false);
  };

  const resetGrid = () => {
    setGrid(createEmptyGrid());
    setStartNode({ row: 2, col: 3 });
    setEndNode({ row: 12, col: 21 });
    resetVisualization();
  };

  const toggleWall = (row, col) => {
    if ((row === startNode.row && col === startNode.col) ||
        (row === endNode.row && col === endNode.col)) {
      return;
    }
    const newGrid = [...grid];
    newGrid[row][col].isWall = !newGrid[row][col].isWall;
    setGrid(newGrid);
    resetVisualization();
  };

  const getNeighbors = (node) => {
    const neighbors = [];
    const { row, col } = node;
    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    
    for (const [dr, dc] of directions) {
      const newRow = row + dr;
      const newCol = col + dc;
      if (newRow >= 0 && newRow < ROWS && newCol >= 0 && newCol < COLS) {
        if (!grid[newRow][newCol].isWall) {
          neighbors.push({ row: newRow, col: newCol, distance: 1 });
        }
      }
    }
    return neighbors;
  };

  const heuristic = (node) => {
    return Math.abs(node.row - endNode.row) + Math.abs(node.col - endNode.col);
  };

  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const visualizeAlgorithm = async () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setError(null);
    resetVisualization();
    setStopAnimation(false);
    
    const visited = [];
    const path = [];
    
    try {
      switch (algorithm) {
        case 'bfs':
          await runBFS(visited, path);
          break;
        case 'dfs':
          await runDFS(visited, path);
          break;
        case 'dijkstra':
          await runDijkstra(visited, path);
          break;
        case 'astar':
          await runAStar(visited, path);
          break;
        case 'greedy_bfs':
          await runGreedyBFS(visited, path);
          break;
        case 'bidirectional_bfs':
          await runBidirectionalBFS(visited, path);
          break;
        case 'bellman_ford':
          await runBellmanFord(visited, path);
          break;
        default:
          await runDijkstra(visited, path);
      }
      
      if (!stopAnimation) {
        setVisitedNodes(visited);
        setPathNodes(path);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsAnimating(false);
    }
  };

  const runBFS = async (visited, path) => {
    const queue = [{ ...startNode, parent: null }];
    const visitedSet = new Set();
    const parentMap = new Map();
    
    while (queue.length > 0 && !stopAnimation) {
      const current = queue.shift();
      const key = `${current.row},${current.col}`;
      
      if (visitedSet.has(key)) continue;
      visitedSet.add(key);
      visited.push({ row: current.row, col: current.col });
      setVisitedNodes([...visited]);
      await sleep(speed);
      
      if (current.row === endNode.row && current.col === endNode.col) {
        let node = current;
        while (node) {
          path.unshift({ row: node.row, col: node.col });
          node = parentMap.get(`${node.row},${node.col}`);
        }
        break;
      }
      
      const neighbors = getNeighbors(current);
      for (const neighbor of neighbors) {
        const neighborKey = `${neighbor.row},${neighbor.col}`;
        if (!visitedSet.has(neighborKey)) {
          parentMap.set(neighborKey, current);
          queue.push({ ...neighbor, parent: current });
        }
      }
    }
  };

  const runDFS = async (visited, path) => {
    const stack = [{ ...startNode, parent: null }];
    const visitedSet = new Set();
    const parentMap = new Map();
    
    while (stack.length > 0 && !stopAnimation) {
      const current = stack.pop();
      const key = `${current.row},${current.col}`;
      
      if (visitedSet.has(key)) continue;
      visitedSet.add(key);
      visited.push({ row: current.row, col: current.col });
      setVisitedNodes([...visited]);
      await sleep(speed);
      
      if (current.row === endNode.row && current.col === endNode.col) {
        let node = current;
        while (node) {
          path.unshift({ row: node.row, col: node.col });
          node = parentMap.get(`${node.row},${node.col}`);
        }
        break;
      }
      
      const neighbors = getNeighbors(current);
      for (const neighbor of neighbors) {
        const neighborKey = `${neighbor.row},${neighbor.col}`;
        if (!visitedSet.has(neighborKey)) {
          parentMap.set(neighborKey, current);
          stack.push({ ...neighbor, parent: current });
        }
      }
    }
  };

  const runDijkstra = async (visited, path) => {
    const distances = new Map();
    const previous = new Map();
    const unvisited = new Set();
    
    for (let i = 0; i < ROWS; i++) {
      for (let j = 0; j < COLS; j++) {
        const key = `${i},${j}`;
        distances.set(key, Infinity);
        unvisited.add(key);
      }
    }
    distances.set(`${startNode.row},${startNode.col}`, 0);
    
    while (unvisited.size > 0 && !stopAnimation) {
      let current = null;
      let minDist = Infinity;
      for (const nodeKey of unvisited) {
        const dist = distances.get(nodeKey);
        if (dist < minDist) {
          minDist = dist;
          current = nodeKey;
        }
      }
      
      if (!current) break;
      
      const [row, col] = current.split(',').map(Number);
      unvisited.delete(current);
      
      if (row === endNode.row && col === endNode.col) {
        let node = { row, col };
        while (node) {
          path.unshift({ row: node.row, col: node.col });
          const prev = previous.get(`${node.row},${node.col}`);
          node = prev;
        }
        break;
      }
      
      visited.push({ row, col });
      setVisitedNodes([...visited]);
      await sleep(speed);
      
      const neighbors = getNeighbors({ row, col });
      for (const neighbor of neighbors) {
        const neighborKey = `${neighbor.row},${neighbor.col}`;
        if (unvisited.has(neighborKey)) {
          const alt = distances.get(current) + neighbor.distance;
          if (alt < distances.get(neighborKey)) {
            distances.set(neighborKey, alt);
            previous.set(neighborKey, { row, col });
          }
        }
      }
    }
  };

  const runAStar = async (visited, path) => {
    const openSet = [{ ...startNode, f: 0, g: 0 }];
    const closedSet = new Set();
    const parentMap = new Map();
    const gScore = new Map();
    gScore.set(`${startNode.row},${startNode.col}`, 0);
    
    while (openSet.length > 0 && !stopAnimation) {
      openSet.sort((a, b) => a.f - b.f);
      const current = openSet.shift();
      const currentKey = `${current.row},${current.col}`;
      
      if (current.row === endNode.row && current.col === endNode.col) {
        let node = current;
        while (node) {
          path.unshift({ row: node.row, col: node.col });
          node = parentMap.get(`${node.row},${node.col}`);
        }
        break;
      }
      
      closedSet.add(currentKey);
      visited.push({ row: current.row, col: current.col });
      setVisitedNodes([...visited]);
      await sleep(speed);
      
      const neighbors = getNeighbors(current);
      for (const neighbor of neighbors) {
        const neighborKey = `${neighbor.row},${neighbor.col}`;
        if (closedSet.has(neighborKey)) continue;
        
        const tentativeG = gScore.get(currentKey) + neighbor.distance;
        if (!gScore.has(neighborKey) || tentativeG < gScore.get(neighborKey)) {
          parentMap.set(neighborKey, current);
          gScore.set(neighborKey, tentativeG);
          const f = tentativeG + heuristic(neighbor);
          
          const existing = openSet.find(n => n.row === neighbor.row && n.col === neighbor.col);
          if (existing) {
            existing.f = f;
            existing.g = tentativeG;
          } else {
            openSet.push({ ...neighbor, f, g: tentativeG });
          }
        }
      }
    }
  };

  const runGreedyBFS = async (visited, path) => {
    const openSet = [{ ...startNode, h: heuristic(startNode) }];
    const visitedSet = new Set();
    const parentMap = new Map();
    
    while (openSet.length > 0 && !stopAnimation) {
      openSet.sort((a, b) => a.h - b.h);
      const current = openSet.shift();
      const currentKey = `${current.row},${current.col}`;
      
      if (visitedSet.has(currentKey)) continue;
      visitedSet.add(currentKey);
      visited.push({ row: current.row, col: current.col });
      setVisitedNodes([...visited]);
      await sleep(speed);
      
      if (current.row === endNode.row && current.col === endNode.col) {
        let node = current;
        while (node) {
          path.unshift({ row: node.row, col: node.col });
          node = parentMap.get(`${node.row},${node.col}`);
        }
        break;
      }
      
      const neighbors = getNeighbors(current);
      for (const neighbor of neighbors) {
        const neighborKey = `${neighbor.row},${neighbor.col}`;
        if (!visitedSet.has(neighborKey)) {
          parentMap.set(neighborKey, current);
          openSet.push({ ...neighbor, h: heuristic(neighbor) });
        }
      }
    }
  };

  const runBidirectionalBFS = async (visited, path) => {
    const queueStart = [{ ...startNode, parent: null }];
    const queueEnd = [{ ...endNode, parent: null }];
    const visitedStart = new Set();
    const visitedEnd = new Set();
    const parentStart = new Map();
    const parentEnd = new Map();
    
    visitedStart.add(`${startNode.row},${startNode.col}`);
    visitedEnd.add(`${endNode.row},${endNode.col}`);
    
    while (queueStart.length > 0 && queueEnd.length > 0 && !stopAnimation) {
      const currentStart = queueStart.shift();
      const currentStartKey = `${currentStart.row},${currentStart.col}`;
      visited.push({ row: currentStart.row, col: currentStart.col });
      setVisitedNodes([...visited]);
      await sleep(speed);
      
      if (visitedEnd.has(currentStartKey)) {
        let node = currentStart;
        while (node) {
          path.unshift({ row: node.row, col: node.col });
          node = parentStart.get(`${node.row},${node.col}`);
        }
        node = parentEnd.get(currentStartKey);
        while (node) {
          path.push({ row: node.row, col: node.col });
          node = parentEnd.get(`${node.row},${node.col}`);
        }
        break;
      }
      
      const neighbors = getNeighbors(currentStart);
      for (const neighbor of neighbors) {
        const neighborKey = `${neighbor.row},${neighbor.col}`;
        if (!visitedStart.has(neighborKey)) {
          visitedStart.add(neighborKey);
          parentStart.set(neighborKey, currentStart);
          queueStart.push({ ...neighbor, parent: currentStart });
        }
      }
      
      const currentEnd = queueEnd.shift();
      const currentEndKey = `${currentEnd.row},${currentEnd.col}`;
      visited.push({ row: currentEnd.row, col: currentEnd.col });
      setVisitedNodes([...visited]);
      await sleep(speed);
      
      if (visitedStart.has(currentEndKey)) {
        let node = parentStart.get(currentEndKey);
        while (node) {
          path.unshift({ row: node.row, col: node.col });
          node = parentStart.get(`${node.row},${node.col}`);
        }
        path.push({ row: currentEnd.row, col: currentEnd.col });
        node = parentEnd.get(currentEndKey);
        while (node) {
          path.push({ row: node.row, col: node.col });
          node = parentEnd.get(`${node.row},${node.col}`);
        }
        break;
      }
      
      const neighborsEnd = getNeighbors(currentEnd);
      for (const neighbor of neighborsEnd) {
        const neighborKey = `${neighbor.row},${neighbor.col}`;
        if (!visitedEnd.has(neighborKey)) {
          visitedEnd.add(neighborKey);
          parentEnd.set(neighborKey, currentEnd);
          queueEnd.push({ ...neighbor, parent: currentEnd });
        }
      }
    }
  };

  const runBellmanFord = async (visited, path) => {
    const distances = new Map();
    const previous = new Map();
    const nodes = [];
    
    for (let i = 0; i < ROWS; i++) {
      for (let j = 0; j < COLS; j++) {
        const key = `${i},${j}`;
        distances.set(key, Infinity);
        nodes.push({ row: i, col: j });
      }
    }
    distances.set(`${startNode.row},${startNode.col}`, 0);
    
    for (let i = 0; i < nodes.length - 1 && !stopAnimation; i++) {
      let updated = false;
      for (const node of nodes) {
        const nodeKey = `${node.row},${node.col}`;
        const currentDist = distances.get(nodeKey);
        if (currentDist === Infinity) continue;
        
        const neighbors = getNeighbors(node);
        for (const neighbor of neighbors) {
          const neighborKey = `${neighbor.row},${neighbor.col}`;
          if (currentDist + neighbor.distance < distances.get(neighborKey)) {
            distances.set(neighborKey, currentDist + neighbor.distance);
            previous.set(neighborKey, node);
            updated = true;
          }
        }
      }
      
      visited.push({ row: endNode.row, col: endNode.col });
      setVisitedNodes([...visited]);
      await sleep(speed);
      
      if (!updated) break;
    }
    
    let node = { row: endNode.row, col: endNode.col };
    while (node) {
      path.unshift({ row: node.row, col: node.col });
      node = previous.get(`${node.row},${node.col}`);
    }
  };

  const stopVisualization = () => {
    setStopAnimation(true);
    setIsAnimating(false);
  };

  const currentAlgo = pathfindingAlgorithms[algorithm] || pathfindingAlgorithms.dijkstra;

  if (mode === 'selecting') {
    return <AlgorithmCards onSelectAlgorithm={handleSelectAlgorithm} />;
  }

  return (
    <div style={{ padding: '20px 24px' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        
        <div style={{ marginBottom: '20px' }}>
          <button 
            onClick={() => setMode('selecting')}
            style={{
              padding: '8px 16px',
              borderRadius: '40px',
              background: 'rgba(0, 255, 157, 0.1)',
              border: '1px solid #00ff9d',
              color: '#00ff9d',
              cursor: 'pointer',
              marginBottom: '16px'
            }}
          >
            ← Ver todos los algoritmos
          </button>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '48px' }}>{currentAlgo.icon}</span>
            <div>
              <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: 'white' }}>
                {currentAlgo.name}
              </h1>
              <p style={{ color: '#9ca3af', fontSize: '14px' }}>{currentAlgo.description}</p>
            </div>
          </div>
        </div>

        <div style={{
          background: 'rgba(20, 20, 20, 0.9)',
          borderRadius: '20px',
          padding: '16px 20px',
          marginBottom: '20px',
          border: '1px solid rgba(0, 255, 157, 0.2)'
        }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center' }}>
            <button onClick={resetGrid} style={{ padding: '8px 16px', borderRadius: '12px', background: 'linear-gradient(135deg, #00ff9d, #10b981)', color: '#000', fontWeight: 'bold', border: 'none', cursor: 'pointer', fontSize: '13px' }}>
              🗺️ Reiniciar Grid
            </button>
            <button onClick={visualizeAlgorithm} disabled={isAnimating} style={{ padding: '8px 16px', borderRadius: '12px', background: 'linear-gradient(135deg, #00ff9d, #10b981)', color: '#000', fontWeight: 'bold', border: 'none', cursor: 'pointer', fontSize: '13px' }}>
              {isAnimating ? '⏳ Visualizando...' : '▶ Visualizar'}
            </button>
            {isAnimating && (
              <button onClick={stopVisualization} style={{ padding: '8px 16px', borderRadius: '12px', background: '#ef4444', color: 'white', border: 'none', cursor: 'pointer', fontSize: '13px' }}>
                ⏹ Detener
              </button>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#1a1a1a', padding: '4px 12px', borderRadius: '12px' }}>
              <span style={{ fontSize: '14px' }}>⚡</span>
              <input type="range" min="10" max="150" value={speed} onChange={(e) => setSpeed(Number(e.target.value))} style={{ width: '100px' }} />
              <span style={{ fontSize: '12px' }}>{speed}ms</span>
            </div>
          </div>
          <p style={{ color: '#9ca3af', marginTop: '12px', fontSize: '12px' }}>
            💡 Haz clic en las celdas para agregar/eliminar paredes
          </p>
        </div>

        {error && (
          <div style={{ background: 'rgba(239,68,68,0.2)', border: '1px solid #ef4444', borderRadius: '12px', padding: '10px', marginBottom: '16px', color: '#fecaca', fontSize: '13px' }}>
            ❌ {error}
          </div>
        )}

        <GridVisualizer
          grid={grid}
          startNode={startNode}
          endNode={endNode}
          visitedNodes={visitedNodes}
          pathNodes={pathNodes}
          cellSize={CELL_SIZE}
          onCellClick={toggleWall}
        />

        <div style={{ marginTop: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div style={{ background: 'rgba(20,20,20,0.9)', borderRadius: '16px', padding: '16px' }}>
            <h3 style={{ color: '#00ff9d', marginBottom: '12px', fontSize: '16px' }}>📊 Información</h3>
            <p style={{ color: 'white', fontSize: '13px' }}><strong style={{ color: '#00ff9d' }}>Complejidad:</strong> {currentAlgo.complexity}</p>
            <p style={{ color: 'white', fontSize: '13px' }}><strong style={{ color: '#00ff9d' }}>Espacio:</strong> {currentAlgo.space}</p>
            <p style={{ color: 'white', fontSize: '13px' }}><strong style={{ color: '#00ff9d' }}>Visitados:</strong> {visitedNodes.length}</p>
            <p style={{ color: 'white', fontSize: '13px' }}><strong style={{ color: '#00ff9d' }}>Camino:</strong> {pathNodes.length}</p>
          </div>
          <div style={{ background: 'rgba(20,20,20,0.9)', borderRadius: '16px', padding: '16px' }}>
            <h3 style={{ color: '#00ff9d', marginBottom: '12px', fontSize: '16px' }}>🎨 Leyenda</h3>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', fontSize: '12px' }}>
              <div><span style={{ display: 'inline-block', width: '16px', height: '16px', background: '#22c55e', borderRadius: '4px', marginRight: '6px' }}></span> Inicio</div>
              <div><span style={{ display: 'inline-block', width: '16px', height: '16px', background: '#ef4444', borderRadius: '4px', marginRight: '6px' }}></span> Destino</div>
              <div><span style={{ display: 'inline-block', width: '16px', height: '16px', background: '#3b82f6', borderRadius: '4px', marginRight: '6px' }}></span> Visitado</div>
              <div><span style={{ display: 'inline-block', width: '16px', height: '16px', background: '#fbbf24', borderRadius: '4px', marginRight: '6px' }}></span> Camino</div>
              <div><span style={{ display: 'inline-block', width: '16px', height: '16px', background: '#1f2937', borderRadius: '4px', marginRight: '6px' }}></span> Pared</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PathfindingPage;