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

    const tip = task.tip ? `<p class="tip">💡 ${task.tip}</p>` : "";

    li.innerHTML = `
      <span>${task.text} <small>(${task.category})</small></span>
      <div>
        <button onclick="toggleDone(${index})">✔️</button>
        <button onclick="deleteTask(${index})">🗑️</button>
        <button onclick="getTip(${index})">💡</button>
      </div>
      ${tip}
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

//  NEW: Fetch AI Tip from Netlify Function
async function getTip(index) {
  const task = tasks[index];
  const response = await fetch('/.netlify/functions/tip', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ task: task.text })
  });

  if (response.ok) {
    const data = await response.json();
    tasks[index].tip = data.tip;
    renderTasks();
  } else {
    alert('❌ Failed to get AI tip.');
  }
}
// Function to toggle dark mode
function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
}

// Optional: Automatically apply dark mode if the user has it set in their system preferences
if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
  document.body.classList.add('dark-mode');
}

taskForm.addEventListener("submit", addTask);
filterSelect.addEventListener("change", renderTasks);
window.onload = renderTasks;