
var rid;
var pn;
var st;
var dt;
var stadat;
var tt;
var tg;
var elements;
var cibScore;
var pan;
var phn;
var mail;
var mobl;
var custid;
var solid;
var prod_count=0;
var rating;
var leads_results=[];
// var idstr = window.sessionStorage;
var flag=0;
var modal = document.getElementById("myModal");
var modal1 = document.getElementById("myModal1");
var modal2 = document.getElementById("myModal2");
var span = document.getElementsByClassName("close")[0];
var span1 = document.getElementsByClassName("close")[2];
var span2 = document.getElementsByClassName("close")[1];
var csuslistElements = `<span class="homePanelTitle" id="csusPanelTitle">Cross Sell/Up Sell</span>
      <ol id="csusPanelList">`;
function search_record_crm(module,criteria)
{ 
let func_name="Search_Record";
let params={
"Module":module,
"Criteria":criteria
};
let req={
"arguments":JSON.stringify(params)
};
return ZOHO.CRM.FUNCTIONS.execute(func_name,params);
}
function populate_cheque_book()
{
let acct_drop_down=document.getElementById('membership');
console.log("account drop down is",acct_drop_down.options);
acct_drop_down.style.display="block";
let selected_acct=acct_drop_down.options[acct_drop_down.options.selectedIndex].value;
console.log("selected acct is",selected_acct);
if(selected_acct=="No accounts available")
{
console.log("returning out");
return;
}
//****//
let func_name="Chequebook_API";
let params={accn:selected_acct};
call_crm_function(func_name,params).then(function(res){
// let res = JSON.parse(data);
document.getElementById('loadingWrapper').style.display = 'none';
modal.style.display = "block";
// console.log(JSON.parse(res.details.output));
if(res.code == "success")
{
stadat="";
stadat = JSON.parse(res.details.output);
stadat = stadat.data;
console.log(stadat);
let resp = stadat.ChequebookDetails.successorfailure || "";
console.log(resp);
if(resp == "S")
{
var table = document.getElementById('modalDataTable1');
let hdr = `<tr class="modalDataCb">
<th>Total Cheque Book Issued</th>
<th>Number of available cheque leaf</th>
<th>Cheque Book Last Issued Date</th>
<th>Amount in Clearing</th>
</tr>`;
table.innerHTML += hdr;
var row = `<tr>
  <td>${stadat.ChequebookDetails.chequebooksissued1 || ""}</td>
  <td>${stadat.ChequebookDetails.availleaf1 || ""}</td>
  <td>${stadat.ChequebookDetails.lastIssueDt1 || ""}</td>
  <td>${stadat.ChequebookDetails.clearingAmt1 || ""}</td>
</tr>`
table.innerHTML += row
}
else
{
let errmsg = stadat.ChequebookDetails.Message || "";
console.error('Cheque book API Error:', errmsg);
document.getElementById('loadingWrapper').style.display = "none";
modal1.style.display = "block";
document.getElementById("mdlbdytxt1").innerHTML = "Error! <br/>" + errmsg + ". Please try again later.";
// document.getElementById("aadhaarOtpDiv").style.display = "none";
span1.onclick = () => {
modal1.style.display = "none";
}
window.onclick = (event) => {
if (event.target == modal1) {
  modal1.style.display = "none";
}
}

var recordData = {
"API_Name": "Cheque book API Error",
"Error_Id": "36001215421",
"Error_Source": "Customer 360 Widget",
"Module_Name": "Contacts",
"Module_Record_Id": rid,
"Error_Description": errmsg.toString()
}
ZOHO.CRM.API.insertRecord({Entity:"CRM_Error_Log",APIData:recordData,Trigger:["workflow"]}).then(function(data){
console.log("-");
});
}
}
else
{
let errmsg = stadat.ChequebookDetails.Message || "";
console.error('Cheque book API Error:', errmsg);
document.getElementById('loadingWrapper').style.display = "none";
modal1.style.display = "block";
document.getElementById("mdlbdytxt1").innerHTML = "Error! <br/>" + errmsg + ". Please try again later.";
// document.getElementById("aadhaarOtpDiv").style.display = "none";
span1.onclick = () => {
modal1.style.display = "none";
}
window.onclick = (event) => {
if (event.target == modal1) {
modal1.style.display = "none";
}
}

var recordData = {
"API_Name": "Cheque book API Error",
"Error_Id": "36001215421",
"Error_Source": "Customer 360 Widget",
"Module_Name": "Contacts",
"Module_Record_Id": rid,
"Error_Description": errmsg.toString()
}
ZOHO.CRM.API.insertRecord({Entity:"CRM_Error_Log",APIData:recordData,Trigger:["workflow"]}).then(function(data){
console.log("-");
});
}                        
}).catch((error) => {
console.error('Cheque book API Error:', error);
document.getElementById('loadingWrapper').style.display = "none";
modal1.style.display = "block";
document.getElementById("mdlbdytxt1").innerHTML = "Error! <br/>" + error + ". Please try again later.";
// document.getElementById("aadhaarOtpDiv").style.display = "none";
});
}

function display_panel_overlay(elem_id,msg)
{
let elem=document.getElementById(elem_id);
elem.innerHTML=msg;
elem.style.display='flex';
}

function call_crm_function(func_name,params)
{
// let func_name="Search_Record";
// let params={
//   "Module":module,
//   "Criteria":criteria
// };
let req={
"arguments":JSON.stringify(params)
};
return ZOHO.CRM.FUNCTIONS.execute(func_name,params);
}

function append_addresses(line1,line2)
{
let add="";
if(line1!=null)
{
add+=line1;
}
if(line2!=null)
{
add+=(", "+line2);
}
if(add=="")
{
add="-";
}
return add;
}
function cut_leading_zeros(digits){
console.log(typeof(digits));
for(let i=0;i<digits.length;i++)
{
if(digits[i]!='0')
{
return digits.substring(i);
}

}
}
function format_date(date_St)
{
let date_arr=date_St.split("-");
return date_arr[2]+"-"+date_arr[1]+"-"+date_arr[0];
}
//Change by Adi
Date.prototype.today = function () { 
return ((this.getDate() < 10)?"0":"") + this.getDate() +"/"+(((this.getMonth()+1) < 10)?"0":"") + (this.getMonth()+1) +"/"+ this.getFullYear();
}

