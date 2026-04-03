import heapq

def dijkstra_shortest_path(nodes, edges, start, end):
    steps = []
    distances = {node: float('inf') for node in nodes}
    distances[start] = 0
    parent = {node: None for node in nodes}
    pq = [(0, start)]
    visited = []
    
    while pq:
        dist, current = heapq.heappop(pq)
        
        if current in visited:
            continue
        
        visited.append(current)
        steps.append({
            'type': 'visit',
            'node': current,
            'distance': dist,
            'visited': visited.copy(),
            'distances': distances.copy()
        })
        
        if current == end:
            break
        
        
        for edge in edges:
            if edge['from'] == current:
                neighbor = edge['to']
                weight = edge.get('weight', 1)
                new_dist = dist + weight
                if new_dist < distances[neighbor]:
                    distances[neighbor] = new_dist
                    parent[neighbor] = current
                    heapq.heappush(pq, (new_dist, neighbor))
                    steps.append({
                        'type': 'relax',
                        'from': current,
                        'to': neighbor,
                        'newDistance': new_dist,
                        'distances': distances.copy()
                    })
            elif not edge.get('directed', False) and edge['to'] == current:
                neighbor = edge['from']
                weight = edge.get('weight', 1)
                new_dist = dist + weight
                if new_dist < distances[neighbor]:
                    distances[neighbor] = new_dist
                    parent[neighbor] = current
                    heapq.heappush(pq, (new_dist, neighbor))
                    steps.append({
                        'type': 'relax',
                        'from': current,
                        'to': neighbor,
                        'newDistance': new_dist,
                        'distances': distances.copy()
                    })
    
    
    path = []
    current = end
    while current is not None:
        path.insert(0, current)
        current = parent[current]
    
    return {
        'visited': visited,
        'path': path if path[0] == start else [],
        'steps': steps,
        'distance': distances[end] if distances[end] != float('inf') else -1,
        'parent': parent
    }
