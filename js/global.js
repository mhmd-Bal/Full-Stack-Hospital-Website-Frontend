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


const PostRegistrationData = async (register_patient_url) => {
  let name = document.getElementById("Name").value;
  let date_of_birth = document.getElementById("Date-of-birth").value;
  let email = document.getElementById("Email").value;
  let password = document.getElementById("Password").value;
  let verify_password = document.getElementById("Verify-password").value;

  if(password == verify_password){
    let data = new FormData();

    data.append("name", name);
    data.append("password", password);
    data.append("email", email);
    data.append("dob", date_of_birth);
    const response = await ExecutePostAPI(register_patient_url, data);
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

