let isUpdate = false;
let employeePayrollObject = {};

window.addEventListener('DOMContentLoaded', (event) => {
  const name = document.querySelector('#name');
  name.addEventListener('input', function () {
    if (name.value.length == 0) {
      setTextValue('.text-error', "");
      return;
    }
    try {
      checkName(name.value);
      setTextValue('.text-error', "");
    } catch (error) {
      setTextValue('.text-error', error);
    }
  });

  const salary = document.querySelector('#salary');
  const output = document.querySelector('.salary-output');
  output.textContent = salary.value;
  salary.addEventListener('input', function () { setTextValue('.salary-output', salary.value); });

  const date = document.querySelector('#date');
  date.addEventListener('input', function () {
    let day = document.querySelector('#day');
    let year = document.querySelector('#year');
    let month = document.querySelector('#month');
    if (month.value == 2) {
      if (isLeapYear(year.value)) {
        if (day.value > 29) {
          setTextValue('.date-error', "Invalid Date!");
        } else setTextValue('.date-error', "");
      } else {
        if (day.value > 28) {
          setTextValue('.date-error', "Invalid Date!");
        } else setTextValue('.date-error', "");
      }
    }
    else if (month.value == 4 || month.value == 6 || month.value == 9 || month.value == 11) {
      if (day.value > 30) {
        setTextValue('.date-error', "Invalid Date!");
      } else setTextValue('.date-error', "");
    }
    else setTextValue('.date-error', "");

    if (document.querySelector('.date-error').textContent == "") {
      const startDate = new Date(getInputValueById('#year'),
                                 parseInt(getInputValueById('#month')) - 1,
                                 getInputValueById('#day'));
      try {
        checkStartDate(startDate);
        setTextValue('.date-error', "");
      } catch (error) {
        setTextValue('.date-error', error);
      }
    }
  });

  checkForUpdate();
});

const save = (event) => {
  checked = $("input[type=checkbox]:checked").length;
  if (!checked) {
    alert("You must select at least one department.");
    return;
  }
  event.preventDefault();
  event.stopPropagation();
  try {
    setEmployeePayrollObject();
    if (site_properties.use_local_storage.match("true")) {
      createAndupdateStorage();
      resetForm();
      window.location.replace(site_properties.home_page);
    } else {
      createOrUpdateEmployeePayroll();
    }
  } catch (error) {
    alert(error);
  }
}

const createOrUpdateEmployeePayroll = () => {
  let postURL = site_properties.server_url;
  let methodCall = "POST";
  if (isUpdate) {
    methodCall = "PUT";
    postURL = postURL + employeePayrollObject.id.toString();
  }
  makeServiceCall(methodCall, postURL, true, employeePayrollObject)
    .then(responseText => {
      resetForm();
      window.location.replace(site_properties.home_page);
    })
    .catch(error => {
      throw error;
    });
}

const setEmployeePayrollObject = () => {
  if (!isUpdate && site_properties.use_local_storage.match("true")) {
    employeePayrollObject.id = createNewEmployeeId();
  }
  employeePayrollObject._name = getInputValueById('#name');
  employeePayrollObject._profilePic = getSelectedValues('[name=profile]').pop();
  employeePayrollObject._gender = getSelectedValues('[name=gender]').pop();
  employeePayrollObject._department = getSelectedValues('[name=department]');
  employeePayrollObject._salary = getInputValueById('#salary');
  employeePayrollObject._note = getInputValueById('#notes');
  if (document.querySelector('.date-error').textContent == "") {
    employeePayrollObject._startDate = new Date(getInputValueById('#year'),
      parseInt(getInputValueById('#month')) - 1,
      getInputValueById('#day'));
  } else throw "Cannot Enter Impossible Date!";
}

const createAndupdateStorage = () => {
  let employeePayrollList = JSON.parse(localStorage.getItem("EmployeePayrollList"));
  if (!employeePayrollList) {
    employeePayrollList = [employeePayrollObject];
  } else {
    let employeePayrollData = employeePayrollList.find(empData => empData.id == employeePayrollObject.id);
    if (!employeePayrollData) {
      employeePayrollList.push(employeePayrollObject);
    } else {
      const index = employeePayrollList.map(empData => empData.id)
        .indexOf(employeePayrollData.id);
      employeePayrollList.splice(index, 1, employeePayrollObject);
    }
  }
  localStorage.setItem("EmployeePayrollList", JSON.stringify(employeePayrollList));
}

const createNewEmployeeId = () => {
  let employeeID = localStorage.getItem("EmployeeID");
  employeeID = !employeeID ? 1 : (parseInt(employeeID) + 1).toString();
  localStorage.setItem("EmployeeID", employeeID);
  return employeeID;
}

const setForm = () => {
  setValue('#name', employeePayrollObject._name);
  setSelectedValues('[name=profile]', employeePayrollObject._profilePic);
  setSelectedValues('[name=gender]', employeePayrollObject._gender);
  setSelectedValues('[name=department]', employeePayrollObject._department);
  setValue('#salary', employeePayrollObject._salary);
  setTextValue('.salary-output', employeePayrollObject._salary);
  setValue('#notes', employeePayrollObject._note);
  let date = stringifyDate(employeePayrollObject._startDate).split(" ");
  let month = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].indexOf(date[1]);
  setValue('#day', date[0]);
  setValue('#month', month);
  setValue('#year', date[2]);
}

const resetForm = () => {
  setValue('#name', '');
  setTextValue('#name-error', '');
  unsetSelectedValues('[name=profile]');
  unsetSelectedValues('[name=gender]');
  unsetSelectedValues('[name=department]');
  setValue('#salary', '');
  setValue('#notes', '');
  setSelectedIndex('#day', 0);
  setSelectedIndex('#month', 0);
  setSelectedIndex('#year', 0);
  setTextValue('#date-error', '');
}

const getSelectedValues = (propertyValue) => {
  let allItems = document.querySelectorAll(propertyValue);
  let selItems = [];
  allItems.forEach(item => {
    if (item.checked) {
      selItems.push(item.value);
    }
  });
  return selItems;
}

const getInputValueById = (id) => {
  let value = document.querySelector(id).value;
  return value;
}

const unsetSelectedValues = (propertyValue) => {
  let allItems = document.querySelectorAll(propertyValue);
  allItems.forEach(item => {
    item.checked = false;
  });
}

const setSelectedValues = (propertyValue, value) => {
  let allItems = document.querySelectorAll(propertyValue);
  allItems.forEach(item => {
    if (Array.isArray(value)) {
      if (value.includes(item.value)) {
        item.checked = true;
      }
    }
    else if (item.value === value) {
      item.checked = true;
    }
  });
}

const setTextValue = (id, value) => {
  const element = document.querySelector(id);
  element.textContent = value;
}

const setValue = (id, value) => {
  const element = document.querySelector(id);
  element.value = value;
}

const setSelectedIndex = (id, index) => {
  const element = document.querySelector(id);
  element.selectedIndex = index;
}

const checkForUpdate = () => {
  const employeePayrollJson = localStorage.getItem('editEmp');
  isUpdate = employeePayrollJson ? true : false;
  if (!isUpdate) {
    return;
  }
  employeePayrollObject = JSON.parse(employeePayrollJson);
  setForm();
}

const isLeapYear = (year) => {
  let result = false;
  if (year % 4 == 0) {
    if (year % 100 == 0) {
      if (year % 400 == 0) {
        result = true;
      }
    } else {
      result = true;
    }
  }
  return result;
}