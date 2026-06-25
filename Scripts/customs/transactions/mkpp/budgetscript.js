//     KKP SCRIPT - Budget
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
var oTableBudget;

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
    intActivityIndex = $.getParameter("intIndex");
    p_InitiateBudget();  
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
        case "txtDepartment":  
            p_settxtDepartment(arr[1]);
            break;
        case "txtMPPDolphine":  
            p_settxtMPPDolphine(arr[1]);
            break;
        case "txtPPH":
            p_settxtPPH(arr[1],arr[2]);
            break;  
    }
    clsGlobal.closeLOV(); 
}

function p_DataToUI(objDat) {
    
    p_DataToUIBudget(objDat.XXSHP_KDS_T_MKPP_ACT[intActivityIndex].XXSHP_KDS_T_MKPP_BGT);
     
    p_EnableControl(clsGlobal.ParseBooleanOracleToNET(objDat.BIT_APPLY),objDat);
     
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

        $("#btnAddBudget").hide(); //.css("display", "none"); 
        $(".btnLOVDept").each(function (index) {
            $(this).hide(); //.css("display", "none");
        });
        $(".btnLOVMPPDolphine").each(function (index) {
            $(this).hide(); //.css("display", "none");
        });
        $(".btnBudgetDelete").each(function (index) {
            $(this).hide(); //.css("display", "none");
        }); 

    } else if (objDat.TXT_REFDOCNO != "") {
        // Ada Parent.
        $("#btnOK").show();
        $("#btnCancel").show();
        $("#btnAddBudget").hide(); //.css("display", "none"); 
        $(".btnLOVDept").each(function (index) {
            $(this).hide(); //.css("display", "none");
        });
        $(".btnLOVMPPDolphine").each(function (index) {
            $(this).hide(); //.css("display", "none");
        });
        $(".btnBudgetDelete").each(function (index) {
            $(this).hide(); //.css("display", "none");
        });

    } else {
        $("#btnOK").show(); 
        $("#btnCancel").show();
          
        $("#btnAddBudget").show(); 
        $(".btnLOVDept").each(function (index) {
            $(this).show(); //.removeClass("display");
        });
        $(".btnLOVMPPDolphine").each(function (index) {
            $(this).show(); //.removeClass("display");
        }); 
        $(".btnBudgetDelete").each(function (index) {
            $(this).show(); //.removeClass("display");
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
  
function p_GenerateAutoNumeric() {
    
    $('.autonumeric').autoNumeric('init', { vMax: '9999999999999', vMin: '-9999999999999', aSep: ',', dGroup: '3', aDec: '.' });
}
 

// ==========================
// Budget  
// ==========================

function p_GetSelectedBudgetRow() {
    var intIndex = clsGlobal.parseToInteger(oTableBudget.$('tr.selected').find("#lblBudgetNoValue").html()) - 1;
    return intIndex;
}

function p_InitiateBudget() {
    // Format datatable  
    
    oTableBudget = $('#dtBudget').DataTable({
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
                      return '<div id="lblBudgetNoValue" > ' + (full.intIndex + 1) + ' </div>';
                  }
              },
           { 
               aTargets: [1],
               mRender: function (data, type, full) {
                   return '     <div class="input-group"> ' +
                          '       <div class="input-group-btn"> ' +
                          '           <button type="button" class="btn btn-danger btnLOVDept" id="btnLOVDept" onclick="p_btnLOVDept_Click(this,' + full.intIndex + ')"> <i class="fa fa-search"></i></button> ' +
                          '       </div> ' +
                          '       <div class="input-group-btn" style="width:60px;"> ' +
                          '       <input type="text" class="form-control txtDepartment" id="txtDepartment" onchange="p_txtDepartment_Changed(this,' + full.intIndex + ')"  value="' + full.TXT_DEPARTMENT + '" disabled> ' +
                          '       </div> ' +
                          '   </div>';
               }
           },
           { 
               aTargets: [2],
               mRender: function (data, type, full) {
                   if (full.TXT_DEPARTMENT == "MARKETING") { 
                       return '     <div class="input-group"> ' +
                         '       <div class="input-group-btn"> ' +
                         '           <button type="button" class="btn btn-danger btnLOVMPPDolphine" id="btnLOVMPPDolphine" onclick="p_btnLOVMPPDolphine_Click(this,' + full.intIndex + ')"> <i class="fa fa-search"></i></button> ' +
                         '       </div> ' +
                         '       <div class="input-group-btn" style="width:60px;"> ' +
                         '       <input type="text" class="form-control txtMPPDolphine" id="txtMPPDolphine" onchange="p_txtMPPDolphine_Changed(this,' + full.intIndex + ')"  value="' + full.TXT_REFDOCNO_DOLPHINE + '" disabled> ' +
                         '       </div> ' +
                         '   </div>';
                   } else {
                       return ' <div > ' + 
                         '       <div   > ' +
                         '       <input type="text" class="form-control txtMPPDolphine" id="txtMPPDolphine" onchange="p_txtMPPDolphine_Changed(this,' + full.intIndex + ')"  value="' + full.TXT_REFDOCNO_DOLPHINE + '" disabled> ' +
                         '       </div> ' +
                         '   </div>';
                   }
                  
               }
           },
           {
               aTargets: [3],
               mRender: function (data, type, full) {
                   return '<div > <input type="button" class="btn btn-info btnBudgetSubbrand" id="btnBudgetSubbrand" onclick="p_btnBudgetSubbrand_Click(this,' + full.intIndex + ')"  value="Sub Umbrand" >  </div>';
               }
           },
           { 
               aTargets: [4],
               mRender: function (data, type, full) { 
                   return '<div id="lblBudgetAlokasi" class="text-right" style="width:100px;"  > ' + clsGlobal.FormatMoney(full.DEC_ALOKASI,0) + ' </div>';
               }
           }, 
           { 
               aTargets: [5],
               mRender: function (data, type, full) {
                   return '<div > <input type="button" class="btn btn-warning btnBudgetDelete" id="btnBudgetDelete" onclick="p_btnBudgetDelete_Click(this,' + full.intIndex + ')"  value="Delete" >  </div>';
               }
           }
        ]
    });

    $("#dtBudget").css("width", "100%");
    $('#dtBudget tbody').on('click', 'tr', function () {
        if (!$(this).hasClass('selected')) {  
            oTableBudget.$('tr.selected').removeClass('selected');
            $(this).addClass('selected'); 
        }
    });

}

