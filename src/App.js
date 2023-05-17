import './App.css';
import { useState } from 'react';
import {BiAdjust} from 'react-icons/bi';
import Dashboard from './components/dashboard/dashboard'

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

      <section>
        <Dashboard nightMode={nightMode}/>
      </section>

      <footer>
        <h2>Footer</h2>
      </footer>
    </div>
  );
}

export default App;
