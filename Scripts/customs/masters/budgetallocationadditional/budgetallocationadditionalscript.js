//=======================
// VARIABLE GLOBAL
//=======================
var clsGlobal = new clsGlobalClass();
var LOV;
var bitLoading = false;
var adaID = false;

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
        case "txtID": $("#txtID").val(arr[1]);
            p_txtID_TextChanged();
            break;
        case "txtDocNo": $("#txtDocNo").val(arr[1]);
            p_txtDocNo_TextChanged();
            break;
        case "txtReffDocNo": $("#txtReffDocNo").val(arr[1]);
            var modelHidden = p_GetHiddenObject();
            modelHidden.TXT_GROUP_ACCOUNT = arr[5];
            modelHidden.TXT_PERIOD = arr[3];
            modelHidden.TXT_BUDGET_TYPE = arr[6];
            modelHidden.INT_BGT_HDR_ID = arr[2];
            p_SetHiddenObject(modelHidden);
            p_txtReffDocNo_TextChanged();
            break;
    }
    clsGlobal.closeLOV();
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
        url: "/Master/BudgetAllocationAddition/InitiateData",
        data: { __RequestVerificationToken: $('#frmBudgetAllocationAddition input[name=__RequestVerificationToken]').val() },
        datatype: "json",
        success: function (retDat) {

            if (retDat.bitSuccess == true) {
                if (retDat.objData != undefined) {
                    adaID = false;
                    $("#txtHiddenObject").val(JSON.stringify(retDat.objData));
                    p_DataToUI(retDat.objData);
                    $("#txtBlankObject").val(JSON.stringify(retDat.objData));
                    $("#txtGUID").val(retDat.txtGUID);

                    p_getParameterID();
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

function p_getParameterID() {
    var id = $.getParameter("ID");
    if (id != undefined) {
        $("#txtDocNo").val(id);
        p_txtDocNo_TextChanged();
    }
}

function p_InitiateDetail() {
    // Format datatable  
    
    oTableDetail = $('#dtDetail').DataTable({
        "bPaginate": true,
        "bSort": false,
        searching: true,
        "type": "POST",
        "aLengthMenu": [[5, 10, 25, 50, 75, 100], [5, 10, 25, 50, 75, 100]],
        "iDisplayLength": 5,
        aoColumnDefs: [

              {
                  aTargets: [0],
                  mRender: function (data, type, full) {
                      return '<div > ' + (full.intIndex + 1) + ' </div>';
                  }
              },
              {
                  aTargets: [1],
                  mRender: function (data, type, full) {
                      return '<div > <input type="text" class="form-control " id="txtPeriodMonth' + full.intIndex + '" class="txtPeriodMonth" onchange="p_txtPeriodMonth_Changed(this,' + full.intIndex + ')"  value="' + full.TXT_PERIOD_MONTH
                          + '" disabled> </div> <div style="display:none;"> ' + full.TXT_PERIOD_MONTH + ' </div>';

                  }
              },
              {
                  aTargets: [2],
                  mRender: function (data, type, full) {
                      return '<div > <input type="text" class="form-control " id="txtUmBrand' + full.intIndex + '" class="txtUmBrand" onchange="p_txtUmBrand_Changed(this,' + full.intIndex + ')"  value="' + full.TXT_UMBRAND
                          + '" disabled> </div> <div style="display:none;"> ' + full.TXT_UMBRAND + ' </div>';

                  }
              },
           {
               aTargets: [3],
               mRender: function (data, type, full) {
                   return '<div > <input type="text" class="form-control " id="txtSubUmBrand' + full.intIndex + '" class="txtSubUmBrand" onchange="p_txtSubUmBrand_Changed(this,' + full.intIndex + ')"  value="' + full.TXT_SUBUMBRAND
                       + '" disabled> </div> <div style="display:none;"> ' + full.TXT_SUBUMBRAND + ' </div>';

               }
           },           
            {
                aTargets: [4],
                mRender: function (data, type, full) {
                    return '<div >  <input type="text" class="form-control" id="txtLOB' + full.intIndex + '" class="txtLOB" onchange="p_txtLOB_Changed(this,' + full.intIndex + ')"  value="' + full.TXT_LOB + '" disabled>  </div> <div style="display:none;"> ' + full.TXT_LOB + ' </div>';

                }
            },
           {
               aTargets: [5],
               mRender: function (data, type, full) {
                   return '<div >  <input type="text" class="form-control text-right decAvailable autonumeric" id="decAvailable" value="' + clsGlobal.FormatMoney(full.DEC_AVAILABLE,0) + '" disabled>  </div>';

               }
           },
           {
               aTargets: [6],
               mRender: function (data, type, full) {
                   return '<div >  <input type="text" class="form-control text-right decAmountAdd autonumeric" id="decAmountAdd' + full.intIndex + '" onchange="p_decAmountAdd_Changed(this,' + full.intIndex + ')"  value="' + full.DEC_AMOUNT + '" >  </div>';

               }
           },
           {
               aTargets: [7],
               mRender: function (data, type, full) {
                   return '<div >  <input type="text" style="display:none" class="form-control" id="txtBudgetDetailID' + full.intIndex + '" class="txtBudgetDetailID" onchange="p_txtBudgetDetailID_Changed(this,' + full.intIndex + ')"  value="' + full.INT_BGT_DTL_ID + '" disabled>  </div>';

               }
           }
           //{
           //    aTargets: [5],
           //    mRender: function (data, type, full) {
           //        return '<div > <input type="button" class="btn btn-warning btnDetailDelete" id="btnDetailDelete" onclick="p_btnDetailDelete_Click(this,' + full.intIndex + ')"  value="Delete" >  </div>';

           //    }
           //}
        ],
        "fnDrawCallback": function (oSettings) {
            debugger
            if (adaID == true) {
                p_EnableControl(true);
            }
            else {
                p_EnableControl(false);
            }
            p_GenerateAutoNumeric();
            
        }
    });

    $("#dtDetail").css("width", "100%");
    //$('#dtDetail tbody').on('click', 'tr', function () {
    //    if (!$(this).hasClass('selected')) {
    //        oTableDetail.$('tr.selected').removeClass('selected');
    //        $(this).addClass('selected');
    //    }
    //});
}

function p_DataToUI(objData) {
    

    $("#txtID").val(clsGlobal.parseToInteger(objData.INT_ALOADD_HDR_ID));
    $("#txtBudgetID").val(clsGlobal.parseToInteger(objData.INT_BGT_HDR_ID));
    $("#txtDocNo").val(clsGlobal.parseToString(objData.TXT_DOCNO));
    $("#txtReffDocNo").val(clsGlobal.parseToString(objData.TXT_REF_DOCNO)); 
    $("#ddlPeriod").val(objData.TXT_PERIOD);  
    $("#txtGroupAccount").val(clsGlobal.parseToString(objData.TXT_GROUP_ACCOUNT));
    $("#totalAllocationAddition").val(clsGlobal.parseToRupiah(objData.DEC_AMOUNT));
    $("#lblStatusFlow").html(clsGlobal.parseToString(objData.TXT_STATUSFLOW));

    $("#ddlBudgetType").val(objData.TXT_BUDGET_TYPE);

    p_DataToUIDetail(objData.XXSHP_KDS_M_ALOADD_DTL); 
    p_SetHiddenObject(objData);

    p_EnableControl(clsGlobal.ParseBooleanOracleToNET(objData.BIT_APPLY));
     
}

function p_EnableControl(bitApply) {
    
    if (bitApply == true) {
        $("#btnSave").hide();
        $("#btnSubmit").hide();
        $("#btnApprovalHistory").show();
        $("#btnLOVDocNo").attr("disabled", "true");
        $(".decAmountAdd").each(function (index) {
            $(this).attr("disabled", "true");
        });

    } else {
        $("#btnSave").show();
        $("#btnSubmit").show();
        $("#btnApprovalHistory").hide();
        $("#btnLOVDocNo").removeAttr("disabled");
        $(".decAmountAdd").each(function (index) {
            $(this).removeAttr("disabled");
        });

    }
}


function p_DataToUIBudgetAllocation(objData) {
        
    $("#txtReffDocNo").val(clsGlobal.parseToString(objData.TXT_REF_DOCNO));
    $("#txtBudgetID").val(clsGlobal.parseToInteger(objData.INT_BGT_HDR_ID));
    $("#ddlPeriod").val(objData.TXT_PERIOD);
    $("#txtGroupAccount").val(clsGlobal.parseToString(objData.TXT_GROUP_ACCOUNT));;

    $("#totalAllocationAddition").val(clsGlobal.parseToRupiah(objData.DEC_AMOUNT));
    $("#ddlBudgetType").val(objData.TXT_BUDGET_TYPE);

    p_DataToUIDetail(objData.XXSHP_KDS_M_ALOADD_DTL);
    p_SetHiddenObject(objData);

}

function p_UIToData() {
    //
    var jsonObj = [];
    jsonData = p_GetHiddenObject(); 
    jsonData.TXT_DOCNO = $("#txtDocNo").val().toString();
    jsonData.TXT_REF_DOCNO = $("#txtReffDocNo").val().toString();
    jsonData.TXT_PERIOD = $("#ddlPeriod").val().toString();
    jsonData.TXT_GROUP_ACCOUNT = $("#txtGroupAccount").val().toString();
    jsonData.TXT_BUDGET_TYPE = $("#ddlBudgetType").val().toString();
    jsonData.DEC_AMOUNT = clsGlobal.parseToAngka($("#totalAllocationAddition").val());

    p_SetHiddenObject(jsonData);
    return $("#txtHiddenObject").val();

}

function p_txtID_TextChanged() {
    clsGlobal.showLoading();
    $.ajax({
        type: "POST",
        url: "/Master/BudgetAllocationAddition/GetData",
        data: { txtID: $("#txtID").val(), __RequestVerificationToken: $('#frmBudgetAllocationAddition input[name=__RequestVerificationToken]').val() },
        datatype: "json",
        success: function (retDat) {
            
            if (retDat.bitSuccess == true) {
                if (retDat.objData != undefined) {
                    if (retDat.objData.INT_ALOADD_HDR_ID != 0) {
                        adaID = true;
                    }
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
 

function p_txtDocNo_TextChanged() {
    clsGlobal.showLoading();
    $.ajax({
        type: "POST",
        url: "/Master/BudgetAllocationAddition/GetData",
        data: { txtDocNo: $("#txtDocNo").val(),  __RequestVerificationToken: $('#frmBudgetAllocationAddition input[name=__RequestVerificationToken]').val() },
        datatype: "json",
        success: function (retDat) {
            
            if (retDat.bitSuccess == true) {
                if (retDat.objData != undefined) {
                    if (retDat.objData.INT_ALOADD_HDR_ID != 0) {
                        adaID = true;
                    }
                    p_SetHiddenObject(retDat.objData);
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
function p_txtReffDocNo_TextChanged() {
    clsGlobal.showLoading();
    $.ajax({
        type: "POST",
        url: "/Master/BudgetAllocationAddition/GetDataBudgetAllocation",
        data: { txtReffDocNo: $("#txtReffDocNo").val(), data: $("#txtHiddenObject").val(), __RequestVerificationToken: $('#frmBudgetAllocationAddition input[name=__RequestVerificationToken]').val() },
        datatype: "json",
        success: function (retDat) {
            
            if (retDat.bitSuccess == true) {
                if (retDat.objData != undefined) {
                    p_SetHiddenObject(retDat.objData);
                    p_DataToUIBudgetAllocation(retDat.objData);
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

function converter(id, index) {
    
    var objDat = p_GetHiddenObject();

    var index = objDat.XXSHP_KDS_M_ALOADD_DTL.length;
    var Total = 0;

    for (var i = 0; i <= index - 1; i++) {
        //var modulo = i % 5;
        Total = Total + clsGlobal.parseToAngka($('#dtDetail').DataTable().cell(i, 5).nodes().to$().find('input').val())
    }

    $("#totalAllocationAddition").val(clsGlobal.parseToRupiah(Total));

    $("#" + id).val(clsGlobal.parseToRupiah(clsGlobal.parseToAngka($('#' + id).val())));

    //p_SetHiddenObject(objDat);
}

function p_txtUmbrand_Changed(objCaller, intIndex) {
    
    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());
    for (i = 0; i < objData.XXSHP_KDS_M_ALOADD_DTL.length; i++) {
        // Cari Index-nya.
        if (objData.XXSHP_KDS_M_ALOADD_DTL[i].intIndex == intIndex) {
            // Ketemu, mulai dari sini:
            objData.XXSHP_KDS_M_ALOADD_DTL[i].TXT_UMBRAND = objCaller.value;
            break;
        }
    }
    p_SetHiddenObject(objData);
}

function p_txtLOB_Changed(objCaller, intIndex) {
    
    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());
    for (i = 0; i < objData.XXSHP_KDS_M_ALOADD_DTL.length; i++) {
        // Cari Index-nya.
        if (objData.XXSHP_KDS_M_ALOADD_DTL[i].intIndex == intIndex) {
            // Ketemu, mulai dari sini:
            objData.XXSHP_KDS_M_ALOADD_DTL[i].TXT_LOB = objCaller.value;
            break;
        }
    }
    p_SetHiddenObject(objData);
}

function p_decAmountAdd_Changed(objCaller, intIndex) {
    
    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());
    for (i = 0; i < objData.XXSHP_KDS_M_ALOADD_DTL.length; i++) {
        // Cari Index-nya.
        if (objData.XXSHP_KDS_M_ALOADD_DTL[i].intIndex == intIndex) {
            // Ketemu, mulai dari sini:
            objData.XXSHP_KDS_M_ALOADD_DTL[i].DEC_AMOUNT = clsGlobal.parseToAngka(objCaller.value);
            break;
        }
    }
    p_SetHiddenObject(objData);
    p_calculateAllocationAdditionHdr();
}

function p_calculateAllocationAdditionHdr() {
    
    var decTotalAllocationAddition = 0;
    var objData = JSON.parse(p_UIToData());
    for (i = 0; i < objData.XXSHP_KDS_M_ALOADD_DTL.length; i++) {
        // jumlah keseluruhan detail
        decTotalAllocationAddition += objData.XXSHP_KDS_M_ALOADD_DTL[i].DEC_AMOUNT;
        
    }
    objData.DEC_AMOUNT = decTotalAllocationAddition;
    $("#totalAllocationAddition").val(clsGlobal.parseToRupiah(decTotalAllocationAddition));

    p_SetHiddenObject(objData);
}

//function p_AddDetail() {
//    
//    //clsGlobal.showLoading();
//    $.ajax({
//        type: "POST",
//        url: "/Master/BudgetAdditional/AddRow",
//        data: { data: $("#txtHiddenObject").val(), __RequestVerificationToken: $('#frmBudgetAdditional input[name=__RequestVerificationToken]').val() },
//        datatype: "json",
//        success: function (retDat) {
//            
//            if (retDat.bitSuccess == true) {
//                if (retDat.objData != undefined) {
//                    p_SetHiddenObject(retDat.objData);
//                    p_DataToUIDetail(retDat.objData.XXSHP_KCO_M_BGTADD_DTL);
//                    oTableDetail.page('last').draw(false);
//                    //p_EnableControl(false);
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

function p_btnDetailDelete_Click(objCaller, intIndex) {
    
    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());
    for (i = 0; i < objData.XXSHP_KDS_M_ALOADD_DTL.length; i++) {
        // Cari Index-nya.
        if (objData.XXSHP_KDS_M_ALOADD_DTL[i].intIndex == intIndex) {
            // Ketemu, mulai dari sini:
            // Remove from list.
            objData.XXSHP_KDS_M_ALOADD_DTL.splice(i, 1);

            oTableDetail.row(i).remove().draw(false);
            var objDat = p_GetHiddenObject();
            var index = objDat.XXSHP_KDS_M_ALOADD_DTL.length;
            var Total = 0;

            for (var i = 0; i <= index - 1; i++) {
                //var modulo = i % 5;
                Total = Total + clsGlobal.parseToAngka($('#dtDetail').DataTable().cell(i, 5).nodes().to$().find('input').val())
            }

            $("#totalAllocationAddition").val(clsGlobal.parseToRupiah(Total));
            break;
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
        objDat.XXSHP_KDS_M_ALOADD_DTL[intRowIndex].intIndex = d.intIndex;

        d.INT_ALOADD_HDR_ID = objDat.XXSHP_KDS_M_ALOADD_DTL[intRowIndex].INT_ALOADD_HDR_ID;
        d.TXT_PERIOD_MONTH = objDat.XXSHP_KDS_M_ALOADD_DTL[intRowIndex].TXT_PERIOD_MONTH;
        d.TXT_LOB = objDat.XXSHP_KDS_M_ALOADD_DTL[intRowIndex].TXT_LOB;
        d.TXT_UMBRAND = objDat.XXSHP_KDS_M_ALOADD_DTL[intRowIndex].TXT_UMBRAND;
        d.TXT_SUBUMBRAND = objDat.XXSHP_KDS_M_ALOADD_DTL[intRowIndex].TXT_SUBUMBRAND;
        d.DEC_AMOUNT = objDat.XXSHP_KDS_M_ALOADD_DTL[intRowIndex].DEC_AMOUNT;
        d.DEC_AVAILABLE = objDat.XXSHP_KDS_M_ALOADD_DTL[intRowIndex].DEC_AVAILABLE;
        intRowIndex++;
        this.invalidate(); // invalidate the data DataTables has cached for this row         
    });

    // Draw once all updates are done
    oTableDetail.draw(false);
    p_SetHiddenObject(objDat);
}

function p_DataToUIDetail(XXSHP_KDS_M_ALOADD_DTL) {
    
    oTableDetail.clear();
    for (var i = 0; i < XXSHP_KDS_M_ALOADD_DTL.length; i++) {
        XXSHP_KDS_M_ALOADD_DTL[i].intIndex = i; 
        oTableDetail.row.add(XXSHP_KDS_M_ALOADD_DTL[i]);
    }
    oTableDetail.draw(false);

    var objDat = p_GetHiddenObject();
    objDat.XXSHP_KDS_M_ALOADD_DTL = XXSHP_KDS_M_ALOADD_DTL;
    p_SetHiddenObject(objDat);
}

function p_DataToUIDetailBudgetAllocation(XXSHP_KDS_M_BGTALO_DTL) {
    
    oTableDetail.clear();
    for (var i = 0; i < XXSHP_KDS_M_BGTALO_DTL.length; i++) {
        XXSHP_KDS_M_BGTALO_DTL[i].intIndex = i;
        XXSHP_KDS_M_BGTALO_DTL[i].DEC_AMOUNT = 0;
        oTableDetail.row.add(XXSHP_KDS_M_BGTALO_DTL[i]);
    }
    oTableDetail.draw(false);

    var objDat = p_GetHiddenObject();
    objDat.XXSHP_KDS_M_BGTALO_DTL = XXSHP_KDS_M_BGTALO_DTL;
    p_SetHiddenObject(objDat);
}

function p_saveData() {
    
    clsGlobal.showLoading();
    p_UIToData();
    $.ajax({
        type: "POST",
        url: "/Master/BudgetAllocationAddition/SaveData",
        data: { data: $("#txtHiddenObject").val(), txtGUID: $("#txtGUID").val(), __RequestVerificationToken: $('#frmBudgetAllocationAddition input[name=__RequestVerificationToken]').val() },
        datatype: "json",
        success: function (retDat) {
            
            if (retDat.bitSuccess == true) {
                //p_disabled();
                p_DataToUI(retDat.objData);
                adaID = true;
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


function p_submitData() {
    clsGlobal.showLoading();
    p_UIToData();
    $.ajax({
        type: "POST",
        url: "/Master/BudgetAllocationAddition/SubmitData",
        data: { data: $("#txtHiddenObject").val(), txtGUID: $("#txtGUID").val(), __RequestVerificationToken: $('#frmBudgetAllocationAddition input[name=__RequestVerificationToken]').val() },
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
        url: "/Master/BudgetAllocationAddition/DeleteData",
        data: { data: $("#txtHiddenObject").val(), txtGUID: $("#txtGUID").val(), __RequestVerificationToken: $('#frmBudgetAllocationAddition input[name=__RequestVerificationToken]').val() },
        datatype: "json",
        success: function (retDat) {
            
            if (retDat.bitSuccess == true) {
                p_DataToUI(retDat.objData);
                adaID = false;
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

$('#btnFind').bind('click', function () {
    try {
        LOV = clsGlobal.generateLOV(MODULE_BUDGETALLOCATIONADDITION, "txtDocNo");
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
});

$('#btnLOVRefDocNo').bind('click', function () {
    try {
        LOV = clsGlobal.generateLOV(MODULE_BUDGETALLOCATION_BYUSER, "txtReffDocNo");
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
});
$('#btnAddDetail').on('click', function () {
    try {
        p_AddDetail();
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
 

$('#btnApprovalHistory').bind('click', function () {
    try {
        var fancyboxdata = p_GetHiddenObject();
        LOV = clsGlobal.generatePopUpIframeSmall($(location).attr('protocol') + "//" + $(location).attr('host') + "/Master/ApprovalHistory/Index?TXT_TYPEDOC=" + "&TXT_REF_DOCNO=" + fancyboxdata.TXT_DOCNO + "&INT_DOCID=" + fancyboxdata.INT_ALOADD_HDR_ID, "btnApprovalHistory", fancyboxdata);

    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
});


