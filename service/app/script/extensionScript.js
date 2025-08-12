var templates=[
    {
        "id":1,
        "templateName":"Test Template 1",
        "templateBody":"Dear Customer, Your grievance for {$sub_area} with ticket ID ${ticketId} has been lodged successfully and will be attended shortly - Union Bank of India"
    },
    {
        "id":2,
        "templateName":"Test Template 2",
        "templateBody":"Dear Customer, Your grief for {$sub_area} with ticket ID ${ticketId} has been lodged successfully and will be attended shortly - Union Bank of India"
    }
];
var layoutFields=[{
    fieldLabel:"Ticket Number",
    apiName:"number"
}];
var currentTemplate;
var isEditTemplate=false;
var fieldToInsert;
//Prod config

var analyticsTableUrl="https://analytics.unionbankofindia.co.in/api/crmadmin1@unionbankofindia.bank/Desk_ccudesk/SmsTemplatesTable";
var crmModuleUrl="https://ucrmapi.unionbankofindia.co.in/crm/v6/coql";
var connectionName="zohocrm";
var layoutId="358000041464422";
var adminProfiles=["358000000166172"];

//UAT config
// var analyticsTableUrl="https://analytics.unionbankofindia.co.in/api/zohocrm.support@unionbankofindia.bank/Desk_Uat/SmsTemplatesTable";
// var connectionName="smstemplateextension";
// var layoutId="443000041464422";
// var adminProfiles=["443000000166172"];
//
var deskDomain="https://service.unionbankofindia.co.in";

var adminPrivileges=["templateEditBtn","createTemplateBtn"];
var loggedInUserId;
var profileId;
var ticketData;
var templateToBeSent;
var templateIdToBeSent;
var templateNameToBeSent;
var templateParamToBeSent;
var mobileToBeSent;
var CustomerName;
var searchTimer;
// var defaultTemplatesLoaded;
var defaultTemplatesLoadedSms;
var defaultTemplatesLoadedWA;
var actionCallBackAdded=false;
var prevTypedChar;
var mediumWhatsapp=false;
var availableNumbers=[];

