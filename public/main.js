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

// Dialog-open
btnOpen.addEventListener("click", function() {
    clearInput();
    dialog.showModal();
});
// Dialog-close
btnClose.addEventListener("click", function() {
    dialog.close();
    clearInput();
});

form.addEventListener("submit", function(e){
    e.preventDefault();
    createTask();
    showTasks();
});

tasksList.addEventListener("click", removeTask);

window.addEventListener("load", function (){
    loadTasks();
    showTasks();
});

/**
 * Main function for creating Tasks:
 *  gathering information from inputs fields and pre-check
 **/
function createTask() {
    dateToday = new Date();
    dateToday.setHours(0, 0, 0, 0);

    const name = titelInput.value;
    const description = descriptionInput.value;
    const date = new Date(dateInput.value);

    if(dateToday > date){
        showError();
        return;
    }

    let task = new Task(name, description, date);
    tasksArray.push(task);

    saveTasks();
    clearInput();
    dialog.close();
}

/**
 * class for a Task
 **/
class Task{
    constructor(_title, _description, _date) {
        this.title = _title;
        this.description = _description;
        this.date = _date;
        this.id = crypto.randomUUID();
    }

    /**
     * method for adding the task to the HTML "part"
     **/
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

        if(this.date - dateToday < 3 * 24 * 60 * 60 * 1000){
            fullEl.classList.add("isImportant");
        }

        tasksList.appendChild(clone);
    }

    dateToString() {
        let year = this.date.getFullYear();
        let month = ("" + this.date.getMonth() + 1).padStart(2, "0");
        let day = ("" + this.date.getDate()).padStart(2, "0");

        return day + "-" + month + "-" + year;
    }
}

/**
* two methods for the date-error
**/
function showError(){
    errorMsg.classList.add("error--On");
}

function hideError(){
    errorMsg.classList.remove("error--On");
}

/**
 * input fields clearing
 **/
function clearInput(){
    titelInput.value = "";
    descriptionInput.value = "";
    dateInput.value = "";
    hideError();
}

/**
 * according to the event - looking for the element on which it was clicked, if btn "remove" -> delete
 * El and also drop from the Array
 * @param e - event
 **/
function removeTask(e){
    const btn = e.target.closest(".remove");
    if(!btn) return;

    const dropTask = btn.closest(".task--details");
    if(!dropTask) return;

    const id = dropTask.dataset.id;
    const ix = tasksArray.findIndex(task => task.id === id);
    if(ix === -1) return;

    tasksArray.splice(ix, 1);
    saveTasks();
    showTasks();
}

function showTasks(){
    dateToday = new Date();
    dateToday.setHours(0, 0, 0, 0);

    const allTasks = Array.from(tasksList.getElementsByClassName("task--details"));
    allTasks.forEach(task => {
        task.remove();
    });

    tasksArray = tasksArray.filter(task => {
        let dif = task.date - dateToday;
        return dif >= 0;
    });
    tasksArray.forEach(task => {
        task.addTask();
    })
    saveTasks();
}

function saveTasks(){
    localStorage.setItem("tasks", JSON.stringify(tasksArray));
}

function loadTasks(){
    let obj = localStorage.getItem("tasks");
    if(obj){
        const tasks = JSON.parse(obj);
        tasks.forEach(task => {
            let newTask = new Task(task.title, task.description, new Date(task.date));
            newTask.id = task.id;
            tasksArray.push(newTask);
        });
    }
}