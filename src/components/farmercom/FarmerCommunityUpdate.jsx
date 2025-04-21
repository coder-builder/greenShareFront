import React, { useEffect, useMemo, useRef, useState } from "react";
import styles from "./FarmerCommunityUpdate.module.css";
import { useNavigate, useParams } from "react-router-dom";
import { detailStory } from "../../apis/plantStory";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { axiosInstance } from "../../redux/axiosInstance";
import imageCompression from "browser-image-compression";

const FarmerCommunityUpdate = () => {
  const quillRef = useRef(null);

  // 이미지 업로드 핸들러 정의
  const imageHandler = () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      const file = input.files[0];

      if (file) {
        const options = {
          maxSizeMB: 2,
          maxWidthOrHeight: 1024,
          useWebWorker: true,
        };

        try {
          const compressed = await imageCompression(file, options);
          const reader = new FileReader();

          reader.onload = () => {
            const base64 = reader.result;
            const editor = quillRef.current.getEditor();
            const range = editor.getSelection(true);
            editor.insertEmbed(range.index, "image", base64);
            editor.setSelection(range.index + 1);
          };

          reader.readAsDataURL(compressed);
        } catch (err) {
          console.error("이미지 압축 중 에러 발생:", err);
        }
      }
    };
  };

  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [1, 2, 3, 4, 5, false] }],
          ["bold", "underline", "image"],
        ],
        handlers: {
          image: imageHandler,
        },
      },
    }),
    []
  );

  const nav = useNavigate(); // 페이지 이동용
  const { boardNum } = useParams(); // URL 파라미터 가져오기

  // 초기 상태 설정: 제목과 내용은 빈 문자열로 시작
  const [updateDetail, setUpdateDetail] = useState({
    title: "",
    content: "",
  });

  useEffect(() => {
    detailStory(boardNum)
      .then((res) => {
        setUpdateDetail(res.data);
      })
      .catch((error) => console.log("데이터 불러오기 오류", error));
  }, [boardNum]);

  // 제목 입력값 변경 시 호출
  const handleTitleChange = (e) => {
    setUpdateDetail((state) => ({
      ...state,
      [e.target.name]: e.target.value,
    }));
  };

  // 내용 입력값 변경 시 호출
  const handleContentChange = (value) => {
    setUpdateDetail((state) => ({
      ...state,
      content: value,
    }));
  };

  // 수정 완료 버튼 클릭 시 호출
  const handleUpdateSubmit = () => {
    if (!updateDetail.title || !updateDetail.content) {
      alert("제목과 내용을 입력하세요");
      return;
    }

    axiosInstance
      .put(`/plantStories/${boardNum}`, updateDetail)
      .then(() => {
        alert("수정이 완료되었습니다");
        nav(`/detail-community/${boardNum}`);
      })
      .catch((error) => {
        console.log("수정 오류", error);
      });
  };

  return (
    <div className={styles.container}>
      <div className={styles.title}>
        <p>제목</p>
        <input
          type="text"
          name="title"
          value={updateDetail.title}
          onChange={(e) => handleTitleChange(e)}
          placeholder="제목을 입력하세요"
        />
      </div>

      <div className={styles.content}>
        <p>내용</p>
        <ReactQuill
          style={{ height: "750px" }}
          value={updateDetail.content}
          onChange={handleContentChange}
          modules={modules}
          ref={quillRef}
        />
      </div>

      <div className={styles.btn}>
        <button onClick={() => nav("/community")}>목록 가기</button>
        <button onClick={handleUpdateSubmit}>수정 완료</button>
      </div>
    </div>
  );
};

export default FarmerCommunityUpdate;