//Change by Adi
Date.prototype.timeNow = function () {
return ((this.getHours() < 10)?"0":"") + this.getHours() +":"+ ((this.getMinutes() < 10)?"0":"") + this.getMinutes() +":"+ ((this.getSeconds() < 10)?"0":"") + this.getSeconds();
}
//End of Change
//----------------------------------------------------------------------------------------------------------------------------
ZOHO.embeddedApp.on("PageLoad",(data)=>{
  //change by Adi
  let time_stamps=document.getElementsByClassName('time-stamp');
  let current_date_time=new Date().today() + " " +new Date().timeNow();
  for(let ts of time_stamps)
  {
    ts.innerHTML=current_date_time;
  }
  //End of change
  rid = data.EntityId;
  console.log("Page load data is ",data);
  // idstr.setItem("id",rid);
  // console.log("ID: " + rid);
    // await ZOHO.embeddedApp.init();
    ZOHO.CRM.UI.Resize({
      "height": "1000",
      "width": "1900"
  })

ZOHO.CRM.API.getRecord({Entity:"Contacts",RecordID:rid}).then((data)=>{
  stadat = data.data;
  // console.log(data);
  document.getElementById("pgbwtit").innerHTML=stadat[0].Full_Name || "" + " - UBI Customer 360°";

  // document.getElementById("ctrlvlnum").innerHTML=stadat[0].Nett_Worth || "";
  // document.getElementById("ctcibnum").innerHTML=stadat[0].CIBIL_Score || "";

  document.getElementById("labusrimg").innerHTML=stadat[0].Full_Name || "-";
  // document.getElementById("cname").innerHTML=stadat[0].Full_Name || "-";
  document.getElementById("pemail").innerHTML = stadat[0].Email || "-";
  mail = stadat[0].Email || "";
  // document.getElementById("cmail").innerHTML = stadat[0].Email || "-";
  document.getElementById("pcon").innerHTML = stadat[0].Mobile || "-";
  phn = stadat[0].Phone || "-";
  mobl = stadat[0].Mobile || "-";
  // document.getElementById("cmob").innerHTML = stadat[0].Mobile || "-";
  // document.getElementById("pcon").innerHTML="Phone: " + stadat[0].Phone || "";
  document.getElementById("apcon").innerHTML = "Alt. No.<br/> <span style=\"font-weight: 700;\">" + stadat[0].Phone || "" + "</span>" || "-";
  // document.getElementById("camob").innerHTML = stadat[0].Alternate_Mobile_No || "-";
  document.getElementById("rmname").innerHTML = "RM Name<br/> <span style=\"font-weight: 700;\">" + stadat[0].RM_Name || "" + "</span>" || "-";
  //Customer Main Information Data Section 2 SideNav
  document.getElementById("lcid").innerHTML = "Customer ID: <span style=\"font-weight: 700;\">" + stadat[0].Customer_ID || "" + "</span>" || "-";
  custid = stadat[0].Customer_ID || " ";
  ZOHO.CRM.API.getRelatedRecords({Entity:"Contacts",RecordID:rid,RelatedList:"Deals",page:1,per_page:200})
  .then((data)=>{
    let dt = data.data[0] || "";
    if(dt!="")
    {
      document.getElementById("oppTitle").innerHTML = "Opportunities as of: " + dt.Widget_Refresh_Date_Time || "";
      document.getElementById("depTitle").innerHTML = "Deposits as of: " + dt.Widget_Refresh_Date_Time || "";
      document.getElementById("advTitle").innerHTML = "Advances as of: " + dt.Widget_Refresh_Date_Time || "";
      document.getElementById("fubrefreshTime").innerHTML = dt.Widget_Refresh_Date_Time || "";
    }
  })
  // document.getElementById("lcano").innerHTML = stadat[0].Account_Number || "";
  // document.getElementById("lbct").innerHTML = "";
  // document.getElementById("labch").innerHTML = "";
  // document.getElementById("lbchcd").innerHTML = "";
  // document.getElementById("lkycr").innerHTML = "";
  //Contact Owner Information Data Section 3 SideNav
  // document.getElementById("ctown").innerHTML = stadat[0].Owner.name || "";
  // document.getElementById("ctonem").innerHTML = stadat[0].Owner.email || "";
  // document.getElementById("ctownph").innerHTML = "";
  // document.getElementById("ctowncit").innerHTML = "";
  //Customer Personal Information Personal Section Main Content
  document.getElementById("ctdob").innerHTML = stadat[0].Date_of_Birth || "-";
  // document.getElementById("ctbranch").innerHTML = stadat[0].Branch || "-";
  // document.getElementById("ctregion").innerHTML = stadat[0].Region || "-";
  // document.getElementById("ctzone").innerHTML = stadat[0].Zone || "-";
  document.getElementById("ctgen").innerHTML = stadat[0].Gender || "-";

  document.getElementById("ctcrv").innerHTML = stadat[0].CRV || "-";
  document.getElementById("ctstresscat").innerHTML = stadat[0].Stress_Category || "-";
  document.getElementById("ctnpadate").innerHTML = stadat[0].NPA_Date || "-";
  document.getElementById("ctriskcat").innerHTML = stadat[0].Risk_Category || "-";
  document.getElementById("ctbkicr").innerHTML = stadat[0].ICR_Internal_Credit_Rating || "-";
  document.getElementById("ctbkecr").innerHTML = stadat[0].	ECR_External_Credit_Rating || "-";

  document.getElementById("ctlastintdate").innerHTML = stadat[0].Last_Interaction_Date || "-";
  document.getElementById("ctclientsector").innerHTML = stadat[0].Client_Sector || "-";
  document.getElementById("ctlastkycdate").innerHTML = stadat[0].Last_KYC_Date || "-";
  document.getElementById("ctrelduration").innerHTML = stadat[0].Relationship_Duration || "-";
  console.log(pan + " " + phn + " " + mail);
  // document.getElementById("ctcibilscore").innerHTML = stadat[0].CIBIL_Score || "";
  
  cibScore = stadat[0].CIBIL_Score || "0";
  const gaugeElement = document.querySelector(".gauge");

  function setGaugeValue(gauge, value) {
    // if (value < 0 || value > 1) {
    //  // return;
    // }
    if (value < 0 || value > 1) {
    gauge.querySelector(".gauge__fill").style.transform = `rotate(${
      value / 2
    }turn)`;}

    gauge.querySelector(".gauge__cover").textContent = `${Math.round(
      value * 1000
    )}`;
  }
  console.log(cibScore);
  let x = cibScore/1000;//0.810;
  // console.log(cibScore + " " + x);

  if(x >= 0.000 && x <= 0.299 || x < 0.000)
  {
    document.getElementsByClassName("gauge__fill")[0].style.backgroundColor = "Red";
    document.getElementById("cibilRating").innerHTML = "No Credit History";
  }
  else if(x > 0.300 && x <= 0.549)
  {
    document.getElementsByClassName("gauge__fill")[0].style.backgroundColor = "Red";
    document.getElementById("cibilRating").innerHTML = "Poor";
  }
  else if(x > 0.550 && x <= 0.649)
  {
    document.getElementsByClassName("gauge__fill")[0].style.backgroundColor = "Orange";
    document.getElementById("cibilRating").innerHTML = "Average";
  }
  else if(x > 0.650 && x <= 0.749)
  {
    document.getElementsByClassName("gauge__fill")[0].style.backgroundColor = "Yellow";
    document.getElementById("cibilRating").innerHTML = "Good";
  }
  else if(x > 0.750 && x <= 1.000)
  {
    document.getElementsByClassName("gauge__fill")[0].style.backgroundColor = "Green";
    document.getElementById("cibilRating").innerHTML = "Excellent";
  }

  setGaugeValue(gaugeElement, x);

  
  // document.getElementById("ctczct").innerHTML = stadat[0].Minor || "";
  //Address information
  document.getElementById("ctrsst").innerHTML = stadat[0].Resident_Status || "-";
  document.getElementById("ctaddr").innerHTML =  append_addresses(stadat[0].Address_1,stadat[0].Address_2);
  document.getElementById("ctcity").innerHTML = stadat[0].City || "-";
  document.getElementById("ctstate").innerHTML = stadat[0].State || "-";
  document.getElementById("ctcntry").innerHTML = stadat[0].Country || "-";
  document.getElementById("ctpincd").innerHTML = stadat[0].Pin_Code || "-";
  //End of address information
  //Registered address info
  document.getElementById("ctregaddr").innerHTML = append_addresses(stadat[0].REG_ADDRESS_LINE1,stadat[0].REGISTERED_ADDRESS_LINE2);
  document.getElementById("ctregcity").innerHTML = stadat[0].REGISTERED_CITY || "-";
  document.getElementById("ctregstate").innerHTML = stadat[0].REGISTERED_STATE || "-";
  document.getElementById("ctregcntry").innerHTML = stadat[0].REGISTERED_COUNTRY || "-";
  document.getElementById("ctregpincd").innerHTML = stadat[0].REGISTERED_ZIP || "-";
  //end of registered address info
  //mail address info
  document.getElementById("ctmailaddr").innerHTML = append_addresses(stadat[0].MAIL_ADDRESS_LINE1,stadat[0].MAIL_ADDRESS_LINE2);
  document.getElementById("ctmailcity").innerHTML = stadat[0].MAIL_CITY || "-";
  document.getElementById("ctmailstate").innerHTML = stadat[0].MAIL_STATE || "-";
  document.getElementById("ctmailcntry").innerHTML = stadat[0].MAIL_COUNTRY || "-";
  document.getElementById("ctmailpincd").innerHTML = stadat[0].MAIL_ZIP|| "-";
  //end of mail address info
  document.getElementById("ctoccp").innerHTML = stadat[0].Occupation || "-";
  //Customer Bank Information 1 Personal Section Main Content
  document.getElementById("ctpanno").innerHTML = stadat[0].PAN_GIR_ID || "-";
  pan = stadat[0].PAN_GIR_ID || "";
  solid = stadat[0].SOL_ID || "0";
  console.log("sol id is",solid);
  let m="Branch_Master";
  let c="(Branch_SOL_ID:equals:" + solid + ")";
  search_record_crm(m,c).then((data)=>{console.log("inside new search function", data);})
  ZOHO.CRM.API.searchRecord({Entity:"Branch_Master",Type:"criteria",Query:"(Branch_SOL_ID:equals:" + solid + ")"})
  .then(function(data){
    console.log("found a match for sol ID", solid,data);
    if(data.status==204)
    {
          document.getElementById("ctbranch").innerHTML = "-";
          document.getElementById("ctregion").innerHTML = "-";
          document.getElementById("ctzone").innerHTML = "-";
          return;
    }
      let dt = data.data;
      
      for(var i = 0; i<dt.length; i++)
      {
        if( i == 0 )
        {
          document.getElementById("ctbranch").innerHTML = dt[i].Branch_Name || "-";
          document.getElementById("ctregion").innerHTML = dt[i].Region || "-";
          document.getElementById("ctzone").innerHTML = dt[i].Zone || "-";
        }
        else
        {
          console.log("Error: More than one Branch found for one SOL ID")
        }
      }
  })
  .catch((error) => {console.log(error)})
  document.getElementById("ctadhno").innerHTML = stadat[0].Aadhar_Number || "-";
  document.getElementById("ctraroc").innerHTML = stadat[0].RAROC_Score || "-";
  
  let deposit_href=`<a href="javascript: void(0);" class="chkapiLink1" id="depamtchkLink" onclick="checkApi1(this)">Check Now</a>`;
  let loan_href=`<a href="javascript: void(0);" class="chkapiLink1" id="loanamtchkLink" onclick="checkApi1(this)">Check Now</a>`;
  document.getElementById("ccttdpamt").innerHTML = (stadat[0].Total_Deposit_Amount || "-");
  document.getElementById("ccttotlnamt").innerHTML = (stadat[0].Total_Loan_Amount	 || "-");
  document.getElementById("cctctut").innerHTML = "Constitution<br/> <span style=\"font-weight: 700;\">" + stadat[0].Customer_Constitution + "</span>" || "-";
  document.getElementById("ctctut").innerHTML = stadat[0].Customer_Constitution || "-";
  document.getElementById("ctrskcat").innerHTML = "";//stadat[0].Risk_Category || "";
  // document.getElementById("cctrldur").innerHTML = "";//stadat[0].CRelationship_Duration || "";
  // document.getElementById("ctrldur").innerHTML = "";//stadat[0].Relationship_Duration || "";
  //document.getElementById("ccttotprd").innerHTML = "";// stadat[0].CTotal_Loan_Amount || "";
  //document.getElementById("ccttdpamt").innerHTML = "";// stadat[0].CTotal_Deposit_Amount || "";
  // document.getElementById("cttotprd").innerHTML = "";// stadat[0].Total_Loan_Amount || "";
  // document.getElementById("cttdpamt").innerHTML = "";// stadat[0].Total_Deposit_Amount || "";
  document.getElementById("cttlnamt").innerHTML = "-";// stadat[0].Mailing_Country || "";
  document.getElementById("ctstrcm").innerHTML = "-";// stadat[0].Stresse_Customer || "";
  document.getElementById("ctcmcls").innerHTML = stadat[0].Customer_Class || "-";
  //Customer Bank Service Information 
  document.getElementById("ctlck").innerHTML = stadat[0].Locker || false;
  console.log("prods",stadat[0].Locker,stadat[0].Credit_Card);
  if(stadat[0].Locker)
  {
    prod_count++;
  }
  document.getElementById("ctcrdcd").innerHTML = stadat[0].Credit_Card || false;
  if(stadat[0].Credit_Card)
  {
    prod_count++;
  }
  document.getElementById("ctintbk").innerHTML = stadat[0].Internet_Banking || false;
  if(stadat[0].Internet_Banking)
  {
    prod_count++;
  }
  document.getElementById("ctumbl").innerHTML = stadat[0].U_Mobile || false;
  if(stadat[0].U_Mobile!=null)
  {
    prod_count++;
  }
  document.getElementById("ctdmac").innerHTML = stadat[0].Demat_A_C || false;
  if(stadat[0].Demat_A_C)
  {
    prod_count++;
  }
  document.getElementById("ctpasbk").innerHTML = stadat[0].Passbook || false;
  if(stadat[0].Passbook)
  {
    prod_count++;
  }
  document.getElementById("ctchqbk").innerHTML = stadat[0].Cheque_Book || false;
  if(stadat[0].Cheque_Book)
  {
    prod_count++;
  }
  document.getElementById("ctdbtcd").innerHTML = stadat[0].Debit_Card || false;
  if(stadat[0].Debit_Card)
  {
    prod_count++;
  }
  document.getElementById("ctsmsbk").innerHTML = stadat[0].SMS_Banking || false;
  if(stadat[0].SMS_Banking)
  {
    prod_count++;
  }
  document.getElementById("ctgtbpd").innerHTML = stadat[0].Govt_Business_Product || false;
  if(stadat[0].Govt_Business_Product)
  {
    prod_count++;
  }
  document.getElementById("ctmtfd").innerHTML = stadat[0].Mutual_Fund || false;
  if(stadat[0].Mutual_Fund)
  {
    prod_count++;
  }
  document.getElementById("ctlfinc").innerHTML = stadat[0].Life_Insurance || false;
  if(stadat[0].Life_Insurance)
  {
    prod_count++;
  }
  document.getElementById("cthtinc").innerHTML = stadat[0].Health_Insurance || false;
  if(stadat[0].Health_Insurance)
  {
    prod_count++;
  }
  document.getElementById("ctgninc").innerHTML = stadat[0].General_Insurance || false;
  if(stadat[0].General_Insurance)
  {
    prod_count++;
  }
  document.getElementById("cttotprd").innerHTML=prod_count-1;
  document.getElementById("ctcsus").innerHTML=stadat[0].Cross_Sell || "-";
  
  rating = stadat[0].ICR_Internal_Credit_Rating || "-";
  var star = document.getElementById("ratingStars");
  star.style.setProperty("--rating", rating);
  // var stars = getComputedStyle(star);
  // console.log(stars.getPropertyValue("--rating"));

  // Tickets chart

    let xValues = ["Open","In Progress", "Closed"];
    let yValues = [15,65,20];
    let barColors = ["rgba(0,0,255,0.4)","rgba(0,255,0,0.4)", "rgba(255,0,0,0.4)"];
    
    new Chart("ticketsChart", {
      type: "bar",
      data: {
        labels: xValues,
        datasets: [{
          backgroundColor: barColors,
          data: yValues
        }],
      },
      options: {
        legend: {display: false},
        responsive: false,
        maintainAspectRatio: false,
        title: {
          display: false,
          text: "Tickets"
        }
      }
    });

  // Opportunities chart
  ZOHO.CRM.API.searchRecord({Entity:"Liabilities1",Type:"criteria",Query:"(Customer_Name:equals:"+rid+")"}).then((data)=>{
    console.log("liabilities fetched",data);
    console.log("deposits chart status",data.status);
    // Deposit Chart 
    if(data.status==204)
    {
      display_panel_overlay('deposit_panel_overlay','No deposits yet');
      console.log("Deposits panel is empty");
      return;
    }
    let d=data.data;
    if(d.length==0)
    {
      //show no deposits yet on the screen.
      display_panel_overlay('deposit_panel_overlay','No deposits yet');
    }
    else
    {
      let ca=0,sa=0,td=0;
      for(let i=0;i<d.length;i++)
      {
        if(d[i].A_c_Type=='Current')
        {
          ca++;
        }
        else if(d[i].A_c_Type=='Saving')
        {
          sa++;
        }
        else if(d[i].A_c_Type=='Term Deposit')
        {
          td++;
        }
            
      }
      var dxValues = ["Current Account", "Savings Account", "Term Deposit"];
      var dyValues = [ca, sa, td];
      var dbarColors = [
        "#b91d47",
        "#00aba9",
        "#2b5797"
        ];
      var drefVal = "2021-06-07";

      let d_chart=new Chart("depositChart", {
        type: "pie",
        data: {
          labels: dxValues,
          datasets: [{
            backgroundColor: dbarColors,
            data: dyValues
            }]
        },
        options: {
          responsive: false,
          maintainAspectRatio: false,
          title: {
            display: false,
            text: "Deposits (As of " +  drefVal + ")"
          }
        }
          });

    }
    
  }).catch((err)=>{console.log("error in deposits chart",err);
  display_panel_overlay('deposit_panel_overlay','Oops! Something went wrong');
})
//advances Chart API hit
console.log("hitting loan accounts API");
ZOHO.CRM.API.searchRecord({Entity:"Loan_Accounts",Type:"criteria",Query:"(Customer_Name:equals:"+rid+")"}).then((data)=>{
  console.log("liabilities fetched",data);
  if(data.status==204)
  {
    display_panel_overlay('adv_panel_overlay','No advances yet');
    return;

  }
  // Deposit Chart 
  let d=data.data;
  if(d.length==0)
  {
    //show no deposits yet on the screen.
    display_panel_overlay('adv_panel_overlay','No advances yet');
    return;
  }
  else
  {
    let cca=0,laa=0,others=0;
    for(let i=0;i<d.length;i++)
    {
      if(d[i].A_c_Type=='CCA')
      {
        cca++;
      }
      else if(d[i].A_c_Type=='LAA')
      {
        laa++;
      }
      else
      {
        others++;
      }
        
    }
    // Advances Chart 

    var axValues = ["CCA", "LAA","Others"];
    var ayValues = [cca, laa,others];
    var abarColors = [
      "#b91d47",
      "#00aba9"
    ];
    var arefVal = "2021-06-07";

    new Chart("advanceChart", {
      type: "pie",
      data: {
        labels: axValues,
        datasets: [{
          backgroundColor: abarColors,
          data: ayValues
        }]
      },
      options: {
        responsive: false,
        maintainAspectRatio: false,
        title: {
          display: false,
          text: "Advances (As of " +  arefVal + ")"
        }
      }
    });

  }
  
}).catch((err)=>{console.log("error in advances chart",err);
display_panel_overlay('adv_panel_overlay','Oops! Something went wrong');
});

  // criteria (Customer_ID:equals:"+custid+")or(PAN_TAN_Number:equals:"+pan+")or(Alternate_Mobile_No:equals:"+phn+")or
  console.log(" API call for oppurtunities chart ",pan + " " + mobl + " " + mail);
  ZOHO.CRM.API.searchRecord({Entity:"Leads",Type:"criteria",Query:"(Mobile:equals:"+mobl+")",delay:false})
  .then((data) => {
    console.log("Leads search data",data);
    let arrDat = [];
    console.log('arrDat',arrDat);
    if(data.status==204)
    {
      display_panel_overlay('oppor_panel_overlay','No associated leads');
      return;
    }
    arrDat=data.data;
    leads_results=arrDat;
    let c=0;
    let r=0;
    let u=0;
    if(arrDat.length==0)
    {
      display_panel_overlay('oppor_panel_overlay','No associated leads');
    }
    else
    {
      for(var i = 0; i < arrDat.length; i++)
    {
      if(arrDat[i].Lead_Status == "Converted")
      {
        c++;
      }
      else if(arrDat[i].Lead_Status == "Rejected")
      {
        r++;
      }
      if(arrDat[i].Lead_Status == "Under Process")
      {
        u++;
      }
    }
    }
    
    

    let xValues = ["Under Process","Converted", "Rejected"];
    let yValues = [u,c,r];
    let barColors = ["rgba(0,0,255,0.4)","rgba(0,255,0,0.4)", "rgba(255,0,0,0.4)"];
    console.log("Oppertunities chart values",yValues);
    new Chart("opporChart", {
      type: "bar",
      data: {
        labels: xValues,
        datasets: [{
          backgroundColor: barColors,
          data: yValues
        }],
      },
      options: {
        legend: {display: false},
        responsive: false,
        maintainAspectRatio: true,
        title: {
          display: true,
          text: "Opportunities"
        }
      }
    });

    
    console.log("|d chart is",d_chart);
    

  }).catch(
    (error) => {
      console.log("error in leads api call",error, "mobl is ", typeof(mobl));
      if(mobl=="" || mobl==null || mobl=="-")
      {
        display_panel_overlay('oppor_panel_overlay','No associated leads');
        return;
      }s
      display_panel_overlay('oppor_panel_overlay','Oops! something went wrong');
  });

  // Conditional Hyperlinks for Customer Service Data
  elements = document.getElementsByClassName("ctsvincdlk");
  var i;
  var len;
  var eleid = [];
  len=elements.length;
  for(var i=0; i<len; i++)
  {
    eleid.push(elements[i].id);
    if(document.getElementById(eleid[i]).innerHTML=="true")
    {
      document.getElementById(eleid[i]).innerHTML="Availed";
      document.getElementById(eleid[i]).style.textDecoration ="none";
      // document.getElementById(eleid[i]).style.color="blue";
      // ----------------------------------------------------------------------------------
      if(eleid[i]=="ctlck")
      {
        document.getElementById('accountdropdown').style.display="none";
        document.getElementById(eleid[i]).onclick = () => {
          document.getElementById('loadingWrapper').style.display = 'flex';
          // modal.style.display = "block";

          let request ={
            url : "https://sandbox.zohoapis.in/crm/v2/functions/customer360services/actions/execute",
            params:{
                auth_type:"apikey",
                zapikey:"1003.600980f6c77d6565e75469173e5481bc.4130ee5339b56ed6fc918aec16f1329e",
                sat: "locker",
                cid: "D8608917",
                rt: "LOCKER"
            }
          }
          let func_name="Locker_API1";
          call_crm_function(func_name,{}).then(function(res){
            // let res = JSON.parse(data);
            document.getElementById('loadingWrapper').style.display = 'none';
            modal.style.display = "block";
            // console.log(JSON.parse(res.details.output));
            if(res.code == "success")
            {
              stadat="";
              stadat = JSON.parse(res.details.output);
              console.log("locker response is",stadat);
              stadat = stadat.data;
              console.log(stadat);
              let resp = stadat.SucOrFail || "";
              console.log(resp);
              if(resp == "Y")
              {
                var table = document.getElementById('modalDataTable1');
                let hdr = `<tr class="modalDataCb">
                <th>Locker Branch</th>
                <th>Locker Number</th>
                <th>Locker Rent</th>
                <th>Overdue Rent</th>
                <th>Due Date</th>
                </tr>`;
                table.innerHTML += hdr;
                console.log((stadat.WhatsappBankingLockerAPIList).length);
                for (var i = 0; i < (stadat.WhatsappBankingLockerAPIList).length; i++){
                var row = `<tr>
                        <td>${stadat.WhatsappBankingLockerAPIList[i].SOL_ID || ""}</td>
                        <td>${stadat.WhatsappBankingLockerAPIList[i].LOCKER_NO || ""}</td>
                        <td>${stadat.WhatsappBankingLockerAPIList[i].TOTAL_RENT || ""}</td>
                        <td>${stadat.WhatsappBankingLockerAPIList[i].duerent || ""}</td>
                        <td>${stadat.WhatsappBankingLockerAPIList[i].duedt || ""}</td>
                      </tr>`
                table.innerHTML += row
                }
                
              }
              else
              {
                let errmsg =  stadat.replyMsg || stadat.RESULT_MSG ;
                errmsg = errmsg || "Locker API Technical Error";
                console.error('Locker API Error:', errmsg);
                document.getElementById('loadingWrapper').style.display = "none";
                modal1.style.display = "block";
                document.getElementById("mdlbdytxt1").innerHTML = "Error! <br/>" + errmsg + ". Please try again later.";
                // document.getElementById("aadhaarOtpDiv").style.display = "none";
                span1.onclick = () => {
                    modal1.style.display = "none";
                }
                window.onclick = (event) => {
                    if (event.target == modal1) {
                        modal1.style.display = "none";
                    }
                }
    
                var recordData = {
                  "API_Name": "Locker API Error",
                  "Error_Id": "3607830001",
                  "Error_Source": "Customer 360 Widget",
                  "Module_Name": "Contacts",
                  "Module_Record_Id": rid,
                  "Error_Description": error.toString()
                }
                ZOHO.CRM.API.insertRecord({Entity:"CRM_Error_Log",APIData:recordData,Trigger:["workflow"]}).then(function(data){
                    console.log("-");
                    });
              }
            }
            else
            {
              let errmsg =  stadat.replyMsg || stadat.RESULT_MSG ;
              errmsg = errmsg || "Locker API Technical Error";
              console.error('Locker API Error:', errmsg);
              document.getElementById('loadingWrapper').style.display = "none";
              modal1.style.display = "block";
              document.getElementById("mdlbdytxt1").innerHTML = "Error! <br/>" + errmsg + ". Please try again later.";
              // document.getElementById("aadhaarOtpDiv").style.display = "none";
              span1.onclick = () => {
                  modal1.style.display = "none";
              }
              window.onclick = (event) => {
                  if (event.target == modal1) {
                      modal1.style.display = "none";
                  }
              }
  
              var recordData = {
                "API_Name": "Locker API Error",
                "Error_Id": "3607830001",
                "Error_Source": "Customer 360 Widget",
                "Module_Name": "Contacts",
                "Module_Record_Id": rid,
                "Error_Description": error.toString()
              }
              ZOHO.CRM.API.insertRecord({Entity:"CRM_Error_Log",APIData:recordData,Trigger:["workflow"]}).then(function(data){
                  console.log("-");
                  });
            }                        
          }).catch((error) => {
            console.error('Locker API Error:', error);
            document.getElementById('loadingWrapper').style.display = "none";
            modal1.style.display = "block";
            document.getElementById("mdlbdytxt1").innerHTML = "Error! <br/>" + error + ". Please try again later.";
            // document.getElementById("aadhaarOtpDiv").style.display = "none";
            span1.onclick = () => {
                modal1.style.display = "none";
            }
            window.onclick = (event) => {
                if (event.target == modal1) {
                    modal1.style.display = "none";
                }
            }

            var recordData = {
                "API_Name": "Locker API Error",
                "Error_Id": "3607830001",
                "Error_Source": "Customer 360 Widget",
                "Module_Name": "Contacts",
                "Module_Record_Id": rid,
                "Error_Description": error.toString()
            }
            ZOHO.CRM.API.insertRecord({Entity:"CRM_Error_Log",APIData:recordData,Trigger:["workflow"]}).then(function(data){
                console.log("-");
                });
          });;
          /*
          ZOHO.CRM.HTTP.get(request)
          .then(function(data){
            let res = JSON.parse(data);
            document.getElementById('loadingWrapper').style.display = 'none';
            modal.style.display = "block";
            // console.log(JSON.parse(res.details.output));
            if(res.code == "success")
            {
              stadat="";
              stadat = JSON.parse(res.details.output);
              stadat = stadat.data;
              console.log(stadat);
              let resp = stadat.SucOrFail || "";
              console.log(resp);
              if(resp == "Y")
              {
                var table = document.getElementById('modalDataTable1');
                let hdr = `<tr class="modalDataCb">
                <th>Locker Branch</th>
                <th>Locker Number</th>
                <th>Locker Rent</th>
                <th>Overdue Rent</th>
                <th>Due Date</th>
                </tr>`;
                table.innerHTML += hdr;
                console.log((stadat.WhatsappBankingLockerAPIList).length);
                for (var i = 0; i < (stadat.WhatsappBankingLockerAPIList).length; i++){
                var row = `<tr>
                        <td>${stadat.WhatsappBankingLockerAPIList[i].SOL_ID || ""}</td>
                        <td>${stadat.WhatsappBankingLockerAPIList[i].LOCKER_NO || ""}</td>
                        <td>${stadat.WhatsappBankingLockerAPIList[i].TOTAL_RENT || ""}</td>
                        <td>${stadat.WhatsappBankingLockerAPIList[i].duerent || ""}</td>
                        <td>${stadat.WhatsappBankingLockerAPIList[i].duedt || ""}</td>
                      </tr>`
                table.innerHTML += row
                }
              }
              else
              {
                let errmsg =  stadat.replyMsg || stadat.RESULT_MSG ;
                errmsg = errmsg || "Locker API Technical Error";
                console.error('Locker API Error:', errmsg);
                document.getElementById('loadingWrapper').style.display = "none";
                modal1.style.display = "block";
                document.getElementById("mdlbdytxt1").innerHTML = "Error! <br/>" + errmsg + ". Please try again later.";
                // document.getElementById("aadhaarOtpDiv").style.display = "none";
                span1.onclick = () => {
                    modal1.style.display = "none";
                }
                window.onclick = (event) => {
                    if (event.target == modal1) {
                        modal1.style.display = "none";
                    }
                }
    
                var recordData = {
                  "API_Name": "Locker API Error",
                  "Error_Id": "3607830001",
                  "Error_Source": "Customer 360 Widget",
                  "Module_Name": "Contacts",
                  "Module_Record_Id": rid,
                  "Error_Description": error.toString()
                }
                ZOHO.CRM.API.insertRecord({Entity:"CRM_Error_Log",APIData:recordData,Trigger:["workflow"]}).then(function(data){
                    console.log("-");
                    });
              }
            }
            else
            {
              let errmsg =  stadat.replyMsg || stadat.RESULT_MSG ;
              errmsg = errmsg || "Locker API Technical Error";
              console.error('Locker API Error:', errmsg);
              document.getElementById('loadingWrapper').style.display = "none";
              modal1.style.display = "block";
              document.getElementById("mdlbdytxt1").innerHTML = "Error! <br/>" + errmsg + ". Please try again later.";
              // document.getElementById("aadhaarOtpDiv").style.display = "none";
              span1.onclick = () => {
                  modal1.style.display = "none";
              }
              window.onclick = (event) => {
                  if (event.target == modal1) {
                      modal1.style.display = "none";
                  }
              }
  
              var recordData = {
                "API_Name": "Locker API Error",
                "Error_Id": "3607830001",
                "Error_Source": "Customer 360 Widget",
                "Module_Name": "Contacts",
                "Module_Record_Id": rid,
                "Error_Description": error.toString()
              }
              ZOHO.CRM.API.insertRecord({Entity:"CRM_Error_Log",APIData:recordData,Trigger:["workflow"]}).then(function(data){
                  console.log("-");
                  });
            }                        
          }).catch((error) => {
            console.error('Locker API Error:', error);
            document.getElementById('loadingWrapper').style.display = "none";
            modal1.style.display = "block";
            document.getElementById("mdlbdytxt1").innerHTML = "Error! <br/>" + error + ". Please try again later.";
            // document.getElementById("aadhaarOtpDiv").style.display = "none";
            span1.onclick = () => {
                modal1.style.display = "none";
            }
            window.onclick = (event) => {
                if (event.target == modal1) {
                    modal1.style.display = "none";
                }
            }

            var recordData = {
                "API_Name": "Locker API Error",
                "Error_Id": "3607830001",
                "Error_Source": "Customer 360 Widget",
                "Module_Name": "Contacts",
                "Module_Record_Id": rid,
                "Error_Description": error.toString()
            }
            ZOHO.CRM.API.insertRecord({Entity:"CRM_Error_Log",APIData:recordData,Trigger:["workflow"]}).then(function(data){
                console.log("-");
                });
          }); */
        }
        span.onclick = () => {
          modal.style.display = "none";
          $("#modalDataTable1 tr").remove();
        }
        window.onclick = (event) => {
          if (event.target == modal) {
            modal.style.display = "none";
            $("#modalDataTable1 tr").remove();
          }
        } 
      }
      else if(eleid[i]=="ctcrdcd")
      {
        document.getElementById('accountdropdown').style.display="none";
        document.getElementById(eleid[i]).onclick = () => {
          modal.style.display = "block";
          //API URL Assignment and Parameters Setting
          var url2 = new URL("https://reqres.in/api/users"); 
          // var url = new URL("https://cdn-api.co-vin.in/api/v2/admin/location/states");
          var params2 = {page:1};
          url2.search = new URLSearchParams(params2).toString();
          var recordPromisem2 = new Promise(async (resolve, reject) => {
            // const stdat = await fetch("https://cdn-api.co-vin.in/api/v2/admin/location/states");
            const stdat = await fetch(url2);
            resolve(stdat);
          });
          recordPromisem2
          .then((response)=>{
            // console.log(data.json());
            return response.json();
          }).then((dt)=>{
            // console.log(dt.data);
            stadat="";
            stadat = dt.data;
            var table = document.getElementById('modalDataTable1');
            let hdr = `<tr class="modalDataCc">
            <th>Credit Card Number</th>
            <th>Outstanding Amount</th>
            <th>Card Status</th>
            </tr>`;
            table.innerHTML += hdr;
            for (var i = 0; i < stadat.length; i++){
              var row = `<tr>
                      <td>${stadat[i].id}</td>
                      <td>${stadat[i].first_name}</td>
                      <td>${stadat[i].last_name}</td>
                    </tr>`
              // table.innerHTML += row
            }
            table.innerHTML += `<tr>
            <td>This service is not available yet</td>
          </tr>`;
          })
        }
        span.onclick = () => {
          modal.style.display = "none";
          $("#modalDataTable1 tr").remove();
        }
        window.onclick = (event) => {
          if (event.target == modal) {
            modal.style.display = "none";
            $("#modalDataTable1 tr").remove();
          }
        } 
      }
      else if(eleid[i]=="ctintbk")
      {
        document.getElementById('accountdropdown').style.display="none";
        console.log("Internet Banking");
        document.getElementById(eleid[i]).onclick = () => {
          modal.style.display = "block";
          //API URL Assignment and Parameters Setting
         
          let func_name="Lien_Inqury";
          call_crm_function(func_name,{}).then((res)=>{
            console.log("Internet banking API response is", res);
            if(res.code!='success')
            {
              document.getElementById('mdlbdytxt').innerHTML="API call failed! Please try again later or contact you administrator."; 
              console.log("Error in internet banking API",err);
            }
            else
            {
              let output=res.details.output;
              let output_in_json=JSON.parse(output);
              console.log("internet banking output is",output_in_json); 
              
              var table = document.getElementById('modalDataTable1');
              let hdr = `<tr  class="modalDataFc">
              <th>Facility</th>
              <th>Last Login Date</th>
              <th>Limit Scheme</th>
              <th>Login Password Expiry Date</th>
              </tr>`;
              table.innerHTML += hdr;
              for(let i=0;i<output_in_json.length;i++){
                var row = `<tr>
                      <td>${output_in_json[i].FacilityType}</td>
                      <td>${output_in_json[i].LastLoginDate}</td>
                      <td>${output_in_json[i].LimitScheme}</td>
                      <td>${output_in_json[i].LoginPassExpDate}</td>
                    </tr>`
                table.innerHTML += row
              }
              if(output_in_json.length==0)
              {
                table.innerHTML += `<tr>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                    </tr>`
                
              }
            }
        }).catch((err)=>{document.getElementById('mdlbdytxt').innerHTML="Oops! Something went wrong! Please try again later or contact you administrator."; console.log("Error in internet banking API",err);});
        }
        span.onclick = () => {
          modal.style.display = "none";
          $("#modalDataTable1 tr").remove();
        }
        window.onclick = (event) => {
          if (event.target == modal) {
            modal.style.display = "none";
            $("#modalDataTable1 tr").remove();
          }
        }
      }
      else if(eleid[i]=="ctumbl")
      {
        document.getElementById('accountdropdown').style.display="none";
        console.log("Umobile");
        document.getElementById(eleid[i]).onclick = () => {
          modal.style.display = "block";
          //API URL Assignment and Parameters Setting
          var url4 = new URL("https://reqres.in/api/users"); 
          // var url = new URL("https://cdn-api.co-vin.in/api/v2/admin/location/states");
          var params4 = {page:1};
          url4.search = new URLSearchParams(params4).toString();
          var recordPromisem4 = new Promise(async (resolve, reject) => {
            // const stdat = await fetch("https://cdn-api.co-vin.in/api/v2/admin/location/states");
            const stdat = await fetch(url4);
            resolve(stdat);
          });
          recordPromisem4
          .then((response)=>{
            // console.log(data.json());
            return response.json();
          }).then((dt)=>{
            // console.log(dt.data);
            stadat="";
            stadat = dt.data;
            var table = document.getElementById('modalDataTable1');
            let hdr = `<tr class="modalDataLLd">
            <th>Last Login Date</th>
            </tr>`;
            table.innerHTML += hdr;
            for (var i = 0; i < stadat.length; i++){
              var row = `<tr>
                      <td>${stadat[i].id}</td>
                    </tr>`
              // table.innerHTML += row
            }
            table.innerHTML += `<tr>
            <td>This service is not available yet</td>
          </tr>`;
          })
        }
        span.onclick = () => {
          modal.style.display = "none";
          $("#modalDataTable1 tr").remove();
        }
        window.onclick = (event) => {
          if (event.target == modal) {
            modal.style.display = "none";
            $("#modalDataTable1 tr").remove();
          }
        }
      }
      else if(eleid[i]=="ctdmac")
      {
        document.getElementById('accountdropdown').style.display="none";
        console.log("Demat");
        document.getElementById(eleid[i]).onclick = () => {
          modal.style.display = "block";
          //API URL Assignment and Parameters Setting
          var url5 = new URL("https://reqres.in/api/users"); 
          // var url = new URL("https://cdn-api.co-vin.in/api/v2/admin/location/states");
          var params5 = {page:1};
          url5.search = new URLSearchParams(params5).toString();
          var recordPromisem5 = new Promise(async (resolve, reject) => {
            // const stdat = await fetch("https://cdn-api.co-vin.in/api/v2/admin/location/states");
            const stdat = await fetch(url5);
            resolve(stdat);
          });
          recordPromisem5
          .then((response)=>{
            // console.log(data.json());
            return response.json();
          }).then((dt)=>{
            // console.log(dt.data);
            stadat="";
            stadat = dt.data;
            var table = document.getElementById('modalDataTable1');
            let hdr = `<tr class="modalDataS">
            <th>Sol Id</th>
            <th>Branch</th>
            <th>Account Number</th>
            <th>Balance</th>
            </tr>`;
            table.innerHTML += hdr;
            for (var i = 0; i < stadat.length; i++){
              var row = `<tr>
                      <td>${stadat[i].id}</td>
                      <td>${stadat[i].first_name}</td>
                      <td>${stadat[i].last_name}</td>
                      <td>${stadat[i].email}</td>
                    </tr>`
              // table.innerHTML += row
            }
            table.innerHTML += `<tr>
            <td>This service is not available yet</td>
          </tr>`;
          })
        }
        span.onclick = () => {
          modal.style.display = "none";
          $("#modalDataTable1 tr").remove();
        }
        window.onclick = (event) => {
          if (event.target == modal) {
            modal.style.display = "none";
            $("#modalDataTable1 tr").remove();
          }
        }
      }
      else if(eleid[i]=="ctpasbk")
      {
        document.getElementById('accountdropdown').style.display="none";
        // console.log("Passbook");
        document.getElementById(eleid[i]).onclick = () => {
          modal.style.display = "block";
          //API URL Assignment and Parameters Setting
          var url6 = new URL("https://reqres.in/api/users"); 
          // var url = new URL("https://cdn-api.co-vin.in/api/v2/admin/location/states");
          var params6 = {page:1};
          url6.search = new URLSearchParams(params6).toString();
          var recordPromisem6 = new Promise(async (resolve, reject) => {
            // const stdat = await fetch("https://cdn-api.co-vin.in/api/v2/admin/location/states");
            const stdat = await fetch(url6);
            resolve(stdat);
          });
          recordPromisem6
          .then((response)=>{
            // console.log(data.json());
            return response.json();
          }).then((dt)=>{
            // console.log(dt.data);
            stadat="";
            stadat = dt.data;
            var table = document.getElementById('modalDataTable1');
            let hdr = `<tr class="modalDataLPd">
            <th>Last Printed Date</th>
            </tr>`;
            table.innerHTML += hdr;
            for (var i = 0; i < stadat.length; i++){
              var row = `<tr>
                      <td>${stadat[i].id}</td>
                    </tr>`
              // table.innerHTML += row
            }
            table.innerHTML += `<tr>
            <td>This service is not available yet</td>
          </tr>`;
          })

        }
        span.onclick = () => {
          modal.style.display = "none";
          $("#modalDataTable1 tr").remove();
        }
        window.onclick = (event) => {
          if (event.target == modal) {
            modal.style.display = "none";
            $("#modalDataTable1 tr").remove();
          }
        }
      }
      else if(eleid[i]=="ctchqbk")
      {
        document.getElementById('accountdropdown').style.display="none";
        console.log("Chequebook");
        let acno = "";
        document.getElementById(eleid[i]).onclick = () => {
          document.getElementById('loadingWrapper').style.display = 'flex';
          document.getElementById('chequebook_btn').style.display = 'block';
          document.getElementById('debitcard_btn').style.display = 'none';
          // modal.style.display = "block";

          ZOHO.CRM.API.searchRecord({Entity:"Liabilities1",Type:"criteria",Query:"(Customer_Name:equals:"+rid+")"}).then((data)=>{
            console.log("liabilities are",data);
            document.getElementById('loadingWrapper').style.display = 'none';
            if(data.info.count==0)
            {
              document.getElementById('membership').innerHTML='<option selected>No accounts associated</option>';
            }
            else
            {
             let accounts=data.data;
             let flag=false;
             let options=``;
             for(let i=0;i<accounts.length;i++)
              {
                if(accounts[i].A_c_Type=="Current" || accounts[i].A_c_Type=="Saving")
                {
                  if(!flag)
                  {
                    options+=`<option selected val="${accounts[i].Name}">${accounts[i].Name}</option>`;
                  }
                  else
                  {
                    options+=`<option val="${accounts[i].Name}">${accounts[i].Name}</option>`;
                  }
                }
              }
              document.getElementById('membership').innerHTML=options;

            }

          }).catch((err)=>{console.log("Error in getting associated account numbers",err);document.getElementById('membership').innerHTML="<option val='FF'>No accounts available</option>";})
          document.getElementById('accountdropdown').style.display="block";

          modal.style.display = "block";

          
          //API URL Assignment and Parameters Setting
          // var url8 = new URL("https://reqres.in/api/users"); 
          // // var url = new URL("https://cdn-api.co-vin.in/api/v2/admin/location/states");
          // var params8 = {page:1};
          // url8.search = new URLSearchParams(params8).toString();
          // var recordPromisem8 = new Promise(async (resolve, reject) => {
          //   // const stdat = await fetch("https://cdn-api.co-vin.in/api/v2/admin/location/states");
          //   const stdat = await fetch(url8);
          //   resolve(stdat);
          // });
          // recordPromisem8
          // .then((response)=>{
          //   // console.log(data.json());
          //   return response.json();
          // }).then((dt)=>{
          //   // console.log(dt.data);
          //   stadat="";
          //   stadat = dt.data;
          //   var table = document.getElementById('modalDataTable1');
          //   let hdr = `<tr class="modalDataDc">
          //   <th>Debit Card Number</th>
          //   <th>Daily Limit</th>
          //   <th>Card Status</th>
          //   <th>Last Used Date</th>
          //   </tr>`;
          //   table.innerHTML += hdr;
          //   for (var i = 0; i < stadat.length; i++){
          //     var row = `<tr>
          //             <td>${stadat[i].id}</td>
          //             <td>${stadat[i].first_name}</td>
          //             <td>${stadat[i].last_name}</td>
          //             <td>${stadat[i].email}</td>
          //           </tr>`
          //     table.innerHTML += row
          //   }
          // })
        }
        span.onclick = () => {
          modal.style.display = "none";
          document.getElementById('chequebook_btn').style.display = 'none !important';
          document.getElementById('debitcard_btn').style.display = 'block';
          $("#modalDataTable1 tr").remove();
        }
        window.onclick = (event) => {
          if (event.target == modal) {
            modal.style.display = "none";
            document.getElementById('chequebook_btn').style.display = 'none !important';
            document.getElementById('debitcard_btn').style.display = 'block';
            $("#modalDataTable1 tr").remove();
          }
        }    
      }
      else if(eleid[i]=="ctdbtcd")
      {
        document.getElementById('accountdropdown').style.display="none !important";
        // console.log("Debit Card");
        document.getElementById(eleid[i]).onclick = () => {
          //hit liabilities module and fetch all the account numbers of current account & savings account
          ZOHO.CRM.API.searchRecord({Entity:"Liabilities1",Type:"criteria",Query:"(Customer_Name:equals:"+rid+")"}).then((data)=>{
            console.log("liabilities are",data);
            if(data.info.count==0)
            {
              document.getElementById('membership').innerHTML='<option selected>No accounts associated</option>';
            }
            else
            {
             let accounts=data.data;
             let flag=false;
             let options=``;
             for(let i=0;i<accounts.length;i++)
              {
                if(accounts[i].A_c_Type=="Current" || accounts[i].A_c_Type=="Saving")
                {
                  if(!flag)
                  {
                    options+=`<option selected val="${accounts[i].Name}">${accounts[i].Name}</option>`;
                  }
                  else
                  {
                    options+=`<option val="${accounts[i].Name}">${accounts[i].Name}</option>`;
                  }
                }
              }
              document.getElementById('membership').innerHTML=options;

            }

          }).catch((err)=>{console.log("Error in getting associated account numbers",err);document.getElementById('membership').innerHTML="<option val='FF'>No accounts available</option>";})
          document.getElementById('accountdropdown').style.display="block";

          modal.style.display = "block";

          
          //API URL Assignment and Parameters Setting
          // var url8 = new URL("https://reqres.in/api/users"); 
          // // var url = new URL("https://cdn-api.co-vin.in/api/v2/admin/location/states");
          // var params8 = {page:1};
          // url8.search = new URLSearchParams(params8).toString();
          // var recordPromisem8 = new Promise(async (resolve, reject) => {
          //   // const stdat = await fetch("https://cdn-api.co-vin.in/api/v2/admin/location/states");
          //   const stdat = await fetch(url8);
          //   resolve(stdat);
          // });
          // recordPromisem8
          // .then((response)=>{
          //   // console.log(data.json());
          //   return response.json();
          // }).then((dt)=>{
          //   // console.log(dt.data);
          //   stadat="";
          //   stadat = dt.data;
          //   var table = document.getElementById('modalDataTable1');
          //   let hdr = `<tr class="modalDataDc">
          //   <th>Debit Card Number</th>
          //   <th>Daily Limit</th>
          //   <th>Card Status</th>
          //   <th>Last Used Date</th>
          //   </tr>`;
          //   table.innerHTML += hdr;
          //   for (var i = 0; i < stadat.length; i++){
          //     var row = `<tr>
          //             <td>${stadat[i].id}</td>
          //             <td>${stadat[i].first_name}</td>
          //             <td>${stadat[i].last_name}</td>
          //             <td>${stadat[i].email}</td>
          //           </tr>`
          //     table.innerHTML += row
          //   }
          // })
        }
        span.onclick = () => {
          modal.style.display = "none";
          
          document.getElementById('chequebook_btn').style.display = 'none !important';
          document.getElementById('debitcard_btn').style.display = 'block';
          $("#modalDataTable1 tr").remove();
        }
        window.onclick = (event) => {
          if (event.target == modal) {
            modal.style.display = "none";
            $("#modalDataTable1 tr").remove();
          }
        }
      }
      else if(eleid[i]=="ctsmsbk")
      {
        document.getElementById('accountdropdown').style.display="none !important";
        console.log("SMS Banking");
        document.getElementById(eleid[i]).onclick = () => {
          modal.style.display = "block";
          //API URL Assignment and Parameters Setting
          var url9 = new URL("https://reqres.in/api/users"); 
          // var url = new URL("https://cdn-api.co-vin.in/api/v2/admin/location/states");
          var params9 = {page:1};
          url9.search = new URLSearchParams(params9).toString();
          var recordPromisem9 = new Promise(async (resolve, reject) => {
            // const stdat = await fetch("https://cdn-api.co-vin.in/api/v2/admin/location/states");
            const stdat = await fetch(url9);
            resolve(stdat);
          });
          recordPromisem9
          .then((response)=>{
            // console.log(data.json());
            return response.json();
          }).then((dt)=>{
            // console.log(dt.data);
            stadat="";
            stadat = dt.data;
            var table = document.getElementById('modalDataTable1');
            let hdr = `<tr class="modalDataLUd">
            <th>Last Used Date</th>
            </tr>`;
            table.innerHTML += hdr;
            for (var i = 0; i < stadat.length; i++){
              var row = `<tr>
                      <td>${stadat[i].id}</td>
                    </tr>`
              // table.innerHTML += row
            }
            table.innerHTML += `<tr>
            <td>This service is not available yet</td>
          </tr>`;
          })
        }
        span.onclick = () => {
          modal.style.display = "none";
          $("#modalDataTable1 tr").remove();
        }
        window.onclick = (event) => {
          if (event.target == modal) {
            modal.style.display = "none";
            $("#modalDataTable1 tr").remove();
          }
        }
      }
      else if(eleid[i]=="ctgtbpd")
      {
        document.getElementById('accountdropdown').style.display="none !important";
        console.log("Govt BP");
        document.getElementById(eleid[i]).onclick = () => {
          modal.style.display = "block";
          //API URL Assignment and Parameters Setting
          var url10 = new URL("https://reqres.in/api/users"); 
          // var url = new URL("https://cdn-api.co-vin.in/api/v2/admin/location/states");
          var params10 = {page:1};
          url10.search = new URLSearchParams(params10).toString();
          var recordPromisem10 = new Promise(async (resolve, reject) => {
            // const stdat = await fetch("https://cdn-api.co-vin.in/api/v2/admin/location/states");
            const stdat = await fetch(url10);
            resolve(stdat);
          });
          recordPromisem10
          .then((response)=>{
            // console.log(data.json());
            return response.json();
          }).then((dt)=>{
            // console.log(dt.data);
            stadat="";
            stadat = dt.data;
            var table = document.getElementById('modalDataTable1');
            let hdr = `<tr class="modalDataS">
            <th>Sol Id</th>
            <th>Branch</th>
            <th>Account Number</th>
            <th>Maturity Date</th>
            <th>Balance Details</th>
            <th>Maturity Amount</th>
            <th>Nominee</th>
            </tr>`;
            table.innerHTML += hdr;
            for (var i = 0; i < stadat.length; i++){
              var row = `<tr>
                      <td>${stadat[i].id}</td>
                      <td>${stadat[i].first_name}</td>
                      <td>${stadat[i].last_name}</td>
                      <td>${stadat[i].email}</td>
                      <td>${stadat[i].first_name}</td>
                      <td>${stadat[i].last_name}</td>
                      <td>${stadat[i].email}</td>
                    </tr>`
              // table.innerHTML += row
            }
            table.innerHTML += `<tr>
            <td>This service is not available yet</td>
          </tr>`;
          })
        }
        span.onclick = () => {
          modal.style.display = "none";
          $("#modalDataTable1 tr").remove();
        }
        window.onclick = (event) => {
          if (event.target == modal) {
            modal.style.display = "none";
            $("#modalDataTable1 tr").remove();
          }
        }
      }
      else if(eleid[i]=="ctmtfd")
      {
        document.getElementById('accountdropdown').style.display="none !important";
        console.log("Mutual Fund");
        document.getElementById(eleid[i]).onclick = () => {
          modal.style.display = "block";
          //API URL Assignment and Parameters Setting
          var url11 = new URL("https://reqres.in/api/users"); 
          // var url = new URL("https://cdn-api.co-vin.in/api/v2/admin/location/states");
          var params11 = {page:1};
          url11.search = new URLSearchParams(params11).toString();
          var recordPromisem11 = new Promise(async (resolve, reject) => {
            // const stdat = await fetch("https://cdn-api.co-vin.in/api/v2/admin/location/states");
            const stdat = await fetch(url11);
            resolve(stdat);
          });
          recordPromisem11
          .then((response)=>{
            // console.log(data.json());
            return response.json();
          }).then((dt)=>{
            // console.log(dt.data);
            stadat="";
            stadat = dt.data;
            var table = document.getElementById('modalDataTable1');
            let hdr = `<tr class="modalDataF">
            <th>Folio Number</th>
            <th>Product</th>
            <th>NAV</th>
            <th>Unit Holdings</th>
            <th>Redemable Unit</th>
            </tr>`;
            table.innerHTML += hdr;
            for (var i = 0; i < stadat.length; i++){
              var row = `<tr>
                      <td>${stadat[i].id}</td>
                      <td>${stadat[i].first_name}</td>
                      <td>${stadat[i].last_name}</td>
                      <td>${stadat[i].email}</td>
                      <td>${stadat[i].first_name}</td>
                    </tr>`
              // table.innerHTML += row
            }
            table.innerHTML += `<tr>
            <td>This service is not available yet</td>
          </tr>`;
          })
        }
        span.onclick = () => {
          modal.style.display = "none";
          $("#modalDataTable1 tr").remove();
        }
        window.onclick = (event) => {
          if (event.target == modal) {
            modal.style.display = "none";
            $("#modalDataTable1 tr").remove();
          }
        }
      }
      else if(eleid[i]=="ctlfinc")
      {
        document.getElementById('accountdropdown').style.display="none !important";
        console.log("Life Insurance");
        document.getElementById(eleid[i]).onclick = () => {
          modal.style.display = "block";
          //API URL Assignment and Parameters Setting
          var url12 = new URL("https://reqres.in/api/users"); 
          // var url = new URL("https://cdn-api.co-vin.in/api/v2/admin/location/states");
          var params12 = {page:1};
          url12.search = new URLSearchParams(params12).toString();
          var recordPromisem12 = new Promise(async (resolve, reject) => {
            // const stdat = await fetch("https://cdn-api.co-vin.in/api/v2/admin/location/states");
            const stdat = await fetch(url12);
            resolve(stdat);
          });
          recordPromisem12
          .then((response)=>{
            // console.log(data.json());
            return response.json();
          }).then((dt)=>{
            // console.log(dt.data);
            stadat="";
            stadat = dt.data;
            var table = document.getElementById('modalDataTable1');
            let hdr = `<tr class="modalDataP">
            <th>Policy Number</th>
            <th>Policy Type</th>
            <th>Maturity Date</th>
            <th>Maturity Amount</th>
            <th>Nominee</th>
            </tr>`;
            table.innerHTML += hdr;
            for (var i = 0; i < stadat.length; i++){
              var row = `<tr>
                      <td>${stadat[i].id}</td>
                      <td>${stadat[i].first_name}</td>
                      <td>${stadat[i].last_name}</td>
                      <td>${stadat[i].email}</td>
                      <td>${stadat[i].first_name}</td>
                    </tr>`
              // table.innerHTML += row
            }
            table.innerHTML += `<tr>
            <td>This service is not available yet</td>
          </tr>`;
          })
        }
        span.onclick = () => {
          modal.style.display = "none";
          $("#modalDataTable1 tr").remove();
        }
        window.onclick = (event) => {
          if (event.target == modal) {
            modal.style.display = "none";
            $("#modalDataTable1 tr").remove();
          }
        }
      }
      else if(eleid[i]=="cthtinc")
      {
        document.getElementById('accountdropdown').style.display="none !important";
        // console.log("Health Insurance");
        document.getElementById(eleid[i]).onclick = () => {
          modal.style.display = "block";
          //API URL Assignment and Parameters Setting
          var url13 = new URL("https://reqres.in/api/users"); 
          // var url = new URL("https://cdn-api.co-vin.in/api/v2/admin/location/states");
          var params13 = {page:1};
          url13.search = new URLSearchParams(params13).toString();
          var recordPromisem13 = new Promise(async (resolve, reject) => {
            // const stdat = await fetch("https://cdn-api.co-vin.in/api/v2/admin/location/states");
            const stdat = await fetch(url13);
            resolve(stdat);
          });
          recordPromisem13
          .then((response)=>{
            // console.log(data.json());
            return response.json();
          }).then((dt)=>{
            // console.log(dt.data);
            stadat="";
            stadat = dt.data;
            var table = document.getElementById('modalDataTable1');
            let hdr = `<tr class="modalDataP">
            <th>Policy Number</th>
            <th>Policy Type</th>
            <th>Maturity Date</th>
            <th>Maturity Amount</th>
            <th>Nominee</th>
            </tr>`;
            table.innerHTML += hdr;
            for (var i = 0; i < stadat.length; i++){
              var row = `<tr>
                      <td>${stadat[i].id}</td>
                      <td>${stadat[i].first_name}</td>
                      <td>${stadat[i].last_name}</td>
                      <td>${stadat[i].email}</td>
                      <td>${stadat[i].first_name}</td>
                    </tr>`
              // table.innerHTML += row
            }
            table.innerHTML += `<tr>
            <td>This service is not available yet</td>
          </tr>`;
          })
        }
        span.onclick = () => {
          modal.style.display = "none";
          $("#modalDataTable1 tr").remove();
        }
        window.onclick = (event) => {
          if (event.target == modal) {
            modal.style.display = "none";
            $("#modalDataTable1 tr").remove();
          }
        }
      }
      else if(eleid[i]=="ctgninc")
      {
        document.getElementById('accountdropdown').style.display="none !important";
        // console.log("General Insurance");
        document.getElementById(eleid[i]).onclick = () => {
          modal.style.display = "block";
          //API URL Assignment and Parameters Setting
          var url14 = new URL("https://reqres.in/api/users"); 
          // var url = new URL("https://cdn-api.co-vin.in/api/v2/admin/location/states");
          var params14 = {page:1};
          url14.search = new URLSearchParams(params14).toString();
          var recordPromisem14 = new Promise(async (resolve, reject) => {
            // const stdat = await fetch("https://cdn-api.co-vin.in/api/v2/admin/location/states");
            const stdat = await fetch(url14);
            resolve(stdat);
          });
          recordPromisem14
          .then((response)=>{
            // console.log(data.json());
            return response.json();
          }).then((dt)=>{
            // console.log(dt.data);
            stadat="";
            stadat = dt.data;
            var table = document.getElementById('modalDataTable1');
            let hdr = `<tr class="modalDataP">
            <th>Policy Number</th>
            <th>Policy Type</th>
            <th>Maturity Date</th>
            <th>Maturity Amount</th>
            <th>Nominee</th>
            </tr>`;
            table.innerHTML += hdr;
            for (var i = 0; i < stadat.length; i++){
              var row = `<tr>
                      <td>${stadat[i].id || "-"}</td>
                      <td>${stadat[i].first_name || "-"}</td>
                      <td>${stadat[i].last_name || "-"}</td>
                      <td>${stadat[i].email || "-"}</td>
                      <td>${stadat[i].first_name || "-"}</td>
                    </tr>`
              // table.innerHTML += row
            }
            table.innerHTML += `<tr>
            <td>This service is not available yet</td>
          </tr>`;
          })
        }
        span.onclick = () => {
          modal.style.display = "none";
          $("#modalDataTable1 tr").remove();
        }
        window.onclick = (event) => {
          if (event.target == modal) {
            modal.style.display = "none";
            $("#modalDataTable1 tr").remove();
          }
        }
      }
      else
      {
        console.log("Else");
      }
    }
    else
    {
      document.getElementById(eleid[i]).innerHTML="Not Availed";
      // csusSvc.push(document.getElementById(eleid[i]).title);

      csuslistElements += `<li> ` + document.getElementById(eleid[i]).title +  ` </li>`

      document.getElementById(eleid[i]).style.color="red";
      document.getElementById(eleid[i]).style.textDecoration ="none";
      document.getElementById(eleid[i]).style.pointerEvents ="none";
    }
    
    // console.log(csuslistElements);
  }
  csuslistElements += `</ol>`;
  document.getElementById("crusPanel").innerHTML = csuslistElements;
}).catch((error)=>{ console.log(error); })

ZOHO.CRM.API.getRelatedRecords({Entity:"Contacts",RecordID:rid, RelatedList:"Deals"})
.then((data) => { 
  stadat = data.data;

  buildTable(stadat);
  buildTablee(stadat);

  function buildTable(data){
    if(document.getElementById('tbloprrdt')!=null){
      var table = document.getElementById('tbloprrdt')
      // table.style.display = "block";
      for (var i = 0; i < data.length; i++){
        if(data[i].Status!="Closed" && data[i].Product1!="Credit Card"){
        var row = `<tr  class="opdat" id="${data[i].id}" onclick="oprClk(this)">
                <td>${data[i].id || "-"}</td>
                <td>${data[i].Deal_Name || "-"}</td>
                <td>${data[i].Amount || "-"}</td>
                <td>${data[i].Closing_Date || "-"}</td>
                        <td>${data[i].Account_Number || "-"}</td>
                <td>${data[i].Product1 || "-"}</td>
                <td>${data[i].Branch || "-"}</td>
                        <td>${data[i].Status || "-"}</td>
              </tr>`
        table.innerHTML += row
        }
      }
    }
  }
  
  function buildTablee(data){
    if(document.getElementById('tbloprrdtb')!=null){
      var table = document.getElementById('tbloprrdtb')

      for (var i = 0; i < data.length; i++){
        if(data[i].Status=="Closed" || data[i].Product1=="Credit Card"){
        var row = `<tr id="${data[i].id}" onclick="oprClk(this)">
                  <td>${data[i].id || "-"}</td>
                <td>${data[i].Deal_Name || "-"}</td>
                <td>${data[i].Amount || "-"}</td>
                <td>${data[i].Closing_Date || "-"}</td>
                        <td>${data[i].Account_Number || "-"}</td>
                <td>${data[i].Product1 || "-"}</td>
                <td>${data[i].Branch || "-"}</td>
                        <td>${data[i].Status || "-"}</td>
                  </tr>`
        table.innerHTML += row
        }

      }
    }
  }
  
}
).catch((error)=>{ console.log(error); })
});

