class PlanCanvas {
    
    constructor(canvas, response) {
                
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
        
        const boat = this.boat;
        const boatId = boat.id;
        const boatOrder = this.canvas.boatOrderFor(boat);

        const maker = new NodeMaker('div', ['canvas-stack', 'canvas-plan-stack']);
        const anchorMaker = new NodeMaker('a');
                
        maker.setAttribute(Canvas.boatIdAttributeName, boatId);
        maker.setAttribute(Canvas.boatOrderAttributeName, boatOrder);
        
        if (boat.href) anchorMaker.setAttribute('href', boat.href);
        if (boat.onclick) anchorMaker.setAttribute('onclick', boat.onclick);
        anchorMaker.appendText(boat.name);
        
        const anchorNode = anchorMaker.node;
                
        maker.appendNode(anchorNode, 'div', 'boat');

        for (const state of this.plan.states) {
            
            const dayOfWeek = this.dayOfWeekForDate(state.date);
            const classNames = [
                'availability',
                state.availabilityKind,
                dayOfWeek,
            ];
            const attributes = {};

            if (this.isClosingDayOfWeek(dayOfWeek)) {
                
                classNames.push('closing-day');
            }
            
            if (state.availabilityKind === State.valid) {

                classNames.push('selectable');
                attributes['href'] = 'void(0)';
                attributes['onclick'] = `selectMainPlan(${this.boat.id}); selectSubPlan(${this.course.id}); document.dispatchEvent(new CustomEvent('MOVE_TO_CALENDAR'));`;
            }

            maker.appendText(state.availability, 'div', classNames, attributes);
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

PlanCanvas.closingDayOfWeek = 'tuesday';


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

    applyAttributesTo(node, attributes) {
        
        if (!attributes) {
        
            return;
        }

        for (const key of Object.keys(attributes)) {
            
            node.setAttribute(key, attributes[key]);
        }
    }

    appendClassName(className) {
    
        this.root.classList.add(className);
    }
    
    appendNode(node, tagName = undefined, classNames = undefined, attributes = undefined) {
    
        if (tagName) {
            
            const containerNode = document.createElement(tagName);
            
            this.applyClassNamesTo(containerNode, classNames);
            this.applyAttributesTo(containerNode, attributes);
            containerNode.appendChild(node);
            
            this.root.appendChild(containerNode);
        }
        else {
            
            this.root.appendChild(node);
        }
    }
    
    appendText(text, tagName = undefined, classNames = undefined, attributes = undefined) {

        const textNode = document.createTextNode(text);
        
        if (tagName) {
            
            const node = document.createElement(tagName);
            
            this.applyClassNamesTo(node, classNames);
            this.applyAttributesTo(node, attributes);
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
