// Función para crear una nueva LISTA-----------------------------------------------------------------

export function addList(title, tasks = [], color = "#f4f4f4", categoryId = null) { // Color predeterminado gris

    const list = document.createElement("div"); //creamos un div
    list.classList.add("task-list"); //le asignamos la clase
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


 // Nuevo div para la lista desplegable de categoría dentro de la lista
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
    const taskInput = document.createElement("input"); //TASKINPUT----
    taskInput.type = "text";
    taskInput.placeholder = "Agregar una tarea...";
    taskInput.classList.add("task-input");

    const addTaskButton = document.createElement("button"); //ADDTASKBUTTON----
    addTaskButton.textContent = "Agregar tarea";
    addTaskButton.classList.add("add-task");

    const taskList = document.createElement("ul"); //TASKLIST------
    taskList.classList.add("task-items");

    // CARGAR TAREAS PREEXISTENTES
    tasks.forEach(task => addTask(taskList, task));
    
    addTaskButton.addEventListener("click", () => { //Evento del boton agregar tarea
        if (taskInput.value.trim() !== "") {
            addTask(taskList, taskInput.value);
            taskInput.value = "";
            totalTasks++; // Incrementar el total de tareas
            updateTaskCounter(totalTasks); // Actualizar el contador de tareas en la UI
            saveLists();
        }
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

    const mensaje = document.createElement("p");
    mensaje.style.color= "gray";
    mensaje.innerText = "Puedes arrastrar y cambiar el orden de las tereas presionando sobre el texto";
    mensaje.style.fontSize = "12px";
    list.appendChild(mensaje);

    saveLists();
}

//------------------------------------------------------------------------------------------
