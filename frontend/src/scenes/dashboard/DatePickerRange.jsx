import { Button } from '@mui/material';
import { I18nContext } from 'i18n';
import React, { forwardRef, useContext, useState } from 'react'
import DatePicker, { CalendarContainer } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useGetDashboardGraphQuery } from 'state/api';




function manipulateDate(oldDate, offset, offsetType, operation) {
    const newDate = new Date(oldDate.getTime());
    
    const operators = {
      add: (val, off) => val + off,
      rest: (val, off) => val - off,
    };
    
    const offsetTypes = {
      Y: "FullYear",
      M: "Month",
      D: "Date",
      H: "Hours",
    };
    
    if (operation === "add" || operation === "rest") {
      newDate[`set${offsetTypes[offsetType]}`](
        operators[operation](oldDate[`get${offsetTypes[offsetType]}`](), offset)
      );
    } else {
       return oldDate;
    }
    
    return newDate;
  }

  function hoursBetween(date1, date2) {
    let diff = Math.abs(date2 - date1);
    let diffHours = Math.floor(diff / (1000 * 60 * 60));
    return diffHours;
  }

  function getDaysBetweenDates(date1, date2) {
    let d1 = new Date(date1);
    d1.setHours(0,0,0,0)
    let d2 = new Date(date2);
    d2.setHours(23,59,59)
    let timeDiff = Math.abs(d2.getTime() - d1.getTime());
    let diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)); 
    return diffDays;
  }

  function getUnit(days) {
    let timeUnit;
  
    switch (true) {
      case days <= 1:
        timeUnit = "hour";
        break;
      case days <= 30:
        timeUnit = "day";
        break;
      case days <= 365:
        timeUnit = "month";
        break;
      default:
        timeUnit = "year";
        break;
    }
  
    return timeUnit;
  }

  function getDateISOString(date, endOfDay = false) {
    const hours = endOfDay ? 23 : 0;
    const minutes = endOfDay ? 59:0;
    const seconds = endOfDay ? 59:0;
    const milliseconds = endOfDay ? 999 : 0;
    return date ? new Date(date?.setHours(hours, minutes, seconds, milliseconds)).toISOString() : null
  }
  

const DatePickerRange = ({setGraphData, setUnit, setDateTitle}) => {
    const { translate: t } = useContext(I18nContext);
    const [startDate, setStartDate] = useState(manipulateDate(new Date(), 7, "D", "rest"));
    const [endDate, setEndDate] = useState(new Date());
    const diffDays = getDaysBetweenDates(endDate, startDate)
    const params = {
        endDate: getDateISOString(endDate, true),
        startDate: getDateISOString(startDate),
        unit: getUnit(diffDays),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
    } 

    



    const { data, isLoading } = useGetDashboardGraphQuery(params);

    setGraphData(data)
    setUnit(getUnit(diffDays))

    const onChange = (dates) => {
        const [start, end] = dates;
        setDateTitle(t("dashboard.datePicker.title.customRange"))
        setStartDate(start);
        setEndDate(end);
    };

   


    const ExampleCustomInput = forwardRef(({ value, onClick }, ref) => (
        <Button variant='contained' className="example-custom-input" onClick={onClick} ref={ref}>
            {value}
        </Button>
    ));


    const MyContainer = ({ className, children }) => {

        return (
            <div >
                <CalendarContainer className={className}>
                    <div style={{ display: 'flex' }}>
                        <div style={{ position: "relative" }}>{children}</div>

                    </div>
                </CalendarContainer>
            </div>
        );
    };

    return (
        <DatePicker
            selected={startDate}
            onChange={onChange}
            startDate={startDate}
            endDate={endDate}
            selectsRange
            monthsShown={2}
            calendarContainer={MyContainer}
            customInput={<ExampleCustomInput />}

        >

        </DatePicker>
    );
}

export default DatePickerRange


