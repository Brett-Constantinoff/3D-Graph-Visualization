import Queue from "./Queue";

export function dijkstra(maze)
{
    let endFound = false;
    maze.startNode.distance = 0;
    let q = new Queue();
    q.enqueue(maze.start);

    while (!q.isEmpty && !endFound)
    {
        let currPos = q.dequeue();
        let currNode = maze.getNode(currPos);

        let node = 
        {
            mesh: currNode.getMesh(),
            neighbours: []
        };

        if (currNode.type === "end")
        {
            endFound = true;
            dijkstraShortesPath(currNode, maze);
            console.log("found");
            continue;
        }
        if (currNode)
        {
            // get neighbours
            let n = null;
            maze.adjList.forEach((neighbourInfo, key) => {
                if ((key.x == currPos.x) && (key.y == currPos.y) && (key.z == currPos.z))
                {
                    n = neighbourInfo;
                }
            });
            
            // update neighbour weights and add each to the dijkstra order
            for (let i = 0; i < n.length; i++)
            {
                let neighbourObj = 
                {
                    mesh: null,
                    weight: null
                };
                let neighbour = maze.getNode(n[i].neighbour);
                if (neighbour.type === "path" || neighbour.type === "end")
                {
                    if (neighbour.type != "end")
                        neighbour.type = "dijkstra";
                    //maze.algVis.dijkstra.order.push(neighbour.getMesh());
                    let cost = n[i].weight;
                    if (currNode.distance + cost < neighbour.distance)
                    {
                        neighbour.distance = currNode.distance + cost;
                        neighbour.parent = currNode;
                    }
                    neighbourObj.mesh = neighbour;
                    neighbourObj.weight = cost;
                    node.neighbours.push(neighbourObj);
                    q.enqueue(n[i].neighbour);
                }
            }
            maze.algVis.dijkstra.order.push(node);
        }
    }
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