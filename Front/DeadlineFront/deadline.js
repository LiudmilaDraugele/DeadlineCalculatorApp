let myTaskNameInput = document.getElementById("taskNameInput");
let myHoursInput = document.getElementById("hoursNeededInput");
let mystartDateInput = document.getElementById("startDateInput");
let deadlineInput = document.getElementById("deadlineInput");
let dateCheck = false;

myHoursInput.addEventListener("input", () => {
    resetWarning();

    let hoursNeededValue = document.getElementById("hoursNeededInput").value;
    if (!Number.isInteger(parseFloat(hoursNeededValue)) || hoursNeededValue.includes('.')) {
        document.getElementById("hoursNeededWarning").style.display = "block";
    }
});

deadlineInput.addEventListener("change", () => {
    resetWarning();
    dateCheck = false;

    let mydeadline = new Date(document.getElementById("deadlineInput").value);
    let mystartDate = new Date(document.getElementById("startDateInput").value);
    let totalHoursNeeded = parseInt(document.getElementById("hoursNeededInput").value, 10);

    let today = new Date();
    today.setHours(0, 0, 0, 0);

    if (mydeadline < today) {
        document.getElementById("pastDateWarning").style.display = "block";
        dateCheck = true;
    } else if (mydeadline <= mystartDate) {
        document.getElementById("dateWarning").style.display = "block";
        dateCheck = true;
        if (mydeadline.getTime() === mystartDate.getTime()) {
            document.getElementById("dateWarning2").style.display = "block";
            dateCheck = true;
        } else {
            document.getElementById("dateWarning1").style.display = "block";
            dateCheck = true;
        }
    } else {
        let oneDay = 24 * 60 * 60 * 1000; 
        let totalDays = Math.round(Math.abs((mystartDate.getTime() - mydeadline.getTime()) / oneDay));
        if (totalHoursNeeded > totalDays * 12) {
            document.getElementById("hoursWarning").style.display = "block";
        }
    }  
});

mystartDateInput.addEventListener("change", () => {
    resetWarning();
    dateCheck = false;
    let mystartDate = new Date(document.getElementById("startDateInput").value);
    
    let today = new Date();
    today.setHours(0, 0, 0, 0);

    if (mystartDate < today) {
        document.getElementById("startInPastDateWarning").style.display = "block";
        dateCheck = true;
    } 
});

function resetWarning(){
    document.getElementById("dateWarning").style.display = "none";
    document.getElementById("dateWarning1").style.display = "none";
    document.getElementById("dateWarning2").style.display = "none";
    document.getElementById("successInfo").style.display = "none";
    document.getElementById("failureInfo").style.display = "none";
    document.getElementById("pastDateWarning").style.display = "none";
    document.getElementById("startInPastDateWarning").style.display = "none";
    document.getElementById("hoursWarning").style.display = "none";
    document.getElementById("invalidDatesWarning").style.display = "none";
    document.getElementById("hoursNeededWarning").style.display = "none";
}

document.getElementById('resetBtn').addEventListener('click', (event) => {
    event.preventDefault();
    resetWarning();
    document.getElementById('daysGrid').style.display = "none";
    myTaskNameInput.value = '';
    myHoursInput.value = '';
    mystartDateInput.value = '';
    deadlineInput.value = '';
});

document.getElementById('calculateTimeframeBtn').addEventListener('click', (event) => {
    event.preventDefault();
    resetWarning();
    
    if (dateCheck == false){
        createTable();
    } else {
        document.getElementById("invalidDatesWarning").style.display = "block";
    }
});