function p_ShowBlankBudget() {
    oTableBudget.clear();
    oTableBudget.draw(false);
}

function p_AddBudget() {
    
    clsGlobal.showLoading();
    $.ajax({
        type: "POST",
        url: "/Transaction/MKPP/AddRowBudget",
        data: { intActivityIndex: intActivityIndex, data: $("#txtHiddenObject").val(), __RequestVerificationToken: $('#frmMKPP input[name=__RequestVerificationToken]').val() },
        datatype: "json",
        success: function (retDat) {
            
            if (retDat.bitSuccess == true) {
                if (retDat.objData != undefined) {
                    p_SetHiddenObject(retDat.objData);
                    p_DataToUIBudget(retDat.objData.XXSHP_KDS_T_MKPP_ACT[intActivityIndex].XXSHP_KDS_T_MKPP_BGT);
                    oTableBudget.page('last').draw(false);
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
 
function p_DataToUIBudget(XXSHP_KDS_T_MKPP_BGT) {
    
    oTableBudget.clear();
    for (var i = 0; i < XXSHP_KDS_T_MKPP_BGT.length; i++) {
        XXSHP_KDS_T_MKPP_BGT[i].intIndex = i;
        oTableBudget.row.add(XXSHP_KDS_T_MKPP_BGT[i]);
    }
    oTableBudget.draw(false);

    var objDat = p_GetHiddenObject();
    objDat.XXSHP_KDS_T_MKPP_ACT[intActivityIndex].XXSHP_KDS_T_MKPP_BGT = XXSHP_KDS_T_MKPP_BGT;
    p_SetHiddenObject(objDat); 
}
 
function p_RefreshNumberBudget() {
    
    var intRowIndex = 0;
    var objDat = p_GetHiddenObject();
    oTableBudget.rows().every(function (rowIdx, tableLoop, rowLoop) {
        
        var d = this.data();
        d.intIndex = intRowIndex; // update data source for the row
        objDat.XXSHP_KDS_T_MKPP_ACT[intActivityIndex].XXSHP_KDS_T_MKPP_BGT[intRowIndex].intIndex = d.intIndex;

        d.txtName = objDat.XXSHP_KDS_T_MKPP_ACT[intActivityIndex].XXSHP_KDS_T_MKPP_BGT[intRowIndex].txtName;
        intRowIndex++;
        this.invalidate(); // invalidate the data DataTables has cached for this row         
    });

    // Draw once all updates are done
    oTableBudget.draw(false);
    p_SetHiddenObject(objDat);
}
  

function p_btnLOVDept_Click(objCaller, intIndex) {
    LOV = clsGlobal.generateLOV(MODULE_DEPARTMENT, "txtDepartment");
}

function p_settxtDepartment(txtValue) {
    
    var intSelectedIndex = p_GetSelectedBudgetRow();
    var intRowIndex = 0;
    var objDat = p_GetHiddenObject();
    oTableBudget.rows().every(function (rowIdx, tableLoop, rowLoop) {
        
        var d = this.data();
        if (intRowIndex == intSelectedIndex) {
            d.intIndex = intRowIndex; // update data source for the row 

            d.TXT_DEPARTMENT = txtValue;
            objDat.XXSHP_KDS_T_MKPP_ACT[intActivityIndex].XXSHP_KDS_T_MKPP_BGT[intRowIndex].TXT_DEPARTMENT = txtValue;

            if (txtValue != "MARKETING") {
                d.TXT_REFDOCNO_DOLPHINE = "";
                objDat.XXSHP_KDS_T_MKPP_ACT[intActivityIndex].XXSHP_KDS_T_MKPP_BGT[intRowIndex].TXT_REFDOCNO_DOLPHINE = "";

                // Jika dipilih KAM, otomatis akan mengambil semua budget tersedia.

                p_SetHiddenObject(objDat);
                clsGlobal.showLoading();
                $.ajax({
                    type: "POST",
                    url: "/Transaction/MKPP/PopulateAvailableSubbrand",
                    data: { intActivityIndex: intActivityIndex, intBudgetIndex :intRowIndex, data: $("#txtHiddenObject").val(), __RequestVerificationToken: $('#frmMKPP input[name=__RequestVerificationToken]').val() },
                    datatype: "json",
                    success: function (retDat) {
                        
                        if (retDat.bitSuccess == true) {
                            if (retDat.objData != undefined) {
                                //buat ngisi value alokasi secara UI karena ketika milih department langsung ngisi subbrand nya
                                d.DEC_ALOKASI = retDat.objData.XXSHP_KDS_T_MKPP_ACT[intActivityIndex].XXSHP_KDS_T_MKPP_BGT[intSelectedIndex].DEC_ALOKASI;

                                p_SetHiddenObject(retDat.objData);
                                p_RefreshNumberBudget();
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

            this.invalidate(); // invalidate the data DataTables has cached for this row         
            p_EnableControl(clsGlobal.ParseBooleanOracleToNET(objDat.BIT_APPLY), objDat);
        }

        intRowIndex++;
    });

    p_SetHiddenObject(objDat);
}



function p_btnLOVMPPDolphine_Click(objCaller, intIndex) {
    LOV = clsGlobal.generateLOV(LOV_DOLPHINE_PP, "txtMPPDolphine");
}

function p_settxtMPPDolphine(txtValue) {
    
    var intSelectedIndex = p_GetSelectedBudgetRow();
    var intRowIndex = 0;
    var objDat = p_GetHiddenObject();
    oTableBudget.rows().every(function (rowIdx, tableLoop, rowLoop) {
        
        var d = this.data();
        if (intRowIndex == intSelectedIndex) {
          
            clsGlobal.showLoading();
            $.ajax({
                type: "POST",
                url: "/Transaction/MKPP/AddPPDolphine",
                data: { intActivityIndex: intActivityIndex, intBudgetIndex:intSelectedIndex, txtPPDolphine :txtValue,  data: $("#txtHiddenObject").val(), __RequestVerificationToken: $('#frmMKPP input[name=__RequestVerificationToken]').val() },
                datatype: "json",
                success: function (retDat) {
                    
                    if (retDat.bitSuccess == true) {
                        if (retDat.objData != undefined) {
                            p_SetHiddenObject(retDat.objData);
                            p_DataToUIBudget(retDat.objData.XXSHP_KDS_T_MKPP_ACT[intActivityIndex].XXSHP_KDS_T_MKPP_BGT);
                            oTableBudget.page('last').draw(false);
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

        intRowIndex++;
    });

    //p_SetHiddenObject(objDat);
}


function p_btnLOVPPH_Click(objCaller, intIndex) {
    var intSelectedIndex = p_GetSelectedBudgetRow();
    var objDat = p_GetHiddenObject();
    LOV = clsGlobal.generateLOV(MODULE_PPH_SUPPLIER_ACTIVITY, "txtPPH", objDat.TXT_SUPPLIER_SITE_CODE + "|" + objDat.XXSHP_KDS_T_MKPP_ACT[intActivityIndex].TXT_ACTIVITYCODE);
}

function p_settxtPPH(txtValue1, txtValue2) {
    
    var intSelectedIndex = p_GetSelectedBudgetRow();
    var intRowIndex = 0;
    var objDat = p_GetHiddenObject();
    oTableBudget.rows().every(function (rowIdx, tableLoop, rowLoop) {
        
        var d = this.data();
        if (intRowIndex == intSelectedIndex) {
            d.intIndex = intRowIndex; // update data source for the row 

            d.TXT_PPH = txtValue1;
            d.DEC_PPH = txtValue2;

            objDat.XXSHP_KDS_T_MKPP_ACT[intActivityIndex].XXSHP_KDS_T_MKPP_BGT[intRowIndex].TXT_PPH = txtValue1;
            objDat.XXSHP_KDS_T_MKPP_ACT[intActivityIndex].XXSHP_KDS_T_MKPP_BGT[intRowIndex].DEC_PPH = txtValue2;

            p_CalculateSubTotal(objDat.XXSHP_KDS_T_MKPP_ACT[intActivityIndex].XXSHP_KDS_T_MKPP_BGT[intRowIndex]);

            d.DEC_SUBTOTAL = objDat.XXSHP_KDS_T_MKPP_ACT[intActivityIndex].XXSHP_KDS_T_MKPP_BGT[intRowIndex].DEC_SUBTOTAL;
            d.DEC_PPH_AMOUNT = objDat.XXSHP_KDS_T_MKPP_ACT[intActivityIndex].XXSHP_KDS_T_MKPP_BGT[intRowIndex].DEC_PPH_AMOUNT;

            this.invalidate(); // invalidate the data DataTables has cached for this row         
            p_EnableControl(clsGlobal.ParseBooleanOracleToNET(objDat.BIT_APPLY),objDat);
        }

        intRowIndex++;
    });

    p_SetHiddenObject(objDat);
}

function p_CalculateSubTotal(objDat) {
    //objDat.DEC_PPH_AMOUNT = objDat.DEC_PPH * objDat.DEC_ALOKASI / 100;
    //objDat.DEC_SUBTOTAL = objDat.DEC_ALOKASI + objDat.DEC_PPH_AMOUNT;
}


function p_chkPostingBudget_Changed(objCaller, intIndex) {
    
    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());
    for (i = 0; i < objData.XXSHP_KDS_T_MKPP_ACT[intActivityIndex].XXSHP_KDS_T_MKPP_BGT.length; i++) {
        // Cari Index-nya.
        if (objData.XXSHP_KDS_T_MKPP_ACT[intActivityIndex].XXSHP_KDS_T_MKPP_BGT[i].intIndex == intIndex) {
            // Ketemu, mulai dari sini:
            objData.XXSHP_KDS_T_MKPP_ACT[intActivityIndex].XXSHP_KDS_T_MKPP_BGT[i].BIT_POSTINGBUDGET = clsGlobal.ParseBooleanNETToOracle(objCaller.checked);
            break;
        }
    }
    p_SetHiddenObject(objData);
}
 
//function p_txtBudgetDesc_Changed(objCaller, intIndex) {
//    
//    // Parse dari HiddenObject->JSON
//    var objData = JSON.parse(p_UIToData());
//    for (i = 0; i < objData.XXSHP_KCO_T_MKPP_ACT[intActivityIndex].XXSHP_KCO_T_MKPP_BGT.length; i++) {
//        // Cari Index-nya.
//        if (objData.XXSHP_KCO_T_MKPP_ACT[intActivityIndex].XXSHP_KCO_T_MKPP_BGT[i].intIndex == intIndex) {
//            // Ketemu, mulai dari sini:
//            objData.XXSHP_KCO_T_MKPP_ACT[intActivityIndex].XXSHP_KCO_T_MKPP_BGT[i].txtDescription = objCaller.value;
//            break;
//        }
//    }
//    p_SetHiddenObject(objData);
//}
 

function p_btnBudgetSubbrand_Click(objCaller, intIndex) {
    
    try {
        // Parse dari HiddenObject->JSON
        var objData = JSON.parse(p_UIToData());
        for (i = 0; i < objData.XXSHP_KDS_T_MKPP_ACT[intActivityIndex].XXSHP_KDS_T_MKPP_BGT.length; i++) {
            // Cari Index-nya.
            if (objData.XXSHP_KDS_T_MKPP_ACT[intActivityIndex].XXSHP_KDS_T_MKPP_BGT[i].intIndex == intIndex) {
                // Ketemu, mulai dari sini:

                //Validasi 
                if (objData.XXSHP_KDS_T_MKPP_ACT[intActivityIndex].XXSHP_KDS_T_MKPP_BGT[i].TXT_DEPARTMENT == "") {
                    throw "Department must be filled!";
                }

                var fancyboxdata = p_GetHiddenObject();
                LOV = clsGlobal.generatePopUpIframe($(location).attr('protocol') + "//" + $(location).attr('host') + "/Transaction/MKPP/Subbrand?intActivityIndex=" + intActivityIndex + "&intBudgetIndex=" + intIndex, "btnBudgetSubbrand", fancyboxdata);
                break;
            }
        }
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
}

function p_CalculateBrandTotal()
{

}

function p_setSubBrand() {
    
    var intSelectedIndex = p_GetSelectedBudgetRow();
    var intRowIndex = 0;
    var objDat = p_GetHiddenObject();
    // Calculate Total Alokasi.
    objDat.XXSHP_KDS_T_MKPP_ACT[intActivityIndex].XXSHP_KDS_T_MKPP_BGT[intSelectedIndex].DEC_ALOKASI = 0;
    for (i = 0; i < objDat.XXSHP_KDS_T_MKPP_ACT[intActivityIndex].XXSHP_KDS_T_MKPP_BGT[intSelectedIndex].XXSHP_KDS_T_MKPP_SUB.length; i++) {
        //var decAmount = clsGlobal.parseToDecimal(objDat.XXSHP_KCO_T_MKPP_ACT[intActivityIndex].XXSHP_KCO_T_MKPP_BGT[intRowIndex].XXSHP_KCO_T_MKPP_SUB[i].DEC_AMOUNT);
        objDat.XXSHP_KDS_T_MKPP_ACT[intActivityIndex].XXSHP_KDS_T_MKPP_BGT[intSelectedIndex].DEC_ALOKASI += objDat.XXSHP_KDS_T_MKPP_ACT[intActivityIndex].XXSHP_KDS_T_MKPP_BGT[intSelectedIndex].XXSHP_KDS_T_MKPP_SUB[i].DEC_AMOUNT;
    }
    //p_CalculateSubTotal(objDat.XXSHP_KCO_T_MKPP_ACT[intActivityIndex].XXSHP_KCO_T_MKPP_BGT[intSelectedIndex]);

    // Show ke table.
    oTableBudget.rows().every(function (rowIdx, tableLoop, rowLoop) {
        
        var d = this.data();
        if (intRowIndex == intSelectedIndex) {
            d.intIndex = intRowIndex; // update data source for the row 

            d.DEC_ALOKASI = objDat.XXSHP_KDS_T_MKPP_ACT[intActivityIndex].XXSHP_KDS_T_MKPP_BGT[intSelectedIndex].DEC_ALOKASI;  
            d.TXT_DEPARTMENT = objDat.XXSHP_KDS_T_MKPP_ACT[intActivityIndex].XXSHP_KDS_T_MKPP_BGT[intSelectedIndex].TXT_DEPARTMENT; 
            d.TXT_REFDOCNO_DOLPHINE = objDat.XXSHP_KDS_T_MKPP_ACT[intActivityIndex].XXSHP_KDS_T_MKPP_BGT[intSelectedIndex].TXT_REFDOCNO_DOLPHINE;                        
             
            this.invalidate(); // invalidate the data DataTables has cached for this row         
            p_EnableControl(clsGlobal.ParseBooleanOracleToNET(objDat.BIT_APPLY),objDat);
        }

        intRowIndex++;
    });

    p_SetHiddenObject(objDat);
}

function p_btnBudgetDelete_Click(objCaller, intIndex) {
    
    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());
    for (i = 0; i < objData.XXSHP_KDS_T_MKPP_ACT[intActivityIndex].XXSHP_KDS_T_MKPP_BGT.length; i++) {
        // Cari Index-nya.
        if (objData.XXSHP_KDS_T_MKPP_ACT[intActivityIndex].XXSHP_KDS_T_MKPP_BGT[i].intIndex == intIndex) {
            // Ketemu, mulai dari sini:
            // Remove from list.
            objData.XXSHP_KDS_T_MKPP_ACT[intActivityIndex].XXSHP_KDS_T_MKPP_BGT.splice(i, 1);

            oTableBudget.row(i).remove().draw(false);
            break;
        }
    }
    p_SetHiddenObject(objData);
    p_RefreshNumberBudget();
}
 
$('#btnAddBudget').on('click', function () {
    try {
        p_AddBudget();
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
});
  
// ==========================
// END: Budget   
// ==========================
 
    
//=======================
// HANDLER
//=======================

$('#btnOK').bind('click', function () {
    try {
        
        //Validasi
        var intActivityIndex = parent.p_GetSelectedActivityRow();
        var intSelectedIndex = p_GetSelectedBudgetRow();
        var intRowIndex = 0;
        var objDat = p_GetHiddenObject();

        var decTotal = 0;
        for (i = 0; i < objDat.XXSHP_KDS_T_MKPP_ACT[intActivityIndex].XXSHP_KDS_T_MKPP_BGT.length; i++) {
            decTotal += objDat.XXSHP_KDS_T_MKPP_ACT[intActivityIndex].XXSHP_KDS_T_MKPP_BGT[i].DEC_ALOKASI;
        }
        objDat.XXSHP_KDS_T_MKPP_ACT[intActivityIndex].DEC_AMOUNT = decTotal;

        parent.$("#txtHiddenObject").val($("#txtHiddenObject").val());
        parent.clsGlobal.closePopUpIframe();
        parent.p_setBudget();
        
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
 
  


