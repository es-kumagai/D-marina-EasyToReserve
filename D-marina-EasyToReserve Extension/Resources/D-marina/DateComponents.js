class DateComponents {
    
    constructor(date) {
        
        let year = null;
        let month = null;
        let day = null;
        
        if (date instanceof Date) {
            
            year = date.getFullYear();
            month = date.getMonth() + 1;
            day = date.getDate();
        }
        else {

            year = parseInt(date.substring(0, 4));
            month = parseInt(date.substring(4, 6));
            day = parseInt(date.substring(6, 8));
        }
        
        this.year = year;
        this.month = month;
        this.day = day;
    }
    
    get text() {
    
        const year = ("0000" + this.year).substr(-4);
        const month = ("00" + this.month).substr(-2);
        const day = ("00" + this.day).substr(-2);
        
        return `${year}${month}${day}`;
    }
    
    get previousWeek() {
        
        const date = new Date(this.year, this.month - 1, this.day);
        date.setDate(date.getDate() - 7);
        
        return new DateComponents(date);
    }
    
    get previousMonth() {
        
        const date = new Date(this.year, this.month - 1, this.day);
        date.setMonth(date.getMonth() - 1);
        
        return new DateComponents(date);
    }
    
    get nextWeek() {
        
        const date = new Date(this.year, this.month - 1, this.day);
        date.setDate(date.getDate() + 7);
        
        return new DateComponents(date);
    }
    
    get nextMonth() {
        
        const date = new Date(this.year, this.month - 1, this.day);
        date.setMonth(date.getMonth() + 1);
        
        return new DateComponents(date);
    }
}
