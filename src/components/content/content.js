import React,{useEffect, useState} from 'react';
import { useForm } from "react-hook-form";
import axios from 'axios';
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
import './content.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);


export default function Content({nightMode}) {
  let [latitude,setLatitude] = useState(0);
  let [longitude,setLongitude] = useState(0);
  let [weatherData,setWeatherData] = useState({})
  let [dayChart,setDayChart] = useState("");
  let [weekChart,setWeekChart] = useState("");
  const { register, handleSubmit } = useForm();
  const onSubmit = (data, e) => {
    console.log(data, e)
    setLatitude(data.latitude);
    setLongitude(data.longitude);
  };
  const onError = (errors, e) => console.log(errors, e);

  let baseUrl = 'https://api.open-meteo.com/v1/forecast?';

  useEffect(()=>{
    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition(
        (pos)=>{
          setLatitude(Math.round((pos.coords.latitude + Number.EPSILON) * 100) / 100);
          setLongitude(Math.round((pos.coords.longitude + Number.EPSILON) * 100) / 100);
        },
        (error)=>console.error(error)
        )
    }
  },[])

  useEffect(()=>{
    if(latitude && longitude){
      let url = baseUrl + `latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m`;
      
      axios.get(url).then((res)=>{
        setWeatherData(res.data);
      }).catch((error)=>{
        console.error(error);
        window.alert(error.message);
      });
    }

  },[latitude,longitude])

  useEffect(()=>{
    if(weatherData.hourly){

      let options = {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: `Temperature Chart for your Location => Latitude: ${latitude} Longitude: ${longitude}`,
          },
        },
      };

      let dayData = {
        labels: weatherData.hourly.time.slice(0,24),
        datasets: [
          {
            id: 1,
            label: 'temperature',
            data: weatherData.hourly.temperature_2m.slice(0,24),
            borderColor: nightMode ? 'rgb(255, 99, 132)' : 'rgb(53, 162, 235)',
            backgroundColor: nightMode ? 'rgba(255, 99, 132, 0.5)' : 'rgba(53, 162, 235, 0.5)',
          },
        ],
      };

      setDayChart(<Line
        datasetIdKey='id'
        options={options}
        data={dayData}
      />)

      let weekData = {
        labels: weatherData.hourly.time,
        datasets: [
          {
            id: 1,
            label: 'temperature',
            data: weatherData.hourly.temperature_2m,
            borderColor: nightMode ? 'rgb(255, 99, 132)' : 'rgb(53, 162, 235)',
            backgroundColor: nightMode ? 'rgba(255, 99, 132, 0.5)' : 'rgba(53, 162, 235, 0.5)',
          },
        ],
      };

      setWeekChart(<Line
        datasetIdKey='id'
        options={options}
        data={weekData}
      />)
    }
  },[weatherData,nightMode])

  return (
    <div className={`container ${nightMode? 'Day':'Night'}`}>
      
      <section className='section'>
        <header><h4>Custom Search</h4></header>
        <form onSubmit={handleSubmit(onSubmit, onError)}>
          <input type='text' id='latitude' name='latitude' placeholder='Latitude' {...register('latitude')}/>
          <input type='text' id='longitude' name='longitude' placeholder='Longitude' {...register('longitude')}/>
          <button type='submit'>Submit</button>
        </form>
      </section>

      <section className='section'>
        <header><h4>Today's Temperature Chart</h4></header>
        <div>
          {dayChart}
        </div>
      </section>
      
      <section className='section'>
        <header><h4>This Week's Temperature Chart</h4></header>
        <div>
          {weekChart}
        </div>
      </section>

    </div>
  )
}
