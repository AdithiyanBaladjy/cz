
//Constants
const monthDays=[31,28,31,30,31,30,31,31,30,31,30,31];
const monthCommonForms=[["jan","january"],["feb","february"],["march","mar"],["april","apr"],["may"],["june","jun"],["july","jul"],["aug","august"],["sept","september","sep"],["oct","october"],["nov","november"],["dec","december"]];
/**
 * Get client side timezone.
 *
 * @returns {(+|-)HH:mm} - Where `HH` is 2 digits hours and `mm` 2 digits minutes.
 * @example
 * // From Indian/Reunion with UTC+4
 * // '+04:00'
 * getTimeZone()
 */
 function getTimeZone(){
    const timezoneOffset = new Date().getTimezoneOffset();
    const offset = Math.abs(timezoneOffset);
    const offsetOperator = timezoneOffset < 0 ? '+' : '-';
    const offsetHours = Math.floor(offset / 60).toString().padStart(2, '0');
    const offsetMinutes = Math.floor(offset % 60).toString().padStart(2, '0');
    return `${offsetOperator}${offsetHours}:${offsetMinutes}`;
  }

/**
 * Add timeZoneOffset to a hour minute string of a day
 * @inputs  timeZoneOffset - time zone offset string of the format +|-HH:mm where `HH` is hours and `mm` is minutes & dayHourMinute is string of the format `HH:mm`
 * @returns {(+1|-1|0):HH:mm | null} - Where `+1|-1|0` is day quotient, `HH` is 2 digits hours and `mm` 2 digits minutes. returns null when addition could not be performed
 * @example
 0* // Inputs - +05:30 & 20:30
 * // Output - +1:05:00
 */
function addOffsetToTime(timeZoneOffset,dayHourMinute){
  let zoneOperator;
  let zoneHH;
  let zoneMM;
  let dayHH;
  let dayMM;
  let zoneSplitArray;
  let daySplitArray;
  if(timeZoneOffset=="")
  {
    return dayHourMinute;
  }
  try{
    zoneSplitArray=timeZoneOffset.split(":");
    daySplitArray=dayHourMinute.split(":");
    zoneOperator=timeZoneOffset[0];
    zoneHH=Number(zoneSplitArray[0]);
    zoneMM=Number(zoneSplitArray[1]);
    dayHH=Number(daySplitArray[0]);
    dayMM=Number(daySplitArray[1]);

    if(zoneOperator=="+")
    {
      let resultAddedMM=zoneMM+dayMM;
      let resultMMQ=Math.floor(resultAddedMM/60);
      resultAddedMM=resultAddedMM%60;
      let resultAddedHH=zoneHH+dayHH+resultMMQ;
      let resultAddedHHQ=Math.floor(resultAddedHH/24);
      resultAddedHH=resultAddedHH%24;
      return `${resultAddedHHQ}:${resultAddedHH.toString().padStart(2, '0')}:${resultAddedMM.toString().padStart(2, '0')}`;
    }
    else if(zoneOperator=="-")
    {
      let resultAddedMM=dayMM-zoneMM;
      let resultMMQ=0;
      if(resultAddedMM<0)
      {
        resultMMQ=Math.floor(resultAddedMM/60);
        resultAddedMM=60+((resultAddedMM*-1)%60)*-1;
      }
      let resultAddedHH=dayHH+zoneHH+resultMMQ;
      let resultAddedHHQ=0;
      if(resultAddedHH<0)
      {
        resultAddedHHQ=-1;
        resultAddedHH+=24;
      }
      return `${resultAddedHHQ}:${resultAddedHH.toString().padStart(2, '0')}:${resultAddedMM.toString().padStart(2, '0')}`;
    }
    else
    {
      return null; //operator is not of the expected format
    }
  }
  catch(e)
  {
    return null;
  }
  
}

