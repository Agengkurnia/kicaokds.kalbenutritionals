//=======================
// VARIABLE GLOBAL

//=======================
var clsGlobal = new clsGlobalClass();
var LOV;
var bitLoading = false;
var oTable;

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
    p_initiateData();
    p_InitiateDetail();
    //p_showPrevData(); 
    //p_InitiateActivity();
    //p_InitiateBranch();
}

function p_validatePage() {

}

function p_showPrevData() {

}

function p_showBlank() {
    p_initiateData();
}

function p_DataToUI(objData) {
    $("fileUploadBudgetTargetSalesDetail").val(objData.empty);

    p_PopulatePeriode(clsGlobal.parseToString(objData.TXT_PERIODE))

    $("#txtGroupAccount").val(clsGlobal.parseToString(objData.TXT_GROUP_ACCOUNT));
    $("#txtSubUmBrand").val(clsGlobal.parseToString(objData.TXT_SUB_UMBRAND));
}

function p_PopulatePeriode(txtPeriode) {
    clsGlobal.showLoading();
    $.ajax({
        type: "POST",
        url: "/Master/BudgetAndTargetSales/PopulatePeriod",
        data: { __RequestVerificationToken: $('#frmBudgetAndTargetSales input[name=__RequestVerificationToken]').val() },
        dataType: "json",
        success: function (retData) {
            if (retData.bitSuccess) {
                if (retData.objData != undefined) {
                    $('#ddlPeriod').empty();
                    $('#ddlPeriod').append($('<option>').text("-").prop("value", ""));
                    for (var i = 0; i < retData.objData.length; i++) {
                        $('#ddlPeriod').append($('<option>').text(retData.objData[i].PERIOD_YEAR).prop('value', retData.objData[i].PERIOD_YEAR));
                    }

                    if (txtPeriode != "") {
                        $('#ddlPeriod').val(txtPeriode)
                    }
                }
            } else {
                clsGlobal.getAlert(retData.txtMessage);
            }
            clsGlobal.hideLoading();
        },
        error: function (retData) {
            clsGlobal.hideLoading();
        }
    });
}

function p_GetHiddenObject() {
    return JSON.parse($("#txtHiddenObject").val());
}

function p_SetHiddenObject(objDat) {
    $("#txtHiddenObject").val(JSON.stringify(objDat));

    clsGlobal.GenerateAutoNumeric();
    clsGlobal.GenerateDateTimePicker();
}

function p_UIToData() {
    var jsonObj = [];
    jsonData = p_GetHiddenObject();

    p_SetHiddenObject(jsonData);
    return $("#txtHiddenObject").val();
}

