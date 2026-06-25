//=======================
// VARIABLE GLOBAL
//=======================
var clsGlobal = new clsGlobalClass();
var LOV;
var bitLoading = false;
//var oTable;
var ZX_RATES_BList = {};
var data = new FormData();
var attachments = [];

var MODULE_DETAIL_ACTIVITY = "MODULE_DETAIL_ACTIVITY";
var lastProgramDescIndex = null;
var prevGroupAcc = null;
var isFromBtnFind = false;


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
    p_PopulateDataDropdownList();
});

//=======================
// FUNCTION
//=======================
function p_InitForm() {
    p_InitiateDetail();
    p_initiateData();
    //p_showPrevData();
}

function p_validatePage() {

}

function p_showPrevData() {

}

function p_showBlank() {
    p_initiateData();
}

//function setChooseLOV(txtValue) {
//    var arr = txtValue.split('|');
//    switch (arr[0]) {
//        case "txtID": $("#txtID").val(arr[1]);
//            p_txtID_TextChanged();
//            break;
        
//        case "txtGroupAccount":
//            $("#txtGroupAccount").val(arr[1]);
//            p_txtGroupAccount_TextChanged();
//            break;
//        case "txtOutlet":                  
//            txtSupplierCode = "";
//            txtSupplierSiteID = "";
//            txtSupplierSiteName = "";
//            $("#txtSupplierID").val(arr[2]);
//            $("#txtSupplierCode").val(arr[2]);
//            $("#txtSupplierName").val(arr[3]);
//            $("#txtBranchName").val(arr[4]);
//            $("#txtOutlet").val(arr[1]);
//            p_txtOutlet_TextChanged();
//            break;
//        case "txtDetailActivity":
//            p_settxtDetailActivity(arr[1]);
//            break;
//        case "txtDetailPPHType":
//            p_settxtDetailPPHType(arr[1], arr[2], arr[3]);
//            break;
//        case "txtPartner":
//            $("#txtPartner").val(arr[1]); 
//            break;
       

//    }
//    clsGlobal.closeLOV();
//}


function setChooseLOV(txtValue) {
    var arr = txtValue.split('|');
    var objData = p_GetHiddenObject();
    var roleNow = objData.INT_LOGIN_NOW;

    var base = 0;
    if (arr[0] && /^(lbl|txt)/i.test(arr[0])) {
        base = 1;
    }

    var need = base + 5;

    // Role 1060 dengan LOV Program Activity
    if ((roleNow == 1060 || roleNow == 1059) && arr.length >= need && lastProgramDescIndex != null) {
       var activity = arr[base + 0];
        var coa = arr[base + 1];
        var pphJenis = arr[base + 2];
        var pphPersen = arr[base + 3];
        var progDesc = arr[base + 4];

        if (typeof pphPersen === "string") {
            pphPersen = pphPersen.replace('%', '').trim();
        }

        try { p_settxtDetailActivity(activity); } catch (e) { }

        try { p_settxtDetailPPHType(null, pphJenis, pphPersen); } catch (e) { }

        try {
            var inputProgramDesc = $('#txtDetailProgramDesc' + lastProgramDescIndex);
            if (inputProgramDesc.length) {
                inputProgramDesc.val(progDesc);
                p_txtDetailProgramDesc_Changed({ value: progDesc }, lastProgramDescIndex);
            }
        } catch (e) { }
        lastProgramDescIndex = null;
        clsGlobal.closeLOV();
        return;
    }

    // Default LOV handling
    switch (arr[0]) {
        case "txtID":
            $("#txtID").val(arr[1]);
            p_txtID_TextChanged();
            break;

        case "txtGroupAccount":
            $("#txtGroupAccount").val(arr[1]);
            p_txtGroupAccount_TextChanged();
            break;

        case "txtOutlet":
            txtSupplierCode = "";
            txtSupplierSiteID = "";
            txtSupplierSiteName = "";
            $("#txtSupplierID").val(arr[2]);
            $("#txtSupplierCode").val(arr[2]);
            $("#txtSupplierName").val(arr[3]);
            $("#txtBranchName").val(arr[4]);
            $("#txtOutlet").val(arr[1]);
            p_txtOutlet_TextChanged();
            break;

        case "txtDetailActivity":
            p_settxtDetailActivity(arr[1]);
            break;

        case "txtDetailPPHType":
            p_settxtDetailPPHType(arr[1], arr[2], arr[3]);
            break;

        case "txtPartner":
            $("#txtPartner").val(arr[1]);
            break;
    }
    lastProgramDescIndex = null;
    clsGlobal.closeLOV();
}