const oprClk = (x) => {
// console.log(x.innerHTML);
var vid = x.id;
console.log(vid);
var recordPromiseoc = new Promise(async (resolve, reject) => {
await ZOHO.embeddedApp.init();
var recordsoc = await ZOHO.CRM.API.getRelatedRecords({Entity:"Contacts",RecordID:rid, RelatedList:"Deals"});
//ZOHO.CRM.API.getRecord({Entity:"Contacts",RecordID:"246578000000196195"});
resolve(recordsoc);
});

recordPromiseoc
.then((dta)=>{
dta=dta.data;
modal.style.display = "block";
var table = document.getElementById('modalDataTable1z');
for(var l=0; l<dta.length; l++){
if(dta[l].id==vid){
let hdr = `<tr>
            <th colspan="6">Account Details</th>
            </tr>`;
table.innerHTML += hdr;
var row = `<tr>
            <td class="modalAccountTbl1">Account Number</td>
            <td>${dta[l].Account_Number || "-"}</td>
            <td class="modalAccountTbl1">Sol Id</td>
            <td>${dta[l].Sol_ID || "-"}</td>
            <td class="modalAccountTbl1">Branch</td>
            <td>${dta[l].Branch || "-"}</td>
           </tr>
           <tr>
            <td class="modalAccountTbl1">Account Status</td>
            <td>${dta[l].Status || "-"}</td>
            <td class="modalAccountTbl1">Holding Type</td>
            <td>${dta[l].Holding_Type || "-"}</td>
            <td class="modalAccountTbl1">Facility Type</td>
            <td>${dta[l].Facility_Type || "-"}</td>
           </tr>
           <tr>
            <td class="modalAccountTbl1">Account Scheme</td>
            <td>${dta[l].Scheme_Name || "-"}</td>
            <td class="modalAccountTbl1">A/C Open Date</td>
            <td>${dta[l].Opened_Date || "-"}</td>
            <td class="modalAccountTbl1">Maturity Date</td>
            <td>${dta[l].Maturity_Date || "-"}</td>
           </tr>
           <tr>
            <td class="modalAccountTbl1">Deposit Amount</td>
            <td>${dta[l].Amount || "-"}</td>
            <td class="modalAccountTbl1">Reason Of Lien</td>
            <td>${dta[l].Lien_Reaosn || "-"}</td>
            <td class="modalAccountTbl1">Reason Of Freeze</td>
            <td>${dta[l].Freeze_Reason || "-"}</td>
           </tr>
           <tr>
            <td class="modalAccountTbl1">Currency</td>
            <td>${dta[l].Currency || "-"}</td>
            <td class="modalAccountTbl1">Sanctioned Limit</td>
            <td>${dta[l].Sanctioned_Limit || "-"}</td>
            <td class="modalAccountTbl1">Available Limit</td>
            <td>${dta[l].Available_Limit || "-"}</td>
           </tr>
           <tr>
            <td class="modalAccountTbl1">Current Balance</td>
            <td>${dta[l].Current_Balance || "-"}</td>
            <td class="modalAccountTbl1">EMI Interest Receivable</td>
            <td>${dta[l].EMI_Interest_Receivable || "-"}</td>
            <td class="modalAccountTbl1">Interest Rate</td>
            <td>${dta[l].Interest_Rate || "-"}</td>
           </tr>
           <tr>
            <td class="modalAccountTbl1">Stresse Category</td>
            <td>${dta[l].Stresse_Category || "-"}</td>
            <td class="modalAccountTbl1">Reason For Stress</td>
            <td>${dta[l].Reason_For_Stress || "-"}</td>
            <td class="modalAccountTbl1">Date Of SMA/NPA</td>
            <td>${dta[l].Date_Of_SMANPA || "-"}</td>
           </tr>
           <tr>
            <td class="modalAccountTbl1">Critical Amount</td>
            <td>${dta[l].Critical_Amount || "-"}</td>
            <td class="modalAccountTbl1">Next Due Date</td>
            <td>${dta[l].Next_Due_Date || "-"}</td>
            <td class="modalAccountTbl1">Next Due Amount</td>
            <td>${dta[l].Next_Due_Amount || "-"}</td>
           </tr>`
table.innerHTML += row;
}
}
span.onclick = () => {
modal.style.display = "none";
$("#modalDataTable1 tr").remove();
$("#modalDataTable1z tr").remove();
}
window.onclick = (event) => {
if (event.target == modal) {
modal.style.display = "none";
$("#modalDataTable1 tr").remove();
$("#modalDataTable1z tr").remove();
}
} 
})
}
//////////////////-------------------///////////////

