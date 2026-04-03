def binary_search(arr, target):
    steps = []
    left, right = 0, len(arr) - 1
    
    while left <= right:
        mid = (left + right) // 2
        steps.append({
            'left': left,
            'right': right,
            'mid': mid,
            'value': arr[mid],
            'isTarget': arr[mid] == target
        })
        
        if arr[mid] == target:
            return {
                'found': True,
                'steps': steps,
                'index': mid,
                'checks': len(steps)
            }
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    
    return {
        'found': False,
        'steps': steps,
        'index': -1,
        'checks': len(steps)
    }
