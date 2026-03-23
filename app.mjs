'use strict';

import express from 'express';
import crypto from 'crypto';

const app = express();
const port = 3000;

const tasks = []

app.use(express.json());

app.post('/todos', (req, res) => {

    const { title, description, date } = req.body;

    if(typeof title !== 'string' || title.trim() === '') {
        return res.status(400).json({error: 'Missing title'});
    }

    if(typeof description !== 'string' && description.trim() === '') {
        return res.status(400).json({error: 'Missing description'});
    }

    if(typeof date !== 'string' || date.trim() === '') {
        return res.status(400).json({error: 'Missing date'});
    }

    const task = new Task(title, description, date);
    tasks.push(task);

    return res.status(201).json(task);
});

app.get('/todos', (req, res) => {
    res.status(200).json(tasks);
});



app.listen(port, () => {
    console.log('listening on port:', port);
});