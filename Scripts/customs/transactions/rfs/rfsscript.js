//=======================
// VARIABLE GLOBAL
//=======================
var clsGlobal = new clsGlobalClass();
var LOV;
var bitLoading = false;
var oTableDetail;

var GL_CODE_COMBINATIONSList;
var XXSHP_AP_TERMS_VList;
var clsMCountryList;
var attachments = [];


//=======================
// Confirmation
//======================= 

//=======================
// ON PAGE LOAD
//=======================
$(document).ready(function () { 
    p_PopulateDataDropdownList()
    //p_InitForm();
    p_validatePage();  
});

//=======================
// FUNCTION
//=======================
function p_InitForm() {
    p_initiateData(); 
    p_InitiateDetail();

    //buat handling hyperlink dari barcode
    var queryString = window.location.search;
    if (queryString != "") {
        var urlParams = new URLSearchParams(queryString);
        var TXT_DOC_NO = clsGlobal.decrypt(urlParams.get('docno'));
        //di cleansing url nya biar tetep bersih
        p_cleansingURL();
        $("#txtDocNo").val(TXT_DOC_NO);
        p_txtDocNo_TextChanged();
    }
}

function p_cleansingURL() {
    // Get the current URL
    let url = new URL(window.location.href);

    // Remove the 'docno' parameter
    url.searchParams.delete('docno');

    // Update the browser's URL without reloading
    window.history.replaceState({}, document.title, url.toString());
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
            //
            p_txtSupplierID_TextChanged(arr[1], arr[2], arr[3], arr[4]);
            break;
        case "txtSupplierSiteID":
            $("#txtSupplierSiteID").val(arr[1]);
            p_txtSupplierSiteID_TextChanged();
            break;
        case "txtRefDocNo":
            $("#txtRefDocNo").val(arr[1]);
            p_txtRefDocNo_TextChanged();
            break; 
        case "AddInvoice": 
            p_setAddInvoice(arr[1]);
            break; 
    }
    clsGlobal.closeLOV();
}
   
function p_DataToUI(objData) {
    $("#txtDocNo").val(clsGlobal.parseToString(objData.TXT_DOCNO));
    $("#txtRefDocNo").val(clsGlobal.parseToString(objData.TXT_REFDOCNO));
    $("#dtRequestDate").val(clsGlobal.parseToDateTimeFromJSON(objData.CREATION_DATE, clsDateFormat));
    $("#lblStatusFlow").html(clsGlobal.parseToString(objData.TXT_STATUSFLOW));
    $("#ddlRFType").val(clsGlobal.parseToString(objData.TXT_RF_TYPE));
    p_ddlRFType_TextChanged();

    $("#txtRequestor").val(clsGlobal.parseToString(objData.TXT_REQUESTOR));
    $("#txtPrefixBatch").val(clsGlobal.parseToString(objData.TXT_PREFIX_BATCH));
    $("#txtBatchName").val(clsGlobal.parseToString(objData.TXT_BATCH_NAME));
    $("#txtDescription").val(clsGlobal.parseToString(objData.TXT_DESCRIPTION));

    $("#txtSupplierID").val(clsGlobal.parseToString(objData.TXT_SUPPLIER_ID));
    $("#txtSupplierName").val(clsGlobal.parseToString(objData.TXT_SUPPLIER_NAME));
    $("#txtSupplierSiteID").val(clsGlobal.parseToString(objData.TXT_SUPPLIER_SITE_CODE));
    $("#txtSupplierSiteName").val(clsGlobal.parseToString(objData.TXT_SUPPLIER_SITE_NAME));

    
    p_PopulatePaidTo(objData.TXT_PAID_TO, true);
    $("#txtPaidTo").val(clsGlobal.parseToString(objData.TXT_PAID_TO));
    $("#txtBankAccount").val(clsGlobal.parseToString(objData.TXT_BANK_ACCOUNT));
    $("#txtAccountName").val(clsGlobal.parseToString(objData.TXT_ACCOUNT_NAME));
    $("#txtAccountNo").val(clsGlobal.parseToString(objData.TXT_ACCOUNT_NO));
    $("#txtExtBankAccountID").val(clsGlobal.parseToString(objData.INT_EXT_BANK_ACCOUNT_ID));

    $("#txtOracleRFNumber").val(clsGlobal.parseToString(objData.TXT_RF_ORACLE_NO));

    $("#txtTotalRFS").val(clsGlobal.FormatMoney(objData.DEC_AMOUNT, 0));
    $('#chkNeverValidate').prop('checked', clsGlobal.ParseBooleanOracleToNET(objData.BIT_NEVERVALIDATE));

    var bitApply = clsGlobal.ParseBooleanOracleToNET(objData.BIT_APPLY);
    var bitApprv = clsGlobal.ParseBooleanOracleToNET(objData.BIT_APPROVED);
    var bitCancl = clsGlobal.ParseBooleanOracleToNET(objData.BIT_CANCELLED);
    var bitPshSm = clsGlobal.ParseBooleanOracleToNET(objData.BIT_PUSH_SMART);
    var bitFinishUpload = clsGlobal.ParseBooleanOracleToNET(objData.BIT_FINISH_UPLOAD);
    var bitDocNoNull = clsGlobal.parseToBoolean($("#txtDocNo").val() == "" || $("#txtDocNo").val() == "0");
    var bitAttachmentIsNull = clsGlobal.parseToBoolean(objData.XXSHP_KDS_T_RFS_HDR_ATT.some(x => x.BIT_ACTIVE == 'Y')) == false;

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
            if (objData.TXT_RF_ORACLE_NO != null) {
                $('#btnPrintBarcode').show();
                $('#btnPushSmart').show();
            } else {
                $('#btnPrintBarcode').hide();
                $('#btnPushSmart').hide();
            }
        } else {
            $('#btnPrintBarcode').hide();
            $('#btnPushSmart').hide();
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

        $("#fileHeader").show();
        $("#fileHeaderTitle").hide();

        //dibikin kosong biar attachment lama hilang
        $("#fileHeader").val("");
        attachments = [];
    } else {
        $('#btnViewAttachment').show();
        if (bitApply == false)
            $('#btnDeleteAttachment').show();

        var dtAttachment = objData.XXSHP_KDS_T_RFS_HDR_ATT[0];
        if (dtAttachment)
            $("#fileHeaderTitle").val(dtAttachment.TXT_FILE_NAME);

        $("#fileHeader").hide();
        $("#fileHeaderTitle").show();
    }

    p_DataToUIDetail(objData.XXSHP_KDS_T_RFS_DTL);

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

    //buat handling button ketika status waiting progress push smart di freeze form nya
    if (objData.TXT_STATUSCODE == "STATUS_RFS6") {
        //STATUS_RFS6 disini adalah on progress smart
        $("#btnCancel").hide();
    }
}

