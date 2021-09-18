class Endpoint {
    
    constructor(startDateComponents, boatID, courseID) {
        
        this.uri = 'https://d-marina.resv.jp/reserve/get_data.php';
        this.mode = 'maincalendar';
        this.startDate = startDateComponents;
        this.boatID = boatID;
        this.courseID = courseID;
        this.options = {
            'categ_id' : 0,
            'res_num' : 0,
            'sdt' : null,
            'scroll_noheight' : 0,
            'reserve_mode' : null,
            'reserve_mode_user' : null,
            'cancel_guest_hash' : null,
        };
    }

    get optionsQuery() {

        const options = this.options;
        
        return Object.keys(options).map(key => {

            const value = options[key];
            
            if (value) {
                
                return `${key}=${value}`;
            }
            else {
                
                return `${key}=`
            }
        }).join('&');
    }
    
    get url() {

        const uri = `${this.uri}`;
        const mode = `mode=${this.mode}`;
        const date = `t_year=${this.startDate.year}&t_month=${this.startDate.month}&t_day=${this.startDate.day}`;
        const plan = `mp_id=${this.boatID}&sp_id=${this.courseID}`;
        const options = this.optionsQuery;
        
        return `${this.uri}?${mode}&${date}&${plan}&${options}`;
    }
}
