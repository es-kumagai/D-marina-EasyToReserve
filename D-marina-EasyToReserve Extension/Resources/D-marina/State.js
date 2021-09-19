class State {

    constructor(date, availability, availabilityKind) {

        this.date = date;
        this.availability = availability;
        this.availabilityKind = availabilityKind;
    }
}

State.valid = 'availability-valid';
State.invalid = 'availability-invalid';
State.skip = 'availability-skip';