function p_ShowPrintKPP(objData) {
    var bitApply = clsGlobal.ParseBooleanOracleToNET(objData.BIT_APPLY);
    $('#btnPrintKPP').hide();
    if (bitApply) {
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
    if (clsGlobal.ParseBooleanOracleToNET(objDat.BIT_APPLY)
        && clsGlobal.ParseBooleanOracleToNET(objDat.BIT_APPROVED)) {
        // Sudah submit dan Approved
        if (clsGlobal.ParseBooleanOracleToNET(objDat.BIT_UPLOAD)) {
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
    p_GenerateDateTimePicker();
}

function p_GenerateAutoNumeric() {
    //
    $('.autonumeric').autoNumeric('init', { vMax: '9999999999999.99', vMin: '-9999999999999.99', aSep: ',', dGroup: '3', aDec: '.' });
}

function p_GenerateDateTimePicker() {
    //
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
        url: "/Transaction/RFS/InitiateData",
        data: { __RequestVerificationToken: $('#frmRFS input[name=__RequestVerificationToken]').val() },
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
    jsonData.TXT_REFDOCNO = clsGlobal.parseToString($("#txtRefDocNo").val());
    jsonData.CREATION_DATE = clsGlobal.parseToString($("#dtRequestDate").val());
    jsonData.TXT_REQUESTOR = clsGlobal.parseToString($("#txtRequestor").val());
    jsonData.TXT_STATUSFLOW = clsGlobal.parseToString($("#txtStatus").val());
    jsonData.TXT_PREFIX_BATCH = clsGlobal.parseToString($("#txtPrefixBatch").val());
    jsonData.TXT_BATCH_NAME = clsGlobal.parseToString($("#txtBatchName").val());
    jsonData.TXT_DESCRIPTION = clsGlobal.parseToString($("#txtDescription").val());
    jsonData.TXT_RF_TYPE = clsGlobal.parseToString($("#ddlRFType").val());

    jsonData.TXT_SUPPLIER_ID = clsGlobal.parseToString($("#txtSupplierID").val());
    jsonData.TXT_SUPPLIER_NAME = clsGlobal.parseToString($("#txtSupplierName").val());
    jsonData.TXT_SUPPLIER_SITE_CODE = clsGlobal.parseToString($("#txtSupplierSiteID").val());
    jsonData.TXT_SUPPLIER_SITE_NAME = clsGlobal.parseToString($("#txtSupplierSiteName").val());

    jsonData.TXT_PAID_TO = clsGlobal.parseToString($("#txtPaidTo").val());
    jsonData.TXT_BANK_ACCOUNT = clsGlobal.parseToString($("#txtBankAccount").val());
    jsonData.TXT_ACCOUNT_NAME = clsGlobal.parseToString($("#txtAccountName").val());
    jsonData.TXT_ACCOUNT_NO = clsGlobal.parseToString($("#txtAccountNo").val());
    jsonData.INT_EXT_BANK_ACCOUNT_ID = clsGlobal.parseToDecimal($("#txtExtBankAccountID").val());

    jsonData.TXT_RFS_ORACLE_NO = clsGlobal.parseToString($("#txtOracleRFNumber").val());
    jsonData.DEC_AMOUNT = clsGlobal.parseToDecimal($("#txtTotalRFS").val());
    jsonData.BIT_NEVERVALIDATE = clsGlobal.ParseBooleanNETToOracle(clsGlobal.parseToBoolean($("#chkNeverValidate").prop("checked")));

    p_SetHiddenObject(jsonData);
    return $("#txtHiddenObject").val();

}

function p_EnableControl(bitApply) {
    
    if (bitApply == true) {
        $("#btnSave").hide();
        $("#btnSubmit").hide();
        $("#btnApprovalHistory").show();
        $("#btndtRequestDate").attr("disabled", "true");
        $("#btnLOVRefDocNo").attr("disabled", "true"); 
        $("#ddlRFType").attr("disabled", "true");
        $("#txtBatchName").attr("disabled", "true"); 
        $("#txtDescription").attr("disabled", "true");
        $("#btnLOVSupplierName").attr("disabled", "true");
        $("#btnLOVSupplierSite").attr("disabled", "true");
        $("#txtPaidTo").attr("disabled", "true");
        $("#txtAccountNo").attr("disabled", "true");
        $("#txtAccountName").attr("disabled", "true");
        $("#txtBankAccount").attr("disabled", "true");

        $("#btnAddDetail").hide();
          
        $(".txtInvoiceNo").each(function (index) {
            $(this).attr("disabled", "true");
        });
        $(".btnLOVCurrencyCode").each(function (index) {
            $(this).hide();
        });
        $(".btnLOVRateType").each(function (index) {
            $(this).hide();
        });
        $(".btnLOVAPTerm").each(function (index) {
            $(this).hide();
        });
        $(".dtInvoiceDate").each(function (index) {
            $(this).attr("disabled", "true");
        });
        $(".dtGLDate").each(function (index) {
            $(this).attr("disabled", "true");
        });
        $(".dtTermDate").each(function (index) {
            $(this).attr("disabled", "true");
        });
        $(".dtDueDate").each(function (index) {
            $(this).attr("disabled", "true");
        });
        $(".btnLOVTaxCountry").each(function (index) {
            $(this).hide();
        }); 
        $(".dtActivityGLDate").each(function (index) {
            $(this).attr("disabled", "true");
        });
        $(".txtActivityRFAAmount").each(function (index) {
            $(this).attr("disabled", "true");
        });  

        $(".btnActivityDelete").each(function (index) {
            $(this).hide();
        });
    } else {
        $("#btnSave").show();
        $("#btnSubmit").show();
        $("#btnApprovalHistory").hide();
        $("#btndtRequestDate").removeAttr("disabled");
        $("#btnLOVRefDocNo").removeAttr("disabled"); 
        $("#ddlRFType").removeAttr("disabled");
        $("#txtBatchName").removeAttr("disabled");
        $("#txtDescription").removeAttr("disabled");
        $("#btnLOVSupplierName").removeAttr("disabled");
        $("#btnLOVSupplierSite").removeAttr("disabled");
        $("#txtPaidTo").removeAttr("disabled");
        $("#txtAccountNo").removeAttr("disabled");
        $("#txtAccountName").removeAttr("disabled");
        $("#txtBankAccount").removeAttr("disabled");

        $("#btnAddDetail").show();
     
        $(".txtInvoiceNo").each(function (index) {
            $(this).removeAttr("disabled");
        });
        $(".btnLOVCurrencyCode").each(function (index) {
            $(this).show();
        });
        $(".btnLOVRateType").each(function (index) {
            $(this).show();
        });
        $(".btnLOVAPTerm").each(function (index) {
            $(this).show();
        });
        $(".dtInvoiceDate").each(function (index) {
            $(this).show();
        });
        $(".dtGLDate").each(function (index) {
            $(this).show();
        });
        $(".dtTermDate").each(function (index) {
            $(this).show();
        });
        $(".dtDueDate").each(function (index) {
            $(this).show();
        });
        $(".btnLOVTaxCountry").each(function (index) {
            $(this).show();
        });

        $(".dtActivityGLDate").each(function (index) {
            $(this).removeAttr("disabled");
        });
        $(".txtActivityRFAAmount").each(function (index) {
            $(this).removeAttr("disabled");
        }); 

        $(".btnActivityDelete").each(function (index) {
            $(this).show();
        });
    }
}

function p_txtDocNo_TextChanged() {
    clsGlobal.showLoading();
    $.ajax({
        type: "POST",
        url: "/Transaction/RFS/GetDataByTxtDocNo",
        data: { txtDocNo: $("#txtDocNo").val(), __RequestVerificationToken: $('#frmRFS input[name=__RequestVerificationToken]').val() },
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

function p_txtRefDocNo_TextChanged() {
    clsGlobal.showLoading();
    p_UIToData();
    $.ajax({
        type: "POST",
        url: "/Transaction/RFS/GetReffRFS",
        data: { txtValue: $("#txtRefDocNo").val(),data: $("#txtHiddenObject").val(), txtGUID: $("#txtGUID").val(), __RequestVerificationToken: $('#frmRFS input[name=__RequestVerificationToken]').val() },
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

function p_validateDoubleCMA(txtValue) {
    jsonData = p_GetHiddenObject();

    for (var i = 0; i < jsonData.XXSHP_KDS_T_RFS_DTL.length; i++) {
        if (jsonData.XXSHP_KDS_T_RFS_DTL[0].TXT_CMA_DOCNO == txtValue) {

            clsGlobal.closeLOV();
            clsGlobal.hideLoading();
            clsGlobal.getAlert("Double Invoice!");

            throw new Error("Double Invoice!")
        }
    }
}

function p_setAddInvoice(txtValue) {
    clsGlobal.showLoading();
    p_validateDoubleCMA(txtValue);
    p_UIToData();
    $.ajax({
        type: "POST",
        url: "/Transaction/RFS/GetAddInvoice",
        data: { txtValue: txtValue, data: $("#txtHiddenObject").val(), txtGUID: $("#txtGUID").val(), __RequestVerificationToken: $('#frmRFS input[name=__RequestVerificationToken]').val() },
        datatype: "json",
        success: function (retDat) {
            
            if (retDat.bitSuccess == true) {
                p_DataToUI(retDat.objData);
                p_calculateTotal();
            }
            else if (retDat.bitSuccess == false) {
                alert(retDat.txtMessage)
            }
            clsGlobal.hideLoading();
            $("#txtGUID").val(retDat.txtGUID);
        },
        error: function (retDat) {
            
            clsGlobal.hideLoading();
        }
    });
}

function p_clearAllInputData() {
    var objData = p_GetHiddenObject();

    objData.TXT_RF_TYPE = ""
    objData.TXT_SUPPLIER_SITE_CODE = ""
    objData.TXT_SUPPLIER_SITE_NAME = ""
    //objData.TXT_REFDOCNO = "";
    objData.TXT_PREFIX_BATCH = "";
    objData.TXT_BATCH_NAME = "";
    objData.TXT_DESCRIPTION = "";
    //objData.INT_AP_TERM_ID = 0;
    //objData.TXT_AP_TERM = "";
    //objData.TXT_ACTIVITYCODE = "";
    //objData.TXT_ACTIVITYNAME = "";
    //objData.TXT_INVOICE_NO = "";
    //objData.TXT_FKT_PJK_NO = "";
    objData.TXT_PAID_TO = "";
    objData.TXT_ACCOUNT_NAME = "";
    objData.TXT_ACCOUNT_NO = "";
    objData.DEC_AMOUNT = 0;
    //objData.TXT_ZX_TAX_RATE_CODE = "";
    //objData.DEC_ZX_TAX_PERCENT = 0;
    //objData.DEC_PERSEN_PPH = 0;
    //objData.DEC_PPH = 0;
    //objData.DEC_PPN = 0;
    //objData.INT_AWT_GROUP_ID = 0;
    //objData.DEC_AWT_TAX_RATE = 0;
    //objData.TXT_AWT_TAX_NAME = "";
    //objData.DEC_RFA_AMOUNT = 0;
    objData.TXT_BANK_ACCOUNT = "";
    //objData.TXT_WITH_HOLDING_DESC = "";
    //objData.TXT_WITH_HOLDING_DESC2 = "";
    objData.INT_EXT_BANK_ACCOUNT_ID = 0;
    //objData.DEC_AWT_TAX_RATE = 0;

    //$('#ddlItemWithHoldDescription').empty();

    p_SetHiddenObject(objData);
    p_clearAllRFSDtl();
    p_clearAllRFSMat();

    //di get ulang biar yang di rfs mat ilang
    objData = p_GetHiddenObject();
    p_DataToUI(objData);
}

function p_clearAllRFSDtl() {
    // Parse dari HiddenObject->JSON
    //
    var objData = p_GetHiddenObject();
    var totalRowOriginal = objData.XXSHP_KDS_T_RFS_DTL.length;
    for (i = 0; i < totalRowOriginal; i++) {
        // Cari Index-nya.
        objData.XXSHP_KDS_T_RFS_DTL.splice(0, 1);
        oTableDetail.row(0).remove().draw(false);
        //break;
    }
    p_SetHiddenObject(objData);
    //p_RefreshNumberActivity();
}

function p_clearAllRFSMat() {
    // Parse dari HiddenObject->JSON
    //
    var objData = p_GetHiddenObject();
    var totalRowOriginal = objData.XXSHP_KDS_T_RFS_MAT.length;
    for (i = 0; i < totalRowOriginal; i++) {
        // Cari Index-nya.
        objData.XXSHP_KDS_T_RFS_MAT.splice(0, 1);
        //oTableActivity.row(0).remove().draw(false);
        //break;
    }
    p_SetHiddenObject(objData);
    //p_RefreshNumberActivity();
}

function p_txtSupplierID_TextChanged(intSupplierIdChoose, txtSupplierNameChoose, intSupplierSiteIdChoose, txtSupplierSiteNameChoose) { 
    var txtSupplierNameExist = $("#txtSupplierName").val();

    if (txtSupplierNameExist == txtSupplierNameChoose || txtSupplierNameExist == "") {
        $("#txtSupplierID").val(intSupplierIdChoose);
        p_getSupplierData();
        //supplier site nya dibikin auto fill ketika milih supplier nya
        $("#txtSupplierSiteID").val(intSupplierSiteIdChoose);
        $("#txtSupplierSiteName").val(txtSupplierSiteNameChoose);
        //enhancement ticket 141366 langsung auto fill type RF RFP
        $("#ddlRFType").val("RFP");
        p_ddlRFType_TextChanged();
    } else {
        clsGlobal.getConfirmation("Perubahan Supplier Name akan menghapus semua data dibawahnya, Apakah anda setuju?", function (result) {
            
            if (result) {
                p_clearAllInputData();
                $("#txtSupplierID").val(intSupplierIdChoose);
                p_getSupplierData();
                //supplier site nya dibikin auto fill ketika milih supplier nya
                $("#txtSupplierSiteID").val(intSupplierSiteIdChoose);
                $("#txtSupplierSiteName").val(txtSupplierSiteNameChoose);
                //enhancement ticket 141366 langsung auto fill type RF RFP
                $("#ddlRFType").val("RFP");
                p_ddlRFType_TextChanged();
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
        data: { txtID: $("#txtSupplierID").val(), __RequestVerificationToken: $('#frmRFS input[name=__RequestVerificationToken]').val() },
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
        data: { txtID: $("#txtSupplierSiteID").val(), __RequestVerificationToken: $('#frmRFS input[name=__RequestVerificationToken]').val() },
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

function p_PopulatePaidTo(txtValue, bitAutomatic) {
    $('#ddlPaidTo').empty();
    $('#ddlPaidTo').append($('<option>').text("-").prop('value', ""));

    if ($("#txtSupplierID").val() != "" && $("#txtSupplierSiteID").val() != "") {
        clsGlobal.showLoading();
        $.ajax({
            type: "POST",
            url: "/Master/Supplier/GetPaidTo",
            data: { txtVendorID: $("#txtSupplierID").val(), txtVendorSiteID: $("#txtSupplierSiteID").val(), __RequestVerificationToken: $('#frmRFS input[name=__RequestVerificationToken]').val() },
            datatype: "json",
            success: function (retDat) {
                for (var i = 0; i < retDat.objData.length; i++) {
                    var txtValuePaidTo = retDat.objData[i].BANK_ACCOUNT_NUM + ";" + retDat.objData[i].BANK_ACCOUNT_NAME + ";" + retDat.objData[i].BANK_PARTY_ID + ";" + retDat.objData[i].EXT_BANK_ACCOUNT_ID;
                    $('#ddlPaidTo').append($('<option>').text(txtValuePaidTo).prop('value', txtValuePaidTo));
                }

                
                if (bitAutomatic == true) {
                    if (txtValue != "") {
                        var splitVar = txtValue.split(';');
                        $("#ddlPaidTo").val(txtValue);
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
                    } else {
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
    data.append("__RequestVerificationToken", $('#frmRFS input[name=__RequestVerificationToken]').val());

    $.ajax({
        type: "POST",
        url: "/Transaction/RFS/SaveData",
        processData: false,
        contentType: false,
        data: data,
        //data: { data: $("#txtHiddenObject").val(), txtGUID: $("#txtGUID").val(), __RequestVerificationToken: $('#frmRFS input[name=__RequestVerificationToken]').val() },
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
    data.append("__RequestVerificationToken", $('#frmRFS input[name=__RequestVerificationToken]').val());

    $.ajax({
        type: "POST",
        url: "/Transaction/RFS/SubmitData",
        //data: { data: $("#txtHiddenObject").val(), txtGUID: $("#txtGUID").val(), __RequestVerificationToken: $('#frmRFS input[name=__RequestVerificationToken]').val() },
        //datatype: "json",
        processData: false,
        contentType: false,
        data: data,
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
        url: "/Transaction/RFS/PushToOracle",
        data: { data: $("#txtHiddenObject").val(), txtGUID: $("#txtGUID").val(), __RequestVerificationToken: $('#frmRFS input[name=__RequestVerificationToken]').val() },
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
        url: "/Transaction/RFS/PrintToOracle",
        data: { data: $("#txtHiddenObject").val(), txtGUID: $("#txtGUID").val(), __RequestVerificationToken: $('#frmRFS input[name=__RequestVerificationToken]').val() },
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
        url: "/Transaction/RFS/CheckToOracle",
        data: { data: $("#txtHiddenObject").val(), txtGUID: $("#txtGUID").val(), __RequestVerificationToken: $('#frmRFS input[name=__RequestVerificationToken]').val() },
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
        url: "/Transaction/RFS/ViewOutputOracle",
        data: { data: $("#txtHiddenObject").val(), txtGUID: $("#txtGUID").val(), __RequestVerificationToken: $('#frmRFS input[name=__RequestVerificationToken]').val() },
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


function p_ddlRFType_TextChanged() { 
    if($("#ddlRFType").val() == "RFS" ){
        $("#divMatchingdRFA").show();        
        $("#divReffDocNo").show();
        $("#txtPrefixBatch").val("RFS KDS");
    }else if($("#ddlRFType").val() == "RFP" ){ 
        $("#divMatchingdRFA").hide();
        $("#divReffDocNo").show();
        $("#txtPrefixBatch").val("RFP KDS");
    } else {
        $("#divMatchingdRFA").hide();
        $("#divReffDocNo").hide();
        $("#txtPrefixBatch").val("");
    }
}


function p_PopulateDataDropdownList() {
    // Currency
    clsGlobal.showLoading();
    
    $.ajax({
        type: "POST",
        url: "/Main/PopulateCurrency",
        data: { __RequestVerificationToken: $('#frmRFS input[name=__RequestVerificationToken]').val() },
        datatype: "json",
        success: function (retDat) {
            if (retDat.bitSuccess == true) {
                
                if (retDat.objData != undefined) {
                    GL_CODE_COMBINATIONSList = retDat.objData; 
                }
            } else {
                clsGlobal.getAlert(retDat.txtMessage);
            }

            // AP TERM
            clsGlobal.showLoading();
            
            $.ajax({
                type: "POST",
                url: "/Main/PopulateApTerm",
                data: { __RequestVerificationToken: $('#frmRFS input[name=__RequestVerificationToken]').val() },
                datatype: "json",
                success: function (retDat) {
                    if (retDat.bitSuccess == true) {
                        
                        if (retDat.objData != undefined) {
                            XXSHP_AP_TERMS_VList = retDat.objData;
                        }
                    } else {
                        clsGlobal.getAlert(retDat.txtMessage);
                    }

                    // AP TERM
                    clsGlobal.showLoading();
                    
                    $.ajax({
                        type: "POST",
                        url: "/Main/PopulateTaxCountry",
                        data: { __RequestVerificationToken: $('#frmRFS input[name=__RequestVerificationToken]').val() },
                        datatype: "json",
                        success: function (retDat) {
                            if (retDat.bitSuccess == true) {
                                
                                if (retDat.objData != undefined) {
                                    clsMCountryList = retDat.objData;
                                }
                            } else {
                                clsGlobal.getAlert(retDat.txtMessage);
                            }


                            // Setelah finish semuanya.
                            p_InitForm();

                            clsGlobal.hideLoading();
                            $("#txtGUID").val(retDat.txtGUID);
                        },
                        error: function (retDat) {
                            clsGlobal.hideLoading();
                        }
                    });

                    clsGlobal.hideLoading();
                    $("#txtGUID").val(retDat.txtGUID);
                },
                error: function (retDat) {
                    clsGlobal.hideLoading();
                }
            });
            
            clsGlobal.hideLoading();
            $("#txtGUID").val(retDat.txtGUID);
        },
        error: function (retDat) {
            clsGlobal.hideLoading();
        }
    });

    


    
}

function p_btnMatchingRFA_Click() {
    try {
        // Parse dari HiddenObject->JSON
        var objData = JSON.parse(p_UIToData());
        if (objData.TXT_SUPPLIER_SITE_NAME == "") {
            throw "Supplier harus di isi!";
        } 
         
        var fancyboxdata = p_GetHiddenObject();
        LOV = clsGlobal.generatePopUpIframe($(location).attr('protocol') + "//" + $(location).attr('host') + "/Transaction/RFS/AppliedRFA", "btnMatchingRFA", fancyboxdata); 
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
}
 
function p_cancelDocument() {

    clsGlobal.showLoading();
    p_UIToData();
    $.ajax({
        type: "POST",
        url: "/Transaction/RFS/CancelDocument",
        data: { data: $("#txtHiddenObject").val(), txtGUID: $("#txtGUID").val(), __RequestVerificationToken: $('#frmRFS input[name=__RequestVerificationToken]').val() },
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
        url: "/Transaction/RFS/CreateAsNewDocument",
        data: { data: $("#txtHiddenObject").val(), txtGUID: $("#txtGUID").val(), __RequestVerificationToken: $('#frmRFS input[name=__RequestVerificationToken]').val() },
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
        url: "/Transaction/RFS/PrintoutToPDF",
        data: { data: $("#txtHiddenObject").val(), txtGUID: $("#txtGUID").val(), __RequestVerificationToken: $('#frmRFS input[name=__RequestVerificationToken]').val() },
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
        url: "/Transaction/RFS/PrintKPPToPDF",
        data: { data: $("#txtHiddenObject").val(), txtGUID: $("#txtGUID").val(), __RequestVerificationToken: $('#frmRFS input[name=__RequestVerificationToken]').val() },
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



// ====================================================
//  ACTIVITY
// ====================================================

function p_DataToUIDetail(XXSHP_KDS_T_RFS_DTL) {
    
    oTableDetail.clear();
    for (var i = 0; i < XXSHP_KDS_T_RFS_DTL.length; i++) {
        XXSHP_KDS_T_RFS_DTL[i].intIndex = i; 
        oTableDetail.row.add(XXSHP_KDS_T_RFS_DTL[i]);
    }
    oTableDetail.draw(false);

    var objDat = p_GetHiddenObject();
    objDat.XXSHP_KDS_T_RFS_DTL = XXSHP_KDS_T_RFS_DTL;

    p_SetHiddenObject(objDat);
}
 
function p_AddRow() {
    
    p_UIToData();
    var objData = p_GetHiddenObject(); 
    if (objData.TXT_SUPPLIER_NAME == "") {
        throw "Kolom Supplier harus di isi!";
    }
    if (objData.TXT_SUPPLIER_SITE_NAME == "") {
        throw "Kolom Supplier Site harus di isi!";
    } 

    LOV = clsGlobal.generateLOV(LOV_RFP_ADD_INVOICE, "AddInvoice", clsGlobal.parseToString($("#ddlRFType").val()) + "|" + clsGlobal.parseToString($("#txtSupplierID").val()) + "|" + clsGlobal.parseToString($("#txtSupplierSiteID").val()));
     
}

function p_InitiateDetail() {
    // Format datatable  
    
    oTableDetail = $('#dtDetail').DataTable({
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
                    return '<div id="lblDetailNoValue"> ' + (full.intIndex + 1) + ' </div>';
                }
            },
           {
               aTargets: [1],
               mRender: function (data, type, full) {
                   return '<div >  <input type="text" class="form-control txtInvoiceNo  text-upper"  id="txtInvoiceNo' + full.intIndex + '" onchange="p_txtInvoiceNo_Changed(this,' + full.intIndex + ')"  value="' + clsGlobal.parseToString(full.TXT_INVOICE_NO) + '" >  </div> <div style="display:none;"> ' + clsGlobal.parseToString(full.TXT_INVOICE_NO) + ' </div>';
               }
           },
           {
               aTargets: [2],
               mRender: function (data, type, full) {
                   return '<div >  <input type="text" class="form-control txtDescription text-upper"  id="txtDescription' + full.intIndex + '" onchange="p_txtDescription_Changed(this,' + full.intIndex + ')"  value="' + clsGlobal.parseToString(full.TXT_DESCRIPTION) + '">  </div> <div style="display:none;"> ' + clsGlobal.parseToString(full.TXT_DESCRIPTION) + ' </div>';
               }
           },
            {
                aTargets: [3],
                mRender: function (data, type, full) {
                    return '<div >  <input type="text" class="form-control dtInvoiceDate kalendertarget"  style="width:100px;"  id="dtInvoiceDate' + full.intIndex + '" onchange="p_dtInvoiceDate_Changed(this,' + full.intIndex + ')"  value="' + clsGlobal.parseToDateTimeFromJSON(full.DTM_INVOICE_DATE, clsDateFormat) + '" >  </div>';
                }
            },
           {
               aTargets: [4],
               mRender: function (data, type, full) { 
                   var txtResult = "";
                   txtResult += "<select class='form-control' id='ddlCurrencyCode' onchange='p_ddlCurrencyCode_TextChanged(this," + full.intIndex + ")'>";
                   txtResult += "<option value=''>-</option>";
                   for (var i = 0; i < GL_CODE_COMBINATIONSList.length; i++) {
                       if (GL_CODE_COMBINATIONSList[i].CURRENCY_CODE == full.TXT_CURRENCY_CODE) {
                           txtResult += "<option value='" + GL_CODE_COMBINATIONSList[i].CURRENCY_CODE + "' selected>" + GL_CODE_COMBINATIONSList[i].CURRENCY_CODE + "</option>";
                       } else {
                           txtResult += "<option value='" + GL_CODE_COMBINATIONSList[i].CURRENCY_CODE + "'>" + GL_CODE_COMBINATIONSList[i].CURRENCY_CODE + "</option>";
                       }                           
                   }
                   txtResult += "</select>";
                   return txtResult; 
               }
           }, 
            {
                aTargets: [5],
                mRender: function (data, type, full) {
                    return '<div >  <input type="text" class="form-control txtRate text-right autonumeric"  id="txtRate' + full.intIndex + '"   value="' + clsGlobal.FormatMoney(full.DEC_RATE,0) + '" disabled >  </div>';
                }
            },
            {
                aTargets: [6],
                mRender: function (data, type, full) {
                    var txtResult = "";
                    txtResult += "<select class='form-control' id='ddlAPTerm' onchange='p_ddlAPTerm_TextChanged(this," + full.intIndex + ")'>";
                    txtResult += "<option value=''>-</option>";
                    for (var i = 0; i < XXSHP_AP_TERMS_VList.length; i++) {
                        if (XXSHP_AP_TERMS_VList[i].TERM_ID == full.INT_AP_TERM_ID) {
                            txtResult += "<option value='" + XXSHP_AP_TERMS_VList[i].TERM_ID + ";" + XXSHP_AP_TERMS_VList[i].DESCRIPTION + ";" + XXSHP_AP_TERMS_VList[i].DUE_DAYS + "' selected>" + XXSHP_AP_TERMS_VList[i].DESCRIPTION + "</option>";
                        } else {
                            txtResult += "<option value='" + XXSHP_AP_TERMS_VList[i].TERM_ID + ";" + XXSHP_AP_TERMS_VList[i].DESCRIPTION + ";" + XXSHP_AP_TERMS_VList[i].DUE_DAYS + "'>" + XXSHP_AP_TERMS_VList[i].DESCRIPTION + "</option>";
                        }
                    }
                    txtResult += "</select>";
                    return txtResult;
                }
            },
            {
                aTargets: [7],
                mRender: function (data, type, full) {
                    return '<div >  <input type="text" class="form-control dtGLDate kalendertarget"  style="width:100px;"  id="dtGLDate' + full.intIndex + '" onchange="p_dtGLDate_Changed(this,' + full.intIndex + ')"  value="' + clsGlobal.parseToDateTimeFromJSON(full.DTM_GL_DATE, clsDateFormat) + '" >  </div>';
                }
            },
           {
               aTargets: [8],
               mRender: function (data, type, full) {
                   return '<div >  <input type="text" class="form-control dtTermDate kalendertarget"  style="width:100px;"  id="dtTermDate' + full.intIndex + '" onchange="p_dtTermDate_Changed(this,' + full.intIndex + ')"  value="' + clsGlobal.parseToDateTimeFromJSON(full.DTM_TERM_DATE, clsDateFormat) + '" >  </div>';
               }
           },
           {
               aTargets: [9],
               mRender: function (data, type, full) {
                   return '<div >  <input type="text" class="form-control dtDueDate kalendertarget"  style="width:100px;"  id="dtDueDate' + full.intIndex + '" onchange="p_dtDueDate_Changed(this,' + full.intIndex + ')"  value="' + clsGlobal.parseToDateTimeFromJSON(full.DTM_DUE_DATE, clsDateFormat) + '" >  </div>';
               }
           },
           {
               aTargets: [10],
               mRender: function (data, type, full) {
                   var txtResult = "";
                   txtResult += "<select class='form-control' id='ddlAPTerm' onchange='p_ddlTaxCountry_TextChanged(this," + full.intIndex + ")'>";
                   txtResult += "<option value=''>-</option>";
                   for (var i = 0; i < clsMCountryList.length; i++) {
                       if (clsMCountryList[i].TxtCountryName == full.TXT_TAX_COUNTRY) {
                           txtResult += "<option value='" + clsMCountryList[i].TxtCountryName + "' selected>" + clsMCountryList[i].TxtCountryName + "</option>";
                       } else {
                           txtResult += "<option value='" + clsMCountryList[i].TxtCountryName + "'>" + clsMCountryList[i].TxtCountryName + "</option>";
                       }
                   }
                   txtResult += "</select>";
                   return txtResult;
               }
           },
           {
               aTargets: [11],
               mRender: function (data, type, full) {
                   return '<div >  <input type="text" class="form-control txtTaxInvoiceNo"  id="txtTaxInvoiceNo' + full.intIndex + '" onchange="p_txtTaxInvoiceNo_Changed(this,' + full.intIndex + ')"  value="' + clsGlobal.parseToString(full.TXT_TAX_INVOICE_NO) + '" >  </div> <div style="display:none;"> ' + clsGlobal.parseToString(full.TXT_TAX_INVOICE_NO) + ' </div>';
               }
           },
           {
               aTargets: [12],
               mRender: function (data, type, full) {
                   return '<div >  <input type="text" class="form-control dtTaxInvoiceDate kalendertarget"  style="width:100px;"  id="dtTaxInvoiceDate' + full.intIndex + '" onchange="p_dtTaxInvoiceDate_Changed(this,' + full.intIndex + ')"  value="' + clsGlobal.parseToDateTimeFromJSON(full.DTM_TAX_INVOICE_DATE, clsDateFormat) + '" >  </div>';
               }
           }, 
           {
               aTargets: [13],
               mRender: function (data, type, full) {
                   return '<div >  <input type="text" class="form-control dtInvoiceReceiptDate kalendertarget"  style="width:100px;"  id="dtInvoiceReceiptDate' + full.intIndex + '" onchange="p_dtInvoiceReceiptDate_Changed(this,' + full.intIndex + ')"  value="' + clsGlobal.parseToDateTimeFromJSON(full.DTM_FLEX_INVRECEIPT, clsDateFormat) + '" >  </div>';
               }
           },
           {
               aTargets: [14],
               mRender: function (data, type, full) {
                   return '<div >  <input type="text" class="form-control dtFAReceiptDate kalendertarget"  style="width:100px;"  id="dtFAReceiptDate' + full.intIndex + '" onchange="p_dtFAReceiptDate_Changed(this,' + full.intIndex + ')"  value="' + clsGlobal.parseToDateTimeFromJSON(full.DTM_FLEX_FARECEIPT, clsDateFormat) + '" >  </div>';
               }
           },
            {
                aTargets: [15],
                mRender: function (data, type, full) {
                    return '<div >  <input type="text" class="form-control text-right txtTaxBaseAmount autonumeric"  id="txtTaxBaseAmount' + full.intIndex + '" onkeyup="converter(id, ' + full.intIndex + ')" onchange="p_txtTaxBaseAmount_Changed(this,' + full.intIndex + ')"  value="' + clsGlobal.parseToString(full.DEC_FLEX_TAX) + '" disabled >  </div>';
                }
            },
            {
                aTargets: [16],
                mRender: function (data, type, full) {
                    return '<div >  <input type="text" class="form-control text-right txtVATAmount autonumeric"  id="txtVATAmount' + full.intIndex + '" onkeyup="converter(id, ' + full.intIndex + ')" onchange="p_txtVATAmount_Changed(this,' + full.intIndex + ')"  value="' + clsGlobal.parseToString(full.DEC_FLEX_VAT) + '" disabled >  </div>';
                }
            },
            {
                aTargets: [17],
                mRender: function (data, type, full) {
                    return '<div >  <input type="text" class="form-control text-right txtCurrencyTaxRate autonumeric"  id="txtCurrencyTaxRate' + full.intIndex + '" onkeyup="converter(id, ' + full.intIndex + ')" onchange="p_txtCurrencyTaxRate_Changed(this,' + full.intIndex + ')"  value="' + clsGlobal.parseToString(full.DEC_FLEX_TAXRATE) + '" disabled >  </div>';
                }
            }, 
            {
                aTargets: [18],
                mRender: function (data, type, full) {
                    return '<div > ' + full.TXT_INVOICE_STATUS + '  </div>';
                }
            },
            {
                aTargets: [19],
                mRender: function (data, type, full) {
                    var bitIsPaymentDateIsNull = full.DTM_PAID_DATE_ORACLE == null || full.DTM_PAID_DATE_ORACLE == "/Date(946659600000)/";
                    if (bitIsPaymentDateIsNull) {
                        full.DTM_PAID_DATE_ORACLE = '';
                    }
                    return '<div > ' + clsGlobal.parseToDateTimeFromJSON(full.DTM_PAID_DATE_ORACLE, clsDateFormat) + '  </div>';
                }
            },
            {
                aTargets: [20],
                mRender: function (data, type, full) {
                    return '<div > ' + full.TXT_PAID_STATUS_ORACLE + '  </div>';
                }
            },
            {
                aTargets: [21],
                mRender: function (data, type, full) {
                    return '<div > <input type="text" class="form-control" value="' + clsGlobal.parseToString(full.TXT_REASON_CANCEL_SMART) + '" readonly />  </div>';
                }
            },
            {
                aTargets: [22],
                mRender: function (data, type, full) {
                    return '<div > <input type="button" class="btn btn-info btnItem" id="btnItem" onclick="p_btnItem_Click(this,' + full.intIndex + ')"  value="Item" >  </div>';
                }
            },
            {
                aTargets: [23],
                mRender: function (data, type, full) {
                    return '<div > <input type="button" class="btn btn-warning btnDelete" id="btnDelete" onclick="p_btnDelete_Click(this,' + full.intIndex + ')"  value="Delete" >  </div>';
                }
            }
        ] 
    });

    $("#dtDetail").css("width", "100%");
    $('#dtDetail tbody').on('click', 'tr', function () {
        if (!$(this).hasClass('selected')) {
            oTableDetail.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
        }
    });
}
  
function p_txtInvoiceNo_Changed(objCaller, intIndex) {
    
    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());
    for (i = 0; i < objData.XXSHP_KDS_T_RFS_DTL.length; i++) {
        // Cari Index-nya.
        if (objData.XXSHP_KDS_T_RFS_DTL[i].intIndex == intIndex) {
            // Ketemu, mulai dari sini:
            objData.XXSHP_KDS_T_RFS_DTL[i].TXT_INVOICE_NO = objCaller.value;

            break;
        }
    }

    p_SetHiddenObject(objData);
}

function p_txtDescription_Changed(objCaller, intIndex) {
    
    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());
    for (i = 0; i < objData.XXSHP_KDS_T_RFS_DTL.length; i++) {
        // Cari Index-nya.
        if (objData.XXSHP_KDS_T_RFS_DTL[i].intIndex == intIndex) {
            // Ketemu, mulai dari sini:
            objData.XXSHP_KDS_T_RFS_DTL[i].TXT_DESCRIPTION = objCaller.value;

            break;
        }
    }

    p_SetHiddenObject(objData);
}

function p_ddlCurrencyCode_TextChanged(objCaller, intIndex) {
    
    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());
    for (i = 0; i < objData.XXSHP_KDS_T_RFS_DTL.length; i++) {
        // Cari Index-nya.
        if (objData.XXSHP_KDS_T_RFS_DTL[i].intIndex == intIndex) {
            // Ketemu, mulai dari sini:
            objData.XXSHP_KDS_T_RFS_DTL[i].TXT_CURRENCY_CODE = objCaller.value;

            break;
        }
    }

    p_SetHiddenObject(objData);
}

function p_ddlAPTerm_TextChanged(objCaller, intIndex) {
    
    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());
    for (i = 0; i < objData.XXSHP_KDS_T_RFS_DTL.length; i++) {
        // Cari Index-nya.
        if (objData.XXSHP_KDS_T_RFS_DTL[i].intIndex == intIndex) {
            // Ketemu, mulai dari sini:
            var splitValue = objCaller.value.split(';');
            if (splitValue.length == 3) {
                objData.XXSHP_KDS_T_RFS_DTL[i].INT_AP_TERM_ID = clsGlobal.parseToInteger(splitValue[0]);
                objData.XXSHP_KDS_T_RFS_DTL[i].TXT_AP_TERM = clsGlobal.parseToString(splitValue[1]);
            }

            break;
        }
    }

    p_SetHiddenObject(objData);
}

function p_ddlTaxCountry_TextChanged(objCaller, intIndex) {
    
    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());
    for (i = 0; i < objData.XXSHP_KDS_T_RFS_DTL.length; i++) {
        // Cari Index-nya.
        if (objData.XXSHP_KDS_T_RFS_DTL[i].intIndex == intIndex) {
            // Ketemu, mulai dari sini: 
            objData.XXSHP_KDS_T_RFS_DTL[i].TXT_TAX_COUNTRY = clsGlobal.parseToString(objCaller.value);
            
            break;
        }
    }

    p_SetHiddenObject(objData);
}
function p_txtCurrencyCode_Changed(objCaller, intIndex) {
    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());
    for (i = 0; i < objData.XXSHP_KDS_T_RFS_DTL.length; i++) {
        // Cari Index-nya.
        if (objData.XXSHP_KDS_T_RFS_DTL[i].intIndex == intIndex) {
            // Ketemu, mulai dari sini:
            objData.XXSHP_KDS_T_RFS_DTL[i].TXT_CURRENCY_CODE = objCaller.value;

            break;
        }
    }

    p_SetHiddenObject(objData);
}
  
function p_txtAPTerm_Changed(objCaller, intIndex) {
    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());
    for (i = 0; i < objData.XXSHP_KDS_T_RFS_DTL.length; i++) {
        // Cari Index-nya.
        if (objData.XXSHP_KDS_T_RFS_DTL[i].intIndex == intIndex) {
            // Ketemu, mulai dari sini:
            objData.XXSHP_KDS_T_RFS_DTL[i].TXT_AP_TERM = objCaller.value;

            break;
        }
    }

    p_SetHiddenObject(objData);
} 

function p_dtInvoiceDate_Changed(objCaller, intIndex) {
    
    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());
    for (i = 0; i < objData.XXSHP_KDS_T_RFS_DTL.length; i++) {
        // Cari Index-nya.
        if (objData.XXSHP_KDS_T_RFS_DTL[i].intIndex == intIndex) {
            // Ketemu, mulai dari sini:
            if (clsGlobal.parseToString(objCaller.value) != "") {
                objData.XXSHP_KDS_T_RFS_DTL[i].DTM_INVOICE_DATE = clsGlobal.parseToJSONDateFromDate(objCaller.value, clsDateFormat);
            } else {
                objCaller.value = clsGlobal.parseToDateTimeFromJSON(objData.XXSHP_KDS_T_RFS_DTL[i].DTM_INVOICE_DATE, clsDateFormat)
            }
            break;
        }
    }
    p_SetHiddenObject(objData);
}

function p_dtGLDate_Changed(objCaller, intIndex) {
    
    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());
    for (i = 0; i < objData.XXSHP_KDS_T_RFS_DTL.length; i++) {
        // Cari Index-nya.
        if (objData.XXSHP_KDS_T_RFS_DTL[i].intIndex == intIndex) {
            // Ketemu, mulai dari sini:
            if (clsGlobal.parseToString(objCaller.value) != "") {
                objData.XXSHP_KDS_T_RFS_DTL[i].DTM_GL_DATE = clsGlobal.parseToJSONDateFromDate(objCaller.value, clsDateFormat);
            } else {
                objCaller.value = clsGlobal.parseToDateTimeFromJSON(objData.XXSHP_KDS_T_RFS_DTL[i].DTM_GL_DATE, clsDateFormat)
            }
            break;
        }
    }
    p_SetHiddenObject(objData);
}

function p_dtTermDate_Changed(objCaller, intIndex) {
    
    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());
    for (i = 0; i < objData.XXSHP_KDS_T_RFS_DTL.length; i++) {
        // Cari Index-nya.
        if (objData.XXSHP_KDS_T_RFS_DTL[i].intIndex == intIndex) {
            // Ketemu, mulai dari sini:
            if (clsGlobal.parseToString(objCaller.value) != "") {
                objData.XXSHP_KDS_T_RFS_DTL[i].DTM_TERM_DATE = clsGlobal.parseToJSONDateFromDate(objCaller.value, clsDateFormat);
            } else {
                objCaller.value = clsGlobal.parseToDateTimeFromJSON(objData.XXSHP_KDS_T_RFS_DTL[i].DTM_TERM_DATE, clsDateFormat)
            }
            break;
        }
    }
    p_SetHiddenObject(objData);
}

function p_dtDueDate_Changed(objCaller, intIndex) {
    
    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());
    for (i = 0; i < objData.XXSHP_KDS_T_RFS_DTL.length; i++) {
        // Cari Index-nya.
        if (objData.XXSHP_KDS_T_RFS_DTL[i].intIndex == intIndex) {
            // Ketemu, mulai dari sini:
            if (clsGlobal.parseToString(objCaller.value) != "") {
                objData.XXSHP_KDS_T_RFS_DTL[i].DTM_DUE_DATE = clsGlobal.parseToJSONDateFromDate(objCaller.value, clsDateFormat);
            } else {
                objCaller.value = clsGlobal.parseToDateTimeFromJSON(objData.XXSHP_KDS_T_RFS_DTL[i].DTM_DUE_DATE, clsDateFormat)
            }
            break;
        }
    }
    p_SetHiddenObject(objData);
}
 
function p_txtTaxInvoiceNo_Changed(objCaller, intIndex) {
    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());
    for (i = 0; i < objData.XXSHP_KDS_T_RFS_DTL.length; i++) {
        // Cari Index-nya.
        if (objData.XXSHP_KDS_T_RFS_DTL[i].intIndex == intIndex) {
            // Ketemu, mulai dari sini:
            objData.XXSHP_KDS_T_RFS_DTL[i].TXT_TAX_INVOICE_NO = objCaller.value;

            break;
        }
    }

    p_SetHiddenObject(objData);
}

function p_dtTaxInvoiceDate_Changed(objCaller, intIndex) {
    
    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());
    for (i = 0; i < objData.XXSHP_KDS_T_RFS_DTL.length; i++) {
        // Cari Index-nya.
        if (objData.XXSHP_KDS_T_RFS_DTL[i].intIndex == intIndex) {
            // Ketemu, mulai dari sini:
            if (clsGlobal.parseToString(objCaller.value) != "") {
                objData.XXSHP_KDS_T_RFS_DTL[i].DTM_TAX_INVOICE_DATE = clsGlobal.parseToJSONDateFromDate(objCaller.value, clsDateFormat);
            } else {
                objCaller.value = clsGlobal.parseToDateTimeFromJSON(objData.XXSHP_KDS_T_RFS_DTL[i].DTM_TAX_INVOICE_DATE, clsDateFormat)
            }
            break;
        }
    }
    p_SetHiddenObject(objData);
}
 
function p_dtInvoiceReceiptDate_Changed(objCaller, intIndex) {
    
    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());
    for (i = 0; i < objData.XXSHP_KDS_T_RFS_DTL.length; i++) {
        // Cari Index-nya.
        if (objData.XXSHP_KDS_T_RFS_DTL[i].intIndex == intIndex) {
            // Ketemu, mulai dari sini:
            if (clsGlobal.parseToString(objCaller.value) != "") {
                objData.XXSHP_KDS_T_RFS_DTL[i].DTM_FLEX_INVRECEIPT = clsGlobal.parseToJSONDateFromDate(objCaller.value, clsDateFormat);
            } else {
                objCaller.value = clsGlobal.parseToDateTimeFromJSON(objData.XXSHP_KDS_T_RFS_DTL[i].DTM_FLEX_INVRECEIPT, clsDateFormat)
            }
            break;
        }
    }
    p_SetHiddenObject(objData);
}

function p_dtFAReceiptDate_Changed(objCaller, intIndex) {
    
    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());
    for (i = 0; i < objData.XXSHP_KDS_T_RFS_DTL.length; i++) {
        // Cari Index-nya.
        if (objData.XXSHP_KDS_T_RFS_DTL[i].intIndex == intIndex) {
            // Ketemu, mulai dari sini:
            if (clsGlobal.parseToString(objCaller.value) != "") {
                objData.XXSHP_KDS_T_RFS_DTL[i].DTM_FLEX_FARECEIPT = clsGlobal.parseToJSONDateFromDate(objCaller.value, clsDateFormat);
            } else {
                objCaller.value = clsGlobal.parseToDateTimeFromJSON(objData.XXSHP_KDS_T_RFS_DTL[i].DTM_FLEX_FARECEIPT, clsDateFormat)
            }
            break;
        }
    }
    p_SetHiddenObject(objData);
}

function p_txtTaxBaseAmount_Changed(objCaller, intIndex) {
    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());
    for (i = 0; i < objData.XXSHP_KDS_T_RFS_DTL.length; i++) {
        // Cari Index-nya.
        if (objData.XXSHP_KDS_T_RFS_DTL[i].intIndex == intIndex) {
            // Ketemu, mulai dari sini:
            objData.XXSHP_KDS_T_RFS_DTL[i].DEC_FLEX_TAX = clsGlobal.parseToDecimal(objCaller.value);

            break;
        }
    }

    p_SetHiddenObject(objData);
}

function p_txtVATAmount_Changed(objCaller, intIndex) {
    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());
    for (i = 0; i < objData.XXSHP_KDS_T_RFS_DTL.length; i++) {
        // Cari Index-nya.
        if (objData.XXSHP_KDS_T_RFS_DTL[i].intIndex == intIndex) {
            // Ketemu, mulai dari sini:
            objData.XXSHP_KDS_T_RFS_DTL[i].DEC_FLEX_VAT = clsGlobal.parseToDecimal(objCaller.value);

            break;
        }
    }

    p_SetHiddenObject(objData);
}

function p_txtCurrencyTaxRate_Changed(objCaller, intIndex) {
    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());
    for (i = 0; i < objData.XXSHP_KDS_T_RFS_DTL.length; i++) {
        // Cari Index-nya.
        if (objData.XXSHP_KDS_T_RFS_DTL[i].intIndex == intIndex) {
            // Ketemu, mulai dari sini:
            objData.XXSHP_KDS_T_RFS_DTL[i].DEC_FLEX_TAXRATE = clsGlobal.parseToDecimal(objCaller.value);

            break;
        }
    }

    p_SetHiddenObject(objData);
}
 
function p_btnItem_Click(objCaller, intIndex) { 
    try {
        // Parse dari HiddenObject->JSON
        var objData = JSON.parse(p_UIToData());
        for (i = 0; i < objData.XXSHP_KDS_T_RFS_DTL.length; i++) {
            // Cari Index-nya.
            if (objData.XXSHP_KDS_T_RFS_DTL[i].intIndex == intIndex) {
                // Ketemu, mulai dari sini:

                // Validasi
                if (objData.TXT_SUPPLIER_SITE_NAME == "") {
                    throw "Supplier harus di isi!";
                }
                if (objData.TXT_RF_TYPE == "") {
                    throw "Tipe RFS/RFP harus di isi!";
                }
                if (objData.XXSHP_KDS_T_RFS_DTL[i].TXT_INVOICE_NO == "") {
                    throw "Nomor invoice harus di isi!";
                }
                if (objData.XXSHP_KDS_T_RFS_DTL[i].TXT_CURRENCY_CODE == "") {
                    throw "Mata uang harus di isi!";
                }
                if (objData.XXSHP_KDS_T_RFS_DTL[i].TXT_AP_TERM == "") {
                    throw "Term harus di isi!";
                }

                var fancyboxdata = p_GetHiddenObject();
                LOV = clsGlobal.generatePopUpIframe($(location).attr('protocol') + "//" + $(location).attr('host') + "/Transaction/RFS/Item?intIndex=" + intIndex, "btnItem", fancyboxdata);
                break;
            }
        }
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
}

function p_setItem() {
    
    var intSelectedIndex = p_GetSelectedDetailRow();
    var intRowIndex = 0;
    var objDat = p_GetHiddenObject();
    // Calculate Total Alokasi.
    var decAmount = 0;
    objDat.XXSHP_KDS_T_RFS_DTL[intSelectedIndex].DEC_AMOUNT = 0;
    objDat.XXSHP_KDS_T_RFS_DTL[intSelectedIndex].DEC_FLEX_TAX = 0;
    objDat.XXSHP_KDS_T_RFS_DTL[intSelectedIndex].DEC_FLEX_VAT = 0;
    for (i = 0; i < objDat.XXSHP_KDS_T_RFS_DTL[intSelectedIndex].XXSHP_KDS_T_RFS_ITM.length; i++) {
        // INVOICE AMOUNT = DPP + PPN
        objDat.XXSHP_KDS_T_RFS_DTL[intSelectedIndex].DEC_AMOUNT += objDat.XXSHP_KDS_T_RFS_DTL[intSelectedIndex].XXSHP_KDS_T_RFS_ITM[i].DEC_AMOUNT + objDat.XXSHP_KDS_T_RFS_DTL[intSelectedIndex].XXSHP_KDS_T_RFS_ITM[i].DEC_PPN;
        objDat.XXSHP_KDS_T_RFS_DTL[intSelectedIndex].DEC_FLEX_TAX += objDat.XXSHP_KDS_T_RFS_DTL[intSelectedIndex].XXSHP_KDS_T_RFS_ITM[i].DEC_AMOUNT;
        //objDat.XXSHP_KCO_T_RFS_DTL[intSelectedIndex].DEC_FLEX_VAT += (objDat.XXSHP_KCO_T_RFS_DTL[intSelectedIndex].XXSHP_KCO_T_RFS_ITM[i].DEC_AMOUNT * objDat.XXSHP_KCO_T_RFS_DTL[intSelectedIndex].XXSHP_KCO_T_RFS_ITM[i].DEC_PPN_PERCENTAGE / 100);
        objDat.XXSHP_KDS_T_RFS_DTL[intSelectedIndex].DEC_FLEX_VAT += objDat.XXSHP_KDS_T_RFS_DTL[intSelectedIndex].XXSHP_KDS_T_RFS_ITM[i].DEC_PPN;
    }

    // Show ke table. 
    p_SetHiddenObject(objDat);
    p_RefreshSelectedRow(intSelectedIndex);
    p_calculateTotal();
}

function p_calculateTotal() {
    var objDat = p_GetHiddenObject();
    
    objDat.DEC_AMOUNT = 0;
    for (i = 0; i < objDat.XXSHP_KDS_T_RFS_DTL.length; i++) {
        //objDat.DEC_AMOUNT += objDat.XXSHP_KCO_T_RFS_DTL[i].DEC_AMOUNT + objDat.XXSHP_KCO_T_RFS_DTL[i].DEC_FLEX_VAT;
        // Invoice amount = DPP + PPN!!
        objDat.DEC_AMOUNT += objDat.XXSHP_KDS_T_RFS_DTL[i].DEC_AMOUNT;
    }
    objDat.DEC_AMOUNT_IDR = objDat.DEC_AMOUNT;
    p_SetHiddenObject(objDat);
    $("#txtTotalRFS").val(clsGlobal.FormatMoney(objDat.DEC_AMOUNT, 0));
}

function p_GetSelectedDetailRow() {
    var intIndex = clsGlobal.parseToInteger(oTableDetail.$('tr.selected').find("#lblDetailNoValue").html()) - 1;
    return intIndex;
}

function p_RefreshDataRow() {
    var intSelectedIndex = p_GetSelectedDetailRow();
    var intRowIndex = 0;
    var objDat = p_GetHiddenObject();
    oTableDetail.rows().every(function (rowIdx, tableLoop, rowLoop) {
        
        var d = this.data();
        if (intRowIndex == intSelectedIndex) {
            p_RefreshSelectedRow(intRowIndex);

           // d.intIndex = intRowIndex; // update data source for the row 

            //d.TXT_INVOICE_NO = objDat.XXSHP_KCO_T_RFS_DTL[intRowIndex].TXT_INVOICE_NO;
            //d.TXT_DESCRIPTION = objDat.XXSHP_KCO_T_RFS_DTL[intRowIndex].TXT_DESCRIPTION;
            //d.TXT_CURRENCY_CODE = objDat.XXSHP_KCO_T_RFS_DTL[intRowIndex].TXT_CURRENCY_CODE;
            //d.TXT_RATE_TYPE = objDat.XXSHP_KCO_T_RFS_DTL[intRowIndex].TXT_RATE_TYPE;
            //d.DEC_RATE = objDat.XXSHP_KCO_T_RFS_DTL[intRowIndex].DEC_RATE;
            //d.TXT_AP_TERM = objDat.XXSHP_KCO_T_RFS_DTL[intRowIndex].TXT_AP_TERM;
            //d.DTM_INVOICE_DATE = objDat.XXSHP_KCO_T_RFS_DTL[intRowIndex].DTM_INVOICE_DATE;
            //d.DTM_GL_DATE = objDat.XXSHP_KCO_T_RFS_DTL[intRowIndex].DTM_GL_DATE;
            //d.DTM_TERM_DATE = objDat.XXSHP_KCO_T_RFS_DTL[intRowIndex].DTM_TERM_DATE;
            //d.DTM_DUE_DATE = objDat.XXSHP_KCO_T_RFS_DTL[intRowIndex].DTM_DUE_DATE;
            //d.TXT_TAX_COUNTRY = objDat.XXSHP_KCO_T_RFS_DTL[intRowIndex].TXT_TAX_COUNTRY;
            //d.TXT_TAX_INVOICE_NO = objDat.XXSHP_KCO_T_RFS_DTL[intRowIndex].TXT_TAX_INVOICE_NO;
            //d.DTM_TAX_INVOICE_DATE = objDat.XXSHP_KCO_T_RFS_DTL[intRowIndex].DTM_TAX_INVOICE_DATE;
            //d.TXT_SUPPLIERBANK_ACCNAME = objDat.XXSHP_KCO_T_RFS_DTL[intRowIndex].TXT_SUPPLIERBANK_ACCNAME;
            //d.TXT_SUPPLIERBANK_ACCNUMBER = objDat.XXSHP_KCO_T_RFS_DTL[intRowIndex].TXT_SUPPLIERBANK_ACCNUMBER;
            //d.DTM_FLEX_INVRECEIPT = objDat.XXSHP_KCO_T_RFS_DTL[intRowIndex].DTM_FLEX_INVRECEIPT;
            //d.DTM_FLEX_FARECEIPT = objDat.XXSHP_KCO_T_RFS_DTL[intRowIndex].DTM_FLEX_FARECEIPT;
            //d.DEC_FLEX_TAX = objDat.XXSHP_KCO_T_RFS_DTL[intRowIndex].DEC_FLEX_TAX;
            //d.DEC_FLEX_VAT = objDat.XXSHP_KCO_T_RFS_DTL[intRowIndex].DEC_FLEX_VAT;
            //d.DEC_FLEX_TAXRATE = objDat.XXSHP_KCO_T_RFS_DTL[intRowIndex].DEC_FLEX_TAXRATE;
            //d.TXT_FLEX_PONUMBER = objDat.XXSHP_KCO_T_RFS_DTL[intRowIndex].TXT_FLEX_PONUMBER;
            //d.TXT_FLEX_BBKNUMBER = objDat.XXSHP_KCO_T_RFS_DTL[intRowIndex].TXT_FLEX_BBKNUMBER;
            //d.TXT_FLEX_CNNUMBER = objDat.XXSHP_KCO_T_RFS_DTL[intRowIndex].TXT_FLEX_CNNUMBER;

            //this.invalidate(); // invalidate the data DataTables has cached for this row   
        }

        intRowIndex++;
    });

    //AutoNumeric.
    p_GenerateAutoNumeric(); 
    p_GenerateDateTimePicker();
}

function p_RefreshSelectedRow(intSelectedIndex) { 
    var intRowIndex = 0;
    var objDat = p_GetHiddenObject();
    oTableDetail.rows().every(function (rowIdx, tableLoop, rowLoop) {
        
        var d = this.data();
        if (intRowIndex == intSelectedIndex) {
            d.intIndex = intRowIndex; // update data source for the row 

            d.TXT_INVOICE_NO = objDat.XXSHP_KDS_T_RFS_DTL[intRowIndex].TXT_INVOICE_NO;
            d.TXT_DESCRIPTION = objDat.XXSHP_KDS_T_RFS_DTL[intRowIndex].TXT_DESCRIPTION;
            d.TXT_CURRENCY_CODE = objDat.XXSHP_KDS_T_RFS_DTL[intRowIndex].TXT_CURRENCY_CODE;
            d.TXT_RATE_TYPE = objDat.XXSHP_KDS_T_RFS_DTL[intRowIndex].TXT_RATE_TYPE;
            d.DEC_RATE = objDat.XXSHP_KDS_T_RFS_DTL[intRowIndex].DEC_RATE;
            d.TXT_AP_TERM = objDat.XXSHP_KDS_T_RFS_DTL[intRowIndex].TXT_AP_TERM;
            d.DTM_INVOICE_DATE = objDat.XXSHP_KDS_T_RFS_DTL[intRowIndex].DTM_INVOICE_DATE;
            d.DTM_GL_DATE = objDat.XXSHP_KDS_T_RFS_DTL[intRowIndex].DTM_GL_DATE;
            d.DTM_TERM_DATE = objDat.XXSHP_KDS_T_RFS_DTL[intRowIndex].DTM_TERM_DATE;
            d.DTM_DUE_DATE = objDat.XXSHP_KDS_T_RFS_DTL[intRowIndex].DTM_DUE_DATE;
            d.TXT_TAX_COUNTRY = objDat.XXSHP_KDS_T_RFS_DTL[intRowIndex].TXT_TAX_COUNTRY;
            d.TXT_TAX_INVOICE_NO = objDat.XXSHP_KDS_T_RFS_DTL[intRowIndex].TXT_TAX_INVOICE_NO;
            d.DTM_TAX_INVOICE_DATE = objDat.XXSHP_KDS_T_RFS_DTL[intRowIndex].DTM_TAX_INVOICE_DATE;
            d.TXT_SUPPLIERBANK_ACCNAME = objDat.XXSHP_KDS_T_RFS_DTL[intRowIndex].TXT_SUPPLIERBANK_ACCNAME;
            d.TXT_SUPPLIERBANK_ACCNUMBER = objDat.XXSHP_KDS_T_RFS_DTL[intRowIndex].TXT_SUPPLIERBANK_ACCNUMBER;
            d.DTM_FLEX_INVRECEIPT = objDat.XXSHP_KDS_T_RFS_DTL[intRowIndex].DTM_FLEX_INVRECEIPT;
            d.DTM_FLEX_FARECEIPT = objDat.XXSHP_KDS_T_RFS_DTL[intRowIndex].DTM_FLEX_FARECEIPT;
            d.DEC_FLEX_TAX = objDat.XXSHP_KDS_T_RFS_DTL[intRowIndex].DEC_FLEX_TAX;
            d.DEC_FLEX_VAT = objDat.XXSHP_KDS_T_RFS_DTL[intRowIndex].DEC_FLEX_VAT;
            d.DEC_FLEX_TAXRATE = objDat.XXSHP_KDS_T_RFS_DTL[intRowIndex].DEC_FLEX_TAXRATE;
            d.TXT_FLEX_PONUMBER = objDat.XXSHP_KDS_T_RFS_DTL[intRowIndex].TXT_FLEX_PONUMBER;
            d.TXT_FLEX_BBKNUMBER = objDat.XXSHP_KDS_T_RFS_DTL[intRowIndex].TXT_FLEX_BBKNUMBER;
            d.TXT_FLEX_CNNUMBER = objDat.XXSHP_KDS_T_RFS_DTL[intRowIndex].TXT_FLEX_CNNUMBER;

            this.invalidate(); // invalidate the data DataTables has cached for this row   
        }

        intRowIndex++;
    });

    //AutoNumeric.
    p_GenerateAutoNumeric();
    p_GenerateDateTimePicker();
}


function p_btnDelete_Click(objCaller, intIndex) {
    
    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());
    for (i = 0; i < objData.XXSHP_KDS_T_RFS_DTL.length; i++) {
        // Cari Index-nya.
        if (objData.XXSHP_KDS_T_RFS_DTL[i].intIndex == intIndex) {
            // Ketemu, mulai dari sini:
            // Remove from list.
            objData.XXSHP_KDS_T_RFS_DTL.splice(i, 1); 
            oTableDetail.row(i).remove().draw(false);

            var objDat = p_GetHiddenObject();
            break;
        }
    }
    p_SetHiddenObject(objData);
    p_RefreshNumberDetail();
    p_calculateTotal();
}

function p_RefreshNumberDetail() {
    
    var intRowIndex = 0;
    var objDat = p_GetHiddenObject();
    oTableDetail.rows().every(function (rowIdx, tableLoop, rowLoop) {
        
        var d = this.data();
        d.intIndex = intRowIndex; // update data source for the row
        objDat.XXSHP_KDS_T_RFS_DTL[intRowIndex].intIndex = d.intIndex;

        d.TXT_INVOICE_NO = objDat.XXSHP_KDS_T_RFS_DTL[intRowIndex].TXT_INVOICE_NO;
        d.TXT_DESCRIPTION = objDat.XXSHP_KDS_T_RFS_DTL[intRowIndex].TXT_DESCRIPTION;
        d.TXT_SUPPLIER_SITE_NAME = objDat.XXSHP_KDS_T_RFS_DTL[intRowIndex].TXT_SUPPLIER_SITE_NAME;
        d.TXT_CURRENCY_CODE = objDat.XXSHP_KDS_T_RFS_DTL[intRowIndex].TXT_CURRENCY_CODE;
        d.TXT_RATE_TYPE = objDat.XXSHP_KDS_T_RFS_DTL[intRowIndex].TXT_RATE_TYPE;
        d.DEC_RATE = objDat.XXSHP_KDS_T_RFS_DTL[intRowIndex].DEC_RATE;
        d.TXT_AP_TERM = objDat.XXSHP_KDS_T_RFS_DTL[intRowIndex].TXT_AP_TERM;
        d.DTM_INVOICE_DATE = objDat.XXSHP_KDS_T_RFS_DTL[intRowIndex].DTM_INVOICE_DATE;
        d.DTM_GL_DATE = objDat.XXSHP_KDS_T_RFS_DTL[intRowIndex].DTM_GL_DATE;
        d.DTM_TERM_DATE = objDat.XXSHP_KDS_T_RFS_DTL[intRowIndex].DTM_TERM_DATE;
        d.DTM_DUE_DATE = objDat.XXSHP_KDS_T_RFS_DTL[intRowIndex].DTM_DUE_DATE;
        d.TXT_TAX_COUNTRY = objDat.XXSHP_KDS_T_RFS_DTL[intRowIndex].TXT_TAX_COUNTRY;
        d.TXT_TAX_INVOICE_NO = objDat.XXSHP_KDS_T_RFS_DTL[intRowIndex].TXT_TAX_INVOICE_NO;
        d.DTM_TAX_INVOICE_DATE = objDat.XXSHP_KDS_T_RFS_DTL[intRowIndex].DTM_TAX_INVOICE_DATE;
        d.TXT_SUPPLIERBANK_ACCNAME = objDat.XXSHP_KDS_T_RFS_DTL[intRowIndex].TXT_SUPPLIERBANK_ACCNAME;
        d.TXT_SUPPLIERBANK_ACCNUMBER = objDat.XXSHP_KDS_T_RFS_DTL[intRowIndex].TXT_SUPPLIERBANK_ACCNUMBER;
        d.DTM_FLEX_INVRECEIPT = objDat.XXSHP_KDS_T_RFS_DTL[intRowIndex].DTM_FLEX_INVRECEIPT;
        d.DTM_FLEX_FARECEIPT = objDat.XXSHP_KDS_T_RFS_DTL[intRowIndex].DTM_FLEX_FARECEIPT;
        d.DEC_FLEX_TAX = objDat.XXSHP_KDS_T_RFS_DTL[intRowIndex].DEC_FLEX_TAX;
        d.DEC_FLEX_VAT = objDat.XXSHP_KDS_T_RFS_DTL[intRowIndex].DEC_FLEX_VAT;
        d.DEC_FLEX_TAXRATE = objDat.XXSHP_KDS_T_RFS_DTL[intRowIndex].DEC_FLEX_TAXRATE;
        d.TXT_FLEX_PONUMBER = objDat.XXSHP_KDS_T_RFS_DTL[intRowIndex].TXT_FLEX_PONUMBER;
        d.TXT_FLEX_BBKNUMBER = objDat.XXSHP_KDS_T_RFS_DTL[intRowIndex].TXT_FLEX_BBKNUMBER;
        d.TXT_FLEX_CNNUMBER = objDat.XXSHP_KDS_T_RFS_DTL[intRowIndex].TXT_FLEX_CNNUMBER;

        intRowIndex++;
        this.invalidate(); // invalidate the data DataTables has cached for this row         
    });

    // Draw once all updates are done
    oTableDetail.draw(false);
    p_SetHiddenObject(objDat);
    //p_RefreshDataRow();
}

function p_validatePushSmart() {
    //p_txtDocNo_TextChanged();
    var objDat = p_GetHiddenObject();
    var bitPrintMkpp = objDat.BIT_PRINT_MKPP == "Y";
    var bitPrintRfs = objDat.BIT_PRINT_RFS == "Y";
    var bitPrintRfsOracle = objDat.BIT_PRINT_RFS_ORACLE == "Y";
    var bitAllPrintIsReady = bitPrintMkpp && bitPrintRfs && bitPrintRfsOracle;

    if (bitAllPrintIsReady == false) {
        throw new Error("Harap print semua file (Print MKPP, Print, View Oracle)");
    } else {
        $("#btnPushSmart").prop('disabled', false);
    }
}

function p_pushSmart() {
    clsGlobal.showLoading();
    $.ajax({
        type: "POST",
        url: "/Transaction/RFS/PushSmart",
        data: { data: $("#txtHiddenObject").val(), txtGUID: $("#txtGUID").val(), __RequestVerificationToken: $('#frmRFS input[name=__RequestVerificationToken]').val() },
        datatype: "json",
        success: function (retDat) {
            
            if (retDat.bitSuccess == true) {
                p_DataToUI(retDat.objData);
                clsGlobal.getInformationMessage("Push Smart Berhasil!");
                //window.open(retDat.objData.TXT_PATH_PUSH_SMART, '_blank');
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
    data.append("__RequestVerificationToken", $('#frmRFS input[name=__RequestVerificationToken]').val());

    $.ajax({
        type: "POST",
        url: "/Transaction/RFS/UpdateAttachmentData",
        processData: false,
        contentType: false,
        data: data,
        datatype: "json",
        success: function (retDat) {

            if (retDat.bitSuccess == true) {
                p_DataToUI(retDat.objData);
                clsGlobal.getInformationMessage(retDat.txtMessage);
                attachments = [];
                //p_txtID_TextChanged();
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

function p_ViewAttahcment() {
    clsGlobal.showLoading();
    p_UIToData();
    $.ajax({
        type: "POST",
        url: "/Transaction/RFS/ViewAttachment",
        data: { txtValue: $("#txtRefDocNo").val(), data: $("#txtHiddenObject").val(), txtGUID: $("#txtGUID").val(), __RequestVerificationToken: $('#frmRFS input[name=__RequestVerificationToken]').val() },
        datatype: "json",
        success: function (retDat) {

            if (retDat.bitSuccess == true) {
                window.open(retDat.objData.XXSHP_KDS_T_RFS_HDR_ATT[0].TXT_FILE_DIRECTORY, '_blank');
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
        url: "/Transaction/RFS/RemoveAttachment",
        data: { txtValue: $("#txtRefDocNo").val(), data: $("#txtHiddenObject").val(), txtGUID: $("#txtGUID").val(), __RequestVerificationToken: $('#frmRFS input[name=__RequestVerificationToken]').val() },
        datatype: "json",
        success: function (retDat) {

            if (retDat.bitSuccess == true) {
                p_DataToUI(retDat.objData);
                $("#fileHeader").val("");
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

function p_printBarcodeData() {

    clsGlobal.showLoading();
    p_UIToData();
    $.ajax({
        type: "POST",
        url: "/Transaction/RFS/PrintBarcode",
        data: { data: $("#txtHiddenObject").val(), txtGUID: $("#txtGUID").val(), __RequestVerificationToken: $('#frmRFS input[name=__RequestVerificationToken]').val() },
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
        LOV = clsGlobal.generateLOV(MODULE_RFS, "txtDocNo"); //MODULE_APPROVALHIERARCHY
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
});

//$('#btnLOVRefDocNo').bind('click', function () {
//    try {
//        LOV = clsGlobal.generateLOV(LOV_RFP_KLAIM_REFF, "txtRefDocNo"); //MODULE_APPROVALHIERARCHY
//    } catch (ex) {
//        clsGlobal.showAlert(ex);
//    }
//});

$('#btnLOVAccountName').bind('click', function () {
    try {
        LOV = clsGlobal.generateLOV(MODULE_RFS_DTL, "txtAccountName"); 
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
});

$('#btnLOVAccountNo').bind('click', function () {
    try {
        LOV = clsGlobal.generateLOV(MODULE_RFS_DTL, "txtAccountNo"); 
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
});

$('#btnLOVBankAccount').bind('click', function () {
    try {
        LOV = clsGlobal.generateLOV(MODULE_RFS_DTL, "txtBankAccount");
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

function p_btnLOVAPTerm_Click(objCaller, intIndex) {
    
    p_SetCurrentRowItem(intIndex);
    try {
        LOV = clsGlobal.generateLOV(MODULE_MTBUDGETTYPE, "txtAPTerm");
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
}
//function p_btnLOVActivitySubBrand_Click(objCaller, intIndex) {
//    
//    p_SetCurrentRowItem(objCaller);
//    try {
//        LOV = clsGlobal.generateLOV(MODULE_BRAND_BRANDBUDGET, "txtActivitySubBrand");
//    } catch (ex) {
//        clsGlobal.showAlert(ex);
//    }
//}

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
    try {
        p_AddRow();
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
}); 
$('#btnAddDetailRow').on('click', function () {
    try {
        p_AddRow();
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
}); 

$('#ddlRFType').on('change', function () {
    try {
        p_ddlRFType_TextChanged();
        p_DataToUIDetail([]);
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
});

$('#btnMatchingRFA').on('click', function () {
    try {
        p_btnMatchingRFA_Click();
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
});


$('#btnApprovalHistory').bind('click', function () {
    try {
        var fancyboxdata = p_GetHiddenObject();
        LOV = clsGlobal.generatePopUpIframeSmall($(location).attr('protocol') + "//" + $(location).attr('host') + "/Master/ApprovalHistory/Index?TXT_TYPEDOC=" + "&TXT_REF_DOCNO=" + fancyboxdata.TXT_DOCNO + "&INT_DOCID=" + fancyboxdata.INT_RFS_HDR_ID, "btnApprovalHistory", fancyboxdata);

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


$('#ddlPaidTo').on('change', function () {
    try {
        p_ddlPaidTo_TextChanged();
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

$("#btnPushSmart").on("click", function (e) {
    try {
        debugger
        //p_validatePushSmart();
        clsGlobal.getConfirmation("Push All Attachment To SMART?", function (result) {
            debugger
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


$("#fileHeader").on("change", function (e) {
    try {
        var objData = p_GetHiddenObject();
        var bitAttachmentIsNull = objData == null ? false : clsGlobal.parseToBoolean(objData.XXSHP_KDS_T_RFS_HDR_ATT.some(x => x.BIT_ACTIVE == 'Y') == false);

        var attahcment = $(this)[0].files[0];
        //clsGlobal.getConfirmation("Update Attahcment? (Previous attahcment will be merge with new one if exist)", function (result) {
        if (bitAttachmentIsNull) {
            attachments = [];
            attachments.push(attahcment);
            clsGlobal.showAlert("Success Update Attachment! (Button preview just can be show after save/submit)");
            $('#btnDeleteAttachment').show();
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

                //enhance jika masih create new doc hapus secara ui aja
                if ($("#txtDocNo").val() == "") {
                    $("#fileHeader").val("");
                    attachments = [];
                    $('#btnDeleteAttachment').hide();
                    clsGlobal.getInformationMessage("Delete Attachment Success");
                } else {
                    p_RemoveAttachment();
                    attachments = [];
                }
            }
            else {
                return false;
            }
        });
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
});