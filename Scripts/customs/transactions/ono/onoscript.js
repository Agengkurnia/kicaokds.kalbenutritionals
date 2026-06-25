//=======================
// VARIABLE GLOBAL
//=======================
var clsGlobal = new clsGlobalClass();
var LOV;
var bitLoading = false;
var oTableActivity;
var oTableBranch;
var bitReject = false;
var data = new FormData();
var attachments = [];
//var ltAttachment = [];
var idDummy = 0;

var editor_to;
var editor_from;
var editor_objective;
var editor_progMech;
//var editor_ConPromMech;
var editor_TNC;

var dataModel = {
    Memo_Attachment: [],
    Memo_ActivityPlan: [],
    Memo_AccountType: [],
    memoDt: {}
};

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
    collapsible();
    //p_showPrevData(); 
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

    //buat ngehapus isi file upload di input type file
    $("#fllExcel").val("");
}

function setChooseLOV(txtValue) {
    try {
        var arr = txtValue.split('|');
        switch (arr[0]) {
            case "txtDocNo": $("#txtDocNo").val(arr[4]);
                p_txtDocNo_TextChanged();
                break;
            //case "txtRefDocNo": $("#txtRefDocNo").val(arr[1]);
            //    p_txtRefDocNo_TextChanged();
            //    break;
            case "txtGroupAccount":
                $("#txtGroupAccount").val(arr[1]);
                break;
            case "txtBudgetType":
                $("#txtBudgetType").val(arr[1]);
                break;
            case "txtActivityCode":
                p_settxtActivityCode(arr[1]);
            case "txtAccountType":
                debugger
                p_settxtAccountType(arr[1], arr[2], arr[3]);
                break;
            case "btnLOVRefDocNo":
                $("#txtRefDocNo").val(arr[1]);
                p_txtRefDocNo_TextChanged();
                break;
        }
    } catch (e) {
        clsGlobal.getAlert(e);
    }
    clsGlobal.closeLOV();
}

