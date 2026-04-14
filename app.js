const API_URL = 'https://full-stack-vssh.onrender.com/api/tasks';

let todoList = [];
let editTaskModal;

// Toast
const taskToastElement = document.querySelector('#task-toast');
const taskToastMessage = document.querySelector('#task-toast-message');

let taskToast = null;

const showToast = (message, variant = 'success') => {
    taskToastElement.className = `toast align-items-center text-bg-${variant} border-0`;
    taskToastMessage.textContent = message;

    if (!taskToast) {
        taskToast = new bootstrap.Toast(taskToastElement, { delay: 2000 });
    }

    taskToast.show();
};

// LOAD
const loadTasks = async () => {
    try {
        const res = await fetch(API_URL);
        const data = await res.json();
        todoList = data;
        renderTasks();
    } catch (err) {
        console.error(err);
    }
};

// RENDER
const renderTasks = () => {
    const container = document.querySelector('#task-list');
    container.innerHTML = '';

    todoList.forEach(task => {
        const row = document.createElement('tr');

        let badge = '';
        if (task.priority === 'Low') badge = 'text-bg-success';
        if (task.priority === 'Medium') badge = 'text-bg-warning';
        if (task.priority === 'High') badge = 'text-bg-danger';

        row.innerHTML = `
            <td>${task.id}</td>
            <td>${task.title}</td>
            <td><span class="badge ${badge}">${task.priority}</span></td>
            <td>
                <button 
                    class="btn btn-sm ${task.isCompleted ? 'btn-success' : 'btn-warning'}"
                    onclick="toggleComplete(${task.id})"
                >
                    ${task.isCompleted ? '✔ Done' : '⏳ Pending'}
                </button>
            </td>
            <td>
                <button class="btn btn-primary btn-sm" onclick="openEditTaskModal(${task.id})">Edit</button>
                <button class="btn btn-danger btn-sm" onclick="deleteTask(${task.id})">Delete</button>
            </td>
        `;

        container.appendChild(row);
    });
};

// CREATE
document.querySelector('#task-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const title = document.querySelector('#task-input').value;
    const priority = document.querySelector('#priority-input').value;

    try {
        const res = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, priority })
        });

        if (res.ok) {
            e.target.reset();
            loadTasks();
            showToast('Task added');
        }
    } catch (err) {
        console.error(err);
    }
});

// TOGGLE
window.toggleComplete = async (id) => {
    const task = todoList.find(t => t.id === id);

    await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isCompleted: !task.isCompleted })
    });

    loadTasks();
};

// DELETE
window.deleteTask = async (id) => {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    loadTasks();
    showToast('Deleted', 'danger');
};

// OPEN MODAL
window.openEditTaskModal = (id) => {
    const task = todoList.find(t => t.id === id);

    document.getElementById('edit-task-id').value = task.id;
    document.getElementById('edit-task-title').value = task.title;
    document.getElementById('edit-task-priority').value = task.priority;
    document.getElementById('edit-task-completed').checked = task.isCompleted;

    editTaskModal.show();
};

// UPDATE
document.getElementById('edit-task-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const id = document.getElementById('edit-task-id').value;
    const title = document.getElementById('edit-task-title').value;
    const priority = document.getElementById('edit-task-priority').value;
    const isCompleted = document.getElementById('edit-task-completed').checked;

    await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, priority, isCompleted })
    });

    editTaskModal.hide();
    loadTasks();
    showToast('Updated', 'primary');
});

// INIT MODAL
editTaskModal = new bootstrap.Modal(document.getElementById('editTaskModal'));

loadTasks();
