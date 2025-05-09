const taskForm = document.getElementById("task-form");
const taskInput = document.getElementById("task-input");
const categorySelect = document.getElementById("category-select");
const filterSelect = document.getElementById("filter");
const taskList = document.getElementById("task-list");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function renderTasks() {
  taskList.innerHTML = "";
  const filter = filterSelect.value;
  tasks.forEach((task, index) => {
    if (filter !== "All" && task.category !== filter) return;

    const li = document.createElement("li");
    li.className = task.done ? "done" : "";

    li.innerHTML = `
      <span>${task.text} <small>(${task.category})</small></span>
      <div>
        <button onclick="toggleDone(${index})">✔️</button>
        <button onclick="deleteTask(${index})">🗑️</button>
      </div>
    `;
    taskList.appendChild(li);
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function addTask(e) {
  e.preventDefault();
  const text = taskInput.value.trim();
  const category = categorySelect.value;
  if (!text) return;
  tasks.push({ text, category, done: false });
  taskInput.value = "";
  renderTasks();
}

function deleteTask(index) {
  tasks.splice(index, 1);
  renderTasks();
}

function toggleDone(index) {
  tasks[index].done = !tasks[index].done;
  renderTasks();
}

taskForm.addEventListener("submit", addTask);
filterSelect.addEventListener("change", renderTasks);
window.onload = renderTasks;
