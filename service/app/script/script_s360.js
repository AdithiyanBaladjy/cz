var nam;
var dob;
var add;
var pan;
var eid;
var rmn;
var pin;
var chc;
var chc1;
var chck;
var chk_boxes={
    tdactnam:"ctatnamcb",
    tdactdob:"ctatdobcb",
    tdactadd:"ctataddcb",
    tdactpan:"ctatpancb",
    tdacteid:"ctateidcb",
    tdactrmn:"ctatrmncb",
    tdactph:"ctatphcb",
    // tdactpcd:"ctatpcdcb",
    tdactbbch:"ctatbbchcb",
    tdactms:"ctatmscb"
};
//var idstr = window.sessionStorage;
//console.log("cust_auth loaded");	//No I18N
nam = document.getElementById('ctatnamcb').value || "";	//No I18N
dob = document.getElementById('ctatdobcb').value || "";	//No I18N
add = document.getElementById('ctataddcb').value || "";	//No I18N
pan = document.getElementById('ctatpancb').value || "";	//No I18N
eid = document.getElementById('ctateidcb').value || "";	//No I18N
rmn = document.getElementById('ctatrmncb').value || "";	//No I18N
// pin = document.getElementById('ctatpcdcb').value || "";	//No I18N
//console.log("cust_auth loaded");	//No I18N
//var rid=idstr.getItem("cust_id");	//No I18N
var search_name=""; 	//No I18N
check_deposits_flag();  //start the deposit polling
req_data = {
    "method" : "GET",
    "url" : "https://ucrmapi.unionbankofindia.co.in/crm/v2/Contacts/"+rid,
  }
  ZOHO.CRM.CONNECTION.invoke("zohocrm",req_data)
// ZOHO.CRM.API.getRecord({
//             Entity:"Contacts",	//No I18N
//             RecordID:rid
//         })
        .then((data) => {
            console.log("inside cust auth, data is",data);	//No I18N
            data = data.details.statusMessage;
            document.getElementById('tdactnam').innerHTML = data.data[0].Full_Name||"-";	//No I18N
            let branch=data.data[0].Branch_Name;
            let branch_name="-";
            if(branch!=null)
            {
                branch_name=branch.name;
            }
            if(data.data[0].Full_Name==null)
            {
                console.log("id is",chk_boxes['tdactnam']);
                disable_chk_box(chk_boxes['tdactnam']);
            }
            document.getElementById('tdactdob').innerHTML = format_date(data.data[0].Date_of_Birth||"-");	//No I18N
            if(data.data[0].Full_Name==null)
            {
                disable_chk_box(chk_boxes['tdactdob']);
            }
            let full_mailing_address=get_appended_addresses(data.data[0].MAIL_ADDRESS_LINE1,data.data[0].MAIL_ADDRESS_LINE2,data.data[0].MAIL_STATE,data.data[0].MAIL_ZIP);
            document.getElementById('tdactadd').innerHTML = full_mailing_address;	//No I18N
            if(full_mailing_address==null)
            {
                disable_chk_box(chk_boxes['tdactadd']);
            }
            document.getElementById('tdactpan').innerHTML = data.data[0].PAN_GIR_ID||"-";	//No I18N
            if(data.data[0].PAN_GIR_ID==null)
            {
                disable_chk_box(chk_boxes['tdactpan']);
            }
            
            document.getElementById('tdacteid').innerHTML = data.data[0].Email||"-";	//No I18N
            if(data.data[0].Email==null)
            {
                disable_chk_box(chk_boxes['tdacteid']);
            }
            document.getElementById('tdactph').innerHTML = data.data[0].Mobile||"-";	//No I18N
            if(data.data[0].Phone==null)
            {
                disable_chk_box(chk_boxes['tdactph']);
            }
            document.getElementById('tdactrmn').innerHTML = data.data[0].Phone||"-";	//No I18N
            if(data.data[0].Phone==null)
            {
                disable_chk_box(chk_boxes['tdactrmn']);
            }
            // document.getElementById('tdactpcd').innerHTML = data.data[0].Mailing_Zip||"-";	//No I18N
            // if(data.data[0].Mailing_Zip==null)
            // {
            //     disable_chk_box(chk_boxes['tdactpcd']);
            // }
            search_name=data.data[0].Full_Name;
            if((branch==null)&&(branch_name=="-"))
            {
                disable_chk_box(chk_boxes['tdactbbch']);
            }
            document.getElementById('tdactbbch').innerHTML = branch_name;
            // disable_chk_box(chk_boxes['tdactms']);
        }).catch((err)=>{console.log("error in getting contacts data for verification pop-up",err);});
