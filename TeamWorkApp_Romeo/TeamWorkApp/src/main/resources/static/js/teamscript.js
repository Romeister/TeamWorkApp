function openCreateUserModal(){
    createUserModalOverlay.style.display = "block";
    createUserModal.style.display = "block";




    cancelButton.onclick = function(){
        createUserModalOverlay.style.display = "none";
        createUserModal.style.display = "none";
    }
    buttonX.onclick = function(){
        createUserModalOverlay.style.display = "none";
        createUserModal.style.display = "none";
    }

    createUserBtn.onclick = function(){

        addMember();
        location.reload();
    }

}



function addMember(){
    var memberFullName = document.getElementById("memberFullName").value;
    var memberIcon = document.getElementById("memberIcon").value;
    var memberPassword = document.getElementById("memberPassword").value;
    var memberRole = document.getElementById("memberRole").value;
    var memberAppName = document.getElementById("memberAppName").value;

    const requestData = {
        fullName : memberFullName,
        icon : memberIcon,
        password : memberPassword,
        role : memberRole,
        username : memberAppName
    }

    fetch('/teammembers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestData)
    })
      .then(response => response.json())
      .then(data => {
      })
      .catch(error => {
        console.error('Error:', error);
      });

    createUserModalOverlay.style.display = "none";
    createUserModal.style.display = "none";
    location.reload();
    }


function updateUserCard(slotNumber) {
    fetch('/teammembers')
        .then(response => response.json())
        .then(members => {
            var userSlot = document.getElementById(`user-slot-${slotNumber}`);
            var member = members.find(member => member.slotNumber === slotNumber);

            if (member) {
                var userCard =
                    `<div class="user-card">
                        <button class="delete-user-btn" onclick="deleteUser(${member.id})">X</button>
                        <div class="card-text">${member.fullName}</div>
                        <div class="member-icon">${member.icon}</div>
                        <div class="card-footer">${member.role}</div>
                    </div>`;
                userSlot.innerHTML = userCard;
            } else {
                userSlot.innerHTML = `
                    <div class="user-card-create">
                        <button class="create-user-button-btn" onclick="openCreateUserModal(${slotNumber})">
                            <span class="create-user-button-icon">+</span>
                        </button>
                    </div>`;
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}


 /// Function to fetch team members from the backend and update UI
  function fetchTeamMembersAndUpdateUI() {
      fetch('/teammembers')
          .then(response => response.json())
          .then(members => {
              var memberCardIds = ["memberCard1", "memberCard2", "memberCard3", "memberCard4"];

              memberCardIds.forEach((cardId, index) => {
                  var userSlot = document.getElementById(cardId);
                  var member = members[index];

                  if (member) {
                     var userCard = `
                         <div class="user-card" id="${cardId}" data-teamMemberId="${member.id}" onclick="openDeleteUserModal(this)">
                             <div class="card-text">${member.fullName}</div>
                             <div class="member-icon">${member.icon}</div>
                             <div class="card-footer">${member.role}</div>
                         </div>`;
                     userSlot.innerHTML = userCard;
                  } else {
                      userSlot.innerHTML = `
                                <div class= "user-card-create">
                              <button class="create-user-button-btn" onclick="openCreateUserModal(${index + 1})">
                                  <span class="create-user-button-icon">+</span>
                              </button>

                              </div>
                            `;
                  }
              });
          })
          .catch(error => {
              console.error('Error:', error);
          });

  }

 // Function to delete the user
function deleteTeamMember(teamMemberId) {
    fetch(`/teammembers/${teamMemberId}`, {
        method: 'DELETE',
    })
    .then(response => {
        if (response.ok) {
            console.log(`User with id ${teamMemberId} deleted.`);

            fetchTeamMembersAndUpdateUI();
        } else {

            console.error('Error deleting user:', response.statusText);
        }
    })
    .catch(error => {
        console.error('Error:', error);
    })
    .finally(() => {
        deleteUserModalOverlay.style.display = "none";
        deleteUserModal.style.display = "none";
    });
}


function openDeleteUserModal(userCard) {
    var teamMemberId = userCard.getAttribute('data-teamMemberId');
    var deleteUserModalOverlay = document.getElementById("deleteUserModalOverlay");
    var deleteUserModal = document.getElementById("deleteUserModal");

    // Display the modal
    deleteUserModalOverlay.style.display = "block";
    deleteUserModal.style.display = "block";

    // Set the click event for the cancel button
    var cancelDeleteButton = document.getElementById("cancelDeleteButton");
    cancelDeleteButton.onclick = function() {
        deleteUserModalOverlay.style.display = "none";
        deleteUserModal.style.display = "none";
    }

      // Set the click event for the close button
        var closeDeleteButton = document.getElementById("deleteButtonX");
        closeDeleteButton.onclick = function() {
            deleteUserModalOverlay.style.display = "none";
            deleteUserModal.style.display = "none";
        }


    // Set the click event for the confirm button
    var confirmDeleteButton = document.getElementById("confirmDeleteButton");
    confirmDeleteButton.onclick = function() {
        // Perform the deletion logic here using the teammemberId
        deleteTeamMember(teamMemberId);

        // Close the modal
        deleteUserModalOverlay.style.display = "none";
        deleteUserModal.style.display = "none";


    }
}

 // Call the fetchTeamMembersAndUpdateUI function to display team members on page load
 window.onload = function () {
     fetchTeamMembersAndUpdateUI();

 };

 function logout(){
     window.location.href="/";
 }