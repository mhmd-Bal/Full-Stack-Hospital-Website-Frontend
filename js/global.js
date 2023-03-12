const baseurl = "http://localhost/Full-Stack-Hopital-Website/Full-Stack-Hospital-Website-Backend/";

// GLobal Functions

const ExecuteGetAPI = async (api_url) => {
  try{
    return await axios(api_url);
  }catch(error){
    console.log(error);
  }
}

const ExecutePostAPI = async (api_url, api_data) => {
  try{
    return await axios.post(api_url, api_data);
  }catch(error){
    console.log(error);
  }
}

// const MakeFormData = (list_of_data) => {
//   let data = new FormData();
//   for(let i=0; i<list_of_data.length; i++){
//     console.log(Object.keys(list_of_data[i])[0] );
//     data.append(`${Object.keys(list_of_data[i])[0]}`, list_of_data[i].value);
//   }
//   console.log(data);
//   return data;
// }


const PostRegistrationData = async (register_url) => {
  let name = document.getElementById("Name").value;
  let dob = document.getElementById("Date-of-birth").value;
  let email = document.getElementById("Email").value;
  let password = document.getElementById("Password").value;
  let verify_password = document.getElementById("Verify-password").value;
  
  // let list_of_data = [];
  // list_of_data.push(name,dob,email,password,verify_password);
  // console.log(list_of_data);

  if(password == verify_password){
    let data = new FormData();
    data.append('name', name);
    data.append('dob', dob);
    data.append('email', email);
    data.append('password', password);

    const response = await ExecutePostAPI(register_url, data);
    if(response.data.status == "User Added!"){
      window.location.href = "Login.html";
    }
  }else{
    console.log("Not the same password");
  }
}

const PostLoginData = async (login_url) => {
  const email = document.getElementById("Email").value;
  const password = document.getElementById("Password").value;

  data = new FormData();
  data.append('email', email);
  data.append('password', password);

  const response = await ExecutePostAPI(login_url, data);
  console.log(response);
  window.sessionStorage.setItem("token", response.data.token);
  RedirectUser(response.data.usertype);
} 

const RedirectUser = (usertype) => {
  if(usertype == 1 || usertype == 2){
    window.location.href = "index.html";
  }else{
    window.location.href = "Admin.html";
  }
}

const CheckUser = async () => {
  const checkuser_url = baseurl + "Checkuser.php";
  let token = window.sessionStorage.getItem("token");
  let data = new FormData();
  data.append('token', token);

  const response = await ExecutePostAPI(checkuser_url, data);
  console.log(response);
  return {
    authentication: response.data.authentication,
    name: response.data.name,
    usertype: response.data.usertype,
    userid: response.data.userid
  }
}

const LogoutUser = () => {
  window.sessionStorage.removeItem("token");
  window.location.href = "index.html";
}

const CheckIfAdmin = async () => {
  const {authentication,name,usertype} = await CheckUser();
  if(authentication != "Successful" || usertype != 3){
    window.location.href = "index.html";
  }
}

const DisableEveryCategory = (event) => {
  for(let i=0; i<event.currentTarget.buttons.length; i++){
    event.currentTarget.buttons[i].classList.remove("Button-enabled");
  }
  for(let i=0; i<event.currentTarget.lists.length; i++){
    event.currentTarget.lists[i].classList.add("List-disabled");
  }
}

const EnableTheChosenCategory = (event) => {
  DisableEveryCategory(event);
  let index = event.currentTarget.index;
  event.currentTarget.buttons[index].classList.add("Button-enabled");
  event.currentTarget.lists[index].classList.remove("List-disabled");
}

const FillTheAssignedPatientsCategory = async () => {
  const assigned_patients_url = baseurl + "GetAllAssignedPatients.php";
  const response = await ExecuteGetAPI(assigned_patients_url);
  console.log(response);
  const assigned_patients = response.data;
  const assigned_patients_list = document.getElementById("Assigned-patients-list");
  GetEachAssignedUser(assigned_patients, assigned_patients_list);
}

