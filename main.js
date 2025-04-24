import { addList} from 'crearlista.js';
import { addTask} from 'creartarea.js';
document.addEventListener("DOMContentLoaded", function () {
    const listsContainer = document.getElementById("lists-container"); //const del contenedor de listas
    const addListButton = document.getElementById("add-list"); //const del boton
    const listNameInput = document.getElementById ("list-name-input"); // const del input

    const categoryinput = document.getElementById('category-input');
    const categoriesContainer = document.getElementById('categories');
    const addCategoryButton = document.getElementById('add-category');
    

    loadLists(); // Cargar listas guardadas al iniciar
    loadCategories(); //Cargar categorias
    
     let contadorhecho = 0;
     function updateCompletetasks(contadorhecho){
        document.getElementById("completed-tasks").textContent= contadorhecho;
     }

     
     
// Cargar listas desde localStorage---------------------------------------------------------------------
function loadLists() {
    try {
        const savedLists = JSON.parse(localStorage.getItem("lists")) || [];
        totalTasks = 0; 
        savedLists.forEach(list => {
            addList(list.title, list.tasks, list.color, list.categoryId);
            totalTasks += list.tasks.length; // Suma la cantidad de tareas de cada lista CONTADORRR---
        });
        
        updateTaskCounter(totalTasks); // Actualiza el contador en la UI CONTADORRRRrrrrrr---

    } catch (error) {
        alert("Error al cargar las listas:");
        localStorage.removeItem("lists");  //  Borrar el JSON corrupto
    }
   
}
 // Función para actualizar el contador de tareas en la interfaz CONTADORRR---
 function updateTaskCounter(count) {
    document.getElementById("task-count").textContent = count;
}
// Llamar a loadLists() al cargar la página CONTADORRRR-----
document.addEventListener("DOMContentLoaded", loadLists);




// Cargar categorías desde localStorage--------------------------------------------------------------
function loadCategories() {
    try {
        const savedCategories = JSON.parse(localStorage.getItem("categories")) || [];
        savedCategories.forEach(category => addCategory(category.name));
    } catch (error) {
        console.error("Error al cargar las categorías:", error);
        localStorage.removeItem("categories");  // Elimina los datos corruptos
    }
}
  



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
    
    

    
// Evento para añadir una nueva categoría----------------------------------------------------------------
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



    //--------------------------------------------------------------------------------------

  // Guardar todas las listas en localStorage----------------------------------------------------------
  function saveLists() {
    const lists = [];
    let totalTasks = 0;  // Inicializar contador
    document.querySelectorAll(".task-list").forEach(list => {
        const title = list.querySelector("h3").textContent;
        const tasks = Array.from(list.querySelectorAll(".task-items li")).map(li => li.textContent);
        const color = list.style.backgroundColor;
        lists.push({ title, tasks, color });

        totalTasks += tasks.length;  // Sumar tareas de cada lista
    });

    localStorage.setItem("lists", JSON.stringify(lists));
    localStorage.setItem("totalTasks", totalTasks);  // Guardar total de tareas en localStorage
    updateTaskCounter(totalTasks);
}




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


// Guardar todas las categorías en localStorage------------------------------------------------------------
function saveCategories() {
    const categoriesData = Array.from(categoriesContainer.children).map(category => ({
        name: category.querySelector("h3").textContent
    }));

    localStorage.setItem("categories", JSON.stringify(categoriesData));
}
    
});