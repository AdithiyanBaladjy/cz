//The below array is for enabling the mark lien button in the lien details inquiry tab
//in Service Request - Mark lien function works only for the below profiles:
//Cyber Crime Cell Ops - "1068004891291794"
//Lea Cell Ops - 1068004891309850
// UBI Call center Agent - 1068000204615394
// Administrator - 1068000000031157
let lienMarkNeededProfiles=["1068004891291794","1068004891309850","1068000204615394","1068000000031157"];
let profileBasedSectionShowConditions=[
    {
        "conditionName":"Lien Mark Show/Hide Condition",
        "allowedProfiles":lienMarkNeededProfiles,
        "SectionQueriesToBeShown":["#add_lien_remarks"],
        "SectionQueriesToBeHidden":[],
        "specialPermissionTag":`Lien Remarking - S360` //Should be `Lien Remarking - S360` but to not disturb existing code, keep this as null - add the tag properly for newly created permissions
    },
    {
        "conditionName":"MB deregister Show/Hide Condition",
        "allowedProfiles":null,
        "SectionQueriesToBeShown":["[data-selector-id='MB_Deregister']"],
        "SectionQueriesToBeHidden":[],
        "specialPermissionTag":`MB Deregistration - S360`
    },
    {
        "conditionName":"UPI Block Show/Hide Condition",
        "allowedProfiles":null,
        "SectionQueriesToBeShown":["[data-selector-id='UPI_Block']"],
        "SectionQueriesToBeHidden":[],
        "specialPermissionTag":`UPI Blocking - S360`
    }
];
/* Example to hide debit card hotlisting based on specialPermissions
{
        "conditionName":"Debit card hotlisting Show/Hide Condition",
        "allowedProfiles":null,
        "SectionQueriesToBeShown":["[data-selector-id='card-hotlist']"],
        "SectionQueriesToBeHidden":[],
        "specialPermissionTag":`Test-1`
    }
*/

var maskingChar="X"
var lastNDigit=4;