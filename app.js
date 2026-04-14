// API Base URL
const API_URL = 'https://full-stack-vssh.onrender.com/api/tasks';

// Global State
let todoList = [];

// DOM Elements
const taskForm = document.querySelector('#task-form');
const taskInput = document.querySelector('#task-input');
const priorityInput = document.querySelector('#priority-input');
const taskListContainer = document.querySelector('#task-list');
const taskToastElement = document.querySelector('#task-toast');
const taskToastMessage = document.querySelector('#task-toast-message');

let taskToast = null;

const showToast = (message, variant = 'success') => {
    if (!taskToastElement || !taskToastMessage || typeof bootstrap === 'undefined') return;

    taskToastElement.classList.remove('text-bg-success', 'text-bg-danger', 'text-bg-primary', 'text-bg-warning');
    taskToastElement.classList.add(`text-bg-${variant}`);
    taskToastMessage.textContent = message;

    if (!taskToast) {
        taskToast = new bootstrap.Toast(taskToastElement, { delay: 2200 });
    }

    taskToast.show();
};

// --- INITIALIZE: Load tasks from database ---
const loadTasks = async () => {
    try {
        const response = await fetch(API_URL);
        todoList = await response.json();
        renderTasks();
    } catch (error) {
        console.error('Error loading tasks:', error);
        showToast('Failed to load tasks from database', 'danger');
    }
};

// --- 1. CREATE ---
taskForm.addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevents page reload
    
    const newTask = {
        title: taskInput.value,
        priority: priorityInput.value
    };

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newTask)
        });

        if (response.ok) {
            taskForm.reset(); // Clear fields
            await loadTasks(); // Reload tasks from database
            showToast('Task added successfully', 'success');
        } else {
            const errorText = await response.text();
            throw new Error(errorText);
        }
    } catch (error) {
        console.error('Error creating task:', error);
        showToast('Failed to add task to database', 'danger');
    }
});

// --- 2. READ (Displaying data) ---
const renderTasks = () => {
    taskListContainer.innerHTML = '';

    todoList.forEach(task => {
        const taskRow = document.createElement('tr');

        let tagPriority = '';
        if (task.priority === 'Low') {
            tagPriority = 'text-bg-success';
        } else if (task.priority === 'Medium') {
            tagPriority = 'text-bg-warning';
        } else if (task.priority === 'High') {
            tagPriority = 'text-bg-danger';
        }

        taskRow.innerHTML = `
            <td>${task.id}</td>
            <td>
                <span class="${task.isCompleted ? 'completed' : ''}">
                    ${task.title}
                </span>
            </td>
            <td>
                <span class="badge ${tagPriority}">
                    ${task.priority}
                </span>
            </td>
            <td>
                <button 
                    class="btn btn-sm ${task.isCompleted ? 'btn-success' : 'btn-warning'}"
                    onclick="toggleComplete(${task.id})"
                >
                    ${task.isCompleted ? '✔ Done' : '⏳ Mark as done'}
                </button>
            </td>
            <td>
                <button 
                    class="btn btn-danger btn-sm" 
                    onclick="deleteTask(${task.id})"
                >
                    Delete
                </button>
            </td>
        `;

        taskListContainer.appendChild(taskRow);
    });
};

// --- 3. UPDATE (Toggle Completion) ---
window.openEditTaskModal = (id) => {
    const task = toDoList.find((item) => item.id === id);

    if (!task) {
        return;
    }

    document.getElementById('edit-task-id').value = task.id;
    document.getElementById('edit-task-title').value = task.title;
    document.getElementById('edit-task-priority').value = task.priority;
    document.getElementById('edit-task-completed').checked = Boolean(task.isCompleted);

    editTaskModal.show();
};

window.toggleComplete = async (id) => {
    try {
        const task = todoList.find(t => t.id === id);
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ isCompleted: !task.isCompleted })
        });

        if (response.ok) {
            await loadTasks(); // Reload tasks from database
            showToast('Task updated successfully', 'primary');
        } else {
            throw new Error('Failed to update task');
        }
    } catch (error) {
        console.error('Error updating task:', error);
        showToast('Failed to update task', 'danger');
    }
};


// --- 4. DELETE ---
window.deleteTask = async (id) => {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            await loadTasks(); // Reload tasks from database
            showToast('Task deleted successfully', 'danger');
        } else {
            throw new Error('Failed to delete task');
        }
    } catch (error) {
        console.error('Error deleting task:', error);
        showToast('Failed to delete task', 'danger');
    }
};

// Load tasks when page loads
loadTasks();
