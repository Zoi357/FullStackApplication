let users = JSON.parse(localStorage.getItem('users')) || [
    { username: "admin", password: "admin123", role: "admin", email: "admin@example.com", emailVerified: true },
    { username: "user1", password: "123", role: "user", email: "user1@example.com", emailVerified: true },
    { username: "user2", password: "123", role: "user", email: "user2@example.com", emailVerified: true }
];

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

function toggleEmployeeForm(editIndex = null) {
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