const FillTheAssignedEmployeesCategory = async () => {
  const assigned_employees_url = baseurl + "GetAllAssignedEmployees.php";
  const response = await ExecuteGetAPI(assigned_employees_url);
  const assigned_employees = response.data;
  const assigned_employees_list = document.getElementById("Assigned-employees-list");
  GetEachAssignedUser(assigned_employees, assigned_employees_list);
}

const GetEachAssignedUser = (assigned_users, assigned_users_list) => {
  for(let i=0; i<assigned_users.length; i++){
    PrintAssignedUserInTable(assigned_users[i], assigned_users_list);
  }
}

const PrintAssignedUserInTable = (assigned_user, assigned_users_list) => {
  let new_row = document.createElement("tr");
  assigned_users_list.insertAdjacentElement('beforeend', new_row);

  const keys = Object.keys(assigned_user);
  keys.forEach((key, index) => {
    AddThisElementToRow(new_row, eval(`assigned_user.${key}`));
  });
}

const AddThisElementToRow = (row, text_in_element) => {
  let new_element = document.createElement("td");
  new_element.textContent = text_in_element;
  row.insertAdjacentElement('beforeend', new_element);
}

const FillTheCategories = () => {
  FillTheAssignedPatientsCategory();
  FillTheAssignedEmployeesCategory();
}

const EnableTheAssignFunction = (event) => {
  DisableEveryCategory(event);
  if(event.currentTarget.index == 0){
    event.currentTarget.lists[4].classList.remove("List-disabled");
    event.currentTarget.buttons[1].classList.add("Button-enabled");
  }else if(event.currentTarget.index == 1){
    event.currentTarget.lists[5].classList.remove("List-disabled");
    event.currentTarget.buttons[2].classList.add("Button-enabled");
  }
}

const AssignPatient = async () => {
  const assign_patient = baseurl + "AssignPatient.php";

  let hospital_id = document.getElementById("Assign-patient-hospital-id").value;
  let user_id = document.getElementById("Assign-patient-patient-id").value;
  let is_active = document.getElementById("Assign-patient-is-active").value;
  let date_joined = document.getElementById("Assign-patient-date-joined").value;
  let date_left = document.getElementById("Assign-patient-date-left").value;

  let data = new FormData();
  data.append('hospital_id', hospital_id);
  data.append('user_id', user_id);
  data.append('is_active', is_active);
  data.append('date_joined', date_joined);
  data.append('date_left', date_left);

  const response = await ExecutePostAPI(assign_patient, data);
  const assign_function_patients_title = document.getElementById("Assignfunction-patients-title");
  PrintMessage(assign_function_patients_title, response.data.response);
  ReloadIfSuccessful(response.data.response);
}

const AssignEmployee = async () => {
  const assign_employee = baseurl + "AssignEmployee.php";

  let hospital_id = document.getElementById("Assign-employee-hospital-id").value;
  let user_id = document.getElementById("Assign-employee-employee-id").value;
  let is_active = document.getElementById("Assign-employee-is-active").value;
  let date_joined = document.getElementById("Assign-employee-date-joined").value;
  let date_left = document.getElementById("Assign-employee-date-left").value;

  let data = new FormData();
  data.append('hospital_id', hospital_id);
  data.append('user_id', user_id);
  data.append('is_active', is_active);
  data.append('date_joined', date_joined);
  data.append('date_left', date_left);

  const response = await ExecutePostAPI(assign_employee, data);
  const assign_function_employees_title = document.getElementById("Assignfunction-employees-title");
  console.log(response);
  PrintMessage(assign_function_employees_title, response.data.response);
  ReloadIfSuccessful(response.data.response);
}

const PrintMessage = (place, message) => {
  place.textContent = message; 
}

const ReloadIfSuccessful = (successful) => {
  if(successful == "Patient Assigned!" || successful == "Employee Assigned!"){
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  }
}

