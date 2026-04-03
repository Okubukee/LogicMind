from algorithms.binary_insertion_sort import binary_insertion_sort
from algorithms.bitonic_sort import bitonic_sort
from algorithms.block_sort import block_sort
from algorithms.bubble_sort import bubble_sort
from algorithms.bucket_sort import bucket_sort
from algorithms.burst_sort import burst_sort


ALGORITHMS = {
    'binary_insertion': {
        'func': binary_insertion_sort,
        'name': 'Binary Insertion Sort',
        'icon': '🔍',
        'description': 'Insertion sort que usa búsqueda binaria para encontrar la posición.',
        'complexity': 'O(n²)',
        'space': 'O(1)',
        'bestCase': 'O(n log n)',
        'worstCase': 'O(n²)'
    },
    'bitonic': {
        'func': bitonic_sort,
        'name': 'Bitonic Sort',
        'icon': '🎼',
        'description': 'Algoritmo paralelo que crea secuencias bitónicas.',
        'complexity': 'O(n log² n)',
        'space': 'O(1)',
        'bestCase': 'O(n log² n)',
        'worstCase': 'O(n log² n)'
    },
    'block': {
        'func': block_sort,
        'name': 'Block Sort',
        'icon': '🧱',
        'description': 'Versión estable de Merge Sort que trabaja con bloques.',
        'complexity': 'O(n log n)',
        'space': 'O(1)',
        'bestCase': 'O(n log n)',
        'worstCase': 'O(n log n)'
    },
    'bubble': {
        'func': bubble_sort,
        'name': 'Bubble Sort',
        'icon': '🫧',
        'description': 'Compara elementos adyacentes y los intercambia si están en orden incorrecto.',
        'complexity': 'O(n²)',
        'space': 'O(1)',
        'bestCase': 'O(n)',
        'worstCase': 'O(n²)'
    },
    'bucket': {
        'func': bucket_sort,
        'name': 'Bucket Sort',
        'icon': '🪣',
        'description': 'Distribuye los elementos en cubos y ordena cada uno.',
        'complexity': 'O(n + k)',
        'space': 'O(n + k)',
        'bestCase': 'O(n + k)',
        'worstCase': 'O(n²)'
    },
    'burst': {
        'func': burst_sort,
        'name': 'Burst Sort',
        'icon': '💥',
        'description': 'Basado en un árbol trie que "explota" cuando un nodo está lleno.',
        'complexity': 'O(n log n)',
        'space': 'O(n)',
        'bestCase': 'O(n)',
        'worstCase': 'O(n log n)'
    }
}

def get_algorithms_info():
    """Devuelve información de todos los algoritmos disponibles"""
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
        for algo_id, info in ALGORITHMS.items()
    }

def execute_sort(algorithm_name, array):
    if algorithm_name not in ALGORITHMS:
        raise ValueError(f"Algorithm '{algorithm_name}' not found")
    
    algorithm_func = ALGORITHMS[algorithm_name]['func']
    steps = algorithm_func(array.copy())
    
    return {
        'algorithm': algorithm_name,
        'steps': steps,
        'total_steps': len(steps)
    }
