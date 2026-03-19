'use strict';

import express from 'express';

const app = express();
const port = 3000;

const tasks = []

app.post('/', (req, res) => {
    let title;
    let description;
    let date;

    try{
        title = req.body.title;
        description = req.body.description;
        date = req.body.date;

        const task = new Task(title, description, date);
        tasks.push(task);
    } catch(err){
        res.status(400);
    }
    res.status(201);
});

app.listen(port, () => {
    console.log('listening on port:', port);
});