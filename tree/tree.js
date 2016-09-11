function Tree(root) {
    this.root = root;
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
    this.inorder = function(visitFunc, node = this.root) {
        if (node !== null) {
            this.inorder(visitFunc, node.left);
            visitFunc(node);
            this.inorder(visitFunc, node.right);
        }
    };
    // TODO: move this function to Tree class
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

function BinaryTreeNode(data, left = null, right = null) {
    this.data = data;
    this.left = left;
    this.right = right;
    this.getAllChildren = function() {
        var children = [];
        if (left !== null) children.push(left);
        if (right !== null) children.push(right);
        return children;
    };
}

BinaryTree.prototype = Object.create(Tree.prototype);
BinaryTreeNode.prototype = Object.create(TreeNode.prototype);

function testTree() {
    var leaf1 = new BinaryTreeNode(10);
    var leaf2 = new BinaryTreeNode(20);
    var leaf3 = new BinaryTreeNode(30);
    var leaf4 = new BinaryTreeNode(40);
    var node1 = new BinaryTreeNode(50, leaf1, leaf2);
    var node2 = new BinaryTreeNode(90, leaf3, leaf4);
    var root = new BinaryTreeNode(180, node1, node2);
    var tree = new BinaryTree(root);
    // @animateTree("testTree", tree)
}