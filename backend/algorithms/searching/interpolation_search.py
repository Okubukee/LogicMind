def interpolation_search(arr, target):
    steps = []
    left, right = 0, len(arr) - 1
    
    while left <= right and arr[left] <= target <= arr[right]:
        if left == right:
            pos = left
        else:
            pos = left + int(((target - arr[left]) * (right - left)) / (arr[right] - arr[left]))
        
        if pos < left or pos > right:
            break
            
        steps.append({
            'left': left,
            'right': right,
            'pos': pos,
            'value': arr[pos],
            'isTarget': arr[pos] == target
        })
        
        if arr[pos] == target:
            return {
                'found': True,
                'steps': steps,
                'index': pos,
                'checks': len(steps)
            }
        elif arr[pos] < target:
            left = pos + 1
        else:
            right = pos - 1
    
    return {
        'found': False,
        'steps': steps,
        'index': -1,
        'checks': len(steps)
    }
