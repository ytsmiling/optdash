import React, {useState, useEffect} from 'react';
import Header from './navs/header';
import Sidebar from './navs/sidebar';
import './app.css';

function App() {
  const [plot_type, setPlotType] = useState("");

  return (
    <div className="App">
        <Header/>
        <Sidebar onclick_hook={(v: string) => {setPlotType(v);}}/>
    </div>
  );
}

export default App;