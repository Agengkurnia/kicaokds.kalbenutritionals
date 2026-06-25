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
            $("#ddlPeriod").val(arr[2]);
            $("#txtGroupAccount").val(arr[3]);
            $("#ddlBudgetType").val(arr[4]);
            p_txtID_TextChanged();
            break;
        case "txtGroupAccount":
            //$("#txtGroupAccount").val(arr[1]);
            //
            //p_txtSupplierID_TextChanged();
            p_settxtGroupAccount(arr[1]);
            //aa
            break;
        case "txtUmBrand":
            p_settxtUmbrand(arr[1]);
            break;
    }
    clsGlobal.closeLOV();
}

function p_DataToUI(objData) {
    $("#fileUploadBudgetDetailV2").val(objData.empty);

    p_PopulatePeriodAndSet(clsGlobal.parseToString(objData.TXT_PERIOD));

    $("#ddlBudgetType").val(clsGlobal.parseToString(objData.TXT_BUDGET_TYPE));
    p_PopulateBudgetTypeAndSet(clsGlobal.parseToString(objData.TXT_BUDGET_TYPE));

    p_DataToUIDetail(objData.XXSHP_KDS_M_BGT_DTL);
    p_SetHiddenObject(objData);

    if (objData.INT_BGT_HDR_ID != 0) {
        p_EnableControl(true);
    } else {
        p_EnableControl(false);
    }

    ////$("#txtHiddenObject").val(JSON.stringify(objData));
    //if ($("#txtID").val() == "" || $("#txtID").val() == "0") {
    //    $("#btnDelete").hide();
    //    $("#btnSave").show();
    //} else {
    //    $("#btnDelete").hide();
    //    $("#btnSave").hide();
    //}
    $("#btnDelete").hide();
    $("#btnSave").show();
}

function p_DataToUIDetail(XXSHP_KDS_M_BGT_DTL) {
    

    oTableDetail.clear();
    for (var i = 0; i < XXSHP_KDS_M_BGT_DTL.length; i++) {
        XXSHP_KDS_M_BGT_DTL[i].intIndex = i;
        //XXSHP_KDS_M_BGT_DTL[i].DEC_OPENBALANCE = clsGlobal.parseToRupiah(XXSHP_KDS_M_BGT_DTL[i].DEC_OPENBALANCE);

        oTableDetail.row.add(XXSHP_KDS_M_BGT_DTL[i]);
    }
    oTableDetail.draw(false);

    var objDat = p_GetHiddenObject();
    objDat.XXSHP_KDS_M_BGT_DTL = XXSHP_KDS_M_BGT_DTL;
    p_SetHiddenObject(objDat);

}

