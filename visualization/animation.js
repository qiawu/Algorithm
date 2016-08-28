var targetTick;
var tick;
var animateTimer;
var animationQueue = [];
var speed = 2000;

function getArgNameFromFunc(func) {
    return func.toString()
        .replace(/((\/\/.*$)|(\/\*[\s\S]*?\*\/)|(\s))/mg, '')
        .match(/^function\s*[^\(]*\(\s*([^\)]*)\)/m)[1]
        .split(/,/)
}

function algoFunWithAnimation(func) {
    var lines = func.toString().split("\n");
    var newBody = lines.reduce(function(acc, line) {
        if (line.indexOf("@") !== -1)
            acc += (line.trim().replace(/.*@/, "") + "\n");
        else
            acc += (line + "\n");

        return acc;
    }, "").replace(/^function[^{]+{/i, "").replace(/}[^}]*$/i, "");
    return new Function(getArgNameFromFunc(func), newBody);
}

function addFuncToAnimationQueue(animateFunc) {
    animationQueue.push(animateFunc);
}

function startAnimate(animateFunc, input) {
    var result = animateFunc(input);

    if (animateTimer) clearInterval(animateTimer);
    var index = 0;
    animateTimer = setInterval(function() {
        if (index < animationQueue.length) animationQueue[index++]();
        else endAnimate();
    }, speed);

    return result;
}

function endAnimate() {
    animationQueue = [];
    clearInterval(animateTimer);
}

/***************************************************** different animation function for different types ***********************************************/


function printArray(arr) {
    console.log(arr.join(","));
}

// split the array into two parts: part1 and part2 (they are all index set)
// focus is the set of elements that we will assign arrow above
function animateArray(arr, part1, part2, focus) {
    var arrCopy = arr.slice();
    animationQueue.push(function() {
        console.log(arrCopy.join(","));
        var x = "";

        for (var i = 0; i < arrCopy.length; i++) {
            var st = " class ='circle'";
            var ext = "";
            if (part1.indexOf(i) !== -1) st = " class ='circle part1'";
            if (part2.indexOf(i) !== -1) st = " class ='circle part2'";
            if (focus.indexOf(i) !== -1) {
                ext += "<span id='arrow' >&darr;</span>";
                st = " class ='circle focus'";
            }

            x += "<li " + st + ">" + ext + arrCopy[i] + "</li>";
        }

        document.getElementById('animation').innerHTML = "<ul>" + x + "</ul>";
    })

}