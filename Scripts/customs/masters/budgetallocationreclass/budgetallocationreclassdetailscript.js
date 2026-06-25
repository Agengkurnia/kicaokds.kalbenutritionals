//     BUDGET ALLOCATION RECLAS SCRIPT 
//
//
//      History.
//
//      29-Agustus-2019                    Initial version.            (nosa)
//



//=======================
// VARIABLE GLOBAL
//=======================
var clsGlobal = new clsGlobalClass(); 
var LOV;
var bitLoading = false;
var intDetailIndex;
var txtSubumbrandFrom;
var txtSubumbrandTo;
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
    intDetailIndex = $.getParameter("intIndex");
    txtSubumbrandFrom = decodeURI($.getParameter("txtSubumbrandFrom"));
    txtSubumbrandTo = decodeURI($.getParameter("txtSubumbrandTo"));
    p_InitiateDetail();  
    p_initiateData();
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
        case "txtSubUmbrandFrom":
            $("#txtSubUmbrandFrom").val(arr[1]);
            $("#txtSubUmbrandTo").val(arr[1]);
            p_txtSubUmbrand_TextChanged();
            break;
        case "txtSubUmbrandTo":
            $("#txtSubUmbrandFrom").val(arr[1]);
            $("#txtSubUmbrandTo").val(arr[1]);
            p_txtSubUmbrand_TextChanged();
            break;
    }
    clsGlobal.closeLOV(); 
}

function p_DataToUI(objData) {
    

    $("#txtSubUmbrandFrom").val(txtSubumbrandFrom);
    $("#txtSubUmbrandTo").val(txtSubumbrandFrom);

    p_DataToUIDetail(objData.XXSHP_KDS_M_BRCALO_DTL);
     
    p_EnableControl(clsGlobal.ParseBooleanOracleToNET(objData.BIT_APPLY),objData);

    p_SetHiddenObject(objData);
    if ($("#txtID").val() == "" || $("#txtID").val() == "0") {
        $("#btnDelete").hide();
    } else {
        $("#btnDelete").show();
    }
}

