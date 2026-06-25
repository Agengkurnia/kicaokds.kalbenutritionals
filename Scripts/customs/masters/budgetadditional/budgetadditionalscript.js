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
    p_InitiateOther();
}

function p_validatePage() {

}

function p_showPrevData() {

}

function p_showBlank() {
    p_initiateData();

    //buat ngehapus isi file upload di input type file
    $("#fileUploadBudgetDetail").val("");
}

function setChooseLOV(txtValue) {
    
    var arr = txtValue.split('|');
    switch (arr[0]) {
        case "txtID": $("#txtID").val(arr[1]);
            p_txtID_TextChanged();
            break;
        case "txtHeaderID": $("#txtHeaderID").val(arr[1]);
            $("#ddlPeriod").val(arr[2]);
            $("#txtGroupAccount").val(arr[3]);
            $("#ddlBudgetType").val(arr[4]);
            p_txtHeaderID_TextChanged();
            break;
        case "txtOtherUmBrand": 
            p_settxtOtherUmBrand(arr[1],arr[2],arr[3],arr[4],arr[5],arr[6],arr[7],arr[8]);
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
    $('.autonumeric4').autoNumeric('init', { vMax: '999999999.9999', vMin: '-999999999.9999', aSep: ',', dGroup: '3', aDec: '.' });
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
        url: "/Master/BudgetAdditional/InitiateData",
        data: { __RequestVerificationToken: $('#frmBudgetAdditional input[name=__RequestVerificationToken]').val() },
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
        $("#txtID").val(id);
        p_txtID_TextChanged();
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
        "scrollX": true,
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
                      return '<div > <input type="text" class="form-control " id="txtUmBrand' + full.intIndex + '" style="width:120px" class="txtUmBrand" onchange="p_txtUmBrand_Changed(this,' + full.intIndex + ')"  value="' + full.TXT_UMBRAND
                       + '" disabled> </div> </div>';
                      
                  }
              },
           {
               aTargets: [2],
               mRender: function (data, type, full) {
                   return '<div > <input type="text" class="form-control " id="txtSubUmBrand' + full.intIndex + '" class="txtSubUmBrand" onchange="p_txtSubUmBrand_Changed(this,' + full.intIndex + ')"  value="' + full.TXT_SUBUMBRAND
                       + '" disabled> </div> </div>';

               }
           },

           {
               aTargets: [3],
               mRender: function (data, type, full) {
                   return '<div >  <input type="text" class="form-control" id="txtBrand' + full.intIndex + '" class="txtBrand" onchange="p_txtBrand_Changed(this,' + full.intIndex + ')"  value="' + full.TXT_BRAND + '" disabled>  </div>';

               }
           },
            {
                aTargets: [4],
                mRender: function (data, type, full) {
                    return '<div >  <input type="text" class="form-control" id="txtSubBrand' + full.intIndex + '" class="txtSubBrand" onchange="p_txtSubBrand_Changed(this,' + full.intIndex + ')"  value="' + full.TXT_SUBBRAND + '" disabled>  </div>';

                }
            },
            {
                aTargets: [5],
                mRender: function (data, type, full) {
                    return '<div >  <input type="text" class="form-control" id="txtLOB' + full.intIndex + '" style="width:50px" class="txtLOB" onchange="p_txtLOB_Changed(this,' + full.intIndex + ')"  value="' + full.TXT_LOB + '" disabled>  </div>';

                }
            },
            {
                aTargets: [6],
                mRender: function (data, type, full) {
                    return '<div >  <input type="text" class="form-control text-right autonumeric decAmountBegBal" style="width:150px" id="decAmountBegBal' + full.intIndex + '"  value="' + full.DEC_ENDINGBALANCE + '"  disabled>  </div>';

                }
            },
           {
               aTargets: [7],
               mRender: function (data, type, full) {
                   return '<div >  <input type="text" class="form-control text-right autonumeric decAmountAdd" style="width:150px" id="decAmountAdd' + full.intIndex + '" onchange="p_decAmountAdd_Changed(this,' + full.intIndex + ')"  value="' + full.DEC_AMOUNT + '" >  </div>';

               }
           },
           {
               aTargets: [8],
               mRender: function (data, type, full) {
                   return '<div >  <input type="text" class="form-control text-right txtTargetSales autonumeric"  style="width:150px;" id="txtTargetSales" onchange="p_txtTargetSales_Changed(this,' + full.intIndex + ')"  value="' + full.DEC_TARGETSALES + '" >  </div>';
               }
           },
           {
               aTargets: [9],
               mRender: function (data, type, full) {
                   return '<div >  <input type="text" class="form-control text-right txtCostRatio autonumeric4"  style="width:150px;" id="txtCostRatio" value="' + full.DEC_RATIO + '" disabled >  </div>';

               }
           } 
        ],
        "fnDrawCallback": function (oSettings) {
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
    $('#dtDetail tbody').on('click', 'tr', function () {
        if (!$(this).hasClass('selected')) {
            oTableDetail.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
        }
    });
}