function close_d_pop()
{
    let id="pop_up_on_d";
    document.getElementById(id).remove();
}
function authenticate_ms()
{
    close_d_pop();
    console.log("inside authenticate");
    if(!document.getElementById("ctatmscb").checked)
    {
        // enable_chk_box(chk_boxes['tdactms']);
        document.getElementById("ctatmscb").click();
    }
}
function show_mini_statement_failed(err)
{
    // document.getElementById("v_pop_up_backdrop").innerHTML+=pop_up_on_d;
    let pop_st=``;
    pop_st+="Could not fetch last ten transactions."+err;;
    pop_st+=`<div style="width: 100%; margin-top: 2%; display: flex;flex-direction: row;align-items: center;justify-content: center;"><div class="submit-btn" style="padding:1% 2%;background-color:white;" onclick="close_d_pop()">Close</div></div>`;
    document.getElementById("pop_fg").innerHTML=pop_st;
}
//ZOHO.embeddedApp.init();
function remove_circular_loader()
{
    document.getElementById("circular_loader").remove();
}
function show_mini_statement(btn)
{
    //add loader to the show button
    //API call to get the ministatement
    //on success
    console.log("caller is",btn);
    let dropDown=document.getElementById("ms-verify-dropdown");
    let acc_no=dropDown.options[dropDown.selectedIndex].text;
  if(acc_no=="Loading..."||acc_no=="No account available")
  {
    return;
  }
    btn.innerHTML+=circular_loader;
    btn.classList.add('no-click');
  console.log("debug point");
    
  
  let p={accno:acc_no};
  call_crm_function('Mini_Statement_API',p).then((data) => {
    remove_circular_loader();
    btn.classList.remove('no-click');
    let pop_bg=document.createElement("div");
    pop_bg.classList.add("pop-up-backdrop");
    pop_bg.classList.add("flex-row");
    pop_bg.classList.add("push-front");
    pop_bg.id="pop_up_on_d";
    pop_bg.innerHTML=pop_up_on_d;
    document.getElementById("v_pop_up_backdrop").appendChild(pop_bg);
    
    let pop_st="";
    pop_st+=`<div style="display:flex;align-items:center;justify-content:center; margin-bottom:2%; font-weight:bold; color:#777777;">Last ten transactions for Account: ${acc_no}</div>`;
    pop_st+=`<div style="display:flex;justify-content:center;max-height:300px;overflow:auto;"><table class="crm-style-table sr-tb"><tr class="crm-style-row">
    <th class="crm-style-header">Transaction ID</th>
    <th class="crm-style-header">Date</th>
    <th class="crm-style-header">Type/Sub-Type</th>
    <th class="crm-style-header">Withdrawal Amt.</th>
    <th class="crm-style-header">Deposit Amt.</th>
    <th class="crm-style-header">Particulars</th>
    <th class="crm-style-header">Balance</th>
  </tr>`;
    console.log("data from mini statement api",data);
    data = data.details.output;
  if (data == "" || data == null) {
    show_mini_statement_failed("No data found.");
    return;
  }
  if (data.code == "114") {
    show_mini_statement_failed(data.status);
    return;
  }
  data = JSON.parse(data);
  if (data.responseCode == "114") {
    show_mini_statement_failed(data.status);
    return;
  }
  if (data.responseCode == "908") {
    show_mini_statement_failed("Technical Error.");
    return;
  }
  if (data.responseCode == "904") {
    show_mini_statement_failed("No Transaction Found");
    return;
  }
  if (data.responseCode == "119") {
    show_mini_statement_failed(`Technical Error ${data.status}`);
    return;
  }
  let lien_json = data.data;
  if(lien_json.length==0)
  {
    pop_st+=`<tr class="crm-style-row"><td class="crm-style-cell">-</td>
    <td class="crm-style-cell2">-</td>
    <td class="crm-style-cell2">-</td>
    <td class="crm-style-cell2">-</td>
    <td class="crm-style-cell2">-</td>
    <td class="crm-style-cell2">-</td>
    <td class="crm-style-cell2">-</td>
    </tr>
    `;
  }
  for (let d of lien_json) {
    let dorc = "Credit";
    if (d.drCRIndicator == "D") {
      dorc = "Debit";
    }
    pop_st+=`<tr class="crm-style-row"><td class="crm-style-cell2">${d.tranId}</td>
    <td class="crm-style-cell2">${d.tranDate}</td>
    <td class="crm-style-cell2">${d.tranType}/${d.tranSubType}</td>
    <td class="crm-style-cell">${dorc == "Debit"?d.tranAmount:""}</td>
    <td class="crm-style-cell">${dorc == "Credit"?d.tranAmount:""}</td>
    <td class="crm-style-cell2">${d.tranParticulars}</td>
    <td class="crm-style-cell2">${d.balAfterTran}</td>
    </tr>
    `;
  }//
  
  //
    pop_st+=`</table></div>`;
    pop_st+=`<div style="width: 100%; margin-top: 2%; display: flex;flex-direction: row;justify-content: center;"><div class="submit-btn" style="margin-left: 1%;padding: 1% 2% !important;border-radius: 7px;box-shadow: 0px 2px 2px #aaa;" onclick="authenticate_ms()">Verify</div><div class="clr-btn" style="margin-left: 1%;padding: 1% 2% !important;background-color: #fff;border-radius: 4px;box-shadow: 0px 2px 2px #aaa;" onclick="close_d_pop()">Close</div></div>`;
    document.getElementById("pop_fg").innerHTML=pop_st;
  })
  .catch((err) => {
    //on failure
    try{
        remove_circular_loader();
        btn.classList.remove('no-click');
    }
    catch(e)
    {
        console.log("circular loader error",e);
    }
    
    document.getElementById("pop_up_on_d").remove();
    let pop_bg=document.createElement("div");
    pop_bg.classList.add("pop-up-backdrop");
    pop_bg.classList.add("flex-row");
    pop_bg.classList.add("push-front");
    pop_bg.id="pop_up_on_d";
    pop_bg.innerHTML=pop_up_on_d;
    document.getElementById("v_pop_up_backdrop").appendChild(pop_bg);
    
    let pop_st="";
    pop_st+=`<div style="display:flex;align-items:center;justify-content:center;">Last ten transactions</div>`;
    pop_st+=`<div style="display:flex;align-items:center;justify-content:center;"><table class="crm-style-table sr-tb"><tr class="crm-style-row">
    <th class="crm-style-header">Transaction ID</th>
    <th class="crm-style-header">Date</th>
    <th class="crm-style-header">Serial No</th>
    <th class="crm-style-header">Type</th>
    <th class="crm-style-header">Sub-Type</th>
    <th class="crm-style-header">Debit/Credit</th>
    <th class="crm-style-header">Amount</th>
    <th class="crm-style-header">Particulars</th>
    <th class="crm-style-header">Balance</th>
  </tr>`;
    show_mini_statement_failed(err);
    
  });

  
    
}

