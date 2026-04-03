def bucket_sort(arr):
    steps = []
    
    if not arr:
        return steps
    
    
    steps.append({
        'array': arr.copy(),
        'comparing': [],
        'swapping': []
    })
    
    
    min_val = min(arr)
    max_val = max(arr)
    
    
    num_buckets = max(2, int(len(arr) ** 0.5))
    bucket_range = (max_val - min_val) / num_buckets
    
    
    buckets = [[] for _ in range(num_buckets)]
    
    
    for i, value in enumerate(arr):
        bucket_index = int((value - min_val) / bucket_range)
        if bucket_index >= num_buckets:
            bucket_index = num_buckets - 1
        buckets[bucket_index].append(value)
        steps.append({
            'array': arr.copy(),
            'comparing': [i],
            'swapping': [],
            'info': f'Elemento {value} va al bucket {bucket_index}'
        })
    
    
    steps.append({
        'array': arr.copy(),
        'comparing': [],
        'swapping': [],
        'info': f'Buckets: {[list(b) for b in buckets]}'
    })
    
    
    result = []
    for b_idx, bucket in enumerate(buckets):
        if bucket:
            
            for i in range(1, len(bucket)):
                key = bucket[i]
                j = i - 1
                while j >= 0 and bucket[j] > key:
                    bucket[j + 1] = bucket[j]
                    j -= 1
                bucket[j + 1] = key
            result.extend(bucket)
            steps.append({
                'array': result + [item for sublist in buckets[b_idx+1:] for item in sublist],
                'comparing': [],
                'swapping': [],
                'info': f'Bucket {b_idx} ordenado: {bucket}'
            })
    
    
    for i in range(len(arr)):
        if arr[i] != result[i]:
            arr[i] = result[i]
            steps.append({
                'array': arr.copy(),
                'comparing': [],
                'swapping': [i]
            })
    
    
    steps.append({
        'array': arr.copy(),
        'comparing': [],
        'swapping': []
    })
    
    return steps
