//=======================
// VARIABLE GLOBAL
//=======================
var clsGlobal = new clsGlobalClass();
var LOV;
var bitLoading = false;
var oTableDetail;
var oTableActivity;
var oTableSupplier;


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
    //p_showPrevData();
    p_InitiateDetail();
    p_InitiateSupplier();
    p_InitiateActivity();
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
        case "txtDetailEmployee":           
            p_settxtDetailEmployee(arr[1]);
            break;
        case "txtDetailEmployee":
            p_settxtDetailEmployee(arr[1]);
            break;
        //case "txtSupplierID":
        //    $("#txtSupplierID").val(arr[1]);
        //    p_txtSupplierID_TextChanged();
        //    break;
        //case "txtSupplierSiteID":
        //    $("#txtSupplierSiteID").val(arr[1]);
        //    p_txtSupplierSiteID_TextChanged();
        //    break;
        //case "txtDetailActivity": 
        //    p_settxtDetailActivity(arr[1]);
        //    break;
        //case "txtDetailCOA": 
        //    p_settxtDetailCOA(arr[1]);
        //    break;
        //case "txtDetailJenisAPP": 
        //    p_settxtDetailJenisAPP(arr[1]);
        //    break;
        //case "txtDetailTypeAPP":
        //    
        //    p_settxtDetailTypeAPP(arr[1]);
        //    break; 

    }
    clsGlobal.closeLOV();
}

function p_DataToUI(objData) {
    $("#txtID").val(clsGlobal.parseToInteger(objData.INT_APP_HDR_ID));

    $("#txtCode").val(clsGlobal.parseToString(objData.TXT_CODE));
    $("#txtDesc").val(clsGlobal.parseToString(objData.TXT_DESC));

    $("#txtVersion").val(clsGlobal.parseToString(objData.XXSHP_KDS_M_APP_VER[0].INT_VERSION));
  
    $("#dtEffectiveFrom").val(clsGlobal.parseToDateTimeFromJSON(objData.XXSHP_KDS_M_APP_VER[0].DTM_EFFECTIVE_FROM, clsDateFormat));
    $("#dtEffectiveTo").val(clsGlobal.parseToDateTimeFromJSON(objData.XXSHP_KDS_M_APP_VER[0].DTM_EFFECTIVE_TO, clsDateFormat)); 
    $('#chkActive').prop('checked', clsGlobal.ParseBooleanOracleToNET(objData.BIT_ACTIVE));

    p_DataToUIDetail(objData.XXSHP_KDS_M_APP_VER[0].XXSHP_KDS_M_APP_DTL);
    p_DataToUIActivity(objData.XXSHP_KDS_M_APP_VER[0].XXSHP_KDS_M_APP_ACT);
    p_DataToUISupplier(objData.XXSHP_KDS_M_APP_VER[0].XXSHP_KDS_M_APP_SUP);

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
    
    $('.kalendertarget').datepicker({
        autoclose: true, 
        onSelect: function (dateText) {
            display("Selected date: " + dateText + "; input's current value: " + this.value);
        }
    });
}


function p_GetHiddenObject() {
    return JSON.parse($("#txtHiddenObject").val());
}

