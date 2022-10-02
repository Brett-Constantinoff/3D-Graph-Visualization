//this class is used to represent a graph using an adjacency list  Do what you want with it. I was following a fireship.io tutorial.
export default class AdjacencyList
{
    constructor()
    {
        this.adjacencyList = new Map();
    }

    addVertex(vertex, neighbours)
    {
        this.adjacencyList.set(vertex, neighbours);
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

    getAdjacencyList()
    {
        return this.adjacencyList;
    }
}