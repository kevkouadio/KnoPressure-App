import React, { useState, useEffect } from "react";
import MaterialTable from "material-table";
import TablePagination from "@material-ui/core/TablePagination";
import { MuiPickersUtilsProvider, KeyboardDateTimePicker } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import * as XLSX from 'xlsx';
import API from "../../utils/BP";
import { CloudDownload } from '@material-ui/icons';
import "./style.css"

/** Maps legacy material-table handlers to MUI 4.12+ TablePagination API (avoids prop-type warnings). */
function MaterialTablePagination(props) {
  const { onChangePage, onChangeRowsPerPage, icons: _icons, ...rest } = props;
  return (
    <TablePagination
      {...rest}
      onPageChange={onChangePage}
      onRowsPerPageChange={onChangeRowsPerPage}
    />
  );
}

function Table() {
    const [BP, setBP] = useState([])

    //format the date and time
    function formatDate(date) {
        const month = date.toLocaleString('default', { month: 'short' });
        const day = date.getDate();
        const year = date.getFullYear();
        const hour = date.getHours();
        let minute = date.getMinutes();
        minute = minute < 10 ? `0${minute}` : minute;
        const meridiem = hour >= 12 ? "PM" : "AM";
        const hour12 = hour % 12 || 12;
        return `${month} ${day}, ${year}, ${hour12}:${minute} ${meridiem}`;
    }

    //add new bp data on table
    function addBPData(newBPData) {
        API.saveBP(newBPData)
            .then(res => {
                loadBP()
            })
            .catch(err => console.log(err));
    }
    //delete a bp data on table
    function DeleteBPData(bpId) {
        API.deleteBP(bpId)
            .then(res => {
                loadBP()
            })
            .catch(err => console.log(err));
    }
    //update a bp data on table
    function updateBPData(bpId, newData) {
        API.updateBP(bpId, newData)
            .then(res => {
                loadBP()
            })
            .catch(err => console.log(err));
    }

    useEffect(() => {
        loadBP()
    }, [])

    function loadBP() {
        API.getBPData()
            .then(res =>
                setBP(res.data.reverse().map(bpData => {
                    const dateObj = new Date(bpData.date);
                    const formattedDate = formatDate(dateObj);
                    return { ...bpData, date: formattedDate };
                }))
            )
            .catch(err => console.log(err));
    };

    // custom date sorting function
    const customSort = (a, b) => {
        const aDate = new Date(a.date).getTime();
        const bDate = new Date(b.date).getTime();

        return aDate - bDate;
    };

    const columns = [
        { title: "Systolic", field: "Systolic" },
        { title: "Diastolic", field: "Diastolic" },
        {
            title: "Date",
            field: "date",
            // calling the custom sort function
            sortComparator: customSort,
            //component to select the date and time in the table 
            editComponent: ({ value, onChange }) => (
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <KeyboardDateTimePicker
                        margin="normal"
                        id="time-picker"
                        label="Time picker"
                        value={value}
                        onChange={(newValue) => {
                            //console.log(newValue);
                            sessionStorage.setItem('selectedDate', JSON.stringify(newValue)); // save newValue in session storage
                            onChange(newValue); // pass the new value to the parent component
                        }}
                        format="MM/dd/yyyy hh:mm a"
                        KeyboardButtonProps={{
                            "aria-label": "change time"
                        }}
                    />
                </MuiPickersUtilsProvider>
            ),
        },
    ];
    //function to export table data to excel sheet
    const downloadExcel = () => {
        // Remove unwanted columns from data
        const newData = BP.map(row => {
          const { _id, userID, __v, ...newRow } = row; // Destructure and remove unwanted fields
          delete newRow.tableData; // Remove additional field added by Material Table
          return newRow;
        });
      
        // Create worksheet and workbook
        const workSheet = XLSX.utils.json_to_sheet(newData);
        const workBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workBook, workSheet, "BP");
      
        //Buffer
        let buf = XLSX.write(workBook, { bookType: "xlsx", type: "buffer" });
        //Binary string
        XLSX.write(workBook, { bookType: "xlsx", type: "binary" });
        //Download
        XLSX.writeFile(workBook, "BP_readings.xlsx");
      }         

    return (
        <MaterialTable
            title=""
            columns={columns}
            data={BP}
            components={{
                Pagination: MaterialTablePagination,
            }}
            options={{
                actionsColumnIndex: -1,
                rowStyle: (rowData, index) => ({
                    backgroundColor: index % 2 === 0 ? "#f4fbfc" : "#ffffff",
                    color: "#1a2e35",
                }),
                headerStyle: {
                    backgroundColor: "#0d5c63",
                    color: "#ffffff",
                    fontWeight: 600,
                },
                filtering: true,
                sorting: true,
            }}
            actions={[
                {
                  icon: () => <CloudDownload />,
                  tooltip: "Export to Excel",
                  onClick: () => downloadExcel(),
                  isFreeAction: true
                }
              ]}
            editable={{
                onRowAdd: (newData) =>
                    new Promise((resolve, reject) => {
                        setTimeout(() => {
                            const storedDate = sessionStorage.getItem('selectedDate'); // get the saved date from session storage
                            if (storedDate) {
                                newData.date = formatDate(new Date(JSON.parse(storedDate))); // set newData.date to the saved date
                                sessionStorage.removeItem('selectedDate'); // delete the saved date from session storage
                            }
                            addBPData(newData);
                            console.log(newData.date);
                            resolve();
                        }, 1000);
                    }),
                onRowUpdate: (newData, oldData) =>
                    new Promise((resolve, reject) => {
                        setTimeout(() => {
                            const storedDate = sessionStorage.getItem('selectedDate'); // get the saved date from session storage
                            if (storedDate) {
                                newData.date = new Date(JSON.parse(storedDate)); // set newData.date to the saved date
                                sessionStorage.removeItem('selectedDate'); // delete the saved date from session storage
                            }
                            const bpId = oldData._id;
                            updateBPData(bpId, newData);
                            resolve();
                        }, 1000);
                    }),
                onRowDelete: (oldData) =>
                    new Promise((resolve, reject) => {
                        setTimeout(() => {
                            const Id = oldData._id;
                            DeleteBPData(Id);
                            resolve();
                        }, 1000);
                    }),
            }}
        />
    )
}

export default Table;