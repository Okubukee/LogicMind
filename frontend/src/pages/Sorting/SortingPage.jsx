import { useState, useEffect, useRef } from 'react';
import BarChart from '../../components/BarChart';
import { runSort, getAlgorithmsInfo } from '../../services/api';
import pseudocodeData from '../../data/pseudocode.json';


const ALLOWED_ALGORITHMS = ['binary_insertion', 'bitonic', 'block', 'bubble', 'bucket', 'burst'];

const AlgorithmCards = ({ algorithmsInfo, onSelectAlgorithm }) => {
  const filteredAlgorithms = Object.values(algorithmsInfo).filter(algo => ALLOWED_ALGORITHMS.includes(algo.id));

  return (
    <div style={{ padding: '40px 24px' }}>
      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '16px' }}>
          <span style={{ fontSize: '48px' }}>📊</span>
          <h2 style={{ fontSize: '32px', fontWeight: 'bold', color: 'white' }}>
            Elige un algoritmo
          </h2>
        </div>
        <p style={{ color: '#9ca3af', maxWidth: '600px', margin: '0 auto' }}>
          Cada algoritmo ordena de forma diferente. ¡Explora cómo funcionan y compara sus eficiencias!
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
        gap: '28px',
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        {filteredAlgorithms.map(algo => (
          <div
            key={algo.id}
            onClick={() => onSelectAlgorithm(algo.id)}
            style={{
              background: 'rgba(20, 20, 20, 0.9)',
              backdropFilter: 'blur(16px)',
              borderRadius: '28px',
              padding: '28px',
              border: '1px solid rgba(0, 255, 157, 0.2)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)';
              e.currentTarget.style.borderColor = '#00ff9d';
              e.currentTarget.style.boxShadow = '0 0 30px rgba(0, 255, 157, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.borderColor = 'rgba(0, 255, 157, 0.2)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div style={{
              position: 'absolute',
              top: -50,
              right: -50,
              width: '150px',
              height: '150px',
              background: 'linear-gradient(135deg, #00ff9d, #10b981)',
              opacity: 0.05,
              borderRadius: '50%'
            }} />
            
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div style={{ fontSize: '72px', marginBottom: '12px' }}>{algo.icon}</div>
              <h3 style={{
                fontSize: '26px',
                fontWeight: 'bold',
                background: 'linear-gradient(135deg, #00ff9d, #10b981)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                marginBottom: '8px'
              }}>
                {algo.name}
              </h3>
            </div>
            
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '12px',
              marginBottom: '20px',
              flexWrap: 'wrap'
            }}>
              <span style={{
                background: 'rgba(0, 255, 157, 0.1)',
                padding: '6px 14px',
                borderRadius: '20px',
                fontSize: '12px',
                color: '#00ff9d'
              }}>
                ⏱️ {algo.complexity}
              </span>
              <span style={{
                background: 'rgba(0, 255, 157, 0.1)',
                padding: '6px 14px',
                borderRadius: '20px',
                fontSize: '12px',
                color: '#00ff9d'
              }}>
                💾 {algo.space}
              </span>
            </div>
            
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '12px',
              marginBottom: '20px',
              fontSize: '11px',
              color: '#9ca3af'
            }}>
              <span>✨ Mejor: {algo.bestCase || 'N/A'}</span>
              <span>⚠️ Peor: {algo.worstCase || 'N/A'}</span>
            </div>
            
            <p style={{
              color: '#9ca3af',
              fontSize: '14px',
              lineHeight: '1.6',
              textAlign: 'center',
              marginBottom: '24px'
            }}>
              {algo.description}
            </p>
            
            <button style={{
              width: '100%',
              padding: '14px',
              borderRadius: '40px',
              border: 'none',
              background: 'linear-gradient(135deg, #00ff9d, #10b981)',
              color: '#000000',
              fontWeight: 'bold',
              fontSize: '15px',
              cursor: 'pointer',
              transition: 'transform 0.2s ease'
            }}
            onMouseEnter={(e) => e.target.style.transform = 'scale(1.02)'}
            onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
            >
              Visualizar algoritmo →
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};


