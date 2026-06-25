//=======================
// VARIABLE GLOBAL
//=======================
var clsGlobal = new clsGlobalClass();
var LOV;
var bitLoading = false;
//var oTableDetail;


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
    $("#txtID").val(clsGlobal.parseToInteger(objData.INT_FPR_HDR_ID));
    $("#txtDocNo").val(clsGlobal.parseToString(objData.TXT_DOCNO));
      
    $("#dtmDate").val(clsGlobal.parseToDateTimeFromJSON(objData.CREATION_DATE, clsDateFormat));    
    $("#lblStatusFlow").html(clsGlobal.parseToString(objData.TXT_STATUSFLOW));     
    $("#txtRemark").val(clsGlobal.parseToString(objData.TXT_REMARK));
    p_PopulateMasaPajakAndSet(clsGlobal.parseToString(objData.TXT_MASA_PAJAK.toString()));

    p_DataToUIDetail(objData.XXSHP_KDS_T_FPR_DTL);
    p_EnableControl(clsGlobal.ParseBooleanOracleToNET(objData.BIT_APPLY));
    p_SetHiddenObject(objData);
     
}


function p_PopulateMasaPajakAndSet(txtValue) {
    clsGlobal.showLoading();
    $.ajax({
        type: "POST",
        url: "/Transaction/FPR/PopulateMasaPajak",
        data: { __RequestVerificationToken: $('#frmIndex input[name=__RequestVerificationToken]').val() },
        datatype: "json",
        success: function (retDat) {
            if (retDat.bitSuccess == true) {
                if (retDat.objData != undefined) {
                    $('#ddlMasaPajak').empty();
                    $('#ddlMasaPajak').append($('<option>').text("-").prop('value', "0"));
                    for (var i = 0; i < retDat.objData.textList.length; i++) {
                        $('#ddlMasaPajak').append($('<option>').text(retDat.objData.textList[i]).prop('value', retDat.objData.valueList[i]));
                    } 
                    if (txtValue != "") {
                        $("#ddlMasaPajak").val(txtValue);
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
    $('.autonumeric').autoNumeric('init', { vMax: '9999999999999', vMin: '-9999999999999', aSep: ',', dGroup: '3', aDec: '.' });
}

function p_GetHiddenObject() {
    return JSON.parse($("#txtHiddenObject").val());
}

function p_DataToUIDetail(XXSHP_KDS_T_FPR_DTL) {
   
    //
    oTable.clear();
     
    for (var i = 0; i < XXSHP_KDS_T_FPR_DTL.length; i++) {
        XXSHP_KDS_T_FPR_DTL[i].intIndex = i;
        oTable.row.add(XXSHP_KDS_T_FPR_DTL[i]);
    }
    oTable.draw(false);

    var objDat = p_GetHiddenObject();
    objDat.XXSHP_KDS_T_FPR_DTL = XXSHP_KDS_T_FPR_DTL;
    p_SetHiddenObject(objDat); 
}

function p_initiateData() {
    clsGlobal.showLoading();
    $.ajax({
        type: "POST",
        url: "/Transaction/FPR/InitiateData",
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
    
    jsonData.INT_FPR_HDR_ID = clsGlobal.parseToInteger($("#txtID").val());
    jsonData.TXT_DOCNO = clsGlobal.parseToString($("#txtDocNo").val());
    jsonData.TXT_REMARK = $("#txtRemark").val().toString();
    jsonData.TXT_MASA_PAJAK = $("#ddlMasaPajak").val().toString();
     
    p_SetHiddenObject(jsonData);
    return $("#txtHiddenObject").val();

}


function p_EnableControl(bitApply, bitApproved) {
    //
    if (bitApply == true) {
        // Sudah apply dan sudah approved.
        $("#btnSave").hide();
        $("#btnSubmit").hide();
        $("#btnDelete").hide();
        $("#btnClose").show();
        $("#btnPrint").show();
        $("#btnAddDetail").hide(); 
        $("#txtRemark").attr("disabled", "true");
        $("#ddlMasaPajak").attr("disabled", "true");
        $(".btnDetailDelete").each(function (index) {
            $(this).hide();
        });  
   
    } else
    {
        $("#btnSave").show();
        $("#btnSubmit").show();
        $("#btnDelete").hide();  
        $("#btnAddDetail").show();
        $("#btnClose").hide();
        $("#btnPrint").hide();
        $("#txtRemark").removeAttr("disabled");
        $("#ddlMasaPajak").removeAttr("disabled");
        $(".btnDetailDelete").each(function (index) {
            $(this).removeAttr("disabled");
        }); 
    }
}

function p_txtID_TextChanged() {
    clsGlobal.showLoading();
    $.ajax({
        type: "POST",
        url: "/Transaction/FPR/GetData",
        data: { txtID: $("#txtID").val(), __RequestVerificationToken: $('#frmIndex input[name=__RequestVerificationToken]').val() },
        datatype: "json",
        success: function (retDat) {

            if (retDat.bitSuccess == true) {
                if (retDat.objData != undefined) {
                    p_DataToUI(retDat.objData);

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
    $.ajax({
        type: "POST",
        url: "/Transaction/FPR/SaveData",
        data: { data: $("#txtHiddenObject").val(), txtGUID: $("#txtGUID").val(), __RequestVerificationToken: $('#frmIndex input[name=__RequestVerificationToken]').val() },
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

function p_submitData() {
  
    clsGlobal.showLoading();
    p_UIToData();
     
    $.ajax({
        type: "POST",
        url: "/Transaction/FPR/SubmitData",
        data: { data: $("#txtHiddenObject").val(), txtGUID: $("#txtGUID").val(), __RequestVerificationToken: $('#frmIndex input[name=__RequestVerificationToken]').val() },
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

function p_deleteData() {
    clsGlobal.showLoading();
    p_UIToData();
    $.ajax({
        type: "POST",
        url: "/Transaction/FPR/DeleteData",
        data: { data: $("#txtHiddenObject").val(), __RequestVerificationToken: $('#frmIndex input[name=__RequestVerificationToken]').val() },
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
        url: "/Transaction/FPR/PrintoutToPDF",
        data: { data: $("#txtHiddenObject").val(), txtGUID: $("#txtGUID").val(), __RequestVerificationToken: $('#frmIndex input[name=__RequestVerificationToken]').val() },
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
        url: "/Transaction/FPR/AddRow",
        data: { data: $("#txtHiddenObject").val(), txtGUID: $("#txtGUID").val(), __RequestVerificationToken: $('#frmIndex input[name=__RequestVerificationToken]').val() },
        datatype: "json",
        success: function (retDat) {

            if (retDat.bitSuccess == true) {
                if (retDat.objData != undefined) {
                    p_SetHiddenObject(retDat.objData);
                    p_DataToUIDetail(retDat.objData.XXSHP_KDS_T_FPR_DTL, false);
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

function p_AddFP() { 
    var fancyboxdata = p_GetHiddenObject();
    LOV = clsGlobal.generatePopUpIframe($(location).attr('protocol') + "//" + $(location).attr('host') + "/Transaction/FPR/AddDetail?txtMasaPajak=" + $("#ddlMasaPajak").val() , "btnAddDetail", fancyboxdata);    
}

function p_closeData() {

    clsGlobal.showLoading();
    p_UIToData();
     
    $.ajax({
        type: "POST",
        url: "/Transaction/FPR/CloseData",
        data: { data: $("#txtHiddenObject").val(), txtGUID: $("#txtGUID").val(), __RequestVerificationToken: $('#frmIndex input[name=__RequestVerificationToken]').val() },
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
                   return '<div id="lblDetail"> ' + full.TXT_GROUP_ACCOUNT + ' </div>';
               }
           },
           {
               aTargets: [2],
               mRender: function (data, type, full) {
                   return '<div id="lblDetail"> ' + full.TXT_OUTLET + ' </div>';
               }
           },
           {
               aTargets: [3],
               mRender: function (data, type, full) {
                   return '<div id="lblDetail"> ' + full.TXT_SUPPLIER_NAME + ' </div>';
               }
           },
           {
               aTargets: [4],
               mRender: function (data, type, full) {
                   return '<div id="lblDetail"> ' + full.TXT_FKT_PJK_NO + ' </div>';

               }
           },
           {
               aTargets: [5],
               mRender: function (data, type, full) {
                   return '<div id="lblDetail"> ' + clsGlobal.parseToDateTimeFromJSON(full.DTM_FKT_PJK, clsDateFormat) + ' </div>';

               }
           },
            {
                aTargets: [6],
                mRender: function (data, type, full) {
                    return '<div id="lblDetail" class="text-right"> ' + clsGlobal.FormatMoney(full.DEC_INVOICE_AMT,0) + ' </div>';
                }
            },
            {
                aTargets: [7],
                mRender: function (data, type, full) {
                    return '<div id="lblDetail" class="text-right"> ' + clsGlobal.FormatMoney(full.DEC_PPN, 0) + ' </div>';
                }
            },
            {
                aTargets: [8],
                mRender: function (data, type, full) {
                    return '<div id="lblDetail"> ' + full.TXT_KLAIM_DOCNO + ' </div>';
                }
            },
            {
                aTargets: [9],
                mRender: function (data, type, full) {
                    return '<div id="lblDetail"> ' + full.TXT_INVOICE_NO + ' </div>';
                }
            },
            {
                aTargets: [10],
                mRender: function (data, type, full) {
                    return '<div > <input type="button" class="btn btn-warning btnDetailDelete" id="btnDetailDelete" onclick="p_btnDetailDelete_Click(this,' + full.intIndex + ')"  value="Delete" >  </div>';
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
}

function p_GetSelectedDetailRow() {
    var intIndex = clsGlobal.parseToInteger(oTable.$('tr.selected').find("#lblDetailNoValue").html()) - 1;
    return intIndex;
}
    
function p_btnDetailDelete_Click(objCaller, intIndex) {
    //
    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());
    for (i = 0; i < objData.XXSHP_KDS_T_FPR_DTL.length; i++) {
        // Cari Index-nya.
        if (objData.XXSHP_KDS_T_FPR_DTL[i].intIndex == intIndex) {
            // Ketemu, mulai dari sini:
            // Remove from list.
            objData.XXSHP_KDS_T_FPR_DTL.splice(i, 1);

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
        LOV = clsGlobal.generateLOV(MODULE_FPR, "txtID");
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

$('#btnAddDetail').on('click', function () {
    try {
        p_AddFP();
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
        clsGlobal.getConfirmation("Close this document?", function (result) {
            if (result == true) {
                p_closeData();
            }
            else {
                return false;
            }
        });
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
});
 