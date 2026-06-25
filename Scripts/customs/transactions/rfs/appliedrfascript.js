//=======================
// VARIABLE GLOBAL
//=======================
var clsGlobal = new clsGlobalClass();
var LOV;
var bitLoading = false; 
var oTableOutstanding;
var oTableApplied;

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
    p_InitiateApplied();
    p_InitiateOutstanding();
    p_initiateData();
}

function p_validatePage() {
    //
}

function p_showPrevData() {

}

function p_showBlank() {
    p_initiateData();
}

//function setChooseLOV(txtValue) {
//    var arr = txtValue.split('|');
//    switch (arr[0]) {  
//        case "btnCOA":
//            p_setbtnCOA(arr[1], arr[2], arr[3]);
//            break;
//    }
//    clsGlobal.closeLOV();
//}
  
function p_DataToUI(objData) {
    //

    $("#txtSupplierID").val(clsGlobal.parseToString(objData.TXT_SUPPLIER_ID));
    $("#txtSupplierName").val(clsGlobal.parseToString(objData.TXT_SUPPLIER_NAME));
    $("#txtSupplierSiteID").val(clsGlobal.parseToString(objData.TXT_SUPPLIER_SITE_CODE));
    $("#txtSupplierSiteName").val(clsGlobal.parseToString(objData.TXT_SUPPLIER_SITE_NAME));

    p_DataToUIOutstanding(objData.XXSHP_KDS_T_RFS_OUTSTANDING);
    p_DataToUIApplied(objData.XXSHP_KDS_T_RFS_MAT);

    p_EnableControl(clsGlobal.ParseBooleanOracleToNET(objData.BIT_APPLY));

    p_SetHiddenObject(objData);
    if ($("#txtID").val() == "" || $("#txtID").val() == "0") {
        $("#btnDelete").hide();
    } else {
        $("#btnDelete").show();
    }
}

function p_EnableControl(bitApply) {
    //
    if (bitApply == true) {
        $("#btnOK").hide();
        $("#btnCancel").hide();

        $("#btnAddSubbrand").hide();
        $(".txtAmount").each(function (index) {
            $(this).attr("disabled", "true");
        });
        $(".btnLOVSubBrand").each(function (index) {
            $(this).hide();
        });
        $(".btnSubbrandDelete").each(function (index) {
            $(this).hide();
        });


    } else {
        $("#btnOK").show();
        $("#btnCancel").show();

        $("#btnAddSubbrand").show(); //.removeClass("display");
        $(".txtAmount").each(function (index) {
            $(this).removeAttr("disabled");
        });
        $(".btnLOVSubBrand").each(function (index) {
            $(this).show();
        });
        $(".btnSubbrandDelete").each(function (index) {
            $(this).show();
        });

    }
}

function p_SetHiddenObject(objDat) {
    $("#txtHiddenObject").val(JSON.stringify(objDat));

    clsGlobal.GenerateAutoNumeric();
    clsGlobal.GenerateDateTimePicker();
}

function p_GetHiddenObject() {
    return JSON.parse($("#txtHiddenObject").val());
}

function p_initiateData() {
    //
    clsGlobal.showLoading();

    p_Search();

    $("#txtHiddenObject").val(parent.$("#txtHiddenObject").val());
    var jsonData = p_GetHiddenObject();
    p_DataToUI(jsonData);
    clsGlobal.hideLoading();
}

function p_UIToData() {
    var jsonObj = [];
    jsonData = p_GetHiddenObject();

    p_SetHiddenObject(jsonData);
    return $("#txtHiddenObject").val();
}

function p_saveData() {

}

function p_GenerateAutoNumeric() {
    //
    $('.autonumeric').autoNumeric('init', { vMax: '9999999999999', vMin: '-9999999999999', aSep: ',', dGroup: '3', aDec: '.' });
}
 
function p_GenerateDateTimePicker() {
    //
    $('.kalendertarget').datepicker({
        autoclose: true,
    });

}

