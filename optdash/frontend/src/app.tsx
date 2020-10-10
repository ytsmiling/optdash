import React, { useState, useEffect } from 'react';
import Header from './navs/header';
import Sidebar from './navs/sidebar';
import Content from './contents/content';
import fetch_data from './utils/fetch-data';
import './app.css';

function App() {
  const [study_name, setStudyName] = useState("");
  const [content_type, setContentType] = useState("study-list");

  const [study_summaries, setStudySummaries] = useState([] as Array<any>);

  useEffect(() => { fetch_data("/api/study-summaries", "", setStudySummaries, "study-summaries") }, []);

  return (
    <div className="App">
      <Header />
      <Sidebar onclick_hook={(v: string) => { setContentType(v); }} />
      <div className="App-main">
        <Content content_type={content_type} study_summaries={study_summaries} />
      </div>
    </div>
  );
}

export default App;