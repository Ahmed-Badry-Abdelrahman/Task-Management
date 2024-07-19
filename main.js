document.getElementById('search-container-icon').addEventListener('click', function () {
    document.getElementById('search-box').classList.toggle('active');
    document.getElementById('search-icon').classList.toggle('active');
})

document.querySelectorAll('.top-bar-items').forEach(item => {
    item.addEventListener('click', () => {
        document.querySelectorAll('.top-bar-items').forEach(i => i.classList.remove('active'))
        item.classList.add('active')
    })
})



////////////////////////////////////////////////
let viewId;

// Ensure DOM is loaded before adding event listeners
document.addEventListener('DOMContentLoaded', (event) => {
    const openPopupAddView = document.getElementById('openPopupBtnAddView');
    const popupForNewView = document.getElementById('popup-add-view');
    const closeViewBtn = document.querySelector('.close-btn-view');
    const saveViewBtn = document.getElementById('save-view-btn');

    const popupForNewTask = document.getElementById('popup-add-task');
    const closeTaskBtn = document.querySelector('.close-btn-task');

    const openTask = document.getElementById('openTask');
    const popupTask = document.getElementById('popup-task-edit');
    const closeTask = document.querySelector('.close-task');

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
            viewId = getViewContainingButton(event.target);
            popupForNewTask.style.display = 'block';
        }
    });

    // Close the 'Add Task' popup
    closeTask.addEventListener('click', () => {
        popupTask.style.display = 'none';
    });

    // Event delegation for dynamically open 'task' 
    document.getElementById('views-containers').addEventListener('click', (event) => {
        if (event.target.closest('#openTask')) {
            const taskId = getViewContainingTask(event.target);
            const viewIdContainTask = getViewContainingButton(event.target);
            popupTask.style.display = 'block';
            displayTaskInformation(taskId, viewIdContainTask)
            document.getElementById('popup-task-edit').setAttribute('taskId', taskId)
            document.getElementById('popup-task-edit').setAttribute('viewIdContainTask', viewIdContainTask)
        }
    });

    // Event delegation for dynamically add new subtask in spastic view inside spastic task
    document.getElementById('add-new-subTask').addEventListener('click', () => {
        const subTasks = document.querySelectorAll('.sub-task-title-add');
        console.log(subTasks)
        const lastSubTask = Array.from(subTasks)[subTasks.length - 1];
        const lastSubTaskId = lastSubTask.getAttribute('id');
        if (lastSubTaskId === 'subTask7') {
            return;
        } else {
            addSubTask('subtasks-container-add');
        }
    })

    // // Event delegation for dynamically adding new subtask in specific view inside specific task (in edit)
    // document.getElementById('views-containers').addEventListener('click', (event) => {
    //     if (event.target.closest('#openTask')) {
    //         const taskId = getViewContainingTask(event.target);
    //         const viewIdContainTask = getViewContainingButton(event.target);

    //         document.getElementById('add-new-subTask-ed').addEventListener('click', () => {
    //             const subTasks = document.querySelectorAll('.sub-task-title-add');
    //             const lastSubTask = Array.from(subTasks)[subTasks.length - 1];
    //             const lastSubTaskId = lastSubTask ? lastSubTask.getAttribute('id') : null;

    //             if (lastSubTaskId === 'subTask8') {
    //                 return;
    //             } else {
    //                 addSubTaskEdit(viewIdContainTask, taskId);
    //             }
    //         });
    //     }
    // });

    // Save task button event listener
    document.getElementById('ed-save-task-btn').addEventListener('click', function () {
        const popupTaskEdit = document.getElementById('popup-task-edit');
        const viewIdContainTask = popupTaskEdit.getAttribute('viewIdContainTask');
        const taskId = popupTaskEdit.getAttribute('taskId');
        updateTask(viewIdContainTask, taskId);
        // Close the popup
        document.getElementById('popup-task-edit').style.display = 'none';
    });


    // Ensure that this function is called after updating the subtask statuses
    document.getElementById('save-task-btn').addEventListener('click', () => {
        if (viewId !== null) {
            getTaskInfo(viewId);
            displayTasks(viewId, );
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

    views.forEach((view, index) => {
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
        viewDiv.setAttribute('data-view-id', index); // Assign a data attribute to the view
        iAddTask.classList.add('fa-solid', 'fa-circle-plus');
        spanAddTaskContainer.setAttribute('id', 'add-new-task');

        spanAddTask.appendChild(spanAddTaskText);
        spanAddTaskContainer.append(iAddTask, spanAddTask);
        h5Header.appendChild(h5HeaderText);
        viewHeader.append(h5Header, spanAddTaskContainer);
        viewDiv.append(viewHeader);

        viewsContainer.append(viewDiv);

        // Display tasks for this view
        displayTasks(index);
    });
}

// Get the specific view id containing the clicked 'Add new task' button
function getViewContainingButton(target) {
    return target.closest('.view').getAttribute('data-view-id');
}

// Get the specific view id containing the clicked 'task' 
function getViewContainingTask(target) {
    return target.closest('.task-card').getAttribute('data-task-id');
}


// Function to get task information and associate it with a specific view
function getTaskInfo(viewId) {
    const taskTitle = document.getElementById('task-title-add').value;
    const taskDescription = document.getElementById('task-description-add').value;
    const taskDate = document.getElementById('task-date-add').value;
    const subTasksElements = document.querySelectorAll('.sub-task-info-add'); // Ensure this matches the dynamically added subtasks

    // Extract subtasks information
    const subTasks = Array.from(subTasksElements).map(subTask => {
        const subTaskTitleElement = subTask.querySelector('.sub-task-title-add');
        const subTaskStatusElement = subTask.querySelector('.sub-task-checkbox-add'); // Updated to match the dynamically added checkbox class

        if (!subTaskTitleElement || !subTaskStatusElement) {
            console.error('Subtask elements not found for a subtask');
            return null;
        }

        return {
            title: subTaskTitleElement.value,
            status: subTaskStatusElement.checked
        };
    }).filter(subTask => subTask !== null); // Filter out any null subtasks

    const task = {
        title: taskTitle,
        description: taskDescription,
        date: taskDate,
        subTasks: subTasks,
        get checkedTasks() {
            const totalSubTasks = subTasks.length;
            const completedSubTasks = this.subTasks.filter(subTask => subTask.status === true).length;
            const progressPercentage = totalSubTasks === 0 ? 0 : (completedSubTasks / totalSubTasks) * 100;
            return progressPercentage
        }
    };


    // Fetch the view from local storage
    const views = JSON.parse(localStorage.getItem('views')) || [];
    const view = views[viewId];

    console.log(`View info =>`, view);
    console.log(`Task info =>`, task);

    // Optionally, you could add the task to the view and update local storage
    if (view) {
        if (!view.tasks) {
            // create the array will contain tasks objects if its the first task added
            view.tasks = [];
        }
        // push tasks to the view
        view.tasks.push(task);
        // update this view in the views array
        views[viewId] = view;
        // update local storage
        localStorage.setItem('views', JSON.stringify(views));
    }

    // Clear fields
    document.getElementById('task-title-add').value = '';
    document.getElementById('task-description-add').value = '';
    document.getElementById('task-date-add').value = '';
    subTasksElements.forEach(subTask => {
        subTask.querySelector('.sub-task-title-add').value = '';
        subTask.querySelector('.sub-task-checkbox-add').checked = false;
    });

    // Close the popup
    document.getElementById('popup-add-task').style.display = 'none';

    // remove the new subtasks that is add 
    subTasksElements.forEach(subTask => {
        if (!subTask.classList.contains('first-one')) {
            subTask.remove();
        }
    });

    // Handle progress bar
    // updateProgressBar(subTasks);
}






// Function to display tasks in the specific view
function displayTasks(viewId, progressPercentage) {
    const views = JSON.parse(localStorage.getItem('views')) || [];
    const view = views[viewId];
    const tasks = view.tasks || [];
    console.log(`Tasks =>`, tasks);

    // Clear the current tasks in the view
    const viewContainer = document.querySelector(`.view[data-view-id="${viewId}"]`);
    if (viewContainer) {
        const existingTasks = viewContainer.querySelectorAll('.task-card');
        existingTasks.forEach(task => task.remove());
    }

    // Iterate over the tasks and create task cards
    tasks.forEach((task, index) => {
        const { title, description, date, subTasks } = task;
        const numOfCheckedTasks = subTasks.filter(subTask => subTask.status).length;
        const numOfSubTasks = subTasks.length
        console.log(`Task ${index}:`, task);
        console.log(`Number of completed sub-tasks: ${numOfCheckedTasks}`);

        createTaskCard(viewId, title, description, date, index, numOfCheckedTasks, numOfSubTasks, progressPercentage);


    });
}

// Function to create task card
function createTaskCard(viewId, taskTitle, taskDescription, taskDate, index, numOfCheckedTask = 0, numOfSubTasks = 0, progressPercentage = 0) {
    const taskCard = document.createElement('div');
    taskCard.classList.add('task-card');
    taskCard.setAttribute('data-task-id', index);
    taskCard.append(
        createTaskHeader(taskTitle, taskDescription),
        createTaskBody(numOfCheckedTask, numOfSubTasks, progressPercentage),
        createTaskFooter(taskDate)
    );

    const viewContainer = document.querySelector(`.view[data-view-id="${viewId}"]`);
    if (viewContainer) {
        viewContainer.append(taskCard);
    }
}

// Function to create task header
function createTaskHeader(taskTitle, taskDescription) {
    const taskCardHeader = document.createElement('div');
    taskCardHeader.classList.add('task-card-header');

    const cardTitle = document.createElement('div');
    cardTitle.classList.add('card-title');

    const h4 = document.createElement('h4');
    h4.textContent = taskTitle;

    const h5 = document.createElement('h5');
    h5.textContent = taskDescription;

    const menu = document.createElement('div');
    menu.classList.add('menu');
    menu.setAttribute('id', 'openTask');

    const span1 = document.createElement('span');
    const span2 = document.createElement('span');
    const span3 = document.createElement('span');

    menu.append(span1, span2, span3);
    cardTitle.append(h4, h5);
    taskCardHeader.append(cardTitle, menu);

    return taskCardHeader;
}

// Function to create task body
function createTaskBody(numOfCheckedTask, numOfSubTasks) {
    const taskCardBody = document.createElement('div');
    taskCardBody.classList.add('task-card-body');

    const topBodyContent = document.createElement('div');
    topBodyContent.classList.add('top-body-content');

    const left = document.createElement('div');
    left.classList.add('left');

    const i = document.createElement('i');
    i.classList.add('fa-regular', 'fa-rectangle-list');

    const p = document.createElement('p');
    p.textContent = 'Progress';

    const right = document.createElement('div');
    right.classList.add('right');

    const span = document.createElement('span');
    const span1 = document.createElement('span');
    span1.textContent = numOfCheckedTask; // Placeholder value, replace with actual progress
    span.appendChild(span1);
    span.textContent += `/ ${numOfSubTasks}`; // Placeholder value, replace with actual total tasks

    right.appendChild(span);

    const progressBar = document.createElement('div');
    progressBar.classList.add('progress-bar');

    const progressBarInner = document.createElement('div');
    progressBarInner.classList.add('progress-bar-inner');
    progressBarInner.style.width = numOfCheckedTask / numOfSubTasks * 100 + '%'; //
    const progressPercentage = (numOfCheckedTask / numOfSubTasks) * 100;

    // if all subtasks cheaked make background is green 
    if (numOfCheckedTask === numOfSubTasks) {
        progressBarInner.style.backgroundColor = '#48ff5a';
    } else if (progressPercentage < 100 && progressPercentage > 30) {
        progressBarInner.style.backgroundColor = '#FF9F48';
    } else {
        progressBarInner.style.backgroundColor = '#ff4848';
    }



    progressBar.appendChild(progressBarInner);
    left.append(i, p);
    topBodyContent.append(left, right);
    taskCardBody.append(topBodyContent, progressBar);

    return taskCardBody;
}

// Function to create card footer
function createTaskFooter(taskDate) {
    const taskCardFooter = document.createElement('div');
    taskCardFooter.classList.add('task-card-footer');

    const day = document.createElement('span');
    day.classList.add('day');
    day.textContent = taskDate;

    const commentsAttachments = document.createElement('div');
    commentsAttachments.classList.add('comments-attachments');

    const comments = document.createElement('div');
    comments.classList.add('comments');

    const commentsIcon = document.createElement('i');
    commentsIcon.classList.add('fa-regular', 'fa-message');
    const commentsSpan = document.createElement('span');
    commentsSpan.textContent = '23'; // Placeholder value, replace with actual comments count
    comments.append(commentsIcon, commentsSpan);

    const attachments = document.createElement('div');
    attachments.classList.add('attachments');

    const attachmentsIcon = document.createElement('i');
    attachmentsIcon.classList.add('fa-solid', 'fa-paperclip');
    const attachmentsSpan = document.createElement('span');
    attachmentsSpan.textContent = '3'; // Placeholder value, replace with actual attachments count
    attachments.append(attachmentsIcon, attachmentsSpan);

    commentsAttachments.append(comments, attachments);
    taskCardFooter.append(day, commentsAttachments);

    return taskCardFooter;
}



// Function to display task information 
function displayTaskInformation(taskId, viewId) {
    const views = JSON.parse(localStorage.getItem('views'));
    const view = views[viewId];
    const task = view.tasks[taskId];

    // Clear existing subtasks container except the div with class 'head-div'
    const subTasksContainer = document.getElementById('ed-subtasks-container');
    const headDiv = subTasksContainer.querySelector('.head-div');
    subTasksContainer.innerHTML = '';
    if (headDiv) {
        subTasksContainer.appendChild(headDiv);
    }


    // Populate main task fields
    document.getElementById('ed-task-title').value = task.title || '';
    document.getElementById('ed-task-name').value = task.title || ''; // Example of setting a fallback value
    document.getElementById('ed-task-date').value = task.date || '';
    document.getElementById('ed-task-description').value = task.description || '';

    // Loop through subtasks and populate values
    task.subTasks.forEach((subTask, index) => {
        const subTaskContainer = document.createElement('div');
        subTaskContainer.classList.add('row', 'sub-task-info-add');

        const subTaskInput = document.createElement('input');
        subTaskInput.type = 'text';
        subTaskInput.className = 'ed-sub-task-title';
        subTaskInput.value = subTask.title || '';
        subTaskContainer.appendChild(subTaskInput);

        const subTaskCheckBox = document.createElement('input');
        subTaskCheckBox.type = 'checkbox';
        subTaskCheckBox.className = 'ed-sub-task-checkbox';
        subTaskCheckBox.checked = subTask.status || false;
        subTaskContainer.appendChild(subTaskCheckBox);

        const subTaskIcon = document.createElement('i');
        subTaskIcon.className = 'fa-solid fa-trash delete';
        subTaskContainer.appendChild(subTaskIcon);

        subTasksContainer.appendChild(subTaskContainer);
    });
}

function addSubTask(containerId) {
    const subTasks = document.querySelectorAll('.sub-task-title-add');
    const subTaskCount = subTasks.length;

    const subTask = document.createElement('input');
    subTask.type = 'text';
    subTask.className = 'sub-task-title-add';
    subTask.placeholder = 'Subtask Title';
    subTask.id = 'subTask' + subTaskCount;

    const subTaskCheckBox = document.createElement('input');
    subTaskCheckBox.type = 'checkbox';
    subTaskCheckBox.className = 'sub-task-checkbox-add'; // Ensure this matches the expected class name in getTaskInfo

    const subTaskIcon = document.createElement('i');
    subTaskIcon.className = 'fa-solid fa-trash delete';

    const subTaskContainer = document.createElement('div');
    subTaskContainer.classList.add('row', 'sub-task-info-add'); // Ensure this matches the expected class name in getTaskInfo

    subTaskContainer.appendChild(subTask);
    subTaskContainer.appendChild(subTaskCheckBox);
    subTaskContainer.appendChild(subTaskIcon);

    // Insert the new subtask container into the DOM
    const container = document.getElementById(containerId); // Ensure this ID matches your container
    container.appendChild(subTaskContainer);
}

// Function to get the editable information from popup and update the task in the view then display the newest task
function updateTask(viewIndex, taskIndex) {
    const taskTitle = document.getElementById('ed-task-name').value;
    const taskDescription = document.getElementById('ed-task-description').value;
    const taskDueDate = document.getElementById('ed-task-date').value;
    const taskSubTasks = getSubTasks();

    const views = JSON.parse(localStorage.getItem('views'));

    // Log the views and indices for debugging
    console.log('Views:', views);
    console.log('View Index:', viewIndex);
    console.log('Task Index:', taskIndex);

    // Access the view and task using the indices directly
    const view = views[viewIndex];

    // Check if the view is found
    if (!view) {
        console.error('View not found');
        return;
    }

    // Check if the task is found
    const task = view.tasks[taskIndex];
    if (!task) {
        console.error('Task not found');
        return;
    }

    // Log the view and task for debugging
    console.log('View:', view);
    console.log('Task:', task);

    // Log task details for debugging
    console.log(taskTitle);
    console.log(taskDescription);
    console.log(taskDueDate);
    console.log(taskSubTasks);

    // Update the task details
    task.title = taskTitle;
    task.description = taskDescription;
    task.dueDate = taskDueDate;
    task.subTasks.forEach((subTask, index) => {
        subTask.title = taskSubTasks[index].title;
        subTask.status = taskSubTasks[index].checked;
    })

    // Save the updated views back to localStorage
    localStorage.setItem('views', JSON.stringify(views));
    displayViews()
}

// Function to get the subtasks
function getSubTasks() {
    const subTasksElements = document.querySelectorAll('.sub-task-info-add');
    const subTasks = [];

    subTasksElements.forEach(subTaskElement => {
        const subTaskTitleElement = subTaskElement.querySelector('.ed-sub-task-title');
        const subTaskCheckBoxElement = subTaskElement.querySelector('.ed-sub-task-checkbox');

        // Check if the elements exist
        if (subTaskTitleElement && subTaskCheckBoxElement) {
            const subTaskTitle = subTaskTitleElement.value;
            const subTaskCheckBox = subTaskCheckBoxElement.checked;

            subTasks.push({
                title: subTaskTitle,
                checked: subTaskCheckBox
            });
        } else {
            console.warn('Subtask elements not found in:', subTaskElement);
        }
    });

    return subTasks;
}

function updateProgressBar(progressPercentage) {

    console.log('progressPercentage' + progressPercentage)
    // Update the width of the progress bar
    progressBar.style.width = `${progressPercentage}%`;

    // Save progress percentage to localStorage
    localStorage.setItem('progressPercentage', progressPercentage);

    // Update the background color based on progress
    if (progressPercentage <= 30) {
        progressBar.style.backgroundColor = 'red';
    } else if (progressPercentage > 30 && progressPercentage < 100) {
        progressBar.style.backgroundColor = 'orange';
    } else {
        progressBar.style.backgroundColor = 'green';
    }
}

// document.addEventListener('DOMContentLoaded', () => {


//     if (localStorage.getItem('progressPercentage')) {
//         const progressBar = document.querySelector('.progress-bar-inner');
//         // Retrieve saved progress percentage from localStorage
//         const savedPercentage = localStorage.getItem('progressPercentage');

//         if (savedPercentage !== null) {
//             progressBar.style.width = `${savedPercentage}%`;

//             // Set the background color based on saved progress percentage
//             const progressPercentage = parseFloat(savedPercentage);
//             if (progressPercentage <= 30) {
//                 progressBar.style.backgroundColor = 'red';
//             } else if (progressPercentage > 30 && progressPercentage < 100) {
//                 progressBar.style.backgroundColor = 'orange';
//             } else {
//                 progressBar.style.backgroundColor = 'green';
//             }
//         } else {
//             console.log('No saved progress found');
//         }
//     }
// });




// // Function to add new subtask in edit case
// function addSubTaskEdit(viewId, taskId) {
//     const views = JSON.parse(localStorage.getItem('views'));
//     const view = views[viewId];
//     const task = view.tasks[taskId];
//     const subTasks = task.subTasks;
//     const subTaskCount = subTasks.length;

//     if (subTaskCount >= 8) {
//         alert('You can add a maximum of 8 subtasks.');
//         return;
//     }

//     const subTask = document.createElement('input');
//     subTask.type = 'text';
//     subTask.className = 'sub-task-title-add';
//     subTask.placeholder = 'Subtask Title';
//     subTask.id = `subTask${subTaskCount + 1}`;

//     const subTaskCheckBox = document.createElement('input');
//     subTaskCheckBox.type = 'checkbox';
//     subTaskCheckBox.className = 'sub-task-checkbox-add'; // Ensure this matches the expected class name in getTaskInfo

//     const subTaskIcon = document.createElement('i');
//     subTaskIcon.className = 'fa-solid fa-trash delete';

//     const subTaskContainer = document.createElement('div');
//     subTaskContainer.classList.add('row', 'sub-task-info-add'); // Ensure this matches the expected class name in getTaskInfo

//     subTaskContainer.appendChild(subTask);
//     subTaskContainer.appendChild(subTaskCheckBox);
//     subTaskContainer.appendChild(subTaskIcon);

//     // Insert the new subtask container into the DOM
//     const container = document.getElementById('ed-subtasks-container'); // Ensure this ID matches your container
//     container.appendChild(subTaskContainer);
// }






// let views = [
//     {
//         title: 'Work',
//         tasks: [
//             {
//                 title: 'Task 1',
//                 description: 'Description 1',
//                 date: '2022-01-01',
//                 subtasks: [
//                     {
//                         title: "t1",
//                         status: "true"
//                     }
//                 ],
//                  checkedTask:
//             },
//             {},
//             {}
//         ]
//     },
//     {},
//     {}
// ]


// localStorage.clear()