function p_Search() {
    clsGlobal.showLoading();
    $.ajax({
        type: "POST",
        url: "/Transaction/RFS/SearchAppliedRFA",
        data: { intSupplierID: parent.$("#txtSupplierID").val(), intSupplierSiteID: parent.$("#txtSupplierSiteID").val(), __RequestVerificationToken: $('#frmRFS input[name=__RequestVerificationToken]').val() },
        datatype: "json",
        success: function (retDat) {
            
            if (retDat.bitSuccess == true) {
                if (retDat.objData != undefined) {
                    var objData = JSON.parse(p_UIToData());
                    objData.XXSHP_KDS_T_RFS_OUTSTANDING = retDat.objData;
                    p_DataToUIOutstanding(objData.XXSHP_KDS_T_RFS_OUTSTANDING);
                    p_SetHiddenObject(objData);
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
 
// ==========================
// Outstanding  
// ==========================

function p_GetSelectedOutstandingRow() {
    var intIndex = clsGlobal.parseToInteger(oTableOutstanding.$('tr.selected').find("#lblOutstandingNoValue").html()) - 1;
    return intIndex;
}

function p_InitiateOutstanding() {
    // Format datatable  
    //
    oTableOutstanding = $('#dtOutstanding').DataTable({
        "bPaginate": true,
        "bSort": false,
        searching: false,
        "type": "POST",
        "scrollX": true,
        aoColumnDefs: [
            {
                aTargets: [0],
                mRender: function (data, type, full) {
                    return '<div > <input type="button" class="btn btn-warning btnOutstandingChoose" id="btnOutstandingChoose" onclick="p_btnOutstandingChoose_Click(this,' + full.intIndex + ')"  value="Choose" >  </div>';
                }
            },
              { 
                  aTargets: [1],
                  mRender: function (data, type, full) {
                      return '<div id="lblOutstandingNoValue" > ' + (full.intIndex + 1) + ' </div>';
                  }
              },
           {
               aTargets: [2],
               mRender: function (data, type, full) {
                   return '<div id="lblOutstandingRFAOracleNo" > ' + full.TXT_RFA_ORACLE_NO + ' </div>';
               }
           },
           {
               aTargets: [3],
               mRender: function (data, type, full) {
                   return '<div >  <input type="text" class="form-control txtOutstandingRFAAppliedAmount text-right autonumeric" style="width:100%;"  id="txtOutstandingRFAAppliedAmount" onchange="p_txtOutstandingRFAAppliedAmount_Changed(this,' + full.intIndex + ')"  value="' + clsGlobal.FormatMoney(full.DEC_APPLIED_AMOUNT,0) + '" >  </div>';
               }
           },
           {
               aTargets: [4],
               width: "200px",
               mRender: function (data, type, full) {
                   return '<div id="lblOutstandingRFAOutstandingAmount" class="text-right" > ' + clsGlobal.FormatMoney(full.DEC_OUTSTANDING_AMOUNT, 0) + ' </div>';
               }
           },
           {
               aTargets: [5],
               width: "200px",
               mRender: function (data, type, full) {
                   return '<div id="lblOutstandingRFAAmount" class="text-right" > ' + clsGlobal.FormatMoney(full.DEC_RFA_AMOUNT, 0) + ' </div>';
               }
           } 
        ]
    });

    $("#dtOutstanding").css("width", "100%");
    $('#dtOutstanding tbody').on('click', 'tr', function () {
        if (!$(this).hasClass('selected')) {
            oTableOutstanding.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
        }
    });

}

function p_ShowBlankOutstanding() {
    oTableOutstanding.clear();
    oTableOutstanding.draw(false);
}

function p_GetSelectedOutstandingRow() {
    var intIndex = clsGlobal.parseToInteger(oTableOutstanding.$('tr.selected').find("#lblOutstandingNoValue").html()) - 1;
    return intIndex;
}
 
function p_DataToUIOutstanding(XXSHP_KDS_T_RFS_OUTSTANDING) {
    //

    if (XXSHP_KDS_T_RFS_OUTSTANDING != null) {
        oTableOutstanding.clear();
        for (var i = 0; i < XXSHP_KDS_T_RFS_OUTSTANDING.length; i++) {
            XXSHP_KDS_T_RFS_OUTSTANDING[i].intIndex = i;
            oTableOutstanding.row.add(XXSHP_KDS_T_RFS_OUTSTANDING[i]);
        }
        oTableOutstanding.draw(false);

        var objDat = p_GetHiddenObject();
        objDat.XXSHP_KDS_T_RFS_OUTSTANDING = XXSHP_KDS_T_RFS_OUTSTANDING;
        p_SetHiddenObject(objDat);
    }
}

function p_RefreshNumberOutstanding() {
    //
    var intRowIndex = 0;
    var objDat = p_GetHiddenObject();
    oTableOutstanding.rows().every(function (rowIdx, tableLoop, rowLoop) {
        
        var d = this.data();
        d.intIndex = intRowIndex; // update data source for the row
        objDat.XXSHP_KDS_T_RFS_OUTSTANDING[intRowIndex].intIndex = d.intIndex;

        d.TXT_RFA_ORACLE_NO = objDat.XXSHP_KDS_T_RFS_OUTSTANDING[intRowIndex].TXT_RFA_ORACLE_NO;
        d.DEC_RFA_AMOUNT = objDat.XXSHP_KDS_T_RFS_OUTSTANDING[intRowIndex].DEC_RFA_AMOUNT;
        d.DEC_APPLIED_AMOUNT = objDat.XXSHP_KDS_T_RFS_OUTSTANDING[intRowIndex].DEC_APPLIED_AMOUNT;
        d.DEC_OUTSTANDING_AMOUNT = objDat.XXSHP_KDS_T_RFS_OUTSTANDING[intRowIndex].DEC_OUTSTANDING_AMOUNT;

        intRowIndex++;
        this.invalidate(); // invalidate the data DataTables has cached for this row         
    });

    // Draw once all updates are done
    oTableOutstanding.draw(false);
    p_SetHiddenObject(objDat);
}
 
function p_RefreshDataRow() {
    //
    var intSelectedIndex = p_GetSelectedOutstandingRow();
    var intRowIndex = 0;
    var objDat = p_GetHiddenObject();
    oTableOutstanding.rows().every(function (rowIdx, tableLoop, rowLoop) {
        
        var d = this.data();
        if (intRowIndex == intSelectedIndex) {
            d.intIndex = intRowIndex; // update data source for the row
            objDat.XXSHP_KDS_T_RFS_OUTSTANDING[intRowIndex].intIndex = d.intIndex;

            d.TXT_RFA_ORACLE_NO = objDat.XXSHP_KDS_T_RFS_OUTSTANDING[intRowIndex].TXT_RFA_ORACLE_NO;
            d.DEC_RFA_AMOUNT = objDat.XXSHP_KDS_T_RFS_OUTSTANDING[intRowIndex].DEC_RFA_AMOUNT;
            d.DEC_APPLIED_AMOUNT = objDat.XXSHP_KDS_T_RFS_OUTSTANDING[intRowIndex].DEC_APPLIED_AMOUNT;
            d.DEC_OUTSTANDING_AMOUNT = objDat.XXSHP_KDS_T_RFS_OUTSTANDING[intRowIndex].DEC_OUTSTANDING_AMOUNT;

            intRowIndex++;
            this.invalidate(); // invalidate the data DataTables has cached for this row         
        }
        
    });

    //AutoNumeric.
    p_GenerateAutoNumeric();
    p_GenerateDateTimePicker();
}
 
function p_txtOutstandingRFAAppliedAmount_Changed(objCaller, intIndex) {
    //
    if (objCaller.value == "") {
        objCaller.value = "0"
    }
    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());
    for (i = 0; i < objData.XXSHP_KDS_T_RFS_OUTSTANDING.length; i++) {
        // Cari Index-nya.
        if (objData.XXSHP_KDS_T_RFS_OUTSTANDING[i].intIndex == intIndex) {
            // Ketemu, mulai dari sini:
            objData.XXSHP_KDS_T_RFS_OUTSTANDING[i].DEC_APPLIED_AMOUNT = clsGlobal.parseToDecimal(objCaller.value);
            break;
        }
    }
    p_SetHiddenObject(objData);
}
  
function p_btnOutstandingChoose_Click(objCaller, intIndex) {
    //
    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());
    for (i = 0; i < objData.XXSHP_KDS_T_RFS_OUTSTANDING.length; i++) {
        // Cari Index-nya.
        if (objData.XXSHP_KDS_T_RFS_OUTSTANDING[i].intIndex == intIndex) {
            // Ketemu, mulai dari sini:
            // Remove from list.
            if (objData.XXSHP_KDS_T_RFS_OUTSTANDING[i].DEC_APPLIED_AMOUNT > objData.XXSHP_KDS_T_RFS_OUTSTANDING[i].DEC_OUTSTANDING_AMOUNT) {
                clsGlobal.showAlert("Nilai Applied tidak bisa lebih dari Nilai Outstanding!");
            }
            else {
                clsGlobal.showLoading();
                $.ajax({
                    type: "POST",
                    url: "/Transaction/RFS/AddToAppliedSummary",
                    data: {
                        data: $("#txtHiddenObject").val(),
                        TXT_RFA_ORACLE_NO: objData.XXSHP_KDS_T_RFS_OUTSTANDING[i].TXT_RFA_ORACLE_NO,
                        DEC_RFA_AMOUNT: objData.XXSHP_KDS_T_RFS_OUTSTANDING[i].DEC_RFA_AMOUNT,
                        DEC_APPLIED_AMOUNT: objData.XXSHP_KDS_T_RFS_OUTSTANDING[i].DEC_APPLIED_AMOUNT,
                        DEC_OUTSTANDING_AMOUNT: objData.XXSHP_KDS_T_RFS_OUTSTANDING[i].DEC_OUTSTANDING_AMOUNT,
                        __RequestVerificationToken: $('#frmRFS input[name=__RequestVerificationToken]').val()
                    },
                    datatype: "json",
                    success: function (retDat) {
                        
                        if (retDat.bitSuccess == true) {
                            if (retDat.objData != undefined) {
                                var objData = JSON.parse(p_UIToData());
                                objData.XXSHP_KDS_T_RFS_MAT = retDat.objData.XXSHP_KDS_T_RFS_MAT;
                                p_DataToUIApplied(objData.XXSHP_KDS_T_RFS_MAT);
                            } else {
                                p_showBlank();
                            }
                            $("#txtGUID").val(retDat.txtGUID);

                            objData.XXSHP_KDS_T_RFS_OUTSTANDING.splice(i, 1);
                            oTableOutstanding.row(i).remove().draw(false);
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

            break;
        }
    }
    p_SetHiddenObject(objData);
    p_RefreshNumberOutstanding();
}
 

// ==========================
// END: Outstanding   
// ==========================



// ====================================================
//  APPLIED
// ====================================================

function p_DataToUIApplied(XXSHP_KDS_T_RFS_MAT) {
    //
    oTableApplied.clear();
    for (var i = 0; i < XXSHP_KDS_T_RFS_MAT.length; i++) {
        XXSHP_KDS_T_RFS_MAT[i].intIndex = i;
        oTableApplied.row.add(XXSHP_KDS_T_RFS_MAT[i]);
    }
    oTableApplied.draw(false);

    var objDat = p_GetHiddenObject();
    objDat.XXSHP_KDS_T_RFS_MAT = XXSHP_KDS_T_RFS_MAT;

    p_SetHiddenObject(objDat);
}
 
function p_InitiateApplied() {
    // Format datatable  
    //
    oTableApplied = $('#dtApplied').DataTable({
        "bPaginate": true,
        "bSort": false,
        searching: false,
        "iDisplayLength": 10,
        "type": "POST",
        "scrollX": true,
        aoColumnDefs: [
            {
                aTargets: [0],
                mRender: function (data, type, full) {
                    return '<div > <input type="button" class="btn btn-warning btnAppliedDelete" id="btnAppliedDelete" onclick="p_btnAppliedDelete_Click(this,' + full.intIndex + ')"  value="Delete" >  </div>';
                }
            }, {
                aTargets: [1],
                mRender: function (data, type, full) {
                    return '<div id="lblAppliedNoValue"> ' + (full.intIndex + 1) + ' </div>';
                }
            },
           {
               aTargets: [2],
               mRender: function (data, type, full) {
                   return '<div id="lblAppliedRFAOracleNo"> ' +  full.TXT_RFA_ORACLE_NO + ' </div>';
               }
           },
           {
               aTargets: [3],
               mRender: function (data, type, full) {
                   return '<div >  <input type="text" class="form-control txtRFAAppliedAmount text-right autonumeric"  id="txtRFAAppliedAmount" onchange="p_txtRFAAppliedAmount_Changed(this,' + full.intIndex + ')"  value="' + clsGlobal.FormatMoney(full.DEC_APPLIED_AMOUNT,0) + '">  </div>';
               }
           },
            {
                aTargets: [4],
                mRender: function (data, type, full) {
                    return '<div id="lblAppliedRFAAfterAmount" class="text-right"> ' + clsGlobal.FormatMoney(full.DEC_AFTER_APPLIED_AMOUNT,0) + ' </div>';
                }
            } 
        ]
    });

    $("#dtApplied").css("width", "100%");
    $('#dtApplied tbody').on('click', 'tr', function () {
        if (!$(this).hasClass('selected')) {
            oTableApplied.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
        }
    });
}

function p_txtRFAAppliedAmount_Changed(objCaller, intIndex) {
    //
    if (objCaller.value == "") {
        objCaller.value = "0"
    }
    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());
    for (i = 0; i < objData.XXSHP_KDS_T_RFS_MAT.length; i++) {
        // Cari Index-nya.
        if (objData.XXSHP_KDS_T_RFS_MAT[i].intIndex == intIndex) {
            // Ketemu, mulai dari sini:
            objData.XXSHP_KDS_T_RFS_MAT[i].DEC_APPLIED_AMOUNT = clsGlobal.parseToDecimal(objCaller.value);

            break;
        }
    }

    p_SetHiddenObject(objData);
}
  
function p_GetSelectedAppliedRow() {
    var intIndex = clsGlobal.parseToInteger(oTableApplied.$('tr.selected').find("#lblAppliedNoValue").html()) - 1;
    return intIndex;
}

function p_RefreshDataRow() {
    var intSelectedIndex = p_GetSelectedAppliedRow();
    var intRowIndex = 0;
    var objDat = p_GetHiddenObject();
    oTableApplied.rows().every(function (rowIdx, tableLoop, rowLoop) {
        //
        var d = this.data();
        if (intRowIndex == intSelectedIndex) {
            p_RefreshSelectedRow(intRowIndex);

            d.intIndex = intRowIndex; // update data source for the row 

            d.INT_RFS_MAT_ID = objDat.XXSHP_KDS_T_RFS_MAT[intRowIndex].INT_RFS_MAT_ID;
            d.INT_RFS_HDR_ID = objDat.XXSHP_KDS_T_RFS_MAT[intRowIndex].INT_RFS_HDR_ID;
            d.TXT_RFA_ORACLE_NO = objDat.XXSHP_KDS_T_RFS_MAT[intRowIndex].TXT_RFA_ORACLE_NO;
            d.DEC_RFA_AMOUNT = objDat.XXSHP_KDS_T_RFS_MAT[intRowIndex].DEC_RFA_AMOUNT;
            d.DEC_APPLIED_AMOUNT = objDat.XXSHP_KDS_T_RFS_MAT[intRowIndex].DEC_APPLIED_AMOUNT;
            d.DEC_AFTER_APPLIED_AMOUNT = objDat.XXSHP_KDS_T_RFS_MAT[intRowIndex].DEC_AFTER_APPLIED_AMOUNT;
            
            //this.invalidate(); // invalidate the data DataTables has cached for this row   
        }

        intRowIndex++;
    });

    //AutoNumeric.
    p_GenerateAutoNumeric();
    p_GenerateDateTimePicker();
}

function p_RefreshSelectedRow(intSelectedIndex) {
    var intRowIndex = 0;
    var objDat = p_GetHiddenObject();
    oTableApplied.rows().every(function (rowIdx, tableLoop, rowLoop) {
        //
        var d = this.data();
        if (intRowIndex == intSelectedIndex) {
            d.intIndex = intRowIndex; // update data source for the row 

            d.INT_RFS_MAT_ID = objDat.XXSHP_KDS_T_RFS_MAT[intRowIndex].INT_RFS_MAT_ID;
            d.INT_RFS_HDR_ID = objDat.XXSHP_KDS_T_RFS_MAT[intRowIndex].INT_RFS_HDR_ID;
            d.TXT_RFA_ORACLE_NO = objDat.XXSHP_KDS_T_RFS_MAT[intRowIndex].TXT_RFA_ORACLE_NO;
            d.DEC_RFA_AMOUNT = objDat.XXSHP_KDS_T_RFS_MAT[intRowIndex].DEC_RFA_AMOUNT;
            d.DEC_APPLIED_AMOUNT = objDat.XXSHP_KDS_T_RFS_MAT[intRowIndex].DEC_APPLIED_AMOUNT;
            d.DEC_AFTER_APPLIED_AMOUNT = objDat.XXSHP_KDS_T_RFS_MAT[intRowIndex].DEC_AFTER_APPLIED_AMOUNT;

            this.invalidate(); // invalidate the data DataTables has cached for this row   
        }

        intRowIndex++;
    });

    //AutoNumeric.
    p_GenerateAutoNumeric();
    p_GenerateDateTimePicker();
}


function p_btnAppliedDelete_Click(objCaller, intIndex) {
    //
    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());
    for (i = 0; i < objData.XXSHP_KDS_T_RFS_MAT.length; i++) {
        // Cari Index-nya.
        if (objData.XXSHP_KDS_T_RFS_MAT[i].intIndex == intIndex) {
            // Ketemu, mulai dari sini:
            // Remove from list.
            objData.XXSHP_KDS_T_RFS_MAT.splice(i, 1);
            oTableApplied.row(i).remove().draw(false);

            var objDat = p_GetHiddenObject();
            break;
        }
    }
    p_SetHiddenObject(objData);
    p_RefreshNumberApplied();
}

function p_RefreshNumberApplied() {
    //
    var intRowIndex = 0;
    var objDat = p_GetHiddenObject();
    oTableApplied.rows().every(function (rowIdx, tableLoop, rowLoop) {
        
        var d = this.data();
        d.intIndex = intRowIndex; // update data source for the row
        objDat.XXSHP_KDS_T_RFS_MAT[intRowIndex].intIndex = d.intIndex;

        d.INT_RFS_MAT_ID = objDat.XXSHP_KDS_T_RFS_MAT[intRowIndex].INT_RFS_MAT_ID;
        d.INT_RFS_HDR_ID = objDat.XXSHP_KDS_T_RFS_MAT[intRowIndex].INT_RFS_HDR_ID;
        d.TXT_RFA_ORACLE_NO = objDat.XXSHP_KDS_T_RFS_MAT[intRowIndex].TXT_RFA_ORACLE_NO;
        d.DEC_RFA_AMOUNT = objDat.XXSHP_KDS_T_RFS_MAT[intRowIndex].DEC_RFA_AMOUNT;
        d.DEC_APPLIED_AMOUNT = objDat.XXSHP_KDS_T_RFS_MAT[intRowIndex].DEC_APPLIED_AMOUNT;
        d.DEC_AFTER_APPLIED_AMOUNT = objDat.XXSHP_KDS_T_RFS_MAT[intRowIndex].DEC_AFTER_APPLIED_AMOUNT;

        intRowIndex++;
        this.invalidate(); // invalidate the data DataTables has cached for this row         
    });

    // Draw once all updates are done
    oTableApplied.draw(false);
    p_SetHiddenObject(objDat);
    //p_RefreshDataRow();
}

//=======================
// END APPLIED
//=======================



//=======================
// HANDLER
//=======================

$('#btnOK').bind('click', function () {
    try {
        //
        parent.$("#txtHiddenObject").val($("#txtHiddenObject").val());
        parent.clsGlobal.closePopUpIframe();
        //parent.p_setItem();
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
});

$('#btnSearch').bind('click', function () {
    try {
        p_Search();
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
});

$('#btnCancel').bind('click', function () {
    try {
        
        parent.clsGlobal.closePopUpIframe();
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
});




