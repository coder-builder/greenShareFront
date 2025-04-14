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

const SoilDetail = () => {
  const [isTemperatureOk, setIsTemperatureOk] =
    useState(false); /* 온도가 적정범위에 있는지 판단하는 useState */
  const { id, temperature } = useParams(); /* 작물의 아이디값 받아오는 것 */
  const [data, setData] = useState([]); /* 데이터 받아오는것 */
  const [crop, setCropDetail] = useState([]);
  const [interval, setInterval] = useState("1h"); // ⏱️ 기본값: 1시간 단위
  const nav = useNavigate();

  useEffect(() => {
    /* 작물의 아이디값에 따라 작물의 데이터를 받아오는 useEffect */
    axios
      .get(`/api/plants/${id}`)
      .then((res) => {
        setCropDetail(res.data);
      })
      .catch((error) => {
        console.log("작물 조회 실패:", error);
      });
  }, [id]); // id가 바뀔 때만 작물 정보 요청

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get(`/api/environment?interval=${interval}`);
        const result = res.data.map((item) => ({
          time: new Date(item.joinDate).toLocaleTimeString(),
          ["토양 수분"]: item.soilMoisture,
        }));
        setData(result); /* time과 토양 수분을 받아오는 것*/

        // ✅ 적정 토양습도 판별
        console.log();
        if (crop.soilMin !== undefined && crop.soilMax !== undefined) {
          /* 토양 수분값안에 들어가는지 판단 */
          const allInRange = result.every(
            (d) => d.토양 >= crop.soilMin && d.토양 <= crop.soilMax
          );
          setIsTemperatureOk(allInRange); /* 올바른 값인지 설정하는 useState */
        }
      } catch (err) {
        console.error("데이터 불러오기 실패:", err);
      }
    };

    fetchHistory();
  }, [interval, crop.soilMin, crop.soilMax]);

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
              <span style={{ color: "green" }}>✅ 토양 수분이</span>
              <span> {crop.crop}에게 적절합니다</span>
            </div>
          </>
        ) : (
          <>
            <div className={styles.imgBoxGood}>
              <img src={`${IMAGE_PATH}/${crop.imgName}`} />
            </div>
            <div className={styles.statusGood}>
              <span style={{ color: "red" }}>⚠️ 토양 수분이</span>
              <span> {crop.crop}에게 적절하지 않습니다</span>
            </div>
          </>
        )}
        <div className={styles.buttonBox}>
          <button onClick={() => nav(-1)} className={styles.backButton}>
            ← 뒤로가기
          </button>
        </div>
      </div>

      <div className={styles.selCon}>
        {/* 온도 div */}
        <div>
          🌱 현재 토양 수분(
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
            <YAxis domain={[10, 80]} />
            <Tooltip />
            <ReferenceArea
              y1={crop.soilMin}
              y2={crop.soilMax}
              strokeOpacity={0}
              fill="green"
              fillOpacity={0.2}
              label={{
                value: `${crop.crop} 적정 토양 수분 (${crop.soilMin} ~ ${crop.soilMax}%) `,
                position: "insideBottomLeft",
                fill: "green",
              }}
            />

            <Line
              type="monotone"
              dataKey="토양 수분"
              stroke="#27B06E"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SoilDetail;
