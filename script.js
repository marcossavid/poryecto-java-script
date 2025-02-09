document.addEventListener("DOMContentLoaded", function() {
    const taskInput = document.getElementById('task-input');
    const addTaskButton = document.getElementById('add-task');
    const taskList = document.getElementById('task-list');

  
    loadTasks();

    // Evento para agregar tarea
    addTaskButton.addEventListener('click', function() {
        const taskValue = taskInput.value.trim();
        if (taskValue) {
            addTask(taskValue);
            taskInput.value = '';
        }
    });

    function addTask(task) {
        const li = document.createElement('li');
        li.textContent = task;
        li.addEventListener('click', () => {
            li.classList.toggle('completed');
        });

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Eliminar';
        deleteButton.addEventListener('click', (e) => {
            e.stopPropagation();
            taskList.removeChild(li);
            saveTasks();
        });

        li.appendChild(deleteButton);
        taskList.appendChild(li);
        saveTasks();
    }

    // Guardar tareas en el almacenamiento local
    function saveTasks() {
        const tasks = [];
        taskList.querySelectorAll('li').forEach(li => {
            tasks.push({
                text: li.childNodes[0].textContent,
                completed: li.classList.contains('completed')
            });
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // Cargar tareas desde el almacenamiento local
    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.forEach(task => {
            const li = document.createElement('li');
            li.textContent = task.text;
            if (task.completed) {
                li.classList.add('completed');
            }

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Eliminar';
            deleteButton.addEventListener('click', (e) => {
                e.stopPropagation();
                taskList.removeChild(li);
                saveTasks();
            });

            li.appendChild(deleteButton);
            taskList.appendChild(li);
        });
    }
});