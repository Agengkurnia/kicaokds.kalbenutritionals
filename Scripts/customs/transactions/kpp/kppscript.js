//=======================
// VARIABLE GLOBAL
//=======================
var clsGlobal = new clsGlobalClass();
var LOV;
var bitLoading = false; 
var oTableActivity;
var oTableBranch;


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
    //p_showPrevData(); 
    p_InitiateActivity();
    p_InitiateBranch();
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
        case "txtDocNo": $("#txtDocNo").val(arr[1]);
            p_txtDocNo_TextChanged();
            break;
        case "txtParentDocNo":
            $("#txtParentDocNo").val(arr[1]);
            p_txtParentDocNo_TextChanged();
            break;
        case "txtRefDocNo":
            $("#txtRefDocNo").val(arr[1]);
            p_txtRefDocNo_TextChanged();
            break;
        case "txtGroupAccount":
            $("#txtGroupAccount").val(arr[1]);
            break;
        case "txtOutlet":
            $("#txtOutlet").val(arr[1]);
            $("#txtSupplierID").val(arr[2]);
            $("#txtSupplierName").val(arr[3]);
            p_txtOutlet_TextChanged();
            break;
        //case "txtSupplierID":
        //    $("#txtSupplierID").val(arr[1]);
        //    $("#txtSupplierName").val(arr[2]);
        //    $("#txtSupplierSiteID").val(arr[3]);
        //    $("#txtSupplierSiteName").val(arr[4]); 
        //    break; 
        case "txtBudgetType":
            $("#txtBudgetType").val(arr[1]); 
            break;
        case "txtPaymentType":
            $("#txtPaymentType").val(arr[1]); 
            break; 
        case "txtActivityCode":
            p_settxtActivityCode(arr[1], arr[2], arr[3], arr[4]);
            break;   
        case "txtBranchCode":
            p_settxtBranchCode(arr[1],arr[2]);
            break;
        case "txtSupplierSiteID":
            $("#txtSupplierSiteID").val(arr[1]);
            p_txtSupplierSiteID_TextChanged();
            break;
    }
    clsGlobal.closeLOV();
}

function p_DataToUI(objData) {
    $("#txtDocNo").val(clsGlobal.parseToString(objData.TXT_DOCNO));
    $("#dtmDate").val(clsGlobal.parseToDateTimeFromJSON(objData.CREATION_DATE, clsDateFormat));
    
    $("#txtParentDocNo").val(clsGlobal.parseToString(objData.TXT_PARENTDOCNO));
    $("#txtRefDocNo").val(clsGlobal.parseToString(objData.TXT_REFDOCNO));
    $("#txtGroupAccount").val(clsGlobal.parseToString(objData.TXT_GROUP_ACCOUNT));
    $("#txtOutlet").val(clsGlobal.parseToString(objData.TXT_OUTLET_NAME));

    $("#txtSupplierID").val(clsGlobal.parseToString(objData.TXT_SUPPLIER_ID));
    $("#txtSupplierName").val(clsGlobal.parseToString(objData.TXT_SUPPLIER_NAME));
    $("#txtSupplierSiteID").val(clsGlobal.parseToString(objData.TXT_SUPPLIER_SITE_CODE));
    $("#txtSupplierSiteName").val(clsGlobal.parseToString(objData.TXT_SUPPLIER_SITE_NAME));
    $("#txtBudgetType").val(clsGlobal.parseToString(objData.TXT_BUDGET_TYPE));
    $("#txtPaymentType").val(clsGlobal.parseToString(objData.TXT_PAYMENT_TYPE)); 
    $("#txtRemark").val(clsGlobal.parseToString(objData.TXT_REMARK));

    //$('#chkMontlyPromo').prop('checked', clsGlobal.ParseBooleanOracleToNET(objData.BIT_MONTHLY_PROMO));
    $('#rdoMonthlyYes').prop('checked', false);
    $('#rdoMonthlyNo').prop('checked', false);
    if (objData.BIT_MONTHLY_PROMO == "Y") {
        $('#rdoMonthlyYes').prop('checked', true);
    } else if (objData.BIT_MONTHLY_PROMO == "N") { 
        $('#rdoMonthlyNo').prop('checked', true);
    }
    //$('#chkNational').prop('checked', clsGlobal.ParseBooleanOracleToNET(objData.BIT_NATIONAL));
    $('#rdoNationalYes').prop('checked', false);
    $('#rdoNationalNo').prop('checked', false);
    if (objData.BIT_NATIONAL == "Y") {
        $('#rdoNationalYes').prop('checked', true);
    } else if (objData.BIT_NATIONAL == "N") {
        $('#rdoNationalNo').prop('checked', true);
    }
    p_checkMultipleSelect();
    p_PopulateBranchAndSet(clsGlobal.parseToString(objData.TXT_LIST_CABANG_PROMO));


    
    $("#ddlBranch").val(0).trigger("liszt:updated");
    //$("#ddlBranch").trigger("liszt:updated");
//    $('#ddlBranch')
//.append($('<option></option>')
//.val('BANDUNG 2')
//.attr('selected', 'selected')
//.html('BANDUNG 2')).trigger('liszt:updated');

    //// Choose Option 3
    //var inputText = "BANDUNG";
    //$("#ddlBranch").val(inputText);
    //$('#ddlBranch').trigger("chosen:updated");

    //$("#ddlBranch option:contains('" + inputText + "')").attr('selected', 'selected');
    //// must be triggered on the select _after_ the list is updated
    //$("#ddlBranch").trigger("liszt:updated");

     
    $("#dtmNeedByDate").val(clsGlobal.parseToDateTimeFromJSON(objData.DTM_NEED_BY_DATE, clsDateFormat));
    
    $("#lblStatusFlow").html(clsGlobal.parseToString(objData.TXT_STATUSFLOW));

    p_DataToUIActivity(objData.XXSHP_KDS_T_KPP_ACT);
    p_DataToUIBranch(objData.XXSHP_KDS_T_KPP_CAB);

    p_EnableControl(clsGlobal.ParseBooleanOracleToNET(objData.BIT_APPLY), objData);
    p_CheckForCancelCloseDocument(objData);

    p_SetHiddenObject(objData);

    if ($("#txtID").val() == "" || $("#txtID").val() == "0") {
        $("#btnDelete").hide();
    } else {
        $("#btnDelete").show();
    }
}


function p_checkMultipleSelect() {
    $('#ddlBranch').prop('disabled', true).trigger("chosen:updated");
    if ($('#rdoNationalYes').prop('checked') == true) {  
        $('#ddlBranch').prop('disabled', true).trigger("chosen:updated");
    }
    else if ($('#rdoNationalNo').prop('checked') == true) {
        $('#ddlBranch').prop('disabled', false).trigger("chosen:updated");
       
    }
}

function p_clearBranch() {
    p_PopulateBranchAndSet("");
}

function p_clearBranch() {
    p_PopulateBranchAndSet("");
}


function p_checkMultipleSelect() {
    $('#ddlBranch').prop('disabled', true).trigger("chosen:updated");
    if ($('#rdoNationalYes').prop('checked') == true) {  
        $('#ddlBranch').prop('disabled', true).trigger("chosen:updated");
    }
    else if ($('#rdoNationalNo').prop('checked') == true) {
        $('#ddlBranch').prop('disabled', false).trigger("chosen:updated");
       
    }
}

function p_clearBranch() {
    p_PopulateBranchAndSet("");
}



