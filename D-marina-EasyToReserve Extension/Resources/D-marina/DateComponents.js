class DateComponents {
    
    constructor(text) {
        
        const year = parseInt(text.substring(0, 4));
        const month = parseInt(text.substring(4, 6));
        const day = parseInt(text.substring(6, 8));
        
        this.year = year;
        this.month = month;
        this.day = day;
    }
}
