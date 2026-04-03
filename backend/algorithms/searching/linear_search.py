def linear_search(arr, target):
    steps = []
    for i, value in enumerate(arr):
        steps.append({
            'index': i,
            'value': value,
            'isTarget': value == target,
            'checked': i + 1
        })
        if value == target:
            break
    return {
        'found': target in arr,
        'steps': steps,
        'index': arr.index(target) if target in arr else -1,
        'checks': len(steps)
    }