function p_DataToUI(objData) {
    $("#txtGroupAccount").val(clsGlobal.parseToString(objData.TXT_GROUP_ACCOUNT));
    $("#txtBudgetType").val(clsGlobal.parseToString(objData.TXT_BUDGET_TYPE));
    $("#txtJudulMemo").val(clsGlobal.parseToString(objData.TXT_TITLE)); // program?
    $("#txtSubjectMemo").val(clsGlobal.parseToString(objData.TXT_SUBJECT) || clsGlobal.parseToString(objData.TXT_TITLE));
    CKEDITOR.instances['editor_to'].setData(clsGlobal.parseToString(objData.TXT_TO));
    CKEDITOR.instances['editor_from'].setData(clsGlobal.parseToString(objData.TXT_FROM));
    CKEDITOR.instances['editor_openingRemark'].setData(clsGlobal.parseToString(objData.TXT_OPENING_REMARK));
    CKEDITOR.instances['editor_objective'].setData(clsGlobal.parseToString(objData.TXT_OBJECTIVE));
    CKEDITOR.instances['editor_progMech'].setData(clsGlobal.parseToString(objData.TXT_PROGRAM_MECHANISM));
    //CKEDITOR.instances['editor_ConPromMech'].setData(clsGlobal.parseToString(objData.TXT_PROMO_MECHANISM));
    CKEDITOR.instances['editor_TNC'].setData(clsGlobal.parseToString(objData.TXT_TNC));
    CKEDITOR.instances['txtClaimMechanism'].setData(clsGlobal.parseToString(objData.TXT_CLAIM_MECHANISM));

    $("#intOnoId").val(clsGlobal.parseToString(objData.INT_ONO_HDR_ID));
    $("#txtAmountOno").val(clsGlobal.parseToRupiah(objData.DEC_AMOUNT));
    if (objData.BIT_ADDENDUM == "Y") {
        $("#txtOnoType").val("ADDENDUM");
    } else {
        $("#txtOnoType").val("STANDARD");
    }
    $("#txtDocNo").val(clsGlobal.parseToString(objData.TXT_DOCNO));
    $("#txtRefDocNo").val(clsGlobal.parseToString(objData.TXT_REFDOCNO));
    $("#txtDocNoMKPP").val(clsGlobal.parseToString(objData.TXT_DOCNO_MKPP));
    $("#dtmDate").val(clsGlobal.parseToDateTimeFromJSON2(objData.CREATION_DATE, clsDateFormat)); // custom datetime formatter (cause the old one causes D+1 parsing bug)
    $("#lblStatusFlow").val(clsGlobal.parseToString(objData.TXT_STATUSFLOW));
    if (objData.BIT_ADDENDUM == "Y") {
        //$("#txtAmountOno").val(clsGlobal.parseToRupiah(objData.DEC_AMOUNT));
        //$("#txtSumOnoAdm").val(clsGlobal.parseToRupiah(0));
        //$("#txtSumOnoOri").val(clsGlobal.parseToRupiah(objData.DEC_AMOUNT));

        $("#txtSumOnoAdm").val(clsGlobal.parseToRupiah(objData.DEC_AMOUNT_ADDENDUM));
        $("#txtSumOnoOri").val(clsGlobal.parseToRupiah(objData.DEC_AMOUNT_ORIGINAL));
    } else {
        //$("#txtSumOnoAdm").val(clsGlobal.parseToRupiah(objData.DEC_AMOUNT_TOTAL-objData.DEC_AMOUNT));
        //$("#txtSumOnoOri").val(clsGlobal.parseToRupiah(objData.DEC_AMOUNT));

        $("#txtSumOnoAdm").val(clsGlobal.parseToRupiah(objData.DEC_AMOUNT_ADDENDUM));
        $("#txtSumOnoOri").val(clsGlobal.parseToRupiah(objData.DEC_AMOUNT_ORIGINAL));
    }
    $("#txtSumOnoCnt").val(clsGlobal.parseToRupiah(objData.INT_ADDENDUM));



    p_EnableControl(clsGlobal.ParseBooleanOracleToNET(objData.BIT_APPLY), objData);
    p_CheckForCancelCloseDocument(objData);

    p_SetHiddenObject(objData);

    p_DataToUIActivity(objData.XXSHP_KDS_T_ONO_ACT);
    p_DataToUIAccountType(objData.XXSHP_KDS_T_ONO_ACY);
    p_DataToUIAttachment(objData.XXSHP_KDS_T_ONO_ATT);

    if ($("#txtID").val() == "" || $("#txtID").val() == "0") {
        $("#btnDelete").hide();
    } else {
        $("#btnDelete").show();
    }

    if ($("#txtDocNo").val().split('/').length == 4) {
        var datONOHeader = p_GetHiddenObject();
        if (datONOHeader.TXT_DOCNO != "") {
            p_IsDocumentDecided(datONOHeader.TXT_DOCNO, datONOHeader.XXSHP_KDS_T_ONO_ACT[0].XXSHP_KDS_T_ONO_BGT[0].XXSHP_KDS_T_ONO_SUB[0].INT_ONO_SUB_ID);
        }
    }

    if (clsGlobal.parseToInteger(objData.INT_ONO_HDR_ID) == 0) {
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
        && clsGlobal.ParseBooleanOracleToNET(objData.BIT_PUSH) == false
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

    $('.autonumeric').autoNumeric('init', { vMax: '9999999999999', vMin: '-9999999999999', aSep: ',', dGroup: '3', aDec: '.' });
}

function p_GenerateDateTimePicker() {

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
        url: "/Transaction/ONO/InitiateData",
        data: { __RequestVerificationToken: $('#frmONO input[name=__RequestVerificationToken]').val() },
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
        'editor_to',
        'editor_from',
        'editor_objective',
        'editor_openingRemark',
        'editor_progMech',
        //'editor_ConPromMech',
        'editor_TNC',
        'txtClaimMechanism'
    ];

    editorIds.forEach(function (id) {
        var editor = CKEDITOR.replace(id, {
            removePlugins: 'image,imagetools,uploadimage',
            removeButtons: 'Image',
            disallowedContent: 'img'
        });

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

function addIterationIdDummy() {
    idDummy = idDummy - 1;
}

function p_getParameterID() {
    var id = $.getParameter("ID");
    if (id != undefined) {
        $("#txtDocNo").val(id);
        p_txtDocNo_TextChanged();
    }
}

function p_UIToData() {
    objDat = p_GetHiddenObject();

    // Strings
    objDat.TXT_BUDGET_TYPE = clsGlobal.parseToString($("#txtBudgetType").val());
    objDat.TXT_GROUP_ACCOUNT = clsGlobal.parseToString($("#txtGroupAccount").val());
    objDat.TXT_TITLE = clsGlobal.parseToString($("#txtJudulMemo").val());
    objDat.TXT_SUBJECT = clsGlobal.parseToString($("#txtSubjectMemo").val());
    objDat.TXT_TO = CKEDITOR.instances['editor_to'].getData();
    objDat.TXT_FROM = CKEDITOR.instances['editor_from'].getData();
    objDat.TXT_OPENING_REMARK = CKEDITOR.instances['editor_openingRemark'].getData();
    objDat.TXT_OBJECTIVE = CKEDITOR.instances['editor_objective'].getData();
    objDat.TXT_PROGRAM_MECHANISM = CKEDITOR.instances['editor_progMech'].getData();
    //objDat.TXT_PROMO_MECHANISM = CKEDITOR.instances['editor_ConPromMech'].getData();
    objDat.TXT_TNC = CKEDITOR.instances['editor_TNC'].getData();
    objDat.TXT_CLAIM_MECHANISM = CKEDITOR.instances['txtClaimMechanism'].getData();

    objDat.TXT_REFDOCNO = clsGlobal.parseToString($("#txtRefDocNo").val());

    p_SetHiddenObject(objDat);
    return $("#txtHiddenObject").val();
}

function p_EnablePrintPDF(objDat) {
    if (objDat.TXT_STATUSFLOW === "DRAFT" || objDat.TXT_STATUSFLOW === "APPROVED") {
        $("#btnPrintout").show();
    } else {
        $("#btnPrintout").hide();
    }
}

function p_EnableControlApproveReject() {
    clsGlobal.showLoading();
    $.ajax({
        type: "POST",
        url: "/Transaction/ONO/CheckApprovalOutstanding",
        data: {
            __RequestVerificationToken: $('#frmONO input[name=__RequestVerificationToken]').val(),
            txtDocNo: $("#txtDocNo").val()
        },
        datatype: "json",
        success: function (retDat) {
            if (retDat.bitSuccess == true) {
                debugger
                if (retDat.objData.IsNotTurn || !retDat.objData.IsOutstanding) {
                    $("#btnApprove").hide();
                    $("#btnReject").hide();
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

function p_EnableControl(bitApply, objDat) {
    debugger
    var bitAddendum = clsGlobal.ParseBooleanOracleToNET(objDat.BIT_ADDENDUM);
    var bitApprove = clsGlobal.ParseBooleanOracleToNET(objDat.BIT_APPROVED);
    var bitReject = clsGlobal.ParseBooleanOracleToNET(objDat.BIT_REJECTED);

    $("#btnPrintout").hide();
    if (objDat.INT_ONO_HDR_ID > 0) {
        p_EnablePrintPDF(objDat);
        //$("#btnCheckBudget").show();
        //$("#btnPrintout").show();
    } else {
        //$("#btnPrintout").hide();//
    }

    if (bitApply == true) {
        if (bitReject) {
            $("#btnSave").show();
            $("#btnSubmit").show();
        } else {
            $("#btnSave").hide();
            $("#btnSubmit").hide();
        }
        $("#btnCancel").show();
        $("#btnApprove").hide();
        $("#btnReject").hide();
        $("#btnApprovalHistory").show();

        $("#txtSumOnoCnt").show();
        $("#txtSumOnoAdm").show();

        if (bitAddendum) {
            $("#divtxtSumOnoAdm").hide();
            $("#divtxtSumOnoCnt").hide();
            $("#btnAddendumHistory").hide();

            $("#txtSumOnoCnt").hide();
            $("#txtSumOnoAdm").hide();

        } else {
            $("#divtxtSumOnoAdm").show();
            $("#divtxtSumOnoCnt").show();
            if (bitApprove) {
                $("#btnApprovalHistory").show();
                $("#btnAddendumHistory").show();
                $("#btnPrintout").show();
            } else if (bitReject) {
                $("#btnApprovalHistory").show();
                $("#btnAddendumHistory").hide();
                $("#btnPrintout").hide();
            } else {
                $("#btnApprovalHistory").show();
                $("#btnPrintout").hide();
                //$("#btnAddendumHistory").show();
            }
        }

        $("#btnHistory").show();

        $("#btnLOVRefDocNo").hide();
        $("#btnLOVGroupAccount").hide();
        $("#btnLOVBudgetType").hide();
        $("#txtJudulMemo").attr("disabled", true);
        $("#txtSubjectMemo").attr("disabled", true);
        $("#txtProgramDesc").attr("disabled", true);
        $("#txtMekanismeProgram").attr("disabled", true);
        $("#txtRemark").attr("disabled", true);
        $("#txtdtPostingDate").attr("disabled", true); // //

        $("#btnAddActivity").hide();
        $("#btnAddAccountType").hide();
        $("#btnAddAttachment").hide();
        setTimeout(function () {
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
            $(".btnLOVAccountType").each(function (index) {
                $(this).hide();
            });
            $(".btnActivityDelete").each(function (index) {
                $(this).hide();
            });
            $(".btnAccountTypeDelete").each(function (index) {
                $(this).hide();
            });
            $(".btnAttachmentDelete").each(function (index) {
                $(this).hide();
            });
        }, 1000);

        if (objDat.INT_ONO_HDR_ID > 0) {
            CKEDITOR.instances['editor_to'].setReadOnly(true);
            CKEDITOR.instances['editor_from'].setReadOnly(true);
            CKEDITOR.instances['editor_openingRemark'].setReadOnly(true);
            CKEDITOR.instances['editor_objective'].setReadOnly(true);
            CKEDITOR.instances['editor_progMech'].setReadOnly(true);
            CKEDITOR.instances['editor_TNC'].setReadOnly(true);
            CKEDITOR.instances['txtClaimMechanism'].setReadOnly(true);
        }
    } else {
        $("#txtJudulMemo").attr("disabled", false);
        $("#txtSubjectMemo").attr("disabled", false);
        $("#txtProgramDesc").attr("disabled", false);

        $("#txtSumOnoCnt").show();
        $("#txtSumOnoAdm").show();

        $("#btnSave").show();
        $("#btnSubmit").show();
        $("#btnApprovalHistory").hide();
        $("#btnAddendumHistory").hide();

        $("#btnHistory").hide();

        $("#btnApprove").hide();
        $("#btnReject").hide();

        $("#btnLOVRefDocNo").show();
        $("#btnLOVGroupAccount").show();
        $("#btnLOVBudgetType").show();

        $("#btnAddActivity").show();
        $("#btnAddAccountType").show();
        $("#btnAddAttachment").show();
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
        $(".btnLOVAccountType").each(function (index) {
            $(this).show();
        });
        $(".btnActivityDelete").each(function (index) {
            $(this).show();
        });
        $(".btnAccountTypeDelete").each(function (index) {
            $(this).show();
        });
        $(".btnAttachmentDelete").each(function (index) {
            $(this).show();
        });

        //if (objDat.INT_ONO_HDR_ID > 0) {
        try {
            CKEDITOR.instances['editor_to'].setReadOnly(false);
        } catch (e) {

        }
        try {
            CKEDITOR.instances['editor_from'].setReadOnly(false);
        } catch (e) {

        }
        try {
            CKEDITOR.instances['editor_openingRemark'].setReadOnly(false); //
        } catch (e) {

        }
        try {
            CKEDITOR.instances['editor_objective'].setReadOnly(false);
        } catch (e) {

        }
        try {
            CKEDITOR.instances['editor_progMech'].setReadOnly(false);
        } catch (e) {

        }
        try {
            CKEDITOR.instances['editor_TNC'].setReadOnly(false);
        } catch (e) {

        }
        try {
            CKEDITOR.instances['txtClaimMechanism'].setReadOnly(false);
        } catch (e) {

        }
        //}

        if (bitReject)
            $("#btnApprovalHistory").show();

        if (bitAddendum) {
            $("#btnSave").show();
            $("#btnSubmit").show();
            $("#btnLOVGroupAccount").hide();
            $("#btnLOVBudgetType").hide();
            $("#btnLOVBudgetType").hide();

            $("#txtSumOnoCnt").hide();
            $("#txtSumOnoAdm").hide();

            $("#txtJudulMemo").attr("disabled", "true");
            $("#txtSubjectMemo").attr("disabled", "true");
            $("#txtProgramDesc").attr("disabled", "true");
            $("#txtMekanismeProgram").attr("disabled", "true");
            $("#txtRemark").attr("disabled", "true");
            $("#txtdtPostingDate").attr("disabled", "true");

            $("#divtxtSumOnoAdm").hide();
            $("#divtxtSumOnoCnt").hide();

            CKEDITOR.instances['editor_to'].setReadOnly(true);
            CKEDITOR.instances['editor_from'].setReadOnly(true);
            CKEDITOR.instances['editor_openingRemark'].setReadOnly(true);
            CKEDITOR.instances['editor_objective'].setReadOnly(true);
            CKEDITOR.instances['editor_progMech'].setReadOnly(true);
            //CKEDITOR.instances['editor_ConPromMech'].setReadOnly(true);
            CKEDITOR.instances['editor_TNC'].setReadOnly(true);
            CKEDITOR.instances['txtClaimMechanism'].setReadOnly(true);

            setTimeout(function () {
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
                $(".btnLOVAccountType").each(function (index) {
                    $(this).hide();
                });
                $(".btnActivityDelete").each(function (index) {
                    $(this).hide();
                });
                $(".btnAccountTypeDelete").each(function (index) {
                    $(this).show();
                });
                $(".btnAttachmentDelete").each(function (index) {
                    $(this).show();
                });
            }, 1000);
        } else {
            $("#divtxtSumOnoAdm").show();
            $("#divtxtSumOnoCnt").show();
        }
    }
}

function p_EnableControlUpdate(bitAllow) {
    if (bitAllow == true) {
        $('#btnUpdate').show();

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

function p_txtDocNo_TextChanged() {
    clsGlobal.showLoading();
    $.ajax({
        type: "POST",
        url: "/Transaction/ONO/GetDataByTxtDocNo",
        data: {
            txtDocNo: $("#txtDocNo").val(),
            __RequestVerificationToken: $('#frmONO input[name=__RequestVerificationToken]').val(),
            bitReject: bitReject
        },
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
        url: "/Transaction/ONO/GetDataParentBytxtRefDocNo",
        data: { txtRefDocNo: $("#txtRefDocNo").val(), __RequestVerificationToken: $('#frmONO input[name=__RequestVerificationToken]').val() },
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
    var data = new FormData();
    if (attachments.length > 0) {
        for (var i = 0; i < attachments.length; i++) {
            data.append("attachments[]", attachments[i]);
        }
    }

    // Existing fields
    data.append("data", $("#txtHiddenObject").val());
    data.append("txtGUID", $("#txtGUID").val());
    data.append("__RequestVerificationToken", $('#frmONO input[name=__RequestVerificationToken]').val());

    //clsGlobal.hideLoading();
    $.ajax({
        type: "POST",
        url: "/Transaction/ONO/SaveData",
        processData: false,
        contentType: false,
        data: data,
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

function p_updateData() {
    clsGlobal.showLoading();
    p_UIToData();
    $.ajax({
        type: "POST",
        url: "/Transaction/ONO/UpdateData",
        data: { data: $("#txtHiddenObject").val(), txtGUID: $("#txtGUID").val(), __RequestVerificationToken: $('#frmONO input[name=__RequestVerificationToken]').val() },
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

function p_updateDataSubUmbrand(bitApprove) {
    clsGlobal.showLoading();
    p_UIToData();
    $.ajax({
        type: "POST",
        url: "/Transaction/ONO/UpdateDataSubUmbrand",
        data: {
            data: $("#txtHiddenObject").val(),
            bitApprove: bitApprove,
            txtGUID: $("#txtGUID").val(),
            __RequestVerificationToken: $('#frmONO input[name=__RequestVerificationToken]').val()
        },
        datatype: "json",
        success: function (retDat) {
            if (retDat.bitSuccess == true) {
                p_DataToUI(retDat.objData);
                clsGlobal.getInformationMessage(retDat.txtMessage);
                p_RedirectToApproval();
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

function p_history() {


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
    data.append("__RequestVerificationToken", $('#frmONO input[name=__RequestVerificationToken]').val());

    $.ajax({
        type: "POST",
        url: "/Transaction/ONO/SubmitData",
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
    data.append("__RequestVerificationToken", $('#frmONO input[name=__RequestVerificationToken]').val());

    $.ajax({
        type: "POST",
        url: "/Transaction/ONO/UpdateAttachmentData",
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

function p_submitDataOld() {

    clsGlobal.showLoading();
    p_UIToData();
    $.ajax({
        type: "POST",
        url: "/Transaction/ONO/SubmitData",
        data: { data: $("#txtHiddenObject").val(), txtGUID: $("#txtGUID").val(), __RequestVerificationToken: $('#frmONO input[name=__RequestVerificationToken]').val() },
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
        url: "/Transaction/ONO/PrintoutToPDF",
        data: { data: $("#txtHiddenObject").val(), txtGUID: $("#txtGUID").val(), __RequestVerificationToken: $('#frmONO input[name=__RequestVerificationToken]').val() },
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
        url: "/Transaction/ONO/CloseDocument",
        data: { data: $("#txtHiddenObject").val(), txtGUID: $("#txtGUID").val(), __RequestVerificationToken: $('#frmONO input[name=__RequestVerificationToken]').val() },
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
        url: "/Transaction/ONO/CancelDocument",
        data: { data: $("#txtHiddenObject").val(), txtGUID: $("#txtGUID").val(), __RequestVerificationToken: $('#frmONO input[name=__RequestVerificationToken]').val() },
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

function p_ApproveData() {
    clsGlobal.showLoading();
    p_UIToData();
    $.ajax({
        type: "POST",
        url: "/Transaction/ONO/UpdateDataSubUmbrand",
        data: { data: $("#txtHiddenObject").val(), txtGUID: $("#txtGUID").val(), __RequestVerificationToken: $('#frmONO input[name=__RequestVerificationToken]').val() },
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

function p_RejectData() {

}

function p_IsDocumentDecided(TXT_DOCNO, intONOSubUmbrandID) {
    debugger
    $.ajax({
        type: "POST",
        url: "/Transaction/ONO/IsDocumentDecided",
        data: {
            txtDocONO: TXT_DOCNO,
            intONOSubUmbrandID: intONOSubUmbrandID,
            __RequestVerificationToken: $('#frmONO input[name=__RequestVerificationToken]').val()
        },
        datatype: "json",
        success: function (retDat) {
            debugger
            if (retDat.bitSuccess == true) {
                if (retDat.objData) {
                    $("#btnApprove").hide();
                    $("#btnReject").hide();
                    $("#lblStatusFlow").val(retDat.txtMessage);
                } else {
                    $("#btnApprove").show();
                    $("#btnReject").show();
                    p_EnableControlApproveReject();
                }
            } else {
                clsGlobal.getAlert(retDat.txtMessage);
                $("#btnApprove").hide();
                $("#btnReject").hide();
            }
        },
        error: function (retDat) {
            clsGlobal.hideLoading();
        }
    });
}

function p_RedirectToApproval() {
    // Get the current URL
    var currentURL = window.location.href;
    // Remove the query parameter "ID" and its value
    var updatedURL = currentURL.replace(/[\?&]ID=[^&]+/, '');
    // Replace the part after the base URL with "Approval/Index"
    var newURL = updatedURL.replace("ONO/Index", "ApprovalDoc/Index");
    // Navigate to the new URL
    window.location.href = newURL;
}

// ====================================================
//  ACTIVITY
// ====================================================

function p_DataToUIActivity(XXSHP_KDS_T_ONO_ACT) {

    oTableActivity.clear();
    for (var i = 0; i < XXSHP_KDS_T_ONO_ACT.length; i++) {
        XXSHP_KDS_T_ONO_ACT[i].intIndex = i;
        oTableActivity.row.add(XXSHP_KDS_T_ONO_ACT[i]);
    }
    oTableActivity.draw(false);

    var objDat = p_GetHiddenObject();
    objDat.XXSHP_KDS_T_ONO_ACT = XXSHP_KDS_T_ONO_ACT;
    p_SetHiddenObject(objDat);
}


$('#btnAddActivity').on('click', function () {
    try {
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
    if (objData.TXT_BUDGET_TYPE == '') {
        throw "Kolom Budget Type harus di isi!";
    }

    clsGlobal.showLoading();
    $.ajax({
        type: "POST",
        url: "/Transaction/ONO/AddRowActivity",
        data: {
            data: $("#txtHiddenObject").val(),
            __RequestVerificationToken: $('#frmONO input[name=__RequestVerificationToken]').val()
        },
        datatype: "json",
        success: function (retDat) {

            if (retDat.bitSuccess == true) {
                if (retDat.objData != undefined) {
                    p_SetHiddenObject(retDat.objData);
                    p_DataToUIActivity(retDat.objData.XXSHP_KDS_T_ONO_ACT);
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

function p_UpdateFileLabel(input, index) {
    const label = document.getElementById(`fileLabel_${index}`);
    if (input.files.length > 0) {
        label.textContent = `Filename: "${input.files[0].name}"`;
    } else {
        label.textContent = 'Filename: "None selected"';
    }
}

function p_InitiateActivity() { // tables
    // Format datatable

    // schema native to onoscript
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
                        '   </div>'
                        + '<div style="display:none;"> ' + full.TXT_ACTIVITYCODE + ' </div>';
                }
            },
            {
                aTargets: [2],
                mRender: function (data, type, full) {
                    return '<div >  <input type="text" class="form-control dtActivityPeriodFrom datetimepicker"  style="width:100px;"  id="dtActivityPeriodFrom' + full.intIndex + '" onchange="p_dtActivityPeriodFrom_Changed(this,' + full.intIndex + ')"  value="' + clsGlobal.parseToDateTimeFromJSON2(full.DTM_PERIOD_FROM, clsDateFormat) + '" >  </div>';
                }
            },
            {
                aTargets: [3],
                mRender: function (data, type, full) {
                    return '<div >  <input type="text" class="form-control dtActivityPeriodTo datetimepicker" style="width:100px;" id="dtActivityPeriodTo' + full.intIndex + '" onchange="p_dtActivityPeriodTo_Changed(this,' + full.intIndex + ')"  value="' + clsGlobal.parseToDateTimeFromJSON2(full.DTM_PERIOD_TO, clsDateFormat) + '" >  </div>';
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
            //{
            //    aTargets: [7],
            //    mRender: function (data, type, full) {
            //        return '<div > <input type="button" class="btn btn-info btnActivitySupplier" id="btnActivitySupplier" onclick="p_btnActivitySupplier_Click(this,' + full.intIndex + ')"  value="Supplier" >  </div>';
            //    }
            //},
            {
                aTargets: [7],
                mRender: function (data, type, full) {
                    var dat = p_GetHiddenObject();

                    if (clsGlobal.ParseBooleanOracleToNET(dat.BIT_APPLY)) {
                        return '<div ></div>';
                    } else {
                        return '<div > <input type="button" class="btn btn-warning btnActivityDelete" id="btnActivityDelete" onclick="p_btnActivityDelete_Click(this,' + full.intIndex + ')"  value="Delete" >  </div>';
                    }
                }
            }
        ]
    });

    oTableAccountType = $('#dtAccountType').DataTable({
        "paging": false,
        "ordering": false,
        "info": false,
        "filter": false,
        "autoWidth": false,
        aoColumnDefs: [
            {
                aTargets: [0],
                mRender: function (data, type, full) {
                    return '<div id="lblAccountTypeNoValue"> ' + (full.intIndex + 1) + ' </div>';
                }
            },
            {
                aTargets: [1],
                mRender: function (data, type, full) {
                    return  '     <div class="input-group"> ' +
                            '       <div class="input-group-btn"  > ' +
                            '           <button type="button" class="btn btn-danger btnLOVAccountType" id="btnLOVAccountType" onclick="p_btnLOVAccountType_Click(this,' + full.intIndex + ')"> <i class="fa fa-search"></i></button> ' +
                            '       </div> ' +
                            '       <div class="input-group-btn" style="width:100%;"> ' +
                            '       <input type="text" class="form-control txtAccountType" id="txtAccountType" onchange="p_txtAccountType_Changed(this,' + full.intIndex + ')"  value="' + full.TXT_TYPECUS + '" disabled> ' +
                            '       </div> ' +
                            '   </div>'
                        + '<div style="display:none;"> ' + full.TXT_TYPECUS + ' </div>';
                }
            },
            {
                aTargets: [2],
                mRender: function (data, type, full) {
                    return '<div > <input type="button" class="btn btn-info btnParticipantOutlet" id="btnParticipantOutlet" onclick="p_btnParticipantOutlet(this,' + full.intIndex + ')"  value="Participant Outlet" >  </div>';
                }
            },
            {
                aTargets: [3],
                "orderable": false,
                mRender: function (data, type, full) {
                    var html = ""
                    var dat = p_GetHiddenObject();

                    if (clsGlobal.ParseBooleanOracleToNET(dat.BIT_APPLY)) {
                        return '<div ></div>';
                    } else {
                        return '<div > <input type="button" class="btn btn-warning btnAccountTypeDelete" id="btnAccountTypeDelete" onclick="p_btnAccountTypeDelete_Click(this,' + full.intIndex + ')"  value="Delete" >  </div>';
                    }
                }
            },
        ]
    });

    // schema taken from PRM memo
    oTableAttachment = $('#dtAttachment').DataTable({
        "paging": true,
        "ordering": true,
        "info": true,
        "filter": false,
        "autoWidth": true,
        aoColumnDefs: [
            {
                aTargets: [0],
                mRender: function (data, type, full) {
                    return '<div id="lblAttachmentNoValue"> ' + (full.intIndex + 1) + ' </div>';
                }
            },
            {
                aTargets: [1], // File name textbox
                mRender: function (data, type, full) {
                    var dat = p_GetHiddenObject();

                    if (clsGlobal.ParseBooleanOracleToNET(dat.BIT_APPLY)) {
                        return '<input style="width:256px;" class="form-control" id="txtFileTitle" onchange="p_txtFileTitle_Changed(this,' + full.intIndex + ')" value="'+full.TXT_FILE_TITLE+'" readonly></input>';
                    } else {
                        return '<input style="width:256px;" class="form-control" id="txtFileTitle" onchange="p_txtFileTitle_Changed(this,' + full.intIndex + ')" value="'+full.TXT_FILE_TITLE+'"></input>';
                    }
                }
            },
            {
                aTargets: [2], // File upload / download
                mRender: function (data, type, full) {
                    var html = "";

                    if (full.TXT_FILE_NAME != "") {
                        var dat = p_GetHiddenObject();

                        if (clsGlobal.ParseBooleanOracleToNET(dat.BIT_APPLY)) {
                            // Read-only
                            html = `
                    <div class="mb-2" style="width:100%;">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <div style="text-align:left;">
                                File Name : ${clsGlobal.parseToString(full.TXT_FILE_NAME_ORIGINAL)}
                            </div>
                            <button type="button" 
                                    class="btn btn-success btn-sm"
                                    style="margin-left: 10px;"
                                    onclick="p_btnViewAttachment_Click(this, ${full.intIndex})">
                                <i class="fa fa-download"></i> View
                            </button>
                        </div>
                    </div>
                `;
                        } else {
                            // Editable field-like container
                            html = `
                    <div class="mb-2" style="width:100%;">
                        <div class="form-control"
                             style="display:flex; align-items:center; gap:10px; padding:0px 0px; background-color:white; height:auto;">

                            <!-- Hidden actual file input -->
                            <input type="file"
                                   id="file_${full.intIndex}"
                                   style="display:none;"
                                   accept=".jpeg,.jpg,.png"
                                   onchange="p_UpdateFileLabel(this, ${full.intIndex}); p_fllAttachment_Changed(this, ${full.intIndex});" />

                            <!-- Choose File button -->
                            <button type="button"
                                    class="btn btn-outline-primary btn-sm"
                                    onclick="document.getElementById('file_${full.intIndex}').click();">
                                <i class="fa fa-upload"></i> Choose File
                            </button>

                            <!-- Filename label -->
                            <span id="fileLabel_${full.intIndex}" 
                                  style="white-space: nowrap; overflow:hidden; text-overflow:ellipsis; flex:1;">
                                Filename: "${clsGlobal.parseToString(full.TXT_FILE_NAME_ORIGINAL) || 'None selected'}"
                            </span>

                            <!-- View button -->
                            <button type="button"
                                    class="btn btn-success btn-sm"
                                    onclick="p_btnViewAttachment_Click(this, ${full.intIndex});">
                                <i class="fa fa-download"></i> View
                            </button>
                        </div>
                    </div>
                `;
                        }
                    } else {
                        // When no file exists yet
                        html = `
                <div class="mb-2" style="width:100%;">
                    <div class="form-control"
                         style="display:flex; align-items:center; gap:10px; padding:0px 0px; background-color:white; height:auto;">

                        <!-- Hidden input -->
                        <input type="file"
                               id="file_${full.intIndex}"
                               style="display:none;"
                               accept=".jpeg,.jpg,.png"
                               onchange="p_UpdateFileLabel(this, ${full.intIndex}); p_fllAttachment_Changed(this, ${full.intIndex});" />

                        <!-- Choose File button -->
                        <button type="button"
                                class="btn btn-outline-primary btn-sm"
                                onclick="document.getElementById('file_${full.intIndex}').click();">
                            <i class="fa fa-upload"></i> Choose File
                        </button>

                        <!-- Filename -->
                        <span id="fileLabel_${full.intIndex}" 
                              style="white-space: nowrap; overflow:hidden; text-overflow:ellipsis; flex:1;">
                            Filename: "None selected"
                        </span>

                        <!-- View button -->
                        <button type="button"
                                class="btn btn-success btn-sm"
                                onclick="p_btnViewAttachment_Click(this, ${full.intIndex});">
                            <i class="fa fa-download"></i> View
                        </button>
                    </div>
                </div>
            `;
                    }

                    return html;
                }
            },

            {
                aTargets: [3],
                "orderable": false,
                mRender: function (data, type, full) {
                    //var html = "";
                    //var dat = p_GetHiddenObject();

                    //if (clsGlobal.ParseBooleanOracleToNET(dat.BIT_APPLY)) {
                    //    return '';
                    //} else {
                        return ' <button type="button" class="btn btn-warning btnAttachmentDelete" onclick="p_btnAttachmentDelete_Click(this,' + full.intIndex + ')" class="btn btn-danger">Delete</button>';
                    //}
                    //return html;
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

    $('#dtAccountType tbody').on('click', 'tr', function () {
        if (!$(this).hasClass('selected')) {
            oTableAccountType.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
        }
    });

    $('#dtAttachment tbody').on('click', 'tr', function () {
        if (!$(this).hasClass('selected')) {
            oTableAttachment.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
        }
    });
}

function p_GetSelectedActivityRow() {
    var intIndex = clsGlobal.parseToInteger(oTableActivity.$('tr.selected').find("#lblActivityNoValue").html()) - 1;
    return intIndex;
}

function p_GetSelectedAccountTypeRow() {
    var intIndex = clsGlobal.parseToInteger(oTableAccountType.$('tr.selected').find("#lblAccountTypeNoValue").html()) - 1;
    return intIndex;
}

function p_GetSelectedAttachmentRow() {
    var intIndex = clsGlobal.parseToInteger(oTableAttachment.$('tr.selected').find("#lblAttachmentNoValue").html()) - 1;
    return intIndex;
}

function p_btnLOVActivityCode_Click(objCaller, intIndex) {

    LOV = clsGlobal.generateLOV(MODULE_ACTIVITY_BY_GROUP_ACCOUNT, "txtActivityCode", clsGlobal.parseToString($("#txtGroupAccount").val()));
}

function p_btnLOVAccountType_Click(objCaller, intIndex) {

    LOV = clsGlobal.generateLOV("ACCOUNT TYPE", "txtAccountType", null);
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
            objDat.XXSHP_KDS_T_ONO_ACT[intRowIndex].TXT_ACTIVITYCODE = txtValue;

            d.TXT_ACTIVITYNAME = objDat.XXSHP_KDS_T_ONO_ACT[intRowIndex].TXT_ACTIVITYNAME
            d.DTM_PERIOD_FROM = objDat.XXSHP_KDS_T_ONO_ACT[intRowIndex].DTM_PERIOD_FROM
            d.DTM_PERIOD_TO = objDat.XXSHP_KDS_T_ONO_ACT[intRowIndex].DTM_PERIOD_TO
            d.DEC_AMOUNT = objDat.XXSHP_KDS_T_ONO_ACT[intRowIndex].DEC_AMOUNT

            this.invalidate(); // invalidate the data DataTables has cached for this row         
            p_EnableControl(clsGlobal.ParseBooleanOracleToNET(objDat.BIT_APPLY), objDat);
        }

        intRowIndex++;
    });

    p_SetHiddenObject(objDat);
}

function p_settxtAccountType(txtAccount, txtChannel, txtTypeCus) {
    debugger
    var intSelectedIndex = p_GetSelectedAccountTypeRow();
    var intRowIndex = 0;
    var objDat = p_GetHiddenObject();

    if (objDat.XXSHP_KDS_T_ONO_ACY.some(x => x.TXT_TYPECUS == txtTypeCus))
        throw "Account sudah ada!";

    oTableAccountType.rows().every(function (rowIdx, tableLoop, rowLoop) {

        var d = this.data();
        if (intRowIndex == intSelectedIndex) {
            d.intIndex = intRowIndex;
            objDat.XXSHP_KDS_T_ONO_ACY[intRowIndex].TXT_CHANNELTYPE_ID = txtChannel;
            objDat.XXSHP_KDS_T_ONO_ACY[intRowIndex].TXT_CHANNELTYPE = txtChannel;
            objDat.XXSHP_KDS_T_ONO_ACY[intRowIndex].TXT_ACCOUNTTYPE_ID = txtAccount;
            objDat.XXSHP_KDS_T_ONO_ACY[intRowIndex].TXT_ACCOUNTTYPE = txtAccount;
            objDat.XXSHP_KDS_T_ONO_ACY[intRowIndex].TXT_TYPECUS = txtTypeCus;

            d.TXT_CHANNELTYPE_ID = objDat.XXSHP_KDS_T_ONO_ACY[intRowIndex].TXT_CHANNELTYPE_ID;
            d.TXT_CHANNELTYPE = objDat.XXSHP_KDS_T_ONO_ACY[intRowIndex].TXT_CHANNELTYPE;
            d.TXT_ACCOUNTTYPE_ID = objDat.XXSHP_KDS_T_ONO_ACY[intRowIndex].TXT_ACCOUNTTYPE_ID;
            d.TXT_ACCOUNTTYPE = objDat.XXSHP_KDS_T_ONO_ACY[intRowIndex].TXT_ACCOUNTTYPE;
            d.TXT_TYPECUS = objDat.XXSHP_KDS_T_ONO_ACY[intRowIndex].TXT_TYPECUS;

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
    for (i = 0; i < objData.XXSHP_KDS_T_ONO_ACT.length; i++) {
        // Cari Index-nya.
        if (objData.XXSHP_KDS_T_ONO_ACT[i].intIndex == intIndex) {
            // Ketemu, mulai dari sini:

            if (clsGlobal.parseToString(objCaller.value) != "") {
                objData.XXSHP_KDS_T_ONO_ACT[i].DTM_PERIOD_FROM = clsGlobal.parseToJSONDateFromDatePlus7Hours(objCaller.value, clsDateFormat);
            } else {
                objCaller.value = clsGlobal.parseToDateTimeFromJSON2(objData.XXSHP_KDS_T_ONO_ACT[i].DTM_PERIOD_FROM, clsDateFormat)
            }
            break;
        }
    }
    p_SetHiddenObject(objData);
}

function p_dtActivityPeriodTo_Changed(objCaller, intIndex) {

    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());
    for (i = 0; i < objData.XXSHP_KDS_T_ONO_ACT.length; i++) {
        // Cari Index-nya.
        if (objData.XXSHP_KDS_T_ONO_ACT[i].intIndex == intIndex) {
            // Ketemu, mulai dari sini:

            if (clsGlobal.parseToString(objCaller.value) != "") {
                objData.XXSHP_KDS_T_ONO_ACT[i].DTM_PERIOD_TO = clsGlobal.parseToJSONDateFromDatePlus7Hours(objCaller.value, clsDateFormat);
            } else {
                objCaller.value = clsGlobal.parseToDateTimeFromJSON2(objData.XXSHP_KDS_T_ONO_ACT[i].DTM_PERIOD_TO, clsDateFormat)
            }

            break;
        }
    }
    p_SetHiddenObject(objData);
}

function p_txtTarget_Changed(objCaller, intIndex) {
    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());

    for (i = 0; i < objData.XXSHP_KDS_T_ONO_ACT.length; i++) {
        // Cari Index-nya.
        if (objData.XXSHP_KDS_T_ONO_ACT[i].intIndex == intIndex) {
            // Ketemu, mulai dari sini:
            objData.XXSHP_KDS_T_ONO_ACT[i].DEC_TARGET = clsGlobal.parseToDecimal(objCaller.value);
        }
    }

    p_SetHiddenObject(objData);
}

function p_txtFileTitle_Changed(objCaller, intIndex) {
    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());

    for (i = 0; i < objData.XXSHP_KDS_T_ONO_ATT.length; i++) {
        // Cari Index-nya.
        if (objData.XXSHP_KDS_T_ONO_ATT[i].intIndex == intIndex) {
            // Ketemu, mulai dari sini:
            objData.XXSHP_KDS_T_ONO_ATT[i].TXT_FILE_TITLE = clsGlobal.parseToString(objCaller.value);
        }
    }

    p_SetHiddenObject(objData);
}

function p_fllAttachment_Changed(objCaller, intIndex) {
    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());

    for (i = 0; i < objData.XXSHP_KDS_T_ONO_ATT.length; i++) {
        // Cari Index-nya.
        if (objData.XXSHP_KDS_T_ONO_ATT[i].intIndex == intIndex) {
            // Ketemu, mulai dari sini:
            var fllAttahcment = objCaller;
            attachments.push(fllAttahcment.files[0]);

            //objData.XXSHP_KDS_T_ONO_ATT[i].TXT_FILE_TITLE = clsGlobal.parseToString(objCaller.value);
            objData.XXSHP_KDS_T_ONO_ATT[i].TXT_FILE_NAME = crypto.randomUUID() + "." + fllAttahcment.files[0].name.split('.').pop().toLowerCase();
            objData.XXSHP_KDS_T_ONO_ATT[i].TXT_FILE_NAME_ORIGINAL = fllAttahcment.files[0].name;
        }
    }

    p_DataToUIAttachment(objData.XXSHP_KDS_T_ONO_ATT);
    p_SetHiddenObject(objData);
}

function p_btnActivityBudget_Click(objCaller, intIndex) {

    try {
        // Parse dari HiddenObject->JSON
        var objData = JSON.parse(p_UIToData());
        for (i = 0; i < objData.XXSHP_KDS_T_ONO_ACT.length; i++) {
            // Cari Index-nya.
            if (objData.XXSHP_KDS_T_ONO_ACT[i].intIndex == intIndex) {
                // Ketemu, mulai dari sini:

                // Validasi
                if (objData.XXSHP_KDS_T_ONO_ACT[i].TXT_ACTIVITYCODE == "") {
                    throw "Activity must be filled!";
                }

                var fancyboxdata = p_GetHiddenObject();
                LOV = clsGlobal.generatePopUpIframe($(location).attr('protocol') + "//" + $(location).attr('host') + "/Transaction/ONO/Budget?intIndex=" + intIndex, "btnActivityBudget", fancyboxdata);
                break;
            }
        }
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
}

function p_btnParticipantOutlet(objCaller, intIndex) {

    try {
        // Parse dari HiddenObject->JSON
        var objData = JSON.parse(p_UIToData());
        for (i = 0; i < objData.XXSHP_KDS_T_ONO_ACY.length; i++) {
            // Cari Index-nya.
            if (objData.XXSHP_KDS_T_ONO_ACY[i].intIndex == intIndex) {
                // Ketemu, mulai dari sini:

                // Validasi
                if (objData.XXSHP_KDS_T_ONO_ACY[i].TXT_TYPECUS == "") {
                    throw "Outlet must be filled!";
                }
                
                var fancyboxdata = p_GetHiddenObject();
                LOV = clsGlobal.generatePopUpIframe($(location).attr('protocol') + "//" + $(location).attr('host') + "/Transaction/ONO/ParticipantOutlet?intIndex=" + intIndex, "btnParticipantOutlet", fancyboxdata);
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
    objDat.XXSHP_KDS_T_ONO_ACT[intSelectedIndex].DEC_AMOUNT = 0;
    for (i = 0; i < objDat.XXSHP_KDS_T_ONO_ACT[intSelectedIndex].XXSHP_KDS_T_ONO_BGT.length; i++) {
        objDat.XXSHP_KDS_T_ONO_ACT[intSelectedIndex].DEC_AMOUNT += objDat.XXSHP_KDS_T_ONO_ACT[intSelectedIndex].XXSHP_KDS_T_ONO_BGT[i].DEC_ALOKASI;
    }

    // Show ke table.
    oTableActivity.rows().every(function (rowIdx, tableLoop, rowLoop) {

        var d = this.data();
        if (intRowIndex == intSelectedIndex) {
            d.intIndex = intRowIndex; // update data source for the row 

            d.TXT_ACTIVITYCODE = objDat.XXSHP_KDS_T_ONO_ACT[intSelectedIndex].TXT_ACTIVITYCODE;
            d.TXT_ACTIVITYNAME = objDat.XXSHP_KDS_T_ONO_ACT[intSelectedIndex].TXT_ACTIVITYNAME;
            d.DEC_AMOUNT = objDat.XXSHP_KDS_T_ONO_ACT[intSelectedIndex].DEC_AMOUNT;
            d.DTM_PERIOD_FROM = objDat.XXSHP_KDS_T_ONO_ACT[intSelectedIndex].DTM_PERIOD_FROM;
            d.DTM_PERIOD_TO = objDat.XXSHP_KDS_T_ONO_ACT[intSelectedIndex].DTM_PERIOD_TO;

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
        for (i = 0; i < objData.XXSHP_KDS_T_ONO_ACT.length; i++) {
            // Cari Index-nya.
            if (objData.XXSHP_KDS_T_ONO_ACT[i].intIndex == intIndex) {
                // Ketemu, mulai dari sini:

                // Validasi
                if (objData.XXSHP_KDS_T_ONO_ACT[i].TXT_ACTIVITYCODE == "") {
                    throw "Activity must be filled!";
                }
                var fancyboxdata = p_GetHiddenObject();
                LOV = clsGlobal.generatePopUpIframe($(location).attr('protocol') + "//" + $(location).attr('host') + "/Transaction/ONO/Supplier?intIndex=" + intIndex, "btnActivitySupplier", fancyboxdata);
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
    for (i = 0; i < objData.XXSHP_KDS_T_ONO_ACT.length; i++) {
        // Cari Index-nya.
        if (objData.XXSHP_KDS_T_ONO_ACT[i].intIndex == intIndex) {
            // Ketemu, mulai dari sini:
            // Remove from list.
            objData.XXSHP_KDS_T_ONO_ACT.splice(i, 1);

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

function p_btnAccountTypeDelete_Click(objCaller, intIndex) {
    var objData = JSON.parse(p_UIToData());
    for (i = 0; i < objData.XXSHP_KDS_T_ONO_ACY.length; i++) {
        // Cari Index-nya.
        if (objData.XXSHP_KDS_T_ONO_ACY[i].intIndex == intIndex) {
            objData.XXSHP_KDS_T_ONO_ACY.splice(i, 1);
            oTableAccountType.row(i).remove().draw(false);
            break;
        }
    }
    p_SetHiddenObject(objData);
    p_RefreshNumberAccountType();
}

function p_btnAttachmentDelete_Click(objCaller, intIndex) {
    var objData = JSON.parse(p_UIToData());
    for (i = 0; i < objData.XXSHP_KDS_T_ONO_ATT.length; i++) {
        // Cari Index-nya.
        if (objData.XXSHP_KDS_T_ONO_ATT[i].intIndex == intIndex) {
            objData.XXSHP_KDS_T_ONO_ATT.splice(i, 1);
            oTableAttachment.row(i).remove().draw(false);
            break;
        }
    }
    p_SetHiddenObject(objData);
    p_RefreshNumberAttachment();
}

function p_btnViewAttachment_Click(objCaller, intIndex) {
    var objDat = JSON.parse(p_UIToData());
    var attachment = objDat.XXSHP_KDS_T_ONO_ATT.find(x => x.intIndex == intIndex);

    const id = clsGlobal.parseToInteger(attachment.INT_ONO_ATT_ID);
    const bitLocal = !id || id === 0; // true if 0, null, undefined, or empty

    p_DownloadAttachment(id, bitLocal, intIndex);
}

function p_RefreshNumberActivity() {

    var intRowIndex = 0;
    var objDat = p_GetHiddenObject();
    oTableActivity.rows().every(function (rowIdx, tableLoop, rowLoop) {

        var d = this.data();
        d.intIndex = intRowIndex; // update data source for the row
        objDat.XXSHP_KDS_T_ONO_ACT[intRowIndex].intIndex = d.intIndex;

        d.TXT_ACTIVITYCODE = objDat.XXSHP_KDS_T_ONO_ACT[intRowIndex].TXT_ACTIVITYCODE;
        d.TXT_ACTIVITYNAME = objDat.XXSHP_KDS_T_ONO_ACT[intRowIndex].TXT_ACTIVITYNAME;
        d.DTM_PERIOD_FROM = objDat.XXSHP_KDS_T_ONO_ACT[intRowIndex].DTM_PERIOD_FROM;
        d.DTM_PERIOD_TO = objDat.XXSHP_KDS_T_ONO_ACT[intRowIndex].DTM_PERIOD_TO;
        d.DEC_AMOUNT = objDat.XXSHP_KDS_T_ONO_ACT[intRowIndex].DEC_AMOUNT;

        intRowIndex++;
        this.invalidate(); // invalidate the data DataTables has cached for this row         
    });

    // Draw once all updates are done
    oTableActivity.draw(false);
    p_SetHiddenObject(objDat);
}

function p_RefreshNumberAccountType() {
    var intRowIndex = 0;
    var objDat = p_GetHiddenObject();
    oTableAccountType.rows().every(function (rowIdx, tableLoop, rowLoop) {

        var d = this.data();
        d.intIndex = intRowIndex; // update data source for the row
        objDat.XXSHP_KDS_T_ONO_ACY[intRowIndex].intIndex = d.intIndex;

        d.TXT_ACCOUNTTYPE = objDat.XXSHP_KDS_T_ONO_ACY[intRowIndex].TXT_ACCOUNTTYPE;
        d.TXT_CHANNELTYPE = objDat.XXSHP_KDS_T_ONO_ACY[intRowIndex].TXT_CHANNELTYPE;
        d.TXT_TYPECUS = objDat.XXSHP_KDS_T_ONO_ACY[intRowIndex].TXT_TYPECUS;

        intRowIndex++;
        this.invalidate(); // invalidate the data DataTables has cached for this row         
    });

    // Draw once all updates are done
    oTableAccountType.draw(false);
    p_SetHiddenObject(objDat);
}

function p_RefreshNumberAttachment() {
    var intRowIndex = 0;
    var objDat = p_GetHiddenObject();
    oTableAttachment.rows().every(function (rowIdx, tableLoop, rowLoop) {

        var d = this.data();
        d.intIndex = intRowIndex; // update data source for the row
        objDat.XXSHP_KDS_T_ONO_ATT[intRowIndex].intIndex = d.intIndex;

        d.TXT_FILE_TITLE = objDat.XXSHP_KDS_T_ONO_ATT[intRowIndex].TXT_FILE_TITLE;
        d.TXT_FILE_NAME_ORIGINAL = objDat.XXSHP_KDS_T_ONO_ATT[intRowIndex].TXT_FILE_NAME_ORIGINAL;

        intRowIndex++;
        this.invalidate(); // invalidate the data DataTables has cached for this row         
    });

    // Draw once all updates are done
    oTableAttachment.draw(false);
    p_SetHiddenObject(objDat);
}

function p_ExtractExcel(objCaller) {
    clsGlobal.showLoading();
    p_UIToData();

    var data = new FormData();
    var fllAttahcment = objCaller;
    if (fllAttahcment.files != null) {
        for (var j = 0; j < fllAttahcment.files.length; j++) {
            data.append("attachments[]", fllAttahcment.files[j]);
        }
    }
    data.append("data", $("#txtHiddenObject").val());
    data.append("txtGUID", $("#txtGUID").val());
    data.append("__RequestVerificationToken", $('#frmONO input[name=__RequestVerificationToken]').val());

    $.ajax({
        type: "POST",
        url: "/Transaction/ONO/ExtractExcel",
        processData: false,
        contentType: false,
        data: data,
        datatype: "json",
        success: function (retDat) {
            debugger
            if (retDat.bitSuccess == true) {
                p_SetHiddenObject(retDat.objData);
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

function p_DownloadAttachment(INT_ONO_ATT_ID, bitLocal, intIndex) {
    debugger;
        var objDat = p_GetHiddenObject();
    if (bitLocal) {
        var attachment = objDat.XXSHP_KDS_T_ONO_ATT.find(x => x.intIndex == intIndex);
        const file = attachments.find(file => file.name === attachment.TXT_FILE_NAME_ORIGINAL);

        if (file) {
            const downloadLink = document.createElement('a');
            const blob = new Blob([file], { type: 'application/octet-stream' });

            downloadLink.href = URL.createObjectURL(blob);
            downloadLink.download = file.name;
            downloadLink.target = "_self";
            downloadLink.rel = "noopener";

            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
        } else {
            console.error(`File not found: ${attachment.TXT_FILE_NAME_ORIGINAL}`);
        }
    } else {
        $.ajax({
            type: "POST",
            url: "/Transaction/ONO/DownloadAttachment",
            data: {
                INT_ONO_HDR_ID: objDat.INT_ONO_HDR_ID,
                __RequestVerificationToken: $('#frmONO input[name=__RequestVerificationToken]').val()
            },
            datatype: "json",
            success: function (retDat) {
                if (retDat.bitSuccess) {
                    var dat = objDat;
                    var attachment = dat.XXSHP_KDS_T_ONO_ATT.find(x => x.intIndex == intIndex);
                    console.log(attachment);
                    var filePath = clsGlobal.parseToString(attachment.TXT_FILE_DIRECTORY);
                    console.log(filePath);
                    if (filePath) {
                        filePath = filePath.replace(/\\/g, "/");
                        if (!filePath.startsWith("/")) filePath = "/" + filePath;

                        var fullUrl = window.location.origin + filePath;
                        window.open(fullUrl, "_blank");
                    }

                    //for (var i = 0; i < dat.length; i++) {
                    //    var filePath = clsGlobal.parseToString(dat[i].TXT_FILE_DIRECTORY);

                    //    if (filePath) {
                    //        filePath = filePath.replace(/\\/g, "/");
                    //        if (!filePath.startsWith("/")) filePath = "/" + filePath;

                    //        var fullUrl = window.location.origin + filePath;
                    //        window.open(fullUrl, "_blank");
                    //    }

                    //}
                } else {
                    clsGlobal.setMessageWarning(retDat.txtMessage);
                }
            },
            error: function () {
                clsGlobal.hideLoading();
            }
        });
    }
}

// == TAB ACCOUNT TYPE ==
$("#btnAddAccountType").click(function () {
    p_AddAccountType();
});

$("#btnAddAttachment").click(function () {
    p_AddAttachment();
});

function p_AddAccountType(index_LOV, id, code, name) {
    clsGlobal.showLoading();
    $.ajax({
        type: "POST",
        url: "/Transaction/ONO/AddRowAccountType",
        data: { data: $("#txtHiddenObject").val(), __RequestVerificationToken: $('#frmONO input[name=__RequestVerificationToken]').val() },
        datatype: "json",
        success: function (retDat) {
            if (retDat.bitSuccess == true) {
                if (retDat.objData != undefined) {
                    p_SetHiddenObject(retDat.objData);
                    p_DataToUIAccountType(retDat.objData.XXSHP_KDS_T_ONO_ACY);
                    oTableAccountType.page('last').draw(false);
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

function p_AddAttachment(index_LOV, id, code, name) {
    clsGlobal.showLoading();
    $.ajax({
        type: "POST",
        url: "/Transaction/ONO/AddRowAttachment",
        data: { data: $("#txtHiddenObject").val(), __RequestVerificationToken: $('#frmONO input[name=__RequestVerificationToken]').val() },
        datatype: "json",
        success: function (retDat) {
            if (retDat.bitSuccess == true) {
                if (retDat.objData != undefined) {
                    p_SetHiddenObject(retDat.objData);
                    p_DataToUIAttachment(retDat.objData.XXSHP_KDS_T_ONO_ATT);
                    oTableAttachment.page('last').draw(false);
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

function p_DataToUIAccountType(XXSHP_KDS_T_ONO_ACY){
    oTableAccountType.clear();
    for (var i = 0; i < XXSHP_KDS_T_ONO_ACY.length; i++) {
        XXSHP_KDS_T_ONO_ACY[i].intIndex = i;
        oTableAccountType.row.add(XXSHP_KDS_T_ONO_ACY[i]);
    }
    oTableAccountType.draw(false);

    var objDat = p_GetHiddenObject();
    objDat.XXSHP_KDS_T_ONO_ACY = XXSHP_KDS_T_ONO_ACY;
    p_SetHiddenObject(objDat);
}

function p_DataToUIAttachment(XXSHP_KDS_T_ONO_ATT){
    oTableAttachment.clear();
    for (var i = 0; i < XXSHP_KDS_T_ONO_ATT.length; i++) {
        XXSHP_KDS_T_ONO_ATT[i].intIndex = i;
        oTableAttachment.row.add(XXSHP_KDS_T_ONO_ATT[i]);
    }
    oTableAttachment.draw(false);

    var objDat = p_GetHiddenObject();
    objDat.XXSHP_KDS_T_ONO_ATT = XXSHP_KDS_T_ONO_ATT;
    p_SetHiddenObject(objDat);
}

//=======================
// HANDLER
//=======================

$('#btnSave').bind('click', function () {
    try {
        clsGlobal.getConfirmation("Save this data?", function (result) {
            if (result == true) {
                if (p_GetHiddenObject().TXT_DOCNO.split('/').length < 4) {
                    p_saveData();
                } else {
                    p_updateDataSubUmbrand();
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
        //window.location.reload();
        p_showBlank();
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
});

$('#btnCopyValue').bind('click', function () {
    try {
        //debugger
        var dtBak = p_GetHiddenObject();

        //p_showBlank();

        dtBak.INT_ONO_HDR_ID = 0;
        dtBak.TXT_DOCNO = "";
        dtBak.TXT_REFDOCNO = "";
        dtBak.BIT_APPLY = "N"
        dtBak.BIT_APPROVED = "N"
        dtBak.BIT_REJECTED = "N"
        //p_SetHiddenObject(bak);
        //bak = p_GetHiddenObject();
        //p_DataToUI(bak);

        clsGlobal.showLoading();
        $.ajax({
            type: "POST",
            url: "/Transaction/ONO/InitiateData",
            data: { __RequestVerificationToken: $('#frmONO input[name=__RequestVerificationToken]').val() },
            datatype: "json",
            success: function (retDat) {

                if (retDat.bitSuccess == true) {
                    dtBak.txtGUID = retDat.txtGUID;
                    if (retDat.objData != undefined) {
                        p_SetHiddenObject(dtBak);
                        p_DataToUI(dtBak);
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
        LOV = clsGlobal.generateLOV(MODULE_ONO_REF, "txtRefDocNo"); //MODULE_APPROVALHIERARCHY
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }


});


$('#btnFind').bind('click', function () {
    try {
        bitReject = false;
        LOV = clsGlobal.generateLOV(MODULE_ONO, "txtDocNo"); //MODULE_APPROVALHIERARCHY
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
});

$('#btnFindReject').bind('click', function () {
    try {
        bitReject = true;
        LOV = clsGlobal.generateLOV(MODULE_ONO, "txtDocNo", "REJECT"); //MODULE_APPROVALHIERARCHY
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
        LOV = clsGlobal.generateLOV(MODULE_MTBUDGETTYPE, "txtBudgetType", "ONO");
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
});

$('#btnLOVRefDocNo').bind('click', function () {
    try {
        LOV = clsGlobal.generateLOV(LOV_ONO_BY_BIT_ADDENDUM, "btnLOVRefDocNo", false);
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
    $("#dtEffectiveFrom").val(clsGlobal.parseToDateTimeFromJSON(e.date, clsDateFormat)); //
});

$("#btndtEffectiveTo").on("changeDate", function (e) {
    $("#dtEffectiveTo").val(clsGlobal.parseToDateTimeFromJSON(e.date, clsDateFormat));
});


$('#btnApprovalHistory').bind('click', function () {
    try {
        var fancyboxdata = p_GetHiddenObject();
        LOV = clsGlobal.generatePopUpIframeSmall($(location).attr('protocol') + "//" + $(location).attr('host') + "/Master/ApprovalHistory/Index?TXT_TYPEDOC=" + "&TXT_REF_DOCNO=" + fancyboxdata.TXT_DOCNO + "&INT_DOCID=" + fancyboxdata.INT_ONO_HDR_ID, "btnApprovalHistory", fancyboxdata);

    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
});

$('#btnAddendumHistory').bind('click', function () {
    try {
        var fancyboxdata = p_GetHiddenObject();
        LOV = clsGlobal.generatePopUpIframeSmall($(location).attr('protocol') + "//" + $(location).attr('host') + "/Transaction/ONO/AddendumHistory?TXT_DOCNO=" + fancyboxdata.TXT_DOCNO, fancyboxdata);

    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
});

$('#btnCheckBudget').click(function () {
    try {
        var fancyboxdata = p_GetHiddenObject();
        var INT_ONO_HDR_ID = fancyboxdata.INT_ONO_HDR_ID;

        if (INT_ONO_HDR_ID == 0 || INT_ONO_HDR_ID == null) {
            throw "Untuk data yang lebih akurat, silahkan save data terlebih dahulu sebelum check budget!";
        }
        //LOV = clsGlobal.generateLOV(LOV_ONO_CHECK_BUDGET, "btnLOVRefDocNo", INT_ONO_HDR_ID);
        LOV = clsGlobal.generatePopUpIframe($(location).attr('protocol') + "//" + $(location).attr('host') + "/Transaction/ONO/CheckBudget?INT_ONO_HDR_ID=" + INT_ONO_HDR_ID, fancyboxdata);
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



$("#btnApprove").on("click", function (e) {
    try {
        clsGlobal.getConfirmation("Approve this document?", function (result) {
            if (result == true) {
                p_updateDataSubUmbrand(true);
            }
            else {
                return false;
            }
        });
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
});

$("#btnReject").on("click", function (e) {
    try {
        $("#mdlRejectReason").modal("show");
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
});

$("#btnRejectDo").on("click", function (e) {
    try {
        var dat = p_GetHiddenObject();
        dat.TXT_REJECT_REASON = $("#txtRejectReason").val();
        p_SetHiddenObject(dat);
        $("#mdlRejectReason").modal("hide");
        p_updateDataSubUmbrand(false);
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


$("#btnClearExcel").on("click", function (e) {
    $("#fllExcel").val("");
});

$("#btnDownloadTemplate").on("click", function (e) {
    clsGlobal.showLoading();
    p_UIToData();

    var data = new FormData();
    data.append("data", $("#txtHiddenObject").val());
    data.append("txtGUID", $("#txtGUID").val());
    data.append("__RequestVerificationToken", $('#frmONO input[name=__RequestVerificationToken]').val());

    $.ajax({
        type: "POST",
        url: "/Transaction/ONO/DownloadExcel",
        processData: false,
        contentType: false,
        data: data,
        datatype: "json",
        success: function (result) {
            if (result.bitSuccess) {
                window.location = result.objData;
                clsGlobal.hideLoading();
            } else {
                clsGlobal.hideLoading();
                clsGlobal.showAlert(result.txtMessage);
            }
        },
        error: function (retDat) {

            clsGlobal.hideLoading();
        }
    });
});

//$("#btnCheckBudget").on("click", function (e) {
//    $("#mdlCheckBudget").modal('show');
//});

$('#mdlCheckBudget').on('show.bs.modal', function () {
    var onoData = p_UIToData();
    clsGlobal.showLoading();
    $.ajax({
        url: '/Transaction/ONO/CheckBudget', // endpoint
        type: 'POST',
        data: { __RequestVerificationToken: $('#frmONO input[name=__RequestVerificationToken]').val(), data: onoData },
        success: function (res) {
            if (res.success) {
                var tbody = $("#tblCheckBudget tbody");
                tbody.empty();

                $.each(res.data, function (i, item) {
                    var row = "<tr>" +
                        "<td>" + (i + 1) + "</td>" +
                        "<td>" + item.TXT_SUBUMBRAND + "</td>" +
                        "<td class='text-right'>" + 'Rp. ' + clsGlobal.FormatMoney(Number(item.AmountSubUmbrandBudgetBesar), 0) + "</td>" +
                        "<td class='text-right'>" + 'Rp. ' + clsGlobal.FormatMoney(Number(item.AmountSubUmbrandONOBudget), 0) + "</td>" +
                        "<td class='text-right'>" + 'Rp. ' + clsGlobal.FormatMoney(Number(item.EstimateEndingBalance), 0) + "</td>" +
                        "</tr>";
                    tbody.append(row);
                });
                clsGlobal.hideLoading();
            } else {
                $("#mdlCheckBudget").modal('hide');
                clsGlobal.showAlert(res.message);
                clsGlobal.hideLoading();
            }
        },
        error: function () {
            clsGlobal.showAlert("Failed to load budget data.");
            clsGlobal.hideLoading();
        }
    });
});
