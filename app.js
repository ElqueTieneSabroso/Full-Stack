const API_URL = 'https://full-stack-vssh.onrender.com/api/tasks';

let todoList = [];
let editTaskModal;

// TOAST
const showToast = (msg, type = 'success') => {
    const toastEl = document.getElementById('task-toast');
    const toastMsg = document.getElementById('task-toast-message');

    toastEl.className = `toast align-items-center text-bg-${type} border-0`;
    toastMsg.textContent = msg;

    new bootstrap.Toast(toastEl).show();
};

// LOAD
const loadTasks = async () => {
    const res = await fetch(API_URL);
    const data = await res.json();
    todoList = data;
    renderTasks();
};

// RENDER
const renderTasks = () => {
    const container = document.getElementById('task-list');
    container.innerHTML = '';

    todoList.forEach(task => {
        let badge = '';
        if (task.priority === 'Low') badge = 'text-bg-success';
        if (task.priority === 'Medium') badge = 'text-bg-warning';
        if (task.priority === 'High') badge = 'text-bg-danger';

        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${task.id}</td>
            <td>${task.title}</td>
            <td><span class="badge ${badge}">${task.priority}</span></td>
            <td>
                <button class="btn btn-sm ${task.isCompleted ? 'btn-success' : 'btn-warning'}"
                    onclick="toggleComplete(${task.id})">
                    ${task.isCompleted ? 'Done' : 'Pending'}
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
document.getElementById('task-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const title = document.getElementById('task-input').value;
    const priority = document.getElementById('priority-input').value;

    await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, priority })
    });

    e.target.reset();
    loadTasks();
    showToast('Task added');
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

// INIT
editTaskModal = new bootstrap.Modal(document.getElementById('editTaskModal'));

loadTasks();
