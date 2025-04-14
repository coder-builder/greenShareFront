import axios from "axios";
import React, { useEffect, useState } from "react";
import styles from "./TempDetail.module.css";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceArea,
} from "recharts";
import { useNavigate, useParams } from "react-router-dom";
import { IMAGE_PATH } from "../../../consts/upload";

const HumidDetail = () => {
  /* 습도 그래프 */
  const [isTemperatureOk, setIsTemperatureOk] =
    useState(false); /* 습도가가 적정범위에 있는지 판단하는 useState */
  const { id, temperature } = useParams(); /* 작물의 아이디값 받아오는 것 */
  const [data, setData] = useState([]); /* 데이터 받아오는것 */
  const [crop, setCropDetail] = useState([]);
  const [interval, setInterval] = useState("1h"); // ⏱️ 기본값: 1시간 단위
  const nav = useNavigate();

  useEffect(() => {
    axios
      .get(`/api/plants/${id}`)
      .then((res) => {
        setCropDetail(res.data);
      })
      .catch((error) => {
        console.log("작물 조회 실패:", error);
      });
  }, [id]); //  id가 바뀔 때만 작물 정보 요청

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get(
          `/api/environment/humid?interval=${interval}`
        );
        const result = res.data.map((item) => ({
          time: new Date(item.joinDate).toLocaleTimeString(),
          습도: item.humidity,
        }));
        setData(result); /* time과 습도를 받아오는 것*/

        // ✅ 적정 습도 판별
        console.log();
        if (crop.humidMin !== undefined && crop.humidMax !== undefined) {
          const allInRange = result.every(
            (d) => d.습도 >= crop.humidMin && d.습도 <= crop.humidMax
          );
          setIsTemperatureOk(allInRange);
        }
      } catch (err) {
        console.error("데이터 불러오기 실패:", err);
      }
    };

    fetchHistory();
  }, [interval, crop.humidMin, crop.humidMax]);

  return (
    <div className={styles.mainCon}>
      {/* 메인 컨테이너 */}

      <div className={styles.statusBox}>
        {isTemperatureOk ? (
          <>
            <div className={styles.imgBoxGood}>
              <img src={`${IMAGE_PATH}/${crop.imgName}`} />
            </div>
            <div className={styles.statusGood}>
              <span style={{ color: "green" }}>✅ 습도가</span>
              <span> {crop.crop}에게 적절합니다</span>
            </div>
          </>
        ) : (
          <>
            <div className={styles.imgBoxGood}>
              <img src={`${IMAGE_PATH}/${crop.imgName}`} />
            </div>
            <div className={styles.statusGood}>
              <span style={{ color: "red" }}>⚠️ 습도가</span>
              <span> {crop.crop}에게 적절하지 않습니다</span>
            </div>
          </>
        )}
        <div className={styles.buttonBox}>
          <button
            onClick={() => {
              nav(`/plant/${id}`);
            }}
            className={styles.backButton}
          >
            ← 뒤로가기
          </button>
        </div>
      </div>

      <div className={styles.selCon}>
        {/* 습도 div */}
        <div>
          {/*  */}
          💧 현재 습도(
          <span style={{ color: "#27B06E" }}>●</span>)
        </div>

        {/* ✅ 선택박스 UI */}
        <select value={interval} onChange={(e) => setInterval(e.target.value)}>
          <option value="1h">1시간 단위</option>
          <option value="6h">6시간 단위</option>
          <option value="12h">12시간 단위</option>
        </select>
      </div>

      <div style={{ height: "500px", width: "100%" }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="5 5" />
            <XAxis dataKey="time" />
            <YAxis domain={[10, 100]} />
            <Tooltip />
            <ReferenceArea
              y1={crop.humidMin}
              y2={crop.humidMax}
              strokeOpacity={0}
              fill="green"
              fillOpacity={0.2}
              label={{
                value: `${crop.crop} 적정 습도 (${crop.humidMin} ~ ${crop.humidMax}%) `,
                position: "insideBottomLeft",
                fill: "green",
              }}
            />

            <Line
              type="monotone"
              dataKey="습도"
              stroke="#27B06E"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default HumidDetail;
