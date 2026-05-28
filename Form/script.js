// Use this list to store user objects
let users = [];

// When user clicks Edit, this holds the id of the user being edited
let editingId = null;

// Load saved users and show the table when the page loads
window.onload = function() {
    let savedUsers = localStorage.getItem("users");
    if (savedUsers) {
        users = JSON.parse(savedUsers);
    }
    showUsersTable();
};

// Handle form submit
let form = document.getElementById("myForm");
form.onsubmit = function(event) {
    event.preventDefault();

    let firstName = document.getElementById("fname").value;
    let lastName = document.getElementById("lname").value;
    let age = document.getElementById("age").value;
    let gender = document.getElementById("gender").value;

    if (firstName == "" || age == "" || gender == "") {
        showMessage("Please fill all fields.", "error");
        return;
    }

    if (editingId != null) {
        updateUser(firstName, lastName, age, gender);
    } else {
        addUser(firstName, lastName, age, gender);
    }
    if (age<18){
        showMessage("User must be at least 18 years old.", "error");
        return;
    }

    saveUsers();
    form.reset();
    showUsersTable();
};

function addUser(firstName, lastName, age, gender) {
    let user = {
        id: Date.now(),
        fname: firstName,
        lname: lastName,
        age: age,
        gender: gender
    };
    users.push(user);
    showMessage("User added successfully.", "success");
}

function updateUser(firstName, lastName, age, gender) {
    for (let i = 0; i < users.length; i++) {
        if (users[i].id == editingId) {
            users[i].fname = firstName;
            users[i].lname = lastName;
            users[i].age = age;
            users[i].gender = gender;
            break;
        }
    }
    showMessage("User updated successfully.", "success");
    editingId = null;
    document.getElementById("submitBtn").textContent = "Submit";
}

function saveUsers() {
    let userJson = JSON.stringify(users);
    localStorage.setItem("users", userJson);
}

function showMessage(text, type) {
    let messageDiv = document.getElementById("message");
    messageDiv.innerHTML = text;
    messageDiv.style.display = "block";
    if (type == "success") {
        messageDiv.style.backgroundColor = "lightgreen";                
    } else {
        messageDiv.style.backgroundColor = "lightcoral";
    }

    setTimeout(function() {
        messageDiv.style.display = "none";
    }, 3000);
}

function showUsersTable() {
    let table = document.getElementById("userTable");

    while (table.rows.length > 1) {
        table.deleteRow(1);
    } 

    for (let i = 0; i < users.length; i++) {
    let tableBody = document.getElementById("tableBody");
    tableBody.innerHTML += `
        <tr>
            <td>${users[i].fname}</td>
            <td>${users[i].lname}</td>
            <td>${users[i].age}</td>
            <td>${users[i].gender}</td>
            <td>
                <button onclick="fillFormForEdit(${users[i].id})">
                    Edit
                </button>
            </td>
            <td>
                <button onclick="deleteUser(${users[i].id})">
                    Delete
                </button>
            </td>
        </tr>
        `;
    }
}

function fillFormForEdit(id) {
    for (let i = 0; i < users.length; i++) {
        if (users[i].id == id) {
            document.getElementById("fname").value = users[i].fname;
            document.getElementById("lname").value = users[i].lname;
            document.getElementById("age").value = users[i].age;
            document.getElementById("gender").value = users[i].gender;
            editingId = id;
            document.getElementById("submitBtn").textContent = "Update";
            break;
        }
    }
}

function deleteUser(id) {
    if (confirm("Are you sure you want to delete this user?")) {
        for (let i = 0; i < users.length; i++) {
            if (users[i].id == id) {
                users.splice(i, 1);
                break;
            }
        }
        saveUsers();
        showMessage("User deleted.", "deletionSuccess");
        showUsersTable();
    }
}

function searchUser() {
    let searchText = document.getElementById("searchBox").value.toLowerCase();
    let table = document.getElementById("userTable");

    while (table.rows.length > 1) {
        table.deleteRow(1);
    }

    for (let i = 0; i < users.length; i++) {
        let firstName = users[i].fname.toLowerCase();
        let lastName = users[i].lname.toLowerCase();
        let fullName = (firstName + " " + lastName).toLowerCase();

        if (firstName.indexOf(searchText) != -1 || lastName.indexOf(searchText) != -1 || fullName.indexOf(searchText) != -1) {
            let row = table.insertRow();
            row.insertCell(0).textContent = users[i].fname;
            row.insertCell(1).textContent = users[i].lname;
            row.insertCell(2).textContent = users[i].age;
            row.insertCell(3).textContent = users[i].gender;

            let editCell = row.insertCell(4);
            let editButton = document.createElement("button");
            editButton.textContent = "Edit";
            editButton.onclick = function() {
                fillFormForEdit(users[i].id);
            };
            editCell.appendChild(editButton);

            let deleteCell = row.insertCell(5);
            let deleteButton = document.createElement("button");
            deleteButton.textContent = "Delete";
            deleteButton.onclick = function() {
                deleteUser(users[i].id);
            };
            deleteCell.appendChild(deleteButton);
        }
    }
}

function showAll() {
    document.getElementById("searchBox").value = "";
    showUsersTable();
}