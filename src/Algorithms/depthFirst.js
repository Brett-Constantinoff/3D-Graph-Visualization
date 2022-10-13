/**
 * Generates pathways through the maze
 *
 * @param {Vector3} nodePos position of a given node
 * @param {Maze} maze maze object
 */
export function depthFirstSearch(nodePos, maze)
{
    let stack = [];
    // get current node object
    let node = maze.getNode(nodePos);
    stack.push(node);

    while (stack.length > 0)
    {
        let currNode = stack.pop();
        let currPos = currNode.mesh.position;

        // get neighbors
        let n = [];
        maze.adjList.forEach((value, key) => {
            if ((key.x == currPos.x) && (key.y == currPos.y) && (key.z == currPos.z))
            {
                // get a list of unvisited neighbors
                value.forEach((val) => {
                    if (!maze.getNode(val).visited)
                        n.push(val);
                });
            }
        });

        if (n.length > 0)
        {
            // push cell back to stack
            stack.push(currNode);

            //choose a random neighbor
            let index = Math.floor(Math.random() * (n.length - 1));
            let neighbor = maze.getNode(n[index]);
            
            // quit once end is found
            if (neighbor.type === "end")
                return
            neighbor.visited = true;
            if (neighbor.type != "start")
            {
                neighbor.material.color.set(0x66ff00);
                neighbor.type = "path"; 
                stack.push(neighbor);
            }
       
        }
        
    }
  
}