'use strict';

import express from 'express';
import crypto from 'crypto';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const port = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const tasks = [];

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/todos', (req, res) => {
    return res.status(200).json(tasks);
});

app.post('/todos', (req, res) => {
    const { title, description, date } = req.body;

    if (typeof title !== 'string' || title.trim() === '') {
        return res.status(400).json({ error: 'Missing title' });
    }

    if (typeof description !== 'string' || description.trim() === '') {
        return res.status(400).json({ error: 'Missing description' });
    }

    if (typeof date !== 'string' || date.trim() === '') {
        return res.status(400).json({ error: 'Missing date' });
    }

    const task = {
        id: crypto.randomUUID(),
        title: title.trim(),
        description: description.trim(),
        date: date
    };

    tasks.push(task);

    return res.status(201).json(task);
});

app.listen(port, () => {
    console.log(`listening on port: ${port}`);
});