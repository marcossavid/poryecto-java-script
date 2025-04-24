document.addEventListener("DOMContentLoaded", function () {
    const listsContainer = document.getElementById("lists-container");
    const addListButton = document.getElementById("add-list");
    const listNameInput = document.getElementById("list-name-input");
    const categoryinput = document.getElementById('category-input');
    const categoriesContainer = document.getElementById('categories');
    const addCategoryButton = document.getElementById('add-category');

    loadLists();
    loadCategories();

    let contadorhecho = parseInt(localStorage.getItem("completedTasks")) || 0; // Cargar contador al inicio
    updateCompletetasks(contadorhecho);

    function updateCompletetasks(count) {
        document.getElementById("completed-tasks").textContent = count;
    }

    function updateTaskCounter(count) {
        document.getElementById("task-count").textContent = count;
    }

    function loadLists() {
        try {
            const savedLists = JSON.parse(localStorage.getItem("lists")) || [];
            let totalTasks = 0;
            let completedTasksCount = parseInt(localStorage.getItem("completedTasks")) || 0; // Cargar contador de completadas
    
            savedLists.forEach(listData => {
                const listElement = addList(listData.title, listData.color, listData.categoryId);
                totalTasks += listData.tasks.length; // Sumar la cantidad de tareas de cada lista AL CARGAR
                listData.tasks.forEach(taskData => {
                    const taskItem = addTask(listElement.querySelector(".task-items"), taskData.text, taskData.done);
                });
            });
            updateTaskCounter(totalTasks);
            updateCompletetasks(completedTasksCount);
    
        } catch (error) {
            alert("Error al cargar las listas:");
            localStorage.removeItem("lists");
            localStorage.removeItem("totalTasks"); // Limpiar también el contador total en caso de error
            localStorage.removeItem("completedTasks"); // Limpiar también el contador de completadas en caso de error
            updateTaskCounter(0);
            updateCompletetasks(0);
        }
    }

    function loadCategories() {
        try {
            const savedCategories = JSON.parse(localStorage.getItem("categories")) || [];
            savedCategories.forEach(category => addCategory(category.name));
        } catch (error) {
            console.error("Error al cargar las categorías:", error);
            localStorage.removeItem("categories");
        }
    }

    addListButton.addEventListener("click", () => {
        const listTitle = listNameInput.value.trim();
        if (listTitle) {
            addList(listTitle);
            saveLists();
            listNameInput.value = "";
            Toastify({ text: "Nueva lista agregada", duration: 3000, gravity: "bottom", position: "right", style: { background: "linear-gradient(to right,rgb(78, 184, 169),rgb(91, 61, 201))" } }).showToast();
        } else {
            alert("Por favor, ingresa un nombre para la lista.");
        }
    });

    addCategoryButton.addEventListener("click", () => {
        const categoryName = categoryinput.value.trim();
        if (categoryName) {
            addCategory(categoryName);
            saveCategories();
            categoryinput.value = "";
        } else {
            alert("Ingresa una categoria");
        }
    });

    function addList(title, color = "#f4f4f4", categoryId = null) {
        const list = document.createElement("div");
        list.className = "task-list";
        list.style.backgroundColor = color;

        const listHeader = document.createElement("div");
        listHeader.className = "list-header";

        const listTitle = document.createElement("h3");
        listTitle.textContent = title;

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "X";
        deleteButton.className = "delete-list";
        deleteButton.addEventListener("click", () => {
            list.remove();
            saveLists();
        });

        listHeader.append(listTitle, deleteButton);

        const categoryContainer = document.createElement("div");
        categoryContainer.className = "list-categoria";

        const categorySelect = document.createElement("select");
        categorySelect.className = "category-select";

        const defaultOption = document.createElement("option");
        defaultOption.textContent = "Seleccionar categoría";
        defaultOption.value = "";
        categorySelect.appendChild(defaultOption);

        function updateCategoryOptions() {
            categorySelect.innerHTML = "";
            categorySelect.appendChild(defaultOption);
            document.querySelectorAll(".category h3").forEach(category => {
                const option = document.createElement("option");
                option.textContent = category.textContent;
                option.value = category.textContent;
                categorySelect.appendChild(option);
            });
        }

        updateCategoryOptions();
        document.addEventListener("categoryAdded", updateCategoryOptions);
        document.addEventListener("categoryRemoved", updateCategoryOptions);

        categoryContainer.appendChild(categorySelect);

        const colorContainer = document.createElement("div");
        colorContainer.className = "color-container";

        const colorLabel = document.createElement("label");
        colorLabel.textContent = "Color de fondo: ";
        colorLabel.className = "color-label";

        const colorPickerContainer = document.createElement("div");
        colorPickerContainer.className = "custom-color-picker-container";
        colorPickerContainer.style.backgroundImage = `url('imgs/sdr.png')`;
        colorPickerContainer.style.backgroundSize = "cover";
        colorPickerContainer.style.width = "30px";
        colorPickerContainer.style.height = "30px";
        colorPickerContainer.style.cursor = "pointer";

        const colorPicker = document.createElement("input");
        colorPicker.type = "color";
        colorPicker.value = color;
        colorPicker.className = "color-picker";
        colorPicker.style.display = "none";

        colorPickerContainer.addEventListener("click", () => colorPicker.click());
        colorPicker.addEventListener("input", (event) => {
            list.style.backgroundColor = event.target.value;
            colorPickerContainer.style.backgroundColor = event.target.value;
            saveLists();
        });

        colorPickerContainer.appendChild(colorPicker);
        colorContainer.append(colorLabel, colorPickerContainer);

        const taskInput = document.createElement("input");
        taskInput.type = "text";
        taskInput.placeholder = "Agregar una tarea...";
        taskInput.className = "task-input";

        const addTaskButton = document.createElement("button");
        addTaskButton.textContent = "Agregar tarea";
        addTaskButton.className = "add-task";

        const taskList = document.createElement("ul");
        taskList.className = "task-items";

        addTaskButton.addEventListener("click", () => {
            const taskText = taskInput.value.trim();
            if (taskText) {
                addTask(taskList, taskText);
                taskInput.value = "";
                updateTaskCounter(parseInt(document.getElementById("task-count").textContent) + 1);
                saveLists();
            }
        });

        list.append(listHeader, categoryContainer, colorContainer, taskInput, addTaskButton, taskList);

        if (categoryId) {
            const category = document.getElementById(categoryId);
            category.querySelector(".category-lists").appendChild(list);
        } else {
            listsContainer.appendChild(list);
        }

        const message = document.createElement("p");
        message.style.color = "gray";
        message.innerText = "Puedes arrastrar y cambiar el orden de las tereas presionando sobre el texto";
        message.style.fontSize = "12px";
        list.appendChild(message);

        return list;
    }

    function addTask(taskList, taskText, done = false) {
        if (!taskText.trim()) return;

        const taskItem = document.createElement("li");
        taskItem.className = "task-item";

        const taskContainer = document.createElement("div");
        taskContainer.className = "task-container";

        const taskTextContainer = document.createElement("div");
        taskTextContainer.className = "task-text";
        taskTextContainer.textContent = taskText;
        taskTextContainer.draggable = true;
        taskTextContainer.dataset.done = done;
        if (done) {
            taskTextContainer.style.textDecoration = 'line-through';
            taskTextContainer.style.backgroundColor = 'rgb(145, 221, 157)';
            taskTextContainer.style.color = 'rgb(255, 255, 255)';
        }

        const buttonsContainer = document.createElement("div");
        buttonsContainer.className = "buttons-container";

        const deleteTaskButton = document.createElement("button");
        deleteTaskButton.className = "delete-task";
        deleteTaskButton.innerHTML = '<i class="fas fa-trash"></i>';
        deleteTaskButton.addEventListener("click", () => {
            const wasDone = taskTextContainer.dataset.done === "true";
            taskItem.remove();
            if (wasDone) {
                contadorhecho--;
                updateCompletetasks(contadorhecho);
            }
            updateTaskCounter(parseInt(document.getElementById("task-count").textContent) - 1);
            saveLists();
        });

        const hechoTaskButton = document.createElement('button');
        hechoTaskButton.className = 'hecho-task';
        hechoTaskButton.innerHTML = '<i class="fas fa-check"></i>';
        hechoTaskButton.addEventListener('click', () => {
            const isDone = taskTextContainer.dataset.done === "true";
            taskTextContainer.dataset.done = !isDone;
            taskTextContainer.style.textDecoration = isDone ? 'none' : 'line-through';
            taskTextContainer.style.backgroundColor = isDone ? '' : 'rgb(145, 221, 157)';
            taskTextContainer.style.color = isDone ? '' : 'rgb(255, 255, 255)';
            Toastify({ text: isDone ? "Tarea pendiente" : "Tarea completada", duration: 3000, gravity: "bottom", position: "right", style: { background: isDone ? "linear-gradient(to right, #ffc107, #ff9800)" : "linear-gradient(to right,rgb(22, 151, 71),#4CAF50)" } }).showToast();
            contadorhecho += isDone ? -1 : 1;
            updateCompletetasks(contadorhecho);
            saveLists();
        });

        buttonsContainer.append(deleteTaskButton, hechoTaskButton);
        taskContainer.append(taskTextContainer, buttonsContainer);
        taskItem.appendChild(taskContainer);
        taskList.appendChild(taskItem);

        taskTextContainer.addEventListener("dragstart", (e) => {
            draggedItem = taskItem;
            setTimeout(() => taskItem.classList.add("dragging"), 0);
        });

        taskTextContainer.addEventListener("dragend", () => {
            taskItem.classList.remove("dragging");
            draggedItem = null;
            saveLists();
        });

        taskList.addEventListener("dragover", (e) => {
            e.preventDefault();
            const afterElement = getDragAfterElement(taskList, e.clientY);
            taskList.insertBefore(draggedItem, afterElement);
        });

        function getDragAfterElement(container, y) {
            const draggableElements = [...container.querySelectorAll(".task-item:not(.dragging)")];
            return draggableElements.reduce((closest, child) => {
                const box = child.getBoundingClientRect();
                const offset = y - box.top - box.height / 2;
                return offset < 0 && offset > closest.offset ? { offset, element: child } : closest;
            }, { offset: Number.NEGATIVE_INFINITY }).element;
        }

        return taskItem;
    }

    function saveLists() {
        const lists = Array.from(document.querySelectorAll(".task-list")).map(list => ({
            title: list.querySelector("h3").textContent,
            color: list.style.backgroundColor,
            categoryId: list.querySelector(".category-select")?.value || null,
            tasks: Array.from(list.querySelectorAll(".task-items li")).map(li => ({
                text: li.querySelector(".task-text").textContent,
                done: li.querySelector(".task-text").dataset.done === "true"
            }))
        }));
        localStorage.setItem("lists", JSON.stringify(lists));
        const totalTasks = lists.reduce((sum, list) => sum + list.tasks.length, 0);
        const completedTasks = lists.reduce((sum, list) => sum + list.tasks.filter(task => task.done).length, 0);
        localStorage.setItem("totalTasks", totalTasks);
        localStorage.setItem("completedTasks", completedTasks);
        updateTaskCounter(totalTasks);
        updateCompletetasks(completedTasks);
    }

    function addCategory(name) {
        const category = document.createElement('div');
        category.className = 'category';
        const categoryId = `category-${Date.now()}`;
        category.id = categoryId;

        const categoryHeader = document.createElement('div');
        categoryHeader.className = 'category-header';

        const categoryTitle = document.createElement('h3');
        categoryTitle.textContent = name;

        const deleteCategoryButton = document.createElement('button');
        deleteCategoryButton.textContent = 'X';
        deleteCategoryButton.className = 'delete-category';
        deleteCategoryButton.addEventListener('click', (event) => {
            event.stopPropagation();
            category.remove();
            saveCategories();
            document.dispatchEvent(new CustomEvent('categoryRemoved'));
        });

        categoryHeader.append(categoryTitle, deleteCategoryButton);

        const categoryLists = document.createElement('div');
        categoryLists.className = 'category-lists';

        category.append(categoryHeader, categoryLists);

        category.addEventListener('click', () => {
            window.location.href = `category.html?category=${encodeURIComponent(categoryTitle.textContent)}`;
        });

        categoriesContainer.appendChild(category);
        document.dispatchEvent(new CustomEvent('categoryAdded'));
    }

    function saveCategories() {
        const categoriesData = Array.from(categoriesContainer.children).map(category => ({
            name: category.querySelector("h3").textContent
        }));
        localStorage.setItem("categories", JSON.stringify(categoriesData));
    }
});