def binary_search_range(arr, target, left, right, steps):
    while left <= right:
        mid = (left + right) // 2
        steps.append({
            'type': 'binary',
            'left': left,
            'right': right,
            'mid': mid,
            'value': arr[mid],
            'isTarget': arr[mid] == target
        })
        
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1

def exponential_search(arr, target):
    steps = []
    n = len(arr)
    
    if arr[0] == target:
        steps.append({
            'type': 'exponential',
            'bound': 0,
            'value': arr[0],
            'isTarget': True
        })
        return {
            'found': True,
            'steps': steps,
            'index': 0,
            'checks': len(steps)
        }
    
    i = 1
    while i < n and arr[i] <= target:
        steps.append({
            'type': 'exponential',
            'bound': i,
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
        i *= 2
    
    left = i // 2
    right = min(i, n - 1)
    
    result = binary_search_range(arr, target, left, right, steps)
    
    return {
        'found': result != -1,
        'steps': steps,
        'index': result,
        'checks': len(steps)
    }
