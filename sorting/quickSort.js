function choosePivot(arr, left, right) {
    return left;
}

function quickSort(input) {

    var arr = input.split(",").map(function(e) {
        return parseInt(e)
    });

    function partition(arr, left, right) {
        var initPivotIndex = choosePivot(arr, left, right);
        var pivot = arr[initPivotIndex];
        // @animateArray("arr", arr, [], [], [initPivotIndex, right])
        swap(arr, right, initPivotIndex); // put pivot at the right
        // @animateArray("arr", arr, [], [], [initPivotIndex, right])
        // @animateArray("pivot", [pivot], [], [], [0], true)
        var cur = left;
        for (var i = left; i < right; ++i) {
            // @animateArray("arr", arr, range(left, cur - left), range(cur, right - cur), [cur, i])
            if (arr[i] < pivot) {
                swap(arr, i, cur);
                ++cur;
            }
        }
        // @animateArray("arr", arr, [], [], [cur, right])
        swap(arr, right, cur); // move pivot to cur
        // @animateArray("arr", arr, [], [], [cur, right])

        return cur;
    }

    function recursiveQuickSort(arr, left, right) {
        if (left < right) {
            var pivotIndex = partition(arr, left, right);
            recursiveQuickSort(arr, left, pivotIndex - 1);
            recursiveQuickSort(arr, pivotIndex + 1, right);
        }
    }

    recursiveQuickSort(arr, 0, arr.length - 1);
    // @animateArray("arr", arr, range(0, arr.length), [], [])

    return arr.join(",");
}