function p_initiateData() {
    clsGlobal.showLoading();
    $.ajax({
        type: "POST",
        url: "/Master/ApprovalHierarchy/InitiateData",
        data: { __RequestVerificationToken: $('#frmApprovalHierarchy input[name=__RequestVerificationToken]').val() },
        datatype: "json",
        success: function (retDat) {

            if (retDat.bitSuccess == true) {
                if (retDat.objData != undefined) {
                    p_SetHiddenObject(retDat.objData);
                    p_DataToUI(retDat.objData);
                    $("#txtGUID").val(retDat.txtGUID);
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
        $("#txtID").val(id);
        p_txtID_TextChanged();
    }
}

function p_UIToData() {
    var jsonObj = [];
    jsonData = p_GetHiddenObject();
    jsonData.INT_APP_HDR_ID = clsGlobal.parseToInteger($("#txtID").val());
    jsonData.TXT_CODE = clsGlobal.parseToString($("#txtCode").val());
    jsonData.TXT_DESC = clsGlobal.parseToString($("#txtDesc").val());
    jsonData.XXSHP_KDS_M_APP_VER[0].INT_VERSION = clsGlobal.parseToString($("#txtVersion").val());
    jsonData.XXSHP_KDS_M_APP_VER[0].DTM_EFFECTIVE_FROM = clsGlobal.parseToString($("#dtEffectiveFrom").val());
    jsonData.XXSHP_KDS_M_APP_VER[0].DTM_EFFECTIVE_TO = clsGlobal.parseToString($("#dtEffectiveTo").val());
    jsonData.BIT_ACTIVE = clsGlobal.ParseBooleanNETToOracle(clsGlobal.parseToBoolean($("#chkActive").prop("checked")));

    p_SetHiddenObject(jsonData);
    return $("#txtHiddenObject").val();

}


function p_EnableControl(bitApply) {
    
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

function p_txtID_TextChanged() {
    clsGlobal.showLoading();
    $.ajax({
        type: "POST",
        url: "/Master/ApprovalHierarchy/GetData",
        data: { txtID: $("#txtID").val(), __RequestVerificationToken: $('#frmApprovalHierarchy input[name=__RequestVerificationToken]').val() },
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

function p_txtSupplierID_TextChanged() {
    clsGlobal.showLoading();
    $.ajax({
        type: "POST",
        url: "/Master/Supplier/GetData",
        data: { txtID: $("#txtSupplierID").val(), __RequestVerificationToken: $('#frmApprovalHierarchy input[name=__RequestVerificationToken]').val() },
        datatype: "json",
        success: function (retDat) {
            
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
        data: { txtID: $("#txtSupplierSiteID").val(), __RequestVerificationToken: $('#frmApprovalHierarchy input[name=__RequestVerificationToken]').val() },
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
        url: "/Master/ApprovalHierarchy/SaveData",
        data: { data: $("#txtHiddenObject").val(), txtGUID: $("#txtGUID").val(), __RequestVerificationToken: $('#frmApprovalHierarchy input[name=__RequestVerificationToken]').val() },
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
        url: "/Master/ApprovalHierarchy/DeleteData",
        data: { data: $("#txtHiddenObject").val(), txtGUID: $("#txtGUID").val(), __RequestVerificationToken: $('#frmApprovalHierarchy input[name=__RequestVerificationToken]').val() },
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



// ====================================================
//  DETAIL
// ====================================================

function p_DataToUIDetail(XXSHP_KDS_M_APP_DTL) {
    
    oTableDetail.clear();
    for (var i = 0; i < XXSHP_KDS_M_APP_DTL.length; i++) {
        XXSHP_KDS_M_APP_DTL[i].intIndex = i;
        oTableDetail.row.add(XXSHP_KDS_M_APP_DTL[i]);
    }
    oTableDetail.draw(false);

    var objDat = p_GetHiddenObject();
    objDat.XXSHP_KDS_M_APP_VER[0].XXSHP_KDS_M_APP_DTL = XXSHP_KDS_M_APP_DTL;
    p_SetHiddenObject(objDat);
}


$('#btnAddDetail').on('click', function () {
    p_AddRowDetail();
});

function p_AddRowDetail() {
    
    clsGlobal.showLoading();
    $.ajax({
        type: "POST",
        url: "/Master/ApprovalHierarchy/AddRowDetail",
        data: { data: $("#txtHiddenObject").val(), __RequestVerificationToken: $('#frmApprovalHierarchy input[name=__RequestVerificationToken]').val() },
        datatype: "json",
        success: function (retDat) {

            if (retDat.bitSuccess == true) {
                if (retDat.objData != undefined) {
                    p_SetHiddenObject(retDat.objData);
                    p_DataToUIDetail(retDat.objData.XXSHP_KDS_M_APP_VER[0].XXSHP_KDS_M_APP_DTL);
                    oTableDetail.page('last').draw(false);
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

function p_InitiateDetail() {
    // Format datatable  
    
    oTableDetail = $('#dtDetail').DataTable({
        "bPaginate": true,
        "bSort": false,
        searching: false,
        "aLengthMenu": [[5, 10, 25, 50, 75, 100], [5, 10, 25, 50, 75, 100]],
        "iDisplayLength": 5,
        "type": "POST",
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
                    return '<div >  <input type="text" class="form-control txtDetailOrder autonumeric text-right" id="txtDetailOrder' + full.intIndex + '" onchange="p_txtDetailOrder_Changed(this,' + full.intIndex + ')"  value="' + full.INT_ORDER + '" >  </div>';
                }
            },
           {
               aTargets: [2],
               mRender: function (data, type, full) {
                   return '     <div class="input-group"> ' +
                            '       <div class="input-group-btn"> ' +
                            '           <button type="button" class="btn btn-danger btnLOVDetailEmployee" id="btnLOVDetailEmployee" onclick="p_btnLOVDetailEmployee_Click(this,' + full.intIndex + ')"> <i class="fa fa-search"></i></button> ' +
                            '       </div> ' +
                            '       <div class="input-group-btn" style="width:60px;"> ' +
                            '       <input type="text" class="form-control txtDetailEmployee" id="txtDetailEmployee" onchange="p_txtDetailEmployee_Changed(this,' + full.intIndex + ')"  value="' + full.TXT_EMPLOYEEID + '" disabled> ' +
                            '       </div> ' +
                            '       <div class="input-group-btn" style="width:100px;"> ' +
                            '       <input type="text" class="form-control txtDetailEmployeeName" id="txtDetailEmployeeName" value="' + full.TXT_EMPLOYEENAME + '" disabled> ' +
                            '       </div> ' +
                            '   </div>';
               }
           },
           {
               aTargets: [3],
               mRender: function (data, type, full) {
                   return '<div >  <input type="text" class="form-control txtDetailMinAmount autonumeric text-right" id="txtDetailMinAmount' + full.intIndex + '" onchange="p_txtDetailMinAmount_Changed(this,' + full.intIndex + ')"  value="' + full.DEC_MIN + '" >  </div>';
               }
           },
           {
               aTargets: [4],
               mRender: function (data, type, full) {
                   return '<div >  <input type="text" class="form-control txtDetailMaxAmount autonumeric text-right" id="txtDetailMinAmount' + full.intIndex + '" onchange="p_txtDetailMaxAmount_Changed(this,' + full.intIndex + ')"  value="' + full.DEC_MAX + '" >  </div>';
               }
           },
           {
               aTargets: [5],
               mRender: function (data, type, full) {
                   if (clsGlobal.ParseBooleanOracleToNET(full.BIT_TRANSACTION)) {
                       return '<div > <input type="checkbox" id="chkDetailTransaction" class="chkDetailTransaction" onchange="p_chkDetailTransaction_Changed(this,' + full.intIndex + ')"  checked="' + clsGlobal.ParseBooleanOracleToNET(full.BIT_TRANSACTION) + '" >  </div>';
                   } else {
                       return '<div > <input type="checkbox" id="chkDetailTransaction" class="chkDetailTransaction" onchange="p_chkDetailTransaction_Changed(this,' + full.intIndex + ')" >  </div>';
                   }
               }
           },
            {
                aTargets: [6],
                mRender: function (data, type, full) {
                    return '<div > <input type="button" class="btn btn-warning" id="btnDetailDelete" class="btnDetailDelete" onclick="p_btnDetailDelete_Click(this,' + full.intIndex + ')"  value="Delete" >  </div>';
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
 
function p_btnLOVDetailEmployee_Click(objCaller, intIndex) {
    LOV = clsGlobal.generateLOV(MODULE_KARYAWAN, "txtDetailEmployee");
}

function p_settxtDetailEmployee(txtValue) {
    $.ajax({
        type: "POST",
        url: "/System/Karyawan/GetKaryawan",
        data: { txtID: txtValue, __RequestVerificationToken: $('#frmApprovalHierarchy input[name=__RequestVerificationToken]').val() },
        datatype: "json",
        success: function (retDat) {
            if (retDat.bitSuccess == true) {
                if (retDat.objData != undefined) {

                    
                    var intSelectedIndex = p_GetSelectedDetailRow();
                    var intRowIndex = 0;
                    var objDat = p_GetHiddenObject();
                    oTableDetail.rows().every(function (rowIdx, tableLoop, rowLoop) {
                        
                        var d = this.data();
                        if (intRowIndex == intSelectedIndex) {
                            d.intIndex = intRowIndex; // update data source for the row 

                            clsGlobal.showLoading();

                            d.TXT_EMPLOYEEID = txtValue;
                            objDat.XXSHP_KDS_M_APP_VER[0].XXSHP_KDS_M_APP_DTL[intRowIndex].TXT_EMPLOYEEID = txtValue;

                            d.TXT_EMPLOYEENAME = retDat.objData.EmpName;
                            objDat.XXSHP_KDS_M_APP_VER[0].XXSHP_KDS_M_APP_DTL[intRowIndex].TXT_EMPLOYEENAME = retDat.objData.EmpName;

                            this.invalidate(); // invalidate the data DataTables has cached for this row         
                            p_EnableControl(objDat.bitApply);
                        }

                        intRowIndex++;
                    });

                    p_SetHiddenObject(objDat);

                   
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
 
function p_txtDetailOrder_Changed(objCaller, intIndex) {
    
    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());
    for (i = 0; i < objData.XXSHP_KDS_M_APP_VER[0].XXSHP_KDS_M_APP_DTL.length; i++) {
        // Cari Index-nya.
        if (objData.XXSHP_KDS_M_APP_VER[0].XXSHP_KDS_M_APP_DTL[i].intIndex == intIndex) {
            // Ketemu, mulai dari sini:
            objData.XXSHP_KDS_M_APP_VER[0].XXSHP_KDS_M_APP_DTL[i].INT_ORDER = objCaller.value;
            break;
        }
    }
    p_SetHiddenObject(objData);
}

function p_txtDetailMinAmount_Changed(objCaller, intIndex) {
    
    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());
    for (i = 0; i < objData.XXSHP_KDS_M_APP_VER[0].XXSHP_KDS_M_APP_DTL.length; i++) {
        // Cari Index-nya.
        if (objData.XXSHP_KDS_M_APP_VER[0].XXSHP_KDS_M_APP_DTL[i].intIndex == intIndex) {
            // Ketemu, mulai dari sini:
            objData.XXSHP_KDS_M_APP_VER[0].XXSHP_KDS_M_APP_DTL[i].DEC_MIN = objCaller.value;
            break;
        }
    }
    p_SetHiddenObject(objData);
}

function p_txtDetailMaxAmount_Changed(objCaller, intIndex) {
    
    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());
    for (i = 0; i < objData.XXSHP_KDS_M_APP_VER[0].XXSHP_KDS_M_APP_DTL.length; i++) {
        // Cari Index-nya.
        if (objData.XXSHP_KDS_M_APP_VER[0].XXSHP_KDS_M_APP_DTL[i].intIndex == intIndex) {
            // Ketemu, mulai dari sini:
            objData.XXSHP_KDS_M_APP_VER[0].XXSHP_KDS_M_APP_DTL[i].DEC_MAX = objCaller.value;
            break;
        }
    }
    p_SetHiddenObject(objData);
}


function p_chkDetailTransaction_Changed(objCaller, intIndex) {
    
    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());
    for (i = 0; i < objData.XXSHP_KDS_M_APP_VER[0].XXSHP_KDS_M_APP_DTL.length; i++) {
        // Cari Index-nya.
        if (objData.XXSHP_KDS_M_APP_VER[0].XXSHP_KDS_M_APP_DTL[i].intIndex == intIndex) {
            // Ketemu, mulai dari sini:
            objData.XXSHP_KDS_M_APP_VER[0].XXSHP_KDS_M_APP_DTL[i].BIT_TRANSACTION = clsGlobal.ParseBooleanNETToOracle(objCaller.checked);
            break;
        }
    }
    p_SetHiddenObject(objData);
}

 
function p_btnDetailDelete_Click(objCaller, intIndex) {
    
    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());
    for (i = 0; i < objData.XXSHP_KDS_M_APP_VER[0].XXSHP_KDS_M_APP_DTL.length; i++) {
        // Cari Index-nya.
        if (objData.XXSHP_KDS_M_APP_VER[0].XXSHP_KDS_M_APP_DTL[i].intIndex == intIndex) {
            // Ketemu, mulai dari sini:
            // Remove from list.
            objData.XXSHP_KDS_M_APP_VER[0].XXSHP_KDS_M_APP_DTL.splice(i, 1);

            //var row = oTableDetail.row($(this).parents('tr'));
            //var rowNode = row.node();
            //row.remove().draw();
            oTableDetail.row(i).remove().draw(false);
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
        objDat.XXSHP_KDS_M_APP_VER[0].XXSHP_KDS_M_APP_DTL[intRowIndex].intIndex = d.intIndex;

        d.TXT_ACTIVITY = objDat.XXSHP_KDS_M_APP_VER[0].XXSHP_KDS_M_APP_DTL[intRowIndex].TXT_ACTIVITY;
        d.TXT_COA = objDat.XXSHP_KDS_M_APP_VER[0].XXSHP_KDS_M_APP_DTL[intRowIndex].TXT_COA;
        d.TXT_APP_JENIS = objDat.XXSHP_KDS_M_APP_VER[0].XXSHP_KDS_M_APP_DTL[intRowIndex].TXT_APP_JENIS;
        d.TXT_APP_TYPE = objDat.XXSHP_KDS_M_APP_VER[0].XXSHP_KDS_M_APP_DTL[intRowIndex].TXT_APP_TYPE;
        d.BIT_TRANSACTION = objDat.XXSHP_KDS_M_APP_VER[0].XXSHP_KDS_M_APP_DTL[intRowIndex].BIT_TRANSACTION;

        intRowIndex++;
        this.invalidate(); // invalidate the data DataTables has cached for this row         
    });

    // Draw once all updates are done
    oTableDetail.draw(false);
    p_SetHiddenObject(objDat);
}



// ====================================================
//  Activity
// ====================================================

function p_DataToUIActivity(XXSHP_KDS_M_APP_ACT) {
    
    oTableActivity.clear();
    for (var i = 0; i < XXSHP_KDS_M_APP_ACT.length; i++) {
        XXSHP_KDS_M_APP_ACT[i].intIndex = i;
        oTableActivity.row.add(XXSHP_KDS_M_APP_ACT[i]);
    }
    oTableActivity.draw(false);

    var objDat = p_GetHiddenObject();
    objDat.XXSHP_KDS_M_APP_VER[0].XXSHP_KDS_M_APP_ACT = XXSHP_KDS_M_APP_ACT;
    p_SetHiddenObject(objDat);
}

$('#btnAddActivity').on('click', function () {
    p_AddRowActivity();
});

function p_AddRowActivity() {
    
    clsGlobal.showLoading();
    $.ajax({
        type: "POST",
        url: "/Master/ApprovalHierarchy/AddRowActivity",
        data: { data: $("#txtHiddenObject").val(), __RequestVerificationToken: $('#frmApprovalHierarchy input[name=__RequestVerificationToken]').val() },
        datatype: "json",
        success: function (retDat) {

            if (retDat.bitSuccess == true) {
                if (retDat.objData != undefined) {
                    p_SetHiddenObject(retDat.objData);
                    p_DataToUIActivity(retDat.objData.XXSHP_KDS_M_APP_VER[0].XXSHP_KDS_M_APP_ACT);
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
    
    oTableActivity = $('#dtActivity').DataTable({
        "bPaginate": true,
        "bSort": false,
        searching: false,
        "aLengthMenu": [[5, 10, 25, 50, 75, 100], [5, 10, 25, 50, 75, 100]],
        "iDisplayLength": 5,
        "type": "POST",
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
                            '       <input type="text" class="form-control txtActivityCode" id="txtActivityCode" onchange="p_txtActivityCode_Changed(this,' + full.intIndex + ')"  value="' + full.TXT_CODE + '" disabled> ' +
                            '   </div>';
               }
           },
           {
               aTargets: [2],
               mRender: function (data, type, full) {
                   return '<div >  <input type="text" class="form-control txtActivityDesc" id="txtActivityDesc' + full.intIndex + '" value="' + full.TXT_DESC + '" disabled>  </div>';
               }
           }, 
            {
                aTargets: [3],
                mRender: function (data, type, full) {
                    return '<div > <input type="button" class="btn btn-warning" id="btnActivityDelete" class="btnActivityDelete" onclick="p_btnActivityDelete_Click(this,' + full.intIndex + ')"  value="Delete" >  </div>';
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
    var intSelectedIndex = p_GetSelectedActivityRow();
    var intRowIndex = 0;
    var objDat = p_GetHiddenObject();
    oTableActivity.rows().every(function (rowIdx, tableLoop, rowLoop) {
        
        var d = this.data();
        if (intRowIndex == intSelectedIndex) {
            d.intIndex = intRowIndex; // update data source for the row 

            d.TXT_CODE = txtValue; 
            objDat.XXSHP_KDS_M_APP_VER[0].XXSHP_KDS_M_APP_ACT[intRowIndex].TXT_CODE = txtValue;

            this.invalidate(); // invalidate the data DataTables has cached for this row         
            p_EnableControl(objDat.bitApply);
        }

        intRowIndex++;
    });

    p_SetHiddenObject(objDat);

}
 

function p_btnActivityDelete_Click(objCaller, intIndex) {
    
    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());
    for (i = 0; i < objData.XXSHP_KDS_M_APP_VER[0].XXSHP_KDS_M_APP_ACT.length; i++) {
        // Cari Index-nya.
        if (objData.XXSHP_KDS_M_APP_VER[0].XXSHP_KDS_M_APP_ACT[i].intIndex == intIndex) {
            // Ketemu, mulai dari sini:
            // Remove from list.
            objData.XXSHP_KDS_M_APP_VER[0].XXSHP_KDS_M_APP_ACT.splice(i, 1);

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
    
    var intRowIndex = 0;
    var objDat = p_GetHiddenObject();
    oTableActivity.rows().every(function (rowIdx, tableLoop, rowLoop) {
        
        var d = this.data();
        d.intIndex = intRowIndex; // update data source for the row
        objDat.XXSHP_KDS_M_APP_VER[0].XXSHP_KDS_M_APP_ACT[intRowIndex].intIndex = d.intIndex;

        d.TXT_CODE = objDat.XXSHP_KDS_M_APP_VER[0].XXSHP_KDS_M_APP_ACT[intRowIndex].TXT_CODE;
        d.TXT_DESC = objDat.XXSHP_KDS_M_APP_VER[0].XXSHP_KDS_M_APP_ACT[intRowIndex].TXT_DESC;
       
        intRowIndex++;
        this.invalidate(); // invalidate the data DataTables has cached for this row         
    });

    // Draw once all updates are done
    oTableActivity.draw(false);
    p_SetHiddenObject(objDat);
}




// ====================================================
//  Supplier
// ====================================================

function p_DataToUISupplier(XXSHP_KDS_M_APP_SUP) {
    
    oTableSupplier.clear();
    for (var i = 0; i < XXSHP_KDS_M_APP_SUP.length; i++) {
        XXSHP_KDS_M_APP_SUP[i].intIndex = i;
        oTableSupplier.row.add(XXSHP_KDS_M_APP_SUP[i]);
    }
    oTableSupplier.draw(false);

    var objDat = p_GetHiddenObject();
    objDat.XXSHP_KDS_M_APP_VER[0].XXSHP_KDS_M_APP_SUP = XXSHP_KDS_M_APP_SUP;
    p_SetHiddenObject(objDat);
}


$('#btnAddSupplier').on('click', function () {
    p_AddRowSupplier();
});

function p_AddRowSupplier() {
    
    clsGlobal.showLoading();
    $.ajax({
        type: "POST",
        url: "/Master/ApprovalHierarchy/AddRowSupplier",
        data: { data: $("#txtHiddenObject").val(), __RequestVerificationToken: $('#frmApprovalHierarchy input[name=__RequestVerificationToken]').val() },
        datatype: "json",
        success: function (retDat) {

            if (retDat.bitSuccess == true) {
                if (retDat.objData != undefined) {
                    p_SetHiddenObject(retDat.objData);
                    p_DataToUISupplier(retDat.objData.XXSHP_KDS_M_APP_VER[0].XXSHP_KDS_M_APP_SUP);
                    oTableSupplier.page('last').draw(false);
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

function p_InitiateSupplier() {
    // Format datatable  
    
    oTableSupplier = $('#dtSupplier').DataTable({
        "bPaginate": true,
        "bSort": false,
        searching: false,
        "aLengthMenu": [[5, 10, 25, 50, 75, 100], [5, 10, 25, 50, 75, 100]],
        "iDisplayLength": 5,
        "type": "POST",
        aoColumnDefs: [
            {
                aTargets: [0],
                mRender: function (data, type, full) {
                    return '<div id="lblSupplierNoValue"> ' + (full.intIndex + 1) + ' </div>';
                }
            },
           {
               aTargets: [1],
               mRender: function (data, type, full) {
                   return '     <div class="input-group"> ' +
                            '       <div class="input-group-btn"> ' +
                            '           <button type="button" class="btn btn-danger btnLOVSupplierID" id="btnLOVSupplierID" onclick="p_btnLOVSupplierID_Click(this,' + full.intIndex + ')"> <i class="fa fa-search"></i></button> ' +
                            '       </div> ' +
                            '       <input type="text" class="form-control txtSupplierID" id="txtSupplierID" onchange="p_txtSupplierID_Changed(this,' + full.intIndex + ')"  value="' + full.TXT_VENDOR_ID + '" disabled> ' +
                            '   </div>';
               }
           },
           {
               aTargets: [2],
               mRender: function (data, type, full) {
                   return '<div >  <input type="text" class="form-control txtSupplierCode" id="txtSupplierCode' + full.intIndex + '" value="' + full.TXT_VENDOR_CODE + '" disabled>  </div>';
               }
           },
            {
                aTargets: [3],
                mRender: function (data, type, full) {
                    return '<div > <input type="button" class="btn btn-warning" id="btnSupplierDelete" class="btnSupplierDelete" onclick="p_btnSupplierDelete_Click(this,' + full.intIndex + ')"  value="Delete" >  </div>';
                }
            }
        ]
    });

    $("#dtSupplier").css("width", "100%");
    $('#dtSupplier tbody').on('click', 'tr', function () {
        if (!$(this).hasClass('selected')) {
            oTableSupplier.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
        }
    });
}

function p_GetSelectedSupplierRow() {
    var intIndex = clsGlobal.parseToInteger(oTableSupplier.$('tr.selected').find("#lblSupplierNoValue").html()) - 1;
    return intIndex;
}

function p_btnLOVSupplierID_Click(objCaller, intIndex) {
    LOV = clsGlobal.generateLOV(MODULE_Supplier, "txtSupplierID");
}

function p_settxtSupplierID(txtValue) {
    var intSelectedIndex = p_GetSelectedSupplierRow();
    var intRowIndex = 0;
    var objDat = p_GetHiddenObject();
    oTableSupplier.rows().every(function (rowIdx, tableLoop, rowLoop) {
        
        var d = this.data();
        if (intRowIndex == intSelectedIndex) {
            d.intIndex = intRowIndex; // update data source for the row 

            d.TXT_VENDOR_ID = txtValue;
            objDat.XXSHP_KDS_M_APP_VER[0].XXSHP_KDS_M_APP_SUP[intRowIndex].TXT_VENDOR_ID = txtValue;

            this.invalidate(); // invalidate the data DataTables has cached for this row         
            p_EnableControl(objDat.bitApply);
        }

        intRowIndex++;
    });

    p_SetHiddenObject(objDat);

}


function p_btnSupplierDelete_Click(objCaller, intIndex) {
    
    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());
    for (i = 0; i < objData.XXSHP_KDS_M_APP_VER[0].XXSHP_KDS_M_APP_SUP.length; i++) {
        // Cari Index-nya.
        if (objData.XXSHP_KDS_M_APP_VER[0].XXSHP_KDS_M_APP_SUP[i].intIndex == intIndex) {
            // Ketemu, mulai dari sini:
            // Remove from list.
            objData.XXSHP_KDS_M_APP_VER[0].XXSHP_KDS_M_APP_SUP.splice(i, 1);

            //var row = oTableSupplier.row($(this).parents('tr'));
            //var rowNode = row.node();
            //row.remove().draw();
            oTableSupplier.row(i).remove().draw(false);
            break;
        }
    }
    p_SetHiddenObject(objData);
    p_RefreshNumberSupplier();
}

function p_RefreshNumberSupplier() {
    
    var intRowIndex = 0;
    var objDat = p_GetHiddenObject();
    oTableSupplier.rows().every(function (rowIdx, tableLoop, rowLoop) {
        
        var d = this.data();
        d.intIndex = intRowIndex; // update data source for the row
        objDat.XXSHP_KDS_M_APP_VER[0].XXSHP_KDS_M_APP_SUP[intRowIndex].intIndex = d.intIndex;

        d.TXT_VENDOR_ID = objDat.XXSHP_KDS_M_APP_VER[0].XXSHP_KDS_M_APP_SUP[intRowIndex].TXT_VENDOR_ID;
        d.TXT_VENDOR_CODE = objDat.XXSHP_KDS_M_APP_VER[0].XXSHP_KDS_M_APP_SUP[intRowIndex].TXT_VENDOR_CODE;

        intRowIndex++;
        this.invalidate(); // invalidate the data DataTables has cached for this row         
    });

    // Draw once all updates are done
    oTableSupplier.draw(false);
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


$('#btnLOVID').bind('click', function () {
    try {
        LOV = clsGlobal.generateLOV("APPROVAL HIERARCHY", "txtID"); //MODULE_APPROVALHIERARCHY
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
});


$('#btnLOVSupplierName').bind('click', function () {
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



//$("#btndtEffectiveFrom").on("changeDate", function (e) { 
//    $("#dtEffectiveFrom").val(clsGlobal.parseToDateTimeFromJSON(e.date, clsDateFormat));
//});

//$("#btndtEffectiveTo").on("changeDate", function (e) {
//    $("#dtEffectiveTo").val(clsGlobal.parseToDateTimeFromJSON(e.date, clsDateFormat));
//});



$('#dtEffectiveFrom').on('change', function () {
    
    var objData = JSON.parse($("#txtHiddenObject").val());
    if (this.value == "") {
        this.value = clsGlobal.parseToDateTimeFromJSON(objData.XXSHP_KDS_M_APP_VER[0].DTM_EFFECTIVE_FROM, clsDateFormat);
    }
    p_UIToData();
});

$('#dtEffectiveTo').on('change', function () {
    
    var objData = JSON.parse($("#txtHiddenObject").val());
    if (this.value == "") {
        this.value = clsGlobal.parseToDateTimeFromJSON(objData.XXSHP_KDS_M_APP_VER[0].DTM_EFFECTIVE_TO, clsDateFormat);
    }
    p_UIToData();
});