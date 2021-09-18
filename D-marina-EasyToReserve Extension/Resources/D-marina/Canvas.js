class Canvas {

    constructor(page) {

        Canvas.makeId = (id) => { return `easytoreserve-${id}` };
        Canvas.makeCourseId = (course) => { return Canvas.makeId(`course-${course.id}`) };
        
        Canvas.id = Canvas.makeId('canvas');
        Canvas.boatIdAttributeName = 'x-boat-id';
        Canvas.boatOrderAttributeName = 'x-boat-order';
        Canvas.courseIdAttributeName = 'x-course-id';

        const maker = new NodeMaker('div', 'canvas', Canvas.id);
        const node = maker.node;

        this.page = page;
        this.node = node;

        const bodyNode = document.body;
        const mainNode = document.getElementById('container-iframe');
        
        bodyNode.insertBefore(node, mainNode);
    }

    makeCourseNode(course) {

        const maker = new NodeMaker('h1', 'course');
        const sectionMaker = new NodeMaker('section', 'course', Canvas.makeCourseId(course));
        
        maker.setAttribute(Canvas.courseIdAttributeName, course.id);
        maker.appendText(`コース : ${course.label}`);
        
        this.node.appendChild(maker.node);
        this.node.appendChild(sectionMaker.node);
    }
    
    get courseSectionNodes() {
        
        let sectionNodes = new Array();
        
        for (const node of this.node.childNodes) {

            if (node.tagName.toLowerCase() === 'section') {
                
                sectionNodes.push(node);
            }
        }
        
        return sectionNodes;
    }
    
    boatOrderFor(boat) {
        
        const page = this.page;
        const boatOrders = page.boats.map(boat => {
            
            return boat.name;
        });
        
        return boatOrders.indexOf(boat.name);
    }

    courseSectionNodeBy(course) {
        
        const id = Canvas.makeCourseId(course);
        
        for (const node of this.courseSectionNodes) {

            if (node.id === id) {
                
                return node;
            }
        }
        
        return null;
    }
    
    courseSectionNodeAfterSpecifiedCourse(course, boat) {
        
        const sectionNode = this.courseSectionNodeBy(course);
        const specifiedBoatOrder = this.boatOrderFor(boat);
        
        for (const existingNode of sectionNode.childNodes) {

            const existingBoatOrder = parseInt(existingNode.getAttribute(Canvas.boatOrderAttributeName));

            if (specifiedBoatOrder < existingBoatOrder) {
                
                return existingNode;
            }
        }
        
        return null;
    }
    
    appendPlanCanvas(planCanvas) {
    
        const maker = new NodeMaker('div', 'plan');
        const plan = this.plan;

        maker.appendNode(planCanvas.node);
 
        const node = maker.node;
        const boat = planCanvas.boat;
        const course = planCanvas.course;
        const sectionNode = this.courseSectionNodeBy(course);
        const afterSectioNode = this.courseSectionNodeAfterSpecifiedCourse(course, boat);
                                      
        if (sectionNode.children.length == 0) {
        
            sectionNode.appendChild(planCanvas.dateStackNode);
        }
        
        const planStackNode = planCanvas.planStackNode;
        
        if (afterSectioNode) {
            
            sectionNode.insertBefore(planStackNode, afterSectioNode);
        }
        else {
            
            sectionNode.appendChild(planStackNode);
        }
    }
}

class PlanCanvas {
    
    constructor(canvas, response) {
        
        PlanCanvas.closingDayOfWeek = 'tuesday';
        
        this.canvas = canvas;
        this.boat = response.boat;
        this.course = response.course;
        this.plan = response.plan;

        this.id = Canvas.makeCourseId(this.course);
    }

    get node() {
    
        const maker = new NodeMaker('div', 'canvas-plan');
        const plan = this.plan;

        maker.appendNode(this.boatNode);
        maker.appendNode(this.courseNode);
        maker.appendNode(this.statesNode);
        
        return maker.node;
    }
    
