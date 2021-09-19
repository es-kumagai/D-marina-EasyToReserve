class Page {
    
    constructor() {
        
    }

    get selectedDate() {

        const todayNode = document.getElementsByClassName('sc_today')[0];
        const todayText = todayNode.getElementsByTagName('a')[0].id;

        if (!todayText || todayText.length != 8) {
            
            return null;
        }
        
        return new DateComponents(todayText);
    }
    
    get boatNodes() {

        const mainPlans = document.getElementById('list_main_plan');
        const mainPlanItems = mainPlans.getElementsByTagName('tr');

        return mainPlanItems;
    }

    get courseNodes() {

        const subPlans = document.getElementById('list_sub_plan');
        const subPlanItems = subPlans.getElementsByTagName('tr');

        return subPlanItems;
    }

    get boats() {
        
        const boats = new Array();
        
        for (const boatNode of this.boatNodes) {
            
            const nameNode = boatNode.getElementsByClassName('sp-res-step-title')[0];
            const nameIdNode = boatNode.getElementsByTagName('td')[0];
            const anchorNode = nameIdNode.getElementsByTagName('a')[0];

            if (!nameNode || !nameIdNode || !anchorNode) {
            
                continue;
            }
            
            let name = nameNode.innerText;
            let nameId = nameIdNode.id;
            let href = anchorNode.getAttribute('href');
            let onclick = anchorNode.getAttribute('onclick');

            name = name.replace(/\s*（.*$/, '').replace(/[Ａ-Ｚａ-ｚ０-９]/g, char => { return String.fromCharCode(char.charCodeAt(0) - 0xFEE0) });
            nameId = nameId.replace(/^mp_id_/, '');
            
            boats.push(new Boat(name, nameId, href, onclick));
        }
        
        return boats;
    }
    
    get courses() {
        
        const courses = new Array();
        
        for (const courseNode of this.courseNodes) {

            const labelNode = courseNode.getElementsByClassName('sp-res-step-title')[0];
            const labelIdNode = courseNode.getElementsByTagName('td')[0];

            if (!labelNode || !labelIdNode) {
            
                continue;
            }

            let label = labelNode.innerText;
            let labelId = labelIdNode.id;
            
            label = label.replace(/\s*（.*$/, '').replace(/(コース|のみ)$/, '');
            labelId = labelId.replace(/^sp_id_/, '');
            
            courses.push(new Course(label, labelId));
        }
        
        return courses;
    }
}
