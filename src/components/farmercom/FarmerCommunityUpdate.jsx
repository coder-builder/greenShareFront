import React, { useEffect, useState } from "react";
import styles from "./FarmerCommunityUpdate.module.css";
import { useNavigate, useParams } from "react-router-dom";
import { detailStory } from "../../apis/plantStory";
import axios from "axios";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css"; // 스타일도 꼭 import 해줘야 함
import { axiosInstance } from "../../redux/axiosinstance";

const FarmerCommunityUpdate = () => {
  const modules = {
    toolbar: {
      container: [
        [{ header: [1, 2, 3, 4, 5, false] }],
        ["bold", "underline", "image"],
      ],
    },
  };

  const nav = useNavigate();

  const { boardNum } = useParams();

  //상세 식물 이야기를 가져와서 담는다
  const [updateDetail, setUpdateDetail] = useState({});

  useEffect(() => {
    detailStory(boardNum)
      .then((res) => setUpdateDetail(res.data))
      .catch((error) => console.log(error));
  }, [boardNum]);

  //상세 제목 수정 함수
  const handleUpdateData = (e) => {
    setUpdateDetail({
      ...updateDetail,
      [e.target.name]: e.target.value,
    });
  };

  //상세내용 수정 함수
  const handleUpdateDataContent = (value) => {
    setUpdateDetail({
      ...updateDetail,
      content: value
    });
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.title}>
          <p>제목</p>
          <input
            type="text"
            name="title"
            value={updateDetail.title}
            onChange={(e) => handleUpdateData(e)}
          />
        </div>
        <div className={styles.content}>
          <p>내용</p>
          <ReactQuill
            style={{ height: "750px" }}
            value={updateDetail.content}
            onChange={(value) => handleUpdateDataContent(value)}
            modules={modules}
          />
        </div>
      </div>

      <div className={styles.btn}>
        <button type="button" onClick={(e) => nav("/community")}>
          목록 가기
        </button>
        <button
          type="button"
          onClick={(e) => {
            if (updateDetail.title === "" || updateDetail.content === "") {
              alert("제목과 내용을 입력하세요");
              return;
            }
            axiosInstance
              .put(`/plantStories/${boardNum}`, updateDetail)
              .then((res) => {
                alert("수정이 완료되었습니다");
                nav(`/detail-community/${boardNum}`);
              })
              .catch((error) => console.log(error));
          }}
        >
          수정 완료
        </button>
      </div>
    </>
  );
};

export default FarmerCommunityUpdate;