function createTable() {
    let taskName = document.getElementById('taskNameInput').value;
    let totalHoursNeeded = document.getElementById('hoursNeededInput').value;
    let startDate = new Date(document.getElementById('startDateInput').value);
    let deadline = new Date(document.getElementById('deadlineInput').value);

    if (!taskName || isNaN(startDate) || isNaN(deadline) || startDate > deadline) {
        alert('Invalid input');
        return;
    }

    let oneDay = 24 * 60 * 60 * 1000;
    let totalDays = Math.round(Math.abs((startDate - deadline) / oneDay));

    let deadlineString = deadline.toISOString().split('T')[0];
    const localStorageData = populateFromLocalStorage(taskName, deadlineString);

    let daysGrid = document.getElementById('daysGrid');
    let table = document.createElement('table');
    let header = document.createElement('tr');
    document.getElementById('daysGrid').style.display = "block";
    header.innerHTML = '<th>Date</th><th>Hours Busy</th><th>Hours Required</th>';
    table.appendChild(header);

    for (let i = 0; i <= totalDays; i++) {
        let row = document.createElement('tr');
        let date = new Date(startDate);
        date.setDate(date.getDate() + i);
        let dateString = date.toISOString().split('T')[0];
        let busyHoursValue = '';
        let requiredHoursValue = '';
        if (localStorageData) {
            const dayData = localStorageData.find(day => day.date === dateString);
            if (dayData) {
                busyHoursValue = dayData.busyHours;
                requiredHoursValue = dayData.requiredHours;
            }
        }
        row.innerHTML += `<td>${dateString}</td>`;
        row.innerHTML += `<td><input id="busyHours-${dateString}" type="number" min="0" max="24" value="${busyHoursValue}"></td>`;
        row.innerHTML += `<td><input id="hoursRequired-${dateString}" readonly value="${requiredHoursValue}"></td>`;
        table.appendChild(row);
    }

    daysGrid.innerHTML = '';
    daysGrid.appendChild(table);
    let calculateHoursBtn = document.createElement('button');
    calculateHoursBtn.id = 'calculateHoursBtn';
    calculateHoursBtn.textContent = 'Get plan!';
    daysGrid.appendChild(calculateHoursBtn);

    calculateHoursBtn.addEventListener('click', async () => {
        resetWarning();
        const data = collectData();
        await sendDataAndProcessResponse(data);
    });
}


// function createTable() {
//     let taskName = document.getElementById('taskNameInput').value;
//     let totalHoursNeeded = document.getElementById('hoursNeededInput').value;
//     let startDate = new Date(document.getElementById('startDateInput').value);
//     let deadline = new Date(document.getElementById('deadlineInput').value);

//     if (!taskName || isNaN(startDate) || isNaN(deadline) || deadline < startDate) {
//         alert('Invalid input');
//         return;
//     }

//     let oneDay = 24 * 60 * 60 * 1000;
//     let totalDays = Math.round(Math.abs((startDate - deadline) / oneDay));

//     let deadlineString = deadline.toISOString().split('T')[0];
//     const localStorageData = populateFromLocalStorage(taskName, deadlineString);

//     let daysGrid = document.getElementById('daysGrid');
//     let table = document.createElement('table');
//     let header = document.createElement('tr');
//     document.getElementById('daysGrid').style.display = "block";
//     header.innerHTML = '<th>Date</th><th>Hours Busy</th><th>Hours Required</th>';
//     table.appendChild(header);

//     for (let i = 0; i <= totalDays; i++) {
//         let row = document.createElement('tr');
//         let date = new Date(startDate);
//         date.setDate(date.getDate() + i);
//         let dateString = date.toISOString().split('T')[0];
//         let busyHoursValue = '';
//         let requiredHoursValue = '';
//         if (localStorageData) {
//             const dayData = localStorageData.find(day => day.date === dateString);
//             if (dayData) {
//                 busyHoursValue = dayData.busyHours;
//                 requiredHoursValue = dayData.requiredHours;
//             }
//         }
//         row.innerHTML += `<td>${dateString}</td>`;

//         let busyHoursInput = document.createElement('input');
//         busyHoursInput.id = "busyHours-" + dateString;
//         busyHoursInput.type = "number";
//         busyHoursInput.min = "0";
//         busyHoursInput.max = "24";
//         busyHoursInput.value = busyHoursValue;

