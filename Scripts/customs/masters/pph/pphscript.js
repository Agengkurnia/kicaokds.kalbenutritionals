//=======================
// VARIABLE GLOBAL
//=======================
var clsGlobal = new clsGlobalClass();
var LOV;
var bitLoading = false;
//var oTable;
var AP_AWT_GROUP_TAXES_ALLList = {};


//=======================
// Confirmation
//======================= 

//=======================
// ON PAGE LOAD
//=======================
$(document).ready(function () { 
    p_PopulateDataDropdownList();
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
}


function p_PopulateDataDropdownList() {
    // PPH
    clsGlobal.showLoading();
    
    $.ajax({
        type: "POST",
        url: "/Main/PopulateTipePPH",
        data: { __RequestVerificationToken: $('#frmRFA input[name=__RequestVerificationToken]').val() },
        datatype: "json",
        success: function (retDat) {
            if (retDat.bitSuccess == true) {
                
                if (retDat.objData != undefined) {
                    AP_AWT_GROUP_TAXES_ALLList = retDat.objData; 
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
        case "txtDetailActivity": 
            p_settxtDetailActivity(arr[1]);
            break;
        case "txtDetailCOA": 
            p_settxtDetailCOA(arr[1]);
            break;
        case "txtDetailJenisPPH": 
            p_settxtDetailJenisPPH(arr[1]);
            break;
        case "txtDetailTypePPH":
            
            p_settxtDetailTypePPH(arr[1]);
            break; 

    }
    clsGlobal.closeLOV();
}

function p_DataToUI(objData) {
    $("#txtID").val(clsGlobal.parseToInteger(objData.INT_PPH_HDR_ID));
    //$("#txtSupplierCode").val(clsGlobal.parseToString(objData.TXT_SUPPLIER_CODE));

    $("#txtSupplierID").val(clsGlobal.parseToString(objData.TXT_SUPPLIER_CODE));
    $("#txtSupplierName").val(clsGlobal.parseToString(objData.TXT_SUPPLIER_NAME));

    $("#txtSupplierSiteID").val(clsGlobal.parseToString(objData.TXT_SUPPLIER_SITE_CODE));
    $("#txtSupplierSiteName").val(clsGlobal.parseToString(objData.TXT_SUPPLIER_SITE_NAME));
     
    p_DataToUIDetail(objData.XXSHP_KDS_M_PPH_DTL);
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
    p_GenerateAutoNumeric()
}

function p_GenerateAutoNumeric() {
    
    $('.autonumeric').autoNumeric('init', { vMax: '9999999999999.99', vMin: '-9999999999999.99', aSep: ',', dGroup: '3', aDec: '.' });
}

function p_GetHiddenObject() {
    return JSON.parse($("#txtHiddenObject").val());
}

function p_DataToUIDetail(XXSHP_KDS_M_PPH_DTL) {
    
    oTable.clear();
    for (var i = 0; i < XXSHP_KDS_M_PPH_DTL.length; i++) {
        XXSHP_KDS_M_PPH_DTL[i].intIndex = i;
        oTable.row.add(XXSHP_KDS_M_PPH_DTL[i]);
    }
    oTable.draw(false);

    var objDat = p_GetHiddenObject();
    objDat.XXSHP_KDS_M_PPH_DTL = XXSHP_KDS_M_PPH_DTL;
    p_SetHiddenObject(objDat);
}

function p_initiateData() {
    clsGlobal.showLoading();
    $.ajax({
        type: "POST",
        url: "/Master/PPH/InitiateData",
        data: { __RequestVerificationToken: $('#frmPPH input[name=__RequestVerificationToken]').val() },
        datatype: "json",
        success: function (retDat) {

            if (retDat.bitSuccess == true) {
                if (retDat.objData != undefined) {
                    p_SetHiddenObject(retDat.objData);
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
    var id = $.getParameter("id");
    if (id != undefined) {
        $("#txtID").val(id);
        p_txtID_TextChanged();
    }
}

function p_UIToData() {
    var jsonObj = [];
    jsonData = p_GetHiddenObject();
    jsonData.INT_PPH_HDR_ID = clsGlobal.parseToInteger($("#txtID").val());
    jsonData.TXT_SUPPLIER_CODE = $("#txtSupplierID").val().toString();
    jsonData.TXT_SUPPLIER_NAME = $("#txtSupplierName").val().toString();
    jsonData.TXT_SUPPLIER_SITE_CODE = $("#txtSupplierSiteID").val().toString();
    jsonData.TXT_SUPPLIER_SITE_NAME = $("#txtSupplierSiteName").val().toString();

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
        url: "/Master/PPH/GetData",
        data: { txtID: $("#txtID").val(), __RequestVerificationToken: $('#frmPPH input[name=__RequestVerificationToken]').val() },
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
        data: { txtID: $("#txtSupplierID").val(), __RequestVerificationToken: $('#frmPPH input[name=__RequestVerificationToken]').val() },
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
        data: { txtID: $("#txtSupplierSiteID").val(), __RequestVerificationToken: $('#frmPPH input[name=__RequestVerificationToken]').val() },
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
        url: "/Master/PPH/SaveData",
        data: { data: $("#txtHiddenObject").val(), txtGUID: $("#txtGUID").val(), __RequestVerificationToken: $('#frmPPH input[name=__RequestVerificationToken]').val() },
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
        url: "/Master/PPH/DeleteData",
        data: { data: $("#txtHiddenObject").val(), txtGUID: $("#txtGUID").val(), __RequestVerificationToken: $('#frmPPH input[name=__RequestVerificationToken]').val() },
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


function p_AddRow() {
    
    clsGlobal.showLoading();
    $.ajax({
        type: "POST",
        url: "/Master/PPH/AddRow",
        data: { data: $("#txtHiddenObject").val(), __RequestVerificationToken: $('#frmPPH input[name=__RequestVerificationToken]').val() },
        datatype: "json",
        success: function (retDat) {

            if (retDat.bitSuccess == true) {
                if (retDat.objData != undefined) {
                    p_SetHiddenObject(retDat.objData);
                    p_DataToUIDetail(retDat.objData.XXSHP_KDS_M_PPH_DTL);
                    oTable.page('last').draw(false);
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
    
    oTable = $('#dtDetail').DataTable({
        "bPaginate": true,
        "bSort": false,
        searching: false,
        "scrollX": true,
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
                   return '     <div class="input-group"> ' +
                            '       <div class="input-group-btn"> ' +
                            '           <button type="button" class="btn btn-danger btnLOVDetailActivity" id="btnLOVDetailActivity" onclick="p_btnLOVDetailActivity_Click(this,' + full.intIndex + ')"> <i class="fa fa-search"></i></button> ' +
                            '       </div> ' +
                            '       <input type="text" class="form-control" id="txtDetailActivity" class="txtDetailActivity" style="width:300px" onchange="p_txtDetailActivity_Changed(this,' + full.intIndex + ')"  value="' + full.TXT_ACTIVITY + '" disabled> ' +
                            '   </div>';
               }
           },
           {
               aTargets: [2], 
               mRender: function (data, type, full) {
                   return '     <div class="input-group"> ' +
                           '       <div class="input-group-btn"> ' +
                           '           <button type="button" class="btn btn-danger btnLOVDetailCOA" id="btnLOVDetailCOA" onclick="p_btnLOVDetailCOA_Click(this,' + full.intIndex + ')"> <i class="fa fa-search"></i></button> ' +
                           '       </div> ' +
                           '       <input type="text" class="form-control" id="txtDetailCOA" class="txtDetailCOA" onchange="p_txtDetailCOA_Changed(this,' + full.intIndex + ')"  value="' + full.TXT_COA + '" disabled> ' +
                           '   </div>';
               }
           },
           {
               aTargets: [3],
               mRender: function (data, type, full) {
                   //return '     <div class="input-group"> ' +
                   //        '       <div class="input-group-btn"> ' +
                   //        '           <button type="button" class="btn btn-danger btnLOVDetailJenisPPH" id="btnLOVDetailJenisPPH" onclick="p_btnLOVDetailJenisPPH_Click(this,' + full.intIndex + ')"> <i class="fa fa-search"></i></button> ' +
                   //        '       </div> ' +
                   //        '       <input type="text" class="form-control" id="txtDetailJenisPPH" class="txtDetailJenisPPH" onchange="p_txtDetailJenisPPH_Changed(this,' + full.intIndex + ')"  value="' + full.TXT_PPH_JENIS + '" disabled> ' +
                   //        '   </div>';
                   var txtResult = "";
                   txtResult += "<select class='form-control' id='ddlPPH' onchange='p_ddlPPH_TextChanged(this," + full.intIndex + ")'>";
                   txtResult += "<option value=''>-</option>";
                   for (var i = 0; i < AP_AWT_GROUP_TAXES_ALLList.length; i++) {
                       if (AP_AWT_GROUP_TAXES_ALLList[i].GROUP_ID == full.INT_AWT_GROUP_ID) {
                           txtResult += "<option value='" + AP_AWT_GROUP_TAXES_ALLList[i].GROUP_ID + ";" + AP_AWT_GROUP_TAXES_ALLList[i].TAX_NAME + ";" + AP_AWT_GROUP_TAXES_ALLList[i].TAX_RATE + "' selected>" + AP_AWT_GROUP_TAXES_ALLList[i].TAX_NAME + "</option>";
                       } else {
                           txtResult += "<option value='" + AP_AWT_GROUP_TAXES_ALLList[i].GROUP_ID + ";" + AP_AWT_GROUP_TAXES_ALLList[i].TAX_NAME + ";" + AP_AWT_GROUP_TAXES_ALLList[i].TAX_RATE + "' >" + AP_AWT_GROUP_TAXES_ALLList[i].TAX_NAME + "</option>";
                       }
                   }
                   txtResult += "</select>";
                   return txtResult;
               }
           },
           //{
           //    aTargets: [4],
           //    mRender: function (data, type, full) {
           //        return '     <div class="input-group"> ' +
           //                '       <div class="input-group-btn"> ' +
           //                '           <button type="button" class="btn btn-danger btnLOVDetailTypePPH" id="btnLOVDetailTypePPH" onclick="p_btnLOVDetailTypePPH_Click(this,' + full.intIndex + ')"> <i class="fa fa-search"></i></button> ' +
           //                '       </div> ' +
           //                '       <input type="text" class="form-control" id="txtDetailTypePPH" class="txtDetailTypePPH" onchange="p_txtDetailTypePPH_Changed(this,' + full.intIndex + ')"  value="' + full.TXT_PPH_TYPE + '" disabled> ' +
           //                '   </div>';
           //    }
           //},
           {
               aTargets: [4],
               mRender: function (data, type, full) {
                   //return '<div >  <input type="text" class="form-control txtDetailAmount autonumeric text-right" id="txtDetailAmount' + full.intIndex + '" class="txtDetailAmount" onchange="p_txtDetailAmount_Changed(this,' + full.intIndex + ')"  value="' + full.DEC_AMOUNT + '" >  </div>';
                   return '<div >  <input type="text" class="form-control txtDetailAmount autonumeric text-right" id="txtDetailAmount' + full.intIndex + '" class="txtDetailAmount" onchange="p_txtDetailAmount_Changed(this,' + full.intIndex + ')"  value="' + full.DEC_AMOUNT + '" >  </div>';
               }
           },
            {
                aTargets: [5],
                mRender: function (data, type, full) {
                    return '<div > <input type="button" class="btn btn-warning" id="btnDetailDelete" class="btnDetailDelete" onclick="p_btnDetailDelete_Click(this,' + full.intIndex + ')"  value="Delete" >  </div>';
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
 
function p_btnLOVDetailActivity_Click(objCaller, intIndex) {
    LOV = clsGlobal.generateLOV(MODULE_ACTIVITY, "txtDetailActivity");
}

function p_settxtDetailActivity(txtValue) {
    var intSelectedIndex = p_GetSelectedDetailRow();
    var intRowIndex = 0;
    var objDat = p_GetHiddenObject();
    oTable.rows().every(function (rowIdx, tableLoop, rowLoop) {
        
        var d = this.data();
        if (intRowIndex == intSelectedIndex) {
            d.intIndex = intRowIndex; // update data source for the row 

            d.TXT_ACTIVITY = txtValue;

            objDat.XXSHP_KDS_M_PPH_DTL[intRowIndex].TXT_ACTIVITY = txtValue; 

            this.invalidate(); // invalidate the data DataTables has cached for this row         
            p_EnableControl(objDat.bitApply);
        }

        intRowIndex++;
    });

    p_SetHiddenObject(objDat);

}


function p_btnLOVDetailCOA_Click(objCaller, intIndex) {
    LOV = clsGlobal.generateLOV(MODULE_COA, "txtDetailCOA");
}

function p_settxtDetailCOA(txtValue) {
    var intSelectedIndex = p_GetSelectedDetailRow();
    var intRowIndex = 0;
    var objDat = p_GetHiddenObject();
    oTable.rows().every(function (rowIdx, tableLoop, rowLoop) {
        
        var d = this.data();
        if (intRowIndex == intSelectedIndex) {
            d.intIndex = intRowIndex; // update data source for the row 

            d.TXT_COA = txtValue;

            objDat.XXSHP_KDS_M_PPH_DTL[intRowIndex].TXT_COA = txtValue;

            this.invalidate(); // invalidate the data DataTables has cached for this row         
            p_EnableControl(objDat.bitApply);
        } 
        intRowIndex++;
    }); 
    p_SetHiddenObject(objDat); 
}


function p_btnLOVDetailJenisPPH_Click(objCaller, intIndex) {
    LOV = clsGlobal.generateLOV(MODULE_JENISPPH, "txtDetailJenisPPH");
}

function p_settxtDetailJenisPPH(txtValue) {
    var intSelectedIndex = p_GetSelectedDetailRow();
    var intRowIndex = 0;
    var objDat = p_GetHiddenObject();
    oTable.rows().every(function (rowIdx, tableLoop, rowLoop) {
        
        var d = this.data();
        if (intRowIndex == intSelectedIndex) {
            d.intIndex = intRowIndex; // update data source for the row 

            d.TXT_PPH_JENIS = txtValue;

            objDat.XXSHP_KDS_M_PPH_DTL[intRowIndex].TXT_PPH_JENIS = txtValue;

            this.invalidate(); // invalidate the data DataTables has cached for this row         
            p_EnableControl(objDat.bitApply);
        }
        intRowIndex++;
    });
    p_SetHiddenObject(objDat);
}

//function p_btnLOVDetailTypePPH_Click(objCaller, intIndex) {
//    LOV = clsGlobal.generateLOV(MODULE_TYPEPPH, "txtDetailTypePPH");
//}

//function p_settxtDetailTypePPH(txtValue) {
//    var intSelectedIndex = p_GetSelectedDetailRow();
//    var intRowIndex = 0;
//    var objDat = p_GetHiddenObject();
//    oTable.rows().every(function (rowIdx, tableLoop, rowLoop) {
//        
//        var d = this.data();
//        if (intRowIndex == intSelectedIndex) {
//            d.intIndex = intRowIndex; // update data source for the row 

//            d.TXT_PPH_TYPE = txtValue; 
//            objDat.XXSHP_KCO_M_PPH_DTL[intRowIndex].TXT_PPH_TYPE = txtValue;

//            this.invalidate(); // invalidate the data DataTables has cached for this row         
//            p_EnableControl(objDat.bitApply);
//        }
//        intRowIndex++;
//    });
//    p_SetHiddenObject(objDat);
//}


function p_ddlPPH_TextChanged(objCaller, intIndex) {
    
    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());
    for (i = 0; i < objData.XXSHP_KDS_M_PPH_DTL.length; i++) {
        // Cari Index-nya.
        if (objData.XXSHP_KDS_M_PPH_DTL[i].intIndex == intIndex) {
            // Ketemu, mulai dari sini:
            var resultPPHSplit = clsGlobal.parseToString(objCaller.value).split(';');
            if (resultPPHSplit.length == 3) {
                var decPercent = clsGlobal.parseToDecimal(resultPPHSplit[2]);  
                objData.XXSHP_KDS_M_PPH_DTL[i].DEC_AMOUNT = decPercent;
                objData.XXSHP_KDS_M_PPH_DTL[i].INT_AWT_GROUP_ID = clsGlobal.parseToDecimal(resultPPHSplit[0]);
                objData.XXSHP_KDS_M_PPH_DTL[i].TXT_AWT_TAX_NAME = clsGlobal.parseToString(resultPPHSplit[1]); 
                objData.XXSHP_KDS_M_PPH_DTL[i].TXT_PPH_JENIS = clsGlobal.parseToString(resultPPHSplit[1]);
           }
            break;
        }
    }
    p_SetHiddenObject(objData);
    p_RefreshDataRow();
}


function p_RefreshDataRow() {
    
    var intSelectedIndex = p_GetSelectedDetailRow();
    var intRowIndex = 0;
    var objDat = p_GetHiddenObject();
    oTable.rows().every(function (rowIdx, tableLoop, rowLoop) {
        
        var d = this.data();
        if (intRowIndex == intSelectedIndex) {
            d.intIndex = intRowIndex; // update data source for the row
            objDat.XXSHP_KDS_M_PPH_DTL[intSelectedIndex].intIndex = d.intIndex;

            d.DEC_AMOUNT = objDat.XXSHP_KDS_M_PPH_DTL[intSelectedIndex].DEC_AMOUNT;
            d.INT_AWT_GROUP_ID = objDat.XXSHP_KDS_M_PPH_DTL[intSelectedIndex].INT_AWT_GROUP_ID;
            d.TXT_AWT_TAX_NAME = objDat.XXSHP_KDS_M_PPH_DTL[intSelectedIndex].TXT_AWT_TAX_NAME; 
            d.TXT_COA = objDat.XXSHP_KDS_M_PPH_DTL[intSelectedIndex].TXT_COA;
            d.TXT_ACTIVITY = objDat.XXSHP_KDS_M_PPH_DTL[intSelectedIndex].TXT_ACTIVITY;
            d.TXT_PPH_JENIS = objDat.XXSHP_KDS_M_PPH_DTL[intSelectedIndex].TXT_PPH_JENIS;

            this.invalidate(); // invalidate the data DataTables has cached for this row         
        }
        intRowIndex++;

    });

    //AutoNumeric.
    p_GenerateAutoNumeric(); 
}

function p_txtDetailAmount_Changed(objCaller, intIndex) {
    
    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());
    for (i = 0; i < objData.XXSHP_KDS_M_PPH_DTL.length; i++) {
        // Cari Index-nya.
        if (objData.XXSHP_KDS_M_PPH_DTL[i].intIndex == intIndex) {
            // Ketemu, mulai dari sini:
            objData.XXSHP_KDS_M_PPH_DTL[i].DEC_AMOUNT = objCaller.value;
            break;
        }
    }
    p_SetHiddenObject(objData);
}


function p_btnDetailDelete_Click(objCaller, intIndex) {
    
    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());
    for (i = 0; i < objData.XXSHP_KDS_M_PPH_DTL.length; i++) {
        // Cari Index-nya.
        if (objData.XXSHP_KDS_M_PPH_DTL[i].intIndex == intIndex) {
            // Ketemu, mulai dari sini:
            // Remove from list.
            objData.XXSHP_KDS_M_PPH_DTL.splice(i, 1);

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
    
    var intRowIndex = 0;
    var objDat = p_GetHiddenObject();
    oTable.rows().every(function (rowIdx, tableLoop, rowLoop) {
        
        var d = this.data();
        d.intIndex = intRowIndex; // update data source for the row
        objDat.XXSHP_KDS_M_PPH_DTL[intRowIndex].intIndex = d.intIndex;

        d.TXT_ACTIVITY = objDat.XXSHP_KDS_M_PPH_DTL[intRowIndex].TXT_ACTIVITY;
        d.TXT_COA = objDat.XXSHP_KDS_M_PPH_DTL[intRowIndex].TXT_COA;
        d.TXT_PPH_JENIS = objDat.XXSHP_KDS_M_PPH_DTL[intRowIndex].TXT_PPH_JENIS;
        d.TXT_PPH_TYPE = objDat.XXSHP_KDS_M_PPH_DTL[intRowIndex].TXT_PPH_TYPE;

        intRowIndex++;
        this.invalidate(); // invalidate the data DataTables has cached for this row         
    });

    // Draw once all updates are done
    oTable.draw(false);
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
        LOV = clsGlobal.generateLOV(MODULE_PPH, "txtID");
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
});


$('#btnLOVSupplierName').bind('click', function () {
    try {
        LOV = clsGlobal.generateLOV(LOV_XXSHP_VENDOR_SITE_ALL_MTR_V, "txtSupplierID");
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
});

$('#btnLOVSupplierSite').bind('click', function () {
    try {
        LOV = clsGlobal.generateLOV(LOV_XXSHP_VENDOR_SITE_ALL_MTR_V_VENDOR_SITE_ID, "txtSupplierSiteID", $("#txtSupplierID").val());
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

        p_AddRow();
});

