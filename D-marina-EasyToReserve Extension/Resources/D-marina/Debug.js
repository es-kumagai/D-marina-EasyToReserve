class Debug {
    
    constructor() {
        
        let outputNode = document.getElementById(Debug.id);
        
        if (!outputNode) {

            const maker = new NodeMaker('div', 'message', Debug.id);
            const parentNode = document.body;
            
            outputNode = maker.node;
            
            parentNode.insertBefore(outputNode, parentNode.firstChild);
        }
        
        this.outputNode = outputNode;
    }
    
    print(message) {
        
        const maker = new NodeMaker('span', 'message-part');
        
        maker.appendText(message);
        
        this.outputNode.appendChild(maker.node);
    }
}

Debug.id = 'debug-output';

function debugPrint(message) {
    
    const debug = new Debug();
    
    debug.print(message);
}
