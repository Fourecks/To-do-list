const addBtn = document.querySelector("#add-btn");
const newTaskInput = document.querySelector("#wrapper input");
const tasksContainer = document.querySelector("#tasks");
const error = document.getElementById("error");
const countValue = document.querySelector(".count-value");

let taskCount = 0;

// Leer tareas guardadas al cargar
window.onload = () => {
  const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
  taskCount = 0;
  savedTasks.forEach((task) => renderTask(task.text, task.completed));
  displayCount(taskCount);
};

const displayCount = (count) => {
  countValue.innerText = Math.max(0, count); // evita negativos
};

const saveTasks = () => {
  const tasks = [];
  document.querySelectorAll(".task").forEach((taskElement) => {
    const text = taskElement.querySelector(".taskname").innerText;
    const completed = taskElement.querySelector(".task-check").checked;
    tasks.push({ text, completed });
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
};

const renderTask = (taskName, completed = false) => {
  const task = document.createElement("div");
  task.className = "task";
  task.innerHTML = `
    <input type="checkbox" class="task-check" ${completed ? "checked" : ""}>
    <span class="taskname ${completed ? "completed" : ""}">${taskName}</span>
    <button class="edit"><i class="fas fa-edit"></i></button>
    <button class="delete"><i class="far fa-trash-alt"></i></button>
  `;
  tasksContainer.appendChild(task);

  const checkbox = task.querySelector(".task-check");
  checkbox.addEventListener("change", () => {
    task.querySelector(".taskname").classList.toggle("completed");
    taskCount += checkbox.checked ? -1 : 1;
    displayCount(taskCount);
    saveTasks();
  });

  task.querySelector(".delete").addEventListener("click", () => {
    task.remove();
    if (!checkbox.checked) taskCount -= 1;
    displayCount(taskCount);
    saveTasks();
  });

  task.querySelector(".edit").addEventListener("click", () => {
    newTaskInput.value = task.querySelector(".taskname").innerText;
    if (!checkbox.checked) taskCount -= 1;
    task.remove();
    displayCount(taskCount);
    saveTasks();
  });

  if (!completed) taskCount += 1;
  displayCount(taskCount);
  saveTasks();
};

const addTask = () => {
  const taskName = newTaskInput.value.trim();
  error.style.display = "none";

  if (!taskName) {
    setTimeout(() => {
      error.style.display = "block";
    }, 200);
    return;
  }

  renderTask(taskName);
  newTaskInput.value = "";
};

addBtn.addEventListener("click", addTask);
