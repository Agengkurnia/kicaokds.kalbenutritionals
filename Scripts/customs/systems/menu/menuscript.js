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
    
    $("#txtID").val(clsGlobal.parseToInteger(objData.INT_MENU_ID));
    $("#txtName").val(clsGlobal.parseToString(objData.TXT_MENUNAME));
    $("#txtDescription").val(clsGlobal.parseToString(objData.TXT_DESCRIPTION));
    $("#txtLink").val(clsGlobal.parseToString(objData.TXT_LINK));
    $("#txtOrder").val(clsGlobal.parseToString(objData.INT_ORDER));

    p_PopulateParentAndSet(clsGlobal.parseToInteger(objData.INT_PARENT_ID.toString()));
    p_PopulateModuleAndSet(clsGlobal.parseToInteger(objData.INT_MODULE_ID.toString()));

    $('#chkActive').prop('checked', clsGlobal.ParseBooleanOracleToNET(objData.BIT_ACTIVE));
    $("#txtHiddenObject").val(JSON.stringify(objData));

    if ($("#txtID").val() == "" || $("#txtID").val() == "0") {
        $("#btnDelete").hide();
    } else {
        $("#btnDelete").show();
    }
}

function p_PopulateParentAndSet(txtValue) {
    clsGlobal.showLoading();
    $.ajax({
        type: "POST",
        url: "/Menu/PopulateParent",
        data: { __RequestVerificationToken: $('#FormLogin input[name=__RequestVerificationToken]').val() },
        datatype: "json",
        success: function (retDat) {
            if (retDat.bitSuccess == true) {
                if (retDat.objData != undefined) {
                    $('#ddlParent').empty();
                    $('#ddlParent').append($('<option>').text("-").prop('value', "0"));
                    for (var i = 0; i < retDat.objData.length; i++) {
                        $('#ddlParent').append($('<option>').text(retDat.objData[i].TXT_MENUNAME).prop('value', retDat.objData[i].INT_MENU_ID));
                    }

                    if (txtValue != "") {
                        $("#ddlParent").val(txtValue);
                    }
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

function p_PopulateModuleAndSet(txtValue) {
    clsGlobal.showLoading();
    $.ajax({
        type: "POST",
        url: "/Menu/PopulateModule",
        data: { __RequestVerificationToken: $('#FormLogin input[name=__RequestVerificationToken]').val() },
        datatype: "json",
        success: function (retDat) {
            if (retDat.bitSuccess == true) {
                if (retDat.objData != undefined) {
                    $('#ddlModule').empty();
                    $('#ddlModule').append($('<option>').text("-").prop('value', "0"));
                    for (var i = 0; i < retDat.objData.length; i++) {
                        $('#ddlModule').append($('<option>').text(retDat.objData[i].TXT_MODULENAME).prop('value', retDat.objData[i].INT_MODULE_ID));
                    }

                    if (txtValue != "") {
                        $("#ddlModule").val(txtValue);
                    }
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


function p_initiateData() {
    clsGlobal.showLoading();
    $.ajax({
        type: "POST",
        url: "/System/Menu/InitiateData",
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
    jsonData.INT_MENU_ID = clsGlobal.parseToInteger($("#txtID").val());
    jsonData.INT_PARENT_ID = clsGlobal.parseToInteger($("#ddlParent").val());
    jsonData.TXT_MENUNAME = clsGlobal.parseToString($("#txtName").val());
    jsonData.TXT_DESCRIPTION = clsGlobal.parseToString($("#txtDescription").val());
    jsonData.INT_MODULE_ID = clsGlobal.parseToInteger($("#ddlModule").val());
    jsonData.TXT_LINK = clsGlobal.parseToString($("#txtLink").val());
    jsonData.INT_ORDER = clsGlobal.parseToInteger($("#txtOrder").val());
    jsonData.BIT_ACTIVE = clsGlobal.ParseBooleanNETToOracle(clsGlobal.parseToBoolean($("#chkActive").prop("checked")));


    $("#txtHiddenObject").val(JSON.stringify(jsonData));

}


function p_txtID_TextChanged() {
    clsGlobal.showLoading();
    $.ajax({
        type: "POST",
        url: "/System/Menu/GetData",
        data: { txtID: $("#txtID").val(), __RequestVerificationToken: $('#frm1 input[name=__RequestVerificationToken]').val() },
        datatype: "json",
        success: function (retDat) {

            if (retDat.bitSuccess == true) {
                if (retDat.objData != undefined) {
                    $("#txtGUID").val(retDat.txtGUID);
                    p_DataToUI(retDat.objData);

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
        url: "/System/Menu/SaveData",
        data: { data: $("#txtHiddenObject").val(), txtGUID: $("#txtGUID").val(), __RequestVerificationToken: $('#frm1 input[name=__RequestVerificationToken]').val() },
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
        url: "/System/Menu/DeleteData",
        data: { data: $("#txtHiddenObject").val(), txtGUID: $("#txtGUID").val(), __RequestVerificationToken: $('#frm1 input[name=__RequestVerificationToken]').val() },
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
        //LOV = clsGlobal.generateLOV(MODULE_BRAND_SUBUMBRAND, "txtID");
        LOV = clsGlobal.generateLOV(MODULE_MENU, "txtID"); 
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

