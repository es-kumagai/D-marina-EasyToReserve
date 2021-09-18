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

function removeCanvas() {

    const canvasNode = document.getElementById(Canvas.id);
    
    if (canvasNode) {
        
        document.body.removeChild(canvasNode);
    }
}

function receiveRequestAvailabilityOfAllReservationsMessage() {
    
    const request = new XMLHttpRequest();
    const endpoint = new Endpoint(2021, 9, 21, 18, 3);

    request.onreadystatechange = (event) => {
        
        const canvasNode = document.getElementById('canvas');
        
        if (request.readyState == XMLHttpRequest.DONE && request.response && !canvasNode) {

            const response = new Response(request.response);
            const canvas = new Canvas(response.plan);
            
            document.body.appendChild(canvas.node);
        }
    };
    
    this.removeCanvas();
    
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
