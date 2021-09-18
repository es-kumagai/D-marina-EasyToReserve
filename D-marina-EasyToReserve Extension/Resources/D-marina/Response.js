class Response {
    
    constructor(json) {
        
        const response = JSON.parse(json);
        
        this.currentDay = response['cur_day'];
        this.currentMonth = response['cur_month'];
        this.currentYear = response['cur_year'];
        this.selectStep = response['select_step'];
        this.stSelDt = response['st_sel_dt'];

        this.returnedHTML = response['ret_html'];
    }
    
    get plan() {
        
        const rootNode = document.createElement('div');
        
        rootNode.innerHTML = this.returnedHTML;

        const tableNodes = rootNode.getElementsByTagName('table');
        const datesNode = tableNodes[1];
        const availabilitiesNode = tableNodes[2];
        
        const dateNodes = datesNode.getElementsByTagName('th');
        const availabilityNodes = availabilitiesNode.getElementsByTagName('td');
        
        const plan = new Plan('BOAT', 'COURSE', new Array());
        const stateIterator = new StateIterator(dateNodes[1], availabilityNodes[0]);
        
        for (const state of stateIterator) {
            
            plan.appendState(state);
        }

//        for (let offset = 0; offset != 7; ++offset) {
//
//            const dateNode = dateNodes[offset + 1];
//            const availabilityNode = availabilityNodes[offset];
//
//            const date = dateNode.innerText;
//            const availability = representedVailabilityAsText[availabilityNode.className];
//
//            plan.appendState(new State(date, availability));
//        }
        
        return plan;
    }
}

class StateIterator {
    
    constructor(startDateNode, startAvailabilityNode) {

        this.currentDateNode = startDateNode;
        this.currentAvailabilityNode = startAvailabilityNode;

        this.representedVailabilityAsText = {
            
            'none' : '定休日',
            'res-end' : '✖︎',
            'calendar-content-td': '●',
        }

        this.representedVailabilityKind = {
            
            'none' : 'availability-skip',
            'res-end' : 'availability-invalid',
            'calendar-content-td': 'availability-valid',
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
