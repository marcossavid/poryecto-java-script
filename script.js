document.addEventListener("DOMContentLoaded", function () {
    const listsContainer = document.getElementById("lists-container");
    const addListButton = document.getElementById("add-list");
    const categoryInput = document.getElementById('category-input');
    const addCategorySubmit = document.getElementById('add-category-button');
    const categoriesContainer = document.getElementById('categories');
    const addCategoryButton = document.getElementById('add-category');
    


    
    loadLists(); // Cargar listas guardadas al iniciar
    loadCategories(); //Cargar categorias
    
    // Evento para añadir una nueva lista
    addListButton.addEventListener("click", () => {
        const listTitle = prompt("Nombre de la nueva lista:");
        if (listTitle) {
            addList(listTitle, [], "#f4f4f4"); 
            saveLists();
        }
    });

    // Evento para añadir una nueva categoría
    addCategoryButton.addEventListener("click", () => {
        const categoryName = prompt("Nombre de la nueva categoría:");
        if (categoryName) {
            addCategory(categoryName);
            saveCategories();
        }
    });

    // Función para crear una nueva LISTA-----------------------------------------------------------------

    function addList(title, tasks = [], color = "#f4f4f4", categoryId = null) { // Color predeterminado gris

        const list = document.createElement("div");
        list.classList.add("task-list");
        list.style.backgroundColor = color;  // Asigna el color de fondo (puede ser el predeterminado o uno personalizado)

        const listHeader = document.createElement("div");//div para el titulo y el delete
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


        list.appendChild(listHeader);
        listHeader.appendChild(listTitle);
        listHeader.appendChild(deleteButton);


     // Nuevo div para la lista desplegable de categoría
        const categoryContainer = document.createElement("div");
        categoryContainer.classList.add("list-categoria");

        const categorySelect = document.createElement("select");
        categorySelect.classList.add("category-select");

        const defaultOption = document.createElement("option");
        defaultOption.textContent = "Seleccionar categoría";
        defaultOption.value = "";
        categorySelect.appendChild(defaultOption);

        // Agregar opciones de categorías dinámicamente
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
        list.appendChild(categoryContainer);
       

       

        // Contenedor para el SELECTOR DE COLOR y el texto
        const colorContainer = document.createElement("div");
        colorContainer.classList.add("color-container");

        // Texto "Color de fondo"
        const colorLabel = document.createElement("label");
        colorLabel.textContent = "Color de fondo: ";
        colorLabel.classList.add("color-label");

        // Crear un contenedor que tenga una imagen
        const colorPickerContainer = document.createElement("div");
        colorPickerContainer.classList.add("custom-color-picker-container");

        // Crear el input tipo color pero ocultarlo
        const colorPicker = document.createElement("input");
        colorPicker.type = "color";
        colorPicker.value = color;  // Valor inicial del color
        colorPicker.classList.add("color-picker");
        colorPicker.style.display = "none";  // Ocultar el input de tipo color

        // Establecer un fondo de imagen en el contenedor para que se vea como un selector
        colorPickerContainer.style.backgroundImage = `url('imgs/sdr.png')`; 
        colorPickerContainer.style.backgroundSize = "cover";  // Asegurar de que la imagen cubra el área
        colorPickerContainer.style.width = "30px";  
        colorPickerContainer.style.height = "30px"; 
        colorPickerContainer.style.cursor = "pointer"; // Establecer que el contenedor sea clickeable

        // Agregar el evento para mostrar el input tipo color cuando se hace clic en el contenedor
        colorPickerContainer.addEventListener("click", () => {
            colorPicker.click();  // Esto abrirá el selector de color
        });

        // Cuando el usuario selecciona un color, actualizar el fondo de la lista y el color del contenedor
        colorPicker.addEventListener("input", (event) => {
            list.style.backgroundColor = event.target.value; // Cambiar el fondo al color elegido
            colorPickerContainer.style.backgroundColor = event.target.value; // Cambiar el color de fondo del contenedor
            saveLists();  // Guardar el nuevo estado
        });

        // Agregar el input (el selector de color) dentro del colorPickerContainer
        colorPickerContainer.appendChild(colorPicker);

        // Ahora agregar el contenedor de colorPickerContainer con el label en colorContainer
        colorContainer.appendChild(colorLabel);
        colorContainer.appendChild(colorPickerContainer);  // Usamos colorPickerContainer que ahora tiene el input

        // Contenedor de TEXTO DE LA TAREA
        const taskInput = document.createElement("input");
        taskInput.type = "text";
        taskInput.placeholder = "Agregar una tarea...";
        taskInput.classList.add("task-input");

        const addTaskButton = document.createElement("button");
        addTaskButton.textContent = "Agregar tarea";
        addTaskButton.classList.add("add-task");

        const taskList = document.createElement("ul");
        taskList.classList.add("task-items");

        // CARGAR TAREAS PREEXISTENTES
        tasks.forEach(task => addTask(taskList, task));

        addTaskButton.addEventListener("click", () => {
            addTask(taskList, taskInput.value);
            taskInput.value = "";
            saveLists();
        });

        list.appendChild(listHeader);
        list.appendChild(colorContainer);  // Agregar el contenedor con el label y el selector de color
        list.appendChild(taskInput);
        list.appendChild(addTaskButton);
        list.appendChild(taskList);

        // Si hay una categoría seleccionada, asignar la lista a esa categoría
        if (categoryId) {
            const category = document.getElementById(categoryId);
            category.querySelector(".category-lists").appendChild(list);
        } else {
            listsContainer.appendChild(list); // Si no hay categoría, agregarla al contenedor principal
        }

        saveLists();
    }






    
// Función para crear una nueva TAREA----------------------------------------------------
function addTask(taskList, taskText) {
    // Asegurarse de que taskText sea una cadena de texto antes de usar .trim()
    if (typeof taskText === 'string' && taskText.trim() === "") return;

    // Crear un nuevo elemento de tarea
    const taskItem = document.createElement("li");
    taskItem.classList.add("task-item");

    // Contenedor para la tarea que contendrá tanto el texto como los botones
    const taskContainer = document.createElement("div");
    taskContainer.classList.add("task-container");

    // Contenedor para el texto de la tarea
    const taskTextContainer = document.createElement("div");
    taskTextContainer.classList.add("task-text");
    taskTextContainer.textContent = taskText;
    taskTextContainer.setAttribute("draggable", "true");  // El texto será draggable

    // Contenedor para los botones (Eliminar y Hecho)
    const buttonsContainer = document.createElement("div");
    buttonsContainer.classList.add("buttons-container");

    // Botón de eliminar
    const deleteTaskButton = document.createElement("button");
    deleteTaskButton.textContent = "Eliminar";
    deleteTaskButton.classList.add("delete-task");
    deleteTaskButton.addEventListener("click", () => {
        taskItem.remove();
        saveLists();
    });

    // Botón de hecho
    const hechoTaskButton = document.createElement('button');
    hechoTaskButton.textContent = 'Hecho';
    hechoTaskButton.classList.add('hecho-task');

    // Estado inicial de la tarea
    taskTextContainer.dataset.done = "false"; //dataset representa le estado del item

    hechoTaskButton.addEventListener('click', () => {
        if (taskTextContainer.dataset.done === "false") {
            taskTextContainer.style.textDecoration = 'line-through'; // Tacha el texto
            taskTextContainer.style.color = '#a0a0a0'; // Cambia el color del texto
            taskTextContainer.dataset.done = "true"; // Cambia el estado
        } else {
            taskTextContainer.style.textDecoration = 'none'; // Restaura el texto
            taskTextContainer.style.color = ''; // Vuelve al color original
            taskTextContainer.dataset.done = "false"; // Cambia el estado
        }
        
        saveLists();
    });


    // Agregar los botones al contenedor de botones
    buttonsContainer.appendChild(deleteTaskButton);
    buttonsContainer.appendChild(hechoTaskButton);

    // Agregar el texto de la tarea y los botones al contenedor principal
    taskContainer.appendChild(taskTextContainer);
    taskContainer.appendChild(buttonsContainer);  // Los botones se mantienen estáticos

    // Agregar el contenedor de tarea al taskItem
    taskItem.appendChild(taskContainer);
    taskList.appendChild(taskItem);

    // Eventos de Drag and Drop solo para el texto
    taskTextContainer.addEventListener("dragstart", (e) => {
        draggedItem = taskItem;
        setTimeout(() => taskItem.classList.add("dragging"), 0);
    });

    taskTextContainer.addEventListener("dragend", () => {
        taskItem.classList.remove("dragging");
        draggedItem = null;
        saveLists();
    });

    // Permite el arrastre sobre la lista
    taskList.addEventListener("dragover", (e) => {
        e.preventDefault(); // Permite soltar elementos aquí
        const afterElement = getDragAfterElement(taskList, e.clientY);
        if (afterElement == null) {
            taskList.appendChild(draggedItem);
        } else {
            taskList.insertBefore(draggedItem, afterElement);
        }
    });

    function getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll(".task-item:not(.dragging)")];
        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            return offset < 0 && offset > closest.offset ? { offset, element: child } : closest;
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }

    saveLists();
}

    





 // Función para crear una nueva CATEGORIA------------------------------------------------------------
    function addCategory(name) {
        const category = document.createElement('div');
        category.classList.add('category');
        const categoryId = `category-${Date.now()}`;
        category.setAttribute('id', categoryId);

        // Contenedor para el título y el botón
        const categoryHeader = document.createElement('div');
        categoryHeader.classList.add('category-header'); // Puedes agregar estilos en CSS

        const categoryTitle = document.createElement('h3');
        categoryTitle.textContent = name;

        // Crear el botón de eliminar categoría dentro de la cabecera
        const deleteCategoryButton = document.createElement('button');
        deleteCategoryButton.textContent = 'X';
        deleteCategoryButton.classList.add('delete-category');
        deleteCategoryButton.addEventListener('click', (event) => {
            event.stopPropagation();  // Evitar que se active el evento de mostrar las listas al hacer clic
            category.remove();
            saveCategories();
        });

        // Agregar el título y el botón al contenedor de cabecera
        categoryHeader.appendChild(categoryTitle);
        categoryHeader.appendChild(deleteCategoryButton);

        // Agregar la cabecera a la categoría
        category.appendChild(categoryHeader);

        // Contenedor de listas dentro de la categoría
        const categoryLists = document.createElement('div');
        categoryLists.classList.add('category-lists');
        category.appendChild(categoryLists);

        // Evento para mostrar las listas de la categoría y redirigir a la página correspondiente
        category.addEventListener('click', () => {
            const categoryName = categoryTitle.textContent;
            // Redirigir a la página de la categoría
            window.location.href = `category.html?category=${encodeURIComponent(categoryName)}`;
        });

        categoriesContainer.appendChild(category);
    }







    // Guardar todas las listas en localStorage----------------------------------------------------------
    function saveLists() {
        const listsData = Array.from(listsContainer.children).map(list => ({
            title: list.querySelector("h3").textContent,
            tasks: Array.from(list.querySelectorAll(".task-item")).map(task => {
                const taskText = task.querySelector(".task-text").textContent.trim();
                return taskText;  // Solo guardamos el texto de la tarea
            }),
            color: list.style.backgroundColor,
            categoryId: list.closest(".category")?.id || null  // Guardamos el id de la categoría si existe
        }));

        localStorage.setItem("lists", JSON.stringify(listsData));
    }

    // Cargar listas desde localStorage
    function loadLists() {
        try {
            const savedLists = JSON.parse(localStorage.getItem("lists")) || [];
            savedLists.forEach(list => {
                addList(list.title, list.tasks, list.color, list.categoryId);
            });
        } catch (error) {
            console.error("Error al cargar las listas:", error);
            localStorage.removeItem("lists");  //  Borrar el JSON corrupto
        }
    }
    // Guardar todas las categorías en localStorage
    function saveCategories() {
        const categoriesData = Array.from(categoriesContainer.children).map(category => ({
            name: category.querySelector("h3").textContent
        }));

        localStorage.setItem("categories", JSON.stringify(categoriesData));
    }

    // Cargar categorías desde localStorage
    function loadCategories() {
        try {
            const savedCategories = JSON.parse(localStorage.getItem("categories")) || [];
            savedCategories.forEach(category => addCategory(category.name));
        } catch (error) {
            console.error("Error al cargar las categorías:", error);
            localStorage.removeItem("categories");  // Elimina los datos corruptos
        }
    }
});
