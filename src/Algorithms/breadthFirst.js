import Queue from "./Queue";

export function breadthFirstSearch(maze)
{
    let endFound = false;
    let q = new Queue();
    q.enqueue(maze.start);

    while (!q.isEmpty && !endFound)
    {
        let currPos = q.dequeue();
        let currNode = maze.getNode(currPos);
        if (currNode)
        {
            let node = 
            {
                mesh: currNode.getMesh(),
                neighbours: []
            };
            // maze.algVis.bfs.order.push(currNode.getMesh());
            if (currNode.type === "end")
            {
                // once end is found, create the shortest path and quit
                endFound = true;
                bfsShortesPath(currNode, maze);
                continue;
            }
            maze.adjList.forEach((neighbourInfo, key) => {
                if ((key.x === currPos.x) && (key.y === currPos.y) && (key.z === currPos.z))
                {
                    // get a list of unvisited neighbors and push them on the queue
                    for (let i = 0; i < neighbourInfo.length; i++)
                    {
                        let neighbourNode = maze.getNode(neighbourInfo[i].neighbour);
                        if (neighbourNode.type === "path" || neighbourNode.type === "end")
                        {            
                            if (neighbourNode.type != "end")
                                neighbourNode.type = "bfs";
                            neighbourNode.parent = currNode;
                            node.neighbours.push(neighbourNode.getMesh());
                            q.enqueue(neighbourInfo[i].neighbour);
                        }
                    }
                }
            });
            maze.algVis.bfs.order.push(node);
        }
        }
}

function bfsShortesPath(endNode, maze)
{
    // iterate through node parents from end
    let currNode = endNode;
    while (currNode.parent.type != "start")
    {
        maze.algVis.bfs.shortestPath.push(currNode);
        currNode = currNode.parent;
    }
    maze.algVis.bfs.shortestPath.push(currNode);
    maze.algVis.bfs.shortestPath.push(maze.startNode);
    // reverse array after
    maze.algVis.bfs.shortestPath.reverse();
}

