import { jwtDecode } from "jwt-decode";

//만료 됐는지 ? 
export const isTokenExpired = (token) => {
  const decodedToken = jwtDecode(token);//토큰 복호화
  const currentTime = Date.now() / 1000;

  return decodedToken.exp < currentTime;
}

//로그인 여부
export const isAuthenticated = (token) => {
    if(!token) return false;
    if(isTokenExpired(token)) {
      localStorage.removeItem('accessToken');
      return false;
    }

    return true;
}

//로그인 및 관리자 여부
export const isAdmin = (token) => {
  if(!isAuthenticated(token)) return false;

  const decodedToken = jwtDecode(token);

  return decodedToken.role === 'ROLE_ADMIN'

}