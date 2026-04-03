const API_URL = 'http://localhost:5000/api';

export const getGraphsAlgorithms = async () => {
  try {
    const response = await fetch(API_URL + '/graphs/algorithms');
    if (!response.ok) throw new Error('Error fetching algorithms');
    return await response.json();
  } catch (error) {
    console.error('Error:', error);
    return ['dfs', 'bfs', 'dijkstra', 'detect_cycle', 'bipartite', 'topological'];
  }
};

export const getGraphsAlgorithmsInfo = async () => {
  try {
    const response = await fetch(API_URL + '/graphs/algorithms/info');
    if (!response.ok) throw new Error('Error fetching algorithms info');
    return await response.json();
  } catch (error) {
    console.error('Error:', error);
    return {};
  }
};

export const runGraphAlgorithm = async (algorithm, nodes, edges, start = null, end = null) => {
  try {
    const response = await fetch(API_URL + '/graphs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ algorithm, nodes, edges, start, end }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Error executing graph algorithm');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};
