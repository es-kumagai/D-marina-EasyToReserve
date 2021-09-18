document.addEventListener("DOMContentLoaded", function(event) {
    
    removeCanvas();
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
        
        document.body.removeChild(canvasNode);
    }
}

function receiveRequestAvailabilityOfAllReservationsMessage() {
    
    const page = new Page();
    const selectedDate = page.selectedDate;

    if (!selectedDate) {
    
        alert('Start date is not selected.');
        return;
    }
    
    removeCanvas();
    
    const canvas = new Canvas(page);

    for (const course of page.courses) {

        canvas.makeCourseNode(course);
        
        for (const boat of page.boats) {

            requestPlan(selectedDate, boat, course, (response) => {
                
                canvas.appendPlanCanvas(new PlanCanvas(canvas, response));
            });
        }
    }
}

function requestPlan(startDate, boat, course, handler) {

    const request = new XMLHttpRequest();
    const endpoint = new Endpoint(startDate, boat.id, course.id);

    request.onreadystatechange = (event) => {
        
        if (request.readyState == XMLHttpRequest.DONE && request.response) {

            const response = new Response(boat, course, request.response);
            
            handler(response);
        }
    };
    
    request.open('GET', endpoint.url, true);
    request.send(null);
}
