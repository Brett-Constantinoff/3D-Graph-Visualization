export function dijkstra(maze)
{
    let mazeCpy = Object.assign(Object.getPrototypeOf(maze), maze);
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
                    if (seen.has(neighbor) === false && neighbor.distance > minNode.distance + weight)
                    {
                        neighbor.distance = minNode.distance + weight;
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
            mazeCpy.algVis.dijkstra.order.push(node);
            for (let [key, value] of mazeCpy.adjList)
            {
                if (key.x === minNode.mesh.position.x && key.y === minNode.mesh.position.y && key.z === minNode.mesh.position.z)
                    mazeCpy.adjList.delete(key);
            }
            mazeCpy.adjList.set(minNode.mesh.position, neighbours)
        }
        
    }
    dijkstraShortesPath(mazeCpy.endNode, mazeCpy)
}

function getMin(maze, seen)
{
    let min = Infinity;
    let minNode = null;
    let neighbours = null;

    for (let [currNodePos, neighborInfo] of maze.adjList)
    {
        let currNode = maze.getNode(currNodePos);
        if (seen.has(currNode) === false && currNode.distance < min)
        {
            min = currNode.distance;
            minNode = currNode;
            neighbours = neighborInfo;
        }
    }
    return {minNode, neighbours};
}

function dijkstraShortesPath(endNode, maze)
{
    // iterate through node parents from end
    let currNode = endNode;

    while (currNode.parent.type != "start")
    {
        maze.algVis.dijkstra.shortestPath.push(currNode);
        currNode = currNode.parent;
    }
    maze.algVis.dijkstra.shortestPath.push(currNode);
    maze.algVis.dijkstra.shortestPath.push(maze.startNode);
    // reverse array after
    maze.algVis.dijkstra.shortestPath.reverse();
}