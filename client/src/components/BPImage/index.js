import React from "react";
import Col from "../../components/Col";
import "./style.css";

const BP_CATEGORIES = [
  {
    key: "normal",
    label: "Normal",
    systolic: "Less than 120",
    diastolic: "Less than 80",
  },
  {
    key: "elevated",
    label: "Elevated",
    systolic: "120–129",
    diastolic: "Less than 80",
  },
  {
    key: "stage1",
    label: "High blood pressure (Stage 1)",
    systolic: "130–139",
    diastolic: "80–89",
  },
  {
    key: "stage2",
    label: "High blood pressure (Stage 2)",
    systolic: "140 or higher",
    diastolic: "90 or higher",
  },
  {
    key: "crisis",
    label: "Hypertensive crisis (seek care)",
    systolic: "Higher than 180",
    diastolic: "Higher than 120",
  },
];

function BPImage() {
  return (
    <Col size="md-6" id="bloodpressure" className="home-panel home-panel--chart">
      <div
        className="bp-reading-reference"
        role="region"
        aria-labelledby="bp-ref-heading"
      >
        <h3 id="bp-ref-heading" className="bp-chart-title">
          Understanding blood pressure readings
        </h3>
        <p className="bp-ref-intro">
          Values are in <strong>mmHg</strong>. Your category follows whichever number
          (systolic or diastolic) falls in a higher range.
        </p>
        <div className="bp-ref-table-wrap">
          <table className="bp-ref-table">
            <caption className="sr-only">
              Blood pressure categories: systolic and diastolic ranges in millimeters
              of mercury
            </caption>
            <thead>
              <tr>
                <th scope="col">Category</th>
                <th scope="col">
                  Systolic
                  <span className="bp-ref-th-hint"> (top number)</span>
                </th>
                <th scope="col">
                  Diastolic
                  <span className="bp-ref-th-hint"> (bottom number)</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {BP_CATEGORIES.map((row) => (
                <tr key={row.key} className={`bp-ref-row bp-ref-row--${row.key}`}>
                  <th scope="row">{row.label}</th>
                  <td>{row.systolic}</td>
                  <td>{row.diastolic}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="bp-ref-footnote">
          Reference: common clinical categories (AHA-style). Always follow your
          clinician&apos;s guidance.
        </p>
      </div>
    </Col>
  );
}

export default BPImage;