const DisableEverythingRelatedToEmployees = () => {
  const profile_assign_button = document.getElementById("Profile-assign-button");
  const profile_edit_employee_inputs = document.getElementsByClassName("Profile-edit-employee-inputs");
  const profile_employee_edit_in_block_button = document.getElementById("Profile-employee-edit-in-block-button");
  profile_employee_edit_in_block_button.classList.add("List-disabled");
  profile_assign_button.classList.add("List-disabled");
  for(let i=0; i<profile_edit_employee_inputs.length; i++){
    profile_edit_employee_inputs[i].classList.add("List-disabled");
  }
}

const DisableEverythingRelatedToPatients = () => {
  const profile_request_button = document.getElementById("Profile-request-button");
  const profile_invoice_button = document.getElementById("Profile-invoice-button");
  const profile_edit_patient_inputs = document.getElementsByClassName("Profile-edit-patient-inputs");
  const profile_patient_edit_in_block_button = document.getElementById("Profile-patient-edit-in-block-button");
  profile_invoice_button.classList.add("List-disabled");
  profile_request_button.classList.add("List-disabled");
  profile_patient_edit_in_block_button.classList.add("List-disabled");
  for(let i=0; i<profile_edit_patient_inputs.length; i++){
    profile_edit_patient_inputs[i].classList.add("List-disabled");
  }
}

const EditPatientInformation = async (user_id) => {
  const edit_patient_info_url = baseurl + "EditPatientProfile.php";
  const blood_type = document.getElementById("Patient-blood-type-input").value;
  const ehr = document.getElementById("Patient-ehr-input").value;

  data = new FormData();
  data.append('blood_type', blood_type);
  data.append('ehr', ehr);
  data.append('user_id', user_id);

  const response = await ExecutePostAPI(edit_patient_info_url, data);
  if(response.data.response == "Patient Info Added!"){
    alert("Patient Info Added!");
  }else if(response.data.response == "Patient Info Updated!"){
    alert("Patient Info Updated!");
  }
}

const EditEmployeeInformation = async (user_id) => {
  const edit_employee_info_url = baseurl + "EditEmployeeProfile.php";
  const ssn = document.getElementById("Employee-ssn-input").value;
  const date_joined = document.getElementById("Employee-date-joined-input").value;
  const position = document.getElementById("Employee-position-input").value;

  data = new FormData();
  data.append('ssn', ssn);
  data.append('date_joined', date_joined);
  data.append('position', position);
  data.append('user_id', user_id);

  const response = await ExecutePostAPI(edit_employee_info_url, data);
  console.log(response);
  if(response.data.response == "Employee Info Added!"){
    alert("Employee Info Added!");
  }else if(response.data.response == "Employee Info Updated!"){
    alert("Employee Info Updated!");
  }
}

const EditTheEmployeeDashboard = (name) => {
  const welcome_title = document.getElementById("Welcome-title");
  const info_type = document.getElementById("Info-type");
  const extra_info = document.getElementById("Extra-info");
  welcome_title.textContent = `Hello, ${name}!`;
  info_type.textContent = `You are an Employee of the World Health Organization`;
}

const EditThePatientDashboard = (name) => {
  const welcome_title = document.getElementById("Welcome-title");
  const info_type = document.getElementById("Info-type");
  welcome_title.textContent = `Hello, ${name}!`;
  info_type.textContent = `You are a patient under the World Health Organization`;
}

const AssignServiceToPatient = async (employee_id) => {
  const assign_service_info_url = baseurl + "AssignServices.php";
  const patient_id = document.getElementById("Assign-services-patient-id-input").value;
  const description = document.getElementById("Assign-services-description-input").value;
  const cost = document.getElementById("Assign-services-cost-input").value;
  const department_id = document.getElementById("Assign-services-department-id-input").value;
  const status = "Approved";

  data = new FormData();
  data.append('patient_id', patient_id);
  data.append('description', description);
  data.append('cost', cost);
  data.append('department_id', department_id);
  data.append('employee_id', employee_id);
  data.append('status', status);

  const response = await ExecutePostAPI(assign_service_info_url, data);
  console.log(response);
  if(response.data.response == "Service Assigned!"){
    alert("Service Assigned!");
  }
}


