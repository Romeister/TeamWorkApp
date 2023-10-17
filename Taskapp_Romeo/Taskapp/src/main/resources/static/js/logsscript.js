function fetchAndUpdateLogs() {
  fetch('/logs')
    .then(response => response.json())
    .then(logs => {

      const logsList = document.querySelector('.list-style-none');


      logsList.innerHTML = '';

      logs.forEach(log => {
        const listItem = document.createElement('li');
        listItem.className = 'd-flex no-block card-body border-top';

        const icon = document.createElement('i');
        console.log(log.statusMessage);


        switch (log.statusMessage) {
                case "Task-ul a fost creat !": {
                    icon.className = 'fa fa-check-circle fa-lg w-30px m-t-5';
                    break;
                }
                case "Task-ul a fost editat !": {
                    icon.className = 'fas fa-edit fa-lg w-30px m-t-5';
                    break;
                }
                case "Task-ul a fost sters !": {
                    icon.className = 'fa-solid fa-circle-xmark fa-lg w-30px m-t-5';
                    break;
                }
                default: {
                    console.log("Error on initializing icons");
                    return;
                }
            }

        const descriptionDiv = document.createElement('div');
        const descriptionLink = document.createElement('a');
        descriptionLink.href = "#";
        descriptionLink.textContent = log.statusMessage;
        const taskDescriptionSpan = document.createElement('span');
        taskDescriptionSpan.className = "text-muted";
        taskDescriptionSpan.textContent = log.taskDescription;
        descriptionDiv.appendChild(descriptionLink);
        descriptionDiv.appendChild(taskDescriptionSpan);

        const dateDiv = document.createElement('div');
        dateDiv.className = "ml-auto";
        const dateDetailsDiv = document.createElement('div');
        dateDetailsDiv.className = "text-right";
        const dateH5 = document.createElement('h5');
        dateH5.className = "text-muted m-b-0";
        dateH5.textContent = log.dayOfMonth;
        const dateSpan = document.createElement('span');
        dateSpan.className = "text-muted font-16";
        dateSpan.textContent = getMonthAbbreviation(log.monthOfYear);
        dateDetailsDiv.appendChild(dateH5);
        dateDetailsDiv.appendChild(dateSpan);
        dateDiv.appendChild(dateDetailsDiv);

        listItem.appendChild(icon);
        listItem.appendChild(descriptionDiv);
        listItem.appendChild(dateDiv);

        logsList.appendChild(listItem);
      });
    })
    .catch(error => {
      console.error('Failed to fetch logs:', error);
    });
}

function getMonthAbbreviation(month) {
  const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  return months[month - 1] || '';
}


function handleTitleClick() {
   deleteLogsModalOverlay.style.display="block";
   deleteLogsModal.style.display="block";

   confirmDeleteButton.onclick=function(){

    fetch('/logs/delete-all', {
        method: 'DELETE'
    })
    .then(response => {
        if (response.ok) {
            console.log('All log entries deleted successfully');
        } else {
            console.error('Error deleting all log entries');
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
    deleteLogsModalOverlay.style.display="none";
    deleteLogsModal.style.display="none";

    location.reload();
    }
    cancelDeleteButton.onclick=function(){
        deleteLogsModalOverlay.style.display="none";
        deleteLogsModal.style.display="none";
    }

    deleteButtonX.onclick=function(){
        deleteLogsModalOverlay.style.display="none";
        deleteLogsModal.style.display="none";
    }
}


fetchAndUpdateLogs();