function p_DataToUI(objData) {
    //

    $("#txtID").val(clsGlobal.parseToInteger(objData.INT_BGTADD_HDR_ID));
    $("#txtHeaderID").val(clsGlobal.parseToInteger(objData.INT_BGT_HDR_ID));

    //p_PopulatePeriodAndSet(clsGlobal.parseToString(objData.TXT_PERIOD));
    $("#ddlPeriod").val(objData.TXT_PERIOD);

    //$("#txtSupplierName").val(objData.TXT_SUPPLIER_NAME);
    //$("#intSupplierCode").val(objData.TXT_SUPPLIER_CODE);
    //p_txtSupplierName_TextChanged();

    //$("#intSupplierSiteCode").val(objData.TXT_SUPPLIER_SITE_CODE);
    //$("#txtSupplierSiteName").val(objData.TXT_SUPPLIER_SITE_NAME);
    //p_txtSupplierSiteCode_TextChanged();
    $("#txtGroupAccount").val(clsGlobal.parseToString(objData.TXT_GROUP_ACCOUNT)); 
    $("#totalBudget").val(clsGlobal.FormatMoney(objData.DEC_AMOUNT, 0));
    $("#txtTotalTargetSales").val(clsGlobal.FormatMoney(objData.DEC_TARGETSALES, 0));
    $("#txtCostRatio").val(clsGlobal.FormatMoney(objData.DEC_RATIO, 4));

    $("#ddlBudgetType").val(objData.TXT_BUDGET_TYPE);
    //p_PopulateBudgetTypeAndSet(clsGlobal.parseToString(objData.TXT_BUDGET_TYPE));

    p_DataToUIDetail(objData.XXSHP_KDS_M_BGTADD_DTL);
    p_DataToUIOther(objData.XXSHP_KDS_M_BGTADD_ADD);
    p_SetHiddenObject(objData);

    if (objData.INT_BGTADD_HDR_ID != 0) {
        p_EnableControl(true);
    } else {
        p_EnableControl(false);
    }

    //$("#txtHiddenObject").val(JSON.stringify(objData));
    if ($("#txtID").val() == "" || $("#txtID").val() == "0") {
        $("#btnDelete").hide();
        $("#btnSave").show();
    } else {
        $("#btnDelete").hide();
        $("#btnSave").hide();
    }
}

function p_EnableControl(bitApply) {
    
    if (bitApply == true) {
        $("#btnLOVHeaderID").attr("disabled", "true");
        $(".decAmountAdd").each(function (index) {
            $(this).attr("disabled", "true");
        });

    } else {
        $("#btnLOVHeaderID").removeAttr("disabled");
        $(".decAmountAdd").each(function (index) {
            $(this).removeAttr("disabled");
        });

    }
}
 
function p_DataToUIBudget(objData) {
    

    $("#txtHeaderID").val(clsGlobal.parseToInteger(objData.INT_BGT_HDR_ID));

    $("#ddlPeriod").val(objData.TXT_PERIOD);
    $("#txtGroupAccount").val(clsGlobal.parseToString(objData.TXT_GROUP_ACCOUNT));
    //$("#txtSupplierName").val(objData.TXT_SUPPLIER_NAME);
    //$("#intSupplierCode").val(objData.TXT_SUPPLIER_CODE);

    //$("#intSupplierSiteCode").val(objData.TXT_SUPPLIER_SITE_CODE);
    //$("#txtSupplierSiteName").val(objData.TXT_SUPPLIER_SITE_NAME);

    $("#totalBudget").val(clsGlobal.FormatMoney(objData.DEC_AMOUNT,0));
    $("#txtTotalTargetSales").val(clsGlobal.FormatMoney(objData.DEC_TARGETSALES, 0));
    $("#txtCostRatio").val(clsGlobal.FormatMoney(objData.DEC_RATIO, 4));
    $("#ddlBudgetType").val(objData.TXT_BUDGET_TYPE);

    //p_DataToUIDetailBudget(objData.XXSHP_KCO_M_BGT_DTL);
    p_DataToUIDetail(objData.XXSHP_KDS_M_BGTADD_DTL);
    p_DataToUIOther(objData.XXSHP_KDS_M_BGTADD_ADD);
    p_SetHiddenObject(objData);

}

function p_UIToData() {
    //
    var jsonObj = [];
    jsonData = p_GetHiddenObject();
    jsonData.INT_BGTADD_HDR_ID = clsGlobal.parseToInteger($("#txtID").val());
    jsonData.INT_BGT_HDR_ID = clsGlobal.parseToInteger($("#txtHeaderID").val());
    jsonData.TXT_PERIOD = $("#ddlPeriod").val().toString();
    //jsonData.TXT_SUPPLIER_CODE = $("#intSupplierCode").val().toString();
    //jsonData.TXT_SUPPLIER_NAME = $("#txtSupplierName").val().toString();
    //jsonData.TXT_SUPPLIER_SITE_CODE = $("#intSupplierSiteCode").val().toString();
    //jsonData.TXT_SUPPLIER_SITE_NAME = $("#txtSupplierSiteName").val().toString();
    jsonData.TXT_GROUP_ACCOUNT = $("#txtGroupAccount").val().toString();
    jsonData.TXT_BUDGET_TYPE = $("#ddlBudgetType").val().toString(); 
    jsonData.DEC_AMOUNT = clsGlobal.parseToDecimal($("#totalBudget").val());
    jsonData.DEC_TARGETSALES = clsGlobal.parseToDecimal($("#txtTotalTargetSales").val());
    jsonData.DEC_RATIO = clsGlobal.parseToDecimal($("#txtCostRatio").val());

    p_SetHiddenObject(jsonData);
    return $("#txtHiddenObject").val();

}

