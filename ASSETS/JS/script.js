$(document).ready(() => {

    
    let ToDoList = JSON.parse(localStorage.getItem('todo')) || [{
        id: 473628,
        tarea: 'Hacer Compras',
        fecha: '2025-07-22',
        check: false
    }];
    
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
    
    $('#btnAgregar').on('click', (e) => agregarTarea(e))

    
    function checkear(id) {
        ToDoList = ToDoList.map(tarea => 
            tarea.id == id 
            ? { ...tarea, check: !tarea.check } 
            : { ...tarea }
        )
        localStorage.setItem('todo', JSON.stringify(ToDoList));
    }
    
    const eliminarTarea = (id) => {
        ToDoList = ToDoList.filter( tarea => tarea.id != id)
        listarTareas(ToDoList)
        localStorage.setItem('todo', JSON.stringify(ToDoList));
    }
    
    
    const agregarTarea = (e) => {
        
        e.preventDefault()
        const todo = $('#tarea')[0].value
        const date = $('#fecha')[0].value
        
        if(!todo) {
            alert('Escribe una Tarea!')
            return
        }
        
        if(!date) {
            alert('La fecha es invalida - Usar el boton en la parte derecha')
            return
        }
        
        const fechaActual = new Date()
        const fechaTarea = new Date(date)
        
        if(fechaTarea < fechaActual) {
            alert('La fecha debe ser superior a la actual')
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
        $('#tarea')[0].value = ''
        $('#fecha')[0].value = ''
    }
    
    const eliminarCompletados = () => {
        ToDoList = ToDoList.filter( tarea => !tarea.check )
        listarTareas(ToDoList)
        localStorage.setItem('todo', JSON.stringify(ToDoList));
    }
    
    $('#btnElimCompletados').on('click', eliminarCompletados)

    const mostrarTodos = () => {
        listarTareas(ToDoList)
    }

    $('#btnMostrarTodos').on('click', mostrarTodos)

    const filtrar = () => {
        const busqueda = $('#filtro')[0].value
        const listaFiltro = ToDoList.filter( todo => todo.tarea.includes(busqueda))
        listarTareas(listaFiltro)
        $('#filtro')[0].value = ''
    }

    $('#btnFiltrar').on('click', filtrar)

})