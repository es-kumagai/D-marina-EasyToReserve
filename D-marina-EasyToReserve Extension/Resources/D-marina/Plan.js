class State {

    constructor(date, availability) {

        this.date = date;
        this.availability = availability;
    }

    getDate() {
        return this.date;
    }

    getAvailability() {
        return this.availability;
    }
}

class Plan {

    constructor(boat, course, states) {

        this.boat = boat;
        this.course = course;
        this.states = states;
    }

    getBoat() {
        return this.boat;
    }

    getCourse() {
        return this.course;
    }

    getStates() {
        return this.states;
    }

    appendState(state) {
        this.states.push(state);
    }
}