fetch("https://reqres.in/api/users?page=2")
.then(function(dt){
    return dt.json();
}).then((data) => {
      // console.log(data);
      data = data.data;
      // var table = document.getElementById('tblbgrdtb');
      // var table1 = document.getElementById('tbllocrdtb');
      // var table2 = document.getElementById('tblfcrdtb');

      // var table3 = document.getElementById('tbldepdtbcs');
      // var table4 = document.getElementById('tbldepdtbtd');
      // var table5 = document.getElementById('tbladvdtb');

      var table6 = document.getElementById('tbltkrdtbtkk');
      var table7 = document.getElementById('tblcprdtbcpp');
      var table8 = document.getElementById('tblleadtabb');

      for (var i = 0; i < data.length; i++){
        // if(data[i].Status=="Closed" || data[i].Product1=="Credit Card"){
        // var row = `<tr id="${data[i].id}" onclick="bgnClk(this)">
        //           <td class="tabdat" colspan=2>${data[i].id+4598 || "-"}</td>
        //           <td class="tabdat" colspan=2>${data[i].id+","+90957 || "-"}</td>
        //           <td class="tabdat" colspan=2>financial bank guarantee</td>
        //           <td class="tabdat" colspan=2>${data[i].last_name || "-"}</td>
        //           <td class="tabdat" colspan=2>Indian Rupee</td>
        //           </tr>`
        // var row1 = `<tr id="${data[i].id}" onclick="locClk(this)">
        // <td class="tabdat" colspan=2>${data[i].id+899 || "-"}</td>
        // <td class="tabdat" colspan=2>${data[i].id+","+98879 || "-"}</td>
        // <td class="tabdat" colspan=2>${data[i].first_name || "-"}</td>
        // <td class="tabdat" colspan=2>01-01-2023</td>
        // <td class="tabdat" colspan=2>${data[i].avatar || "-"}</td>
        // </tr>`
        // var row2 = `<tr id="${data[i].id}" onclick="fcrClk(this)">
        // <td class="tabdat" colspan=2>${data[i].id || "-"}</td>
        // <td class="tabdat" colspan=2>${data[i].email || "-"}</td>
        // <td class="tabdat" colspan=2>${data[i].first_name || "-"}</td>
        // <td class="tabdat" colspan=2>${data[i].last_name || "-"}</td>
        // <td class="tabdat" colspan=2>${data[i].avatar || "-"}</td>
        // </tr>`
        // var row3 = `<tr id="${data[i].id}" onclick="casaClk(this)">
        // <td class="tabdat" colspan=2>67${data[i].id+87876987 || "-"}</td>
        // <td class="tabdat" colspan=2>YES</td>
        // <td class="tabdat" colspan=2>Kisan Vikas Patra</td>
        // <td class="tabdat" colspan=2>Savings A/C</td>
        // <td class="tabdat" colspan=2><button id="fundbasedreloadButton" onclick="fundbasedReload()">Refresh!</button></td>
        // </tr>`
        // var row4 = `<tr id="${data[i].id}" onclick="tdClk(this)">
        // <td class="tabdat" colspan=2>${data[i].id+624526766 || "-"}</td>
        // <td class="tabdat" colspan=2>NO</td>
        // <td class="tabdat" colspan=2>Sukanya Samridhhi Scheme</td>
        // <td class="tabdat" colspan=2>Current A/C</td>
        // <td class="tabdat" colspan=2><button id="fundbasedreloadButton" onclick="fundbasedReload()">Refresh!</button></td>
        // </tr>`
        // var row5 = `<tr id="${data[i].id}" onclick="advClk(this)">
        // <td class="tabdat" colspan=2>${data[i].id+767656676 || "-"}</td>
        // <td class="tabdat" colspan=2>Pending</td>
        // <td class="tabdat" colspan=2>Senior Citizen Saving Scheme</td>
        // <td class="tabdat" colspan=2>Salary Account</td>
        // <td class="tabdat" colspan=2><button id="fundbasedreloadButton" onclick="fundbasedReload()">Refresh!</button></td>
        // </tr>`
        var row6 = `<tr id="${data[i].id}" onclick="tkClk(this)">
        <td class="tabdat" colspan=2>${data[i].id || "-"}</td>
        <td class="tabdat" colspan=2>${data[i].email || "-"}</td>
        <td class="tabdat" colspan=2>${data[i].first_name || "-"}</td>
        <td class="tabdat" colspan=2>${data[i].last_name || "-"}</td>
        <td class="tabdat" colspan=2>${data[i].avatar || "-"}</td>
        </tr>`
        var row7 = `<tr id="${data[i].id}" onclick="cpClk(this)">
        <td class="tabdat" colspan=2>${data[i].id || "-"}</td>
        <td class="tabdat" colspan=2>${data[i].email || "-"}</td>
        <td class="tabdat" colspan=2>${data[i].first_name || "-"}</td>
        </tr>`
        var row8 = `<tr id="${data[i].id}" onclick="leadClk(this)">
<td class="tabdat" colspan=2>${data[i].id || "-"}</td>
<td class="tabdat" colspan=2>Open</td>
<td class="tabdat" colspan=2>Website</td>
<td class="tabdat" colspan=2>${data[i].first_name || "-"}</td>
<td class="tabdat" colspan=2>03-07-2022</td>
        </tr>`

        // table.innerHTML += row
        // table1.innerHTML += row1
        // table2.innerHTML += row2

        // table3.innerHTML += row3
        // table4.innerHTML += row4
        // table5.innerHTML += row5

        table6.innerHTML += row6
        table7.innerHTML += row7
        table8.innerHTML += row8
        // }

      }
}).catch((error) => console.log(error));

