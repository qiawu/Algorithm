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
    document.getElementById('animation').innerHTML = ""; // clear previous animation result
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
// mergeWithPrev is for merging two consecutive animation
function animateArray(animationKey, arr, part1, part2, focus, mergeWithPrev = false) {
    var arrCopy = arr.slice();
    var animationFunc = function() {
        var spaceForArrow = "<div style='visibility: hidden; height: 30px;'></div>";
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

        animationElement = document.getElementById('animation').getElementsByClassName(animationKey)[0];
        if (animationElement === undefined) {
            var animationElement = document.createElement("div");
            animationElement.setAttribute("class", animationKey);
            document.getElementById('animation').appendChild(animationElement);
        }
        animationElement.innerHTML = spaceForArrow + "<ul>" + x + "</ul>";
    };
    if (mergeWithPrev) {
        var prev = animationQueue.pop();
        animationQueue.push(function() {
            prev();
            animationFunc();
        });
    } else {
        animationQueue.push(animationFunc);
    }

}