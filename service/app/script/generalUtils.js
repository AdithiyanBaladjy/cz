

//Takes in logged-in User Profile & profileBasedSectionShowConditions array of JSONS as inputs to show/hide sections
function displayHideSectionsBasedProfile(loggedInUsrProfile,userSpecialPermissionArr)
{
    //change to hide lien remarks feature until next release
    //return;
    console.log("Inside profile-based show/hide");
    for(let rule of profileBasedSectionShowConditions)
    {
        let allowedProfiles=rule["allowedProfiles"];
        let sectionQueriesToBeShown=rule["SectionQueriesToBeShown"];
        let sectionQueriesToBeHidden=rule["SectionQueriesToBeHidden"];
        if(allowedProfiles&&allowedProfiles.length>0)
        {
            if(userSpecialPermissionArr&&userSpecialPermissionArr.includes("Lien Remarking - S360")&&rule["conditionName"]=="Lien Mark Show/Hide Condition")
            {
                if(sectionQueriesToBeShown&&sectionQueriesToBeShown.length>0)
                {
                    
                    for(let query of sectionQueriesToBeShown)
                    {
                        let domElements=document.querySelectorAll(query);
                        if(domElements && domElements.length>0)
                        {
                            for(let elem of domElements)
                            {
                                elem.classList.remove("hide");
                                elem.setAttribute("actionAllowed","true");
                            }
                        }
                    }
                }
                if(sectionQueriesToBeHidden&&sectionQueriesToBeHidden.length>0)
                {
                    for(let query of sectionQueriesToBeHidden)
                    {
                        let domElements=document.querySelectorAll(query);
                        if(domElements && domElements.length>0)
                        {
                            for(let elem of domElements)
                            {
                                elem.classList.add("hide");
                                elem.setAttribute("actionAllowed","false");
                            }
                        }
                    }
                }
            }
        }
    }
}

function dynamicSpecialPermissionsCheckHook(userSpecialPermissionArr)
{
    console.log("Inside special permissions hook",userSpecialPermissionArr);
    for(let rule of profileBasedSectionShowConditions)
    {
        let allowedProfiles=rule["allowedProfiles"];
        let sectionQueriesToBeShown=rule["SectionQueriesToBeShown"];
        let sectionQueriesToBeHidden=rule["SectionQueriesToBeHidden"];
        let rulePermissionTag=rule["specialPermissionTag"];
        for(let query of sectionQueriesToBeShown)
        {
            let domElements=document.querySelectorAll(query);
            if(rulePermissionTag&&userSpecialPermissionArr&&userSpecialPermissionArr.includes(rulePermissionTag))
            {
                console.log("Dom elements governed by special permissions",domElements);

                if(domElements && domElements.length>0)
                {
                    for(let elem of domElements)
                    {
                        elem.classList.remove("hide");
                        elem.setAttribute("actionAllowed","true");
                    }
                }
            }
            else
            {
                if(domElements && domElements.length>0)
                {
                    for(let elem of domElements)
                    {
                        elem.classList.add("hide");
                        elem.setAttribute("actionAllowed","false");
                    }
                }
            }
        }
        
    }
}

//Restrict numbers in input boxes to two decimals
function setTwoNumberDecimal(event) {
    console.log("Inside two number decimals",event.target);
    event.value = parseFloat(event.value).toFixed(2);
}

//sets a date object as the date of a input element
function setDateInInput(dateObj,inputElemRef)
{
    let dateStr=dateObj.getFullYear().toString()+"-"+(dateObj.getMonth()+1).toString().padStart(2,0)+"-"+dateObj.getDate().toString().padStart(2,0);
    inputElemRef.value=dateStr;
}

//validate mandatory input elements
//Input - array of input elements (HTML input elements / custom elements with custom attribute "value")
//Output - true - if all input elements are non-empty 
//         false - if any element is empty (also shakes the empty elements in the UI)
function validateNonEmptyInputs(inputElems)
{
    let retVal=true;
    for(let element of inputElems)
    {
        let inputVal=element.value||element.getAttribute("value");
        if(!inputVal)
        {
            shakeElement(element);
            retVal=false;
        }
    }
    return retVal;
}


//function to add tooltip to any HTML element
//Inputs
function addToolTip(elem,toolTipText)
{
    let toolTipElem=document.createElement("div");
    toolTipElem.id=`tooltip${generalCloneCount}`;
    toolTipElem.classList.add("tool-tip");
    toolTipElem.classList.add("hide");
    toolTipElem.innerHTML=toolTipText;
    generalCloneCount++;
    elem.appendChild(toolTipElem);
    elem.classList.add("relative-parent");
    elem.addEventListener("mouseenter",(evt)=>{
        console.log("Mouse enter:",elem,toolTipElem);
        let associateToolTip=elem.querySelector(".tool-tip");
        associateToolTip.classList.remove("hide");});
    elem.addEventListener("mouseleave",(evt)=>{
        let associateToolTip=elem.querySelector(".tool-tip");
        associateToolTip.classList.add("hide");});
}


//function to convert a apiResp JSON to logStr with sensitive data masking
/**
 * @Inputs - apiLog - JSON object of the API response, sensitiveData - the sensitive data to be masked, lastNDigits - the last n digits to be unmasked
 * @Output {Str equivalent of the input JSON with sensitive info masked}
*/
function getLogStrFromResp(apiLog,sensitiveData,lastNDigit)
{
    if(apiLog)
    {
        try
    {
        apiLog=JSON.stringify(apiLog);
    }
    catch(err)
    {
        console.error("Error in Stringifying API response",err);
        apiLog=String(apiLog);
    }
    let maskedStr="";
    let inputStrLen=sensitiveData.length;
    for(i=0;i<inputStrLen;i++)
    {
        if(i<(inputStrLen-lastNDigit))
        {
            maskedStr+=maskingChar;
        }
        else
        {
            maskedStr+=sensitiveData[i];
        }
    }
    apiLog=apiLog.replaceAll(sensitiveData,maskedStr);
    return apiLog;
    }
    return null;
}