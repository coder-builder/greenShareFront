import axios from "axios"

// 식물 이야기 등록 api
export const insertStories = (insertStory) => {
 const response = axios.post("/api/plantStories", insertStory)
 return response;
}

//식물 이야기 조회 api
export const getStories = () =>{
  const response = axios.get("/api/plantStories")
  return response;
}

//식물 이야기 상세 조회 api
export const detailStory = (boardNum)=>{
  const response = axios.get(`/api/plantStories/${boardNum}`)
  return response;
}