function p_CheckForCancelCloseDocument(objData) {
    $("#btnCancel").hide();
    $("#btnClose").hide();
    if (clsGlobal.ParseBooleanOracleToNET(objData.BIT_APPROVED) == true
        && clsGlobal.ParseBooleanOracleToNET(objData.BIT_CLOSED) == false
        && clsGlobal.ParseBooleanOracleToNET(objData.BIT_CANCELLED) == false
        && objData.TXT_PARENTDOCNO == "") {
        $("#btnClose").show();
        $("#btnCancel").show();
    }
}


function p_SetHiddenObject(objDat) {
    $("#txtHiddenObject").val(JSON.stringify(objDat));

    //AutoNumeric.
    p_GenerateAutoNumeric();
    p_GenerateDateTimePicker();
    //p_GenerateChosen();
}

function p_GenerateAutoNumeric() {
    
    $('.autonumeric').autoNumeric('init', { vMax: '9999999999999', vMin: '-9999999999999', aSep: ',', dGroup: '3', aDec: '.' });
}

function p_GenerateDateTimePicker() {
    
    $('.datetimepicker').datepicker({
        autoclose: true,
    });
   
}

function p_GenerateChosen() {
    
    $('.chosenBranch').chosen();  
}

function p_GenerateChosen() {
    
    $('.chosenBranch').chosen();  
}

function p_GetHiddenObject() {
    return JSON.parse($("#txtHiddenObject").val());
}