function p_EnableControl(bitApply, objDat) {
    
    if (bitApply == true) {
        $("#btnOK").hide();
        $("#btnCancel").hide();

        //$("#btnAddDetail").hide(); 
        //$(".txtAmount").each(function (index) {
        //    $(this).attr("disabled", "true");
        //});
        //$(".btnLOVDetail").each(function (index) {
        //    $(this).hide();
        //});
        //$(".btnDetailDelete").each(function (index) {
        //    $(this).hide();
        //});
         
    } else {
        $("#btnOK").show();
        $("#btnCancel").show();

        //$("#btnAddDetail").show(); //.removeClass("display");
        //$(".txtAmount").each(function (index) {
        //    $(this).removeAttr("disabled");
        //});
        //$(".btnLOVDetail").each(function (index) {
        //    $(this).show();  
        //});
        //$(".btnDetailDelete").each(function (index) {
        //    $(this).show();  
        //});

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
    
    clsGlobal.showLoading();
    
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
    
    //clsGlobal.showLoading();
    //p_UIToData(); 
    //$.ajax({ 
    //    type: "POST",
    //    url: "/Master/BudgetAllocationReclass/SaveData", 
    //    data: { data: $("#txtHiddenObject").val(), __RequestVerificationToken: $('#frmKPP input[name=__RequestVerificationToken]').val() },
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
    
    $('.autonumeric').autoNumeric('init', { vMax: '9999999999999', vMin: '-9999999999999', aSep: ',', dGroup: '3', aDec: '.' });
}

function p_GenerateDateTimePicker() {
    
    $('.datetimepicker').datepicker({
        autoclose: true,
    });

}


function p_txtSubUmbrand_TextChanged() {

    txtSubumbrandFrom = $("#txtSubUmbrandFrom").val();
    txtSubUmbrandTo = $("#txtSubUmbrandTo").val();

    clsGlobal.showLoading();
    $.ajax({
        type: "POST",
        url: "/Master/BudgetAllocationReclass/GetMapping",
        data: { data: $("#txtHiddenObject").val(), txtSubumbrandFrom: txtSubumbrandFrom, txtSubUmbrandTo: txtSubUmbrandTo, txtID: $("#txtSupplierSiteID").val(), __RequestVerificationToken: $('#frmIndex input[name=__RequestVerificationToken]').val() },
        datatype: "json",
        success: function (retDat) {

            if (retDat.bitSuccess == true) {
                if (retDat.objData != undefined) {
                    //$("#txtSupplierSiteName").val(clsGlobal.parseToString(retDat.objData.VENDOR_SITE_CODE));
                    p_DataToUIDetail(retDat.objData.XXSHP_KDS_M_BRCALO_DTL);
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
 

// ==========================
// Detail  
// ==========================

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
                  //"width": "10%",
                  aTargets: [0],
                  mRender: function (data, type, full) {
                      return '<div id="lblDetailNoValue" > ' + (full.intIndex + 1) + ' </div>';
                  }
              },
           { 
               aTargets: [1],
               mRender: function (data, type, full) {
                   return '<div id="lblDetailSubbrandFromValue" > ' + clsGlobal.parseToString(full.TXT_SUBBRAND_FROM) + ' </div>';
               }
           },    
           {
               aTargets: [2],
               mRender: function (data, type, full) {
                   return '<div id="lblDetailAvailableValue" > ' + clsGlobal.FormatMoney(full.DEC_AVAILABLE, 0) + ' </div>';
               }
           },
           {
               aTargets: [3],
               mRender: function (data, type, full) {
                    return '<div id="lblDetailSubbrandFromValue" > ' + clsGlobal.parseToString(full.TXT_SUBBRAND_TO) + ' </div>';                   
               }
           },
           {
               aTargets: [4],
               mRender: function (data, type, full) {
                   if (clsGlobal.parseToString(full.TXT_SUBBRAND_TO) != "") {
                       return '<div >  <input type="text" class="form-control autonumeric txtDetailTransfer text-right" id="txtDetailTransfer" onchange="p_txtDetailTransfer_Changed(this,' + full.intIndex + ')"  value="' + full.DEC_TRANSFER + '">  </div>';
                   } else {
                       return '';
                   }                   
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

function p_ShowBlankDetail() {
    oTableDetail.clear();
    oTableDetail.draw(false);
}

function p_GetSelectedDetailRow() {
    var intIndex = clsGlobal.parseToInteger(oTableDetail.$('tr.selected').find("#lblDetailNoValue").html()) - 1;
    return intIndex;
}
 
function p_DataToUIDetail(XXSHP_KDS_M_BRCALO_DTL) {
    
    oTableDetail.clear();
    for (var i = 0; i < XXSHP_KDS_M_BRCALO_DTL.length; i++) {
        XXSHP_KDS_M_BRCALO_DTL[i].intIndex = i;
        if (XXSHP_KDS_M_BRCALO_DTL[i].TXT_SUBUMBRAND_FROM == txtSubumbrandFrom) {
            oTableDetail.row.add(XXSHP_KDS_M_BRCALO_DTL[i]);
        }
    }
    oTableDetail.draw(false);

    var objDat = p_GetHiddenObject();
    objDat.XXSHP_KDS_M_BRCALO_DTL = XXSHP_KDS_M_BRCALO_DTL;
    p_SetHiddenObject(objDat);
}
 
function p_RefreshNumberDetail() {
    
    var intRowIndex = 0;
    var objDat = p_GetHiddenObject();
    //oTableDetail.rows().every(function (rowIdx, tableLoop, rowLoop) {
    //    
    //    var d = this.data();
    //    d.intIndex = intRowIndex; // update data source for the row
    //    objDat.XXSHP_KCO_M_BRCALO_DTL[intRowIndex].intIndex = d.intIndex;

    //    d.TXT_Detail = objDat.XXSHP_KCO_M_BRCALO_DTL[intRowIndex].TXT_Detail;
    //    d.DEC_AMOUNT = objDat.XXSHP_KCO_M_BRCALO_DTL[intRowIndex].DEC_AMOUNT;
    //    d.DEC_AVAILABLE = objDat.XXSHP_KCO_M_BRCALO_DTL[intRowIndex].DEC_AVAILABLE;
    //    d.TXT_REFDOCNO_DOLPHINE = objDat.XXSHP_KCO_M_BRCALO_DTL[intRowIndex].TXT_REFDOCNO_DOLPHINE;
    //    intRowIndex++;
    //    this.invalidate(); // invalidate the data DataTables has cached for this row         
    //});

    //// Draw once all updates are done
    //oTableDetail.draw(false);
    p_SetHiddenObject(objDat);
}



function p_RefreshDetailSelectedRow(intSelectedIndex) {
    var intRowIndex = 0;
    var objDat = p_GetHiddenObject();
    //oTableDetail.rows().every(function (rowIdx, tableLoop, rowLoop) {
    //    
    //    var d = this.data();
    //    if (intRowIndex == intSelectedIndex) {
    //        d.intIndex = intRowIndex; // update data source for the row
    //        objDat.XXSHP_KCO_M_BRCALO_DTL[intRowIndex].intIndex = d.intIndex;

    //        d.TXT_Detail = objDat.XXSHP_KCO_M_BRCALO_DTL[intRowIndex].TXT_Detail;
    //        d.DEC_AMOUNT = objDat.XXSHP_KCO_M_BRCALO_DTL[intRowIndex].DEC_AMOUNT;
    //        d.TXT_COA = objDat.XXSHP_KCO_M_BRCALO_DTL[intRowIndex].TXT_COA;
    //        d.TXT_REFDOCNO_DOLPHINE = objDat.XXSHP_KCO_M_BRCALO_DTL[intRowIndex].TXT_REFDOCNO_DOLPHINE;
    //        d.DEC_AVAILABLE = objDat.XXSHP_KCO_M_BRCALO_DTL[intRowIndex].DEC_AVAILABLE;
           
    //        this.invalidate(); // invalidate the data DataTables has cached for this row   
    //    }

    //    intRowIndex++;
    //});

    //AutoNumeric.
    p_GenerateAutoNumeric();
    p_GenerateDateTimePicker();
}
  
function p_txtDetailTransfer_Changed(objCaller, intIndex) {
    
    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());
    for (i = 0; i < objData.XXSHP_KDS_M_BRCALO_DTL.length; i++) {
        // Cari Index-nya.
        if (objData.XXSHP_KDS_M_BRCALO_DTL[i].intIndex == intIndex) {
            // Ketemu, mulai dari sini:
            objData.XXSHP_KDS_M_BRCALO_DTL[i].DEC_TRANSFER = clsGlobal.parseToDecimal(objCaller.value);
            break;
        }
    }
    p_SetHiddenObject(objData);
}
    
// ==========================
// END: Detail   
// ==========================
 
    
//=======================
// HANDLER
//=======================

$('#btnOK').bind('click', function () {
    try {
        
        parent.$("#txtHiddenObject").val($("#txtHiddenObject").val());
        parent.clsGlobal.closePopUpIframe();
        parent.p_setbtnDetailEdit();
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
 


$('#btnLOVSubUmbrandFrom').bind('click', function () {
    try {
        var objData = JSON.parse(p_UIToData());
        LOV = clsGlobal.generateLOV(LOV_BUDGETALLOCATION_SUBUMBRAND_BY_GROUPACCOUNT_PERIOD, "txtSubUmbrandFrom", objData.TXT_GROUP_ACCOUNT_FROM + "|" + objData.TXT_BUDGET_TYPE + "|" + objData.TXT_PERIOD_FROM);
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
});

$('#btnLOVSubUmbrandTo').bind('click', function () {
    try {
        var objData = JSON.parse(p_UIToData());
        LOV = clsGlobal.generateLOV(LOV_BUDGETALLOCATION_SUBUMBRAND_BY_GROUPACCOUNT_PERIOD, "txtSubUmbrandTo", objData.TXT_GROUP_ACCOUNT_TO + "|" + objData.TXT_BUDGET_TYPE + "|" + objData.TXT_PERIOD_TO);
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
});



