import React, { useState, useEffect } from "react";
import Col from "../../components/Col";
import API from "../../utils/BP";
import { Input, FormBtn } from "../../components/Form";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Form from "../Form/Form";
// import "./style.css";

function SearchForm() {
  const [BP, setBP] = useState([])
  const [formObject, setFormObject] = useState({})
  const [sevenDayAverage, setSevenDayAverage] = useState({ systolic: 0, diastolic: 0 });
  const [monthAverage, setMonthAverage] = useState({ systolic: 0, diastolic: 0 });

  const notify = () => toast.success("Systolic and Diastolic values saved!", {
    position: "top-center",
    autoClose: 4000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });

  const notifyE = () => toast.error("Incorrect Systolic and/or Diastolic values!", {
    position: "top-center",
    autoClose: 4000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });

  useEffect(() => {
    loadBP()
  }, [])

  function loadBP() {
    API.getBPData()
      .then(res => {
        setBP(res.data);
        setSevenDayAverage(getSevenDayAverage(res.data));
        setMonthAverage(getMonthlyAverage(res.data))
      })
      .catch(err => console.log(err));
  };
  //function to get the 7 day average 
  function getSevenDayAverage(bpData) {
    const today = new Date();
    let systolicTotal = 0;
    let diastolicTotal = 0;
    let systolicCount = 0;
    let diastolicCount = 0;

    // Loop through the BP data array and add up the values for the last 7 days
    for (let i = 0; i < bpData.length; i++) {
      const bpDate = new Date(bpData[i].date);
      const timeDiff = Math.abs(today.getTime() - bpDate.getTime());
      const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
      if (diffDays <= 7) {
        systolicTotal += bpData[i].Systolic;
        diastolicTotal += bpData[i].Diastolic;
        systolicCount++;
        diastolicCount++;
      }
    }

    // Calculate the average values for each type of pressure
    const systolicAverage = systolicCount > 0 ? Math.round(systolicTotal / systolicCount) : 0;
    const diastolicAverage = diastolicCount > 0 ? Math.round(diastolicTotal / diastolicCount) : 0;

    // Return the average values as a new object
    return { systolic: systolicAverage, diastolic: diastolicAverage };
  }

  //function to get monthly average
  function getMonthlyAverage(readings) {
    const currentDate = new Date();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

    const monthlyReadings = readings.filter(reading => {
      const readingDate = new Date(reading.date);
      return readingDate >= firstDayOfMonth && readingDate <= lastDayOfMonth;
    });

    const monthlyAverage = monthlyReadings.reduce((acc, reading) => {
      acc.systolic += reading.Systolic;
      acc.diastolic += reading.Diastolic;
      return acc;
    }, { systolic: 0, diastolic: 0 });

    if (monthlyReadings.length > 0) {
      monthlyAverage.systolic = Math.round(monthlyAverage.systolic / monthlyReadings.length);
      monthlyAverage.diastolic = Math.round(monthlyAverage.diastolic / monthlyReadings.length);
    }

    return monthlyAverage;
  }

  function handleFormSubmit(event) {
    event.preventDefault();
    if (formObject.systolic.trim() !== '' && formObject.diastolic.trim() !== '') {
      API.saveBP({
        Systolic: formObject.systolic,
        Diastolic: formObject.diastolic,
      })
        .then(res => loadBP())
        .then(notify)
        .catch(err => notifyE(err))
    } else if (formObject.systolic.trim() === '' && formObject.diastolic.trim() === '') {
      notifyE();
    }
    setTimeout(function () {
      window.location.reload();
    }, 5000);
  };

  function handleInputChange(event) {
    const { name, value } = event.target;
    setFormObject({ ...formObject, [name]: value })
  };

  /**
   * BP zone colors match standard chart bands (AHA-style):
   * Normal / Elevated / Stage 1 / Stage 2+: use the worse of systolic vs diastolic.
   */
  function getTierClass(systolic, diastolic) {
    if (!systolic || !diastolic || systolic === 0 || diastolic === 0) {
      return "bp-stat-card--empty";
    }
    let s = 0;
    if (systolic < 120) s = 0;
    else if (systolic <= 129) s = 1;
    else if (systolic <= 139) s = 2;
    else s = 3;

    let d = 0;
    if (diastolic < 80) d = 0;
    else if (diastolic <= 89) d = 1;
    else if (diastolic <= 99) d = 2;
    else d = 3;

    const worst = Math.max(s, d);
    const tiers = [
      "bp-stat-card--normal",
      "bp-stat-card--elevated",
      "bp-stat-card--stage1",
      "bp-stat-card--high"
    ];
    return tiers[worst];
  }

  const sevenDayTier = getTierClass(
    sevenDayAverage.systolic,
    sevenDayAverage.diastolic
  );
  const monthTier = getTierClass(monthAverage.systolic, monthAverage.diastolic);

  return (
    <Col size="md-6" id="emptycol" className="search-form-panel home-panel home-panel--entry">
      <p className="search-form-lead">Log today&apos;s reading</p>
      <Form>
        <p className="search-form-hint">Enter systolic and diastolic (mmHg)</p>
        <div className="home-bp-inputs-row">
          <div className="home-bp-field">
            <Input
              id="systolic"
              onChange={handleInputChange}
              name="systolic"
              placeholder="Systolic (required)"
            />
            <label id="systolic-label" htmlFor="systolic">
              Systolic / top
            </label>
          </div>
          <div className="home-bp-field">
            <Input
              id="diastolic"
              onChange={handleInputChange}
              name="diastolic"
              placeholder="Diastolic (required)"
            />
            <label id="diastolic-label" htmlFor="diastolic">
              Diastolic / bottom
            </label>
          </div>
        </div>
        <div className="home-submit-wrap">
          <FormBtn
            disabled={!(formObject.systolic && formObject.diastolic)}
            onClick={handleFormSubmit}
          >
            Submit
          </FormBtn>
        </div>
        <div className="home-stat-grid">
          <div className={`bp-stat-card ${sevenDayTier}`}>
            {sevenDayAverage.systolic && sevenDayAverage.diastolic ? (
              <h6>
                7-day average: {sevenDayAverage.systolic} /{" "}
                {sevenDayAverage.diastolic} mmHg
              </h6>
            ) : (
              <h6>Add readings to see your 7-day average.</h6>
            )}
          </div>
          <div className={`bp-stat-card ${monthTier}`}>
            {monthAverage.systolic && monthAverage.diastolic ? (
              <h6>
                Monthly average: {monthAverage.systolic} / {monthAverage.diastolic}{" "}
                mmHg
              </h6>
            ) : (
              <h6>Add readings to see your monthly average.</h6>
            )}
          </div>
        </div>
        <ToastContainer />
      </Form>
    </Col>
  );
}

export default SearchForm;