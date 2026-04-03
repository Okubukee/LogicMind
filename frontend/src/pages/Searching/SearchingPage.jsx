
import { useState, useEffect } from 'react';
import { runSearch, getSearchingAlgorithmsInfo } from './api';
import AlgorithmCards from './AlgorithmCards';

const SearchingPage = () => {
  const [mode, setMode] = useState('selecting');
  const [algorithmsInfo, setAlgorithmsInfo] = useState({});
  const [algorithm, setAlgorithm] = useState('binary');
  const [array, setArray] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]);
  const [target, setTarget] = useState(7);
  const [searchResult, setSearchResult] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [speed, setSpeed] = useState(500);
  const [error, setError] = useState(null);
  const [stopSearch, setStopSearch] = useState(false);

  useEffect(() => {
    const loadAlgorithms = async () => {
      try {
        const info = await getSearchingAlgorithmsInfo();
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
    setSearchResult(null);
    setSteps([]);
    setCurrentStep(0);
  };

  const generateRandomArray = () => {
    const newArray = Array.from({ length: 15 }, () => Math.floor(Math.random() * 90) + 10);
    newArray.sort((a, b) => a - b);
    setArray(newArray);
    setSearchResult(null);
    setSteps([]);
    setCurrentStep(0);
  };

  const updateArrayValue = (index, value) => {
    const newArray = [...array];
    newArray[index] = value;
    newArray.sort((a, b) => a - b);
    setArray(newArray);
    setSearchResult(null);
    setSteps([]);
    setCurrentStep(0);
  };

  const visualizeSearch = async () => {
    setIsSearching(true);
    setError(null);
    setSearchResult(null);
    setSteps([]);
    setCurrentStep(0);
    setStopSearch(false);
    
    try {
      const result = await runSearch(algorithm, array, target);
      setSteps(result.steps);
      
      
      for (let i = 0; i < result.steps.length && !stopSearch; i++) {
        setCurrentStep(i);
        await new Promise(resolve => setTimeout(resolve, speed));
      }
      
      setSearchResult(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSearching(false);
    }
  };

  const stopVisualization = () => {
    setStopSearch(true);
    setIsSearching(false);
  };

  const currentStepData = steps[currentStep] || {};
  const currentAlgo = algorithmsInfo[algorithm] || { name: algorithm, icon: '🔍' };

  
  const renderArray = () => {
    return (
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: '8px',
        marginBottom: '24px'
      }}>
        {array.map((value, idx) => {
          let isHighlighted = false;
          let highlightColor = '';
          
          if (currentStepData) {
            if (currentStepData.index === idx || currentStepData.mid === idx || currentStepData.pos === idx || currentStepData.i === idx) {
              isHighlighted = true;
              highlightColor = currentStepData.isTarget ? '#22c55e' : '#fbbf24';
            }
            if (currentStepData.left === idx) highlightColor = '#3b82f6';
            if (currentStepData.right === idx) highlightColor = '#3b82f6';
            if (currentStepData.mid1 === idx || currentStepData.mid2 === idx) highlightColor = '#fbbf24';
          }
          
          return (
            <div
              key={idx}
              style={{
                width: '60px',
                height: '60px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: isHighlighted ? highlightColor : '#1f2937',
                color: isHighlighted && highlightColor === '#22c55e' ? '#000' : 'white',
                borderRadius: '8px',
                fontSize: '18px',
                fontWeight: 'bold',
                border: '1px solid rgba(0, 255, 157, 0.3)',
                transition: 'all 0.3s ease',
                position: 'relative'
              }}
            >
              {value}
              <span style={{
                position: 'absolute',
                bottom: '-20px',
                fontSize: '10px',
                color: '#6b7280'
              }}>
                {idx}
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  if (mode === 'selecting') {
    return <AlgorithmCards algorithmsInfo={algorithmsInfo} onSelectAlgorithm={handleSelectAlgorithm} />;
  }

  return (
    <div style={{ padding: '40px 24px' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ marginBottom: '24px' }}>
          <button 
            onClick={() => setMode('selecting')}
            style={{
              padding: '10px 20px',
              borderRadius: '40px',
              background: 'rgba(0, 255, 157, 0.1)',
              border: '1px solid #00ff9d',
              color: '#00ff9d',
              cursor: 'pointer',
              marginBottom: '20px'
            }}
          >
            ← Ver todos los algoritmos
          </button>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ fontSize: '56px' }}>{currentAlgo.icon}</span>
            <div>
              <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: 'white' }}>
                {currentAlgo.name}
              </h1>
              <p style={{ color: '#9ca3af' }}>{currentAlgo.description}</p>
            </div>
          </div>
        </div>

        {/* Controles */}
        <div style={{
          background: 'rgba(20, 20, 20, 0.9)',
          borderRadius: '28px',
          padding: '28px',
          marginBottom: '32px',
          border: '1px solid rgba(0, 255, 157, 0.2)'
        }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center', marginBottom: '16px' }}>
            <select 
              value={algorithm} 
              onChange={(e) => setAlgorithm(e.target.value)}
              style={{ background: '#1a1a1a', color: 'white', border: '1px solid #00ff9d', borderRadius: '12px', padding: '10px 14px' }}
            >
              {Object.values(algorithmsInfo).map(algo => (
                <option key={algo.id} value={algo.id}>{algo.icon} {algo.name}</option>
              ))}
            </select>
            
            <button onClick={generateRandomArray} style={{ padding: '12px 24px', borderRadius: '16px', background: 'linear-gradient(135deg, #00ff9d, #10b981)', color: '#000', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}>
              🎲 Array Aleatorio
            </button>
            
            <button onClick={visualizeSearch} disabled={isSearching} style={{ padding: '12px 24px', borderRadius: '16px', background: 'linear-gradient(135deg, #00ff9d, #10b981)', color: '#000', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}>
              {isSearching ? '⏳ Buscando...' : '🔍 Visualizar'}
            </button>
            
            {isSearching && (
              <button onClick={stopVisualization} style={{ padding: '12px 24px', borderRadius: '16px', background: '#ef4444', color: 'white', border: 'none', cursor: 'pointer' }}>
                ⏹ Detener
              </button>
            )}
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#1a1a1a', padding: '8px 16px', borderRadius: '16px' }}>
              <span>⚡</span>
              <input type="range" min="100" max="1000" value={speed} onChange={(e) => setSpeed(Number(e.target.value))} />
              <span>{speed}ms</span>
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: 'white' }}>Valor a buscar:</span>
              <input
                type="number"
                value={target}
                onChange={(e) => setTarget(Number(e.target.value))}
                style={{ background: '#1a1a1a', color: 'white', border: '1px solid #00ff9d', borderRadius: '8px', padding: '8px 12px', width: '80px' }}
              />
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: 'white' }}>Editar array:</span>
              {array.map((val, idx) => (
                <input
                  key={idx}
                  type="number"
                  value={val}
                  onChange={(e) => updateArrayValue(idx, Number(e.target.value))}
                  style={{ background: '#1a1a1a', color: 'white', border: '1px solid #00ff9d', borderRadius: '4px', padding: '4px', width: '45px', textAlign: 'center' }}
                />
              ))}
            </div>
          </div>
        </div>

        {error && (
          <div style={{ background: 'rgba(239,68,68,0.2)', border: '1px solid #ef4444', borderRadius: '16px', padding: '12px', marginBottom: '20px', color: '#fecaca' }}>
            ❌ {error}
          </div>
        )}

        {/* Visualización del Array */}
        <div style={{
          background: 'rgba(20, 20, 20, 0.9)',
          borderRadius: '28px',
          padding: '28px',
          marginBottom: '32px',
          border: '1px solid rgba(0, 255, 157, 0.2)'
        }}>
          <h3 style={{ color: '#00ff9d', marginBottom: '20px' }}>Array de búsqueda</h3>
          {renderArray()}
          <div style={{ marginTop: '20px', textAlign: 'center', color: '#00ff9d' }}>
            {currentStepData && (
              <div>
                <p>Paso {currentStep + 1} / {steps.length || 1}</p>
                {currentStepData.type && <p>Tipo: {currentStepData.type}</p>}
                {currentStepData.left !== undefined && <p>Rango: [{currentStepData.left} - {currentStepData.right}]</p>}
                {currentStepData.mid !== undefined && <p>Posición media: {currentStepData.mid}</p>}
              </div>
            )}
          </div>
        </div>

        {/* Resultados */}
        {searchResult && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <div style={{ background: 'rgba(20,20,20,0.9)', borderRadius: '20px', padding: '20px' }}>
              <h3 style={{ color: '#00ff9d', marginBottom: '16px' }}>📊 Resultado</h3>
              <p style={{ color: 'white' }}>
                <strong style={{ color: '#00ff9d' }}>Elemento:</strong> {target}
              </p>
              <p style={{ color: 'white' }}>
                <strong style={{ color: '#00ff9d' }}>¿Encontrado?</strong> {searchResult.found ? '✅ Sí' : '❌ No'}
              </p>
              <p style={{ color: 'white' }}>
                <strong style={{ color: '#00ff9d' }}>Posición:</strong> {searchResult.index !== -1 ? searchResult.index : 'No encontrado'}
              </p>
              <p style={{ color: 'white' }}>
                <strong style={{ color: '#00ff9d' }}>Comparaciones:</strong> {searchResult.checks}
              </p>
            </div>
            <div style={{ background: 'rgba(20,20,20,0.9)', borderRadius: '20px', padding: '20px' }}>
              <h3 style={{ color: '#00ff9d', marginBottom: '16px' }}>📈 Información</h3>
              <p style={{ color: 'white' }}><strong style={{ color: '#00ff9d' }}>Complejidad:</strong> {currentAlgo.complexity}</p>
              <p style={{ color: 'white' }}><strong style={{ color: '#00ff9d' }}>Espacio:</strong> {currentAlgo.space}</p>
              <p style={{ color: 'white' }}><strong style={{ color: '#00ff9d' }}>Mejor caso:</strong> {currentAlgo.bestCase}</p>
              <p style={{ color: 'white' }}><strong style={{ color: '#00ff9d' }}>Peor caso:</strong> {currentAlgo.worstCase}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchingPage;