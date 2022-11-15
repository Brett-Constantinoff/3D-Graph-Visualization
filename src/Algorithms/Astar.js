import Queue from "./Queue";

export function Astar(maze)
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
            aStarShortesPath(currNode, maze);
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
                        neighbour.type = "aStar";
                    let cost = n[i].weight;
                    //let hn = neighbour.mesh.position.distanceTo(maze.endNode.mesh.position);
                    let hn = Math.sqrt( Math.pow((maze.endNode.mesh.position.x - neighbour.mesh.position.x), 2) + 
                                        Math.pow((maze.endNode.mesh.position.y - neighbour.mesh.position.y), 2) + 
                                        Math.pow((maze.endNode.mesh.position.z - neighbour.mesh.position.z), 2));
                    if (currNode.distance + cost + hn < neighbour.distance)
                    {
                        neighbour.distance = currNode.distance + cost + hn;
                        neighbour.parent = currNode;
                    }
                    neighbourObj.mesh = neighbour;
                    neighbourObj.weight = cost;
                    node.neighbours.push(neighbourObj);
                    q.enqueue(n[i].neighbour);
                }
            }
            maze.algVis.aStar.order.push(node);
        }
    }
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