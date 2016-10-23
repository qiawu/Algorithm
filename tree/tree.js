function Tree(root) {
    this.root = root;
    this.BFS = function(visitFunc) {
        var queue = [
            [this.root, 0] // node, level
        ];
        var e = queue.shift();
        while (e !== undefined) {
            visitFunc(e[0], e[1]);
            e[0].getAllChildren().forEach(function(child) {
                queue.push([child, e[1] + 1]);
            });
            e = queue.shift();
        }
    };
}

function TreeNode(data, children = []) {
    this.data = data;
    this.children = children;
    this.getAllChildren = function() {
        return children;
    };
}

function BinaryTree(root) {
    this.root = root;
    this.inorder = function(visitFunc = undefined) {
        function recurInorder(node, visitFunc) {
            if (node !== undefined) {
                node.left && recurInorder(node.left, visitFunc);
                visitFunc && visitFunc(node);
                node.right && recurInorder(node.right, visitFunc);
            }
        }
        recurInorder(this.root, visitFunc);
    }

    this.query = function(data) {
        function recurQuery(data, node) {
            if (node === undefined || node.data === data) return node;
            node.data < data && recurQuery(data, node.right);
            node.data > data && recurQuery(data, node.left);
        }
        return recurQuery(data, this.root);
    }

    this.insert = function(data) {
        function recurInsert(newNode, curNode) {
            if (newNode.data < curNode.data) {
                if (curNode.left !== undefined) recurInsert(newNode, curNode.left);
                else curNode.left = newNode;
            } else {
                if (curNode.right !== undefined) recurInsert(newNode, curNode.right);
                else curNode.right = newNode;
            }
        }
        var newNode = new BinaryTreeNode(data);
        if (this.root === undefined) this.root = newNode;
        else recurInsert(newNode, this.root);
        return newNode;
    }

    // return max element of the tree rooted by node
    this.max = function(node) {
        function recurMax(node) {
            if (node !== undefined) {
                if (node.right != undefined) recurMax(node.right);
                else return node;
            } else return undefined;
        }

        return recurMax(node);
    }

    // return min element of the tree rooted by node
    this.min = function(node) {
        function recurMin(node) {
            if (node !== undefined) {
                if (node.left != undefined) recurMin(node.left);
                else return node;
            } else return undefined;
        }

        return recurMin(node);
    }

    this.predecessor = function(node) {
        return node.left && this.max(node.left) || node;
    }

    this.sucessor = function(node) {
        return node.right && this.min(node.right) || node;
    }

}

function BinaryTreeNode(data, left = undefined, right = undefined) {
    this.data = data;
    this.left = left;
    this.right = right;
    this.getAllChildren = function() {
        var children = [];
        if (this.left !== undefined) children.push(this.left);
        if (this.right !== undefined) children.push(this.right);
        return children;
    };
}

BinaryTree.prototype = new Tree();
BinaryTree.constructor = BinaryTree;
BinaryTreeNode.prototype = new TreeNode();
BinaryTreeNode.constructor = BinaryTreeNode;

function bstSort(input) {
    var arr = input.split(",").map(function(e) {
        return parseInt(e)
    });

    var tree = new BinaryTree();
    arr.forEach(function(e) {
        var newNode = tree.insert(e);
        // @animateTree("bstSort", tree, [newNode])
    });

    var result = [];
    tree.inorder(function(n) {
        result.push(n.data);
        // @animateTree("bstSort", tree, [n])
        // @animateArray("result", result, range(0, result.length), [], [result.length - 1], true)
    });

    return result.join(",");
}