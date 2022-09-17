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
    
        const year = this.year.toString();
        const month = this.month.toString().padStart(2, '0');
        const day = this.day.toString().padStart(2, '0');
        
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
    
    get time() {
        
        const date = new Date(this.year, this.month - 1, this.day);
        return date.getTime();
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
