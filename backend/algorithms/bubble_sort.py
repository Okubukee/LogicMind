def bubble_sort(arr):
    steps = []
    n = len(arr)
    
    steps.append({
        'array': arr.copy(),
        'comparing': [],
        'swapping': []
    })
    
    for i in range(n):
        for j in range(0, n - i - 1):
            steps.append({
                'array': arr.copy(),
                'comparing': [j, j+1],
                'swapping': []
            })
            
            if arr[j] > arr[j+1]:
                steps.append({
                    'array': arr.copy(),
                    'comparing': [j, j+1],
                    'swapping': [j, j+1]
                })
                arr[j], arr[j+1] = arr[j+1], arr[j]
                steps.append({
                    'array': arr.copy(),
                    'comparing': [],
                    'swapping': [j, j+1]
                })
    
    steps.append({
        'array': arr.copy(),
        'comparing': [],
        'swapping': []
    })
    
    return steps
