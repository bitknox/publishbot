const pqLIB = require('./datastructures/PQ')

const node = pqLIB.Node

const queue = pqLIB.PriorityQueue

const testq = new queue()
testq.enqueue(new node("test",2))
testq.enqueue(new node("test",54))
testq.enqueue(new node("test",5))

