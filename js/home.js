let employeePayrollList;
window.addEventListener('DOMContentLoaded', (event) => {
  employeePayrollList = getEmployeePayrollListFromStorage();
  document.querySelector(".emp-count").textContent = employeePayrollList.length;
  createInnerHTML();
  localStorage.removeItem('editEmp');
});

const getEmployeePayrollListFromStorage = () => {
  return localStorage.getItem('EmployeePayrollList') ? JSON.parse(localStorage.getItem('EmployeePayrollList')) : [];
}

const createInnerHTML = () => {
  const headerHtml = `
    <th></th>
    <th>Name</th>
    <th>Gender</th>
    <th>Department</th>
    <th>Salary</th>
    <th>Start Date</th>
    <th>Actions</th>`;
  let innerHtml = `${headerHtml}`;
  if (employeePayrollList.length != 0) {
    for (const employeePayrollData of employeePayrollList) {
      innerHtml = `${innerHtml}
      <tr>
        <td><img class="profile" alt="" src="${employeePayrollData._profilePic}"></td>
        <td>${employeePayrollData._name}</td>
        <td>${employeePayrollData._gender}</td>
        <td>${getDeptHtml(employeePayrollData._department)}</td>
        <td>${employeePayrollData._salary}</td>
        <td>${stringifyDate(employeePayrollData._startDate)}</td>
        <td>
          <img id="${employeePayrollData._id}" onclick="remove(this)" alt="delete" 
                    src="../assets/icons/delete-black-18dp.svg">
          <img id="${employeePayrollData._id}" onclick="update(this)" alt="edit" 
                    src="../assets/icons/create-black-18dp.svg">
        </td>
      </tr>`;
    }
  }
  document.querySelector('#table-display').innerHTML = innerHtml;
};

const getDeptHtml = (departmentList) => {
  let departmentHtml = '';
  for (const department of departmentList) {
    departmentHtml = `${departmentHtml} <div class="dept-label">${department}</div>` 
  }
  return departmentHtml;
}

const remove = (node) => {
  let employeePayrollData = employeePayrollList.find(empData => empData._id == node.id);
  if (!employeePayrollData) {
    return;
  }
  const index = employeePayrollList
                .map(empData => empData._id)
                .indexOf(employeePayrollData._id);
  employeePayrollList.splice(index, 1);
  localStorage.setItem("EmployeePayrollList", JSON.stringify(employeePayrollList));
  document.querySelector(".emp-count").textContent = employeePayrollList.length;
  createInnerHTML();
}

const update = (node) => {
  let employeePayrollData = employeePayrollList.find(empData => empData._id == node.id);
  if (!employeePayrollData) {
    return;
  }
  localStorage.setItem("editEmp", JSON.stringify(employeePayrollData));
  window.location.replace(site_properties.add_employee_page);
}