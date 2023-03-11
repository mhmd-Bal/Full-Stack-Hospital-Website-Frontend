const baseurl = "http://localhost/Full-Stack-Hopital-Website\Full-Stack-Hospital-Website-Backend/";

const ExecuteGetAPI = async (api_url) => {
  try{
    return await axios(api_url);
  }catch(error){
    console.log(error);
  }
}

const ExecutePostAPI = async (api_url, api_data, api_token = null) => {
  try{
    return await axios(api_url, api_data, api_token = null);
  }catch(error){
    console.log(error);
  }
}