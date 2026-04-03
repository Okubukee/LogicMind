from algorithms.searching.linear_search import linear_search
from algorithms.searching.binary_search import binary_search
from algorithms.searching.jump_search import jump_search
from algorithms.searching.interpolation_search import interpolation_search
from algorithms.searching.exponential_search import exponential_search
from algorithms.searching.ternary_search import ternary_search
from algorithms.searching.fibonacci_search import fibonacci_search

SEARCHING_ALGORITHMS = {
    'linear': {
        'func': linear_search,
        'name': 'Linear Search',
        'icon': '🔍',
        'description': 'Busca elemento por elemento secuencialmente. Simple pero ineficiente para grandes conjuntos.',
        'complexity': 'O(n)',
        'space': 'O(1)',
        'bestCase': 'O(1)',
        'worstCase': 'O(n)'
    },
    'binary': {
        'func': binary_search,
        'name': 'Binary Search',
        'icon': '⚡',
        'description': 'Divide el array en mitades repetidamente. Requiere array ordenado.',
        'complexity': 'O(log n)',
        'space': 'O(1)',
        'bestCase': 'O(1)',
        'worstCase': 'O(log n)'
    },
    'jump': {
        'func': jump_search,
        'name': 'Jump Search',
        'icon': '🦘',
        'description': 'Salta bloques de tamaño √n y luego busca linealmente. Requiere array ordenado.',
        'complexity': 'O(√n)',
        'space': 'O(1)',
        'bestCase': 'O(√n)',
        'worstCase': 'O(√n)'
    },
    'interpolation': {
        'func': interpolation_search,
        'name': 'Interpolation Search',
        'icon': '📈',
        'description': 'Estima la posición basándose en los valores. Requiere array ordenado y uniformemente distribuido.',
        'complexity': 'O(log log n)',
        'space': 'O(1)',
        'bestCase': 'O(1)',
        'worstCase': 'O(n)'
    },
    'exponential': {
        'func': exponential_search,
        'name': 'Exponential Search',
        'icon': '📊',
        'description': 'Duplica el rango exponencialmente y luego busca binariamente. Requiere array ordenado.',
        'complexity': 'O(log n)',
        'space': 'O(1)',
        'bestCase': 'O(1)',
        'worstCase': 'O(log n)'
    },
    'ternary': {
        'func': ternary_search,
        'name': 'Ternary Search',
        'icon': '🔱',
        'description': 'Divide el array en tres partes. Requiere array ordenado.',
        'complexity': 'O(log₃ n)',
        'space': 'O(1)',
        'bestCase': 'O(1)',
        'worstCase': 'O(log₃ n)'
    },
    'fibonacci': {
        'func': fibonacci_search,
        'name': 'Fibonacci Search',
        'icon': '🔢',
        'description': 'Usa números de Fibonacci para dividir el array. Requiere array ordenado.',
        'complexity': 'O(log n)',
        'space': 'O(1)',
        'bestCase': 'O(1)',
        'worstCase': 'O(log n)'
    }
}

def get_searching_algorithms_info():
    return {
        algo_id: {
            'id': algo_id,
            'name': info['name'],
            'icon': info['icon'],
            'description': info['description'],
            'complexity': info['complexity'],
            'space': info['space'],
            'bestCase': info['bestCase'],
            'worstCase': info['worstCase']
        }
        for algo_id, info in SEARCHING_ALGORITHMS.items()
    }

def execute_search(algorithm_name, array, target):
    if algorithm_name not in SEARCHING_ALGORITHMS:
        raise ValueError(f"Algorithm '{algorithm_name}' not found")
    
    algorithm_func = SEARCHING_ALGORITHMS[algorithm_name]['func']
    result = algorithm_func(array.copy(), target)
    
    return {
        'algorithm': algorithm_name,
        'found': result['found'],
        'steps': result['steps'],
        'index': result['index'],
        'checks': result['checks']
    }