function p_PopulateDataDropdownList() {
    // PPN
    clsGlobal.showLoading();
    //
    $.ajax({
        type: "POST",
        url: "/Main/PopulateTipePPN",
        data: { __RequestVerificationToken: $('#frmTrKlaim input[name=__RequestVerificationToken]').val() },
        datatype: "json",
        success: function (retDat) {
            if (retDat.bitSuccess == true) {
                //
                if (retDat.objData != undefined) {
                    ZX_RATES_BList = retDat.objData;
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

function p_txtOutlet_TextChanged() {
    //
    p_UIToData();
    clsGlobal.showLoading();
    $.ajax({
        type: "POST",
        url: "/Transaksi/Klaim/GetSupplierSite",
        data: { data: $("#txtHiddenObject").val(), txtSupplierID: $("#txtSupplierID").val(), txtSupplierName: $("#txtSupplierName").val(), txtGUID: $("#txtGUID").val(), __RequestVerificationToken: $('#frmTrKlaim input[name=__RequestVerificationToken]').val() },
        datatype: "json",
        success: function (retDat) {
            //
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
            //
            clsGlobal.hideLoading();
        }
    });
}


function p_txtGroupAccount_TextChanged() {
    clsGlobal.showLoading();
    var groupAcc = $("#txtGroupAccount").val().trim().toUpperCase();
    var txtPartner = $("#txtPartner").val().trim();
    if (groupAcc === "") {
        $("#btnLOVPartner").hide();
        clsGlobal.hideLoading();
        return;
    }

    // Hanya kosongkan data jika bukan hasil dari btnFind dan group account berubah
    if (!isFromBtnFind && prevGroupAcc !== null && prevGroupAcc !== groupAcc) {
        $("#txtOutlet").val("");
        $("#txtSupplierID").val("");
        $("#txtSupplierCode").val("");
        $("#txtSupplierName").val("");
        $("#txtBranchName").val("");
        $("#txtPartner").val("");
        $("#txtSupplierSiteName").val("");
        $("#txtSupplierSiteID").val("");
    }
    $.ajax({
        type: "POST",
        url: "/Transaksi/Klaim/CekGroupAccountIsEnseval",
        data: { txtGroupAccount: $("#txtGroupAccount").val(), data: $("#txtHiddenObject").val(), txtSupplierID: $("#txtSupplierID").val(), txtSupplierName: $("#txtSupplierName").val(), txtGUID: $("#txtGUID").val(), __RequestVerificationToken: $('#frmTrKlaim input[name=__RequestVerificationToken]').val() },
        datatype: "json",
        success: function (retDat) {
            //
            if (retDat.bitSuccess === true) {
                if (retDat.objData === true || groupAcc === "ENSEVAL") {
                    $("#btnLOVPartner").show();
                } else {
                    $("#btnLOVPartner").hide();
                }
            }
            clsGlobal.hideLoading();
            $("#txtGUID").val(retDat.txtGUID);
            prevGroupAcc = groupAcc;
            isFromBtnFind = false; // Reset flag setelah proses selesai
        },
        error: function (retDat) {
            //
            isFromBtnFind = false;
            clsGlobal.hideLoading();
        }
    });
}
function p_DataToUI(objData) {
    
    p_SetHiddenObject(objData);
    $("#txtID").val(clsGlobal.parseToInteger(objData.INT_KLAIM_HDR_ID));
    $("#txtDocNo").val(clsGlobal.parseToInteger(objData.TXT_DOCNO));
    $("#txtDocNoMkpp").val(clsGlobal.parseToString(objData.TXT_DOCNO_MKPP));
     
    //$("#lblDateValue").val(clsGlobal.parseToInteger(objData.TXT_PERIOD));
    $("#dtmDate").val(clsGlobal.parseToDateTimeFromJSON(objData.CREATION_DATE, clsDateFormat));
    //$("#lblStatusValue").val(clsGlobal.parseToInteger(objData.TXT_STATUS));
    $("#lblStatusFlow").html(clsGlobal.parseToString(objData.TXT_STATUSFLOW));


    $("#txtGroupAccount").val(clsGlobal.parseToString(objData.TXT_GROUP_ACCOUNT));
    $("#txtOutlet").val(clsGlobal.parseToString(objData.TXT_SITE));
    $("#txtPartner").val(clsGlobal.parseToString(objData.TXT_PARTNER));

    $("#txtDocNo").val(clsGlobal.parseToString(objData.TXT_DOC_NO));
  


    $("#txtSupplierID").val(clsGlobal.parseToString(objData.TXT_SUPPLIER_CODE));
    $("#txtSupplierCode").val(clsGlobal.parseToString(objData.TXT_SUPPLIER_CODE));
    $("#txtSupplierName").val(clsGlobal.parseToString(objData.TXT_SUPPLIER_NAME));

    $("#txtSupplierSiteID").val(clsGlobal.parseToString(objData.INT_SUPPLIER_SITE_ID));
    $("#txtSupplierSiteName").val(clsGlobal.parseToString(objData.TXT_SUPPLIER_SITE_NAME));

    $("#txtBranchName").val(clsGlobal.parseToString(objData.TXT_BRANCH));
    $("#txtRemark").val(clsGlobal.parseToString(objData.TXT_REMARK));
    $("#txtSourceDoc").val(clsGlobal.parseToString(objData.TXT_SOURCE_DOC));

    $('#rdoReadySubmitYes').prop('checked', false);
    $('#rdoReadySubmitNo').prop('checked', false);
    if (objData.BIT_READY_SUBMIT == "Y") {
        $('#rdoReadySubmitYes').prop('checked', true);
    } else if (objData.BIT_READY_SUBMIT == "N") {
        $('#rdoReadySubmitNo').prop('checked', true);
    }
    $("#txtReasonReadySubmit").val(clsGlobal.parseToString(objData.TXT_REASON_READY_SUBMIT));

    p_txtGroupAccount_TextChanged();
    p_checkMultipleSelect();

    var bitCanSetStatus = p_setBooleanBitCanSetStatus();
    var bitViewInclude = p_setBooleanBitInclude();

    p_DataToUIDetail(objData.XXSHP_KDS_T_KLAIM_DTL, bitCanSetStatus, bitViewInclude);
    p_EnableControl(clsGlobal.ParseBooleanOracleToNET(objData.BIT_APPLY), clsGlobal.ParseBooleanOracleToNET(objData.BIT_APPROVED), clsGlobal.ParseBooleanOracleToNET(objData.BIT_REJECTED));
    p_CheckForCancelCloseDocument(objData);
    p_CheckForCopyDocument(objData);

    //update attachment dimatiin aja, udah ada jadi 1 di button save
    //p_CheckForUpdateAttachment(objData);

    //dicomment dipindah ke dalam enable control
    //if (objData.INT_LOGIN_NOW != 1051) {
    //    $("#btnUpdateInclude").hide();
    //}
    //if ($("#txtID").val() == "" || $("#txtID").val() == "0") {
    //    $("#btnDelete").hide();
    //} else {
    //    $("#btnDelete").show();
    //}

    //if (clsGlobal.parseToInteger(objData.INT_KLAIM_HDR_ID) == 0) {
    //    $("#btnUpdateAttachment").hide();
    //} else {
    //    if (clsGlobal.ParseBooleanOracleToNET(objData.BIT_APPLY) == true) {
    //        $("#btnUpdateAttachment").show();
    //    } else {
    //        $("#btnUpdateAttachment").show();
    //    }
    //}
    if ($("#txtDocNo").val() == "" || $("#txtDocNo").val() == "0") {
        $("#txtOutlet").parent('.input-group').css('margin-left', '0px');
        $("#txtGroupAccount").parent('.input-group').css('margin-left', '0px');
    } else {
        $("#txtOutlet").parent('.input-group').css('margin-left', '-2px');
        $("#txtGroupAccount").parent('.input-group').css('margin-left', '-2px');
    }
}


function p_CheckForCancelCloseDocument(objData) {
    
    $("#btnClose").hide();
    if (objData.TXT_STATUSFLOW == "") {
        $("#btnReject").hide();
    } else {
        //kondisi khusus untuk role 1060 admin subdist
        if (objData.INT_LOGIN_NOW == 1060) {
            $("#btnReject").hide();
        } else {
            if (clsGlobal.ParseBooleanOracleToNET(objData.BIT_REJECTED) == false &&
                clsGlobal.ParseBooleanOracleToNET(objData.BIT_APPROVED) == false) {
                $("#btnReject").show();
            }
        }
    }

    if (clsGlobal.ParseBooleanOracleToNET(objData.BIT_APPROVED) == true
        && clsGlobal.ParseBooleanOracleToNET(objData.BIT_CLOSED) == false  ) {
        $("#btnClose").show(); 
        $("#btnReject").hide();
        //$("#btnViewMemo").hide();
    }
    if (clsGlobal.ParseBooleanOracleToNET(objData.BIT_CLOSED) == true) {
        $("#divClose").show();
        $("#txtReasonClose").html("Reason Close: " + objData.TXT_REASON_CLOSE);
    } else if (clsGlobal.ParseBooleanOracleToNET(objData.BIT_REJECTED) == true) {
        $("#divClose").show();
        $("#txtReasonClose").html("Reason Reject: " + objData.TXT_REJECTREASON);
    } else {
        $("#divClose").hide();
        $("#txtReasonClose").html("");
    }

    if (objData.TXT_SOURCE_DOC == "BOSNET") {
        $("#btnClose").hide();
        $("#btnReject").hide();
    }
    //
}

function p_CheckForCopyDocument(objData) {
    $("#btnCopy").hide();
    if (clsGlobal.ParseBooleanOracleToNET(objData.BIT_APPLY) == true && objData.TXT_SOURCE_DOC != "BOSNET") {
        $("#btnCopy").show();
    }
}

function p_CheckForUpdateAttachment(objDat) {
    //var objData = JSON.parse(p_UIToData());
    //var objDat = p_GetHiddenObject();
    //var test = clsGlobal.ParseBooleanOracleToNET(objDat.BIT_APPROVED);
    if (clsGlobal.ParseBooleanOracleToNET(objDat.BIT_APPROVED) == true
        && clsGlobal.ParseBooleanOracleToNET(objDat.BIT_REJECTED) == false && clsGlobal.ParseBooleanOracleToNET(objDat.BIT_CLOSED) == false) {
        clsGlobal.showLoading();
        $.ajax({
            type: "POST",
            url: "/Transaksi/Klaim/CheckKlaimAllowUpdate",
            data: { INT_KLAIM_HDR_ID: objDat.INT_KLAIM_HDR_ID, __RequestVerificationToken: $('#frmTrKlaim input[name=__RequestVerificationToken]').val() },
            datatype: "json",
            success: function (retDat) {
                
                if (retDat.bitSuccess == true) {
                    if (retDat.objData != undefined) {
                        //if (retDat.objData == true) {
                        //    p_EnableControlUpdate(true);
                        //}
                        //else {
                        //    p_EnableControlUpdate(false);
                        //}
                        p_EnableControlUpdate(retDat.objData.isCanUpdate, retDat.objData.isCanUpdateAttachment);
                    } else {
                        p_EnableControlUpdate(false, false);
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
    } else if (clsGlobal.ParseBooleanOracleToNET(objDat.BIT_APPLY) == false && clsGlobal.parseToInteger(objDat.INT_KLAIM_HDR_ID) != 0) {
        $("#btnUpdateAttachment").show();
    }
    else {
        $("#btnUpdate").hide();
        $("#btnUpdateAttachment").hide();
    }
}

function p_checkMultipleSelect() {
    
    //$("#txtReasonReadySubmit").attr("disabled", "true");
    if ($('#rdoReadySubmitYes').prop('checked') == true) {
        $("#txtReasonReadySubmit").attr("disabled", "true");
        $("#txtReasonReadySubmit").val("");
        $("#txtReasonReadySubmit").hide();
    }
    else if ($('#rdoReadySubmitNo').prop('checked') == true) {
        $("#txtReasonReadySubmit").removeAttr("disabled");
        $("#txtReasonReadySubmit").show();
    }
}

function p_SetHiddenObject(objDat) {
    $("#txtHiddenObject").val(JSON.stringify(objDat));
    //
    //AutoNumeric.
    p_GenerateAutoNumeric()
    p_GenerateDateTimePicker();
}

function p_GenerateDateTimePicker() {
    //
    $('.datetimepicker').datepicker({
        autoclose: true,
    });

}

function p_GenerateAutoNumeric() {
    //
    $('.autonumeric').autoNumeric('init', { vMax: '9999999999999.99', vMin: '-9999999999999.99', aSep: ',', dGroup: '3', aDec: '.' });
}

function p_GetHiddenObject() {
    return JSON.parse($("#txtHiddenObject").val());
}

function p_DataToUIDetail(XXSHP_KDS_T_KLAIM_DTL, bitApply, bitViewInclude) {
   
    //
    oTable.clear();
     
    for (var i = 0; i < XXSHP_KDS_T_KLAIM_DTL.length; i++) {
        XXSHP_KDS_T_KLAIM_DTL[i].intIndex = i;
        oTable.row.add(XXSHP_KDS_T_KLAIM_DTL[i]);
    }
    oTable.draw(false);

    var objDat = p_GetHiddenObject();
    objDat.XXSHP_KDS_T_KLAIM_DTL = XXSHP_KDS_T_KLAIM_DTL;
    p_SetHiddenObject(objDat);

    try {
        //var column19 = oTable.column(19);
        //column19.visible(bitApply);
        var column21 = oTable.column(21);
        column21.visible(bitApply);
    } catch (ex2) {
        //DO NOTHING
    }
    try {
        //var column20 = oTable.column(20);
        //column20.visible(bitApply);
        var column22 = oTable.column(22);
        column22.visible(bitApply);
    } catch (ex2) {
        //DO NOTHING
    }
    try {
        //var column20 = oTable.column(20);
        //column20.visible(bitApply);
        var column23 = oTable.column(23);
        column23.visible(bitViewInclude);
    } catch (ex2) {
        //DO NOTHING 
    }
}

function p_initiateData() {
    clsGlobal.showLoading();
    $.ajax({
        type: "POST",
        url: "/Transaksi/Klaim/InitiateData",
        data: { __RequestVerificationToken: $('#frmTrKlaim input[name=__RequestVerificationToken]').val() },
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

//function p_getNoMkppByDocNo(txtDocNo) {
//    clsGlobal.showLoading();
//    $.ajax({
//        type: "POST",
//        url: "/Transaksi/Klaim/GetNoMkppByDocNo",
//        data: {
//            txtDocNo: $("#txtDocNo").val(),
//            __RequestVerificationToken: $('#frmTrKlaim input[name=__RequestVerificationToken]').val()
//        },
//        datatype: "json",
//        success: function (retDat) {

//            if (retDat.bitSuccess == true) {
//                if (retDat.objData != undefined) {
//                    $("#txtDocNoMkpp").val(retDat.objData);
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

function p_getParameterID() {
    var id = $.getParameter("ID");
    if (id != undefined) {
        $("#txtID").val(id);
        p_txtID_TextChanged();
    }
}

function p_UIToData() {
    var jsonObj = [];
    //console.log("11");
    jsonData = p_GetHiddenObject();
    
    jsonData.INT_KLAIM_HDR_ID = clsGlobal.parseToInteger($("#txtID").val());
    jsonData.TXT_DOCNO = clsGlobal.parseToInteger($("#txtDocNo").val());

    jsonData.INT_SUPPLIER_ID = $("#txtSupplierID").val().toString();
    jsonData.TXT_SUPPLIER_CODE = $("#txtSupplierCode").val().toString();
    jsonData.TXT_SUPPLIER_NAME = $("#txtSupplierName").val().toString();

    jsonData.INT_SUPPLIER_SITE_ID = $("#txtSupplierSiteID").val().toString();
    jsonData.TXT_SUPPLIER_SITE_CODE = $("#txtSupplierSiteName").val().toString();
    jsonData.TXT_SUPPLIER_SITE_NAME = $("#txtSupplierSiteName").val().toString();


    jsonData.TXT_GROUP_ACCOUNT = $("#txtGroupAccount").val().toString();
    jsonData.TXT_SITE = $("#txtOutlet").val().toString();
    jsonData.TXT_PARTNER = $("#txtPartner").val().toString();
    ///jsonData.TXT_PERIOD = $("#lblDateValue").val().toString();
    ///jsonData.TXT_STATUS = $("#lblStatusValue").val().toString();

    jsonData.TXT_BRANCH = $("#txtBranchName").val().toString();
    jsonData.TXT_REMARK = $("#txtRemark").val().toString();
    jsonData.TXT_SOURCE_DOC = $("#txtSourceDoc").val().toString();

    jsonData.BIT_READY_SUBMIT = "X";
    if ($('#rdoReadySubmitYes').prop('checked') == true) {
        jsonData.BIT_READY_SUBMIT = "Y";
    } else if ($('#rdoReadySubmitNo').prop('checked') == true) {
        jsonData.BIT_READY_SUBMIT = "N";
    }
    jsonData.TXT_REASON_READY_SUBMIT = $("#txtReasonReadySubmit").val().toString();

    //console.log("12");
    p_SetHiddenObject(jsonData);
    return $("#txtHiddenObject").val();

}


function p_EnableControl(bitApply, bitApproved, bitRejected) {
    debugger    
    var objData = p_GetHiddenObject();
    $("#btnViewMemo").hide();
    //
    if (bitApply == true && bitApproved == true) {
        // Sudah apply dan sudah approved.
        $("#btnSave").hide();
        $("#btnSubmit").hide();
        $("#btnDelete").hide();
        $("#btnApprovalHistory").show();
        $("#btnUpdateInclude").show();

        if (objData.TXT_SOURCE_DOC == "BOSNET") {
            $("#btnClose").hide();
        }

        $("#btnLOVID").hide();
        $("#btnLOVGroupAccount").hide();
        $("#btnLOVOutlet").hide();
        $("#btnAddDetail").hide();
        $("#btnLOVPartner").hide();

        $("#txtRemark").attr("disabled", "true");

        
        $(".txtDetailPPN").each(function (index) {
            $(this).attr("disabled", "true");
        });
        $(".ddlPPN").each(function (index) {
            $(this).attr("disabled", "true");
        });
        //var selectElement = document.getElementById("ddlPPN");
        //selectElement.disabled = true;

        $(".txtDetailProgramDesc").each(function (index) {
            $(this).attr("disabled", "true");
        });
        $(".txtDetaildtm_period_from").each(function (index) {
            $(this).attr("disabled", "true");
        });
        $(".txtDetaildtm_period_to").each(function (index) {
            $(this).attr("disabled", "true");
        });
        $(".txtDetailInvoiceNo").each(function (index) {
            $(this).attr("disabled", "true");
        });
        $(".txtDetailInvoiceDate").each(function (index) {
            $(this).attr("disabled", "true");
        });
        $(".txtFakturPajakNo").each(function (index) {
            $(this).attr("disabled", "true");
        });
        $(".txtFakturPajakDate").each(function (index) {
            $(this).attr("disabled", "true");
        });
        $(".txtDetailInvoiceAmount").each(function (index) {
            $(this).attr("disabled", "true");
        });
        $(".chkDetailAllBrand").each(function (index) {
            $(this).attr("disabled", "true");
        });

        $(".btnDetailDelete").each(function (index) {
            $(this).hide();
        });

        $(".btnLOVDetailActivity").each(function (index) {
            $(this).hide();
        });

        $(".btnLOVDetailPPHType").each(function (index) {
            $(this).hide();
        });

        $(".btnScanFakturPajak").each(function (index) {
            $(this).hide();
        });

        $(".btnClearPPH").each(function (index) {
            $(this).hide();
        });

        $("#rdoReadySubmitYes").attr("disabled", "true");
        $("#rdoReadySubmitNo").attr("disabled", "true");
        $("#txtReasonReadySubmit").attr("disabled", "true");
   
    } else if (bitApply == true && bitApproved == false && bitRejected == true ||
        bitApply == false && bitApproved == false && bitRejected == true) {
        // Sudah apply dan sudah approved.
        $("#btnSave").hide();
        $("#btnSubmit").hide();
        $("#btnDelete").hide();
        $("#btnApprovalHistory").show();
        $("#btnUpdateInclude").hide();
        $("#btnReject").hide();
        //$("#btnViewMemo").hide();

        $("#btnLOVID").hide();
        $("#btnLOVGroupAccount").hide();
        $("#btnLOVOutlet").hide();
        $("#btnAddDetail").hide();
        $("#btnLOVPartner").hide();

        $("#txtRemark").attr("disabled", "true");


        $(".txtDetailPPN").each(function (index) {
            $(this).attr("disabled", "true");
        });
        $(".ddlPPN").each(function (index) {
            $(this).attr("disabled", "true");
        });
        //var selectElement = document.getElementById("ddlPPN");
        //selectElement.disabled = true;

        $(".txtDetailProgramDesc").each(function (index) {
            $(this).attr("disabled", "true");
        });
        $(".txtDetaildtm_period_from").each(function (index) {
            $(this).attr("disabled", "true");
        });
        $(".txtDetaildtm_period_to").each(function (index) {
            $(this).attr("disabled", "true");
        });
        $(".txtDetailInvoiceNo").each(function (index) {
            $(this).attr("disabled", "true");
        });
        $(".txtDetailInvoiceDate").each(function (index) {
            $(this).attr("disabled", "true");
        });
        $(".txtFakturPajakNo").each(function (index) {
            $(this).attr("disabled", "true");
        });
        $(".txtFakturPajakDate").each(function (index) {
            $(this).attr("disabled", "true");
        });
        $(".txtDetailInvoiceAmount").each(function (index) {
            $(this).attr("disabled", "true");
        });
        $(".chkDetailAllBrand").each(function (index) {
            $(this).attr("disabled", "true");
        });

        $(".btnDetailDelete").each(function (index) {
            $(this).hide();
        });

        $(".btnLOVDetailActivity").each(function (index) {
            $(this).hide();
        });

        $(".btnLOVDetailPPHType").each(function (index) {
            $(this).hide();
        });

        $(".btnScanFakturPajak").each(function (index) {
            $(this).hide();
        });

        $(".btnClearPPH").each(function (index) {
            $(this).hide();
        });

        $("#rdoReadySubmitYes").attr("disabled", "true");
        $("#rdoReadySubmitNo").attr("disabled", "true");
        $("#txtReasonReadySubmit").attr("disabled", "true");

    }else if (bitApply == true && bitApproved == false) {
        // Sudah apply. dan belum approved.
        $("#btnSave").show();
        $("#btnSubmit").hide();
        $("#btnDelete").hide();
        $("#btnApprovalHistory").show();
        $("#btnUpdateInclude").show();

        $("#btnLOVID").hide();
        $("#btnLOVGroupAccount").hide();
        $("#btnLOVOutlet").hide();
        $("#btnAddDetail").hide();
        $("#btnLOVPartner").hide();

        $(".txtDetailPPN").each(function (index) {
            $(this).removeAttr("disabled");
        });
        $(".txtDetailProgramDesc").each(function (index) {
            $(this).removeAttr("disabled");
        });
        $(".txtDetaildtm_period_from").each(function (index) {
            $(this).removeAttr("disabled");
        });
        $(".txtDetaildtm_period_to").each(function (index) {
            $(this).removeAttr("disabled");
        });
        $(".txtDetailInvoiceNo").each(function (index) {
            $(this).removeAttr("disabled");
        });
        $(".txtDetailInvoiceDate").each(function (index) {
            $(this).removeAttr("disabled");
        });
        $(".txtFakturPajakNo").each(function (index) {
            $(this).removeAttr("disabled");
        });
        $(".txtFakturPajakDate").each(function (index) {
            $(this).removeAttr("disabled");
        });
        $(".txtDetailInvoiceAmount").each(function (index) {
            $(this).removeAttr("disabled");
        });
        $("#txtRemark").attr("disabled", "true");
        $(".btnDetailDelete").each(function (index) {
            $(this).hide();
        });

        $(".btnLOVDetailActivity").each(function (index) {
            $(this).show();
        });

        $(".btnLOVDetailPPHType").each(function (index) {
            $(this).removeAttr("disabled");
        });

        $("#rdoReadySubmitYes").attr("disabled", "true");
        $("#rdoReadySubmitNo").attr("disabled", "true");
        $("#txtReasonReadySubmit").attr("disabled", "true");
    } else if (bitApply == false && bitApproved == false) {
        $("#btnSave").show();
        $("#btnSubmit").show();
        $("#btnDelete").hide();
        $("#btnApprovalHistory").hide();
        $("#btnUpdateInclude").hide();

        $("#btnLOVID").show();
        $("#btnLOVGroupAccount").show();
        $("#btnLOVOutlet").show();
        $("#btnAddDetail").show();
        $("#btnLOVPartner").show();
         
        $(".txtDetailPPN").each(function (index) {
            $(this).removeAttr("disabled");
        });
        $(".txtDetailProgramDesc").each(function (index) {
            $(this).removeAttr("disabled");
        });
        $(".txtDetaildtm_period_from").each(function (index) {
            $(this).removeAttr("disabled");
        });
        $(".txtDetaildtm_period_to").each(function (index) {
            $(this).removeAttr("disabled");
        });
        $(".txtDetailInvoiceNo").each(function (index) {
            $(this).removeAttr("disabled");
        });
        $(".txtDetailInvoiceDate").each(function (index) {
            $(this).removeAttr("disabled");
        });
        $(".txtFakturPajakNo").each(function (index) {
            $(this).removeAttr("disabled");
        });
        $(".txtFakturPajakDate").each(function (index) {
            $(this).removeAttr("disabled");
        });
        $(".txtDetailInvoiceAmount").each(function (index) {
            $(this).removeAttr("disabled");
        });
        
        $("#txtRemark").removeAttr("disabled");
        $(".btnDetailDelete").each(function (index) {
            $(this).removeAttr("disabled");
        });
        $(".btnLOVDetailActivity").each(function (index) {
            $(this).removeAttr("disabled");
        });
        $(".btnLOVDetailPPHType").each(function (index) {
            $(this).removeAttr("disabled");
        });

        if (objData.INT_LOGIN_NOW == 1059 || objData.INT_LOGIN_NOW == 1051 || objData.INT_LOGIN_NOW == 1005) {
            //1059 merupakan role admin cabang 
            //1051 merupakan role staff admin KAM
            //1005 merupakan role ADM SU
            $("#rdoReadySubmitYes").removeAttr("disabled");
            $("#rdoReadySubmitNo").removeAttr("disabled");
            $("#txtReasonReadySubmit").removeAttr("disabled");
        } else {
            $("#rdoReadySubmitYes").attr("disabled", "true");
            $("#rdoReadySubmitNo").attr("disabled", "true");
            $("#txtReasonReadySubmit").attr("disabled", "true");
        }

        //kondisi khusus untuk role 1060 admin subdist
        if (objData.INT_LOGIN_NOW == 1060 && objData.TXT_STATUSFLOW != "") {
            if (objData.CREATED_BY != objData.INT_PEGAWAI_LOGIN_NOW && objData.TXT_SOURCE_DOC != "BOSNET") {
                //jika dokumen bukan buatan nya admin subdist wajib dikunci semua
                // Sudah apply dan sudah approved.
                $("#btnSave").hide();
                $("#btnSubmit").hide();
                $("#btnDelete").hide();
                $("#btnApprovalHistory").show();
                $("#btnUpdateInclude").hide();

                $("#btnLOVID").hide();
                $("#btnLOVGroupAccount").hide();
                $("#btnLOVOutlet").hide();
                $("#btnAddDetail").hide();
                $("#btnLOVPartner").hide();

                $("#txtRemark").attr("disabled", "true");


                $(".txtDetailPPN").each(function (index) {
                    $(this).attr("disabled", "true");
                });
                $(".ddlPPN").each(function (index) {
                    $(this).attr("disabled", "true");
                });
                //var selectElement = document.getElementById("ddlPPN");
                //selectElement.disabled = true;

                $(".txtDetailProgramDesc").each(function (index) {
                    $(this).attr("disabled", "true");
                });
                $(".txtDetaildtm_period_from").each(function (index) {
                    $(this).attr("disabled", "true");
                });
                $(".txtDetaildtm_period_to").each(function (index) {
                    $(this).attr("disabled", "true");
                });
                $(".txtDetailInvoiceNo").each(function (index) {
                    $(this).attr("disabled", "true");
                });
                $(".txtDetailInvoiceDate").each(function (index) {
                    $(this).attr("disabled", "true");
                });
                $(".txtFakturPajakNo").each(function (index) {
                    $(this).attr("disabled", "true");
                });
                $(".txtFakturPajakDate").each(function (index) {
                    $(this).attr("disabled", "true");
                });
                $(".txtDetailInvoiceAmount").each(function (index) {
                    $(this).attr("disabled", "true");
                });
                $(".chkDetailAllBrand").each(function (index) {
                    $(this).attr("disabled", "true");
                });

                $(".btnDetailDelete").each(function (index) {
                    $(this).hide();
                });

                $(".btnLOVDetailActivity").each(function (index) {
                    $(this).hide();
                });

                $(".btnLOVDetailPPHType").each(function (index) {
                    $(this).hide();
                });

                $(".btnScanFakturPajak").each(function (index) {
                    $(this).hide();
                });

                $(".btnClearPPH").each(function (index) {
                    $(this).hide();
                });

                $(".btnRemoveAttachment").each(function (index) {
                    $(this).hide();
                });

                $("#rdoReadySubmitYes").attr("disabled", "true");
                $("#rdoReadySubmitNo").attr("disabled", "true");
                $("#txtReasonReadySubmit").attr("disabled", "true");
            }
        }
    }

    if (objData.TXT_SOURCE_DOC == "BOSNET") {

        $("#btnAddDetail").hide();
        $(".btnDetailDelete").each(function (index) {
            $(this).hide();
        });
    } else {
        $("#btnAddDetail").show();
        $(".btnDetailDelete").each(function (index) {
            $(this).show(); //
        });
    }

    //buat di apply ke semua kondisi
    if (objData.INT_LOGIN_NOW != 1051) {
        $("#btnUpdateInclude").hide();
    }
    if (objData.INT_LOGIN_NOW == 1059 || objData.INT_LOGIN_NOW == 1060) {
        //1059 merupakan role admin cabang jadi btn submit nya di hide
        //1060 merupakan role admin subdist
        $("#btnSubmit").hide();
    }

    //jika dokumen klaim berasal dari bosnet
    if (objData.TXT_SOURCE_DOC == "BOSNET") {
        $("#btnViewMemo").show();
        $("#btnLOVGroupAccount").hide();
        $("#btnLOVOutlet").hide();

        $(".btnLOVDetailActivity").each(function (index) {
            $(this).hide();
        });
        $(".txtDetailProgramDesc").each(function (index) {
            $(this).attr("disabled", "true");
        });
        $(".txtDetaildtm_period_from").each(function (index) {
            $(this).attr("disabled", "true");
        });
        $(".txtDetaildtm_period_to").each(function (index) {
            $(this).attr("disabled", "true");
        });
        $(".txtDetailInvoiceAmount").each(function (index) {
            $(this).attr("disabled", "true");
        });
        $(".chkDetailAllBrand").each(function (index) {
            $(this).attr("disabled", "true");
        });
    }
    //UNTUK SUBDIST
    if (objData.INT_LOGIN_NOW == 1060 || objData.INT_ROLE_LOGIN == 1059) {


        $(".btnLOVDetailActivity").each(function (index) {
            $(this).hide();
        });

        $(".btnLOVDetailPPHType").each(function (index) {
            $(this).hide();
        });

        $(".btnClearPPH").each(function (index) {
            $(this).hide();
        });


        $(".txtDetailActivity").each(function (index) {
            $(this).attr("readonly", true);
        });

        $(".txtDetailPPHType").each(function (index) {
            $(this).attr("readonly", true);
        });

        $(".txtDetailPersenPPH").each(function (index) {
            $(this).attr("readonly", true);
        });

        $(".txtDetailProgramDesc").each(function (index) {
            $(this).attr("readonly", true);
        });

        // Cek isi Group Account di UI
        var groupAcc = $("#txtGroupAccount").val().trim().toUpperCase();
        var txtPartner = $("#txtPartner").val().trim();

        if (groupAcc === "ENSEVAL") {
            // Jika ENSEVAL → tampilkan tombol LOV Partner
            $("#btnLOVPartner").show();
        } else {
            // Jika bukan ENSEVAL → sembunyikan tombol
            $("#btnLOVPartner").hide();

            // Jika #txtPartner SUDAH ADA isinya, baru kosongkan semua field terkait
            if (txtPartner !== "") {
                $("#txtOutlet").val("");
                $("#txtSupplierID").val("");
                $("#txtSupplierCode").val("");
                $("#txtSupplierName").val("");
                $("#txtBranchName").val("");
                $("#txtPartner").val("");
            }
        }

    }
}

function p_EnableControlUpdate(bitAllowUpdate, bitAllowUpdateAttachment) {
    if (bitAllowUpdate == true && bitAllowUpdateAttachment == true) {
        $('#btnUpdate').show();
        $("#btnUpdateAttachment").show();

        $('#txtProgramDesc').removeAttr('disabled');
        $('#txtMekanismeProgram').removeAttr('disabled');
        $('#txtRemark').removeAttr('disabled');

        $(".dtActivityPeriodFrom").each(function (index) {
            $(this).removeAttr("disabled");
        });
        $(".dtActivityPeriodTo").each(function (index) {
            $(this).removeAttr("disabled");
        });
    }
    else if (bitAllowUpdate == false && bitAllowUpdateAttachment == true) {
        $('#btnUpdate').hide();
        $("#btnUpdateAttachment").show();

        $('#txtProgramDesc').removeAttr('disabled');
        $('#txtMekanismeProgram').removeAttr('disabled');
        $('#txtRemark').removeAttr('disabled');

        $(".dtActivityPeriodFrom").each(function (index) {
            $(this).removeAttr("disabled");
        });
        $(".dtActivityPeriodTo").each(function (index) {
            $(this).removeAttr("disabled");
        });
    }
    else {
        $('#btnUpdate').hide();
        $("#btnUpdateAttachment").hide();

        $('#txtProgramDesc').attr('disabled', true);
        $('#txtMekanismeProgram').attr('disabled', true);
        $('#txtRemark').attr('disabled', true);

        $(".dtActivityPeriodFrom").each(function (index) {
            $(this).attr("disabled", "true");
        });
        $(".dtActivityPeriodTo").each(function (index) {
            $(this).attr("disabled", "true");
        });


    }
}

function p_txtID_TextChanged() {
    clsGlobal.showLoading();
    $.ajax({
        type: "POST",
        url: "/Transaksi/Klaim/GetData",
        data: { txtID: $("#txtID").val(), __RequestVerificationToken: $('#frmTrKlaim input[name=__RequestVerificationToken]').val() },
        datatype: "json",
        success: function (retDat) {

            if (retDat.bitSuccess == true) {
                if (retDat.objData != undefined) {
                    p_DataToUI(retDat.objData);
                    //setTimeout(function () {
                    //    p_getNoMkppByDocNo();
                    //}, 500);
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

function p_txtSupplierID_TextChanged() {
    clsGlobal.showLoading();

   //berdasarkan routeconfig

    $.ajax({
        type: "POST",
        url: "/Master/Supplier/GetData",
        data: { txtID: $("#txtSupplierID").val(), __RequestVerificationToken: $('#frmTrKlaim input[name=__RequestVerificationToken]').val() },
        datatype: "json",
        success: function (retDat) {
            //
            if (retDat.bitSuccess == true) {
                if (retDat.objData != undefined) { 
                    $("#txtSupplierName").val(clsGlobal.parseToString(retDat.objData.VENDOR_NAME));
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


function p_txtSupplierSiteID_TextChanged() {
    clsGlobal.showLoading();
    $.ajax({
        type: "POST",
        url: "/Master/Supplier/GetDataSite",
        data: { txtID: $("#txtSupplierSiteID").val(), __RequestVerificationToken: $('#frmTrKlaim input[name=__RequestVerificationToken]').val() },
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

function p_saveData() {
    
    clsGlobal.showLoading();
    p_UIToData();

    //Save file, from formData method
    var data = new FormData();
    if (attachments.length > 0) {
        for (var i = 0; i < attachments.length; i++) {
            data.append("attachments[]", attachments[i]);
        }
    }
    data.append("data", $("#txtHiddenObject").val());
    data.append("txtGUID", $("#txtGUID").val());
    data.append("__RequestVerificationToken", $('#frmTrKlaim input[name=__RequestVerificationToken]').val());

    $.ajax({
        type: "POST",
        url: "/Transaksi/Klaim/SaveData",
        processData: false,
        contentType: false,
        data: data,
        datatype: "json",
        success: function (retDat) {
            //
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
            //
            clsGlobal.hideLoading();
        }
    });
}

function p_updateIncludeData() {

    clsGlobal.showLoading();
    p_UIToData();
    $.ajax({
        type: "POST",
        url: "/Transaksi/Klaim/UpdateIncludeData",
        data: { data: $("#txtHiddenObject").val(), __RequestVerificationToken: $('#frmTrKlaim input[name=__RequestVerificationToken]').val() },
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
            //
            clsGlobal.hideLoading();
        }
    });
}

function p_submitData() {
  
    clsGlobal.showLoading();
    p_UIToData();

    var data = new FormData();
    if (attachments.length > 0) {
        for (var i = 0; i < attachments.length; i++) {
            data.append("attachments[]", attachments[i]);
        }
    }
    data.append("data", $("#txtHiddenObject").val());
    data.append("txtGUID", $("#txtGUID").val());
    data.append("__RequestVerificationToken", $('#frmTrKlaim input[name=__RequestVerificationToken]').val());
    
    $.ajax({
        type: "POST",
        url: "/Transaksi/Klaim/SubmitData",
        processData: false,
        contentType: false,
        data: data,
        datatype: "json",
        success: function (retDat) {
            //
            if (retDat.bitSuccess == true) {
                p_DataToUI(retDat.objData);
                if (retDat.txtMessage && retDat.txtMessage.toLowerCase().startsWith("warning:")) {
                    clsGlobal.getAlert(retDat.txtMessage);
                }
                else {
                    clsGlobal.getInformationMessage(retDat.txtMessage);
                }
            } else {
                clsGlobal.getAlert(retDat.txtMessage);
            }
            clsGlobal.hideLoading();
            $("#txtGUID").val(retDat.txtGUID);
        },
        error: function (retDat) {
            //
            clsGlobal.hideLoading();
        }
    });
}

//function p_deleteData() {
//    clsGlobal.showLoading();
//    p_UIToData();
//    $.ajax({
//        type: "POST",
//        url: "/Transaksi/Klaim/DeleteData",
//        data: { data: $("#txtHiddenObject").val(), __RequestVerificationToken: $('#frmTrKlaim input[name=__RequestVerificationToken]').val() },
//        datatype: "json",
//        success: function (retDat) {
//            //
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

function p_printoutData() {

    clsGlobal.showLoading();
    p_UIToData();
    $.ajax({
        type: "POST",
        url: "/Transaksi/Klaim/PrintoutToPDF",
        data: { data: $("#txtHiddenObject").val(), txtGUID: $("#txtGUID").val(), __RequestVerificationToken: $('#frmTrKlaim input[name=__RequestVerificationToken]').val() },
        datatype: "json",
        success: function (retDat) {
            //
            if (retDat.bitSuccess == true) {
                window.open(retDat.objData, '_blank');
            } else {
                clsGlobal.getAlert(retDat.txtMessage);
            }
            clsGlobal.hideLoading();
            $("#txtGUID").val(retDat.txtGUID);
        },
        error: function (retDat) {
            //
            clsGlobal.hideLoading();
        }
    });
}

function p_AddRow() {
    //
    clsGlobal.showLoading();
    $.ajax({
        type: "POST",
        url: "/Transaksi/Klaim/AddRow",
        data: { data: $("#txtHiddenObject").val(), __RequestVerificationToken: $('#frmTrKlaim input[name=__RequestVerificationToken]').val() },
        datatype: "json",
        success: function (retDat) {

            if (retDat.bitSuccess == true) {
                if (retDat.objData != undefined) {
                    p_SetHiddenObject(retDat.objData);
                    p_DataToUIDetail(retDat.objData.XXSHP_KDS_T_KLAIM_DTL, false, false);
                    oTable.page('last').draw(false);
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


function p_closeData(txtReasonClose) {

    clsGlobal.showLoading();
    p_UIToData();
     
    $.ajax({
        type: "POST",
        url: "/Transaksi/Klaim/CloseData",
        data: { data: $("#txtHiddenObject").val(), txtGUID: $("#txtGUID").val(), txtReasonClose: txtReasonClose, __RequestVerificationToken: $('#frmTrKlaim input[name=__RequestVerificationToken]').val() },
        datatype: "json",
        success: function (retDat) {
            //
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
            //
            clsGlobal.hideLoading();
        }
    });
}

function p_rejectData(txtReasonReject) {

    clsGlobal.showLoading();
    p_UIToData();

    $.ajax({
        type: "POST",
        url: "/Transaksi/Klaim/RejectData",
        data: { data: $("#txtHiddenObject").val(), txtGUID: $("#txtGUID").val(), txtReasonReject: txtReasonReject, __RequestVerificationToken: $('#frmTrKlaim input[name=__RequestVerificationToken]').val() },
        datatype: "json",
        success: function (retDat) {
            //
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
            //
            clsGlobal.hideLoading();
        }
    });
}

function p_copyData() {

    clsGlobal.showLoading();
    p_UIToData();

    $.ajax({
        type: "POST",
        url: "/Transaksi/Klaim/CopyData",
        data: { data: $("#txtHiddenObject").val(), txtGUID: $("#txtGUID").val(), __RequestVerificationToken: $('#frmTrKlaim input[name=__RequestVerificationToken]').val() },
        datatype: "json",
        success: function (retDat) {
            //
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
            //
            clsGlobal.hideLoading();
        }
    });
}

function p_InitiateDetail() {
    // Format datatable  
    //
    //if ($.fn.DataTable.isDataTable('#dtDetail')) {
    //    $('#dtDetail').DataTable().destroy();
    //}

    //$('#dtDetail tbody').empty();

    oTable = $('#dtDetail').DataTable({
        "bPaginate": true,
        "bSort": false,
        searching: true,
        "aLengthMenu": [[5, 10, 25, 50, 75, 100], [5, 10, 25, 50, 75, 100]],
        "iDisplayLength": 5,
        "type": "POST",
        "scrollX": true,
        "autoWidth": false,
        aoColumnDefs: [
              {
                  aTargets: [0],
                  mRender: function (data, type, full) {
                      return '<div id="lblDetailNoValue"> ' + (full.intIndex + 1) + ' </div>';
                  }
              },
           {
               aTargets: [1],
               mRender: function (data, type, full) {
                   return '     <div class="input-group"> ' +
                            '       <div class="input-group-btn"> ' +
                            '           <button type="button" class="btn btn-danger btnLOVDetailActivity" id="btnLOVDetailActivity" onclick="p_btnLOVDetailActivity_Click(this,' + full.intIndex + ')"> <i class="fa fa-search"></i></button> ' +
                            '       </div> ' +
                            '       <input type="text" class="form-control txtDetailActivity" id="txtDetailActivity"  style="width:150px;"  value="' + full.TXT_ACTIVITY + '" disabled> ' +
                            '   </div>'
                    + '<div style="display:none;"> ' + full.TXT_ACTIVITY + ' </div>';
               }
           },
           //{
           //    aTargets: [2],
           //    mRender: function (data, type, full) {
           //        return '<div >  <input type="text" class="form-control txtDetailProgramDesc text-left" id="txtDetailProgramDesc' + full.intIndex + '"  onchange="p_txtDetailProgramDesc_Changed(this,' + full.intIndex + ')"   value="' + full.TXT_PROGRAM_DESC + '" maxlength="220">  </div>' + '<div style="display:none;"> ' + full.TXT_PROGRAM_DESC + ' </div>';
           //    }
           //},
            {
                aTargets: [2],
                mRender: function (data, type, full) {
                    var objData = p_GetHiddenObject(); // ambil role user

                    if (objData.INT_LOGIN_NOW == 1060 || objData.INT_LOGIN_NOW == 1059) {
                        // Kalau role 1060 → tambahkan LOV
                        return '<div class="input-group" style="width:250px; min-width:250px; max-width:250px;">' +
                            '<div class="input-group-btn">' +
                            '<button type="button" class="btn btn-danger btnLOVProgramDesc" onclick="p_btnLOVProgramDesc_Click(this,' + full.intIndex + ')"><i class="fa fa-search"></i></button>' +
                            '</div>' +
                            '<input type="text" class="form-control txtDetailProgramDesc" ' +
                            'id="txtDetailProgramDesc' + full.intIndex + '" ' +
                            'value="' + full.TXT_PROGRAM_DESC + '" ' +
                            'disabled ' +
                            'style="width:200px; min-width:200px; max-width:200px;">' +
                            '</div>' +
                            '<div style="display:none;">' + full.TXT_PROGRAM_DESC + '</div>';
                    } else {
                        // Role selain 1060 → tetap textbox biasa
                        return '<div style="width:250px; min-width:250px; max-width:250px;">' +
                            '<input type="text" class="form-control txtDetailProgramDesc" ' +
                            'id="txtDetailProgramDesc' + full.intIndex + '" ' +
                            'onchange="p_txtDetailProgramDesc_Changed(this,' + full.intIndex + ')" ' +
                            'value="' + full.TXT_PROGRAM_DESC + '" ' +
                            'maxlength="220" ' +
                            'style="width:100%; min-width:100%; max-width:100%;">' +
                            '</div>' +
                            '<div style="display:none;">' + full.TXT_PROGRAM_DESC + '</div>';
                    }
                }
            },

           {
               aTargets: [3],
               mRender: function (data, type, full) {
                   return '<div >  <input type="text" class="form-control txtDetaildtm_period_from datetimepicker"  style="width:100px;" id="txtDetaildtm_period_from' + full.intIndex + '" onchange="p_txtDetaildtm_period_from_Changed(this,' + full.intIndex + ')"  value="' + clsGlobal.parseToDateTimeFromJSON(full.DTM_PERIOD_FROM, clsDateFormat) + '" >  </div>';
               }
           },
           {
               aTargets: [4],
               mRender: function (data, type, full) {
                   return '<div >  <input type="text" class="form-control txtDetaildtm_period_to datetimepicker"  style="width:100px;" id="txtDetaildtm_period_to' + full.intIndex + '" onchange="p_txtDetaildtm_period_to_Changed(this,' + full.intIndex + ')"  value="' + clsGlobal.parseToDateTimeFromJSON(full.DTM_PERIOD_TO, clsDateFormat) + '" >  </div>';
               }
           },
           {
               aTargets: [5],
               mRender: function (data, type, full) {
                   return '<div >  <input type="text" class="form-control txtDetailInvoiceNo text-left" id="txtDetailInvoiceNo' + full.intIndex + '" onchange="p_txtDetailInvoiceNo_Changed(this,' + full.intIndex + ')"   value="' + full.TXT_INVOICE_NO + '" >  </div>' + '<div style="display:none;"> ' + full.TXT_INVOICE_NO + ' </div>';
               }
           },
            {
                aTargets: [6],
                mRender: function (data, type, full) {
                    return '<div >  <input type="text" class="form-control txtDetailInvoiceDate datetimepicker" style="width:100px;" id="txtDetailInvoiceDate' + full.intIndex + '" onchange="p_txtDetailInvoiceDate_Changed(this,' + full.intIndex + ')" class="txtDetailInvoiceDate" value="' + clsGlobal.parseToDateTimeFromJSON(full.DTM_INVOICE, clsDateFormat) + '" >  </div>';
                }
            },
            {
                aTargets: [7],
                mRender: function (data, type, full) {
                    var txtValue = ' <div class="input-group"> ' +
                                    '   <div >  <input type="text" class="form-control txtFakturPajakNo text-left" id="txtFakturPajakNo' + full.intIndex + '" onkeyup="p_txtFakturPajakNo_Changed(this,' + full.intIndex + ')" onchange="p_txtFakturPajakNo_Changed(this,' + full.intIndex + ')"   value="' + full.TXT_FKT_PJK_NO + '" >  </div>' + '<div style="display:none;"> ' + full.TXT_FKT_PJK_NO + ' </div> ' +
                                    '   <div class="input-group-btn" style="width:100px;"> ' +
                                    '       <button type="button" class="btn btnScanFakturPajak" id="btnScanFakturPajak" onclick="p_btnScanFakturPajak_Click(this,' + full.intIndex + ')" > <i class="fa fa-barcode"></i></button> ' +
                                    '   </div> ' +
                                    '</div> ';

                        //`<div >  <input type="text" class="form-control txtFakturPajakNo text-left" id="txtFakturPajakNo' + full.intIndex + '" onkeyup="p_txtFakturPajakNo_Changed(this,' + full.intIndex + ')" onchange="p_txtFakturPajakNo_Changed(this,' + full.intIndex + ')"   value="' + full.TXT_FKT_PJK_NO + '" >  </div>' + '<div style="display:none;"> ' + full.TXT_FKT_PJK_NO + ' </div>`;
                    return txtValue;
                }
            },
            {
                aTargets: [8],
                mRender: function (data, type, full) {
                    return '<div >  <input type="text" class="form-control txtFakturPajakDate datetimepicker" style="width:100px;" id="txtFakturPajakDate' + full.intIndex + '" onchange="p_txtFakturPajakDate_Changed(this,' + full.intIndex + ')"   value="' + clsGlobal.parseToDateTimeFromJSON(full.DTM_FKT_PJK, clsDateFormat) + '" >  </div>';
                }
            },
            {
                aTargets: [9],
                mRender: function (data, type, full) {
                    return '<div >  <input type="text" class="form-control txtDetailInvoiceAmount autonumeric text-right" id="txtDetailInvoiceAmount' + full.intIndex + '" onchange="p_txtDetailInvoiceAmount_Changed(this,' + full.intIndex + ')"   value="' + full.DEC_INVOICE_AMT + '" >  </div>';
                }
            },
            {
                aTargets: [10],
                mRender: function (data, type, full) {
                    return '     <div class="input-group"> ' +
                            '       <div class="input-group-btn"> ' +
                            '           <button type="button" class="btn btn-danger btnLOVDetailPPHType" id="btnLOVDetailPPHType" onclick="p_btnLOVDetailPPHType_Click(this,' + full.intIndex + ')"> <i class="fa fa-search"></i></button> ' +
                            '       </div> ' +
                            '       <input type="text" class="form-control txtDetailPPHType" id="txtDetailPPHType" style="width:150px;"  value="' + full.TXT_PPH_JENIS + '" disabled> ' +
                            '       <div class="input-group-btn"> ' +
                            '           <button type="button" class="btn btn-warning btnClearPPH" id="btnClearPPH" onclick="p_btnClearPPH_Click(this,' + full.intIndex + ')"> <i class="fa fa-remove"></i></button> ' +
                            '       </div> ' +
                            '   </div>'
                        + '<div style="display:none;"> ' + full.TXT_PPH_JENIS + ' </div>';

                }
            },
            {
                aTargets: [11],
                mRender: function (data, type, full) {
                    return '<div >  <input type="text" class="form-control txtDetailPersenPPH autonumeric text-right" style="width:100px; id="txtDetailPersenPPH' + full.intIndex + '"   value="' + full.DEC_PERSEN_PPH + '" readonly>  </div>';
                }
            },
            {
                aTargets: [12],
                mRender: function (data, type, full) {
                    return '<div >  <input type="text" class="form-control txtDetailAmountPPH autonumeric text-right" id="txtDetailAmountPPH' + full.intIndex + '"  value="' + full.DEC_PPH + '" readonly>  </div>';
                }
            },
            {
                aTargets: [13],
                mRender: function (data, type, full) {
                    return '<div >  <input type="text" class="form-control txtDetaiFinalAmount autonumeric text-right" id="txtDetaiFinalAmount' + full.intIndex + '"  value="' + (clsGlobal.parseToDecimal(full.DEC_INVOICE_AMT) - clsGlobal.parseToDecimal(full.DEC_PPH)) + '" readonly>  </div>';
                }
            },
            {
                aTargets: [14],
                mRender: function (data, type, full) {
                    //if (clsGlobal.parseToInteger(full.DEC_PPN) > 0) {
                    //    return '     <div class="input-group"> ' +
                    //           '       <div class="input-group-btn"> ' +
                    //           ' <input type="checkbox" id="chkDetailPPN" class="chkDetailPPN" onchange="p_chkDetailPPN_Changed(this,' + full.intIndex + ')"  checked > ' +
                    //           '       </div> ' +
                    //           '       <input type="text" class="form-control txtDetailPPN autonumeric text-right" id="txtDetailPPN" style="width:100px;"  value="' + full.DEC_PPN + '" onchange="p_txtDetailPPN_Changed(this,' + full.intIndex + ')"  > ' +
                    //           '   </div>';

                    //} else {
                    //    return '     <div class="input-group"> ' +
                    //           '       <div class="input-group-btn"> ' +
                    //           ' <input type="checkbox" id="chkDetailPPN" class="chkDetailPPN" onchange="p_chkDetailPPN_Changed(this,' + full.intIndex + ')" >  ' +
                    //           '       </div> ' +
                    //           '       <input type="text" class="form-control txtDetailPPN  autonumeric text-right" id="txtDetailPPN" style="width:100px;"  value="0" disabled> ' +
                    //           '   </div>';
                    //}
                    var txtResult = "";
                    txtResult += "<select class='form-control ddlPPN' id='ddlPPN' onchange='p_ddlPPN_TextChanged(this," + full.intIndex + ")'>";
                    txtResult += "<option value=''>-</option>";
                    for (var i = 0; i < ZX_RATES_BList.length; i++) {
                        if (ZX_RATES_BList[i].TAX_RATE_CODE == full.TXT_PPNTAXRATE_CODE) {
                            txtResult += "<option value='" + ZX_RATES_BList[i].TAX_RATE_CODE + ";" + ZX_RATES_BList[i].PERCENTAGE_RATE + "' selected>" + ZX_RATES_BList[i].TAX_RATE_CODE + "</option>";
                        } else {
                            txtResult += "<option value='" + ZX_RATES_BList[i].TAX_RATE_CODE + ";" + ZX_RATES_BList[i].PERCENTAGE_RATE + "' >" + ZX_RATES_BList[i].TAX_RATE_CODE + "</option>";
                        }
                    }
                    txtResult += "</select>";
                    return txtResult;
                }
            },
            {
                aTargets: [15],
                mRender: function (data, type, full) {
                    if (clsGlobal.parseToInteger(full.DEC_PPN) > 0) {
                        return '<div >  <input type="text" class="form-control txtDetailPPN autonumeric text-right" id="txtDetailPPN" style="width:100px;"  value="' + full.DEC_PPN + '" onchange="p_txtDetailPPN_Changed(this,' + full.intIndex + ')"  >  </div>';
                    }
                    else {
                        return '<div >  <input type="text" class="form-control txtDetailPPN  autonumeric text-right" id="txtDetailPPN" style="width:100px;"  value="0" disabled>  </div>';
                    }
                }
            },
            {
                aTargets: [16],
                mRender: function (data, type, full) {
                    return '<div >  <input type="text" class="form-control txtDetailTotal autonumeric text-right" id="txtDetailTotal' + full.intIndex + '"  value="' + (clsGlobal.parseToDecimal(full.DEC_INVOICE_AMT) - clsGlobal.parseToDecimal(full.DEC_PPH) + clsGlobal.parseToDecimal(full.DEC_PPN)) + '" ReadOnly >  </div>';
                }
            },
             {
                 aTargets: [17],
                 mRender: function (data, type, full) {
                     if (clsGlobal.ParseBooleanOracleToNET(full.BIT_ALLBRAND)) {
                         return '<div > <input type="checkbox" id="chkDetailAllBrand" class="chkDetailAllBrand" onchange="p_chkDetailAllBrand_Changed(this,' + full.intIndex + ')"  checked >  </div>';
                     } else {
                         return '<div > <input type="checkbox" id="chkDetailAllBrand" class="chkDetailAllBrand" onchange="p_chkDetailAllBrand_Changed(this,' + full.intIndex + ')" >  </div>';
                     }
                 }
             },
             {
                 aTargets: [18],
                 mRender: function (data, type, full) {                     
                     if (clsGlobal.ParseBooleanOracleToNET(full.BIT_ALLBRAND)) {
                         return '';
                     }
                     else {
                         return '<div > <input type="button" class="btn btn-info btnDetailUmbrand" id="btnDetailUmbrand" onclick="p_btnDetailUmbrand_Click(this,' + full.intIndex + ')"  value="Umbrand" >  </div>';
                     }                     
                 }
            },
            {
                aTargets: [19],
                mRender: function (data, type, full) {
                    //
                    if (full.XXSHP_KDS_T_KLAIM_DTL_ATT != null) {
                        if (full.XXSHP_KDS_T_KLAIM_DTL_ATT.filter(x => x.BIT_ACTIVE == clsGlobal.ParseBooleanNETToOracle(true)).length > 0) {
                        //if (full.XXSHP_KDS_T_KLAIM_DTL_ATT.length > 0) {
                            var txtStatusHeader = $("#lblStatusFlow").html();
                            if (txtStatusHeader == "DRAFT" || txtStatusHeader == "") {
                                return '<div style="display:flex;">' +
                                    '<input type="file" id="fileDetail' + full.intIndex + '" class="inputAttachment form-control" onchange="p_fllAttachment_Changed(this,' + full.intIndex + ')"></input>' +
                                    '<input type="button" class="btnViewAttachment btn btn-success" onclick="p_btnViewAttachment_Click(this,' + full.intIndex + ')" value="View" />' +
                                    '<input type="button" class="btnRemoveAttachment btn btn-danger"  onclick="p_btnRemoveAttachment_Click(this,' + full.intIndex + ')" value="Remove"  />' +
                                    '</div>';
                            } else {
                                return '<div style="display:flex;">' +
                                    '<input type="file" id="fileDetail' + full.intIndex + '" class="inputAttachment form-control" onchange="p_fllAttachment_Changed(this,' + full.intIndex + ')"></input>' +
                                    '<input type="button" class="btnViewAttachment btn btn-success" onclick="p_btnViewAttachment_Click(this,' + full.intIndex + ')" value="View" />' +
                                    '</div>';
                            }
                        } else {
                            return '<div style="display:flex;">' +
                                '<input type="file" id="fileDetail' + full.intIndex + '" class="form-control" onchange="p_fllAttachment_Changed(this,' + full.intIndex + ')"></input>' +
                                '</div>';
                        }
                    } else {
                        return '<div style="display:flex;">' +
                            '<input type="file" id="fileDetail' + full.intIndex + '" class="form-control" onchange="p_fllAttachment_Changed(this,' + full.intIndex + ')"></input>' +
                            '</div>';
                    }
                }
            },
            {
                aTargets: [20],
                mRender: function (data, type, full) {
                    return '<div > <input type="button" class="btn btn-warning btnDetailDelete" id="btnDetailDelete"  onclick="p_btnDetailDelete_Click(this,' + full.intIndex + ')"  value="Delete" >  </div>';
                }
            },
            {
                aTargets: [21],
                mRender: function (data, type, full) {
                    var txtResult = "";
                    txtResult += "<select class='form-control' id='ddlDetailStatus' onchange='p_ddlDetailStatus_TextChanged(this," + full.intIndex + ")'>";
                    txtResult += "<option value=''>-</option>";
                    if (full.TXT_STATUSKLAIM == "APPROVED") {
                        txtResult += "<option value='APPROVED' selected>APPROVED</option>";
                    } else {
                        txtResult += "<option value='APPROVED'>APPROVED</option>";
                    }
                    if (full.TXT_STATUSKLAIM == "REJECTED") {
                        txtResult += "<option value='REJECTED' selected>REJECTED</option>";
                    } else {
                        txtResult += "<option value='REJECTED'>REJECTED</option>";
                    }
                    if (full.TXT_STATUSKLAIM == "PENDING") {
                        txtResult += "<option value='PENDING' selected>PENDING</option>";
                    } else {
                        txtResult += "<option value='PENDING'>PENDING</option>";
                    }
                    txtResult += "</select>";
                    return txtResult; 
                }
            },
            {
                aTargets: [22],
                mRender: function (data, type, full) {
                    return "<div >  <input type='text' class='form-control txtDetailStatusDesc' id='txtDetailStatusDesc'  value='" + full.TXT_STATUS_DESC + "' onchange='p_txtDetailStatusDesc_TextChanged(this," + full.intIndex + ")' />  </div>";                    
                }
            },
            {
                aTargets: [23],
                mRender: function (data, type, full) {
                    if (clsGlobal.ParseBooleanOracleToNET(full.BIT_INCLUDE)) {
                        return '<div > <input type="checkbox" id="chkDetailInclude" class="chkDetailInclude" onchange="p_chkDetailInclude_Changed(this,' + full.intIndex + ')"  checked >  </div>';
                    } else {
                        return '<div > <input type="checkbox" id="chkDetailInclude" class="chkDetailInclude" onchange="p_chkDetailInclude_Changed(this,' + full.intIndex + ')" >  </div>';
                    }
                }
            }

        ]
    });
    

    $("#dtDetail").css("width", "100%"); 
    $('#dtDetail tbody').on('click', 'tr', function () {
        if (!$(this).hasClass('selected')) {
            oTable.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
        }
    });

    // === AUTO LOCK SETIAP REDRAW TANPA setTimeout ===
    $('#dtDetail').on('draw.dt', function () {
        var objData = p_GetHiddenObject();
        if (objData && (objData.INT_LOGIN_NOW == 1060 || objData.INT_ROLE_LOGIN == 1059)) {
            $(".btnLOVDetailActivity").hide();
            $(".txtDetailActivity").attr("disabled", "true");
            $(".btnLOVDetailPPHType").hide();
            $(".txtDetailPPHType").attr("disabled", "true");
            $(".btnClearPPH").hide();
        }
    });

}

function p_GetSelectedDetailRow() {
    var intIndex = clsGlobal.parseToInteger(oTable.$('tr.selected').find("#lblDetailNoValue").html()) - 1;
    return intIndex;
}
 
function p_btnDetailUmbrand_Click(objCaller, intIndex) { 
    
    try {
        // Parse dari HiddenObject->JSON
        var objData = JSON.parse(p_UIToData());
        for (i = 0; i < objData.XXSHP_KDS_T_KLAIM_DTL.length; i++) {
            // Cari Index-nya.
            if (objData.XXSHP_KDS_T_KLAIM_DTL[i].intIndex == intIndex) {
                // Ketemu, mulai dari sini:
                  
                var fancyboxdata = p_GetHiddenObject();
                LOV = clsGlobal.generatePopUpIframe($(location).attr('protocol') + "//" + $(location).attr('host') + "/Transaksi/Klaim/Umbrand?intIndex=" + intIndex, "btnDetailUmbrand", fancyboxdata);
                break;
            }
        }
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
}

//function p_setDetailUmbrand() {
//    
//    var intSelectedIndex = p_GetSelectedDetailRow();
//    var intRowIndex = 0;
//    var objDat = p_GetHiddenObject(); 
//    p_SetHiddenObject(objDat);
//}

 
function p_btnLOVDetailPPHType_Click(objCaller, intIndex) {

    var intSelectedIndex = p_GetSelectedDetailRow();
    var intRowIndex = 0;
    var objDat = p_GetHiddenObject();

    oTable.rows().every(function (rowIdx, tableLoop, rowLoop) {
        //
        var d = this.data();
        if (intRowIndex == intSelectedIndex) {
                        LOV = clsGlobal.generateLOV(MODULE_PERSEN_PPH, "txtDetailPPHType", objDat.XXSHP_KDS_T_KLAIM_DTL[intRowIndex].TXT_ACTIVITY + "|" + $("#txtSupplierCode").val() + "|" + $("#txtSupplierSiteID").val());
        }

        intRowIndex++;
    });

}


function p_settxtDetailPPHType(txtValueid, txtvaluetext, txtvaluepersen) {
    var intSelectedIndex = p_GetSelectedDetailRow();
    var intRowIndex = 0;
    var objDat = p_GetHiddenObject();

    oTable.rows().every(function (rowIdx, tableLoop, rowLoop) {
        //
        var d = this.data();
        if (intRowIndex == intSelectedIndex) {
            d.intIndex = intRowIndex; // update data source for the row 

            
            objDat.XXSHP_KDS_T_KLAIM_DTL[intRowIndex].TXT_PPH_JENIS = txtvaluetext;
            objDat.XXSHP_KDS_T_KLAIM_DTL[intRowIndex].INT_PPH_DTL_ID = txtValueid;
            objDat.XXSHP_KDS_T_KLAIM_DTL[intRowIndex].DEC_PERSEN_PPH = txtvaluepersen;

            objDat.XXSHP_KDS_T_KLAIM_DTL[intRowIndex].DEC_PPH = Math.floor(clsGlobal.parseToDecimal(objDat.XXSHP_KDS_T_KLAIM_DTL[intRowIndex].DEC_INVOICE_AMT) *( clsGlobal.parseToDecimal(objDat.XXSHP_KDS_T_KLAIM_DTL[intRowIndex].DEC_PERSEN_PPH)/100));

            d.TXT_PPH_JENIS = txtvaluetext;
            d.DEC_PERSEN_PPH = txtvaluepersen;
            d.DEC_PPH = objDat.XXSHP_KDS_T_KLAIM_DTL[intRowIndex].DEC_PPH;
            d.DEC_INVOICE_AMT = objDat.XXSHP_KDS_T_KLAIM_DTL[intRowIndex].DEC_INVOICE_AMT;
            this.invalidate(); // invalidate the data DataTables has cached for this row         
            p_EnableControl(clsGlobal.ParseBooleanOracleToNET(objDat.BIT_APPLY), clsGlobal.ParseBooleanOracleToNET(objDat.BIT_APPROVED), clsGlobal.ParseBooleanOracleToNET(objDat.BIT_REJECTED));
        }

        intRowIndex++;
    });

    p_SetHiddenObject(objDat);

}


function p_btnClearPPH_Click(objCaller, intIndex) {
    
    //// Parse dari HiddenObject->JSON
    //var objData = JSON.parse(p_UIToData());
    //for (i = 0; i < objData.XXSHP_KCO_T_KLAIM_DTL.length; i++) {
    //    // Cari Index-nya.
    //    if (objData.XXSHP_KCO_T_KLAIM_DTL[i].intIndex == intIndex) {
    //        // Ketemu, mulai dari sini:

    //        objData.XXSHP_KCO_T_KLAIM_DTL[i].TXT_PPH_JENIS = "";
    //        objData.XXSHP_KCO_T_KLAIM_DTL[i].INT_PPH_DTL_ID = "";
    //        objData.XXSHP_KCO_T_KLAIM_DTL[i].DEC_PERSEN_PPH = 0;

    //        objData.XXSHP_KCO_T_KLAIM_DTL[i].DEC_PPH = 0;

    //        break;
    //    }
    //} 


    var intSelectedIndex = intIndex;
    var intRowIndex = 0;
    var objDat = p_GetHiddenObject();

    oTable.rows().every(function (rowIdx, tableLoop, rowLoop) {
        
        var d = this.data();
        if (intRowIndex == intSelectedIndex) {
            d.intIndex = intRowIndex; // update data source for the row 


            objDat.XXSHP_KDS_T_KLAIM_DTL[intRowIndex].TXT_PPH_JENIS = "";
            objDat.XXSHP_KDS_T_KLAIM_DTL[intRowIndex].INT_PPH_DTL_ID = "";
            objDat.XXSHP_KDS_T_KLAIM_DTL[intRowIndex].DEC_PERSEN_PPH = 0;

            objDat.XXSHP_KDS_T_KLAIM_DTL[intRowIndex].DEC_PPH = 0;

            d.TXT_PPH_JENIS = "";
            d.DEC_PERSEN_PPH = 0;
            d.DEC_PPH = objDat.XXSHP_KDS_T_KLAIM_DTL[intRowIndex].DEC_PPH;
            d.DEC_INVOICE_AMT = objDat.XXSHP_KDS_T_KLAIM_DTL[intRowIndex].DEC_INVOICE_AMT;
            this.invalidate(); // invalidate the data DataTables has cached for this row         
            p_EnableControl(clsGlobal.ParseBooleanOracleToNET(objDat.BIT_APPLY), clsGlobal.ParseBooleanOracleToNET(objDat.BIT_APPROVED), clsGlobal.ParseBooleanOracleToNET(objDat.BIT_REJECTED));
        }

        intRowIndex++;
    });

    p_SetHiddenObject(objDat);

}


function p_btnLOVDetailActivity_Click(objCaller, intIndex) {
    LOV = clsGlobal.generateLOV(MODULE_ACTIVITY_BY_SUPPLIER, "txtDetailActivity", $("#txtSupplierID").val().toString());    
}


function p_btnScanFakturPajak_Click(objCaller, intIndex) {
    
    try {
        // Parse dari HiddenObject->JSON
        var objData = JSON.parse(p_UIToData());
        for (i = 0; i < objData.XXSHP_KDS_T_KLAIM_DTL.length; i++) {
            // Cari Index-nya.
            if (objData.XXSHP_KDS_T_KLAIM_DTL[i].intIndex == intIndex) {
                // Ketemu, mulai dari sini:

                var fancyboxdata = p_GetHiddenObject();
                LOV = clsGlobal.generatePopUpIframeSmall($(location).attr('protocol') + "//" + $(location).attr('host') + "/Transaksi/Klaim/ScanFakturPajak?intIndex=" + intIndex, "btnScanFakturPajak", fancyboxdata);
                break;
            }
        }
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
}

function setbtnScanFakturPajak() { 
    try {
        
        clsGlobal.closePopUpIframe();
        var objData = JSON.parse(p_UIToData());
        var bitViewInclude = p_setBooleanBitInclude();
        p_DataToUIDetail(objData.XXSHP_KDS_T_KLAIM_DTL, clsGlobal.ParseBooleanOracleToNET(objData.BIT_APPLY), bitViewInclude);
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
}

function p_settxtDetailActivity(txtValue) {
    var intSelectedIndex = p_GetSelectedDetailRow();
    var intRowIndex = 0;
    var objDat = p_GetHiddenObject();
    //
    //for (i = 0; i < objDat.XXSHP_KCO_T_KLAIM_DTL.length; i++)
    //{
    //   // if (objDat.XXSHP_KCO_T_KLAIM_DTL[i].intIndex != intRowIndex)
    //    //{
    //        //if (objDat.XXSHP_KCO_T_KLAIM_DTL[i].TXT_ACTIVITY == txtValue)
    //        //{
    //        //    clsGlobal.showAlert("Activity " + (objCaller.value) + " sudah ada di baris ke " + (i + 1) + "!");
    //        //    return;
    //        //}
    //    //} 
    //}
    
    oTable.rows().every(function (rowIdx, tableLoop, rowLoop) {
        //
        var d = this.data(); 
        if (intRowIndex == intSelectedIndex) {
            d.intIndex = intRowIndex; // update data source for the row 

            d.TXT_ACTIVITY = txtValue; 
            d.TXT_COA = objDat.XXSHP_KDS_T_KLAIM_DTL[intRowIndex].TXT_COA;
            d.TXT_PPH_JENIS = objDat.XXSHP_KDS_T_KLAIM_DTL[intRowIndex].TXT_PPH_JENIS;
            d.TXT_PPH_TYPE = objDat.XXSHP_KDS_T_KLAIM_DTL[intRowIndex].TXT_PPH_TYPE;
            d.TXT_FKT_PJK_NO = objDat.XXSHP_KDS_T_KLAIM_DTL[intRowIndex].TXT_FKT_PJK_NO;
            d.TXT_PROGRAM_DESC = objDat.XXSHP_KDS_T_KLAIM_DTL[intRowIndex].TXT_PROGRAM_DESC;
            d.DTM_PERIOD_FROM = objDat.XXSHP_KDS_T_KLAIM_DTL[intRowIndex].DTM_PERIOD_FROM;
            d.DTM_PERIOD_TO = objDat.XXSHP_KDS_T_KLAIM_DTL[intRowIndex].DTM_PERIOD_TO;
            d.TXT_INVOICE_NO = objDat.XXSHP_KDS_T_KLAIM_DTL[intRowIndex].TXT_INVOICE_NO;
            d.DTM_INVOICE = objDat.XXSHP_KDS_T_KLAIM_DTL[intRowIndex].DTM_INVOICE;
            d.DTM_FKT_PJK = objDat.XXSHP_KDS_T_KLAIM_DTL[intRowIndex].DTM_FKT_PJK;
            d.DEC_INVOICE_AMT = objDat.XXSHP_KDS_T_KLAIM_DTL[intRowIndex].DEC_INVOICE_AMT;
            d.TXT_PPH_JENIS = objDat.XXSHP_KDS_T_KLAIM_DTL[intRowIndex].TXT_PPH_JENIS;
            d.DEC_PERSEN_PPH = objDat.XXSHP_KDS_T_KLAIM_DTL[intRowIndex].DEC_PERSEN_PPH;
            d.BIT_ALLBRAND = objDat.XXSHP_KDS_T_KLAIM_DTL[intRowIndex].BIT_ALLBRAND;
            d.BIT_INCLUDE = objDat.XXSHP_KDS_T_KLAIM_DTL[intRowIndex].BIT_INCLUDE;

            objDat.XXSHP_KDS_T_KLAIM_DTL[intRowIndex].TXT_ACTIVITY = txtValue; 

            this.invalidate(); // invalidate the data DataTables has cached for this row         
            p_EnableControl(clsGlobal.ParseBooleanOracleToNET(objDat.BIT_APPLY), clsGlobal.ParseBooleanOracleToNET(objDat.BIT_APPROVED), clsGlobal.ParseBooleanOracleToNET(objDat.BIT_REJECTED));
        }

        intRowIndex++;
    });

    p_SetHiddenObject(objDat);

}


function p_setBooleanBitInclude() {
    var objData = JSON.parse(p_UIToData());

    var bitViewInclude = true;
    if (objData.TXT_STATUSFLOW == "DRAFT" || objData.TXT_STATUSFLOW == "REJECTED" || objData.INT_LOGIN_NOW != 1051) {
        bitViewInclude = false;
    } else if (objData.INT_LOGIN_NOW == 1051) {
        bitViewInclude = true;
    }

    return bitViewInclude;
}

function p_setBooleanBitCanSetStatus() {
    //var objData = JSON.parse(p_UIToData());
    var objData = p_GetHiddenObject();
    var bitCanSetStatus = false;

    if (clsGlobal.ParseBooleanOracleToNET(objData.BIT_APPLY) && !clsGlobal.ParseBooleanOracleToNET(objData.BIT_APPROVED)) {
        bitCanSetStatus = true;
    }

    return bitCanSetStatus;
}
//onclick



//onchange

function p_txtDetailProgramDesc_Changed(objCaller, intIndex) {
    //
    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());
    for (i = 0; i < objData.XXSHP_KDS_T_KLAIM_DTL.length; i++) {
        // Cari Index-nya.
        if (objData.XXSHP_KDS_T_KLAIM_DTL[i].intIndex == intIndex) {
            // Ketemu, mulai dari sini:
            objData.XXSHP_KDS_T_KLAIM_DTL[i].TXT_PROGRAM_DESC = objCaller.value;
            break;
        }
    }
    p_SetHiddenObject(objData);
}

function p_txtDetailInvoiceNo_Changed(objCaller, intIndex) {
    //
    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());
    for (i = 0; i < objData.XXSHP_KDS_T_KLAIM_DTL.length; i++) {
        // Cari Index-nya.
        if (objData.XXSHP_KDS_T_KLAIM_DTL[i].intIndex == intIndex) {
            // Ketemu, mulai dari sini:
            objData.XXSHP_KDS_T_KLAIM_DTL[i].TXT_INVOICE_NO = objCaller.value;
            break;
        }
    }
    p_SetHiddenObject(objData);
}

function p_txtDetaildtm_period_from_Changed(objCaller, intIndex) {
    //
    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());
    for (i = 0; i < objData.XXSHP_KDS_T_KLAIM_DTL.length; i++) {
        // Cari Index-nya.
        if (objData.XXSHP_KDS_T_KLAIM_DTL[i].intIndex == intIndex) {
            // Ketemu, mulai dari sini:
            if (clsGlobal.parseToString(objCaller.value) != "") {                
                objData.XXSHP_KDS_T_KLAIM_DTL[i].DTM_PERIOD_FROM = clsGlobal.parseToJSONDateFromDate(objCaller.value, clsDateFormat);
            } else {
                objCaller.value = clsGlobal.parseToDateTimeFromJSON(objData.XXSHP_KDS_T_KLAIM_DTL[i].DTM_PERIOD_FROM, clsDateFormat)
            }
             
            break;
        }
    }
    p_SetHiddenObject(objData);
}

function p_txtDetaildtm_period_to_Changed(objCaller, intIndex) {
    //
    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());
    for (i = 0; i < objData.XXSHP_KDS_T_KLAIM_DTL.length; i++) {
        // Cari Index-nya.
        if (objData.XXSHP_KDS_T_KLAIM_DTL[i].intIndex == intIndex) {
            // Ketemu, mulai dari sini:
            if (clsGlobal.parseToString(objCaller.value) != "") {
                objData.XXSHP_KDS_T_KLAIM_DTL[i].DTM_PERIOD_TO = clsGlobal.parseToJSONDateFromDate(objCaller.value, clsDateFormat);
            } else {
                objCaller.value = clsGlobal.parseToDateTimeFromJSON(objData.XXSHP_KDS_T_KLAIM_DTL[i].DTM_PERIOD_TO, clsDateFormat)
            } 
            break;
        }
    }
    p_SetHiddenObject(objData);
}



//function p_txtDetaildtm_period_to_Changed(objCaller, intIndex) {
//    //
//    // Parse dari HiddenObject->JSON
//    var objData = JSON.parse(p_UIToData());
//    for (i = 0; i < objData.XXSHP_KCO_T_KLAIM_DTL.length; i++) {
//        // Cari Index-nya.
//        if (objData.XXSHP_KCO_T_KLAIM_DTL[i].intIndex == intIndex) {
//            // Ketemu, mulai dari sini:
//            objData.XXSHP_KCO_T_KLAIM_DTL[i].DTM_PERIOD_TO = objCaller.value;
//            break;
//        }
//    }
//    p_SetHiddenObject(objData);
//}

//function p_txtDetailInvoiceNo_Changed(objCaller, intIndex) {
//    //
//    // Parse dari HiddenObject->JSON
//    var objData = JSON.parse(p_UIToData());
//    for (i = 0; i < objData.XXSHP_KCO_T_KLAIM_DTL.length; i++) {
//        // Cari Index-nya.
//        if (objData.XXSHP_KCO_T_KLAIM_DTL[i].intIndex == intIndex) {
//            // Ketemu, mulai dari sini:
//            objData.XXSHP_KCO_T_KLAIM_DTL[i].TXT_INVOICE_NO = objCaller.value;
//            break;
//        }
//    }
//    p_SetHiddenObject(objData);
//}

function p_txtDetailInvoiceDate_Changed(objCaller, intIndex) {
    //
    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());
    for (i = 0; i < objData.XXSHP_KDS_T_KLAIM_DTL.length; i++) {
        // Cari Index-nya.
        if (objData.XXSHP_KDS_T_KLAIM_DTL[i].intIndex == intIndex) {
            // Ketemu, mulai dari sini:
            if (clsGlobal.parseToString(objCaller.value) != "") {
                objData.XXSHP_KDS_T_KLAIM_DTL[i].DTM_INVOICE = clsGlobal.parseToJSONDateFromDate(objCaller.value, clsDateFormat);
            } else {
                objCaller.value = clsGlobal.parseToDateTimeFromJSON(objData.XXSHP_KDS_T_KLAIM_DTL[i].DTM_INVOICE, clsDateFormat)
            }
             
            break;
        }
    }
    p_SetHiddenObject(objData);
}

function p_txtFakturPajakNo_Changed(objCaller, intIndex) {
    //
    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());
    for (i = 0; i < objData.XXSHP_KDS_T_KLAIM_DTL.length; i++) {
        // Cari Index-nya.
        if (objData.XXSHP_KDS_T_KLAIM_DTL[i].intIndex == intIndex) {
            // Ketemu, mulai dari sini
            objData.XXSHP_KDS_T_KLAIM_DTL[i].TXT_FKT_PJK_NO = formatFakturpajakNew2025(objCaller.value);
            objCaller.value = objData.XXSHP_KDS_T_KLAIM_DTL[i].TXT_FKT_PJK_NO;
            
            break;
        }
    }
    p_SetHiddenObject(objData);
    //p_RefreshNumberDetail();
    //objCaller.focus();
}

function formatFakturpajak(txtValue) {
    
    // 010.019-17.86476213
    // 1
    //var $this = $(this);
    var input = txtValue;

    // 2
    //input = input.replace(/[\W\s\._\-]+/g, '');
    input = input.replace(/[A-Za-z\._\-]+/g, '');

    // 3
    var split = 4;
    var chunk = [];

    //for (var i = 0, len = input.length; i < len; i += split) {
    //    split = (i >= 8 && i <= 16) ? 4 : 8;
    //    chunk.push(input.substr(i, split));
    //}
    for (var i = 0, j = 0; j < input.length && i < 19; i += 1) {
        //split = (i >= 8 && i <= 16) ? 4 : 8;
        if (i == 3) {
            chunk.push('.');
        } else if (i == 7) {
            chunk.push('-');
        } else if (i == 10) {
            chunk.push('.');
        } else {
            chunk.push(input.substr(j, 1));
            j += 1;
        }        
    }

    // 4
    return chunk.join('').toString();
    //$this.val(function () {
    //    //chunk.join("-").toUpperCase();
    //});
}

function formatFakturpajakNew2025(txtValue) {
    //NOTES UPDATE 2025 17 DIGIT TANPA SPECIAL CHARACTER
    // 010.019-17.86476213
    // 1
    //var $this = $(this);
    var input = txtValue;

    // 2
    //input = input.replace(/[\W\s\._\-]+/g, '');
    input = input.replace(/[A-Za-z\._\-]+/g, '');

    // 3
    var split = 4;
    var chunk = [];

    //for (var i = 0, len = input.length; i < len; i += split) {
    //    split = (i >= 8 && i <= 16) ? 4 : 8;
    //    chunk.push(input.substr(i, split));
    //}
    for (var i = 0, j = 0; j < input.length && i < 17; i += 1) {
        ////split = (i >= 8 && i <= 16) ? 4 : 8;
        //if (i == 3) {
        //    chunk.push('.');
        //} else if (i == 7) {
        //    chunk.push('-');
        //} else if (i == 10) {
        //    chunk.push('.');
        //} else {
        //    chunk.push(input.substr(j, 1));
        //    j += 1;
        //}
        chunk.push(input.substr(j, 1));
        j += 1;
    }

    // 4
    return chunk.join('').toString();
    //$this.val(function () {
    //    //chunk.join("-").toUpperCase();
    //});
}


function p_txtFakturPajakDate_Changed(objCaller, intIndex) {
    //
    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());
    for (i = 0; i < objData.XXSHP_KDS_T_KLAIM_DTL.length; i++) {
        // Cari Index-nya.
        if (objData.XXSHP_KDS_T_KLAIM_DTL[i].intIndex == intIndex) {
            // Ketemu, mulai dari sini:
            if (clsGlobal.parseToString(objCaller.value) != "") {
                objData.XXSHP_KDS_T_KLAIM_DTL[i].DTM_FKT_PJK = clsGlobal.parseToJSONDateFromDate(objCaller.value, clsDateFormat);
            } else {
                objCaller.value = clsGlobal.parseToDateTimeFromJSON(objData.XXSHP_KDS_T_KLAIM_DTL[i].DTM_FKT_PJK, clsDateFormat)
            }
             
            break;
        }
    }
    p_SetHiddenObject(objData);
}

function p_ddlPPN_TextChanged(objCaller, intIndex) {
    
    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());
    
    for (i = 0; i < objData.XXSHP_KDS_T_KLAIM_DTL.length; i++) {
        // Cari Index-nya.
        if (objData.XXSHP_KDS_T_KLAIM_DTL[i].intIndex == intIndex) {
            // Ketemu, mulai dari sini:
            var resultPPNSplit = clsGlobal.parseToString(objCaller.value).split(';');
            if (resultPPNSplit.length == 2) {
                
                var decPercent = clsGlobal.parseToDecimal(resultPPNSplit[1]);

                var decInvoiceAmount = clsGlobal.parseToDecimal(objData.XXSHP_KDS_T_KLAIM_DTL[i].DEC_INVOICE_AMT);
                var decPPNAmount = Math.floor(decInvoiceAmount * decPercent / 100);

                objData.XXSHP_KDS_T_KLAIM_DTL[i].TXT_PPNTAXRATE_CODE = clsGlobal.parseToString(resultPPNSplit[0]);
                objData.XXSHP_KDS_T_KLAIM_DTL[i].DEC_PPN_PERCENTAGE = decPercent;
                objData.XXSHP_KDS_T_KLAIM_DTL[i].DEC_PPN = decPPNAmount;
            }

            break;
        }
    }
    p_SetHiddenObject(objData);
    p_refresh_row_detail(intIndex);
    p_EnableControl(clsGlobal.ParseBooleanOracleToNET(objData.BIT_APPLY), clsGlobal.ParseBooleanOracleToNET(objData.BIT_APPROVED), clsGlobal.ParseBooleanOracleToNET(objData.BIT_REJECTED));
    objCaller.focus();
}

function p_txtDetailInvoiceAmount_Changed(objCaller, intIndex) {
    
    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());
    for (i = 0; i < objData.XXSHP_KDS_T_KLAIM_DTL.length; i++) {
        // Cari Index-nya.
        if (objData.XXSHP_KDS_T_KLAIM_DTL[i].intIndex == intIndex) {
            // Ketemu, mulai dari sini:
            objData.XXSHP_KDS_T_KLAIM_DTL[i].DEC_INVOICE_AMT = clsGlobal.parseToDecimal(objCaller.value);

            // Calculate pph dan ppn nya
            objData.XXSHP_KDS_T_KLAIM_DTL[i].DEC_PPH = clsGlobal.parseToDecimal(objData.XXSHP_KDS_T_KLAIM_DTL[i].DEC_INVOICE_AMT) * (clsGlobal.parseToDecimal(objData.XXSHP_KDS_T_KLAIM_DTL[i].DEC_PERSEN_PPH) / 100);
            objData.XXSHP_KDS_T_KLAIM_DTL[i].DEC_PPN = clsGlobal.parseToDecimal(objData.XXSHP_KDS_T_KLAIM_DTL[i].DEC_INVOICE_AMT) * (clsGlobal.parseToDecimal(objData.XXSHP_KDS_T_KLAIM_DTL[i].DEC_PPN_PERCENTAGE) / 100);
            //objData.XXSHP_KCO_T_KLAIM_DTL[i].DEC_AMOUNT = clsGlobal.parseToDecimal(objData.XXSHP_KCO_T_KLAIM_DTL[i].DEC_PPN) + clsGlobal.parseToDecimal(objData.XXSHP_KCO_T_KLAIM_DTL[i].DEC_DPP) - objData.XXSHP_KCO_T_KLAIM_DTL[i].DEC_PPH;

            break;
        }
    }
    p_SetHiddenObject(objData);
    p_refresh_row_detail(intIndex);
    objCaller.focus();
}

//function p_txtDetailPPN_Changed(objCaller, intIndex) {
//    //
//    // Parse dari HiddenObject->JSON
//    var objData = JSON.parse(p_UIToData());
//    for (i = 0; i < objData.XXSHP_KCO_T_KLAIM_DTL.length; i++) {
//        // Cari Index-nya.
//        if (objData.XXSHP_KCO_T_KLAIM_DTL[i].intIndex == intIndex) {
//            // Ketemu, mulai dari sini:
//            objData.XXSHP_KCO_T_KLAIM_DTL[i].DEC_PPN = clsGlobal.parseToDecimal(objCaller.value);
//            break;
//        }
//    }
//    p_SetHiddenObject(objData);
//}

function p_txtDetailPersenPPH_Changed(objCaller, intIndex) {
    //
    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());
    for (i = 0; i < objData.XXSHP_KDS_T_KLAIM_DTL.length; i++) {
        // Cari Index-nya.
        if (objData.XXSHP_KDS_T_KLAIM_DTL[i].intIndex == intIndex) {
            // Ketemu, mulai dari sini:
            objData.XXSHP_KDS_T_KLAIM_DTL[i].DEC_PERSEN_PPH = objCaller.value;
            break;
        }
    }
    p_SetHiddenObject(objData);
}

function p_txtDetailAmountPPH_Changed(objCaller, intIndex) {
    //
    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());
    for (i = 0; i < objData.XXSHP_KDS_T_KLAIM_DTL.length; i++) {
        // Cari Index-nya.
        if (objData.XXSHP_KDS_T_KLAIM_DTL[i].intIndex == intIndex) {
            // Ketemu, mulai dari sini:
            objData.XXSHP_KDS_T_KLAIM_DTL[i].DEC_PPH = objCaller.value;
            break;
        }
    }
    p_SetHiddenObject(objData);
}

function p_chkDetailPPN_Changed(objCaller, intIndex) {
    //
    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());
    for (i = 0; i < objData.XXSHP_KDS_T_KLAIM_DTL.length; i++) {
        // Cari Index-nya.
        if (objData.XXSHP_KDS_T_KLAIM_DTL[i].intIndex == intIndex ) {
            // Ketemu, mulai dari sini:
            if (objCaller.checked == true) {

                objData.XXSHP_KDS_T_KLAIM_DTL[i].DEC_PPN = Math.floor(clsGlobal.parseToDecimal(objData.XXSHP_KDS_T_KLAIM_DTL[i].DEC_INVOICE_AMT) * clsGlobal.parseToDecimal(0.1));
            }
            else {
                objData.XXSHP_KDS_T_KLAIM_DTL[i].DEC_PPN = 0;
            }
            //objData.XXSHP_KCO_T_KLAIM_DTL[i].TXT_PROGRAM_DESC = objCaller.value;
            break;
            
        }
    }
    p_SetHiddenObject(objData);
    p_refresh_row_detail(intIndex);
}

function p_chkDetailAllBrand_Changed(objCaller, intIndex) {
    
    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());
    for (i = 0; i < objData.XXSHP_KDS_T_KLAIM_DTL.length; i++) {
        // Cari Index-nya.
        if (objData.XXSHP_KDS_T_KLAIM_DTL[i].intIndex == intIndex ) {
            // Ketemu, mulai dari sini:
            objData.XXSHP_KDS_T_KLAIM_DTL[i].BIT_ALLBRAND = clsGlobal.ParseBooleanNETToOracle(objCaller.checked);

            if (objData.XXSHP_KDS_T_KLAIM_DTL[i].BIT_ALLBRAND == "Y") {
                objData.XXSHP_KDS_T_KLAIM_DTL[i].XXSHP_KDS_T_KLAIM_UMB = [];
            }
            break;            
        }
    }
    p_SetHiddenObject(objData);
    p_refresh_row_detail(intIndex);
}

function p_chkDetailInclude_Changed(objCaller, intIndex) {
    //
    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());
    for (i = 0; i < objData.XXSHP_KDS_T_KLAIM_DTL.length; i++) {
        // Cari Index-nya.
        if (objData.XXSHP_KDS_T_KLAIM_DTL[i].intIndex == intIndex) {
            // Ketemu, mulai dari sini:
            objData.XXSHP_KDS_T_KLAIM_DTL[i].BIT_INCLUDE = clsGlobal.ParseBooleanNETToOracle(objCaller.checked);

            break;
        }
    }
    p_SetHiddenObject(objData);
    p_refresh_row_detail(intIndex);
    p_EnableControl(clsGlobal.ParseBooleanOracleToNET(objData.BIT_APPLY), clsGlobal.ParseBooleanOracleToNET(objData.BIT_APPROVED), clsGlobal.ParseBooleanOracleToNET(objData.BIT_REJECTED));
}


//function p_txtDetaiFinalAmount_Changed(objCaller, intIndex) {
//    //
//    // Parse dari HiddenObject->JSON
//    var objData = JSON.parse(p_UIToData());
//    for (i = 0; i < objData.XXSHP_KCO_T_KLAIM_DTL.length; i++) {
//        // Cari Index-nya.
//        if (objData.XXSHP_KCO_T_KLAIM_DTL[i].intIndex == intIndex) {
//            // Ketemu, mulai dari sini:
//            objData.XXSHP_KCO_T_KLAIM_DTL[i].DEC_PERSEN_PPH = objCaller.value;
//            break;
//        }
//    }
//    p_SetHiddenObject(objData);
//}

function p_txtDetailPPN_Changed(objCaller, intIndex) {
    //
    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());
    for (i = 0; i < objData.XXSHP_KDS_T_KLAIM_DTL.length; i++) {
        // Cari Index-nya.
        if (objData.XXSHP_KDS_T_KLAIM_DTL[i].intIndex == intIndex) {
            // Ketemu, mulai dari sini:
            objData.XXSHP_KDS_T_KLAIM_DTL[i].DEC_PPN = objCaller.value;
            //objData.XXSHP_KCO_T_KLAIM_DTL[i].DEC_AMOUNT = Math.floor(clsGlobal.parseToDecimal(objData.XXSHP_KCO_T_KLAIM_DTL[i].DEC_PPN) + clsGlobal.parseToDecimal(objData.XXSHP_KCO_T_KLAIM_DTL[i].DEC_DPP) - clsGlobal.parseToDecimal(objData.XXSHP_KCO_T_KLAIM_DTL[i].DEC_PPH));
           
            break;
        }
    }
    var bitViewInclude = p_setBooleanBitInclude();
    p_DataToUIDetail(objData.XXSHP_KDS_T_KLAIM_DTL, clsGlobal.ParseBooleanOracleToNET(objData.BIT_APPLY), bitViewInclude)
    p_SetHiddenObject(objData);
}

function p_txtDetailDPP_Changed(objCaller, intIndex) {
    //
    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());
    for (i = 0; i < objData.XXSHP_KDS_T_KLAIM_DTL.length; i++) {
        // Cari Index-nya.
        if (objData.XXSHP_KDS_T_KLAIM_DTL[i].intIndex == intIndex) {
            // Ketemu, mulai dari sini:
            objData.XXSHP_KDS_T_KLAIM_DTL[i].DEC_DPP = objCaller.value;
            //objData.XXSHP_KCO_T_KLAIM_DTL[i].DEC_AMOUNT = Math.floor(clsGlobal.parseToDecimal(objData.XXSHP_KCO_T_KLAIM_DTL[i].DEC_PPN) + clsGlobal.parseToDecimal(objData.XXSHP_KCO_T_KLAIM_DTL[i].DEC_DPP) - clsGlobal.parseToDecimal(objData.XXSHP_KCO_T_KLAIM_DTL[i].DEC_PPH));
            
            break;
        }
    }
    var bitViewInclude = p_setBooleanBitInclude();
    p_DataToUIDetail(objData.XXSHP_KDS_T_KLAIM_DTL, clsGlobal.ParseBooleanOracleToNET(objData.BIT_APPLY), bitViewInclude)
    p_SetHiddenObject(objData);
}

function p_btnLOVDetailCOA_Click(objCaller, intIndex) {
    LOV = clsGlobal.generateLOV(MODULE_COA, "txtDetailCOA");
}

function p_settxtDetailCOA(txtValue) {
    var intSelectedIndex = p_GetSelectedDetailRow();
    var intRowIndex = 0;
    var objDat = p_GetHiddenObject();
    oTable.rows().every(function (rowIdx, tableLoop, rowLoop) {
        //
        var d = this.data();
        if (intRowIndex == intSelectedIndex) {
            d.intIndex = intRowIndex; // update data source for the row 

            d.TXT_COA = txtValue;

            objDat.XXSHP_KDS_T_KLAIM_DTL[intRowIndex].TXT_COA = txtValue;

            this.invalidate(); // invalidate the data DataTables has cached for this row         
            p_EnableControl(clsGlobal.ParseBooleanOracleToNET(objDat.BIT_APPLY), clsGlobal.ParseBooleanOracleToNET(objDat.BIT_APPROVED), clsGlobal.ParseBooleanOracleToNET(objDat.BIT_REJECTED));
        } 
        intRowIndex++;
    }); 
    p_SetHiddenObject(objDat); 
}



function p_ddlDetailStatus_TextChanged(objCaller, intIndex) {
    //
    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());
    for (i = 0; i < objData.XXSHP_KDS_T_KLAIM_DTL.length; i++) {
        // Cari Index-nya.
        if (objData.XXSHP_KDS_T_KLAIM_DTL[i].intIndex == intIndex) {
            // Ketemu, mulai dari sini:
            objData.XXSHP_KDS_T_KLAIM_DTL[i].TXT_STATUSKLAIM = clsGlobal.parseToString(objCaller.value);

            clsGlobal.showLoading();
            $.ajax({
                type: "POST",
                url: "/Transaksi/Klaim/SetStatusKlaim",
                data: { data: $("#txtHiddenObject").val(), INT_KLAIM_DTL_ID: objData.XXSHP_KDS_T_KLAIM_DTL[i].INT_KLAIM_DTL_ID, txtValue: clsGlobal.parseToString(objCaller.value), txtGUID: $("#txtGUID").val(), __RequestVerificationToken: $('#frmTrKlaim input[name=__RequestVerificationToken]').val() },
                datatype: "json",
                success: function (retDat) {
                    //
                    if (retDat.bitSuccess == true) {
                    }
                    clsGlobal.hideLoading();
                    $("#txtGUID").val(retDat.txtGUID);
                },
                error: function (retDat) {
                    //
                    clsGlobal.hideLoading();
                }
            });
            break;
        }
    } 
    p_SetHiddenObject(objData);
}

function p_txtDetailStatusDesc_TextChanged(objCaller, intIndex) {
    //
    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());
    for (i = 0; i < objData.XXSHP_KDS_T_KLAIM_DTL.length; i++) {
        // Cari Index-nya.
        if (objData.XXSHP_KDS_T_KLAIM_DTL[i].intIndex == intIndex) {
            objData.XXSHP_KDS_T_KLAIM_DTL[i].TXT_STATUS_DESC = clsGlobal.parseToString(objCaller.value);
            // Ketemu, mulai dari sini:
            clsGlobal.showLoading();
            $.ajax({
                type: "POST",
                url: "/Transaksi/Klaim/SetStatusDesc",
                data: { data: $("#txtHiddenObject").val(), INT_KLAIM_DTL_ID: objData.XXSHP_KDS_T_KLAIM_DTL[i].INT_KLAIM_DTL_ID, txtValue: clsGlobal.parseToString(objCaller.value), txtGUID: $("#txtGUID").val(), __RequestVerificationToken: $('#frmTrKlaim input[name=__RequestVerificationToken]').val() },
                datatype: "json",
                success: function (retDat) {
                    //
                    if (retDat.bitSuccess == true) { 
                    }
                    clsGlobal.hideLoading();
                    $("#txtGUID").val(retDat.txtGUID);
                },
                error: function (retDat) {
                    //
                    clsGlobal.hideLoading();
                }
            }); 
            break;
        }
    } 
    p_SetHiddenObject(objData);
}

function p_btnDetailDelete_Click(objCaller, intIndex) {
    //
    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());
    for (i = 0; i < objData.XXSHP_KDS_T_KLAIM_DTL.length; i++) {
        // Cari Index-nya.
        if (objData.XXSHP_KDS_T_KLAIM_DTL[i].intIndex == intIndex) {
            // Ketemu, mulai dari sini:
            // Remove from list.
            objData.XXSHP_KDS_T_KLAIM_DTL.splice(i, 1);

            //var row = oTable.row($(this).parents('tr'));
            //var rowNode = row.node();
            //row.remove().draw();
            oTable.row(i).remove().draw(false);
            break;
        }
    }
    p_SetHiddenObject(objData);
    p_RefreshNumberDetail();
}

function p_RefreshNumberDetail() {
    //
    var intRowIndex = 0;
    var objDat = p_GetHiddenObject();
    oTable.rows().every(function (rowIdx, tableLoop, rowLoop) {
        //
        var d = this.data();
        d.intIndex = intRowIndex; // update data source for the row
        objDat.XXSHP_KDS_T_KLAIM_DTL[intRowIndex].intIndex = d.intIndex;

        d.TXT_ACTIVITY = objDat.XXSHP_KDS_T_KLAIM_DTL[intRowIndex].TXT_ACTIVITY;
        d.TXT_COA = objDat.XXSHP_KDS_T_KLAIM_DTL[intRowIndex].TXT_COA;
        d.TXT_PPH_JENIS = objDat.XXSHP_KDS_T_KLAIM_DTL[intRowIndex].TXT_PPH_JENIS;
        d.TXT_PPH_TYPE = objDat.XXSHP_KDS_T_KLAIM_DTL[intRowIndex].TXT_PPH_TYPE;
        d.TXT_FKT_PJK_NO = objDat.XXSHP_KDS_T_KLAIM_DTL[intRowIndex].TXT_FKT_PJK_NO;
        d.TXT_PROGRAM_DESC = objDat.XXSHP_KDS_T_KLAIM_DTL[intRowIndex].TXT_PROGRAM_DESC;
        d.DTM_PERIOD_FROM = objDat.XXSHP_KDS_T_KLAIM_DTL[intRowIndex].DTM_PERIOD_FROM;
        d.DTM_PERIOD_TO = objDat.XXSHP_KDS_T_KLAIM_DTL[intRowIndex].DTM_PERIOD_TO;
        d.TXT_INVOICE_NO = objDat.XXSHP_KDS_T_KLAIM_DTL[intRowIndex].TXT_INVOICE_NO;
        d.DTM_INVOICE = objDat.XXSHP_KDS_T_KLAIM_DTL[intRowIndex].DTM_INVOICE;
        d.DTM_FKT_PJK = objDat.XXSHP_KDS_T_KLAIM_DTL[intRowIndex].DTM_FKT_PJK;
        d.DEC_INVOICE_AMT = objDat.XXSHP_KDS_T_KLAIM_DTL[intRowIndex].DEC_INVOICE_AMT;
        d.TXT_PPH_JENIS = objDat.XXSHP_KDS_T_KLAIM_DTL[intRowIndex].TXT_PPH_JENIS;
        d.DEC_PERSEN_PPH = objDat.XXSHP_KDS_T_KLAIM_DTL[intRowIndex].DEC_PERSEN_PPH;
        d.BIT_ALLBRAND = objDat.XXSHP_KDS_T_KLAIM_DTL[intRowIndex].BIT_ALLBRAND;
        d.BIT_INCLUDE = objDat.XXSHP_KDS_T_KLAIM_DTL[intRowIndex].BIT_INCLUDE;

        intRowIndex++;
        this.invalidate(); // invalidate the data DataTables has cached for this row         
    });

    // Draw once all updates are done
    oTable.draw(false);
    p_SetHiddenObject(objDat);
}

function p_refresh_row_detail(intindex)
{

    //
    var intRowIndex = 0;
    var objDat = p_GetHiddenObject();
    oTable.rows().every(function (rowIdx, tableLoop, rowLoop)
    {
        if (intRowIndex == intindex)
        {
            //
            var d = this.data();
            d.intIndex = intRowIndex; // update data source for the row
            objDat.XXSHP_KDS_T_KLAIM_DTL[intRowIndex].intIndex = d.intIndex;

            d.TXT_ACTIVITY = objDat.XXSHP_KDS_T_KLAIM_DTL[intRowIndex].TXT_ACTIVITY;
            d.TXT_PROGRAM_DESC = objDat.XXSHP_KDS_T_KLAIM_DTL[intRowIndex].TXT_PROGRAM_DESC;
            d.TXT_COA = objDat.XXSHP_KDS_T_KLAIM_DTL[intRowIndex].TXT_COA;
            d.TXT_PPH_JENIS = objDat.XXSHP_KDS_T_KLAIM_DTL[intRowIndex].TXT_PPH_JENIS;
            d.TXT_PPH_TYPE = objDat.XXSHP_KDS_T_KLAIM_DTL[intRowIndex].TXT_PPH_TYPE;
            d.TXT_INVOICE_NO = objDat.XXSHP_KDS_T_KLAIM_DTL[intRowIndex].TXT_INVOICE_NO;
            d.TXT_FKT_PJK_NO = objDat.XXSHP_KDS_T_KLAIM_DTL[intRowIndex].TXT_FKT_PJK_NO;
            d.DEC_PERSEN_PPH = objDat.XXSHP_KDS_T_KLAIM_DTL[intRowIndex].DEC_PERSEN_PPH;
            d.DEC_PPH = objDat.XXSHP_KDS_T_KLAIM_DTL[intRowIndex].DEC_PPH;
            d.DEC_PPN = objDat.XXSHP_KDS_T_KLAIM_DTL[intRowIndex].DEC_PPN;
            d.DEC_INVOICE_AMT = objDat.XXSHP_KDS_T_KLAIM_DTL[intRowIndex].DEC_INVOICE_AMT;
            //d.DEC_AMOUNT = objDat.XXSHP_KCO_T_KLAIM_DTL[intRowIndex].DEC_AMOUNT;
            d.BIT_ALLBRAND = objDat.XXSHP_KDS_T_KLAIM_DTL[intRowIndex].BIT_ALLBRAND;
            d.BIT_INCLUDE = objDat.XXSHP_KDS_T_KLAIM_DTL[intRowIndex].BIT_INCLUDE;
            d.DTM_PERIOD_FROM = objDat.XXSHP_KDS_T_KLAIM_DTL[intRowIndex].DTM_PERIOD_FROM;
            d.DTM_PERIOD_TO = objDat.XXSHP_KDS_T_KLAIM_DTL[intRowIndex].DTM_PERIOD_TO;
            d.DTM_FKT_PJK = objDat.XXSHP_KDS_T_KLAIM_DTL[intRowIndex].DTM_FKT_PJK;
            d.DTM_INVOICE = objDat.XXSHP_KDS_T_KLAIM_DTL[intRowIndex].DTM_INVOICE;

            d.DEC_PPN_PERCENTAGE = objDat.XXSHP_KDS_T_KLAIM_DTL[intRowIndex].DEC_PPN_PERCENTAGE;
            d.TXT_PPNTAXRATE_CODE = objDat.XXSHP_KDS_T_KLAIM_DTL[intRowIndex].TXT_PPNTAXRATE_CODE;
           
            this.invalidate(); // invalidate the data DataTables has cached for this row         
        }
            intRowIndex++;
    });

    // Draw once all updates are done
    oTable.draw(false);
    p_SetHiddenObject(objDat);

}

function p_fllAttachment_Changed(objCaller, intIndex) {
    //butuh validasi penjagaan type attachment, harus PDF
    
    if (objCaller.files[0].type != "application/pdf") {
        clsGlobal.showAlert("File attachment harus berupa PDF !");

        var fileInput  = document.getElementById('fileDetail'+intIndex);
        var files = fileInput.files;
        var file = files[0];
        fileInput.value = "";
    } else {
        var objData = JSON.parse(p_UIToData());
        for (i = 0; i < objData.XXSHP_KDS_T_KLAIM_DTL.length; i++) {
            // Cari Index-nya.
            if (objData.XXSHP_KDS_T_KLAIM_DTL[i].intIndex == intIndex) {
                // Ketemu, mulai dari sini:
                // Validasi tidak lebih dari Budget Besar tersedia

                var fllAttahcment = objCaller;

                if (fllAttahcment.files != null) {
                    for (var j = 0; j < fllAttahcment.files.length; j++) {
                        var dat = {};
                        dat.intIndex = j;
                        dat.INT_KLAIM_DTL_ATT_ID = null;
                        dat.INT_KLAIM_DTL_ID = null;
                        dat.TXT_FILE_NAME = fllAttahcment.files[j].name;
                        dat.TXT_FILE_DIRECTORY = stringempty;
                        dat.BIT_ACTIVE = clsGlobal.ParseBooleanNETToOracle(true);
                        dat.CREATED_BY = stringempty;
                        dat.CREATION_DATE = stringempty;
                        dat.LAST_UPDATED_BY = stringempty;
                        dat.LAST_UPDATE_DATE = stringempty;
                        dat.LAST_UPDATE_LOGIN = stringempty;
                        dat.TXT_GUID = stringempty;
                        objData.XXSHP_KDS_T_KLAIM_DTL[i].XXSHP_KDS_T_KLAIM_DTL_ATT.push(dat);

                        // Kalau attachment local sama dengan attachment yang baru masuk, otomatis tidak di tambahkan di list attahcment
                        if (attachments.filter(x => x.name == fllAttahcment.files[j].name).length == 0) {
                            attachments.push(fllAttahcment.files[j]);
                        }
                    }
                }

                break;
            }
        }
        var bitCanSetStatus = p_setBooleanBitCanSetStatus();
        var bitViewInclude = p_setBooleanBitInclude();
        p_SetHiddenObject(objData);
        p_DataToUIDetail(objData.XXSHP_KDS_T_KLAIM_DTL, bitCanSetStatus, bitViewInclude);
        p_EnableControl(clsGlobal.ParseBooleanOracleToNET(objData.BIT_APPLY), clsGlobal.ParseBooleanOracleToNET(objData.BIT_APPROVED), clsGlobal.ParseBooleanOracleToNET(objData.BIT_REJECTED));
        oTable.draw(false);
    }
}

function p_DownloadAttahcment(INT_KLAIM_DTL_ID) {
    $.ajax({
        type: "POST",
        url: "/Transaksi/Klaim/DownloadAttachment",
        data: {
            INT_KLAIM_DTL_ID: INT_KLAIM_DTL_ID,
            __RequestVerificationToken: $('#frmTrKlaim input[name=__RequestVerificationToken]').val()
        },
        datatype: "json",
        success: function (retDat) {
            if (retDat.bitSuccess) {
                var dat = retDat.objData;
                for (var i = 0; i < dat.length; i++) {
                    window.open(dat[i].TXT_FILE_DIRECTORY, '_blank');
                }
            } else {
                clsGlobal.setMessageWarning(retDat.txtMessage);
            }
        },
        error: function (retDat) {
            clsGlobal.hideLoading();
        }
    });
}

function p_DownloadAttahcmentLocal(TXT_FILE_NAME) {
    const file = attachments.find(file => file.name === TXT_FILE_NAME);

    // Check if the file was found
    if (file) {
        // Create a link element
        const downloadLink = document.createElement('a');

        // Set the download link attributes
        downloadLink.href = URL.createObjectURL(file);
        downloadLink.download = file.name;

        // Append the link to the document body
        document.body.appendChild(downloadLink);

        // Trigger a click on the link to start the download
        downloadLink.click();

        // Remove the link from the document
        document.body.removeChild(downloadLink);
    } else {
        console.error(`File not found: ${txtFileName}`);
    }
}

//V2 disini buat dimunculin di blank page berikutnya
function p_DownloadAttahcmentLocal_V2(TXT_FILE_NAME) {
    
    const file = attachments.find(file => file.name === TXT_FILE_NAME);

    // Check if the file was found
    if (file) {
        const fileName = file.name;
        const fileType = file.type;

        // Create a FileReader to read the file data
        const reader = new FileReader();

        // Define what happens when the file is read
        reader.onload = function (e) {
            // The file's data is in e.target.result
            const fileData = e.target.result;

            // Log or use the file data
            //console.log('File Name:', fileName);
            //console.log('File Type:', fileType);
            //console.log('File Data:', fileData);

            // You can now pass the fileName, fileData, and fileType to the previewFile function
            previewFile(fileName, fileData, fileType);
        };

        // Read the file as an ArrayBuffer, which is useful for binary data
        reader.readAsArrayBuffer(file);

    } else {
        console.error(`File not found: ${txtFileName}`);
    }
}
function previewFile(fileName, fileData, fileType) {
    // This is where you can handle the file previewing as shown in the previous examples
    const fileBlob = new Blob([fileData], { type: fileType });
    const fileURL = URL.createObjectURL(fileBlob);

    const newTab = window.open();
    let content = `
                <html>
                <head>
                    <title>${fileName}</title>
                </head>
                <body>
                    <h1>File Preview: ${fileName}</h1>
                    <a href="${fileURL}" download="${fileName}">Download ${fileName}</a>
            `;

    if (fileType.startsWith("image/")) {
        //content += `<img src="${fileURL}" alt="${fileName}" style="max-width:100%; height:auto;">`;
        content += `<iframe src="${fileURL}" style="width:100%; height:90%;"></iframe>`;
    } else if (fileType === "application/pdf") {
        content += `<iframe src="${fileURL}" style="width:100%; height:90%;"></iframe>`;
    } else if (fileType === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" || fileType === "application/vnd.ms-excel") {
        //content += `<iframe src="${fileURL}" style="width:100%; height:90%;"></iframe>`;
        content += `<p>Excel files cannot be previewed in the browser. Click the link to download:</p>`;
    } else {
        content += `<p>This file type cannot be previewed in the browser. Click the link to download:</p>`;
    }

    content += `
                <br><br>
                <script>
                    document.title = "${fileName}";
                </script>
                </body>
                </html>
            `;

    newTab.document.write(content);
    newTab.document.close();
}

function p_RemoveAttahcment(INT_KLAIM_DTL_ID) {
    clsGlobal.showLoading();
    $.ajax({
        type: "POST",
        url: "/Transaksi/Klaim/RemoveAttachment",
        data: {
            INT_KLAIM_DTL_ID: INT_KLAIM_DTL_ID,
            __RequestVerificationToken: $('#frmTrKlaim input[name=__RequestVerificationToken]').val()
        },
        datatype: "json",
        success: function (retDat) {
            
            if (retDat.bitSuccess) {
                var intIndex = 0;
                var objData = JSON.parse(p_UIToData());
                for (i = 0; i < objData.XXSHP_KDS_T_KLAIM_DTL.length; i++) {
                    if (objData.XXSHP_KDS_T_KLAIM_DTL[i].INT_KLAIM_DTL_ID == INT_KLAIM_DTL_ID) {
                        //setelah di delete di set kosong valuenya
                        objData.XXSHP_KDS_T_KLAIM_DTL[i].XXSHP_KDS_T_KLAIM_DTL_ATT = [];
                        //for (var j = 0; j < objData.XXSHP_KDS_T_KLAIM_DTL[i].XXSHP_KDS_T_KLAIM_DTL_ATT.length; j++) {
                        //    objData.XXSHP_KDS_T_KLAIM_DTL[i].XXSHP_KDS_T_KLAIM_DTL_ATT[j].BIT_ACTIVE = clsGlobal.ParseBooleanNETToOracle(false);
                        //    intIndex = objData.XXSHP_KDS_T_KLAIM_DTL[i].intIndex;
                        //}
                    }
                }
                p_SetHiddenObject(objData);
                p_RefreshNumberDetail();
                p_EnableControl(clsGlobal.ParseBooleanOracleToNET(objData.BIT_APPLY), clsGlobal.ParseBooleanOracleToNET(objData.BIT_APPROVED), clsGlobal.ParseBooleanOracleToNET(objData.BIT_REJECTED));
                clsGlobal.showAlert(retDat.txtMessage);

                $('[onclick="p_btnViewAttachment_Click(this,' + intIndex + ')"]').hide();
                $('[onclick="p_btnRemoveAttachment_Click(this,' + intIndex + ')"]').hide();
            } else {
                clsGlobal.setMessageWarning(retDat.txtMessage);
            }
            clsGlobal.hideLoading();
        },
        error: function (retDat) {
            clsGlobal.hideLoading();
        }
    });
}

function p_btnViewAttachment_Click(objCaller, intIndex) {
    
    var fancyboxdata = p_GetHiddenObject();
    var INT_KLAIM_DTL_ID = fancyboxdata.XXSHP_KDS_T_KLAIM_DTL.find(x => x.intIndex == intIndex).INT_KLAIM_DTL_ID;

    if (clsGlobal.parseToInteger(INT_KLAIM_DTL_ID) != 0) {
        p_DownloadAttahcment(INT_KLAIM_DTL_ID);
    }

    //Download Local-nya
    for (var i = 0; i < fancyboxdata.XXSHP_KDS_T_KLAIM_DTL.find(x => x.intIndex == intIndex).XXSHP_KDS_T_KLAIM_DTL_ATT.filter(x => clsGlobal.parseToInteger(x.INT_KLAIM_DTL_ATT_ID) == 0).length; i++) {
        //var dat = fancyboxdata.XXSHP_KDS_T_KLAIM_DTL.find(x => x.intIndex == intIndex).XXSHP_KDS_T_KLAIM_DTL_ATT[i];
        var dat = fancyboxdata.XXSHP_KDS_T_KLAIM_DTL.find(x => x.intIndex == intIndex).XXSHP_KDS_T_KLAIM_DTL_ATT.filter(x => clsGlobal.parseToInteger(x.INT_KLAIM_DTL_ATT_ID) == 0, x=> clsGlobal.ParseBooleanOracleToNET(x.BIT_ACTIVE) == true);
        p_DownloadAttahcmentLocal_V2(dat[i].TXT_FILE_NAME);
    }
}

function p_btnRemoveAttachment_Click(objCaller, intIndex) {
    //
    var fancyboxdata = p_GetHiddenObject();
    var INT_KLAIM_DTL_ID = fancyboxdata.XXSHP_KDS_T_KLAIM_DTL.find(x => x.intIndex == intIndex).INT_KLAIM_DTL_ID;

    // Kalau attacment itu di attach di DTLivity local, maka tinggal cleansing aja isinya
    if (clsGlobal.parseToInteger(INT_KLAIM_DTL_ID) != 0) {
        p_RemoveAttahcment(INT_KLAIM_DTL_ID);
        //fancyboxdata.XXSHP_KDS_T_KLAIM_DTL.find(x => x.intIndex == intIndex).XXSHP_KDS_T_KLAIM_DTL_ATT = [];
    } else {
        fancyboxdata.XXSHP_KDS_T_KLAIM_DTL.find(x => x.intIndex == intIndex).XXSHP_KDS_T_KLAIM_DTL_ATT = [];
    }
    p_SetHiddenObject(fancyboxdata);

    var bitCanSetStatus = p_setBooleanBitCanSetStatus();
    var bitViewInclude = p_setBooleanBitInclude(); 
    p_DataToUIDetail(fancyboxdata.XXSHP_KDS_T_KLAIM_DTL, bitCanSetStatus, bitViewInclude);
    p_EnableControl(clsGlobal.ParseBooleanOracleToNET(fancyboxdata.BIT_APPLY), clsGlobal.ParseBooleanOracleToNET(fancyboxdata.BIT_APPROVED), clsGlobal.ParseBooleanOracleToNET(fancyboxdata.BIT_REJECTED));
    oTable.draw(false);
}

function p_updateAttachmentData() {

    clsGlobal.showLoading();
    p_UIToData();

    var data = new FormData();
    if (attachments.length > 0) {
        for (var i = 0; i < attachments.length; i++) {
            data.append("attachments[]", attachments[i]);
        }
    }
    data.append("data", $("#txtHiddenObject").val());
    data.append("txtGUID", $("#txtGUID").val());
    data.append("__RequestVerificationToken", $('#frmTrKlaim input[name=__RequestVerificationToken]').val());

    $.ajax({
        type: "POST",
        url: "/Transaksi/Klaim/UpdateAttachmentData",
        processData: false,
        contentType: false,
        data: data,
        datatype: "json",
        success: function (retDat) {

            if (retDat.bitSuccess == true) {
                p_DataToUI(retDat.objData);
                clsGlobal.getInformationMessage(retDat.txtMessage);
                attachments = [];
                p_txtID_TextChanged();
                //p_txtDocNo_TextChanged();
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

function p_ViewMemoMKPP() {
    var objDat = p_GetHiddenObject();

    $.ajax({
        type: "POST",
        url: "/Transaksi/Klaim/PrintoutPDFMKPP",
        data: {
            TXT_DOCNO_MKPP: objDat.TXT_DOCNO_MKPP,
            __RequestVerificationToken: $('#frmTrKlaim input[name=__RequestVerificationToken]').val()
        },
        datatype: "json",
        success: function (retDat) {
            if (retDat.bitSuccess) {
                var dat = retDat.objData;
                for (var i = 0; i < dat.length; i++) {
                    window.open(dat[i].TXT_FILE_DIRECTORY, '_blank');
                }
                window.open(dat.TXT_FILE_DIRECTORY, '_blank');
            } else {
                clsGlobal.setMessageWarning(retDat.txtMessage);
            }
        },
        error: function (retDat) {
            clsGlobal.hideLoading();
        }
    });
}

//=======================
// HANDLER
//=======================

$("#btnViewMemo").on("click", function (e) {
    try {
        clsGlobal.getConfirmation("View Attachment MKPP?", function (result) {
            if (result == true) {
                p_ViewMemoMKPP();
            }
            else {
                return false;
            }
        });
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
});

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

$('#btnUpdateInclude').bind('click', function () {
    try {
        clsGlobal.getConfirmation("Update this data?", function (result) {
            if (result == true) {
                p_updateIncludeData();
            }
            else {
                return false;
            }
        });
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

$('#btnNew').bind('click', function () {
    try {
        p_showBlank();
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
});


$('#btnFind').bind('click', function () {
    try {
        isFromBtnFind = true;
        LOV = clsGlobal.generateLOV(MODULE_KLAIM, "txtID");
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
});


$('#btnLOVGroupAccount').bind('click', function () {
    try {
        //
        //LOV = clsGlobal.generateLOV(LOV_GROUP_ACCOUNT, "txtGroupAccount");
        LOV = clsGlobal.generateLOV(LOV_GROUP_ACCOUNT_BY_SUP_SITE, "txtGroupAccount"); //ini versi baru mengikuti dari mappingan supplier site
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
});


$('#btnLOVOutlet').bind('click', function () {
    try {
        //
        //LOV = clsGlobal.generateLOV(LOV_OUTLET_BY_GRP_ACC, "txtOutlet", $("#txtGroupAccount").val());
        LOV = clsGlobal.generateLOV(LOV_OUTLET_BY_SUP_SITE, "txtOutlet", $("#txtGroupAccount").val()); //ini versi baru mengikuti dari mappingan supplier site
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
});


//$('#btnLOVSupplierName').bind('click', function () {
//    try {
//        LOV = clsGlobal.generateLOV(LOV_XXSHP_VENDOR_SITE_ALL_V, "txtSupplierID");
//    } catch (ex) {
//        clsGlobal.showAlert(ex);
//    }
//});

//$('#btnLOVSupplierSite').bind('click', function () {
//    try {
//        LOV = clsGlobal.generateLOV(LOV_XXSHP_VENDOR_SITE_ALL_V_VENDOR_SITE_ID, "txtSupplierSiteID", $("#txtSupplierID").val());
//    } catch (ex) {
//        clsGlobal.showAlert(ex);
//    }
//});

//$('#btnLOVBranch').bind('click', function () {
//    try {
//        LOV = clsGlobal.generateLOV(MODULE_BRANCH2, "txtBranchID", $("#txtBranchID").val());
//    } catch (ex) {
//        clsGlobal.showAlert(ex);
//    }
//});

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

$('#btnAddDetail').on('click', function () {

    if ($("#txtGroupAccount").val() != "") {

        p_AddRow();
        ;
        oTable.draw(false);

    }
    else {
        clsGlobal.showAlert("Supplier belum dipilih!");
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

$('#btnApprovalHistory').bind('click', function () {
    try {
        var fancyboxdata = p_GetHiddenObject();
        LOV = clsGlobal.generatePopUpIframeSmall($(location).attr('protocol') + "//" + $(location).attr('host') + "/Master/ApprovalHistory/Index?TXT_TYPEDOC=" + "&TXT_REF_DOCNO=" + fancyboxdata.TXT_DOC_NO + "&INT_DOCID=" + fancyboxdata.INT_KLAIM_HDR_ID, "btnApprovalHistory", fancyboxdata);

    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
});

//$('#btnTest').bind('click', function () {
//    try {

//        
//        try {
//            var column19 = oTable.column(19);
//            column19.visible(!column19.visible());
//        } catch (ex2) {
//            //DO NOTHING
//        }
//        try {
//            var column20 = oTable.column(20);
//            column20.visible(!column20.visible());
//        } catch (ex2) {
//            //DO NOTHING
//        }  
//    } catch (ex) {
//        clsGlobal.showAlert(ex);
//    }
//});

$("#btnClose").on("click", function (e) {
    try {
        bootbox.dialog({
            title: "Reason Close",
            message: '<input type="text" id="reasonInput" class="bootbox-input bootbox-input-textarea form-control" rows="4" placeholder="Enter your reason here...">',
            buttons: {
                confirm: {
                    label: 'Submit',
                    className: 'btn-success',
                    callback: function () {
                        var reason = document.getElementById('reasonInput').value.trim();
                        if (reason.length >= 5) {
                            p_closeData(reason);
                        } else {
                            alert("Please enter a reason of at least 5 characters !");
                            return false;   
                        }
                    }
                },
                cancel: {
                    label: 'Cancel',
                    className: 'btn-danger',
                    callback: function () {
                        //alert("Action cancelled.");
                    }
                }
            }
        });

        //clsGlobal.getConfirmation("Close this document?", function (result) {
        //    if (result == true) {
        //        p_closeData();
        //    }
        //    else {
        //        return false;
        //    }
        //});
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
});

$("#btnReject").on("click", function (e) {
    try {
        bootbox.dialog({
            title: "Reason Reject",
            message: '<input type="text" id="reasonInput" class="bootbox-input bootbox-input-textarea form-control" rows="4" placeholder="Enter your reason here...">',
            buttons: {
                confirm: {
                    label: 'Submit',
                    className: 'btn-success',
                    callback: function () {
                        var reason = document.getElementById('reasonInput').value.trim();
                        if (reason.length >= 5) {
                            p_rejectData(reason);
                        } else {
                            alert("Please enter a reason of at least 5 characters !");
                            return false;
                        }
                    }
                },
                cancel: {
                    label: 'Cancel',
                    className: 'btn-danger',
                    callback: function () {
                        //alert("Action cancelled.");
                    }
                }
            }
        });

        //clsGlobal.getConfirmation("Close this document?", function (result) {
        //    if (result == true) {
        //        p_closeData();
        //    }
        //    else {
        //        return false;
        //    }
        //});
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
});

$("#btnCopy").on("click", function (e) {
    try {
        clsGlobal.getConfirmation("Copy this document?", function (result) {
            if (result == true) {
                p_copyData();
            }
            else {
                return false;
            }
        });
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
});


$('#btnLOVPartner').bind('click', function () {
    try {
        //
        LOV = clsGlobal.generateLOV(LOV_OUTLET, "txtPartner");
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
});

$("#btnUpdateAttachment").on("click", function (e) {
    try {
        clsGlobal.getConfirmation("Update Attachment this data?", function (result) {
            if (result == true) {
                p_updateAttachmentData();
            }
            else {
                return false;
            }
        });
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
});

$('#rdoReadySubmitYes').bind('click', function () {
    try {
        p_checkMultipleSelect();
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
});

$('#rdoReadySubmitNo').bind('click', function () {
    try {
        p_checkMultipleSelect();
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
});

function p_btnLOVProgramDesc_Click(btn, index) {
    lastProgramDescIndex = index; 

    try {
        LOV = clsGlobal.generateLOV(MODULE_PROGRAM_ACTIVITY, "lblDetailProgram", $("#txtSupplierID").val().toString());
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
}
