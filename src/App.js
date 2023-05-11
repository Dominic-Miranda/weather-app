import './App.css';
import { useState } from 'react';
import {BiAdjust} from 'react-icons/bi';
import Content from './components/content/content'

function App() {
  let [nightMode,toggleNightMode] = useState(true)
  return (
    <div className={`App ${nightMode ? 'Night':'Day'}`}>
      <header className='heading'>
        <h2>Weather App</h2>
        <button 
          variant='secondary' 
          className={`btn-icon btn-${nightMode ? 'Night':'Day'}`} 
          onClick={()=>toggleNightMode(!nightMode)}>
            <BiAdjust />
        </button>
      </header>
      <hr className={`horizontalRule`}/>
      <section>
        <Content nightMode={nightMode}/>
      </section>
    </div>
  );
}

export default App;
