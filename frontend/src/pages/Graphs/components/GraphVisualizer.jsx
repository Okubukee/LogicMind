import { useEffect, useRef, useState } from 'react';

const GraphVisualizer = ({ 
  nodes = [], 
  edges = [], 
  visitedNodes = [], 
  pathNodes = [],
  currentNode = null,
  highlightEdge = null,
  colors = {}
}) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 500 });

  
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setDimensions({
          width: Math.max(rect.width - 40, 400),
          height: Math.max(rect.height - 40, 400)
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  
  const getNodePosition = (index, total, width, height) => {
    const margin = 60;
    const radiusX = (width - margin * 2) / 2.5;
    const radiusY = (height - margin * 2) / 2.5;
    const centerX = width / 2;
    const centerY = height / 2;
    const angle = (index * 2 * Math.PI / total) - Math.PI / 2;
    return {
      x: centerX + radiusX * Math.cos(angle),
      y: centerY + radiusY * Math.sin(angle)
    };
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || nodes.length === 0) return;
    
    const ctx = canvas.getContext('2d');
    const { width, height } = dimensions;
    
    canvas.width = width;
    canvas.height = height;
    
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#111827';
    ctx.fillRect(0, 0, width, height);
    
    
    const positions = {};
    nodes.forEach((node, idx) => {
      positions[node] = getNodePosition(idx, nodes.length, width, height);
    });
    
    
    edges.forEach(edge => {
      const fromPos = positions[edge.from];
      const toPos = positions[edge.to];
      if (!fromPos || !toPos) return;
      
      ctx.beginPath();
      ctx.moveTo(fromPos.x, fromPos.y);
      ctx.lineTo(toPos.x, toPos.y);
      
      
      if (highlightEdge && highlightEdge.from === edge.from && highlightEdge.to === edge.to) {
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 4;
      } else {
        ctx.strokeStyle = '#4b5563';
        ctx.lineWidth = 2;
      }
      ctx.stroke();
      
      
      if (edge.weight && edge.weight !== 1) {
        const midX = (fromPos.x + toPos.x) / 2;
        const midY = (fromPos.y + toPos.y) / 2;
        ctx.fillStyle = '#9ca3af';
        ctx.font = '12px monospace';
        ctx.fillText(edge.weight, midX, midY - 5);
      }
      
      
      if (edge.directed) {
        const angle = Math.atan2(toPos.y - fromPos.y, toPos.x - fromPos.x);
        const arrowX = toPos.x - 15 * Math.cos(angle);
        const arrowY = toPos.y - 15 * Math.sin(angle);
        ctx.beginPath();
        ctx.moveTo(arrowX, arrowY);
        ctx.lineTo(arrowX - 8 * Math.cos(angle - Math.PI / 6), arrowY - 8 * Math.sin(angle - Math.PI / 6));
        ctx.lineTo(arrowX - 8 * Math.cos(angle + Math.PI / 6), arrowY - 8 * Math.sin(angle + Math.PI / 6));
        ctx.fillStyle = ctx.strokeStyle;
        ctx.fill();
      }
    });
    
    
    nodes.forEach(node => {
      const pos = positions[node];
      if (!pos) return;
      
      
      const nodeRadius = Math.min(30, Math.max(20, 80 / Math.sqrt(nodes.length)));
      
      
      let color = '#3b82f6';
      if (pathNodes.includes(node)) {
        color = '#fbbf24';
      } else if (visitedNodes.includes(node)) {
        color = '#22c55e';
      } else if (currentNode === node) {
        color = '#ef4444';
      } else if (colors[node] === 0) {
        color = '#8b5cf6';
      } else if (colors[node] === 1) {
        color = '#ec489a';
      }
      
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, nodeRadius, 0, 2 * Math.PI);
      ctx.fillStyle = color;
      ctx.fill();
      ctx.strokeStyle = '#00ff9d';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      
      const fontSize = Math.max(12, Math.min(16, nodeRadius - 8));
      ctx.fillStyle = '#ffffff';
      ctx.font = `bold ${fontSize}px monospace`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(node, pos.x, pos.y);
    });
    
  }, [nodes, edges, visitedNodes, pathNodes, currentNode, highlightEdge, colors, dimensions]);

  return (
    <div 
      ref={containerRef}
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#111827',
        padding: '20px',
        borderRadius: '12px',
        width: '100%',
        minHeight: '500px',
        height: 'auto'
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: 'auto',
          borderRadius: '8px',
          backgroundColor: '#111827'
        }}
      />
    </div>
  );
};

export default GraphVisualizer;