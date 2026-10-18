const STORAGE_KEY = "taskflow-blue-gold-tasks-v1";
const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const priorityInput = document.getElementById("priorityInput");
const taskList = document.getElementById("taskList");
const searchInput = document.getElementById("searchInput");
const toast = document.getElementById("toast");

let tasks = loadTasks();
let currentFilter = "all";
let searchTerm = "";
let editingId = null;
let toastTimer;

function loadTasks() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.warn("Could not load saved tasks:", error);
    return [];
  }
}
function saveTasks() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (error) {
    showToast("Unable to save. Your browser storage may be full.");
  }
}
function makeId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, character => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  })[character]);
}
function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2300);
}
function setFilter(filter) {
  currentFilter = filter;
  document.querySelectorAll("[data-filter]").forEach(button => {
    button.classList.toggle("active", button.dataset.filter === filter);
  });
  renderTasks();
}
function addTask(title, priority) {
  tasks.unshift({
    id: makeId(), title: title.trim(), priority, completed: false,
    createdAt: new Date().toISOString()
  });
  saveTasks();
  render();
  showToast("Task added to your list.");
}
function toggleTask(id) {
  const task = tasks.find(item => item.id === id);
  if (!task) return;
  task.completed = !task.completed;
  saveTasks();
  render();
  showToast(task.completed ? "Nice work — task completed!" : "Task moved back to in progress.");
}
function deleteTask(id) {
  tasks = tasks.filter(item => item.id !== id);
  saveTasks();
  render();
  showToast("Task deleted.");
}
function editTask(id) {
  const task = tasks.find(item => item.id === id);
  if (!task) return;
  const updated = window.prompt("Edit task name:", task.title);
  if (updated === null) return;
  if (!updated.trim()) {
    showToast("Task name cannot be empty.");
    return;
  }
  task.title = updated.trim();
  saveTasks();
  render();
  showToast("Task updated.");
}
function visibleTasks() {
  return tasks.filter(task => {
    const matchesFilter = currentFilter === "all" ||
      (currentFilter === "active" && !task.completed) ||
      (currentFilter === "completed" && task.completed);
    return matchesFilter && task.title.toLowerCase().includes(searchTerm.toLowerCase());
  });
}
function renderTasks() {
  const filtered = visibleTasks();
  if (!filtered.length) {
    const hasAnyTasks = tasks.length > 0;
    taskList.innerHTML = `<div class="empty-state"><div class="empty-icon">✦</div><strong>${hasAnyTasks ? "No matching tasks" : "Your task list is a blank canvas."}</strong><p>${hasAnyTasks ? "Try another filter or search term." : "Add your first task above and build some momentum."}</p></div>`;
  } else {
    taskList.innerHTML = filtered.map(task => `
      <article class="task-row ${task.completed ? "is-complete" : ""}">
        <button class="check-task ${task.completed ? "checked" : ""}" data-action="toggle" data-id="${task.id}" aria-label="${task.completed ? "Mark as incomplete" : "Mark as completed"}">${task.completed ? "✓" : ""}</button>
        <div class="task-copy"><div class="task-title">${escapeHTML(task.title)}</div><div class="task-description">${task.completed ? "Completed — great job!" : "One step closer to getting it done."}</div></div>
        <span class="priority ${escapeHTML(task.priority)}">${escapeHTML(task.priority)}</span>
        <div class="task-actions">
          <button class="icon-button" data-action="edit" data-id="${task.id}" aria-label="Edit task" title="Edit task">✎</button>
          <button class="icon-button delete" data-action="delete" data-id="${task.id}" aria-label="Delete task" title="Delete task">⌫</button>
        </div>
      </article>`).join("");
  }
  document.getElementById("listSummary").textContent = `${filtered.length} ${filtered.length === 1 ? "task" : "tasks"} shown`;
}
function renderStats() {
  const total = tasks.length;
  const completed = tasks.filter(task => task.completed).length;
  const active = total - completed;
  const percent = total ? Math.round(completed / total * 100) : 0;
  document.getElementById("totalCount").textContent = total;
  document.getElementById("completedCount").textContent = completed;
  document.getElementById("activeCount").textContent = active;
  document.getElementById("pendingCount").textContent = active;
  document.getElementById("sideAll").textContent = total;
  document.getElementById("sideActive").textContent = active;
  document.getElementById("sideCompleted").textContent = completed;
  document.getElementById("progressPercent").textContent = `${percent}%`;
  document.getElementById("progressBar").style.width = `${percent}%`;
  document.getElementById("progressRing").style.background =
    `conic-gradient(var(--gold) ${percent * 3.6}deg, #477fb0 ${percent * 3.6}deg)`;
  document.getElementById("progressText").textContent = total
    ? `${completed} of ${total} ${total === 1 ? "task" : "tasks"} completed.`
    : "Your next win is one task away.";
}
function render() {
  renderTasks();
  renderStats();
}
taskForm.addEventListener("submit", event => {
  event.preventDefault();
  const title = taskInput.value.trim();
  if (!title) {
    showToast("Please enter a task first.");
    taskInput.focus();
    return;
  }
  addTask(title, priorityInput.value);
  taskInput.value = "";
  priorityInput.value = "medium";
  taskInput.focus();
});
taskList.addEventListener("click", event => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;
  const { action, id } = button.dataset;
  if (action === "toggle") toggleTask(id);
  if (action === "delete") deleteTask(id);
  if (action === "edit") editTask(id);
});
document.querySelectorAll("[data-filter]").forEach(button => {
  button.addEventListener("click", () => setFilter(button.dataset.filter));
});
searchInput.addEventListener("input", event => {
  searchTerm = event.target.value.trim();
  renderTasks();
});
document.getElementById("focusSearch").addEventListener("click", () => {
  searchInput.focus();
  searchInput.scrollIntoView({ behavior: "smooth", block: "center" });
});
document.getElementById("clearCompleted").addEventListener("click", () => {
  const count = tasks.filter(task => task.completed).length;
  if (!count) return showToast("There are no completed tasks to clear.");
  tasks = tasks.filter(task => !task.completed);
  saveTasks();
  render();
  showToast(`${count} completed ${count === 1 ? "task" : "tasks"} cleared.`);
});
document.getElementById("clearAll").addEventListener("click", () => {
  if (!tasks.length) return showToast("Your task list is already empty.");
  if (!window.confirm("Delete every task? This cannot be undone.")) return;
  tasks = [];
  saveTasks();
  render();
  showToast("All tasks deleted.");
});
document.getElementById("todayDate").textContent = new Intl.DateTimeFormat(undefined, {
  month: "long", day: "numeric", year: "numeric"
}).format(new Date());
render();
