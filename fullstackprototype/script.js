let users = JSON.parse(localStorage.getItem('users')) || [
    { username: "admin", password: "admin123", role: "admin", email: "admin@example.com", emailVerified: true },
    { username: "user1", password: "123user", role: "user", email: "user1@example.com", emailVerified: true },
    { username: "user2", password: "user123", role: "user", email: "user2@example.com", emailVerified: true }
];

// Save defaults to localStorage on first load so registered users persist
if (!localStorage.getItem('users')) {
    localStorage.setItem('users', JSON.stringify(users));
}

let employees = JSON.parse(localStorage.getItem('employees')) || [];
let departments = JSON.parse(localStorage.getItem('departments')) || [];
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;

function login() {
    const user = users.find(u =>
        u.username === loginUsername.value &&
        u.password === loginPassword.value
    );

    if (!user) return alert("Invalid login");
    if (!user.emailVerified) return alert("Verify email first");

    currentUser = user;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));

    enterPortal();
}

function getAuthHeader(){
    const token = sessionStorage.getItem('authToken');
    return token ? { Authorization: `Bearer ${token}` } : {};
}

async function loadAdminDashboard(){    
    const res = await fetch('http://localhost:3000/api/admin/dashboard',{
        headers: getAuthHeader()
    });
    if (res.ok){
        const data = await res.json();
        document.getElementById('content').innerText=data.message;
    }else{
        document.getElementById('content').innerText='Access denied';
    }
}


function register() {
    if (!regEmail.value.endsWith("@example.com"))
        return alert("Email must be @example.com");

    const newUser = {
        username: regUsername.value,
        password: regPassword.value,
        email: regEmail.value,
        role: regRole.value,
        emailVerified: true
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));


    alert("Registered successfully!");
    showLogin();
}


function enterPortal() {
    navbar.style.display = "flex";
    loginSection.style.display = "none";
    registerSection.style.display = "none";

    const label = currentUser.role === "admin" ? "Admin ▼" : currentUser.username + " ▼";
    document.getElementById("dropdownBtn").textContent = label;

    // Admin-only links
    const isAdmin = currentUser.role === "admin";
    document.getElementById("accountsLink").style.display = isAdmin ? "block" : "none";
    document.getElementById("employeesLink").style.display = isAdmin ? "block" : "none";
    document.getElementById("departmentsLink").style.display = isAdmin ? "block" : "none";

    showHome();
}

function showLogin() {
    registerSection.style.display = "none";
    loginSection.style.display = "block";
}

function showRegister() {
    loginSection.style.display = "none";
    registerSection.style.display = "block";
}

function hideSections() {
    homeSection.style.display = "none";
    employeesSection.style.display = "none";
    profileSection.style.display = "none";
    departmentsSection.style.display = "none";
    myRequestsSection.style.display = "none";
    accountsSection.style.display = "none";
}
function populateDepartmentDropdown(){
    empDept.innerHTML = '<option value="">Select Department</option>';

    departments.forEach(dept => {
        empDept.innerHTML += `<option value="${dept.name}">${dept.name}</option>`;
    });
}

function showHome() {
    hideSections();
    homeSection.style.display = "block";
}

function showEmployees() {
    hideSections();
    employeesSection.style.display = "block";
    renderEmployees();
}

function showProfile() {
    hideSections();
    profileSection.style.display = "block";
    profileEmail.textContent = currentUser.email;
    profileRole.textContent = currentUser.role;
}

function showAccounts() {
    if (currentUser.role !== "admin") {
        alert("Access denied. Admins only.");
        return;
    }
    hideSections();
    accountsSection.style.display = "block";
    renderAccounts();   
}

function showDepartments() {
    hideSections();
    departmentsSection.style.display = "block";
    renderDepartments();
}

function showMyRequests() {
    hideSections();
    myRequestsSection.style.display = "block";
    renderMyRequests();
}

function logout() {
    localStorage.removeItem('currentUser');
    location.reload();
}

function toggleDropdown() {
    dropdownMenu.style.display =
        dropdownMenu.style.display === "block" ? "none" : "block";
}

function populateDepartmentDropdown() {
    empDept.innerHTML = '<option value="">Select Department</option>';
    if (departments.length === 0) {
        empDept.innerHTML += '<option disabled>No departments added yet</option>';
        return;
    }
    departments.forEach(dept => {
        empDept.innerHTML += `<option value="${dept.name}">${dept.name}</option>`;
    });
}

function toggleEmployeeForm(editIndex = null) {
    populateDepartmentDropdown();
    if (editIndex !== null) {
        const emp = employees[editIndex];
        empId.value = emp.id;
        empName.value = emp.name;
        empPosition.value = emp.position;
        empDept.value = emp.dept;
        employeeForm.dataset.editIndex = editIndex;
    } else {
        empId.value = '';
        empName.value = '';
        empPosition.value = '';
        empDept.value = '';
        delete employeeForm.dataset.editIndex;
    }

    employeeForm.style.display =
        employeeForm.style.display === "block" ? "none" : "block";
}

