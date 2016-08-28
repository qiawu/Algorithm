// sort array in ascending order using merge sort
function mergeSort(input) {
    arr = input.split(",").map(function(e) {
        return parseInt(e)
    });

    function merge(arr, left, middle, right) {
        var leftArr = arr.slice(left, middle + 1);
        var rightArr = arr.slice(middle + 1, right + 1);
        var cur = left;
        for (var l = 0, r = 0; l < leftArr.length && r < rightArr.length;) {
            // @animateArray("leftArr", leftArr, [], [], [l])
            // @animateArray("rightArr", rightArr, [], [], [r], true)
            // @animateArray("arr", arr, range(left, middle - left + 1), range(middle + 1, right - middle), [cur], true)
            if (leftArr[l] < rightArr[r]) {
                arr[cur++] = leftArr[l++];
            } else {
                arr[cur++] = rightArr[r++];
            }
        }
        while (l < leftArr.length) {
            // @animateArray("leftArr", leftArr, [], [], [l])
            // @animateArray("arr", arr, range(left, l + 1), range(middle + 1, right - middle), [cur], true)
            arr[cur++] = leftArr[l++];
        }
        while (r < rightArr.length) {
            // @animateArray("rightArr", rightArr, [], [], [r])
            // @animateArray("arr", arr, range(left, middle - left + 1), range(middle + 1, r + 1), [cur], true)
            arr[cur++] = rightArr[r++];
        }
    }

    function recursiveMergeSort(arr, left, right) {
        if (left >= right) return;
        var middle = Math.floor((left + right) / 2);
        recursiveMergeSort(arr, left, middle);
        recursiveMergeSort(arr, middle + 1, right);
        merge(arr, left, middle, right);
    }

    recursiveMergeSort(arr, 0, arr.length - 1);
    // @animateArray("arr", arr, range(0, arr.length), [], [])

    return arr.join(",");
}