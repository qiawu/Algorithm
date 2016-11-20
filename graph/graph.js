function Graph(directed = false) {

    this.directed = directed;
    this.nodeMap = undefined; // key to node map
    this.buildFromPairs = function(pairs) {
        var dict = pairs.reduce(function(acc, p) {
            if (p.length < 2) {
                console.log("warning: ignore invalid pair: " + p);
            } else {
                if (acc[p[0]] === undefined) {
                    acc[p[0]] = {};
                }
                acc[p[0]][p[1]] = true;
                if (!directed) {
                    if (acc[p[1]] === undefined) {
                        acc[p[1]] = {};
                    }
                    acc[p[1]][p[0]] = true;
                }
            }
            return acc;
        }, {});
        var nodeMap = Object.keys(dict).reduce(function(acc, k) {
            acc[k] = new GraphNode(k);
            return acc;
        }, {});
        // fill neighbors
        Object.keys(nodeMap).forEach(function(nodeKey) {
            var neighborKeys = Object.keys(dict[nodeKey]);
            neighborKeys.forEach(ngbKey => nodeMap[nodeKey].neighbors[ngbKey] = true);
        });
        this.nodeMap = nodeMap;
    };
    this.adjs = function(node) {
        var nodeMap = this.nodeMap;
        return Object.keys(node.neighbors).map(ngbKey => nodeMap[ngbKey]);
    };

    this.getAllNodes = function() {
        var nodeMap = this.nodeMap;
        return Object.keys(nodeMap).map(k => nodeMap[k]);
    };

    this.getNode = function(key) {
        return this.nodeMap[key];
    }

    this.BFS = function(source, visitFunc) {
        this.getAllNodes().forEach(function(n) {
            n.tag = undefined; // unvisited
        });
        var queue = [source];
        source.tag = false; // under visit
        source.info = { "prev": null, "dis": 0 }; // use info to trace back the path
        while (queue.length > 0) {
            var cur = queue.shift();
            this.adjs(cur).forEach(function(n) {
                if (n.tag === undefined) {
                    n.tag = false; // under visit
                    n.info = { "prev": cur, "dis": cur.info.dis + 1 };
                    queue.push(n);
                }
            });
            visitFunc(cur);
            cur.tag = true; // visited
        }
    };

    this.DFS = function(visitFunc) {
        var myself = this;
        var curTime = -1;

        function recursiveDFS(source, visitFunc) {
            if (source.tag === undefined) {
                curTime += 1;
                source.tag = false; // under visit
                source.info.start = curTime;
                visitFunc(source);
                myself.adjs(source).forEach(function(adj) {
                    adj.info.parent = source;
                    recursiveDFS(adj, visitFunc);
                });
                curTime += 1;
                source.tag = true; // visited
                source.info.end = curTime;
            }
        }
        var nodes = myself.getAllNodes();
        nodes.forEach(function(n) {
            n.tag = undefined; // unvisited
        });
        nodes.forEach(function(n) {
            recursiveDFS(n, visitFunc);
        });
    };

    this.copy = function() {
        var copyGraph = new Graph(this.directed);
        var oldNodes = this.getAllNodes();
        var newNodes = oldNodes.map(n => new GraphNode(n.data));
        var newNodeMap = newNodes.reduce(function(acc, n) {
            acc[n.data] = n;
            return acc;
        }, {});
        // copy neighbors
        oldNodes.forEach(function(oldNode, index) {
            newNodes[index].neighbors = Object.keys(oldNode.neighbors).reduce(function(acc, ngbKey) {
                acc[ngbKey] = true;
                return acc;
            }, {});
        });
        copyGraph.nodeMap = newNodeMap;
        return copyGraph;
    }

}

function GraphNode(data) {
    this.data = data;
    this.neighbors = {}; // we may store edge info here
    this.tag = undefined;
    this.info = {};
}

function graphDFS(input) {
    var pairs = eval(input);

    var graph = new Graph();
    graph.buildFromPairs(pairs);

    var result = [];
    var visitFunc = function(n) {
        result.push(n.data);
        // @animateGraph("graph", graph, [n])
        // @animateArray("result", result, range(0, result.length), [], [result.length - 1], true)
    };
    graph.DFS(visitFunc);

    return result.join(",");
}