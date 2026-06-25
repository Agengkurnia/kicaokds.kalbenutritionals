//     KKP SCRIPT - Supplier
//
//
//      History.
//
//      18-May-2018                    Initial version.            (nosa)
//



//=======================
// VARIABLE GLOBAL
//=======================
var clsGlobal = new clsGlobalClass(); 
var LOV;
var bitLoading = false;
var intSupplierDtlIndex;
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
});

//=======================
// FUNCTION
//=======================
function p_InitForm() {
    //debugger
    XXSHP_KDS_M_USER_SUP_SITE = {};
    intSupplierDtlIndex = $.getParameter("intIndex");
    p_InitiateSupplier();  
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

function setChooseLOV(txtValue) { 
    var arr = txtValue.split('|'); 
    switch (arr[0]) {
        case "txtSupplier":  
            p_settxtSupplier(arr[1],arr[2]);
            break;   
    }
    clsGlobal.closeLOV(); 
}

function p_DataToUI(objDat) {
    //
    p_DataToUISupplier(objDat.XXSHP_KDS_M_USER_SUP_DTL[intSupplierDtlIndex].XXSHP_KDS_M_USER_SUP_SITE);
     
    p_EnableControl(clsGlobal.ParseBooleanOracleToNET(objDat.BIT_APPLY), objDat);
     
    p_SetHiddenObject(objDat);
    if ($("#txtID").val() == "" || $("#txtID").val() == "0") {
        $("#btnDelete").hide();
    } else {
        $("#btnDelete").show();
    }
}

function p_EnableControl(bitApply, objDat) {
    //
    if (bitApply == true) { 
        $("#btnOK").hide(); 
        $("#btnCancel").hide(); 

        $("#btnAddSupplier").hide(); 
        $(".chkSupplierActive").each(function (index) {
            $(this).attr("disabled", "true");
        });  
        $(".btnLOVSupplier").each(function (index) {
            $(this).hide(); 
        }); 
        $(".btnSupplierDelete").each(function (index) {
            $(this).hide(); 
        }); 
    } else if (objDat.INT_USER_SUP_HDR_ID != "") {
        // Ada Parent
        $("#btnOK").show();
        $("#btnCancel").show();

        $("#btnAddSupplier").hide();
        //$(".chkSupplierActive").each(function (index) {
        //    $(this).attr("disabled", "true");
        //});
        $(".chkSupplierActive").each(function (index) {
            $(this).removeAttr("disabled");
        });
        $(".btnLOVSupplier").each(function (index) {
            $(this).hide();
        });
        $(".btnSupplierDelete").each(function (index) {
            $(this).hide();
        });
    } else {
        $("#btnOK").show();
        $("#btnCancel").show();

        $("#btnAddSupplier").show();
        $(".chkSupplierActive").each(function (index) {
            $(this).removeAttr("disabled");
        });
        $(".btnLOVSupplier").each(function (index) {
            $(this).show();
        });
        $(".btnSupplierDelete").each(function (index) {
            $(this).show();
        });
    }
}

function p_SetHiddenObject(objDat) {
    $("#txtHiddenObject").val(JSON.stringify(objDat));

    //AutoNumeric.
    p_GenerateAutoNumeric()
}

function p_GetHiddenObject() {
    return JSON.parse($("#txtHiddenObject").val()); 
}
 
function p_initiateData() {
    
    clsGlobal.showLoading();
    $("#txtHiddenObject").val(parent.$("#txtHiddenObject").val());
    var indexDetail = intSupplierDtlIndex;
    var objData = p_GetHiddenObject();
    var data = JSON.stringify(objData);
    $.ajax({
        type: "POST",
        async: false,
        url: "/Master/AssignUserSupplierSite/InitiateDataSupplierSite",
        data: { data: data, indexDetail: indexDetail, __RequestVerificationToken: $('#frmAssignUserSupplierSite input[name=__RequestVerificationToken]').val() },
        datatype: "json",
        success: function (retDat) {
            debugger
            if (retDat.bitSuccess == true) {
                if (retDat.objData != undefined) {
                    p_DataToUI(retDat.objData);
                    clsGlobal.hideLoading();
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

function p_UIToData() { 
    var jsonObj = []; 
    jsonData = p_GetHiddenObject();  

    p_SetHiddenObject(jsonData);
    return $("#txtHiddenObject").val();
}
   
function p_saveData() {
    
    //clsGlobal.showLoading();
    //p_UIToData(); 
    //$.ajax({ 
    //    type: "POST",
    //    url: "/Transaction/MKPP/SaveData", 
    //    data: { data: $("#txtHiddenObject").val(), __RequestVerificationToken: $('#frmMKPP input[name=__RequestVerificationToken]').val() },
    //    datatype: "json",
    //    success: function (retDat) {
    //         
    //        if (retDat.bitSuccess == true) { 
    //            p_DataToUI(retDat.objData);
    //            clsGlobal.getInformationMessage(retDat.txtMessage);
    //        } else {
    //            clsGlobal.getAlert(retDat.txtMessage);
    //        }
    //        clsGlobal.hideLoading();
    //    },
    //    error: function (retDat) {
    //        
    //        clsGlobal.hideLoading();
    //    }
    //});
}
  
function p_GenerateAutoNumeric() {
    //
    $('.autonumeric').autoNumeric('init', { vMax: '9999999999999', vMin: '-9999999999999', aSep: ',', dGroup: '3', aDec: '.' });
}
 

// ==========================
// Supplier  
// ==========================

function p_GetSelectedSupplierRow() {
    var intIndex = clsGlobal.parseToInteger(oTableSupplier.$('tr.selected').find("#lblSupplierNoValue").html()) - 1;
    return intIndex;
}

function p_InitiateSupplier() {
    // Format datatable  
    //
    oTableSupplier = $('#dtSupplier').DataTable({
        "bPaginate": true,
        "bSort": false,
        searching: true,
        "type": "POST",
        "scrollX": true,
        aoColumnDefs: [
              {
                  //"width": "10%",
                  aTargets: [0],
                  mRender: function (data, type, full) {
                      return '<div id="lblSupplierNoValue" > ' + (full.intIndex + 1) + ' </div>';
                  }
              },
           //{ 
           //    aTargets: [1],
           //    mRender: function (data, type, full) {
           //        return '     <div class="input-group"> ' +
           //               '       <div class="input-group-btn"> ' +
           //               '           <button type="button" class="btn btn-danger btnLOVSupplier" id="btnLOVSupplier" onclick="p_btnLOVSupplier_Click(this,' + full.intIndex + ')"> <i class="fa fa-search"></i></button> ' +
           //               '       </div> ' +
           //               '       <div class="input-group-btn" style="width:60px;"> ' +
           //               '       <input type="text" class="form-control txtSupplier" id="txtSupplier" onchange="p_txtSupplier_Changed(this,' + full.intIndex + ')"  value="' + full.TXT_ACCOUNT_SITE + '" disabled> ' +
           //               '       </div> ' +
           //               '   </div>';
           //    }
           //},
           { 
               aTargets: [1],
               mRender: function (data, type, full) {
                   return '<div id="lblSupplierNameValue" > ' + clsGlobal.parseToString(full.TXT_ACCOUNT_NAME) + ' </div>';
               }
           },
           { 
               aTargets: [2],
               mRender: function (data, type, full) {
                   return '<div id="lblSupplierKAMValue" > ' + clsGlobal.parseToString(full.TXT_KAM_SUPPLIER) + ' </div>';
               }
           },
           {
               aTargets: [3],
               mRender: function (data, type, full) {
                   if (clsGlobal.ParseBooleanOracleToNET(full.BIT_ACTIVE)) {
                       return '<div > <input type="checkbox" id="chkSupplierActive" class="chkSupplierActive" onchange="p_chkSupplierActive_Changed(this,' + full.intIndex + ')"  checked="' + clsGlobal.ParseBooleanOracleToNET(full.BIT_ACTIVE) + '" >  </div>';
                   } else {
                       return '<div > <input type="checkbox" id="chkSupplierActive" class="chkSupplierActive" onchange="p_chkSupplierActive_Changed(this,' + full.intIndex + ')" >  </div>';
                   }

               }
           }
           //,
           //{ 
           //    aTargets: [5],
           //    mRender: function (data, type, full) {
           //        return '<div > <input type="button" class="btn btn-warning btnSupplierDelete" id="btnSupplierDelete" onclick="p_btnSupplierDelete_Click(this,' + full.intIndex + ')"  value="Delete" >  </div>';
           //    }
           //}
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

function p_ShowBlankSupplier() {
    oTableSupplier.clear();
    oTableSupplier.draw(false);
}

function p_AddSupplier() {
    //
    clsGlobal.showLoading();
    $.ajax({
        type: "POST",
        url: "/Transaction/MKPP/AddRowSupplier",
        data: { intSupplierDtlIndex: intSupplierDtlIndex, data: $("#txtHiddenObject").val(), __RequestVerificationToken: $('#frmMKPP input[name=__RequestVerificationToken]').val() },
        datatype: "json",
        success: function (retDat) {
            
            if (retDat.bitSuccess == true) {
                if (retDat.objData != undefined) {
                    p_SetHiddenObject(retDat.objData);
                    p_DataToUISupplier(retDat.objData.XXSHP_KDS_M_USER_SUP_DTL[intSupplierDtlIndex].XXSHP_KDS_M_USER_SUP_SITE);
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

function p_ValidateBtnOkSupplierSite() {
    debugger
    //clsGlobal.showLoading();
    var indexDetail = intSupplierDtlIndex;
    var objData = p_GetHiddenObject();
    //var dtlSelected = objData.XXSHP_KDS_M_USER_SUP_DTL[intSupplierDtlIndex];
    var data = JSON.stringify(objData);
    $.ajax({
        type: "POST",
        async: false,
        url: "/Master/AssignUserSupplierSite/ValidateSupplierSiteOnlySpecificIndexDetail",
        data: { data: data, indexDetail: indexDetail, __RequestVerificationToken: $('#frmAssignUserSupplierSite input[name=__RequestVerificationToken]').val() },
        datatype: "json",
        success: function (retDat) {
            debugger
            if (retDat.bitSuccess == true) {
                if (retDat.objData != undefined) {
                    parent.$("#txtHiddenObject").val($("#txtHiddenObject").val());
                    parent.clsGlobal.closePopUpIframe();
                }
            } else {
                clsGlobal.getAlert(retDat.txtMessage);
                clsGlobal.hideLoading();
            }
            clsGlobal.hideLoading();
        },
        error: function (retDat) {
            clsGlobal.hideLoading();
        }
    });
}
 
function p_DataToUISupplier(XXSHP_KDS_M_USER_SUP_SITE) {
    //
    oTableSupplier.clear();
    for (var i = 0; i < XXSHP_KDS_M_USER_SUP_SITE.length; i++) {
        XXSHP_KDS_M_USER_SUP_SITE[i].intIndex = i;
        oTableSupplier.row.add(XXSHP_KDS_M_USER_SUP_SITE[i]);
    }
    oTableSupplier.draw(false);

    var objDat = p_GetHiddenObject();
    objDat.XXSHP_KDS_M_USER_SUP_DTL[intSupplierDtlIndex].XXSHP_KDS_M_USER_SUP_SITE = XXSHP_KDS_M_USER_SUP_SITE;
    p_SetHiddenObject(objDat);
}
 
function p_RefreshNumberSupplier() {
    //
    var intRowIndex = 0;
    var objDat = p_GetHiddenObject();
    oTableSupplier.rows().every(function (rowIdx, tableLoop, rowLoop) {
        
        var d = this.data();
        d.intIndex = intRowIndex; // update data source for the row
        objDat.XXSHP_KDS_M_USER_SUP_DTL[intSupplierDtlIndex].XXSHP_KDS_M_USER_SUP_SITE[intRowIndex].intIndex = d.intIndex;
        
        d.TXT_ACCOUNT_SITE = objDat.XXSHP_KDS_M_USER_SUP_DTL[intSupplierDtlIndex].XXSHP_KDS_M_USER_SUP_SITE[intRowIndex].TXT_ACCOUNT_SITE;
        d.TXT_ACCOUNT_NAME = objDat.XXSHP_KDS_M_USER_SUP_DTL[intSupplierDtlIndex].XXSHP_KDS_M_USER_SUP_SITE[intRowIndex].TXT_ACCOUNT_NAME; 
        d.BIT_ACTIVE = objDat.XXSHP_KDS_M_USER_SUP_DTL[intSupplierDtlIndex].XXSHP_KDS_M_USER_SUP_SITE[intRowIndex].BIT_ACTIVE;

        intRowIndex++;
        this.invalidate(); // invalidate the data DataTables has cached for this row         
    });

    // Draw once all updates are done
    oTableSupplier.draw(false);
    p_SetHiddenObject(objDat);
}
  

function p_btnLOVSupplier_Click(objCaller, intIndex) {
    LOV = clsGlobal.generateLOV(LOV_XXSHP_VENDOR_SITE_ALL_V, "txtSupplier");
}

function p_settxtSupplier(txtValue1, txtValue2) {
    //
    var intSelectedIndex = p_GetSelectedSupplierRow();
    var intRowIndex = 0;
    var objDat = p_GetHiddenObject();
    oTableSupplier.rows().every(function (rowIdx, tableLoop, rowLoop) {
        //
        var d = this.data();
        if (intRowIndex == intSelectedIndex) {
            d.intIndex = intRowIndex; // update data source for the row 

            d.TXT_ACCOUNT_SITE = txtValue1;
            d.TXT_ACCOUNT_NAME = txtValue2;
            objDat.XXSHP_KDS_M_USER_SUP_DTL[intSupplierDtlIndex].XXSHP_KDS_M_USER_SUP_SITE[intRowIndex].TXT_ACCOUNT_SITE = txtValue1;
            objDat.XXSHP_KDS_M_USER_SUP_DTL[intSupplierDtlIndex].XXSHP_KDS_M_USER_SUP_SITE[intRowIndex].TXT_ACCOUNT_NAME = txtValue2;
            d.BIT_ACTIVE = objDat.XXSHP_KDS_M_USER_SUP_DTL[intSupplierDtlIndex].XXSHP_KDS_M_USER_SUP_SITE[intRowIndex].BIT_ACTIVE;

            this.invalidate(); // invalidate the data DataTables has cached for this row         
            p_EnableControl(clsGlobal.ParseBooleanOracleToNET(objDat.BIT_APPLY), objDat);
        }

        intRowIndex++;
    });

    p_SetHiddenObject(objDat);
}
 
function p_chkSupplierActive_Changed(objCaller, intIndex) {
    //
    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());
    for (i = 0; i < objData.XXSHP_KDS_M_USER_SUP_DTL[intSupplierDtlIndex].XXSHP_KDS_M_USER_SUP_SITE.length; i++) {
        // Cari Index-nya.
        if (objData.XXSHP_KDS_M_USER_SUP_DTL[intSupplierDtlIndex].XXSHP_KDS_M_USER_SUP_SITE[i].intIndex == intIndex) {
            // Ketemu, mulai dari sini:
            objData.XXSHP_KDS_M_USER_SUP_DTL[intSupplierDtlIndex].XXSHP_KDS_M_USER_SUP_SITE[i].BIT_ACTIVE = clsGlobal.ParseBooleanNETToOracle(objCaller.checked);
             
            //var intRowIndex = 0;
            //oTableSupplier.rows().every(function (rowIdx, tableLoop, rowLoop) {
            //    
            //    var d = this.data();
            //    if (intRowIndex == intIndex) {
            //        d.intIndex = intRowIndex; // update data source for the row 

            //        d.TXT_ACCOUNT_SITE = objDat.XXSHP_KCO_T_MKPP_ACT[intSupplierDtlIndex].XXSHP_KCO_T_MKPP_SUP[intRowIndex].TXT_ACCOUNT_SITE;
            //        d.TXT_ACCOUNT_NAME = objDat.XXSHP_KCO_T_MKPP_ACT[intSupplierDtlIndex].XXSHP_KCO_T_MKPP_SUP[intRowIndex].TXT_ACCOUNT_NAME; 
            //        d.BIT_ACTIVE = objDat.XXSHP_KCO_T_MKPP_ACT[intSupplierDtlIndex].XXSHP_KCO_T_MKPP_SUP[intRowIndex].BIT_ACTIVE;

            //        this.invalidate(); // invalidate the data DataTables has cached for this row         
            //        p_EnableControl(clsGlobal.ParseBooleanOracleToNET(objDat.BIT_APPLY));
            //    }

            //    intRowIndex++;
            //});

            break;
        }
    }
    p_SetHiddenObject(objData);
}
     
function p_btnSupplierDelete_Click(objCaller, intIndex) {
    //
    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());
    for (i = 0; i < objData.XXSHP_KDS_M_USER_SUP_DTL[intSupplierDtlIndex].XXSHP_KDS_M_USER_SUP_SITE.length; i++) {
        // Cari Index-nya.
        if (objData.XXSHP_KDS_M_USER_SUP_DTL[intSupplierDtlIndex].XXSHP_KDS_M_USER_SUP_SITE[i].intIndex == intIndex) {
            // Ketemu, mulai dari sini:
            // Remove from list.
            objData.XXSHP_KDS_M_USER_SUP_DTL[intSupplierDtlIndex].XXSHP_KDS_M_USER_SUP_SITE.splice(i, 1);

            oTableSupplier.row(i).remove().draw(false);
            break;
        }
    }
    p_SetHiddenObject(objData);
    p_RefreshNumberSupplier();
}
 
$('#btnAddSupplier').on('click', function () {
    try {
        p_AddSupplier();
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
});
  
// ==========================
// END: Supplier   
// ==========================
 
    
//=======================
// HANDLER
//=======================

$('#btnOK').bind('click', function () {
    try {
        
        //Validasi 
        p_ValidateBtnOkSupplierSite();
          
    } catch (ex) {
        clsGlobal.showAlert(ex);
    } 
  });
  
$('#btnCancel').bind('click', function () {
    try {
        //
        parent.clsGlobal.closePopUpIframe();
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
  });
 
  


