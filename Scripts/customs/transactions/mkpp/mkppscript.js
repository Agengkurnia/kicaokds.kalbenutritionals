//=======================
// VARIABLE GLOBAL
//=======================
var clsGlobal = new clsGlobalClass();
var LOV;
var bitLoading = false; 
var oTableActivity;
var oTableBranch;
var data = new FormData();
var attachments = [];


//=======================
// Confirmation
//======================= 

//=======================
// ON PAGE LOAD
//=======================
$(document).ready(function () { 
    inititateCK_Editor();
    p_InitForm();
    p_validatePage();
    //p_showPrevData(); 
    collapsible();
});

//=======================
// FUNCTION
//=======================

function collapsible() {
    var coll = document.getElementsByClassName("collapsible");
    var i;

    for (i = 0; i < coll.length; i++) {
        coll[i].addEventListener("click", function () {
            this.classList.toggle("active");
            var content = this.nextElementSibling;
            if (content.style.display === "block") {
                content.style.display = "none";
            } else {
                content.style.display = "block";
            }
        });
    }
}

function inititateCK_Editor() {
    //editor_to = CKEDITOR.document.getById('editor_to');
    //editor_to = CKEDITOR.document.getById('editor_from');
    //editor_to = CKEDITOR.document.getById('editor_objective');
    //editor_to = CKEDITOR.document.getById('editor_progMech');
    //editor_to = CKEDITOR.document.getById('editor_ConPromMech');
    //editor_to = CKEDITOR.document.getById('editor_TNC');
    //editor_to = CKEDITOR.document.getById('txtClaimMechanism');

    //if (CKEDITOR.env.ie && CKEDITOR.env.version < 9)
    //    CKEDITOR.tools.enableHtml5Elements(document);

    //CKEDITOR.config.height = 150;
    //CKEDITOR.config.width = 'auto';

    //// == JIKA MAU INLINE BAR
    //CKEDITOR.replace('editor_to');
    //CKEDITOR.replace('editor_from');
    //CKEDITOR.replace('editor_objective');
    //CKEDITOR.replace('editor_progMech');
    //CKEDITOR.replace('editor_ConPromMech');
    //CKEDITOR.replace('editor_TNC');
    //CKEDITOR.replace('txtClaimMechanism');

    if (CKEDITOR.env.ie && CKEDITOR.env.version < 9)
        CKEDITOR.tools.enableHtml5Elements(document);

    CKEDITOR.config.height = 150;
    CKEDITOR.config.width = 'auto';

    // List semua editor id
    var editorIds = [
        'txtProgramDesc',
        'txtMekanismeProgram',
        'txtRemark',
    ];

    editorIds.forEach(function (id) {
        var editor = CKEDITOR.replace(id);

        // Saat instance siap, sembunyikan toolbar
        editor.on('instanceReady', function () {
            editor.container.findOne('.cke_top').hide();
        });

        // Saat user klik ke dalam editor → tampilkan toolbar
        editor.on('focus', function () {
            editor.container.findOne('.cke_top').show();
        });

        // Saat user keluar dari editor → sembunyikan toolbar
        editor.on('blur', function () {
            editor.container.findOne('.cke_top').hide();
        });
    });
}

function p_InitForm() {
    p_initiateData();
    //p_showPrevData(); 
    p_InitiateActivity();
    //p_InitiateBranch();
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
        case "txtRefDocNo": $("#txtRefDocNo").val(arr[1]);
            p_txtRefDocNo_TextChanged();
            break;
        case "txtGroupAccount":
            //$("#txtGroupAccount").val(arr[1]);
            p_txtGroupAccount_TextChanged(arr[1]);
            break; 
        case "txtBudgetType":
            //$("#txtBudgetType").val(arr[1]);
            p_txtBudgetType_TextChanged(arr[1]);
            break;
        case "txtActivityCode":
            p_settxtActivityCode(arr[1]);
            break;    
    }
    clsGlobal.closeLOV();
}

    function p_DataToUI(objData) {
        //
        $("#txtDocNo").val(clsGlobal.parseToString(objData.TXT_DOCNO));
        $("#txtDocNoONO").val(clsGlobal.parseToString(objData.TXT_DOCNO_ONO));
        $("#dtmDate").val(clsGlobal.parseToDateTimeFromJSON2(objData.DTM_POSTING, clsDateFormat));
        $("#txtdtPostingDate").val(clsGlobal.parseToDateTimeFromJSON2(objData.DTM_POSTING, clsDateFormat));
        //$("#txtdtPostingDate").val(clsGlobal.parseToDateTimeFromJSON(objData.DTM_POSTING, clsDateFormat));
        //$("#dtmDate").val(clsGlobal.parseToDateTimeFromJSON(objData.CREATION_DATE, clsDateFormat));

        $("#txtRefDocNo").val(clsGlobal.parseToString(objData.TXT_REFDOCNO));
        $("#txtGroupAccount").val(clsGlobal.parseToString(objData.TXT_GROUP_ACCOUNT));

        $("#txtBudgetType").val(clsGlobal.parseToString(objData.TXT_BUDGET_TYPE));
        //$("#txtProgramDesc").val(clsGlobal.parseToString(objData.TXT_PROGRAM_DESC));
        //$("#txtMekanismeProgram").val(clsGlobal.parseToString(objData.TXT_MEKANISME));
        //$("#txtRemark").val(clsGlobal.parseToString(objData.TXT_REMARK));
        CKEDITOR.instances['txtProgramDesc'].setData(clsGlobal.parseToString(objData.TXT_PROGRAM_DESC));
        CKEDITOR.instances['txtMekanismeProgram'].setData(clsGlobal.parseToString(objData.TXT_MEKANISME));
        CKEDITOR.instances['txtRemark'].setData(clsGlobal.parseToString(objData.TXT_REMARK));


        $("#lblStatusFlow").html(clsGlobal.parseToString(objData.TXT_STATUSFLOW));

        p_DataToUIActivity(objData.XXSHP_KDS_T_MKPP_ACT);

        p_EnableControl(clsGlobal.ParseBooleanOracleToNET(objData.BIT_APPLY), objData);
        p_CheckForCancelCloseDocument(objData);

        p_SetHiddenObject(objData);

        if ($("#txtID").val() == "" || $("#txtID").val() == "0") {
            $("#btnDelete").hide();
        } else {
            $("#btnDelete").show();
        }

        if (clsGlobal.parseToInteger(objData.INT_MKPP_HDR_ID) == 0) {
            $("#btnUpdateAttachment").hide();
        } else {
            if (clsGlobal.ParseBooleanOracleToNET(objData.BIT_APPLY) == true) {
                $("#btnUpdateAttachment").hide();
            } else {
                $("#btnUpdateAttachment").show();
            }
        }
    }

