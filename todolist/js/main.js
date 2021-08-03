
// Today's date
const date = document.getElementById('date');
const options = {
    weekday: 'long',
    month: 'short',
    day: 'numeric'
}
const today = new Date();
date.innerHTML = today.toLocaleDateString('en-US', options);

// Vars
let id = 0;
const inputBox = document.querySelector('#newTask');
const addBtn = document.querySelector('#addItem');
const ToDoBtn = document.querySelector('#todo');

// Get Local Storage
const getToDo = () => {
    let todos;
    if(localStorage.getItem('ToDo') === null){
        todos = [];
    }else{
        todos = JSON.parse(localStorage.getItem('ToDo'));
    }
    return todos;
}
getToDo()
// add todo list
addBtn.addEventListener('click', () => {
    const toDoItem = document.getElementById('newTask').value;
    if(toDoItem){
        // add to do to list
        const todos = getToDo();
        todos.push({
                text: toDoItem, id: Date.now(),
                completed: false
        })
        displayToDo(toDoItem,  Date.now());
        localStorage.setItem('ToDo', JSON.stringify(todos));
        id++;
    }
    document.getElementById('newTask').value = '';

});
// Add to do list by keyup
document.addEventListener('keyup', (event) => {
    if(event.keyCode === 13){
        const toDoItem = document.getElementById('newTask').value;
        if(toDoItem){
        // add to do to list
        const todos = getToDo();
        todos.push({
                text: toDoItem, id: Date.now(),
                completed: false
        })
        displayToDo(toDoItem,  Date.now());
        localStorage.setItem('ToDo', JSON.stringify(todos));
        id++;
        }
        document.getElementById('newTask').value = '';
    }
})
// Render To do list to display on the the user's interface
const displayToDo = (toDo, id, completed) => {
    const Complete = completed ? 'checkedLine' : '';
    const statusIcon = completed ? 'fa-check-circle' : 'fa-circle';
    const liItem = `<li class="item">
        <p class="text ${Complete}">${toDo}</p>
        <i class="far ${statusIcon} co complete" action="complete" id="${id}"></i>
        <i class="far fa-trash-alt delete" action="delete" id="${id}"></i>
        </li>`;
        const position = "beforeend";
        ToDoBtn.insertAdjacentHTML(position, liItem);
}
// Render to do list after refresh page by get local storage
const displayData = () => {
    const todos = getToDo();
    todos.forEach(todo => {
        displayToDo(todo.text, todo.id, todo.completed)
    });
}
displayData()

// Remove to do list
const removeToDo = (element) =>{
    // Remove item from UI
    element.parentNode.parentNode.removeChild(element.parentNode);
    // Get value of the current id and remove it from storage
    const curId = element.attributes.id.value;
    const todos = getToDo();
    todos.forEach((todo, index) => {
        if(+todo.id === +curId){
            todos.splice(index, 1);
        }
    })
    localStorage.setItem('ToDo', JSON.stringify(todos));
}

// Complete to do 
const completeToDo = (element) => {
        const CHECK = "fa-check-circle";
        const UNCHECK = "fa-circle";
        element.classList.toggle(CHECK);
        element.classList.toggle(UNCHECK);
        element.parentNode.querySelector(".text").classList.toggle("checkedLine");
        // Update the storage
        const curId = element.attributes.id.value;
        const todos = getToDo();
        todos.forEach((todo, index) => {
            if(+todo.id === +curId){
                todos[index].completed = todos[index].completed ? false : true;
            } 
        })
        let arr =[];
        let remove = [];
        todos.forEach((todo, index) => {
            if(todos[index].completed === true){
                element.parentNode.remove(element);
                arr.push(todos[index]);
            }else{
                remove.push(todos[index])
            }
        })
        console.log(arr);
        let content = [];
        arr.map(todo  => {
            const {text, id, completed} = todo;
            const Complete = completed ? 'checkedLine' : '';
            const statusIcon = completed ? 'fa-check-circle' : 'fa-circle';
            content +=`
            <li class="item">
            <p class="text ${Complete}">${text}</p>
            <i class="far ${statusIcon} co complete" action="complete" id="${id}"></i>
            <i class="far fa-trash-alt delete" action="delete" id="${id}"></i>
            </li>`;
        });
        let item = [];
        remove.map(todo  => {
            const {text, id, completed} = todo;
            const Complete = completed ? 'checkedLine' : '';
            const statusIcon = completed ? 'fa-check-circle' : 'fa-circle';
            item +=`
            <li class="item">
            <p class="text ${Complete}">${text}</p>
            <i class="far ${statusIcon} co complete" action="complete" id="${id}"></i>
            <i class="far fa-trash-alt delete" action="delete" id="${id}"></i>
            </li>`;
        });
        remove.forEach(todo => {
            displayToDo(todo.text, todo.id, todo.completed)
        })
        document.querySelector('#completed').innerHTML = content;
        ToDoBtn.innerHTML = item;
        localStorage.setItem('ToDo', JSON.stringify(todos));
}

