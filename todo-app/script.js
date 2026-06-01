class TodoApp {
    constructor() {
        this.todos = [];
        this.currentFilter = 'all';
        this.editingId = null;
        this.init();
    }

    init() {
        this.loadTodos();
        this.setupEventListeners();
        this.render();
    }

    setupEventListeners() {
        document.getElementById('addBtn').addEventListener('click', () => this.addTodo());
        document.getElementById('todoInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addTodo();
        });
        document.getElementById('clearCompletedBtn').addEventListener('click', () => this.clearCompleted());
        document.getElementById('exportBtn').addEventListener('click', () => this.exportTodos());

        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                e.currentTarget.classList.add('active');
                this.currentFilter = e.currentTarget.dataset.filter;
                this.render();
            });
        });

        document.querySelector('.close-btn').addEventListener('click', () => this.closeModal());
        document.getElementById('cancelBtn').addEventListener('click', () => this.closeModal());
        document.getElementById('saveBtn').addEventListener('click', () => this.saveEdit());
    }

    addTodo() {
        const input = document.getElementById('todoInput');
        const priority = document.getElementById('prioritySelect').value;
        const text = input.value.trim();

        if (!text) return alert('Please enter a task!');

        this.todos.unshift({
            id: Date.now(),
            text,
            completed: false,
            priority,
            createdAt: new Date().toLocaleDateString()
        });

        this.saveTodos();
        input.value = '';
        document.getElementById('prioritySelect').value = 'medium';
        this.render();
    }

    deleteTodo(id) {
        if (confirm('Delete this task?')) {
            this.todos = this.todos.filter(t => t.id !== id);
            this.saveTodos();
            this.render();
        }
    }

    toggleTodo(id) {
        this.todos = this.todos.map(t => t.id === id ? {...t, completed: !t.completed} : t);
        this.saveTodos();
        this.render();
    }

    editTodo(id) {
        const todo = this.todos.find(t => t.id === id);
        if (!todo) return;
        this.editingId = id;
        document.getElementById('editInput').value = todo.text;
        document.getElementById('editPriority').value = todo.priority;
        document.getElementById('editModal').classList.add('show');
    }

    saveEdit() {
        const newText = document.getElementById('editInput').value.trim();
        const newPriority = document.getElementById('editPriority').value;
        if (!newText) return alert('Task cannot be empty!');

        this.todos = this.todos.map(t => 
            t.id === this.editingId ? {...t, text: newText, priority: newPriority} : t
        );
        this.saveTodos();
        this.closeModal();
        this.render();
    }

    closeModal() {
        document.getElementById('editModal').classList.remove('show');
    }

    clearCompleted() {
        const count = this.todos.filter(t => t.completed).length;
        if (count === 0) return alert('No completed tasks!');
        if (confirm(`Delete ${count} completed task(s)?`)) {
            this.todos = this.todos.filter(t => !t.completed);
            this.saveTodos();
            this.render();
        }
    }

    exportTodos() {
        if (this.todos.length === 0) return alert('No tasks to export!');
        const data = JSON.stringify(this.todos, null, 2);
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `todos_${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }

    getFilteredTodos() {
        switch (this.currentFilter) {
            case 'completed': return this.todos.filter(t => t.completed);
            case 'active': return this.todos.filter(t => !t.completed);
            case 'high': return this.todos.filter(t => t.priority === 'high');
            default: return this.todos;
        }
    }

    updateStats() {
        const total = this.todos.length;
        const completed = this.todos.filter(t => t.completed).length;
        const remaining = total - completed;
        const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

        document.getElementById('totalCount').textContent = total;
        document.getElementById('completedCount').textContent = completed;
        document.getElementById('remainingCount').textContent = remaining;
        document.getElementById('progressFill').style.width = `${percentage}%`;
    }

    render() {
        const todoList = document.getElementById('todoList');
        const emptyState = document.getElementById('emptyState');
        const filtered = this.getFilteredTodos();

        this.updateStats();

        if (filtered.length === 0) {
            todoList.innerHTML = '';
            emptyState.classList.add('show');
            return;
        }

        emptyState.classList.remove('show');
        todoList.innerHTML = filtered.map(todo => `
            <div class="todo-item ${todo.completed ? 'completed' : ''} ${todo.priority}-priority">
                <input type="checkbox" class="checkbox" ${todo.completed ? 'checked' : ''} onchange="app.toggleTodo(${todo.id})">
                <div class="todo-content">
                    <span class="todo-text">${this.escapeHtml(todo.text)}</span>
                    <div class="todo-meta">
                        <span class="priority-badge ${todo.priority}">${todo.priority}</span>
                        <span>${todo.createdAt}</span>
                    </div>
                </div>
                <div class="todo-actions">
                    <button class="action-icon" onclick="app.editTodo(${todo.id})"><i class="fas fa-edit"></i></button>
                    <button class="action-icon" onclick="app.deleteTodo(${todo.id})"><i class="fas fa-trash"></i></button>
                </div>
            </div>
        `).join('');
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    saveTodos() {
        localStorage.setItem('todos', JSON.stringify(this.todos));
    }

    loadTodos() {
        const stored = localStorage.getItem('todos');
        this.todos = stored ? JSON.parse(stored) : [];
    }
}

const app = new TodoApp();