function addOrUpdateEmployee() {
    const editIndex = employeeForm.dataset.editIndex;

    if (editIndex !== undefined) {
        employees[editIndex] = {
            id: empId.value,
            name: empName.value,
            position: empPosition.value,
            dept: empDept.value
        };
    } else {
        employees.push({
            id: empId.value,
            name: empName.value,
            position: empPosition.value,
            dept: empDept.value
        });
    }

    localStorage.setItem('employees', JSON.stringify(employees));
    renderEmployees();
    toggleEmployeeForm();
}

function renderEmployees() {
    if (employees.length === 0) {
        employeeTable.innerHTML = `<tr><td colspan="5" style="text-align:center">No employees.</td></tr>`;
        return;
    }

    employeeTable.innerHTML = "";
    employees.forEach((e, index) => {
        employeeTable.innerHTML += `
            <tr>
                <td>${e.id}</td>
                <td>${e.name}</td>
                <td>${e.position}</td>
                <td>${e.dept}</td>
                <td>
                    <button onclick="toggleEmployeeForm(${index})">Edit</button>
                    <button onclick="deleteEmployee(${index})">Delete</button>
                </td>
            </tr>
        `;
    });
}

function deleteEmployee(index) {
    if (!confirm("Are you sure you want to delete this employee?")) return;
    employees.splice(index, 1);
    localStorage.setItem('employees', JSON.stringify(employees));
    renderEmployees();
}

function toggleDepartmentForm(editIndex = null) {
    if (!window.departmentForm) return;
    if (editIndex !== null) {
        const dept = departments[editIndex];
        deptName.value = dept.name;
        deptHead.value = dept.head;
        departmentForm.dataset.editIndex = editIndex;
    } else {
        deptName.value = '';
        deptHead.value = '';
        delete departmentForm.dataset.editIndex;
    }
    departmentForm.style.display =
        departmentForm.style.display === "block" ? "none" : "block";
}

function addOrUpdateDepartment() {
    const editIndex = departmentForm.dataset.editIndex;

    if (editIndex !== undefined) {
        departments[editIndex] = {
            name: deptName.value,
            head: deptHead.value
        };
    } else {
        departments.push({
            name: deptName.value,
            head: deptHead.value
        });
    }

    localStorage.setItem('departments', JSON.stringify(departments));
    renderDepartments();
    toggleDepartmentForm();
}

function renderAccounts() {
    if (users.length === 0) {
        accountsTable.innerHTML =
            `<tr><td colspan="4" style="text-align:center">No accounts.</td></tr>`;
        return;
    }

    accountsTable.innerHTML = "";
    users.forEach((u, index) => {
        accountsTable.innerHTML += `
            <tr>
                <td>${index + 1}</td>
                <td>${u.username}</td>
                <td>${u.email}</td>
                <td>${u.role}</td>
            </tr>
        `;
    });
}

function renderDepartments() {
    if (!window.departmentsTable) return;
    if (departments.length === 0) {
        departmentsTable.innerHTML = `<tr><td colspan="3" style="text-align:center">No departments.</td></tr>`;
        return;
    }

    departmentsTable.innerHTML = '';
    departments.forEach((d, index) => {
        departmentsTable.innerHTML += `
            <tr>
                <td>${index + 1}</td>
                <td>${d.name}</td>
                <td>${d.head}</td>
                <td>
                    <button onclick="toggleDepartmentForm(${index})">Edit</button>
                    <button onclick="deleteDepartment(${index})">Delete</button>
                </td>
            </tr>
        `;
    });
}

function deleteDepartment(index) {
    if (!confirm("Are you sure you want to delete this department?")) return;
    departments.splice(index, 1);
    localStorage.setItem('departments', JSON.stringify(departments));
    renderDepartments();
}

let myRequests = JSON.parse(localStorage.getItem('myRequests')) || [];

function renderMyRequests() {
    if (!window.myRequestsTable) return;
    if (myRequests.length === 0) {
        myRequestsTable.innerHTML = `<tr><td colspan="3" style="text-align:center">No requests.</td></tr>`;
        return;
    }

    myRequestsTable.innerHTML = '';
    myRequests.forEach((r, index) => {
        myRequestsTable.innerHTML += `
            <tr>
                <td>${index + 1}</td>
                <td>${r.title}</td>
                <td>${r.status}</td>
                <td>
                    <button onclick="deleteRequest(${index})">Delete</button>
                </td>
            </tr>
        `;
    });
}

function deleteRequest(index) {
    if (!confirm("Are you sure you want to delete this request?")) return;
    myRequests.splice(index, 1);
    localStorage.setItem('myRequests', JSON.stringify(myRequests));
    renderMyRequests();
}

window.onload = function() {
    if (currentUser) {
        enterPortal();
    } else {
        loginSection.style.display = "block";
        navbar.style.display = "none";
    }
};