class Canvas {

    constructor() {

        Canvas.makeId = (id) => { return `easytoreserve-${id}` };
        Canvas.makeCourseId = (course) => { return Canvas.makeId(`course-${course.id}`) };
        
        Canvas.id = Canvas.makeId('canvas');

        const maker = new NodeMaker('div', 'canvas', Canvas.id);
        const node = maker.node;
                
        this.node = node;
        document.body.appendChild(node);
    }

    makeCourseNode(course) {

        const maker = new NodeMaker('h1', 'course');
        const sectionMaker = new NodeMaker('section', 'course', Canvas.makeCourseId(course));
        
        maker.appendText(`コース : ${course.label}`);
        
        this.node.appendChild(maker.node);
        this.node.appendChild(sectionMaker.node);
    }
    
    courseNodeBy(course) {
        
        const id = Canvas.makeCourseId(course);
        
        for (const node of this.node.childNodes) {

            if (node.tagName.toLowerCase() !== 'section') {
                
                continue;
            }
            
            if (node.id === id) {
                
                return node;
            }
        }
        
        return null;
    }
    
    appendPlanCanvas(planCanvas) {
    
        const maker = new NodeMaker('div', 'plan');
        const plan = this.plan;

        maker.appendNode(planCanvas.node);
 
        const node = maker.node;
        const canvasNode = this.courseNodeBy(planCanvas.course);
        
        canvasNode.appendChild(node);
    }
}

class PlanCanvas {
    
    constructor(response) {
        
        this.boat = response.boat;
        this.course = response.course;
        this.plan = response.plan;

        this.id = Canvas.makeCourseId(this.course);
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

    get node() {
    
        const maker = new NodeMaker('div', 'canvas-plan');
        const plan = this.plan;

        maker.appendNode(this.boatNode);
        maker.appendNode(this.courseNode);
        maker.appendNode(this.statesNode);
        
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
        
        if (id) {
            
            this.root.id = id;
        }
    }
    
    get node() {
        
        return this.root;
    }
    
    applyClassNamesTo(node, classNames) {
        
        if (typeof(classNames) === 'string') {
        
            node.classList.add(classNames);
        }
        else {

            for (const className of classNames) {
            
                node.classList.add(className);
            }
        }
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
}
