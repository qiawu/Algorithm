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

    var result = animateFunc(input);

    if (animateTimer) clearInterval(animateTimer);
    var index = 0;
    animateTimer = setInterval(function() {
        if (index < animationQueue.length) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.beginPath();
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

function getPosition(el) {
    var xPos = 0;
    var yPos = 0;

    while (el) {
        if (el.tagName == "BODY") {
            // deal with browser quirks with body/window/document and page scroll
            var xScroll = el.scrollLeft || document.documentElement.scrollLeft;
            var yScroll = el.scrollTop || document.documentElement.scrollTop;

            xPos += (el.offsetLeft - xScroll + el.clientLeft);
            yPos += (el.offsetTop - yScroll + el.clientTop);
        } else {
            // for all other non-BODY elements
            xPos += (el.offsetLeft - el.scrollLeft + el.clientLeft);
            yPos += (el.offsetTop - el.scrollTop + el.clientTop);
        }

        el = el.offsetParent;
    }
    return {
        x: xPos,
        y: yPos
    };
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
        if (info.content === undefined) {
            circle.style.visibility = "hidden";
        }

        line.appendChild(circle);

        return circle;
    });
}

// draw a line between two elements
function drawLine(e1, e2) {
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");
    var pos1 = getPosition(e1);
    var pos2 = getPosition(e2);
    if (pos1.y < pos2.y) {
        ctx.moveTo(pos1.x + e1.offsetWidth / 2, pos1.y + e1.clientHeight);
        ctx.lineTo(pos2.x + e2.offsetWidth / 2, pos2.y);
    }
    if (pos1.y > pos2.y) {
        ctx.moveTo(pos2.x + e2.offsetWidth / 2, pos2.y + e2.clientHeight);
        ctx.lineTo(pos1.x + e1.offsetWidth / 2, pos1.y);
    }
    if (pos1.y === pos2.y) {
        if (pos1.x < pos2.x) {
            ctx.moveTo(pos1.x + e1.clientWidth, pos1.y + e1.offsetHeight / 2);
            ctx.lineTo(pos2.x, pos2.y + e2.offsetHeight / 2);
        } else {
            ctx.moveTo(pos2.x + e2.clientWidth, pos2.y + e2.offsetHeight / 2);
            ctx.lineTo(pos1.x, pos1.y + e1.offsetHeight / 2);
        }
    }

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
    var treeInfo = tree2TreeInfo(tree, focus);
    var animationFunc = function() {

        treeInfo.reduce(function(prevNodes, arr, level) {
            var circleInfos = arr.map(function(item, index) {
                var info = {};
                info.class = [];
                info.hasArrow = false; // no arrow in tree to avoid element moving
                info.content = item.data;
                if (item["focus"]) {
                    info.class = ["focus"];
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

function animateGraph(animationKey, graph, focus = [], mergeWithPrev = false) {
    var graphInfo = graph2GraphInfo(graph, focus);
    var animationFunc = function() {

        // draw circle
        graphInfo.forEach(function(arr, level) {
            var circleInfos = arr.map(function(item, index) {
                var info = {};
                info.class = [];
                info.hasArrow = false; // no arrow in tree to avoid element moving
                info.content = item.data;
                if (item["focus"]) {
                    info.class = ["focus"];
                }
                return info;
            });
            var circles = insertCircleLine(animationKey + level, circleInfos);

            arr.forEach(function(item, index) {
                item.circle = circles[index];
            });

            return arr;

        });

        //draw lines between circles
        graphInfo.forEach(function(arr, level) {
            arr.forEach(function(node) {
                node.neighbors.forEach(function(ngb) {
                    drawLine(node.circle, ngb.circle);
                });
            });
        })

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