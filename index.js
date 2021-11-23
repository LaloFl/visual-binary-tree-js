var nodeCount = 0;

function addNode(type) {
    var newNode = document.createElement("span");
    newNode.setAttribute("class", `node ${type == undefined ? "" : type}`);
    newNode.setAttribute("id", "node" + nodeCount);
    newNode.innerHTML = nodeCount;
    document.getElementById("root").appendChild(newNode);
    nodeCount++;
    return newNode;
}

addNode();