const express = require('express');
const fs = require('fs');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());

const TASKS_FILE = 'tasks.json';

// get all tasks
app.get('/tasks', (req, res) => {
    fs.readFile(TASKS_FILE, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Ошибка чтения файла задач');
        }
        const tasks = JSON.parse(data);
        res.json({ tasks });
    });
});

// create task
app.post('/tasks', (req, res) => {
    fs.readFile(TASKS_FILE, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Ошибка чтения файла задач');
        }
        const tasks = JSON.parse(data);
        const newTask = req.body.task;
        tasks.push(newTask);
        fs.writeFile(TASKS_FILE, JSON.stringify(tasks), (err) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Ошибка записи файла задач');
            }
            res.json({ task: newTask });
        });
    });
});

// update task
app.put('/tasks/:id', (req, res) => {
    const taskId = req.params.id;
    const updatedTask = req.body.task;

    fs.readFile(TASKS_FILE, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Ошибка чтения файла задач');
        }
        const tasks = JSON.parse(data);

        // Найдем задачу с указанным ID и обновим ее
        const taskIndex = tasks.findIndex((task) => task.id === taskId);
        if (taskIndex === -1) {
            return res.status(404).send('Задача не найдена');
        }
        tasks[taskIndex] = updatedTask;

        fs.writeFile(TASKS_FILE, JSON.stringify(tasks), (err) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Ошибка записи файла задач');
            }
            res.json({ task: updatedTask });
        });
    });
});

// delete task
app.delete('/tasks/:id', (req, res) => {
    const taskId = req.params.id;

    fs.readFile(TASKS_FILE, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Ошибка чтения файла задач');
        }
        const tasks = JSON.parse(data);

        const filteredTasks = tasks.filter((task) => task.id !== taskId);

        fs.writeFile(TASKS_FILE, JSON.stringify(filteredTasks), (err) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Ошибка записи файла задач');
            }
            res.status(204).send();
        });
    });
});

const PORT = 3000;

app.listen(PORT);
