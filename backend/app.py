
from flask import Flask, request, jsonify
from flask_cors import CORS
from utils.sort_executor import execute_sort, get_algorithms_info
from utils.searching_executor import execute_search, get_searching_algorithms_info
import traceback

app = Flask(__name__)
CORS(app)

@app.errorhandler(Exception)
def handle_exception(e):
    
    print(f"❌ Error: {str(e)}")
    traceback.print_exc()
    return jsonify({'error': str(e)}), 500

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok'})

# ========== SORTING ENDPOINTS ==========

@app.route('/api/sort', methods=['POST'])
def sort():
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No data provided'}), 400
            
        algorithm = data.get('algorithm', 'bubble')
        array = data.get('array', [64, 34, 25, 12, 22, 11, 90])
        
        print(f"🔄 Ejecutando: {algorithm} con array de {len(array)} elementos")
        
        result = execute_sort(algorithm, array)
        
        print(f"✅ {algorithm} completado. Pasos: {len(result.get('steps', []))}")
        
        return jsonify(result)
    
    except ValueError as e:
        print(f"❌ ValueError: {e}")
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        print(f"❌ Exception: {e}")
        traceback.print_exc()
        return jsonify({'error': f'Error en el algoritmo: {str(e)}'}), 500

@app.route('/api/algorithms', methods=['GET'])
def algorithms():
    try:
        from utils.sort_executor import ALGORITHMS
        return jsonify(list(ALGORITHMS.keys()))
    except Exception as e:
        print(f"❌ Error en /algorithms: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/algorithms/info', methods=['GET'])
def algorithms_info():
    try:
        info = get_algorithms_info()
        return jsonify(info)
    except Exception as e:
        print(f"❌ Error en /algorithms/info: {e}")
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500

# ========== SEARCHING ENDPOINTS ==========

@app.route('/api/searching/algorithms', methods=['GET'])
def searching_algorithms():
    try:
        return jsonify(list(get_searching_algorithms_info().keys()))
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/searching/algorithms/info', methods=['GET'])
def searching_algorithms_info():
    try:
        return jsonify(get_searching_algorithms_info())
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/searching', methods=['POST'])
def searching():
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        algorithm = data.get('algorithm', 'binary')
        array = data.get('array', [1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
        target = data.get('target', 5)
        
        
        array.sort()
        
        result = execute_search(algorithm, array, target)
        return jsonify(result)
    
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        print(f"Error: {e}")
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500
    
    # ========== GRAPHS ENDPOINTS ==========

from utils.graphs_executor import execute_graph_algorithm, get_graphs_algorithms_info

@app.route('/api/graphs/algorithms', methods=['GET'])
def graphs_algorithms():
    try:
        return jsonify(list(get_graphs_algorithms_info().keys()))
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/graphs/algorithms/info', methods=['GET'])
def graphs_algorithms_info():
    try:
        return jsonify(get_graphs_algorithms_info())
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/graphs', methods=['POST'])
def graphs():
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        algorithm = data.get('algorithm', 'dfs')
        nodes = data.get('nodes', ['A', 'B', 'C', 'D', 'E'])
        edges = data.get('edges', [])
        start = data.get('start', nodes[0] if nodes else None)
        end = data.get('end', nodes[-1] if nodes else None)
        
        result = execute_graph_algorithm(algorithm, nodes, edges, start, end)
        return jsonify(result)
    
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        print(f"Error: {e}")
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    print("🚀 Iniciando LogicMind Backend...")
    app.run(host='0.0.0.0', port=5000, debug=True)