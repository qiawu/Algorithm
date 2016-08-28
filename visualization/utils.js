function range(start, count) {
    return Array.apply(0, Array(count))
        .map(function(element, index) {
            return index + start;
        });
}

function swap(arr, i, j) {
    var tmp = arr[i];
    arr[i] = arr[j];
    arr[j] = tmp;
}