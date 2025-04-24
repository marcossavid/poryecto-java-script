// Función para crear una nueva TAREA----------------------------------------------------
export function addTask(taskList, taskText) {
    
    // Asegurarse de que taskText sea una cadena de texto antes de usar .trim()
    if (typeof taskText === 'string' && taskText.trim() === "") return;
    
    // Crear un nuevo elemento de tarea
    const taskItem = document.createElement("li");
    taskItem.classList.add("task-item"); //Esta clase la debo revisar

    // Contenedor para la tarea que contendrá tanto el texto como los botones
    const taskContainer = document.createElement("div");
    taskContainer.classList.add("task-container"); //Esta clase la debo revisar

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
    deleteTaskButton.classList.add("delete-task");
    const iconDelete = document.createElement('i');
    iconDelete.classList.add('fas', 'fa-trash'); // Clases de FontAwesome para el ícono de borrar
    // Agregar el icono al botón de delete
    deleteTaskButton.appendChild(iconDelete);
    deleteTaskButton.addEventListener("click", () => {
        taskItem.remove();
        if (taskTextContainer.dataset.done === "true") {
        contadorhecho --;
        updateCompletetasks(contadorhecho);
        }
        
        saveLists();
        //ACA PUEDE IR UN CONTADOR()--;
    });

    // Botón de hecho
    const hechoTaskButton = document.createElement('button');
    hechoTaskButton.classList.add('hecho-task');
    const icon = document.createElement('i');
    icon.classList.add('fas', 'fa-check'); // Clases de FontAwesome para el check
    // Agregar el icono al botón
    hechoTaskButton.appendChild(icon);

    // Estado inicial de la tarea
    taskTextContainer.dataset.done = "false"; //dataset representa le estado del item

 
    hechoTaskButton.addEventListener('click', () => {
        

        if (taskTextContainer.dataset.done === "false") {
            
            taskTextContainer.style.textDecoration = 'line-through'; // Tacha el texto
            taskTextContainer.style.backgroundColor = 'rgb(145, 221, 157)'; // Cambia el fondo a verde
            taskTextContainer.style.color = 'rgb(255, 255, 255)'; // Cambia el color del texto
            taskTextContainer.dataset.done = "true"; // Cambia el estado
            Toastify({
                text: "Tarea completada",
                duration: 3000, // Duración en milisegundos
                gravity: "bottom", // Posición vertical (top / bottom)
                position: "right", // Posición horizontal (left / center / right)
                style: {
                    background: "linear-gradient(to right,rgb(22, 151, 71),#4CAF50)", // Color de fondo
                }
            }).showToast();
            //ACA PUEDE IR UN CONTADOR()++;
            contadorhecho ++;
            updateCompletetasks(contadorhecho);
          
        } else {
            taskTextContainer.style.textDecoration = 'none'; // Restaura el texto
            taskTextContainer.style.color = ''; // Vuelve al color original
            taskTextContainer.style.backgroundColor = ''; // Restaura el fondo original
            taskTextContainer.dataset.done = "false"; // Cambia el estado
           
            //ACA PUEDE IR UN CONTADOR()--;
            contadorhecho --;
            updateCompletetasks(contadorhecho);
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
        draggedItem = taskItem; // Al iniciar el arrastre, guarda el elemento arrastrado en `draggedItem
        setTimeout(() => taskItem.classList.add("dragging"), 0); // Se usa `setTimeout` para permitir que el evento `dragging` se active después de que el arrastre haya comenzado
    });

    taskTextContainer.addEventListener("dragend", () => {
        taskItem.classList.remove("dragging"); // Cuando se suelta el elemento, se remueve la clase `dragging`
        draggedItem = null; // Se limpia la variable `draggedItem` para evitar referencias incorrectas
        saveLists();
    });

    // Permite el arrastre sobre la lista
    taskList.addEventListener("dragover", (e) => {
        e.preventDefault(); // // Evita el comportamiento predeterminado que impide soltar elementos en la lista
        const afterElement = getDragAfterElement(taskList, e.clientY); // Obtiene el elemento más cercano al punto donde se está soltando el elemento arrastrado
        
        if (afterElement == null) { // Si no hay un elemento después, se agrega el elemento arrastrado al final de la lista
            taskList.appendChild(draggedItem);
        } else { // Si hay un elemento después, se inserta antes de este
            taskList.insertBefore(draggedItem, afterElement);
        }
    });

    function getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll(".task-item:not(.dragging)")]; // Selecciona todos los elementos arrastrables en la lista, excepto el que se está arrastrando
        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect(); // Obtiene el tamaño y posición del elemento en la lista
            const offset = y - box.top - box.height / 2; // Calcula la diferencia entre la posición Y del mouse y la mitad del elemento
            return offset < 0 && offset > closest.offset ? { offset, element: child } : closest; // Si el mouse está por encima del elemento pero no demasiado alto, este es el más cercano
        }, { offset: Number.NEGATIVE_INFINITY }).element; // Devuelve el elemento más cercano
    }
    
    
    
    saveLists();
    
}