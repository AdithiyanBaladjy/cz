 /**
 * Finds the log msg ID (which is to be passed to call_crm_function() method to trigger the send logs prompt)
 * @inputs inputDateStr - input date string of the format yyyy/mm/dd or yyyy-mm-dd 
 * @returns date string of the format dd/mm/yyyy (or) dd-mm-yyyy 
 * @example
 * // Input - 2023/02/01
 * // Output - 01/02/2023
 * // Input - 2023-02-01 
 * // Output - 01-02-2023 
 */
/*
  function findLogMsgIdFromLogContainer(inputDateStr)
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
  */