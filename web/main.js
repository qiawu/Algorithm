var alg2Func = {
    "insertionsort": insertionSort,
    "mergsort": mergeSort
}

var enablAnimation = true;

function runAlgorithm() {
    var algo = document.getElementById('algorithmList').options[document.getElementById('algorithmList').selectedIndex].value
    var input = document.getElementById('input').value

    var func = alg2Func[algo];
    document.getElementById('output').value = func(input);
    if (enablAnimation) {
        var animateFunc = algoFunWithAnimation(func);
        startAnimate(animateFunc, input);
    }
}