window.onload=()=>{
    // populateTemplates(templates)
    populateLoadingBars(1,"templateNameElem");
    populateLoadingBars(1,"templateBodyElem");
    document.getElementById("formTemplateBody").addEventListener("keyup",(evt)=>{textAreaKeyed(evt);});
    document.getElementById("fieldSearchBox").addEventListener("keyup",()=>{searchTicketFields();});
    document.getElementById("searchTextBox").addEventListener("keyup",()=>{searchTemplates();});
    ZOHODESK.extension.onload().then(function (App) {
        setLoggedInUserId();
        console.log("Extension app is",App);

    }).catch((err)=>{
        console.log("Error in extension loading",err);
        viewTemplate();
    });
}
function loadTab()
{
    populateLoadingBars(1,"templateNameElem");
    populateLoadingBars(1,"templateBodyElem");
    if((stadat)&&(stadat[0]))
    {
        ticketData=stadat[0];
    }
    document.getElementById("formTemplateBody").addEventListener("keyup",(evt)=>{textAreaKeyed(evt);});
    document.getElementById("fieldSearchBox").addEventListener("keyup",()=>{searchTicketFields();});
    document.getElementById("searchTextBox").addEventListener("keyup",()=>{searchTemplates();});
    fetchTemplates();
    mobileToBeSent=phone_for_desk || mobl;
    // availableNumbers=[phone_for_desk,mobl,alternatePhoneNo];
    availableNumbers=[mobl];
    let dynamicDropDown=createDynamicDropDown(availableNumbers,(selectedVal)=>{selectMobileNumber(selectedVal);});
    dynamicDropDown.classList.add("disable-click");
    dynamicDropDown.classList.add("hide-icon");
    dynamicDropDown.classList.add("flex-parent-center-align");
    dynamicDropDown.classList.remove("drop-box");
    dynamicDropDown.classList.add("dynamic-drop-drop-box");
    // dynamicDropDown.classList.add("align-right");
    dynamicDropDown.classList.add("horizontalMargin");
    document.getElementById("mobileNumberContainer").appendChild(dynamicDropDown);
    dynamicDropDown.selectItemByIndex(0);
    CustomerName=customerFullName;
}
function selectMobileNumber(number)
{
    mobileToBeSent=number;
}
function setLoggedInUserId()
{
    ZOHODESK.get("user.id").then((data)=>{
        console.log("logged-in user ID is",data);
        loggedInUserId=data["user.id"];
        let profileUrl=deskDomain+"/api/v1/agents/"+loggedInUserId+"?include=profile";
        console.log("profile URL is",profileUrl);
        makeApiCall(connectionName,profileUrl,null,"GET",(success)=>{
            let resp=JSON.parse(success);
            let respData=JSON.parse(resp.response);
            let data=respData.statusMessage;
            profileId=data.profileId;
            console.log("profile ID is",respData);
            if(adminProfiles.includes(profileId))
            {
                for(let k=0;k<adminPrivileges.length;k++)
                {
                    document.getElementById(adminPrivileges[k]).classList.remove('hide');
                }
            }
            fetchTemplates();
        },(err)=>{
            console.log("Error in getting profile",err);
            viewTemplate();
        })
    });
}
function textAreaKeyed(evt)
{
    let currentChar;
    if(evt.key!="Shift")
    {
        currentChar=evt.key;
        if(prevTypedChar=="#"&&currentChar=="{")
        {
            showInsertFieldPop();
        }
        else
        {
            prevTypedChar=currentChar;
        }
    }
}
function closeFieldsPopUp()
{
    let fieldsPopUp=document.getElementById("ticketFieldsPop");
    fieldsPopUp.classList.add("hide");
}
function clearInfoMsg()
{
    document.getElementById("errorMsg").innerHTML="";
}
function showInfoMsg(msg,success,infoId)
{
    let infoElem=document.getElementById("errorMsg");
    if(infoId)
    {
        infoElem=document.getElementById(infoId);
    }
    if(success)
    {
        infoElem.classList.remove("shake");
        infoElem.classList.remove("failure-msg");
        infoElem.innerHTMLs="";
        infoElem.innerHTML=msg;
        infoElem.classList.add("success-msg");
        infoElem.classList.add("shake");
    }
    else
    {
        infoElem.classList.remove("shake");
        infoElem.classList.remove("success-msg");
        infoElem.innerHTMLs="";
        infoElem.innerHTML=msg;
        infoElem.classList.add("failure-msg");
        infoElem.classList.add("shake");
    }
    let infoTimer=setTimeout(()=>{
        infoElem.innerHTML="";
        infoElem.classList.remove("shake");
        infoElem.classList.remove("success-msg");
        infoElem.classList.remove("failure-msg");
        clearTimeout(infoTimer);
},5000);
}
//button to create template
//to be attached to create button when user logged in is admin
function updateTemplate(templateName,templateBody,btnElem,templateId)
{
    let apiUrl=analyticsTableUrl+`?ZOHO_ACTION=UPDATE&ZOHO_OUTPUT_FORMAT=JSON&ZOHO_ERROR_FORMAT=JSON&ZOHO_API_VERSION=1.0&ZOHO_CRITERIA=${encodeURIComponent(`\"templateId\"=\'${templateId}\'`)}&templateName=${encodeURIComponent(templateName)}&templateBody=${encodeURIComponent(templateBody)}`;
    let btnContents=btnElem.innerHTML;
    btnElem.innerHTML=`<div class="circular-loader-small rotate"></div>`;
    btnElem.classList.add("disable-btn");
    makeApiCall(connectionName,apiUrl,undefined,method='POST',(resp)=>{
        console.log("Created Template in Analytics",resp);
        showInfoMsg("Template saved successfully",true);
        let smoothClose=setTimeout(()=>{
        closeCreatePopUp();
        fetchTemplates();
        clearTimeout(smoothClose);
        btnElem.innerHTML=btnContents;
        btnElem.classList.remove("disable-btn");
        },1000);
    },(e)=>{
        console.log("Error in Creating template in analytics",e);
        showInfoMsg("Could not update template. Please try again or contact your administrator",false);   
        btnElem.innerHTML=btnContents;
        btnElem.classList.remove("disable-btn");
    });
}
function createTemplate(templateName,templateBody,btnElem)
{
    let today=new Date();
    let todayStr=today.toString();
    let apiUrl=analyticsTableUrl+`?ZOHO_ACTION=ADDROW&ZOHO_OUTPUT_FORMAT=JSON&ZOHO_ERROR_FORMAT=JSON&ZOHO_API_VERSION=1.0&templateName=${encodeURIComponent(templateName)}&templateBody=${encodeURIComponent(templateBody)}&createdBy=${loggedInUserId}`;
    let btnContents=btnElem.innerHTML;
    btnElem.innerHTML=`<div class="circular-loader-small rotate"></div>`;
    btnElem.classList.add("disable-btn");
    makeApiCall(connectionName,apiUrl,undefined,method='POST',(resp)=>{
        console.log("Created Template in Analytics",resp);
        showInfoMsg("Template saved successfully",true);
        let smoothClose=setTimeout(()=>{
        closeCreatePopUp();
        fetchTemplates();
        clearTimeout(smoothClose);
        btnElem.innerHTML=btnContents;
        btnElem.classList.remove("disable-btn");
        },1000);
    },(e)=>{
        console.log("Error in Creating template in analytics",e);
        showInfoMsg("Could not save template. Please try again or contact your administrator",false);
        btnElem.innerHTML=btnContents;
        btnElem.classList.remove("disable-btn");
    });
}
function upsertTemplate(btnElem)
{
    //input validation
    let formTemplateNameVal=document.getElementById("formTemplateName").value;
    let formTemplateBodyVal=document.getElementById("formTemplateBody").value;
    let btnContent=btnElem.innerHTML;
    if(!formTemplateNameVal)
    {
        showInfoMsg("Please give a name to the template",false);
        return;
    }
    if(!formTemplateBodyVal)
    {
        showInfoMsg("Template body cannot be empty",false);
        return;
    }
    //update or insert record?
    if(isEditTemplate)
    {
        //editing existing template
        console.log("editing template",currentTemplate);
        updateTemplate(formTemplateNameVal,formTemplateBodyVal,btnElem,currentTemplate);
    }
    else
    {
        //creating new template
        console.log("creating new template");
        createTemplate(formTemplateNameVal,formTemplateBodyVal,btnElem);
    }
}
function editTemplate(templateName,templateBody)
{
    console.log("editing template");
    let templateNameElem=document.getElementById("formTemplateName");
    let templateBodyElem=document.getElementById("formTemplateBody");
    templateNameElem.value=templateName;
    // templateNameElem.focus();
    templateBodyElem.value=templateBody;
    showCreatePopUp(true);
}
function populateTemplates(templates,search)
{
    let templatesCount;
    if(!templates)
    {
        templates=[];
    }
    templatesCount=templates.length;
    let templateNameClone=document.getElementById("templateNameClone");
    let templateNameParent=document.getElementById("templatesParent");
    let deleteBtnClone=document.getElementById("deleteBtnClone");
    templateNameParent.innerHTML="";
    if(templatesCount==0)
    {
        templateNameParent.innerHTML="No templates found";
        let templateNameElem=document.getElementById("templateNameElem");
        let templateBodyElem=document.getElementById("templateBodyElem");
        templateNameElem.innerHTML='';
        templateBodyElem.innerHTML='';
        document.getElementById("sendSmsElem").classList.add("disable-btn");
    }
    for(i=0;i<templatesCount;i++)
    {
        let templateElem=templateNameClone.cloneNode(true);
        let delBtn=deleteBtnClone.cloneNode(true);
        let templateBody=templates[i]["Template_Information"];
        let templateId=templates[i]["Template_ID"];
        let templateName=templates[i]["Template_Name"];
        let templateParameters=templates[i]["Whatsapp_Parameters"];
        templateElem.id=`templateName${i}`;
        templateElem.innerHTML=templates[i]["Template_Name"];
        templateElem.addEventListener("click",()=>{viewTemplate(templateBody,templateName,templateId,templateElem,templateParameters);});
        delBtn.addEventListener("click",()=>{
            //deleteTemplate(templateId);
            showPopUp("notifPopupBackdrop","Are you sure you want to delete the template: "+templateName+"?",true,"Delete",(evt)=>{deleteTemplate(templateId,evt);});
        });
        delBtn.id="templateDelete"+i;
        delBtn.classList.remove("hide");
        if(adminProfiles.includes(profileId))
        {
            templateElem.appendChild(delBtn);
        }
        templateNameParent.appendChild(templateElem);
        templateElem.classList.remove("hide");
        if(i==0 && !search)
        {
            viewTemplate(templateBody,templateName,templateId,templateElem,templateParameters);
            /*
            if(!ticketData)
            {
                fetchTicket(()=>{viewTemplate(templateBody,templateName,templateId,templateElem);},()=>{viewTemplate();});
            }
            else
            {
                viewTemplate(templateBody,templateName,templateId,templateElem);
            }
            */
        }
    }
}
function fetchTicket(successCallback,fallBack)
{
    ZOHODESK.get("ticket").then((resp)=>{
        ticketData=resp["ticket"];
        layoutFields.push({fieldLabel:"Contact Name",apiName:"contactName"});
        layoutFields.push({fieldLabel:"Ticket Owner",apiName:"owner"});
        // console.log("Ticket data is",ticketData);
        mobileToBeSent=ticketData["cf"]["cf_mobile"];
        successCallback();
    }).catch((err)=>{fallBack(err);});
}
function fetchContact(contactId)
{
    let apiUrl=deskDomain+"/api/v1/contacts/"+contactId;
    makeApiCall(connectionLinkName,apiUrl,"","GET",(resp)=>{
        console.log("contacts data fetched",resp);
    },(err)=>{
        console.log("error fetching contacts",err);
    });
}
/**
 * Converts Parses whatsapp template using whatsapp template variable
 * @inputs  templateBody - The actual template body containing whatsapp params & template parameters. 
 *          toBeSent - flag - if true function returns a simple text template to be sent to API, if false - returns a HTML string to be shown on screen
 *          whatsappParams - JSON containing the whatsapp parameters defined by the admin in CRM template tracker module
 *          parseDict - JSON containing key - variable names, value - value to parsed for the key in template
* @returns {parsed template - either simple string or a HTML string based on 'toBeSent' param} 
 * @example
 * // Input - templateBody - Hi ${0}, ${contact_name}, toBeSent - true, whatsappParams - {0:"Customer"}, prseDict - {contact_name:"Tello"}
 * // Output - "Hi Customer, Tello"
 */