//         busyHoursInput.addEventListener('input', function() {
//             let busyHoursValue = this.value;
//             if (!Number.isInteger(parseFloat(busyHoursValue)) || busyHoursValue.includes('.') || busyHoursValue < 0 || busyHoursValue > 24) {
//                 this.value = '';
//                 alert("Please enter a valid integer between 0 and 24 for hours busy!");
//             }
//         });

//         row.appendChild(document.createElement('td')).appendChild(busyHoursInput);
//         busyHoursInput.value = busyHoursValue;  // Set the input's value after it's been appended to the DOM
//         row.innerHTML += `<td><input id="hoursRequired-${dateString}" readonly value="${requiredHoursValue}"></td>`;
//         table.appendChild(row);
//     }

//     daysGrid.innerHTML = '';
//     daysGrid.appendChild(table);
//     let calculateHoursBtn = document.createElement('button');
//     calculateHoursBtn.id = 'calculateHoursBtn';
//     calculateHoursBtn.textContent = 'Get plan!';
//     daysGrid.appendChild(calculateHoursBtn);

//     calculateHoursBtn.addEventListener('click', async () => {
//         resetWarning();
//         const data = collectData();
//         await sendDataAndProcessResponse(data);
//     });
// }

function populateFromLocalStorage(taskName, deadline) {
    const localStorageKey = taskName + "-" + deadline;
    const days = JSON.parse(localStorage.getItem(localStorageKey));

    if (days) {
        return days.map(day => {
            if (day.requiredHours === null) {
                day.requiredHours = '0';
            }
            return day;
        });
    }
    
    return days;
}

function collectData() {
    const days = [];
    const table = document.getElementById('daysGrid').querySelector('table');
    const taskName = document.getElementById('taskNameInput').value;
    const deadline = document.getElementById('deadlineInput').value;
    let deadlineDate = new Date(deadline);
    let deadlineString = deadlineDate.toISOString().split('T')[0];
    const localStorageData = populateFromLocalStorage(taskName, deadlineString);

    for (let i = 1; i < table.rows.length; i++) {
        const row = table.rows[i];

        const date = row.cells[0].innerText;
        let busyHours = row.cells[1].querySelector('input').value;

        if (busyHours === '') {
            if(localStorageData) {
                const dayData = localStorageData.find(day => day.date === date);
                busyHours = dayData ? dayData.busyHours : '0';
            } else {
                busyHours = '0';
            }
        }

        days.push({ date, busyHours });
    }

    const hoursNeeded = document.getElementById('hoursNeededInput').value;
    const data = JSON.stringify({ taskName, hoursNeeded, deadline: deadlineString, days });

    return data;
}


async function sendDataAndProcessResponse(data) {
    try {
        const response = await fetch('http://localhost:8080/deadline/api/days', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: data,
            
        });

        console.log(data);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const days = await response.json();
        console.log(days);

        for (let day of days) {
            const requiredHoursInput = document.getElementById('hoursRequired-' + day.date);
            if (requiredHoursInput) {
                console.log(day.requiredHours);
                requiredHoursInput.value = day.requiredHours;
            }
        }

        saveToLocalStorage(data, days);
        
        if (response.ok) {
            document.getElementById('successInfo').style.display = 'block';
        } else {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('failureInfo').style.display = 'block';
        let requiredHoursInputs = document.querySelectorAll('[id^="hoursRequired-"]');
            for(let input of requiredHoursInputs) {
                input.value = '';
    }
}
}

function saveToLocalStorage(data, days) {
    const taskInfo = JSON.parse(data);
    const localStorageKey = taskInfo.taskName + "-" + taskInfo.deadline;
    const updatedDays = days.map(day => {
        const matchingDay = taskInfo.days.find(d => d.date === day.date);
        if (matchingDay) {
            return {
                ...day,
                busyHours: matchingDay.busyHours
            };
        }
        return day;
    });
    localStorage.setItem(localStorageKey, JSON.stringify(updatedDays));
}