function check_deposits_flag()          //function to poll deposit flag inorder to populate the mini statement dropdown.
{
    console.log("check deposits flag");
    if(deposits_flg && advances_flg)
    {
        //hide mini-statement loader
        //populate ms dropdown with
       populate_cb_dropdown(new_deposits.concat(new_advances),"ms-verify-dropdown");
       let dropDown=document.getElementById("ms-verify-dropdown");
        let acc_no=dropDown.options[dropDown.selectedIndex].text;
        if(acc_no=="No account available")
        {
            disable_chk_box(chk_boxes['tdactms']);
        }
    }
    else
    {
        deposit_timer=setTimeout(check_deposits_flag,1000);
    }
}

function send() {
    //console.log("Inside Send Function!!");	//No I18N
    chck = document.querySelectorAll('input[type="checkbox"]:checked.vfy').length;	//No I18N
    if(chck>=4){
        chc = document.querySelectorAll('input[type="checkbox"]:checked.vfy');	//No I18N
        let str = '';	//No I18N
        chc.forEach(element => {
            str += element.getAttribute('name') + ", ";	//No I18N
        });
        let id = rid[0];
        console.log("customers is",id);
        let recordData = {
            "Name": "Customer Authenticated Successfully",	//No I18N
            "Description": "Customer Authenticated Successfully!!!! Following fields authenticated successfully: " + str,	//No I18N
            "Status": "success",	//No I18N
            "Customers": id.toString()	//No I18N
        };
        ZOHO.CRM.API.insertRecord({Entity:"Customer_Auth_Logs",APIData:recordData,Trigger:["workflow"]}).then((data)=>{	//No I18N
                let st = data.data[0].code;
                if(st=='SUCCESS'){	//No I18N
                    //alert('Authentication successfull, Success Task Created!!');	//No I18N
                    $('input:checkbox').prop('checked', false);	//No I18N
                    //console.log("verification successful, dispatching event",verify_event);	//No I18N
                    //window.open("https://crmplus.zoho.in/achyutmudaliar/index.do/cxapp/support/achyutmudaliar/ShowHomePage.do#Contacts/search/CurDep/"+search_name);	//No I18N
                    document.dispatchEvent(verify_event);
                }
                else{
                    document.dispatchEvent(verification_failure_event);
                }
            }).catch((err)=>{console.log("Customer verification auth log API error",err);document.dispatchEvent(verify_event);});
    }
    else{
        //console.log("Inside Failed Task Function");	//No I18N
        chc1 = document.querySelectorAll('input[type="checkbox"]:not(:checked).vfy');	//No I18N
        let str = '';	//No I18N
        chc1.forEach(element => {
            str += element.getAttribute('name') + ", ";	//No I18N
        });
        let id = rid;////////
        let recordData = {
            "Name": "Customer Authenticated Failed",	//No I18N
            "Description": "Customer Authenticated Failed!!!! Following fields not authenticated: " + str,	//No I18N
            "Status": "failed",	//No I18N
            "Customers": id.toString()	//No I18N
        };
        ZOHO.CRM.API.insertRecord({Entity:"Customer_Auth_Logs",APIData:recordData,Trigger:["workflow"]}).then((data)=>{	//No I18N
                let st = data.data[0].code;
                if(st=='SUCCESS'){	//No I18N
                    //alert('Authentication failed, Failed Task Created!!');	//No I18N
                    $('input:checkbox').prop('checked', false);	//No I18N
                    document.dispatchEvent(verification_failure_event);
                }
                else{
                    alert('Error' + st);	//No I18N
                }
            }).catch((err)=>{console.log("Customer verification auth log API error",err);document.dispatchEvent(verification_failure_event);});
    }
}

function clearData(){
    //console.log("Inside Clear Function!!");	//No I18N
    $('input:checkbox').prop('checked', false);	//No I18N
}