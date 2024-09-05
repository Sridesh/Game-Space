import sys
import math

#maxint has been changed to max float
class BellmanFord:
    def __init__(self,vertice_count): #add graph array as argument as well. also include start vertex
        self.vertice_count=vertice_count
        self.graph = [
        [0, 8, 0, 0, 0, 10, 0, 0],
        [0, 0, 4, 0, 10, 0, 0, 0],
        [0, 0, 0, 3, 0, 0, 0, 0],
        [0, 0, 0, 0, 25, 18, 0, 0],
        [0, 0, 0, 9, 0, 0, 7, 0],
        [5, 7, 3, 0, 2, 0, 0, 0],
        [0, 0, 0, 2, 0, 0, 0, 3],
        [4, 9, 0, 0, 0, 0, 0, 0]
        ]
        self.maxfloat = sys.maxsize  # Using infinity
        self.edge_cost = []
        self.start_vertex = 0
        self.distances = []
        self.edgelist = []

    def create_edgelist(self):
        for x in range(self.vertice_count):
            for y in range(self.vertice_count):
                if self.graph[x][y] != 0:
                    self.edgelist.append([x, y])
                    self.edge_cost.append(self.graph[x][y])

    def init_distances(self):
        for i in range(self.vertice_count):
            self.distances.append(self.maxfloat)
    
        self.distances[self.start_vertex] = 0

    def print_distances(self):
        for i in range(len(self.distances)):
            
        
                print(f"Distance from {self.start_vertex+1} to {i+1} is {self.distances[i]+1}")

    def calculate(self):
        for _ in range(self.vertice_count):
            for x in range(len(self.edgelist)):
                u = self.edgelist[x][0]
                v = self.edgelist[x][1]
                if self.distances[u] + self.edge_cost[x] >= self.maxfloat:
                    self.distances[v] = self.maxfloat
                elif self.distances[u] + self.edge_cost[x] < self.distances[v]:
                    self.distances[v] = self.distances[u] + self.edge_cost[x]
                    #print(f"Distance of u is {self.distances[u]} and edge cost of uv is {self.edge_cost[x]} equals to {self.distances[v]}")
    
     


bf = BellmanFord(8)
bf.create_edgelist()
bf.init_distances()
bf.calculate()
bf.print_distances()


#print(bf.distances[2] + bf.edge_cost[1] < bf.distances[1])