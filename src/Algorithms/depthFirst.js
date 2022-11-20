/**
 * Generates pathways through the maze
 *
 * @param {Vector3} nodePos position of a given node
 * @param {Maze} maze maze object
 */

 const pseudoRandom = require('pseudo-random');

export function depthFirstSearch(nodePos, maze)
{
    
    let prng = pseudoRandom((Math.random() * 12021990) + 1); // set seed to random number between 1 and 12021990
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
        maze.adjList.forEach((neighbourInfo, key) => {
            if ((key.x == currPos.x) && (key.y == currPos.y) && (key.z == currPos.z))
            {
                // get a list of unvisited neighbors and push them on the stack
                neighbourInfo.forEach((info) => {
                    let neighbourNode = maze.getNode(info.neighbour);
                    if (!neighbourNode.visited)
                    {
                        n.push(info.neighbour);
                        stack.push(neighbourNode);
                    }
                });
            }
        });

        if (n.length > 0)
        {
            // push cell back to stack
            stack.push(currNode);

            //choose a random neighbor
            let index = Math.floor(prng.random() * (n.length - 1));
            let neighbor = maze.getNode(n[index]);
            
            // quit once end is found
            if (neighbor.type === "end")
            {
                return;
            }
               
            neighbor.visited = true;
            if (neighbor.type != "start")
            {
                neighbor.material.color.set(0x00FF00);
                neighbor.material.opacity = 0.25
                neighbor.type = "path"; 
                stack.push(neighbor);
            }
        }
    }
}