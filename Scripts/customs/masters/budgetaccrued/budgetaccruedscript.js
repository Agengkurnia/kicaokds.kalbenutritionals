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
        case "txtBudgetID": $("#txtBudgetID").val(arr[1]);
            p_txtBudgetID_TextChanged();
            break;
        case "txtPeriodAccrued":
            p_txtPeriodAccrued_Changed_LOV(arr[2]);
            break;
        case "txtDetailActivity":
            //p_settxtDetailActivity(arr[1]);
            //p_settxtActivity(arr[1]);
            p_txtActivity_Changed_LOV(arr[1]);
            break;
        case "txtBrand":            
            //p_settxtBrandDetail(arr[1]);
            p_settxtBrand(arr[1]);
            break;
    }
    clsGlobal.closeLOV();
}

function p_SetHiddenObject(objDat) {
    $("#txtHiddenObject").val(JSON.stringify(objDat));
}

function p_GetHiddenObject() {
    return JSON.parse($("#txtHiddenObject").val());
}

function p_EnableControl(bitApply) {
    
    if (bitApply == true) {
        //$("#totalBudget").attr("disabled", "true");

        $("#fileUploadBudgetAccruedDetail").attr("disabled", "true");
        $(".Upload").attr("disabled", "true");
        $("#btnLOVBudgetID").attr("disabled", "true");
        $(".ddlPeriodName").attr("disabled", "true");

        $("#btnAddDetail").hide();

        $(".decOpenBalance").each(function (index) {
            $(this).attr("disabled", "true");
        });
        $(".btnLOVPeriodAccrued").each(function (index) {
            $(this).hide();
        });
        $(".btnLOVDetailActivity").each(function (index) {
            $(this).hide();
        });
        $(".btnBrandLOVID").each(function (index) {
            $(this).hide();
        });
        $(".btnDetailDelete").each(function (index) {
            $(this).hide();
        });

    } else {
        //$("#totalBudget").removeAttr("disabled");
        $("#fileUploadBudgetAccruedDetail").removeAttr("disabled");
        $(".Upload").removeAttr("disabled");
        $("#btnLOVBudgetID").removeAttr("disabled");
        $(".ddlPeriodName").removeAttr("disabled");

        $("#btnAddDetail").show();

        $(".decOpenBalance").each(function (index) {
            $(this).removeAttr("disabled");
        });
        $(".btnLOVPeriodAccrued").each(function (index) {
            $(this).show();
        });
        $(".btnLOVDetailActivity").each(function (index) {
            $(this).show();
        });
        $(".btnBrandLOVID").each(function (index) {
            $(this).show();
        });
        $(".btnDetailDelete").each(function (index) {
            $(this).show();
        });

    }
}

function p_DataToUI(objData) {
    
    //$("#txtID").val(clsGlobal.parseToInteger(objData.INT_BGTACR_HDR_ID));
    $("#fileUploadBudgetAccruedDetail").val(objData.empty);
    $("#txtDocNo").val(clsGlobal.parseToString(objData.TXT_DOCNO));
    $("#txtBudgetID").val(clsGlobal.parseToInteger(objData.INT_BGT_HDR_ID));

    //p_PopulatePeriodAndSet(clsGlobal.parseToString(objData.TXT_PERIOD));
    $("#ddlPeriod").val(objData.TXT_PERIOD);   

    $("#txtSupplierName").val(objData.TXT_SUPPLIER_NAME);
    $("#intSupplierCode").val(objData.TXT_SUPPLIER_CODE);
    //p_txtSupplierName_TextChanged();

    $("#intSupplierSiteCode").val(objData.TXT_SUPPLIER_SITE_CODE);
    $("#txtSupplierSiteName").val(objData.TXT_SUPPLIER_SITE_NAME);
    //p_txtSupplierSiteCode_TextChanged();

    $("#totalAllocation").val(clsGlobal.parseToRupiah(objData.DEC_AMOUNT));

    $("#ddlBudgetType").val(objData.TXT_BUDGET_TYPE);
    //p_PopulateBudgetTypeAndSet(clsGlobal.parseToString(objData.TXT_BUDGET_TYPE));

    p_DataToUIDetail(objData.XXSHP_KDS_M_BGTACR_DTL);
    //p_DataToUIDetailBudget(objData.XXSHP_KCO_M_BGT_DTL);
    p_SetHiddenObject(objData);

    if (objData.INT_BGTACR_HDR_ID != 0) {
        p_EnableControl(true);
    } else {
        p_EnableControl(false);
    }

    //$("#txtHiddenObject").val(JSON.stringify(objData));
    if ($("#txtDocNo").val() == "" || $("#txtDocNo").val() == "0") {
        $("#btnDelete").hide();
        $("#btnSave").show();
    } else {
        $("#btnDelete").hide();
        $("#btnSave").hide();
    }
}

