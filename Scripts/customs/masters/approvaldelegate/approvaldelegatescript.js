//=======================
// VARIABLE GLOBAL
//=======================
var clsGlobal = new clsGlobalClass();
var LOV;
var bitLoading = false;
var dtFrom = $("#txtdtPeriodFrom").val();
var dtTo = $("#txtdtPeriodTo").val();


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
    p_initiateData();
}

function setChooseLOV(txtValue) {
    var arr = txtValue.split('|');
    switch (arr[0]) {
        case "txtID": $("#txtID").val(arr[1]);
            p_txtID_TextChanged();
            break;
        case "txtSenderID":
            p_settxtSenderID(arr[3], arr[2]);
            break;
        case "txtReceiverID":
            p_settxtReceiverID(arr[3], arr[2]);
            break; 

    }
    clsGlobal.closeLOV();
}


function p_settxtSenderID(txtNIK, txtNama) {
    $("#txtSenderID").val(txtNIK);
    $("#txtSenderName").val(txtNama);
}

function p_settxtReceiverID(txtNIK, txtNama) {
    $("#txtReceiverID").val(txtNIK);
    $("#txtReceiverName").val(txtNama);
}

function p_DataToUI(objData) {
    $("#txtID").val(clsGlobal.parseToInteger(objData.INT_ADE_HDR_ID));
    $("#txtDesc").val(clsGlobal.parseToString(objData.TXT_DESC));

    $("#txtSenderID").val(clsGlobal.parseToString(objData.TXT_EMPLOYEEID_SENDER));
    $("#txtSenderName").val(clsGlobal.parseToString(objData.TXT_SENDER_NAME));
    $("#txtReceiverID").val(clsGlobal.parseToString(objData.TXT_EMPLOYEEID_RECEIVER));
    $("#txtReceiverName").val(clsGlobal.parseToString(objData.TXT_RECEIVER_NAME));
    $('#chkActive').prop('checked', clsGlobal.ParseBooleanOracleToNET(objData.BIT_ACTIVE));

    $("#lblStatusFlow").html(clsGlobal.parseToString(objData.TXT_STATUSFLOW));

    $("#txtdtPeriodFrom").val(clsGlobal.parseToDateTimeFromJSON(objData.DTM_PERIOD_FROM, clsDateFormat));
    $("#txtdtPeriodTo").val(clsGlobal.parseToDateTimeFromJSON(objData.DTM_PERIOD_TO, clsDateFormat));
    dtFrom = $("#txtdtPeriodFrom").val();
    dtTo = $("#txtdtPeriodTo").val();

    p_SetHiddenObject(objData);

    if ($("#txtID").val() == "" || $("#txtID").val() == "0") {
        $("#btnSave").show();
    } else {
        $("#btnSave").hide();
        if (clsGlobal.ParseBooleanOracleToNET(objData.BIT_ACTIVE) == true) {
            $("#btnDeactive").show();
        } else {
            $("#btnDeactive").hide();
        }
    }

}

function p_SetHiddenObject(objDat) {
    $("#txtHiddenObject").val(JSON.stringify(objDat));

    //AutoNumeric.
    p_GenerateAutoNumeric();
    p_GenerateDateTimePicker();
}

function p_GenerateAutoNumeric() {
    
    $('.autonumeric').autoNumeric('init', { vMax: '9999999999999', vMin: '-9999999999999', aSep: ',', dGroup: '3', aDec: '.' });
}

function p_GenerateDateTimePicker() {
    
    $('.datetimepicker2').datepicker({
        autoclose: true
    });
}


function p_GetHiddenObject() {
    return JSON.parse($("#txtHiddenObject").val());
}

