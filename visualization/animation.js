var targetTick;
var tick;
var animateTimer;

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
            acc += (line.replace(/.*@/, "if (updateTick()) { ") + "; return; }\n");
        else
            acc += (line + "\n");

        return acc;
    }, "").replace(/^function[^{]+{/i, "").replace(/}[^}]*$/i, "");
    return new Function(getArgNameFromFunc(func), newBody);
}

function updateTick() {
    tick++;
    return (tick == targetTick);
}

function startAnimate(animateFunc, input) {
    targetTick = 1;
    var speed = 2000;

    // Start animation
    if (animateTimer) clearInterval(animateTimer);
    animateTimer = setInterval(function() {
        tick = 0;
        animateFunc(input);
        targetTick++;
    }, speed);
}

// this is not used now
function endAnimate() {
    clearInterval(animateTimer);
}

/***************************************************** different animation function for different type ***********************************************/


function printArray(arr) {
    console.log(arr.join(","));
}

// split the array into two parts: part1 and part2 (they are all index set)
// focus is the set of elements that we will assign arrow above
function animationArray(arr, part1, part2, focus) {

    var x = "";

    for (var i = 0; i < arr.length; i++) {
        var st = "";
        var ext = "";
        if (part1.indexOf(i) !== -1) st = " class ='circle part1'";
        if (part2.indexOf(i) !== -1) st = " class ='circle part2'";
        if (focus.indexOf(i) !== -1) {
            ext += "<span id='arrow' >&darr;</span>";
            st = " class ='circle focus'";
        }

        x += "<li " + st + ">" + ext + arr[i] + "</li>";
    }

    document.getElementById('animation').innerHTML = "<ul>" + x + "</ul>";
}