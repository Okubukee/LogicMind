
import React from 'react';

const HomePage = ({ onSelectCategory }) => {
  const categories = [
    {
      id: 'sorting',
      name: 'Algoritmos de Ordenamiento',
      icon: '📊',
      description: 'Visualiza cómo funcionan Bubble Sort, Quick Sort, Merge Sort y más',
      color: 'linear-gradient(135deg, #00ff9d, #10b981)',
      algorithms: ['Bubble Sort', 'Quick Sort', 'Merge Sort', 'Insertion Sort', 'Selection Sort']
    },
    {
      id: 'pathfinding',
      name: 'Algoritmos de Pathfinding',
      icon: '🗺️',
      description: 'Encuentra el camino más corto con Dijkstra, A*, BFS y DFS',
      color: 'linear-gradient(135deg, #00ff9d, #10b981)',
      algorithms: ['Dijkstra', 'A*', 'BFS', 'DFS', 'Bellman-Ford', 'Greedy BFS', 'Bidirectional BFS']
    },
    {
      id: 'searching',
      name: 'Algoritmos de Búsqueda',
      icon: '🔍',
      description: 'Explora búsqueda lineal, binaria y más',
      color: 'linear-gradient(135deg, #00ff9d, #10b981)',
      algorithms: ['Búsqueda Lineal', 'Búsqueda Binaria', 'Búsqueda por Saltos']
    },
    {
      id: 'graphs',
      name: 'Estructuras de Grafos',
      icon: '🔗',
      description: 'Visualiza árboles, grafos y sus recorridos',
      color: 'linear-gradient(135deg, #00ff9d, #10b981)',
      algorithms: ['DFS', 'BFS', 'Árboles Binarios', 'Grafos Dirigidos']
    }
  ];

  return (
    <div style={{ padding: '40px 24px' }}>
      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '16px' }}>
          <span style={{ fontSize: '48px' }}>🧠</span>
          <h1 style={{
            fontSize: '48px',
            fontWeight: '800',
            background: 'linear-gradient(135deg, #00ff9d, #10b981)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '16px'
          }}>
            LogicMind
          </h1>
        </div>
        <p style={{ fontSize: '18px', color: '#9ca3af', maxWidth: '600px', margin: '0 auto' }}>
          Explora y visualiza cómo funcionan los algoritmos de forma interactiva
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
        gap: '32px',
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        {categories.map(cat => (
          <div
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
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
              top: 0,
              right: 0,
              width: '100px',
              height: '100px',
              background: cat.color,
              opacity: 0.05,
              borderRadius: '50%',
              transform: 'translate(30%, -30%)'
            }} />
            
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>{cat.icon}</div>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: 'white', marginBottom: '12px' }}>
              {cat.name}
            </h2>
            <p style={{ color: '#9ca3af', marginBottom: '20px', lineHeight: '1.5' }}>
              {cat.description}
            </p>
            
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
              {cat.algorithms.map(algo => (
                <span key={algo} style={{
                  background: 'rgba(0, 255, 157, 0.1)',
                  padding: '4px 12px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  color: '#00ff9d'
                }}>
                  {algo}
                </span>
              ))}
            </div>
            
            <button style={{
              background: cat.color,
              border: 'none',
              padding: '10px 20px',
              borderRadius: '40px',
              color: '#000000',
              fontWeight: 'bold',
              cursor: 'pointer',
              width: '100%',
              transition: 'transform 0.2s ease'
            }}>
              Explorar →
            </button>
          </div>
        ))}
      </div>
      
      <div style={{ textAlign: 'center', marginTop: '60px', color: '#6b7280', fontSize: '14px' }}>
        <p>✨ Próximamente más algoritmos y categorías ✨</p>
      </div>
    </div>
  );
};

export default HomePage;