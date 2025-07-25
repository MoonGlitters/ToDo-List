// Se espera a que la pagina cargue completamente
$(document).ready(() => {
    // Se hace uso de la biblioteca notyf
    let notyf = new Notyf()

    // Se obtienen los valores desde el local storage si es que existe o se usa el valor predefinido
    let ToDoList = JSON.parse(localStorage.getItem('todo')) || [{
        id: 473628,
        tarea: 'Hacer Compras',
        fecha: '2025-07-22',
        check: false
    }];

    // Se limpia el div #todolist, y luego por cada elemento se crea un fragmento de HTML agregandolos a #todolist
    const listarTareas = (lista) => {
    $('#todolist').empty();
    lista.forEach(element => {
        const tarea = $(`
            <div id="${element.id}" role="listitem" class="task d-flex justify-content-between align-items-center container text-center bg-light rounded shadow px-4 py-3 mb-3">
                <div>
                    <h2 class='text-dark'>${element.tarea}</h2>
                    <p class='text-dark'>${element.fecha}</p>
                </div>
                <div class='d-flex gap-2'>
                    <label>
                        <input type="checkbox" class="task-checkbox" ${element.check ? 'checked' : ''}>
                    </label>
                    <button class="btn-eliminar btn btn-danger text-center" data-id="${element.id}"><i class='bi bi-x-lg'></i></button>
                </div>
            </div>
        `);
        $('#todolist').append(tarea);
    });
    }
    
    listarTareas(ToDoList)

    // a cada elemento de todolist que sean btn-eliminar y checkbox se le agregan los eventos
    $('#todolist')
        .on('click', '.btn-eliminar', function() {
            const id = $(this).data('id');
            eliminarTarea(id);
        })
        .on('change', '.task-checkbox', function() {
            const taskId = $(this).closest('.task').attr('id');
            $(this).closest('.task').toggleClass('checked')
            checkear(taskId);
        });
    
    // se agrega evento al btnAgregar
    $('#btnAgregar').on('click', (e) => agregarTarea(e))
    
    // funcion para el checkbox que cambia el booleano tarea.check 
    function checkear(id) {
        ToDoList = ToDoList.map(tarea => 
            tarea.id == id 
            ? { ...tarea, check: !tarea.check } 
            : { ...tarea }
        )
        localStorage.setItem('todo', JSON.stringify(ToDoList));
    }

    // funcion para eliminar una tarea del array
    
    const eliminarTarea = (id) => {
        ToDoList = ToDoList.filter( tarea => tarea.id != id)
        listarTareas(ToDoList)
        localStorage.setItem('todo', JSON.stringify(ToDoList));
        notyf.success('Se elimino la tarea con exito')
    }
    
    // funcion para agregar una tarea
    const agregarTarea = (e) => {
        
        e.preventDefault()
        const todo = $('#tarea')[0].value
        const date = $('#fecha')[0].value
        
        if(!todo) {
            notyf.error('Los campos no pueden estar vacios')
            return
        }
        
        if(!date) {
            notyf.error('La fecha es invalida - Usar el boton en la parte derecha')
            return
        }

        // se crean las fechas para poder comparlas y evitar que coloque una fecha anterior
        
        const fechaActual = new Date()
        const fechaTarea = new Date(date)
        
        if(fechaTarea.toISOString().split('T')[0] < fechaActual.toISOString().split('T')[0]) {
            notyf.error('La fecha debe ser superior a la actual')
            return
        }
        
        const newTarea = {
            id: Math.floor(Math.random() * 100000),
            tarea: todo,
            fecha: fechaTarea.toISOString().split('T')[0],
            check: false
        }
        ToDoList.push(newTarea)
        listarTareas(ToDoList)
        localStorage.setItem('todo', JSON.stringify(ToDoList));

        notyf.success('Se agrego tarea con exito!')

        $('#tarea')[0].value = ''
        $('#fecha')[0].value = ''
    }
    
    // funcion para eliminar todos los que tengan el check en verdadero
    const eliminarCompletados = () => {
        if (ToDoList.every(tarea => !tarea.check)) {
            notyf.error('No hay tareas completadas')
            return
        }
        ToDoList = ToDoList.filter( tarea => !tarea.check )
        listarTareas(ToDoList)
        localStorage.setItem('todo', JSON.stringify(ToDoList));

        notyf.success('Se eliminaron las tareas completadas!')
    }
    
    $('#btnElimCompletados').on('click', eliminarCompletados)

    // funcion para listar todos despues de filtrar
    const mostrarTodos = () => {
        if(ToDoList.length === 0){
            notyf.error('No hay elementos para mostrar')
        }
        listarTareas(ToDoList)
    }

    $('#btnMostrarTodos').on('click', mostrarTodos)

    // funcion para filtrar por tarea
    const filtrar = () => {
        const busqueda = $('#filtro')[0].value
        const termino = busqueda.toLowerCase().trim()

        if (!busqueda) {
            notyf.error('Escribe una tarea para filtrar')
            return
        }
        const listaFiltro = ToDoList.filter( todo => todo.tarea.includes(termino));
        
        if (listaFiltro.length === 0) {
            notyf.error('No hay coincidencias')
            return 
        }
        listarTareas(listaFiltro)
        $('#filtro')[0].value = ''
    }

    $('#btnFiltrar').on('click', filtrar)

})