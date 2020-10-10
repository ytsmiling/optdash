import React from 'react';
import './sidebar.css';

function Sidebar(props: any) {
  return (
    <div>
      <div className="sidebar-background">
      </div>
      <div className="sidebar">
        <a onClick={() => props.onclick_hook("study-list")}>Studies</a>
        <a onClick={() => props.onclick_hook("contour")}>Contour plot</a>
        <a onClick={() => props.onclick_hook("edf")}>EDF</a>
        <a onClick={() => props.onclick_hook("interm")}>Interm. values</a>
        <a onClick={() => props.onclick_hook("history")}>History</a>
        <a onClick={() => props.onclick_hook("parallel")}>Parallel coordinate</a>
        <a onClick={() => props.onclick_hook("importance")}>Param importance</a>
      </div>
    </div>
  );
}

export default Sidebar;