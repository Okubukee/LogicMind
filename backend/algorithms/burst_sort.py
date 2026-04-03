class TrieNode:
    def __init__(self):
        self.children = {}
        self.bucket = []
        self.is_leaf = True
        self.bucket_limit = 32

def burst_sort(arr):
    steps = []
    steps.append({'array': arr.copy(), 'comparing': [], 'swapping': []})
    
    if not arr:
        return steps
    
    def get_digit(num, pos):
        return (num // (10 ** pos)) % 10
    
    def insert(node, num, depth):
        steps.append({'array': arr.copy(), 'comparing': [arr.index(num)], 'swapping': []})
        
        if node.is_leaf:
            node.bucket.append(num)
            if len(node.bucket) > node.bucket_limit:
                
                node.is_leaf = False
                for val in node.bucket:
                    digit = get_digit(val, depth)
                    if digit not in node.children:
                        node.children[digit] = TrieNode()
                    insert(node.children[digit], val, depth + 1)
                node.bucket = None
        else:
            digit = get_digit(num, depth)
            if digit not in node.children:
                node.children[digit] = TrieNode()
            insert(node.children[digit], num, depth + 1)
    
    def collect(node, result):
        if node.is_leaf:
            if node.bucket:
                
                bucket_sorted = sorted(node.bucket)
                for val in bucket_sorted:
                    result.append(val)
                    steps.append({'array': result + [0]*(len(arr)-len(result)), 'comparing': [], 'swapping': []})
        else:
            for digit in sorted(node.children.keys()):
                collect(node.children[digit], result)
    
    
    root = TrieNode()
    for num in arr:
        insert(root, num, 0)
    
    
    sorted_arr = []
    collect(root, sorted_arr)
    
    
    for i in range(len(arr)):
        arr[i] = sorted_arr[i]
    
    steps.append({'array': arr.copy(), 'comparing': [], 'swapping': []})
    return steps
