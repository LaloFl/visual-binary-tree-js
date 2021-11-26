document.getElementById("value").focus();
var mainsvg = document.getElementById("mainsvg");

let nodes = {};
let nodesRelations = [];

//add window resize listener
window.addEventListener("resize", function() {
    if (nodesRelations.length <= 0) return;
    for (let i = 0; i < nodesRelations.length; i++) {
        let relation = `line${nodesRelations[i][0]}-${nodesRelations[i][1]}`;
        let line = document.getElementById(relation);
        let parentRect = document.getElementById(`node${nodesRelations[i][0]}`).getBoundingClientRect();
        let childRect = document.getElementById(`node${nodesRelations[i][1]}`).getBoundingClientRect();
        line.setAttribute("x1", parseInt(parentRect.x + parentRect.width / 2));
        line.setAttribute("y1", parseInt(parentRect.y + parentRect.height / 2));
        line.setAttribute("x2", parseInt(childRect.x + childRect.width / 2));
        line.setAttribute("y2", parseInt(childRect.y + childRect.height / 2));
    }
})

function addNode(nodeData) {
    var parentNode = document.getElementById(nodeData.parentValue ? "node"+nodeData.parentValue : "nodesBox");
    var newNode = document.createElement("span");
    newNode.setAttribute("class", `node ${nodeData.type}`);
    newNode.setAttribute("id", "node" + nodeData.value);
    // add styles on newNode hover
    newNode.addEventListener("mouseover", function() {
        newNode.style.backgroundColor = "#bfa";
    })
    newNode.addEventListener("mouseout", function() {
        newNode.style.backgroundColor = "#8d7";
    });
    let spacing = (4 - nodeData.floor) * 50;
    spacing = spacing < 25 ? 25 : spacing;
    if(nodeData.type === "left") {        
        newNode.style.right = `${spacing}px`
    }
    if (nodeData.type === "right") {
        newNode.style.left = `${spacing}px`
    }
    newNode.innerHTML = nodeData.value;
    parentNode.appendChild(newNode);
    // add line 
    if (nodeData.parentValue) {
        let relation = `line${nodeData.parentValue}-${nodeData.value}`
        nodesRelations.push([nodeData.parentValue, nodeData.value]);
        var parentRect = parentNode.getBoundingClientRect();
        var newRect = newNode.getBoundingClientRect();
        var line = document.createElementNS('http://www.w3.org/2000/svg','line');
        line.setAttribute("x1", parseInt(parentRect.x + parentRect.width / 2));
        line.setAttribute("y1", parseInt(parentRect.y + parentRect.height / 2));
        line.setAttribute("x2", parseInt(newRect.x + newRect.width / 2));
        line.setAttribute("y2", parseInt(newRect.y + newRect.height / 2));
        line.setAttribute("id", relation);
        mainsvg.appendChild(line);
        console.log(line, mainsvg);
    }
    return newNode;
}

const add = () => {
    if (document.getElementById("value").value != "") {
        let value = parseFloat(document.getElementById("value").value);
        document.getElementById("value").value = "";
        let nodeData = {};

        if (Object.keys(nodes).length == 0) {
            nodeData = {
                value: value,
                parentValue: null,
                type: "root",
                floor: 0,
                leftChild: null,
                rightChild: null
            }
            nodes = nodeData;
            document.getElementById("details").hidden = false;
            addNode(nodeData);
        }
        else if (!searchRecursive(value, nodes)) {
            let {parent, type} = searchPlaceRecursive(value, nodes)
            if (type === "left") {
                parent.leftChild = {
                    value: value,
                    parentValue: parent.value,
                    type: "left",
                    floor: parent.floor + 1,
                    leftChild: null,
                    rightChild: null
                }
                nodeData = parent.leftChild;
            }
            if (type === "right") {
                parent.rightChild = {
                    value: value,
                    parentValue: parent.value,
                    type: "right",
                    floor: parent.floor + 1,
                    leftChild: null,
                    rightChild: null
                }
                nodeData = parent.rightChild;
            }
            addNode(nodeData);
        }
    }
    document.getElementById("nodesJSON")
        .textContent = JSON.stringify(nodes, null, 4);
    document.getElementById("value").focus();
}

document.getElementById("add").addEventListener("click", add);
document.getElementById("value").addEventListener("keyup", function (event) {
    if (event.keyCode === 13) {
        add();
    }
})

const searchRecursive = (value, node) => {
    if (value === node.value) {
        return node;
    }
    else if (node.leftChild != null) {
        return searchRecursive(value, node.leftChild);
    }
    else if (node.rightChild != null) {
        return searchRecursive(value, node.rightChild);
    }
    else {
        return null;
    }
}

const searchPlaceRecursive = (value, node) => {
    if (value < node.value) {
        console.log(`value: ${value} < node.value: ${node.value}`);
        if (!node.leftChild) return {parent: node, type: "left"};
        return searchPlaceRecursive(value, node.leftChild);
    }
    else if (value > node.value) {
        console.log(`value: ${value} > node.value: ${node.value}`);
        if (!node.rightChild) return {parent: node, type: "right"};
        return searchPlaceRecursive(value, node.rightChild);
    }
}
