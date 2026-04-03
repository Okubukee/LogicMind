import React from 'react';
import pathfindingAlgorithms from '../data/pathfindingAlgorithms.json';

const AlgorithmCards = ({ onSelectAlgorithm }) => {
  const algorithms = Object.values(pathfindingAlgorithms);

  return (
    <div style={{ padding: '40px 24px' }}>
      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '16px' }}>
          <span style={{ fontSize: '48px' }}>🗺️</span>
          <h2 style={{ fontSize: '32px', fontWeight: 'bold', color: 'white' }}>
            Elige un algoritmo de Pathfinding
          </h2>
        </div>
        <p style={{ color: '#9ca3af', maxWidth: '600px', margin: '0 auto' }}>
          Los algoritmos de pathfinding encuentran la ruta más corta entre dos puntos en un mapa.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
        gap: '28px',
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        {algorithms.map(algo => (
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

export default AlgorithmCards;
