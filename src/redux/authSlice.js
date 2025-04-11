import { createSlice } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";


const getToken = () => {
  const token = localStorage.getItem('accessToken');

  if(!token || token.split('.').length !== 3){
    return { token: null, user: null };
  }

  try {
    const decodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000;

    if (decodedToken.exp < currentTime) {
      return { token: null, user: null };
    }

    return {
      token: token,
      user: {
        userEmail: decodedToken.userEmail,
        userTel: decodedToken.userTel,
        userRole: decodedToken.userRole,
        joinDate: decodedToken.joinDate,
        userName: decodedToken.userName,
      },
    };

  } catch (error) {
    return { token: null, user: null };
  }
}




const authSlice = createSlice({
  name : 'auth',
  initialState: getToken(),
  reducers : {
    loginReducer : (state, action) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      localStorage.setItem('accessToken', action.payload.token);
    },
    logoutReducer: (state) => {
      state.token = null;
      state.user = null;
      localStorage.removeItem('accessToken');
    }
  }
})





export const {loginReducer, logoutReducer} = authSlice.actions;
export default authSlice;