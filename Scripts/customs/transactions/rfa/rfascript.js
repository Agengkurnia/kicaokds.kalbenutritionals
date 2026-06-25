//=======================
// VARIABLE GLOBAL
//=======================
var clsGlobal = new clsGlobalClass();
var LOV;
var bitLoading = false;
var oTableActivity;
var adaID = false;
var PPHDESCList = {};
var attachments = [];


//=======================
// Confirmation
//======================= 

//=======================
// ON PAGE LOAD
//=======================
$(document).ready(function () { 
    p_InitForm();
    p_validatePage();
    //p_datePicker();
    //p_GenerateDateTimePicker(); 
});

//=======================
// FUNCTION
//=======================
function p_InitForm() {
    p_GetDataTaxWithHoldDesc();
    p_initiateData();
    //p_showPrevData(); 
    // p_InitiateActivity();
}

function p_validatePage() {

}

function p_showPrevData() {

}

function p_showBlank() {
    $("#fileHeader").val("");
    p_initiateData();
}

function setChooseLOV(txtValue) {
    var arr = txtValue.split('|');
    switch (arr[0]) {
        case "txtDocNo": $("#txtDocNo").val(arr[1]);
            p_txtDocNo_TextChanged();
            break;
        case "txtSupplierID":
            //$("#txtSupplierID").val(arr[1]);
            
            p_txtSupplierID_TextChanged(arr[1],arr[2]);
            break;
        case "txtSupplierSiteID":
            $("#txtSupplierSiteID").val(arr[1]);
            p_txtSupplierSiteID_TextChanged();
            break;
        case "txtActivitySubBrand":
            p_settxtActivitySubBrand(arr[1]);
            break;
        case "txtActivityCode":
            $("#txtActivityCode").val(arr[1]);
            break;
        case "txtRefDocNo":
            p_settxtRefDocNo(arr[1]);
            break;
        case "txtActivityDocOraType":
            p_settxtActivityDocOraType(arr[1]);
            break;
        case "txtReffRFA":
            p_settxtReffRFA(arr[1]);
            break;
    }
    clsGlobal.closeLOV();
}

//function p_GenerateDateTimePicker() {
//    
//    $('.kalendertarget').datepicker({
//        autoclose: true,
//    });

//}

//function p_datePicker() {
//    var selectRequestDate, selectTermDate, selectDueDate;
//    $('.kalendertarget').datepicker({
//        autoclose: true,
//    }).on("show", function (e) {
//        selectRequestDate = $("#dtRequestDate").val().toString();
//        selectTermDate = $("#dtTermDate").val().toString();
//        selectDueDate = $("#dtDueDate").val().toString();
//    });

//    $("#dtRequestDate").on("hide", function (e) {
//        if (e.date == null) {
//            $("#dtRequestDate").val(selectRequestDate);
//        } else {
//            var selected = formatDate(e.date);
//            $("#dtRequestDate").val(selected);
//        }
//    });

//    $("#dtTermDate").on("hide", function (e) {
//        if (e.date == null) {
//            $("#dtTermDate").val(selectTermDate);
//        } else {
//            var selected = formatDate(e.date);
//            $("#dtTermDate").val(selected);
//        }
//    });

//    $("#dtDueDate").on("hide", function (e) {
//        if (e.date == null) {
//            $("#dtDueDate").val(selectDueDate);
//        } else {
//            var selected = formatDate(e.date);
//            $("#dtDueDate").val(selected);
//        }
//    });

//    $("#btndtRequestDate").on("changeDate", function (e) {
//        var selected = formatDate(e.date);
//        $("#dtRequestDate").val(selected);
//    });

//    $("#btndtTermDate").on("changeDate", function (e) {
//        var selected = formatDate(e.date);
//        $("#dtTermDate").val(selected);
//    });

//    $("#btndtDueDate").on("changeDate", function (e) {
//        var selected = formatDate(e.date);
//        $("#dtDueDate").val(selected);
//    });
//}

//function formatDate(dates) {
//    var x = new Date(dates);
//    var dd = x.getDate();
//    var mm = x.getMonth() + 1;
//    var MM, DD;
//    if (mm < 10) {
//        MM = "0" + mm;
//    } else {
//        MM = mm;
//    }

//    if (dd < 10) {
//        DD = "0" + dd;
//    } else {
//        DD = dd;
//    }

//    var yy = x.getFullYear();
//    return MM + "/" + DD + "/" + yy;
//}

