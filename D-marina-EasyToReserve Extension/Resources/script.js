var holidaysCache = null;
var activeCanvasNodeWidth = null;

var updatingProcessSerialNumber = 0;

document.addEventListener('DOMContentLoaded', function(event) {
    
    prepare();
    removeCanvas(false);
});

document.addEventListener('UPDATE_AVAILABILITIES', (event) => {
   
    const startDate = new DateComponents(String(event.detail['selectedDate']));
    const baseDate = new DateComponents(String(event.detail['baseDate']));

    updateAvailabilities(startDate, baseDate);
});

document.addEventListener('HIDE_CANVAS', (event) => {

    removeCanvas(false);
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

document.addEventListener('CANVAS_AVAILABILITY_IN_FIRST_PLAN_DID_UPDATE', (event) => {

    resizeMainNode();
});

document.addEventListener('CANVAS_AVAILABILITY_DID_UPDATE', (event) => {

});

document.addEventListener('CANVAS_FIRST_PLAN_DID_UPDATE', (event) => {

    window.scrollBy(0, 1);
});

document.addEventListener('CANVAS_PLAN_DID_UPDATE', (event) => {

});

document.addEventListener('CANVAS_ALL_PLANS_DID_UPDATE', (event) => {

});

document.addEventListener('CANVAS_ALL_PLANS_UPDATE_CANCELLED', (event) => {

});

document.addEventListener('CANVAS_DID_REMOVE', (event) => {
    
    resizeMainNode();
});

document.addEventListener('HOLIDAYS_DID_RECEIVE', event => {
    
    applyHolidays(holidaysCache);
});

document.addEventListener('HOLIDAYS_DID_APPLY', event => {
   
});

window.addEventListener('resize', (event) => {

    resizeMainNode();
});

safari.self.addEventListener('message', (event) => {
    
    switch (event.name) {
            
        case 'request-availability-of-all-reservations':
            receiveRequestAvailabilityOfAllReservationsMessage();
            break;
            
        case 'holidays':
            extractHolidays(event.message['holidays']);
            break;
    }
});

function prepare() {
    
    const moveCalendarActionNode = document.createElement('input');
    
    const moveCalendarAction = [
        `date = new Date(Number(this.value));`,
        `getMaincalendar(date.getFullYear(), date.getMonth() + 1, date.getDate(), true);`,
    ];
    
    moveCalendarActionNode.id = 'move_calendar_action';
    moveCalendarActionNode.type = 'hidden';
    moveCalendarActionNode.text = '';
    moveCalendarActionNode.setAttribute('onclick', moveCalendarAction.join(' '));
    
    document.body.appendChild(moveCalendarActionNode);
    
    safari.extension.dispatchMessage("prepare-holidays");
}

function requestHolidays() {
    
    safari.extension.dispatchMessage("request-holidays");
}

function extractHolidays(holidays_json) {
    
    const holidays_object = eval(`(${holidays_json})`);
    const holidays = holidays_object.map(holiday_object => {
        
        const name = holiday_object['name'];
        const year = holiday_object['date']['year'];
        const month = holiday_object['date']['month'];
        const day = holiday_object['date']['day'];
        
        return new Holiday(name, year, month, day);
    });
    
    holidaysCache = holidays;
    
    dispatchEvent('HOLIDAYS_DID_RECEIVE');
}

function applyHolidays(holidays) {
    
    const dateNodes = getCanvasNode().getElementsByClassName('date');
    const availabilityNodes = getCanvasNode().getElementsByClassName('availability');

    function modifyClassList(node, date) {
    
        if (PlanCanvas.isHoliday(date, holidays)) {
            
            node.classList.add('holiday');
        }
        else {
            
            node.classList.remove('holiday');
        }
    }
    
    for (let i = 0; i != dateNodes.length; ++i) {
        
        const dateNode = dateNodes[i];
        const date = dateNode.innerText;
        
        modifyClassList(dateNode, date);
    }

    for (let i = 0; i != availabilityNodes.length; ++i) {
        
        const availabilityNode = availabilityNodes[i];
        const date = availabilityNode.getAttribute('data-date');
        
        modifyClassList(availabilityNode, date);
    }

    dispatchEvent('HOLIDAYS_DID_APPLY');
}

function getCanvasWidth() {
    
    const canvasNode = getCanvasNode();
    let canvasWidth = '0px';
    
    if (canvasNode) {
        
        const style = window.getComputedStyle(canvasNode);
        const marginLeft = style.getPropertyValue('margin-left');
        const marginRight = style.getPropertyValue('margin-right');
        
        canvasWidth = `${canvasNode.offsetWidth}px + ${marginLeft} + ${marginRight}`;
    }
    
    return canvasWidth;
}

function resizeMainNode() {
    
    let canvasWidth = getCanvasWidth();

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

function removeCanvas(keepingActiveCanvasWidth = false) {

    const canvasNode = getCanvasNode();
    
    if (canvasNode) {
    
        canvasNode.remove();
        dispatchEvent('CANVAS_DID_REMOVE');
    }
    
    if (!keepingActiveCanvasWidth) activeCanvasNodeWidth = null;
}

function removeSpecifiedWidthFromCalendadrDaysNode() {
    
    const daysNode = document.getElementById('scroll30');
        
    if (daysNode) {
        
        daysNode.style.width = '';
    }
}

function receiveRequestAvailabilityOfAllReservationsMessage() {
    
    if (!holidaysCache) requestHolidays();
    
    const page = new Page();
    const date = page.selectedDate;
    
    updateAvailabilities(date, date);
}

function validateUpdatingSerialNumber(serialNumber) {
    
    if (serialNumber < updatingProcessSerialNumber) throw new Error('Updating serial number is invalid.');
}

async function updateAvailabilities(startDate, baseDate, serialNumber) {

    const currentSerialNumber = ++updatingProcessSerialNumber;

    console.info(`Start updating availabilities in serial number: ${currentSerialNumber}.`);
    
    try {
        
        const page = new Page();
        
        if (!startDate) {
            
            throw new Error('Start date is not selected.');
        }
        
        removeCanvas(true);
        removeSpecifiedWidthFromCalendadrDaysNode();
        
        const canvas = new Canvas(page, startDate, baseDate, activeCanvasNodeWidth);
        let updatingFirstPlan = true;
        
        canvas.makeNavigatorNode();
        
        for (const course of page.courses) {
            
            canvas.makeCourseNode(course, canvas.calendarMovesNode);
            
            for (const boat of page.boats) {
                
                validateUpdatingSerialNumber(currentSerialNumber);
                
                const response = await requestPlan(startDate, boat, course);
                
                validateUpdatingSerialNumber(currentSerialNumber);
                
                canvas.appendPlanCanvas(new PlanCanvas(canvas, response));
                
                activeCanvasNodeWidth = canvas.width;
                
                if (updatingFirstPlan) {
                    
                    dispatchEvent('CANVAS_AVAILABILITY_IN_FIRST_PLAN_DID_UPDATE');
                }
                
                dispatchEvent('CANVAS_AVAILABILITY_DID_UPDATE');
            }
            
            if (updatingFirstPlan) {
                
                dispatchEvent('CANVAS_FIRST_PLAN_DID_UPDATE');
               updatingFirstPlan = false;

                console.info(`The first plan did update in updating serial = ${currentSerialNumber}.`);
            }
            
            activeCanvasNodeWidth = canvas.width;
            
            console.info(`A plan did update in updating serial = ${currentSerialNumber}.`);
            dispatchEvent('CANVAS_PLAN_DID_UPDATE');
        }
        
        console.info(`All plans did update in updating serial = ${currentSerialNumber}.`);
        dispatchEvent('CANVAS_ALL_PLANS_DID_UPDATE');
    } catch (e) {
        
        console.warn(`Updating has been canceled in updating serial = ${currentSerialNumber}: ${e.message}`);
        dispatchEvent('CANVAS_ALL_PLANS_UPDATE_CANCELLED');
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

function dateFromMonthAndDayText(text) {
    
    const month_and_day = text.substring(0, text.length - 3).split('/');

    const today = new Date();
    const year = String(today.getFullYear());
    const month = String(month_and_day[0]);
    const day = String(month_and_day[1]);
    
    return new DateComponents(`${year}${month.padStart(2, '0')}${day.padStart(2, '0')}`);
}
