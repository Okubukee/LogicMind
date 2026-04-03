import { useState, useEffect } from 'react';
import { runGraphAlgorithm, getGraphsAlgorithmsInfo } from './api';
import AlgorithmCards from './AlgorithmCards';
import GraphVisualizer from './components/GraphVisualizer';

const GraphsPage = () => {
  const [mode, setMode] = useState('selecting');
  const [algorithmsInfo, setAlgorithmsInfo] = useState({});
  const [algorithm, setAlgorithm] = useState('dfs');
  const [nodes, setNodes] = useState(['A', 'B', 'C', 'D', 'E', 'F']);
  const [edges, setEdges] = useState([
    { from: 'A', to: 'B', weight: 4 },
    { from: 'A', to: 'C', weight: 2 },
    { from: 'B', to: 'C', weight: 1 },
    { from: 'B', to: 'D', weight: 5 },
    { from: 'C', to: 'D', weight: 8 },
    { from: 'C', to: 'E', weight: 10 },
    { from: 'D', to: 'E', weight: 2 },
    { from: 'D', to: 'F', weight: 6 },
    { from: 'E', to: 'F', weight: 3 }
  ]);
  const [startNode, setStartNode] = useState('A');
  const [endNode, setEndNode] = useState('F');
  const [result, setResult] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [speed, setSpeed] = useState(500);
  const [error, setError] = useState(null);
  const [stopAnimation, setStopAnimation] = useState(false);

  useEffect(() => {
    const loadAlgorithms = async () => {
      try {
        const info = await getGraphsAlgorithmsInfo();
        setAlgorithmsInfo(info);
      } catch (err) {
        console.error('Error loading algorithms:', err);
      }
    };
    loadAlgorithms();
  }, []);

  const handleSelectAlgorithm = (algoId) => {
    setAlgorithm(algoId);
    setMode('visualizing');
    setResult(null);
    setSteps([]);
    setCurrentStep(0);
  };

  const addEdge = () => {
    const from = prompt('Nodo origen:');
    const to = prompt('Nodo destino:');
    const weight = parseInt(prompt('Peso (opcional):', '1')) || 1;
    if (from && to && nodes.includes(from) && nodes.includes(to)) {
      setEdges([...edges, { from, to, weight }]);
    } else {
      alert('Nodos no válidos');
    }
  };

  const addNode = () => {
    const node = prompt('Nombre del nuevo nodo:');
    if (node && !nodes.includes(node)) {
      setNodes([...nodes, node]);
    } else {
      alert('Nodo ya existe o nombre inválido');
    }
  };

  const resetGraph = () => {
    setNodes(['A', 'B', 'C', 'D', 'E', 'F']);
    setEdges([
      { from: 'A', to: 'B', weight: 4 },
      { from: 'A', to: 'C', weight: 2 },
      { from: 'B', to: 'C', weight: 1 },
      { from: 'B', to: 'D', weight: 5 },
      { from: 'C', to: 'D', weight: 8 },
      { from: 'C', to: 'E', weight: 10 },
      { from: 'D', to: 'E', weight: 2 },
      { from: 'D', to: 'F', weight: 6 },
      { from: 'E', to: 'F', weight: 3 }
    ]);
    setStartNode('A');
    setEndNode('F');
    setResult(null);
    setSteps([]);
    setCurrentStep(0);
  };

  const visualizeAlgorithm = async () => {
    setIsAnimating(true);
    setError(null);
    setResult(null);
    setSteps([]);
    setCurrentStep(0);
    setStopAnimation(false);
    
    try {
      const resultData = await runGraphAlgorithm(algorithm, nodes, edges, startNode, endNode);
      setSteps(resultData.steps || []);
      
      for (let i = 0; i < (resultData.steps?.length || 0) && !stopAnimation; i++) {
        setCurrentStep(i);
        await new Promise(resolve => setTimeout(resolve, speed));
      }
      
      setResult(resultData);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsAnimating(false);
    }
  };

  const stopVisualization = () => {
    setStopAnimation(true);
    setIsAnimating(false);
  };

  const currentStepData = steps[currentStep] || {};
  const currentAlgo = algorithmsInfo[algorithm] || { name: algorithm, icon: '🔗' };

  const getVisitedNodes = () => {
    if (currentStepData.visited) return currentStepData.visited;
    if (result?.visited) return result.visited;
    return [];
  };

  const getPathNodes = () => {
    if (result?.path) return result.path;
    if (currentStepData.path) return currentStepData.path;
    return [];
  };

  const getCurrentNode = () => {
    return currentStepData.node || null;
  };

  const getHighlightEdge = () => {
    if (currentStepData.from && currentStepData.to) {
      return { from: currentStepData.from, to: currentStepData.to };
    }
    return null;
  };

  const getColors = () => {
    if (currentStepData.colors) return currentStepData.colors;
    if (result?.colors) return result.colors;
    return {};
  };

  if (mode === 'selecting') {
    return <AlgorithmCards algorithmsInfo={algorithmsInfo} onSelectAlgorithm={handleSelectAlgorithm} />;
  }

  return (
    <div style={{ padding: '20px 24px' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        
        {/* Header */}
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
              marginBottom: '16px',
              fontSize: '14px'
            }}
          >
            ← Ver todos los algoritmos
          </button>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '48px' }}>{currentAlgo.icon}</span>
            <div>
              <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: 'white' }}>
                {currentAlgo.name}
              </h1>
              <p style={{ color: '#9ca3af', fontSize: '14px' }}>{currentAlgo.description}</p>
            </div>
          </div>
        </div>

        {/* Controles */}
        <div style={{
          background: 'rgba(20, 20, 20, 0.9)',
          borderRadius: '20px',
          padding: '16px 20px',
          marginBottom: '20px',
          border: '1px solid rgba(0, 255, 157, 0.2)'
        }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center', marginBottom: '12px' }}>
            <select 
              value={algorithm} 
              onChange={(e) => setAlgorithm(e.target.value)}
              style={{ background: '#1a1a1a', color: 'white', border: '1px solid #00ff9d', borderRadius: '10px', padding: '8px 12px', fontSize: '13px' }}
            >
              {Object.values(algorithmsInfo).map(algo => (
                <option key={algo.id} value={algo.id}>{algo.icon} {algo.name}</option>
              ))}
            </select>
            
            <button onClick={addNode} style={{ padding: '8px 16px', borderRadius: '12px', background: 'linear-gradient(135deg, #00ff9d, #10b981)', color: '#000', fontWeight: 'bold', border: 'none', cursor: 'pointer', fontSize: '13px' }}>
              ➕ Nodo
            </button>
            
            <button onClick={addEdge} style={{ padding: '8px 16px', borderRadius: '12px', background: 'linear-gradient(135deg, #00ff9d, #10b981)', color: '#000', fontWeight: 'bold', border: 'none', cursor: 'pointer', fontSize: '13px' }}>
              🔗 Arista
            </button>
            
            <button onClick={resetGraph} style={{ padding: '8px 16px', borderRadius: '12px', background: '#4b5563', color: 'white', fontWeight: 'bold', border: 'none', cursor: 'pointer', fontSize: '13px' }}>
              🔄 Reiniciar
            </button>
            
            <button onClick={visualizeAlgorithm} disabled={isAnimating} style={{ padding: '8px 16px', borderRadius: '12px', background: 'linear-gradient(135deg, #00ff9d, #10b981)', color: '#000', fontWeight: 'bold', border: 'none', cursor: 'pointer', fontSize: '13px' }}>
              {isAnimating ? '⏳...' : '▶ Visualizar'}
            </button>
            
            {isAnimating && (
              <button onClick={stopVisualization} style={{ padding: '8px 16px', borderRadius: '12px', background: '#ef4444', color: 'white', border: 'none', cursor: 'pointer', fontSize: '13px' }}>
                ⏹ Detener
              </button>
            )}
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#1a1a1a', padding: '4px 12px', borderRadius: '12px' }}>
              <span style={{ fontSize: '14px' }}>⚡</span>
              <input type="range" min="100" max="1000" value={speed} onChange={(e) => setSpeed(Number(e.target.value))} style={{ width: '80px' }} />
              <span style={{ fontSize: '12px' }}>{speed}ms</span>
            </div>
          </div>
          
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ color: 'white', fontSize: '13px' }}>Inicio:</span>
              <select value={startNode} onChange={(e) => setStartNode(e.target.value)} style={{ background: '#1a1a1a', color: 'white', border: '1px solid #00ff9d', borderRadius: '6px', padding: '4px 8px', fontSize: '12px' }}>
                {nodes.map(node => <option key={node} value={node}>{node}</option>)}
              </select>
            </div>
            
            {(algorithm === 'dijkstra') && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ color: 'white', fontSize: '13px' }}>Destino:</span>
                <select value={endNode} onChange={(e) => setEndNode(e.target.value)} style={{ background: '#1a1a1a', color: 'white', border: '1px solid #00ff9d', borderRadius: '6px', padding: '4px 8px', fontSize: '12px' }}>
                  {nodes.map(node => <option key={node} value={node}>{node}</option>)}
                </select>
              </div>
            )}
            
            <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px', fontSize: '11px', color: '#6b7280' }}>
              <span>🔵 Normal</span>
              <span>🟢 Visitado</span>
              <span>🟡 Camino</span>
              <span>🔴 Actual</span>
            </div>
          </div>
        </div>

        {error && (
          <div style={{ background: 'rgba(239,68,68,0.2)', border: '1px solid #ef4444', borderRadius: '12px', padding: '10px', marginBottom: '16px', color: '#fecaca', fontSize: '13px' }}>
            ❌ {error}
          </div>
        )}

        {/* Visualización del Grafo - Responsive */}
        <GraphVisualizer
          nodes={nodes}
          edges={edges}
          visitedNodes={getVisitedNodes()}
          pathNodes={getPathNodes()}
          currentNode={getCurrentNode()}
          highlightEdge={getHighlightEdge()}
          colors={getColors()}
        />

        {/* Información del paso actual */}
        {currentStepData && Object.keys(currentStepData).length > 0 && (
          <div style={{ marginTop: '16px', background: 'rgba(20,20,20,0.9)', borderRadius: '16px', padding: '16px' }}>
            <h3 style={{ color: '#00ff9d', marginBottom: '12px', fontSize: '16px' }}>
              📊 Paso {currentStep + 1} / {steps.length || 1}
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', fontSize: '13px' }}>
              {currentStepData.type && (
                <p style={{ color: 'white' }}><strong style={{ color: '#00ff9d' }}>Tipo:</strong> {currentStepData.type}</p>
              )}
              {currentStepData.node && (
                <p style={{ color: 'white' }}><strong style={{ color: '#00ff9d' }}>Nodo:</strong> {currentStepData.node}</p>
              )}
              {currentStepData.from && currentStepData.to && (
                <p style={{ color: 'white' }}><strong style={{ color: '#00ff9d' }}>Explorando:</strong> {currentStepData.from} → {currentStepData.to}</p>
              )}
              {currentStepData.distance !== undefined && (
                <p style={{ color: 'white' }}><strong style={{ color: '#00ff9d' }}>Distancia:</strong> {currentStepData.distance}</p>
              )}
              {currentStepData.queue && (
                <p style={{ color: 'white' }}><strong style={{ color: '#00ff9d' }}>Cola:</strong> [{currentStepData.queue.join(', ')}]</p>
              )}
              {currentStepData.stack && (
                <p style={{ color: 'white' }}><strong style={{ color: '#00ff9d' }}>Pila:</strong> [{currentStepData.stack.join(', ')}]</p>
              )}
            </div>
          </div>
        )}

        {/* Resultado final */}
        {result && !isAnimating && (
          <div style={{ marginTop: '16px', background: 'rgba(20,20,20,0.9)', borderRadius: '16px', padding: '16px' }}>
            <h3 style={{ color: '#00ff9d', marginBottom: '12px', fontSize: '16px' }}>📊 Resultado</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', fontSize: '13px' }}>
              {result.visited && (
                <p style={{ color: 'white' }}><strong style={{ color: '#00ff9d' }}>Visitados:</strong> {result.visited.join(' → ')}</p>
              )}
              {result.path && result.path.length > 0 && (
                <p style={{ color: 'white' }}><strong style={{ color: '#00ff9d' }}>Camino:</strong> {result.path.join(' → ')}</p>
              )}
              {result.distance !== undefined && result.distance !== -1 && (
                <p style={{ color: 'white' }}><strong style={{ color: '#00ff9d' }}>Distancia:</strong> {result.distance}</p>
              )}
              {result.hasCycle !== undefined && (
                <p style={{ color: 'white' }}><strong style={{ color: '#00ff9d' }}>¿Ciclo?</strong> {result.hasCycle ? '✅ Sí' : '❌ No'}</p>
              )}
              {result.isBipartite !== undefined && (
                <p style={{ color: 'white' }}><strong style={{ color: '#00ff9d' }}>¿Bipartito?</strong> {result.isBipartite ? '✅ Sí' : '❌ No'}</p>
              )}
              {result.sorted && result.sorted.length > 0 && (
                <p style={{ color: 'white' }}><strong style={{ color: '#00ff9d' }}>Orden:</strong> {result.sorted.join(' → ')}</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GraphsPage;