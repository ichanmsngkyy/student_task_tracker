// ========================================
// GLOBAL VARIABLES
// ========================================
let tasks = [];
let currentFilter = "all";

// ========================================
// DOM ELEMENTS
// ========================================
const taskForm = document.getElementById("taskForm");
const taskTitle = document.getElementById("taskTitle");
const taskDate = document.getElementById("taskDate");
const taskPriority = document.getElementById("taskPriority");
const taskList = document.getElementById("taskList");
const filterBtns = document.querySelectorAll(".filter-btn");
const sortBtn = document.getElementById("sortBtn");
const totalTasksEl = document.getElementById("totalTasks");
const activeTasksEl = document.getElementById("activeTasks");
const completedTasksEl = document.getElementById("completedTasks");

// ========================================
// EVENT LISTENERS
// ========================================
document.addEventListener("DOMContentLoaded", initApp);
taskForm.addEventListener("submit", handleAddTask);
filterBtns.forEach((btn) => btn.addEventListener("click", handleFilter));
sortBtn.addEventListener("click", handleSort);

// ========================================
// INITIALIZE APP
// ========================================
function initApp() {
  console.log("🚀 Student Task Tracker Initialized");
  loadTasksFromStorage();
  setMinDate();
  renderTasks();
  updateStats();
}

function setMinDate() {
  const today = new Date().toISOString().split("T")[0];
  taskDate.setAttribute("min", today);
  taskDate.value = today;
}

// ========================================
// ADD TASK
// ========================================
function handleAddTask(e) {
  e.preventDefault();

  const title = taskTitle.value.trim();
  const dueDate = taskDate.value;
  const priority = taskPriority.value;

  if (!title || title.length < 3) {
    alert("❌ Task title must be at least 3 characters");
    return;
  }

  if (!dueDate) {
    alert("❌ Please select a due date");
    return;
  }

  const selectedDate = new Date(dueDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (selectedDate < today) {
    alert("❌ Due date cannot be in the past");
    return;
  }

  const task = {
    id: Date.now(),
    title: title,
    dueDate: dueDate,
    priority: priority,
    completed: false,
    createdAt: new Date().toISOString(),
  };

  tasks.push(task);
  saveTasksToStorage();
  renderTasks();
  updateStats();
  taskForm.reset();
  setMinDate();

  console.log("✅ Task added:", task.title);
}

// ========================================
// LOCALSTORAGE
// ========================================
function saveTasksToStorage() {
  try {
    localStorage.setItem("studentTasks", JSON.stringify(tasks));
  } catch (error) {
    console.error("Error saving tasks:", error);
  }
}

function loadTasksFromStorage() {
  try {
    const stored = localStorage.getItem("studentTasks");
    tasks = stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Error loading tasks:", error);
    tasks = [];
  }
}

// ========================================
// RENDER TASKS
// ========================================
function renderTasks() {
  let filteredTasks = tasks;

  if (currentFilter === "active") {
    filteredTasks = tasks.filter((task) => !task.completed);
  } else if (currentFilter === "completed") {
    filteredTasks = tasks.filter((task) => task.completed);
  }

  taskList.innerHTML = "";

  if (filteredTasks.length === 0) {
    taskList.innerHTML = `
            <div class="no-tasks">
                <p>📝 No tasks found</p>
                <p class="no-tasks-sub">Add your first task to get started!</p>
            </div>
        `;
    return;
  }

  filteredTasks.forEach((task) => {
    const taskCard = createTaskCard(task);
    taskList.appendChild(taskCard);
  });
}

function createTaskCard(task) {
  const card = document.createElement("div");
  card.className = `task-card priority-${task.priority} ${
    task.completed ? "completed" : ""
  }`;

  const formattedDate = new Date(task.dueDate).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const daysUntil = calculateDaysUntil(task.dueDate);
  let daysText = "";
  let daysClass = "";

  if (daysUntil < 0) {
    daysText = "⚠️ Overdue!";
    daysClass = "overdue";
  } else if (daysUntil === 0) {
    daysText = "🔥 Due Today!";
    daysClass = "today";
  } else if (daysUntil === 1) {
    daysText = "⏰ Due Tomorrow";
  } else {
    daysText = `📅 ${daysUntil} days left`;
  }

  card.innerHTML = `
        <div class="task-content">
            <div class="task-header">
                <h3 class="task-title">${escapeHtml(task.title)}</h3>
                <span class="priority-badge priority-${
                  task.priority
                }">${task.priority.toUpperCase()}</span>
            </div>
            <div class="task-details">
                <span class="task-date">📆 ${formattedDate}</span>
                <span class="task-days ${daysClass}">${daysText}</span>
            </div>
        </div>
        <div class="task-actions">
            <button class="btn-action btn-complete" onclick="toggleComplete(${
              task.id
            })">
                ${task.completed ? "↩️" : "✓"}
            </button>
            <button class="btn-action btn-edit" onclick="editTask(${
              task.id
            })">✏️</button>
            <button class="btn-action btn-delete" onclick="deleteTask(${
              task.id
            })">🗑️</button>
        </div>
    `;

  return card;
}

function calculateDaysUntil(dueDate) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);
  return Math.ceil((due - today) / (1000 * 60 * 60 * 24));
}

function escapeHtml(text) {
  const map = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

// ========================================
// TOGGLE COMPLETE
// ========================================
function toggleComplete(id) {
  const task = tasks.find((t) => t.id === id);
  if (task) {
    task.completed = !task.completed;
    saveTasksToStorage();
    renderTasks();
    updateStats();
  }
}

// ========================================
// DELETE TASK
// ========================================
function deleteTask(id) {
  const task = tasks.find((t) => t.id === id);
  if (!task) return;

  if (confirm(`Delete "${task.title}"?`)) {
    tasks = tasks.filter((t) => t.id !== id);
    saveTasksToStorage();
    renderTasks();
    updateStats();
  }
}

// ========================================
// EDIT TASK
// ========================================
function editTask(id) {
  const task = tasks.find((t) => t.id === id);
  if (!task) return;

  taskTitle.value = task.title;
  taskDate.value = task.dueDate;
  taskPriority.value = task.priority;

  tasks = tasks.filter((t) => t.id !== id);
  saveTasksToStorage();
  renderTasks();
  updateStats();

  window.scrollTo({ top: 0, behavior: "smooth" });
  taskTitle.focus();
}