function p_DataToUIBudget(objData) {
    

    $("#txtBudgetID").val(clsGlobal.parseToInteger(objData.INT_BGT_HDR_ID));

    $("#ddlPeriod").val(objData.TXT_PERIOD);

    $("#txtSupplierName").val(objData.TXT_SUPPLIER_NAME);
    $("#intSupplierCode").val(objData.TXT_SUPPLIER_CODE);

    $("#intSupplierSiteCode").val(objData.TXT_SUPPLIER_SITE_CODE);
    $("#txtSupplierSiteName").val(objData.TXT_SUPPLIER_SITE_NAME);

    //$("#totalAllocation").val(clsGlobal.parseToRupiah(objData.DEC_AMOUNT));
    $("#ddlBudgetType").val(objData.TXT_BUDGET_TYPE);

    //p_DataToUIDetail(objData.XXSHP_KCO_M_BGTACR_DTL);
    p_SetHiddenObject(objData);

}

function p_DataToUIDetail(XXSHP_KDS_M_BGTACR_DTL) {
    

    oTableDetail.clear();
    for (var i = 0; i < XXSHP_KDS_M_BGTACR_DTL.length; i++) {
        XXSHP_KDS_M_BGTACR_DTL[i].intIndex = i;
        XXSHP_KDS_M_BGTACR_DTL[i].DEC_OPENBALANCE = clsGlobal.parseToRupiah(XXSHP_KDS_M_BGTACR_DTL[i].DEC_OPENBALANCE);
        //p_PopulatePeriodNameAndSet(clsGlobal.parseToString(XXSHP_KCO_M_BGTACR_DTL[i].TXT_PERIOD_MONTH));
        //XXSHP_KCO_M_BGTACR_DTL[i].TXT_PERIOD_MONTH = clsGlobal.parseToString(XXSHP_KCO_M_BGTACR_DTL[i].TXT_PERIOD_MONTH);
        //p_PopulatePeriodNameAndSet(XXSHP_KCO_M_BGTACR_DTL[i].TXT_PERIOD_MONTH, XXSHP_KCO_M_BGTACR_DTL[i].intIndex);

        oTableDetail.row.add(XXSHP_KDS_M_BGTACR_DTL[i]);
        
    }
    oTableDetail.draw(false);

    //for (var i = 0; i < XXSHP_KCO_M_BGTACR_DTL.length; i++) {
    //    XXSHP_KCO_M_BGTACR_DTL[i].intIndex = i;

    //    p_PopulatePeriodNameAndSet(XXSHP_KCO_M_BGTACR_DTL[i].TXT_PERIOD_MONTH, XXSHP_KCO_M_BGTACR_DTL[i].intIndex);
    //    
    //}

    var objDat = p_GetHiddenObject();
    objDat.XXSHP_KDS_M_BGTACR_DTL = XXSHP_KDS_M_BGTACR_DTL;
    p_SetHiddenObject(objDat);

}

function p_UIToData() {
    
    var jsonObj = [];
    jsonData = p_GetHiddenObject();
    jsonData.INT_BGTACR_HDR_ID = clsGlobal.parseToInteger($("#txtID").val());
    jsonData.TXT_DOCNO = clsGlobal.parseToString($("#txtDocNo").val());
    jsonData.INT_BGT_HDR_ID = clsGlobal.parseToInteger($("#txtBudgetID").val());
    jsonData.TXT_PERIOD = $("#ddlPeriod").val().toString();
    jsonData.TXT_SUPPLIER_CODE = $("#intSupplierCode").val().toString();
    jsonData.TXT_SUPPLIER_NAME = $("#txtSupplierName").val().toString();
    jsonData.TXT_SUPPLIER_SITE_CODE = $("#intSupplierSiteCode").val().toString();
    jsonData.TXT_SUPPLIER_SITE_NAME = $("#txtSupplierSiteName").val().toString();
    jsonData.TXT_BUDGET_TYPE = $("#ddlBudgetType").val().toString();
    jsonData.DEC_AMOUNT = clsGlobal.parseToAngka($("#totalAllocation").val());

    p_SetHiddenObject(jsonData);
    return $("#txtHiddenObject").val();

}

