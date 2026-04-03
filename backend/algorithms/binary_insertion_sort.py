def binary_insertion_sort(arr):
    steps = []
    steps.append({'array': arr.copy(), 'comparing': [], 'swapping': []})
    
    for i in range(1, len(arr)):
        key = arr[i]
        left, right = 0, i - 1
        
        while left <= right:
            mid = (left + right) // 2
            steps.append({'array': arr.copy(), 'comparing': [mid, i], 'swapping': []})
            if arr[mid] > key:
                right = mid - 1
            else:
                left = mid + 1
        
        for j in range(i - 1, left - 1, -1):
            steps.append({'array': arr.copy(), 'comparing': [j, j+1], 'swapping': [j, j+1]})
            arr[j + 1] = arr[j]
        arr[left] = key
        if left != i:
            steps.append({'array': arr.copy(), 'comparing': [], 'swapping': [left]})
    
    steps.append({'array': arr.copy(), 'comparing': [], 'swapping': []})
    return steps
