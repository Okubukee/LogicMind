def ternary_search(arr, target):
    steps = []
    left, right = 0, len(arr) - 1
    
    while left <= right:
        mid1 = left + (right - left) // 3
        mid2 = right - (right - left) // 3
        
        steps.append({
            'left': left,
            'right': right,
            'mid1': mid1,
            'mid2': mid2,
            'value1': arr[mid1],
            'value2': arr[mid2],
            'isTarget1': arr[mid1] == target,
            'isTarget2': arr[mid2] == target
        })
        
        if arr[mid1] == target:
            return {
                'found': True,
                'steps': steps,
                'index': mid1,
                'checks': len(steps)
            }
        if arr[mid2] == target:
            return {
                'found': True,
                'steps': steps,
                'index': mid2,
                'checks': len(steps)
            }
        
        if target < arr[mid1]:
            right = mid1 - 1
        elif target > arr[mid2]:
            left = mid2 + 1
        else:
            left = mid1 + 1
            right = mid2 - 1
    
    return {
        'found': False,
        'steps': steps,
        'index': -1,
        'checks': len(steps)
    }
