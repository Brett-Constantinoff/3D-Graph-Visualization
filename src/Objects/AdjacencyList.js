//this class is used to represent a graph using an adjacency list
export default class AdjacencyList
{
    constructor()
    {
        this.adjacencyList = new Map();
    }

    addVertex(vertex)
    {
        this.adjacencyList.set(vertex, []);
    }

    addEdge(vertex1, vertex2)
    {
        this.adjacencyList.get(vertex1).push(vertex2);
        this.adjacencyList.get(vertex2).push(vertex1);
    }

    getNeighbors(vertex)
    {
        //returns an array of neighboring vertices from the given vertex
        return this.adjacencyList.get(vertex); 
    }

    getVertices()
    {
        //returns an array of vertices
        return this.adjacencyList.keys();
    }

    getEdges()
    {
        let edges = [];
        for (let [vertex, edgeList] of this.adjacencyList)
        {
            edgeList.forEach(edgeVertex => {
                let edge = {source : vertex, target : edgeVertex};
                edges.push(edge);
            });
        }
        return edges;
    }

    getAdjacencyList()
    {
        return this.adjacencyList;
    }
}