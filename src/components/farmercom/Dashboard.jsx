import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';


const Dashboard = () => {


  const data = [
    { time: '00:00', temperature: 22, humidity: 60 },
    { time: '01:00', temperature: 21, humidity: 62 },
    { time: '02:00', temperature: 20, humidity: 64 },
    { time: '03:00', temperature: 19, humidity: 66 },
    { time: '04:00', temperature: 18, humidity: 68 },
    { time: '05:00', temperature: 17, humidity: 70 },
    { time: '06:00', temperature: 16, humidity: 72 },
    { time: '07:00', temperature: 18, humidity: 70 },
    { time: '08:00', temperature: 20, humidity: 65 },
    { time: '09:00', temperature: 22, humidity: 60 },
  ];

  return (
    
    
    <>
      <div>dashboard</div>
        
      <div className="bar-chart-container">
        <h2>시간별 온도 및 습도</h2>
  
        {/* 반응형 막대 그래프 */}
        <ResponsiveContainer width="40%" height={400}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="temperature" fill="#8884d8" name="온도 (°C)" />
            <Bar dataKey="humidity" fill="#82ca9d" name="습도 (%)" />
          </BarChart>
        </ResponsiveContainer>
      </div>
  
        
        
      <div/>
    </>

    
    
    
  )
}

export default Dashboard