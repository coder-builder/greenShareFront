import axios from "axios";

//axios의 객체생성
//객체 생성후 해당 axios 객체를사용하면 동일한 설정 정보를 가지고
//요청을 보낼 수 있음
export const axiosInstance = axios.create({
  baseURL: "http://localhost:8080", // *****
  withCredentials: true,
});

// 요청시 실행할 인터셉터
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");

    //토큰이 있으면 요청 헤더에 토큰 담아보내기
    if (token) {
      config.headers.Authorization = token; // 요청 헤더에 토큰 추가
    }
    return config; // 요청을 계속 진행
  },
  (error) => Promise.reject(error)
);
