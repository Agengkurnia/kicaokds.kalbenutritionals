//=======================
// VARIABLE GLOBAL
//=======================
var clsGlobal = new clsGlobalClass();
var LOV;
var bitLoading = false; 
var oTableActivity;
var oTableBranch;


//=======================
// Confirmation
//======================= 

//=======================
// ON PAGE LOAD
//=======================
$(document).ready(function () {
    clsGlobal.showLoading();
    p_InitForm();
    p_validatePage();
    //p_showPrevData(); 
});

//=======================
// FUNCTION
//=======================
function p_InitForm() {
    p_initiateData();
    //p_showPrevData(); 
    p_InitiateActivity();
    p_InitiateBranch();
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
        case "txtSupplierID":
            $("#txtSupplierID").val(arr[1]);
            $("#txtSupplierName").val(arr[2]);
            $("#txtSupplierSiteID").val(arr[3]);
            $("#txtSupplierSiteName").val(arr[4]);
            //p_txtSupplierID_TextChanged();
            break;
        case "txtSupplierSiteID":
            $("#txtSupplierSiteID").val(arr[1]);
            p_txtSupplierSiteID_TextChanged();
            break;
        case "txtBudgetType":
            $("#txtBudgetType").val(arr[1]); 
            break;
        case "txtPaymentType":
            $("#txtPaymentType").val(arr[1]); 
            break; 
        case "txtActivityCode":
            p_settxtActivityCode(arr[1]);
            break;   
        case "txtBranchCode":
            p_settxtBranchCode(arr[1],arr[2]);
            break; 
    }
    clsGlobal.closeLOV();
}

function p_DataToUI(objData) {
    $("#txtDocNo").val(clsGlobal.parseToString(objData.TXT_DOCNO));
    $("#dtmDate").val(clsGlobal.parseToDateTimeFromJSON(objData.CREATION_DATE, clsDateFormat));
    
    $("#txtRefDocNo").val(clsGlobal.parseToString(objData.TXT_REFDOCNO));
    $("#txtSupplierID").val(clsGlobal.parseToString(objData.TXT_SUPPLIER_ID));
    //$("#txtSupplierCode").val(clsGlobal.parseToString(objData.TXT_SUPPLIER_CODE));
    $("#txtSupplierName").val(clsGlobal.parseToString(objData.TXT_SUPPLIER_NAME));
    $("#txtSupplierSiteID").val(clsGlobal.parseToString(objData.TXT_SUPPLIER_SITE_CODE));
    $("#txtSupplierSiteName").val(clsGlobal.parseToString(objData.TXT_SUPPLIER_SITE_NAME));
    $("#txtBudgetType").val(clsGlobal.parseToString(objData.TXT_BUDGET_TYPE));
    $("#txtPaymentType").val(clsGlobal.parseToString(objData.TXT_PAYMENT_TYPE)); 

    $('#chkMontlyPromo').prop('checked', clsGlobal.ParseBooleanOracleToNET(objData.BIT_MONTHLY_PROMO));
    $('#chkNational').prop('checked', clsGlobal.ParseBooleanOracleToNET(objData.BIT_NATIONAL));

    p_DataToUIActivity(objData.XXSHP_KCO_T_KKP_ACT);
    p_DataToUIBranch(objData.XXSHP_KCO_T_KKP_CAB);

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
    debugger;
    $('.autonumeric').autoNumeric('init', { vMax: '9999999999999', vMin: '-9999999999999', aSep: ',', dGroup: '3', aDec: '.' });
}

