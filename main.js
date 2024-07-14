document.getElementById('search-container-icon').addEventListener('click', function(){
    document.getElementById('search-box').classList.toggle('active');
    document.getElementById('search-icon').classList.toggle('active');
})

document.querySelectorAll('.top-bar-items').forEach(item => {
    item.addEventListener('click', ()=> {
        document.querySelectorAll('.top-bar-items').forEach(i => i.classList.remove('active'))
        item.classList.add('active')
    })
})


// document.addEventListener('DOMContentLoaded', (event) => {
//     if(localStorage.getItem('views') !== null){
//         const openPopupBtn = document.getElementById('openPopupBtnTask');
//         const popup = document.getElementById('popup-task-edit');
//         const closeBtn = document.querySelector('.close-btn-task');
    
//         openPopupBtn.addEventListener('click', () => {
//             popup.style.display = 'block';
//         });
    
//         closeBtn.addEventListener('click', () => {
//             popup.style.display = 'none';
//         });
    
//         window.addEventListener('click', (event) => {
//             if (event.target === popup) {
//                 popup.style.display = 'none';
//             }
//         });
//     }
// });



////////////////////////////////////////////////

document.addEventListener('DOMContentLoaded', (event) => {
    const openPopupAddView = document.getElementById('openPopupBtnAddView');
    const popupForNewView = document.getElementById('popup-add-view');
    const closeViewBtn = document.querySelector('.close-btn-view');
    const saveViewBtn = document.getElementById('save-view-btn');

    const popupForNewTask = document.getElementById('popup-add-task');
    const closeTaskBtn = document.querySelector('.close-btn-task');

    // Open the 'Add View' popup
    openPopupAddView.addEventListener('click', () => {
        popupForNewView.style.display = 'block';
    });

    // Close the 'Add View' popup
    closeViewBtn.addEventListener('click', () => {
        popupForNewView.style.display = 'none';
    });

    // Close the 'Add View' popup when clicking outside of it
    window.addEventListener('click', (event) => {
        if (event.target === popupForNewView) {
            popupForNewView.style.display = 'none';
        }
    });

    // Save the new view
    saveViewBtn.addEventListener('click', () => {
        addView();
        document.getElementById('view-title').value = '';
        displayViews();
    });

    // Close the 'Add Task' popup
    closeTaskBtn.addEventListener('click', () => {
        popupForNewTask.style.display = 'none';
    });

    // Close the 'Add Task' popup when clicking outside of it
    window.addEventListener('click', (event) => {
        if (event.target === popupForNewTask) {
            popupForNewTask.style.display = 'none';
        }
    });

    // Display views on initial load
    displayViews();

    // Event delegation for dynamically created 'Add new task' buttons
    document.getElementById('views-containers').addEventListener('click', (event) => {
        if (event.target.closest('#add-new-task')) {
            popupForNewTask.style.display = 'block';
        }
    });
});

// Add a new view to local storage
function addView() {
    const viewTitle = document.getElementById('view-title').value;
    const viewsKey = 'views';
    let views = JSON.parse(localStorage.getItem(viewsKey)) || [];

    views.push({ title: viewTitle });
    localStorage.setItem(viewsKey, JSON.stringify(views));
}

// Display views on the website
function displayViews() {
    const viewsKey = 'views';
    const viewsContainer = document.getElementById('views-containers');
    viewsContainer.innerHTML = '';

    const views = JSON.parse(localStorage.getItem(viewsKey)) || [];

    views.forEach(view => {
        const viewDiv = document.createElement('div');
        const viewHeader = document.createElement('div');
        const h5Header = document.createElement('h5');
        const spanAddTaskContainer = document.createElement('span');
        const spanAddTask = document.createElement('span');
        const iAddTask = document.createElement('i');

        const spanAddTaskText = document.createTextNode('Add new task');
        const h5HeaderText = document.createTextNode(view.title);

        viewHeader.classList.add('header');
        viewDiv.classList.add('view');
        iAddTask.classList.add('fa-solid', 'fa-circle-plus');
        spanAddTaskContainer.setAttribute('id', 'add-new-task');

        spanAddTask.appendChild(spanAddTaskText);
        spanAddTaskContainer.append(iAddTask, spanAddTask);
        h5Header.appendChild(h5HeaderText);
        viewHeader.append(h5Header, spanAddTaskContainer);
        viewDiv.append(viewHeader);

        viewsContainer.append(viewDiv);
    });
}



// localStorage.clear()


// let v = [
    //                 {
    //                     title: 'Work',
    //                     tasks: [
    //                         {
    //                             title: 'Task 1',
    //                             description: 'Description 1',
    //                             date: '2022-01-01',
    //                             subtasks: ['task1','sssssss']
    //                         },
    //                         {},
    //                         {}
    //                     ]
    //                 },
    //                 {},
    //                 {}
    //             ]
    
    // console.log(v[0].tasks[0].subtasks[1])