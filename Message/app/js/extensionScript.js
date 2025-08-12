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
var connectionName="smstemplateextension";
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
var mobileToBeSent;
var searchTimer;
var defaultTemplatesLoaded;
var actionCallBackAdded=false;
var prevTypedChar;

window.onload=()=>{
    // populateTemplates(templates);
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
    let templatesCount=templates.length;
    let templateNameClone=document.getElementById("templateNameClone");
    let templateNameParent=document.getElementById("templatesParent");
    let deleteBtnClone=document.getElementById("deleteBtnClone");
    templateNameParent.innerHTML="";
    if(templatesCount==0)
    {
        templateNameParent.innerHTML="No templates found";
    }
    for(i=0;i<templatesCount;i++)
    {
        let templateElem=templateNameClone.cloneNode(true);
        let delBtn=deleteBtnClone.cloneNode(true);
        let templateBody=templates[i]["templateBody"];
        let templateId=templates[i]["templateId"];
        let templateName=templates[i]["templateName"];
        templateElem.id=`templateName${i}`;
        templateElem.innerHTML=templates[i]["templateName"];
        templateElem.addEventListener("click",()=>{viewTemplate(templateBody,templateName,templateId,templateElem);});
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
            if(!ticketData)
            {
                fetchTicket(()=>{viewTemplate(templateBody,templateName,templateId,templateElem);},()=>{viewTemplate();});
            }
            else
            {
                viewTemplate(templateBody,templateName,templateId,templateElem);
            }
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
function parseTemplate(templateBody,toBeSent)
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
            let firstPiece=apiName.split("_")[0];
            let ticketVal;
            if(firstPiece=="cf")
            {
                ticketVal=ticketData["cf"][apiName];
            }
            else
            {
                ticketVal=ticketData[apiName];
            }
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
function viewTemplate(templateBody,templateName,templateId,clickedElem)
{
    let templateNameElem=document.getElementById("templateNameElem");
    let templateBodyElem=document.getElementById("templateBodyElem");
    let templateNameElems=document.getElementsByClassName("template-name-container");
    let templateEditBtn=document.getElementById("templateEditBtn");
    let attachEditTemplate;
    let parsedTemplateBody;
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
    parsedTemplateBody=parseTemplate(templateBody);
    templateToBeSent=parseTemplate(templateBody,true);
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
        showInfoMsg("Ticket doesn't have mobile number",false,"smsInfoDiv");
        btnElem.classList.remove("disable-btn");
    }
    makeApiCall(connectionName,functionUrl,{msgBody:msgBody,mobileNumber:phoneNumber},"GET",
    (success)=>{
        let smsResp=JSON.parse(success);
        let resp=JSON.parse(smsResp.response);
        let respData=resp.statusMessage;
        let functionOutput=JSON.parse(respData.details.output);
        if(functionOutput.Status=="Success")
        {
            showInfoMsg("SMS sent successfully",true,"smsInfoDiv");
        }
        else
        {
            showInfoMsg("Couldn't send SMS",false,"smsInfoDiv");
            console.log("error in SMS function",functionOutput);
        }
        btnElem.innerHTML=btnContent;
        btnElem.classList.remove("disable-btn");
    },
    (error)=>{
        console.log("error in SMS function",error);
        btnElem.innerHTML=btnContent;
        showInfoMsg("Couldn't send SMS",false,"smsInfoDiv");
        btnElem.classList.remove("disable-btn");
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
function sendSms(btnElem)
{
    //template format: 
    //Dear Customer, Your grievance for sub area with ticket ID 1234 has been lodged successfully and will be attended shortly - Union Bank of India
    let btnContent=btnElem.innerHTML;
    btnElem.innerHTML=`<div class="circular-loader-small rotate"></div>`;
        btnElem.classList.add("disable-btn");
        invokeSmsApi(templateToBeSent,mobileToBeSent,btnContent,btnElem);
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
function fetchTemplates(searchQuery)
{
    let query=encodeURIComponent(`select * from "SmsTemplatesTable" ORDER BY "createdTime" DESC LIMIT 20`);
    let apisUrl=analyticsTableUrl+`?ZOHO_ACTION=EXPORT&ZOHO_OUTPUT_FORMAT=JSON&ZOHO_ERROR_FORMAT=JSON&ZOHO_API_VERSION=1.0&ZOHO_SQLQUERY=${query}&KEY_VALUE_FORMAT=true`;
    populateLoadingBars(10,"templatesParent");
    if(!searchQuery)
    {
        populateLoadingBars(1,"templateNameElem");
        populateLoadingBars(1,"templateBodyElem");
    }
    if(searchQuery)
    {
        query=encodeURIComponent(`select * from "SmsTemplatesTable" where "templateName" LIKE '%${searchQuery}%' ORDER BY "createdTime" DESC LIMIT 20`);
        apisUrl=analyticsTableUrl+`?ZOHO_ACTION=EXPORT&ZOHO_OUTPUT_FORMAT=JSON&ZOHO_ERROR_FORMAT=JSON&ZOHO_API_VERSION=1.0&ZOHO_SQLQUERY=${query}&KEY_VALUE_FORMAT=true`;
    }
    makeApiCall(connectionName,apisUrl,null,"GET",(successResponse)=>{
        console.log("API from analytics",successResponse);
        let d=JSON.parse(successResponse);
        let respData=JSON.parse(d.response);
        let respRows=respData.statusMessage.data; //array of rows returned
        if(searchQuery)
        {
            populateTemplates(respRows,true);
        }
        else
        {
            populateTemplates(respRows);
            defaultTemplatesLoaded=respRows;
        }
    },(errorResponse)=>{
        viewTemplate();
        console.log("Error in fetch templates API",errorResponse);
    });
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
    populateTemplates(defaultTemplatesLoaded);
}
function searchTemplates()
{
    if(searchTimer)
    {
        clearTimeout(searchTimer);
        searchTimer=null;
    }
    populateLoadingBars(10,"templatesParent");
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
    },2000);
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
function showPopUp(popUpId,notificationMsg,alert,actionName,actionCallBack)
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
    actionBtn.addEventListener("click",actionCallBack);
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