function parseWhatsappTemplate(templateBody,toBeSent, whatsappParams, parseDict)
{
    if(whatsappParams)
    {
        for(let key of Object.keys(whatsappParams))
        {
            let keyVal=whatsappParams[key];
            if(keyVal[0]=="$"&&keyVal[1]=="{"&&keyVal[keyVal.length-1]=="}")
            {
                //It means the user has used template param as one of the whatsapp parameters
                //parse the value from dict & store in whatsappParams
                let parseKey=keyVal.slice(2,keyVal.length-1); 
                let parsedVal=parseDict[parseKey];
                if(parsedVal)
                {
                    whatsappParams[key]=parsedVal;
                }
            }
        }
        if(Object.keys(whatsappParams).length>0)
        {
            for(let k of Object.keys(whatsappParams))
            {
                parseDict[k]=whatsappParams[k];
            }
        }
    }

        //add the whatsapp parameters to the parseDict JSON and parse the template using parseDict variable
    if(!templateBody)
    {
        return null;
    }
    else
    {
        let prevChar=templateBody[0];
        let bodyLen=templateBody.length;
        let apiName="";
        let parsedApiNames=[];
        for(let i=1;i<bodyLen;i++)
        {
            let currentChar=templateBody[i];
            if(prevChar=="$"&&currentChar=="{")
            {
                for(let j=i+1;j<bodyLen;j++)
                {
                    let currentChar2=templateBody[j];
                    if(currentChar2=="}")
                    {
                        parsedApiNames.push(apiName);
                        i=j+1;
                        apiName="";
                        break;
                    }
                    else
                    {
                        apiName+=currentChar2;
                    }
                }
            }
            if(i<bodyLen)
            {
                prevChar=currentChar;
            }
        }
        if(parsedApiNames.length<=0)
        {
            return templateBody;
        }
        else
        {
            for(let apiName of parsedApiNames)
            {
                let parsedValue;
                parsedValue=parseDict[apiName];
                /*
                if(firstPiece=="cf")
                {
                    ticketVal=ticketData["cf"][apiName];
                }
                else
                {
                    ticketVal=ticketData[apiName];
                }
                */
                let replaceVal=parsedValue?`<span style="color:var(--blue-cta)">${parsedValue}</span>`:`<span style="color:var(--blue-cta)">-</span>`;
                if(toBeSent)
                {
                    replaceVal=parsedValue||"-";
                }
                templateBody=templateBody.replaceAll("${"+apiName+"}",replaceVal);
            }
            return templateBody;
        }
    }
    
}
    function parseTemplate(templateBody,toBeSent)
    {
        if(!templateBody)
        {
        return null;
        }
        let prevChar=templateBody[0];
        let bodyLen=templateBody.length;
        let apiName="";
        let parsedApiNames=[];
        for(let i=1;i<bodyLen;i++)
        {
            let currentChar=templateBody[i];
            if(prevChar=="$"&&currentChar=="{")
            {
                for(let j=i+1;j<bodyLen;j++)
                {
                    let currentChar2=templateBody[j];
                    if(currentChar2=="}")
                    {
                        parsedApiNames.push(apiName);
                        i=j+1;
                        apiName="";
                        break;
                    }
                    else
                    {
                        apiName+=currentChar2;
                    }
                }
            }
            if(i<bodyLen)
            {
                prevChar=currentChar;
            }
        }
        if(parsedApiNames.length<=0)
        {
            return templateBody;
        }
        else
        {
            for(let apiName of parsedApiNames)
            {
                let firstPiece=apiName.split("_")[0];
                let ticketVal;
                
                if(Object.keys(ticketData).includes(apiName))
                {
                    ticketVal=ticketData[apiName];
                }
                else
                {
                    ticketVal="-";
                }
                /*
                if(firstPiece=="cf")
                {
                    ticketVal=ticketData["cf"][apiName];
                }
                else
                {
                    ticketVal=ticketData[apiName];
                }
                */
                let replaceVal=ticketVal?`<span style="color:var(--blue-cta)">${ticketVal}</span>`:`<span style="color:var(--blue-cta)">-</span>`;
                if(toBeSent)
                {
                    replaceVal=ticketVal||"-";
                }
                templateBody=templateBody.replaceAll("${"+apiName+"}",replaceVal);
            }
            return templateBody;
        }
}
function viewTemplate(templateBody,templateName,templateId,clickedElem,templateParameters)
{
    let templateNameElem=document.getElementById("templateNameElem");
    let templateBodyElem=document.getElementById("templateBodyElem");
    let templateNameElems=document.getElementsByClassName("template-name-container");
    let templateEditBtn=document.getElementById("templateEditBtn");
    let attachEditTemplate;
    let parsedTemplateBody;
    document.getElementById("sendSmsElem").classList.remove("disable-btn");
    if(!templateBody)
    {
        //show error on screen
        templateBodyElem.innerHTML=`Something went wrong, <span style="color:var(--blue-cta);cursor:pointer;border-bottom:2px solid var(--blue-cta)" onclick="fetchTemplates()">click</span> here to retry.`;
        return;
    }
    attachEditTemplate=()=>{
        console.log("Edit clicked");
        editTemplate(templateName,templateBody);
    };
    currentTemplate=templateId;
    templateNameElem.innerHTML=templateName;
    if(mediumWhatsapp)
    {
        templateParamToBeSent=parseTemplate(templateParameters,true);
        let templateParamsJson;
        if(templateParameters)
        {
            try{
                templateParamsJson=JSON.parse(templateParameters);
            }
            catch(e)
            {
                templateBodyElem.innerHTML=`<span style="color:var(--red-failure)">Whatsapp Template Parameters resolution failed for this template</span>. Please contact your administrator.`;
                document.getElementById("sendSmsElem").classList.add("disable-btn");
                return;
            }
            
        }
        else
        {
            templateParamsJson={};
        }
        templateToBeSent=parseWhatsappTemplate(templateBody,true,templateParamsJson,ticketData);
        parsedTemplateBody=parseWhatsappTemplate(templateBody,false,templateParamsJson,ticketData);
    }
    else
    {
        templateToBeSent=parseTemplate(templateBody,true);
        parsedTemplateBody=parseTemplate(templateBody);
    }
    
    templateIdToBeSent=templateId;
    templateNameToBeSent=templateName;
    templateBodyElem.innerHTML=parsedTemplateBody;
    for(let t of templateNameElems)
    {
        t.classList.remove("template-name-selected");
    }
    clickedElem.classList.add("template-name-selected");
    templateEditBtn.removeEventListener("click",attachEditTemplate);
    templateEditBtn.addEventListener("click",attachEditTemplate);
}

