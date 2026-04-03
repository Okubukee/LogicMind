import React from 'react';

const Navbar = ({ currentPage, onNavigate, onViewModeChange, currentViewMode }) => {
  const categories = [
    { id: 'home', name: 'Inicio', icon: '🏠' },
    { id: 'sorting', name: 'Ordenamiento', icon: '📊' },
    { id: 'pathfinding', name: 'Pathfinding', icon: '🗺️' },
    { id: 'searching', name: 'Búsqueda', icon: '🔍' },
    { id: 'graphs', name: 'Grafos', icon: '🔗' }
  ];

  return (
    <nav style={{
      background: 'rgba(0, 0, 0, 0.95)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid rgba(0, 255, 157, 0.3)',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '12px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => onNavigate('home')}>
          <span style={{ fontSize: '28px' }}>🧠</span>
          <span style={{ fontSize: '20px', fontWeight: 'bold', background: 'linear-gradient(135deg, #00ff9d, #10b981)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            LogicMind
          </span>
        </div>
        
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => onNavigate(cat.id)}
              style={{
                padding: '10px 20px',
                borderRadius: '40px',
                border: 'none',
                background: currentPage === cat.id ? 'linear-gradient(135deg, #00ff9d, #10b981)' : 'rgba(255,255,255,0.05)',
                color: currentPage === cat.id ? '#000000' : '#ffffff',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.3s ease'
              }}
            >
              <span>{cat.icon}</span>
              {cat.name}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
