def dfs_traversal(nodes, edges, start):
    steps = []
    visited = []
    stack = [start]
    parent = {}
    
    while stack:
        current = stack.pop()
        if current in visited:
            continue
        visited.append(current)
        steps.append({
            'type': 'visit',
            'node': current,
            'visited': visited.copy(),
            'stack': stack.copy()
        })
        
        
        neighbors = []
        for edge in edges:
            if edge['from'] == current:
                neighbors.append(edge['to'])
            elif not edge.get('directed', False) and edge['to'] == current:
                neighbors.append(edge['from'])
        
        for neighbor in reversed(neighbors):  
            if neighbor not in visited:
                parent[neighbor] = current
                stack.append(neighbor)
                steps.append({
                    'type': 'explore',
                    'from': current,
                    'to': neighbor,
                    'visited': visited.copy(),
                    'stack': stack.copy()
                })
    
    return {
        'visited': visited,
        'steps': steps,
        'parent': parent
    }
