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
    console.log(response);
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
  const nouser_buttons = document.getElementsByClassName("Account-nouser-button");
  const user_buttons = document.getElementsByClassName("Account-user-button");
  if(authentication == "Successful"){
    for(let i=0; i<nouser_buttons.length; i++){
      nouser_buttons[i].classList.add("Disabled");
    }
    for(let i=0; i<user_buttons.length; i++){
      user_buttons[i].classList.remove("Disabled");
    }
  }else if(authentication == "There is no user logged in"){
    for(let i=0; i<nouser_buttons.length; i++){
      nouser_buttons[i].classList.remove("Disabled");
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
  CheckIfAdmin();
  logout_button.addEventListener('click', () => LogoutUser());
  
  for(let i=0; i<category_buttons.length; i++){
    category_buttons[i].addEventListener('click', (event) => EnableTheChosenCategory(event));
    category_buttons[i].index = i;
    category_buttons[i].buttons = category_buttons;
    category_buttons[i].lists = category_lists;
  }

  FillTheCategories();
}