function casaClk(bgn, index) {
  var casadat = casa_[index];
  console.log(casa_);
  if (casadat.Date_2 != null) {
    casadat.Date_2 = format_date(casadat.Date_2.split("T")[0]);
  }
  document.getElementById("accountdropdown").style.display = "none";
  if (flag == 0) modal.style.display = "block";
  flag = 0;
  var table = document.getElementById("modalDataTable1z");
  let hdr = `<tr>
                        <th colspan=2>CASA</th>
                        </tr>`;
  table.innerHTML += hdr;
  var row = `<tr>
      <td class="tabdatt">Account No.</td>
      <td class="tabdat" id="ctcsacn">${casadat.Name || "-"}</td>
    </tr>
    <tr>
      <td class="tabdatt">ACID</td>
      <td class="tabdat" id="ctcsaco">${casadat.ACID || "-"}</td>
    </tr>
    <tr>
      <td class="tabdatt">Account Status</td>
      <td class="tabdat" id="ctcssch">${casadat.Single_Line_8 || "-"}</td>
    </tr>
    <tr>
      <td class="tabdatt">Branch</td>
      <td class="tabdat" id="ctcsshc">${casadat.Single_Line_9 || "-"}</td>
    </tr>
    <tr>
      <td class="tabdatt">Balance Currency</td>
      <td class="tabdat" id="ctcsact">${casadat.Balance_Currency || "-"}</td>
    </tr>
    <tr>
      <td class="tabdatt">Currency Amount</td>
      <td class="tabdat" id="ctcsast">${casadat.Currency_Amount || "-"}</td>
    </tr>
    <tr>
      <td class="tabdatt">A/c Open Date</td>
      <td class="tabdat" id="ctcsybl">${casadat.Date_2 || "-"}</td>
    </tr>
    <tr>
      <td class="tabdatt">Mode of Operation (Single/Joint)</td>
      <td class="tabdat" id="ctcsbrch">${
        casadat.Mode_of_Operation_Single_Joint || "-"
      }</td>
    </tr>`;
  table.innerHTML += row;
  span.onclick = () => {
    modal.style.display = "none";
    $("#modalDataTable1 tr").remove();
    $("#modalDataTable1z tr").remove();
  };
  window.onclick = (event) => {
    if (event.target == modal) {
      modal.style.display = "none";
      $("#modalDataTable1 tr").remove();
      $("#modalDataTable1z tr").remove();
    }
  };
}

function tdClk(bgn, index) {
  var tdddat = term_deposit[index];
  console.log(tdddat.Date_2, "Date");
  if (tdddat.Date_2 != null) {
    tdddat.Date_2 = format_date(tdddat.Date_2.split("T")[0]);
  }
  document.getElementById("accountdropdown").style.display = "none";
  if (flag == 0) modal.style.display = "block";
  flag = 0;
  var table = document.getElementById("modalDataTable1z");
  let hdr = `<tr>
                        <th colspan=2>Term Deposit</th>
                        </tr>`;
  table.innerHTML += hdr;
  var row = `<tr>
  <td class="tabdatt">Account No.</td>
  <td class="tabdat" id="ctcsacn">${tdddat.Name || "-"}</td>
</tr>
<tr>
  <td class="tabdatt">ACID</td>
  <td class="tabdat" id="ctcsaco">${tdddat.ACID || "-"}</td>
</tr>
<tr>
  <td class="tabdatt">Account Status</td>
  <td class="tabdat" id="ctcssch">${tdddat.Single_Line_8 || "-"}</td>
</tr>
<tr>
  <td class="tabdatt">Branch</td>
  <td class="tabdat" id="ctcsshc">${tdddat.Single_Line_9 || "-"}</td>
</tr>
<tr>
  <td class="tabdatt">Balance Currency</td>
  <td class="tabdat" id="ctcsact">${tdddat.Balance_Currency || "-"}</td>
</tr>
<tr>
  <td class="tabdatt">Currency Amount</td>
  <td class="tabdat" id="ctcsast">${tdddat.Currency_Amount || "-"}</td>
</tr>
<tr>
  <td class="tabdatt">Deposit Period</td>
  <td class="tabdat" id="ctcsybl">${tdddat.Number_2 || "-"}</td>
</tr>
<tr>
  <td class="tabdatt">A/c Open Date</td>
  <td class="tabdat" id="ctcsybl">${tdddat.Date_2 || "-"}</td>
</tr>
<tr>
  <td class="tabdatt">Mode of Operation (Single/Joint)</td>
  <td class="tabdat" id="ctcsbrch">${
    tdddat.Mode_of_Operation_Single_Joint || "-"
  }</td>
</tr>`;
  table.innerHTML += row;
  span.onclick = () => {
    modal.style.display = "none";
    $("#modalDataTable1 tr").remove();
    $("#modalDataTable1z tr").remove();
  };
  window.onclick = (event) => {
    if (event.target == modal) {
      modal.style.display = "none";
      $("#modalDataTable1 tr").remove();
      $("#modalDataTable1z tr").remove();
    }
  };
}

function advClk(bgn, index) {
  var addat = advances_[index];
  if (addat.Date_1 != null) {
    addat.Date_1 = format_date(addat.Date_1.split("T")[0]);
  }if (addat.Date_Time_2 != null) {
    addat.Date_Time_2 = format_date(addat.Date_Time_2.split("T")[0]);
  }
  document.getElementById("accountdropdown").style.display = "none";
  if (flag == 0) modal.style.display = "block";
  flag = 0;
  var table = document.getElementById("modalDataTable1z");
  let hdr = `<tr>
                        <th colspan=2>Advances</th>
                        </tr>`;
  table.innerHTML += hdr;
  var row = `<td class="tabdatt">Balance Currency</td>
      <td class="tabdat" id="ctadvacn">${addat.Balance_Currency || "-"}</td>
    </tr>
    <tr>
      <td class="tabdatt">Balance</td>
      <td class="tabdat" id="ctadvaco">${addat.Number_1 || "-"}</td>
    </tr>
    <tr>
      <td class="tabdatt">SOL ID</td>
      <td class="tabdat" id="ctadvsch">${addat.Single_Line_3 || "-"}</td>
    </tr>
    <tr>
      <td class="tabdatt">Total Disbursement in Amount</td>
      <td class="tabdat" id="ctadvshc">${
        addat.Total_Disbursement_in_Amount || "-"
      }</td>
    </tr>
    <tr>
      <td class="tabdatt">Sanctioned Amount</td>
      <td class="tabdat" id="ctadvact">${addat.Sanctioned_Amount || "-"}</td>
    </tr>
    <tr>
      <td class="tabdatt">Account Status</td>
      <td class="tabdat" id="ctadvast">${addat.Single_Line_11 || "-"}</td>
    </tr>
    <tr>
      <td class="tabdatt">Loan Period</td>
      <td class="tabdat" id="ctadvybl">${addat.Number_2 || "-"}</td>
    </tr>
    <tr>
      <td class="tabdatt">Branch</td>
      <td class="tabdat" id="ctadvbrch">${addat.Single_Line_13 || "-"}</td>
    </tr>
    <tr>
      <td class="tabdatt">Interest Rate</td>
      <td class="tabdat" id="ctadvsid">${addat.Single_Line_14 || "-"}</td>
    </tr>
    <tr>
      <td class="tabdatt">EMI Amount</td>
      <td class="tabdat" id="ctadvcrcy">${addat.EMI_Amount || "-"}</td>
    </tr>
    <tr>
      <td class="tabdatt">Overdue Amount</td>
      <td class="tabdat" id="ctadvscam">${addat.Overdue_Amount || "-"}</td>
    </tr>
    <tr>
      <td class="tabdatt">Overdue Since (Date)</td>
      <td class="tabdat" id="ctadvpram">${addat.Date_1 || "-"}</td>
    </tr>
    <tr>
      <td class="tabdatt">Client Sector</td>
      <td class="tabdat" id="ctadvsecam">${addat.Single_Line_16 || "-"}</td>
    </tr>
    <tr>
      <td class="tabdatt">Amount Recovered</td>
      <td class="tabdat" id="ctadvtdam">${addat.Decimal_3 || "-"}</td>
    </tr>
    <tr>
      <td class="tabdatt">Account Close Date</td>
      <td class="tabdat" id="ctadvinrt">${addat.Date_Time_2 || "-"}</td>
    </tr>`;
  table.innerHTML += row;
  span.onclick = () => {
    modal.style.display = "none";
    $("#modalDataTable1 tr").remove();
    $("#modalDataTable1z tr").remove();
  };
  window.onclick = (event) => {
    if (event.target == modal) {
      modal.style.display = "none";
      $("#modalDataTable1 tr").remove();
      $("#modalDataTable1z tr").remove();
    }
  };
}

function bgnClk(bgn, index) {
  var bgndat = bank_guarantee[index];
  document.getElementById("accountdropdown").style.display = "none";
  modal.style.display = "block";
  var table = document.getElementById("modalDataTable1z");
  let hdr = `<tr>
                        <th colspan=2>Bank Guarantee</th>
                        </tr>`;
  table.innerHTML += hdr;
  console.log(bgndat.BG_No_Bank_Gurantee, "BGN NO...");
  var row = `<tr>
      <td class="tabdatt">Bank Guarantee No.</td>
      <td class="tabdat" id="ctbgbgno">${bgndat.BG_No_Bank_Gurantee || "-"}</td>
    </tr><tr>
      <td class="tabdatt">BG Amount</td>
      <td class="tabdat" id="ctbgbgamt">${bgndat.Amount || "-"}</td>
    </tr>
    <tr>
      <td class="tabdatt">BG Type</td>
      <td class="tabdat" id="ctbgbgtyp">${bgndat.BG_Type || "-"}</td>
    </tr>
    <tr>
      <td class="tabdatt">Expiry Date</td>
      <td class="tabdat" id="ctbgexdt">${bgndat.Expiry_Date || "-"}</td>
    </tr>`;
  table.innerHTML += row;
  span.onclick = () => {
    modal.style.display = "none";
    $("#modalDataTable1 tr").remove();
    $("#modalDataTable1z tr").remove();
  };
  window.onclick = (event) => {
    if (event.target == modal) {
      modal.style.display = "none";
      $("#modalDataTable1 tr").remove();
      $("#modalDataTable1z tr").remove();
    }
  };
}

