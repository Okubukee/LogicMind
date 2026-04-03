
const API_URL = 'http://localhost:5000/api';


const ALLOWED_ALGORITHMS = ['binary_insertion', 'bitonic', 'block', 'bubble', 'bucket', 'burst'];

export const getAlgorithms = async () => {
  try {
    const response = await fetch(API_URL + '/algorithms');
    if (!response.ok) throw new Error('Error fetching algorithms');
    const data = await response.json();
    console.log('✅ Algoritmos cargados:', data);
    return data;
  } catch (error) {
    console.warn('⚠️ Usando fallback de algoritmos');
    return ALLOWED_ALGORITHMS;
  }
};

export const getAlgorithmsInfo = async () => {
  try {
    const response = await fetch(API_URL + '/algorithms/info');
    if (!response.ok) throw new Error('Error fetching algorithms info');
    const data = await response.json();
    console.log('✅ Info de algoritmos cargada:', Object.keys(data).length);
    return data;
  } catch (error) {
    console.warn('⚠️ Usando fallback de info');
    const fallbackInfo = {};
    for (const algo of ALLOWED_ALGORITHMS) {
      const name = algo.replace('_', ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      fallbackInfo[algo] = {
        id: algo,
        name: name,
        icon: getIconForAlgorithm(algo),
        description: name,
        complexity: 'O(n log n)',
        space: 'O(n)',
        bestCase: 'O(n log n)',
        worstCase: 'O(n log n)'
      };
    }
    return fallbackInfo;
  }
};

function getIconForAlgorithm(algo) {
  const icons = {
    binary_insertion: '🔍', bitonic: '🎼', block: '🧱',
    bubble: '🫧', bucket: '🪣', burst: '💥'
  };
  return icons[algo] || '📊';
}

export const runSort = async (algorithm, array) => {
  try {
    const response = await fetch(API_URL + '/sort', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ algorithm, array }),
    });
    
    const text = await response.text();
    
    if (!text || text.trim() === '') {
      throw new Error('Respuesta vacia del servidor');
    }
    
    let data;
    try {
      data = JSON.parse(text);
    } catch (parseError) {
      console.error('Respuesta cruda:', text.substring(0, 200));
      throw new Error('Error de formato JSON: ' + parseError.message);
    }
    
    if (!response.ok) {
      throw new Error(data.error || 'HTTP error! status: ' + response.status);
    }
    
    return data;
  } catch (error) {
    console.error('Error en ' + algorithm + ':', error.message);
    throw error;
  }
};

export const getSearchingAlgorithms = async () => {
  try {
    const response = await fetch(API_URL + '/searching/algorithms');
    if (!response.ok) throw new Error('Error fetching algorithms');
    return await response.json();
  } catch (error) {
    console.error('Error:', error);
    return ['linear', 'binary', 'jump', 'interpolation', 'exponential', 'ternary', 'fibonacci'];
  }
};

export const getSearchingAlgorithmsInfo = async () => {
  try {
    const response = await fetch(API_URL + '/searching/algorithms/info');
    if (!response.ok) throw new Error('Error fetching algorithms info');
    return await response.json();
  } catch (error) {
    console.error('Error:', error);
    return {};
  }
};

export const runSearch = async (algorithm, array, target) => {
  try {
    const response = await fetch(API_URL + '/searching', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ algorithm, array, target }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Error executing search');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};