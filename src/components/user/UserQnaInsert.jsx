import React, { useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./UserQnaInsert.module.css";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css"; // 스타일도 꼭 import 해줘야 함
import Toolbar from "quill/modules/toolbar";
import { qna } from "../../apis/qna";
import UserQna from "./UserQna";
import imageCompression from "browser-image-compression";

const UserQnaInsert = () => {
  const nav = useNavigate();
  const quillRef = useRef(null);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

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

  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ header: [1, 2, 3, 4, 5, false] }],
        ["bold", "underline", "image"],
      ],
      handlers: {
        image: imageHandler
      }
    },
  }), []);

  const sendInsert = () => {
    const data = {
      title: title,
      content: content,
    };

    if (data.title === "" || data.content === "") {
      alert("제목과 내용은 필수 작성입니다");
      return;
    } 
    qna(data)
      .then((response) => {
        alert("등록되었습니다");
        nav("/qna");
      })
      .catch((error) => {
        console.log(error);
        console.log(data);
      });
  };

  console.log(content);

  return (
    <>
      <h3>이야기를 올려주세요!</h3>

      <div className={styles.container}>
        <div className={styles.title}>
          <p>제목</p>
          <input
            placeholder="제목을 입력하세요"
            type="text"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div>
          <ReactQuill
            style={{ height: "1050px", width: "100%" }}
            value={content}
            onChange={setContent}
            modules={modules}
            ref={quillRef}
          />
        </div>
      </div>
      <div className={styles.btnDiv}>
        <button type="button" onClick={(e) => nav("/qna")}>
          목록 가기
        </button>
        <button type="button" onClick={(e) => sendInsert()}>
          작성 완료
        </button>
      </div>
    </>
  );
};

export default UserQnaInsert;