function p_initiateData() {
    clsGlobal.showLoading();
    $.ajax({
        type: "POST",
        url: "/Transaction/KPP/InitiateData",
        data: { __RequestVerificationToken: $('#frmKPP input[name=__RequestVerificationToken]').val() },
        datatype: "json",
        success: function (retDat) {
            
            if (retDat.bitSuccess == true) {
                if (retDat.objData != undefined) {
                    p_SetHiddenObject(retDat.objData);
                    p_DataToUI(retDat.objData);
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
        $("#txtDocNo").val(id);
        p_txtDocNo_TextChanged();
    }
}

function p_UIToData() {
    var jsonObj = [];
    jsonData = p_GetHiddenObject();

    jsonData.TXT_DOCNO = clsGlobal.parseToString($("#txtDocNo").val());
    jsonData.CREATION_DATE = clsGlobal.parseToString($("#dtmDate").val());
    jsonData.TXT_PARENTDOCNO = clsGlobal.parseToString($("#txtParentDocNo").val());
    jsonData.TXT_REFDOCNO = clsGlobal.parseToString($("#txtRefDocNo").val());
    jsonData.TXT_GROUP_ACCOUNT = clsGlobal.parseToString($("#txtGroupAccount").val());
    jsonData.TXT_OUTLET_NAME = clsGlobal.parseToString($("#txtOutlet").val());

    jsonData.TXT_SUPPLIER_ID = clsGlobal.parseToInteger($("#txtSupplierID").val());    
    jsonData.TXT_SUPPLIER_NAME = clsGlobal.parseToString($("#txtSupplierName").val());
    jsonData.TXT_SUPPLIER_SITE_CODE = clsGlobal.parseToString($("#txtSupplierSiteID").val());
    jsonData.TXT_SUPPLIER_SITE_NAME = clsGlobal.parseToString($("#txtSupplierSiteName").val());
    jsonData.TXT_BUDGET_TYPE = clsGlobal.parseToString($("#txtBudgetType").val());
    jsonData.TXT_PAYMENT_TYPE = clsGlobal.parseToString($("#txtPaymentType").val());
    jsonData.TXT_REMARK = clsGlobal.parseToString($("#txtRemark").val());

    //jsonData.BIT_MONTHLY_PROMO = clsGlobal.ParseBooleanNETToOracle(clsGlobal.parseToBoolean($("#chkMontlyPromo").prop("checked")));
    jsonData.BIT_MONTHLY_PROMO = "X";
    if ($('#rdoMonthlyYes').prop('checked') == true) {
        jsonData.BIT_MONTHLY_PROMO = "Y";
    } else if ($('#rdoMonthlyNo').prop('checked') == true) {
        jsonData.BIT_MONTHLY_PROMO = "N";
    }

    //jsonData.BIT_NATIONAL = clsGlobal.ParseBooleanNETToOracle(clsGlobal.parseToBoolean($("#chkNational").prop("checked")));    
    jsonData.BIT_NATIONAL = "X";
    if ($('#rdoNationalYes').prop('checked') == true) {
        jsonData.BIT_NATIONAL = "Y";
    } else if ($('#rdoNationalNo').prop('checked') == true) {
        jsonData.BIT_NATIONAL = "N";
    }

    
    var objArray = $("#ddlBranch").val();
    for (var i = 0; i < objArray.length; i++) {
        if (i == 0) {
            jsonData.TXT_LIST_CABANG_PROMO = objArray[i];
        } else {
            jsonData.TXT_LIST_CABANG_PROMO += "," + objArray[i];
        }
        
    }
    

    jsonData.DTM_NEED_BY_DATE = clsGlobal.parseToJSONDateFromDate($("#dtmNeedByDate").val(), clsDateFormat);

    p_SetHiddenObject(jsonData);
    return $("#txtHiddenObject").val();

}


function p_EnableControl(bitApply, objDat) {
    
    if (bitApply == true) {
        $("#btnSave").hide();
        $("#btnSubmit").hide();
        $("#btnApprovalHistory").show();

        $("#btnLOVRefDocNo").hide();
        $("#btnLOVParentDocNo").hide();
        $("#btnLOVGroupAccount").hide();
        $("#btnLOVOutlet").hide(); 
        $("#btnLOVBudgetType").hide();
        $("#btnLOVPaymentType").hide();
        $("#txtRemark").attr("disabled", "true");
        $("#chkMontlyPromo").attr("disabled", "true");
        $("#chkNational").attr("disabled", "true");

        $("#btnAddActivity").hide();
        $(".dtActivityPeriodFrom").each(function (index) {
            $(this).attr("disabled", "true");
        });
        $(".dtActivityPeriodTo").each(function (index) {
            $(this).attr("disabled", "true");
        });
        $(".txtActivityProgramDesc").each(function (index) {
            $(this).attr("disabled", "true");
        });
        $(".btnLOVActivityCode").each(function (index) {
            $(this).hide();
        });
        $(".btnActivityDelete").each(function (index) {
            $(this).hide();
        });

        $("#btnAddBranch").hide(); 
        $(".btnLOVBranchCode").each(function (index) {
            $(this).hide();
        });
        $(".btnBranchDelete").each(function (index) {
            $(this).hide();
        });
    } else if (objDat.TXT_PARENTDOCNO != "") {
        // ada Parent.
        $("#btnSave").show();
        $("#btnSubmit").show();
        $("#btnApprovalHistory").hide();

        $("#btnLOVRefDocNo").hide();
        $("#btnLOVParentDocNo").hide();
        $("#btnLOVGroupAccount").hide();
        $("#btnLOVOutlet").hide();
        $("#btnLOVBudgetType").hide();
        $("#btnLOVPaymentType").hide();
        $("#txtRemark").attr("disabled", "true");
        $("#chkMontlyPromo").attr("disabled", "true");
        $("#chkNational").attr("disabled", "true");

        $("#btnAddActivity").hide();

        $(".btnLOVActivityCode").each(function (index) {
            $(this).hide();
        });
        $(".btnActivityDelete").each(function (index) {
            $(this).hide();
        });

        $("#btnAddBranch").hide();
        $(".btnLOVBranchCode").each(function (index) {
            $(this).hide();
        });
        $(".btnBranchDelete").each(function (index) {
            $(this).hide();
        });
    } else {
        $("#btnSave").show();
        $("#btnSubmit").show();
        $("#btnApprovalHistory").hide();

        $("#btnLOVParentDocNo").show();
        $("#btnLOVRefDocNo").show();
        $("#btnLOVGroupAccount").show();
        $("#btnLOVOutlet").show();
        $("#btnLOVBudgetType").show();
        $("#btnLOVPaymentType").show();
        $("#txtRemark").removeAttr("disabled");
        $("#chkMontlyPromo").removeAttr("disabled");
        $("#chkNational").removeAttr("disabled");
            
        $("#btnAddActivity").show();
        $(".dtActivityPeriodFrom").each(function (index) {
            $(this).removeAttr("disabled");
        });
        $(".dtActivityPeriodTo").each(function (index) {
            $(this).removeAttr("disabled");
        });
        $(".txtActivityProgramDesc").each(function (index) {
            $(this).removeAttr("disabled");
        });
        $(".btnLOVActivityCode").each(function (index) {
            $(this).show();
        });
        $(".btnActivityDelete").each(function (index) {
            $(this).show();
        });

        $("#btnAddBranch").show(); 
        $(".btnLOVBranchCode").each(function (index) {
            $(this).show();
        });
        $(".btnBranchDelete").each(function (index) {
            $(this).show();
        });
    }
}

function p_txtDocNo_TextChanged() {
    clsGlobal.showLoading();
    $.ajax({
        type: "POST",
        url: "/Transaction/KPP/GetDataByTxtDocNo",
        data: { txtDocNo: $("#txtDocNo").val(), __RequestVerificationToken: $('#frmKPP input[name=__RequestVerificationToken]').val() },
        datatype: "json",
        success: function (retDat) {

            if (retDat.bitSuccess == true) {
                if (retDat.objData != undefined) {
                    p_DataToUI(retDat.objData);

                } else {
                    p_showBlank();
                }
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

//function p_txtSupplierID_TextChanged() {
//    clsGlobal.showLoading();
//    $.ajax({
//        type: "POST",
//        url: "/Master/Supplier/GetData",
//        data: { txtID: $("#txtSupplierID").val(), __RequestVerificationToken: $('#frmKPP input[name=__RequestVerificationToken]').val() },
//        datatype: "json",
//        success: function (retDat) {
//            
//            if (retDat.bitSuccess == true) {
//                if (retDat.objData != undefined) { 
//                    $("#txtSupplierName").val(clsGlobal.parseToString(retDat.objData.VENDOR_NAME)); 
//                } else {
//                    p_showBlank();
//                }
//            } else {
//                clsGlobal.getAlert(retDat.txtMessage);
//            }
//            clsGlobal.hideLoading();
//        },
//        error: function (retDat) {
//            clsGlobal.hideLoading();
//        }
//    });
//}


//function p_txtSupplierSiteID_TextChanged() {
//    clsGlobal.showLoading();
//    $.ajax({
//        type: "POST",
//        url: "/Master/Supplier/GetDataSite",
//        data: { txtID: $("#txtSupplierSiteID").val(), __RequestVerificationToken: $('#frmKPP input[name=__RequestVerificationToken]').val() },
//        datatype: "json",
//        success: function (retDat) {

//            if (retDat.bitSuccess == true) {
//                if (retDat.objData != undefined) { 
//                    $("#txtSupplierSiteName").val(clsGlobal.parseToString(retDat.objData.VENDOR_SITE_CODE));
//                } else {
//                    p_showBlank();
//                }
//            } else {
//                clsGlobal.getAlert(retDat.txtMessage);
//            }
//            clsGlobal.hideLoading();
//        },
//        error: function (retDat) {
//            clsGlobal.hideLoading();
//        }
//    });
//}


function p_txtRefDocNo_TextChanged() {
    clsGlobal.showLoading();
    $.ajax({
        type: "POST",
        url: "/Transaction/KPP/GetDataParentBytxtRefDocNo",
        data: { txtRefDocNo: $("#txtParentDocNo").val(), __RequestVerificationToken: $('#frmKPP input[name=__RequestVerificationToken]').val() },
        datatype: "json",
        success: function (retDat) {

            if (retDat.bitSuccess == true) {
                if (retDat.objData != undefined) {
                    p_DataToUI(retDat.objData);

                } else {
                    p_showBlank();
                }
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


function p_txtParentDocNo_TextChanged() {
    clsGlobal.showLoading();
    $.ajax({
        type: "POST",
        url: "/Transaction/KPP/GetDataParentBytxtRefDocNo",
        data: { txtRefDocNo: $("#txtParentDocNo").val(), __RequestVerificationToken: $('#frmKPP input[name=__RequestVerificationToken]').val() },
        datatype: "json",
        success: function (retDat) {

            if (retDat.bitSuccess == true) {
                if (retDat.objData != undefined) {
                    p_DataToUI(retDat.objData);

                } else {
                    p_showBlank();
                }
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

function p_saveData() {

    clsGlobal.showLoading();
    p_UIToData();
    $.ajax({
        type: "POST",
        url: "/Transaction/KPP/SaveData",
        data: { data: $("#txtHiddenObject").val(), txtGUID: $("#txtGUID").val(), __RequestVerificationToken: $('#frmKPP input[name=__RequestVerificationToken]').val() },
        datatype: "json",
        success: function (retDat) {
            
            if (retDat.bitSuccess == true) {
                p_DataToUI(retDat.objData);
                clsGlobal.getInformationMessage(retDat.txtMessage);
            } else {
                clsGlobal.getAlert(retDat.txtMessage);
            }
            clsGlobal.hideLoading();
            $("#txtGUID").val(retDat.txtGUID);
        },
        error: function (retDat) {
            
            clsGlobal.hideLoading();
        }
    });
}

function p_submitData() {

    clsGlobal.showLoading();
    p_UIToData();
    $.ajax({
        type: "POST",
        url: "/Transaction/KPP/SubmitData",
        data: { data: $("#txtHiddenObject").val(), txtGUID: $("#txtGUID").val(), __RequestVerificationToken: $('#frmKPP input[name=__RequestVerificationToken]').val() },
        datatype: "json",
        success: function (retDat) {
            
            if (retDat.bitSuccess == true) {
                p_DataToUI(retDat.objData);
                clsGlobal.getInformationMessage(retDat.txtMessage);
            } else {
                clsGlobal.getAlert(retDat.txtMessage);
            }
            clsGlobal.hideLoading();
            $("#txtGUID").val(retDat.txtGUID);
        },
        error: function (retDat) {
            
            clsGlobal.hideLoading();
        }
    });
}


function p_printoutData() {

    clsGlobal.showLoading();
    p_UIToData();
    $.ajax({
        type: "POST",
        url: "/Transaction/KPP/PrintoutToPDF",
        data: { data: $("#txtHiddenObject").val(), txtGUID: $("#txtGUID").val(), __RequestVerificationToken: $('#frmKPP input[name=__RequestVerificationToken]').val() },
        datatype: "json",
        success: function (retDat) {
            
            if (retDat.bitSuccess == true) {
                window.open(retDat.objData,'_blank');
            } else {
                clsGlobal.getAlert(retDat.txtMessage);
            }
            clsGlobal.hideLoading();
            $("#txtGUID").val(retDat.txtGUID);
        },
        error: function (retDat) {
            
            clsGlobal.hideLoading();
        }
    });
}

function p_closeDocument() {

    clsGlobal.showLoading();
    p_UIToData();
    $.ajax({
        type: "POST",
        url: "/Transaction/KPP/CloseDocument",
        data: { data: $("#txtHiddenObject").val(), txtClosedReason: $("#txtClosedReason").val(), txtGUID: $("#txtGUID").val(), __RequestVerificationToken: $('#frmKPP input[name=__RequestVerificationToken]').val() },
        datatype: "json",
        success: function (retDat) {
            
            if (retDat.bitSuccess == true) {
                p_DataToUI(retDat.objData);
                clsGlobal.getInformationMessage(retDat.txtMessage);
            } else {
                clsGlobal.getAlert(retDat.txtMessage);
            }
            clsGlobal.hideLoading();
            $("#txtGUID").val(retDat.txtGUID);
        },
        error: function (retDat) {
            
            clsGlobal.hideLoading();
        }
    });
}

function p_cancelDocument() {

    clsGlobal.showLoading();
    p_UIToData();
    $.ajax({
        type: "POST",
        url: "/Transaction/KPP/CancelDocument",
        data: { data: $("#txtHiddenObject").val(), txtGUID: $("#txtGUID").val(), __RequestVerificationToken: $('#frmKPP input[name=__RequestVerificationToken]').val() },
        datatype: "json",
        success: function (retDat) {
            
            if (retDat.bitSuccess == true) {
                p_DataToUI(retDat.objData);
                clsGlobal.getInformationMessage(retDat.txtMessage);
            } else {
                clsGlobal.getAlert(retDat.txtMessage);
            }
            clsGlobal.hideLoading();
            $("#txtGUID").val(retDat.txtGUID);
        },
        error: function (retDat) {
            
            clsGlobal.hideLoading();
        }
    });
}

//function p_deleteData() {
//    clsGlobal.showLoading();
//    p_UIToData();
//    $.ajax({
//        type: "POST",
//        url: "/Transaction/KPP/DeleteData",
//        data: { data: $("#txtHiddenObject").val(), __RequestVerificationToken: $('#frmKPP input[name=__RequestVerificationToken]').val() },
//        datatype: "json",
//        success: function (retDat) {
//            
//            if (retDat.bitSuccess == true) {
//                p_DataToUI(retDat.objData);
//                clsGlobal.getInformationMessage(retDat.txtMessage);
//            } else {
//                clsGlobal.getAlert(retDat.txtMessage);
//            }
//            clsGlobal.hideLoading();
//        },
//        error: function (retDat) {
//            clsGlobal.hideLoading();
//        }
//    });
//}

function p_txtRefDocNo_TextChanged() {
    clsGlobal.showLoading();
    p_UIToData();
    $.ajax({
        type: "POST",
        url: "/Transaction/MKPP/GetDataByTxtDocNo",
        data: { txtDocNo: $("#txtRefDocNo").val(), txtGUID: $("#txtGUID").val(), __RequestVerificationToken: $('#frmKPP input[name=__RequestVerificationToken]').val() },
        datatype: "json",
        success: function (retDat) {
            
            if (retDat.bitSuccess == true) { 
                $("#txtGroupAccount").val(clsGlobal.parseToString(retDat.objData.TXT_GROUP_ACCOUNT));
                $("#txtBudgetType").val(clsGlobal.parseToString(retDat.objData.TXT_BUDGET_TYPE));
            }
            clsGlobal.hideLoading();
            $("#txtGUID").val(retDat.txtGUID);
        },
        error: function (retDat) {
            
            clsGlobal.hideLoading();
        }
    });
}

function p_txtOutlet_TextChanged() {
    
    p_UIToData();
    clsGlobal.showLoading(); 
    $.ajax({
        type: "POST",
        url: "/Transaction/KPP/GetSupplierSite",
        data: { data: $("#txtHiddenObject").val() , txtSupplierID: $("#txtSupplierID").val(), txtSupplierName: $("#txtSupplierName").val(), txtGUID: $("#txtGUID").val(), __RequestVerificationToken: $('#frmKPP input[name=__RequestVerificationToken]').val() },
        datatype: "json",
        success: function (retDat) {
            
            if (retDat.bitSuccess == true) {
                //$("#txtSupplierSiteID").val(retDat.objData.VENDOR_SITE_ID);
                //$("#txtSupplierSiteName").val(retDat.objData.VENDOR_SITE_CODE); 
                if (retDat.objData != undefined) {
                    p_DataToUI(retDat.objData);
                }
            }
            clsGlobal.hideLoading();
            $("#txtGUID").val(retDat.txtGUID);
        },
        error: function (retDat) {
            
            clsGlobal.hideLoading();
        }
    });
}


function p_PopulateBranchAndSet(txtValue) {
    clsGlobal.showLoading();
    
    $.ajax({
        type: "POST",
        url: "/Main/PopulateBranchActive",
        data: { __RequestVerificationToken: $('#frmKPP input[name=__RequestVerificationToken]').val() },
        datatype: "json",
        success: function (retDat) {
            if (retDat.bitSuccess == true) {
                
                if (retDat.objData != undefined) {
                    $('#ddlBranch').empty();                    
                    for (var i = 0; i < retDat.objData.length; i++) {
                        $('#ddlBranch').append($('<option>').text(retDat.objData[i].txtBranchName).prop('value', retDat.objData[i].txtBranchName));
                    }
                     
                    p_GenerateChosen();

                    var valueSplit = txtValue.split(',');
                    //for (var i = 0; i < valueSplit.length; i++) {
                    //    $("#ddlBranch").val(valueSplit[i]).trigger("chosen:updated");
                    //} 
                    $("#ddlBranch").val(valueSplit).trigger("chosen:updated");
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


function p_PopulateBranchAndSet(txtValue) {
    clsGlobal.showLoading();
    
    $.ajax({
        type: "POST",
        url: "/Main/PopulateBranchActive",
        data: { __RequestVerificationToken: $('#frmKPP input[name=__RequestVerificationToken]').val() },
        datatype: "json",
        success: function (retDat) {
            if (retDat.bitSuccess == true) {
                
                if (retDat.objData != undefined) {
                    $('#ddlBranch').empty();                    
                    for (var i = 0; i < retDat.objData.length; i++) {
                        $('#ddlBranch').append($('<option>').text(retDat.objData[i].txtBranchName).prop('value', retDat.objData[i].txtBranchName));
                    }
                     
                    p_GenerateChosen();

                    var valueSplit = txtValue.split(',');
                    //for (var i = 0; i < valueSplit.length; i++) {
                    //    $("#ddlBranch").val(valueSplit[i]).trigger("chosen:updated");
                    //} 
                    $("#ddlBranch").val(valueSplit).trigger("chosen:updated");
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


function p_PopulateBranchAndSet(txtValue) {
    clsGlobal.showLoading();
    
    $.ajax({
        type: "POST",
        url: "/Main/PopulateBranchActive",
        data: { __RequestVerificationToken: $('#frmKPP input[name=__RequestVerificationToken]').val() },
        datatype: "json",
        success: function (retDat) {
            if (retDat.bitSuccess == true) {
                
                if (retDat.objData != undefined) {
                    $('#ddlBranch').empty();                    
                    for (var i = 0; i < retDat.objData.length; i++) {
                        $('#ddlBranch').append($('<option>').text(retDat.objData[i].txtBranchName).prop('value', retDat.objData[i].txtBranchName));
                    }
                     
                    p_GenerateChosen();

                    var valueSplit = txtValue.split(',');
                    //for (var i = 0; i < valueSplit.length; i++) {
                    //    $("#ddlBranch").val(valueSplit[i]).trigger("chosen:updated");
                    //} 
                    $("#ddlBranch").val(valueSplit).trigger("chosen:updated");
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


// ====================================================
//  ACTIVITY
// ====================================================

function p_DataToUIActivity(XXSHP_KDS_T_KPP_ACT) {
    
    oTableActivity.clear();
    for (var i = 0; i < XXSHP_KDS_T_KPP_ACT.length; i++) {
        XXSHP_KDS_T_KPP_ACT[i].intIndex = i;
        oTableActivity.row.add(XXSHP_KDS_T_KPP_ACT[i]);
    }
    oTableActivity.draw(false);

    var objDat = p_GetHiddenObject();
    objDat.XXSHP_KDS_T_KPP_ACT = XXSHP_KDS_T_KPP_ACT;
    p_SetHiddenObject(objDat);
}


$('#btnAddActivity').on('click', function () {
    try{
        p_AddRowActivity();
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
});

function p_AddRowActivity() {
    
    p_UIToData();
    var objData = p_GetHiddenObject();
    if (objData.TXT_SUPPLIER_ID == 0) {
        throw "Kolom Supplier harus di isi!";
    }
    if (objData.TXT_BUDGET_TYPE == 0) {
        throw "Kolom tipe budget harus di isi!";
    }
    if (objData.TXT_PAYMENT_TYPE == 0) {
        throw "Kolom tipe pembayaran harus di isi!";
    }

    clsGlobal.showLoading(); 
    $.ajax({
        type: "POST",
        url: "/Transaction/KPP/AddRowActivity",
        data: { data: $("#txtHiddenObject").val(), __RequestVerificationToken: $('#frmKPP input[name=__RequestVerificationToken]').val() },
        datatype: "json",
        success: function (retDat) {

            if (retDat.bitSuccess == true) {
                if (retDat.objData != undefined) {
                    p_SetHiddenObject(retDat.objData);
                    p_DataToUIActivity(retDat.objData.XXSHP_KDS_T_KPP_ACT);
                    oTableActivity.page('last').draw(false);
                }
            } else {
                clsGlobal.getAlert(retDat.txtMessage);
            }
            clsGlobal.hideLoading();
            $("#txtGUID").val(retDat.txtGUID);
        },
        error: function (retDat) {
            clsGlobal.hideLoading();
        }
    });
}

function p_InitiateActivity() {
    // Format datatable  
    
    oTableActivity = $('#dtActivity').DataTable({
        "bPaginate": true,
        "bSort": false,
        searching: true,
        "aLengthMenu": [[5, 10, 25, 50, 75, 100], [5, 10, 25, 50, 75, 100]],
        "iDisplayLength": 5,
        "type": "POST",
        "scrollX": true,
        aoColumnDefs: [
            {
                aTargets: [0],
                mRender: function (data, type, full) {
                    return '<div id="lblActivityNoValue"> ' + (full.intIndex + 1) + ' </div>';
                }
            }, 
           {
               aTargets: [1],
               mRender: function (data, type, full) {
                   return '     <div class="input-group"> ' +
                            '       <div class="input-group-btn"> ' +
                            '           <button type="button" class="btn btn-danger btnLOVActivityCode" id="btnLOVActivityCode" onclick="p_btnLOVActivityCode_Click(this,' + full.intIndex + ')"> <i class="fa fa-search"></i></button> ' +
                            '       </div> ' +
                            '       <div class="input-group-btn" style="width:60px;"> ' +
                            '       <input type="text" class="form-control txtActivityCode" id="txtActivityCode" onchange="p_txtActivityCode_Changed(this,' + full.intIndex + ')"  value="' + full.TXT_ACTIVITYCODE + '" disabled> ' +
                            '       </div> ' + 
                            '   </div>';
               }
           },
           {
               aTargets: [2],
               mRender: function (data, type, full) {
                   return '<div >  <input type="text" class="form-control txtActivityProgramDesc text-uppercase" id="txtActivityProgramDesc' + full.intIndex + '" onchange="p_txtActivityProgramDesc_Changed(this,' + full.intIndex + ')"  value="' + full.TXT_PROGRAMDESC + '" disabled>  </div>';
               }
           },
           {
               aTargets: [3],
               mRender: function (data, type, full) {
                   return '<div >  <input type="text" class="form-control dtActivityPeriodFrom datetimepicker"  style="width:100px;"  id="dtActivityPeriodFrom' + full.intIndex + '" onchange="p_dtActivityPeriodFrom_Changed(this,' + full.intIndex + ')"  value="' + clsGlobal.parseToDateTimeFromJSON(full.DTM_PERIOD_FROM, clsDateFormat) + '" disabled>  </div>';
               }
           },
           {
               aTargets: [4],
               mRender: function (data, type, full) {
                   return '<div >  <input type="text" class="form-control dtActivityPeriodTo datetimepicker" style="width:100px;" id="dtActivityPeriodTo' + full.intIndex + '" onchange="p_dtActivityPeriodTo_Changed(this,' + full.intIndex + ')"  value="' + clsGlobal.parseToDateTimeFromJSON(full.DTM_PERIOD_TO, clsDateFormat) + '" disabled>  </div>';
               }
           }, 
           {
               aTargets: [5],
               mRender: function (data, type, full) {                  
                   return '<div id="lblActivityAmount" class="text-right" style="width:100px;"> ' + clsGlobal.FormatMoney(full.DEC_AMOUNT, 0) + ' </div>';
               }
           },
           {
               aTargets: [6],
               mRender: function (data, type, full) {
                   return '<div > <input type="button" class="btn btn-info btnActivitySubbrand" id="btnActivitySubbrand" onclick="p_btnActivitySubbrand_Click(this,' + full.intIndex + ')"  value="Budget" >  </div>';
               }
           },
            {
                aTargets: [7],
                mRender: function (data, type, full) {
                    return '<div > <input type="button" class="btn btn-warning btnActivityDelete" id="btnActivityDelete" onclick="p_btnActivityDelete_Click(this,' + full.intIndex + ')"  value="Delete" >  </div>';
                }
            }
        ]
    });

    $("#dtActivity").css("width", "100%"); 
    $('#dtActivity tbody').on('click', 'tr', function () {
        if (!$(this).hasClass('selected')) {
            oTableActivity.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
        }
    });
}

function p_GetSelectedActivityRow() {
    var intIndex = clsGlobal.parseToInteger(oTableActivity.$('tr.selected').find("#lblActivityNoValue").html()) - 1;
    return intIndex;
}
 
function p_btnLOVActivityCode_Click(objCaller, intIndex) {
    LOV = clsGlobal.generateLOV(MODULE_ACTIVITY_BY_MKPP, "txtActivityCode", $("#txtRefDocNo").val() + "|" + $("#txtOutlet").val());
}

function p_settxtActivityCode(txtValue,txtvalue2,txtvalue3,txtvalue4) {
    
    var intSelectedIndex = p_GetSelectedActivityRow();
    var intRowIndex = 0;
    var objDat = p_GetHiddenObject();
    oTableActivity.rows().every(function (rowIdx, tableLoop, rowLoop) {
        
        var d = this.data();
        if (intRowIndex == intSelectedIndex) {
            d.intIndex = intRowIndex; // update data source for the row 
              
            d.TXT_ACTIVITYCODE = txtValue;
            d.TXT_ACTIVITYNAME = txtValue;
            d.TXT_PROGRAMDESC = txtvalue2;
            d.DTM_PERIOD_FROM = clsGlobal.parseToJSONDateFromDate(txtvalue3, clsDateFormat);
            d.DTM_PERIOD_TO = clsGlobal.parseToJSONDateFromDate(txtvalue4, clsDateFormat);

            objDat.XXSHP_KDS_T_KPP_ACT[intRowIndex].TXT_ACTIVITYCODE = txtValue;            
            objDat.XXSHP_KDS_T_KPP_ACT[intRowIndex].TXT_ACTIVITYNAME = txtValue;
            objDat.XXSHP_KDS_T_KPP_ACT[intRowIndex].TXT_PROGRAMDESC = txtvalue2;
            objDat.XXSHP_KDS_T_KPP_ACT[intRowIndex].DTM_PERIOD_FROM = clsGlobal.parseToJSONDateFromDate(txtvalue3, clsDateFormat);
            objDat.XXSHP_KDS_T_KPP_ACT[intRowIndex].DTM_PERIOD_TO = clsGlobal.parseToJSONDateFromDate(txtvalue4, clsDateFormat);

            d.TXT_PROGRAMDESC = objDat.XXSHP_KDS_T_KPP_ACT[intRowIndex].TXT_PROGRAMDESC
            d.DTM_PERIOD_FROM = objDat.XXSHP_KDS_T_KPP_ACT[intRowIndex].DTM_PERIOD_FROM
            d.DTM_PERIOD_TO = objDat.XXSHP_KDS_T_KPP_ACT[intRowIndex].DTM_PERIOD_TO
            d.DEC_AMOUNT = objDat.XXSHP_KDS_T_KPP_ACT[intRowIndex].DEC_AMOUNT

            this.invalidate(); // invalidate the data DataTables has cached for this row         
            p_EnableControl(clsGlobal.ParseBooleanOracleToNET(objDat.BIT_APPLY), objDat);
        }

        intRowIndex++;
    });

    p_SetHiddenObject(objDat);
}
 
function p_txtActivityProgramDesc_Changed(objCaller, intIndex) {
    
    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());
    for (i = 0; i < objData.XXSHP_KDS_T_KPP_ACT.length; i++) {
        // Cari Index-nya.
        if (objData.XXSHP_KDS_T_KPP_ACT[i].intIndex == intIndex) {
            // Ketemu, mulai dari sini:
            objData.XXSHP_KDS_T_KPP_ACT[i].TXT_PROGRAMDESC = objCaller.value;
            break;
        }
    }
    p_SetHiddenObject(objData);
}

function p_dtActivityPeriodFrom_Changed(objCaller, intIndex) {
    
    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());
    for (i = 0; i < objData.XXSHP_KDS_T_KPP_ACT.length; i++) {
        // Cari Index-nya.
        if (objData.XXSHP_KDS_T_KPP_ACT[i].intIndex == intIndex) {
            // Ketemu, mulai dari sini:
            if (clsGlobal.parseToString(objCaller.value) != "") {
                objData.XXSHP_KDS_T_KPP_ACT[i].DTM_PERIOD_FROM = objCaller.value;
            } else {
                objCaller.value = clsGlobal.parseToDateTimeFromJSON(objData.XXSHP_KDS_T_KPP_ACT[i].DTM_PERIOD_FROM, clsDateFormat)
            }
            break;
        }
    }
    p_SetHiddenObject(objData);
}

function p_dtActivityPeriodTo_Changed(objCaller, intIndex) {
    
    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());
    for (i = 0; i < objData.XXSHP_KDS_T_KPP_ACT.length; i++) {
        // Cari Index-nya.
        if (objData.XXSHP_KDS_T_KPP_ACT[i].intIndex == intIndex) {
            // Ketemu, mulai dari sini:
            if (clsGlobal.parseToString(objCaller.value) != "") {
                objData.XXSHP_KDS_T_KPP_ACT[i].DTM_PERIOD_TO = objCaller.value;
            } else {
                objCaller.value = clsGlobal.parseToDateTimeFromJSON(objData.XXSHP_KDS_T_KPP_ACT[i].DTM_PERIOD_TO, clsDateFormat)
            }
            break;
        }
    }
    p_SetHiddenObject(objData);
}
 
function p_btnActivitySubbrand_Click(objCaller, intIndex) {
    
    try {
        // Parse dari HiddenObject->JSON
        var objData = JSON.parse(p_UIToData());
        for (i = 0; i < objData.XXSHP_KDS_T_KPP_ACT.length; i++) {
            // Cari Index-nya.
            if (objData.XXSHP_KDS_T_KPP_ACT[i].intIndex == intIndex) {
                // Ketemu, mulai dari sini:

                // Validasi
                if (objData.XXSHP_KDS_T_KPP_ACT[i].TXT_ACTIVITYCODE == "") {                    
                    throw "Activity must be filled!";
                } 

                var fancyboxdata = p_GetHiddenObject();
                LOV = clsGlobal.generatePopUpIframe($(location).attr('protocol') + "//" + $(location).attr('host') + "/Transaction/KPP/Subbrand?intIndex=" + intIndex, "btnActivitySubbrand", fancyboxdata);
                break;
            }
        }
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
}

function p_setSubbrand() {
    
    var intSelectedIndex = p_GetSelectedActivityRow();
    var intRowIndex = 0;
    var objDat = p_GetHiddenObject();
    // Calculate Total Alokasi.
    objDat.XXSHP_KDS_T_KPP_ACT[intSelectedIndex].DEC_AMOUNT = 0;
    for (i = 0; i < objDat.XXSHP_KDS_T_KPP_ACT[intSelectedIndex].XXSHP_KDS_T_KPP_SUB.length; i++) { 
        objDat.XXSHP_KDS_T_KPP_ACT[intSelectedIndex].DEC_AMOUNT += objDat.XXSHP_KDS_T_KPP_ACT[intSelectedIndex].XXSHP_KDS_T_KPP_SUB[i].DEC_AMOUNT;
    }

    // Show ke table.
    oTableActivity.rows().every(function (rowIdx, tableLoop, rowLoop) {
        
        var d = this.data();
        if (intRowIndex == intSelectedIndex) {
            d.intIndex = intRowIndex; // update data source for the row 

            d.DEC_AMOUNT = objDat.XXSHP_KDS_T_KPP_ACT[intSelectedIndex].DEC_AMOUNT;
            d.TXT_ACTIVITYCODE = objDat.XXSHP_KDS_T_KPP_ACT[intSelectedIndex].TXT_ACTIVITYCODE;
            d.TXT_ACTIVITYNAME = objDat.XXSHP_KDS_T_KPP_ACT[intSelectedIndex].TXT_ACTIVITYNAME;
            d.TXT_PROGRAMDESC = objDat.XXSHP_KDS_T_KPP_ACT[intSelectedIndex].TXT_PROGRAMDESC;
            d.DTM_PERIOD_FROM = objDat.XXSHP_KDS_T_KPP_ACT[intSelectedIndex].DTM_PERIOD_FROM
            d.DTM_PERIOD_TO = objDat.XXSHP_KDS_T_KPP_ACT[intSelectedIndex].DTM_PERIOD_TO;

            this.invalidate(); // invalidate the data DataTables has cached for this row         
            p_EnableControl(clsGlobal.ParseBooleanOracleToNET(objDat.BIT_APPLY), objDat);
        }

        intRowIndex++;
    });

    p_SetHiddenObject(objDat);
}
 
function p_btnActivityDelete_Click(objCaller, intIndex) {
    
    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());
    for (i = 0; i < objData.XXSHP_KDS_T_KPP_ACT.length; i++) {
        // Cari Index-nya.
        if (objData.XXSHP_KDS_T_KPP_ACT[i].intIndex == intIndex) {
            // Ketemu, mulai dari sini:
            // Remove from list.
            objData.XXSHP_KDS_T_KPP_ACT.splice(i, 1);

            //var row = oTableActivity.row($(this).parents('tr'));
            //var rowNode = row.node();
            //row.remove().draw();
            oTableActivity.row(i).remove().draw(false);
            break;
        }
    }
    p_SetHiddenObject(objData);
    p_RefreshNumberActivity();
}

function p_RefreshNumberActivity() {
    
    var intRowIndex = 0;
    var objDat = p_GetHiddenObject();
    oTableActivity.rows().every(function (rowIdx, tableLoop, rowLoop) {
        
        var d = this.data();
        d.intIndex = intRowIndex; // update data source for the row
        objDat.XXSHP_KDS_T_KPP_ACT[intRowIndex].intIndex = d.intIndex;

        d.TXT_ACTIVITYCODE = objDat.XXSHP_KDS_T_KPP_ACT[intRowIndex].TXT_ACTIVITYCODE;
        d.TXT_ACTIVITYNAME = objDat.XXSHP_KDS_T_KPP_ACT[intRowIndex].TXT_ACTIVITYNAME;
        d.TXT_PROGRAMDESC = objDat.XXSHP_KDS_T_KPP_ACT[intRowIndex].TXT_PROGRAMDESC;
        d.DTM_PERIOD_FROM = objDat.XXSHP_KDS_T_KPP_ACT[intRowIndex].DTM_PERIOD_FROM;
        d.DTM_PERIOD_TO = objDat.XXSHP_KDS_T_KPP_ACT[intRowIndex].DTM_PERIOD_TO;
        d.DEC_AMOUNT = objDat.XXSHP_KDS_T_KPP_ACT[intRowIndex].DEC_AMOUNT;
         
        intRowIndex++;
        this.invalidate(); // invalidate the data DataTables has cached for this row         
    });

    // Draw once all updates are done
    oTableActivity.draw(false);
    p_SetHiddenObject(objDat);
}





// ====================================================
//  Branch
// ====================================================

function p_DataToUIBranch(XXSHP_KDS_T_KPP_CAB) {
    
    oTableBranch.clear();
    for (var i = 0; i < XXSHP_KDS_T_KPP_CAB.length; i++) {
        XXSHP_KDS_T_KPP_CAB[i].intIndex = i;
        oTableBranch.row.add(XXSHP_KDS_T_KPP_CAB[i]);
    }
    oTableBranch.draw(false);

    var objDat = p_GetHiddenObject();
    objDat.XXSHP_KDS_T_KPP_CAB = XXSHP_KDS_T_KPP_CAB;
    p_SetHiddenObject(objDat);
}

$('#btnAddBranch').on('click', function () {
    try {
        p_AddRowBranch();
    } catch (ex) {
        clsGlobal.showAlert(ex);
    } 
});

function p_AddRowBranch() {
    
    clsGlobal.showLoading();
    $.ajax({
        type: "POST",
        url: "/Transaction/KPP/AddRowBranch",
        data: { data: $("#txtHiddenObject").val(), __RequestVerificationToken: $('#frmKPP input[name=__RequestVerificationToken]').val() },
        datatype: "json",
        success: function (retDat) {

            if (retDat.bitSuccess == true) {
                if (retDat.objData != undefined) {
                    p_SetHiddenObject(retDat.objData);
                    p_DataToUIBranch(retDat.objData.XXSHP_KDS_T_KPP_CAB);
                    oTableBranch.page('last').draw(false);
                }
            } else {
                clsGlobal.getAlert(retDat.txtMessage);
            }
            clsGlobal.hideLoading();
            $("#txtGUID").val(retDat.txtGUID);
        },
        error: function (retDat) {
            clsGlobal.hideLoading();
        }
    });
}

function p_InitiateBranch() {
    // Format datatable  
    
    oTableBranch = $('#dtBranch').DataTable({
        "bPaginate": true,
        "bSort": false,
        searching: true,
        "aLengthMenu": [[5, 10, 25, 50, 75, 100], [5, 10, 25, 50, 75, 100]],
        "iDisplayLength": 5,
        "type": "POST",
        aoColumnDefs: [
            {
                aTargets: [0],
                mRender: function (data, type, full) {
                    return '<div id="lblBranchNoValue"> ' + (full.intIndex + 1) + ' </div>';
                }
            }, 
           {
               aTargets: [1],
               mRender: function (data, type, full) {
                   return '     <div class="input-group"> ' +
                            '       <div class="input-group-btn"> ' +
                            '           <button type="button" class="btn btn-danger btnLOVBranchCode" id="btnLOVBranchCode" onclick="p_btnLOVBranchCode_Click(this,' + full.intIndex + ')"> <i class="fa fa-search"></i></button> ' +
                            '       </div> ' +
                            '       <input type="text" class="form-control txtBranchCode" id="txtBranchCode" onchange="p_txtBranchCode_Changed(this,' + full.intIndex + ')"  value="' + full.TXT_BRANCHCODE + '" disabled> ' +
                            '   </div>';
               }
           },
           {
               aTargets: [2],
               mRender: function (data, type, full) {
                   return '<div >  <input type="text" class="form-control txtBranchDesc" id="txtBranchDesc' + full.intIndex + '" value="' + full.TXT_BRANCHNAME + '" disabled>  </div>';
               }
           }
           //,
           // {
           //     aTargets: [3],
           //     mRender: function (data, type, full) {
           //         return '<div > <input type="button" class="btn btn-warning" id="btnBranchDelete" class="btnBranchDelete" onclick="p_btnBranchDelete_Click(this,' + full.intIndex + ')"  value="Delete" >  </div>';
           //     }
           // }
        ]
    });

    $("#dtBranch").css("width", "100%");
    $('#dtBranch tbody').on('click', 'tr', function () {
        if (!$(this).hasClass('selected')) {
            oTableBranch.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
        }
    });
}

function p_GetSelectedBranchRow() {
    var intIndex = clsGlobal.parseToInteger(oTableBranch.$('tr.selected').find("#lblBranchNoValue").html()) - 1;
    return intIndex;
}

function p_btnLOVBranchCode_Click(objCaller, intIndex) {
    //LOV = clsGlobal.generateLOV(MODULE_BRANCH2, "txtBranchCode");
    LOV = clsGlobal.generateLOV(MODULE_BRANCH, "txtBranchCode");
}

function p_settxtBranchCode(txtValue, txtValue2) {
      
    var intSelectedIndex = p_GetSelectedBranchRow();
    var intRowIndex = 0;
    var objDat = p_GetHiddenObject();
    oTableBranch.rows().every(function (rowIdx, tableLoop, rowLoop) {
        
        var d = this.data();
        if (intRowIndex == intSelectedIndex) {
            d.intIndex = intRowIndex; // update data source for the row 

            d.TXT_BRANCHCODE = txtValue;
            d.TXT_BRANCHNAME = txtValue2;
            objDat.XXSHP_KDS_T_KPP_CAB[intRowIndex].TXT_BRANCHCODE = txtValue;
            objDat.XXSHP_KDS_T_KPP_CAB[intRowIndex].TXT_BRANCHNAME = txtValue2;

            this.invalidate(); // invalidate the data DataTables has cached for this row         
            p_EnableControl(clsGlobal.ParseBooleanOracleToNET(objDat.BIT_APPLY), objDat);
        }

        intRowIndex++;
    });

    p_SetHiddenObject(objDat);

}


function p_txtSupplierSiteID_TextChanged() {
    clsGlobal.showLoading();
    $.ajax({
        type: "POST",
        url: "/Master/Supplier/GetDataSite",
        data: { txtID: $("#txtSupplierSiteID").val(), __RequestVerificationToken: $('#frmKPP input[name=__RequestVerificationToken]').val() },
        datatype: "json",
        success: function (retDat) {
            if (retDat.bitSuccess == true) {
                if (retDat.objData != undefined) {
                    $("#txtSupplierSiteName").val(clsGlobal.parseToString(retDat.objData.VENDOR_SITE_CODE));
                } else {
                    p_showBlank();
                }
            } else {
                clsGlobal.getAlert(retDat.txtMessage);
            }
            clsGlobal.hideLoading();
            $("#txtGUID").val(retDat.txtGUID);
        },
        error: function (retDat) {
            clsGlobal.hideLoading();
        }
    });
}

 

function p_btnBranchDelete_Click(objCaller, intIndex) {
    
    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());
    for (i = 0; i < objData.XXSHP_KDS_T_KPP_CAB.length; i++) {
        // Cari Index-nya.
        if (objData.XXSHP_KDS_T_KPP_CAB[i].intIndex == intIndex) {
            // Ketemu, mulai dari sini:
            // Remove from list.
            objData.XXSHP_KDS_T_KPP_CAB.splice(i, 1);

            //var row = oTableBranch.row($(this).parents('tr'));
            //var rowNode = row.node();
            //row.remove().draw();
            oTableBranch.row(i).remove().draw(false);
            break;
        }
    }
    p_SetHiddenObject(objData);
    p_RefreshNumberBranch();
}

function p_RefreshNumberBranch() {
    
    var intRowIndex = 0;
    var objDat = p_GetHiddenObject();
    oTableBranch.rows().every(function (rowIdx, tableLoop, rowLoop) {
        
        var d = this.data();
        d.intIndex = intRowIndex; // update data source for the row
        objDat.XXSHP_KDS_T_KPP_CAB[intRowIndex].intIndex = d.intIndex;

        d.TXT_BRANCHCODE = objDat.XXSHP_KDS_T_KPP_CAB[intRowIndex].TXT_BRANCHCODE;
        d.TXT_BRANCHNAME = objDat.XXSHP_KDS_T_KPP_CAB[intRowIndex].TXT_BRANCHNAME;
       
        intRowIndex++;
        this.invalidate(); // invalidate the data DataTables has cached for this row         
    });

    // Draw once all updates are done
    oTableBranch.draw(false);
    p_SetHiddenObject(objDat);
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

$('#btnSubmit').bind('click', function () {
    try {
        clsGlobal.getConfirmation("Submit this data?", function (result) {
            if (result == true) {
                p_submitData();
            }
            else {
                return false;
            }
        });
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
});


$('#btnFind').bind('click', function () {
    try {
        LOV = clsGlobal.generateLOV(MODULE_KPP, "txtDocNo"); //MODULE_APPROVALHIERARCHY
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
});


$('#btnLOVRefDocNo').bind('click', function () {
    try {
        
        clsGlobal.showLoading();
        $.ajax({
            type: "POST",
            url: "/System/User/IsUserKAM",
            data: { data: $("#txtHiddenObject").val(), __RequestVerificationToken: $('#frmKPP input[name=__RequestVerificationToken]').val() },
            datatype: "json",
            success: function (retDat) { 
                if (retDat.bitSuccess == true) {
                    if (retDat.objData != undefined) {
                        if (retDat.objData == true) {
                            // KAM, ada assignment.
                            LOV = clsGlobal.generateLOV(MODULE_MKPP_PARENT_BY_USER, "txtRefDocNo"); //MODULE_APPROVALHIERARCHY
                        } else {
                            // KAE.
                            LOV = clsGlobal.generateLOV(MODULE_MKPP_PARENT, "txtRefDocNo"); //MODULE_APPROVALHIERARCHY
                        }
                    }
                } else {
                    clsGlobal.getAlert(retDat.txtMessage);
                }
                clsGlobal.hideLoading();
                $("#txtGUID").val(retDat.txtGUID);
            },
            error: function (retDat) {
                clsGlobal.hideLoading();
            }
        });
        
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
});


$('#btnLOVParentDocNo').bind('click', function () {
    try {
        LOV = clsGlobal.generateLOV(LOV_KPP_PARENT, "txtParentDocNo"); //MODULE_APPROVALHIERARCHY
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
});


$('#btnLOVGroupAccount').bind('click', function () {
    try {
        LOV = clsGlobal.generateLOV(LOV_GROUP_ACCOUNT, "txtGroupAccount");
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
});

$('#btnLOVOutlet').bind('click', function () {
    try {
        LOV = clsGlobal.generateLOV(LOV_OUTLET_BY_MKPP, "txtOutlet", $("#txtRefDocNo").val());
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
});

$('#btnLOVBudgetType').bind('click', function () {
    try {
        LOV = clsGlobal.generateLOV(MODULE_MTBUDGETTYPE, "txtBudgetType");
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
});
$('#btnLOVPaymentType').bind('click', function () {
    try {
        LOV = clsGlobal.generateLOV(MODULE_TYPE_PAYMENT, "txtPaymentType");
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



$("#btndtEffectiveFrom").on("changeDate", function (e) { 
    $("#dtEffectiveFrom").val(clsGlobal.parseToDateTimeFromJSON(e.date, clsDateFormat));
});

$("#btndtEffectiveTo").on("changeDate", function (e) {
    $("#dtEffectiveTo").val(clsGlobal.parseToDateTimeFromJSON(e.date, clsDateFormat));
});


$('#btnApprovalHistory').bind('click', function () {
    try {
        var fancyboxdata = p_GetHiddenObject();
        LOV = clsGlobal.generatePopUpIframeSmall($(location).attr('protocol') + "//" + $(location).attr('host') + "/Master/ApprovalHistory/Index?TXT_TYPEDOC=" + "&TXT_REF_DOCNO=" + fancyboxdata.TXT_DOCNO + "&INT_DOCID=" + fancyboxdata.INT_KPP_HDR_ID, "btnApprovalHistory", fancyboxdata);

    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
});

$("#btnPrintout").on("click", function (e) {
    try {
        clsGlobal.getConfirmation("Print this document?", function (result) {
            if (result == true) {
                p_printoutData();
            }
            else {
                return false;
            }
        });
    } catch (ex) {
        clsGlobal.showAlert(ex);
    } 
});


$("#btnClose").on("click", function (e) {
    try {
        //clsGlobal.getConfirmation("Close and reverse budget for this document?", function (result) {
        //    //if (result == true) {
        //    //    p_closeDocument();
        //    //}
        //    //else {
        //    //    return false;
        //    //}            
        //});
        clsGlobal.generatePopUpDivSmall("#divCloseConfirm", "", "");
    } catch (ex) {
        clsGlobal.showAlert(ex);
    } 
});


$("#btnCancelConfirmCancel").on("click", function (e) {
    try { 
        clsGlobal.closePopUpDiv();
    } catch (ex) {
        clsGlobal.showAlert(ex);
    } 
});


$("#btnCancelConfirmSubmit").on("click", function (e) {
    try { 
        p_closeDocument();
        clsGlobal.closePopUpDiv();
    } catch (ex) {
        clsGlobal.showAlert(ex);
    } 
});




//$("#btnCancel").on("click", function (e) {
//    try {
//        clsGlobal.getConfirmation("Cancel and reverse budget for this document?", function (result) {
//            if (result == true) {
//                p_cancelDocument();
//            }
//            else {
//                return false;
//            }
//        });
//    } catch (ex) {
//        clsGlobal.showAlert(ex);
//    }
//});


$('#btnLOVSupplierSite').bind('click', function () {
    try {
        LOV = clsGlobal.generateLOV(LOV_XXSHP_VENDOR_SITE_ALL_V_VENDOR_SITE_ID, "txtSupplierSiteID", $("#txtSupplierID").val());
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
});


$('#rdoNationalYes').bind('click', function () {
    try {
        p_clearBranch();
        p_checkMultipleSelect();
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
}); 

$('#rdoNationalNo').bind('click', function () {
    try {
        p_checkMultipleSelect();
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
});