function locClk(bgn, index) {
var locdat = letter_of_credit[index];
console.log(locdat);
document.getElementById("accountdropdown").style.display = "none !important";
modal.style.display = "block";
var table = document.getElementById("modalDataTable1z");
let hdr = `<tr>
            <th colspan=5>Letter of Credit</th>
            </tr>`;
table.innerHTML += hdr;
var row = `<tr>
<td class="tabdatt">Letter of Credit No.</td>
<td class="tabdat" id="ctbglocn">${
locdat.LC_No_Letter_of_Credit_No || "-"
}</td>
</tr>
<tr>
<td class="tabdatt">Amount</td>
<td class="tabdat" id="ctbglcamt">${locdat.Amount || "-"}</td>
</tr>
<tr>
<td class="tabdatt">Expiry Date</td>
<td class="tabdat" id="ctbglcbfn">${locdat.Expiry_Date || "-"}</td>
</tr>
<tr>
<td class="tabdatt">SOL</td>
<td class="tabdat" id="ctbglccur">${locdat.SOL || "-"}</td>
</tr>`;
table.innerHTML += row;
span.onclick = () => {
modal.style.display = "none";
$("#modalDataTable1 tr").remove();
$("#modalDataTable1z tr").remove();
};
window.onclick = (event) => {
if (event.target == modal) {
modal.style.display = "none";
$("#modalDataTable1 tr").remove();
$("#modalDataTable1z tr").remove();
}
};
}

function fcrClk(bgn, index) {
console.log(bgn, index);
console.log(forward_contracts);
var fcrdat = forward_contracts[index];
document.getElementById("accountdropdown").style.display = "none !important";
modal.style.display = "block";
var table = document.getElementById("modalDataTable1z");
let hdr = `<tr>
            <th colspan=5>Forward Contract</th>
            </tr>`;
table.innerHTML += hdr;
var row = `<tr>
<td class="tabdatt">Forward Contract No.</td>
<td class="tabdat" id="ctbgfcfcn">${fcrdat.Forward_Contract || "-"}</td>
</tr>
<tr>
<td class="tabdatt">Amount</td>
<td class="tabdat" id="ctbgfcctat">${fcrdat.Amount || "-"}</td>
</tr>
<tr>
<td class="tabdatt">Expiry Date</td>
<td class="tabdat" id="ctbgfcosb">${fcrdat.Expiry_Date || "-"}</td>
</tr>
<tr>
<td class="tabdatt">SOL</td>
<td class="tabdat" id="ctbgfcvlto">${fcrdat.SOL || "-"}</td>
</tr>`;
table.innerHTML += row;
span.onclick = () => {
modal.style.display = "none";
$("#modalDataTable1 tr").remove();
$("#modalDataTable1z tr").remove();
};
window.onclick = (event) => {
if (event.target == modal) {
modal.style.display = "none";
$("#modalDataTable1 tr").remove();
$("#modalDataTable1z tr").remove();
}
};
}

function tkClk(bgn){
document.getElementById('accountdropdown').style.display="none !important";
modal.style.display = "block";
var table = document.getElementById('modalDataTable1z');
let hdr = `<tr>
            <th colspan=2>Tickets</th>
            </tr>`;
table.innerHTML += hdr;
var row = `<tr>
<td class="tabdatt">Account No.</td>
<td class="tabdat" id="ctcsacn"></td>
</tr>
<tr>
<td class="tabdatt">A/C Open</td>
<td class="tabdat" id="ctcsaco"></td>
</tr>
<tr>
<td class="tabdatt">Scheme</td>
<td class="tabdat" id="ctcssch"></td>
</tr>
<tr>
<td class="tabdatt">Scheme Code</td>
<td class="tabdat" id="ctcsshc"></td>
</tr>
<tr>
<td class="tabdatt">A/C Type</td>
<td class="tabdat" id="ctcsact"></td>
</tr>
<tr>
<td class="tabdatt">Status</td>
<td class="tabdat" id="ctcsast"></td>
</tr>
<tr>
<td class="tabdatt">Balance as of Yesterday</td>
<td class="tabdat" id="ctcsybl"></td>
</tr>
<tr>
<td class="tabdatt">Branch</td>
<td class="tabdat" id="ctcsbrch"></td>
</tr>
<tr>
<td class="tabdatt">SOL Id</td>
<td class="tabdat" id="ctcssid"></td>
</tr>
<tr>
<td class="tabdatt">Currency</td>
<td class="tabdat" id="ctcscrcy"></td>
</tr>
<tr>
<td class="tabdatt">Lien Amount</td>
<td class="tabdat" id="ctcslam"></td>
</tr>
<tr>
<td class="tabdatt">Average Balance</td>
<td class="tabdat" id="ctcsavbl"></td>
</tr>`
table.innerHTML += row;
span.onclick = () => {
modal.style.display = "none";
$("#modalDataTable1 tr").remove();
$("#modalDataTable1z tr").remove();
}
window.onclick = (event) => {
if (event.target == modal) {
modal.style.display = "none";
$("#modalDataTable1 tr").remove();
$("#modalDataTable1z tr").remove();
}
}
}

function debitnoClk(debit_card){
document.getElementById('accountdropdown').style.display="none !important";
modal2.style.display = "block";
var table = document.getElementById('modalDataTable2z');
let hdr = `<tr>
            <th colspan=2>Debit Card Details</th>
            </tr>`;
table.innerHTML += hdr;
let func_name="DebitCardReq_API";
let params={Cardno:debit_card};
call_crm_function(func_name,params).then((res)=>{
console.log("debit card info is",res);
//
if(res.code == "success")
{
stadat="";
stadat = JSON.parse(res.details.output);
stadat = stadat.data;
console.log("debit card cleansed data",stadat);
let resp=stadat.SuccessOrFailure || "";
console.log("resp is",resp);
console.log(resp);
if(resp == "Y")
{
// var table = document.getElementById('modalDataTable2z');
var row = `<tr>
<td class="tabdatt">Last Used Date</td>
<td class="tabdat" id="ctcslud">${stadat.LastUsedDate}</td>
</tr>
<tr>
<td class="tabdatt">Daily ATM withdrwal Limit</td>
<td class="tabdat" id="ctcsdawl">${cut_leading_zeros(stadat.DailyATMwithdrwalLimit)}</td>
</tr>
<tr>
<td class="tabdatt">Daily POS limit</td>
<td class="tabdat" id="ctcsdpl">${cut_leading_zeros(stadat.DailyPOSlimit)}</td>
</tr>

<tr>
<td class="tabdatt">Channel Enabled For Txn</td>
<td class="tabdat" id="ctcsceft">${stadat.ChannelEnabledForTxn.join(", ")}</td>
</tr>`;
table.innerHTML += row;
}
}
else
{
table.innerHTML=`<tr>
<td class="tabdatt">Something went wrong</td>
</tr>`;
}
//
}).catch((err)=>{table.innerHTML=`<tr>
<td class="tabdatt">Something went wrong</td>
</tr>`;
console.log("Error in fetching debit card info",err);});

span2.onclick = () => {
modal2.style.display = "none";
$("#modalDataTable2z tr").remove();
}
window.onclick = (event) => {
if (event.target == modal2) {
modal2.style.display = "none";
$("#modalDataTable2z tr").remove();
}
}
}

function cpClk(bgn){
document.getElementById('accountdropdown').style.display="none !important";
modal.style.display = "block";
var table = document.getElementById('modalDataTable1z');
let hdr = `<tr>
            <th colspan=2>Campaigns</th>
            </tr>`;
table.innerHTML += hdr;
var row = `<tr>
<td class="tabdatt">Account No.</td>
<td class="tabdat" id="ctcsacn"></td>
</tr>
<tr>
<td class="tabdatt">A/C Open</td>
<td class="tabdat" id="ctcsaco"></td>
</tr>
<tr>
<td class="tabdatt">Scheme</td>
<td class="tabdat" id="ctcssch"></td>
</tr>
<tr>
<td class="tabdatt">Scheme Code</td>
<td class="tabdat" id="ctcsshc"></td>
</tr>
<tr>
<td class="tabdatt">A/C Type</td>
<td class="tabdat" id="ctcsact"></td>
</tr>
<tr>
<td class="tabdatt">Status</td>
<td class="tabdat" id="ctcsast"></td>
</tr>
<tr>
<td class="tabdatt">Balance as of Yesterday</td>
<td class="tabdat" id="ctcsybl"></td>
</tr>
<tr>
<td class="tabdatt">Branch</td>
<td class="tabdat" id="ctcsbrch"></td>
</tr>
<tr>
<td class="tabdatt">SOL Id</td>
<td class="tabdat" id="ctcssid"></td>
</tr>
<tr>
<td class="tabdatt">Currency</td>
<td class="tabdat" id="ctcscrcy"></td>
</tr>
<tr>
<td class="tabdatt">Lien Amount</td>
<td class="tabdat" id="ctcslam"></td>
</tr>
<tr>
<td class="tabdatt">Average Balance</td>
<td class="tabdat" id="ctcsavbl"></td>
</tr>`
table.innerHTML += row;
span.onclick = () => {
modal.style.display = "none";
$("#modalDataTable1 tr").remove();
$("#modalDataTable1z tr").remove();
}
window.onclick = (event) => {
if (event.target == modal) {
modal.style.display = "none";
$("#modalDataTable1 tr").remove();
$("#modalDataTable1z tr").remove();
}
}
}

function leadClk(bgn,ind){
document.getElementById('accountdropdown').style.display="none !important";
modal.style.display = "block";
let selected_lead=leads_results[ind];
let pc="-";
let pc1=selected_lead.Pin_Code;
let pc2;
try
{
pc2=selected_lead.pin_code_lookup.name;

}
catch(err)
{
console.log("pincode lookup is not present in the record",err);
pc2=null;
}
if(pc1!=null)
{
pc=pc1;
}
else if(pc2!=null)
{
pc=pc2;
}
var table = document.getElementById('modalDataTable1z');
let hdr = `<tr>
            <th colspan=2>Leads</th>
            </tr>`;
table.innerHTML += hdr;
var row = `<tr>
<td class="tabdatt">Customer Reference Id</td>
<td class="tabdat" id="ctcsacn">${selected_lead.Customer_Reference_Id||'-'}</td>
</tr>
<tr>
<td class="tabdatt">Lead Status</td>
<td class="tabdat" id="ctcsaco">${selected_lead.Lead_Status||'-'}</td>
</tr>
<tr>
<td class="tabdatt">Lead source</td>
<td class="tabdat" id="ctcssch">${selected_lead.Lead_Source||'-'}</td>
</tr>
<tr>
<td class="tabdatt">Lead owner</td>
<td class="tabdat" id="ctcsshc">${selected_lead.Owner.name||'-'}</td>
</tr>
<tr>
<td class="tabdatt">Created Date</td>
<td class="tabdat" id="ctcsact">${format_date(selected_lead.Created_Time.split("T")[0])||'-'}</td>
</tr>
<tr>
<td class="tabdatt">Lead Owner Region Name</td>
<td class="tabdat" id="ctcsast">${selected_lead.Region_Name||'-'}</td>
</tr>
<tr>
<td class="tabdatt">Pincode</td>
<td class="tabdat" id="ctcsybl">${pc}</td>
</tr>`
table.innerHTML += row;
span.onclick = () => {
modal.style.display = "none";
$("#modalDataTable1 tr").remove();
$("#modalDataTable1z tr").remove();
}
window.onclick = (event) => {
if (event.target == modal) {
modal.style.display = "none";
$("#modalDataTable1 tr").remove();
$("#modalDataTable1z tr").remove();
}
}
}

