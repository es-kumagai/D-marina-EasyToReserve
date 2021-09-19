class Response {
    
    constructor(boat, course, json) {
        
        this.boat = boat;
        this.course = course;
        
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
        
        const plan = new Plan(this.boat.name, this.course.label, new Array());
        const stateIterator = new StateIterator(dateNodes[1], availabilityNodes[0]);
        
        for (const state of stateIterator) {
            
            plan.appendState(state);
        }
        
        return plan;
    }
}
