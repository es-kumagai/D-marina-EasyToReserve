document.addEventListener("DOMContentLoaded", function(event) {
    
    removeCanvas();
});

document.addEventListener("UPDATE_AVAILABILITIES", (event) => {
   
    const startDate = new DateComponents(String(event.detail['selectedDate']));
    const baseDate = new DateComponents(String(event.detail['baseDate']));

    updateAvailabilities(startDate, baseDate);
});

document.addEventListener("MOVE_TO_CALENDAR", (event) => {
    
    const canvasNode = document.getElementById(Canvas.id);
    const calendarNode = document.getElementById('calendar');
    
    const x = canvasNode.clientLeft + canvasNode.clientWidth - 300;
    const y = calendarNode.offsetTop - 300;
    
    window.scrollTo({
        top: x,
        left: y,
        behavior: 'smooth',
    });
});

safari.self.addEventListener('message', (event) => {
    
    switch (event.name) {
            
        case 'request-availability-of-all-reservations':
            receiveRequestAvailabilityOfAllReservationsMessage();
    }
});

function removeCanvas() {

    const canvasNode = document.getElementById(Canvas.id);
    
    if (canvasNode) {
        
        canvasNode.remove();
    }
}

function receiveRequestAvailabilityOfAllReservationsMessage() {
    
    const page = new Page();
    const date = page.selectedDate;
    
    updateAvailabilities(date, date);
}

async function updateAvailabilities(startDate, baseDate) {

    const page = new Page();

    if (!startDate) {
    
        alert('Start date is not selected.');
        return;
    }
    
    removeCanvas();
    
    const canvas = new Canvas(page, startDate, baseDate);

    canvas.makeNavigatorNode();
    
    for (const course of page.courses) {

        const maker = new NodeMaker('span', 'calendar-buttons');
        
        maker.appendNode(canvas.calendarMoveBaseDateNode);
        maker.appendNode(canvas.calendarMoveNextWeekNode);
        maker.appendNode(canvas.calendarMoveNextMonthNode);

        canvas.makeCourseNode(course, maker.node);
        
        for (const boat of page.boats) {

            const response = await requestPlan(startDate, boat, course);
            
            canvas.appendPlanCanvas(new PlanCanvas(canvas, response));
        }
    }
}

function requestPlan(startDate, boat, course) {

    const request = new XMLHttpRequest();
    const endpoint = new Endpoint(startDate, boat.id, course.id);

    return new Promise(resolve => {
        
        request.onreadystatechange = (event) => {
            
            if (request.readyState == XMLHttpRequest.DONE && request.response) {

                const response = new Response(boat, course, request.response);
                
                resolve(response);
            }
        };
        
        request.open('GET', endpoint.url, true);
        request.send(null);
    });
}
