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
    
    static isHoliday(date, holidays) {
        
        if (!holidays) return false;

        const dateComponent = dateFromMonthAndDayText(date);

        const index = holidays.findIndex(holiday => {
            
            return holiday.year == dateComponent.year && holiday.month == dateComponent.month && holiday.day == dateComponent.day;
        });
        
        return index != -1;
    }
    
    isHoliday(date) {
        
        return PlanCanvas.isHoliday(date, holidaysCache);
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
            
            if (this.isHoliday(state.date)) {
                
                classNames.push('holiday');
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
            const attributes = {
                'data-date' : state.date,
            };

            if (this.isClosingDayOfWeek(dayOfWeek)) {
                
                classNames.push('closing-day');
            }
            
            if (this.isHoliday(state.date)) {
                
                classNames.push('holiday');
            }

            if (state.availabilityKind === State.valid) {

                const action = [
                    `selectMainPlan(${this.boat.id});`,
                    `selectSubPlan(${this.course.id});`,
                    `timer = setInterval(() => {`,
                        `loadingNode = document.getElementById('loading');`,
                        `if (!loadingNode || loadingNode.style.display !== 'none') return;`,
                        `document.dispatchEvent(new CustomEvent('MOVE_TO_CALENDAR'));`,
                        `action = document.getElementById('move_calendar_action');`,
                        `action.value = ${dateFromMonthAndDayText(state.date).time};`,
                        `action.click();`,
                        `clearInterval(timer);`,
                    `}, 100)`,
                ];
                
                classNames.push('canvas-selectable');
                attributes['href'] = 'void(0)';
                attributes['onclick'] = action.join(' ');
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
