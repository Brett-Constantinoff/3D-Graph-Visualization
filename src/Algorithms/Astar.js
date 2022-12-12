export function Astar(maze)
{
    let mazeCpy = Object.assign(Object.getPrototypeOf(maze), maze);
    mazeCpy.startNode.huerstic = 0;
    mazeCpy.startNode.distance = 0;
    let seen = new Set();

    for (let [currNodePos, neighborInfo] of mazeCpy.adjList)
    {
        // get minimum node
        let minInfo = getMin(mazeCpy, seen);
        if (minInfo.minNode != null && minInfo.neighbours != null)
        {
            let minNode = minInfo.minNode;
            let neighbours = minInfo.neighbours;
           

            let node = 
            {
                mesh: minNode.getMesh(),
                neighbours: []
            };

            seen.add(minNode);

            // for each neighbor of minimum node
            for (let i = 0; i < neighbours.length; i++)
            {
                // get neighbor node
                let neighbor = mazeCpy.getNode(neighbours[i].neighbour);
                if (neighbor.type != "wall")
                {
                     // get the weight of the current neighbor
                    let weight = neighbours[i].weight;
                    // update neighbor distance
                    let hn = Math.sqrt( Math.pow((mazeCpy.endNode.mesh.position.x - neighbor.mesh.position.x), 2) + 
                                        Math.pow((mazeCpy.endNode.mesh.position.y - neighbor.mesh.position.y), 2) + 
                                        Math.pow((mazeCpy.endNode.mesh.position.z - neighbor.mesh.position.z), 2));
                    if (seen.has(neighbor) === false && neighbor.distance > minNode.distance + weight)
                    {
                        neighbor.distance = minNode.distance + weight;
                        neighbor.huerstic = neighbor.distance + hn;
                        // this line was fucking us
                        //neighbours[i].weight = minNode.distance + weight;

                        // set the parent of the neighbor to the current node
                        neighbor.parent = minNode;

                        let neighbourObj = 
                        {
                            mesh: neighbor.getMesh(),
                            weight: weight,
                        };
                        node.neighbours.push(neighbourObj);
                    }
                }
            }
            mazeCpy.algVis.aStar.order.push(node);
            for (let [key, value] of mazeCpy.adjList)
            {
                if (key.x === minNode.mesh.position.x && key.y === minNode.mesh.position.y && key.z === minNode.mesh.position.z)
                    mazeCpy.adjList.delete(key);
            }
            mazeCpy.adjList.set(minNode.mesh.position, neighbours)
        }
        
    }
    console.log(mazeCpy.endNode);
    aStarShortesPath(mazeCpy.endNode, mazeCpy)
}

function getMin(maze, seen)
{
    let min = Infinity;
    let minNode = null;
    let neighbours = null;

    for (let [currNodePos, neighborInfo] of maze.adjList)
    {
        let currNode = maze.getNode(currNodePos);
        if (seen.has(currNode) === false && currNode.huerstic < min)
        {
            min = currNode.huerstic;
            minNode = currNode;
            neighbours = neighborInfo;
        }
    }
    return {minNode, neighbours};
}

function aStarShortesPath(endNode, maze)
{
    // iterate through node parents from end
    let currNode = endNode;
    
    while (currNode.parent.type != "start")
    {
        maze.algVis.aStar.shortestPath.push(currNode);
        currNode = currNode.parent;
    }
    maze.algVis.aStar.shortestPath.push(currNode);
    maze.algVis.aStar.shortestPath.push(maze.startNode);
    // reverse array after
    maze.algVis.aStar.shortestPath.reverse();
}