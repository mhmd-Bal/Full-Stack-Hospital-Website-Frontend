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
    usertype: response.data.usertype 
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
  const {authentication,name,usertype} = await CheckUser();
  const profile_category_buttons = document.getElementsByClassName("Profile-category-buttons");
  const account_information_block = document.getElementsByClassName("Account-information-block");
  for(let i=0; i<profile_category_buttons.length; i++){
    profile_category_buttons[i].addEventListener('click', (event) => EnableTheChosenCategory(event));
    profile_category_buttons[i].index = i;
    profile_category_buttons[i].buttons = profile_category_buttons;
    profile_category_buttons[i].lists = account_information_block;
  }

  if(authentication == "Successful"){
    if(usertype == 1){
      const profile_assign_button = document.getElementById("Profile-assign-button");
      profile_assign_button.classList.add("Disabled");
    }else if(usertype == 2){
      const profile_request_button = document.getElementById("Profile-request-button");
      const profile_invoice_button = document.getElementById("Profile-invoice-button");
      profile_invoice_button.classList.add("Disabled");
      profile_request_button.classList.add("Disabled");
    }
  }
}