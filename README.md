# 3D Visualization of Graph Based Traversal Algorithms

## Project Inspiration

This application was designed to visualize popular graph traversal algorithms in an easy to use and intuitive manner. Many 
algorithms can be difficult to visualize and thus their understanding may be lost with some individuals. Therefore, seeing 
certain operations being performed in a visual manner can help with understanding algorithms in a fun and interactive way.

## Project Description

When starting the application, the user is brought to the landing screen where a canvas shows an interactive cube "box" where 
they can manipulate its orientation and size. 
![capture1](https://user-images.githubusercontent.com/77081808/215588989-ff204f9d-34d5-4d74-abf8-1a2409cb998d.PNG)

The user can then generate a "maze" which is composed of nodes in a graph. Each nodes represents a inner cube in the outer cube frame, where certain nodes
are designate as maze pathways (green) and maze walls (blue). Each node in this initialization state is transparent.
![capture 2](https://user-images.githubusercontent.com/77081808/215589142-89b8327f-37c9-4400-9b77-3bc4b2808649.PNG)

Once the desire maze has been generated the user can then select an algorithm to begin solving the maze, and once the maze has been solved the shortest path is then displayed to the user. Mazes can be continualy generated and solved by the user.

## Algorithm Description

There were four main algorithms used in this project: depth first search (DFS), breadth first search (bfs), djikstras algorithm, and the a-star algorithm.

### Depth First Search

DFS is used in order to create the maze pathways from a starting node to an ending node. This is not the recursive version seen in many implementations, instead a first in first out (FIFO) data structure known as a stack is used to perform DFS.

### Breadth First Search

BFS is the first traversal algorithm implemented and uses a queue in order to visit all the nodes in the graph. 
![Capture](https://user-images.githubusercontent.com/77081808/215590379-3eb62273-2ba2-4d1e-a79a-6d9d68e71a6d.PNG)

The shortest path calculated from bfs may not be the true shortest path, but indeed it will be the first path discorvered by the algorithm.
![Capture](https://user-images.githubusercontent.com/77081808/215590554-a8cdd0d9-b666-4970-8070-e3c403f4390b.PNG)

### Djikstra's Algorithm

Djikstra's algorithm is the second traversal algorithm which uses known edge weights to calculate distances from any node to the start node. Node weights are visua!
lized as a heat map from light (low weight) to dark (heavy weight)
[Capture](https://user-images.githubusercontent.com/77081808/215591092-b70fa0d6-3406-433f-a9de-1abb380e9620.PNG)

Unlike BFS, the shortest path is indeed the shortest path from start node to end node
![Capture](https://user-images.githubusercontent.com/77081808/215591244-b92febcf-3bab-4a37-a8f5-5aeebc39d212.PNG)

### A-Star Algorithm

A-star is the third and final algorithm to be implemented, it operates much the same as djikstra's algorithm but uses an extra heurstic in its node distance calculation. This heurstic is determined to be the Euclidean distance from the start node to any other node.
[Capture](https://user-images.githubusercontent.com/77081808/215591650-abcf9785-1f94-4f5c-876b-250f16d224fb.PNG)

The shortest path calculation is the same as djikstra's algorithm and results in the same shortest path.
![Capture](https://user-images.githubusercontent.com/77081808/215591871-839b32b9-0199-4ef8-9797-04c96d652bfb.PNG)

## Other Features

For each traversal algorithm, the pseudo code is available for visualization. This allows the user to see the code responsible for the interactive algorithm.

### BFS Psuedo Code
![Capture](https://user-images.githubusercontent.com/77081808/215592112-50c0b499-1989-4522-ba60-5534ee5308a3.PNG)

### Djikstra's Pseudo Code
![Capture](https://user-images.githubusercontent.com/77081808/215592330-cd57bbf3-83a6-41af-8b5e-d53c08ada16c.PNG)

### A-Star Pseudo Code
![Capture](https://user-images.githubusercontent.com/77081808/215592439-31288cdf-04df-455d-9051-82f61b04fb84.PNG)

## Project Usage

To use this application first clone the repository using ```git clone git@github.com:Brett-Constantinoff/3D-Graph-Visualization.git```

Once cloned, navigate to the root directory and run only once ```npm install```

After the required packages are installed, use the command ```npm run dev``` to run the application.