function p_DataToUI(objData) {
    $("#txtID").val(clsGlobal.parseToInteger(objData.INT_RFA_HDR_ID));
    $("#txtDocNo").val(clsGlobal.parseToString(objData.TXT_DOCNO));
    $("#txtReffRFA").val(clsGlobal.parseToString(objData.TXT_REFDOCNO));
    $("#txtPrefixBatch").val(clsGlobal.parseToString(objData.TXT_PREFIX_BATCH));
    $("#txtBatchName").val(clsGlobal.parseToString(objData.TXT_BATCH_NAME));
    $("#txtDescription").val(clsGlobal.parseToString(objData.TXT_DESCRIPTION));
    $("#ddlApTerm").val(clsGlobal.parseToString(objData.TXT_AP_TERM));
    p_PopulateApTermAndSet(clsGlobal.parseToString(objData.INT_AP_TERM_ID));
    $("#lblStatusFlow").html(clsGlobal.parseToString(objData.TXT_STATUSFLOW));
    $("#txtRFAOracleNo").val(clsGlobal.parseToString(objData.TXT_RFA_ORACLE_NO));

    //$("#ddlCurrency").val(clsGlobal.parseToString(objData.TXT_CURRENCY_CODE));
    p_PopulateCurrencyAndSet(clsGlobal.parseToString(objData.TXT_CURRENCY_CODE));
    $("#txtRateType").val(clsGlobal.parseToString(objData.TXT_RATE_TYPE));
    $("#txtRate").val(clsGlobal.parseToString(objData.DEC_RATE));

    $("#txtRequestor").val(clsGlobal.parseToString(objData.TXT_REQUESTOR));

    $("#dtRequestDate").val(clsGlobal.parseToDateTimeFromJSON(objData.CREATION_DATE, clsDateFormat));
    $("#dtTermDate").val(clsGlobal.parseToDateTimeFromJSON(objData.DTM_TERM_DATE, clsDateFormat));
    $("#dtDueDate").val(clsGlobal.parseToDateTimeFromJSON(objData.DTM_DUE_DATE, clsDateFormat));
    $("#dtGLDate").val(clsGlobal.parseToDateTimeFromJSON(objData.DTM_GL_DATE, clsDateFormat));
    $("#dtInvoiceDate").val(clsGlobal.parseToDateTimeFromJSON(objData.DTM_INVOICE_DATE, clsDateFormat));

    $("#txtActivityCode").val(clsGlobal.parseToString(objData.TXT_ACTIVITYCODE));
   $("#txtInvoiceNo").val(clsGlobal.parseToString(objData.TXT_INVOICE_NO));
   $("#txtTaxInvoiceNo").val(clsGlobal.parseToString(objData.TXT_FKT_PJK_NO));
   $("#dtTaxInvoiceDate").val(clsGlobal.parseToDateTimeFromJSON(objData.DTM_FKT_PJK, clsDateFormat));
   
   $("#txtSupplierID").val(clsGlobal.parseToString(objData.TXT_SUPPLIER_ID));
    $("#txtSupplierName").val(clsGlobal.parseToString(objData.TXT_SUPPLIER_NAME));
    $("#txtSupplierSiteID").val(clsGlobal.parseToString(objData.TXT_SUPPLIER_SITE_CODE));
    $("#txtSupplierSiteName").val(clsGlobal.parseToString(objData.TXT_SUPPLIER_SITE_NAME));


    $("#txtJenisPPH").val(clsGlobal.parseToString(objData.TXT_PPH_JENIS));
    p_PopulateTipePPHAndSet(objData.INT_AWT_GROUP_ID + ";" + objData.TXT_AWT_TAX_NAME + ";" + objData.DEC_AWT_TAX_RATE);
    p_PopulateTipePPNAndSet(objData.TXT_ZX_TAX_RATE_CODE + ";" + objData.DEC_ZX_TAX_PERCENT);

    $("#txtInvoiceAmount").val(clsGlobal.parseToRupiah(objData.DEC_AMOUNT));
    $("#txtPPN").val(clsGlobal.FormatMoney(objData.DEC_PPN, 0));
    $("#txtTotalRFA").val(clsGlobal.FormatMoney(objData.DEC_RFA_AMOUNT, 0));
    $("#txtPPH").val(clsGlobal.FormatMoney(objData.DEC_PPH, 0));

    p_PopulatePaidTo(objData.TXT_PAID_TO, true);
    $("#txtPaidTo").val(clsGlobal.parseToString(objData.TXT_PAID_TO));
    $("#txtAccountNo").val(clsGlobal.parseToString(objData.TXT_ACCOUNT_NAME));
    $("#txtAccountName").val(clsGlobal.parseToString(objData.TXT_ACCOUNT_NO));
    $("#txtBankAccount").val(clsGlobal.parseToString(objData.TXT_BANK_ACCOUNT));
    $("#txtExtBankAccountID").val(clsGlobal.parseToString(objData.INT_EXT_BANK_ACCOUNT_ID));

    $("#TXT_INVOICE_STATUS").val(clsGlobal.parseToString(objData.TXT_INVOICE_STATUS));
    $("#DTM_PAID_DATE_ORACLE").val(clsGlobal.parseToDateTimeFromJSON(objData.DTM_PAID_DATE_ORACLE, clsDateFormat));
    if ($("#DTM_PAID_DATE_ORACLE").val() == "01/01/2000") {
        $("#DTM_PAID_DATE_ORACLE").val("");
    }
    $("#TXT_PAID_STATUS_ORACLE").val(clsGlobal.parseToString(objData.TXT_PAID_STATUS_ORACLE));
    $("#TXT_REASON_CANCEL_SMART").val(clsGlobal.parseToString(objData.TXT_REASON_CANCEL_SMART));

    p_PopulateTaxWithHoldDesc(clsGlobal.parseToString(objData.TXT_WITH_HOLDING_DESC));
    $("#txtItemWithHoldDescription2").val(clsGlobal.parseToString(objData.TXT_WITH_HOLDING_DESC2));
    //p_DataToUIActivity(objData.XXSHP_KCO_T_RFA_DTL);

    var bitApply = clsGlobal.ParseBooleanOracleToNET(objData.BIT_APPLY);
    var bitApprv = clsGlobal.ParseBooleanOracleToNET(objData.BIT_APPROVED);
    var bitCancl = clsGlobal.ParseBooleanOracleToNET(objData.BIT_CANCELLED);
    var bitPshSm = clsGlobal.ParseBooleanOracleToNET(objData.BIT_PUSH_SMART);
    var bitFinishUpload = clsGlobal.ParseBooleanOracleToNET(objData.BIT_FINISH_UPLOAD);
    var bitDocNoNull = clsGlobal.parseToBoolean($("#txtDocNo").val() == "" || $("#txtDocNo").val() == "0");
    var bitAttachmentIsNull = clsGlobal.parseToBoolean(objData.XXSHP_KDS_T_RFA_HDR_ATT.some(x => x.BIT_ACTIVE == 'Y')) == false;

    if (bitApply) {
        $('#btnDeleteAttachment').hide();
    } else {
        $('#btnPushSmart').hide();
        $('#btnPrintBarcode').hide();
        if (bitDocNoNull == false) {
            $('#btnDeleteAttachment').show();
            if (bitAttachmentIsNull == false) {
                $('#btnViewAttachment').show();
            }
        }
    }

    if (bitApply && bitApprv) {
        if (bitFinishUpload) {
            //dimunculin setelah view output oracle only
            if (objData.TXT_RFA_ORACLE_NO != "") {
                $('#btnPrintBarcode').show();
                $('#btnPushSmart').show();
            }
        }
    } else {
        if (bitCancl) {
            $('#btnPushSmart').hide();
            $('#btnPrintBarcode').hide();
        }
    }

    if (bitPshSm) {
        $('#btnPushSmart').hide();
        //$('#btnPrintBarcode').hide();
    }

    if (bitAttachmentIsNull) {
        $('#btnViewAttachment').hide();
        $('#btnDeleteAttachment').hide();
    } else {
        $('#btnViewAttachment').show();
        if (bitApply == false)
            $('#btnDeleteAttachment').show();
    }

    p_EnableControl(clsGlobal.ParseBooleanOracleToNET(objData.BIT_APPLY));
    p_CheckPushOracle(objData);
    p_ShowCancelButton(objData);
    p_ShowCreateAsNewButton(objData);
    p_ShowPrintKPP(objData);

    p_SetHiddenObject(objData);

    if ($("#txtID").val() == "" || $("#txtID").val() == "0") {
        $("#btnDelete").hide();
    } else {
        $("#btnDelete").show();
    }
}

function p_ShowPrintKPP(objData) {
    $('#btnPrintKPP').hide();
    if (objData.TXT_DOCNO !== "") {
        $("#btnPrintKPP").show();
    }
}

function p_ShowCancelButton(objData) {
    $("#btnCancel").hide();
    if (clsGlobal.ParseBooleanOracleToNET(objData.BIT_APPROVED) == true &&
       clsGlobal.ParseBooleanOracleToNET(objData.BIT_CANCELLED) == false) {
        $("#btnCancel").show();
    }
}


function p_ShowCreateAsNewButton(objData) {
    $("#btnCreateAsNew").hide();
    
    if (clsGlobal.ParseBooleanOracleToNET(objData.BIT_REJECTED) == true ||
       clsGlobal.ParseBooleanOracleToNET(objData.BIT_CANCELLED) == true) {
        $("#btnCreateAsNew").show();
    }
}

function p_CheckPushOracle(objDat) {
    $("#btnPushOracle").hide();
    $("#btnPrintOracle").hide();
    $("#btnViewOutputOracle").hide();
    $("#btnCheckOracle").hide();
    if(clsGlobal.ParseBooleanOracleToNET(objDat.BIT_APPLY)
        && clsGlobal.ParseBooleanOracleToNET(objDat.BIT_APPROVED))
    {
        // Sudah submit dan Approved
        if (clsGlobal.ParseBooleanOracleToNET(objDat.BIT_UPLOAD))
        {
            // Sudah di upload.
            if (clsGlobal.ParseBooleanOracleToNET(objDat.BIT_FINISH_UPLOAD)) {
                // Sudah berhasil push.
                if (objDat.INT_REQUESTPRINT_ID == 0) {
                    //Belum pernah di print. munculin tombol print.
                    $("#btnPrintOracle").show();
                } else {
                    // Sudah di print. munculin tombol view Output.
                    $("#btnViewOutputOracle").show();
                }
            }
            else {
                // Belum berhasil push.
                $("#btnCheckOracle").show(); 
            }
           
        } else {
            // Belum di submit. munculin tombol Push to Oracle.
            $("#btnPushOracle").show();
        }
    }
}