    dayOfWeekForDate(date) {
        
        const dayOfWeek = date.slice(-3);
        const dayOfWeekTable = {
         
            '(日)' : 'sunday',
            '(月)' : 'monday',
            '(火)' : 'tuesday',
            '(水)' : 'wednesday',
            '(木)' : 'thursday',
            '(金)' : 'friday',
            '(土)' : 'saturday',
        };

        return dayOfWeekTable[dayOfWeek];
    }
    
    isClosingDayOfWeek(dayOfWeek) {
        
        return dayOfWeek === PlanCanvas.closingDayOfWeek;
    }
    
    get dateStackNode() {
        
        const maker = new NodeMaker('div', ['canvas-stack', 'canvas-date-stack']);
        
        maker.appendText('', 'div');
        
        for (const state of this.plan.states) {
            
            const dayOfWeek = this.dayOfWeekForDate(state.date);
            const classNames = [
                'date',
                dayOfWeek,
            ];
            
            if (this.isClosingDayOfWeek(dayOfWeek)) {
                
                classNames.push('closing-day');
            }

            maker.appendText(state.date, 'div', classNames);
        }
        
        return maker.node;
    }
    
    get planStackNode() {
        
        const maker = new NodeMaker('div', ['canvas-stack', 'canvas-plan-stack']);
        
        const boat = this.boat;
        const boatId = boat.id;
        const boatOrder = this.canvas.boatOrderFor(boat);
        
        maker.setAttribute(Canvas.boatIdAttributeName, boatId);
        maker.setAttribute(Canvas.boatOrderAttributeName, boatOrder);
        maker.appendText(boat.name, 'div', 'boat');

        for (const state of this.plan.states) {
            
            const dayOfWeek = this.dayOfWeekForDate(state.date);
            const classNames = [
                'availability',
                state.availabilityKind,
                dayOfWeek,
            ];

            if (this.isClosingDayOfWeek(dayOfWeek)) {
                
                classNames.push('closing-day');
            }

            maker.appendText(state.availability, 'div', classNames);
        }

        return maker.node;
    }
    
    get planHeaderNode() {
        
        return this.boatNode;
    }
    
    get boatNode() {

        const maker = new NodeMaker('div', 'boat');
        
        maker.appendText('ボート', 'span', 'label');
        maker.appendText(this.boat.name, 'span', 'value');
        
        return maker.node;
    }

    get courseNode() {

        const maker = new NodeMaker('div', 'course');
        
        maker.appendText('コース', 'span', 'label');
        maker.appendText(this.course.label, 'span', 'value');
        
        return maker.node;
    }
    
    stateNode(state) {

        const maker = new NodeMaker('div', 'state');

        maker.appendText(state.date, 'span', 'date');
        maker.appendText(state.availability, 'span', ['availability', state.availabilityKind]);
        
        return maker.node;
    }
    
    get statesNode() {
        
        const maker = new NodeMaker('div', 'states');
        
        for (const state of this.plan.states) {

            maker.appendNode(this.stateNode(state));
        }
        
        return maker.node;
    }

    get representsAsText() {
        
        return this.node.innerHTML;
    }
}

class NodeMaker {
    
    constructor(tagName, classNames = undefined, id = undefined) {
        
        this.root = document.createElement(tagName);
        this.applyClassNamesTo(this.root, classNames);
        this.attributes = {};
        
        if (id) {
            
            this.root.id = id;
        }
    }
    
    get node() {
        
        return this.root;
    }
    
    applyClassNamesTo(node, classNames) {
        
        if (!classNames) {
        
            return;
        }
        
        if (typeof(classNames) === 'string') {
        
            node.classList.add(classNames);
        }
        else {

            for (const className of classNames) {
            
                node.classList.add(className);
            }
        }
    }
    
    appendClassName(className) {
    
        this.root.classList.add(className);
    }
    
    appendNode(node) {
    
        this.root.appendChild(node);
    }
    
    appendText(text, tagName = undefined, classNames = undefined) {

        const textNode = document.createTextNode(text);
        
        if (tagName) {
            
            const node = document.createElement(tagName);
            
            this.applyClassNamesTo(node, classNames);
            node.appendChild(textNode);
            
            this.appendNode(node);
        }
        else {
            
            this.appendNode(textNode);
        }
    }
    
    setAttribute(name, value) {
        
        this.root.setAttribute(name, value);
    }
}
