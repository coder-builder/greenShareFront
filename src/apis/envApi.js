import axios from "axios";

//환경 변수를 조회하는 api
export const getEnvList = () =>{
  const response = axios.get("/api/environment")

  return response;
}

//기준(적정)데이터를 조회하는 api
export const getCropStandardsList = () =>{
  const response = axios.get("/api/plants")
  return response;
}

