document.addEventListener("DOMContentLoaded", function(event) {
    
});

safari.self.addEventListener('message', (event) => {
    
    switch (event.name) {
            
        case 'request-availability-of-all-reservations':
            receiveRequestAvailabilityOfAllReservationsMessage();
    }
});

//function getMainPlanItems() {
//
//    const mainPlans = document.getElementById('list_main_plan');
//    const mainPlanItems = mainPlans.getElementsByTagName('tr');
//
//    return mainPlanItems;
//}
//
//function getSubPlanItems() {
//
//    const subPlans = document.getElementById('list_sub_plan');
//    const subPlanItems = subPlans.getElementsByTagName('tr');
//
//    return subPlanItems;
//}

function receiveRequestAvailabilityOfAllReservationsMessage() {
    
    const request = new XMLHttpRequest();
    const endpoint = new Endpoint(2021, 9, 21, 18, 3);

    request.onreadystatechange = (event) => {
        
        if (request.status == 200 && request.response) {

            const response = JSON.parse(request.response);
            
            const currentDay = response['cur_day'];
            const currentMonth = response['cur_month'];
            const currentYear = response['cur_year'];
            const selectStep = response['select_step'];
            const stSelDt = response['st_sel_dt'];

            const returnedHTML = response['ret_html'];
            
            const rootNode = document.createElement('div');

            rootNode.innerHTML = returnedHTML;

            const tableNodes = rootNode.getElementsByTagName('table');
            const datesNode = tableNodes[1];
            const availabilitiesNode = tableNodes[2];
            
            const dateNodes = datesNode.getElementsByTagName('th');
            const availabilityNodes = availabilitiesNode.getElementsByTagName('td');
            
            const plan = new Plan('BOAT', 'COURSE', new Array());

            for (let offset = 0; offset != 7; ++offset) {

                const dateNode = dateNodes[offset + 1];
                const availabilityNode = availabilityNodes[offset];

                const date = dateNode.innerText;
                let availability = null;

                switch (availabilityNode.className) {

                    case 'none':
                        availability = '定休日';
                        break;

                    case 'res-end':
                        availability = '✖︎';
                        break;

                    case 'calendar-content-td':
                        availability = '◯';
                        break;

                    default:
                        availability = '不明';
                        break;
                }

                plan.appendState(new State(date, availability));
            }

            const statesNode = makeStatesNode(plan);
            
            alert(statesNode.innerHTML);
        }
    };
    
    request.open('GET', endpoint.url, true);
    request.send(null);
    
//    const mainPlanItems = getMainPlanItems();
//
//    for (const mainPlanItem of mainPlanItems) {
//
//        updateRequestAvailability(mainPlanItem);
//        return;
//    }
}

function makeStatesNode(plan) {
    
    const statesNode = document.createElement('div');
    
    statesNode.appendChild(document.createTextNode(plan.boat))
    statesNode.appendChild(document.createTextNode(plan.course))

    for (const state of plan.states) {

        statesNode.appendChild(document.createTextNode(state.date))
        statesNode.appendChild(document.createTextNode(state.availability))
    }
    
    return statesNode;
}

//function updateRequestAvailability(mainPlanItem) {
//
//    const subPlanItems = getSubPlanItems();
//
//    mainPlanItem.click();
//
//    for (const subPlanItem of subPlanItems) {
//
//
//    }
//}
