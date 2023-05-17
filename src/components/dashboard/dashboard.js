import React,{useEffect, useState} from 'react';
import { useForm } from "react-hook-form";
import axios from 'axios';

import GenerateChart from '../chart/generateChart';

import './dashboard.css';

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
      let dayLabels = weatherData.hourly.time.map(time=>new Date(time+'Z').toLocaleTimeString()).slice(0,24);
      let dayData = weatherData.hourly.temperature_2m.slice(0,24);

      setDayChart(<GenerateChart 
        latitude={latitude}
        longitude={longitude}
        title={'Todays Temperature Forecast'}
        labels={dayLabels}
        data={dayData}
        nightMode={nightMode}
      />)
      
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      let weekLabels = weatherData.hourly.time.map(time=>days[new Date(time+'Z').getDay()]);
      let weekData = weatherData.hourly.temperature_2m;

      setWeekChart(<GenerateChart 
        latitude={latitude}
        longitude={longitude}
        title={"Week's Temperature Forecast"}
        labels={weekLabels}
        data={weekData}
        nightMode={nightMode}
      />)
    }
  },[weatherData,nightMode])

  return (
    <div className={`container ${nightMode? 'Night border-light':'Day border-dark'}`}>
      
      <section className='section'>
        <header><h4>Custom Search</h4></header>
        <form onSubmit={handleSubmit(onSubmit, onError)} className={`card form ${nightMode ? 'Night':'Day'}-card`}>
          <input type='text' id='latitude' name='latitude' className='input' placeholder='Latitude' {...register('latitude')}/>
          <input type='text' id='longitude' name='longitude' className='input' placeholder='Longitude' {...register('longitude')}/>
          <button type='submit' className={`btn btn-${nightMode ? 'Night' : 'Day'}`}>Submit</button>
        </form>
      </section>

      <section className='section'>
        <header><h4>Today's Temperature Forecast</h4></header>
        <div className={`card ${nightMode ? 'Night':'Day'}-card`}>
          {dayChart}
        </div>
      </section>
      
      <section className='section'>
        <header><h4>This Week's Temperature Forecast</h4></header>
        <div className={`card ${nightMode ? 'Night':'Day'}-card`}>
          {weekChart}
        </div>
      </section>
    </div>
  )
}
