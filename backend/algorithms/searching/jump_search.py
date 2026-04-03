import math

def jump_search(arr, target):
    steps = []
    n = len(arr)
    step = int(math.sqrt(n))
    prev = 0
    
    steps.append({
        'type': 'jump',
        'from': prev,
        'to': min(step, n) - 1,
        'value': arr[min(step, n) - 1] if step <= n else None
    })
    
    while arr[min(step, n) - 1] < target:
        prev = step
        step += int(math.sqrt(n))
        steps.append({
            'type': 'jump',
            'from': prev,
            'to': min(step, n) - 1,
            'value': arr[min(step, n) - 1] if step <= n else None
        })
        if prev >= n:
            return {
                'found': False,
                'steps': steps,
                'index': -1,
                'checks': len(steps)
            }
    
    for i in range(prev, min(step, n)):
        steps.append({
            'type': 'linear',
            'index': i,
            'value': arr[i],
            'isTarget': arr[i] == target
        })
        if arr[i] == target:
            return {
                'found': True,
                'steps': steps,
                'index': i,
                'checks': len(steps)
            }
    
    return {
        'found': False,
        'steps': steps,
        'index': -1,
        'checks': len(steps)
    }
