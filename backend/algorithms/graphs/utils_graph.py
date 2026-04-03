def build_adjacency_list(nodes, edges):
    
    adj = {node: [] for node in nodes}
    for edge in edges:
        u, v, weight = edge['from'], edge['to'], edge.get('weight', 1)
        adj[u].append({'to': v, 'weight': weight})
        
        if not edge.get('directed', False):
            adj[v].append({'to': u, 'weight': weight})
    return adj

def build_adjacency_matrix(nodes, edges):
    
    n = len(nodes)
    node_to_idx = {node: i for i, node in enumerate(nodes)}
    matrix = [[float('inf')] * n for _ in range(n)]
    for i in range(n):
        matrix[i][i] = 0
    for edge in edges:
        u, v, weight = edge['from'], edge['to'], edge.get('weight', 1)
        matrix[node_to_idx[u]][node_to_idx[v]] = weight
        if not edge.get('directed', False):
            matrix[node_to_idx[v]][node_to_idx[u]] = weight
    return matrix, node_to_idx
