def fibonacci_search(arr, target):
    steps = []
    n = len(arr)
    
    fib2 = 0
    fib1 = 1
    fib = fib2 + fib1
    
    while fib < n:
        fib2 = fib1
        fib1 = fib
        fib = fib2 + fib1
    
    offset = -1
    
    while fib > 1:
        i = min(offset + fib2, n - 1)
        
        steps.append({
            'offset': offset,
            'i': i,
            'value': arr[i],
            'isTarget': arr[i] == target
        })
        
        if arr[i] < target:
            fib = fib1
            fib1 = fib2
            fib2 = fib - fib1
            offset = i
        elif arr[i] > target:
            fib = fib2
            fib1 = fib1 - fib2
            fib2 = fib - fib1
        else:
            return {
                'found': True,
                'steps': steps,
                'index': i,
                'checks': len(steps)
            }
    
    if fib1 and offset + 1 < n and arr[offset + 1] == target:
        steps.append({
            'offset': offset,
            'i': offset + 1,
            'value': arr[offset + 1],
            'isTarget': True
        })
        return {
            'found': True,
            'steps': steps,
            'index': offset + 1,
            'checks': len(steps)
        }
    
    return {
        'found': False,
        'steps': steps,
        'index': -1,
        'checks': len(steps)
    }
