function range(start, count) {
    return Array.apply(0, Array(count))
        .map(function(element, index) {
            return index + start;
        });
}

function swap(arr, i, j) {
    var tmp = arr[i];
    arr[i] = arr[j];
    arr[j] = tmp;
}

function tree2TreeInfo(tree) {
    var multiArrs = [];
    var visitFunc = function(node, level) {
        if (multiArrs[level] === undefined) multiArrs[level] = [];
        multiArrs[level].push(node);
    }
    tree.BFS(visitFunc, tree.root);

    // add parent-child info
    /* example: [
        [{"data": 10, "children": [0,1]}],                                // first level
        [{"data": 20, "children": []}, {"data": 50, "children": []}]        // second level
    ]
    */
    var treeInfo = multiArrs.map(function(arr, level) {
        var newArr = arr.map(function(node, index) {
            var childrenPosition = [];
            if (level + 1 < multiArrs.length) {
                childrenPosition = node.getAllChildren().map(child => multiArrs[level + 1].indexOf(child));
            }

            return {
                "data": node.data,
                "children": childrenPosition
            };
        });

        return newArr;
    });

    return treeInfo;
}

function treeToJson(tree) {
    var json = {};

    function recursiveTree2Json(treeNode) {
        return treeNode ? {
            "data": treeNode.data,
            "left": recursiveTree2Json(treeNode.left),
            "right": recursiveTree2Json(treeNode.right)
        } : null;
    }

    return recursiveTree2Json(tree.root);
}