function p_SetHiddenObject(objDat) {
    $("#txtHiddenObject").val(JSON.stringify(objDat));

    //AutoNumeric.
    p_GenerateAutoNumeric();
    //p_datePicker();
    p_GenerateDateTimePicker();
}

function p_GenerateAutoNumeric() {
    
    $('.autonumeric').autoNumeric('init', { vMax: '9999999999999', vMin: '-9999999999999', aSep: ',', dGroup: '3', aDec: '.' });
}

function p_GenerateDateTimePicker() {
    
    $('.kalendertarget').datepicker({
        autoclose: true,
    }); 
}

function p_GetHiddenObject() {
    return JSON.parse($("#txtHiddenObject").val());
}

function p_initiateData() {
    clsGlobal.showLoading();
    $.ajax({
        type: "POST",
        url: "/Transaction/RFA/InitiateData",
        data: { __RequestVerificationToken: $('#frmRFA input[name=__RequestVerificationToken]').val() },
        datatype: "json",
        success: function (retDat) {
            
            if (retDat.bitSuccess == true) {
                if (retDat.objData != undefined) {
                    adaID = false;
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
    jsonData.CREATION_DATE = clsGlobal.parseToString($("#dtRequestDate").val()); 
    jsonData.TXT_PREFIX_BATCH = clsGlobal.parseToString($("#txtPrefixBatch").val());
    jsonData.TXT_BATCH_NAME = clsGlobal.parseToString($("#txtBatchName").val());
    jsonData.TXT_DESCRIPTION = clsGlobal.parseToString($("#txtDescription").val());
    jsonData.TXT_REQUESTOR = clsGlobal.parseToString($("#txtRequestor").val());
    jsonData.TXT_AP_TERM = clsGlobal.parseToString($("#ddlApTerm  option:selected").text());
    jsonData.INT_AP_TERM_ID = clsGlobal.parseToInteger($("#ddlApTerm").val());
    jsonData.DTM_TERM_DATE = clsGlobal.parseToString($("#dtTermDate").val());
    jsonData.DTM_DUE_DATE = clsGlobal.parseToString($("#dtDueDate").val());
    jsonData.DTM_GL_DATE = clsGlobal.parseToString($("#dtGLDate").val());
    jsonData.DTM_INVOICE_DATE = clsGlobal.parseToString($("#dtInvoiceDate").val());
    jsonData.TXT_STATUSFLOW = clsGlobal.parseToString($("#txtStatus").val());

    jsonData.TXT_SUPPLIER_ID = clsGlobal.parseToString($("#txtSupplierID").val());
    jsonData.TXT_SUPPLIER_NAME = clsGlobal.parseToString($("#txtSupplierName").val());
    jsonData.TXT_SUPPLIER_SITE_CODE = clsGlobal.parseToString($("#txtSupplierSiteID").val());
    jsonData.TXT_SUPPLIER_SITE_NAME = clsGlobal.parseToString($("#txtSupplierSiteName").val());
     
    jsonData.TXT_ACTIVITYCODE = clsGlobal.parseToString($("#txtActivityCode").val());
    jsonData.TXT_ACTIVITYNAME = clsGlobal.parseToString($("#txtActivityCode").val());
    jsonData.TXT_INVOICE_NO = clsGlobal.parseToString($("#txtInvoiceNo").val());
    jsonData.TXT_PAID_TO = clsGlobal.parseToString($("#txtPaidTo").val());
    jsonData.TXT_ACCOUNT_NAME = clsGlobal.parseToString($("#txtAccountNo").val());
    jsonData.TXT_ACCOUNT_NO = clsGlobal.parseToString($("#txtAccountName").val());
    jsonData.INT_EXT_BANK_ACCOUNT_ID = clsGlobal.parseToDecimal($("#txtExtBankAccountID").val());
    jsonData.TXT_BANK_ACCOUNT = clsGlobal.parseToString($("#txtBankAccount").val());
    jsonData.DEC_AMOUNT = clsGlobal.parseToDecimal($("#txtInvoiceAmount").val());
    jsonData.DEC_PPN = clsGlobal.parseToDecimal($("#txtPPN").val());
    jsonData.TXT_PPH_JENIS = clsGlobal.parseToString($("#txtJenisPPH").val());
    jsonData.DEC_PPH = clsGlobal.parseToDecimal($("#txtPPH").val());
    jsonData.DEC_RFA_AMOUNT = clsGlobal.parseToDecimal($("#txtTotalRFA").val());
       
    jsonData.TXT_CURRENCY_CODE = clsGlobal.parseToString($("#ddlCurrency").val());
    jsonData.TXT_RATE_TYPE = clsGlobal.parseToString($("#txtRateType").val());
    jsonData.DEC_RATE = clsGlobal.parseToDecimal($("#txtRate").val());

    jsonData.TXT_FKT_PJK_NO = clsGlobal.parseToString($("#txtTaxInvoiceNo").val());
    jsonData.DTM_FKT_PJK = clsGlobal.parseToString($("#dtTaxInvoiceDate").val());
     
    if (clsGlobal.parseToString($("#ddlTipePPH").val()) != "" && clsGlobal.parseToString($("#ddlTipePPH").val()) != undefined) {
        var resultPPHSplit = $("#ddlTipePPH").val().split(';');
        jsonData.INT_AWT_GROUP_ID = clsGlobal.parseToDecimal(resultPPHSplit[0]);
        jsonData.TXT_AWT_TAX_NAME = clsGlobal.parseToString(resultPPHSplit[1]);
        jsonData.DEC_AWT_TAX_RATE = clsGlobal.parseToDecimal(resultPPHSplit[2]);
    } else {
        jsonData.INT_AWT_GROUP_ID = 0;
        jsonData.TXT_AWT_TAX_NAME = "";
        jsonData.DEC_AWT_TAX_RATE = 0;
    }

    if ($("#ddlTipePPN").val() != "" && $("#ddlTipePPN").val() != undefined ) {
        var resultPPNSplit = $("#ddlTipePPN").val().split(';');
        jsonData.TXT_ZX_TAX_RATE_CODE = clsGlobal.parseToString(resultPPNSplit[0]);
        jsonData.DEC_ZX_TAX_PERCENT = clsGlobal.parseToDecimal(resultPPNSplit[1]);
    }
   
    jsonData.TXT_WITH_HOLDING_DESC = clsGlobal.parseToString($("#ddlItemWithHoldDescription").val());
    jsonData.TXT_WITH_HOLDING_DESC2 = clsGlobal.parseToString($("#txtItemWithHoldDescription2").val()); 

    p_SetHiddenObject(jsonData);
    return $("#txtHiddenObject").val();

}

function p_EnableControl(bitApply) {
    
    if (bitApply == true) {
        $("#btnSave").hide();
        $("#btnSubmit").hide();
        $("#btnApprovalHistory").show();
        $("#btnPrintout").show();
        $("#btndtTermDate").attr("disabled", "true");
        $("#btndtDueDate").attr("disabled", "true"); 
        $("#dtTermDate").attr("disabled", "true");
        $("#btndtDueDate").attr("disabled", "true");
        $("#dtDueDate").attr("disabled", "true");
        $("#btndtGLDate").attr("disabled", "true");
        $("#dtGLDate").attr("disabled", "true");
        $("#btndtInvoiceDate").attr("disabled", "true");
        $("#dtInvoiceDate").attr("disabled", "true");
        //$("#btnLOVSupplierName").hide();
        //$("#btnLOVSupplierSite").hide();
        //$("#btnLOVActivity").hide();
        $("#btnLOVSupplierName").attr("disabled", "true");
        $("#btnLOVSupplierSite").attr("disabled", "true");
        $("#btnLOVReffRFA").attr("disabled", "true");

        $("#txtBatchName").attr("disabled", "true");
        $("#txtDescription").attr("disabled", "true");
        $("#ddlApTerm").attr("disabled", "true");
        //$("#ddlCurrency").attr("disabled", "true");
        //$("#ddlRateType").attr("disabled", "true");
        $("#txtInvoiceNo").attr("disabled", "true");
        $("#ddlPaidTo").attr("disabled", "true");
        $("#txtPaidTo").attr("disabled", "true");
        $("#txtAccountNo").attr("disabled", "true");
        $("#txtAccountName").attr("disabled", "true");
        $("#txtBankAccount").attr("disabled", "true");
        //$("#txtInvoiceAmount").attr("disabled", "true"); 
        //$("#ddlTipePPN").attr("disabled", "true");
        //$("#ddlTipePPH").attr("disabled", "true");
        //$("#txtPPN").attr("disabled", "true");
        //$("#txtPPH").attr("disabled", "true");
        //$("#txtTotalRFA").attr("disabled", "true");
         
    } else {
        $("#btnSave").show();
        $("#btnSubmit").show();
        //$("#btnPushOracle").hide();
        $("#btnApprovalHistory").hide();
        $("#btnPrintout").hide();
        $("#btndtTermDate").removeAttr("disabled");
        $("#btndtDueDate").removeAttr("disabled");
        $("#dtTermDate").removeAttr("disabled");
        $("#btndtDueDate").removeAttr("disabled");
        $("#dtDueDate").removeAttr("disabled");
        $("#btndtGLDate").removeAttr("disabled");
        $("#dtGLDate").removeAttr("disabled");
        $("#btndtInvoiceDate").removeAttr("disabled");
        $("#dtInvoiceDate").removeAttr("disabled");
        //$("#btnLOVSupplierName").show();
        //$("#btnLOVSupplierSite").show();
        //$("#btnLOVActivity").show();
        $("#btnLOVSupplierName").removeAttr("disabled");
        $("#btnLOVSupplierSite").removeAttr("disabled");
        $("#btnLOVReffRFA").removeAttr("disabled");

        $("#txtBatchName").removeAttr("disabled");
        $("#txtDescription").removeAttr("disabled");
        $("#ddlApTerm").removeAttr("disabled");
        //$("#ddlCurrency").removeAttr("disabled");
        //$("#ddlRateType").removeAttr("disabled");
        $("#txtInvoiceNo").removeAttr("disabled");
        $("#ddlPaidTo").removeAttr("disabled");
        $("#txtPaidTo").removeAttr("disabled");
        $("#txtAccountNo").removeAttr("disabled");
        $("#txtAccountName").removeAttr("disabled");
        $("#txtBankAccount").removeAttr("disabled");
        //$("#txtInvoiceAmount").removeAttr("disabled"); 
        //$("#ddlTipePPN").removeAttr("disabled");
        //$("#ddlTipePPH").removeAttr("disabled");
        //$("#txtPPN").removeAttr("disabled");
        //$("#txtPPH").removeAttr("disabled");
        //$("#txtTotalRFA").removeAttr("disabled");
         
    }
}

function p_txtDocNo_TextChanged() {
    clsGlobal.showLoading();
    $.ajax({
        type: "POST",
        url: "/Transaction/RFA/GetData",
        data: { txtDocNo: $("#txtDocNo").val(), __RequestVerificationToken: $('#frmRFA input[name=__RequestVerificationToken]').val() },
        datatype: "json",
        success: function (retDat) {

            if (retDat.bitSuccess == true) {
                if (retDat.objData != undefined) {
                    if (retDat.objData.INT_RFA_HDR_ID != 0) {
                        adaID = false;
                    }
                    p_DataToUI(retDat.objData);
                    //p_EnableControl(true);
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

function p_PopulateApTermAndSet(txtValue) {
    clsGlobal.showLoading();
    
    $.ajax({
        type: "POST",
        url: "/Main/PopulateApTerm",
        data: { __RequestVerificationToken: $('#FormLogin input[name=__RequestVerificationToken]').val() },
        datatype: "json",
        success: function (retDat) {
            if (retDat.bitSuccess == true) {
                
                if (retDat.objData != undefined) {
                    $('#ddlApTerm').empty();
                    $('#ddlApTerm').append($('<option>').text("-").prop('value', ""));
                    for (var i = 0; i < retDat.objData.length; i++) {
                        $('#ddlApTerm').append($('<option>').text(retDat.objData[i].DESCRIPTION).prop('value', retDat.objData[i].TERM_ID));
                    }

                    if (txtValue != "") {
                        $("#ddlApTerm").val(txtValue);
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
}

function p_PopulateCurrencyAndSet(txtValue) {
    clsGlobal.showLoading();
    
    $.ajax({
        type: "POST",
        url: "/Main/PopulateCurrency",
        data: { __RequestVerificationToken: $('#FormLogin input[name=__RequestVerificationToken]').val() },
        datatype: "json",
        success: function (retDat) {
            if (retDat.bitSuccess == true) {
                
                if (retDat.objData != undefined) {
                    $('#ddlCurrency').empty();
                    $('#ddlCurrency').append($('<option>').text("-").prop('value', ""));
                    for (var i = 0; i < retDat.objData.length; i++) {
                        $('#ddlCurrency').append($('<option>').text(retDat.objData[i].CURRENCY_CODE).prop('value', retDat.objData[i].CURRENCY_CODE));
                    }

                    if (txtValue != "") {
                        $("#ddlCurrency").val(txtValue);
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
}

//function p_PopulatePaidTo(retDat, txtValue) {
//    $('#ddlPaidTo').empty();
//    $('#ddlPaidTo').append($('<option>').text("-").prop('value', ""));
//    for (var i = 0; i < retDat.objData.length; i++) {
//        var txtValuePaidTo = retDat.objData[i].BANK_ACCOUNT_NUM + ";" + retDat.objData[i].BANK_ACCOUNT_NAME + ";" + retDat.objData[i].BANK_PARTY_ID;
//        $('#ddlPaidTo').append($('<option>').text(txtValuePaidTo).prop('value', txtValuePaidTo));
//    }

//    if (txtValue != "") {
//        $("#ddlPaidTo").val(txtValue);
//    }
//}


function p_ddlCurrency_TextChanged() {
    clsGlobal.showLoading();
    p_UIToData();
    
    $.ajax({
        type: "POST",
        url: "/Transaction/RFA/CurrencyChanged",
        data: { data: $("#txtHiddenObject").val(), txtGUID: $("#txtGUID").val(), __RequestVerificationToken: $('#FormLogin input[name=__RequestVerificationToken]').val() },
        datatype: "json",
        success: function (retDat) {
            if (retDat.bitSuccess == true) {
                
                if (retDat.objData != undefined) {
                    $("#txtRate").val(clsGlobal.FormatMoney(retDat.objData.CONVERSION_RATE,0));
                }
            } else {
                clsGlobal.getAlert(retDat.txtMessage);
                $("#txtRate").val("1");
            }

            clsGlobal.hideLoading();
            $("#txtGUID").val(retDat.txtGUID);
        },
        error: function (retDat) {
            clsGlobal.hideLoading();
        }
    });
}


function p_PopulateTipePPNAndSet(txtValue) {
    clsGlobal.showLoading();
    
    $.ajax({
        type: "POST",
        url: "/Main/PopulateTipePPN",
        data: { __RequestVerificationToken: $('#frmRFA input[name=__RequestVerificationToken]').val() },
        datatype: "json",
        success: function (retDat) {
            if (retDat.bitSuccess == true) {
                
                if (retDat.objData != undefined) {
                    $('#ddlTipePPN').empty();
                    $('#ddlTipePPN').append($('<option>').text("-").prop('value', ""));
                    for (var i = 0; i < retDat.objData.length; i++) {
                        $('#ddlTipePPN').append($('<option>').text(retDat.objData[i].TAX_RATE_CODE).prop('value', retDat.objData[i].TAX_RATE_CODE + ";" + retDat.objData[i].PERCENTAGE_RATE));
                    }

                    if (txtValue != "") {
                        $("#ddlTipePPN").val(txtValue);
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
}


function p_PopulateTipePPHAndSet(txtValue) {
    clsGlobal.showLoading();
    
    $.ajax({
        type: "POST",
        url: "/Main/PopulateTipePPH",
        data: { __RequestVerificationToken: $('#frmRFA input[name=__RequestVerificationToken]').val() },
        datatype: "json",
        success: function (retDat) {
            if (retDat.bitSuccess == true) {
                
                if (retDat.objData != undefined) {
                    $('#ddlTipePPH').empty();
                    $('#ddlTipePPH').append($('<option>').text("-").prop('value', ""));
                    for (var i = 0; i < retDat.objData.length; i++) {
                        $('#ddlTipePPH').append($('<option>').text(retDat.objData[i].TAX_NAME).prop('value', retDat.objData[i].GROUP_ID + ";" + retDat.objData[i].TAX_NAME + ";" + retDat.objData[i].TAX_RATE));
                    }

                    if (txtValue != "") {
                        $("#ddlTipePPH").val(txtValue);
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
}


function p_PopulatePaidTo(txtValue, bitAutomatic) {
    $('#ddlPaidTo').empty();
    $('#ddlPaidTo').append($('<option>').text("-").prop('value', ""));

    if ($("#txtSupplierID").val() != "" && $("#txtSupplierSiteID").val() != "") {
        clsGlobal.showLoading();
        $.ajax({
            type: "POST",
            url: "/Master/Supplier/GetPaidTo",
            data: { txtVendorID: $("#txtSupplierID").val(), txtVendorSiteID: $("#txtSupplierSiteID").val(), __RequestVerificationToken: $('#frmRFA input[name=__RequestVerificationToken]').val() },
            datatype: "json",
            success: function (retDat) {
                for (var i = 0; i < retDat.objData.length; i++) {
                    var txtValuePaidTo = retDat.objData[i].BANK_ACCOUNT_NUM + ";" + retDat.objData[i].BANK_ACCOUNT_NAME + ";" + retDat.objData[i].BANK_PARTY_ID + ";" + retDat.objData[i].EXT_BANK_ACCOUNT_ID;
                    $('#ddlPaidTo').append($('<option>').text(txtValuePaidTo).prop('value', txtValuePaidTo));
                }

                if (bitAutomatic == true) {
                    if (retDat.objData != undefined) {
                        var txtValuePaidTo = retDat.objData[0].BANK_ACCOUNT_NUM + ";" + retDat.objData[0].BANK_ACCOUNT_NAME + ";" + retDat.objData[0].BANK_PARTY_ID + ";" + retDat.objData[0].EXT_BANK_ACCOUNT_ID;
                        $("#txtPaidTo").val(txtValuePaidTo); 
                        $("#txtAccountNo").val(retDat.objData[0].BANK_ACCOUNT_NUM);
                        $("#txtAccountName").val(retDat.objData[0].BANK_ACCOUNT_NAME);
                        $("#txtBankAccount").val(retDat.objData[0].BANK_PARTY_ID);
                        $("#txtExtBankAccountID").val(retDat.objData[0].EXT_BANK_ACCOUNT_ID);
                        $("#ddlPaidTo").val(txtValuePaidTo);
                    } else {
                        $("#txtPaidTo").val("");
                        $("#txtAccountNo").val("");
                        $("#txtAccountName").val("");
                        $("#txtBankAccount").val("");
                        $("#txtExtBankAccountID").val("");
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
    

    if (txtValue != "") {
        $("#ddlPaidTo").val(txtValue);
    }
}

function p_ddlPaidTo_TextChanged() {
    var txtValue = $("#ddlPaidTo").val();
    var splitVar = txtValue.split(';');
    if (splitVar.length == 4) {
        $("#txtPaidTo").val(txtValue);
        $("#txtAccountNo").val(splitVar[0]);
        $("#txtAccountName").val(splitVar[1]);
        $("#txtBankAccount").val(splitVar[2]);
        $("#txtExtBankAccountID").val(splitVar[3]);
    } else {
        $("#txtPaidTo").val("");
        $("#txtAccountNo").val("");
        $("#txtAccountName").val("");
        $("#txtBankAccount").val("");
        $("#txtExtBankAccountID").val("");
    }
}

function p_clearAllInputData() {
    var objData = JSON.parse(p_UIToData());

    objData.TXT_SUPPLIER_SITE_CODE = ""
    objData.TXT_SUPPLIER_SITE_NAME = ""
    objData.TXT_REFDOCNO = "";
    objData.TXT_BATCH_NAME = "";
    objData.TXT_DESCRIPTION = "";
    objData.INT_AP_TERM_ID = 0;
    objData.TXT_AP_TERM = "";
    objData.TXT_ACTIVITYCODE = "";
    objData.TXT_ACTIVITYNAME = "";
    objData.TXT_INVOICE_NO = "";
    objData.TXT_FKT_PJK_NO = "";
    objData.TXT_PAID_TO = "";
    objData.TXT_ACCOUNT_NAME = "";
    objData.TXT_ACCOUNT_NO = "";
    objData.DEC_AMOUNT = 0;
    objData.TXT_ZX_TAX_RATE_CODE = "";
    objData.DEC_ZX_TAX_PERCENT = 0;
    objData.DEC_PERSEN_PPH = 0;
    objData.DEC_PPH = 0;
    objData.DEC_PPN = 0;
    objData.INT_AWT_GROUP_ID = 0;
    objData.DEC_AWT_TAX_RATE = 0;
    objData.TXT_AWT_TAX_NAME = "";
    objData.DEC_RFA_AMOUNT = 0;
    objData.TXT_BANK_ACCOUNT = "";
    objData.TXT_WITH_HOLDING_DESC = "";
    objData.TXT_WITH_HOLDING_DESC2 = "";
    objData.INT_EXT_BANK_ACCOUNT_ID = 0;
    objData.DEC_AWT_TAX_RATE = 0;

    $('#ddlItemWithHoldDescription').empty();

    p_SetHiddenObject(objData);

    p_DataToUI(objData);
}

function p_txtSupplierID_TextChanged(intSupplierIdChoose, txtSupplierNameChoose) {
    

    //berdasarkan routeconfig
    var txtSupplierNameExist = $("#txtSupplierName").val();

    if (txtSupplierNameExist == txtSupplierNameChoose || txtSupplierNameExist == "") {
        $("#txtSupplierID").val(intSupplierIdChoose);
        p_getSupplierData();
    } else {
        clsGlobal.getConfirmation("Perubahan Supplier Name akan menghapus semua data dibawahnya, Apakah anda setuju?", function (result) {
            
            if (result) {
                p_clearAllInputData();
                $("#txtSupplierID").val(intSupplierIdChoose);
                p_getSupplierData();
            } else {
                return false;
            }
        });
    }

    
}

function p_getSupplierData() {
    clsGlobal.showLoading();

    $.ajax({
        type: "POST",
        async: false,
        url: "/Master/Supplier/GetData",
        data: { txtID: $("#txtSupplierID").val(), __RequestVerificationToken: $('#frmRFA input[name=__RequestVerificationToken]').val() },
        datatype: "json",
        success: function (retDat) {
            
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
        data: { txtID: $("#txtSupplierSiteID").val(), __RequestVerificationToken: $('#frmRFA input[name=__RequestVerificationToken]').val() },
        datatype: "json",
        success: function (retDat) {

            if (retDat.bitSuccess == true) {
                if (retDat.objData != undefined) {
                    $("#txtSupplierSiteName").val(clsGlobal.parseToString(retDat.objData.VENDOR_SITE_CODE));
                    
                    // Get Paid To.
                    p_PopulatePaidTo("", true);
                   
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

function p_settxtReffRFA(txtValue) {
    clsGlobal.showLoading();
    $.ajax({
        type: "POST",
        url: "/Transaction/RFA/GetReffRFA",
        data: { txtValue:txtValue,data: $("#txtHiddenObject").val(), txtGUID: $("#txtGUID").val(), __RequestVerificationToken: $('#frmRFA input[name=__RequestVerificationToken]').val() },
        datatype: "json",
        success: function (retDat) {
            
            if (retDat.bitSuccess == true) {
                p_DataToUI(retDat.objData);  
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

    var data = new FormData();
    if (attachments.length > 0) {
        for (var i = 0; i < attachments.length; i++) {
            data.append("attachments[]", attachments[i]);
        }
    }
    data.append("data", $("#txtHiddenObject").val());
    data.append("txtGUID", $("#txtGUID").val());
    data.append("__RequestVerificationToken", $('#frmRFA input[name=__RequestVerificationToken]').val());


    $.ajax({
        type: "POST",
        url: "/Transaction/RFA/SaveData",
        processData: false,
        contentType: false,
        data: data,
        //data: { data: $("#txtHiddenObject").val(), txtGUID: $("#txtGUID").val(), __RequestVerificationToken: $('#frmRFA input[name=__RequestVerificationToken]').val() },
        //datatype: "json",
        success: function (retDat) {
            
            if (retDat.bitSuccess == true) {
                p_DataToUI(retDat.objData);
                adaID = false;
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

    var data = new FormData();
    if (attachments.length > 0) {
        for (var i = 0; i < attachments.length; i++) {
            data.append("attachments[]", attachments[i]);
        }
    }
    data.append("data", $("#txtHiddenObject").val());
    data.append("txtGUID", $("#txtGUID").val());
    data.append("__RequestVerificationToken", $('#frmRFA input[name=__RequestVerificationToken]').val());

    $.ajax({
        type: "POST",
        url: "/Transaction/RFA/SubmitData",
        processData: false,
        contentType: false,
        data: data,
        //data: { data: $("#txtHiddenObject").val(), txtGUID: $("#txtGUID").val(), __RequestVerificationToken: $('#frmRFA input[name=__RequestVerificationToken]').val() },
        //datatype: "json",
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


function p_pushToOracle() {
    clsGlobal.showLoading();
    p_UIToData();
    $.ajax({
        type: "POST",
        url: "/Transaction/RFA/PushToOracle",
        data: { data: $("#txtHiddenObject").val(), txtGUID: $("#txtGUID").val(), __RequestVerificationToken: $('#frmRFA input[name=__RequestVerificationToken]').val() },
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

function p_printToOracle() {
    clsGlobal.showLoading();
    p_UIToData();
    $.ajax({
        type: "POST",
        url: "/Transaction/RFA/PrintToOracle",
        data: { data: $("#txtHiddenObject").val(), txtGUID: $("#txtGUID").val(), __RequestVerificationToken: $('#frmRFA input[name=__RequestVerificationToken]').val() },
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

function p_checkToOracle() {
    clsGlobal.showLoading();
    p_UIToData();
    $.ajax({
        type: "POST",
        url: "/Transaction/RFA/CheckToOracle",
        data: { data: $("#txtHiddenObject").val(), txtGUID: $("#txtGUID").val(), __RequestVerificationToken: $('#frmRFA input[name=__RequestVerificationToken]').val() },
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

function p_viewOutputOracle() {
    clsGlobal.showLoading();
    p_UIToData();
    $.ajax({
        type: "POST",
        url: "/Transaction/RFA/ViewOutputOracle",
        data: { data: $("#txtHiddenObject").val(), txtGUID: $("#txtGUID").val(), __RequestVerificationToken: $('#frmRFA input[name=__RequestVerificationToken]').val() },
        datatype: "json",
        success: function (retDat) {
            
            if (retDat.bitSuccess == true) {
                //window.location = retDat.objData;
                window.open(retDat.objData, '_blank');
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
 
function p_txtInvoiceAmount_TextChanged() {
    p_ddlTipePPN_TextChanged();
    p_ddlTipePPH_TextChanged();
}

function p_ddlTipePPN_TextChanged() {
    
    if (clsGlobal.parseToString($("#ddlTipePPN").val()) != "" && clsGlobal.parseToString($("#ddlTipePPN").val()) != "-") {
        var resultPPNSplit = $("#ddlTipePPN").val().split(';');
        var decPercent = clsGlobal.parseToDecimal(resultPPNSplit[1]);

        var decInvoiceAmount = clsGlobal.parseToDecimal($("#txtInvoiceAmount").val());
        var decPPNAmount = decInvoiceAmount * decPercent / 100;
        $("#txtPPN").val(clsGlobal.FormatMoney(decPPNAmount, 0));  
    } else {
        $("#txtPPN").val(0);
    }
    p_calculateTotalInvoiceAmount();
   
}

function p_ddlTipePPH_TextChanged() {
    
    if (clsGlobal.parseToString($("#ddlTipePPH").val()) != "" && clsGlobal.parseToString($("#ddlTipePPH").val()) != "-") {
        var resultPPHSplit = $("#ddlTipePPH").val().split(';');
        var decRate = clsGlobal.parseToDecimal(resultPPHSplit[2]);


        var decInvoiceAmount = clsGlobal.parseToDecimal($("#txtInvoiceAmount").val());
        var decPPHAmount = decInvoiceAmount * decRate / 100;
        $("#txtPPH").val(clsGlobal.FormatMoney(decPPHAmount, 0)); 
    } else {
        $("#txtPPH").val(0);
    }
    p_calculateTotalInvoiceAmount();

    p_PopulateTaxWithHoldDesc($("#ddlItemWithHoldDescription").val());
    
}

function p_calculateTotalInvoiceAmount() {
    var decTotalRFA = clsGlobal.parseToDecimal($("#txtInvoiceAmount").val()) + clsGlobal.parseToDecimal($("#txtPPN").val()) + clsGlobal.parseToDecimal($("#txtPPH").val());
    $("#txtTotalRFA").val(clsGlobal.FormatMoney(decTotalRFA, 0));
}
 
function p_cancelDocument() {

    clsGlobal.showLoading();
    p_UIToData();
    $.ajax({
        type: "POST",
        url: "/Transaction/RFA/CancelDocument",
        data: { data: $("#txtHiddenObject").val(), txtGUID: $("#txtGUID").val(), __RequestVerificationToken: $('#frmRFA input[name=__RequestVerificationToken]').val() },
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


function p_createAsNewDocument() {

    clsGlobal.showLoading();
    p_UIToData();
    $.ajax({
        type: "POST",
        url: "/Transaction/RFA/CreateAsNewDocument",
        data: { data: $("#txtHiddenObject").val(), txtGUID: $("#txtGUID").val(), __RequestVerificationToken: $('#frmRFA input[name=__RequestVerificationToken]').val() },
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
        url: "/Transaction/RFA/PrintoutToPDF",
        data: { data: $("#txtHiddenObject").val(), txtGUID: $("#txtGUID").val(), __RequestVerificationToken: $('#frmRFA input[name=__RequestVerificationToken]').val() },
        datatype: "json",
        success: function (retDat) {
            
            if (retDat.bitSuccess == true) {
                window.open(retDat.objData, '_blank');
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

function p_printKPPData() {

    clsGlobal.showLoading();
    p_UIToData();
    $.ajax({
        type: "POST",
        url: "/Transaction/RFA/PrintKPPToPDF",
        data: { data: $("#txtHiddenObject").val(), txtGUID: $("#txtGUID").val(), __RequestVerificationToken: $('#frmRFA input[name=__RequestVerificationToken]').val() },
        datatype: "json",
        success: function (retDat) {
            
            if (retDat.bitSuccess == true) {
                window.open(retDat.objData, '_blank');
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

function p_GetDataTaxWithHoldDesc() { 
    // PPH DESC
    clsGlobal.showLoading();
    
    $.ajax({
        type: "POST",
        url: "/Main/PopulatePPHDesc",
        data: { __RequestVerificationToken: $('#frmRFA input[name=__RequestVerificationToken]').val() },
        datatype: "json",
        success: function (retDat) {
            if (retDat.bitSuccess == true) {
                
                if (retDat.objData != undefined) {
                    PPHDESCList = retDat.objData; 
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
 
function p_PopulateTaxWithHoldDesc(txtValue) {
    $('#ddlItemWithHoldDescription').empty();
    $('#ddlItemWithHoldDescription').append($('<option>').text("-").prop('value', ""));
    // Populate ke All

    var resultPPHSplit = clsGlobal.parseToString($("#ddlTipePPH").val()).split(';');
    for (var i = 0; i < PPHDESCList.length; i++) {
        if (resultPPHSplit.length == 3) {
            if (clsGlobal.parseToString(PPHDESCList[i].FLEX_VALUE_SET_NAME).indexOf(resultPPHSplit[1]) != -1) {
                $('#ddlItemWithHoldDescription').append($('<option>').text(PPHDESCList[i].FLEX_VALUE).prop('value', PPHDESCList[i].FLEX_VALUE));
            }
        }
        
    }

    if (txtValue != "") {
        $("#ddlItemWithHoldDescription").val(txtValue);
    }
}


function p_ViewAttahcment() {
    clsGlobal.showLoading();
    p_UIToData();
    $.ajax({
        type: "POST",
        url: "/Transaction/RFA/ViewAttachment",
        data: { txtValue: $("#txtRefDocNo").val(), data: $("#txtHiddenObject").val(), txtGUID: $("#txtGUID").val(), __RequestVerificationToken: $('#frmRFA input[name=__RequestVerificationToken]').val() },
        datatype: "json",
        success: function (retDat) {

            if (retDat.bitSuccess == true) {
                window.open(retDat.objData.XXSHP_KCO_T_RFS_HDR_ATT[0].TXT_FILE_DIRECTORY, '_blank');
            }
            clsGlobal.hideLoading();
            $("#txtGUID").val(retDat.txtGUID);
        },
        error: function (retDat) {

            clsGlobal.hideLoading();
        }
    });
}

function p_RemoveAttachment() {
    clsGlobal.showLoading();
    p_UIToData();
    $.ajax({
        type: "POST",
        url: "/Transaction/RFA/RemoveAttachment",
        data: { txtValue: $("#txtRefDocNo").val(), data: $("#txtHiddenObject").val(), txtGUID: $("#txtGUID").val(), __RequestVerificationToken: $('#frmRFA input[name=__RequestVerificationToken]').val() },
        datatype: "json",
        success: function (retDat) {

            if (retDat.bitSuccess == true) {
                p_DataToUI(retDat.objData);
                clsGlobal.getInformationMessage(retDat.txtMessage);
            }
            clsGlobal.hideLoading();
            $("#txtGUID").val(retDat.txtGUID);
        },
        error: function (retDat) {

            clsGlobal.hideLoading();
        }
    });
}

function p_pushSmart() {
    clsGlobal.showLoading();
    $.ajax({
        type: "POST",
        url: "/Transaction/RFA/PushSmart",
        data: { data: $("#txtHiddenObject").val(), txtGUID: $("#txtGUID").val(), __RequestVerificationToken: $('#frmRFA input[name=__RequestVerificationToken]').val() },
        datatype: "json",
        success: function (retDat) {

            if (retDat.bitSuccess == true) {
                clsGlobal.getInformationMessage("Push Berhasil!");
                window.open(retDat.objData, '_blank');
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

function p_printBarcodeData() {

    clsGlobal.showLoading();
    p_UIToData();
    $.ajax({
        type: "POST",
        url: "/Transaction/RFA/PrintBarcode",
        data: { data: $("#txtHiddenObject").val(), txtGUID: $("#txtGUID").val(), __RequestVerificationToken: $('#frmRFA input[name=__RequestVerificationToken]').val() },
        datatype: "json",
        success: function (retDat) {

            if (retDat.bitSuccess == true) {
                window.open(retDat.objData, '_blank');
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
        p_EnableControl(false);
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
        LOV = clsGlobal.generateLOV(MODULE_RFA, "txtDocNo"); //MODULE_APPROVALHIERARCHY
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
});


$('#btnLOVSupplierName').bind('click', function () {
    try {
        LOV = clsGlobal.generateLOV(LOV_XXSHP_VENDOR_SITE_ALL_V, "txtSupplierID");
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
});

$('#btnLOVSupplierSite').bind('click', function () {
    try {
        LOV = clsGlobal.generateLOV(LOV_XXSHP_VENDOR_SITE_ALL_V_VENDOR_SITE_ID, "txtSupplierSiteID", $("#txtSupplierID").val());
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
});

function p_btnLOVActivitySubBrand_Click(objCaller, intIndex) {
    
    p_SetCurrentRowSubBrand(objCaller);
    try {
        LOV = clsGlobal.generateLOV(MODULE_BRAND_BRANDBUDGET, "txtActivitySubBrand");
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
}

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

$('#btnAddActivity').on('click', function () {
    try {
        p_AddRowActivity();
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
});
//$("#btndtRequestDate").on("changeDate", function (e) {
//    $("#dtRequestDate").val(clsGlobal.parseToDateTimeFromJSON(e.date, clsDateFormat));
//});

//$("#btndtTermDate").on("changeDate", function (e) {
//    $("#dtTermDate").val(clsGlobal.parseToDateTimeFromJSON(e.date, clsDateFormat));
//});

//$("#btndtDueDate").on("changeDate", function (e) {
//    $("#dtDueDate").val(clsGlobal.parseToDateTimeFromJSON(e.date, clsDateFormat));
//});


$('#ddlCurrency').on('change', function () {
    try {
        p_ddlCurrency_TextChanged();
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
});

$('#ddlPaidTo').on('change', function () {
    try {
        p_ddlPaidTo_TextChanged();
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
});


$('#btnLOVActivity').bind('click', function () {
    try {
        LOV = clsGlobal.generateLOV(MODULE_ACTIVITY, "txtActivityCode");
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
});

  
$('#btnPushOracle').bind('click', function () {
    try {
        clsGlobal.getConfirmation("Push to Oracle this document?", function (result) {
            if (result == true) {
                p_pushToOracle();
            }
            else {
                return false;
            }
        });
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
});


$('#btnPrintOracle').bind('click', function () {
    try {
        clsGlobal.getConfirmation("Print Oracle this document?", function (result) {
            if (result == true) {
                p_printToOracle();
            }
            else {
                return false;
            }
        });
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
});



$('#btnCheckOracle').bind('click', function () {
    try {
        clsGlobal.getConfirmation("Check Oracle this document?", function (result) {
            if (result == true) {
                p_checkToOracle();
            }
            else {
                return false;
            }
        });
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
});
 


$('#btnViewOutputOracle').bind('click', function () {
    try {
        clsGlobal.getConfirmation("View Output this document?", function (result) {
            if (result == true) {
                p_viewOutputOracle();
                //dibikin gini karena biar setelah viewoutput biar nomor RF Oracle nya muncul langsung
                p_txtDocNo_TextChanged();
            }
            else {
                return false;
            }
        });
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
});
 
$('#ddlTipePPN').bind('change', function () {
    try {
        p_ddlTipePPN_TextChanged();
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
});
 
$('#ddlTipePPH').bind('change', function () {
    try {
        p_ddlTipePPH_TextChanged();
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
});

$('#txtInvoiceAmount').bind('change', function () {
    try {
        p_txtInvoiceAmount_TextChanged();
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
});
$('#txtPPN').bind('change', function () {
    try {
        p_calculateTotalInvoiceAmount();
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
});

$('#txtPPH').bind('change', function () {
    try {
        p_calculateTotalInvoiceAmount();
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
});

$('#btnLOVReffRFA').bind('click', function () {
    try {
        LOV = clsGlobal.generateLOV(LOV_RFA_KLAIM_REFF, "txtReffRFA", "RFA|" + clsGlobal.parseToString($("#txtSupplierID").val()) + "|" + clsGlobal.parseToString($("#txtSupplierSiteID").val()));
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
});

$('#btnApprovalHistory').bind('click', function () {
    try {
        var fancyboxdata = p_GetHiddenObject();
        LOV = clsGlobal.generatePopUpIframeSmall($(location).attr('protocol') + "//" + $(location).attr('host') + "/Master/ApprovalHistory/Index?TXT_TYPEDOC=" + "&TXT_REF_DOCNO=" + fancyboxdata.TXT_DOCNO + "&INT_DOCID=" + fancyboxdata.INT_RFA_HDR_ID, "btnApprovalHistory", fancyboxdata);

    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
});


$("#btnCancel").on("click", function (e) {
    try {
        clsGlobal.getConfirmation("Cancel for this document?", function (result) {
            if (result == true) {
                p_cancelDocument();
            }
            else {
                return false;
            }
        });
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
});


$("#btnCreateAsNew").on("click", function (e) {
    try {
        clsGlobal.getConfirmation("Create as New for this document?", function (result) {
            if (result == true) {
                p_createAsNewDocument();
                p_EnableControl(false);
            }
            else {
                return false;
            }
        });
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

$("#btnPrintKPP").on("click", function (e) {
    try {
        clsGlobal.getConfirmation("Print this KPP document?", function (result) {
            if (result == true) {
                p_printKPPData();
            }
            else {
                return false;
            }
        });
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
});


$("#fileHeader").on("change", function (e) {
    try {
        var objData = p_GetHiddenObject();
        var bitAttachmentIsNull = objData == null ? false : clsGlobal.parseToBoolean(objData.XXSHP_KDS_T_RFA_HDR_ATT.some(x => x.BIT_ACTIVE == 'Y') == false);

        var attahcment = $(this)[0].files[0];
        //clsGlobal.getConfirmation("Update Attahcment? (Previous attahcment will be merge with new one if exist)", function (result) {
        if (bitAttachmentIsNull) {
            attachments = [];
            attachments.push(attahcment);
            clsGlobal.showAlert("Success Update Attachment! (Button preview just can be show after save/submit)");
        } else {
            clsGlobal.getConfirmation("Update Attahcment? (Previous attahcment will be delete if exist)", function (result) {
                if (result == true) {
                    //p_pushSmart();
                    attachments = [];
                    attachments.push(attahcment);
                }
                else {
                    return false;
                }
            });
        }
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
});


$("#btnViewAttachment").on("click", function (e) {
    try {
        //
        //var attahcment = $(this)[0].files[0];
        //clsGlobal.getConfirmation("Update Attahcment? (Previous attahcment will be merge with new one if exist)", function (result) {
        //clsGlobal.getConfirmation("Update Attahcment? (Previous attahcment will be delete if exist)", function (result) {
        //    if (result == true) {
        //        //p_pushSmart();
        //        attachments = [];
        //        attachments.push(attahcment);
        //        //p_updateAttachmentData();
        //    }
        //    else {
        //        return false;
        //    }
        //});
        p_ViewAttahcment();
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
});

$("#btnDeleteAttachment").on("click", function (e) {
    try {
        //
        //var attahcment = $(this)[0].files[0];
        //clsGlobal.getConfirmation("Update Attahcment? (Previous attahcment will be merge with new one if exist)", function (result) {
        clsGlobal.getConfirmation("Delete Attahcment?", function (result) {
            if (result == true) {
                //p_pushSmart();
                //attachments = [];
                //attachments.push(attahcment);
                //p_updateAttachmentData();
                p_RemoveAttachment();
            }
            else {
                return false;
            }
        });
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
});


$("#btnPushSmart").on("click", function (e) {
    try {

        //p_validatePushSmart();
        clsGlobal.getConfirmation("Push All Attachment To SMART?", function (result) {

            if (result == true) {
                p_pushSmart();
            }
            else {
                return false;
            }
        });
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
});


$("#btnPrintBarcode").on("click", function (e) {
    try {
        clsGlobal.getConfirmation("Print this Barcode document?", function (result) {
            if (result == true) {
                p_printBarcodeData();
            }
            else {
                return false;
            }
        });
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
});
 