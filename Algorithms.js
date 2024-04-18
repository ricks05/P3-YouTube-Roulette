//Note: The time returned by the functions is in milliseconds.
//MergeSort
function merge(arr,left,mid,right){
    let n1 = mid - left + 1;
    let n2 = right - mid;
    let X = new Array(n1);
    let Y = new Array(n2);
    for (let i = 0; i < n1; i++) {
        X[i] = arr[left+i];
    }
    for (let j = 0; j < n2; j++) {
        Y[j] = arr[mid+1+j];
    }
    let i = 0;
    let j = 0;
    let k = left;
    while (i < n1 && j < n2) {
        if (X[i] <= Y[j]) {
            arr[k] = X[i];
            i++;
        }
        else {
            arr[k] = Y[j];
            j++;
        }
        k++;
    }
    while (i < n1) {
        arr[k] = X[i];
        i++;
        k++;
    }
    while (j < n2) {
        arr[k] = Y[j];
        j++;
        k++;
    }
}


function mergeSort(arr,left = 0,right = arr.length - 1){
    let start = performance.now();
    if (left < right) {
        let mid = Math.floor(left + (right - left) / 2);
        mergeSort(arr,left,mid);
        mergeSort(arr,mid+1,right);
        merge(arr,left,mid,right);
    }
    let finish = performance.now();
    return finish - start;
}

//QuickSort
function partition(arr, left, right) {
    let pivot = arr[right];
    let i = left - 1;

    for (let j = left; j < right; j++) {
        if (arr[j] <= pivot) {
            i++;
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
    }
    [arr[i + 1], arr[right]] = [arr[right], arr[i + 1]];
    return i + 1;
}
function quickSort(arr, left = 0, right = arr.length - 1) {
    let start = performance.now();
    if (left < right) {
        let pivotIndex = partition(arr, left, right);
        quickSort(arr, left, pivotIndex - 1);
        quickSort(arr, pivotIndex + 1, right);
    }
    let finish = performance.now();
    return finish - start;
}
//Random Picker
function randomPicker(videos, min = 0, max){
    let short = -1;
    let long = -1;
    for (let i = 0; i < videos.length; i++) {
        if(videos[i].duration >= min){
            short = i;
            break;
        }
    }
    for (let i = videos.length - 1; i >= 0; i--) {
        if(videos[i].duration <= max){
            long = i;
            break;
        }
    }

    if (short == -1 || long == -1) {
        throw new Error("Invalid duration range")
    }

    return videos[Math.floor(Math.random()*(long-short+1)+short)];
}

export {randomPicker, quickSort, mergeSort};