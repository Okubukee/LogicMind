from algorithms.graphs.dfs_traversal import dfs_traversal
from algorithms.graphs.bfs_traversal import bfs_traversal
from algorithms.graphs.dijkstra_shortest_path import dijkstra_shortest_path
from algorithms.graphs.detect_cycle import detect_cycle
from algorithms.graphs.bipartite_check import bipartite_check
from algorithms.graphs.topological_sort import topological_sort

GRAPHS_ALGORITHMS = {
    'dfs': {
        'func': dfs_traversal,
        'name': 'DFS Traversal',
        'icon': '🌲',
        'description': 'Recorrido en profundidad (Depth-First Search)',
        'complexity': 'O(V + E)',
        'space': 'O(V)'
    },
    'bfs': {
        'func': bfs_traversal,
        'name': 'BFS Traversal',
        'icon': '🌊',
        'description': 'Recorrido en amplitud (Breadth-First Search)',
        'complexity': 'O(V + E)',
        'space': 'O(V)'
    },
    'dijkstra': {
        'func': dijkstra_shortest_path,
        'name': 'Dijkstra',
        'icon': '🔍',
        'description': 'Camino más corto desde un nodo origen',
        'complexity': 'O((V + E) log V)',
        'space': 'O(V)'
    },
    'detect_cycle': {
        'func': detect_cycle,
        'name': 'Cycle Detection',
        'icon': '🔄',
        'description': 'Detecta ciclos en el grafo',
        'complexity': 'O(V + E)',
        'space': 'O(V)'
    },
    'bipartite': {
        'func': bipartite_check,
        'name': 'Bipartite Check',
        'icon': '🎨',
        'description': 'Verifica si el grafo es bipartito',
        'complexity': 'O(V + E)',
        'space': 'O(V)'
    },
    'topological': {
        'func': topological_sort,
        'name': 'Topological Sort',
        'icon': '📊',
        'description': 'Ordenamiento topológico (solo grafos DAG)',
        'complexity': 'O(V + E)',
        'space': 'O(V)'
    }
}

def get_graphs_algorithms_info():
    return {
        algo_id: {
            'id': algo_id,
            'name': info['name'],
            'icon': info['icon'],
            'description': info['description'],
            'complexity': info['complexity'],
            'space': info['space']
        }
        for algo_id, info in GRAPHS_ALGORITHMS.items()
    }

def execute_graph_algorithm(algorithm_name, nodes, edges, start=None, end=None):
    if algorithm_name not in GRAPHS_ALGORITHMS:
        raise ValueError(f"Algorithm '{algorithm_name}' not found")
    
    algorithm_func = GRAPHS_ALGORITHMS[algorithm_name]['func']
    
    if algorithm_name == 'dijkstra':
        result = algorithm_func(nodes, edges, start, end)
    elif algorithm_name in ['dfs', 'bfs']:
        result = algorithm_func(nodes, edges, start)
    else:
        result = algorithm_func(nodes, edges)
    
    return result
