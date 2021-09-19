class StateIterator {
    
    constructor(startDateNode, startAvailabilityNode) {

        this.currentDateNode = startDateNode;
        this.currentAvailabilityNode = startAvailabilityNode;

        this.representedVailabilityAsText = {
            
            'none' : '−',
            'res-end' : '✖︎',
            'calendar-content-td': '●',
        }

        this.representedVailabilityKind = {
            
            'none' : State.skip,
            'res-end' : State.invalid,
            'calendar-content-td': State.valid,
        }
    }
    
    moveToNextState() {
        
        this.currentDateNode = this.currentDateNode.nextElementSibling;
        this.currentAvailabilityNode = this.currentAvailabilityNode.nextElementSibling;
    }
    
    next() {
    
        const dateNode = this.currentDateNode;
        const availabilityNode = this.currentAvailabilityNode;

        if (!dateNode || !availabilityNode) {
            return { done: true };
        }
        
        const date = dateNode.innerText;
        const availability = this.representedVailabilityAsText[availabilityNode.className];
        const availabilityKind = this.representedVailabilityKind[availabilityNode.className];
        
        const state = new State(date, availability, availabilityKind);

        this.moveToNextState();
        
        return { done: false, value: state };
    }
    
    [Symbol.iterator]() {

        return this;
    }
}
