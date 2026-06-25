//     BUDGET ALLOCATION RECLAS SCRIPT 
//
//
//      History.
//
//      29-Agustus-2019                    Initial version.            (nosa)
//


//=======================
// VARIABLE GLOBAL
//=======================
var clsGlobal = new clsGlobalClass();
var LOV;
var bitLoading = false; 
var oTableDetail; 


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
    //p_showPrevData(); 
    p_InitiateDetail(); 
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
        case "txtGroupAccountFrom":
            $("#txtGroupAccountFrom").val(arr[1]);
            break;
        case "txtGroupAccountTo":
            $("#txtGroupAccountTo").val(arr[1]);
            break;
        case "txtBudgetType":
            $("#txtBudgetType").val(arr[1]); 
            break;
        case "txtPeriodMonthFrom":
            $("#txtPeriodMonthFrom").val(arr[1]);
            break; 
        case "txtPeriodMonthTo":
            $("#txtPeriodMonthTo").val(arr[1]);
            break; 
        case "txtDetailCode":
            p_settxtDetailCode(arr[1], arr[2], arr[3], arr[4]);
            break;  
    }
    clsGlobal.closeLOV();
}

function p_DataToUI(objData) {
    $("#txtDocNo").val(clsGlobal.parseToString(objData.TXT_DOCNO));
    $("#dtmDate").val(clsGlobal.parseToDateTimeFromJSON(objData.CREATION_DATE, clsDateFormat));
    
    $("#txtBudgetType").val(clsGlobal.parseToString(objData.TXT_BUDGET_TYPE));
    $("#txtGroupAccountFrom").val(clsGlobal.parseToString(objData.TXT_GROUP_ACCOUNT_FROM));
    $("#txtGroupAccountTo").val(clsGlobal.parseToString(objData.TXT_GROUP_ACCOUNT_TO));
    $("#txtPeriodMonthFrom").val(clsGlobal.parseToString(objData.TXT_PERIOD_FROM));
    $("#txtPeriodMonthTo").val(clsGlobal.parseToString(objData.TXT_PERIOD_TO));
    $("#txtReason").val(clsGlobal.parseToString(objData.TXT_REASON));
      
    $("#lblStatusFlow").html(clsGlobal.parseToString(objData.TXT_STATUSFLOW));

    p_DataToUIDetail(objData.XXSHP_KDS_M_BRCALO_SUM); 

    p_EnableControl(clsGlobal.ParseBooleanOracleToNET(objData.BIT_APPLY), objData);
    
    p_SetHiddenObject(objData);

    if ($("#txtID").val() == "" || $("#txtID").val() == "0") {
        $("#btnDelete").hide();
    } else {
        $("#btnDelete").show();
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
    
    $('.datetimepicker').datepicker({
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
        url: "/Master/BudgetAllocationReclass/InitiateData",
        data: { __RequestVerificationToken: $('#frmIndex input[name=__RequestVerificationToken]').val() },
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
    jsonData.TXT_BUDGET_TYPE = clsGlobal.parseToString($("#txtBudgetType").val());
    jsonData.TXT_GROUP_ACCOUNT_FROM = clsGlobal.parseToString($("#txtGroupAccountFrom").val());
    jsonData.TXT_GROUP_ACCOUNT_TO = clsGlobal.parseToString($("#txtGroupAccountTo").val());
    jsonData.TXT_PERIOD_FROM = clsGlobal.parseToString($("#txtPeriodMonthFrom").val());
    jsonData.TXT_PERIOD_TO = clsGlobal.parseToString($("#txtPeriodMonthTo").val());
    jsonData.TXT_REASON = clsGlobal.parseToString($("#txtReason").val());
    
    p_SetHiddenObject(jsonData);
    return $("#txtHiddenObject").val();

}


function p_EnableControl(bitApply, objDat) {
    
    if (bitApply == true) {
        $("#btnSave").hide();
        $("#btnSubmit").hide();
        $("#btnApprovalHistory").show();

        $("#btnLOVBudgetType").hide();
        $("#btnLOVGroupAccountFrom").hide();
        $("#btnLOVGroupAccountTo").hide();
        $("#btnLOVPeriodMonthFrom").hide();
        $("#btnLOVPeriodMonthTo").hide();

        $("#btnAddDetail").hide();
        $(".btnDetailEdit").each(function (index) {
            $(this).hide();
        });
        $(".btnDetailDelete").each(function (index) {
            $(this).hide();
        });  
    } else {
        $("#btnSave").show();
        $("#btnSubmit").show(); 

        $("#btnLOVBudgetType").show(); 
        $("#btnLOVGroupAccountFrom").show();
        $("#btnLOVGroupAccountTo").show();
        $("#btnLOVPeriodMonthFrom").show();
        $("#btnLOVPeriodMonthTo").show(); 
            
        $("#btnAddDetail").show(); 
        $(".btnDetailEdit").each(function (index) {
            $(this).show();
        });
        $(".btnDetailDelete").each(function (index) {
            $(this).show();
        }); 
    }
}

function p_txtDocNo_TextChanged() {
    clsGlobal.showLoading();
    $.ajax({
        type: "POST",
        url: "/Master/BudgetAllocationReclass/GetDataByTxtDocNo",
        data: { txtDocNo: $("#txtDocNo").val(), __RequestVerificationToken: $('#frmIndex input[name=__RequestVerificationToken]').val() },
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
        url: "/Master/BudgetAllocationReclass/SaveData",
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
        url: "/Master/BudgetAllocationReclass/SubmitData",
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

function p_DataToUIDetail(XXSHP_KDS_M_BRCALO_SUM) {
    
    oTableDetail.clear();
    for (var i = 0; i < XXSHP_KDS_M_BRCALO_SUM.length; i++) {
        XXSHP_KDS_M_BRCALO_SUM[i].intIndex = i;
        oTableDetail.row.add(XXSHP_KDS_M_BRCALO_SUM[i]);
    }
    oTableDetail.draw(false);

    var objDat = p_GetHiddenObject();
    objDat.XXSHP_KDS_M_BRCALO_SUM = XXSHP_KDS_M_BRCALO_SUM;
    p_SetHiddenObject(objDat);
}


$('#btnAddDetail').on('click', function () {
    try{
        p_AddRowDetail();
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
});

function p_AddRowDetail() {
    //
    //p_UIToData();
    //var objData = p_GetHiddenObject(); 

    //clsGlobal.showLoading(); 
    //$.ajax({
    //    type: "POST",
    //    url: "/Master/BudgetAllocationReclass/AddRowDetail",
    //    data: { data: $("#txtHiddenObject").val(), __RequestVerificationToken: $('#frmIndex input[name=__RequestVerificationToken]').val() },
    //    datatype: "json",
    //    success: function (retDat) {

    //        if (retDat.bitSuccess == true) {
    //            if (retDat.objData != undefined) {
    //                p_SetHiddenObject(retDat.objData);
    //                p_DataToUIDetail(retDat.objData.XXSHP_KCO_M_BRCALO_SUM);
    //                oTableDetail.page('last').draw(false);
    //            }
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

    p_UIToData(); 
    var fancyboxdata = p_GetHiddenObject();
    LOV = clsGlobal.generatePopUpIframe($(location).attr('protocol') + "//" + $(location).attr('host') + "/Master/BudgetAllocationReclass/Detail?intIndex=0&txtSubumbrandFrom=&txtSubumbrandTo=" , "btnDetailEdit", fancyboxdata);    
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
                   return '<div id="lblDetailUmbrandFrom"> ' + full.TXT_UMBRAND_FROM + ' </div>';
               }
           },
           {
               aTargets: [2],
               mRender: function (data, type, full) {
                   return '<div id="lblDetailUmbrandFrom"> ' + full.TXT_SUBUMBRAND_FROM + ' </div>';
               }
           },
           {
               aTargets: [3],
               mRender: function (data, type, full) {
                   return '<div id="lblDetailUmbrandFrom autonumeric text-right"> ' +  clsGlobal.FormatMoney(full.DEC_AVAILABLE, 0) + ' </div>';
               }
           },
           {
               aTargets: [4],
               mRender: function (data, type, full) {
                   return '<div id="lblDetailUmbrandFrom "> ' + full.TXT_UMBRAND_TO + ' </div>';
               }
           }, 
           {
               aTargets: [5],
               mRender: function (data, type, full) {                  
                   return '<div id="lblDetailUmbrandFrom"> ' + full.TXT_SUBUMBRAND_TO + ' </div>';
               }
           },
           {
               aTargets: [6],
               mRender: function (data, type, full) {                   
                   return '<div id="lblDetailUmbrandFrom autonumeric text-right"> ' + clsGlobal.FormatMoney(full.DEC_TRANSFER, 0) + ' </div>';
               }
           },
            {
                aTargets: [7],
                mRender: function (data, type, full) {
                    return '<div > '
                        + ' <input type="button" class="btn btn-warning btnDetailEdit" id="btnDetailEdit" onclick="p_btnDetailEdit_Click(this,' + full.intIndex + ')"  value="Edit" >  '
                            + ' <input type="button" class="btn btn-warning btnDetailDelete" id="btnDetailDelete" onclick="p_btnDetailDelete_Click(this,' + full.intIndex + ')"  value="Delete" >  ' 
                            + ' </div>';
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

function p_GetSelectedDetailRow() {
    var intIndex = clsGlobal.parseToInteger(oTableDetail.$('tr.selected').find("#lblDetailNoValue").html()) - 1;
    return intIndex;
}
  
function p_btnDetailEdit_Click(objCaller, intIndex) {
    
    try {
        // Parse dari HiddenObject->JSON
        var objData = JSON.parse(p_UIToData());
        for (i = 0; i < objData.XXSHP_KDS_M_BRCALO_SUM.length; i++) {
            // Cari Index-nya.
            if (objData.XXSHP_KDS_M_BRCALO_SUM[i].intIndex == intIndex) {
                // Ketemu, mulai dari sini:
                 
                var fancyboxdata = p_GetHiddenObject();
                var txtSubumbrandFrom =  encodeURI(objData.XXSHP_KDS_M_BRCALO_SUM[i].TXT_SUBUMBRAND_FROM);
                var txtSubumbrandTo = encodeURI(objData.XXSHP_KDS_M_BRCALO_SUM[i].TXT_SUBUMBRAND_TO);
                LOV = clsGlobal.generatePopUpIframe($(location).attr('protocol') + "//" + $(location).attr('host') + "/Master/BudgetAllocationReclass/Detail?intIndex=" + intIndex + "&txtSubumbrandFrom=" + txtSubumbrandFrom + "&txtSubumbrandTo=" + txtSubumbrandTo , "btnDetailEdit", fancyboxdata);
                break;
            }
        }
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
}

function p_setbtnDetailEdit() {
    
    var intSelectedIndex = p_GetSelectedDetailRow();
    var intRowIndex = 0;
    var objDat = p_GetHiddenObject();
     
    clsGlobal.showLoading();
    $.ajax({
        type: "POST",
        url: "/Master/BudgetAllocationReclass/RefreshSummary",
        data: { data: $("#txtHiddenObject").val(), txtID: $("#txtSupplierSiteID").val(), __RequestVerificationToken: $('#frmIndex input[name=__RequestVerificationToken]').val() },
        datatype: "json",
        success: function (retDat) {

            if (retDat.bitSuccess == true) {
                if (retDat.objData != undefined) { 
                    p_DataToUIDetail(retDat.objData.XXSHP_KDS_M_BRCALO_SUM);
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

    //// Show ke table.
    //oTableDetail.rows().every(function (rowIdx, tableLoop, rowLoop) {
    //    
    //    var d = this.data();
    //    if (intRowIndex == intSelectedIndex) {
    //        d.intIndex = intRowIndex; // update data source for the row 

    //        d.TXT_UMBRAND_FROM = objDat.XXSHP_KCO_M_BRCALO_SUM[intSelectedIndex].TXT_UMBRAND_FROM;
    //        d.TXT_SUBUMBRAND_FROM = objDat.XXSHP_KCO_M_BRCALO_SUM[intSelectedIndex].TXT_SUBUMBRAND_FROM;
    //        d.DEC_AVAILABLE = objDat.XXSHP_KCO_M_BRCALO_SUM[intSelectedIndex].DEC_AVAILABLE;
    //        d.TXT_UMBRAND_TO = objDat.XXSHP_KCO_M_BRCALO_SUM[intSelectedIndex].TXT_UMBRAND_TO;
    //        d.TXT_SUBUMBRAND_TO = objDat.XXSHP_KCO_M_BRCALO_SUM[intSelectedIndex].TXT_SUBUMBRAND_TO
    //        d.DEC_TRANSFER = objDat.XXSHP_KCO_M_BRCALO_SUM[intSelectedIndex].DEC_TRANSFER;

    //        this.invalidate(); // invalidate the data DataTables has cached for this row         
    //        p_EnableControl(clsGlobal.ParseBooleanOracleToNET(objDat.BIT_APPLY), objDat);
    //    }

    //    intRowIndex++;
    //});

    //p_SetHiddenObject(objDat);
}
 
function p_btnDetailDelete_Click(objCaller, intIndex) {
    
    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());
    var txtSubumbrandFrom = "";
    var txtSubumbrandTo = "";
    for (i = 0; i < objData.XXSHP_KDS_M_BRCALO_SUM.length; i++) {
        // Cari Index-nya.
        if (objData.XXSHP_KDS_M_BRCALO_SUM[i].intIndex == intIndex) {
            // Ketemu, mulai dari sini:

            txtSubumbrandFrom = objData.XXSHP_KDS_M_BRCALO_SUM[i].TXT_SUBUMBRAND_FROM;
            txtSubumbrandTo = objData.XXSHP_KDS_M_BRCALO_SUM[i].TXT_SUBUMBRAND_TO;

            // Remove from list.
            objData.XXSHP_KDS_M_BRCALO_SUM.splice(i, 1);
             
            oTableDetail.row(i).remove().draw(false);
            break;
        }
    }
     
    // Sebelum hapus di list SUmmary, )
    for (i = 0; i < objData.XXSHP_KDS_M_BRCALO_DTL.length; i++) {
        if (objData.XXSHP_KDS_M_BRCALO_DTL[i].TXT_SUBUMBRAND_FROM == txtSubumbrandFrom
            && objData.XXSHP_KDS_M_BRCALO_DTL[i].TXT_SUBUMBRAND_TO == txtSubumbrandTo) {
            // Remove from list.
            objData.XXSHP_KDS_M_BRCALO_DTL.splice(i, 1);
        }
    }

    p_SetHiddenObject(objData);
    p_RefreshNumberDetail();
}

function p_RefreshNumberDetail() {
    
    var intRowIndex = 0;
    var objDat = p_GetHiddenObject();
    oTableDetail.rows().every(function (rowIdx, tableLoop, rowLoop) {
        
        var d = this.data();
        d.intIndex = intRowIndex; // update data source for the row
        objDat.XXSHP_KDS_M_BRCALO_SUM[intRowIndex].intIndex = d.intIndex;

        d.TXT_UMBRAND_FROM = objDat.XXSHP_KDS_M_BRCALO_SUM[intSelectedIndex].TXT_UMBRAND_FROM;
        d.TXT_SUBUMBRAND_FROM = objDat.XXSHP_KDS_M_BRCALO_SUM[intSelectedIndex].TXT_SUBUMBRAND_FROM;
        d.DEC_AVAILABLE = objDat.XXSHP_KDS_M_BRCALO_SUM[intSelectedIndex].DEC_AVAILABLE;
        d.TXT_UMBRAND_TO = objDat.XXSHP_KDS_M_BRCALO_SUM[intSelectedIndex].TXT_UMBRAND_TO;
        d.TXT_SUBUMBRAND_TO = objDat.XXSHP_KDS_M_BRCALO_SUM[intSelectedIndex].TXT_SUBUMBRAND_TO
        d.DEC_TRANSFER = objDat.XXSHP_KDS_M_BRCALO_SUM[intSelectedIndex].DEC_TRANSFER;

        intRowIndex++;
        this.invalidate(); // invalidate the data DataTables has cached for this row         
    });

    // Draw once all updates are done
    oTableDetail.draw(false);
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
        LOV = clsGlobal.generateLOV(MODULE_BUDGETALLOCATIONRECLASS, "txtDocNo");  
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
});

 

$('#btnLOVGroupAccountFrom').bind('click', function () {
    try {
        LOV = clsGlobal.generateLOV(LOV_GROUP_ACCOUNT, "txtGroupAccountFrom");
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
});

$('#btnLOVGroupAccountTo').bind('click', function () {
    try {
        LOV = clsGlobal.generateLOV(LOV_GROUP_ACCOUNT, "txtGroupAccountTo");
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
});


$('#btnLOVPeriodMonthFrom').bind('click', function () {
    try {
        LOV = clsGlobal.generateLOV(LOV_BUDGETALLOCATION_GETPERIOD_BYGROUPACCOUNT, "txtPeriodMonthFrom", $("#txtGroupAccountFrom").val() + "|" + $("#txtBudgetType").val());
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
});

$('#btnLOVPeriodMonthTo').bind('click', function () {
    try {
        LOV = clsGlobal.generateLOV(LOV_BUDGETALLOCATION_GETPERIOD_BYGROUPACCOUNT, "txtPeriodMonthTo", $("#txtGroupAccountTo").val() + "|" + $("#txtBudgetType").val());
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
 
$('#btnApprovalHistory').bind('click', function () {
    try {
        var fancyboxdata = p_GetHiddenObject();
        LOV = clsGlobal.generatePopUpIframeSmall($(location).attr('protocol') + "//" + $(location).attr('host') + "/Master/ApprovalHistory/Index?TXT_TYPEDOC=" + "&TXT_REF_DOCNO=" + fancyboxdata.TXT_DOCNO + "&INT_DOCID=" + fancyboxdata.INT_BRCALO_HDR_ID, "btnApprovalHistory", fancyboxdata);

    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
});
 