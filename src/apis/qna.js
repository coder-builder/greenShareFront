import { axiosInstance } from "../redux/axiosInstance";

// qna 이야기 등록 api
export const qna = (insertQna) => {
  const response = axiosInstance.post("/qna", insertQna);
  return response;
};
