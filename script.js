document.addEventListener("DOMContentLoaded", function () {
    const listsContainer = document.getElementById("lists-container"); //const del contenedor de listas
    const addListButton = document.getElementById("add-list"); //const del boton
    const listNameInput = document.getElementById ("list-name-input"); // const del input

    const categoryinput = document.getElementById('category-input');
    const categoriesContainer = document.getElementById('categories');
    const addCategoryButton = document.getElementById('add-category');
    

    loadLists(); // Cargar listas guardadas al iniciar
    loadCategories(); //Cargar categorias
    
 




  
    // Evento del boton para añadir una nueva lista----------------------------------------------------------

    addListButton.addEventListener("click", () => {
        const listTitle = listNameInput.value.trim(); 
        if (listTitle) {
            addList(listTitle, [], "#f4f4f4"); // Llama a la función con el título ingresado
            saveLists();
            listNameInput.value = ""; // Limpia el input después de agregar la lista
            Toastify({
                text: "Nueva lista agregada",
                duration: 3000, // Duración en milisegundos
                gravity: "bottom", // Posición vertical (top / bottom)
                position: "right", // Posición horizontal (left / center / right)
                style: {
                    background: "linear-gradient(to right,rgb(78, 184, 169),rgb(91, 61, 201))", // Color de fondo
                }
            }).showToast();
        } else {
            alert("Por favor, ingresa un nombre para la lista."); // Mensaje de validación
        }
    });

    // Evento para añadir una nueva categoría
    addCategoryButton.addEventListener("click", () => {
        const categoryName = categoryinput.value.trim();
        if (categoryName) {
            addCategory(categoryName);
            saveCategories();
            categoryinput.value = "";
        }
        else {
            alert("Ingresa una categoria");
        }
    });





    // Función para crear una nueva LISTA-----------------------------------------------------------------

    function addList(title, tasks = [], color = "#f4f4f4", categoryId = null) { // Color predeterminado gris

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

        const mensaje = document.createElement("p");
        mensaje.style.color= "gray";
        mensaje.innerText = "Puedes arrastrar y cambiar el orden de las tereas presionando sobre el texto";
        mensaje.style.fontSize = "12px";
        list.appendChild(mensaje);

        saveLists();
    }

//------------------------------------------------------------------------------------------






    
// Función para crear una nueva TAREA----------------------------------------------------
function addTask(taskList, taskText) {

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
    deleteTaskButton.textContent = "X";
    deleteTaskButton.classList.add("delete-task");
    deleteTaskButton.addEventListener("click", () => {
        taskItem.remove();
        saveLists();
        //ACA PUEDE IR UN CONTADOR()--;
    });

    // Botón de hecho
    const hechoTaskButton = document.createElement('button');
    hechoTaskButton.textContent = '✓';
    hechoTaskButton.classList.add('hecho-task');



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
            
          
        } else {
            taskTextContainer.style.textDecoration = 'none'; // Restaura el texto
            taskTextContainer.style.color = ''; // Vuelve al color original
            taskTextContainer.style.backgroundColor = ''; // Restaura el fondo original
            taskTextContainer.dataset.done = "false"; // Cambia el estado
           
            //ACA PUEDE IR UN CONTADOR()--;
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

//--------------------------------------------------------------------------------------








 // Función para crear una nueva CATEGORIA------------------------------------------------------------
    function addCategory(name) {
        const category = document.createElement('div');
        category.classList.add('category');
        const categoryId = `category-${Date.now()}`;
        category.setAttribute('id', categoryId);

        // Contenedor para el título y el botón
        const categoryHeader = document.createElement('div');
        categoryHeader.classList.add('category-header'); 

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

//-----------------------------------------------------------------------------------------------------



    




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
            let totalTasks = 0; // Inicializa el contador de tareas CONTADORRR-------
            savedLists.forEach(list => {
                addList(list.title, list.tasks, list.color, list.categoryId);
                totalTasks += list.tasks.length; // Suma la cantidad de tareas de cada lista CONTADORRR---
            });

            updateTaskCounter(totalTasks); // Actualiza el contador en la UI CONTADORRRR---

        } catch (error) {
            console.error("Error al cargar las listas:", error);
            localStorage.removeItem("lists");  //  Borrar el JSON corrupto
        }
       
    }
     // Función para actualizar el contador de tareas en la interfaz CONTADORRR---
     function updateTaskCounter(count) {
        document.getElementById("task-count").textContent = count;
    }
    // Llamar a loadLists() al cargar la página CONTADORRRR-----
    document.addEventListener("DOMContentLoaded", loadLists);


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