//Page Functions

const LoadRegistration = async () => {
  const register_url = baseurl + "Register.php";
  const register_button = document.getElementById("Signup-button");
  register_button.addEventListener("click", () => PostRegistrationData(register_url));
}


const LoadSignin = async () => {
  const login_url = baseurl + "Login.php";
  const signin_button = document.getElementById("Signin");
  signin_button.addEventListener("click", () => PostLoginData(login_url));
}

const LoadIndex = async () => {
  const {authentication,name,usertype} = await CheckUser();
  const no_user_buttons = document.getElementsByClassName("Account-nouser-button");
  const user_buttons = document.getElementsByClassName("Account-user-button");
  if(authentication == "Successful"){
    for(let i=0; i<no_user_buttons.length; i++){
      no_user_buttons[i].classList.add("Disabled");
    }
    for(let i=0; i<user_buttons.length; i++){
      user_buttons[i].classList.remove("Disabled");
    }
  }else if(authentication == "There is no user logged in"){
    for(let i=0; i<no_user_buttons.length; i++){
      no_user_buttons[i].classList.remove("Disabled");
    }
    for(let i=0; i<user_buttons.length; i++){
      user_buttons[i].classList.add("Disabled");
    }
  }
  user_buttons[1].addEventListener('click', () => LogoutUser());
}
 
const LoadAdmin = async () => {
  const logout_button = document.getElementById("Logout-button");
  const category_buttons = document.getElementsByClassName("Category-buttons");
  const category_lists = document.getElementsByClassName("List-block");
  const function_buttons = document.getElementsByClassName("Function-buttons");
  CheckIfAdmin();
  logout_button.addEventListener('click', () => LogoutUser());
  
  for(let i=0; i<category_buttons.length; i++){
    category_buttons[i].addEventListener('click', (event) => EnableTheChosenCategory(event));
    category_buttons[i].index = i;
    category_buttons[i].buttons = category_buttons;
    category_buttons[i].lists = category_lists;
  }

  FillTheCategories();

  for(let i=0; i<function_buttons.length; i++){
    function_buttons[i].addEventListener("click", (event) => EnableTheAssignFunction(event));
    function_buttons[i].index = i;
    function_buttons[i].buttons = category_buttons;
    function_buttons[i].lists = category_lists;
  }
  
}

const LoadProfile = async () => {
  const {authentication,userid,name,usertype} = await CheckUser();
  const profile_category_buttons = document.getElementsByClassName("Profile-category-buttons");
  const account_information_block = document.getElementsByClassName("Account-information-block");
  const profile_patient_edit_in_block_button = document.getElementById("Profile-patient-edit-in-block-button");
  const profile_employee_edit_in_block_button = document.getElementById("Profile-employee-edit-in-block-button");
  const profile_logout_button = document.getElementById("Profile-logout");
  const assign_services_in_block_button = document.getElementById("Assign-services-in-block-button");

  for(let i=0; i<profile_category_buttons.length; i++){
    profile_category_buttons[i].addEventListener('click', (event) => EnableTheChosenCategory(event));
    profile_category_buttons[i].index = i;
    profile_category_buttons[i].buttons = profile_category_buttons;
    profile_category_buttons[i].lists = account_information_block;
  }

  if(authentication == "Successful"){
    if(usertype == 1){
      DisableEverythingRelatedToEmployees();
      EditThePatientDashboard(name, usertype);
    }else if(usertype == 2){
      DisableEverythingRelatedToPatients();
      EditTheEmployeeDashboard(name, usertype);
    }
  }


  profile_patient_edit_in_block_button.addEventListener("click", () => EditPatientInformation(userid));
  profile_employee_edit_in_block_button.addEventListener("click", () => EditEmployeeInformation(userid));
  assign_services_in_block_button.addEventListener("click", () => AssignServiceToPatient(userid));
  profile_logout_button.addEventListener("click", () => LogoutUser());
}