fetchTasksAndUpdateUI();
fetchTeamMembersAndPopulateCheckboxes();
addTask();

// Function to fetch tasks from the backend and update UI
function fetchTasksAndUpdateUI() {
       fetch('/tasks')
           .then(response => response.json())
           .then(tasks => {
               var backlogSection = document.getElementById("backlog-section");
               var inProgressSection = document.getElementById("in-progress-section");
               var completedSection = document.getElementById("completed-section");
               backlogSection.innerHTML = "";
               inProgressSection.innerHTML = "";
               completedSection.innerHTML = "";
               tasks.forEach(task => {

                   var newTaskCard =
                           '<div class="task-card" ' +
                                   'data-id="' + task.id + '" ' +
                                   'data-description="' + task.description + '" ' +
                                   'data-members="' + task.members + '" ' +
                                   'data-section="' + task.section + '" ' +  // Add the section attribute
                                   'onclick="openEditTaskModal(this)">';

                       newTaskCard +=
                           '<div class="card-text">' + task.description + '</div>' +
                           '<div class="card-footer">';

                   var members = task.members.split(",");
                   for (var i = 0; i < Math.min(4, members.length); i++) {
                       newTaskCard += '<div class="member-icon">' + members[i].trim().toUpperCase() + '</div>';
                   }

                   newTaskCard += '</div></div>';

                   if(task.section === 1){
                        backlogSection.insertAdjacentHTML('beforeend', newTaskCard);
                   }else if(task.section === 2){
                        inProgressSection.insertAdjacentHTML('beforeend', newTaskCard);
                   }else if(task.section === 3){
                        completedSection.insertAdjacentHTML('beforeend', newTaskCard);
                   }

               });

               // Add the "Add Task" button at the end
               backlogSection.insertAdjacentHTML('beforeend', '<div class="task-card create-task-button">' +
                   '<button id="openCreateTaskModalBtn" class="create-task-button-btn" onclick="openCreateTaskModal()">' +
                   '<span class="create-task-button-icon">+</span>' +
                   '</button>' +
                   '</div>');
           })
           .catch(error => {
               console.error('Error:', error);
           });
   }

//CREATE TASK FUNCTIONS
function addTask(){
    var closeButton = document.querySelector(".modal-header .close");
          closeButton.onclick = function () {
              createTaskModal.style.display = "none";
          }

          closeButton.onclick = function () {
              closeCreateTaskModal();
          }


          var cancelButton = document.querySelector(".modal-footer .btn-secondary");
          cancelButton.onclick = function () {
              createTaskModal.style.display = "none";
          }

          cancelButton.onclick = function () {
              closeCreateTaskModal();
          }

          var createTaskBtn = document.getElementById("createTaskBtn");
          createTaskBtn.onclick = function () {

          // Get the selected checkboxes
              var selectedCheckboxes = document.querySelectorAll('input[name="teamMembers"]:checked');
              var selectedMembers = Array.from(selectedCheckboxes).map(checkbox => checkbox.value);

              var description = document.getElementById("taskDescription").value;
              var selectedMembersCheckboxes = document.querySelectorAll('input[name="teamMembers"]:checked');


              // Check if the description field is not empty
                if (description.trim() === "") {
                    alert("Please fill in the task description.");
                    return;
                }


                 // Get the names of selected team members and their corresponding icons
                    var selectedMembers = Array.from(selectedMembersCheckboxes).map(checkbox => {
                        var memberId = checkbox.id.split('-')[1]; // Get the member ID from checkbox ID
                        var memberIcon = getMemberIconById(memberId); //
                        return {
                            name: checkbox.value,
                            icon: memberIcon
                        };
                    });

             // Create the task request object
               var taskRequest = {
                   description: description,
                   members: selectedMembers.map(member => member.icon), // Only store member names
                   section: 1
               };

              // Send POST request to create the task
              fetch('/tasks', {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json'
                  },
                  body: JSON.stringify(taskRequest)
              })
              .then(response => response.text())
              .then(data => {
                  console.log(data);

                  var newTaskCard = '<div class="task-card" data-description="' + taskRequest.description +
                                  '" data-members="' + taskRequest.members.join(",") + '" onclick="openEditTaskModal(this)">' +
                                  '<div class="card-text">' + description + '</div>' +
                                  '<div class="card-footer">';

                   // Add member icons to the footer
                         selectedMembers.forEach(member => {
                             newTaskCard += '<div class="member-icon">' + member.icon + '</div>';
                         });

                  newTaskCard += '</div></div>';

                  // Create the new task card
                  logs(data,"CREATE",taskRequest.description);

                  // Get the "Create Task" button container
                  var createTaskButtonContainer = document.querySelector(".create-task-button");

                  // Insert the new task card before the "Create Task" button
                  createTaskButtonContainer.insertAdjacentHTML('beforebegin', newTaskCard);

                  // Clear input fields and uncheck checkboxes
                          document.getElementById("taskDescription").value = "";
                          selectedMembersCheckboxes.forEach(checkbox => checkbox.checked = false);


                  var newTaskCardElement = createTaskButtonContainer.previousElementSibling;

                  // Close the modal
                  closeCreateTaskModal();
                  location.reload();
              })
              .catch(error => {
                  console.error('Error:', error);
              });
          };
}

