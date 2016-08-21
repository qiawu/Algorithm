

// sort array in ascending order using insertion sort
function insertionSort(input) {
    arr = input.split(",").map(function(e) { return parseInt(e) });
    startWatch("insertionSort", arr);
    
    arr.forEach(function (cur, curIndex) {
        for (var i = curIndex - 1; i >= 0; --i) {
            if (cur < arr[i]) arr[i + 1] = arr[i];
            else break;
        }
        arr[i + 1] = cur;
    });

    endWatch(arr);
    return arr.join(",");
}