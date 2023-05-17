import React, { useEffect, useState } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';
  import { Line } from 'react-chartjs-2';

  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );

export default function GenerateChart(props) {
    const {latitude,longitude,nightMode,title,labels,data} = props;
    let [chart,setChart] = useState('');

    useEffect(()=>{
        if(data){
            console.log(props)

            let options = {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    colors:{
                        enabled: true,
                    },
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: true,
                        text: `${title??'Default Title'} (Latitude:${latitude}, Longitude: ${longitude})`,
                    },
                },
            };
            
        let dayData = {
            labels: labels,
            datasets: [
                {
                    id: 1,
                    label: 'Temperature in Celsius',
                    data: data,
                    borderColor: nightMode ? 'rgb(255, 99, 132)' : 'rgb(53, 162, 235)',
                    backgroundColor: nightMode ? 'rgba(255, 99, 132, 0.5)' : 'rgba(53, 162, 235, 0.5)',
                },
            ],
        };
        
        setChart(<Line
            datasetIdKey='id'
            options={options}
            data={dayData}
            />)
            
        }
    },[props])

  return (
    <>
        {chart}
    </>
  )
}
