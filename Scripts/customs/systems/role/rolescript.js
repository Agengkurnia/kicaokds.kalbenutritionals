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
    //p_showPrevData(); 
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

    }
    clsGlobal.closeLOV();
}

function p_DataToUI(objData) {
    $("#txtID").val(clsGlobal.parseToInteger(objData.INT_ROLE_ID));
    $("#txtRoleName").val(clsGlobal.parseToString(objData.TXT_ROLENAME));

    $('#chkSuperuser').prop('checked', clsGlobal.ParseBooleanOracleToNET(objData.BIT_SUPERUSER));
    $("#txtHiddenObject").val(JSON.stringify(objData));

    if ($("#txtID").val() == "" || $("#txtID").val() == "0") {
        $("#btnDelete").hide();
    } else {
        $("#btnDelete").show();
    }
}

function p_initiateData() {
    clsGlobal.showLoading();
    $.ajax({
        type: "POST",
        url: "/System/Role/InitiateData",
        data: { __RequestVerificationToken: $('#frmRole input[name=__RequestVerificationToken]').val() },
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

    jsonData.INT_ROLE_ID = clsGlobal.parseToInteger($("#txtID").val());
    jsonData.TXT_ROLENAME = $("#txtRoleName").val().toString();
    jsonData.BIT_SUPERUSER = clsGlobal.ParseBooleanNETToOracle(clsGlobal.parseToBoolean($("#chkSuperuser").prop("checked")));

    $("#txtHiddenObject").val(JSON.stringify(jsonData));

}


function p_txtID_TextChanged() {
    clsGlobal.showLoading();
    $.ajax({
        type: "POST",
        url: "/System/Role/GetData",
        data: { txtID: $("#txtID").val(), __RequestVerificationToken: $('#frmRole input[name=__RequestVerificationToken]').val() },
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
        url: "/System/Role/SaveData",
        data: { data: $("#txtHiddenObject").val(), txtGUID: $("#txtGUID").val(), __RequestVerificationToken: $('#frmRole input[name=__RequestVerificationToken]').val() },
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

function p_deleteData() {
    clsGlobal.showLoading();
    p_UIToData();
    $.ajax({
        type: "POST",
        url: "/System/Role/DeleteData",
        data: { data: $("#txtHiddenObject").val(), txtGUID: $("#txtGUID").val(), __RequestVerificationToken: $('#frmRole input[name=__RequestVerificationToken]').val() },
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
        LOV = clsGlobal.generateLOV(MODULE_ROLE, "txtID");
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
});

$('#btnDelete').bind('click', function () {
    try {
        clsGlobal.getConfirmation("Delete this data?", function (result) {
            if (result == true) {
                p_deleteData();
            }
            else {
                return false;
            }
        });
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
});