function p_CheckForCancelCloseDocument(objData) {
    $("#btnCancel").hide();
    $("#btnClose").hide();
    if (clsGlobal.ParseBooleanOracleToNET(objData.BIT_APPROVED) == true
        && clsGlobal.ParseBooleanOracleToNET(objData.BIT_CLOSED) == false
        && clsGlobal.ParseBooleanOracleToNET(objData.BIT_CANCELLED) == false
        && objData.TXT_REFDOCNO == "") {
        $("#btnClose").show();
        $("#btnCancel").show();
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
    $('.autonumeric').autoNumeric('init', { vMax: '9999999999999', vMin: '-9999999999999', aSep: ',', dGroup: '3', aDec: '.' });
}

function p_GenerateDateTimePicker() {
    //
    var today = new Date();
    $('.datetimepicker').datepicker({
        autoclose: true
    });
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
            url: "/Transaction/MKPP/InitiateData",
            data: { __RequestVerificationToken: $('#frmMKPP input[name=__RequestVerificationToken]').val() },
            datatype: "json",
            success: function (retDat) {

                if (retDat.bitSuccess == true) {
                    if (retDat.objData != undefined) {
                        p_SetHiddenObject(retDat.objData);
                        p_DataToUI(retDat.objData);
                    } else {
                        p_showBlank();
                    }

                    //// show if Parameter exist.
                    //
                    //var p_ID = $.getParameter("ID"); 
                    //if (p_ID != undefined) {
                    //    $("#txtDocNo").val(p_ID);
                    //    p_txtDocNo_TextChanged();
                    //}
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
    jsonData.CREATION_DATE = clsGlobal.parseToJSONDateFromDate($("#dtmDate").val(), clsDateFormat);
    jsonData.TXT_REFDOCNO = clsGlobal.parseToString($("#txtRefDocNo").val());
    jsonData.TXT_BUDGET_TYPE = clsGlobal.parseToString($("#txtBudgetType").val());
    
    jsonData.TXT_GROUP_ACCOUNT = clsGlobal.parseToString($("#txtGroupAccount").val());
    //jsonData.TXT_PROGRAM_DESC = clsGlobal.parseToString($("#txtProgramDesc").val());
    //jsonData.TXT_MEKANISME = clsGlobal.parseToString($("#txtMekanismeProgram").val());
    //jsonData.TXT_REMARK = clsGlobal.parseToString($("#txtRemark").val());

    jsonData.TXT_PROGRAM_DESC = CKEDITOR.instances['txtProgramDesc'].getData();
    jsonData.TXT_MEKANISME = CKEDITOR.instances['txtMekanismeProgram'].getData();
    jsonData.TXT_REMARK = CKEDITOR.instances['txtRemark'].getData();
    //
    jsonData.DTM_POSTING = clsGlobal.parseToJSONDateFromDate($("#txtdtPostingDate").val(), clsDateFormat);
    p_SetHiddenObject(jsonData);
    return $("#txtHiddenObject").val();

}

function p_IsHasAttachment() {

}

function p_EnableControl(bitApply, objDat) {
    if (bitApply == true)
    {
        $("#btnSave").hide();
        $("#btnSubmit").hide();
        $("#btnApprovalHistory").show();
        $("#btnPrintout").show();

        $("#btnHistory").show();

        $("#btnLOVRefDocNo").hide();
        $("#btnLOVGroupAccount").hide();
        $("#btnLOVBudgetType").hide();

        //$("#txtProgramDesc").attr("disabled", "true");
        //$("#txtMekanismeProgram").attr("disabled", "true");
        //$("#txtRemark").attr("disabled", "true");
        if (objDat.INT_MKPP_HDR_ID > 0) {
            CKEDITOR.instances['txtProgramDesc'].setReadOnly(true);
            CKEDITOR.instances['txtMekanismeProgram'].setReadOnly(true);
            CKEDITOR.instances['txtRemark'].setReadOnly(true);
        }

        $("#txtdtPostingDate").attr("disabled", "true");


        $("#btnAddActivity").hide();
        $(".dtActivityPeriodFrom").each(function (index) {
            $(this).attr("disabled", "true");
        });
        $(".dtActivityPeriodTo").each(function (index) {
            $(this).attr("disabled", "true");
        });
        $(".txtTarget").each(function (index) {
            $(this).attr("disabled", "true");
        });
        $(".btnLOVActivityCode").each(function (index) {
            $(this).hide();
        });
        $(".btnActivityDelete").each(function (index) {
            $(this).hide();
        });

    }
    else if (objDat.TXT_REFDOCNO != "")
    {
        // ada Parent.
        $("#btnSave").show();
        $("#btnSubmit").show();
        $("#btnApprovalHistory").hide();
        

        $("#btnLOVRefDocNo").hide();
        $("#btnLOVGroupAccount").hide();
        $("#btnLOVBudgetType").hide();

        //$("#txtProgramDesc").attr("disabled", "true");
        //$("#txtMekanismeProgram").attr("disabled", "true");
        //$("#txtRemark").attr("disabled", "true");
        if (objDat.INT_MKPP_HDR_ID > 0) {
            CKEDITOR.instances['txtProgramDesc'].setReadOnly(true);
            CKEDITOR.instances['txtMekanismeProgram'].setReadOnly(true);
            CKEDITOR.instances['txtRemark'].setReadOnly(true);
        }

        $("#txtdtPostingDate").attr("disabled", "true");
        $("#btnAddActivity").hide();
        $(".dtActivityPeriodFrom").each(function (index) {
            $(this).attr("disabled", "true");
        });
        $(".dtActivityPeriodTo").each(function (index) {
            $(this).attr("disabled", "true");
        });
        $(".txtTarget").each(function (index) {
            $(this).attr("disabled", "true");
        });
        $(".btnLOVActivityCode").each(function (index) {
            $(this).hide();
        });
        $(".btnActivityDelete").each(function (index) {
            $(this).hide();
        });

        $("#btnPrintout").toggle($("#txtDocNo").val() != "");

    }
    else
    {
        $("#btnSave").show();
        $("#btnSubmit").show();
        $("#btnApprovalHistory").hide();

        $("#btnHistory").hide();

        $("#btnDownloadAtt").hide();
        $("#btnRemoveAtt").hide();

        $("#btnLOVRefDocNo").show();
        $("#btnLOVGroupAccount").show();
        $("#btnLOVBudgetType").show();

        //$("#txtProgramDesc").removeAttr("disabled");
        //$("#txtMekanismeProgram").removeAttr("disabled");
        //$("#txtRemark").removeAttr("disabled");
        if (objDat.INT_MKPP_HDR_ID > 0) {
            CKEDITOR.instances['txtProgramDesc'].setReadOnly(true);
            CKEDITOR.instances['txtMekanismeProgram'].setReadOnly(true);
            CKEDITOR.instances['txtRemark'].setReadOnly(true);
        }
        $("#txtdtPostingDate").removeAttr("disabled");

        $("#btnAddActivity").show();
        $(".dtActivityPeriodFrom").each(function (index) {
            $(this).removeAttr("disabled");
        });
        $(".dtActivityPeriodTo").each(function (index) {
            $(this).removeAttr("disabled");
        });
        $(".txtTarget").each(function (index) {
            $(this).removeAttr("disabled");
        });
        $(".btnLOVActivityCode").each(function (index) {
            $(this).show();
        });
        $(".btnActivityDelete").each(function (index) {
            $(this).show();
        });

        //if ($("#txtDocNo").val() == "") {
        //    $("#btnPrintout").hide();
        //} else {
        //    $("#btnPrintout").show();
        //}

        //versi simplify
        $("#btnPrintout").toggle($("#txtDocNo").val() != "");

    }

    $("#btnDownloadAtt").hide();
    $("#btnRemoveAtt").hide();

    if (objDat.XXSHP_KDS_T_MKPP_ATT != null) {
        if (objDat.XXSHP_KDS_T_MKPP_ATT.filter(x => x.BIT_ACTIVE == 'Y').length > 0) {
            $("#btnDownloadAtt").show();
            $("#btnRemoveAtt").show();
        } else {
            $("#btnDownloadAtt").hide();
            $("#btnRemoveAtt").hide();
        }
    } else {
        $("#btnDownloadAtt").hide();
        $("#btnRemoveAtt").hide();
    }

    if (clsGlobal.ParseBooleanOracleToNET(objDat.BIT_APPROVED) == true
        && clsGlobal.ParseBooleanOracleToNET(objDat.BIT_CANCELLED) == false && clsGlobal.ParseBooleanOracleToNET(objDat.BIT_CLOSED) == false) {
        clsGlobal.showLoading();
        $.ajax({
            type: "POST",
            url: "/Transaction/MKPP/CheckMKPPAllowUpdate",
            data: { txtDocNo: $("#txtDocNo").val(), __RequestVerificationToken: $('#frmMKPP input[name=__RequestVerificationToken]').val() },
            datatype: "json",
            success: function (retDat) {
                //debugger
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
    }
    else {
        $("#btnUpdate").hide();
    }
}

function p_EnableControlUpdate(bitAllowUpdate, bitAllowUpdateAttachment) {
    if (bitAllowUpdate == true && bitAllowUpdateAttachment == true) {
        $('#btnUpdate').show();
        $("#btnUpdateAttachment").show();

        //$('#txtProgramDesc').removeAttr('disabled');
        //$('#txtMekanismeProgram').removeAttr('disabled');
        //$('#txtRemark').removeAttr('disabled');
        //if (objDat.INT_MKPP_HDR_ID > 0) {
            CKEDITOR.instances['txtProgramDesc'].setReadOnly(true);
            CKEDITOR.instances['txtMekanismeProgram'].setReadOnly(true);
            CKEDITOR.instances['txtRemark'].setReadOnly(true);
        //}

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

        //$('#txtProgramDesc').removeAttr('disabled');
        //$('#txtMekanismeProgram').removeAttr('disabled');
        //$('#txtRemark').removeAttr('disabled');
        //if (objDat.INT_MKPP_HDR_ID > 0) {
            CKEDITOR.instances['txtProgramDesc'].setReadOnly(true);
            CKEDITOR.instances['txtMekanismeProgram'].setReadOnly(true);
            CKEDITOR.instances['txtRemark'].setReadOnly(true);
        //}

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

        //$('#txtProgramDesc').attr('disabled', true);
        //$('#txtMekanismeProgram').attr('disabled', true);
        //$('#txtRemark').attr('disabled', true);
        //if (objDat.INT_MKPP_HDR_ID > 0) {
            CKEDITOR.instances['txtProgramDesc'].setReadOnly(true);
            CKEDITOR.instances['txtMekanismeProgram'].setReadOnly(true);
            CKEDITOR.instances['txtRemark'].setReadOnly(true);
        //}

        $(".dtActivityPeriodFrom").each(function (index) {
            $(this).attr("disabled", "true");
        });
        $(".dtActivityPeriodTo").each(function (index) {
            $(this).attr("disabled", "true");
        });


    }
}

function p_txtDocNo_TextChanged() {
    clsGlobal.showLoading();
    $.ajax({
        type: "POST",
        url: "/Transaction/MKPP/GetDataByTxtDocNo",
        data: { txtDocNo: $("#txtDocNo").val(), __RequestVerificationToken: $('#frmMKPP input[name=__RequestVerificationToken]').val() },
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
    $.ajax({
        type: "POST",
        url: "/Transaction/MKPP/GetDataParentBytxtRefDocNo",
        data: { txtRefDocNo: $("#txtRefDocNo").val(), __RequestVerificationToken: $('#frmMKPP input[name=__RequestVerificationToken]').val() },
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

function p_txtGroupAccount_TextChanged(txtChooseGroupAccount) {
    var txtGroupAccountExist = $("#txtGroupAccount").val();

    if (txtGroupAccountExist == txtChooseGroupAccount || txtGroupAccountExist == "") {
        $("#txtGroupAccount").val(txtChooseGroupAccount);
    } else {
        clsGlobal.getConfirmation("Perubahan Group Account akan menghapus data detail, Apakah anda setuju?", function (result) {
            if (result) {
                $("#txtGroupAccount").val(txtChooseGroupAccount);
                p_btnActivityDeleteAll();
            } else {
                return false;
            }
        });
    }

}

function p_txtBudgetType_TextChanged(txtChooseBudgetType) {
    var txtBudgetTypeExist = $("#txtBudgetType").val();

    if (txtBudgetTypeExist == txtChooseBudgetType || txtBudgetTypeExist == "") {
        $("#txtBudgetType").val(txtChooseBudgetType);
    } else {
        clsGlobal.getConfirmation("Perubahan Budget Type akan menghapus data detail, Apakah anda setuju?", function (result) {
            if (result) {
                $("#txtBudgetType").val(txtChooseBudgetType);
                p_btnActivityDeleteAll();
            } else {
                return false;
            }
        });
    }

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
    data.append("__RequestVerificationToken", $('#frmMKPP input[name=__RequestVerificationToken]').val());

    $.ajax({
        type: "POST",
        url: "/Transaction/MKPP/SaveData",
        processData: false,
        contentType: false,
        data: data,
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

function p_updateData() {
    clsGlobal.showLoading();

    //Save file, from formData method
    var data = new FormData();
    var files = $("#attacment").get(0).files;
    if (files.length > 0) {
        for (var i = 0; i < files.length; i++) {
            data.append("attacment[]", files[i]);
        }
    }
    data.append("data", $("#txtHiddenObject").val());
    data.append("txtGUID", $("#txtGUID").val());
    data.append("__RequestVerificationToken", $('#frmMKPP input[name=__RequestVerificationToken]').val());

    p_UIToData();
    $.ajax({
        type: "POST",
        url: "/Transaction/MKPP/UpdateData",
        processData: false,
        contentType: false,
        data: data,
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

    //clsGlobal.showLoading();
    //p_UIToData();
    //$.ajax({
    //    type: "POST",
    //    url: "/Transaction/MKPP/UpdateData",
    //    data: { data: $("#txtHiddenObject").val(), txtGUID: $("#txtGUID").val(), __RequestVerificationToken: $('#frmMKPP input[name=__RequestVerificationToken]').val() },
    //    datatype: "json",
    //    success: function (retDat) {
    //        if (retDat.bitSuccess == true) {
    //            p_DataToUI(retDat.objData);
    //            clsGlobal.getInformationMessage(retDat.txtMessage);
    //        } else {
    //            clsGlobal.getAlert(retDat.txtMessage);
    //        }
    //        clsGlobal.hideLoading();
    //        $("#txtGUID").val(retDat.txtGUID);
    //    },
    //    error: function (retDat) {
    //        clsGlobal.hideLoading();
    //    }
    //});
}

function p_history()
{
   

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
    data.append("__RequestVerificationToken", $('#frmMKPP input[name=__RequestVerificationToken]').val());

    $.ajax({
        type: "POST",
        url: "/Transaction/MKPP/SubmitData",
        //data: { data: $("#txtHiddenObject").val(), txtGUID: $("#txtGUID").val(), __RequestVerificationToken: $('#frmMKPP input[name=__RequestVerificationToken]').val() },
        processData: false,
        contentType: false,
        data: data,
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

    //$.ajax({
    //    type: "POST",
    //    url: "/Transaction/MKPP/SubmitData",
    //    data: { data: $("#txtHiddenObject").val(), txtGUID: $("#txtGUID").val(), __RequestVerificationToken: $('#frmMKPP input[name=__RequestVerificationToken]').val() },
    //    datatype: "json",
    //    success: function (retDat) {
    //        
    //        if (retDat.bitSuccess == true) {
    //            p_DataToUI(retDat.objData);
    //            clsGlobal.getInformationMessage(retDat.txtMessage);
    //        } else {
    //            clsGlobal.getAlert(retDat.txtMessage);
    //        }
    //        clsGlobal.hideLoading();
    //        $("#txtGUID").val(retDat.txtGUID);
    //    },
    //    error: function (retDat) {
    //        
    //        clsGlobal.hideLoading();
    //    }
    //});
}

function p_printoutData() {

    clsGlobal.showLoading();
    p_UIToData();
    $.ajax({
        type: "POST",
        url: "/Transaction/MKPP/PrintoutToPDF",
        data: { data: $("#txtHiddenObject").val(), txtGUID: $("#txtGUID").val(), __RequestVerificationToken: $('#frmMKPP input[name=__RequestVerificationToken]').val() },
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

function p_closeDocument() {

    clsGlobal.showLoading();
    p_UIToData();
    $.ajax({
        type: "POST",
        url: "/Transaction/MKPP/CloseDocument",
        data: { data: $("#txtHiddenObject").val(), txtGUID: $("#txtGUID").val(), __RequestVerificationToken: $('#frmMKPP input[name=__RequestVerificationToken]').val() },
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
        url: "/Transaction/MKPP/CancelDocument",
        data: { data: $("#txtHiddenObject").val(), txtGUID: $("#txtGUID").val(), __RequestVerificationToken: $('#frmMKPP input[name=__RequestVerificationToken]').val() },
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

function p_fllAttachment_Changed(objCaller, intIndex) {
    //butuh validasi penjagaan type attachment, harus PDF

    if (objCaller.files[0].type != "application/pdf") {
        clsGlobal.showAlert("File attachment harus berupa PDF !");

        var fileInput = document.getElementById('fileDetail' + intIndex);
        var files = fileInput.files;
        var file = files[0];
        fileInput.value = "";
    } else {
        var objData = JSON.parse(p_UIToData());
        for (i = 0; i < objData.XXSHP_KDS_T_MKPP_ACT.length; i++) {
            // Cari Index-nya.
            if (objData.XXSHP_KDS_T_MKPP_ACT[i].intIndex == intIndex) {
                // Ketemu, mulai dari sini:
                // Validasi tidak lebih dari Budget Besar tersedia

                var fllAttahcment = objCaller;

                if (fllAttahcment.files != null) {
                    for (var j = 0; j < fllAttahcment.files.length; j++) {
                        var dat = {};
                        dat.intIndex = j;
                        dat.INT_MKPP_ACT_ATT_ID = null;
                        dat.INT_MKPP_ACT_ID = null;
                        dat.TXT_FILE_NAME = fllAttahcment.files[j].name;
                        dat.TXT_FILE_DIRECTORY = stringempty;
                        dat.BIT_ACTIVE = clsGlobal.ParseBooleanNETToOracle(true);
                        dat.CREATED_BY = stringempty;
                        dat.CREATION_DATE = stringempty;
                        dat.LAST_UPDATED_BY = stringempty;
                        dat.LAST_UPDATE_DATE = stringempty;
                        dat.LAST_UPDATE_LOGIN = stringempty;
                        dat.TXT_GUID = stringempty;
                        objData.XXSHP_KDS_T_MKPP_ACT[i].XXSHP_KDS_T_MKPP_ACT_ATT.push(dat);

                        // Kalau attachment local sama dengan attachment yang baru masuk, otomatis tidak di tambahkan di list attahcment
                        if (attachments.filter(x => x.name == fllAttahcment.files[j].name).length == 0) {
                            attachments.push(fllAttahcment.files[j]);
                        }
                    }
                }

                break;
            }
        }
        p_SetHiddenObject(objData);
        p_DataToUIActivity(objData.XXSHP_KDS_T_MKPP_ACT);
        oTableActivity.page('last').draw(false);
    }
}

function p_DownloadAttahcment(INT_MKPP_ACT_ID) {
    $.ajax({
        type: "POST",
        url: "/Transaction/MKPP/DownloadAttachment",
        data: {
            INT_MKPP_ACT_ID: INT_MKPP_ACT_ID,
            __RequestVerificationToken: $('#frmMKPP input[name=__RequestVerificationToken]').val()
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

function p_RemoveAttahcment(INT_MKPP_ACT_ID) {
    $.ajax({
        type: "POST",
        url: "/Transaction/MKPP/RemoveAttachment",
        data: {
            INT_MKPP_ACT_ID: INT_MKPP_ACT_ID,
            __RequestVerificationToken: $('#frmMKPP input[name=__RequestVerificationToken]').val()
        },
        datatype: "json",
        success: function (retDat) {
            debugger
            if (retDat.bitSuccess) {
                var intIndex = 0;
                var objData = JSON.parse(p_UIToData());
                for (i = 0; i < objData.XXSHP_KDS_T_MKPP_ACT.length; i++) {
                    if (objData.XXSHP_KDS_T_MKPP_ACT[i].INT_MKPP_ACT_ID == INT_MKPP_ACT_ID) {
                        for (var j = 0; j < objData.XXSHP_KDS_T_MKPP_ACT[i].XXSHP_KDS_T_MKPP_ACT_ATT.length; j++) {
                            objData.XXSHP_KDS_T_MKPP_ACT[i].XXSHP_KDS_T_MKPP_ACT_ATT[j].BIT_ACTIVE = clsGlobal.ParseBooleanNETToOracle(false);
                            intIndex = objData.XXSHP_KDS_T_MKPP_ACT[i].intIndex;
                        }
                    }
                }
                p_SetHiddenObject(objData);
                p_RefreshNumberActivity();
                clsGlobal.showAlert(retDat.txtMessage);

                $('[onclick="p_btnViewAttachment_Click(this,' + intIndex + ')"]').hide();
                $('[onclick="p_btnRemoveAttachment_Click(this,' + intIndex + ')"]').hide();
            } else {
                clsGlobal.setMessageWarning(retDat.txtMessage);
            }
        },
        error: function (retDat) {
            clsGlobal.hideLoading();
        }
    });
}

function p_btnViewAttachment_Click(objCaller, intIndex) {
    var fancyboxdata = p_GetHiddenObject();
    var INT_MKPP_ACT_ID = fancyboxdata.XXSHP_KDS_T_MKPP_ACT.find(x => x.intIndex == intIndex).INT_MKPP_ACT_ID;

    if (clsGlobal.parseToInteger(INT_MKPP_ACT_ID) != 0) {
        p_DownloadAttahcment(INT_MKPP_ACT_ID);
    }

    //Download Local-nya
    for (var i = 0; i < fancyboxdata.XXSHP_KDS_T_MKPP_ACT.find(x => x.intIndex == intIndex).XXSHP_KDS_T_MKPP_ACT_ATT.filter(x => clsGlobal.parseToInteger(x.INT_MKPP_ACT_ATT_ID) == 0).length; i++) {
        var dat = fancyboxdata.XXSHP_KDS_T_MKPP_ACT.find(x => x.intIndex == intIndex).XXSHP_KDS_T_MKPP_ACT_ATT[i];
        p_DownloadAttahcmentLocal_V2(dat.TXT_FILE_NAME);
    }
}

function p_btnRemoveAttachment_Click(objCaller, intIndex) {
    var fancyboxdata = p_GetHiddenObject();
    var INT_MKPP_ACT_ID = fancyboxdata.XXSHP_KDS_T_MKPP_ACT.find(x => x.intIndex == intIndex).INT_MKPP_ACT_ID;

    // Kalau attacment itu di attach di Activity local, maka tinggal cleansing aja isinya
    if (clsGlobal.parseToInteger(INT_MKPP_ACT_ID) != 0) {
        p_RemoveAttahcment(INT_MKPP_ACT_ID);
    } else {
        fancyboxdata.XXSHP_KDS_T_MKPP_ACT.find(x => x.intIndex == intIndex).XXSHP_KDS_T_MKPP_ACT_ATT = [];
    }
    p_SetHiddenObject(fancyboxdata);
    p_DataToUIActivity(fancyboxdata.XXSHP_KDS_T_MKPP_ACT);
    oTableActivity.page('last').draw(false);
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
    data.append("__RequestVerificationToken", $('#frmMKPP input[name=__RequestVerificationToken]').val());

    $.ajax({
        type: "POST",
        url: "/Transaction/MKPP/UpdateAttachmentData",
        processData: false,
        contentType: false,
        data: data,
        datatype: "json",
        success: function (retDat) {

            if (retDat.bitSuccess == true) {
                p_DataToUI(retDat.objData);
                clsGlobal.getInformationMessage(retDat.txtMessage);
                attachments = [];
                p_txtDocNo_TextChanged();
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

function p_DataToUIActivity(XXSHP_KDS_T_MKPP_ACT) {
    
    oTableActivity.clear();
    for (var i = 0; i < XXSHP_KDS_T_MKPP_ACT.length; i++) {
        XXSHP_KDS_T_MKPP_ACT[i].intIndex = i;
        oTableActivity.row.add(XXSHP_KDS_T_MKPP_ACT[i]);
    }
    oTableActivity.draw(false);

    var objDat = p_GetHiddenObject();
    objDat.XXSHP_KDS_T_MKPP_ACT = XXSHP_KDS_T_MKPP_ACT;
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
    if (objData.TXT_GROUP_ACCOUNT == '') {
        throw "Kolom Group Account harus di isi!";
    } 

    clsGlobal.showLoading(); 
    $.ajax({
        type: "POST",
        url: "/Transaction/MKPP/AddRowActivity",
        data: { data: $("#txtHiddenObject").val(), __RequestVerificationToken: $('#frmMKPP input[name=__RequestVerificationToken]').val() },
        datatype: "json",
        success: function (retDat) {

            if (retDat.bitSuccess == true) {
                if (retDat.objData != undefined) {
                    p_SetHiddenObject(retDat.objData);
                    p_DataToUIActivity(retDat.objData.XXSHP_KDS_T_MKPP_ACT);
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
                        '       <div class="input-group-btn"  > ' +
                        '           <button type="button" class="btn btn-danger btnLOVActivityCode" id="btnLOVActivityCode" onclick="p_btnLOVActivityCode_Click(this,' + full.intIndex + ')"> <i class="fa fa-search"></i></button> ' +
                        '       </div> ' +
                        '       <div class="input-group-btn" style="width:100%;"> ' +
                        '       <input type="text" class="form-control txtActivityCode" id="txtActivityCode" onchange="p_txtActivityCode_Changed(this,' + full.intIndex + ')"  value="' + full.TXT_ACTIVITYCODE + '" disabled> ' +
                        '       </div> ' +
                        '   </div>';
                }
            },
            {
                aTargets: [2],
                mRender: function (data, type, full) {
                    return '<div >  <input type="text" class="form-control dtActivityPeriodFrom datetimepicker"  style="width:100px;"  id="dtActivityPeriodFrom' + full.intIndex + '" onchange="p_dtActivityPeriodFrom_Changed(this,' + full.intIndex + ')"  value="' + clsGlobal.parseToDateTimeFromJSON(full.DTM_PERIOD_FROM, clsDateFormat) + '" >  </div>';
                }
            },
            {
                aTargets: [3],
                mRender: function (data, type, full) {
                    return '<div >  <input type="text" class="form-control dtActivityPeriodTo datetimepicker" style="width:100px;" id="dtActivityPeriodTo' + full.intIndex + '" onchange="p_dtActivityPeriodTo_Changed(this,' + full.intIndex + ')"  value="' + clsGlobal.parseToDateTimeFromJSON(full.DTM_PERIOD_TO, clsDateFormat) + '" >  </div>';
                }
            },
            {
                aTargets: [4],
                mRender: function (data, type, full) {
                    return '<div > <input type="button" class="btn btn-info btnActivityBudget" id="btnActivityBudget" onclick="p_btnActivityBudget_Click(this,' + full.intIndex + ')"  value="Budget" >  </div>';
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
                    return '<input type="text" class="form-control txtTarget autonumeric text-right" id="txtTarget" onchange="p_txtTarget_Changed(this,' + full.intIndex + ')" value="' + full.DEC_TARGET + '"> ';
                }
            },
            {
                aTargets: [7],
                mRender: function (data, type, full) {
                    return '<div > <input type="button" class="btn btn-info btnActivitySupplier" id="btnActivitySupplier" onclick="p_btnActivitySupplier_Click(this,' + full.intIndex + ')"  value="Supplier" >  </div>';
                }
            },
            {
                aTargets: [8],
                mRender: function (data, type, full) {
                    //debugger
                    if (full.XXSHP_KDS_T_MKPP_ACT_ATT != null) {
                        if (full.XXSHP_KDS_T_MKPP_ACT_ATT.filter(x => x.BIT_ACTIVE == clsGlobal.ParseBooleanNETToOracle(true)).length > 0) {
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
                aTargets: [9],
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
    
    LOV = clsGlobal.generateLOV(MODULE_ACTIVITY_BY_GROUP_ACCOUNT, "txtActivityCode", clsGlobal.parseToString($("#txtGroupAccount").val()));
}

function p_settxtActivityCode(txtValue) {
    
    var intSelectedIndex = p_GetSelectedActivityRow();
    var intRowIndex = 0;
    var objDat = p_GetHiddenObject();
    oTableActivity.rows().every(function (rowIdx, tableLoop, rowLoop) {
        
        var d = this.data();
        if (intRowIndex == intSelectedIndex) {
            d.intIndex = intRowIndex; // update data source for the row 
              
            d.TXT_ACTIVITYCODE = txtValue;
            objDat.XXSHP_KDS_T_MKPP_ACT[intRowIndex].TXT_ACTIVITYCODE = txtValue;

            d.TXT_ACTIVITYNAME = objDat.XXSHP_KDS_T_MKPP_ACT[intRowIndex].TXT_ACTIVITYNAME 
            d.DTM_PERIOD_FROM = objDat.XXSHP_KDS_T_MKPP_ACT[intRowIndex].DTM_PERIOD_FROM
            d.DTM_PERIOD_TO = objDat.XXSHP_KDS_T_MKPP_ACT[intRowIndex].DTM_PERIOD_TO
            d.DEC_AMOUNT = objDat.XXSHP_KDS_T_MKPP_ACT[intRowIndex].DEC_AMOUNT
             
            this.invalidate(); // invalidate the data DataTables has cached for this row         
            p_EnableControl(clsGlobal.ParseBooleanOracleToNET(objDat.BIT_APPLY), objDat);
        }

        intRowIndex++;
    });

    p_SetHiddenObject(objDat);
}
   
function p_dtActivityPeriodFrom_Changed(objCaller, intIndex) {
    
    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());
    for (i = 0; i < objData.XXSHP_KDS_T_MKPP_ACT.length; i++) {
        // Cari Index-nya.
        if (objData.XXSHP_KDS_T_MKPP_ACT[i].intIndex == intIndex) {
            // Ketemu, mulai dari sini:
            
            if (clsGlobal.parseToString(objCaller.value) != "") {
                objData.XXSHP_KDS_T_MKPP_ACT[i].DTM_PERIOD_FROM = clsGlobal.parseToJSONDateFromDate(objCaller.value, clsDateFormat);
            } else {
                objCaller.value = clsGlobal.parseToDateTimeFromJSON(objData.XXSHP_KDS_T_MKPP_ACT[i].DTM_PERIOD_FROM, clsDateFormat)
            }
            break;
        }
    }
    p_SetHiddenObject(objData);
}

function p_dtActivityPeriodTo_Changed(objCaller, intIndex) {
    
    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());
    for (i = 0; i < objData.XXSHP_KDS_T_MKPP_ACT.length; i++) {
        // Cari Index-nya.
        if (objData.XXSHP_KDS_T_MKPP_ACT[i].intIndex == intIndex) {
            // Ketemu, mulai dari sini:

            if (clsGlobal.parseToString(objCaller.value) != "") {
                objData.XXSHP_KDS_T_MKPP_ACT[i].DTM_PERIOD_TO = clsGlobal.parseToJSONDateFromDate(objCaller.value, clsDateFormat);
            } else {
                objCaller.value = clsGlobal.parseToDateTimeFromJSON(objData.XXSHP_KDS_T_MKPP_ACT[i].DTM_PERIOD_TO, clsDateFormat)
            }
            
            break;
        }
    }
    p_SetHiddenObject(objData);
}

function p_txtTarget_Changed(objCaller, intIndex) {
    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());

    for (i = 0; i < objData.XXSHP_KDS_T_MKPP_ACT.length; i++) {
        // Cari Index-nya.
        if (objData.XXSHP_KDS_T_MKPP_ACT[i].intIndex == intIndex) {
            // Ketemu, mulai dari sini:
            objData.XXSHP_KDS_T_MKPP_ACT[i].DEC_TARGET = clsGlobal.parseToDecimal(objCaller.value);
        }
    }

    p_SetHiddenObject(objData);
}
 
function p_btnActivityBudget_Click(objCaller, intIndex) {
    
    try {
        // Parse dari HiddenObject->JSON
        var objData = JSON.parse(p_UIToData());
        for (i = 0; i < objData.XXSHP_KDS_T_MKPP_ACT.length; i++) {
            // Cari Index-nya.
            if (objData.XXSHP_KDS_T_MKPP_ACT[i].intIndex == intIndex) {
                // Ketemu, mulai dari sini:

                // Validasi
                if (objData.XXSHP_KDS_T_MKPP_ACT[i].TXT_ACTIVITYCODE == "") {                    
                    throw "Activity must be filled!";
                } 
                 
                var fancyboxdata = p_GetHiddenObject();
                LOV = clsGlobal.generatePopUpIframe($(location).attr('protocol') + "//" + $(location).attr('host') + "/Transaction/MKPP/Budget?intIndex=" + intIndex, "btnActivityBudget", fancyboxdata);
                break;
            }
        }
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
}

function p_setBudget() {
    
    var intSelectedIndex = p_GetSelectedActivityRow();
    var intRowIndex = 0;
    var objDat = p_GetHiddenObject();
    // Calculate Total Alokasi.
    objDat.XXSHP_KDS_T_MKPP_ACT[intSelectedIndex].DEC_AMOUNT = 0;
    for (i = 0; i < objDat.XXSHP_KDS_T_MKPP_ACT[intSelectedIndex].XXSHP_KDS_T_MKPP_BGT.length; i++) {        
        objDat.XXSHP_KDS_T_MKPP_ACT[intSelectedIndex].DEC_AMOUNT += objDat.XXSHP_KDS_T_MKPP_ACT[intSelectedIndex].XXSHP_KDS_T_MKPP_BGT[i].DEC_ALOKASI;
    }

    // Show ke table.
    oTableActivity.rows().every(function (rowIdx, tableLoop, rowLoop) {
        
        var d = this.data();
        if (intRowIndex == intSelectedIndex) {
            d.intIndex = intRowIndex; // update data source for the row 
             
            d.TXT_ACTIVITYCODE = objDat.XXSHP_KDS_T_MKPP_ACT[intSelectedIndex].TXT_ACTIVITYCODE;
            d.TXT_ACTIVITYNAME = objDat.XXSHP_KDS_T_MKPP_ACT[intSelectedIndex].TXT_ACTIVITYNAME; 
            d.DEC_AMOUNT = objDat.XXSHP_KDS_T_MKPP_ACT[intSelectedIndex].DEC_AMOUNT;
            d.DTM_PERIOD_FROM = objDat.XXSHP_KDS_T_MKPP_ACT[intSelectedIndex].DTM_PERIOD_FROM;
            d.DTM_PERIOD_TO = objDat.XXSHP_KDS_T_MKPP_ACT[intSelectedIndex].DTM_PERIOD_TO;

            this.invalidate(); // invalidate the data DataTables has cached for this row         
            p_EnableControl(clsGlobal.ParseBooleanOracleToNET(objDat.BIT_APPLY), objDat);
        }

        intRowIndex++;
    });

    p_SetHiddenObject(objDat);
}

function p_btnActivitySupplier_Click(objCaller, intIndex) {
    
    try {
        // Parse dari HiddenObject->JSON
        var objData = JSON.parse(p_UIToData());
        for (i = 0; i < objData.XXSHP_KDS_T_MKPP_ACT.length; i++) {
            // Cari Index-nya.
            if (objData.XXSHP_KDS_T_MKPP_ACT[i].intIndex == intIndex) {
                // Ketemu, mulai dari sini:

                // Validasi
                if (objData.XXSHP_KDS_T_MKPP_ACT[i].TXT_ACTIVITYCODE == "") {
                    throw "Activity must be filled!";
                }

                var fancyboxdata = p_GetHiddenObject();
                LOV = clsGlobal.generatePopUpIframe($(location).attr('protocol') + "//" + $(location).attr('host') + "/Transaction/MKPP/Supplier?intIndex=" + intIndex, "btnActivitySupplier", fancyboxdata);
                break;
            }
        }
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
}

function p_btnActivityDelete_Click(objCaller, intIndex) {
    
    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());
    for (i = 0; i < objData.XXSHP_KDS_T_MKPP_ACT.length; i++) {
        // Cari Index-nya.
        if (objData.XXSHP_KDS_T_MKPP_ACT[i].intIndex == intIndex) {
            // Ketemu, mulai dari sini:
            // Remove from list.
            objData.XXSHP_KDS_T_MKPP_ACT.splice(i, 1);

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

function p_btnActivityDeleteAll() {
    // Parse dari HiddenObject->JSON
    //
    var objData = JSON.parse(p_UIToData());
    var totalRowOriginal = objData.XXSHP_KDS_T_MKPP_ACT.length;
    for (i = 0; i < totalRowOriginal; i++) {
        // Cari Index-nya.
        objData.XXSHP_KDS_T_MKPP_ACT.splice(0, 1);
        oTableActivity.row(0).remove().draw(false);
        //break;
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
        objDat.XXSHP_KDS_T_MKPP_ACT[intRowIndex].intIndex = d.intIndex;

        d.TXT_ACTIVITYCODE = objDat.XXSHP_KDS_T_MKPP_ACT[intRowIndex].TXT_ACTIVITYCODE;
        d.TXT_ACTIVITYNAME = objDat.XXSHP_KDS_T_MKPP_ACT[intRowIndex].TXT_ACTIVITYNAME;
        d.DTM_PERIOD_FROM = objDat.XXSHP_KDS_T_MKPP_ACT[intRowIndex].DTM_PERIOD_FROM;
        d.DTM_PERIOD_TO = objDat.XXSHP_KDS_T_MKPP_ACT[intRowIndex].DTM_PERIOD_TO;
        d.DEC_AMOUNT = objDat.XXSHP_KDS_T_MKPP_ACT[intRowIndex].DEC_AMOUNT;
         
        intRowIndex++;
        this.invalidate(); // invalidate the data DataTables has cached for this row         
    });

    // Draw once all updates are done
    oTableActivity.draw(false);
    p_SetHiddenObject(objDat);
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
    debugger
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

$('#btnUpdate').bind('click', function () {
    try {
        clsGlobal.getConfirmation("Update this data?", function (result) {
            if (result == true) {
                p_updateData();
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
        //p_showBlank();
        window.location.reload();
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

$('#btnHistory').bind('click', function () {

        try {
            LOV = clsGlobal.generateLOV(MODULE_MKPP_REF, "txtRefDocNo"); //MODULE_APPROVALHIERARCHY
        } catch (ex) {
            clsGlobal.showAlert(ex);
        }
     
  
});

$('#btnFind').bind('click', function () {
    try {
        LOV = clsGlobal.generateLOV(MODULE_MKPP, "txtDocNo"); //MODULE_APPROVALHIERARCHY
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
});

$('#btnLOVRefDocNo').bind('click', function () {
    try {
        //LOV = clsGlobal.generateLOV(MODULE_MKPP_PARENT, "txtRefDocNo"); //MODULE_APPROVALHIERARCHY
        LOV = clsGlobal.generateLOV(MODULE_MKPP_PARENT_BY_USER, "txtRefDocNo"); //MODULE_APPROVALHIERARCHY
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
 
$('#btnLOVBudgetType').bind('click', function () {
    try {
        LOV = clsGlobal.generateLOV(MODULE_MTBUDGETTYPE, "txtBudgetType", "MKPP");
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
        LOV = clsGlobal.generatePopUpIframeSmall($(location).attr('protocol') + "//" + $(location).attr('host') + "/Master/ApprovalHistory/Index?TXT_TYPEDOC=" + "&TXT_REF_DOCNO=" + fancyboxdata.TXT_DOCNO + "&INT_DOCID=" + fancyboxdata.INT_MKPP_HDR_ID, "btnApprovalHistory", fancyboxdata);

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
        clsGlobal.getConfirmation("Close and reverse budget for this document?", function (result) {
            if (result == true) {
                p_closeDocument();
            }
            else {
                return false;
            }
        });
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
});



$("#btnCancel").on("click", function (e) {
    try {
        clsGlobal.getConfirmation("Cancel and reverse budget for this document?", function (result) {
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

//$("#btnDownloadAtt").on("click", function (e) {
//    var INT_MKPP_HDR_ID = p_GetHiddenObject().INT_MKPP_HDR_ID;
//    $.ajax({
//        type: "POST",
//        url: "/Transaction/MKPP/DownloadAttachment",
//        data: {
//            INT_MKPP_HDR_ID: INT_MKPP_HDR_ID,
//            __RequestVerificationToken: $('#frmMKPP input[name=__RequestVerificationToken]').val()
//        },
//        datatype: "json",
//        success: function (retDat) {
//            var dat = retDat.objData;
//            for (var i = 0; i < dat.length; i++) {
//                window.open(dat[i].TXT_FILE_DIRECTORY, '_blank');
//            }
//        },
//        error: function (retDat) {
//            
//            clsGlobal.hideLoading();
//        }
//    });
//});

//$("#btnRemoveAtt").on("click", function (e) {
//    var INT_MKPP_HDR_ID = p_GetHiddenObject().INT_MKPP_HDR_ID;
//    $.ajax({
//        type: "POST",
//        url: "/Transaction/MKPP/RemoveAttachment",
//        data: {
//            INT_MKPP_HDR_ID: INT_MKPP_HDR_ID,
//            __RequestVerificationToken: $('#frmMKPP input[name=__RequestVerificationToken]').val()
//        },
//        datatype: "json",
//        success: function (retDat) {
//            clsGlobal.getInformationMessage(retDat.txtMessage);
//            p_txtDocNo_TextChanged();
//        },
//        error: function (retDat) {
//            
//            clsGlobal.hideLoading();
//        }
//    });
//});



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