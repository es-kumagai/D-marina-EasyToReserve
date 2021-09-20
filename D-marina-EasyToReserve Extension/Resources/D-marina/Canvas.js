class Canvas {

    constructor(page, startDate, baseDate) {

        const maker = new NodeMaker('div', 'canvas', Canvas.id);
        const node = maker.node;

        this.page = page;
        this.startDate = startDate;
        this.baseDate = baseDate;
        this.node = node;

        this.rootNode.insertBefore(node, this.mainNode);
    }

    get rootNode() {
    
        return getRootNode();
    }
    
    get mainNode() {

        return getMainNode();
    }

    get canvasNode() {
    
        return getCanvasNode();
    }
    
    get navigatorNode() {

        return getNavigatorNode();
    }
    
    makeNavigatorNode() {
    
        const existingNavigatorNode = this.navigatorNode;
        
        if (existingNavigatorNode) {
        
            existingNavigatorNode.remove();
        }
        
        const maker = new NodeMaker('aside', 'navigator', Canvas.navigatorId);
        const buttonsMaker = new NodeMaker('div', 'buttons');
        
        buttonsMaker.appendButton('空き状況の一覧にもどる', 'window.scrollTo({top:0,left:0,behavior:\'smooth\'});', 'move-to-canvas');
        buttonsMaker.appendButton('空き状況の一覧を非表示', 'document.dispatchEvent(new CustomEvent(\'HIDE_CANVAS\'));');
        
        maker.appendNode(buttonsMaker.node);

        this.mainNode.appendChild(maker.node);
    }
    
    makeCourseNode(course, appendingNode) {

        const maker = new NodeMaker('h1', 'course');
        const sectionMaker = new NodeMaker('section', 'course', Canvas.makeCourseId(course));
        
        maker.setAttribute(Canvas.courseIdAttributeName, course.id);
        maker.appendText(`コース : ${course.label}`, 'span', 'label');
        
        if (appendingNode) {
            
            maker.appendNode(appendingNode);
        }
        
        this.node.appendChild(maker.node);
        this.node.appendChild(sectionMaker.node);
    }

    calendarMoveNodeTo(date, label) {
    
        const maker = new NodeMaker('button', ['calendar-move', 'nextWeek']);

        maker.appendText(label);
        maker.setAttribute('onclick', `getMaincalendar(${date.year},${date.month},${date.day},true); e = new CustomEvent("UPDATE_AVAILABILITIES", { detail: { selectedDate : ${date.text}, baseDate : ${this.baseDate.text} } });  document.dispatchEvent(e);`);
        
        return maker.node;
    }

    get calendarMovesNode() {
        
        const maker = new NodeMaker('span', 'calendar-buttons');
        
        maker.appendNode(this.calendarMoveBaseDateNode);
        maker.appendNode(this.calendarMoveNextWeekNode);
        maker.appendNode(this.calendarMoveNextMonthNode);
        
        return maker.node;
    }
    
    get calendarMoveBaseDateNode() {
    
        return this.calendarMoveNodeTo(this.baseDate, '直近の状況');
    }

    get calendarMoveNextWeekNode() {
    
        return this.calendarMoveNodeTo(this.startDate.nextWeek, '翌週');
    }
    
    get calendarMovePreviousWeekNode() {
    
        return this.calendarMoveNodeTo(this.startDate.previousWeek, '前週');
    }
    
    get calendarMoveNextMonthNode() {
    
        return this.calendarMoveNodeTo(this.startDate.nextMonth, '翌月');
    }
    
    get calendarMovePreviousMonthNode() {
    
        return this.calendarMoveNodeTo(this.startDate.previousMonth, '前月');
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

Canvas.makeId = (id) => { return `easytoreserve-${id}` };
Canvas.makeCourseId = (course) => { return Canvas.makeId(`course-${course.id}`) };

Canvas.id = Canvas.makeId('canvas');
Canvas.navigatorId = Canvas.makeId('canvas-navigator');
Canvas.boatIdAttributeName = 'x-boat-id';
Canvas.boatOrderAttributeName = 'x-boat-order';
Canvas.courseIdAttributeName = 'x-course-id';
