def detect_cycle(nodes, edges):
    steps = []
    visited = set()
    rec_stack = set()
    parent = {}
    
    def dfs(node):
        visited.add(node)
        rec_stack.add(node)
        steps.append({
            'type': 'enter',
            'node': node,
            'visited': list(visited),
            'recStack': list(rec_stack)
        })
        
        
        neighbors = []
        for edge in edges:
            if edge['from'] == node:
                neighbors.append(edge['to'])
            elif edge.get('directed', True) == False and edge['to'] == node:
                neighbors.append(edge['from'])
        
        for neighbor in neighbors:
            if neighbor not in visited:
                parent[neighbor] = node
                steps.append({
                    'type': 'explore',
                    'from': node,
                    'to': neighbor,
                    'visited': list(visited),
                    'recStack': list(rec_stack)
                })
                if dfs(neighbor):
                    return True
            elif neighbor in rec_stack:
                
                cycle_nodes = []
                current = node
                while current != neighbor:
                    cycle_nodes.insert(0, current)
                    current = parent.get(current)
                cycle_nodes.insert(0, neighbor)
                cycle_nodes.insert(0, node)
                steps.append({
                    'type': 'cycle_found',
                    'cycle': cycle_nodes,
                    'visited': list(visited),
                    'recStack': list(rec_stack)
                })
                return True
        
        rec_stack.remove(node)
        steps.append({
            'type': 'exit',
            'node': node,
            'visited': list(visited),
            'recStack': list(rec_stack)
        })
        return False
    
    has_cycle = False
    for node in nodes:
        if node not in visited:
            if dfs(node):
                has_cycle = True
                break
    
    return {
        'hasCycle': has_cycle,
        'steps': steps
    }
