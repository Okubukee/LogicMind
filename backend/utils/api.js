const API_URL = 'http://localhost:5000/api';

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
