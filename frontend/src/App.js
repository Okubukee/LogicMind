import { useState } from 'react';
import Navbar from './components/Layout/Navbar';
import HomePage from './pages/HomePage';
import SortingPage from './pages/Sorting/SortingPage';
import PathfindingPage from './pages/Pathfinding/PathfindingPage';
import SearchingPage from './pages/Searching/SearchingPage';
import GraphsPage from './pages/Graphs/GraphsPage';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onSelectCategory={(cat) => setCurrentPage(cat)} />;
      case 'sorting':
        return <SortingPage />;
      case 'pathfinding':
        return <PathfindingPage />;
      case 'searching':
        return <SearchingPage />;
      case 'graphs':
        return <GraphsPage/>
      default:
        return <HomePage onSelectCategory={(cat) => setCurrentPage(cat)} />;
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(circle at top, #1a1a1a 0%, #0a0a0a 100%)',
      fontFamily: "'Segoe UI', 'Poppins', system-ui, sans-serif"
    }}>
      <Navbar 
        currentPage={currentPage} 
        onNavigate={setCurrentPage}
        onViewModeChange={() => {}}
        currentViewMode="single"
      />
      {renderPage()}
      <style>{`
        button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        select option {
          background: #1a1a1a;
        }
        input[type="range"] {
          -webkit-appearance: none;
          background: linear-gradient(90deg, #00ff9d, #10b981);
          border-radius: 10px;
          height: 4px;
        }
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 16px;
          height: 16px;
          background: #00ff9d;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 0 10px #00ff9d;
        }
        button:hover:not(:disabled) {
          transform: scale(1.02);
          transition: transform 0.2s ease;
        }
      `}</style>
    </div>
  );
}

export default App;