function showCreatePopUp(edit)
{
    let swipeUpScreen=document.getElementById("swipeUpScreen");
    let templateEditHeader=document.getElementById("templateEditHeader");
    let formTemplateNameElem=document.getElementById("formTemplateName");
    swipeUpScreen.classList.remove("slide-up");
    swipeUpScreen.classList.remove("hide");
    swipeUpScreen.classList.add("slide-up");
    if(edit)
    {
        isEditTemplate=true;
        templateEditHeader.innerHTML="Edit Template: ";
    }
    else
    {
        isEditTemplate=false;
        templateEditHeader.innerHTML="Create Template: "
    }
    formTemplateNameElem.focus();
    prevTypedChar=null;
}
function clearForm()
{
    document.getElementById("formTemplateName").value="";
    document.getElementById("formTemplateBody").value="";
}
function closeCreatePopUp()
{
    let swipeUpScreen=document.getElementById("swipeUpScreen");
    swipeUpScreen.classList.remove("slide-up");
    swipeUpScreen.classList.add("hide");
    clearInfoMsg();
    clearForm();
}

function closePopUp(popUpId)
{
    let popUpBackdrop=document.getElementById(popUpId);
    popUpBackdrop.classList.add("hide");
}
//Prod
function invokeSmsApi(msgBody,phoneNumber,btnContent,btnElem)
{
    //prod API
    let functionUrl="https://ucrmapi.unionbankofindia.co.in/crm/v2/functions/sendSmsDeskExtension/actions/execute?auth_type=oauth";
    //UAT API
    // let functionUrl="https://ucrmapi.unionbankofindia.co.in/crm/v2/functions/sendSmsDeskExtension/actions/execute?auth_type=apikey&zapikey=1003.446aab4478d33b36c8adb42a13894738.9e8fe0b1aa213ecb37f4e472ca4392ba";
    if(!phoneNumber)
    {
        btnElem.innerHTML=btnContent;
        showInfoMsg("Customer Phone number couldn't be found",false,"smsInfoDiv");
        btnElem.classList.remove("disable-btn");
        return;
    }
    makeApiCall(connectionName,functionUrl,{msgBody:msgBody,mobileNumber:phoneNumber},"GET",
    (success)=>{
        let sentStatus="Success";
        if(success.code=="SUCCESS" && success.details.status=="true")
        {
            let respData=success.details.statusMessage;
            let functionOutput=JSON.parse(respData.details.output);
            if(functionOutput.Status=="Success")
            {
                // showInfoMsg("SMS sent successfully",true,"smsInfoDiv");
                show_msg_box("SMS sent successfully", "green",5);
            }
            else
            {
                sentStatus="Failure";
                // showInfoMsg("Couldn't send SMS",false,"smsInfoDiv");
                show_msg_box("Couldn't send SMS message","red",5);
                console.log("error in SMS function",functionOutput);
            }
        }
        else
        {
            sentStatus="Failure";
            // showInfoMsg("Couldn't send SMS",false,"smsInfoDiv");
            show_msg_box("Couldn't send SMS message","red",5);
            console.log("error in SMS function",success);
        }
        
        btnElem.innerHTML=btnContent;
        btnElem.classList.remove("disable-btn");
        writeCommunicationLog(mobileToBeSent,sentStatus,success,templateToBeSent,templateIdToBeSent,"SMS",templateNameToBeSent);
    },
    (error)=>{
        console.log("error in SMS function",error);
        btnElem.innerHTML=btnContent;
        // showInfoMsg("Couldn't send SMS",false,"smsInfoDiv");
        show_msg_box("Couldn't send SMS message","red",5);
        btnElem.classList.remove("disable-btn");
        writeCommunicationLog(mobileToBeSent,sentStatus,error,templateToBeSent,templateIdToBeSent,"SMS",templateNameToBeSent);
    })
}
//UAT
async function invokeSmsApi2(msgBody,phoneNumber,btnContent,btnElem)
{
    let smsUrl="http://smsdc.unionbankofindia.co.in:8282/ConnectOneUrl/sendencsms/sendencsms";
    let postBody={
        "dest":"91"+String(phoneNumber),
        "msg":"UNIONB",
        "intl":"1",
        "encrypt":"0"
    };
    //
    if(!phoneNumber)
    {
        btnElem.innerHTML=btnContent;
        showInfoMsg("Ticket doesn't have mobile number",false,"smsInfoDiv");
        btnElem.classList.remove("disable-btn");
        return;
    }
    const response=await fetch(smsUrl,{method:"POST",mode:"cors",headers:{auth_key:"DyWe5U2ywaDqnynXZrCz88gZbksKAUp3mZD8FlV/md0io3nPCRZ91igezhV2LGur"},referrerPolicy: "no-referrer",body:JSON.stringify(postBody)});
    console.log("sms API response is",response);

}
//Prod - whatsapp API
//Sample Whatsapp API response - {"statusCode":"200","statusDesc":"Successfully Accepted","mid":"410118440415065718580308"}

