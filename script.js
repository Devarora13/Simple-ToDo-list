/**
 * Todo List Application with DummyJSON API Integration
 * Features: CRUD operations, search, filtering, pagination
 */

class TodoApp {
    constructor() {
        this.baseURL = 'https://dummyjson.com';
        this.todosPerPage = 10;
        this.currentPage = 1;
        this.allTodos = [];
        this.filteredTodos = [];
        this.searchTerm = '';
        this.dateFrom = '';
        this.dateTo = '';
        this.isLoading = false;
        this.localStorageKey = 'user_added_todos';
        
        this.initializeApp();
    }

    /**
     * Initialize the application
     */
    async initializeApp() {
        this.bindEventListeners();
        await this.loadTodos();
    }

    /**
     * Load user-added todos from localStorage
     */
    loadUserTodosFromStorage() {
        try {
            const storedTodos = localStorage.getItem(this.localStorageKey);
            return storedTodos ? JSON.parse(storedTodos) : [];
        } catch (error) {
            console.error('Error loading todos from localStorage:', error);
            return [];
        }
    }

    /**
     * Save user-added todos to localStorage
     */
    saveUserTodosToStorage(userTodos) {
        try {
            localStorage.setItem(this.localStorageKey, JSON.stringify(userTodos));
        } catch (error) {
            console.error('Error saving todos to localStorage:', error);
        }
    }

    /**
     * Add a new user todo to localStorage
     */
    addUserTodoToStorage(newTodo) {
        const userTodos = this.loadUserTodosFromStorage();
        userTodos.unshift(newTodo); // Add to beginning
        this.saveUserTodosToStorage(userTodos);
    }

    /**
     * Bind all event listeners
     */
    bindEventListeners() {
        // Add todo form submission
        document.getElementById('add-todo-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addTodo();
        });

        // Search functionality
        document.getElementById('search-input').addEventListener('input', (e) => {
            this.searchTerm = e.target.value.toLowerCase().trim();
            this.applyFilters();
        });

        // Date filters
        document.getElementById('date-from').addEventListener('change', (e) => {
            this.dateFrom = e.target.value;
            this.applyFilters();
        });

        document.getElementById('date-to').addEventListener('change', (e) => {
            this.dateTo = e.target.value;
            this.applyFilters();
        });

        // Filter buttons
        document.getElementById('apply-filters-btn').addEventListener('click', () => {
            this.applyFilters();
        });

        document.getElementById('clear-filters-btn').addEventListener('click', () => {
            this.clearFilters();
        });

