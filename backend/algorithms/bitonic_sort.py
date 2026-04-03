def bitonic_sort(arr):
    steps = []
    steps.append({'array': arr.copy(), 'comparing': [], 'swapping': []})
    
    def comp_swap(i, j, dir):
        steps.append({'array': arr.copy(), 'comparing': [i, j], 'swapping': []})
        if (dir == 1 and arr[i] > arr[j]) or (dir == 0 and arr[i] < arr[j]):
            steps.append({'array': arr.copy(), 'comparing': [i, j], 'swapping': [i, j]})
            arr[i], arr[j] = arr[j], arr[i]
    
    def bitonic_merge(low, cnt, dir):
        if cnt > 1:
            k = cnt // 2
            for i in range(low, low + k):
                comp_swap(i, i + k, dir)
            bitonic_merge(low, k, dir)
            bitonic_merge(low + k, k, dir)
    
    def bitonic_sort_rec(low, cnt, dir):
        if cnt > 1:
            k = cnt // 2
            bitonic_sort_rec(low, k, 1)
            bitonic_sort_rec(low + k, k, 0)
            bitonic_merge(low, cnt, dir)
    
    n = len(arr)
    if n > 1:
        
        size = 1
        while size < n:
            size <<= 1
        padded_arr = arr + [float('inf')] * (size - n)
        arr[:] = padded_arr
        bitonic_sort_rec(0, size, 1)
        arr[:] = [x for x in arr if x != float('inf')]
    
    steps.append({'array': arr.copy(), 'comparing': [], 'swapping': []})
    return steps
