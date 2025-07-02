document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const todoInput = document.getElementById('todo-input');
    const addBtn = document.getElementById('add-btn');
    const todoList = document.getElementById('todo-list');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const clearCompletedBtn = document.getElementById('clear-completed');
    const taskCount = document.getElementById('task-count');
    
    // State
    let todos = JSON.parse(localStorage.getItem('todos')) || [];
    let currentFilter = 'all';
    
    // Initialize the app
    function init() {
        renderTodos();
        updateTaskCount();
        addEventListeners();
    }
    
    // Add event listeners
    function addEventListeners() {
        // Add new todo
        addBtn.addEventListener('click', addTodo);
        todoInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') addTodo();
        });
        
        // Filter todos
        filterBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                filterBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                currentFilter = this.dataset.filter;
                renderTodos();
            });
        });
        
        // Clear completed todos
        clearCompletedBtn.addEventListener('click', clearCompleted);
    }
    
    // Add a new todo
    function addTodo() {
        const text = todoInput.value.trim();
        if (text) {
            const newTodo = {
                id: Date.now(),
                text,
                completed: false
            };
            
            todos.unshift(newTodo);
            saveTodos();
            renderTodos();
            todoInput.value = '';
            updateTaskCount();
        }
    }
    
    // Render todos based on current filter
    function renderTodos() {
        todoList.innerHTML = '';
        
        const filteredTodos = todos.filter(todo => {
            if (currentFilter === 'all') return true;
            if (currentFilter === 'completed') return todo.completed;
            if (currentFilter === 'pending') return !todo.completed;
            return true;
        });
        
        if (filteredTodos.length === 0) {
            const emptyMessage = document.createElement('li');
            emptyMessage.textContent = currentFilter === 'all' 
                ? 'No tasks yet. Add one above!' 
                : `No ${currentFilter} tasks.`;
            emptyMessage.classList.add('empty-message');
            todoList.appendChild(emptyMessage);
            return;
        }
        
        filteredTodos.forEach(todo => {
            const todoItem = document.createElement('li');
            todoItem.className = 'todo-item';
            if (todo.completed) todoItem.classList.add('completed');
            
            todoItem.innerHTML = `
                <input type="checkbox" class="todo-checkbox" ${todo.completed ? 'checked' : ''} data-id="${todo.id}">
                <span class="todo-text">${todo.text}</span>
                <button class="delete-btn" data-id="${todo.id}"><i class="fas fa-trash"></i></button>
            `;
            
            todoList.appendChild(todoItem);
        });
        
        // Add event listeners to checkboxes and delete buttons
        document.querySelectorAll('.todo-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', toggleTodo);
        });
        
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', deleteTodo);
        });
    }
    
    // Toggle todo completion status
    function toggleTodo(e) {
        const id = parseInt(e.target.dataset.id);
        todos = todos.map(todo => 
            todo.id === id ? {...todo, completed: !todo.completed} : todo
        );
        saveTodos();
        renderTodos();
        updateTaskCount();
    }
    
    // Delete a todo
    function deleteTodo(e) {
        const id = parseInt(e.currentTarget.dataset.id);
        todos = todos.filter(todo => todo.id !== id);
        saveTodos();
        renderTodos();
        updateTaskCount();
    }
    
   
    function clearCompleted() {
        todos = todos.filter(todo => !todo.completed);
        saveTodos();
        renderTodos();
        updateTaskCount();
    }
    
   
    function updateTaskCount() {
        const totalTasks = todos.length;
        const completedTasks = todos.filter(todo => todo.completed).length;
        const pendingTasks = totalTasks - completedTasks;
        
        taskCount.textContent = `${pendingTasks} ${pendingTasks === 1 ? 'task' : 'tasks'} remaining`;
    }
    
   
    function saveTodos() {
        localStorage.setItem('todos', JSON.stringify(todos));
    }
    
   
    init();
});