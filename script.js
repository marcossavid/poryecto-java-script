document.addEventListener("DOMContentLoaded", function () {
    const listsContainer = document.getElementById("lists-container");
    const addListButton = document.getElementById("add-list");

    loadLists(); // Cargar listas guardadas al iniciar

    // Evento para añadir una nueva lista
    addListButton.addEventListener("click", () => {
        const listTitle = prompt("Nombre de la nueva lista:");
        if (listTitle) {
            addList(listTitle);
            saveLists();
        }
    });

    // Función para crear una nueva lista
    function addList(title, tasks = []) {
        const list = document.createElement("div");
        list.classList.add("task-list");

        const listHeader = document.createElement("div");
        listHeader.classList.add("list-header");

        const listTitle = document.createElement("h3");
        listTitle.textContent = title;

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "X";
        deleteButton.classList.add("delete-list");
        deleteButton.addEventListener("click", () => {
            list.remove();
            saveLists();
        });

        listHeader.appendChild(listTitle);
        listHeader.appendChild(deleteButton);

        const taskInput = document.createElement("input");
        taskInput.type = "text";
        taskInput.placeholder = "Agregar una tarea...";
        taskInput.classList.add("task-input");

        const addTaskButton = document.createElement("button");
        addTaskButton.textContent = "Agregar";
        addTaskButton.classList.add("add-task");

        const taskList = document.createElement("ul");
        taskList.classList.add("task-items");

        // Cargar tareas preexistentes si hay
        tasks.forEach(task => addTask(taskList, task));

        addTaskButton.addEventListener("click", () => {
            addTask(taskList, taskInput.value);
            taskInput.value = "";
            saveLists();
        });

        list.appendChild(listHeader);
        list.appendChild(taskInput);
        list.appendChild(addTaskButton);
        list.appendChild(taskList);
        listsContainer.appendChild(list);

        saveLists();
    }

    // Función para añadir una nueva tarea
    function addTask(taskList, taskText) {
        if (taskText.trim() === "") return;

        const taskItem = document.createElement("li");
        taskItem.textContent = taskText;

        const deleteTaskButton = document.createElement("button");
        deleteTaskButton.textContent = "Eliminar";
        deleteTaskButton.classList.add("delete-task");
        deleteTaskButton.addEventListener("click", () => {
            taskItem.remove();
            saveLists();
        });

        taskItem.appendChild(deleteTaskButton);
        taskList.appendChild(taskItem);
        saveLists();
    }

    // Guardar todas las listas en localStorage
    function saveLists() {
        const listsData = Array.from(listsContainer.children).map(list => ({
            title: list.querySelector("h3").textContent,
            tasks: Array.from(list.querySelectorAll("li")).map(task => 
                task.firstChild.textContent.trim()
            )
        }));

        localStorage.setItem("lists", JSON.stringify(listsData));
    }

    // Cargar listas desde localStorage
    function loadLists() {
        const savedLists = JSON.parse(localStorage.getItem("lists")) || [];
        savedLists.forEach(list => addList(list.title, list.tasks));
    }
});