function p_txtID_TextChanged() {
    clsGlobal.showLoading();
    $.ajax({
        type: "POST",
        url: "/Master/BudgetAdditional/GetData",
        data: { txtID: $("#txtID").val(), __RequestVerificationToken: $('#frmBudgetAdditional input[name=__RequestVerificationToken]').val() },
        datatype: "json",
        success: function (retDat) {
            
            if (retDat.bitSuccess == true) {
                if (retDat.objData != undefined) {
                    if (retDat.objData.INT_BGT_HDR_ID != 0) {
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

function p_txtHeaderID_TextChanged() {
    clsGlobal.showLoading();
    $.ajax({
        type: "POST",
        url: "/Master/BudgetAdditional/GetDataBudget",
        data: {
            txtID: $("#txtHeaderID").val(),
            data: $("#txtBlankObject").val(),
            pTXT_PERIOD: $("#ddlPeriod").val(),
            pTXT_GROUP_ACCOUNT: $("#txtGroupAccount").val(),
            pTXT_BUDGET_TYPE: $("#ddlBudgetType").val(),
            __RequestVerificationToken: $('#frmBudgetAdditional input[name=__RequestVerificationToken]').val()
        },
        datatype: "json",
        success: function (retDat) {
            
            if (retDat.bitSuccess == true) {
                if (retDat.objData != undefined) {
                    p_SetHiddenObject(retDat.objData);
                    p_DataToUIBudget(retDat.objData);
                    $("#txtGUID").val(retDat.txtGUID);
                    //p_DataToUI(objData);
                    //p_txtDetail_Changed(retDat.objData);
                    //$("#txtHeaderID").val(retDat.objData.INT_BGT_HDR_ID);
                    //$("#ddlPeriod").val(retDat.objData.TXT_PERIOD);
                    //$("#intSupplierCode").val(retDat.objData.TXT_SUPPLIER_CODE);
                    //$("#txtSupplierName").val(retDat.objData.TXT_SUPPLIER_NAME);
                    //$("#intSupplierSiteCode").val(retDat.objData.TXT_SUPPLIER_SITE_CODE);
                    //$("#txtSupplierSiteName").val(retDat.objData.TXT_SUPPLIER_SITE_NAME);
                    //$("#ddlBudgetType").val(retDat.objData.TXT_BUDGET_TYPE);

                    //$("#txtBrand").val(retDat.objData.TXT_BRAND);
                    //$("#txtUmbrand").val(retDat.objData.TXT_UMBRAND);
                    //$("#txtLOB").val(retDat.objData.TXT_LOB);
                    //$("#intSupplierCode").val(clsGlobal.parseToString(retDat.objData.VENDOR_NAME));
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


function p_UploadBudgetDetail() {
    clsGlobal.getConfirmation("Upload Budget Detail?", function (result) {
        if (result == true) {
            var data = new FormData();
            var files = $("#fileUploadBudgetDetail").get(0).files;
            if (files.length > 0) {
                data.append("fileUploadBudgetDetail", files[0]);
                data.append("txtHiddenObject", $("#txtHiddenObject").val());
            }
            clsGlobal.showLoading();
            $.ajax({
                type: "POST",
                url: "/Master/BudgetAdditional/UploadBudgetDetail",
                processData: false,
                contentType: false,
                data: data,
                success: function (retDat) {
                    if (retDat.bitSuccess == true) {
                        if (retDat.objData != undefined) {
                            p_SetHiddenObject(retDat.objData);
                            p_DataToUI(retDat.objData);
                            p_CalculateTotal(); 
                            //p_DataToUIDetail(retDat.objData.XXSHP_KCO_M_BGTADD_DTL);
                            //oTableDetail.page('last').draw(false);
                            //p_EnableControl(false);

                            //var objDat = p_GetHiddenObject();
                            //p_CalculateTotal();
                             
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

function p_DownloadBudgetDetail() {
    clsGlobal.getConfirmation("Download Template Budget Detail?", function (result) {
        if (result == true) {
            clsGlobal.showLoading();
            $.ajax({
                type: "POST",
                url: "/Master/BudgetAdditional/DownloadBudgetDetail",
                datatype: "json",
                success: function (url) {
                    
                    window.location = url;
                    clsGlobal.hideLoading();
                },
                error: function (url) {
                    clsGlobal.hideLoading();
                }
            });
        }
        else {
            return false;
        }
    });
}

function converter(id, index) {
    //
    var objDat = p_GetHiddenObject();

    var index = objDat.XXSHP_KDS_M_BGTADD_DTL.length;
    var Total = 0;

    for (var i = 0; i <= index - 1; i++) {
        //var modulo = i % 5;
        Total = Total + clsGlobal.parseToAngka($('#dtDetail').DataTable().cell(i, 7).nodes().to$().find('input').val())
    }

    $("#totalBudget").val(clsGlobal.parseToRupiah(Total));

    $("#" + id).val(clsGlobal.parseToRupiah(clsGlobal.parseToAngka($('#' + id).val())));

    //p_SetHiddenObject(objDat);
}

function p_txtUmbrand_Changed(objCaller, intIndex) {
    
    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());
    for (i = 0; i < objData.XXSHP_KDS_M_BGTADD_DTL.length; i++) {
        // Cari Index-nya.
        if (objData.XXSHP_KDS_M_BGTADD_DTL[i].intIndex == intIndex) {
            // Ketemu, mulai dari sini:
            objData.XXSHP_KDS_M_BGTADD_DTL[i].TXT_UMBRAND = objCaller.value;
            break;
        }
    }
    p_SetHiddenObject(objData);
}

function p_txtBrand_Changed(objCaller, intIndex) {
    
    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());
    for (i = 0; i < objData.XXSHP_KDS_M_BGTADD_DTL.length; i++) {
        // Cari Index-nya.
        if (objData.XXSHP_KDS_M_BGTADD_DTL[i].intIndex == intIndex) {
            // Ketemu, mulai dari sini:
            objData.XXSHP_KDS_M_BGTADD_DTL[i].TXT_BRAND = objCaller.value;
            break;
        }
    }
    p_SetHiddenObject(objData);
}

function p_txtLOB_Changed(objCaller, intIndex) {
    
    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());
    for (i = 0; i < objData.XXSHP_KDS_M_BGTADD_DTL.length; i++) {
        // Cari Index-nya.
        if (objData.XXSHP_KDS_M_BGTADD_DTL[i].intIndex == intIndex) {
            // Ketemu, mulai dari sini:
            objData.XXSHP_KDS_M_BGTADD_DTL[i].TXT_LOB = objCaller.value;
            break;
        }
    }
    p_SetHiddenObject(objData);
}

function p_txtSubBrand_Changed(objCaller, intIndex) {
    
    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());
    for (i = 0; i < objData.XXSHP_KDS_M_BGTADD_DTL.length; i++) {
        // Cari Index-nya.
        if (objData.XXSHP_KDS_M_BGTADD_DTL[i].intIndex == intIndex) {
            // Ketemu, mulai dari sini:
            objData.XXSHP_KDS_M_BGTADD_DTL[i].TXT_SUBBRAND = objCaller.value;
            break;
        }
    }
    p_SetHiddenObject(objData);
}

function p_decAmountAdd_Changed(objCaller, intIndex) {
    
    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());
    for (i = 0; i < objData.XXSHP_KDS_M_BGTADD_DTL.length; i++) {
        // Cari Index-nya.
        if (objData.XXSHP_KDS_M_BGTADD_DTL[i].intIndex == intIndex) {
            // Ketemu, mulai dari sini: 
            objData.XXSHP_KDS_M_BGTADD_DTL[i].DEC_AMOUNT = clsGlobal.parseToAngka(objCaller.value);

            // Hitung Cost Ratio.
            var decRatio = 0;
            if (objData.XXSHP_KDS_M_BGTADD_DTL[i].DEC_TARGETSALES != 0) {
                decRatio = clsGlobal.parseToDecimal(objData.XXSHP_KDS_M_BGTADD_DTL[i].DEC_AMOUNT / objData.XXSHP_KDS_M_BGTADD_DTL[i].DEC_TARGETSALES);
            }
            objData.XXSHP_KDS_M_BGTADD_DTL[i].DEC_RATIO = decRatio;
            break;
        }
    }
    p_SetHiddenObject(objData);
    p_CalculateTotal();
    p_RefreshNumberDetail();
}

function p_txtTargetSales_Changed(objCaller, intIndex) {
    
    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());
    for (i = 0; i < objData.XXSHP_KDS_M_BGTADD_DTL.length; i++) {
        // Cari Index-nya.
        if (objData.XXSHP_KDS_M_BGTADD_DTL[i].intIndex == intIndex) {
            // Ketemu, mulai dari sini:
            objData.XXSHP_KDS_M_BGTADD_DTL[i].DEC_TARGETSALES = clsGlobal.parseToDecimal(objCaller.value);

            // Hitung Cost Ratio.
            var decRatio = 0;
            if (objData.XXSHP_KDS_M_BGTADD_DTL[i].DEC_TARGETSALES != 0) {
                decRatio = clsGlobal.parseToDecimal(objData.XXSHP_KDS_M_BGTADD_DTL[i].DEC_AMOUNT / objData.XXSHP_KDS_M_BGTADD_DTL[i].DEC_TARGETSALES);
            }
            objData.XXSHP_KDS_M_BGTADD_DTL[i].DEC_RATIO = decRatio;
            break;
        }
    }
    p_SetHiddenObject(objData);
    p_CalculateTotal();
    p_RefreshNumberDetail();
}

function p_CalculateTotal() {
    
    var decTotalBudget = 0;
    var decTotalTargetSales = 0;
    var decCostRatio = 0;
    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());
    for (i = 0; i < objData.XXSHP_KDS_M_BGTADD_DTL.length; i++) {
        decTotalBudget += objData.XXSHP_KDS_M_BGTADD_DTL[i].DEC_AMOUNT;
        decTotalTargetSales += objData.XXSHP_KDS_M_BGTADD_DTL[i].DEC_TARGETSALES;
    }
    for (i = 0; i < objData.XXSHP_KDS_M_BGTADD_ADD.length; i++) {
        decTotalBudget += objData.XXSHP_KDS_M_BGTADD_ADD[i].DEC_AMOUNT;
        decTotalTargetSales += objData.XXSHP_KDS_M_BGTADD_ADD[i].DEC_TARGETSALES;
    }
    if (decTotalTargetSales != 0) {
        decCostRatio = clsGlobal.parseToDecimal(decTotalBudget / decTotalTargetSales);
    }

    $("#totalBudget").val(clsGlobal.parseToRupiah(decTotalBudget));
    $("#txtTotalTargetSales").val(clsGlobal.FormatMoney(decTotalTargetSales, 0));
    $("#txtCostRatio").val(clsGlobal.FormatMoney(decCostRatio, 4));

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
    for (i = 0; i < objData.XXSHP_KDS_M_BGTADD_DTL.length; i++) {
        // Cari Index-nya.
        if (objData.XXSHP_KDS_M_BGTADD_DTL[i].intIndex == intIndex) {
            // Ketemu, mulai dari sini:
            // Remove from list.
            objData.XXSHP_KDS_M_BGTADD_DTL.splice(i, 1);

            oTableDetail.row(i).remove().draw(false);
            var objDat = p_GetHiddenObject();
            var index = objDat.XXSHP_KDS_M_BGT_DTL.length;
            var Total = 0;

            for (var i = 0; i <= index - 1; i++) {
                //var modulo = i % 5;
                Total = Total + clsGlobal.parseToAngka($('#dtDetail').DataTable().cell(i, 7).nodes().to$().find('input').val())
            }

            $("#totalBudget").val(clsGlobal.parseToRupiah(Total));
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
        objDat.XXSHP_KDS_M_BGTADD_DTL[intRowIndex].intIndex = d.intIndex;

        d.INT_BGTADD_HDR_ID = objDat.XXSHP_KDS_M_BGTADD_DTL[intRowIndex].INT_BGTADD_HDR_ID
        d.TXT_LOB = objDat.XXSHP_KDS_M_BGTADD_DTL[intRowIndex].TXT_LOB;
        d.TXT_UMBRAND = objDat.XXSHP_KDS_M_BGTADD_DTL[intRowIndex].TXT_UMBRAND;
        d.TXT_SUBUMBRAND = objDat.XXSHP_KDS_M_BGTADD_DTL[intRowIndex].TXT_SUBUMBRAND;
        d.TXT_BRAND = objDat.XXSHP_KDS_M_BGTADD_DTL[intRowIndex].TXT_BRAND;
        d.TXT_SUBBRAND = objDat.XXSHP_KDS_M_BGTADD_DTL[intRowIndex].TXT_SUBBRAND;
        d.DEC_AMOUNT = objDat.XXSHP_KDS_M_BGTADD_DTL[intRowIndex].DEC_AMOUNT;
        d.DEC_ENDINGBALANCE = objDat.XXSHP_KDS_M_BGTADD_DTL[intRowIndex].DEC_ENDINGBALANCE;
        d.DEC_TARGETSALES = objDat.XXSHP_KDS_M_BGTADD_DTL[intRowIndex].DEC_TARGETSALES;
        d.DEC_RATIO = objDat.XXSHP_KDS_M_BGTADD_DTL[intRowIndex].DEC_RATIO;
        intRowIndex++;
        this.invalidate(); // invalidate the data DataTables has cached for this row         
    });

    // Draw once all updates are done
    oTableDetail.draw(false);
    p_SetHiddenObject(objDat);
}

function p_DataToUIDetail(XXSHP_KDS_M_BGTADD_DTL) {
    
    oTableDetail.clear();
    for (var i = 0; i < XXSHP_KDS_M_BGTADD_DTL.length; i++) {
        XXSHP_KDS_M_BGTADD_DTL[i].intIndex = i;
        //XXSHP_KCO_M_BGTADD_DTL[i].DEC_AMOUNT = clsGlobal.parseToRupiah(XXSHP_KCO_M_BGTADD_DTL[i].DEC_AMOUNT);
        //XXSHP_KCO_M_BGTADD_DTL[i].DEC_ENDINGBALANCE = clsGlobal.parseToRupiah(XXSHP_KCO_M_BGTADD_DTL[i].DEC_ENDINGBALANCE);
        oTableDetail.row.add(XXSHP_KDS_M_BGTADD_DTL[i]);
    }
    oTableDetail.draw(false);

    var objDat = p_GetHiddenObject();
    objDat.XXSHP_KDS_M_BGTADD_DTL = XXSHP_KDS_M_BGTADD_DTL;
    p_SetHiddenObject(objDat);
}

//function p_DataToUIDetailBudget(XXSHP_KCO_M_BGT_DTL) {
//    
//    oTableDetail.clear();
//    for (var i = 0; i < XXSHP_KCO_M_BGT_DTL.length; i++) {
//        XXSHP_KCO_M_BGT_DTL[i].intIndex = i;
//        XXSHP_KCO_M_BGT_DTL[i].DEC_AMOUNT = 0;        
//        oTableDetail.row.add(XXSHP_KCO_M_BGT_DTL[i]);
//    }
//    oTableDetail.draw(false);

//    var objDat = p_GetHiddenObject();
//    objDat.XXSHP_KCO_M_BGT_DTL = XXSHP_KCO_M_BGT_DTL;
//    p_SetHiddenObject(objDat);
//}

function p_saveData() {
    
    clsGlobal.showLoading();
    p_UIToData();
    $.ajax({
        type: "POST",
        url: "/Master/BudgetAdditional/SaveData",
        data: { data: $("#txtHiddenObject").val(), txtGUID: $("#txtGUID").val(), __RequestVerificationToken: $('#frmBudgetAdditional input[name=__RequestVerificationToken]').val() },
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

function p_deleteData() {
    clsGlobal.showLoading();
    p_UIToData();
    $.ajax({
        type: "POST",
        url: "/Master/BudgetAdditional/DeleteData",
        data: { data: $("#txtHiddenObject").val(), txtGUID: $("#txtGUID").val(), __RequestVerificationToken: $('#frmBudgetAdditional input[name=__RequestVerificationToken]').val() },
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


//=======================
// OTHER
//=======================


function p_InitiateOther() {
    // Format datatable  
    
    oTableOther = $('#dtOther').DataTable({
        "bPaginate": true,
        "bSort": false,
        searching: true,
        "type": "POST",
        "aLengthMenu": [[5, 10, 25, 50, 75, 100], [5, 10, 25, 50, 75, 100]],
        "iDisplayLength": 5,
        "scrollX": true,
        aoColumnDefs: [

              {
                  aTargets: [0],
                  mRender: function (data, type, full) { 
                      return '<div id="lblOtherNoValue"> ' + (full.intIndex + 1) + ' </div>';
                  }
              },
              {
                  aTargets: [1],
                  mRender: function (data, type, full) {
                      //return '<div > <input type="text" class="form-control " id="txtOtherUmBrand' + full.intIndex + '" class="txtOtherUmBrand" onchange="p_txtOtherUmBrand_Changed(this,' + full.intIndex + ')"  value="' + full.TXT_UMBRAND
                      // + '" disabled> </div> </div>';
                      return '     <div class="input-group"> ' +
                          '       <div class="input-group-btn"  > ' +
                          '           <button type="button" class="btn btn-danger btnLOVOtherSubbrand" id="btnLOVOtherSubbrand" onclick="p_btnLOVOtherSubbrand_Click(this,' + full.intIndex + ')"> <i class="fa fa-search"></i></button> ' +
                          '       </div> ' +
                          '       <div class="input-group-btn" style="width:100%;"> ' +
                          '       <input type="text" class="form-control txtOtherUmBrand" id="txtOtherUmBrand" style="width:120px" value="' + full.TXT_UMBRAND + '" disabled> ' +
                          '       </div> ' +
                          '   </div>';
                  }
              },
           {
               aTargets: [2],
               mRender: function (data, type, full) {
                   return '<div > <input type="text" class="form-control " id="txtOtherSubUmBrand' + full.intIndex + '" style="width:100px" class="txtOtherSubUmBrand" onchange="p_txtOtherSubUmBrand_Changed(this,' + full.intIndex + ')"  value="' + full.TXT_SUBUMBRAND
                       + '" disabled> </div> </div>';

               }
           },

           {
               aTargets: [3],
               mRender: function (data, type, full) {
                   return '<div >  <input type="text" class="form-control" id="txtOtherBrand' + full.intIndex + '" style="width:100px" class="txtOtherBrand" onchange="p_txtOtherBrand_Changed(this,' + full.intIndex + ')"  value="' + full.TXT_BRAND + '" disabled>  </div>';

               }
           },
            {
                aTargets: [4],
                mRender: function (data, type, full) {
                    return '<div >  <input type="text" class="form-control" id="txtOtherSubBrand' + full.intIndex + '" style="width:180px" class="txtOtherSubBrand" onchange="p_txtOtherSubBrand_Changed(this,' + full.intIndex + ')"  value="' + full.TXT_SUBBRAND + '" disabled>  </div>';

                }
            },
            {
                aTargets: [5],
                mRender: function (data, type, full) {
                    return '<div >  <input type="text" class="form-control" id="txtOtherLOB' + full.intIndex + '" style="width:60px" class="txtOtherLOB" onchange="p_txtOtherLOB_Changed(this,' + full.intIndex + ')"  value="' + full.TXT_LOB + '" disabled>  </div>';

                }
            },            
           {
               aTargets: [6],
               mRender: function (data, type, full) {
                   return '<div >  <input type="text" class="form-control text-right autonumeric txtOtherAmount" style="width:150px" id="txtOtherAmount' + full.intIndex + '" onchange="p_txtOtherAmount_Changed(this,' + full.intIndex + ')"  value="' + full.DEC_AMOUNT + '" >  </div>';

               }
           },
           {
               aTargets: [7],
               mRender: function (data, type, full) {
                   return '<div >  <input type="text" class="form-control text-right txtOtherTargetSales autonumeric"  style="width:150px;" id="txtOtherTargetSales" onchange="p_txtOtherTargetSales_Changed(this,' + full.intIndex + ')"  value="' + full.DEC_TARGETSALES + '" >  </div>';
               }
           },
           {
               aTargets: [8],
               mRender: function (data, type, full) {
                   return '<div >  <input type="text" class="form-control text-right txtOtherCostRatio autonumeric4"  style="width:150px;" id="txtOtherCostRatio" value="' + full.DEC_RATIO + '" disabled >  </div>';

               }
           } ,
           {
               aTargets: [9],
               mRender: function (data, type, full) {
                   return '<div > <input type="button" class="btn btn-warning btnOtherDelete" id="btnOtherDelete" onclick="p_btnOtherDelete_Click(this,' + full.intIndex + ')"  value="Delete" >  </div>';

               }
           }
        ]//,
        //"fnDrawCallback": function (oSettings) {
        //    if (adaID == true) {
        //        p_EnableControl(true);
        //    }
        //    else {
        //        p_EnableControl(false);
        //    }
        //    //p_EnableControl(true);
        //}
    });

    $("#dtOther").css("width", "100%");
    $('#dtOther tbody').on('click', 'tr', function () {
        if (!$(this).hasClass('selected')) {
            oTableOther.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
        }
    });
}


function p_GetSelectedOtherRow() {
    var intIndex = clsGlobal.parseToInteger(oTableOther.$('tr.selected').find("#lblOtherNoValue").html()) - 1;
    return intIndex;
}

function p_btnLOVOtherSubbrand_Click(objCaller, intIndex) {
    LOV = clsGlobal.generateLOV(MODULE_BRAND, "txtOtherUmBrand");
}


function p_settxtOtherUmBrand(txtValue1, txtValue2, txtValue3, txtValue4, txtValue5, txtValue6, txtValue7, txtValue8) {
    
    var intSelectedIndex = p_GetSelectedOtherRow();
    var intRowIndex = 0;
    var intRowSelectedIndex = 0;
    var objDat = p_GetHiddenObject();
    oTableOther.rows().every(function (rowIdx, tableLoop, rowLoop) {
        
        var d = this.data();
        if (intRowIndex == intSelectedIndex) {
            d.intIndex = intRowIndex; // update data source for the row 
            
            //ambil ending balance start
            //clsGlobal.showLoading();
            //$.ajax({
            //    type: "POST",
            //    url: "/Master/BudgetAdditional/GetDataEndingBalance",
            //    data: { TXT_PERIOD: $("#ddlPeriod").val(),
            //        TXT_GROUP_ACCOUNT: $("#txtGroupAccount").val(),
            //        TXT_BUDGET_TYPE: $("#ddlBudgetType").val(),
            //        TXT_LOB: txtValue8,
            //        TXT_UMBRAND: txtValue7,
            //        TXT_SUBUMBRAND:txtValue4,
            //        TXT_BRAND: txtValue2,
            //        TXT_SUBBRAND: txtValue3,                    
            //        __RequestVerificationToken: $('#frmBudgetAdditional input[name=__RequestVerificationToken]').val() },
            //    datatype: "json",
            //    success: function (retDat) {
            //        
            //        if (retDat.bitSuccess == true) {
            //            if (retDat.objData != undefined) {
            //                d.DEC_ENDINGBALANCE = retDat.objData;                        
            //                oTableOther.page('last').draw(false); 
            //            }
            //        } else {
            //            clsGlobal.getAlert(retDat.txtMessage);
            //        }
            //        clsGlobal.hideLoading();
            //    },
            //    error: function (retDat) {
            //        clsGlobal.hideLoading();
            //    }
            //});
            //ambil ending balance ending
            

            d.TXT_LOB = txtValue8;
            d.TXT_UMBRAND = txtValue7;
            d.TXT_SUBUMBRAND = txtValue4;
            d.TXT_BRAND = txtValue2;
            d.TXT_SUBBRAND = txtValue3;
            

            objDat.XXSHP_KDS_M_BGTADD_ADD[intRowIndex].TXT_LOB = txtValue8;
            objDat.XXSHP_KDS_M_BGTADD_ADD[intRowIndex].TXT_UMBRAND = txtValue7;
            objDat.XXSHP_KDS_M_BGTADD_ADD[intRowIndex].TXT_SUBUMBRAND = txtValue4;
            objDat.XXSHP_KDS_M_BGTADD_ADD[intRowIndex].TXT_BRAND = txtValue2;
            objDat.XXSHP_KDS_M_BGTADD_ADD[intRowIndex].TXT_SUBBRAND = txtValue3;
            //objDat.XXSHP_KCO_M_BGTADD_ADD[intRowIndex].DEC_ENDINGBALANCE = d.DEC_ENDINGBALANCE;
 
            this.invalidate(); // invalidate the data DataTables has cached for this row   

            intRowSelectedIndex = intRowIndex;
        }

        intRowIndex++;
    }); 
    p_SetHiddenObject(objDat);
    p_RefreshRowOther(intRowSelectedIndex);
}

function p_txtOtherUmbrand_Changed(objCaller, intIndex) {
    
    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());
    for (i = 0; i < objData.XXSHP_KDS_M_BGTADD_ADD.length; i++) {
        // Cari Index-nya.
        if (objData.XXSHP_KDS_M_BGTADD_ADD[i].intIndex == intIndex) {
            // Ketemu, mulai dari sini:
            objData.XXSHP_KDS_M_BGTADD_ADD[i].TXT_UMBRAND = objCaller.value;
            break;
        }
    }
    p_SetHiddenObject(objData);
}

function p_txtOtherBrand_Changed(objCaller, intIndex) {
    
    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());
    for (i = 0; i < objData.XXSHP_KDS_M_BGTADD_ADD.length; i++) {
        // Cari Index-nya.
        if (objData.XXSHP_KDS_M_BGTADD_ADD[i].intIndex == intIndex) {
            // Ketemu, mulai dari sini:
            objData.XXSHP_KDS_M_BGTADD_ADD[i].TXT_BRAND = objCaller.value;
            break;
        }
    }
    p_SetHiddenObject(objData);
}

function p_txtOtherLOB_Changed(objCaller, intIndex) {
    
    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());
    for (i = 0; i < objData.XXSHP_KDS_M_BGTADD_ADD.length; i++) {
        // Cari Index-nya.
        if (objData.XXSHP_KDS_M_BGTADD_ADD[i].intIndex == intIndex) {
            // Ketemu, mulai dari sini:
            objData.XXSHP_KDS_M_BGTADD_ADD[i].TXT_LOB = objCaller.value;
            break;
        }
    }
    p_SetHiddenObject(objData);
}

function p_txtOtherSubBrand_Changed(objCaller, intIndex) {
    
    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());
    for (i = 0; i < objData.XXSHP_KDS_M_BGTADD_ADD.length; i++) {
        // Cari Index-nya.
        if (objData.XXSHP_KDS_M_BGTADD_ADD[i].intIndex == intIndex) {
            // Ketemu, mulai dari sini:
            objData.XXSHP_KDS_M_BGTADD_ADD[i].TXT_SUBBRAND = objCaller.value;
            break;
        }
    }
    p_SetHiddenObject(objData);
}

function p_txtOtherAmount_Changed(objCaller, intIndex) {
    
    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());
    for (i = 0; i < objData.XXSHP_KDS_M_BGTADD_ADD.length; i++) {
        // Cari Index-nya.
        if (objData.XXSHP_KDS_M_BGTADD_ADD[i].intIndex == intIndex) {
            // Ketemu, mulai dari sini:
            objData.XXSHP_KDS_M_BGTADD_ADD[i].DEC_AMOUNT = clsGlobal.parseToDecimal(objCaller.value);

            // Hitung Cost Ratio.
            var decRatio = 0;
            if (objData.XXSHP_KDS_M_BGTADD_ADD[i].DEC_TARGETSALES != 0) {
                decRatio = clsGlobal.parseToDecimal(objData.XXSHP_KDS_M_BGTADD_ADD[i].DEC_AMOUNT / objData.XXSHP_KDS_M_BGTADD_ADD[i].DEC_TARGETSALES);
            }
            objData.XXSHP_KDS_M_BGTADD_ADD[i].DEC_RATIO = decRatio;

            break;
        }
    }
    p_SetHiddenObject(objData);
    p_CalculateTotal();
    p_RefreshNumberOther();
}

function p_txtOtherTargetSales_Changed(objCaller, intIndex) {
    
    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());
    for (i = 0; i < objData.XXSHP_KDS_M_BGTADD_ADD.length; i++) {
        // Cari Index-nya.
        if (objData.XXSHP_KDS_M_BGTADD_ADD[i].intIndex == intIndex) {
            // Ketemu, mulai dari sini:
            objData.XXSHP_KDS_M_BGTADD_ADD[i].DEC_TARGETSALES = clsGlobal.parseToDecimal(objCaller.value);

            // Hitung Cost Ratio.
            var decRatio = 0;
            if (objData.XXSHP_KDS_M_BGTADD_ADD[i].DEC_TARGETSALES != 0) {
                decRatio = clsGlobal.parseToDecimal(objData.XXSHP_KDS_M_BGTADD_ADD[i].DEC_AMOUNT / objData.XXSHP_KDS_M_BGTADD_ADD[i].DEC_TARGETSALES);
            }
            objData.XXSHP_KDS_M_BGTADD_ADD[i].DEC_RATIO = decRatio;
            break;
        }
    }
    p_SetHiddenObject(objData);
    p_CalculateTotal();
    p_RefreshNumberOther();
}


function p_AddOther() {
    
    clsGlobal.showLoading();
    $.ajax({
        type: "POST",
        url: "/Master/BudgetAdditional/AddOther",
        data: { data: $("#txtHiddenObject").val(), __RequestVerificationToken: $('#frmBudgetAdditional input[name=__RequestVerificationToken]').val() },
        datatype: "json",
        success: function (retDat) {
            
            if (retDat.bitSuccess == true) {
                if (retDat.objData != undefined) {
                    p_SetHiddenObject(retDat.objData);
                    p_DataToUIOther(retDat.objData.XXSHP_KDS_M_BGTADD_ADD);
                    oTableOther.page('last').draw(false); 
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

function p_btnOtherDelete_Click(objCaller, intIndex) {
    
    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());
    for (i = 0; i < objData.XXSHP_KDS_M_BGTADD_ADD.length; i++) {
        // Cari Index-nya.
        if (objData.XXSHP_KDS_M_BGTADD_ADD[i].intIndex == intIndex) {
            // Ketemu, mulai dari sini:
            // Remove from list.
            objData.XXSHP_KDS_M_BGTADD_ADD.splice(i, 1);
            oTableOther.row(i).remove().draw(false);
           
            break;
        }
    }
    p_SetHiddenObject(objData);
    p_RefreshNumberOther();
    p_CalculateTotal();
}

function p_RefreshNumberOther() {
    
    var intRowIndex = 0;
    var objDat = p_GetHiddenObject();
    oTableOther.rows().every(function (rowIdx, tableLoop, rowLoop) {
        
        var d = this.data();
        d.intIndex = intRowIndex; // update data source for the row
        objDat.XXSHP_KDS_M_BGTADD_ADD[intRowIndex].intIndex = d.intIndex;

        d.INT_BGTADD_HDR_ID = objDat.XXSHP_KDS_M_BGTADD_ADD[intRowIndex].INT_BGTADD_HDR_ID
        d.TXT_LOB = objDat.XXSHP_KDS_M_BGTADD_ADD[intRowIndex].TXT_LOB;
        d.TXT_UMBRAND = objDat.XXSHP_KDS_M_BGTADD_ADD[intRowIndex].TXT_UMBRAND;
        d.TXT_SUBUMBRAND = objDat.XXSHP_KDS_M_BGTADD_ADD[intRowIndex].TXT_SUBUMBRAND;
        d.TXT_BRAND = objDat.XXSHP_KDS_M_BGTADD_ADD[intRowIndex].TXT_BRAND;
        d.TXT_SUBBRAND = objDat.XXSHP_KDS_M_BGTADD_ADD[intRowIndex].TXT_SUBBRAND;
        d.DEC_AMOUNT = objDat.XXSHP_KDS_M_BGTADD_ADD[intRowIndex].DEC_AMOUNT;
        d.DEC_TARGETSALES = objDat.XXSHP_KDS_M_BGTADD_ADD[intRowIndex].DEC_TARGETSALES;
        d.DEC_RATIO = objDat.XXSHP_KDS_M_BGTADD_ADD[intRowIndex].DEC_RATIO;

        //d.DEC_ENDINGBALANCE = objDat.XXSHP_KCO_M_BGTADD_ADD[intRowIndex].DEC_ENDINGBALANCE;
        intRowIndex++;
        this.invalidate(); // invalidate the data DataTables has cached for this row         
    });

    // Draw once all updates are done
    oTableOther.draw(false);
    p_SetHiddenObject(objDat);
}


function p_RefreshRowOther(intIndex) {
    
    var intRowIndex = 0;
    var objDat = p_GetHiddenObject();
    oTableOther.rows().every(function (rowIdx, tableLoop, rowLoop) {
        
        if (intIndex == intRowIndex) {
            var d = this.data();
            d.intIndex = intRowIndex; // update data source for the row
            objDat.XXSHP_KDS_M_BGTADD_ADD[intRowIndex].intIndex = d.intIndex;

            d.INT_BGTADD_HDR_ID = objDat.XXSHP_KDS_M_BGTADD_ADD[intRowIndex].INT_BGTADD_HDR_ID
            d.TXT_LOB = objDat.XXSHP_KDS_M_BGTADD_ADD[intRowIndex].TXT_LOB;
            d.TXT_UMBRAND = objDat.XXSHP_KDS_M_BGTADD_ADD[intRowIndex].TXT_UMBRAND;
            d.TXT_SUBUMBRAND = objDat.XXSHP_KDS_M_BGTADD_ADD[intRowIndex].TXT_SUBUMBRAND;
            d.TXT_BRAND = objDat.XXSHP_KDS_M_BGTADD_ADD[intRowIndex].TXT_BRAND;
            d.TXT_SUBBRAND = objDat.XXSHP_KDS_M_BGTADD_ADD[intRowIndex].TXT_SUBBRAND;
            d.DEC_AMOUNT = objDat.XXSHP_KDS_M_BGTADD_ADD[intRowIndex].DEC_AMOUNT;

            //d.DEC_ENDINGBALANCE = objDat.XXSHP_KCO_M_BGTADD_ADD[intRowIndex].DEC_ENDINGBALANCE;

            intRowIndex++;
            this.invalidate(); // invalidate the data DataTables has cached for this row   
        }
        intRowIndex++;
    });

    // Draw once all updates are done
    oTableOther.draw(false);
    p_SetHiddenObject(objDat);
}

function p_DataToUIOther(XXSHP_KDS_M_BGTADD_ADD) {
    
    oTableOther.clear();
    for (var i = 0; i < XXSHP_KDS_M_BGTADD_ADD.length; i++) {
        XXSHP_KDS_M_BGTADD_ADD[i].intIndex = i;        
        oTableOther.row.add(XXSHP_KDS_M_BGTADD_ADD[i]);
    }
    oTableOther.draw(false);

    var objDat = p_GetHiddenObject();
    objDat.XXSHP_KDS_M_BGTADD_ADD = XXSHP_KDS_M_BGTADD_ADD;
    p_SetHiddenObject(objDat);
}


//=======================
// HANDLER
//=======================


$('#btnLOVID').bind('click', function () {
    try {
        LOV = clsGlobal.generateLOV(MODULE_BUDGETADDITIONAL, "txtID");
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
});

$('#btnFind').bind('click', function () {
    try {
        LOV = clsGlobal.generateLOV(MODULE_BUDGETADDITIONAL, "txtID");
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
});

$('#btnLOVHeaderID').bind('click', function () {
    try {
        LOV = clsGlobal.generateLOV(MODULE_BUDGET, "txtHeaderID");
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

$('#btnAddOther').on('click', function () {
    try {
        p_AddOther();
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