function openCreateTaskModal() {
    createTaskModal.style.display = "block";
    createTaskModalOverlay.style.display = "block"; // Show the overlay

}

// Close the modal and hide the overlay
function closeCreateTaskModal() {
    createTaskModal.style.display = "none";
    createTaskModalOverlay.style.display = "none"; // Hide the overlay
}

//UPDATE TASK FUNCTIONS

function updateTask(taskId, updatedTaskData) {
     fetch(`/tasks/${taskId}`, {
         method: 'PUT',
         headers: {
             'Content-Type': 'application/json'
         },
         body: JSON.stringify(updatedTaskData)
     })
     .then(response => response.text())
     .then(data => {
         console.log(data);

         // Move the task card to the appropriate section based on the updated section value
         moveTaskCardToSection(taskId, updatedTaskData.section);
     })
     .catch(error => {
         console.error('Error:', error);
     });

 }

function openEditTaskModal(taskCard) {
     var taskId = taskCard.getAttribute('data-id');
     var taskDescription = taskCard.getAttribute('data-description');
     var taskMembers = taskCard.getAttribute('data-members');
     var taskSection = taskCard.getAttribute('data-section');

     // Populate description field
     var descriptionField = document.getElementById("editTaskDescription");
     descriptionField.value = taskDescription;

     var sectionField = document.getElementById("sectionDropdown");
     sectionField.value = taskSection;

     populateEditCheckboxes();

     // Open edit modal
     editTaskModal.style.display = "block";
     editTaskModalOverlay.style.display = "block";

     // Attach event listener for the "Update Task" button
     var updateTaskButton = document.getElementById("updateTaskBtn");
     updateTaskButton.onclick = function () {
         var updatedDescription = descriptionField.value;
         var updatedMembers = [];
         // Get selected checkboxes and extract member IDs
         var selectedCheckboxes = document.querySelectorAll('input[name="teamMembers"]:checked');
         selectedCheckboxes.forEach(checkbox => {
             var memberId = checkbox.id.split('-')[1];
             var memberIcon = getMemberIconById(memberId);
             updatedMembers.push(memberIcon);
         });



         // Check if the description field is empty
         if (updatedDescription.trim() === "") {
             alert("Please fill in the task description.");
             return;
         }

         var updatedTaskData = {
             description: updatedDescription,
             members: updatedMembers,
             section: sectionField.value
         };

         updateTask(taskId, updatedTaskData);
         logs(taskId,"EDIT",taskDescription);
         // Close edit modal
         editTaskModal.style.display = "none";
         editTaskModalOverlay.style.display = "none";

         // Refresh tasks after updating
         location.reload();
     };






     var deleteTaskButton = document.getElementById("deleteTaskBtn");
     deleteTaskButton.onclick = function () {
      var confirmationDialog = document.getElementById("confirmationDialog");
      confirmationDialog.style.display = "block";

      var confirmDeleteButton = document.getElementById("confirmDeleteBtn");
      confirmDeleteButton.onclick = function () {
          var taskId = taskCard.getAttribute('data-id');
          logs(taskId,"DELETE",taskDescription);
          deleteTask(taskId);
          confirmationDialog.style.display = "none";

          // Close the edit modal
          var editTaskModal = document.getElementById("editTaskModal");
          var editTaskModalOverlay = document.getElementById("editTaskModalOverlay");
          editTaskModal.style.display = "none";
          editTaskModalOverlay.style.display = "none";
          location.reload();
      };

      var cancelDeleteButton = document.querySelector("#confirmationDialog .modal-footer .btn-secondary");
      cancelDeleteButton.onclick = function () {
          confirmationDialog.style.display = "none";

      };

      var closeDeleteButton = document.querySelector("#confirmationDialog .modal-header .close");
      closeDeleteButton.onclick = function () {
          confirmationDialog.style.display = "none";

      };
  };

     var cancelEditButton = document.getElementById("cancelEditButton");
     cancelEditButton.onclick = function(){
         editTaskModal.style.display = "none";
         editTaskModalOverlay.style.display = "none";
         location.reload();
     }

     var cancelEditX = document.getElementById("cancelEditX");
     cancelEditX.onclick = function(){
         editTaskModal.style.display = "none";
         editTaskModalOverlay.style.display = "none";
         location.reload();
     }

 }

