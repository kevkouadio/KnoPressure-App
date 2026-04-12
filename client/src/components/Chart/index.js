import React, { useState, useEffect } from 'react';
import 'zingchart/es6';
import ZingChart from 'zingchart-react';
import API from "../../utils/BP";

function Chart() {
  const [BP, setBP] = useState([])

  useEffect(() => {
    loadBP()
  }, [])

  function loadBP() {
    API.getBPData()
      .then(res =>
        setBP(res.data)
      )
      .catch(err => console.log(err));
  };

  let bp = BP;
  let systolicData = [];
  bp.map(sd => {
    systolicData.push([new Date(sd.date).toLocaleString('en-US', { month: 'short', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }), sd.Systolic])
  });
  let diastolicData = [];
  bp.map(sd => {
    diastolicData.push([new Date(sd.date).toLocaleString('en-US', { month: 'short', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }), sd.Diastolic])
  });

  const myData = {
    type: 'line',
    labels: [
      { //Scale to indicate value of normal bp rate 
        text: 'Systolic/Normal',
        hook: 'scale:name=scale-y,index=6',
        backgroundColor: '#4caf50'
      },
      {
        text: 'Systolic/elevated',
        hook: 'scale:name=scale-y,index=7',
        backgroundColor: 'yellow'
      },
      {
        text: 'Systolic/High BP',
        hook: 'scale:name=scale-y,index=8',
        backgroundColor: 'darkred',
        color: 'white'
      },
      {
        text: 'Diastolic/High BP',
        hook: 'scale:name=scale-y,index=5',
        backgroundColor: 'darkred',
        color: 'white'
      },
      {
        text: 'Diastolic/Normal',
        hook: 'scale:name=scale-y,index=3',
        backgroundColor: '#4caf50'
      },
      {
        text: 'Diastolic/elevated',
        hook: 'scale:name=scale-y,index=4',
        backgroundColor: 'yellow'
      },
    ],
    scaleY: {
      label: {
        text: "Systolic & Disatolic values"
      },
    },
    scaleX: {
      label: {
        text: "Date & time"
      }
    },
    series: [
      { values: diastolicData, lineColor: 'red' },
      { values: systolicData, lineColor: 'blue' }
    ]
  };

  return (
    <div className="chart-page">
      {BP.length > 0 ? (
        <ZingChart data={myData} />
      ) : (
        <p className="chart-empty">
          No readings yet. Add measurements on the home page to see your chart.
        </p>
      )}
    </div>
  );
}


export default Chart;