function displayNav(na){
console.log(na);
let vl = document.getElementsByClassName("displayDivChild");
let ul = document.getElementsByClassName("varNavChildDiv");
for (var i = 0; i < vl.length; i++) {
console.log(vl[i]);
vl[i].style.display = "none";
}
for (var i = 0; i < ul.length; i++) {
ul[i].style.backgroundColor = "transparent";
}
if( na.id == "homeLink" )
{
document.getElementById("homeChild").style.display = "flex";
document.getElementById("varNavChildDivHo").style.backgroundColor = "#666";
document.getElementById("servChild").style.display = "block";
document.getElementById("varNavChildDivSv").style.backgroundColor = "#666";
}
else if( na.id == "addrLink" )
{
document.getElementById("addrChild").style.display = "block";
document.getElementById("varNavChildDivAd").style.backgroundColor = "#666";
}
else if( na.id == "bankLink" )
{
document.getElementById("bankChild").style.display = "block";
document.getElementById("varNavChildDivBk").style.backgroundColor = "#666";
}
else if( na.id == "servLink" )
{
document.getElementById("servChild").style.display = "block";
document.getElementById("varNavChildDivSv").style.backgroundColor = "#666";
}
else if( na.id == "assdLink" )
{
document.getElementById("accdChild").style.display = "block";
document.getElementById("varNavChildDivAt").style.backgroundColor = "#666";
}
else if( na.id == "csusLink" )
{
document.getElementById("csusChild").style.display = "block";
document.getElementById("varNavChildDivCu").style.backgroundColor = "#666";
}
else if( na.id == "fubLink" )
{
console.log(document.getElementById("fubChild"));
document.getElementById("fubChild").style.display = "block";
document.getElementById("varNavChildDivFu").style.backgroundColor = "#666";
//////////-------Add the Liabilities Search Line below ------------/////////
let m="Liabilities1";
let c="((Customer_Name:equals:"+rid+")and(A_c_Type:equals:Term Deposit))";
search_record_crm(m,c).then((d)=>{console.log("new liabilities",JSON.parse("["+d.details.output+"]"));}).catch((err)=>
{
console.log("error in new liabilities",err);
});
// CASA API CALL
ZOHO.CRM.API.searchRecord({
Entity: "Liabilities1",
Type: "criteria",
Query: "(Customer_Name:equals:" + rid + ")",
}).then(function (data) {
console.log("Liabilities search result", data);
if(data.status==204)
{
console.log("No records in liabilities module for the customer");
stadat = "";
liability_accountNumber = "-";
liability_scheme_name = "-";
// liability_ac_type=stadat[0].A_c_Type_Current_Saving || "";
liability_balance = "-";
liability_sol_id = "-";
liability_reason_for_lien = "-";
liability_account_close_date = "-";
liability_nomination_available ="-";
liability_freeze_status = "-";
liability_deposit_period = "-";
liability_ac_open_date = "-";
liability_scheme_code = "-";
liability_account_status = "-";
liability_branch = "-";
liability_lien_amount = "-";
liability_average_balnce = "-";
liability_check_allowed = "-";
liability_mode_of_operation ="-";
liability_freeze_reason = "-";
liability_maturity_date = "-";
return;
}
//empty check
var stadat1 = [];
if (stadat.length > 0) {
liability_accountNumber = stadat[0].Name || "";
liability_scheme_name = stadat[0].Scheme_Name || "";
// liability_ac_type=stadat[0].A_c_Type_Current_Saving || "";
liability_balance = data.data[0].Balance || "";
liability_sol_id = data.data[0].SOL_Id || "";
liability_reason_for_lien = data.data[0].Reason_for_Lien || "";
liability_account_close_date = data.data[0].Account_Close_Date || "";
liability_nomination_available =
data.data[0].Nomination_Available_Y_N || "";
liability_freeze_status = data.data[0].Freeze_Status || "";
liability_deposit_period = data.data[0].Deposit_Period || "";
liability_ac_open_date = data.data[0].A_c_Open_Date || "";
liability_scheme_code = data.data[0].Scheme_Code || "";
liability_account_status = data.data[0].Account_Status || "";
liability_branch = data.data[0].Branch || "";
liability_lien_amount = data.data[0].Lien_Amount || "";
liability_average_balnce = data.data[0].Average_Balance || "";
liability_check_allowed = data.data[0].Cheque_Allowed_Y_N || "";
liability_mode_of_operation =
data.data[0].Mode_of_Operation_Single_Joint || "";
liability_freeze_reason = data.data[0].Freeze_Reason || "";
liability_maturity_date = data.data[0].Maturity_Date || "";
for (let index = 0; index < stadat.length; index++) {
const data = stadat[index];
console.log(data.A_c_Type);
if (
data.A_c_Type == "Current" ||
data.A_c_Type == "Saving" ||
data.A_c_Type == "CAA" ||
data.A_c_Type == "SBA"
) {
stadat1.push(data);
}
}
}
//End of empty check
$("#tbldepdtbcs tr").remove();
stadat = "";
stadat = data.data || "";
console.log("Search Stadat", stadat);
console.log("Search data", data);
liability_accountNumber = stadat[0].Name || "";
liability_scheme_name = stadat[0].Scheme_Name || "";
// liability_ac_type=stadat[0].A_c_Type_Current_Saving || "";
liability_balance = data.data[0].Balance || "";
liability_sol_id = data.data[0].SOL_Id || "";
liability_reason_for_lien = data.data[0].Reason_for_Lien || "";
liability_account_close_date = data.data[0].Account_Close_Date || "";
liability_nomination_available =
data.data[0].Nomination_Available_Y_N || "";
liability_freeze_status = data.data[0].Freeze_Status || "";
liability_deposit_period = data.data[0].Deposit_Period || "";
liability_ac_open_date = data.data[0].A_c_Open_Date || "";
liability_scheme_code = data.data[0].Scheme_Code || "";
liability_account_status = data.data[0].Account_Status || "";
liability_branch = data.data[0].Branch || "";
liability_lien_amount = data.data[0].Lien_Amount || "";
liability_average_balnce = data.data[0].Average_Balance || "";
liability_check_allowed = data.data[0].Cheque_Allowed_Y_N || "";
liability_mode_of_operation =
data.data[0].Mode_of_Operation_Single_Joint || "";
liability_freeze_reason = data.data[0].Freeze_Reason || "";
liability_maturity_date = data.data[0].Maturity_Date || "";

var stadat1 = [];
if (stadat != "") {
for (let index = 0; index < stadat.length; index++) {
const data = stadat[index];
console.log(data.A_c_Type);
if (data.A_c_Type == "Current" || data.A_c_Type == "Saving" || data.A_c_Type == "CAA" || data.A_c_Type == "SBA") {
stadat1.push(data);
}
}
}
console.log("Data ", stadat1);
stadat = stadat1;

var table3 = document.getElementById("tbldepdtbcs");
if (stadat.length == 0) {
console.log("GOT THERE");
var row = `<tr>
<td class="tabdat" colspan=2>-</td>
<td class="tabdat" colspan=2>-</td>
<td class="tabdat" colspan=2>-</td>
<td class="tabdat" colspan=2>-</td>
</tr>`;
table3.innerHTML += row;
} else {
casa_ = stadat;
for (var i = 0; i < stadat.length; i++) {
console.log("traversing stadat", stadat[i]);
var row3 = `<tr id="${stadat[i].id}" onclick="casaClk(this,${i})">
<td class="tabdat" colspan=2>${stadat[i].Name || "-"}</td>
<td class="tabdat" colspan=2>${stadat[i].A_c_Open_Date || "-"}</td>
<td class="tabdat" colspan=2>${stadat[i].Scheme_Name || "-"}</td>
<td class="tabdat" colspan=2>${
stadat[i].A_c_Type_Current_Saving || "-"
}</td>
<td class="tabdat" colspan=2><button id="fundbasedreloadButton" onclick="fundbasedReload()">Refresh!</button></td>
</tr>`;
table3.innerHTML += row3;
console.log("for loop data", stadat[i].Name);
}
}
//////////////////--------Term Deposit Table----------//////////////
ZOHO.CRM.API.searchRecord({
Entity: "Liabilities1",
Type: "criteria",
Query:
"(Customer_Name:equals:" +
rid +
")",
}).then(function (data) {
$("#tbldepdtbtd tr").remove();
stadat_td = "";
stadat_td = data.data || "";
var stadat = [];
if (stadat_td != "") {
for (let index = 0; index < stadat_td.length; index++) {
const data = stadat_td[index];
console.log(data.A_c_Type);
if (data.A_c_Type == "Term Deposit" || data.A_c_Type == "TDA") {
stadat.push(data);
}
}
}
stadat_td = stadat;
var table4 = document.getElementById("tbldepdtbtd");
if (stadat.length == 0) {
console.log("GOT THERE");
var row = `<tr>
<td class="tabdat" colspan=2>-</td>
<td class="tabdat" colspan=2>-</td>
<td class="tabdat" colspan=2>-</td>
<td class="tabdat" colspan=2>-</td>
</tr>`;
table4.innerHTML += row;
} else {
term_deposit = stadat;
for (var i = 0; i < stadat_td.length; i++) {
var row4 = `<tr id="${stadat_td[i].id}" onclick="tdClk(this,${i})">
<td class="tabdat" colspan=2>${stadat_td[i].Name || "-"}</td>
<td class="tabdat" colspan=2>${stadat_td[i].A_c_Open_Date || "-"}</td>
<td class="tabdat" colspan=2>${stadat_td[i].Scheme_Name || "-"}</td>
<td class="tabdat" colspan=2>${
stadat_td[i].A_c_Type_Current_Saving || "-"
}</td>
<td class="tabdat" colspan=2><button id="fundbasedreloadButton" onclick="fundbasedReload()">Refresh!</button></td>
</tr>`;
table4.innerHTML += row4;
}
}
});
//////////------------Advance Table--------////////////
//////////-------Add the Account Search Line below ------------/////////
ZOHO.CRM.API.searchRecord({
Entity: "Loan_Accounts",
Type: "criteria",
Query: "(Customer_Name:equals:" + rid + ")",
}).then(function (data) {
$("#tbladvdtb tr").remove();
stadat_ad = "";
stadat_ad = data.data || "";
console.log(data);
var stadat = [];
if (stadat_ad != "") {
for (let index = 0; index < stadat_ad.length; index++) {
const data = stadat_ad[index];
console.log("Advances  ",data.A_c_Type_Current_Saving);
if (data.A_c_Type_Current_Saving != "" || ata.A_c_Type_Current_Saving != null) {
stadat.push(data);
}
}
}
stadat_ad = stadat;
var table5 = document.getElementById("tbladvdtb");
if (stadat_ad.length == 0) {
console.log("GOT THERE");
var row = `<tr>
<td class="tabdat" colspan=2>-</td>
<td class="tabdat" colspan=2>-</td>
<td class="tabdat" colspan=2>-</td>
<td class="tabdat" colspan=2>-</td>
</tr>`;
table5.innerHTML += row;
} else {
advances_ = stadat_ad;
for (var i = 0; i < stadat_ad.length; i++) {
var row5 = `<tr id="${stadat_ad[i].id}" onclick="advClk(this,${i})">
<td class="tabdat" colspan=2>${stadat_ad[i].Name || "-"}</td>
<td class="tabdat" colspan=2>${stadat_ad[i].A_c_Open_Date || "-"}</td>
<td class="tabdat" colspan=2>${stadat_ad[i].Scheme_Name || "-"}</td>
<td class="tabdat" colspan=2>${
stadat_ad[i].A_c_Type_Current_Saving || "-"
}</td>
<td class="tabdat" colspan=2><button id="fundbasedreloadButton" onclick="fundbasedReload()">Refresh!</button></td>
</tr>`;
table5.innerHTML += row5;
}
}
});
});

}
else if( na.id == "nfubLink" )
{
document.getElementById("nfubChild").style.display = "block";
document.getElementById("varNavChildDivNf").style.backgroundColor = "#666";
//////////-----------Bank Guarantee Table----------///////////
ZOHO.CRM.API.searchRecord({
Entity: "Non_Fund_Based",
Type: "criteria",
Query: "(Customer_Name:equals:" + rid + ")",
}).then(function (data) {
console.log("DATA OF BANK GUARANTEE TABLE ", data);
$("#tblbgrdtb tr").remove();
stadat_bgrd = "";
stadat_bgrd = data.data || "";
var stadat = [];
if (stadat_bgrd != "") {
for (let index = 0; index < stadat_bgrd.length; index++) {
const data = stadat_bgrd[index];
console.log(data.Non_Fund_Based_Type);
if (data.Non_Fund_Based_Type == "Bank Guarantee") {
stadat.push(data);
}
}
}
console.log("Data ", stadat);
stadat_bgrd = stadat;
var table = document.getElementById("tblbgrdtb");
if (stadat_bgrd.length == 0) {
console.log("GOT THERE");
var row = `<tr>
<td class="tabdat" colspan=2>-</td>
<td class="tabdat" colspan=2>-</td>
<td class="tabdat" colspan=2>-</td>
<td class="tabdat" colspan=2>-</td>
<td class="tabdat" colspan=2>-</td>
</tr>`;
table.innerHTML += row;
} else {
bank_guarantee = stadat_bgrd;
for (var i = 0; i < stadat_bgrd.length; i++) {
var row = `<tr id="${stadat_bgrd[i].id}" onclick="bgnClk(this, ${i})">
<td class="tabdat" colspan=2>${
stadat_bgrd[i].BG_No_Bank_Gurantee || "-"
}</td>
<td class="tabdat" colspan=2>${
stadat_bgrd[i].BG_No_Bank_Gurantee_No_No || "-"
}</td>
<td class="tabdat" colspan=2>${stadat_bgrd[i].BG_Type || "-"}</td>
<td class="tabdat" colspan=2>${
stadat_bgrd[i].Beneficiary_Name || "-"
}</td>
<td class="tabdat" colspan=2>${stadat_bgrd[i].Name || "-"}</td>
</tr>`;
table.innerHTML += row;
}
}
});
//////////-----------Letter of Credit Table----------///////////
// ZOHO.CRM.API.getAllRecords({
//   Entity: "Non_Fund_Based",
// ZOHO.CRM.API.searchRecord({
//   Entity: "Non_Fund_Based",
//   Type: "criteria",
//   Query:
//     "((Customer_Name:equals:" +
//     rid +
//     ")and(Non_Fund_Based_Types:equals:Letter of Credit))",
ZOHO.CRM.API.searchRecord({
Entity: "Non_Fund_Based",
Type: "criteria",
Query: "(Customer_Name:equals:" + rid + ")",
}).then(function (data) {
console.log(data);
$("#tbllocrdtb tr").remove();
stadat_loc = "";
stadat_loc = data.data || "";
var stadat = [];
if (stadat_loc != "") {
for (let index = 0; index < stadat_loc.length; index++) {
const data = stadat_loc[index];
console.log(data.Non_Fund_Based_Type);
if (data.Non_Fund_Based_Type == "Letter of Credit") {
stadat.push(data);
}
}
}
stadat_loc = stadat;
console.log(stadat_loc.length);
var table1 = document.getElementById("tbllocrdtb");
if (stadat_loc.length == 0) {
console.log("GOT THERE");
var row1 = `<tr>
<td class="tabdat" colspan=2>-</td>
</tr>`;
table1.innerHTML += row1;
} else {
letter_of_credit = stadat_loc;
for (var i = 0; i < stadat_loc.length; i++) {
var row1 = `<tr id="${stadat_loc[i].id}" onclick="locClk(this, ${i})">
<td class="tabdat" colspan=2>${
stadat_loc[i].LC_No_Letter_of_Credit_No	 || "-"
}</td>
<td class="tabdat" colspan=2>${
stadat_loc[i].Contract_Amount || "-"
}</td>
<td class="tabdat" colspan=2>${
stadat_loc[i].Beneficiary_Name || "-"
}</td>
<td class="tabdat" colspan=2>${stadat_loc[i].Expiry_Date || "-"}</td>
<td class="tabdat" colspan=2>${stadat_loc[i].Name || "-"}</td>
</tr>`;
table1.innerHTML += row1;
}
}
});
//////////-----------Forward Contract Table----------///////////
// ZOHO.CRM.API.getAllRecords({
//   Entity: "Non_Fund_Based",
// ZOHO.CRM.API.searchRecord({
//   Entity: "Non_Fund_Based",
//   Type: "criteria",
//   Query:
//     "((Customer_Name:equals:" +
//     rid +
//     ")and(Non_Fund_Based_Types:equals:Forward Contract No))",
ZOHO.CRM.API.searchRecord({
Entity: "Non_Fund_Based",
Type: "criteria",
Query: "(Customer_Name:equals:" + rid + ")",
}).then(function (data) {
$("#tblfcrdtb tr").remove();
stadat_fcr = "";
stadat_fcr = data.data || "";
var stadat = [];
if (stadat_fcr != "") {
for (let index = 0; index < stadat_fcr.length; index++) {
const data = stadat_fcr[index];
console.log(data.Non_Fund_Based_Type);
if (data.Non_Fund_Based_Type == "Forward Contract No") {
stadat.push(data);
}
}
}
console.log("Forward Contract   ",stadat);
stadat_fcr = stadat;
var table2 = document.getElementById("tblfcrdtb");
if (stadat_fcr.length == 0) {
console.log("GOT THERE");
var row2 = `<tr>
<td class="tabdat" colspan=2>-</td>
<td class="tabdat" colspan=2>-</td>
<td class="tabdat" colspan=2>-</td>
<td class="tabdat" colspan=2>-</td>
<td class="tabdat" colspan=2>-</td>
</tr>`;
table2.innerHTML += row2;
} else {
forward_contracts = stadat_fcr;
console.log("Forward Contract ",forward_contracts);
for (var i = 0; i < stadat_fcr.length; i++) {
var row2 = `<tr id="${stadat_fcr[i].id}" onclick="fcrClk(this,${i})">
<td class="tabdat" colspan=2>${
stadat_fcr[i].Forward_Contract || "-"
}</td>
<td class="tabdat" colspan=2>${
stadat_fcr[i].Contract_Amount || "-"
}</td>
<td class="tabdat" colspan=2>${stadat_fcr[i].O_s_Balance || "-"}</td>
<td class="tabdat" colspan=2>${stadat_fcr[i].Validity_To || "-"}</td>
<td class="tabdat" colspan=2>${stadat_fcr[i].Register_Type || "-"}</td>
</tr>`;
table2.innerHTML += row2;
}
}
});
}
else if( na.id == "tickLink" )
{
document.getElementById("tickChild").style.display = "block";
document.getElementById("varNavChildDivTk").style.backgroundColor = "#666";
}
else if( na.id == "campLink" )
{
document.getElementById("campChild").style.display = "block";
document.getElementById("varNavChildDivCp").style.backgroundColor = "#666";
}
else if( na.id == "leadLink" )
{
document.getElementById("leadChild").style.display = "block";
document.getElementById("varNavChildDivLd").style.backgroundColor = "#666";
let lead_table=document.getElementById("tblleadtabb");
let table_st=``;
if(leads_results.length==0)
{
      table_st+=`<tr>`;
      table_st+=`<td class='tabdat'>-</td>`;
      table_st+=`<td class='tabdat'>-</td>`;
      table_st+=`<td class='tabdat'>-</td>`;
      table_st+=`<td class='tabdat'>-</td>`;
      table_st+=`<td class='tabdat'>-</td>`;
      table_st+=`</tr>`;
}
for(var i = 0; i < leads_results.length; i++)
    {
      table_st+=`<tr class="highlighted_row" onclick='leadClk(this,${i})'>`;
      table_st+=`<td class='tabdatt2'>${leads_results[i].Customer_Reference_Id}</td>`;
      table_st+=`<td class='tabdatt2'>${leads_results[i].Lead_Status||'-'}</td>`;
      table_st+=`<td class='tabdatt2'>${leads_results[i].Lead_Source||'-'}</td>`;
      table_st+=`<td class='tabdatt2'>${leads_results[i].Owner.name}</td>`;
      table_st+=`<td class='tabdatt2'>${format_date(leads_results[i].Created_Time.split("T")[0])}</td>`;
      table_st+=`</tr>`;
    }
lead_table.innerHTML=table_st;
console.log("Leads results",leads_results);
}
else
{
console.log("error");
}
}

var ctrApi1 = 0;

function checkApi1(n){
document.getElementById('loadingWrapper').style.display = 'flex';
console.log(n.id);
ctrApi1++;
console.log(ctrApi1);
let uri = "https://reqres.in/api/users?page=1";
if(ctrApi1%2!=0)
{
fetch(uri)
.then((dat)=> dat.json())
.then(dat1 => {
document.getElementById('loadingWrapper').style.display = 'none';
let val = dat1.data[0].id || "";
if(n.id == "depamtchkLink")
{
  if(val != "")
  {
    // document.getElementById("ccttdpamt").appendChild = "<span> " + val + " </span><br/>";
    $("#ccttdpamt").prepend("<span> " + val + " </span><br/>");
  }
  else
  {
    console.log("Error encountered while checking");
  }
}

if(n.id == "loanamtchkLink")
{
  if(val != "")
  {
    // document.getElementById("ccttotprd").appendChild = "<span> " + val + " </span><br/>";
    $("#ccttotprd").prepend("<span> " + val + " </span><br/>");
  }
  else
  {
    console.log("Error encountered while checking");
  }
}
}
)
.catch((error) => {document.getElementById('loadingWrapper').style.display = 'none'; console.log(error);})
}
else
{
document.getElementById('loadingWrapper').style.display = 'none';
console.log("Odd: " + ctrApi1);
$("#ccttdpamt span").remove();
$("#ccttdpamt br").remove();
$("#ccttotprd span").remove();
$("#ccttotprd br").remove();
}
}
var fundbasedtabCounter = 0;
function fbdivonclickDisplay(d){
// fundbasedtabCounter++;
// console.log(fundbasedtabCounter);
// if( fundbasedtabCounter%2!=0)
// {
if(d.id == "fubHead1"){
document.getElementById("depositPanel").style.display = "block";
document.getElementById("fubHead1").style.backgroundColor = "#777";
document.getElementById("advPanel").style.display = "none";
document.getElementById("fubHead2").style.backgroundColor = "#313949";
}
else if(d.id == "fubHead2"){
document.getElementById("depositPanel").style.display = "none";
document.getElementById("fubHead1").style.backgroundColor = "#313949";
document.getElementById("advPanel").style.display = "block";
document.getElementById("fubHead2").style.backgroundColor = "#777";
}
else{
console.log("Error: Fund based Tab Error!");
}
// }
// else
// {
// if(d.id == "fubHead1"){
//   document.getElementById("depositPanel").style.display = "none";
// }
// else if(d.id == "fubHead2"){
//   document.getElementById("advPanel").style.display = "none";
// }
// else{
//   console.log("Error: Fund based Tab Error!");
// }
// }
}

var fundbasedsubtabCounter = 0;
function fbsubdivonclickDisplay(e){
// fundbasedsubtabCounter++;
// console.log(fundbasedsubtabCounter);
// if( fundbasedsubtabCounter%2!=0)
// {
if(e.id == "fubsubHead1"){
document.getElementById("casaPanel").style.display = "block";
document.getElementById("fubsubHead1").style.backgroundColor = "#777";
document.getElementById("termdepositPanel").style.display = "none";
document.getElementById("fubsubHead2").style.backgroundColor = "#313949";
}
else if(e.id == "fubsubHead2"){
document.getElementById("casaPanel").style.display = "none";
document.getElementById("fubsubHead1").style.backgroundColor = "#313949";
document.getElementById("termdepositPanel").style.display = "block";
document.getElementById("fubsubHead2").style.backgroundColor = "#777";
}
else{
console.log("Error: Fund based Tab Error!");
}
// }
// else
// {
// if(e.id == "fubsubHead1"){
//   document.getElementById("casaPanel").style.display = "none";
// }
// else if(e.id == "fubsubHead2"){
//   document.getElementById("termdepositPanel").style.display = "none";
// }
// else{
//   console.log("Error: Fund based Tab Error!");
// }
// }
}

