const baseurl = "http://localhost/Full-Stack-Hopital-Website/Full-Stack-Hospital-Website-Backend/";

const ExecuteGetAPI = async (api_url) => {
  try{
    return await axios(api_url);
  }catch(error){
    console.log(error);
  }
}

const ExecutePostAPI = async (api_url, api_data, api_token = null) => {
  try{
    return await axios.post(api_url, api_data, api_token);
  }catch(error){
    console.log(error);
  }
}

const MakeFormData = (list_of_data) => {
  let data = new FormData();
  for(let i=0; i<list_of_data.length; i++){
    console.log(Object.keys(list_of_data[i])[0]);
    data.append(`${Object.keys(list_of_data[i])[0]}`, list_of_data[i].value);
  }
  console.log(data);
  return data;
}


const PostRegistrationData = async (url) => {
  let name = document.getElementById("Name");
  let dob = document.getElementById("Date-of-birth");
  let email = document.getElementById("Email");
  let password = document.getElementById("Password");
  let verify_password = document.getElementById("Verify-password");
  
  let list_of_data = [];
  list_of_data.push(name,dob,email,password,verify_password);
  console.log(list_of_data);

  if(password == verify_password){
    let data =  MakeFormData(list_of_data);
    const response = await ExecutePostAPI(url, data);
    console.log(response);

  }else{
    console.log("Not the same password");
  }
}

//Page Functions

const LoadRegistration = async () => {
  const register_patient_url = baseurl + "Register.php";
  const register_button = document.getElementById("Signup-button");
  register_button.addEventListener("click", () => PostRegistrationData(register_patient_url));
}