// This method is for checking and removing items 
const checkAction = (event) => {
    const element = event.target;
    if(element.attributes.action){
        const elementAction = element.attributes.action.value;
        if(elementAction === 'delete'){
            removeToDo(element);
        }else{
            completeToDo(element);
        }
    }
}
// AddEventListener 
ToDoBtn.addEventListener('click', checkAction)
document.querySelector('#completed').addEventListener('click', checkAction)
// Clear all todo
const clearToDo = () => {
    ToDoBtn.innerHTML = '';
    document.querySelector('#completed').innerHTML = '';
    localStorage.clear();
}
document.querySelector('#clearAll').addEventListener('click', clearToDo)
window.clearToDo = clearToDo;

// Sort for array
// Ascending order
const arrangeAscending = () =>{
    const todos = getToDo();
    const checkTask = todos.filter(todo => todo.completed === true)
    const uncheckTask = todos.filter(todo => todo.completed === false)
    checkTask.sort((a, b) => {
        if(a.text.toLowerCase() > b.text.toLowerCase()) {return 1;}
        // return value > 0: a will come after b
        // return value < 0: a will come before b
        // return 0: a and b will stay unchanged
        if(a.text.toLowerCase() < b.text.toLowerCase()) {return -1;}
        return 0;
    })
    uncheckTask.sort((a, b) => {
        if(a.text.toLowerCase() > b.text.toLowerCase()) {return 1;}
        // return value > 0: a will come after b
        // return value < 0: a will come before b
        // return 0: a and b will stay unchanged
        if(a.text.toLowerCase() < b.text.toLowerCase()) {return -1;}
        return 0;
    })
    let content = [];
    checkTask.map(todo  => {
    const {text, id, completed} = todo;
    const Complete = completed ? 'checkedLine' : '';
    const statusIcon = completed ? 'fa-check-circle' : 'fa-circle';
    content +=`<li class="item">
        <p class="text ${Complete}">${text}</p>
        <i class="far ${statusIcon} co complete" action="complete" id="${id}"></i>
        <i class="far fa-trash-alt delete" action="delete" id="${id}"></i>
        </li>`;
    });
    let item = '';
    uncheckTask.map(todo  => {
        const {text, id, completed} = todo;
        const Complete = completed ? 'checkedLine' : '';
        const statusIcon = completed ? 'fa-check-circle' : 'fa-circle';
        item +=`<li class="item">
        <p class="text ${Complete}">${text}</p>
        <i class="far ${statusIcon} co complete" action="complete" id="${id}"></i>
        <i class="far fa-trash-alt delete" action="delete" id="${id}"></i>
        </li>`;
    });
    ToDoBtn.innerHTML = item;
    document.querySelector('#completed').innerHTML = content;
    localStorage.setItem('ToDo', JSON.stringify(todos));
}
document.querySelector('#two').addEventListener('click', arrangeAscending)