// Function to fetch team members and populate checkboxes
function fetchTeamMembersAndPopulateCheckboxes() {
      // Reset the memberIcons object
        memberIcons = {};
        fetch('/teammembers')
            .then(response => response.json())
            .then(members => {
                var memberCheckboxesDiv = document.getElementById('memberCheckboxes');
                //memberCheckboxesDiv.innerHTML = '';

                members.forEach(member => {
                    var checkbox = document.createElement('input');
                    checkbox.type = 'checkbox';
                    checkbox.value = member.fullName;
                    checkbox.name = 'teamMembers';
                    checkbox.id = `checkbox-${member.id}`;

                    var label = document.createElement('label');
                    label.setAttribute('for', `checkbox-${member.id}`);
                    label.innerHTML = member.fullName;

                    memberCheckboxesDiv.appendChild(checkbox);
                    memberCheckboxesDiv.appendChild(label);
                    memberCheckboxesDiv.appendChild(document.createElement('br'));

                    // Store member icon along with name in the memberIcons object
                    memberIcons[member.id] = member.icon;
                });
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

// Object to store member icons
    var memberIcons = {};

function getMemberIconById(memberId) {
    return memberIcons[memberId] || '';
}

function populateEditCheckboxes(){
    // Reset the memberIcons object
      memberIcons = {};
       fetch('/teammembers')
              .then(response => response.json())
              .then(members => {
                  var memberCheckboxesDiv = document.getElementById('memberCheckboxes2');
                  memberCheckboxesDiv.innerHTML = '';

                  members.forEach(member => {
                        var checkbox = document.createElement('input');
                        checkbox.type = 'checkbox';
                        checkbox.value = member.fullName;
                        checkbox.name = 'teamMembers';
                        checkbox.id = `checkbox-${member.id}`;

                        var label = document.createElement('label');
                        label.setAttribute('for', `checkbox-${member.id}`);
                        label.innerHTML = member.fullName;

                        memberCheckboxesDiv.appendChild(checkbox);
                        memberCheckboxesDiv.appendChild(label);
                        memberCheckboxesDiv.appendChild(document.createElement('br'));

                        // Store member icon along with name in the memberIcons object
                        memberIcons[member.id] = member.icon;

                        checkbox.checked = true;

                  });

              })
              .catch(error => {
               console.error('Error:', error);
               });

  }

function moveTaskCardToSection(taskId, newSection) {
    var taskCard = document.querySelector(`.task-card[data-id="${taskId}"]`);
    var targetSection = document.getElementById(newSection + "-section");
    targetSection.appendChild(taskCard);
}

//DELETE TASK FUNCTIONS

function deleteTask(taskId) {
    fetch(`/tasks/${taskId}`, {
        method: 'DELETE',
    })
    .then(response => {
        if (response.ok) {
            // Remove the task card from the UI
            var taskCard = document.querySelector(`[data-id="${taskId}"]`);
            if (taskCard) {
                taskCard.remove();
            }
            console.log('Task deleted successfully.');
        } else {
            console.error('Error deleting task.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

//LOGS FUNCTIONS

function logs(taskId, message, taskDescription) {

    let createRequest = "";

    switch (message) {
        case "CREATE": {
            createRequest = {
                taskId: taskId,
                taskDescription: taskDescription,
                statusMessage: "Task-ul a fost creat !"
            };

            break;
        }
        case "EDIT": {
            createRequest = {
            taskId: taskId,
            taskDescription: taskDescription,
            statusMessage: "Task-ul a fost editat !"
            };

            break;
        }
        case "DELETE": {

            createRequest = {
            taskId: taskId,
            taskDescription: taskDescription,
            statusMessage: "Task-ul a fost sters !"
            };

            break;

        }
        default: {
            console.log("Error on initializing createRequest");
            return;
        }
    }

    fetch('/logs', {
    method: 'POST',
    headers: {
    'Content-Type': 'application/json'
    },
    body: JSON.stringify(createRequest)
    })
    .then(response => response.json())
    .then(result => {
    console.log(result);
    })
    .catch(error => console.error('Logs error:', error));
}

//LOGOUT FUNCTIONS
function logout(){
    window.location.href="/";
}
