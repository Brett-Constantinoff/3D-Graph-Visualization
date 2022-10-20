class Queue
{
    constructor()
    {
        this.elements = {};
        this.head = 0;
        this.tail = 0;
    }

    enqueue(element)
    {
        this.elements[this.tail] = element
        this.tail++;
    }

    dequeue()
    {
        const item = this.elements[this.head];
        delete this.elements[this.head];
        this.head++;
        return item;
    }

    peek()
    {
        return this.elements[this.head];
    }

    get length()
    {
        return this.tail - this.head;
    }

    get isEmpty()
    {
        return this.length === 0;
    }
}

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
            maze.algVis.bfs.order.push(currNode.getMesh());
            if (currNode.type === "end")
            {
                // once end is found, create the shortest path and quit
                endFound = true;
                bfsShortesPath(currNode, maze);
                continue;
            }
            maze.adjList.forEach((neighbourInfo, key) => {
                if ((key.x == currPos.x) && (key.y == currPos.y) && (key.z == currPos.z))
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
                            q.enqueue(neighbourInfo[i].neighbour);
                        }
                    }
                }
            });
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