const SortingPage = () => {
  const [mode, setMode] = useState('selecting');
  const [algorithmsInfo, setAlgorithmsInfo] = useState({});
  const [algorithmsList, setAlgorithmsList] = useState(ALLOWED_ALGORITHMS);
  const [isLoading, setIsLoading] = useState(true);
  const [array, setArray] = useState([64, 34, 25, 12, 22, 11, 90]);
  const [algorithm, setAlgorithm] = useState('bubble');
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speedMultiplier, setSpeedMultiplier] = useState(1);
  const [error, setError] = useState(null);
  
  const intervalRef = useRef(null);
  const stepsRef = useRef([]);
  const currentStepRef = useRef(0);
  const isPlayingRef = useRef(false);
  const speedMultiplierRef = useRef(1);

  const speedOptions = [
    { label: '0.25x', value: 0.25, delay: 2000 },
    { label: '0.5x', value: 0.5, delay: 1000 },
    { label: '1x', value: 1, delay: 500 },
    { label: '2x', value: 2, delay: 250 },
    { label: '3x', value: 3, delay: 167 },
    { label: '4x', value: 4, delay: 125 },
    { label: '5x', value: 5, delay: 100 }
  ];

  
  useEffect(() => {
    stepsRef.current = steps;
    currentStepRef.current = currentStep;
    isPlayingRef.current = isPlaying;
    speedMultiplierRef.current = speedMultiplier;
  });

  
  useEffect(() => {
    if (isPlayingRef.current && stepsRef.current.length > 0) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      const stepsData = stepsRef.current;
      let stepIndex = currentStepRef.current;
      const getDelay = () => {
        const option = speedOptions.find(opt => opt.value === speedMultiplierRef.current);
        return option ? option.delay : 500;
      };
      const animate = () => {
        if (stepIndex < stepsData.length - 1) {
          stepIndex++;
          setCurrentStep(stepIndex);
        } else {
          if (intervalRef.current) clearInterval(intervalRef.current);
          setIsPlaying(false);
        }
      };
      intervalRef.current = setInterval(animate, getDelay());
    }
  }, [speedMultiplier]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  
  useEffect(() => {
    const loadAlgorithms = async () => {
      setIsLoading(true);
      try {
        const info = await getAlgorithmsInfo();
        const filteredInfo = {};
        for (const algo of ALLOWED_ALGORITHMS) {
          if (info[algo]) {
            filteredInfo[algo] = info[algo];
          } else {
            filteredInfo[algo] = {
              id: algo,
              name: algo.replace('_', ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
              icon: '📊',
              description: 'Algoritmo de ordenamiento',
              complexity: 'O(n log n)',
              space: 'O(n)',
              bestCase: 'O(n log n)',
              worstCase: 'O(n log n)'
            };
          }
        }
        setAlgorithmsInfo(filteredInfo);
        setAlgorithmsList(ALLOWED_ALGORITHMS);
        if (ALLOWED_ALGORITHMS.length > 0) setAlgorithm(ALLOWED_ALGORITHMS[0]);
      } catch (err) {
        console.error('Error:', err);
        setError('Error cargando algoritmos');
      } finally {
        setIsLoading(false);
      }
    };
    loadAlgorithms();
  }, []);

  const generateRandomArray = () => {
    const newArray = Array.from({ length: 15 }, () => Math.floor(Math.random() * 90) + 10);
    setArray(newArray);
    setSteps([]);
    setCurrentStep(0);
    setIsPlaying(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const visualizeSort = async () => {
    if (isPlaying) return;
    setError(null);
    try {
      const result = await runSort(algorithm, array);
      setSteps(result.steps);
      setCurrentStep(0);
      setIsPlaying(true);
      if (intervalRef.current) clearInterval(intervalRef.current);
      const stepsData = result.steps;
      let stepIndex = 0;
      const getDelay = () => {
        const option = speedOptions.find(opt => opt.value === speedMultiplier);
        return option ? option.delay : 500;
      };
      const animate = () => {
        if (stepIndex < stepsData.length - 1) {
          stepIndex++;
          setCurrentStep(stepIndex);
        } else {
          if (intervalRef.current) clearInterval(intervalRef.current);
          setIsPlaying(false);
        }
      };
      intervalRef.current = setInterval(animate, getDelay());
    } catch (err) {
      setError(err.message);
      setIsPlaying(false);
    }
  };

  const stopAnimation = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsPlaying(false);
  };

  const stepBackward = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
        setIsPlaying(false);
      }
    }
  };

  const stepForward = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
        setIsPlaying(false);
      }
    }
  };

  const handleSelectAlgorithm = (algoId) => {
    setAlgorithm(algoId);
    setMode('visualizing');
    setSteps([]);
    setCurrentStep(0);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const currentState = steps[currentStep] || { array, comparing: [], swapping: [] };
  const currentPseudo = pseudocodeData[algorithm] || pseudocodeData.bubble;

  const getAlgorithmName = (algoId) => algorithmsInfo[algoId]?.name || algoId;
  const getAlgorithmIcon = (algoId) => algorithmsInfo[algoId]?.icon || '📊';

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: '#00ff9d' }}>
        Cargando algoritmos...
      </div>
    );
  }

  if (mode === 'selecting') {
    return <AlgorithmCards algorithmsInfo={algorithmsInfo} onSelectAlgorithm={handleSelectAlgorithm} />;
  }

  const currentAlgoInfo = algorithmsInfo[algorithm] || { name: algorithm, icon: '📊' };

  return (
    <div style={{ padding: '40px 24px' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        
        {/* Botón para volver a las tarjetas */}
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
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            ← Ver todos los algoritmos
          </button>
        </div>

        {/* Header del algoritmo seleccionado */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
          <span style={{ fontSize: '56px' }}>{currentAlgoInfo.icon}</span>
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: 'white' }}>
              {currentAlgoInfo.name}
            </h1>
            <p style={{ color: '#9ca3af' }}>Visualiza cómo funciona este algoritmo paso a paso</p>
          </div>
        </div>

        {/* Controles */}
        <div style={{
          background: 'rgba(20, 20, 20, 0.9)',
          backdropFilter: 'blur(16px)',
          borderRadius: '28px',
          padding: '28px',
          marginBottom: '32px',
          border: '1px solid rgba(0, 255, 157, 0.2)'
        }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center', marginBottom: '20px' }}>
            
            {/* Selector de algoritmo */}
            <select 
              value={algorithm} 
              onChange={(e) => { setAlgorithm(e.target.value); setSteps([]); setCurrentStep(0); }}
              disabled={isPlaying}
              style={{ background: '#1a1a1a', color: 'white', border: '1px solid #00ff9d', borderRadius: '12px', padding: '10px 14px', minWidth: '150px' }}
            >
              {algorithmsList.map(algoId => (
                <option key={algoId} value={algoId}>
                  {getAlgorithmIcon(algoId)} {getAlgorithmName(algoId)}
                </option>
              ))}
            </select>

            <button onClick={generateRandomArray} style={{ padding: '12px 24px', borderRadius: '16px', background: 'linear-gradient(135deg, #00ff9d, #10b981)', color: '#000', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}>
              🎲 Array Aleatorio
            </button>

            <button onClick={visualizeSort} style={{ padding: '12px 24px', borderRadius: '16px', background: 'linear-gradient(135deg, #00ff9d, #10b981)', color: '#000', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}>
              ▶ Visualizar
            </button>

            {isPlaying && (
              <button onClick={stopAnimation} style={{ padding: '12px 24px', borderRadius: '16px', background: '#ef4444', color: 'white', border: 'none', cursor: 'pointer' }}>
                ⏹ Detener
              </button>
            )}

            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={stepBackward} style={{ padding: '12px 20px', borderRadius: '16px', background: '#4b5563', color: 'white', border: 'none', cursor: 'pointer' }} disabled={!steps.length || currentStep === 0}>
                ◀ Anterior
              </button>
              <button onClick={stepForward} style={{ padding: '12px 20px', borderRadius: '16px', background: '#4b5563', color: 'white', border: 'none', cursor: 'pointer' }} disabled={!steps.length || currentStep === steps.length - 1}>
                Siguiente ▶
              </button>
            </div>

            {/* Selector de velocidad */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#1a1a1a', padding: '8px 16px', borderRadius: '16px' }}>
              <span>⚡</span>
              <select 
                value={speedMultiplier} 
                onChange={(e) => setSpeedMultiplier(parseFloat(e.target.value))}
                style={{ background: '#2d2d2d', color: 'white', border: '1px solid #00ff9d', borderRadius: '8px', padding: '6px 12px' }}
              >
                {speedOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>
          
          {error && (
            <div style={{ background: 'rgba(239,68,68,0.2)', border: '1px solid #ef4444', borderRadius: '16px', padding: '12px', marginBottom: '20px', color: '#fecaca' }}>
              ❌ {error}
            </div>
          )}
          
          <BarChart key={currentStep} data={currentState.array} comparing={currentState.comparing} swapping={currentState.swapping} />
          
          <div style={{ marginTop: '20px', textAlign: 'center', color: '#00ff9d' }}>
            Paso {currentStep + 1} / {steps.length || 1}
          </div>
        </div>

        {/* Información */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          <div style={{ background: 'rgba(20,20,20,0.9)', borderRadius: '20px', padding: '20px', border: '1px solid rgba(0,255,157,0.3)' }}>
            <h3 style={{ color: '#00ff9d', marginBottom: '16px' }}>📈 Estado Actual</h3>
            <p style={{ color: 'white' }}><strong style={{ color: '#00ff9d' }}>Comparando:</strong> <span style={{ color: currentState.comparing.length > 0 ? '#fbbf24' : '#9ca3af' }}>{currentState.comparing.join(', ') || 'Ninguno'}</span></p>
            <p style={{ color: 'white' }}><strong style={{ color: '#00ff9d' }}>Intercambiando:</strong> <span style={{ color: currentState.swapping.length > 0 ? '#f87171' : '#9ca3af' }}>{currentState.swapping.join(', ') || 'Ninguno'}</span></p>
            <p style={{ color: 'white', fontFamily: 'monospace', marginTop: '12px', background: 'rgba(0,0,0,0.5)', padding: '8px', borderRadius: '8px' }}>
              Array: [{currentState.array?.join(', ')}]
            </p>
          </div>
          <div style={{ background: 'rgba(20,20,20,0.9)', borderRadius: '20px', padding: '20px', border: '1px solid rgba(0,255,157,0.3)' }}>
            <h3 style={{ color: '#00ff9d' }}>📝 {currentPseudo.title}</h3>
            <pre style={{ color: '#6ee7b7', fontSize: '12px', whiteSpace: 'pre-wrap', background: 'rgba(0,0,0,0.5)', padding: '12px', borderRadius: '8px' }}>
              {currentPseudo.code}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SortingPage;
