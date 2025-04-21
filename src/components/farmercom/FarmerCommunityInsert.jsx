import React, { useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { insertStories } from "../../apis/plantStory";
import styles from "./FarmerCommunityInsert.module.css";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css"; // 스타일도 꼭 import 해줘야 함
import Toolbar from "quill/modules/toolbar";
import imageCompression from "browser-image-compression";

const FarmerCommunityInsert = () => {
  const nav = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const quillRef = useRef(null);

  //이미지 경로 src 길이를 줄이기 
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
          const compressed = await imageCompression(file, options)
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
    insertStories(data)
      .then((res) => {
        alert("등록되었습니다");
        nav("/community");
      })
      .catch((error) => {
        console.log(error);
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
            style={{ height: "760px", width: "100%" }}
            value={content}
            onChange={setContent}
            modules={modules}
            ref={quillRef}
          />
        </div>
      </div>

      <div className={styles.btnDiv}>
        <button type="button" onClick={(e) => nav("/community")}>
          목록 가기
        </button>
        <button type="button" onClick={(e) => sendInsert()}>
          작성 완료
        </button>
      </div>
    </>
  );
};

export default FarmerCommunityInsert;
