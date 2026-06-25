//     KKP SCRIPT - Subbrand
//
//
//      History.
//
//      4-April-2018                    Initial version.            (nosa)
//



//=======================
// VARIABLE GLOBAL
//=======================
var clsGlobal = new clsGlobalClass(); 
var LOV;
var bitLoading = false;
var intActivityIndex;
var intBudgetIndex;
var oTableSubbrand;

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
});

//=======================
// FUNCTION
//=======================
function p_InitForm() {
    XXSHP_KCO_T_KKP_BGT = {};
    intActivityIndex = $.getParameter("intActivityIndex");
    intBudgetIndex = $.getParameter("intBudgetIndex");
    p_InitiateSubbrand();  
    p_initiateData();
}

function p_validatePage() {
    debugger;
}

function p_showPrevData() {

}
 
function p_showBlank() { 
    p_initiateData(); 
}

function setChooseLOV(txtValue) { 
    var arr = txtValue.split('|'); 
    switch (arr[0]) { 
        case "txtSubBrand":
            p_settxtSubBrand(arr[1], arr[2]);
            break; 
    }
    clsGlobal.closeLOV(); 
}

function p_DataToUI(objData) {
    debugger;
    p_DataToUISubbrand(objData.XXSHP_KCO_T_KKP_ACT[intActivityIndex].XXSHP_KCO_T_KKP_BGT[intBudgetIndex].XXSHP_KCO_T_KKP_SUB);
     
    p_EnableControl(objData.bitApply);
     
    p_SetHiddenObject(objData);
    if ($("#txtID").val() == "" || $("#txtID").val() == "0") {
        $("#btnDelete").hide();
    } else {
        $("#btnDelete").show();
    }
}