function invokeWhatsappApi(templateId,phoneNumber,btnContent,btnElem,templateParameters)
{
    //prod API
    let functionUrl="https://ucrmapi.unionbankofindia.co.in/crm/v2/functions/whatsapp_api_for_c360/actions/execute?auth_type=oauth";
    //UAT API
    // let functionUrl="https://ucrmapi.unionbankofindia.co.in/crm/v2/functions/sendSmsDeskExtension/actions/execute?auth_type=apikey&zapikey=1003.446aab4478d33b36c8adb42a13894738.9e8fe0b1aa213ecb37f4e472ca4392ba";
    if(!phoneNumber)
    {
        btnElem.innerHTML=btnContent;
        showInfoMsg("Customer Phone number couldn't be found",false,"smsInfoDiv");
        btnElem.classList.remove("disable-btn");
        return;
    }
    makeApiCall(connectionName,functionUrl,{template_id:templateId,to_num:phoneNumber,template_parameters:templateParameters},"GET",
    (success)=>{
        let sentStatus="Success";
        if(success.code=="SUCCESS" && success.details.status=="true")
        {
            let respData=success.details.statusMessage;
            let functionOutput=JSON.parse(respData.details.output);
            if(functionOutput.statusCode=="200")
            {
                // showInfoMsg("Whatsapp message sent successfully",true,"smsInfoDiv");
                show_msg_box("Whatsapp message sent successfully", "green",5);
            }
            else
            {
                let errorDesc=functionOutput.statusDesc||"";
                // showInfoMsg("Couldn't send Whatsapp message: "+errorDesc,false,"smsInfoDiv");
                show_msg_box("Couldn't send Whatsapp message","red",5);
                console.log("error in Whatsapp API",functionOutput);
                sentStatus="Failure";
            }
        }
        else
        {
            // showInfoMsg("Couldn't send Whatsapp message",false,"smsInfoDiv");
            show_msg_box("Couldn't send Whatsapp message","red",5);
            console.log("error in Whatsapp API",success);
            sentStatus="Failure";
        }
        
        btnElem.innerHTML=btnContent;
        btnElem.classList.remove("disable-btn");
        writeCommunicationLog(mobileToBeSent,sentStatus,success,templateToBeSent,templateIdToBeSent,"Whatsapp",templateNameToBeSent);
    },
    (error)=>{
        console.log("error in Whatsapp API",error);
        btnElem.innerHTML=btnContent;
        // showInfoMsg("Couldn't send Whatsapp message",false,"smsInfoDiv");
        show_msg_box("Couldn't send Whatsapp message","red",5);
        btnElem.classList.remove("disable-btn");
        sentStatus="Failure";
        writeCommunicationLog(mobileToBeSent,sentStatus,error,templateToBeSent,templateIdToBeSent,"Whatsapp",templateNameToBeSent);
    })
}
function confirmSendSms(btnElem)
{
    showActionPopUp("notifPopupBackdrop","Are you sure you want to send the message?",true,"Send",(evt)=>{sendSms(btnElem);});
}
function sendSms(btnElem)
{
    //template format: 
    //Dear Customer, Your grievance for sub area with ticket ID 1234 has been lodged successfully and will be attended shortly - Union Bank of India
    let btnContent=btnElem.innerHTML;
    btnElem.innerHTML=`<div class="circular-loader-small rotate"></div>`;
        btnElem.classList.add("disable-btn");
        if(mediumWhatsapp)
        {
            invokeWhatsappApi(templateIdToBeSent,mobileToBeSent,btnContent,btnElem,templateParamToBeSent);
        }
        else
        {
            invokeSmsApi(templateToBeSent,mobileToBeSent,btnContent,btnElem);
        }
        /*
        let smsApiTimer=setTimeout(()=>{
            btnElem.innerHTML=btnContent;
            showInfoMsg("SMS sent successfully",true,"smsInfoDiv");
            btnElem.classList.remove("disable-btn");
            clearTimeout(smsApiTimer);
        },2000);
        */
}
function showInsertFieldPop()
{
    let insertFieldPop=document.getElementById("ticketFieldsPop");
    let fieldSearchBox=document.getElementById('fieldSearchBox');
    insertFieldPop.classList.remove("hide");
    fieldSearchBox.focus();
    if(layoutFields.length>3)
    {
        populateTicketFields();
    }
    else
    {
        fetchFields();
    }
}
function populateLoadingBars(rows,parent)
{
    let fieldsContainer=document.getElementById("fieldsParent");
    if(parent)
    {
        fieldsContainer=document.getElementById(parent);
    }
    fieldsContainer.innerHTML="";
    for(let i=0;i<rows;i++)
    {
        fieldsContainer.innerHTML+=`<div class="loading-container" style="margin-bottom:5%"><div class="loading-bar"></div></div>`;
    }
}
function fetchFields()
{
    populateLoadingBars(20);

    let fieldsGetUrl=deskDomain+"/api/v1/layouts/"+layoutId;
        makeApiCall(connectionName,fieldsGetUrl,{},'GET',(d)=>{
            let layoutFieldsResp=JSON.parse(d);
            console.log("LayoutFieldsResp is",layoutFieldsResp);
            let layoutFieldsParsed=JSON.parse(layoutFieldsResp.response);
            let layoutSections=layoutFieldsParsed.statusMessage.sections;
            let optionsSt='<option value="null">Field</option>';
            for(let section of layoutSections)
            {
                console.log("Looping sections",section);
                let sectionFields=section.fields;
                for(let i=0;i<sectionFields.length;i++)
                {
                    let fieldLabel=sectionFields[i].displayLabel;
                    let fieldAPI=sectionFields[i].apiName;
                    let fieldDetails={"fieldLabel":fieldLabel,"apiName":fieldAPI};
                    if(fieldLabel!="Contact Name")
                    layoutFields.push(fieldDetails);
                }
            }
            
            populateTicketFields();
            console.log("Layout Sections are",layoutSections);
            
        },(error)=>{
            populateTicketFields(true,true);
            console.log("Error in fetching fields",error);
        });
}
function populateTicketFields(query,err)
{
    let fieldsContainer=document.getElementById("fieldsParent");
    let fieldClone=document.getElementById("fieldsItemClone");
    let atleastOnePopulation=false;
    fieldsContainer.innerHTML="";
    if(err)
    {
        fieldsContainer.innerHTML=`Couldn't fetch ticket fields. Please <span style="color:var(--blue-cta);cursor:pointer;border:2px solid var(--blue-cta)" onclick="fetchFields()">try</span> again or contact your administrator`;
        return;
    }
    if(query)
    {
        for(let i=0;i<layoutFields.length;i++)
        {
            let fieldName=layoutFields[i]["fieldLabel"].toLowerCase();
            if(fieldName.includes(query))
            {
                let fieldToInsert=fieldClone.cloneNode(true);
                let apiName=layoutFields[i]["apiName"];
                fieldToInsert.id+=`${i}`;
                fieldToInsert.innerHTML=layoutFields[i]["fieldLabel"];
                fieldToInsert.addEventListener("click",(evt)=>{fieldClickedForInsert(apiName,evt);});
                fieldsContainer.appendChild(fieldToInsert);
                fieldToInsert.classList.remove("hide");
                atleastOnePopulation=true;
            }
        }
        if(!atleastOnePopulation)
        {
            fieldsContainer.innerHTML="No fields found";
        }
    }
    else
    {
        for(let i=0;i<layoutFields.length;i++)
        {
            let fieldToInsert=fieldClone.cloneNode(true);
            let apiName=layoutFields[i]["apiName"];
            fieldToInsert.id+=`${i}`;
            fieldToInsert.innerHTML=layoutFields[i]["fieldLabel"];
            fieldToInsert.addEventListener("click",(evt)=>{fieldClickedForInsert(apiName,evt);});
            fieldsContainer.appendChild(fieldToInsert);
            fieldToInsert.classList.remove("hide");
        }
    }
}
function fieldClickedForInsert(apiName,evt)
{
    let targetElem=evt.target;
    let fieldElems=document.getElementById("fieldsParent").children;
    for(let f of fieldElems)
    {
        f.classList.remove("template-name-selected");
    }
    targetElem.classList.add("template-name-selected");
    fieldToInsert=apiName;
}
function insertFieldInTemplate()
{
    let formTemplateBody=document.getElementById("formTemplateBody");
    let formTemplateBodyVal=formTemplateBody.value;
    console.log("form template is",formTemplateBodyVal);
    if(fieldToInsert)
    {
        formTemplateBodyVal=formTemplateBodyVal.replaceAll("#{","${"+fieldToInsert+"}");
        formTemplateBody.value=formTemplateBodyVal;
        closeFieldsPopUp();
        formTemplateBody.focus();
    }
}
function searchTicketFields()
{
    let searchQuery=document.getElementById("fieldSearchBox").value.trim().toLowerCase();
    populateLoadingBars(20);
    setTimeout(()=>{populateTicketFields(searchQuery)},1000);
}

