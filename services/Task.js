'use strict';

import crypto from 'crypto';

export default class Task {
    constructor(_title, _description, _date) {
        this.title = _title;
        this.description = _description;
        this.date = _date;
        this.id = crypto.randomUUID();
    }

    toJSON() {
        return {
            title: this.title,
            description: this.description,
            date: this.date,
            id: this.id
        };
    }
}