import axios from "axios";
import { axiosInstance } from "../redux/axiosInstance";





// 회원가입 API 호출
export const joinUser = (joinData) => {
  const response = axios.post('/api/users/join', joinData);
  return response;
};

// 쪽지 수신자 확인
export const getReciverId = (userEmail) => {
  const response = axiosInstance.get('/users/checkReceiverId', {params:{'userEmail' : userEmail}});
  return response;
}
