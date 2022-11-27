import Queue from "./Queue";

export function dijkstra(maze)
{
    maze.startNode.distance = 0;
    let seen = new Set();

    for (let [currNodePos, neighborInfo] of maze.adjList)
    {
        // get minimum node
        let minNode = getMin(maze, seen);
        seen.add(minNode);

        // for each neighbor of minimum node
        for (let i = 0; i < neighborInfo.length; i++)
        {
            // get neighbor node
            let neighbor = maze.getNode(neighborInfo[i].neighbour);
            
            // get the weight of the current neighbor
            let weight = neighborInfo[i].weight;
            // update neighbor distance
            if (seen.has(neighbor) === false && neighbor.distance > minNode.distance + weight)
            {
                neighbor.distance = minNode.distance + weight;
                neighborInfo[i].weight = minNode.distance + weight;

                // set the parent of the neighbor to the current node
                neighbor.parent = minNode;
            }
            maze.adjList.set(currNodePos, neighborInfo)
        }
    }

    dijkstraShortesPath(maze.endNode, maze)
}

function getMin(maze, seen)
{
    let min = Infinity;
    let minNode = null;

    for (let [currNodePos, neighborInfo] of maze.adjList)
    {
        let currNode = maze.getNode(currNodePos);
        if (seen.has(currNode) === false && currNode.distance < min)
        {
            min = currNode.distance;
            minNode = currNode;
        }
    }
    return minNode;
}

function dijkstraShortesPath(endNode, maze)
{
    console.log(endNode)
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
    console.log(maze.algVis.dijkstra.shortestPath)

}