        // Pagination controls
        this.bindPaginationEvents();
    }

    /**
     * Bind pagination event listeners
     */
    bindPaginationEvents() {
        // Mobile pagination
        document.getElementById('prev-mobile').addEventListener('click', () => {
            if (this.currentPage > 1) {
                this.currentPage--;
                this.renderTodos();
                this.updatePagination();
            }
        });

        document.getElementById('next-mobile').addEventListener('click', () => {
            const totalPages = Math.ceil(this.filteredTodos.length / this.todosPerPage);
            if (this.currentPage < totalPages) {
                this.currentPage++;
                this.renderTodos();
                this.updatePagination();
            }
        });

        // Desktop pagination
        document.getElementById('prev-desktop').addEventListener('click', () => {
            if (this.currentPage > 1) {
                this.currentPage--;
                this.renderTodos();
                this.updatePagination();
            }
        });

        document.getElementById('next-desktop').addEventListener('click', () => {
            const totalPages = Math.ceil(this.filteredTodos.length / this.todosPerPage);
            if (this.currentPage < totalPages) {
                this.currentPage++;
                this.renderTodos();
                this.updatePagination();
            }
        });
    }

    /**
     * Load todos from the API
     */
    async loadTodos() {
        try {
            this.showLoading(true);
            this.hideError();
            
            // Fetch all todos with a large limit to get complete dataset
            const response = await fetch(`${this.baseURL}/todos?limit=0`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (!data || !Array.isArray(data.todos)) {
                throw new Error('Invalid response format from API');
            }
            
            // Add creation dates for filtering (since API doesn't provide them)
            const apiTodos = data.todos.map((todo, index) => ({
                ...todo,
                createdAt: this.generateCreatedDate(index),
                isUserAdded: false // Mark as API todos
            }));
            
            // Load user-added todos from localStorage
            const userTodos = this.loadUserTodosFromStorage().map(todo => ({
                ...todo,
                isUserAdded: true // Mark as user-added todos
            }));
            
            // Combine user todos (first) with API todos
            this.allTodos = [...userTodos, ...apiTodos];
            this.filteredTodos = [...this.allTodos];
            this.currentPage = 1;
            
            this.renderTodos();
            this.updatePagination();
            this.updateTodosCount();
            
        } catch (error) {
            console.error('Error loading todos:', error);
            this.showError(`Failed to load todos: ${error.message}`);
        } finally {
            this.showLoading(false);
        }
    }

    /**
     * Generate creation dates for todos (since API doesn't provide them)
     */
    generateCreatedDate(index) {
        const baseDate = new Date('2024-01-01');
        const daysToAdd = Math.floor(index / 10); // Group todos by creation date
        const createdDate = new Date(baseDate);
        createdDate.setDate(baseDate.getDate() + daysToAdd);
        return createdDate.toISOString().split('T')[0];
    }

    /**
     * Add a new todo - Following the specified flow
     */
    async addTodo() {
        console.log('Add todo function called');
        
        const form = document.getElementById('add-todo-form');
        const todoInput = document.getElementById('todo-input');
        const addBtn = document.getElementById('add-todo-btn');
        const addText = document.getElementById('add-todo-text');
        const addLoading = document.getElementById('add-todo-loading');

        // Step 1: JavaScript handles the submit → Prevents page reload, reads input
        const taskText = todoInput.value.trim();
        const userId = 1; // Use default user ID as it's not in assignment requirements
        
        console.log('Task text:', taskText);
        console.log('User ID:', userId);

        // Validate inputs
        if (!this.validateForm(todoInput)) {
            console.log('Form validation failed');
            return;
        }

        try {
            // Show loading state
            addBtn.disabled = true;
            addText.classList.add('hidden');
            addLoading.classList.remove('hidden');
            this.hideError();
            this.hideSuccess();

            // Step 2: Sends a POST request to https://dummyjson.com/todos/add with the task data
            const todoData = {
                todo: taskText,
                completed: false,
                userId: userId
            };
            
            console.log('Sending POST request with data:', todoData);

            const response = await fetch(`${this.baseURL}/todos/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(todoData)
            });

            console.log('Response status:', response.status);
            console.log('Response ok:', response.ok);

            if (!response.ok) {
                const errorText = await response.text();
                console.log('Error response text:', errorText);
                throw new Error(`HTTP ${response.status}: ${errorText || response.statusText}`);
            }

            // Step 3: Gets a response with the new todo (with fake id)
            const newTodo = await response.json();
            console.log('Received new todo from API:', newTodo);
            
            // Step 4: Adds a fake createdAt date to the new todo
            newTodo.createdAt = new Date().toISOString().split('T')[0];
            newTodo.isUserAdded = true; // Mark as user-added
            console.log('Added createdAt to todo:', newTodo);
            
            // Step 5: Save to localStorage and add to local array
            this.addUserTodoToStorage(newTodo);
            this.allTodos.unshift(newTodo);
            console.log('Added todo to localStorage and local array. Total todos:', this.allTodos.length);
            
            // Clear form
            form.reset();
            this.removeValidationClasses(todoInput);
            
            // Step 6: Re-renders the list and pagination
            this.applyFilters();
            
            this.showSuccess('Todo added successfully!');
            console.log('Todo add process completed successfully');

        } catch (error) {
            console.error('Error adding todo:', error);
            console.error('Error details:', {
                name: error.name,
                message: error.message,
                stack: error.stack
            });
            
            // Provide more detailed error information
            let errorMessage = 'Failed to add todo';
            if (error.name === 'TypeError' && error.message.includes('fetch')) {
                errorMessage = 'Network error: Unable to connect to the API';
            } else if (error.message) {
                errorMessage += `: ${error.message}`;
            }
            this.showError(errorMessage);
        } finally {
            // Reset button state
            addBtn.disabled = false;
            addText.classList.remove('hidden');
            addLoading.classList.add('hidden');
        }
    }

    /**
     * Validate form inputs
     */
    validateForm(todoInput) {
        let isValid = true;
        
        // Reset previous validation
        this.removeValidationClasses(todoInput);
        
        // Validate todo input
        if (!todoInput.value.trim()) {
            todoInput.classList.add('invalid-input');
            isValid = false;
            this.showError('Please enter a task description');
        } else {
            todoInput.classList.add('valid-input');
        }
        
        return isValid;
    }

    /**
     * Remove validation classes from input
     */
    removeValidationClasses(input) {
        input.classList.remove('valid-input', 'invalid-input');
    }

    /**
     * Apply search and date filters
     */
    applyFilters() {
        this.filteredTodos = this.allTodos.filter(todo => {
            // Search filter
            const matchesSearch = !this.searchTerm || 
                todo.todo.toLowerCase().includes(this.searchTerm);
            
            // Date filters
            const matchesDateFrom = !this.dateFrom || 
                todo.createdAt >= this.dateFrom;
            
            const matchesDateTo = !this.dateTo || 
                todo.createdAt <= this.dateTo;
            
            return matchesSearch && matchesDateFrom && matchesDateTo;
        });
        
        // Reset to first page when filters change
        this.currentPage = 1;
        
        this.renderTodos();
        this.updatePagination();
        this.updateTodosCount();
    }

    /**
     * Clear all filters
     */
    clearFilters() {
        // Clear filter inputs
        document.getElementById('search-input').value = '';
        document.getElementById('date-from').value = '';
        document.getElementById('date-to').value = '';
        
        // Reset filter state
        this.searchTerm = '';
        this.dateFrom = '';
        this.dateTo = '';
        this.filteredTodos = [...this.allTodos];
        this.currentPage = 1;
        
        // Re-render
        this.renderTodos();
        this.updatePagination();
        this.updateTodosCount();
    }

    /**
     * Render todos for current page
     */
    renderTodos() {
        const container = document.getElementById('todos-container');
        const emptyState = document.getElementById('empty-state');
        
        // Calculate pagination
        const startIndex = (this.currentPage - 1) * this.todosPerPage;
        const endIndex = startIndex + this.todosPerPage;
        const todosToShow = this.filteredTodos.slice(startIndex, endIndex);
        
        // Clear container
        container.innerHTML = '';
        
        if (todosToShow.length === 0) {
            emptyState.classList.remove('hidden');
            return;
        }
        
        emptyState.classList.add('hidden');
        
        // Render todos
        todosToShow.forEach(todo => {
            const todoElement = this.createTodoElement(todo);
            container.appendChild(todoElement);
        });
    }

    /**
     * Create a todo element
     */
    createTodoElement(todo) {
        const div = document.createElement('div');
        div.className = `todo-item p-4 hover:bg-gray-50 transition-colors duration-200 ${todo.completed ? 'completed-todo' : ''}`;
        
        div.innerHTML = `
            <div class="flex items-center justify-between">
                <div class="flex items-center space-x-3 flex-1">
                    <input 
                        type="checkbox" 
                        class="todo-checkbox" 
                        ${todo.completed ? 'checked' : ''}
                        onchange="todoApp.toggleTodoComplete(${todo.id}, this.checked)"
                    >
                    <div class="flex-1">
                        <p class="todo-text text-sm font-medium text-gray-900 ${todo.completed ? 'line-through text-gray-500' : ''}">${this.escapeHtml(todo.todo)}</p>
                        <p class="text-xs text-gray-500 mt-1">
                            Created: ${todo.createdAt}
                        </p>
                    </div>
                </div>
                <div class="flex items-center space-x-2">
                    ${todo.completed ? 
                        '<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Completed</span>' : 
                        '<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Pending</span>'
                    }
                    <span class="text-xs text-gray-400">#${todo.id}</span>
                </div>
            </div>
        `;
        
        return div;
    }

    /**
     * Toggle todo completion status (updates localStorage for user-added todos)
     */
    toggleTodoComplete(todoId, completed) {
        const todoIndex = this.allTodos.findIndex(todo => todo.id === todoId);
        if (todoIndex !== -1) {
            this.allTodos[todoIndex].completed = completed;
            
            // If it's a user-added todo, update localStorage
            if (this.allTodos[todoIndex].isUserAdded) {
                const userTodos = this.loadUserTodosFromStorage();
                const userTodoIndex = userTodos.findIndex(todo => todo.id === todoId);
                if (userTodoIndex !== -1) {
                    userTodos[userTodoIndex].completed = completed;
                    this.saveUserTodosToStorage(userTodos);
                }
            }
            
            // Reapply filters to update the view
            this.applyFilters();
            
            const action = completed ? 'completed' : 'marked as pending';
            this.showSuccess(`Todo ${action} successfully!`);
        }
    }

    /**
     * Update pagination controls
     */
    updatePagination() {
        const totalTodos = this.filteredTodos.length;
        const totalPages = Math.ceil(totalTodos / this.todosPerPage);
        const startIndex = (this.currentPage - 1) * this.todosPerPage + 1;
        const endIndex = Math.min(this.currentPage * this.todosPerPage, totalTodos);
        
        // Update pagination info
        document.getElementById('showing-from').textContent = totalTodos > 0 ? startIndex : 0;
        document.getElementById('showing-to').textContent = endIndex;
        document.getElementById('total-todos').textContent = totalTodos;
        
        // Update pagination buttons
        const prevButtons = ['prev-mobile', 'prev-desktop'];
        const nextButtons = ['next-mobile', 'next-desktop'];
        
        prevButtons.forEach(id => {
            const btn = document.getElementById(id);
            btn.disabled = this.currentPage <= 1;
        });
        
        nextButtons.forEach(id => {
            const btn = document.getElementById(id);
            btn.disabled = this.currentPage >= totalPages;
        });
        
        // Update page numbers
        this.updatePageNumbers(totalPages);
    }

    /**
     * Update page numbers in pagination
     */
    updatePageNumbers(totalPages) {
        const pageNumbersContainer = document.getElementById('page-numbers');
        pageNumbersContainer.innerHTML = '';
        
        if (totalPages <= 1) return;
        
        // Calculate range of page numbers to show
        const maxPageNumbers = 5;
        let startPage = Math.max(1, this.currentPage - Math.floor(maxPageNumbers / 2));
        let endPage = Math.min(totalPages, startPage + maxPageNumbers - 1);
        
        // Adjust if we're near the end
        if (endPage - startPage < maxPageNumbers - 1) {
            startPage = Math.max(1, endPage - maxPageNumbers + 1);
        }
        
        // Add page numbers
        for (let i = startPage; i <= endPage; i++) {
            const pageButton = document.createElement('button');
            pageButton.className = `page-number px-2 ${i === this.currentPage ? 'active text-blue-600' : ''}`;
            pageButton.textContent = i;
            pageButton.addEventListener('click', () => {
                this.currentPage = i;
                this.renderTodos();
                this.updatePagination();
            });
            pageNumbersContainer.appendChild(pageButton);
        }
    }

    /**
     * Update todos count display
     */
    updateTodosCount() {
        const count = this.filteredTodos.length;
        const total = this.allTodos.length;
        let countText = '';
        
        if (this.searchTerm || this.dateFrom || this.dateTo) {
            countText = `Showing ${count} of ${total} todos`;
        } else {
            countText = `${total} todos total`;
        }
        
        document.getElementById('todos-count').textContent = countText;
    }

    /**
     * Show/hide loading state
     */
    showLoading(show) {
        const loadingContainer = document.getElementById('loading-container');
        const todosContainer = document.querySelector('.bg-white.rounded-lg.shadow-md:last-child');
        
        if (show) {
            loadingContainer.classList.remove('hidden');
            todosContainer.style.opacity = '0.5';
            this.isLoading = true;
        } else {
            loadingContainer.classList.add('hidden');
            todosContainer.style.opacity = '1';
            this.isLoading = false;
        }
    }

    /**
     * Show error message
     */
    showError(message) {
        const errorContainer = document.getElementById('error-container');
        const errorMessage = document.getElementById('error-message');
        
        errorMessage.textContent = message;
        errorContainer.classList.remove('hidden');
        errorContainer.classList.add('fade-in');
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            this.hideError();
        }, 5000);
    }

    /**
     * Hide error message
     */
    hideError() {
        const errorContainer = document.getElementById('error-container');
        errorContainer.classList.add('hidden');
        errorContainer.classList.remove('fade-in');
    }

    /**
     * Show success message
     */
    showSuccess(message) {
        const successContainer = document.getElementById('success-container');
        const successMessage = document.getElementById('success-message');
        
        successMessage.textContent = message;
        successContainer.classList.remove('hidden');
        successContainer.classList.add('fade-in');
        
        // Auto-hide after 3 seconds
        setTimeout(() => {
            this.hideSuccess();
        }, 3000);
    }

    /**
     * Hide success message
     */
    hideSuccess() {
        const successContainer = document.getElementById('success-container');
        successContainer.classList.add('hidden');
        successContainer.classList.remove('fade-in');
    }

    /**
     * Escape HTML to prevent XSS
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Global functions for event handlers
function hideError() {
    todoApp.hideError();
}

function hideSuccess() {
    todoApp.hideSuccess();
}

// Initialize the application when DOM is loaded
let todoApp;
document.addEventListener('DOMContentLoaded', () => {
    todoApp = new TodoApp();
});