function p_EnableControl(bitApply) {
    debugger;
    if (bitApply == true) { 
        //$("#btnOK").hide(); //.css("display", "none");  

        //$("#btnAddSubbrand").hide(); //.css("display", "none");  
        //$(".txtSubbrandName").each(function (index) {
        //    $(this).attr("disabled", "true");
        //}); 
        //$(".txtSubbrandDesc").each(function (index) {
        //    $(this).attr("disabled", "true");
        //}); 
        //$(".btnSubbrandDelete").each(function (index) {
        //    $(this).hide(); //.css("display", "none");
        //});
         
        //$("#btnAddSubbrandOption").hide(); //.css("display", "none");
        //$(".txtSubbrandOptionName").each(function (index) {
        //    $(this).attr("disabled", "true");
        //});
        //$(".txtSubbrandOptionDescription").each(function (index) {
        //    $(this).attr("disabled", "true");
        //}); 
        //$(".btnSubbrandOptionDelete").each(function (index) {
        //    $(this).hide(); //.css("display", "none");
        //});

    } else {
        //$("#btnOK").show(); //.removeClass("display");
          
        //$("#btnAddSubbrand").show(); //.removeClass("display");
        //$(".txtSubbrandName").each(function (index) {
        //    $(this).removeAttr("disabled");
        //}); 
        //$(".txtSubbrandDesc").each(function (index) {
        //    $(this).removeAttr("disabled");
        //}); 
        //$(".btnSubbrandDelete").each(function (index) {
        //    $(this).show(); //.removeClass("display");
        //});
         
        //$("#btnAddSubbrandOption").show(); //.removeClass("display");
        //$(".txtSubbrandOptionName").each(function (index) {
        //    $(this).removeAttr("disabled");
        //});
        //$(".txtSubbrandOptionDescription").each(function (index) {
        //    $(this).removeAttr("disabled");
        //});
        //$(".btnSubbrandOptionDelete").each(function (index) {
        //    $(this).show(); //.removeAttr("disabled");
        //}); 
        //$(".btnSubbrandOptionDelete").each(function (index) {
        //    $(this).show(); //.removeClass("display");
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
    debugger;
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
    //    url: "/Transaction/KKP/SaveData", 
    //    data: { data: $("#txtHiddenObject").val(), __RequestVerificationToken: $('#frmKKP input[name=__RequestVerificationToken]').val() },
    //    datatype: "json",
    //    success: function (retDat) {
    //        debugger; 
    //        if (retDat.bitSuccess == true) { 
    //            p_DataToUI(retDat.objData);
    //            clsGlobal.getInformationMessage(retDat.txtMessage);
    //        } else {
    //            clsGlobal.getAlert(retDat.txtMessage);
    //        }
    //        clsGlobal.hideLoading();
    //    },
    //    error: function (retDat) {
    //        debugger;
    //        clsGlobal.hideLoading();
    //    }
    //});
}
  
//function p_GenerateAutoNumeric() {
//    debugger;
//    $('.autonumeric').autoNumeric('init', { vMax: '9999999999999', vMin: '-9999999999999', aSep: ',', dGroup: '3', aDec: '.' });
//}
 

// ==========================
// Subbrand  
// ==========================

function p_GetSelectedSubbrandRow() {
    var intIndex = clsGlobal.parseToInteger(oTableSubbrand.$('tr.selected').find("#lblSubbrandNoValue").html()) - 1;
    return intIndex;
}

function p_InitiateSubbrand() {
    // Format datatable  
    debugger;
    oTableSubbrand = $('#dtSubbrand').DataTable({
        "bPaginate": true,
        "bSort": false,
        searching: false,
        "type": "POST",
        "scrollX": true,
        aoColumnDefs: [
              {
                  //"width": "10%",
                  aTargets: [0],
                  mRender: function (data, type, full) {
                      return '<div id="lblSubbrandNoValue" > ' + (full.intIndex + 1) + ' </div>';
                  }
              },
           { 
               aTargets: [1],
               mRender: function (data, type, full) {
                   return '     <div class="input-group"> ' +
                          '       <div class="input-group-btn"> ' +
                          '           <button type="button" class="btn btn-danger btnLOVSubBrand" id="btnLOVSubBrand" onclick="p_btnLOVSubBrand_Click(this,' + full.intIndex + ')"> <i class="fa fa-search"></i></button> ' +
                          '       </div> ' +
                          '       <div class="input-group-btn" style="width:60px;"> ' +
                          '       <input type="text" class="form-control txtSubBrand" id="txtSubBrand" onchange="p_txtSubBrand_Changed(this,' + full.intIndex + ')"  value="' + full.TXT_SUBBRAND + '" disabled> ' +
                          '       </div> ' +
                          '   </div>';
               }
           },    
           {
               aTargets: [2],
               mRender: function (data, type, full) {
                   return '<input type="text" class="form-control txtAmount autonumeric text-right" id="txtAmount" onchange="p_txtAmount_Changed(this,' + full.intIndex + ')"  value="' + full.DEC_AMOUNT + '"> ';
               }
           }, 
           { 
               aTargets: [3],
               mRender: function (data, type, full) {
                   return '<div > <input type="button" class="btn btn-warning btnSubbrandDelete" id="btnSubbrandDelete" onclick="p_btnSubbrandDelete_Click(this,' + full.intIndex + ')"  value="Delete" >  </div>';
               }
           }
        ]
    });

    $("#dtSubbrand").css("width", "100%");
    $('#dtSubbrand tbody').on('click', 'tr', function () {
        if (!$(this).hasClass('selected')) {  
            oTableSubbrand.$('tr.selected').removeClass('selected');
            $(this).addClass('selected'); 
        }
    });

}

function p_ShowBlankSubbrand() {
    oTableSubbrand.clear();
    oTableSubbrand.draw(false);
}

function p_GetSelectedSubbrandRow() {
    var intIndex = clsGlobal.parseToInteger(oTableSubbrand.$('tr.selected').find("#lblSubbrandNoValue").html()) - 1;
    return intIndex;
}

function p_AddSubbrand() {
    debugger;
    clsGlobal.showLoading();
    $.ajax({
        type: "POST",
        url: "/Transaction/KKP/AddRowSubbrand",
        data: { intActivityIndex: intActivityIndex, intBudgetIndex: intBudgetIndex, data: $("#txtHiddenObject").val(), __RequestVerificationToken: $('#frmKKP input[name=__RequestVerificationToken]').val() },
        datatype: "json",
        success: function (retDat) {
            debugger;
            if (retDat.bitSuccess == true) {
                if (retDat.objData != undefined) {
                    p_SetHiddenObject(retDat.objData);
                    p_DataToUISubbrand(retDat.objData.XXSHP_KCO_T_KKP_ACT[intActivityIndex].XXSHP_KCO_T_KKP_BGT[intBudgetIndex].XXSHP_KCO_T_KKP_SUB);
                    oTableSubbrand.page('last').draw(false);
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
 
function p_DataToUISubbrand(XXSHP_KCO_T_KKP_SUB) {
    debugger;
    oTableSubbrand.clear();
    for (var i = 0; i < XXSHP_KCO_T_KKP_SUB.length; i++) {
        XXSHP_KCO_T_KKP_SUB[i].intIndex = i;
        oTableSubbrand.row.add(XXSHP_KCO_T_KKP_SUB[i]);
    }
    oTableSubbrand.draw(false);

    var objDat = p_GetHiddenObject();
    objDat.XXSHP_KCO_T_KKP_ACT[intActivityIndex].XXSHP_KCO_T_KKP_BGT[intBudgetIndex].XXSHP_KCO_T_KKP_SUB = XXSHP_KCO_T_KKP_SUB;
    p_SetHiddenObject(objDat);
}
 
function p_RefreshNumberSubbrand() {
    debugger;
    var intRowIndex = 0;
    var objDat = p_GetHiddenObject();
    oTableSubbrand.rows().every(function (rowIdx, tableLoop, rowLoop) {
        debugger;
        var d = this.data();
        d.intIndex = intRowIndex; // update data source for the row
        objDat.XXSHP_KCO_T_KKP_ACT[intActivityIndex].XXSHP_KCO_T_KKP_BGT[intBudgetIndex].XXSHP_KCO_T_KKP_SUB[intRowIndex].intIndex = d.intIndex;

        d.TXT_SUBBRAND = objDat.XXSHP_KCO_T_KKP_ACT[intActivityIndex].XXSHP_KCO_T_KKP_BGT[intBudgetIndex].XXSHP_KCO_T_KKP_SUB[intRowIndex].TXT_SUBBRAND;
        d.DEC_AMOUNT = objDat.XXSHP_KCO_T_KKP_ACT[intActivityIndex].XXSHP_KCO_T_KKP_BGT[intBudgetIndex].XXSHP_KCO_T_KKP_SUB[intRowIndex].DEC_AMOUNT;
        intRowIndex++;
        this.invalidate(); // invalidate the data DataTables has cached for this row         
    });

    // Draw once all updates are done
    oTableSubbrand.draw(false);
    p_SetHiddenObject(objDat);
}

function p_btnLOVSubBrand_Click(objCaller, intIndex) {
    LOV = clsGlobal.generateLOV(MODULE_BRAND, "txtSubBrand");
}

function p_settxtSubBrand(txtValue, txtSubBrand) {
    debugger;
    var intSelectedIndex = p_GetSelectedSubbrandRow();
    var intRowIndex = 0;
    var objDat = p_GetHiddenObject();
    oTableSubbrand.rows().every(function (rowIdx, tableLoop, rowLoop) {
        debugger;
        var d = this.data();
        if (intRowIndex == intSelectedIndex) {
            d.intIndex = intRowIndex; // update data source for the row 

            d.INT_SUBBRAND_ID = txtValue;
            d.TXT_SUBBRAND = txtSubBrand;
            d.DEC_AMOUNT = objDat.XXSHP_KCO_T_KKP_ACT[intActivityIndex].XXSHP_KCO_T_KKP_BGT[intBudgetIndex].XXSHP_KCO_T_KKP_SUB[intRowIndex].DEC_AMOUNT;

            objDat.XXSHP_KCO_T_KKP_ACT[intActivityIndex].XXSHP_KCO_T_KKP_BGT[intBudgetIndex].XXSHP_KCO_T_KKP_SUB[intRowIndex].INT_SUBBRAND_ID = txtValue;
            objDat.XXSHP_KCO_T_KKP_ACT[intActivityIndex].XXSHP_KCO_T_KKP_BGT[intBudgetIndex].XXSHP_KCO_T_KKP_SUB[intRowIndex].TXT_SUBBRAND = txtSubBrand;
            
            this.invalidate(); // invalidate the data DataTables has cached for this row         
            p_EnableControl(objDat.bitApply);
        }

        intRowIndex++;
    });

    p_SetHiddenObject(objDat);
}
  
function p_txtAmount_Changed(objCaller, intIndex) {
    debugger;
    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());
    for (i = 0; i < objData.XXSHP_KCO_T_KKP_ACT[intActivityIndex].XXSHP_KCO_T_KKP_BGT[intBudgetIndex].XXSHP_KCO_T_KKP_SUB.length; i++) {
        // Cari Index-nya.
        if (objData.XXSHP_KCO_T_KKP_ACT[intActivityIndex].XXSHP_KCO_T_KKP_BGT[intBudgetIndex].XXSHP_KCO_T_KKP_SUB[i].intIndex == intIndex) {
            // Ketemu, mulai dari sini:
            objData.XXSHP_KCO_T_KKP_ACT[intActivityIndex].XXSHP_KCO_T_KKP_BGT[intBudgetIndex].XXSHP_KCO_T_KKP_SUB[i].DEC_AMOUNT = clsGlobal.parseToDecimal(objCaller.value);
            break;
        }
    }
    p_SetHiddenObject(objData);
}
 
//function p_txtSubbrandDesc_Changed(objCaller, intIndex) {
//    debugger;
//    // Parse dari HiddenObject->JSON
//    var objData = JSON.parse(p_UIToData());
//    for (i = 0; i < objData.XXSHP_KCO_T_KKP_ACT[intActivityIndex].XXSHP_KCO_T_KKP_BGT[intBudgetIndex].XXSHP_KCO_T_KKP_SUB.length; i++) {
//        // Cari Index-nya.
//        if (objData.XXSHP_KCO_T_KKP_ACT[intActivityIndex].XXSHP_KCO_T_KKP_BGT[intBudgetIndex].XXSHP_KCO_T_KKP_SUB[i].intIndex == intIndex) {
//            // Ketemu, mulai dari sini:
//            objData.XXSHP_KCO_T_KKP_ACT[intActivityIndex].XXSHP_KCO_T_KKP_BGT[intBudgetIndex].XXSHP_KCO_T_KKP_SUB[i].DEC_AMOUNT = objCaller.value;
//            break;
//        }
//    }
//    p_SetHiddenObject(objData);
//}
 
function p_btnSubbrandDelete_Click(objCaller, intIndex) {
    debugger;
    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());
    for (i = 0; i < objData.XXSHP_KCO_T_KKP_ACT[intActivityIndex].XXSHP_KCO_T_KKP_BGT[intBudgetIndex].XXSHP_KCO_T_KKP_SUB.length; i++) {
        // Cari Index-nya.
        if (objData.XXSHP_KCO_T_KKP_ACT[intActivityIndex].XXSHP_KCO_T_KKP_BGT[intBudgetIndex].XXSHP_KCO_T_KKP_SUB[i].intIndex == intIndex) {
            // Ketemu, mulai dari sini:
            // Remove from list.
            objData.XXSHP_KCO_T_KKP_ACT[intActivityIndex].XXSHP_KCO_T_KKP_BGT[intBudgetIndex].XXSHP_KCO_T_KKP_SUB.splice(i, 1);

            oTableSubbrand.row(i).remove().draw(false);
            break;
        }
    }
    p_SetHiddenObject(objData);
    p_RefreshNumberSubbrand();
}
 
$('#btnAddSubbrand').on('click', function () {
    try {
        p_AddSubbrand();
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
});
  
// ==========================
// END: Subbrand   
// ==========================
 
    
//=======================
// HANDLER
//=======================

$('#btnOK').bind('click', function () {
    try {
        debugger;
        parent.$("#txtHiddenObject").val($("#txtHiddenObject").val());
        parent.clsGlobal.closePopUpIframe();
        parent.p_setSubBrand();
    } catch (ex) {
        clsGlobal.showAlert(ex);
    } 
  });
  
$('#btnCancel').bind('click', function () {
    try {
        debugger;
        parent.clsGlobal.closePopUpIframe();
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
  });
 
  