/**
 * Add timeZoneOffset to a date + hour minute string
 * @inputs  timeZoneOffset - time zone offset string of the format +|-HH:mm where `HH` is hours and `mm` is minutes & dayTimeHourMinute is string of the format `dd/mm/yyyy HH:mm`
 * @returns {dd/mm/yyyy HH:mm | null} - resulting day time string from addition where dd - date, mm - month, yyyy - year, `HH` is 2 digits hours and `mm` 2 digits minutes. returns null when addition could not be performed
 * @example
 * // Inputs - 05:30 & 15/02/2024 12:30 
 * // Output - 15/02/2024 17:30
 */
 function addOffsetToDayTime(timeZoneOffset,dayTimeHourMinute){
  let resultHHMM;
  let dayHHMM;
  let dayDate;
  let resultArr;
  try{
    dayHHMM=dayTimeHourMinute.split(" ")[1];
    dayDate=dayTimeHourMinute.split(" ")[0];
    resultHHMM=addOffsetToTime(timeZoneOffset,dayHHMM);
    if(!resultHHMM)
    {
      return null;
    }
    else
    {
      resultArr=resultHHMM.split(":");
      let dayQuotient=Number(resultArr[0]);
      if(dayQuotient==0)
      {
        return `${dayDate} ${resultArr[1]}:${resultArr[2]}`;
      }
      else{
        let daysDate;
        let monthDate;
        let yearDate;
        daysDate=Number(dayDate.split("/")[0]);
        monthDate=Number(dayDate.split("/")[1]);
        yearDate=Number(dayDate.split("/")[2]);
        let nDaysOfMonth=monthDays[monthDate-1];
        if(monthDate==2)
        {
          if(yearDate%4==0)
          {
            nDaysOfMonth=29;
          }
        }
        if(dayQuotient>0)
        {
          //add quotient to the date
          let daysAdded=dayQuotient+daysDate;
          let remDays=daysAdded;
          while(remDays>nDaysOfMonth)
          {
            remDays-=nDaysOfMonth;
            monthDate++;
            nDaysOfMonth=monthDays[monthDate-1];
            if(Math.floor((monthDate-1)/12)>0)
            {
              yearDate++;
            }
            if(monthDate==2&&(yearDate%4==0))
            {
              nDaysOfMonth=29;
            }
          }
          daysDate=remDays;
          return `${(""+daysDate).padStart(2, '0')}/${(""+monthDate).padStart(2, '0')}/${(""+yearDate).padStart(4, '0')} ${resultArr[1]}:${resultArr[2]}`;
        }
        else
        {
          //subtract quotient from the date
          let daysAdded=daysDate+dayQuotient;
          let remDays=daysAdded;
          while(remDays<=0)
          {
            monthDate--;
            if(monthDate<=0)
            {
              monthDate=12;
              yearDate--;
            }
            nDaysOfMonth=monthDays[monthDate-1];
            if(monthDate==2&&(yearDate%4==0))
            {
              nDaysOfMonth=29;
            }
            remDays+=nDaysOfMonth;
          }
          daysDate=remDays;
          return `${(""+daysDate).padStart(2, '0')}/${(""+monthDate).padStart(2, '0')}/${(""+yearDate).padStart(4, '0')} ${resultArr[1]}:${resultArr[2]}`;
        }
      }
    }
  }
  catch(e)
  {
    return null;
  }
 }


 /**
 * Add remove seconds part from a date time string
 * @inputs  dayTimeStr - day time string of the format dd/mm/yyyy hh:mm:ss.
 * @returns {dd/mm/yyyy HH:mm} 
 * @example
 * // Input - 12/02/2024 15:45:25
 * // Output - 12/02/2024 15:45
 */
  function removeSecondsFromDateTime(dayTimeStr){
    let dateSplitArr=dayTimeStr.split(" ");
    let datePart=dateSplitArr[0];
    let timePart=dateSplitArr[1];
    let timeSplit=timePart.split(":");
    if(timeSplit.length>=3)
    {
      return `${datePart} ${timeSplit[0]}:${timeSplit[1]}`;
    }
    return dayTimeStr;
  }


 /**
 * Add remove seconds part from a date time string
 * @inputs  TimeStr - time string of the format hh:mm:ss.
 * @returns {time string of the format "hh:mm:ss AM|PM" | null if input is not valid} 
 * @example
 * // Input - 15:45:25
 * // Output - 3:45:25 PM
 */
  function resolveTimeAmPm(timeStr){
    try
    {
      let timeSplitArr=timeStr.split(":");
      let hour=Number(timeSplitArr[0]);
      let ampm;
      if(hour>=12)
      {
        ampm="PM";
        if(hour>12)
        {
          hour-=12;
        }
      }
      else
      {
        ampm="AM";
      }
      timeStr='';
      for(let i=1;i<timeSplitArr.length;i++)
      {
        if(i!=1)
        {
          timeStr+=":";
        }
        timeStr+=timeSplitArr[i];
      }
      return `${hour.toString().padStart(2,0)}:${timeStr} ${ampm}`;
    }
    catch(e)
    {
      return null;
    }
  }

  
       /**
 * Checks whether the given date string is of date month string format
 * @inputs  dateStr - time string of the format dd <month short form> yyyy || <month short form> dd yyyy
 * @returns {true | false - if input is in a valid date month string format} 
 * @example
 * // Input - 01 Jan 2023
 * // Output - true | false
 */