function makeApiCall(connectionName='',url,parameters,method='GET',successCallback,errorCallback)
{
      var req_data = {
        method: method, //No I18N
        url: url, //No I18N
      };
      /*
       parameters: {
          "lastName": last_name_for_desk,
          "firstName": first_name_for_desk,
          "email": mail_for_desk,
          "mobile": mobile,
          "phone": phone_for_desk,
          "country":desk_contat_data.Home_Country,
          "city":desk_contat_data.Home_City,
          "state":desk_contat_data.Home_State,
          "cf":{
            "cf_customer_record_id": rid[0],
            "cf_middle_name": middle_name_for_desk,
            "cf_customer_id": cid,
            "cf_is_existing_customer":"Yes",
            "cf_last_name_finacle":desk_contat_data.Last_Name_Finacle,
            "cf_pincode":desk_contat_data.Home_ZIP,
            "cf_customer_title":desk_contat_data.Customer_Title,
            "cf_address_line1":desk_contat_data.HOME_ADDRESS_LINE1,
            "cf_address_line2":desk_contat_data.HOME_ADDRESS_LINE2,
            "cf_resident_status":desk_contat_data.Resident_Status,
            "cf_branch_sol_id":desk_contat_data.Branch_SOL_ID,
            "cf_base_branch_name":desk_contat_data.Branch_Name
          }
        },
        headers: {
          "x-zoho-fromservice":"ZohoSupport"
          }, //No I18N
      */
      if(parameters)
      {
        req_data["parameters"]=parameters;
      }
      ZOHO.CRM.CONNECTION.invoke(connectionName, req_data).then(
        (resp)=>{
            successCallback(resp);
        }
    ).catch(
        (err)=>{
            errorCallback(err);
        }
    );   
}
/*
function makeApiCall(connectionName='',url,parameters,method='GET',successCallback,errorCallback)
{
    let reqData={
        url: url,
        type: method,
        connectionLinkName: connectionName,
        data:{},
        postBody:'',
        headers:{}
        };
    /*
    if(parameters)
    {
        reqData["data"]=parameters;
    }
    */
   /*
    if(parameters&&(method!="PATCH"&&method!="POST"))
    {
        reqData["data"]=parameters;
    }
    if(parameters&&(method=="PATCH"||method=="POST"))
    {
        reqData["postBody"]=parameters;
    }
    ZOHODESK.request(reqData).then(
        (resp)=>{
            successCallback(resp);
        }
    ).catch(
        (err)=>{
            errorCallback(err);
        }
    );   
}
*/
function fetchTemplates(searchQuery)
{
    if((!ticketData)&&(stadat)&&(stadat[0]))
    {
        ticketData=stadat[0];
    }
    let param={
        "select_query":"select Template_For, Template_for_SMS, Template_for_Whatsapp, Template_ID, Template_Information, Template_Name from Template_Trackers where (Template_for_SMS='true') limit 50"
    };
    if(mediumWhatsapp)
    {
        param["select_query"]="select Template_For, Template_for_SMS, Template_for_Whatsapp, Template_ID, Template_Information, Template_Name, Whatsapp_Parameters from Template_Trackers where (Template_for_Whatsapp='true') limit 50";
    }
    let apisUrl=crmModuleUrl;
    populateLoadingBars(10,"templatesParent");
    if(!searchQuery)
    {
        populateLoadingBars(1,"templateNameElem");
        populateLoadingBars(1,"templateBodyElem");
    }
    if(searchQuery)
    {
        param["select_query"]="select Template_For, Template_for_SMS, Template_for_Whatsapp, Template_ID, Template_Information, Template_Name from Template_Trackers where (Template_Name like '%"+searchQuery+"%' and Template_for_SMS='true') limit 50";
        if(mediumWhatsapp)
        {
            param["select_query"]="select Template_For, Template_for_SMS, Template_for_Whatsapp, Template_ID, Template_Information, Template_Name, Whatsapp_Parameters from Template_Trackers where (Template_Name like '%"+searchQuery+"%' and Template_for_Whatsapp='true') limit 50";
        }
        // query=encodeURIComponent(`select * from "SmsTemplatesTable" where "templateName" LIKE '%${searchQuery}%' ORDER BY "createdTime" DESC LIMIT 20`);
        // apisUrl=crmModuleUrl;
    }
    makeApiCall(connectionName,apisUrl,param,"POST",(successResponse)=>{
        console.log("API from tracker Module",successResponse);
        // let d=JSON.parse(successResponse);
        // let respData=JSON.parse(d.response);
        let respRows=successResponse.details.statusMessage.data; //array of rows returned
        if(searchQuery)
        {
            populateTemplates(respRows,true);
        }
        else
        {
            populateTemplates(respRows);
            // defaultTemplatesLoaded=respRows;
            if(mediumWhatsapp)
            {
                defaultTemplatesLoadedWA=respRows;
            }
            else
            {
                defaultTemplatesLoadedSms=respRows;
            }
        }
    },(errorResponse)=>{
        viewTemplate();
        console.log("Error in fetch templates API",errorResponse);
    });
}
function switchMedium()
{
    mediumWhatsapp=document.getElementById("mediumCategorySwitch").checked;   
    if(mediumWhatsapp)
    {
        document.getElementById("smsLabel").classList.remove("selected-font");
        document.getElementById("whatsappLabel").classList.add("selected-font");
    }
    else
    {
        document.getElementById("smsLabel").classList.add("selected-font");
        document.getElementById("whatsappLabel").classList.remove("selected-font");
    }
    searchTemplates(true); 
}
function closeSearch()
{
    let searchContainer=document.getElementById("searchTextContainer");
    searchContainer.classList.add("hide");
    searchContainer.classList.remove("slide-right");
    document.getElementById("searchTextBox").value="";
    loadDefaultTemplates();
}
function openSearch()
{
    let searchContainer=document.getElementById("searchTextContainer");
    searchContainer.classList.remove("hide");
    searchContainer.classList.add("slide-right");
    document.getElementById("searchTextBox").focus();
}
function loadDefaultTemplates()
{
    if(mediumWhatsapp)
    {
        if(defaultTemplatesLoadedWA)
        {
            populateTemplates(defaultTemplatesLoadedWA);
        }
        else
        {
            fetchTemplates();
        }
    }
    else
    {
        if(defaultTemplatesLoadedSms)
        {
            populateTemplates(defaultTemplatesLoadedSms);
        }
        else
        {
            fetchTemplates();
        }
    }
}
function searchTemplates(withoutDelay)
{
    if(searchTimer)
    {
        clearTimeout(searchTimer);
        searchTimer=null;
    }
    populateLoadingBars(10,"templatesParent");
    if(withoutDelay)
    {
        searchTimer=setTimeout(()=>{
            let searchQuery=document.getElementById("searchTextBox").value.trim();
            if(searchQuery=="")
            {
                loadDefaultTemplates();
                clearTimeout(searchTimer);
                searchTimer=null;
                return;
            }
            fetchTemplates(searchQuery);
            clearTimeout(searchTimer);
            searchTimer=null;
        },10);
    }
    else
    {
        searchTimer=setTimeout(()=>{
            let searchQuery=document.getElementById("searchTextBox").value.trim();
            if(searchQuery=="")
            {
                loadDefaultTemplates();
                clearTimeout(searchTimer);
                searchTimer=null;
                return;
            }
            fetchTemplates(searchQuery);
            clearTimeout(searchTimer);
            searchTimer=null;
        },500);
    }
    
}
function deleteTemplate(templateId,clickEvt)
{
    let btnElem=clickEvt.target;
    let btnContent=btnElem.innerHTML;
    btnElem.innerHTML=`<div class="circular-loader-small rotate"></div>`;
    btnElem.classList.add("disable-btn");
    let apiUrl=analyticsTableUrl+`?ZOHO_ACTION=DELETE&ZOHO_OUTPUT_FORMAT=JSON&ZOHO_ERROR_FORMAT=JSON&ZOHO_API_VERSION=1.0&ZOHO_CRITERIA=(${encodeURIComponent(`\"templateId\"=\'${templateId}\'`)})`;
    makeApiCall(connectionName,apiUrl,null,"GET",(successdata)=>{
        let respData=JSON.parse(successdata);
        let resp=JSON.parse(respData.response);
        let deleteResp=resp.statusMessage.response.result.message;
        if(deleteResp=="Deleted Rows")
        {
            showInfoMsg("Template deleted successfully",true,"popNotifMsg");
        }
        else
        {
            console.log("Error in deleting template",respData);
            showInfoMsg("The template couldn't be deleted",false,"popNotifMsg");
        }
        btnElem.classList.remove("disable-btn");
        btnElem.innerHTML=btnContent;
        setTimeout(()=>{closePopUp('notifPopupBackdrop');fetchTemplates();},1000);
    },(err)=>{
        console.log("Error in deleting template",err);
        btnElem.classList.remove("disable-btn");
        btnElem.innerHTML=btnContent;
        showInfoMsg("The template couldn't be deleted",false,"popNotifMsg");
        setTimeout(()=>{closePopUp('notifPopupBackdrop');},1000);
    });
}
function showActionPopUp(popUpId,notificationMsg,alert,actionName,actionCallBack)
{
    let popUpBackdrop=document.getElementById(popUpId);
    let popUpContent=document.getElementById("popUpContent");
    let popUpFg=document.getElementById("popUpFg");
    let actionBtnClone=document.getElementById("actionBtnClone");
    let cancelBtnClone=document.getElementById("cancelBtnClone");
    let actionPanel=document.getElementById("actionPanel");
    actionBtn=actionBtnClone.cloneNode(true);
    cancelBtn=cancelBtnClone.cloneNode(true);
    actionBtn.innerHTML=actionName;
    actionBtn.id+="_";
    cancelBtn.id+="_";
    popUpContent.innerHTML=notificationMsg;
    console.log("Showing pop up");
    if(alert)
    {
        actionBtn.classList.add("alert-btn");
    }
    else
    {
        actionBtn.classList.remove("alert-btn");
    }
    actionBtn.addEventListener("click",(evt)=>{actionCallBack(evt);closePopUp('notifPopupBackdrop');});
    cancelBtn.addEventListener("click",(evt)=>{closePopUp('notifPopupBackdrop');})
    popUpFg.classList.remove("slide-up");
    popUpFg.classList.add("slide-up");
    popUpBackdrop.classList.remove("hide");
    actionPanel.innerHTML="";
    actionBtn.classList.remove("hide");
    cancelBtn.classList.remove("hide");
    actionPanel.appendChild(actionBtn);
    actionPanel.appendChild(cancelBtn);
    showInfoMsg("",false,"popNotifMsg");
}

