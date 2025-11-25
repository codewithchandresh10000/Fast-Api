// API Configuration
const API_BASE = '/api';
let currentFilter = 'all';

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    setupEventListeners();
    checkHealth();
});

// Initialize app
async function initializeApp() {
    await loadTasks();
    setInterval(checkHealth, 30000); // Check health every 30 seconds
}

// Setup event listeners
function setupEventListeners() {
    // Task form submission
    document.getElementById('taskForm').addEventListener('submit', handleCreateTask);

    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach((btn) => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.filter-btn').forEach((b) => b.classList.remove('active'));
            e.target.classList.add('active');
            currentFilter = e.target.dataset.filter;
            renderTasks();
        });
    });
}

// Check API health
async function checkHealth() {
    try {
        const response = await fetch(`${API_BASE}/health`);
        if (response.ok) {
            setHealthStatus(true);
        } else {
            setHealthStatus(false);
        }
    } catch (error) {
        setHealthStatus(false);
        console.error('Health check failed:', error);
    }
}

// Set health status indicator
function setHealthStatus(isConnected) {
    const statusDot = document.querySelector('.status-dot');
    const statusText = document.querySelector('.status-text');

    if (isConnected) {
        statusDot.classList.remove('disconnected');
        statusDot.classList.add('connected');
        statusText.textContent = 'API Connected';
    } else {
        statusDot.classList.remove('connected');
        statusDot.classList.add('disconnected');
        statusText.textContent = 'API Disconnected';
    }
}

// Task state
let tasks = [];

// Load tasks from API
async function loadTasks() {
    try {
        const response = await fetch(`${API_BASE}/tasks`);
        if (!response.ok) throw new Error('Failed to load tasks');
        tasks = await response.json();
        renderTasks();
    } catch (error) {
        console.error('Error loading tasks:', error);
        showError('Failed to load tasks');
    }
}

// Render tasks based on filter
function renderTasks() {
    const container = document.getElementById('tasksContainer');
    const emptyState = document.getElementById('emptyState');

    // Filter tasks
    let filteredTasks = tasks;
    if (currentFilter === 'active') {
        filteredTasks = tasks.filter((t) => !t.completed);
    } else if (currentFilter === 'completed') {
        filteredTasks = tasks.filter((t) => t.completed);
    }

    // Clear container
    container.innerHTML = '';

    // Show empty state or render tasks
    if (filteredTasks.length === 0) {
        emptyState.style.display = 'block';
    } else {
        emptyState.style.display = 'none';
        filteredTasks.forEach((task) => {
            container.appendChild(createTaskElement(task));
        });
    }
}

// Create task DOM element
function createTaskElement(task) {
    const div = document.createElement('div');
    div.className = `task-item ${task.completed ? 'completed' : ''}`;
    div.dataset.taskId = task.id;

    const createdDate = new Date(task.created_at).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });

    div.innerHTML = `
        <input 
            type="checkbox" 
            class="task-checkbox" 
            ${task.completed ? 'checked' : ''} 
            onchange="handleToggleTask(${task.id})"
        >
        <div class="task-content">
            <div class="task-title">${escapeHtml(task.title)}</div>
            ${task.description ? `<div class="task-description">${escapeHtml(task.description)}</div>` : ''}
            <div class="task-meta">
                <span>📅 ${createdDate}</span>
                <span>${task.completed ? '✅ Completed' : '⏳ Pending'}</span>
            </div>
        </div>
        <div class="task-actions">
            <button class="btn-edit btn-small" onclick="handleEditTask(${task.id})">Edit</button>
            <button class="btn-delete btn-small" onclick="handleDeleteTask(${task.id})">Delete</button>
        </div>
    `;

    return div;
}

// Create new task
async function handleCreateTask(e) {
    e.preventDefault();

    const title = document.getElementById('taskTitle').value.trim();
    const description = document.getElementById('taskDescription').value.trim();

    if (!title) {
        showError('Please enter a task title');
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/tasks`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title,
                description,
            }),
        });

        if (!response.ok) throw new Error('Failed to create task');

        const newTask = await response.json();
        tasks.push(newTask);
        renderTasks();

        // Reset form
        document.getElementById('taskForm').reset();
        showSuccess('Task created successfully!');
    } catch (error) {
        console.error('Error creating task:', error);
        showError('Failed to create task');
    }
}

// Toggle task completion
async function handleToggleTask(taskId) {
    try {
        const response = await fetch(`${API_BASE}/tasks/${taskId}/toggle`, {
            method: 'PATCH',
        });

        if (!response.ok) throw new Error('Failed to toggle task');

        const updatedTask = await response.json();
        const index = tasks.findIndex((t) => t.id === taskId);
        if (index !== -1) {
            tasks[index] = updatedTask;
            renderTasks();
        }
    } catch (error) {
        console.error('Error toggling task:', error);
        showError('Failed to update task');
    }
}

// Edit task
async function handleEditTask(taskId) {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    const newTitle = prompt('Edit task title:', task.title);
    if (newTitle === null) return;

    if (!newTitle.trim()) {
        showError('Task title cannot be empty');
        return;
    }

    const newDescription = prompt('Edit task description:', task.description || '');
    if (newDescription === null) return;

    try {
        const response = await fetch(`${API_BASE}/tasks/${taskId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title: newTitle.trim(),
                description: newDescription.trim(),
            }),
        });

        if (!response.ok) throw new Error('Failed to update task');

        const updatedTask = await response.json();
        const index = tasks.findIndex((t) => t.id === taskId);
        if (index !== -1) {
            tasks[index] = updatedTask;
            renderTasks();
            showSuccess('Task updated successfully!');
        }
    } catch (error) {
        console.error('Error updating task:', error);
        showError('Failed to update task');
    }
}

// Delete task
async function handleDeleteTask(taskId) {
    if (!confirm('Are you sure you want to delete this task?')) return;

    try {
        const response = await fetch(`${API_BASE}/tasks/${taskId}`, {
            method: 'DELETE',
        });

        if (!response.ok) throw new Error('Failed to delete task');

        tasks = tasks.filter((t) => t.id !== taskId);
        renderTasks();
        showSuccess('Task deleted successfully!');
    } catch (error) {
        console.error('Error deleting task:', error);
        showError('Failed to delete task');
    }
}

// Utility: Escape HTML
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;',
    };
    return text.replace(/[&<>"']/g, (m) => map[m]);
}

// Show success notification
function showSuccess(message) {
    showNotification(message, 'success');
}

// Show error notification
function showError(message) {
    showNotification(message, 'error');
}

// Show notification
function showNotification(message, type) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 16px 24px;
        border-radius: 8px;
        background: ${type === 'success' ? '#10b981' : '#ef4444'};
        color: white;
        font-weight: 500;
        z-index: 1000;
        animation: slideIn 0.3s ease;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    `;

    // Add animation styles if not already present
    if (!document.querySelector('style[data-notification-styles]')) {
        const style = document.createElement('style');
        style.setAttribute('data-notification-styles', '');
        style.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(400px);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            @keyframes slideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(400px);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }

    document.body.appendChild(notification);

    // Auto-remove notification
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}