function isDateOfMonthStrFormat(dateStr){
  if(dateStr)
  {
    if(dateStr.includes(" "))
    {
      let dateComponents=dateStr.split(" ");
      if(dateComponents.length>=3)
      {
          if((dateComponents[0].length<=2)&&(dateComponents[2].length==4)&&(dateComponents[1].length>2))
        {
          let monthComponent=dateComponents[1];
          try{
            monthComponent=monthComponent.toLowerCase();
          }
          catch(e)
          {
            return false;
          }
          for(let m of monthCommonForms)
          {
            if(m.includes(monthComponent.toLowerCase()))
            {
              return true;
            }
          }
          return false;
        }
        else
        {
          return false;
        }
      }
      else
      {
        return false;
      }
    }
    else
    {
      return false;
    }
  } 
  else
  {
    return false;
  }      
}

   /**
 * Converts date month string to date number string
 * @inputs  dateStr - time string of the format dd <month short form> yyyy || <month short form> dd yyyy
 * @returns {date string of the format dd/mm/yyyy} 
 * @example
 * // Input - 01 Jan 2023
 * // Output - 01/01/2023
 */
  function dateMonthStrToDateNumberStr(dateStr){
      let isDateMonthStr=isDateOfMonthStrFormat(dateStr);
      if(isDateMonthStr)
      {
        let dateComponents=dateStr.split(" ");
        let day=dateComponents[0];
        let month=dateComponents[1];
        let year=dateComponents[2];
        month=monthStrToMonthNumber(month);
        if(month)
        {
          return day+"/"+month+"/"+year;
        }
        else
        {
          return dateStr;
        }
      }
      else
      {
        return dateStr;
      }
}

/**
 * Converts month common form string to month number
 * @inputs  monthStr - month common form string
 * @returns {number representing month} 
 * @example
 * // Input - Jan
 * // Output - 01
 */
 function monthStrToMonthNumber(monthStr){
  let i=1;
  try{
    monthStr=monthStr.toLowerCase();
  }
  catch(e)
  {
    return null;
  }
  for(let m of monthCommonForms)
  {
    if(m.includes(monthStr))
    {
      return i.toString().padStart(2,"0"); 
    }
    i++;
  }
  return null;
}


