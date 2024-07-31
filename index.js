document.addEventListener('DOMContentLoaded', event => {

    const todoInput = document.getElementById("user-input");
    const selectedPriority = document.getElementById("priority-select");
    const submitButton = document.getElementById("submit");
    const todoList = document.getElementById("todo-list");
    const filterButtonsContainer = document.getElementById("filter-buttons");
    const searchInput = document.getElementById("search-input");
    const priorities = ['all', 'low', 'medium', 'high'];

    loadTodos();
    todoInput.focus();
    

    function createFilterButtons() {
        priorities.forEach(priority => {
            const button = document.createElement('button');
            button.id = `filter-${priority}`;
            button.textContent = priority.charAt(0).toUpperCase() + priority.slice(1);
            button.addEventListener('click', event => {
                filterTodos(priority);
            });
            filterButtonsContainer.appendChild(button);
        });
    }

    function editing(event) {
        const todoItem = event.target.closest('.todo-item');
        const todoText = todoItem.querySelector('.todo-text');
        const currentText = todoText.textContent;
        function saving() {
            const newText = inputText.value.trim();
            if (newText !== "") {
                todoText.textContent = newText;
                todoItem.replaceChild(todoText, inputText);
                todoItem.removeChild(saveButton);
                updateLocalStorage();
            }
        }
        const inputText = document.createElement('input');
        inputText.type = 'text';
        inputText.value = currentText;
        inputText.className = 'edit-input';
        const saveButton = document.createElement("button");
        saveButton.className = "save-button";
        saveButton.textContent = "Save";
        saveButton.addEventListener("click", saving);
        todoItem.replaceChild(inputText, todoText);
        todoItem.appendChild(saveButton);
    }

    function removing(event) {
        const todoItem = event.target.closest('.todo-item');
        todoItem.remove();
        updateLocalStorage();
    }

    function addItemToTheList(textParameter, priorityParameter, completed = false) {
        const todoItem = document.createElement('li');
        todoItem.className = 'todo-item';

        if (completed) {
            todoItem.classList.add('completed');
        }
        const todoText = document.createElement('span');
        todoText.className = 'todo-text';
        todoText.textContent = textParameter;

        const priorityText = document.createElement('span');
        priorityText.textContent = priorityParameter;
        priorityText.className = 'priority';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = completed;

        checkbox.addEventListener('change', function () {
            todoItem.classList.toggle('completed');
            updateLocalStorage();
        });

        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.addEventListener('click', editing);

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', removing);

        const final = document.createElement('div');
        final.className = 'todo-actions';
        final.appendChild(checkbox);
        final.appendChild(editButton);
        final.appendChild(deleteButton);

        todoItem.appendChild(todoText);
        todoItem.appendChild(priorityText);
        todoItem.appendChild(final);

        todoList.appendChild(todoItem);
        updateLocalStorage();
    }

    function filterTodos(priority) {
        const todos = todoList.querySelectorAll('.todo-item');
        todos.forEach(todo => {
            const todoPriority = todo.querySelector('.priority').textContent;
            if (priority === 'all' || todoPriority === priority) {
                todo.style.display = '';
            } else {
                todo.style.display = 'none';
            }
        });
    }

    function updateLocalStorage() {
        const todos = [];
        todoList.querySelectorAll('.todo-item').forEach(todoItem => {
            const text = todoItem.querySelector('.todo-text').textContent;
            const priority = todoItem.querySelector('.priority').textContent;
            const completed = todoItem.classList.contains('completed');
            todos.push({ text, priority, completed });
        });
        localStorage.setItem('todos', JSON.stringify(todos));
    }

    function loadTodos() {
        const todos = JSON.parse(localStorage.getItem('todos')) || [];
        todos.forEach(todo => {
            addItemToTheList(todo.text, todo.priority, todo.completed);
        });
    }

    createFilterButtons();

    submitButton.onclick = event => {
        event.preventDefault();
        if (todoInput.value.trim() === "") {
            alert("You didn't enter your to-do list");
            todoInput.value = "";
            todoInput.focus();
            return null;
        }

        addItemToTheList(todoInput.value, selectedPriority.value);

        todoInput.value = "";
        todoInput.focus();
        selectedPriority.value = "low";
       
    };

    searchInput.addEventListener('input', () => {
        const searchT = searchInput.value.trim().toLowerCase();
        const todos = Array.from(todoList.querySelectorAll('.todo-item'));
        todos.forEach(todo => {
            const todoText = todo.querySelector('.todo-text').textContent.toLowerCase();
            if (todoText.includes(searchT)) {
                todo.style.display = '';
            } else {
                todo.style.display = 'none';
            }
        });

        const filteringSearch = todos.filter(todo => {
            const todoText = todo.querySelector('.todo-text').textContent.toLowerCase();
            return todoText.includes(searchT);
        });

        filteringSearch.forEach(todo => {
            todoList.appendChild(todo);
        });
    });
});
