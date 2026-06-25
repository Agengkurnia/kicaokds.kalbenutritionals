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
    p_InitForm();
    p_validatePage();  
});

//=======================
// FUNCTION
//=======================
function p_InitForm() {
    XXSHP_KDS_T_MKPP_BGT = {};
    intActivityIndex = $.getParameter("intActivityIndex");
    intBudgetIndex = $.getParameter("intBudgetIndex");
    p_InitiateSubbrand();  
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
        case "txtSubBrand":
            p_settxtSubBrand(arr[1], arr[2]);
            break; 
    }
    clsGlobal.closeLOV(); 
}

function p_DataToUI(objDat) {
    
    p_DataToUISubbrand(objDat.XXSHP_KDS_T_MKPP_ACT[intActivityIndex].XXSHP_KDS_T_MKPP_BGT[intBudgetIndex].XXSHP_KDS_T_MKPP_SUB);
     
    p_EnableControl(clsGlobal.ParseBooleanOracleToNET(objDat.BIT_APPLY), objDat);
     
    p_SetHiddenObject(objDat);
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
    } else if (objDat.TXT_REFDOCNO != "") {
        // Ada Parent.
        $("#btnOK").show();
        $("#btnCancel").show();

        $("#btnAddSubbrand").hide();
        $(".txtAmount").each(function (index) {
            $(this).removeAttr("disabled");
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

        $("#btnAddSubbrand").show();
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
  
//function p_GenerateAutoNumeric() {
//    
//    $('.autonumeric').autoNumeric('init', { vMax: '9999999999999', vMin: '-9999999999999', aSep: ',', dGroup: '3', aDec: '.' });
//}
 

// ==========================
// Subbrand  
// ==========================

function p_GetSelectedSubbrandRow() {
    var intIndex = clsGlobal.parseToInteger(oTableSubbrand.$('tr.selected').find("#lblSubbrandNoValue").html()) - 1;
    return intIndex;
}

//function p_GetSelectedSubbrandRow() {
//    var intIndex = clsGlobal.parseToInteger(oTableSubbrand.$('tr.selected').find("#lblSubbrandNoValue").html()) - 1;
//    return intIndex;
//}

function p_InitiateSubbrand() {
    // Format datatable  
    
    oTableSubbrand = $('#dtSubbrand').DataTable({
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
                          '       <input type="text" class="form-control txtSubBrand" id="txtSubBrand" onchange="p_txtSubBrand_Changed(this,' + full.intIndex + ')"  value="' + full.TXT_SUBUMBRAND + '" disabled> ' +
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

function p_AddSubbrand() {
    
    clsGlobal.showLoading();
    $.ajax({
        type: "POST",
        url: "/Transaction/MKPP/AddRowSubbrand",
        data: { intActivityIndex: intActivityIndex, intBudgetIndex: intBudgetIndex, data: $("#txtHiddenObject").val(), __RequestVerificationToken: $('#frmMKPP input[name=__RequestVerificationToken]').val() },
        datatype: "json",
        success: function (retDat) {
            
            if (retDat.bitSuccess == true) {
                if (retDat.objData != undefined) {
                    p_SetHiddenObject(retDat.objData);
                    p_DataToUISubbrand(retDat.objData.XXSHP_KDS_T_MKPP_ACT[intActivityIndex].XXSHP_KDS_T_MKPP_BGT[intBudgetIndex].XXSHP_KDS_T_MKPP_SUB);
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
 
function p_DataToUISubbrand(XXSHP_KDS_T_MKPP_SUB) {
    
    oTableSubbrand.clear();
    for (var i = 0; i < XXSHP_KDS_T_MKPP_SUB.length; i++) {
        XXSHP_KDS_T_MKPP_SUB[i].intIndex = i;
        oTableSubbrand.row.add(XXSHP_KDS_T_MKPP_SUB[i]);
    }
    oTableSubbrand.draw(false);

    var objDat = p_GetHiddenObject();
    objDat.XXSHP_KDS_T_MKPP_ACT[intActivityIndex].XXSHP_KDS_T_MKPP_BGT[intBudgetIndex].XXSHP_KDS_T_MKPP_SUB = XXSHP_KDS_T_MKPP_SUB;
    p_SetHiddenObject(objDat);
}
 
function p_RefreshNumberSubbrand() {
    
    var intRowIndex = 0;
    var objDat = p_GetHiddenObject();
    oTableSubbrand.rows().every(function (rowIdx, tableLoop, rowLoop) {
        
        var d = this.data();
        d.intIndex = intRowIndex; // update data source for the row
        objDat.XXSHP_KDS_T_MKPP_ACT[intActivityIndex].XXSHP_KDS_T_MKPP_BGT[intBudgetIndex].XXSHP_KDS_T_MKPP_SUB[intRowIndex].intIndex = d.intIndex;

        d.TXT_SUBBRAND = objDat.XXSHP_KDS_T_MKPP_ACT[intActivityIndex].XXSHP_KDS_T_MKPP_BGT[intBudgetIndex].XXSHP_KDS_T_MKPP_SUB[intRowIndex].TXT_SUBBRAND;
        d.DEC_AMOUNT = objDat.XXSHP_KDS_T_MKPP_ACT[intActivityIndex].XXSHP_KDS_T_MKPP_BGT[intBudgetIndex].XXSHP_KDS_T_MKPP_SUB[intRowIndex].DEC_AMOUNT;
        intRowIndex++;
        this.invalidate(); // invalidate the data DataTables has cached for this row         
    });

    // Draw once all updates are done
    oTableSubbrand.draw(false);
    p_SetHiddenObject(objDat);
}

function p_btnLOVSubBrand_Click(objCaller, intIndex) {
    // Parse dari HiddenObject->JSON
    
    var objDat = JSON.parse(p_UIToData());
    var intSelectedIndex = p_GetSelectedSubbrandRow();
    var txtGroup = objDat.TXT_GROUP_ACCOUNT;
    var txtBudgetType = objDat.TXT_BUDGET_TYPE;
    var txtPeriod = objDat.XXSHP_KDS_T_MKPP_ACT[intActivityIndex].DTM_PERIOD_FROM;
    //var txtPeriod = objDat.DTM_POSTING;
    LOV = clsGlobal.generateLOV(LOV_SUBUMBRAND_BYGROUP_TYPE_PERIOD, "txtSubBrand", txtGroup + "|" + txtBudgetType + "|" + txtPeriod);
}

function p_settxtSubBrand(txtValue, decAmountAvailable) {
    
    var intSelectedIndex = p_GetSelectedSubbrandRow();
    var intRowIndex = 0;
    var objDat = p_GetHiddenObject();
    //validasi gaboleh sama subumbrand nya
    var subUmbrandExist = objDat.XXSHP_KDS_T_MKPP_ACT[intActivityIndex].XXSHP_KDS_T_MKPP_BGT[intBudgetIndex].XXSHP_KDS_T_MKPP_SUB.filter(item => item.TXT_SUBUMBRAND == txtValue);
    if (subUmbrandExist.length == 0) {
        oTableSubbrand.rows().every(function (rowIdx, tableLoop, rowLoop) {

            var d = this.data();
            if (intRowIndex == intSelectedIndex) {
                d.intIndex = intRowIndex; // update data source for the row 

                d.TXT_SUBUMBRAND = txtValue;
                //d.DEC_AMOUNT = objDat.XXSHP_KDS_T_MKPP_ACT[intActivityIndex].XXSHP_KDS_T_MKPP_BGT[intBudgetIndex].XXSHP_KDS_T_MKPP_SUB[intRowIndex].DEC_AMOUNT;
                //d.DEC_AMOUNT = decAmountAvailable.replace(/\./g, '').replace(',', '.'); //diadjust dikit biar langsung masukin total amount sisanya
                d.DEC_AMOUNT = decAmountAvailable; //diadjust dikit biar langsung masukin total amount sisanya

                objDat.XXSHP_KDS_T_MKPP_ACT[intActivityIndex].XXSHP_KDS_T_MKPP_BGT[intBudgetIndex].XXSHP_KDS_T_MKPP_SUB[intRowIndex].TXT_SUBUMBRAND = txtValue;
                objDat.XXSHP_KDS_T_MKPP_ACT[intActivityIndex].XXSHP_KDS_T_MKPP_BGT[intBudgetIndex].XXSHP_KDS_T_MKPP_SUB[intRowIndex].DEC_AMOUNT = decAmountAvailable.replace(/[\u00A0\u202F\s]/g, '').replace(/,/g, '');
                objDat.XXSHP_KDS_T_MKPP_ACT[intActivityIndex].XXSHP_KDS_T_MKPP_BGT[intBudgetIndex].XXSHP_KDS_T_MKPP_SUB[intRowIndex].DEC_AVAILABLE = decAmountAvailable.replace(/[\u00A0\u202F\s]/g, '').replace(/,/g, '');

                this.invalidate(); // invalidate the data DataTables has cached for this row         
                p_EnableControl(clsGlobal.ParseBooleanOracleToNET(objDat.BIT_APPLY), objDat);
            }

            intRowIndex++;
        });

        p_SetHiddenObject(objDat);
    } else {
        clsGlobal.showAlert("SubUmbrand " + txtValue + " sudah dipilih!");
        p_SetHiddenObject(objDat);
    }
    
}
  
function p_txtAmount_Changed(objCaller, intIndex) {
    
    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());
    for (i = 0; i < objData.XXSHP_KDS_T_MKPP_ACT[intActivityIndex].XXSHP_KDS_T_MKPP_BGT[intBudgetIndex].XXSHP_KDS_T_MKPP_SUB.length; i++) {
        // Cari Index-nya.
        if (objData.XXSHP_KDS_T_MKPP_ACT[intActivityIndex].XXSHP_KDS_T_MKPP_BGT[intBudgetIndex].XXSHP_KDS_T_MKPP_SUB[i].intIndex == intIndex) {
            // Ketemu, mulai dari sini:
            var decBudgetAvailable = objData.XXSHP_KDS_T_MKPP_ACT[intActivityIndex].XXSHP_KDS_T_MKPP_BGT[intBudgetIndex].XXSHP_KDS_T_MKPP_SUB[i].DEC_AVAILABLE;
            if (clsGlobal.parseToDecimal(objCaller.value) > decBudgetAvailable) {
                clsGlobal.showAlert("Budget SubUmbrand " + objData.XXSHP_KDS_T_MKPP_ACT[intActivityIndex].XXSHP_KDS_T_MKPP_BGT[intBudgetIndex].XXSHP_KDS_T_MKPP_SUB[i].TXT_SUBUMBRAND + " tidak boleh melebihi " + clsGlobal.parseToRupiah(decBudgetAvailable) + " !");
                objCaller.value = 0;
                break;
            } else if (clsGlobal.parseToDecimal(objCaller.value) < 0) {
                clsGlobal.showAlert("Budget SubUmbrand " + objData.XXSHP_KDS_T_MKPP_ACT[intActivityIndex].XXSHP_KDS_T_MKPP_BGT[intBudgetIndex].XXSHP_KDS_T_MKPP_SUB[i].TXT_SUBUMBRAND + " tidak boleh minus !");
                objCaller.value = 0;
                break;
            } else {
                objData.XXSHP_KDS_T_MKPP_ACT[intActivityIndex].XXSHP_KDS_T_MKPP_BGT[intBudgetIndex].XXSHP_KDS_T_MKPP_SUB[i].DEC_AMOUNT = clsGlobal.parseToDecimal(objCaller.value);
                break;
            }
        }
    }
    p_SetHiddenObject(objData);
}
  
 
function p_btnSubbrandDelete_Click(objCaller, intIndex) {
    
    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());
    for (i = 0; i < objData.XXSHP_KDS_T_MKPP_ACT[intActivityIndex].XXSHP_KDS_T_MKPP_BGT[intBudgetIndex].XXSHP_KDS_T_MKPP_SUB.length; i++) {
        // Cari Index-nya.
        if (objData.XXSHP_KDS_T_MKPP_ACT[intActivityIndex].XXSHP_KDS_T_MKPP_BGT[intBudgetIndex].XXSHP_KDS_T_MKPP_SUB[i].intIndex == intIndex) {
            // Ketemu, mulai dari sini:
            // Remove from list.
            objData.XXSHP_KDS_T_MKPP_ACT[intActivityIndex].XXSHP_KDS_T_MKPP_BGT[intBudgetIndex].XXSHP_KDS_T_MKPP_SUB.splice(i, 1);

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
        
        parent.$("#txtHiddenObject").val($("#txtHiddenObject").val());
        parent.clsGlobal.closePopUpIframe();
        parent.p_setSubBrand();
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
 
  


