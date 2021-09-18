class State {

    constructor(date, availability, availabilityKind) {

        this.date = date;
        this.availability = availability;
        this.availabilityKind = availabilityKind;
    }
}

class Plan {

    constructor(boat, course, states) {

        this.boat = boat;
        this.course = course;
        this.states = states;
    }

    appendState(state) {
        this.states.push(state);
    }
}
