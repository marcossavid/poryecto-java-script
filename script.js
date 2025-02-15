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
    function addList(title, tasks = [], color = "##f4f4f4") { // Color predeterminado gris
        const list = document.createElement("div");
        list.classList.add("task-list");
        list.style.backgroundColor = color;  // Asigna el color de fondo (puede ser el predeterminado o uno personalizado)

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

       
       // Contenedor para el selector de color y el texto
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
        colorPickerContainer.style.backgroundImage = `url('imgs/sdr.png')`; // Coloca la ruta de tu imagen
        colorPickerContainer.style.backgroundSize = "cover";  // Asegúrate de que la imagen cubra el área
        colorPickerContainer.style.width = "30px";  // Ancho del contenedor
        colorPickerContainer.style.height = "30px"; // Alto del contenedor
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
        list.appendChild(colorContainer);  // Agregar el contenedor con el label y el selector de color
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

    // Contenedor para el texto de la tarea
    const taskTextContainer = document.createElement("div");
    taskTextContainer.classList.add("task-text");
    taskTextContainer.textContent = taskText;

    // Contenedor para el botón de eliminar
    const deleteButtonContainer = document.createElement("div");
    deleteButtonContainer.classList.add("delete-button-container");

    const deleteTaskButton = document.createElement("button");
    deleteTaskButton.textContent = "Eliminar";
    deleteTaskButton.classList.add("delete-task");
    deleteTaskButton.addEventListener("click", () => {
        taskItem.remove();
        saveLists();
    });

    deleteButtonContainer.appendChild(deleteTaskButton);

    // Añadir los contenedores dentro de la tarea
    taskItem.appendChild(taskTextContainer);
    taskItem.appendChild(deleteButtonContainer);
    taskList.appendChild(taskItem);

    saveLists();
}
     // Guardar todas las listas en localStorage
     function saveLists() {
        const listsData = Array.from(listsContainer.children).map(list => ({
            title: list.querySelector("h3").textContent,
            tasks: Array.from(list.querySelectorAll("li")).map(task => 
                task.firstChild.textContent.trim()
            ),
            color: list.style.backgroundColor  // Guardamos el color de fondo
        }));

        localStorage.setItem("lists", JSON.stringify(listsData));
    }

    // Cargar listas desde localStorage
    function loadLists() {
        const savedLists = JSON.parse(localStorage.getItem("lists")) || [];
        savedLists.forEach(list => addList(list.title, list.tasks, list.color)); // Cargamos el color también
    }
});