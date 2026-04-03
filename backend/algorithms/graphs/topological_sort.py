from collections import deque

def topological_sort(nodes, edges):
    steps = []
    
    
    in_degree = {node: 0 for node in nodes}
    adj = {node: [] for node in nodes}
    
    for edge in edges:
        u, v = edge['from'], edge['to']
        adj[u].append(v)
        in_degree[v] += 1
    
    
    queue = deque([node for node in nodes if in_degree[node] == 0])
    steps.append({
        'type': 'init',
        'queue': list(queue),
        'inDegree': in_degree.copy()
    })
    
    result = []
    
    while queue:
        current = queue.popleft()
        result.append(current)
        steps.append({
            'type': 'remove',
            'node': current,
            'result': result.copy(),
            'queue': list(queue),
            'inDegree': in_degree.copy()
        })
        
        for neighbor in adj[current]:
            in_degree[neighbor] -= 1
            steps.append({
                'type': 'decrement',
                'node': neighbor,
                'newInDegree': in_degree[neighbor],
                'result': result.copy(),
                'queue': list(queue),
                'inDegree': in_degree.copy()
            })
            if in_degree[neighbor] == 0:
                queue.append(neighbor)
                steps.append({
                    'type': 'add',
                    'node': neighbor,
                    'result': result.copy(),
                    'queue': list(queue),
                    'inDegree': in_degree.copy()
                })
    
    has_cycle = len(result) != len(nodes)
    
    return {
        'sorted': result if not has_cycle else [],
        'hasCycle': has_cycle,
        'steps': steps
    }
