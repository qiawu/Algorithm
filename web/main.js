var alg2Func = {
    "insertionsort": insertionSort,
    "mergesort": mergeSort,
    "quicksort": quickSort,
    "heapsort": heapSort,
    "bstSort": bstSort,
    "graphDFS": graphDFS
}

function runAlgorithm() {
    var algo = document.getElementById('algorithmList').options[document.getElementById('algorithmList').selectedIndex].value
    var input = document.getElementById('input').value

    var func = alg2Func[algo];

    var enablAnimation = document.getElementById('animationToggle').checked;;
    if (enablAnimation) {
        var animateFunc = algoFunWithAnimation(func);
        document.getElementById('output').value = startAnimate(animateFunc, input);
    } else {
        document.getElementById('output').value = func(input);
    }
}