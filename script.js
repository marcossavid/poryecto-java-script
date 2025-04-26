document.addEventListener("DOMContentLoaded", function () {
    // Espera a que el DOM (Document Object Model) esté completamente cargado antes de ejecutar el código.

    // Obtiene referencias a elementos HTML por su ID.
    const listsContainer = document.getElementById("lists-container"); // Contenedor principal de las listas de tareas.
    const addListButton = document.getElementById("add-list"); // Botón para agregar una nueva lista.
    const listNameInput = document.getElementById("list-name-input"); // Campo de entrada para el nombre de la nueva lista.
    const categoryinput = document.getElementById('category-input'); // Campo de entrada para el nombre de la nueva categoría.
    const categoriesContainer = document.getElementById('categories'); // Contenedor para las categorías de las listas.
    const addCategoryButton = document.getElementById('add-category'); // Botón para agregar una nueva categoría.
    const detailsPanel = document.getElementById('task-details-panel'); // Panel lateral para mostrar los detalles de una tarea.
    const detailsContent = document.getElementById('task-details-content'); // Contenido dentro del panel de detalles de la tarea.

    // Carga las listas y categorías guardadas al cargar la página.
    loadLists(); // Función para cargar las listas desde el almacenamiento local.
    loadCategories(); // Función para cargar las categorías desde el almacenamiento local.

    // Inicializa y actualiza los contadores de tareas completadas, totales y pendientes.
    let contadorhecho = parseInt(localStorage.getItem("completedTasks")) || 0; // Obtiene el número de tareas completadas del almacenamiento local o establece 0 si no existe.
    updateCompletetasks(contadorhecho); // Actualiza la visualización del número de tareas completadas.
    updateTaskCounter(parseInt(localStorage.getItem("totalTasks")) || 0); // Obtiene el número total de tareas del almacenamiento local o establece 0 si no existe y actualiza su visualización.
    updatePendingTasks(parseInt(localStorage.getItem("totalTasks")) || 0, contadorhecho); // Calcula y actualiza la visualización del número de tareas pendientes.

    // Función para actualizar la visualización del número de tareas completadas.
    function updateCompletetasks(count) {
        document.getElementById("completed-tasks").textContent = count; // Establece el texto del elemento con el ID "completed-tasks" al valor de 'count'.
    }

    // Función para actualizar la visualización del contador total de tareas.
    function updateTaskCounter(count) {
        document.getElementById("task-count").textContent = count; // Establece el texto del elemento con el ID "task-count" al valor de 'count'.
    }

    // Función para actualizar la visualización del número de tareas pendientes.
    function updatePendingTasks(total, completed) {
        const pendingCount = total - completed; // Calcula el número de tareas pendientes restando las completadas del total.
        document.getElementById("pending-tasks").textContent = pendingCount >= 0 ? pendingCount : 0; // Establece el texto del elemento con el ID "pending-tasks" al valor de 'pendingCount', asegurándose de que no sea negativo.
    }

    // Función para cargar las listas de tareas desde el almacenamiento local.
    function loadLists() {
        try {
            const savedListsString = localStorage.getItem("lists"); // Obtiene la cadena JSON de las listas guardadas del almacenamiento local.
            if (savedListsString) { // Verifica si existen listas guardadas.
                let parsedLists;
                try {
                    parsedLists = JSON.parse(savedListsString); // Intenta parsear la cadena JSON a un array de objetos de lista.
                } catch (parseError) { // Captura cualquier error que ocurra al parsear el JSON (por ejemplo, si está corrupto).
                    console.error("Error al parsear las listas desde localStorage:", parseError); // Muestra un error en la consola.
                    alert("Error al cargar las listas. Los datos guardados podrían estar corruptos. Se intentará cargar las listas que sean válidas."); // Muestra una alerta al usuario.
                    parsedLists = []; // Inicializa parsedLists como un array vacío para evitar errores posteriores.
                }

                let totalTasks = 0; // Inicializa el contador total de tareas.
                let completedTasksCount = parseInt(localStorage.getItem("completedTasks")) || 0; // Obtiene el contador de tareas completadas del almacenamiento local.

                if (Array.isArray(parsedLists)) { // Verifica si parsedLists es un array.
                    parsedLists.forEach(listData => { // Itera sobre cada objeto de lista en el array parsedLists.
                        const listElement = addList(listData.title, listData.color, listData.categoryId); // Llama a la función addList para crear el elemento HTML de la lista con los datos cargados.
                        if (listData.tasks && Array.isArray(listData.tasks)) { // Verifica si la lista tiene tareas y si es un array.
                            totalTasks += listData.tasks.length; // Suma el número de tareas de esta lista al contador total.
                            listData.tasks.forEach(taskData => { // Itera sobre cada objeto de tarea en el array de tareas de la lista.
                                addTaskToList( // Llama a la función addTaskToList para crear y agregar el elemento HTML de la tarea a la lista.
                                    listElement.querySelector(".task-items"), // Obtiene el contenedor de las tareas de la lista actual.
                                    taskData.text, // Texto de la tarea.
                                    taskData.done, // Estado de completado de la tarea.
                                    taskData.createdAt, // Fecha de creación de la tarea.
                                    taskData.deadline, // Plazo de realización de la tarea.
                                    taskData.assignedTo, // Persona asignada a la tarea.
                                    listData.categoryId // ID de la categoría a la que pertenece la tarea (heredado de la lista).
                                );
                                if (taskData.done) { // Si la tarea está marcada como completada.
                                    completedTasksCount++; // Incrementa el contador de tareas completadas.
                                }
                            });
                        }
                    });
                }

                updateTaskCounter(totalTasks); // Actualiza la visualización del contador total de tareas.
                updateCompletetasks(completedTasksCount); // Actualiza la visualización del contador de tareas completadas.
                updatePendingTasks(totalTasks, completedTasksCount); // Actualiza la visualización del contador de tareas pendientes.
            } else { // Si no hay listas guardadas en el almacenamiento local.
                updateTaskCounter(0); // Establece el contador total de tareas a 0.
                updateCompletetasks(0); // Establece el contador de tareas completadas a 0.
                updatePendingTasks(0, 0); // Establece el contador de tareas pendientes a 0.
            }
        } catch (error) { // Captura cualquier error general que ocurra durante la carga de las listas.
            console.error("Error general al cargar las listas:", error); // Muestra un error en la consola.
            alert("Error inesperado al cargar las listas."); // Muestra una alerta al usuario.
            updateTaskCounter(0); // Establece el contador total de tareas a 0.
            updateCompletetasks(0); // Establece el contador de tareas completadas a 0.
            updatePendingTasks(0, 0); // Establece el contador de tareas pendientes a 0.
        }
    }

    // Función para cargar las categorías desde el almacenamiento local.
    function loadCategories() {
        try {
            const savedCategories = JSON.parse(localStorage.getItem("categories")) || []; // Obtiene las categorías guardadas del almacenamiento local o un array vacío si no existen.
            savedCategories.forEach(category => addCategory(category.name)); // Itera sobre cada categoría guardada y llama a addCategory para crear su elemento HTML.
        } catch (error) { // Captura cualquier error al cargar las categorías.
            console.error("Error al cargar las categorías:", error); // Muestra un error en la consola.
            localStorage.removeItem("categories"); // Si hay un error al parsear, elimina las categorías del almacenamiento local para evitar futuros errores.
        }
    }

    // Evento listener para el botón "Agregar lista".
    addListButton.addEventListener("click", () => {
        const listTitle = listNameInput.value.trim(); // Obtiene el valor del campo de entrada del nombre de la lista y elimina los espacios en blanco al principio y al final.
        if (listTitle) { // Verifica si el título de la lista no está vacío.
            addList(listTitle); // Llama a la función addList para crear y agregar la nueva lista al DOM.
            saveLists(); // Guarda las listas actualizadas en el almacenamiento local.
            listNameInput.value = ""; // Limpia el campo de entrada del nombre de la lista.
            Toastify({ // Muestra una notificación usando la librería Toastify (asumiendo que está incluida).
                text: "Nueva lista agregada", // Texto de la notificación.
                duration: 3000, // Duración en milisegundos que se mostrará la notificación.
                gravity: "bottom", // Posición vertical de la notificación.
                position: "right", // Posición horizontal de la notificación.
                style: { // Estilos CSS personalizados para la notificación.
                    background: "linear-gradient(to right,rgb(78, 184, 169),rgb(91, 61, 201))" // Fondo con un degradado lineal.
                }
            }).showToast(); // Muestra la notificación.
        } else { // Si el campo de entrada del nombre de la lista está vacío.
            alert("Por favor, ingresa un nombre para la lista."); // Muestra una alerta pidiendo al usuario que ingrese un nombre.
        }
    });

    // Evento listener para el botón "Agregar categoría".
    addCategoryButton.addEventListener("click", () => {
        const categoryName = categoryinput.value.trim(); // Obtiene el valor del campo de entrada del nombre de la categoría y elimina los espacios en blanco.
        if (categoryName) { // Verifica si el nombre de la categoría no está vacío.
            addCategory(categoryName); // Llama a la función addCategory para crear y agregar la nueva categoría al DOM.
            saveCategories(); // Guarda las categorías actualizadas en el almacenamiento local.
            categoryinput.value = ""; // Limpia el campo de entrada del nombre de la categoría.
        } else { // Si el campo de entrada del nombre de la categoría está vacío.
            alert("Ingresa una categoria"); // Muestra una alerta pidiendo al usuario que ingrese un nombre para la categoría.
        }
    });

    // Función para crear un nuevo elemento de lista de tareas en el DOM.
    function addList(title, color = "#f4f4f4", categoryId = null) {
        const list = document.createElement("div"); // Crea un nuevo elemento div.
        list.className = "task-list"; // Le asigna la clase CSS "task-list".
        list.style.backgroundColor = color; // Establece el color de fondo de la lista.

        const listHeader = document.createElement("div"); // Crea un nuevo elemento div para el encabezado de la lista.
        listHeader.className = "list-header"; // Le asigna la clase CSS "list-header".

        const listTitleElement = document.createElement("h3"); // Crea un nuevo elemento h3 para el título de la lista.
        listTitleElement.textContent = title; // Establece el texto del título de la lista.

        const deleteButton = document.createElement("button"); // Crea un nuevo elemento button para eliminar la lista.
        deleteButton.textContent = "X"; // Establece el texto del botón de eliminar.
        deleteButton.className = "delete-list"; // Le asigna la clase CSS "delete-list".
        deleteButton.addEventListener("click", () => { // Agrega un evento listener para cuando se hace clic en el botón de eliminar.
            list.remove(); // Elimina el elemento de la lista del DOM.
            saveLists(); // Guarda las listas actualizadas en el almacenamiento local.
        });

        listHeader.append(listTitleElement, deleteButton); // Agrega el título y el botón de eliminar al encabezado de la lista.

        const categoryContainer = document.createElement("div"); // Crea un contenedor para el selector de categoría.
        categoryContainer.className = "list-categoria"; // Asigna la clase CSS.

        const categorySelect = document.createElement("select"); // Crea un elemento select (menú desplegable) para la categoría.
        categorySelect.className = "category-select"; // Asigna la clase CSS.

        const defaultOption = document.createElement("option"); // Crea la opción por defecto del selector.
        defaultOption.textContent = "Seleccionar categoría"; // Texto de la opción por defecto.
        defaultOption.value = ""; // Valor de la opción por defecto (vacío).
        categorySelect.appendChild(defaultOption); // Agrega la opción por defecto al selector.

        // Función para actualizar las opciones del selector de categorías basándose en las categorías existentes.
        function updateCategoryOptions() {
            categorySelect.innerHTML = ""; // Limpia las opciones existentes del selector.
            categorySelect.appendChild(defaultOption); // Vuelve a agregar la opción por defecto.
            document.querySelectorAll(".category h3").forEach(category => { // Selecciona todos los elementos h3 dentro de elementos con la clase "category".
                const option = document.createElement("option"); // Crea una nueva opción para cada categoría.
                option.textContent = category.textContent; // Establece el texto de la opción al nombre de la categoría.
                option.value = category.textContent; // Establece el valor de la opción al nombre de la categoría.
                categorySelect.appendChild(option); // Agrega la opción al selector.
            });
        }

        updateCategoryOptions(); // Llama a la función para cargar las opciones iniciales de categoría.
        document.addEventListener("categoryAdded", updateCategoryOptions); // Escucha el evento "categoryAdded" para actualizar las opciones cuando se agrega una nueva categoría.
        document.addEventListener("categoryRemoved", updateCategoryOptions); // Escucha el evento "categoryRemoved" para actualizar las opciones cuando se elimina una categoría.

        categoryContainer.appendChild(categorySelect); // Agrega el selector de categorías al contenedor de la categoría de la lista.

        const colorContainer = document.createElement("div"); // Crea un contenedor para el selector de color.
        colorContainer.className = "color-container"; // Asigna la clase CSS.

        const colorLabel = document.createElement("label"); // Crea una etiqueta para el selector de color.
        colorLabel.textContent = "Color de fondo: "; // Establece el texto de la etiqueta.
        colorLabel.className = "color-label"; // Asigna la clase CSS.

        const colorPickerContainer = document.createElement("div"); // Crea un contenedor visual para el selector de color.
        colorPickerContainer.className = "custom-color-picker-container"; // Asigna la clase CSS.
        colorPickerContainer.style.backgroundImage = `url('imgs/sdr.png')`; // Establece una imagen de fondo para el contenedor (asumiendo que 'imgs/sdr.png' existe).
        colorPickerContainer.style.backgroundSize = "cover"; // Asegura que la imagen cubra todo el contenedor.
        colorPickerContainer.style.width = "30px"; // Establece el ancho del contenedor.
        colorPickerContainer.style.height = "30px"; // Establece la altura del contenedor.
        colorPickerContainer.style.cursor = "pointer"; // Cambia el cursor a un puntero para indicar que es interactivo.

        const colorPicker = document.createElement("input"); // Crea un elemento input de tipo "color" (selector de color nativo).
        colorPicker.type = "color"; // Establece el tipo de input a "color".
        colorPicker.value = color; // Establece el valor inicial del selector de color.
        colorPicker.className = "color-picker"; // Asigna la clase CSS.
        colorPicker.style.display = "none"; // Oculta el selector de color nativo.

        colorPickerContainer.addEventListener("click", () => colorPicker.click()); // Simula un clic en el selector de color nativo cuando se hace clic en el contenedor visual.
        colorPicker.addEventListener("input", (event) => { // Agrega un evento listener para cuando cambia el valor del selector de color.
            list.style.backgroundColor = event.target.value; // Cambia el color de fondo de la lista al nuevo color seleccionado.
            colorPickerContainer.style.backgroundColor = event.target.value; // Actualiza el color de fondo del contenedor visual del selector de color.
            saveLists(); // Guarda las listas actualizadas en el almacenamiento local.
        });

        colorPickerContainer.appendChild(colorPicker); // Agrega el selector de color nativo (oculto) al contenedor visual.
        colorContainer.append(colorLabel, colorPickerContainer); // Agrega la etiqueta y el contenedor visual del selector de color al contenedor de color.

        const taskInput = document.createElement("input"); // Crea un campo de entrada para agregar nuevas tareas.
        taskInput.type = "text"; // Establece el tipo de input a "text".
        taskInput.placeholder = "Agregar una tarea..."; // Establece el texto de marcador de posición.
        taskInput.className = "task-input"; // Asigna la clase CSS.

        const addTaskButton = document.createElement("button"); // Crea un botón para agregar una nueva tarea.
        addTaskButton.textContent = "Agregar tarea"; // Establece el texto del botón.
        addTaskButton.className = "add-task"; // Asigna la clase CSS.

        const taskList = document.createElement("ul"); // Crea una lista desordenada (ul) para las tareas.
        taskList.className = "task-items"; // Asigna la clase CSS.

        addTaskButton.addEventListener("click", () => { // Agrega un evento listener para cuando se hace clic en el botón "Agregar tarea".
            const taskText = taskInput.value.trim(); // Obtiene el texto de la tarea del campo de entrada y elimina los espacios en blanco.
            if (taskText) { // Verifica si el texto de la tarea no está vacío.
                const now = new Date().toLocaleString(); // Obtiene la fecha y hora actual en formato local.
                addTaskToList( // Llama a la función addTaskToList para crear y agregar la nueva tarea a la lista.
                    taskList, // El elemento ul donde se agregarán los elementos de la tarea.
                    taskText, // El texto de la nueva tarea.
                    false, // Inicialmente la tarea no está completada.
                    now, // Guarda la fecha y hora de creación.
                    null, // Plazo de realización inicializado a null.
                    null, // Asignado a inicializado a null.
                    categoryId // Pasa el ID de la categoría de la lista a la tarea.
                );
                taskInput.value = ""; // Limpia el campo de entrada de la tarea.
                updateTaskCounter(parseInt(document.getElementById("task-count").textContent) + 1); // Incrementa el contador total de tareas y actualiza su visualización.
                updatePendingTasks(parseInt(document.getElementById("task-count").textContent), parseInt(document.getElementById("completed-tasks").textContent)); // Actualiza el contador de tareas pendientes.
                saveLists(); // Guarda las listas actualizadas en el almacenamiento local.
            }
        });

        list.append(listHeader, categoryContainer, colorContainer, taskInput, addTaskButton, taskList); // Agrega el encabezado, el selector de categoría, el selector de color, el campo de entrada de la tarea, el botón de agregar tarea y la lista de tareas al elemento de la lista principal.

        if (categoryId) { // Si se proporciona un ID de categoría para la lista.
            const category = document.getElementById(categoryId); // Obtiene el elemento de la categoría por su ID.
            category.querySelector(".category-lists").appendChild(list); // Agrega la lista al contenedor de listas dentro de la categoría.
        } else { // Si no se proporciona un ID de categoría.
            listsContainer.appendChild(list); // Agrega la lista al contenedor principal de listas.
        }

        const message = document.createElement("p"); // Crea un nuevo elemento párrafo para un mensaje.
        message.style.color = "gray"; // Establece el color del texto del mensaje a gris.
        message.innerText = "Puedes arrastrar y cambiar el orden de las tereas presionando sobre el texto"; // Establece el texto del mensaje.
        message.style.fontSize = "12px"; // Establece el tamaño de la fuente del mensaje.
        list.appendChild(message); // Agrega el mensaje al elemento de la lista.

        return list; // Devuelve el elemento de la lista creado.
    }

    // Función para agregar un nuevo elemento de tarea a una lista específica en el DOM.
    function addTaskToList(taskList, taskText, done = false, createdAt = null, deadline = null, assignedTo = null, categoryId = null) {
        if (!taskText.trim()) return; // Si el texto de la tarea está vacío después de eliminar espacios, no hace nada.

        const taskItem = document.createElement("li"); // Crea un nuevo elemento de lista (li) para la tarea.
        taskItem.className = "task-item"; // Le asigna la clase CSS "task-item".

        const taskContainer = document.createElement("div"); // Crea un contenedor para el texto y los botones de la tarea.
        taskContainer.className = "task-container"; // Asigna la clase CSS.

        const taskTextContainer = document.createElement("div"); // Crea un div para contener el texto de la tarea.
        taskTextContainer.className = "task-text"; // Asigna la clase CSS.
        taskTextContainer.textContent = taskText; // Establece el texto de la tarea.
        taskTextContainer.draggable = true; // Permite que el elemento sea arrastrable.
        taskTextContainer.dataset.done = done; // Almacena el estado de completado como un atributo de datos.
        taskTextContainer.dataset.createdAt = createdAt; // Almacena la fecha de creación como un atributo de datos.
        taskTextContainer.dataset.deadline = deadline; // Almacena el plazo de realización como un atributo de datos.
        taskTextContainer.dataset.assignedTo = assignedTo; // Almacena la persona asignada como un atributo de datos.
        taskTextContainer.dataset.categoryId = categoryId; // Almacena el ID de la categoría como un atributo de datos.
        if (done) { // Si la tarea está marcada como completada.
            taskTextContainer.style.textDecoration = 'line-through'; // Aplica un tachado al texto.
            taskTextContainer.style.backgroundColor = 'rgb(145, 221, 157)'; // Establece un color de fondo verde claro.
            taskTextContainer.style.color = 'rgb(255, 255, 255)'; // Establece el color del texto a blanco.
        }

        const buttonsContainer = document.createElement("div"); // Crea un contenedor para los botones de acción de la tarea.
        buttonsContainer.className = "buttons-container"; // Asigna la clase CSS.

        const deleteTaskButton = document.createElement("button"); // Crea un botón para eliminar la tarea.
        deleteTaskButton.className = "delete-task"; // Asigna la clase CSS.
        deleteTaskButton.innerHTML = '<i class="fas fa-trash"></i>'; // Establece el contenido del botón con un icono de la librería Font Awesome (asumiendo que está incluida).
        deleteTaskButton.addEventListener("click", () => { // Agrega un evento listener para cuando se hace clic en el botón de eliminar tarea.
            const wasDone = taskTextContainer.dataset.done === "true"; // Verifica si la tarea estaba completada antes de eliminarla.
            taskItem.remove(); // Elimina el elemento de la tarea del DOM.
            const currentTotal = parseInt(document.getElementById("task-count").textContent) - 1; // Decrementa el contador total de tareas.
            const currentCompleted = parseInt(document.getElementById("completed-tasks").textContent) - (wasDone ? 1 : 0); // Decrementa el contador de tareas completadas si la tarea eliminada estaba completada.
            updateTaskCounter(currentTotal); // Actualiza la visualización del contador total.
            updateCompletetasks(currentCompleted); // Actualiza la visualización del contador de completadas.
            updatePendingTasks(currentTotal, currentCompleted); // Actualiza la visualización del contador de pendientes.
            saveLists(); // Guarda las listas actualizadas en el almacenamiento local.
        });

        const hechoTaskButton = document.createElement('button'); // Crea un botón para marcar la tarea como hecha/no hecha.
        hechoTaskButton.className = 'hecho-task'; // Asigna la clase CSS.
        hechoTaskButton.innerHTML = '<i class="fas fa-check"></i>'; // Establece el contenido del botón con un icono de Font Awesome.
        hechoTaskButton.addEventListener('click', () => { // Agrega un evento listener para cuando se hace clic en el botón de hecho.
            const isDone = taskTextContainer.dataset.done === "true"; // Obtiene el estado actual de completado de la tarea.
            taskTextContainer.dataset.done = !isDone; // Invierte el estado de completado.
            taskTextContainer.style.textDecoration = isDone ? 'none' : 'line-through'; // Aplica o elimina el tachado según el nuevo estado.
            taskTextContainer.style.backgroundColor = isDone ? '' : 'rgb(145, 221, 157)'; // Aplica o elimina el color de fondo verde claro.
            taskTextContainer.style.color = isDone ? '' : 'rgb(255, 255, 255)'; // Aplica o elimina el color de texto blanco.
            Toastify({ // Muestra una notificación Toastify.
                text: isDone ? "Tarea pendiente" : "Tarea completada", // Mensaje de la notificación según el nuevo estado.
                duration: 3000, // Duración de la notificación.
                gravity: "bottom", // Posición vertical.
                position: "right", // Posición horizontal.
                style: { // Estilos de la notificación.
                    background: isDone ? "linear-gradient(to right, #ffc107, #ff9800)" : "linear-gradient(to right,rgb(22, 151, 71),#4CAF50)" // Fondo diferente según el estado.
                }
            }).showToast(); // Muestra la notificación.
            const completedCount = parseInt(document.getElementById("completed-tasks").textContent) + (isDone ? -1 : 1); // Actualiza el contador de tareas completadas.
            updateCompletetasks(completedCount); // Actualiza la visualización del contador de completadas.
            updatePendingTasks(parseInt(document.getElementById("task-count").textContent), completedCount); // Actualiza la visualización del contador de pendientes.
            saveLists(); // Guarda las listas actualizadas.
        });

        const detailsTaskButton = document.createElement('button'); // Crea un botón para mostrar los detalles de la tarea.
        detailsTaskButton.className = 'details-task'; // Asigna la clase CSS.
        detailsTaskButton.innerHTML = '<i class="fas fa-info-circle"></i>'; // Establece el contenido con un icono de Font Awesome.
        detailsTaskButton.addEventListener('click', () => { // Agrega un evento listener para mostrar los detalles.
            showTaskDetails( // Llama a la función para mostrar los detalles de la tarea.
                taskTextContainer.textContent, // Título de la tarea.
                taskTextContainer.dataset.createdAt, // Fecha de creación.
                taskTextContainer.dataset.deadline, // Plazo de realización.
                taskTextContainer.dataset.assignedTo, // Persona asignada.
                taskTextContainer.dataset.categoryId // ID de la categoría.
            );
        });

        buttonsContainer.append(deleteTaskButton, hechoTaskButton, detailsTaskButton); // Agrega los botones al contenedor de botones.
        taskContainer.append(taskTextContainer, buttonsContainer); // Agrega el texto de la tarea y los botones al contenedor de la tarea.
        taskItem.appendChild(taskContainer); // Agrega el contenedor de la tarea al elemento de la lista de la tarea.
        taskList.appendChild(taskItem); // Agrega el elemento de la lista de la tarea a la lista de tareas (ul).

        taskTextContainer.addEventListener("dragstart", (e) => { // Evento listener para cuando comienza el arrastre de la tarea.
            draggedItem = taskItem; // Almacena el elemento arrastrado.
            setTimeout(() => taskItem.classList.add("dragging"), 0); // Agrega una clase para estilos de arrastre y retrasa ligeramente para que se aplique.
        });

        taskTextContainer.addEventListener("dragend", () => { // Evento listener para cuando finaliza el arrastre.
            taskItem.classList.remove("dragging"); // Elimina la clase de arrastre.
            draggedItem = null; // Limpia la variable del elemento arrastrado.
            saveLists(); // Guarda el nuevo orden de las tareas.
        });

        taskList.addEventListener("dragover", (e) => { // Evento listener para cuando un elemento arrastrable está sobre la lista de tareas.
            e.preventDefault(); // Permite que se suelte el elemento.
            const afterElement = getDragAfterElement(taskList, e.clientY); // Obtiene el elemento después del cual se debe insertar el elemento arrastrado.
            taskList.insertBefore(draggedItem, afterElement); // Inserta el elemento arrastrado antes del elemento de referencia.
        });

        // Función auxiliar para determinar el elemento delante del cual se debe soltar el elemento arrastrado.
        function getDragAfterElement(container, y) {
            const draggableElements = [...container.querySelectorAll(".task-item:not(.dragging)")]; // Obtiene todos los elementos de tarea que no están siendo arrastrados.
            return draggableElements.reduce((closest, child) => {
                const box = child.getBoundingClientRect(); // Obtiene las dimensiones y posición del elemento hijo.
                const offset = y - box.top - box.height / 2; // Calcula el desplazamiento vertical entre el cursor y el centro del elemento hijo.
                return offset < 0 && offset > closest.offset ? { offset, element: child } : closest; // Si el desplazamiento es negativo y mayor que el del elemento más cercano actual, este elemento es el más cercano.
            }, { offset: Number.NEGATIVE_INFINITY }).element; // Inicializa con un desplazamiento negativo infinito y sin elemento.
        }

        return taskItem; // Devuelve el elemento de la tarea creado.
    }

    // Función para mostrar los detalles de una tarea en el panel lateral.
    function showTaskDetails(title, createdAt, deadline, assignedTo, categoryId) {
        let categoryName = "Sin categoría"; // Valor por defecto para el nombre de la categoría.
        if (categoryId) { // Si la tarea tiene un ID de categoría.
            const categoryElement = document.querySelector(`#categories .category[id="${categoryId}"] h3`); // Busca el elemento h3 del nombre de la categoría por el ID de la categoría.
            if (categoryElement) {
                categoryName = categoryElement.textContent; // Obtiene el nombre de la categoría del elemento encontrado.
            } else {
                // Si no se encuentra la categoría, buscar en las listas (puede haber listas sin categoría)
                const listElement = Array.from(document.querySelectorAll('.task-list')).find(list => list.querySelector('.task-items li .task-text[data-category-id="' + categoryId + '"]'));
                if (listElement) {
                    const categorySelect = listElement.querySelector('.category-select');
                    if (categorySelect && categorySelect.value) {
                        categoryName = categorySelect.value;
                    }
                }
            }
        }

        detailsContent.innerHTML = `
            <h3>${title}</h3>
            <p><b>Creada:</b> <span class="math-inline">\{createdAt \|\| 'No se registró la fecha de creación'\}</p\>
<p\><b\>Plazo\:</b\> <input type\="datetime\-local" id\="deadline\-input" value\="</span>{deadline || ''}"></p>
            <p><b>Asignado a:</b> <input type="text" id="assigned-to-input" value="${assignedTo || ''}"></p>
            <p><b>Categoría:</b> <span class="math-inline">\{categoryName\}</p\>
<button onclick\="saveTaskDetails\('</span>{title}')">Guardar Detalles</button>
        `; // Establece el contenido HTML del panel de detalles con la información de la tarea.
        detailsPanel.style.right = '0'; // Desliza el panel de detalles hacia la derecha para hacerlo visible.
    }

    // Función para guardar los detalles editados de una tarea.
    function saveTaskDetails(taskTitle) {
        const deadlineInput = document.getElementById('deadline-input'); // Obtiene el elemento de entrada del plazo.
        const assignedToInput = document.getElementById('assigned-to-input'); // Obtiene el elemento de entrada de la persona asignada.
        const newDeadline = deadlineInput.value; // Obtiene el nuevo valor del plazo.
        const newAssignedTo = assignedToInput.value; // Obtiene el nuevo valor de la persona asignada.

        const lists = JSON.parse(localStorage.getItem("lists")) || []; // Obtiene las listas del almacenamiento local.
        lists.forEach(list => { // Itera sobre cada lista.
            if (list.tasks) { // Si la lista tiene tareas.
                list.tasks.forEach(task => { // Itera sobre cada tarea.
                    if (task.text === taskTitle) { // Si el título de la tarea coincide con la tarea que se está editando.
                        task.deadline = newDeadline || null; // Actualiza el plazo de la tarea.
                        task.assignedTo = newAssignedTo || null; // Actualiza la persona asignada a la tarea.
                    }
                });
            }
        });
        localStorage.setItem("lists", JSON.stringify(lists)); // Guarda las listas actualizadas en el almacenamiento local.
        Toastify({ // Muestra una notificación de éxito.
            text: "Detalles de la tarea guardados",
            duration: 3000,
            gravity: "bottom",
            position: "right",
            style: { background: "linear-gradient(to right, #4CAF50, #8BC34A)" }
        }).showToast();
        hideTaskDetails(); // Oculta el panel de detalles después de guardar.
    }

    // Función para ocultar el panel de detalles de la tarea.
    function hideTaskDetails() {
        detailsPanel.style.right = '-300px'; // Desliza el panel de detalles hacia la izquierda para ocultarlo.
    }

    // Evento listener para cerrar el panel de detalles al hacer clic fuera de él.
    document.addEventListener('click', (event) => {
        if (detailsPanel.style.right === '0px' && !detailsPanel.contains(event.target) && !event.target.classList.contains('details-task') && !event.target.closest('.details-task')) {
            hideTaskDetails(); // Oculta el panel de detalles si se hace clic fuera de él y no en el botón de detalles.
        }
    });

    // Función para guardar el estado actual de las listas en el almacenamiento local.
    function saveLists() {
        const lists = Array.from(document.querySelectorAll(".task-list")).map(list => ({ // Obtiene todos los elementos de lista y los mapea a objetos con su información.
            title: list.querySelector("h3").textContent, // Obtiene el título de la lista.
            color: list.style.backgroundColor, // Obtiene el color de fondo de la lista.
            categoryId: list.querySelector(".category-select")?.value || null, // Obtiene el ID de la categoría seleccionada o null si no hay ninguna.
            tasks: Array.from(list.querySelectorAll(".task-items li")).map(li => ({ // Obtiene todos los elementos de tarea dentro de la lista y los mapea a objetos con su información.
                text: li.querySelector(".task-text").textContent, // Obtiene el texto de la tarea.
                done: li.querySelector(".task-text").dataset.done === "true", // Obtiene el estado de completado.
                createdAt: li.querySelector(".task-text").dataset.createdAt, // Obtiene la fecha de creación.
                deadline: li.querySelector(".task-text").dataset.deadline, // Obtiene el plazo de realización.
                assignedTo: li.querySelector(".task-text").dataset.assignedTo, // Obtiene la persona asignada.
                categoryId: li.querySelector(".task-text").dataset.categoryId // Obtiene el ID de la categoría de la tarea.
            }))
        }));
        localStorage.setItem("lists", JSON.stringify(lists)); // Guarda el array de objetos de lista como una cadena JSON en el almacenamiento local.
        const totalTasks = lists.reduce((sum, list) => sum + list.tasks.length, 0); // Calcula el número total de tareas sumando la cantidad de tareas en cada lista.
        const completedTasks = lists.reduce((sum, list) => sum + list.tasks.filter(task => task.done).length, 0); // Calcula el número de tareas completadas filtrando las tareas hechas y sumando su cantidad.
        localStorage.setItem("totalTasks", totalTasks); // Guarda el número total de tareas.
        localStorage.setItem("completedTasks", completedTasks); // Guarda el número de tareas completadas.
        updateTaskCounter(totalTasks); // Actualiza la visualización del contador total de tareas.
        updateCompletetasks(completedTasks); // Actualiza la visualización del contador de tareas completadas.
        updatePendingTasks(totalTasks, completedTasks); // Actualiza la visualización del contador de tareas pendientes.
    }

    // Función para agregar una nueva categoría al DOM.
    function addCategory(name) {
        const category = document.createElement('div'); // Crea un nuevo elemento div para la categoría.
        category.className = 'category'; // Asigna la clase CSS "category".
        const categoryId = `category-${Date.now()}`; // Genera un ID único para la categoría.
        category.id = categoryId; // Asigna el ID al elemento de la categoría.

        const categoryHeader = document.createElement('div'); // Crea un div para el encabezado de la categoría.
        categoryHeader.className = 'category-header'; // Asigna la clase CSS.

        const categoryTitle = document.createElement('h3'); // Crea un elemento h3 para el título de la categoría.
        categoryTitle.textContent = name; // Establece el texto del título.

        const deleteCategoryButton = document.createElement('button'); // Crea un botón para eliminar la categoría.
        deleteCategoryButton.textContent = 'X'; // Establece el texto del botón.
        deleteCategoryButton.className = 'delete-category'; // Asigna la clase CSS.
        deleteCategoryButton.addEventListener('click', (event) => { // Agrega un evento listener para eliminar la categoría.
            event.stopPropagation(); // Evita que el clic en el botón se propague al contenedor de la categoría.
            category.remove(); // Elimina el elemento de la categoría del DOM.
            saveCategories(); // Guarda las categorías actualizadas.
            document.dispatchEvent(new CustomEvent('categoryRemoved')); // Dispara un evento personalizado para notificar que se eliminó una categoría.
        });

        categoryHeader.append(categoryTitle, deleteCategoryButton); // Agrega el título y el botón de eliminar al encabezado.

        const categoryLists = document.createElement('div'); // Crea un div para contener las listas dentro de esta categoría.
        categoryLists.className = 'category-lists'; // Asigna la clase CSS.

        category.append(categoryHeader, categoryLists); // Agrega el encabezado y el contenedor de listas al elemento de la categoría.

        category.addEventListener('click', () => { // Agrega un evento listener para redirigir a la página de la categoría al hacer clic en ella.
            window.location.href = `category.html?category=${encodeURIComponent(categoryTitle.textContent)}`;
        });

        categoriesContainer.appendChild(category); // Agrega la nueva categoría al contenedor de categorías.
        document.dispatchEvent(new CustomEvent('categoryAdded')); // Dispara un evento personalizado para notificar que se agregó una nueva categoría.
    }

    // Función para guardar el estado actual de las categorías en el almacenamiento local.
    function saveCategories() {
        const categoriesData = Array.from(categoriesContainer.children).map(category => ({ // Obtiene todos los elementos de categoría y los mapea a objetos con su nombre.
            name: category.querySelector("h3").textContent // Obtiene el texto del título de la categoría.
        }));
        localStorage.setItem("categories", JSON.stringify(categoriesData)); // Guarda el array de objetos de categoría como una cadena JSON en el almacenamiento local.
    }
});