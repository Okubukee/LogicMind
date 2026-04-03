from collections import deque

def bfs_traversal(nodes, edges, start):
    steps = []
    visited = []
    queue = deque([start])
    parent = {}
    
    while queue:
        current = queue.popleft()
        if current in visited:
            continue
        visited.append(current)
        steps.append({
            'type': 'visit',
            'node': current,
            'visited': visited.copy(),
            'queue': list(queue)
        })
        
        
        neighbors = []
        for edge in edges:
            if edge['from'] == current:
                neighbors.append(edge['to'])
            elif not edge.get('directed', False) and edge['to'] == current:
                neighbors.append(edge['from'])
        
        for neighbor in neighbors:
            if neighbor not in visited and neighbor not in queue:
                parent[neighbor] = current
                queue.append(neighbor)
                steps.append({
                    'type': 'explore',
                    'from': current,
                    'to': neighbor,
                    'visited': visited.copy(),
                    'queue': list(queue)
                })
    
    return {
        'visited': visited,
        'steps': steps,
        'parent': parent
    }
