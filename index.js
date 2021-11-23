nodes = []

function addNode(number, type) {
    nodes.push(number)
    var newNode = document.createElement("span");
    newNode.setAttribute("class", `node ${type == undefined ? "" : type}`);
    newNode.setAttribute("id", "node" + nodes.length);
    newNode.innerHTML = number;
    document.getElementById("root").appendChild(newNode);
    return newNode;
}

addNode(1, "root");

document.getElementById("add").addEventListener("click", function () {
    let newType = "left"
    let value = document.getElementById("number").value;
    addNode(value, newType);
});