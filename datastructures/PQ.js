class Node{
    constructor(value, priority){
        this.value = value
        this.priority = priority
    }
}

class PriorityQueue{
    
    constructor(){
        this.values = []
    }

    swap(index1, index2){
        let temp = this.values[index1];
        this.values[index1] = this.values[index2];
        this.values[index2] = temp;
        return this.values;
    }
    bubbleUp(){
        let index = this.values.length - 1
        while(index > 0){
            let parentIndex = Math.floor((index - 1)/2);
            if(this.values[parentIndex].priority > this.values[index].priority){
                this.swap(index, parentIndex);
                index = parentIndex;
            } else{
                break;
            }
        }
        return 0;
    }
    enqueue(value){
        this.values.push(value)
        this.bubbleUp();
        return this.values
    }
    toArray(){
        return this.values
    }
    peek(){
        return this.values[0]
    }
    bubbleDown(){
        
        let parentIndex = 0;
        const length = this.values.length;
        const elementPriority = this.values[0].priority;
        while (true){
            let leftChildIndex = (2 * parentIndex) + 1;
            let rightChildIndex = (2 * parentIndex) + 2;
            let leftChildPriority, rightChildPriority;
            let indexToSwap = null;
            if(leftChildIndex < length){
                leftChildPriority = this.values[leftChildIndex].priority
                if(leftChildPriority < elementPriority){
                    indexToSwap = leftChildIndex;
                }
            }
            if(rightChildIndex < length){
                rightChildPriority = this.values[rightChildIndex].priority

                if(
                    (rightChildPriority < elementPriority && indexToSwap === null) ||
                    (rightChildPriority < leftChildPriority && indexToSwap !== null))
                {
                    indexToSwap = rightChildIndex
                }
            }
            if(indexToSwap === null){
                break;
            } 
            this.swap(parentIndex, indexToSwap);
            parentIndex = indexToSwap;
        }  
    }

    dequeue(){
        this.swap(0, this.values.length - 1);
        let poppedNode = this.values.pop();
        if(this.values.length > 1){
            this.bubbleDown();
        }
        
        return poppedNode;
    }
}

module.exports = {
    PriorityQueue,
    Node,
}