/**
 * Converts UTC-time zone based str to local time str
 * @inputs  dateTimeStr - date time str of format dd/mm/yyyy hh:mm(+|-)hh:mm
 * @returns {dateTime str representing the equivalent time in local time zone} 
 * @example
 * // Input - 01/02/2023T05:30:22+05:30
 * // Output - 01/02/2023 11:00:22 PM - if local time is IST
 */
 function convertUTCStrToLocalDateTime(utcDateTime){
  let dateStr;
  let timeStr;
  let resultTime;
  if((!utcDateTime)||(utcDateTime=="-")||(utcDateTime==""))
  {
    return "-";
  }
  if(utcDateTime.includes("T"))
  {
    dateStr=format_date(utcDateTime.split("T")[0]);
    timeStr=utcDateTime.split("T")[1];
  }
  else if(utcDateTime.includes(" "))
  {
    dateStr=format_date(utcDateTime.split(" ")[0]);
    timeStr=utcDateTime.split(" ")[1];
  }
  else
  {
    dateStr=utcDateTime;
  }
  if(dateStr.includes("/"))
  {
    let dateStrComponents=dateStr.split("/");
    if((dateStrComponents[0].length==4)&&(dateStrComponents[1].length<=2)&&(dateStrComponents[2].length<=2))
    {
      dateStr=dateStrComponents[2]+"/"+dateStrComponents[1]+"/"+dateStrComponents[0];
    }
    utcDateTime=dateStr;
  }
  else if(dateStr.includes("-"))
  {
    let dateStrComponents=dateStr.split("-");
    if((dateStrComponents[0].length==4)&&(dateStrComponents[1].length<=2)&&(dateStrComponents[2].length<=2))
    {
      dateStr=dateStrComponents[2]+"/"+dateStrComponents[1]+"/"+dateStrComponents[0];
    }
    utcDateTime=dateStr;
  }
  
  if(timeStr)
  {
    let offsetTime;
    let timeWithoutOffset;
    let dateStrFormatted=dateStr.replaceAll("-","/");
    let localTimeOffset=getTimeZone();
    
    if(timeStr.includes("+"))
    {
      offsetTime="+"+timeStr.split("+")[1];
      timeWithoutOffset=timeStr.split("+")[0];
    }
    else if(timeStr.includes("-"))
    {
      offsetTime="-"+timeStr.split("-")[1];
      timeWithoutOffset=timeStr.split("-")[0];
    }
    else if(timeStr.includes("Z"))
    {
      offsetTime="+00:00";
      timeWithoutOffset=timeStr.split("Z")[0];
    }
    if(offsetTime)
    {
      let offsetTimeLen=offsetTime.length;
      if(offsetTime[0]=="+")
      {
        offsetTime="-"+offsetTime.substring(1,offsetTimeLen);
      }
      else
      {
        offsetTime="+"+offsetTime.substring(1,offsetTimeLen);
      }
      resultTime=addOffsetToDayTime(offsetTime,`${dateStrFormatted} ${timeWithoutOffset}`);
      resultTime=addOffsetToDayTime(localTimeOffset,resultTime);
      resultTime=removeSecondsFromDateTime(resultTime);
      resultTime=resultTime.split(" ")[0]+" "+resolveTimeAmPm(resultTime.split(" ")[1]);
    }
    if(!resultTime)
    {
      resultTime=dateStr+" "+timeStr;
      resultTime=removeSecondsFromDateTime(resultTime);
      resultTime=resultTime.split(" ")[0]+" "+resolveTimeAmPm(resultTime.split(" ")[1]);
    }
  }
  if(resultTime)
  {
    return resultTime;
  }
  else
  {
    return utcDateTime;
  }
}



