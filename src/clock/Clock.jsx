import React from 'react';
import { useState } from 'react';

function Clock(props){
  // const [time, setTime] = useState();
  // setInterval(()=>{
  //   setTime(new Date().toLocaleTimeString());
  // },1000);

  return(
    <div>
      <h1>안녕, 리액트!</h1>
      <h2>현재 시간: {new Date().toLocaleTimeString()}</h2>
    </div>
  );
};

export default Clock;