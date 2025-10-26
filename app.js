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
