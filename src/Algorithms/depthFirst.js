/**
 * Generates pathways through the maze
 *
 * @param {Vector3} nodePos position of a given node
 * @param {Maze} maze maze object
 */
export function depthFirstSearch(nodePos, maze)
{
    // get current node object
    let node = maze.getNode(nodePos);

    let n;
    maze.adjList.forEach((value, key) => {
        if (key.x === nodePos.x && key.y === nodePos.y && key.z === nodePos.z) 
        {
            n = value;
        }
    })

    // if node exists
    if (node)
    {
        if (node.type === "path")
        {
            node.material.color.set(0xD288A2);
            node.material.opacity = 1.0;
        }
        // mark the current node as visited
        node.visited = true;
        // get a random neighbour and make it a path
        let index = Math.floor(Math.random() * n.length);
        let randomPath = maze.getNode(n[index]);
        if (node.type != "end")
        {
            randomPath.type = "path";
        }
  
        // perfrom dfs on each neighbour recursivly
        n.forEach((neighbourPos) => {
            let neighbour = maze.getNode(neighbourPos);
            if (!neighbour.visited)
            {
                // again, this cant be in its own function for some reason
                let n;
                maze.adjList.forEach((value, key) => {
                    if (key.x === neighbourPos.x && key.y === neighbourPos.y && key.z === neighbourPos.z) 
                    {
                        n = value;
                    }
                })
                // recurse
                depthFirstSearch(neighbourPos, maze);
            }
        })
    }
}