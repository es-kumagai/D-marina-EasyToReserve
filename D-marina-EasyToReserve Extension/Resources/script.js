document.addEventListener('DOMContentLoaded', function(event) {
    
    removeCanvas();
});

document.addEventListener('UPDATE_AVAILABILITIES', (event) => {
   
    const startDate = new DateComponents(String(event.detail['selectedDate']));
    const baseDate = new DateComponents(String(event.detail['baseDate']));

    updateAvailabilities(startDate, baseDate);
});

document.addEventListener('HIDE_CANVAS', (event) => {

    removeCanvas();
});

document.addEventListener('MOVE_TO_CALENDAR', (event) => {
    
    const canvasNode = getCanvasNode();
    const calendarNode = getCalendarNode();
    
    const x = canvasNode.clientLeft + canvasNode.clientWidth - 300;
    const y = calendarNode.offsetTop - 300;
    
    window.scrollTo({
        top: x,
        left: y,
        behavior: 'smooth',
    });
});

document.addEventListener('CANVAS_DID_UPDATE', (event) => {

    resizeMainNode();
});

document.addEventListener('CANVAS_DID_REMOVE', (event) => {
    
    resizeMainNode();
});

window.addEventListener('resize', (event) => {

    resizeMainNode();
});

safari.self.addEventListener('message', (event) => {
    
    switch (event.name) {
            
        case 'request-availability-of-all-reservations':
            receiveRequestAvailabilityOfAllReservationsMessage();
    }
});

function resizeMainNode() {
    
    const canvasNode = getCanvasNode();
    let canvasWidth = '0px';
    
    if (canvasNode) {

        const styles = window.getComputedStyle(canvasNode);
        const marginLeft = styles.getPropertyValue('margin-left');
        const marginRight = styles.getPropertyValue('margin-right');
        
        canvasWidth = `${canvasNode.offsetWidth}px + ${marginLeft} + ${marginRight}`;
    }

    const rootNode = getRootNode();
    const mainNode = getMainNode();

    const rootWidth = `${rootNode.clientWidth}px`;
    const width = `calc(${rootWidth} - (${canvasWidth}))`;
    
    mainNode.style.width = width;
}

function getRootNode() {

    return document.body;
}

function getMainNode() {
    
    return document.getElementById('container-iframe');
}

function getCalendarNode() {
    
    return document.getElementById('calendar');
}

function getCanvasNode() {

    return document.getElementById(Canvas.id);
}

function getNavigatorNode() {

    return document.getElementById(Canvas.navigatorId);
}

function dispatchEvent(name, detail = undefined) {

    let event = undefined;
    
    if (detail) {

        event = new CustomEvent(name, { detail : detail });
    }
    else {
        
        event = new CustomEvent(name);
    }
    
    document.dispatchEvent(event);
}

function removeCanvas() {

    const canvasNode = getCanvasNode();
    
    if (canvasNode) {
    
        canvasNode.remove();
        dispatchEvent('CANVAS_DID_REMOVE');
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

        canvas.makeCourseNode(course, canvas.calendarMovesNode);
        
        for (const boat of page.boats) {

            const response = await requestPlan(startDate, boat, course);
            
            canvas.appendPlanCanvas(new PlanCanvas(canvas, response));
            
            dispatchEvent('CANVAS_DID_UPDATE');
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
