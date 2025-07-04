let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentFilter = 'All';

document.getElementById('addTaskBtn').addEventListener('click', addTask);
document.getElementById('searchInput').addEventListener('input', displayTasks);
document.getElementById('sortOption').addEventListener('change', displayTasks);
window.onload = displayTasks;

function addTask() {
    const taskInput = document.getElementById('taskInput').value.trim();
    const dueDate = document.getElementById('dueDate').value;
    const priority = document.getElementById('priority').value;
    const category = document.getElementById('categoryInput').value.trim();

    if (taskInput === '') {
        alert('Please enter a task.');
        return;
    }

    tasks.push({ text: taskInput, dueDate, priority, category, completed: false });
    saveTasks();
    resetInputs();
    displayTasks();
}

function resetInputs() {
    document.getElementById('taskInput').value = '';
    document.getElementById('dueDate').value = '';
    document.getElementById('priority').value = 'Medium';
    document.getElementById('categoryInput').value = '';
}

function displayTasks() {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';

    const searchQuery = document.getElementById('searchInput').value.toLowerCase();
    const sortOption = document.getElementById('sortOption').value;

    let filteredTasks = tasks.filter(task => {
        if (currentFilter === 'Completed' && !task.completed) return false;
        if (currentFilter === 'Pending' && task.completed) return false;
        if (searchQuery && !task.text.toLowerCase().includes(searchQuery)) return false;
        return true;
    });

    if (sortOption === 'date') {
        filteredTasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    } else if (sortOption === 'priority') {
        const priorityOrder = { 'High': 1, 'Medium': 2, 'Low': 3 };
        filteredTasks.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
    }

    filteredTasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.className = task.completed ? 'completed' : '';
        if (task.dueDate && new Date(task.dueDate) < new Date() && !task.completed) {
            li.classList.add('overdue');
        }

        li.innerHTML = `
            <div>
                <input type="checkbox" ${task.completed ? 'checked' : ''} onclick="toggleComplete(${index})">
                <strong>${task.text}</strong> <br>
                Due: ${task.dueDate || 'No due date'} <br>
                Priority: ${task.priority} <br>
                Category: ${task.category || 'None'}
            </div>
            <div>
                <button class="edit-btn" onclick="editTask(${index})">Edit</button>
                <button class="delete-btn" onclick="deleteTask(${index})">Delete</button>
            </div>
        `;

        taskList.appendChild(li);
    });

    updateProgressBar();
}

function toggleComplete(index) {
    tasks[index].completed = !tasks[index].completed;
    saveTasks();
    displayTasks();
}

function deleteTask(index) {
    tasks.splice(index, 1);
    saveTasks();
    displayTasks();
}

function editTask(index) {
    const newTask = prompt('Edit Task:', tasks[index].text);
    if (newTask !== null && newTask.trim() !== '') {
        tasks[index].text = newTask.trim();
        saveTasks();
        displayTasks();
    }
}

function filterTasks(filter) {
    currentFilter = filter;
    displayTasks();
}

function updateProgressBar() {
    const progress = document.getElementById('progress');
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;
    const percentage = total ? (completed / total) * 100 : 0;
    progress.style.width = `${percentage}%`;
}

function toggleTheme() {
    document.body.classList.toggle('dark-mode');
}

function exportTasks() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(tasks, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "tasks.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
}

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}
