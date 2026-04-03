from collections import deque

def bipartite_check(nodes, edges):
    steps = []
    color = {node: -1 for node in nodes}
    
    def bfs(start):
        queue = deque([start])
        color[start] = 0
        steps.append({
            'type': 'color',
            'node': start,
            'color': 0,
            'colors': color.copy()
        })
        
        while queue:
            current = queue.popleft()
            
            
            neighbors = []
            for edge in edges:
                if edge['from'] == current:
                    neighbors.append(edge['to'])
                elif not edge.get('directed', False) and edge['to'] == current:
                    neighbors.append(edge['from'])
            
            for neighbor in neighbors:
                if color[neighbor] == -1:
                    color[neighbor] = 1 - color[current]
                    steps.append({
                        'type': 'color',
                        'node': neighbor,
                        'color': color[neighbor],
                        'colors': color.copy()
                    })
                    queue.append(neighbor)
                elif color[neighbor] == color[current]:
                    steps.append({
                        'type': 'conflict',
                        'node1': current,
                        'node2': neighbor,
                        'colors': color.copy()
                    })
                    return False
        return True
    
    is_bipartite = True
    for node in nodes:
        if color[node] == -1:
            if not bfs(node):
                is_bipartite = False
                break
    
    return {
        'isBipartite': is_bipartite,
        'steps': steps,
        'colors': color
    }