/**
 * Finds the difference in days between two js date objects
 * @inputs date1, date2 - two date objects
 * @returns {Difference in days. difference will be positive if date2 is later than date1, else negative} 
 * @example
 * // Input - 01/02/2023 02/02/2023
 * // Output -1
 */
 function findDifferenceInDays(date1,date2)
 {
    const msPerDay=1000*60*60*24;
    const utc1=Date.UTC(date1.getFullYear(),date1.getMonth(),date1.getDate());
    const utc2=Date.UTC(date2.getFullYear(),date2.getMonth(),date2.getDate());
    return Math.floor((utc2-utc1)/msPerDay);
 }

 /**
 * Creates a JS date object from an input of date string
 * @inputs inputDateStr - input date string of the format dd/mm/yyyy, dateFormatStr - optional could be like dd-mm-yyyy or yyyy-mm-dd or a similar date format with separator either - or /
 * @returns {a js date object representing the given date string} 
 * @example
 * // Input - 01/02/2023
 * // Output - JS date object representing 01/02/2023
 * // Input - 01/02/2023, dateFormatStr - dd/mm/yyyy
 * // Output - JS date object representing 01/02/2023
 * // Input - 01/02/2023, dateFormatStr - dd/mm-yyyy
 * // Output - null as dateFormatStr is invalid
 */
  function createJsDateObj(inputDateStr,dateFormatStr)
  {
    if(!dateFormatStr)
    {
      if(inputDateStr && inputDateStr!="-")
      {
        if(inputDateStr.includes("/"))
        {
          const day=inputDateStr.split("/")[0];
          const month=inputDateStr.split("/")[1];
          const year=inputDateStr.split("/")[2];
          const convertedStr=month+"/"+day+"/"+year;
          let timeStamp=Date.parse(convertedStr);
          let outputDateObj=new Date(timeStamp);
          return outputDateObj;
        }
        else if(inputDateStr.includes("-"))
        {
          const day=inputDateStr.split("-")[0];
          const month=inputDateStr.split("-")[1];
          const year=inputDateStr.split("-")[2];
          const convertedStr=month+"/"+day+"/"+year;
          let timeStamp=Date.parse(convertedStr);
          let outputDateObj=new Date(timeStamp);
          return outputDateObj;
        }
      }
      else
      {
        return null;
      }
    }
    else
    {
      if(inputDateStr && inputDateStr!="-")
      {
        let separator="-";
        let dateFormatArr;
        let dateIndex;
        let monthIndex;
        let yearIndex;
        let dateComponentsArr;
        if(dateFormatStr.includes("/"))
        {
          separator="/";
        }
        dateFormatArr=dateFormatStr.split(separator);
        for(let i=0;i<dateFormatArr.length;i++)
        {
          dateFormatArr[i]=dateFormatArr[i].toLowerCase();
          if(dateFormatArr[i]=='dd')
          {
            dateIndex=i;
          }
          else if(dateFormatArr[i]=='mm')
          {
            monthIndex=i;
          }
          else if(dateFormatArr[i]=='yyyy'||dateFormatArr[i]=='yy')
          {
            yearIndex=i;
          }       
        }
        if((dateIndex==undefined)||(monthIndex==undefined)||(!yearIndex==undefined))
        {
          return null;
        }
        dateComponentsArr=inputDateStr.split(separator);
        const day=dateComponentsArr[dateIndex];
        const month=dateComponentsArr[monthIndex];
        const year=dateComponentsArr[yearIndex];
        let timeStamp=Date.parse(month+"/"+day+"/"+year);
        return new Date(timeStamp);
      }
      else
      {
        return null;
      }
    }
    
     
  }

  /**
 * Reverses the input date string, used for default html input date picker
 * If input is not of the expected format, the inputDateStr is returned as output without any transformation / exceptions raised
 * @inputs inputDateStr - input date string of the format yyyy/mm/dd or yyyy-mm-dd 
 * @returns date string of the format dd/mm/yyyy (or) dd-mm-yyyy 
 * @example
 * // Input - 2023/02/01
 * // Output - 01/02/2023
 * // Input - 2023-02-01 
 * // Output - 01-02-2023 
 */
   function reverseDateStr(inputDateStr)
   {
      let dateComponents;
      if(inputDateStr.includes("-"))
      {
        dateComponents=inputDateStr.split("-");
        return dateComponents[2]+"-"+dateComponents[1]+"-"+dateComponents[0];
      }
      else if(inputDateStr.includes("/"))
      {
        dateComponents=inputDateStr.split("/");
        return dateComponents[2]+"/"+dateComponents[1]+"/"+dateComponents[0];
      }
      return inputDateStr;
   }


   //Sid's bf for date format bug
   function convertUTCStrToLocalDateTimeNative(date_St, timeZone) {
    const date = new Date(date_St); // Parse the UTC date
    const options = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZone: timeZone, // Set the target time zone
    };
    return new Intl.DateTimeFormat("en-GB", options).format(date); // Format as DD/MM/YYYY
  }