function writeCommunicationLog(receiverNumber,sentStatus,serviceResponse,templateSent,templateIdSent,serviceName,templateName)
{
    let current_date=new Date();
    let date_str=`${current_date.getFullYear()}-${get_two_digit(current_date.getMonth()+1)}-${get_two_digit(current_date.getDate())}T${get_two_digit(current_date.getHours())}:${get_two_digit(current_date.getMinutes())}:${get_two_digit(current_date.getSeconds())}${getTimeZone()}`;
    if(!(serviceResponse instanceof String)&&(serviceResponse instanceof Object))
    {
        serviceResponse=JSON.stringify(serviceResponse);
    }
    if(sentStatus instanceof Boolean)
    {
        sentStatus=sentStatus.toString();
    }
    if(templateSent)
    {
        templateSent=templateSent.slice(0,255);
    }
    if(templateName)
    {
        templateName=templateName.slice(0,255);
    }
    serviceResponse=serviceResponse.slice(0,2000);
    if(logged_in_user_mail)
    {
        let subFormData={
            "Sent_By":logged_in_user_mail,
            "Sent_Time":date_str,
            "Sent_To":receiverNumber,
            "Service_Response":serviceResponse,
            "Status":sentStatus.toString(),
            "Template_Body":templateSent,
            "Template_ID":templateIdSent,
            "Service_Used":serviceName,
            "Template_Name":templateName
        };
        if(communicationLogs.length>=contactSubFormLimit)
        {
            communicationLogs[0]["_delete"]=null;
            communicationLogs.push(subFormData);
        }
        else
        {
            communicationLogs.push(subFormData);
        }
        updateSubForm("Contacts",rid[0],"Communication_Logs",communicationLogs).then((data)=>{
            console.log("Wrote to sub-form",data);
            subFormData["Status"]="Success";
            if(communicationLogs.length>=contactSubFormLimit)
            {
                communicationLogs=communicationLogs.slice(1,contactSubFormLimit);
                
            }
            communicationLogs.push(subFormData);
        }).catch((err)=>{
            console.alert("Error in writing to sub-form",err);
            subFormData["Status"]="Failure";
            if(communicationLogs.length>=contactSubFormLimit)
            {
                communicationLogs=communicationLogs.slice(1,contactSubFormLimit);
                
            }
            communicationLogs.push(subFormData);
        });
    }
    else
    {
        ZOHO.CRM.CONFIG.getCurrentUser().then((d)=>{
            console.log("user data is",d);
            let current_user=d.users[0];
            logged_in_user_mail=current_user.email;
            let subFormData={
                "Sent_By":logged_in_user_mail,
                "Sent_Time":date_str,
                "Sent_To":receiverNumber,
                "Service_Response":serviceResponse,
                "Status":sentStatus.toString(),
                "Template_Body":templateSent,
                "Template_ID":templateIdSent,
                "Service_Used":serviceName,
                "Template_Name":templateName
            };
            if(communicationLogs.length>=contactSubFormLimit)
            {
                // communicationLogs=communicationLogs.slice(1,contactSubFormLimit);
                communicationLogs[0]["_delete"]=null;
                communicationLogs.push(subFormData);
            }
            else
            {
                communicationLogs.push(subFormData);
            }
            updateSubForm("Contacts",rid[0],"Communication_Logs",communicationLogs).then((data)=>{
                console.log("Wrote to sub-form",data);
                subFormData["Status"]="Success";
                if(communicationLogs.length>=contactSubFormLimit)
                {
                    communicationLogs=communicationLogs.slice(1,contactSubFormLimit);
                    
                }
                communicationLogs.push(subFormData);
            }).catch((err)=>{
                console.alert("Error in writing to sub-form",err);
                subFormData["Status"]="Failure";
                if(communicationLogs.length>=contactSubFormLimit)
                {
                    communicationLogs=communicationLogs.slice(1,contactSubFormLimit);
                    
                }
                communicationLogs.push(subFormData);
            });
        });
    }
    
}

