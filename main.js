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
    const subTasksElements = document.querySelectorAll('.sub-task-info-add');

    // Extract subtasks information
    const subTasks = Array.from(subTasksElements).map(subTask => {
        const subTaskTitleElement = subTask.querySelector('.sub-task-title-add');
        const subTaskStatusElement = subTask.querySelector('.sub-task-status-add');

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
        subTasks: subTasks
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
}

document.getElementById('save-task-btn').addEventListener('click', () => {
    // Assuming the viewId is stored in a global variable or can be determined in some way
    if (viewId !== null) {
        getTaskInfo(viewId);
        displayTasks(viewId);
    }
});

// Function to display tasks in the specific view
function displayTasks(viewId) {
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

        createTaskCard(viewId, title, description, date, index, numOfCheckedTasks, numOfSubTasks);
    });
}

// Function to create task card
function createTaskCard(viewId, taskTitle, taskDescription, taskDate, index, numOfCheckedTask = 0, numOfSubTasks = 0) {
    const taskCard = document.createElement('div');
    taskCard.classList.add('task-card');
    taskCard.setAttribute('data-task-id', index);
    taskCard.append(
        createTaskHeader(taskTitle, taskDescription),
        createTaskBody(numOfCheckedTask , numOfSubTasks),
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


// function to display task information 
function displayTaskInformation(taskId, viewId) {
    const views = JSON.parse(localStorage.getItem('views'))
    const view = views[viewId];
    const task = view.tasks[taskId];
    // Populate subtasks
    const subTasks = document.querySelectorAll('.ed-sub-task-title');
    const subTaskCheckBoxes = document.querySelectorAll('.ed-sub-task-checkbox');
    // Populate main task fields
    document.getElementById('ed-task-title').value = task.title || '';
    document.getElementById('ed-task-name').value = task.title || ''; // Example of setting a fallback value
    document.getElementById('ed-task-date').value = task.date || '';
    document.getElementById('ed-task-description').value = task.description || '';

    // Loop through subtasks and populate values
    Array.from(subTasks).forEach((subTask, index) => {
        if (task.subTasks && task.subTasks[index]) {
            subTask.value = task.subTasks[index].title || '';
        } else {
            subTask.value = ''; // Handle if subtask title is undefined
        }
    });

    // Loop through subtask checkboxes and set checked status
    Array.from(subTaskCheckBoxes).forEach((subTaskCheckBox, index) => {
        if (task.subTasks && task.subTasks[index]) {
            subTaskCheckBox.checked = task.subTasks[index].status || false;
        } else {
            subTaskCheckBox.checked = false; // Handle if subtask status is undefined
        }
    });
}



// // let v = [
// //     {
// //         title: 'Work',
// //         tasks: [
// //             {
// //                 title: 'Task 1',
// //                 description: 'Description 1',
// //                 date: '2022-01-01',
// //                 subtasks: [
// //                     {
// //                         taskContent: "skadaksl ad kaklw",
// //                         taskStatus: "completed"
// //                     }
// //                 ]
// //             },
// //             {},
// //             {}
// //         ]
// //     },
// //     {},
// //     {}
// // ]


// localStorage.clear()