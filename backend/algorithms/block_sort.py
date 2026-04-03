def block_sort(arr):
    steps = []
    steps.append({'array': arr.copy(), 'comparing': [], 'swapping': []})
    
    BLOCK_SIZE = 32
    n = len(arr)
    
    for i in range(0, n, BLOCK_SIZE):
        left = i
        right = min(i + BLOCK_SIZE - 1, n - 1)
        for j in range(left + 1, right + 1):
            key = arr[j]
            k = j - 1
            while k >= left and arr[k] > key:
                steps.append({'array': arr.copy(), 'comparing': [k, k+1], 'swapping': [k, k+1]})
                arr[k + 1] = arr[k]
                k -= 1
            arr[k + 1] = key
            steps.append({'array': arr.copy(), 'comparing': [], 'swapping': [k+1]})
    
    def merge(left, mid, right):
        left_arr = arr[left:mid+1]
        right_arr = arr[mid+1:right+1]
        i = j = 0
        k = left
        while i < len(left_arr) and j < len(right_arr):
            steps.append({'array': arr.copy(), 'comparing': [left+i, mid+1+j], 'swapping': []})
            if left_arr[i] <= right_arr[j]:
                arr[k] = left_arr[i]
                i += 1
            else:
                arr[k] = right_arr[j]
                j += 1
            k += 1
        while i < len(left_arr):
            arr[k] = left_arr[i]
            i += 1
            k += 1
        while j < len(right_arr):
            arr[k] = right_arr[j]
            j += 1
            k += 1
        steps.append({'array': arr.copy(), 'comparing': [], 'swapping': []})
    
    size = BLOCK_SIZE
    while size < n:
        for left in range(0, n, 2 * size):
            mid = left + size - 1
            right = min(left + 2 * size - 1, n - 1)
            if mid < right:
                merge(left, mid, right)
        size *= 2
    
    steps.append({'array': arr.copy(), 'comparing': [], 'swapping': []})
    return steps
