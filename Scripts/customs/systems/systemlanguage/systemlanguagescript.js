//=======================
// VARIABLE GLOBAL
//=======================
var clsGlobal = new clsGlobalClass(); 
var LOV;
var bitLoading = false; 


//=======================
// Confirmation
//======================= 

//=======================
// ON PAGE LOAD
//=======================
$(document).ready(function () {  
    p_InitForm();
    p_validatePage();  
});

//=======================
// FUNCTION
//=======================
function p_InitForm() {
    p_initiateData();
}

function p_validatePage() {
    
}

function p_showPrevData() {

}
 
function p_showBlank() { 
   
}

function setChooseLOV(txtValue) { 
    var arr = txtValue.split('|'); 
    switch (arr[0]) {
        //case "txtID": $("#txtID").val(arr[1]);
        //    p_txtID_TextChanged();
        //    break;
       
    }
    clsGlobal.closeLOV(); 
}

function p_DataToUI(objData) { 
    
}
  
function p_initiateData() { 
    clsGlobal.showLoading();
    $.ajax({
        type: "POST",
        url: "/System/SystemLanguage/InitiateData",
        data: { __RequestVerificationToken: $('#frm1 input[name=__RequestVerificationToken]').val() },
        datatype: "json",
        success: function (retDat) {
            
            if (retDat.bitSuccess == true) { 
                if (retDat.objData != undefined) { 
                    $("#txtHiddenObject").val(JSON.stringify(retDat.objData));
                    p_DataToUI(retDat.objData);
                    $("#txtGUID").val(retDat.txtGUID);
                } else { 
                    p_showBlank();
                }
            } else {
                clsGlobal.getAlert(retDat.txtMessage);
            }  
            clsGlobal.hideLoading();
        },
        error: function (retDat) { 
            clsGlobal.hideLoading();
        }
    });

}

function p_UIToData() { 
    var jsonObj = [];
    var htmlJSON = $("#txtHiddenObject").val();  
    jsonData = JSON.parse(htmlJSON);
    
    $("#txtHiddenObject").val(JSON.stringify(jsonData));
    
}
 
 
function p_saveData() {
    
    clsGlobal.showLoading();
    p_UIToData(); 
    $.ajax({ 
        type: "POST",
        url: "/System/SystemLanguage/SaveData", 
        data: { data: $("#txtHiddenObject").val(), txtGUID: $("#txtGUID").val(), __RequestVerificationToken: $('#frm1 input[name=__RequestVerificationToken]').val() },
        datatype: "json",
        success: function (retDat) {
            
            console.log(retDat);
            if (retDat.bitSuccess == true) {
                clsGlobal.getAlert(retDat.txtMessage);
            } else {
                clsGlobal.getAlert(retDat.txtMessage);
            }
            clsGlobal.hideLoading();
        },
        error: function (retDat) { 
            clsGlobal.hideLoading();
        }
    });
}

function p_generateALL() {

    clsGlobal.showLoading();
    p_UIToData();
    $.ajax({
        type: "POST",
        url: "/System/SystemLanguage/GenerateAll",
        data: { data: $("#txtHiddenObject").val(), txtGUID: $("#txtGUID").val(), __RequestVerificationToken: $('#frm1 input[name=__RequestVerificationToken]').val() },
        datatype: "json",
        success: function (retDat) {

            console.log(retDat);
            if (retDat.bitSuccess == true) {
                clsGlobal.getAlert(retDat.txtMessage);
            } else {
                clsGlobal.getAlert(retDat.txtMessage);
            }
            clsGlobal.hideLoading();
        },
        error: function (retDat) {
            clsGlobal.hideLoading();
        }
    });
}


//=======================
// HANDLER
//=======================

$('#btnSave').bind('click', function () {
    try {
        clsGlobal.getConfirmation("Save this data?", function (result) {
            if (result == true) {
                p_saveData();
            }
            else {
                return false;
            }
        });
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
  });
  
$('#btnNew').bind('click', function () { 
    try {
        p_showBlank();
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
  });


$('#btnGenerate').bind('click', function () {
    try {
        clsGlobal.getConfirmation("Generate ALL?", function (result) {
            if (result == true) {
                p_generateALL();
            }
            else {
                return false;
            }
        });
    } catch (ex) {
        clsGlobal.showAlert(ex);
    } 
});

 
