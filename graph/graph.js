function Graph() {
    this.BFS = function(source, visitFunc) {};
}

function AdjListGraph() {
    this.nodes = undefined;
    this.buildFromPairs = function(pairs) {
        var dict = pairs.reduce(function(acc, p) {
            if (p.length < 2) {
                console.log("warning: ignore invalid pair: " + p);
            } else {
                if (acc[p[0]] === undefined) {
                    acc[p[0]] = {};
                } else {
                    acc[p[0]][p[1]] = true;
                }
            }
            return acc;
        }, {})
        this.nodes = Object.keys(dict).map(function(k) {
            var head = new AdjListGraphNode(k);
            Object.keys(dict[k]).reduce(function(curNode, adj) {
                var adjNode = new AdjListGraphNode(adj);
                curNode.next = adjNode;
                return adjNode;
            }, head);
            return head;
        });
    };
    this.adjs = function(node) {
        return node.adjs();
    }
}

function AdjListGraphNode(data, next = undefined) {
    this.data = data;
    this.next = next;
    this.adjs = function() {
        var result = [];
        var cur = this.next;
        while (cur !== null) {
            result.push(cur);
            cur = cur.next;
        }
        return result;
    }
}

AdjListGraph.prototype = new Graph();
AdjListGraph.constructor = AdjListGraph;

function AdjMatrixGraph() {
    this.nodes = undefined;
    this.buildFromPairs = function(pairs) {
        var dict = pairs.reduce(function(acc, p) {
            if (p.length < 2) {
                console.log("warning: ignore invalid pair: " + p);
            } else {
                if (acc[p[0]] === undefined) {
                    acc[p[0]] = {};
                } else {
                    acc[p[0]][p[1]] = true;
                }
            }
            return acc;
        }, {})
        this.nodes = dict;
    };

    this.adjs = function(node) {
        return Object.keys(this.nodes[node]);
    }
}

AdjMatrixGraph.prototype = new Graph();
AdjMatrixGraph.constructor = AdjMatrixGraph;