function p_UploadBudgetAccruedDetail() {
    clsGlobal.getConfirmation("Upload Budget Accrued Detail?", function (result) {
        if (result == true) {
            var data = new FormData();
            var files = $("#fileUploadBudgetAccruedDetail").get(0).files;
            if (files.length > 0) {
                data.append("fileUploadBudgetAccruedDetail", files[0]);
                data.append("txtHiddenObject", $("#txtHiddenObject").val());
            }
            //clsGlobal.showLoading();
            $.ajax({
                type: "POST",
                url: "/Master/BudgetAccrued/UploadBudgetAccruedDetail",
                processData: false,
                contentType: false,
                data: data,
                success: function (retDat) {
                    if (retDat.bitSuccess == true) {
                        if (retDat.objData != undefined) {
                            p_SetHiddenObject(retDat.objData);
                            p_DataToUIDetail(retDat.objData.XXSHP_KDS_M_BGTACR_DTL);
                            oTableDetail.page('last').draw(false);

                            $("#btnAddDetail").show();
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
            return false;
        }
    });
}

function p_DownloadBudgetAccruedDetail() {
    clsGlobal.getConfirmation("Download Template Budget Accrued Detail?", function (result) {
        if (result == true) {
            //clsGlobal.showLoading();
            $.ajax({
                type: "POST",
                url: "/Master/BudgetAccrued/DownloadBudgetAccruedDetail",
                datatype: "json",
                success: function (url) {
                    window.location = url;
                    //clsGlobal.hideLoading();
                },
                //error: function (url) {
                //    clsGlobal.hideLoading();
                //}
            });
        }
        else {
            return false;
        }
    });
}

function p_initiateData() {
    //clsGlobal.showLoading();
    $.ajax({
        type: "POST",
        url: "/Master/BudgetAccrued/InitiateData",
        data: { __RequestVerificationToken: $('#frmBudgetAccrued input[name=__RequestVerificationToken]').val() },
        datatype: "json",
        success: function (retDat) {

            if (retDat.bitSuccess == true) {
                if (retDat.objData != undefined) {
                    $("#txtHiddenObject").val(JSON.stringify(retDat.objData));
                    //p_InitiateDetail();
                    p_DataToUI(retDat.objData);
                    $("#txtGUID").val(retDat.txtGUID);
                    $("#txtBlankObject").val(JSON.stringify(retDat.objData));

                    $("#btnAddDetail").hide();
                    $("#fileUploadBudgetAccruedDetail").attr("disabled", "true");
                    $(".Upload").attr("disabled", "true");
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

function p_GetSelectedDetailRow() {
    var intIndex = clsGlobal.parseToInteger(oTableDetail.$('tr.selected').find("#lblDetailNoValue").html()) - 1;
    return intIndex;
}

function p_InitiateDetail() {
    // Format datatable  
    
    oTableDetail = $('#dtDetail').DataTable({
        "bPaginate": true,
        "bSort": false,
        searching: true,
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
                      //return '<div >  <input type="text" class="form-control" id="ddlPeriodName' + full.intIndex + '" class="ddlPeriodName" onchange="p_ddlPeriodName_Changed(this,' + full.intIndex + ')"  value="' + full.TXT_PERIOD_MONTH + '" disabled>  </div>';
                      //return '<div >  <select class="form-control ddlPeriodName" id="ddlPeriodName' + full.intIndex + '" onchange="p_ddlPeriodName_Changed(this,' + full.intIndex + ')"  value="' + full.TXT_PERIOD_MONTH + '"><option value="0">-</option></select> </div>';
                      return '    <div class="input-group"> ' +
                             '       <div class="input-group-btn"> ' +
                             '           <button type="button" class="btn btn-danger btnLOVPeriodAccrued" id="btnLOVPeriodAccrued" onclick="p_btnLOVPeriodAccrued_Click(this,' + full.intIndex + ')"> <i class="fa fa-search"></i></button> ' +
                             '       </div> ' +
                             '       <input type="text" class="form-control" id="txtPeriodAccrued' + full.intIndex + '" class="txtPeriodAccrued" onchange="p_txtPeriodAccrued_Changed(this,' + full.intIndex + ')"  value="' + full.TXT_PERIOD_MONTH + '" disabled> ' +
                             '   </div>';
                  }
              },
              {
                  aTargets: [2],
                  mRender: function (data, type, full) {

                      return '    <div class="input-group"> ' +
                             '       <div class="input-group-btn"> ' +
                             '           <button type="button" class="btn btn-danger btnLOVDetailActivity" id="btnLOVDetailActivity" onclick="p_btnLOVDetailActivity_Click(this,' + full.intIndex + ')"> <i class="fa fa-search"></i></button> ' +
                             '       </div> ' +
                             '       <input type="text" class="form-control" id="txtDetailActivity' + full.intIndex + '" class="txtDetailActivity" onchange="p_txtDetailActivity_Changed(this,' + full.intIndex + ')"  value="' + full.TXT_ACTIVITY + '" disabled> ' +
                             '   </div>';
                  }
              },
              {
                  aTargets: [3],
                  mRender: function (data, type, full) {

                      return '<div > <div class="input-group"> <div class="input-group-btn"> <button type="button" class="btn btn-danger btnBrandLOVID" id="btnBrandLOVID" onclick="p_btnBrandLOVID(' + full.intIndex + ')"> <i class="fa fa-search"></i></button> </div> <input type="text" class="form-control" id="txtBrand' + full.intIndex + '" class="txtBrand" onchange="p_txtBrand_Changed(this,' + full.intIndex + ')"  value="' + full.TXT_BRAND + '" disabled> </div> </div>';

                  }
              },
           {
               aTargets: [4],
               mRender: function (data, type, full) {
                   return '<div > <input type="text" class="form-control " id="txtUmbrand' + full.intIndex + '" class="txtUmbrand" onchange="p_txtUmbrand_Changed(this,' + full.intIndex + ')"  value="' + full.TXT_UMBRAND
                       + '" disabled> </div> </div>';

               }
           },

           {
               aTargets: [5],
               mRender: function (data, type, full) {
                   return '<div >  <input type="text" class="form-control" id="txtLOB' + full.intIndex + '" class="txtLOB" onchange="p_txtLOB_Changed(this,' + full.intIndex + ')"  value="' + full.TXT_LOB + '" disabled>  </div>';

               }
           },

           {
               aTargets: [6],
               mRender: function (data, type, full) {
                   return '<div >  <input type="text" class="form-control text-right decOpenBalance" id="decOpenBalance' + full.intIndex + '" onkeyup="converter(id, ' + full.intIndex + ')" onchange="p_decOpenBalance_Changed(this,' + full.intIndex + ')"  value="' + full.DEC_OPENBALANCE + '" >  </div>';

               }
           },
           {
               aTargets: [7],
               mRender: function (data, type, full) {
                   return '<div > <input type="button" class="btn btn-warning btnDetailDelete" id="btnDetailDelete" onclick="p_btnDetailDelete_Click(this,' + full.intIndex + ')"  value="Delete" >  </div>';

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

function p_txtDocNo_TextChanged() {
    //clsGlobal.showLoading();
    $.ajax({
        type: "POST",
        url: "/Master/BudgetAccrued/GetData",
        data: { txtDocNo: $("#txtDocNo").val(), __RequestVerificationToken: $('#frmBudgetAccrued input[name=__RequestVerificationToken]').val() },
        datatype: "json",
        success: function (retDat) {
            
            if (retDat.bitSuccess == true) {
                if (retDat.objData != undefined) {
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

function p_txtBudgetID_TextChanged() {
    //clsGlobal.showLoading();
    $.ajax({
        type: "POST",
        url: "/Master/BudgetAccrued/GetDataBudget",
        data: { txtID: $("#txtBudgetID").val(), data: $("#txtBlankObject").val(), __RequestVerificationToken: $('#frmBudgetAccrued input[name=__RequestVerificationToken]').val() },
        datatype: "json",
        success: function (retDat) {
            
            if (retDat.bitSuccess == true) {
                if (retDat.objData != undefined) {
                    p_SetHiddenObject(retDat.objData);
                    p_DataToUI(retDat.objData);
                    //p_DataToUIBudget(retDat.objData);

                    $("#btnAddDetail").show();
                    $("#fileUploadBudgetAccruedDetail").removeAttr("disabled");
                    $(".Upload").removeAttr("disabled");
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

function p_AddDetail() {
    
    //clsGlobal.showLoading();
    $.ajax({
        type: "POST",
        url: "/Master/BudgetAccrued/AddRow",
        data: { data: $("#txtHiddenObject").val(), __RequestVerificationToken: $('#frmBudgetAccrued input[name=__RequestVerificationToken]').val() },
        datatype: "json",
        success: function (retDat) {
            
            if (retDat.bitSuccess == true) {
                if (retDat.objData != undefined) {
                    p_SetHiddenObject(retDat.objData);
                    //p_PopulatePeriodNameAndSet();
                    p_DataToUIDetail(retDat.objData.XXSHP_KDS_M_BGTACR_DTL);
                    oTableDetail.page('last').draw(false);
                    p_EnableControl(false);

                    var index = $('#dtDetail tbody tr').length;
                    var Total = 0;

                    for (var i = 0; i <= $('#dtDetail tbody tr').length - 1; i++) {
                        Total = Total + clsGlobal.parseToAngka($('#dtDetail').DataTable().cell(i, 6).nodes().to$().find('input').val())
                    }
                    $("#totalAllocation").val(clsGlobal.parseToRupiah(Total));
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

function p_PopulatePeriodNameAndSet(txtValue) {
    //clsGlobal.showLoading();
    
    $.ajax({
        type: "POST",
        url: "/Master/BudgetAccrued/PopulatePeriodName",
        data: { __RequestVerificationToken: $('#FormLogin input[name=__RequestVerificationToken]').val() },
        datatype: "json",
        success: function (retDat) {
            if (retDat.bitSuccess == true) {
                
                if (retDat.objData != undefined) {
                    $('#ddlPeriodName').empty();
                    $('#ddlPeriodName').append($('<option>').text("-").prop('value', "0"));
                    for (var i = 0; i < retDat.objData.length; i++) {
                        $('.ddlPeriodName').append($('<option>').text(retDat.objData[i].PERIOD_NAME).prop('value', retDat.objData[i].PERIOD_NAME));
                    }

                    if (txtValue != "") {
                        $("#ddlPeriodName").val(txtValue);
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

function converter(id, intIndex) {
    var index = $('#dtDetail tbody tr').length;
    var Total = 0;

    for (var i = 0; i <= $('#dtDetail tbody tr').length - 1; i++) {
        Total = Total + clsGlobal.parseToAngka($('#dtDetail').DataTable().cell(i, 6).nodes().to$().find('input').val())
    }

    $("#totalAllocation").val(clsGlobal.parseToRupiah(Total));

    $("#" + id).val(clsGlobal.parseToRupiah(clsGlobal.parseToAngka($('#' + id).val())));

    //p_SetHiddenObject(objDat);
}

function p_decOpenBalance_Changed(objCaller, intIndex) {
    
    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());
    for (i = 0; i < objData.XXSHP_KDS_M_BGTACR_DTL.length; i++) {
        // Cari Index-nya.
        if (objData.XXSHP_KDS_M_BGTACR_DTL[i].intIndex == intIndex) {
            // Ketemu, mulai dari sini:
            objData.XXSHP_KDS_M_BGTACR_DTL[i].DEC_OPENBALANCE = objCaller.value;

            break;
        }
    }

    p_SetHiddenObject(objData);
}

function p_ddlPeriodName_Changed(objCaller, intIndex) {
    
    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());
    for (i = 0; i < objData.XXSHP_KDS_M_BGTACR_DTL.length; i++) {
        // Cari Index-nya.
        if (objData.XXSHP_KDS_M_BGTACR_DTL[i].intIndex == intIndex) {
            // Ketemu, mulai dari sini:
            objData.XXSHP_KDS_M_BGTACR_DTL[i].TXT_PERIOD_MONTH = objCaller.value;

            break;
        }
    }

    p_SetHiddenObject(objData);
}

function p_txtBrand_Changed(objCaller, intIndex) {
    
    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());
    for (i = 0; i < objData.XXSHP_KDS_M_BGTACR_DTL.length; i++) {
        // Cari Index-nya.
        if (objData.XXSHP_KDS_M_BGTACR_DTL[i].intIndex == intIndex) {
            // Ketemu, mulai dari sini:
            objData.XXSHP_KDS_M_BGTACR_DTL[i].TXT_BRAND = objCaller.value;
            break;
        }
    }
    p_SetHiddenObject(objData);
}


//function p_settxtBrand(intUmBrandID) {
//    //var intSelectedIndex = p_GetSelectedDetailRow();
//    
//    //clsGlobal.showLoading();
//    $.ajax({
//        type: "POST",
//        url: "/Master/Budget/GetDataBrand",
//        data: { intUmBrandID: intUmBrandID, __RequestVerificationToken: $('#frmBudgetAccrued input[name=__RequestVerificationToken]').val() },
//        datatype: "json",
//        success: function (retDat) {
//            
//            //console.log(retDat.objData);
//            if (retDat.bitSuccess == true) {
//                if (retDat.objData != undefined) {
//                    p_txtBrand_Changed_LOV(retDat.objData);
//                    p_EnableControl(false);
//                } else {
//                    p_showBlank();
//                }
//            } else {
//                clsGlobal.getAlert(retDat.txtMessage);
//            }
//            clsGlobal.hideLoading();

//        },
//        error: function (retDat) {
//            
//            clsGlobal.hideLoading();
//        }
//    });

//}

function p_settxtBrand(INT_BGT_DTL_ID) {
    //var intSelectedIndex = p_GetSelectedDetailRow();
    
    //clsGlobal.showLoading();
    $.ajax({
        type: "POST",
        url: "/Master/BudgetAccrued/GetDataBrandByINT_BGT_DTL_ID",
        data: { INT_BGT_DTL_ID: INT_BGT_DTL_ID, __RequestVerificationToken: $('#frmBudgetAccrued input[name=__RequestVerificationToken]').val() },
        datatype: "json",
        success: function (retDat) {
            
            //console.log(retDat.objData);
            if (retDat.bitSuccess == true) {
                if (retDat.objData != undefined) {
                    p_txtBrand_Changed_LOV(retDat.objData);
                    p_EnableControl(false);
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

function p_btnDetailDelete_Click(objCaller, intIndex) {
    
    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());
    for (i = 0; i < objData.XXSHP_KDS_M_BGTACR_DTL.length; i++) {
        // Cari Index-nya.
        if (objData.XXSHP_KDS_M_BGTACR_DTL[i].intIndex == intIndex) {
            // Ketemu, mulai dari sini:
            // Remove from list.
            objData.XXSHP_KDS_M_BGTACR_DTL.splice(i, 1);

            oTableDetail.row(i).remove().draw(false);

            p_PopulatePeriodNameAndSet();
            var index = $('#dtDetail tbody tr').length;
            var Total = 0;

            for (var i = 0; i <= $('#dtDetail tbody tr').length - 1; i++) {
                Total = Total + clsGlobal.parseToAngka($('#dtDetail').DataTable().cell(i, 6).nodes().to$().find('input').val())
            }

            $("#totalAllocation").val(clsGlobal.parseToRupiah(Total));
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
        objDat.XXSHP_KDS_M_BGTACR_DTL[intRowIndex].intIndex = d.intIndex;
        //objDat.XXSHP_KCO_M_BGT_HDR[intRowIndex].intIndex = d.intIndex;
        d.TXT_PERIOD_MONTH = objDat.XXSHP_KDS_M_BGTACR_DTL[intRowIndex].TXT_PERIOD_MONTH;
        d.TXT_ACTIVITY = objDat.XXSHP_KDS_M_BGTACR_DTL[intRowIndex].TXT_ACTIVITY;
        d.TXT_LOB = objDat.XXSHP_KDS_M_BGTACR_DTL[intRowIndex].TXT_LOB;
        d.TXT_UMBRAND = objDat.XXSHP_KDS_M_BGTACR_DTL[intRowIndex].TXT_UMBRAND;
        d.TXT_BRAND = objDat.XXSHP_KDS_M_BGTACR_DTL[intRowIndex].TXT_BRAND;
        d.DEC_OPENBALANCE = objDat.XXSHP_KDS_M_BGTACR_DTL[intRowIndex].DEC_OPENBALANCE;
        intRowIndex++;
        this.invalidate(); // invalidate the data DataTables has cached for this row         
    });

    // Draw once all updates are done
    oTableDetail.draw(false);
    p_SetHiddenObject(objDat);
}

function p_txtBrand_Changed_LOV(objDat) {
    
    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());
    var IndexUmbrand = p_GetCurrentRowUmbrand();

    objData.XXSHP_KDS_M_BGTACR_DTL[IndexUmbrand].TXT_BRAND = objDat.TXT_UMBRAND.toString();
    $("#txtBrand" + IndexUmbrand).val(objDat.TXT_UMBRAND.toString());

    objData.XXSHP_KDS_M_BGTACR_DTL[IndexUmbrand].TXT_LOB = objDat.TXT_LOB.toString();
    $("#txtLOB" + IndexUmbrand).val(objDat.TXT_LOB.toString());

    objData.XXSHP_KDS_M_BGTACR_DTL[IndexUmbrand].TXT_UMBRAND = objDat.TXT_SUBUMBRAND.toString();
    $("#txtUmbrand" + IndexUmbrand).val(objDat.TXT_SUBUMBRAND.toString());

    p_SetHiddenObject(objData);
}

function p_txtPeriodAccrued_Changed_LOV(objDat) {
    
    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());
    var IndexUmbrand = p_GetCurrentRowUmbrand();

    objData.XXSHP_KDS_M_BGTACR_DTL[IndexUmbrand].TXT_PERIOD_MONTH = objDat;
    $("#txtPeriodAccrued" + IndexUmbrand).val(objDat);

    p_SetHiddenObject(objData);
}

function p_txtActivity_Changed_LOV(objDat) {
    
    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());
    var IndexUmbrand = p_GetCurrentRowUmbrand();

    objData.XXSHP_KDS_M_BGTACR_DTL[IndexUmbrand].TXT_ACTIVITY = objDat;
    $("#txtDetailActivity" + IndexUmbrand).val(objDat);

    p_SetHiddenObject(objData);
}

function p_SetCurrentRowUmbrand(intIndex) {
    
    $("#txtCurrentUmbrandRow").val(intIndex);
}

function p_GetCurrentRowUmbrand() {
    
    var index = $("#txtCurrentUmbrandRow").val();
    return index;
}

function p_btnLOVPeriodAccrued_Click(objCaller, intIndex) {
    
    p_SetCurrentRowUmbrand(intIndex);
    var PeriodAccrued = $("#ddlPeriod").val();
    try {
        LOV = clsGlobal.generateLOV(LOV_ORG_ACCT_PERIODS_V, "txtPeriodAccrued", PeriodAccrued);
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
}


function p_btnBrandLOVID(objCaller, intIndex) {
    
    p_SetCurrentRowUmbrand(objCaller);
    try {
        LOV = clsGlobal.generateLOV(LOV_BUDGETDETAIL, "txtBrand");
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }

}

function p_btnLOVDetailActivity_Click(objCaller, intIndex) {    
    
    p_SetCurrentRowUmbrand(intIndex);
    try {
        LOV = clsGlobal.generateLOV(MODULE_ACTIVITY, "txtDetailActivity");
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
}

function p_saveData() {
    
    //clsGlobal.showLoading();
    p_UIToData();
    $.ajax({
        type: "POST",
        url: "/Master/BudgetAccrued/SaveData",
        data: { data: $("#txtHiddenObject").val(), txtGUID: $("#txtGUID").val(), __RequestVerificationToken: $('#frmBudgetAccrued input[name=__RequestVerificationToken]').val() },
        datatype: "json",
        success: function (retDat) {
            
            if (retDat.bitSuccess == true) {
                //p_disabled();
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

$('#btnLOVDocNo').bind('click', function () {
    try {
        LOV = clsGlobal.generateLOV(MODULE_BUDGETACCRUED, "txtDocNo");
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
});

$('#btnLOVBudgetID').bind('click', function () {
    try {
        LOV = clsGlobal.generateLOV(MODULE_BUDGET, "txtBudgetID");
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