var nonfundbasedtabCounter = 0;
function nfbdivonclickDisplay(f){
// nonfundbasedtabCounter++;
// console.log(nonfundbasedtabCounter);
// if( nonfundbasedtabCounter%2!=0)
// {
if(f.id == "nfubHead1"){
document.getElementById("nfubbgPanel").style.display = "block";
document.getElementById("nfubHead1").style.backgroundColor = "#777";
document.getElementById("nfublcPanel").style.display = "none";
document.getElementById("nfubHead2").style.backgroundColor = "#313949";
document.getElementById("nfubfcPanel").style.display = "none";
document.getElementById("nfubHead3").style.backgroundColor = "#313949";
}
else if(f.id == "nfubHead2"){
document.getElementById("nfubbgPanel").style.display = "none";
document.getElementById("nfubHead1").style.backgroundColor = "#313949";
document.getElementById("nfublcPanel").style.display = "block";
document.getElementById("nfubHead2").style.backgroundColor = "#777";
document.getElementById("nfubfcPanel").style.display = "none";
document.getElementById("nfubHead3").style.backgroundColor = "#313949";
}
else if(f.id == "nfubHead3"){
document.getElementById("nfubbgPanel").style.display = "none";
document.getElementById("nfubHead1").style.backgroundColor = "#313949";
document.getElementById("nfublcPanel").style.display = "none";
document.getElementById("nfubHead2").style.backgroundColor = "#313949";
document.getElementById("nfubfcPanel").style.display = "block";
document.getElementById("nfubHead3").style.backgroundColor = "#777";
}
else{
console.log("Error: Fund based Tab Error!");
}
// }
// else
// {
// if(f.id == "nfubHead1"){
//   document.getElementById("nfubbgPanel").style.display = "none";
// }
// else if(f.id == "nfubHead2"){
//   document.getElementById("nfublcPanel").style.display = "none";
// }
// else if(f.id == "nfubHead3"){
//   document.getElementById("nfubfcPanel").style.display = "none";
// }
// else{
//   console.log("Error: Fund based Tab Error!");
// }
// }
}

function GetSelectedTextValue() {
let acct_drop_down=document.getElementById('membership');
console.log("account drop down is",acct_drop_down.options);
acct_drop_down.style.display="block";
let selected_acct=acct_drop_down.options[acct_drop_down.options.selectedIndex].value;
console.log("selected acct is",selected_acct);
if(selected_acct=="No accounts available")
{
console.log("returning out");
return;
}
let request ={
url : "https://sandbox.zohoapis.in/crm/v2/functions/customer360services/actions/execute",
params:{
auth_type:"apikey",
zapikey:"1003.600980f6c77d6565e75469173e5481bc.4130ee5339b56ed6fc918aec16f1329e",
sat: "debitcard",
accountNumber: "566802070000735"
}
};
let func_name="Fetch_DebitCard_API";
let params={Accn:selected_acct};
call_crm_function(func_name,params).then(function(res){
// document.getElementById('accountdropdown').style.display="block";
// let res = JSON.parse(data);
// document.getElementById('loadingWrapper').style.display = 'none';
console.log("debit card fetch is",res);
modal1.style.display = "none";
if(res.code == "success")
{
stadat="";
stadat = JSON.parse(res.details.output);
stadat = stadat.data;
console.log("stadat for debit card info", stadat);
let resp=stadat.statusDesc || "";
console.log(resp);
if(resp == "SUCCESS")
{
var table = document.getElementById('modalDataTable1');
let hdr = `<tr class="modalDataDc">
<th>Debit Card Number</th>

<th>Card Status</th>
</tr>`;
table.innerHTML = hdr;
if(stadat.length==0)
{
table.innerHTML += `<tr>
<td>-</td>
<td>-</td>
</tr>`;
}
else
{
for (var i = 0; i < stadat.cardDetails.length; i++){
var row = `<tr onclick="debitnoClk(${stadat.cardDetails[i].cardNumber})">
    <td>${stadat.cardDetails[i].cardNumber}</td>
    <td>${stadat.cardDetails[i].cardStatus}</td>
  </tr>`;
table.innerHTML += row;
}
}


}
else if(resp=="CARD_NOT_AVAILABLE")
{
var table = document.getElementById('modalDataTable1');
let hdr = `<tr class="modalDataDc">
<th>Debit Card Number</th>

<th>Card Status</th>
</tr>`;
table.innerHTML = hdr;
table.innerHTML += `<tr>
<td>Debit cards are not available for this account</td>
</tr>`;
}
}
/////-----FMR-----//////
// var table = document.getElementById('modalDataTable1');
// let hdr = `<tr class="modalDataDc">
// <th>Debit Card Number</th>
// <th>Daily Limit</th>
// // <th>Card Status</th>
// // <th>Last Used Date</th>
// </tr>`;
// table.innerHTML += hdr;
// for (var i = 0; i < stadat.cardDetails.length; i++){
//   var row = `<tr>
//           <td>${stadat.cardDetails[i].cardNumber}</td>
//           <td>${stadat.cardDetails[i].cardStatus}</td>
//           <td>${stadat.cardDetails[i].noOfCards}</td>
//           // <td>${stadat.cardDetails[i].statusCode}</td>
//         </tr>`
//   table.innerHTML += row
//API URL Assignment and Parameters Setting
/*  var url8 = new URL("https://reqres.in/api/users"); 
// var url = new URL("https://cdn-api.co-vin.in/api/v2/admin/location/states");
var params8 = {page:1};
url8.search = new URLSearchParams(params8).toString();
var recordPromisem8 = new Promise(async (resolve, reject) => {
// const stdat = await fetch("https://cdn-api.co-vin.in/api/v2/admin/location/states");
const stdat = await fetch(url8);
resolve(stdat);
});
recordPromisem8
.then((response)=>{
// console.log(data.json());
return response.json();
}).then((dt)=>{
// console.log(dt.data);
stadat="";
stadat = dt.data;
var table = document.getElementById('modalDataTable1');
let hdr = `<tr class="modalDataDc">
<th>Debit Card Number</th>
<th>Daily Limit</th>
<th>Card Status</th>
<th>Last Used Date</th>
</tr>`;
table.innerHTML += hdr;
for (var i = 0; i < stadat.length; i++){
var row = `<tr>
<td>${stadat[i].id}</td>
<td>${stadat[i].first_name}</td>
<td>${stadat[i].last_name}</td>
<td>${stadat[i].email}</td>
</tr>`
table.innerHTML += row
}
})

span.onclick = () => {
modal.style.display = "none";
$("#modalDataTable1 tr").remove();
}
window.onclick = (event) => {
if (event.target == modal) {
modal.style.display = "none";
$("#modalDataTable1 tr").remove();
}
}*/
}).catch((err)=>{console.log("Error in debit card info fetch",err)});
/*
ZOHO.CRM.HTTP.get(request)
          .then(function(data){
            // document.getElementById('accountdropdown').style.display="block";
            let res = JSON.parse(data);
            // document.getElementById('loadingWrapper').style.display = 'none';
            modal1.style.display = "none";
            if(res.code == "success")
            {
              stadat="";
              stadat = JSON.parse(res.details.output);
              stadat = stadat.data;
              console.log(stadat);
              let resp=stadat.statusDesc || "";
              console.log(resp);
              if(resp == "SUCCESS")
              {
                  var table = document.getElementById('modalDataTable1');
            let hdr = `<tr class="modalDataDc">
            <th>Debit Card Number</th>

            <th>Card Status</th>
            </tr>`;
            table.innerHTML = hdr;
            for (var i = 0; i < stadat.cardDetails.length; i++){
              var row = `<tr onclick="debitnoClk(this)">
                      <td>${stadat.cardDetails[i].cardNumber}</td>
                      <td>${stadat.cardDetails[i].cardStatus}</td>

                    </tr>`
              table.innerHTML += row
            }
            
          }
            }
            /////-----FMR-----//////
            // var table = document.getElementById('modalDataTable1');
            // let hdr = `<tr class="modalDataDc">
            // <th>Debit Card Number</th>
            // <th>Daily Limit</th>
            // // <th>Card Status</th>
            // // <th>Last Used Date</th>
            // </tr>`;
            // table.innerHTML += hdr;
            // for (var i = 0; i < stadat.cardDetails.length; i++){
            //   var row = `<tr>
            //           <td>${stadat.cardDetails[i].cardNumber}</td>
            //           <td>${stadat.cardDetails[i].cardStatus}</td>
            //           <td>${stadat.cardDetails[i].noOfCards}</td>
            //           // <td>${stadat.cardDetails[i].statusCode}</td>
            //         </tr>`
            //   table.innerHTML += row
//API URL Assignment and Parameters Setting
/*  var url8 = new URL("https://reqres.in/api/users"); 
// var url = new URL("https://cdn-api.co-vin.in/api/v2/admin/location/states");
var params8 = {page:1};
url8.search = new URLSearchParams(params8).toString();
var recordPromisem8 = new Promise(async (resolve, reject) => {
// const stdat = await fetch("https://cdn-api.co-vin.in/api/v2/admin/location/states");
const stdat = await fetch(url8);
resolve(stdat);
});
recordPromisem8
.then((response)=>{
// console.log(data.json());
return response.json();
}).then((dt)=>{
// console.log(dt.data);
stadat="";
stadat = dt.data;
var table = document.getElementById('modalDataTable1');
let hdr = `<tr class="modalDataDc">
<th>Debit Card Number</th>
<th>Daily Limit</th>
<th>Card Status</th>
<th>Last Used Date</th>
</tr>`;
table.innerHTML += hdr;
for (var i = 0; i < stadat.length; i++){
var row = `<tr>
    <td>${stadat[i].id}</td>
    <td>${stadat[i].first_name}</td>
    <td>${stadat[i].last_name}</td>
    <td>${stadat[i].email}</td>
  </tr>`
table.innerHTML += row
}
})

span.onclick = () => {
modal.style.display = "none";
$("#modalDataTable1 tr").remove();
}
window.onclick = (event) => {
if (event.target == modal) {
modal.style.display = "none";
$("#modalDataTable1 tr").remove();
}
}
}).catch((err)=>{console.log("Error in debit card info fetch",err)});*/

}
//scrolls
// document.getElementById('homeChild').addEventListener("scroll",(event)=>{console.log('Scroll fired from home child',event);track_chart_scroll();});
// document.getElementById('mainDisplayDiv').addEventListener("scroll",(event)=>{console.log('Scroll fired from mainDisplayDiv',event);track_chart_scroll();});
// document.getElementById('main_div').addEventListener("scroll",(event)=>{console.log('Scroll fired from main_div',event);track_chart_scroll();});
// document.getElementById('w3c').addEventListener("scroll",(event)=>{console.log('Scroll fired from w3c',event);track_chart_scroll();});
function track_chart_scroll()
{
console.log("body's top is",document.body.scrollTop);
let chart_widget=document.getElementById("advanceschartPanel");
console.log("chart widget top is",chart_widget.scrollTop);
}
function fundbasedReload(){
flag=1;
modal.style.display = "none";
// location.reload();
$("#tblbgrdtb tr").remove();
$("#tbllocrdtb tr").remove();
$("#tblfcrdtb tr").remove();

$("#tbldepdtbcs tr").remove();
$("#tbldepdtbtd tr").remove();
$("#tbladvdtb tr").remove();

$("#tbltkrdtbtkk tr").remove();
$("#tblcprdtbcpp tr").remove();
$("#tblleadtabb tr").remove();
fetch("https://reqres.in/api/users?page=2")
.then(function(dt){
return dt.json();
}).then((data) => {
// console.log(data);
data = data.data;
// var table = document.getElementById('tblbgrdtb');
var table1 = document.getElementById('tbllocrdtb');
var table2 = document.getElementById('tblfcrdtb');

// var table3 = document.getElementById('tbldepdtbcs');
// var table4 = document.getElementById('tbldepdtbtd');
// var table5 = document.getElementById('tbladvdtb');

var table6 = document.getElementById('tbltkrdtbtkk');
var table7 = document.getElementById('tblcprdtbcpp');
var table8 = document.getElementById('tblleadtabb');

for (var i = 0; i < data.length; i++){
// if(data[i].Status=="Closed" || data[i].Product1=="Credit Card"){
// var row = `<tr id="${data[i].id}" onclick="bgnClk(this)">
//           <td class="tabdat" colspan=2>${data[i].id || "-"}</td>
//           <td class="tabdat" colspan=2>${data[i].email || "-"}</td>
//           <td class="tabdat" colspan=2>${data[i].first_name || "-"}</td>
//           <td class="tabdat" colspan=2>${data[i].last_name || "-"}</td>
//           <td class="tabdat" colspan=2>${data[i].avatar || "-"}</td>
//           </tr>`
// // var row1 = `<tr id="${data[i].id}" onclick="locClk(this)">
// // <td class="tabdat" colspan=2>${data[i].id+446 || "-"}</td>
// // <td class="tabdat" colspan=2>${data[i].id+834 || "-"}</td>
// // <td class="tabdat" colspan=2>${data[i].first_name || "-"}</td>
// // <td class="tabdat" colspan=2>${data[i].last_name || "-"}</td>
// // <td class="tabdat" colspan=2>${data[i].avatar || "-"}</td>
// </tr>`
// var row2 = `<tr id="${data[i].id}" onclick="fcrClk(this)">
// <td class="tabdat" colspan=2>${data[i].id || "-"}</td>
// <td class="tabdat" colspan=2>${data[i].email || "-"}</td>
// <td class="tabdat" colspan=2>${data[i].first_name || "-"}</td>
// <td class="tabdat" colspan=2>${data[i].last_name || "-"}</td>
// <td class="tabdat" colspan=2>${data[i].avatar || "-"}</td>
// </tr>`
// var row3 = `<tr id="${data[i].id}" onclick="casaClk(this)">
//           <td class="tabdat" colspan=2>67${data[i].id+87876987 || "-"}</td>
//           <td class="tabdat" colspan=2>${liability_accountNumber}</td>
//           <td class="tabdat" colspan=2>Kisan Vikas Patra</td>
//           <td class="tabdat" colspan=2>Savings A/C</td>
//           <td class="tabdat" colspan=2><button id="fundbasedreloadButton" onclick="fundbasedReload()">Refresh!</button></td>
//           </tr>`
        // var row4 = `<tr id="${data[i].id}" onclick="tdClk(this)">
        // <td class="tabdat" colspan=2>${data[i].id+624526766 || "-"}</td>
        // <td class="tabdat" colspan=2>NO</td>
        // <td class="tabdat" colspan=2>Sukanya Samridhhi Scheme</td>
        // <td class="tabdat" colspan=2>Current A/C</td>
        // <td class="tabdat" colspan=2><button id="fundbasedreloadButton" onclick="fundbasedReload()">Refresh!</button></td>
        // </tr>`
        // var row5 = `<tr id="${data[i].id}" onclick="advClk(this)">
        // <td class="tabdat" colspan=2>${data[i].id+767656676 || "-"}</td>
        // <td class="tabdat" colspan=2>Pending</td>
        // <td class="tabdat" colspan=2>Senior Citizen Saving Scheme</td>
        // <td class="tabdat" colspan=2>Salary Account</td>
        // <td class="tabdat" colspan=2><button id="fundbasedreloadButton" onclick="fundbasedReload()">Refresh!</button></td>
        // </tr>`
var row6 = `<tr id="${data[i].id}" onclick="tkClk(this)">
<td class="tabdat" colspan=2>${data[i].id || "-"}</td>
<td class="tabdat" colspan=2>${data[i].email || "-"}</td>
<td class="tabdat" colspan=2>${data[i].first_name || "-"}</td>
<td class="tabdat" colspan=2>${data[i].last_name || "-"}</td>
<td class="tabdat" colspan=2>${data[i].avatar || "-"}</td>
</tr>`
var row7 = `<tr id="${data[i].id}" onclick="cpClk(this)">
<td class="tabdat" colspan=2>${data[i].id || "-"}</td>
<td class="tabdat" colspan=2>${data[i].email || "-"}</td>
<td class="tabdat" colspan=2>${data[i].first_name || "-"}</td>
</tr>`
var row8 = `<tr id="${data[i].id}" onclick="leadClk(this)">
<td class="tabdat" colspan=2>${data[i].id || "-"}</td>
<td class="tabdat" colspan=2>Open</td>
<td class="tabdat" colspan=2>Website</td>
<td class="tabdat" colspan=2>${data[i].first_name || "-"}</td>
<td class="tabdat" colspan=2>03-07-2022</td>
</tr>`

table.innerHTML += row
table1.innerHTML += row1
table2.innerHTML += row2

// table3.innerHTML += row3
// table4.innerHTML += row4
// table5.innerHTML += row5

table6.innerHTML += row6
table7.innerHTML += row7
table8.innerHTML += row8
// }

// document.getElementById("fubrefreshTime").innerHTML = now;
}
console.log("Refreshed!");
let d = new Date;
let dd = d.getDate();
dd = dd.toString();
if(dd.length!=2)
{
dd = "0" + dd;
}
let MM = d.getMonth() + 1;
MM = MM.toString();
if(MM.length!=2)
{
MM = "0" + MM;
}
let yyyy = d.getFullYear();
yyyy = yyyy.toString();
let hh = d.getHours();
hh = hh.toString();
if(hh.length!=2)
{
hh = "0" + hh;
}
let mm = d.getMinutes();
mm = mm.toString();
if(mm.length!=2)
{
mm = "0" + mm;
}
let ss = d.getSeconds();
ss = ss.toString();
if(ss.length!=2)
{
ss = "0" + ss;
}
let date = yyyy + "-" + MM + "-" + dd + "T" + hh + ":" + mm + ":" + ss + "+05:30"
console.log(date);
ZOHO.CRM.API.getRelatedRecords({Entity:"Contacts",RecordID:rid,RelatedList:"Deals",page:1,per_page:200})
.then((data)=>{
let dt = data.data || "";
if(dt!="")
{
  dt.forEach(element => {
    let config={
      Entity:"Deals",
      APIData:{
            "id": element.id,
            "Widget_Refresh_Date_Time": date
      }
    }
    ZOHO.CRM.API.updateRecord(config)
    .then(function(data){
        console.log(data)
    })
  });
}
})

ZOHO.CRM.API.getRelatedRecords({Entity:"Contacts",RecordID:rid,RelatedList:"Deals",page:1,per_page:200})
.then((data)=>{
let dt = data.data[0] || "";
if(dt!="")
{
document.getElementById("oppTitle").innerHTML = "Opportunities as of: " + dt.Widget_Refresh_Date_Time || "";
document.getElementById("depTitle").innerHTML = "Deposits as of: " + dt.Widget_Refresh_Date_Time || "";
document.getElementById("advTitle").innerHTML = "Advances as of: " + dt.Widget_Refresh_Date_Time || "";
document.getElementById("fubrefreshTime").innerHTML = dt.Widget_Refresh_Date_Time || "";
}
})
}).catch((error) => console.log(error));
}

ZOHO.embeddedApp.init();
//-----------------------------------------------------------------------------------------------------------------------------