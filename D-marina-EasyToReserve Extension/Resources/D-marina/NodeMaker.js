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
    
    appendButton(title, onclick, classNames = undefined) {
        
        const maker = new NodeMaker('button', classNames);
        
        maker.appendText(title);
        maker.setAttribute('onclick', onclick);
        
        this.appendNode(maker.node);
    }

    setAttribute(name, value) {
        
        this.root.setAttribute(name, value);
    }
}
