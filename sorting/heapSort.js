function heapSort(input) {

    var arr = input.split(",").map(function(e) {
        return parseInt(e)
    });

    function buildMaxHeap(arr) {
        for (var i = parentNode(arr.length - 1); i >= 0; --i) {
            maintainMaxHeap(arr, 0, arr.length - 1, i);
        }
    }

    function maintainMaxHeap(arr, start, end, i) {
        var left = leftChildNode(i);
        var right = rightChildNode(i);
        if (left > end && right > end) return;
        var maxChild = left > end ? right : (right > end ? left : (arr[left] > arr[right] ? left : right));
        if (arr[maxChild] > arr[i]) {
            swap(arr, i, maxChild);
        }
        maintainMaxHeap(arr, start, end, maxChild);
    }

    function parentNode(i) {
        return Math.floor((i - 1) / 2);
    }

    function leftChildNode(i) {
        return i * 2 + 1;
    }

    function rightChildNode(i) {
        return i * 2 + 2;
    }

    buildMaxHeap(arr);
    for (var i = arr.length - 1; i >= 0; --i) {
        swap(arr, i, 0);
        maintainMaxHeap(arr, 0, i - 1, 0);
    }

    return arr.join(",");
}