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