// Descending order
const arrangeDescending = () => {
    const todos = getToDo();
    const checkTask = todos.filter(todo => todo.completed === true)
    const uncheckTask = todos.filter(todo => todo.completed === false)
    checkTask.sort((a, b) => {
        if(b.text.toLowerCase() > a.text.toLowerCase()) {return 1};
        if(b.text.toLowerCase() < a.text.toLowerCase()) {return -1;}
        return 0;
    })
    uncheckTask.sort((a, b) => {
        if(b.text.toLowerCase() > a.text.toLowerCase()) {return 1};
        if(b.text.toLowerCase() < a.text.toLowerCase()) {return -1;}
        return 0;
    })
    let content = [];
    checkTask.map(todo  => {
    const {text, id, completed} = todo;
    const Complete = completed ? 'checkedLine' : '';
    const statusIcon = completed ? 'fa-check-circle' : 'fa-circle';
    content +=`<li class="item">
        <p class="text ${Complete}">${text}</p>
        <i class="far ${statusIcon} co complete" action="complete" id="${id}"></i>
        <i class="far fa-trash-alt delete" action="delete" id="${id}"></i>
        </li>`;
    });
    let item = '';
    uncheckTask.map(todo  => {
        const {text, id, completed} = todo;
        const Complete = completed ? 'checkedLine' : '';
        const statusIcon = completed ? 'fa-check-circle' : 'fa-circle';
        item +=`<li class="item">
        <p class="text ${Complete}">${text}</p>
        <i class="far ${statusIcon} co complete" action="complete" id="${id}"></i>
        <i class="far fa-trash-alt delete" action="delete" id="${id}"></i>
        </li>`;
    });
    ToDoBtn.innerHTML = item;
    document.querySelector('#completed').innerHTML = content;
    localStorage.setItem('ToDo', JSON.stringify(todos));
}
document.querySelector('#three').addEventListener('click', arrangeDescending )

// Display completed task and todo task on the user's interface
const displayItem = () => {
    const todos = getToDo();
    let array = [];
    let List = [];
    todos.forEach((todo, index) => {
        if(todos[index].completed === true){
            array.push(todos[index]);
        }else{
            List.push(todos[index])
        }
    })
    let content = [];
    List.map(todo  => {
        const {text, id, completed} = todo;
        const Complete = completed ? 'checkedLine' : '';
        const statusIcon = completed ? 'fa-check-circle' : 'fa-circle';
        content +=`
        <li class="item">
        <p class="text ${Complete}">${text}</p>
        <i class="far ${statusIcon} co complete" action="complete" id="${id}"></i>
        <i class="far fa-trash-alt delete" action="delete" id="${id}"></i>
        </li>`;
    });
    let item = [];
    array.map(todo  => {
        const {text, id, completed} = todo;
        const Complete = completed ? 'checkedLine' : '';
        const statusIcon = completed ? 'fa-check-circle' : 'fa-circle';
        item +=`
        <li class="item">
        <p class="text ${Complete}">${text}</p>
        <i class="far ${statusIcon} co complete" action="complete" id="${id}"></i>
        <i class="far fa-trash-alt delete" action="delete" id="${id}"></i>
        </li>`;
    });
    ToDoBtn.innerHTML = content;
    document.querySelector('#completed').innerHTML = item;
}
displayItem()

// Handle button to check all to do list
document.getElementById('one').addEventListener('click', () =>{
    let todos = getToDo();
    const uncheck = todos.filter(item => item.completed === false);
    uncheck.forEach((todo, index) => {
       todo.completed = true;
    })
    let content = [];
    uncheck.map(todo  => {
        const {text, id, completed} = todo;
        content +=`
        <li class="item">
        <p class="text checkedLine">${text}</p>
        <i class="far fa-check-circle co complete" action="complete" id="${id}"></i>
        <i class="far fa-trash-alt delete" action="delete" id="${id}"></i>
        </li>`;
    });
    ToDoBtn.innerHTML = '';
    console.log(todos);
    let result = [];
    todos.map((todo, index) =>{
        const {text, id, completed} = todo;
        const Complete = completed ? 'checkedLine' : '';
        const statusIcon = completed ? 'fa-check-circle' : 'fa-circle';
        result +=`
        <li class="item">
        <p class="text ${Complete}">${text}</p>
        <i class="far ${statusIcon} co complete" action="complete" id="${id}"></i>
        <i class="far fa-trash-alt delete" action="delete" id="${id}"></i>
        </li>`;
    })
    document.querySelector('#completed').innerHTML = result;
    localStorage.setItem('ToDo', JSON.stringify(todos));
})