function p_UploadBudgetDetail() {
    p_UIToData();
    clsGlobal.getConfirmation("Upload Budget Detail?", function (result) {
        if (result == true) {
            var data = new FormData();
            var files = $("#fileUploadBudgetDetailV2").get(0).files;
            if (files.length > 0) {
                data.append("fileUploadBudgetDetailV2", files[0]);
                data.append("txtHiddenObject", $("#txtHiddenObject").val());
            }
            clsGlobal.showLoading();
            $.ajax({
                type: "POST",
                url: "/Master/BudgetV2/UploadBudgetDetail",
                processData: false,
                contentType: false,
                data: data,
                success: function (retDat) {
                    if (retDat.bitSuccess == true) {
                        if (retDat.objData != undefined) {
                            p_SetHiddenObject(retDat.objData);
                            p_DataToUI(retDat.objData);
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
        var TXT_PERIOD = $("#ddlPeriod").val().toString();
        if (TXT_PERIOD == "" || TXT_PERIOD == null) {
            clsGlobal.showAlert("Harap pilih period terlebih dahulu!");
            result = false;
        }
        if (result == true) {
            clsGlobal.showLoading();
            $.ajax({
                type: "POST",
                url: "/Master/BudgetV2/DownloadBudgetDetail",
                datatype: "json",
                data: {
                    pTXT_PERIOD: TXT_PERIOD
                },
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

function p_UIToData() {
    
    var jsonObj = [];
    jsonData = p_GetHiddenObject();
    jsonData.TXT_PERIOD = $("#ddlPeriod").val().toString();
    jsonData.TXT_BUDGET_TYPE = $("#ddlBudgetType").val().toString();

    p_SetHiddenObject(jsonData);
    return $("#txtHiddenObject").val();

}

function p_SetHiddenObject(objDat) {
    $("#txtHiddenObject").val(JSON.stringify(objDat));

    //AutoNumeric.
    p_GenerateAutoNumeric();
    p_GenerateDateTimePicker();
}

function p_GenerateAutoNumeric() {
    
    $('.autonumeric').autoNumeric('init', { vMax: '9999999999999', vMin: '-9999999999999', aSep: ',', dGroup: '3', aDec: '.' });
    $('.autonumeric4').autoNumeric('init', { vMax: '999999999.9999', vMin: '-999999999.9999', aSep: ',', dGroup: '3', aDec: '.' });
}

function p_GenerateDateTimePicker() {
    
    $('.datetimepicker').datepicker({
        autoclose: true,
    });

}

function p_GetHiddenObject() {
    return JSON.parse($("#txtHiddenObject").val());
}

//function p_disabled() {
//    $("#btnSave").hide();
//    $('#txtID').prop("disabled", true);
//    $('#ddlPeriod').prop("disabled", true);
//    $('#intSupplierCode').prop("disabled", true);
//    $('#txtSupplierName').prop("disabled", true);
//    $('#intSupplierSiteCode').prop("disabled", true);
//    $('#txtSupplierSiteName').prop("disabled", true);
//    $('#ddlBudgetType').prop("disabled", true);
//    $('#totalBudget').prop("disabled", true);
//    $('#decOpenBalance').prop("disabled", true);
//    $('#btnLOVVendor').prop("disabled", true);
//    $('#btnLOVVendorSite').prop("disabled", true);
//    $('#btnUmbrandLOVID').prop("disabled", true);

//    $('.btnAddDetail').prop("disabled", true);
//    $('.btnDetailDelete').prop("disabled", true);
//}

function p_EnableControl(bitApply) {
    //
    if (bitApply == true) {
        //$("#totalBudget").attr("disabled", "true");
        $("#fileUploadBudgetDetailV2").attr("disabled", "true");
        $(".Upload").attr("disabled", "true");
        $("#ddlPeriod").attr("disabled", "true");
        $("#ddlBudgetType").attr("disabled", "true");

        $("#btnLOVGroupAccount").attr("disabled", "true");
        //$("#btnLOVVendor").attr("disabled", "true");
        //$("#btnLOVVendorSite").attr("disabled", "true");
        $("#btnAddDetail").hide();
        $("#btnSave").hide();

        $(".decOpenBalance").each(function (index) {
            $(this).attr("disabled", "true");
        });
        $(".btnUmbrandLOVID").each(function (index) {
            $(this).hide();
        });
        $(".btnDetailDelete").each(function (index) {
            $(this).hide();
        });

    } else {
        //$("#totalBudget").removeAttr("disabled");
        $("#fileUploadBudgetDetailV2").removeAttr("disabled");
        $(".Upload").removeAttr("disabled");
        $("#ddlPeriod").removeAttr("disabled");
        $("#ddlBudgetType").removeAttr("disabled");

        $("#btnLOVGroupAccount").removeAttr("disabled");
        //$("#btnLOVVendor").removeAttr("disabled");
        //$("#btnLOVVendorSite").removeAttr("disabled");
        $("#btnAddDetail").show();
        $("#btnSave").show();

        $(".decOpenBalance").each(function (index) {
            $(this).removeAttr("disabled");
        });
        $(".btnUmbrandLOVID").each(function (index) {
            $(this).show();
        });
        $(".btnDetailDelete").each(function (index) {
            $(this).show();
        });

    }
}

function p_initiateData() {
    clsGlobal.showLoading();
    $.ajax({
        type: "POST",
        url: "/Master/BudgetV2/InitiateData",
        data: { __RequestVerificationToken: $('#frmBudgetV2 input[name=__RequestVerificationToken]').val() },
        datatype: "json",
        success: function (retDat) {

            if (retDat.bitSuccess == true) {
                if (retDat.objData != undefined) {
                    p_SetHiddenObject(retDat.objData);
                    //$("#txtHiddenObject").val(JSON.stringify(retDat.objData));
                    adaID = false;
                    p_DataToUI(retDat.objData);
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

function p_PopulatePeriodAndSet(txtValue) {
    clsGlobal.showLoading();
    
    $.ajax({
        type: "POST",
        url: "/Master/BudgetV2/PopulatePeriod",
        data: { __RequestVerificationToken: $('#FormLogin input[name=__RequestVerificationToken]').val() },
        datatype: "json",
        success: function (retDat) {
            if (retDat.bitSuccess == true) {
                
                if (retDat.objData != undefined) {
                    $('#ddlPeriod').empty();
                    $('#ddlPeriod').append($('<option>').text("-").prop('value', ""));
                    for (var i = 0; i < retDat.objData.length; i++) {
                        $('#ddlPeriod').append($('<option>').text(retDat.objData[i].PERIOD_YEAR).prop('value', retDat.objData[i].PERIOD_YEAR));
                    }

                    if (txtValue != "") {
                        $("#ddlPeriod").val(txtValue);
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

function p_PopulateBudgetTypeAndSet(txtValue) {
    clsGlobal.showLoading();
    
    $.ajax({
        type: "POST",
        url: "/Master/BudgetV2/PopulateBudgetType",
        data: { __RequestVerificationToken: $('#FormLogin input[name=__RequestVerificationToken]').val() },
        datatype: "json",
        success: function (retDat) {
            if (retDat.bitSuccess == true) {
                
                if (retDat.objData != undefined) {
                    $('#ddlBudgetType').empty();
                    $('#ddlBudgetType').append($('<option>').text("-").prop('value', ""));
                    for (var i = 0; i < retDat.objData.length; i++) {
                        $('#ddlBudgetType').append($('<option>').text(retDat.objData[i].DESCRIPTION).prop('value', retDat.objData[i].FLEX_VALUE));
                    }

                    if (txtValue != "") {
                        $("#ddlBudgetType").val(txtValue);
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
        "aLengthMenu": [[5, 10, 25, 50, 75, 100], [5, 10, 25, 50, 75, 100]],
        "iDisplayLength": 5,
        "scrollX": true,
        aoColumnDefs: [
            //{
            //    aTargets: [0],
            //    mRender: function (data, type, full) {
            //        return '<div id="lblDetailNoValue"> ' + (full.intIndex + 1) + ' </div>';
            //    }
            //},
            {
                aTargets: [0],
                mRender: function (data, type, full) {
                    return '<div > ' + (full.intIndex + 1) + ' </div>';
                }
            },
            {
                aTargets: [1],

                mRender: function (data, type, full) {
                    return '<div > <div class="input-group"> <div class="input-group-btn"> <button type="button" class="btn btn-danger btnGroupAccountLOVID" id="btnGroupAccountLOVID" onclick="p_btnGroupAccountLOVID(' + full.intIndex + ')"> <i class="fa fa-search"></i></button> </div> <input type="text" class="form-control" id="txtGroupAccount' + full.intIndex + '" class="txtGroupAccount" style="width:100px;" onchange="p_txtGroupAccount_Changed(this,' + full.intIndex + ')"  value="' + full.TXT_GROUP_ACCOUNT + '" disabled> </div> </div>'
                        + '<div style="display:none">' + full.TXT_GROUP_ACCOUNT + '</div>';
                    //return '<div > <div class="input-group"> <div class="input-group-btn"> <button type="button" class="btn btn-danger btnUmbrandLOVID" id="btnUmbrandLOVID" onclick="p_btnUmbrandLOVID(' + full.intIndex + ')"> <i class="fa fa-search"></i></button> </div> <input type="text" class="form-control" id="txtBrand' + full.intIndex + '" class="txtBrand" onchange="p_txtBrand_Changed(this,' + full.intIndex + ')"  value="' + full.TXT_BRAND + '" disabled> </div> </div>';

                }
            },
            {
                aTargets: [2],

                mRender: function (data, type, full) {
                    return '<div > <div class="input-group"> <div class="input-group-btn"> <button type="button" class="btn btn-danger btnUmbrandLOVID" id="btnUmbrandLOVID" onclick="p_btnUmbrandLOVID(' + full.intIndex + ')"> <i class="fa fa-search"></i></button> </div> <input type="text" class="form-control" id="txtUmBrand' + full.intIndex + '" class="txtUmBrand" style="width:100px;" onchange="p_txtUmBrand_Changed(this,' + full.intIndex + ')"  value="' + full.TXT_UMBRAND + '" disabled> </div> </div>'
                        + '<div style="display:none">' + full.TXT_UMBRAND + '</div>';
                    //return '<div > <div class="input-group"> <div class="input-group-btn"> <button type="button" class="btn btn-danger btnUmbrandLOVID" id="btnUmbrandLOVID" onclick="p_btnUmbrandLOVID(' + full.intIndex + ')"> <i class="fa fa-search"></i></button> </div> <input type="text" class="form-control" id="txtBrand' + full.intIndex + '" class="txtBrand" onchange="p_txtBrand_Changed(this,' + full.intIndex + ')"  value="' + full.TXT_BRAND + '" disabled> </div> </div>';

                }
            },
            {
                aTargets: [3],

                mRender: function (data, type, full) {
                    return '<div > <input type="text" class="form-control"  id="txtSubUmBrand' + full.intIndex + '" class="txtSubUmBrand" onchange="p_txtSubUmBrand_Changed(this,' + full.intIndex + ')"  value="' + full.TXT_SUBUMBRAND
                        + '" disabled> </div> </div>'
                        + '<div style="display:none">' + full.TXT_SUBUMBRAND + '</div>';
                    //return '<div > <input type="text" class="form-control " id="txtUmbrand' + full.intIndex + '" class="txtUmbrand" onchange="p_txtUmbrand_Changed(this,' + full.intIndex + ')"  value="' + full.TXT_UMBRAND
                    //    + '" disabled> </div> </div>';

                }
            },
            {
                aTargets: [4],

                mRender: function (data, type, full) {
                    return '<div > <input type="text" class="form-control " id="txtBrand' + full.intIndex + '" class="txtBrand" onchange="p_txtBrand_Changed(this,' + full.intIndex + ')"  value="' + full.TXT_BRAND
                        + '" disabled> </div> </div>'
                        + '<div style="display:none">' + full.TXT_BRAND + '</div>';

                }
            },
            {
                aTargets: [5],

                mRender: function (data, type, full) {
                    return '<div > <input type="text" class="form-control " id="txtSubBrand' + full.intIndex + '" class="txtSubBrand"  onchange="p_txtSubBrand_Changed(this,' + full.intIndex + ')"  value="' + full.TXT_SUBBRAND
                        + '" disabled> </div> </div>'
                        + '<div style="display:none">' + full.TXT_SUBBRAND + '</div>';

                }
            },
            {
                aTargets: [6],

                mRender: function (data, type, full) {
                    return '<div >  <input type="text" class="form-control" id="txtLOB' + full.intIndex + '" class="txtLOB" style="width:70px;" onchange="p_txtLOB_Changed(this,' + full.intIndex + ')"  value="' + full.TXT_LOB + '" disabled>  </div>'
                        + '<div style="display:none">' + full.TXT_LOB + '</div>';

                }
            },
            {
                aTargets: [7],

                mRender: function (data, type, full) {
                    return '<div >  <input type="text" class="form-control text-right decOpenBalance autonumeric"  style="width:150px;" id="decOpenBalance' + full.intIndex + '"  onchange="p_decOpenBalance_Changed(this,' + full.intIndex + ')"  value="' + full.DEC_OPENBALANCE + '" >  </div>';

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
            },
            {
                aTargets: [10],
                mRender: function (data, type, full) {
                    return '<div > <input type="button" class="btn btn-warning btnDetailDelete" id="btnDetailDelete" onclick="p_btnDetailDelete_Click(this,' + full.intIndex + ')"  value="Delete" >  </div>';

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
    //$('#dtDetail tbody').on('click', 'tr', function () {
    //    if (!$(this).hasClass('selected')) {
    //        oTableDetail.$('tr.selected').removeClass('selected');
    //        $(this).addClass('selected');
    //    }
    //});
}


//function p_txtUmbrand_Changed(objCaller, intIndex) {
//    
//    // Parse dari HiddenObject->JSON
//    var objData = JSON.parse(p_UIToData());
//    for (i = 0; i < objData.XXSHP_KDS_M_BGT_DTL.length; i++) {
//        // Cari Index-nya.
//        if (objData.XXSHP_KDS_M_BGT_DTL[i].intIndex == intIndex) {
//            // Ketemu, mulai dari sini:
//            objData.XXSHP_KDS_M_BGT_DTL[i].TXT_UMBRAND = objCaller.value;
//            break;
//        }
//    }
//    p_SetHiddenObject(objData);
//}

function p_txtUmBrand_Changed(objCaller, intIndex) {
    
    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());
    for (i = 0; i < objData.XXSHP_KDS_M_BGT_DTL.length; i++) {
        // Cari Index-nya.
        if (objData.XXSHP_KDS_M_BGT_DTL[i].intIndex == intIndex) {
            // Ketemu, mulai dari sini:
            objData.XXSHP_KDS_M_BGT_DTL[i].TXT_UMBRAND = objCaller.value;
            break;
        }
    }
    p_SetHiddenObject(objData);
}

function p_txtLOB_Changed(objCaller, intIndex) {
    
    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());
    for (i = 0; i < objData.XXSHP_KDS_M_BGT_DTL.length; i++) {
        // Cari Index-nya.
        if (objData.XXSHP_KDS_M_BGT_DTL[i].intIndex == intIndex) {
            // Ketemu, mulai dari sini:
            objData.XXSHP_KDS_M_BGT_DTL[i].TXT_LOB = objCaller.value;
            break;
        }
    }
    p_SetHiddenObject(objData);
}



function converter(id, intIndex) {
    var objDat = p_GetHiddenObject();
    var index = objDat.XXSHP_KDS_M_BGT_DTL.length;
    var Total = 0;

    for (var i = 0; i <= index - 1; i++) {
        //var modulo = i % 5;
        Total = Total + clsGlobal.parseToAngka($('#dtDetail').DataTable().cell(i, 6).nodes().to$().find('input').val())
    }

    $("#totalBudget").val(clsGlobal.parseToRupiah(Total));

    $("#" + id).val(clsGlobal.parseToRupiah(clsGlobal.parseToAngka($('#' + id).val())));

    //p_SetHiddenObject();
}

function p_decOpenBalance_Changed(objCaller, intIndex) {
    
    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());
    for (i = 0; i < objData.XXSHP_KDS_M_BGT_DTL.length; i++) {
        // Cari Index-nya.
        if (objData.XXSHP_KDS_M_BGT_DTL[i].intIndex == intIndex) {
            // Ketemu, mulai dari sini:
            objData.XXSHP_KDS_M_BGT_DTL[i].DEC_OPENBALANCE = clsGlobal.parseToDecimal(objCaller.value);

            // Hitung Cost Ratio.
            var decRatio = 0;
            if (objData.XXSHP_KDS_M_BGT_DTL[i].DEC_TARGETSALES != 0) {
                decRatio = (clsGlobal.parseToDecimal(objData.XXSHP_KDS_M_BGT_DTL[i].DEC_OPENBALANCE / objData.XXSHP_KDS_M_BGT_DTL[i].DEC_TARGETSALES)) * 100;
            }
            objData.XXSHP_KDS_M_BGT_DTL[i].DEC_RATIO = decRatio;
            break;
        }
    }
    //
    //var total = 0;
    //for (var i = 0; i < objData.XXSHP_KDS_M_BGT_DTL.length; i++) {
    //    //var tes = objData.XXSHP_KDS_M_BGT_DTL[i].DEC_OPENBALANCE;
    //    total = total + clsGlobal.parseToInteger(clsGlobal.parseToAngka(objData.XXSHP_KDS_M_BGT_DTL[i].DEC_OPENBALANCE));

    //}
    //$("#totalBudget").val(clsGlobal.parseToRupiah(total)); 
    p_SetHiddenObject(objData);
    p_RefreshNumberDetail();
}

function p_txtTargetSales_Changed(objCaller, intIndex) {
    
    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());
    for (i = 0; i < objData.XXSHP_KDS_M_BGT_DTL.length; i++) {
        // Cari Index-nya.
        if (objData.XXSHP_KDS_M_BGT_DTL[i].intIndex == intIndex) {
            // Ketemu, mulai dari sini:
            objData.XXSHP_KDS_M_BGT_DTL[i].DEC_TARGETSALES = clsGlobal.parseToDecimal(objCaller.value);

            // Hitung Cost Ratio.
            var decRatio = 0;
            if (objData.XXSHP_KDS_M_BGT_DTL[i].DEC_TARGETSALES != 0) {
                decRatio = (clsGlobal.parseToDecimal(objData.XXSHP_KDS_M_BGT_DTL[i].DEC_OPENBALANCE / objData.XXSHP_KDS_M_BGT_DTL[i].DEC_TARGETSALES)) * 100;
            }
            objData.XXSHP_KDS_M_BGT_DTL[i].DEC_RATIO = decRatio;
            break;
        }
    }
    p_SetHiddenObject(objData);
    p_RefreshNumberDetail();
}

function p_settxtUmbrand(intBrandID) {
    //var intSelectedIndex = p_GetSelectedDetailRow();
    
    clsGlobal.showLoading();
    $.ajax({
        type: "POST",
        url: "/Master/BudgetV2/GetDataBrand",
        data: {
            intBrandID: intBrandID,
            __RequestVerificationToken: $('#frmBudgetV2 input[name=__RequestVerificationToken]').val()
        },
        datatype: "json",
        success: function (retDat) {
            
            if (retDat.bitSuccess == true) {
                if (retDat.objData != undefined) {
                    p_txtUmbrand_Changed_LOV(retDat.objData);
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

function p_txtUmbrand_Changed_LOV(objDat) {
    
    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());
    var IndexUmbrand = p_GetCurrentRowUmbrand();

    objData.XXSHP_KDS_M_BGT_DTL[IndexUmbrand].TXT_UMBRAND = objDat.txtumBrandName.toString();
    $("#txtUmBrand" + IndexUmbrand).val(objDat.txtumBrandName.toString());

    objData.XXSHP_KDS_M_BGT_DTL[IndexUmbrand].TXT_SUBUMBRAND = objDat.txtSubUmbrand.toString();
    $("#txtSubUmBrand" + IndexUmbrand).val(objDat.txtSubUmbrand.toString());

    objData.XXSHP_KDS_M_BGT_DTL[IndexUmbrand].TXT_BRAND = objDat.txtBrandName.toString();
    $("#txtBrand" + IndexUmbrand).val(objDat.txtBrandName.toString());

    objData.XXSHP_KDS_M_BGT_DTL[IndexUmbrand].TXT_SUBBRAND = objDat.DescSubBrand.toString();
    $("#txtSubBrand" + IndexUmbrand).val(objDat.DescSubBrand.toString());

    objData.XXSHP_KDS_M_BGT_DTL[IndexUmbrand].TXT_LOB = objDat.KN.toString();
    $("#txtLOB" + IndexUmbrand).val(objDat.KN.toString());

    //var index = objData.XXSHP_KDS_M_BGT_DTL.length;
    //for (i = 0; i < index; i++) {
    //    for (j = 0; j < index; j++) {
    //        if (objData.XXSHP_KDS_M_BGT_DTL[i].TXT_SUBUMBRAND == objData.XXSHP_KDS_M_BGT_DTL[j].TXT_SUBUMBRAND) {
    //            clsGlobal.showAlert("Tidak boleh menambahkan detail yang sama!");
    //        } else {

    //        }
    //    }
    //}

    p_SetHiddenObject(objData);

}

function p_SetCurrentRowUmbrand(intIndex) {
    
    $("#txtCurrentUmbrandRow").val(intIndex);
}

function p_GetCurrentRowUmbrand() {
    
    var index = $("#txtCurrentUmbrandRow").val();
    return index;
}


function p_settxtGroupAccount(txtGroupAccount) {
    //var intSelectedIndex = p_GetSelectedDetailRow();
    
    clsGlobal.showLoading();
    $.ajax({
        type: "POST",
        url: "/Master/SupplierGroup/GetData",
        data: { txtID: txtGroupAccount, __RequestVerificationToken: $('#frmBudgetV2 input[name=__RequestVerificationToken]').val() },
        datatype: "json",
        success: function (retDat) {
            
            if (retDat.bitSuccess == true) {
                if (retDat.objData != undefined) {
                    p_txtGroupAccount_Changed_LOV(retDat.objData);
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

function p_txtGroupAccount_Changed_LOV(objDat) {
    
    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());
    var IndexGroupAccount = p_GetCurrentRowGroupAccount();

    objData.XXSHP_KDS_M_BGT_DTL[IndexGroupAccount].TXT_GROUP_ACCOUNT = objDat.VENDOR_GRP.toString();
    $("#txtGroupAccount" + IndexGroupAccount).val(objDat.VENDOR_GRP.toString());

    p_SetHiddenObject(objData);

}

function p_SetCurrentRowGroupAccount(intIndex) {
    
    $("#txtCurrentGroupAccountRow").val(intIndex);
}

function p_GetCurrentRowGroupAccount() {
    
    var index = $("#txtCurrentGroupAccountRow").val();
    return index;
}


function p_txtID_TextChanged() {
    clsGlobal.showLoading();
    $.ajax({
        type: "POST",
        url: "/Master/BudgetV2/GetData",
        data: {
            txtID: $("#txtID").val(),
            txtID: $("#txtID").val(),
            pTXT_PERIOD: $("#ddlPeriod").val(),
            pTXT_GROUP_ACCOUNT: $("#txtGroupAccount").val(),
            pTXT_BUDGET_TYPE: $("#ddlBudgetType").val(),
            __RequestVerificationToken: $('#frmBudgetV2 input[name=__RequestVerificationToken]').val()
        },
        datatype: "json",
        success: function (retDat) {
            
            if (retDat.bitSuccess == true) {
                if (retDat.objData != undefined) {
                    //p_InitiateDetailChange();
                    //p_disabled();
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

function p_txtSupplierID_TextChanged() {
    clsGlobal.showLoading();

    //berdasarkan routeconfig

    $.ajax({
        type: "POST",
        url: "/Master/Supplier/GetData",
        data: { txtID: $("#txtGroupAccount").val(), __RequestVerificationToken: $('#frmBudgetV2 input[name=__RequestVerificationToken]').val() },
        datatype: "json",
        success: function (retDat) {
            
            if (retDat.bitSuccess == true) {
                if (retDat.objData != undefined) {
                    $("#txtGroupAccount").val(clsGlobal.parseToString(retDat.objData.VENDOR_NAME));
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

function p_txtSupplierName_TextChanged() {
    clsGlobal.showLoading();
    
    $.ajax({
        type: "POST",
        url: "/Master/BudgetV2/GetDataVendor",
        data: { VENDOR_ID: $("#txtSupplierName").val(), __RequestVerificationToken: $('#frmBudgetV2 input[name=__RequestVerificationToken]').val() },
        datatype: "json",
        success: function (retDat) {
            
            if (retDat.bitSuccess == true) {
                if (retDat.objData != undefined) {
                    $("#intSupplierCode").val(retDat.objData.VENDOR_ID);
                    $("#txtSupplierName").val(retDat.objData.VENDOR_NAME);
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

function p_txtSupplierSiteCode_TextChanged() {
    clsGlobal.showLoading();
    $.ajax({
        type: "POST",
        url: "/Master/BudgetV2/GetDataVendorSite",
        data: { VENDOR_SITE_ID: $("#intSupplierSiteCode").val(), __RequestVerificationToken: $('#frmBudgetV2 input[name=__RequestVerificationToken]').val() },
        datatype: "json",
        success: function (retDat) {

            if (retDat.bitSuccess == true) {
                if (retDat.objData != undefined) {
                    $("#intSupplierSiteCode").val(retDat.objData.VENDOR_SITE_ID);
                    $("#txtSupplierSiteName").val(retDat.objData.VENDOR_SITE_CODE);
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
    
    p_UIToData();
    var objData = p_GetHiddenObject();
    if (objData.TXT_PERIOD == 0) {
        throw "Kolom Period Budget harus di isi!";
    }
    //if (objData.TXT_SUPPLIER_NAME == 0) {
    //    throw "Kolom Suplier Name harus di isi!";
    //}
    //if (objData.TXT_SUPPLIER_SITE_CODE == 0) {
    //    throw "Kolom Suplier Site harus di isi!";
    //}
    //if (objData.TXT_GROUP_ACCOUNT == 0) {
    //    throw "Kolom Group Account harus di isi!";
    //}
    if (objData.TXT_BUDGET_TYPE == 0) {
        throw "Kolom MT Budget Type harus di isi!";
    }

    clsGlobal.showLoading();
    $.ajax({
        type: "POST",
        url: "/Master/BudgetV2/AddRow",
        data: { data: $("#txtHiddenObject").val(), __RequestVerificationToken: $('#frmBudgetV2 input[name=__RequestVerificationToken]').val() },
        datatype: "json",
        success: function (retDat) {
            
            if (retDat.bitSuccess == true) {
                if (retDat.objData != undefined) {
                    p_SetHiddenObject(retDat.objData);
                    p_DataToUIDetail(retDat.objData.XXSHP_KDS_M_BGT_DTL);
                    oTableDetail.page('last').draw(false);
                    p_EnableControl(false);

                    var objDat = p_GetHiddenObject();
                    var index = objDat.XXSHP_KDS_M_BGT_DTL.length;
                    var Total = 0;

                    for (var i = 0; i <= index - 1; i++) {
                        //var modulo = i % 5;
                        Total = Total + clsGlobal.parseToAngka($('#dtDetail').DataTable().cell(i, 6).nodes().to$().find('input').val())
                    }
                    $("#totalBudget").val(clsGlobal.parseToRupiah(Total));
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
    for (i = 0; i < objData.XXSHP_KDS_M_BGT_DTL.length; i++) {
        // Cari Index-nya.
        if (objData.XXSHP_KDS_M_BGT_DTL[i].intIndex == intIndex) {
            // Ketemu, mulai dari sini:
            // Remove from list.
            objData.XXSHP_KDS_M_BGT_DTL.splice(i, 1);

            oTableDetail.row(i).remove().draw(false);

            var objDat = p_GetHiddenObject();
            var index = objDat.XXSHP_KDS_M_BGT_DTL.length;
            var Total = 0;

            for (var i = 0; i <= index - 1; i++) {
                //var modulo = i % 5;
                Total = Total + clsGlobal.parseToAngka($('#dtDetail').DataTable().cell(i, 6).nodes().to$().find('input').val())
            }

            $("#totalBudget").val(clsGlobal.parseToRupiah(Total));
            break;
        }
    }
    p_SetHiddenObject(objData);
    p_RefreshNumberDetail();
    p_EnableControl(false);
}
function p_RefreshNumberDetail() {
    
    var intRowIndex = 0;
    var objDat = p_GetHiddenObject();
    oTableDetail.rows().every(function (rowIdx, tableLoop, rowLoop) {
        
        var d = this.data();
        d.intIndex = intRowIndex; // update data source for the row
        objDat.XXSHP_KDS_M_BGT_DTL[intRowIndex].intIndex = d.intIndex;
        //objDat.XXSHP_KDS_M_BGT_HDR[intRowIndex].intIndex = d.intIndex;

        d.TXT_LOB = objDat.XXSHP_KDS_M_BGT_DTL[intRowIndex].TXT_LOB;
        d.TXT_UMBRAND = objDat.XXSHP_KDS_M_BGT_DTL[intRowIndex].TXT_UMBRAND;
        d.TXT_SUBUMBRAND = objDat.XXSHP_KDS_M_BGT_DTL[intRowIndex].TXT_SUBUMBRAND;
        d.TXT_BRAND = objDat.XXSHP_KDS_M_BGT_DTL[intRowIndex].TXT_BRAND;
        d.TXT_SUBBRAND = objDat.XXSHP_KDS_M_BGT_DTL[intRowIndex].TXT_SUBBRAND;
        d.DEC_OPENBALANCE = objDat.XXSHP_KDS_M_BGT_DTL[intRowIndex].DEC_OPENBALANCE;
        d.DEC_TARGETSALES = objDat.XXSHP_KDS_M_BGT_DTL[intRowIndex].DEC_TARGETSALES;
        d.DEC_RATIO = objDat.XXSHP_KDS_M_BGT_DTL[intRowIndex].DEC_RATIO;
        d.TXT_GROUP_ACCOUNT = objDat.XXSHP_KDS_M_BGT_DTL[intRowIndex].TXT_GROUP_ACCOUNT;

        intRowIndex++;
        this.invalidate(); // invalidate the data DataTables has cached for this row         
    });

    // Draw once all updates are done
    oTableDetail.draw(false);
    p_SetHiddenObject(objDat);
}

function p_saveData() {
    
    clsGlobal.showLoading();
    p_UIToData();
    $.ajax({
        type: "POST",
        url: "/Master/BudgetV2/SaveData",
        data: { data: $("#txtHiddenObject").val(), txtGUID: $("#txtGUID").val(), __RequestVerificationToken: $('#frmBudgetV2 input[name=__RequestVerificationToken]').val() },
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
        url: "/Master/BudgetV2/DeleteData",
        data: { data: $("#txtHiddenObject").val(), txtGUID: $("#txtGUID").val(), __RequestVerificationToken: $('#frmBudgetV2 input[name=__RequestVerificationToken]').val() },
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

$('#btnLOVID').bind('click', function () {
    try {
        
        clsGlobal.generateLOV(MODULE_BUDGET, "txtID");
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
});

$('#btnFind').bind('click', function () {
    try {
        LOV = clsGlobal.generateLOV(MODULE_BUDGET, "txtID");
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
});

$('#btnLOVPeriod').bind('click', function () {
    try {
        LOV = clsGlobal.generateLOV(LOV_ORG_ACCT_PERIODS_V, "txtPeriod");
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
});

//$('#btnLOVGroupAccount').bind('click', function () {
//    try {
//        LOV = clsGlobal.generateLOV(LOV_XXSHP_VENDOR_SITE_ALL_V, "txtGroupAccount");
//    } catch (ex) {
//        clsGlobal.showAlert(ex);
//    }
//});

$('#btnLOVGroupAccount').bind('click', function () {
    try {
        LOV = clsGlobal.generateLOV(LOV_GROUP_ACCOUNT_ALL, "txtGroupAccount");
        //LOV = clsGlobal.generateLOV(LOV_XXSHP_KPP_VENDOR_SITE_ALL_V, "txtGroupAccount");
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
});

$('#btnLOVVendorSite').bind('click', function () {
    var vendorid = $("#intSupplierCode").val();
    try {
        LOV = clsGlobal.generateLOV(LOV_XXSHP_VENDOR_SITE_ALL_V_VENDOR_SITE_ID, "intSupplierSiteCode", vendorid);
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
});

$('#btnLOVType').bind('click', function () {
    try {
        LOV = clsGlobal.generateLOV(LOV_FND_FLEX_VALUES_TL, "txtBudgetType");
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

//function p_btnUmbrandLOVID(objCaller, intIndex) {
//    
//    p_SetCurrentRowUmbrand(objCaller);
//    try {
//        LOV = clsGlobal.generateLOV(MODULE_BRAND, "txtUmBrand");
//    } catch (ex) {
//        clsGlobal.showAlert(ex);
//    }   
//}

function p_btnUmbrandLOVID(objCaller, intIndex) {
    
    p_SetCurrentRowUmbrand(objCaller);
    try {
        LOV = clsGlobal.generateLOV(MODULE_BRAND_BRANDBUDGET, "txtUmBrand");
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
}

function p_btnGroupAccountLOVID(objCaller, intIndex) {
    
    p_SetCurrentRowGroupAccount(objCaller);
    try {
        LOV = clsGlobal.generateLOV(MODULE_GROUP_GROUPBUDGET, "txtGroupAccount");
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
}

$('#btnNew').bind('click', function () {
    try {
        //$('#ddlPeriod').prop("disabled", false);
        //$('#ddlBudgetType').prop("disabled", false);
        //$('#totalBudget').prop("disabled", false);
        //$('#decOpenBalance').prop("disabled", false);
        //$('#btnLOVVendor').prop("disabled", false);
        //$('#btnLOVVendorSite').prop("disabled", false);
        //$('#btnUmbrandLOVID').prop("disabled", false);

        //$('.btnAddDetail').prop("disabled", false);
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

