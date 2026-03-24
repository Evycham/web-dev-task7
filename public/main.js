"use strict";

const btnOpen = document.getElementById("btnOpen");
const btnClose = document.getElementById("btnClose");

const dialog = document.getElementById("dialog");
const form = document.getElementById("form");

const titelInput = document.getElementById("titel--input");
const descriptionInput = document.getElementById("description--input");
const dateInput = document.getElementById("date--input");

const tasksList = document.getElementById("tasks--list");
const errorMsg = document.getElementById("error");
const template = document.getElementById("tasks--template");

let tasksArray = [];
let dateToday;

// Dialog open
btnOpen.addEventListener("click", function () {
    clearInput();
    dialog.showModal();
});

// Dialog close
btnClose.addEventListener("click", function () {
    dialog.close();
    clearInput();
});

form.addEventListener("submit", async function (e) {
    e.preventDefault();
    await createTask();
});

tasksList.addEventListener("click", removeTask);

window.addEventListener("load", async function () {
    await loadTasksFromServer();
    showTasks();
});

class Task {
    constructor(_title, _description, _date, _id) {
        this.title = _title;
        this.description = _description;
        this.date = new Date(_date);
        this.id = _id;
    }

    addTask() {
        const clone = template.content.cloneNode(true);
        const title = clone.querySelector(".task--title");
        const description = clone.querySelector(".task--description");
        const date = clone.querySelector(".task--deadline");
        const fullEl = clone.querySelector(".task--details");

        fullEl.dataset.id = this.id;
        title.textContent = this.title;
        description.textContent = this.description;
        date.textContent = this.dateToString();

        if (this.date - dateToday < 3 * 24 * 60 * 60 * 1000) {
            fullEl.classList.add("isImportant");
        }

        tasksList.appendChild(clone);
    }

    dateToString() {
        const year = this.date.getFullYear();
        const month = String(this.date.getMonth() + 1).padStart(2, "0");
        const day = String(this.date.getDate()).padStart(2, "0");

        return `${day}-${month}-${year}`;
    }
}

async function createTask() {
    dateToday = new Date();
    dateToday.setHours(0, 0, 0, 0);

    const title = titelInput.value.trim();
    const description = descriptionInput.value.trim();
    const date = dateInput.value;

    if (new Date(date) < dateToday) {
        showError();
        return;
    }

    try {
        const response = await fetch("/todos", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ title, description, date }),
        });

        if (!response.ok) {
            throw new Error(response.statusText);
        }

        const createdTask = await response.json();

        const task = new Task(
            createdTask.title,
            createdTask.description,
            createdTask.date,
            createdTask.id
        );

        tasksArray.push(task);
        clearInput();
        dialog.close();
        showTasks();
    } catch (err) {
        console.log(err);
    }
}

async function loadTasksFromServer() {
    try {
        const response = await fetch("/todos");

        if (!response.ok) {
            throw new Error(response.statusText);
        }

        const tasks = await response.json();

        tasksArray = tasks.map(task => new Task(
            task.title,
            task.description,
            task.date,
            task.id
        ));
    } catch (err) {
        console.log(err);
    }
}

function showError() {
    errorMsg.classList.add("error--On");
}

function hideError() {
    errorMsg.classList.remove("error--On");
}

function clearInput() {
    titelInput.value = "";
    descriptionInput.value = "";
    dateInput.value = "";
    hideError();
}

function removeTask(e) {
    const btn = e.target.closest(".remove");
    if (!btn) return;

    const dropTask = btn.closest(".task--details");
    if (!dropTask) return;

    const id = dropTask.dataset.id;
    const ix = tasksArray.findIndex(task => task.id === id);
    if (ix === -1) return;

    tasksArray.splice(ix, 1);
    showTasks();
}

function showTasks() {
    dateToday = new Date();
    dateToday.setHours(0, 0, 0, 0);

    const allTasks = Array.from(tasksList.getElementsByClassName("task--details"));
    allTasks.forEach(task => task.remove());

    tasksArray = tasksArray.filter(task => {
        const dif = task.date - dateToday;
        return dif >= 0;
    });

    tasksArray.forEach(task => {
        task.addTask();
    });
}