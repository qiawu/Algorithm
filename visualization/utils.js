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

function tree2TreeInfo(tree, focusNodes) {
    var multiArrs = [];
    var visitFunc = function(node, level) {
        if (multiArrs[level] === undefined) multiArrs[level] = [];
        multiArrs[level].push(node);
    }
    tree.BFS(visitFunc, tree.root);

    // add parent-child info
    /* example: [
        [{"data": 10, "children": [0,1]}],                                  // first level
        [{"data": 20, "children": []}, {"data": 50, "children": []}]        // second level
    ]
    */
    // treeInfo will also fill in fake left/right nodes for binary tree
    var treeInfo = multiArrs.map(function(arr, level) {
        // fill in fake nodes for binary tree
        if (level + 1 < multiArrs.length) {
            var newNextLevelArr = arr.reduce(function(prevNodes, node, index) {
                if (node instanceof BinaryTreeNode) {
                    prevNodes.push(node.left ? node.left : new BinaryTreeNode());
                    prevNodes.push(node.right ? node.right : new BinaryTreeNode());
                    return prevNodes;
                }
            }, []);
            multiArrs[level + 1] = newNextLevelArr;
        }

        var infoArr = arr.map(function(node, index) {
            var childrenPosition = [];
            if (level + 1 < multiArrs.length) {
                childrenPosition = node.getAllChildren().map(child => multiArrs[level + 1].indexOf(child));
            }
            var isFocus = (focusNodes.indexOf(node) != -1);

            return {
                "data": node.data, // undefined data will not be displayed, but will take the space. This can be used for fake nodes
                "children": childrenPosition, // only real nodes will be inserted into this field
                "focus": isFocus
            };
        });

        return infoArr;
    });

    return treeInfo;
}

function treeToJson(binTree) {
    var json = {};

    function recursiveTree2Json(binTreeNode) {
        return binTreeNode ? {
            "data": binTreeNode.data,
            "left": recursiveTree2Json(binTreeNode.left),
            "right": recursiveTree2Json(binTreeNode.right)
        } : null;
    }

    return recursiveTree2Json(binTree.root);
}

function ajacentArray2BinTree(strArray) {
    function extractNode(nodeArr, treeArr) {
        if (nodeArr === undefined || nodeArr.length <= 0) throw new Error("invalid node")
        var leftNode = nodeArr[1] && treeArr[nodeArr[1]] && extractNode(treeArr[nodeArr[1]], treeArr);
        var rightNode = nodeArr[2] && treeArr[nodeArr[2]] && extractNode(treeArr[nodeArr[2]], treeArr);
        return new BinaryTreeNode(nodeArr[0], leftNode, rightNode);
    }
    var treeArr = eval(strArray);
    return new BinaryTree(extractNode(treeArr[0], treeArr));
}

function ajacentArray2Tree(strArray) {
    ajacent = eval(strArray);

}