function p_initiateData() {
    clsGlobal.showLoading();
    $.ajax({
        type: "POST",
        url: "/Master/BudgetAndTargetSales/InitiateData",
        data: { __RequestVerificationToken: $('#frmBudgetAndTargetSales input[name=__RequestVerificationToken]').val() },
        datatype: "json",
        success: function (retDat) {

            if (retDat.bitSuccess == true) {
                if (retDat.objData != undefined) {
                    adaID = false;
                    $("#txtHiddenObject").val(JSON.stringify(retDat.objData));
                    p_DataToUI(retDat.objData);
                    $("#txtGUID").val(retDat.txtGUID);
                    $("#txtBlankObject").val(JSON.stringify(retDat.objData));


                    //p_getParameterID();
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

function p_UploadBudgetAndTargetSalesDetail() {
    clsGlobal.getConfirmation("Upload Budget Detail?", function (result) {
        if (result) {
            var data = new FormData();
            var files = $("#fileUploadBudgetTargetSalesDetail").get(0).files;
            if (files.length > 0) {
                data.append("fileUploadBudgetTargetSalesDetail", files[0]);
                data.append("txtHiddenObject", $("#txtHiddenObject").val());
            }
            clsGlobal.showLoading();
            $.ajax({
                type: "POST",
                url: "/Master/BudgetAndTargetSales/UploadBudgetTargetSalesDetail",
                processData: false,
                contentType: false,
                data: data,
                success: function (retDat) {
                    if (retDat.bitSuccess) {
                        if (retDat.objData != undefined) {
                            p_SetHiddenObject(retDat.objData);
                            $('#fileUploadBudgetTargetSalesDetail').val('');
                            clsGlobal.setMessageInformation("Upload success!")
                            //p_DataToUI(retDat.objData);
                        }
                    } else {
                        clsGlobal.getAlert(retDat.txtMessage);
                    }
                    clsGlobal.hideLoading();
                },
                error: function (retDat) {
                    console.log(retDat);
                    clsGlobal.hideLoading();
                }
            });
        } else {
            return false;
        }
    });
}

function p_DownloadTemplate() {
    clsGlobal.getConfirmation("Download Template Budget & Target Sales?", function (result) {
        if (result == true) {
            clsGlobal.showLoading();
            $.ajax({
                type: "POST",
                url: "/Master/BudgetAndTargetSales/DownloadTemplate",
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

function p_InitiateDetail() {

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
                    return '<div id="lblNumber"> ' + (full.intIndex + 1) + ' </div>';
                }
            },
            {
                aTargets: [1],
                mRender: function (data, type, full) {
                    return '<div id="TXT_PERIODE"> ' + (full.TXT_PERIOD) + ' </div>';
                }
            },
            {
                aTargets: [2],
                mRender: function (data, type, full) {
                    return '<div id="TXT_GROUP_ACCOUNT"> ' + (full.TXT_GROUP_ACCOUNT) + ' </div>';
                }
            },
            {
                aTargets: [3],
                mRender: function (data, type, full) {
                    return '<div id="TXT_SUB_UMBRAND"> ' + (full.TXT_SUBUMBRAND) + ' </div>';
                }
            },
            {
                aTargets: [4],
                mRender: function (data, type, full) {
                    return '<div >  <input type="text" class="autonumeric" id="txtJanBudget" style="width:100px;" value="' + full.JAN_BUDGET + '" disabled >  </div>';
                }
            },
            {
                aTargets: [5],
                mRender: function (data, type, full) {
                    return '<div >  <input type="text" class="autonumeric" id="txtJanTarget" style="width:100px;" value="' + full.JAN_TARGET + '" disabled >  </div>';
                }
            },
            {
                aTargets: [6],
                mRender: function (data, type, full) {
                    return '<div >  <input type="text" class="autonumeric" id="txtFebBudget" style="width:100px;" value="' + full.FEB_BUDGET + '" disabled >  </div>';
                }
            },
            {
                aTargets: [7],
                mRender: function (data, type, full) {
                    return '<div >  <input type="text" class="autonumeric" id="txtFebTarget" style="width:100px;" value="' + full.FEB_TARGET + '" disabled >  </div>';
                }
            },
            {
                aTargets: [8],
                mRender: function (data, type, full) {
                    return '<div >  <input type="text" class="autonumeric" id="txtMarBudget" style="width:100px;" value="' + full.MAR_BUDGET + '" disabled >  </div>';
                }
            },
            {
                aTargets: [9],
                mRender: function (data, type, full) {
                    return '<div >  <input type="text" class="autonumeric" id="txtMarTarget" style="width:100px;" value="' + full.MAR_TARGET + '" disabled >  </div>';
                }
            },
            {
                aTargets: [10],
                mRender: function (data, type, full) {
                    return '<div >  <input type="text" class="autonumeric" id="txtAprBudget" style="width:100px;" value="' + full.APR_BUDGET + '" disabled >  </div>';
                }
            },
            {
                aTargets: [11],
                mRender: function (data, type, full) {
                    return '<div >  <input type="text" class="autonumeric" id="txtAprTarget" style="width:100px;" value="' + full.APR_TARGET + '" disabled >  </div>';
                }
            },
            {
                aTargets: [12],
                mRender: function (data, type, full) {
                    return '<div >  <input type="text" class="autonumeric" id="txtMayBudget" style="width:100px;" value="' + full.MAY_BUDGET + '" disabled >  </div>';
                }
            },
            {
                aTargets: [13],
                mRender: function (data, type, full) {
                    return '<div >  <input type="text" class="autonumeric" id="txtMayTarget" style="width:100px;" value="' + full.MAY_TARGET + '" disabled >  </div>';
                }
            },
            {
                aTargets: [14],
                mRender: function (data, type, full) {
                    return '<div >  <input type="text" class="autonumeric" id="txtJunBudget" style="width:100px;" value="' + full.JUN_BUDGET + '" disabled >  </div>';
                }
            },
            {
                aTargets: [15],
                mRender: function (data, type, full) {
                    return '<div >  <input type="text" class="autonumeric" id="txtJunTarget" style="width:100px;" value="' + full.JUN_TARGET + '" disabled >  </div>';
                }
            },
            {
                aTargets: [16],
                mRender: function (data, type, full) {
                    return '<div >  <input type="text" class="autonumeric" id="txtJulBudget" style="width:100px;" value="' + full.JUL_BUDGET + '" disabled >  </div>';
                }
            },
            {
                aTargets: [17],
                mRender: function (data, type, full) {
                    return '<div >  <input type="text" class="autonumeric" id="txtJulTarget" style="width:100px;" value="' + full.JUL_TARGET + '" disabled >  </div>';
                }
            },
            {
                aTargets: [18],
                mRender: function (data, type, full) {
                    return '<div >  <input type="text" class="autonumeric" id="txtAugBudget" style="width:100px;" value="' + full.AUG_BUDGET + '" disabled >  </div>';
                }
            },
            {
                aTargets: [19],
                mRender: function (data, type, full) {
                    return '<div >  <input type="text" class="autonumeric" id="txtAugTarget" style="width:100px;" value="' + full.AUG_TARGET + '" disabled >  </div>';
                }
            },
            {
                aTargets: [20],
                mRender: function (data, type, full) {
                    return '<div >  <input type="text" class="autonumeric" id="txtSepBudget" style="width:100px;" value="' + full.SEP_BUDGET + '" disabled >  </div>';
                }
            },
            {
                aTargets: [21],
                mRender: function (data, type, full) {
                    return '<div >  <input type="text" class="autonumeric" id="txtSepTarget" style="width:100px;" value="' + full.SEP_TARGET + '" disabled >  </div>';
                }
            },
            {
                aTargets: [22],
                mRender: function (data, type, full) {
                    return '<div >  <input type="text" class="autonumeric" id="txtOctBudget" style="width:100px;" value="' + full.OCT_BUDGET + '" disabled >  </div>';
                }
            },
            {
                aTargets: [23],
                mRender: function (data, type, full) {
                    return '<div >  <input type="text" class="autonumeric" id="txtOctTarget" style="width:100px;" value="' + full.OCT_TARGET + '" disabled >  </div>';
                }
            },
            {
                aTargets: [24],
                mRender: function (data, type, full) {
                    return '<div >  <input type="text" class="autonumeric" id="txtNovBudget" style="width:100px;" value="' + full.NOV_BUDGET + '" disabled >  </div>';
                }
            },
            {
                aTargets: [25],
                mRender: function (data, type, full) {
                    return '<div >  <input type="text" class="autonumeric" id="txtNovTarget" style="width:100px;" value="' + full.NOV_TARGET + '" disabled >  </div>';
                }
            },
            {
                aTargets: [26],
                mRender: function (data, type, full) {
                    return '<div >  <input type="text" class="autonumeric" id="txtDecBudget" style="width:100px;" value="' + full.DEC_BUDGET + '" disabled >  </div>';
                }
            },
            {
                aTargets: [27],
                mRender: function (data, type, full) {
                    return '<div >  <input type="text" class="autonumeric" id="txtDecTarget" style="width:100px;" value="' + full.DEC_TARGET + '" disabled >  </div>';
                }
            },
        ]
    });

    $("#dtDetail").css("width", "100%");
    //$('#dtDetail tbody').on('click', 'tr', function () {
    //    if (!$(this).hasClass('selected')) {
    //        oTable.$('tr.selected').removeClass('selected');
    //        $(this).addClass('selected');
    //    }
    //});
}

$('#btnLOVGroupAccount').bind('click', function () {
    try {
        LOV = clsGlobal.generateLOV(LOV_GROUP_ACCOUNT, "txtGroupAccount");
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
});

$('#btnLOVSubUmBrand').bind('click', function () {
    try {
        var txtGroup = $("#txtGroupAccount").val();
        LOV = clsGlobal.generateLOV(LOV_SUBUMBRAND_BY_TXT_GROUP_ACCOUNT, "txtSubUmBrand");
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
});

function setChooseLOV(txtValue) {
    var arr = txtValue.split('|');
    switch (arr[0]) {
        case "txtGroupAccount":
            var txtGroupAccount = $("#txtGroupAccount").val();
            if (txtGroupAccount != arr[1]) {
                $("#txtSubUmBrand").val("");
            }
            $("#txtGroupAccount").val(arr[1]);
            break;
        case "txtSubUmBrand":
            $("#txtSubUmBrand").val(arr[1]);
            break;
    }
    clsGlobal.closeLOV();
}

$('#btnFind').bind('click', function () {
    try {
        var period = $("#ddlPeriod").val().toString()
        if (period == "") {
            clsGlobal.showAlert("Silahkan pilih Period!")
        } else {
            clsGlobal.showLoading();
            var token = $('#frmBudgetAndTargetSales input[name=__RequestVerificationToken]').val();
            var txtGroupAccount = $('#txtGroupAccount').val();
            var txtSubUmbrand = $('#txtSubUmBrand').val();
            console.log(txtGroupAccount + " " + txtSubUmbrand);
            $.ajax({
                type: "POST",
                url: "/Master/BudgetAndTargetSales/GetAllData",
                data: { txtPeriode: period, txtGroupAccount: txtGroupAccount, txtSubUmbrand: txtSubUmbrand, __RequestVerificationToken: token /*$('#txtSubUmbrand').val()*/ },
                dataType: "json",
                success: function (retDat) {
                    if (retDat.bitSuccess) {
                        if (retDat.objData != undefined) {
                            p_fillDataTable(retDat.objData);
                            //p_SetHiddenObject(retDat.objData);
                            //p_DataToUI(retDat.objData);
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
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
});

function p_fillDataTable(data) {
    oTable.clear();

    for (var i = 0; i < data.length; i++) {
        data[i].intIndex = i;
        oTable.row.add(data[i]);
    }
    oTable.draw(false);

    var objDat = p_GetHiddenObject();
    p_SetHiddenObject(objDat);
}