function p_initiateData() {
    clsGlobal.showLoading();
    $.ajax({
        type: "POST",
        url: "/Master/ApprovalDelegate/InitiateData",
        data: { __RequestVerificationToken: $('#frmIndex input[name=__RequestVerificationToken]').val() },
        datatype: "json",
        success: function (retDat) {

            if (retDat.bitSuccess == true) {
                if (retDat.objData != undefined) {
                    p_SetHiddenObject(retDat.objData);
                    p_DataToUI(retDat.objData);
                    $("#txtGUID").val(retDat.txtGUID);
                } else {
                    p_showBlank();
                }
                p_getParameterID();
                $("#txtGUID").val(retDat.txtGUID);
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


function p_getParameterID() {
    var id = $.getParameter("ID");
    if (id != undefined) {
        $("#txtID").val(id);
        p_txtID_TextChanged();
    }
}

function p_UIToData() {
    var jsonObj = [];
    jsonData = p_GetHiddenObject();
    jsonData.INT_ADE_HDR_ID = clsGlobal.parseToInteger($("#txtID").val());
    jsonData.TXT_DESC = clsGlobal.parseToString($("#txtDesc").val());
    jsonData.TXT_EMPLOYEEID_SENDER = clsGlobal.parseToString($("#txtSenderID").val());
    jsonData.TXT_EMPLOYEEID_RECEIVER = clsGlobal.parseToString($("#txtReceiverID").val());
    jsonData.DTM_PERIOD_FROM = clsGlobal.parseToString($("#txtdtPeriodFrom").val());
    jsonData.DTM_PERIOD_TO = clsGlobal.parseToString($("#txtdtPeriodTo").val());
    jsonData.BIT_ACTIVE = clsGlobal.ParseBooleanNETToOracle(clsGlobal.parseToBoolean($("#chkActive").prop("checked")));

    p_SetHiddenObject(jsonData);
    return $("#txtHiddenObject").val();

}


function p_EnableControl(bitApply) {
    
    //if (bitApply == true) {
    //    //$("#txtName").attr("disabled", "true"); 
    //    //$("#btnUpdatePeriode").show();         

    //    //$("#btnAddResponden").hide(); //.css("display", "none");
    //    //$(".txtRespondenUserName").each(function (index) {
    //    //    $(this).attr("disabled", "true");
    //    //});
    //    ////$(".btnLOVRespondenUserName").each(function (index) {
    //    ////    $(this).hide(); //.css("display", "none");
    //    ////}); 
    //    //$(".btnRespondenDelete").each(function (index) {
    //    //    $(this).hide(); //.css("display", "none");
    //    //});
    //    //$(".btnRespondenChange").each(function (index) {
    //    //    $(this).show(); //.css("display", "none");
    //    //});
    //    //$(".btnRespondenSendNotif").each(function (index) {
    //    //    $(this).show(); //.css("display", "none");
    //    //});

    //} else {
    //    //$("#txtName").removeAttr("disabled");  
    //    //$("#btnUpdatePeriode").hide();
            
    //    //$("#btnAddResponden").show(); //.removeAttr("display");
    //    //$(".txtRespondenUserName").each(function (index) {
    //    //    $(this).removeAttr("disabled");
    //    //});
    //    //$(".btnLOVRespondenUserName").each(function (index) {
    //    //    $(this).show(); //.removeClass("display");
    //    //});
    //    //$(".btnRespondenDelete").each(function (index) {
    //    //    $(this).show(); //.removeClass("display");
    //    //});
    //    //$(".btnRespondenChange").each(function (index) {
    //    //    $(this).hide(); //.removeClass("display");
    //    //});
    //    //$(".btnRespondenSendNotif").each(function (index) {
    //    //    $(this).hide(); //.removeClass("display");
    //    //});

    //}
}

function p_txtID_TextChanged() {
    clsGlobal.showLoading();
    $.ajax({
        type: "POST",
        url: "/Master/ApprovalDelegate/GetData",
        data: { txtID: $("#txtID").val(), __RequestVerificationToken: $('#frmIndex input[name=__RequestVerificationToken]').val() },
        datatype: "json",
        success: function (retDat) {

            if (retDat.bitSuccess == true) {
                if (retDat.objData != undefined) {
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
 
function p_saveData() {

    clsGlobal.showLoading();
    p_UIToData();
    $.ajax({
        type: "POST",
        url: "/Master/ApprovalDelegate/SaveData",
        data: { data: $("#txtHiddenObject").val(), txtGUID: $("#txtGUID").val(), __RequestVerificationToken: $('#frmIndex input[name=__RequestVerificationToken]').val() },
        datatype: "json",
        success: function (retDat) {
            
            if (retDat.bitSuccess == true) {
                p_DataToUI(retDat.objData);
                clsGlobal.getInformationMessage(retDat.txtMessage);
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

function p_deactiveData() {
    clsGlobal.showLoading();
    p_UIToData();
    $.ajax({
        type: "POST",
        url: "/Master/ApprovalDelegate/DeactiveData",
        data: { data: $("#txtHiddenObject").val(), txtGUID: $("#txtGUID").val(), __RequestVerificationToken: $('#frmIndex input[name=__RequestVerificationToken]').val() },
        datatype: "json",
        success: function (retDat) {
            
            if (retDat.bitSuccess == true) {
                p_DataToUI(retDat.objData);
                clsGlobal.getInformationMessage(retDat.txtMessage);
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


$('#btnLOVID').bind('click', function () {
    try {
        LOV = clsGlobal.generateLOV(MODULE_APPROVALDELEGATE, "txtID"); //MODULE_ApprovalDelegate
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
});


$('#btnLOVSender').bind('click', function () {
    try {
        LOV = clsGlobal.generateLOV(MODULE_USER, "txtSenderID");
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
});

$('#btnLOVReceiver').bind('click', function () {
    try {
        LOV = clsGlobal.generateLOV(MODULE_USER, "txtReceiverID");
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
});

$('#btnDeactive').bind('click', function () {
    try {
        clsGlobal.getConfirmation("Deactive this data?", function (result) {
            if (result == true) {
                p_deactiveData();
            }
            else {
                return false;
            }
        });
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
});
 

$('#txtdtPeriodFrom').bind('change', function () {
    try {
        
        if ($("#txtdtPeriodFrom").val() != "") {
            dtFrom = $("#txtdtPeriodFrom").val()
        } else {
            $("#txtdtPeriodFrom").val(dtFrom);
        } 
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
});



$('#txtdtPeriodTo').bind('change', function () {
    try {
        
        if ($("#txtdtPeriodTo").val() != "") {
            dtTo = $("#txtdtPeriodTo").val()
        } else {
            $("#txtdtPeriodTo").val(dtTo);
        }
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
});