function p_GenerateDateTimePicker() {
    debugger;
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
        url: "/Transaction/KKP/InitiateData",
        data: { __RequestVerificationToken: $('#frmKKP input[name=__RequestVerificationToken]').val() },
        datatype: "json",
        success: function (retDat) {

            if (retDat.bitSuccess == true) {
                if (retDat.objData != undefined) {
                    p_SetHiddenObject(retDat.objData);
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

function p_UIToData() {
    var jsonObj = [];
    jsonData = p_GetHiddenObject();

    jsonData.TXT_DOCNO = clsGlobal.parseToString($("#txtDocNo").val());
    jsonData.CREATION_DATE = clsGlobal.parseToString($("#dtmDate").val());
    jsonData.TXT_REFDOCNO = clsGlobal.parseToString($("#txtRefDocNo").val());
    jsonData.TXT_SUPPLIER_ID = clsGlobal.parseToInteger($("#txtSupplierID").val());
    //jsonData.TXT_SUPPLIER_CODE = clsGlobal.parseToString($("#txtSupplierCode").val());
    jsonData.TXT_SUPPLIER_NAME = clsGlobal.parseToString($("#txtSupplierName").val());
    jsonData.TXT_SUPPLIER_SITE_CODE = clsGlobal.parseToString($("#txtSupplierSiteID").val());
    jsonData.TXT_SUPPLIER_SITE_NAME = clsGlobal.parseToString($("#txtSupplierSiteName").val());
    jsonData.TXT_BUDGET_TYPE = clsGlobal.parseToString($("#txtBudgetType").val());
    jsonData.TXT_PAYMENT_TYPE = clsGlobal.parseToString($("#txtPaymentType").val());

    jsonData.BIT_MONTHLY_PROMO = clsGlobal.ParseBooleanNETToOracle(clsGlobal.parseToBoolean($("#chkMontlyPromo").prop("checked")));
    jsonData.BIT_NATIONAL = clsGlobal.ParseBooleanNETToOracle(clsGlobal.parseToBoolean($("#chkNational").prop("checked")));
     
    p_SetHiddenObject(jsonData);
    return $("#txtHiddenObject").val();

}


function p_EnableControl(bitApply) {
    debugger;
    //if (bitApply == true) {
    //    //$("#txtName").attr("disabled", "true"); 
    //    //$("#btnUpdatePeriode").show();         

    //    //$("#btnAddResponden").hide(); //.css("display", "none");
    //    //$(".txtRespondenUserName").each(function (index) {
    //    //    $(this).attr("disabled", "true");
    //    //});
    //    ////$(".btnLOVRespondenUserName").each(function (index) {
    //    ////    $(this).hide(); //.css("display", "none");
    //    ////}); 
    //    //$(".btnRespondenDelete").each(function (index) {
    //    //    $(this).hide(); //.css("display", "none");
    //    //});
    //    //$(".btnRespondenChange").each(function (index) {
    //    //    $(this).show(); //.css("display", "none");
    //    //});
    //    //$(".btnRespondenSendNotif").each(function (index) {
    //    //    $(this).show(); //.css("display", "none");
    //    //});

    //} else {
    //    //$("#txtName").removeAttr("disabled");  
    //    //$("#btnUpdatePeriode").hide();
            
    //    //$("#btnAddResponden").show(); //.removeAttr("display");
    //    //$(".txtRespondenUserName").each(function (index) {
    //    //    $(this).removeAttr("disabled");
    //    //});
    //    //$(".btnLOVRespondenUserName").each(function (index) {
    //    //    $(this).show(); //.removeClass("display");
    //    //});
    //    //$(".btnRespondenDelete").each(function (index) {
    //    //    $(this).show(); //.removeClass("display");
    //    //});
    //    //$(".btnRespondenChange").each(function (index) {
    //    //    $(this).hide(); //.removeClass("display");
    //    //});
    //    //$(".btnRespondenSendNotif").each(function (index) {
    //    //    $(this).hide(); //.removeClass("display");
    //    //});

    //}
}

function p_txtDocNo_TextChanged() {
    clsGlobal.showLoading();
    $.ajax({
        type: "POST",
        url: "/Transaction/KKP/GetDataByTxtDocNo",
        data: { txtDocNo: $("#txtDocNo").val(), __RequestVerificationToken: $('#frmKKP input[name=__RequestVerificationToken]').val() },
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

function p_txtSupplierID_TextChanged() {
    clsGlobal.showLoading();
    $.ajax({
        type: "POST",
        url: "/Master/Supplier/GetData",
        data: { txtID: $("#txtSupplierID").val(), __RequestVerificationToken: $('#frmKKP input[name=__RequestVerificationToken]').val() },
        datatype: "json",
        success: function (retDat) {
            debugger;
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
        data: { txtID: $("#txtSupplierSiteID").val(), __RequestVerificationToken: $('#frmKKP input[name=__RequestVerificationToken]').val() },
        datatype: "json",
        success: function (retDat) {

            if (retDat.bitSuccess == true) {
                if (retDat.objData != undefined) { 
                    $("#txtSupplierSiteName").val(clsGlobal.parseToString(retDat.objData.VENDOR_SITE_CODE));
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

function p_saveData() {

    clsGlobal.showLoading();
    p_UIToData();
    $.ajax({
        type: "POST",
        url: "/Transaction/KKP/SaveData",
        data: { data: $("#txtHiddenObject").val(), txtGUID: $("#txtGUID").val(), __RequestVerificationToken: $('#frmKKP input[name=__RequestVerificationToken]').val() },
        datatype: "json",
        success: function (retDat) {
            debugger;
            if (retDat.bitSuccess == true) {
                p_DataToUI(retDat.objData);
                clsGlobal.getInformationMessage(retDat.txtMessage);
            } else {
                clsGlobal.getAlert(retDat.txtMessage);
            }
            clsGlobal.hideLoading();
        },
        error: function (retDat) {
            debugger;
            clsGlobal.hideLoading();
        }
    });
}

function p_submitData() {

    clsGlobal.showLoading();
    p_UIToData();
    $.ajax({
        type: "POST",
        url: "/Transaction/KKP/SubmitData",
        data: { data: $("#txtHiddenObject").val(), txtGUID: $("#txtGUID").val(), __RequestVerificationToken: $('#frmKKP input[name=__RequestVerificationToken]').val() },
        datatype: "json",
        success: function (retDat) {
            debugger;
            if (retDat.bitSuccess == true) {
                p_DataToUI(retDat.objData);
                clsGlobal.getInformationMessage(retDat.txtMessage);
            } else {
                clsGlobal.getAlert(retDat.txtMessage);
            }
            clsGlobal.hideLoading();
        },
        error: function (retDat) {
            debugger;
            clsGlobal.hideLoading();
        }
    });
}

function p_deleteData() {
    clsGlobal.showLoading();
    p_UIToData();
    $.ajax({
        type: "POST",
        url: "/Transaction/KKP/DeleteData",
        data: { data: $("#txtHiddenObject").val(), __RequestVerificationToken: $('#frmKKP input[name=__RequestVerificationToken]').val() },
        datatype: "json",
        success: function (retDat) {
            debugger;
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



// ====================================================
//  ACTIVITY
// ====================================================

function p_DataToUIActivity(XXSHP_KCO_T_KKP_ACT) {
    debugger;
    oTableActivity.clear();
    for (var i = 0; i < XXSHP_KCO_T_KKP_ACT.length; i++) {
        XXSHP_KCO_T_KKP_ACT[i].intIndex = i;
        oTableActivity.row.add(XXSHP_KCO_T_KKP_ACT[i]);
    }
    oTableActivity.draw(false);

    var objDat = p_GetHiddenObject();
    objDat.XXSHP_KCO_T_KKP_ACT = XXSHP_KCO_T_KKP_ACT;
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
    debugger;
    p_UIToData();
    var objData = p_GetHiddenObject();
    if (objData.TXT_SUPPLIER_ID == 0) {
        throw "Kolom Supplier harus di isi!";
    }
    if (objData.TXT_BUDGET_TYPE == 0) {
        throw "Kolom tipe budget harus di isi!";
    }
    if (objData.TXT_PAYMENT_TYPE == 0) {
        throw "Kolom tipe pembayaran harus di isi!";
    }

    clsGlobal.showLoading(); 
    $.ajax({
        type: "POST",
        url: "/Transaction/KKP/AddRowActivity",
        data: { data: $("#txtHiddenObject").val(), __RequestVerificationToken: $('#frmKKP input[name=__RequestVerificationToken]').val() },
        datatype: "json",
        success: function (retDat) {

            if (retDat.bitSuccess == true) {
                if (retDat.objData != undefined) {
                    p_SetHiddenObject(retDat.objData);
                    p_DataToUIActivity(retDat.objData.XXSHP_KCO_T_KKP_ACT);
                    oTableActivity.page('last').draw(false);
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

function p_InitiateActivity() {
    // Format datatable  
    debugger;
    oTableActivity = $('#dtActivity').DataTable({
        "bPaginate": true,
        "bSort": false,
        searching: false,
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
                            '       <div class="input-group-btn"> ' +
                            '           <button type="button" class="btn btn-danger btnLOVActivityCode" id="btnLOVActivityCode" onclick="p_btnLOVActivityCode_Click(this,' + full.intIndex + ')"> <i class="fa fa-search"></i></button> ' +
                            '       </div> ' +
                            '       <div class="input-group-btn" style="width:60px;"> ' +
                            '       <input type="text" class="form-control txtActivityCode" id="txtActivityCode" onchange="p_txtActivityCode_Changed(this,' + full.intIndex + ')"  value="' + full.TXT_ACTIVITYCODE + '" disabled> ' +
                            '       </div> ' + 
                            '   </div>';
               }
           },
           {
               aTargets: [2],
               mRender: function (data, type, full) {
                   return '<div >  <input type="text" class="form-control txtActivityProgramDesc" id="txtActivityProgramDesc' + full.intIndex + '" onchange="p_txtActivityProgramDesc_Changed(this,' + full.intIndex + ')"  value="' + full.TXT_PROGRAMDESC + '" >  </div>';
               }
           },
           {
               aTargets: [3],
               mRender: function (data, type, full) {
                   return '<div >  <input type="text" class="form-control dtActivityPeriodFrom datetimepicker"  style="width:100px;"  id="dtActivityPeriodFrom' + full.intIndex + '" onchange="p_dtActivityPeriodFrom_Changed(this,' + full.intIndex + ')"  value="' + clsGlobal.parseToDateTimeFromJSON(full.DTM_PERIOD_FROM, clsDateFormat) + '" >  </div>';
               }
           },
           {
               aTargets: [4],
               mRender: function (data, type, full) {
                   return '<div >  <input type="text" class="form-control dtActivityPeriodTo datetimepicker" style="width:100px;" id="dtActivityPeriodTo' + full.intIndex + '" onchange="p_dtActivityPeriodTo_Changed(this,' + full.intIndex + ')"  value="' + clsGlobal.parseToDateTimeFromJSON(full.DTM_PERIOD_TO, clsDateFormat) + '" >  </div>';
               }
           },
           {
               aTargets: [5],
               mRender: function (data, type, full) {
                   return '<div >  <input type="text" class="form-control autonumeric txtActivityAmount text-right" id="txtActivityAmount' + full.intIndex + '" onchange="p_txtActivityAmount_Changed(this,' + full.intIndex + ')"  value="' + full.DEC_AMOUNT + '" >  </div>';
               }
           },
           {
               aTargets: [6],
               mRender: function (data, type, full) {
                  // return '<div >  <input type="text" class="form-control autonumeric txtActivitySubTotal" id="txtActivitySubTotal' + full.intIndex + '"  value="' + full.DEC_SUBTOTAL + '" >  </div>';
                   return '<div id="lblActivitySubTotal" class="text-right" style="width:100px;"> ' + full.DEC_SUBTOTAL + ' </div>';
               }
           },
           {
               aTargets: [7],
               mRender: function (data, type, full) {
                   return '<div > <input type="button" class="btn btn-info btnActivityBudget" id="btnActivityBudget" onclick="p_btnActivityBudget_Click(this,' + full.intIndex + ')"  value="Budget" >  </div>';
               }
           },
            {
                aTargets: [8],
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
    LOV = clsGlobal.generateLOV(MODULE_ACTIVITY, "txtActivityCode");
}

function p_settxtActivityCode(txtValue) {
    debugger;
    var intSelectedIndex = p_GetSelectedActivityRow();
    var intRowIndex = 0;
    var objDat = p_GetHiddenObject();
    oTableActivity.rows().every(function (rowIdx, tableLoop, rowLoop) {
        debugger;
        var d = this.data();
        if (intRowIndex == intSelectedIndex) {
            d.intIndex = intRowIndex; // update data source for the row 
              
            d.TXT_ACTIVITYCODE = txtValue;
            objDat.XXSHP_KCO_T_KKP_ACT[intRowIndex].TXT_ACTIVITYCODE = txtValue;
             
            this.invalidate(); // invalidate the data DataTables has cached for this row         
            p_EnableControl(objDat.bitApply);
        }

        intRowIndex++;
    });

    p_SetHiddenObject(objDat);
}
 
function p_txtActivityProgramDesc_Changed(objCaller, intIndex) {
    debugger;
    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());
    for (i = 0; i < objData.XXSHP_KCO_T_KKP_ACT.length; i++) {
        // Cari Index-nya.
        if (objData.XXSHP_KCO_T_KKP_ACT[i].intIndex == intIndex) {
            // Ketemu, mulai dari sini:
            objData.XXSHP_KCO_T_KKP_ACT[i].TXT_PROGRAMDESC = objCaller.value;
            break;
        }
    }
    p_SetHiddenObject(objData);
}

function p_dtActivityPeriodFrom_Changed(objCaller, intIndex) {
    debugger;
    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());
    for (i = 0; i < objData.XXSHP_KCO_T_KKP_ACT.length; i++) {
        // Cari Index-nya.
        if (objData.XXSHP_KCO_T_KKP_ACT[i].intIndex == intIndex) {
            // Ketemu, mulai dari sini:
            objData.XXSHP_KCO_T_KKP_ACT[i].DTM_PERIOD_FROM = objCaller.value;
            break;
        }
    }
    p_SetHiddenObject(objData);
}

function p_dtActivityPeriodTo_Changed(objCaller, intIndex) {
    debugger;
    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());
    for (i = 0; i < objData.XXSHP_KCO_T_KKP_ACT.length; i++) {
        // Cari Index-nya.
        if (objData.XXSHP_KCO_T_KKP_ACT[i].intIndex == intIndex) {
            // Ketemu, mulai dari sini:
            objData.XXSHP_KCO_T_KKP_ACT[i].DTM_PERIOD_TO = objCaller.value;
            break;
        }
    }
    p_SetHiddenObject(objData);
}

function p_txtActivityAmount_Changed(objCaller, intIndex) {
    debugger;
    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());
    for (i = 0; i < objData.XXSHP_KCO_T_KKP_ACT.length; i++) {
        // Cari Index-nya.
        if (objData.XXSHP_KCO_T_KKP_ACT[i].intIndex == intIndex) {
            // Ketemu, mulai dari sini:
            objData.XXSHP_KCO_T_KKP_ACT[i].DEC_AMOUNT = clsGlobal.parseToDecimal(objCaller.value);
            break;
        }
    }
    p_SetHiddenObject(objData);
}
 
function p_btnActivityBudget_Click(objCaller, intIndex) {
    debugger;
    try {
        // Parse dari HiddenObject->JSON
        var objData = JSON.parse(p_UIToData());
        for (i = 0; i < objData.XXSHP_KCO_T_KKP_ACT.length; i++) {
            // Cari Index-nya.
            if (objData.XXSHP_KCO_T_KKP_ACT[i].intIndex == intIndex) {
                // Ketemu, mulai dari sini:

                // Validasi
                if (objData.XXSHP_KCO_T_KKP_ACT[i].TXT_ACTIVITYCODE == "") {                    
                    throw "Activity must be filled!";
                }
                if (objData.XXSHP_KCO_T_KKP_ACT[i].DEC_AMOUNT == 0) {
                    throw "Amount must be filled!";
                }

                var fancyboxdata = p_GetHiddenObject();
                LOV = clsGlobal.generatePopUpIframe($(location).attr('protocol') + "//" + $(location).attr('host') + "/Transaction/KKP/Budget?intIndex=" + intIndex, "btnActivityBudget", fancyboxdata);
                break;
            }
        }
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
}

function p_setBudget() {
    debugger;
    var intSelectedIndex = p_GetSelectedActivityRow();
    var intRowIndex = 0;
    var objDat = p_GetHiddenObject();
    // Calculate Total Alokasi.
    objDat.XXSHP_KCO_T_KKP_ACT[intSelectedIndex].DEC_SUBTOTAL = 0;
    for (i = 0; i < objDat.XXSHP_KCO_T_KKP_ACT[intSelectedIndex].XXSHP_KCO_T_KKP_BGT.length; i++) {
        //var decAmount = clsGlobal.parseToDecimal(objDat.XXSHP_KCO_T_KKP_ACT[intActivityIndex].XXSHP_KCO_T_KKP_BGT[intRowIndex].XXSHP_KCO_T_KKP_SUB[i].DEC_AMOUNT);
        objDat.XXSHP_KCO_T_KKP_ACT[intSelectedIndex].DEC_SUBTOTAL += objDat.XXSHP_KCO_T_KKP_ACT[intSelectedIndex].XXSHP_KCO_T_KKP_BGT[i].DEC_SUBTOTAL;
    }

    // Show ke table.
    oTableActivity.rows().every(function (rowIdx, tableLoop, rowLoop) {
        debugger;
        var d = this.data();
        if (intRowIndex == intSelectedIndex) {
            d.intIndex = intRowIndex; // update data source for the row 

            d.DEC_SUBTOTAL = objDat.XXSHP_KCO_T_KKP_ACT[intSelectedIndex].DEC_SUBTOTAL;
            d.TXT_ACTIVITYCODE = objDat.XXSHP_KCO_T_KKP_ACT[intSelectedIndex].TXT_ACTIVITYCODE;
            d.TXT_ACTIVITYNAME = objDat.XXSHP_KCO_T_KKP_ACT[intSelectedIndex].TXT_ACTIVITYNAME;
            d.TXT_PROGRAMDESC = objDat.XXSHP_KCO_T_KKP_ACT[intSelectedIndex].TXT_PROGRAMDESC;
            d.DEC_AMOUNT = objDat.XXSHP_KCO_T_KKP_ACT[intSelectedIndex].DEC_AMOUNT;

            this.invalidate(); // invalidate the data DataTables has cached for this row         
            p_EnableControl(objDat.bitApply);
        }

        intRowIndex++;
    });

    p_SetHiddenObject(objDat);
}
//function p_btnActivityBudget_Click(objCaller, intIndex) {
//    ////debugger;
//    ////// Parse dari HiddenObject->JSON
//    ////var objData = JSON.parse(p_UIToData());
//    ////for (i = 0; i < objData.XXSHP_KCO_T_KKP_ACT.length; i++) {
//    ////    // Cari Index-nya.
//    ////    if (objData.XXSHP_KCO_T_KKP_ACT[i].intIndex == intIndex) {
//    ////        // Ketemu, mulai dari sini:
//    ////        // Remove from list.
//    ////        objData.XXSHP_KCO_T_KKP_ACT.splice(i, 1);

//    ////        //var row = oTableActivity.row($(this).parents('tr'));
//    ////        //var rowNode = row.node();
//    ////        //row.remove().draw();
//    ////        oTableActivity.row(i).remove().draw(false);
//    ////        break;
//    ////    }
//    ////}
//    ////p_SetHiddenObject(objData);
//    ////p_RefreshNumberActivity();
//}


function p_btnActivityDelete_Click(objCaller, intIndex) {
    debugger;
    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());
    for (i = 0; i < objData.XXSHP_KCO_T_KKP_ACT.length; i++) {
        // Cari Index-nya.
        if (objData.XXSHP_KCO_T_KKP_ACT[i].intIndex == intIndex) {
            // Ketemu, mulai dari sini:
            // Remove from list.
            objData.XXSHP_KCO_T_KKP_ACT.splice(i, 1);

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

function p_RefreshNumberActivity() {
    debugger;
    var intRowIndex = 0;
    var objDat = p_GetHiddenObject();
    oTableActivity.rows().every(function (rowIdx, tableLoop, rowLoop) {
        debugger;
        var d = this.data();
        d.intIndex = intRowIndex; // update data source for the row
        objDat.XXSHP_KCO_T_KKP_ACT[intRowIndex].intIndex = d.intIndex;

        d.TXT_ACTIVITYCODE = objDat.XXSHP_KCO_T_KKP_ACT[intRowIndex].TXT_ACTIVITYCODE;
        d.TXT_ACTIVITYNAME = objDat.XXSHP_KCO_T_KKP_ACT[intRowIndex].TXT_ACTIVITYNAME;
        d.TXT_PROGRAMDESC = objDat.XXSHP_KCO_T_KKP_ACT[intRowIndex].TXT_PROGRAMDESC;
        d.DTM_PERIOD_FROM = objDat.XXSHP_KCO_T_KKP_ACT[intRowIndex].DTM_PERIOD_FROM;
        d.DTM_PERIOD_TO = objDat.XXSHP_KCO_T_KKP_ACT[intRowIndex].DTM_PERIOD_TO;
        d.DEC_AMOUNT = objDat.XXSHP_KCO_T_KKP_ACT[intRowIndex].DEC_AMOUNT;
        d.DEC_SUBTOTAL = objDat.XXSHP_KCO_T_KKP_ACT[intRowIndex].DEC_SUBTOTAL;
        
        intRowIndex++;
        this.invalidate(); // invalidate the data DataTables has cached for this row         
    });

    // Draw once all updates are done
    oTableActivity.draw(false);
    p_SetHiddenObject(objDat);
}



// ====================================================
//  Branch
// ====================================================

function p_DataToUIBranch(XXSHP_KCO_T_KKP_CAB) {
    debugger;
    oTableBranch.clear();
    for (var i = 0; i < XXSHP_KCO_T_KKP_CAB.length; i++) {
        XXSHP_KCO_T_KKP_CAB[i].intIndex = i;
        oTableBranch.row.add(XXSHP_KCO_T_KKP_CAB[i]);
    }
    oTableBranch.draw(false);

    var objDat = p_GetHiddenObject();
    objDat.XXSHP_KCO_T_KKP_CAB = XXSHP_KCO_T_KKP_CAB;
    p_SetHiddenObject(objDat);
}

$('#btnAddBranch').on('click', function () {
    try {
        p_AddRowBranch();
    } catch (ex) {
        clsGlobal.showAlert(ex);
    } 
});

function p_AddRowBranch() {
    debugger;
    clsGlobal.showLoading();
    $.ajax({
        type: "POST",
        url: "/Transaction/KKP/AddRowBranch",
        data: { data: $("#txtHiddenObject").val(), __RequestVerificationToken: $('#frmKKP input[name=__RequestVerificationToken]').val() },
        datatype: "json",
        success: function (retDat) {

            if (retDat.bitSuccess == true) {
                if (retDat.objData != undefined) {
                    p_SetHiddenObject(retDat.objData);
                    p_DataToUIBranch(retDat.objData.XXSHP_KCO_T_KKP_CAB);
                    oTableBranch.page('last').draw(false);
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

function p_InitiateBranch() {
    // Format datatable  
    debugger;
    oTableBranch = $('#dtBranch').DataTable({
        "bPaginate": true,
        "bSort": false,
        searching: false,
        "iDisplayLength": 5,
        "type": "POST",
        aoColumnDefs: [
            {
                aTargets: [0],
                mRender: function (data, type, full) {
                    return '<div id="lblBranchNoValue"> ' + (full.intIndex + 1) + ' </div>';
                }
            }, 
           {
               aTargets: [1],
               mRender: function (data, type, full) {
                   return '     <div class="input-group"> ' +
                            '       <div class="input-group-btn"> ' +
                            '           <button type="button" class="btn btn-danger btnLOVBranchCode" id="btnLOVBranchCode" onclick="p_btnLOVBranchCode_Click(this,' + full.intIndex + ')"> <i class="fa fa-search"></i></button> ' +
                            '       </div> ' +
                            '       <input type="text" class="form-control txtBranchCode" id="txtBranchCode" onchange="p_txtBranchCode_Changed(this,' + full.intIndex + ')"  value="' + full.TXT_BRANCHCODE + '" disabled> ' +
                            '   </div>';
               }
           },
           {
               aTargets: [2],
               mRender: function (data, type, full) {
                   return '<div >  <input type="text" class="form-control txtBranchDesc" id="txtBranchDesc' + full.intIndex + '" value="' + full.TXT_BRANCHNAME + '" disabled>  </div>';
               }
           }, 
            {
                aTargets: [3],
                mRender: function (data, type, full) {
                    return '<div > <input type="button" class="btn btn-warning" id="btnBranchDelete" class="btnBranchDelete" onclick="p_btnBranchDelete_Click(this,' + full.intIndex + ')"  value="Delete" >  </div>';
                }
            }
        ]
    });

    $("#dtBranch").css("width", "100%");
    $('#dtBranch tbody').on('click', 'tr', function () {
        if (!$(this).hasClass('selected')) {
            oTableBranch.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
        }
    });
}

function p_GetSelectedBranchRow() {
    var intIndex = clsGlobal.parseToInteger(oTableBranch.$('tr.selected').find("#lblBranchNoValue").html()) - 1;
    return intIndex;
}

function p_btnLOVBranchCode_Click(objCaller, intIndex) {
    LOV = clsGlobal.generateLOV(MODULE_BRANCH2, "txtBranchCode");
}

function p_settxtBranchCode(txtValue, txtValue2) {
    //clsGlobal.showLoading();
    //$.ajax({
    //    type: "POST",
    //    url: "/Transaction/KKP/AddRowBranch",
    //    data: { data: $("#txtHiddenObject").val(), __RequestVerificationToken: $('#frmKKP input[name=__RequestVerificationToken]').val() },
    //    datatype: "json",
    //    success: function (retDat) {

    //        if (retDat.bitSuccess == true) {
    //            if (retDat.objData != undefined) {
    //                p_SetHiddenObject(retDat.objData);
    //                p_DataToUIBranch(retDat.objData.XXSHP_KCO_T_KKP_CAB);
    //                oTableBranch.page('last').draw(false);
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


    var intSelectedIndex = p_GetSelectedBranchRow();
    var intRowIndex = 0;
    var objDat = p_GetHiddenObject();
    oTableBranch.rows().every(function (rowIdx, tableLoop, rowLoop) {
        debugger;
        var d = this.data();
        if (intRowIndex == intSelectedIndex) {
            d.intIndex = intRowIndex; // update data source for the row 

            d.TXT_BRANCHCODE = txtValue;
            d.TXT_BRANCHNAME = txtValue2;
            objDat.XXSHP_KCO_T_KKP_CAB[intRowIndex].TXT_BRANCHCODE = txtValue;
            objDat.XXSHP_KCO_T_KKP_CAB[intRowIndex].TXT_BRANCHNAME = txtValue2;

            this.invalidate(); // invalidate the data DataTables has cached for this row         
            p_EnableControl(objDat.bitApply);
        }

        intRowIndex++;
    });

    p_SetHiddenObject(objDat);

}
 

function p_btnBranchDelete_Click(objCaller, intIndex) {
    debugger;
    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());
    for (i = 0; i < objData.XXSHP_KCO_T_KKP_CAB.length; i++) {
        // Cari Index-nya.
        if (objData.XXSHP_KCO_T_KKP_CAB[i].intIndex == intIndex) {
            // Ketemu, mulai dari sini:
            // Remove from list.
            objData.XXSHP_KCO_T_KKP_CAB.splice(i, 1);

            //var row = oTableBranch.row($(this).parents('tr'));
            //var rowNode = row.node();
            //row.remove().draw();
            oTableBranch.row(i).remove().draw(false);
            break;
        }
    }
    p_SetHiddenObject(objData);
    p_RefreshNumberBranch();
}

function p_RefreshNumberBranch() {
    debugger;
    var intRowIndex = 0;
    var objDat = p_GetHiddenObject();
    oTableBranch.rows().every(function (rowIdx, tableLoop, rowLoop) {
        debugger;
        var d = this.data();
        d.intIndex = intRowIndex; // update data source for the row
        objDat.XXSHP_KCO_T_KKP_CAB[intRowIndex].intIndex = d.intIndex;

        d.TXT_BRANCHCODE = objDat.XXSHP_KCO_T_KKP_CAB[intRowIndex].TXT_BRANCHCODE;
        d.TXT_BRANCHNAME = objDat.XXSHP_KCO_T_KKP_CAB[intRowIndex].TXT_BRANCHNAME;
       
        intRowIndex++;
        this.invalidate(); // invalidate the data DataTables has cached for this row         
    });

    // Draw once all updates are done
    oTableBranch.draw(false);
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


$('#btnLOVDocNo').bind('click', function () {
    try {
        LOV = clsGlobal.generateLOV(MODULE_KKP, "txtDocNo"); //MODULE_APPROVALHIERARCHY
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
});


$('#btnLOVRefDocNo').bind('click', function () {
    try {
        LOV = clsGlobal.generateLOV("KKP", "txtRefDocNo"); //MODULE_APPROVALHIERARCHY
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
});


$('#btnLOVSupplier').bind('click', function () {
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

$('#btnLOVBudgetType').bind('click', function () {
    try {
        LOV = clsGlobal.generateLOV(MODULE_MTBUDGETTYPE, "txtBudgetType");
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
});
$('#btnLOVPaymentType').bind('click', function () {
    try {
        LOV = clsGlobal.generateLOV(MODULE_TYPE_PAYMENT, "txtPaymentType");
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
