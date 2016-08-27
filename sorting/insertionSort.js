// sort array in ascending order using insertion sort
function insertionSort(input) {
    var arr = input.split(",").map(function(e) {
        return parseInt(e)
    });

    arr.forEach(function(cur, curIndex) {
        for (var i = curIndex - 1; i >= 0; --i) {
            // @animationArray(arr, range(0, curIndex), range(curIndex, arr.length - curIndex), [i, i + 1])
            if (cur < arr[i]) {
                arr[i + 1] = arr[i];
                arr[i] = cur;
            } else break;
        }
        arr[i + 1] = cur;
    });

    // @animationArray(arr, range(0, arr.length), [], [])
    return arr.join(",");
}