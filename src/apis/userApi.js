import axios from "axios";





// 회원가입 API 호출
export const joinUser = (joinData) => {
  const response = axios.post('/api/users/user', joinData);
  return response;
};
