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
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx.lineWidth = 3;
    ctx.beginPath();

    var result = animateFunc(input);

    if (animateTimer) clearInterval(animateTimer);
    var index = 0;
    animateTimer = setInterval(function() {
        if (index < animationQueue.length) {
            animationQueue[index++]();
            ctx.closePath();
        } else endAnimate();
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

// insert all circles in one line, this line is identified by key
// return all circle elements
function insertCircleLine(key, circleInfos) {
    var animation = document.getElementById('animation');
    var div = animation.getElementsByClassName(key)[0];
    if (div === undefined) {
        div = document.createElement("div");
        div.setAttribute("class", key);
        animation.appendChild(div);
    } else {
        div.innerHTML = "";
    }
    if (circleInfos.some(info => info.hasArrow)) {
        var spaceForArrow = document.createElement("div");
        spaceForArrow.style.cssText = "visibility: hidden; height: 30px;"
        div.appendChild(spaceForArrow);
    }

    var line = document.createElement("ul");
    div.appendChild(line);

    return circleInfos.map(function(info) {
        var circle = document.createElement("li");
        circle.classList.add("circle");
        info.class.forEach(function(c) {
            circle.classList.add(c);
        });
        if (info.hasArrow) {
            circle.innerHTML += "<span id='arrow' >&darr;</span>";
        }
        circle.innerHTML += info.content;

        line.appendChild(circle);

        return circle;
    });
}

// draw a line between two elements
function drawLine(e1, e2) {
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");
    ctx.moveTo(e1.offsetLeft + e1.offsetWidth / 2, e1.offsetTop + e1.clientHeight);
    ctx.lineTo(e2.offsetLeft + e2.offsetWidth / 2, e2.offsetTop);
    ctx.stroke();

}

// split the array into two parts: part1 and part2 (they are all index set)
// focus is the set of elements that we will assign arrow above
// mergeWithPrev is for merging two consecutive animation
function animateArray(animationKey, arr, part1, part2, focus = [], mergeWithPrev = false) {
    var arrCopy = arr.slice();
    var animationFunc = function() {
        var circleInfos = arrCopy.map(function(item, index) {
            var info = {};
            info.class = [];
            info.hasArrow = false;
            info.content = item;
            if (part1.indexOf(index) !== -1) info.class = ["part1"];
            if (part2.indexOf(index) !== -1) info.class = ["part2"];
            if (focus.indexOf(index) !== -1) {
                info.class = ["focus"];
                info.hasArrow = true;
            }
            return info;
        });
        insertCircleLine(animationKey, circleInfos);
    };

    if (mergeWithPrev) {
        var prev = animationQueue.pop();
        animationQueue.push(function() {
            prev && prev();
            animationFunc();
        });
    } else {
        animationQueue.push(animationFunc);
    }

}

function animateTree(animationKey, tree, focus = [], mergeWithPrev = false) {
    var treeInfo = tree2TreeInfo(tree);
    var animationFunc = function() {

        treeInfo.reduce(function(prevNodes, arr, level) {
            var circleInfos = arr.map(function(item, index) {
                var info = {};
                info.class = [];
                info.hasArrow = false;
                info.content = item.data;
                if (focus.indexOf(index) !== -1) {
                    info.class = ["focus"];
                    info.hasArrow = true;
                }
                return info;
            });
            var circles = insertCircleLine(animationKey + level, circleInfos);
            prevNodes.forEach(function(parent) {
                parent.children.forEach(function(childPos) {
                    drawLine(parent.circle, circles[childPos]);
                });
            });

            arr.forEach(function(item, index) {
                item.circle = circles[index];
            });

            return arr;

        }, []);

    };
    animationFunc();

}