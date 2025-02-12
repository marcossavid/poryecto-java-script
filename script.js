document.addEventListener("DOMContentLoaded", function () {
    const taskInput = document.getElementById("task-input");
    const addTaskButton = document.getElementById("add-task");
    const taskList = document.getElementById("task-list");

    loadTasks(); // Cargar las tareas guardadas al iniciar la página

    // Evento para agregar tarea con el botón
    addTaskButton.addEventListener("click", () => addTaskFromInput());

    // Permitir agregar tarea con la tecla Enter
    taskInput.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
            addTaskFromInput();
        }
    });

    // Función para obtener el valor del input y agregar una nueva tarea
    function addTaskFromInput() {
        const taskValue = taskInput.value.trim(); // Se elimina espacios en blanco al inicio y al final
        if (taskValue) {
            addTask(taskValue, false); // Se agrega la tarea sin marcar como completada
            taskInput.value = ""; // Se limpia el campo de entrada después de agregar la tarea
            saveTasks(); // Se guarda la lista actualizada en localStorage
        }
    }

    // Función para crear y agregar una nueva tarea a la lista
    function addTask(taskText, isCompleted) {
        const li = document.createElement("li"); // Se crea un elemento <li>
        li.textContent = taskText; // Se asigna el texto de la tarea

        // Si la tarea estaba marcada como completada, se agrega la clase "completed"
        if (isCompleted) {
            li.classList.add("completed");
        }

        // Evento para marcar o desmarcar la tarea como completada al hacer clic
        li.addEventListener("click", () => {
            li.classList.toggle("completed"); // Alterna la clase "completed"
            saveTasks(); // Guarda el estado de la tarea en localStorage
        });

        // Se crea un botón para eliminar la tarea
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Eliminar";

        // Evento para eliminar la tarea al hacer clic en el botón
        deleteButton.addEventListener("click", (e) => {
            e.stopPropagation(); // Evita que se active el evento de marcar como completada
            li.remove(); // Se elimina la tarea de la lista
            saveTasks(); // Se actualiza la lista en localStorage
        });

        li.appendChild(deleteButton); // Se agrega el botón de eliminar dentro del <li>
        taskList.appendChild(li); // Se agrega la tarea a la lista (<ul>)
    }

    // Función para guardar las tareas en localStorage
    function saveTasks() {
        // Se recorre la lista de tareas y se crea un array con sus datos
        const tasks = Array.from(taskList.children).map((li) => ({
            text: li.childNodes[0].textContent, // Se obtiene el texto de la tarea
            completed: li.classList.contains("completed"), // Se verifica si está completada
        }));

        localStorage.setItem("tasks", JSON.stringify(tasks)); // Se guarda en localStorage
    }

    // Función para cargar las tareas guardadas en localStorage
    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem("tasks")) || []; // Se obtiene el array de tareas o un array vacío si no hay datos
        tasks.forEach((task) => addTask(task.text, task.completed)); // Se agregan las tareas a la lista
    }
});