function showConversationHistory()
{
    console.log("Showing conversation history",communicationLogs);
    let genericPopUp=createGenericPopUp();
    let genericPopUpContentContainer=genericPopUp.querySelector("#modalCloneBody");
    let conversationHistoryTemplate=document.getElementById("communicationLogsClone");
    let conversationHistoryClone=conversationHistoryTemplate.cloneNode(true);
    let conversationHistoryTable=document.getElementById("communicationHistoryTableClone");
    let conversationTableClone=conversationHistoryTable.cloneNode(true);
    let scrollContainer=document.createElement("div");
    scrollContainer.classList.add("scroll-container");
    scrollContainer.style.maxHeight="350px";
    let tableRow=``;
    if((!communicationLogs)||(communicationLogs.length==0))
    {
        conversationHistoryClone.innerHTML="No conversation initiated yet";
    }
    else
    {
        for(let i=communicationLogs.length-1;i>=0;i--)
        {
            tableRow+=`<tr><td>${communicationLogs[i].Template_Name || "-"}</td><td>${communicationLogs[i].Sent_To || "-"}</td><td>${communicationLogs[i].Sent_By || "-"}</td><td>${convertUTCStrToLocalDateTime(communicationLogs[i].Sent_Time) || "-"}</td><td>${communicationLogs[i].Service_Used || "-"}</td><td>${communicationLogs[i].Status || "-"}</td></tr>`;
        }
        if(tableRow.length==0)
        {
            conversationHistoryClone.innerHTML="No conversation initiated yet";
        }
        else
        {
            conversationTableClone.innerHTML+=tableRow;
            conversationTableClone.classList.remove("hide");
            scrollContainer.appendChild(conversationTableClone);
            conversationHistoryClone.appendChild(scrollContainer);
        }
    }
    conversationHistoryClone.classList.remove("hide");
    genericPopUpContentContainer.innerHTML=``;
    genericPopUpContentContainer.appendChild(conversationHistoryClone);
    conversationHistoryClone.id+="_"+cloneCount;
    cloneCount++;
}

loadTab();