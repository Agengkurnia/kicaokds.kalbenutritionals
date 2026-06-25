//=======================
// VARIABLE GLOBAL
//=======================
var clsGlobal = new clsGlobalClass();
var LOV;
var bitLoading = false;
var intDetailIndex;
var intItemIndex;
var oTableItem;

var AP_AWT_GROUP_TAXES_ALLList = {};
var ZX_RATES_BList = {};
var PPHDESCList = {};

//=======================
// Confirmation
//======================= 

//=======================
// ON PAGE LOAD
//=======================
$(document).ready(function () { 
    p_PopulateDataDropdownList();
    //p_InitForm(); //pindah ke dalam p_PopulateDataDropdownList.
    p_validatePage();
});

//=======================
// FUNCTION
//=======================
function p_InitForm() {
    XXSHP_KDS_T_RFS_ITM = {};
    intDetailIndex = $.getParameter("intIndex");
    p_InitiateItem();
    p_initiateData();
}

function p_validatePage() {
    
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

function setChooseCOA(txtValue) {
    var arr = txtValue.split('|');
    switch (arr[0]) {  
        case "btnCOA":
            p_setbtnCOA(arr[1], arr[2], arr[3]);
            break;
    }
    clsGlobal.closeLOV();
}

function p_DataToUI(objData) {
    
    p_DataToUIItem(objData.XXSHP_KDS_T_RFS_DTL[intDetailIndex].XXSHP_KDS_T_RFS_ITM);

    p_EnableControl(clsGlobal.ParseBooleanOracleToNET(objData.BIT_APPLY));

    p_SetHiddenObject(objData);
    if ($("#txtID").val() == "" || $("#txtID").val() == "0") {
        $("#btnDelete").hide();
    } else {
        $("#btnDelete").show();
    }
}

function p_EnableControl(bitApply) {
    
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

}

function p_GenerateAutoNumeric() {
    
    $('.autonumeric').autoNumeric('init', { vMax: '9999999999999.99', vMin: '-9999999999999.99', aSep: ',', dGroup: '3', aDec: '.' });
}
 
function p_GenerateDateTimePicker() {
    
    $('.kalendertarget').datepicker({
        autoclose: true,
    });

}

function p_PopulateDataDropdownList() {
    // PPN
    clsGlobal.showLoading();
    
    $.ajax({
        type: "POST",
        url: "/Main/PopulateTipePPN",
        data: { __RequestVerificationToken: $('#FormLogin input[name=__RequestVerificationToken]').val() },
        datatype: "json",
        success: function (retDat) {
            if (retDat.bitSuccess == true) {
                
                if (retDat.objData != undefined) {
                    ZX_RATES_BList = retDat.objData;

                    // Populate ke All
                    $('#ddlPPN_ALL').empty();
                    $('#ddlPPN_ALL').append($('<option>').text("-").prop('value', "0"));
                    
                    for (var i = 0; i < ZX_RATES_BList.length; i++) {
                        $('#ddlPPN_ALL').append($('<option>').text(ZX_RATES_BList[i].TAX_RATE_CODE).prop('value', ZX_RATES_BList[i].TAX_RATE_CODE + ";" + ZX_RATES_BList[i].PERCENTAGE_RATE));
                    }  

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

                                    // Populate ke All
                                    $('#ddlPPH_ALL').empty();
                                    $('#ddlPPH_ALL').append($('<option>').text("-").prop('value', "0"));
                    
                                    for (var i = 0; i < AP_AWT_GROUP_TAXES_ALLList.length; i++) {
                                        $('#ddlPPH_ALL').append($('<option>').text(AP_AWT_GROUP_TAXES_ALLList[i].TAX_NAME).prop('value', AP_AWT_GROUP_TAXES_ALLList[i].GROUP_ID + ";" + AP_AWT_GROUP_TAXES_ALLList[i].TAX_NAME + ";" + AP_AWT_GROUP_TAXES_ALLList[i].TAX_RATE));
                                    }   


                                    // PPH DESC
                                    clsGlobal.showLoading();
                                    
                                    $.ajax({
                                        type: "POST",
                                        url: "/Main/PopulatePPHDesc",
                                        data: { __RequestVerificationToken: $('#frmRFA input[name=__RequestVerificationToken]').val() },
                                        datatype: "json",
                                        success: function (retDat) {
                                            if (retDat.bitSuccess == true) {
                                                
                                                if (retDat.objData != undefined) {
                                                    PPHDESCList = retDat.objData;

                                                    // Populate ke All
                                                    $('#ddlPPHDesc_ALL').empty();
                                                    $('#ddlPPHDesc_ALL').append($('<option>').text("-").prop('value', "0"));
                    
                                                    for (var i = 0; i < PPHDESCList.length; i++) { 
                                                        //if (clsGlobal.parseToString(PPHDESCList[i].FLEX_VALUE_SET_NAME).indexOf(full.TXT_WITH_HOLDING_TYPE) != -1) {
                                                            $('#ddlPPHDesc_ALL').append($('<option>').text(PPHDESCList[i].FLEX_VALUE).prop('value', PPHDESCList[i].FLEX_VALUE));
                                                        //}
                                                    }    

                                                    // Terakhir.
                                                    p_InitForm();
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
// Subbrand  
// ==========================

function p_GetSelectedItemRow() {
    var intIndex = clsGlobal.parseToInteger(oTableItem.$('tr.selected').find("#lblItemNoValue").html()) - 1;
    return intIndex;
}

function p_InitiateItem() {
    // Format datatable  
    
    oTableItem = $('#dtItem').DataTable({
        "bPaginate": true,
        "bSort": false,
        searching: true,
        "type": "POST",
        "scrollX": true,
        aoColumnDefs: [
              { 
                  aTargets: [0],
                  mRender: function (data, type, full) {
                      return '<div id="lblItemNoValue" > ' + (full.intIndex + 1) + ' </div>';
                  }
              },
           {
               aTargets: [1],
               mRender: function (data, type, full) {
                   return '<div >  <input type="text" class="form-control txtItemDescription text-upper"  id="txtItemDescription" onchange="p_txtItemDescription_Changed(this,' + full.intIndex + ')"  value="' + clsGlobal.parseToString(full.TXT_DESCRIPTION) + '"   maxlength="220">  </div>';
               }
           },
           {
               aTargets: [2],
               mRender: function (data, type, full) {
                   return '<div >  <input type="text" class="form-control txtItemUnitPrice text-right autonumeric"  id="txtItemUnitPrice" onchange="p_txtItemUnitPrice_Changed(this,' + full.intIndex + ')"  value="' + clsGlobal.parseToString(full.DEC_UNITPRICE) + '" >  </div>';
               }
           },
           {
               aTargets: [3],
               mRender: function (data, type, full) {
                   return '<div >  <input type="text" class="form-control text-right txtItemQtyInvoiced autonumeric" readonly="readonly" id="txtItemQtyInvoiced" onchange="p_txtItemQtyInvoiced_Changed(this,' + full.intIndex + ')"  value="' + clsGlobal.parseToString(full.DEC_QTYINVOICED) + '" >  </div>';
               }
           },
           {
               aTargets: [4],
               mRender: function (data, type, full) {
                   return '<div >  <input type="text" class="form-control text-right txtItemAmount autonumeric"  id="txtItemAmount" onchange="p_txtItemAmount_Changed(this,' + full.intIndex + ')"  value="' + clsGlobal.parseToString(full.DEC_AMOUNT) + '" disabled >  </div>';
               }
           },
           {
               aTargets: [5],
               mRender: function (data, type, full) {
                   if (clsGlobal.ParseBooleanOracleToNET(full.BIT_SUNDRYCOA)) {
                       return '<div > <input type="checkbox" id="chkCOASundry" class="chkCOASundry" onchange="p_chkCOASundry_Changed(this,' + full.intIndex + ')"  checked="' + clsGlobal.ParseBooleanOracleToNET(full.BIT_SUNDRYCOA) + '" >  </div>';
                   } else {
                       return '<div > <input type="checkbox" id="chkCOASundry" class="chkCOASundry" onchange="p_chkCOASundry_Changed(this,' + full.intIndex + ')" >  </div>';
                   }

               }
           },
           {
               aTargets: [6],
               mRender: function (data, type, full) {
                   //return '<div >  <input type="text" class="form-control txtItemCOA"  id="txtItemCOA" onchange="p_txtItemCOA_Changed(this,' + full.intIndex + ')"  value="' + clsGlobal.parseToString(full.TXT_COA) + '" >  </div>';
                   return '     <div class="input-group"> ' +
                           '       <div class="input-group-btn"  > ' +
                           '           <button type="button" class="btn btn-danger btnLOV_COA" id="btnLOV_COA" onclick="p_btnLOV_COA_Click(this,' + full.intIndex + ')"> <i class="fa fa-search"></i></button> ' +
                           '       </div> ' +
                           '       <div class="input-group-btn" style="width:100%;"> ' +
                           '       <input type="text" class="form-control txtActivityCode" style="width:300px;" id="txtItemCOA" value="' + full.TXT_COA + '" disabled> ' +
                           '       </div> ' +
                           '   </div>';
               }
           },
           {
               aTargets: [7],
               mRender: function (data, type, full) {
                   var txtResult = "";
                   txtResult += "<select class='form-control' id='ddlPPN' onchange='p_ddlPPN_TextChanged(this," + full.intIndex + ")'>";
                   txtResult += "<option value=''>-</option>";
                   for (var i = 0; i < ZX_RATES_BList.length; i++) {
                       if (ZX_RATES_BList[i].TAX_RATE_CODE == full.TXT_PPNTAXRATE_CODE) {
                           txtResult += "<option value='" + ZX_RATES_BList[i].TAX_RATE_CODE + ";" + ZX_RATES_BList[i].PERCENTAGE_RATE + "' selected>" + ZX_RATES_BList[i].TAX_RATE_CODE + "</option>";
                       } else {
                           txtResult += "<option value='" + ZX_RATES_BList[i].TAX_RATE_CODE + ";" + ZX_RATES_BList[i].PERCENTAGE_RATE + "' >" + ZX_RATES_BList[i].TAX_RATE_CODE + "</option>";
                       }
                   }
                   txtResult += "</select>";
                   return txtResult;
               }
           },
           {
               aTargets: [8],
               mRender: function (data, type, full) {
                   return '<div >  <input type="text" class="form-control txtItemPPNPercentage text-right autonumeric"  id="txtItemPPNPercentage' + full.intIndex + '" value="' + clsGlobal.parseToString(full.DEC_PPN_PERCENTAGE) + '" disabled >  </div>';
               }
           },
           {
               aTargets: [9],
               mRender: function (data, type, full) {
                   return '<div >  <input type="text" class="form-control txtItemNilaiPPN  text-right autonumeric"  id="txtItemNilaiPPN" onchange="p_txtItemNilaiPPN_TextChanged(this,' + full.intIndex + ')" value="' + full.DEC_PPN + '" >  </div>';
               }
           },
           {
               aTargets: [10],
               mRender: function (data, type, full) { 
                   var txtResult = "";
                   txtResult += "<select class='form-control' id='ddlPPH' onchange='p_ddlPPH_TextChanged(this," + full.intIndex + ")'>";
                   txtResult += "<option value=''>-</option>";
                   for (var i = 0; i < AP_AWT_GROUP_TAXES_ALLList.length; i++) {
                       if (AP_AWT_GROUP_TAXES_ALLList[i].GROUP_ID == full.INT_WITH_HOLDING_GROUP_ID) {
                           txtResult += "<option value='" + AP_AWT_GROUP_TAXES_ALLList[i].GROUP_ID + ";" + AP_AWT_GROUP_TAXES_ALLList[i].TAX_NAME + ";" + AP_AWT_GROUP_TAXES_ALLList[i].TAX_RATE + "' selected>" + AP_AWT_GROUP_TAXES_ALLList[i].TAX_NAME + "</option>";
                       } else {
                           txtResult += "<option value='" + AP_AWT_GROUP_TAXES_ALLList[i].GROUP_ID + ";" + AP_AWT_GROUP_TAXES_ALLList[i].TAX_NAME + ";" + AP_AWT_GROUP_TAXES_ALLList[i].TAX_RATE + "' >" + AP_AWT_GROUP_TAXES_ALLList[i].TAX_NAME + "</option>";
                       }
                   }
                   txtResult += "</select>";
                   return txtResult;
               }
           },
           {
               aTargets: [11],
               mRender: function (data, type, full) {
                   return '<div >  <input type="text" class="form-control txtItemWithHoldPercentage"  id="txtItemWithHoldPercentage"  value="' + full.TXT_WITH_HOLDING_PERCENTAGE + '" disabled >  </div>';
               }
           },
           {
               aTargets: [12],
               mRender: function (data, type, full) {
                   return '<div >  <input type="text" class="form-control txtItemWithHoldRate"  id="txtItemWithHoldRate"  value="' + full.TXT_WITH_HOLDING_RATE + '" disabled >  </div>';
               }
           },
           {
               aTargets: [13],
               mRender: function (data, type, full) {
                   return '<div >  <input type="text" class="form-control txtItemWithHoldAmount"  id="txtItemWithHoldAmount" value="' + clsGlobal.FormatMoney(full.TXT_WITH_HOLDING_AMOUNT, 0) + '" disabled >  </div>';
               }
           },
           {
               aTargets: [14],
               mRender: function (data, type, full) {
                   return '<div >  <input type="text" class="form-control txtItemWithHoldTaxAmount"  id="txtItemWithHoldTaxAmount" value="' + clsGlobal.FormatMoney(full.TXT_WITH_HOLDING_TAX_AMOUNT,0) + '" disabled >  </div>';
               }
           },
            {
                aTargets: [15],
                mRender: function (data, type, full) {
                     var txtResult = "";
                    txtResult += "<select class='form-control' id='ddlPPHDesc' onchange='p_ddlPPHDesc_TextChanged(this," + full.intIndex + ")'>";
                    txtResult += "<option value=''>-</option>";
                    for (var i = 0; i < PPHDESCList.length; i++) { 
                        if (clsGlobal.parseToString(PPHDESCList[i].FLEX_VALUE_SET_NAME).indexOf(full.TXT_WITH_HOLDING_TYPE) != -1) {
                            if (PPHDESCList[i].FLEX_VALUE == full.TXT_WITH_HOLDING_DESC) {
                                txtResult += "<option value='" + PPHDESCList[i].FLEX_VALUE + "' selected>" + PPHDESCList[i].FLEX_VALUE + "</option>";
                            } else {
                                txtResult += "<option value='" + PPHDESCList[i].FLEX_VALUE + "' >" + PPHDESCList[i].FLEX_VALUE + "</option>";
                            }
                        } 
                    }
                    txtResult += "</select>";
                    return txtResult;
                }
            },
            {
                aTargets: [16],
                mRender: function (data, type, full) {
                    return '<div >  <input type="text" class="form-control txtItemWithHoldDescription2"  id="txtItemWithHoldDescription2" onchange="p_txtItemWithHoldDescription2_Changed(this,' + full.intIndex + ')"  value="' + clsGlobal.parseToString(full.TXT_WITH_HOLDING_DESC2) + '" >  </div>';
                    //var txtResult = "";
                    //txtResult += "<select class='form-control' id='ddlPPHDesc2' onchange='p_ddlPPHDesc2_TextChanged(this," + full.intIndex + ")'>";
                    //txtResult += "<option value=''>-</option>";
                    //for (var i = 0; i < PPHDESCList.length; i++) {
                    //    if (clsGlobal.parseToString(PPHDESCList[i].FLEX_VALUE_SET_NAME).indexOf(full.TXT_WITH_HOLDING_TYPE) != -1) {
                    //        if (PPHDESCList[i].FLEX_VALUE == full.TXT_WITH_HOLDING_DESC2) {
                    //            txtResult += "<option value='" + PPHDESCList[i].FLEX_VALUE + "' selected>" + PPHDESCList[i].FLEX_VALUE + "</option>";
                    //        } else {
                    //            txtResult += "<option value='" + PPHDESCList[i].FLEX_VALUE + "' >" + PPHDESCList[i].FLEX_VALUE + "</option>";
                    //        }
                    //    }
                    //}
                    //txtResult += "</select>";
                    //return txtResult;
                }
            },
           {
               aTargets: [17],
               mRender: function (data, type, full) {
                   return '<div > <input type="button" class="btn btn-warning btnItemDelete" id="btnItemDelete" onclick="p_btnItemDelete_Click(this,' + full.intIndex + ')"  value="Delete" >  </div>';
               }
           }
        ]
    });

    $("#dtItem").css("width", "100%");
    $('#dtItem tbody').on('click', 'tr', function () {
        if (!$(this).hasClass('selected')) {
            oTableItem.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
        }
    });

}

function p_ShowBlankItem() {
    oTableItem.clear();
    oTableItem.draw(false);
}

function p_GetSelectedItemRow() {
    var intIndex = clsGlobal.parseToInteger(oTableItem.$('tr.selected').find("#lblItemNoValue").html()) - 1;
    return intIndex;
}

function p_AddItem() {
    
    clsGlobal.showLoading();
    $.ajax({
        type: "POST",
        url: "/Transaction/RFS/AddRowItem",
        data: { intDetailIndex: intDetailIndex, intItemIndex: intItemIndex, data: $("#txtHiddenObject").val(), __RequestVerificationToken: $('#frmRFS input[name=__RequestVerificationToken]').val() },
        datatype: "json",
        success: function (retDat) {
            
            if (retDat.bitSuccess == true) {
                if (retDat.objData != undefined) {
                    p_SetHiddenObject(retDat.objData);
                    p_DataToUIItem(retDat.objData.XXSHP_KDS_T_RFS_DTL[intDetailIndex].XXSHP_KDS_T_RFS_ITM);
                    oTableItem.page('last').draw(false);
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

function p_DataToUIItem(XXSHP_KDS_T_RFS_ITM) {
    
    oTableItem.clear();
    for (var i = 0; i < XXSHP_KDS_T_RFS_ITM.length; i++) {
        XXSHP_KDS_T_RFS_ITM[i].intIndex = i;
        oTableItem.row.add(XXSHP_KDS_T_RFS_ITM[i]);
    }
    oTableItem.draw(false);

    var objDat = p_GetHiddenObject();
    objDat.XXSHP_KDS_T_RFS_DTL[intDetailIndex].XXSHP_KDS_T_RFS_ITM = XXSHP_KDS_T_RFS_ITM;

    p_SetHiddenObject(objDat);
}

function p_RefreshNumberItem() {
    
    var intRowIndex = 0;
    var objDat = p_GetHiddenObject();
    oTableItem.rows().every(function (rowIdx, tableLoop, rowLoop) {
        
        var d = this.data();
        d.intIndex = intRowIndex; // update data source for the row
        objDat.XXSHP_KDS_T_RFS_DTL[intDetailIndex].XXSHP_KDS_T_RFS_ITM[intRowIndex].intIndex = d.intIndex;

        d.TXT_DESCRIPTION = objDat.XXSHP_KDS_T_RFS_DTL[intDetailIndex].XXSHP_KDS_T_RFS_ITM[intRowIndex].TXT_DESCRIPTION;
        d.TXT_PONUMBER = objDat.XXSHP_KCDST_RFS_DTL[intDetailIndex].XXSHP_KDS_T_RFS_ITM[intRowIndex].TXT_PONUMBER;
        d.TXT_POLINENUMBER = objDat.XXSHP_KDS_T_RFS_DTL[intDetailIndex].XXSHP_KDS_T_RFS_ITM[intRowIndex].TXT_POLINENUMBER;
        d.DEC_AMOUNT = objDat.XXSHP_KDS_T_RFS_DTL[intDetailIndex].XXSHP_KDS_T_RFS_ITM[intRowIndex].DEC_AMOUNT;
        d.DEC_QTYINVOICED = objDat.XXSHP_KDS_T_RFS_DTL[intDetailIndex].XXSHP_KDS_T_RFS_ITM[intRowIndex].DEC_QTYINVOICED;
        d.TXT_UOM = objDat.XXSHP_KDS_T_RFS_DTL[intDetailIndex].XXSHP_KDS_T_RFS_ITM[intRowIndex].TXT_UOM;
        d.TXT_GRNNUMBER = objDat.XXSHP_KDS_T_RFS_DTL[intDetailIndex].XXSHP_KDS_T_RFS_ITM[intRowIndex].TXT_GRNNUMBER;
        d.DTM_GRN_DATE = objDat.XXSHP_KDS_T_RFS_DTL[intDetailIndex].XXSHP_KDS_T_RFS_ITM[intRowIndex].DTM_GRN_DATE;
        d.TXT_GRNLINENUMBER = objDat.XXSHP_KDS_T_RFS_DTL[intDetailIndex].XXSHP_KDS_T_RFS_ITM[intRowIndex].TXT_GRNLINENUMBER;
        d.DTM_GL_DATE = objDat.XXSHP_KDS_T_RFS_DTL[intDetailIndex].XXSHP_KDS_T_RFS_ITM[intRowIndex].DTM_GL_DATE;
        d.TXT_COA = objDat.XXSHP_KDS_T_RFS_DTL[intDetailIndex].XXSHP_KDS_T_RFS_ITM[intRowIndex].TXT_COA;
        d.DEC_UNITPRICE = objDat.XXSHP_KDS_T_RFS_DTL[intDetailIndex].XXSHP_KDS_T_RFS_ITM[intRowIndex].DEC_UNITPRICE;
        d.BIT_SUNDRYCOA = objDat.XXSHP_KDS_T_RFS_DTL[intDetailIndex].XXSHP_KDS_T_RFS_ITM[intRowIndex].BIT_SUNDRYCOA;
        d.TXT_PPNRATE_ID = objDat.XXSHP_KDS_T_RFS_DTL[intDetailIndex].XXSHP_KDS_T_RFS_ITM[intRowIndex].TXT_PPNRATE_ID;
        d.DEC_PPN_PERCENTAGE = objDat.XXSHP_KDS_T_RFS_DTL[intDetailIndex].XXSHP_KDS_T_RFS_ITM[intRowIndex].DEC_PPN_PERCENTAGE;
        d.DEC_PPN = objDat.XXSHP_KDS_T_RFS_DTL[intDetailIndex].XXSHP_KDS_T_RFS_ITM[intRowIndex].DEC_PPN;
        d.TXT_PPNTAXRATE_CODE = objDat.XXSHP_KDS_T_RFS_DTL[intDetailIndex].XXSHP_KDS_T_RFS_ITM[intRowIndex].TXT_PPNTAXRATE_CODE;
        d.INT_WITH_HOLDING_GROUP_ID = objDat.XXSHP_KDS_T_RFS_DTL[intDetailIndex].XXSHP_KDS_T_RFS_ITM[intRowIndex].INT_WITH_HOLDING_GROUP_ID;
        d.TXT_WITH_HOLDING_TYPE = objDat.XXSHP_KDS_T_RFS_DTL[intDetailIndex].XXSHP_KDS_T_RFS_ITM[intRowIndex].TXT_WITH_HOLDING_TYPE;
        d.TXT_WITH_HOLDING_PERCENTAGE = objDat.XXSHP_KDS_T_RFS_DTL[intDetailIndex].XXSHP_KDS_T_RFS_ITM[intRowIndex].TXT_WITH_HOLDING_PERCENTAGE;
        d.TXT_WITH_HOLDING_RATE = objDat.XXSHP_KDS_T_RFS_DTL[intDetailIndex].XXSHP_KDS_T_RFS_ITM[intRowIndex].TXT_WITH_HOLDING_RATE;
        d.TXT_WITH_HOLDING_AMOUNT = objDat.XXSHP_KDS_T_RFS_DTL[intDetailIndex].XXSHP_KSD_T_RFS_ITM[intRowIndex].TXT_WITH_HOLDING_AMOUNT;
        d.TXT_WITH_HOLDING_TAX_AMOUNT = objDat.XXSHP_KDS_T_RFS_DTL[intDetailIndex].XXSHP_KDS_T_RFS_ITM[intRowIndex].TXT_WITH_HOLDING_TAX_AMOUNT;
        d.TXT_WITH_HOLDING_DESC = objDat.XXSHP_KDS_T_RFS_DTL[intDetailIndex].XXSHP_KDS_T_RFS_ITM[intRowIndex].TXT_WITH_HOLDING_DESC;
        d.TXT_WITH_HOLDING_DESC2 = objDat.XXSHP_KDS_T_RFS_DTL[intDetailIndex].XXSHP_KDS_T_RFS_ITM[intRowIndex].TXT_WITH_HOLDING_DESC2;
        intRowIndex++;
        this.invalidate(); // invalidate the data DataTables has cached for this row         
    });

    // Draw once all updates are done
    oTableItem.draw(false);
    p_SetHiddenObject(objDat);
}
 
function p_RefreshDataRow() {
    
    var intSelectedIndex = p_GetSelectedItemRow();
    var intRowIndex = 0;
    var objDat = p_GetHiddenObject();
    oTableItem.rows().every(function (rowIdx, tableLoop, rowLoop) {
        
        var d = this.data();
        if (intRowIndex == intSelectedIndex) {
            d.intIndex = intRowIndex; // update data source for the row
            objDat.XXSHP_KDS_T_RFS_DTL[intDetailIndex].XXSHP_KDS_T_RFS_ITM[intRowIndex].intIndex = d.intIndex;

            d.TXT_DESCRIPTION = objDat.XXSHP_KDS_T_RFS_DTL[intDetailIndex].XXSHP_KDS_T_RFS_ITM[intRowIndex].TXT_DESCRIPTION;
            d.TXT_PONUMBER = objDat.XXSHP_KDS_T_RFS_DTL[intDetailIndex].XXSHP_KDS_T_RFS_ITM[intRowIndex].TXT_PONUMBER;
            d.TXT_POLINENUMBER = objDat.XXSHP_KDS_T_RFS_DTL[intDetailIndex].XXSHP_KDS_T_RFS_ITM[intRowIndex].TXT_POLINENUMBER;
            d.DEC_AMOUNT = objDat.XXSHP_KDS_T_RFS_DTL[intDetailIndex].XXSHP_KDS_T_RFS_ITM[intRowIndex].DEC_AMOUNT;
            d.DEC_QTYINVOICED = objDat.XXSHP_KDS_T_RFS_DTL[intDetailIndex].XXSHP_KDS_T_RFS_ITM[intRowIndex].DEC_QTYINVOICED;
            d.TXT_UOM = objDat.XXSHP_KDS_T_RFS_DTL[intDetailIndex].XXSHP_KDS_T_RFS_ITM[intRowIndex].TXT_UOM;
            d.TXT_GRNNUMBER = objDat.XXSHP_KDS_T_RFS_DTL[intDetailIndex].XXSHP_KDS_T_RFS_ITM[intRowIndex].TXT_GRNNUMBER;
            d.DTM_GRN_DATE = objDat.XXSHP_KDS_T_RFS_DTL[intDetailIndex].XXSHP_KDS_T_RFS_ITM[intRowIndex].DTM_GRN_DATE;
            d.TXT_GRNLINENUMBER = objDat.XXSHP_KDS_T_RFS_DTL[intDetailIndex].XXSHP_KDS_T_RFS_ITM[intRowIndex].TXT_GRNLINENUMBER;
            d.DTM_GL_DATE = objDat.XXSHP_KDS_T_RFS_DTL[intDetailIndex].XXSHP_KDS_T_RFS_ITM[intRowIndex].DTM_GL_DATE;
            d.TXT_COA = objDat.XXSHP_KDS_T_RFS_DTL[intDetailIndex].XXSHP_KDS_T_RFS_ITM[intRowIndex].TXT_COA;
            d.DEC_UNITPRICE = objDat.XXSHP_KDS_T_RFS_DTL[intDetailIndex].XXSHP_KDS_T_RFS_ITM[intRowIndex].DEC_UNITPRICE;
            d.BIT_SUNDRYCOA = objDat.XXSHP_KDS_T_RFS_DTL[intDetailIndex].XXSHP_KDS_T_RFS_ITM[intRowIndex].BIT_SUNDRYCOA;
            d.TXT_PPNRATE_ID = objDat.XXSHP_KDS_T_RFS_DTL[intDetailIndex].XXSHP_KDS_T_RFS_ITM[intRowIndex].TXT_PPNRATE_ID;
            d.DEC_PPN_PERCENTAGE = objDat.XXSHP_KDS_T_RFS_DTL[intDetailIndex].XXSHP_KDS_T_RFS_ITM[intRowIndex].DEC_PPN_PERCENTAGE;
            d.TXT_PPNTAXRATE_CODE = objDat.XXSHP_KDS_T_RFS_DTL[intDetailIndex].XXSHP_KDS_T_RFS_ITM[intRowIndex].TXT_PPNTAXRATE_CODE;
            d.INT_WITH_HOLDING_GROUP_ID = objDat.XXSHP_KDS_T_RFS_DTL[intDetailIndex].XXSHP_KDS_T_RFS_ITM[intRowIndex].INT_WITH_HOLDING_GROUP_ID;
            d.TXT_WITH_HOLDING_TYPE = objDat.XXSHP_KDS_T_RFS_DTL[intDetailIndex].XXSHP_KDS_T_RFS_ITM[intRowIndex].TXT_WITH_HOLDING_TYPE;
            d.TXT_WITH_HOLDING_PERCENTAGE = objDat.XXSHP_KDS_T_RFS_DTL[intDetailIndex].XXSHP_KDS_T_RFS_ITM[intRowIndex].TXT_WITH_HOLDING_PERCENTAGE;
            d.TXT_WITH_HOLDING_RATE = objDat.XXSHP_KDS_T_RFS_DTL[intDetailIndex].XXSHP_KDS_T_RFS_ITM[intRowIndex].TXT_WITH_HOLDING_RATE;
            d.TXT_WITH_HOLDING_AMOUNT = objDat.XXSHP_KDS_T_RFS_DTL[intDetailIndex].XXSHP_KDS_T_RFS_ITM[intRowIndex].TXT_WITH_HOLDING_AMOUNT;
            d.TXT_WITH_HOLDING_TAX_AMOUNT = objDat.XXSHP_KDS_T_RFS_DTL[intDetailIndex].XXSHP_KDS_T_RFS_ITM[intRowIndex].TXT_WITH_HOLDING_TAX_AMOUNT;
            d.TXT_WITH_HOLDING_DESC = objDat.XXSHP_KDS_T_RFS_DTL[intDetailIndex].XXSHP_KDS_T_RFS_ITM[intRowIndex].TXT_WITH_HOLDING_DESC;
            d.TXT_WITH_HOLDING_DESC2 = objDat.XXSHP_KDS_T_RFS_DTL[intDetailIndex].XXSHP_KDS_T_RFS_ITM[intRowIndex].TXT_WITH_HOLDING_DESC2;
            d.DEC_PPN = objDat.XXSHP_KDS_T_RFS_DTL[intDetailIndex].XXSHP_KDS_T_RFS_ITM[intRowIndex].DEC_PPN;
         
            this.invalidate(); // invalidate the data DataTables has cached for this row         
        }
        intRowIndex++;
        
    });

    //AutoNumeric.
    p_GenerateAutoNumeric();
    p_GenerateDateTimePicker();

}
 
function p_txtItemDescription_Changed(objCaller, intIndex) {
    
    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());
    for (i = 0; i < objData.XXSHP_KDS_T_RFS_DTL[intDetailIndex].XXSHP_KDS_T_RFS_ITM.length; i++) {
        // Cari Index-nya.
        if (objData.XXSHP_KDS_T_RFS_DTL[intDetailIndex].XXSHP_KDS_T_RFS_ITM[i].intIndex == intIndex) {
            // Ketemu, mulai dari sini:
            objData.XXSHP_KDS_T_RFS_DTL[intDetailIndex].XXSHP_KDS_T_RFS_ITM[i].TXT_DESCRIPTION = objCaller.value;
            break;
        }
    }
    p_SetHiddenObject(objData);
}
 
//function p_txtItemAmount_Changed(objCaller, intIndex) {
//    
//    // Parse dari HiddenObject->JSON
//    var objData = JSON.parse(p_UIToData());
//    for (i = 0; i < objData.XXSHP_KCO_T_RFS_DTL[intDetailIndex].XXSHP_KCO_T_RFS_ITM.length; i++) {
//        // Cari Index-nya.
//        if (objData.XXSHP_KCO_T_RFS_DTL[intDetailIndex].XXSHP_KCO_T_RFS_ITM[i].intIndex == intIndex) {
//            // Ketemu, mulai dari sini:
//            objData.XXSHP_KCO_T_RFS_DTL[intDetailIndex].XXSHP_KCO_T_RFS_ITM[i].DEC_AMOUNT = clsGlobal.parseToDecimal(objCaller.value);
//            break;
//        }
//    }
//    p_SetHiddenObject(objData);
//}

function p_txtItemQtyInvoiced_Changed(objCaller, intIndex) {
    
    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());
    for (i = 0; i < objData.XXSHP_KDS_T_RFS_DTL[intDetailIndex].XXSHP_KDS_T_RFS_ITM.length; i++) {
        // Cari Index-nya.
        if (objData.XXSHP_KDS_T_RFS_DTL[intDetailIndex].XXSHP_KDS_T_RFS_ITM[i].intIndex == intIndex) {
            // Ketemu, mulai dari sini:
            objData.XXSHP_KDS_T_RFS_DTL[intDetailIndex].XXSHP_KDS_T_RFS_ITM[i].DEC_QTYINVOICED = clsGlobal.parseToDecimal(objCaller.value);

            // Calculate 
            objData = p_CalculateInvoiceAmount(objData, intDetailIndex, i);
            break;
        }
    }
    p_SetHiddenObject(objData);
    p_RefreshDataRow();
}

function p_txtItemUnitPrice_Changed(objCaller, intIndex) {
    
    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());
    for (i = 0; i < objData.XXSHP_KDS_T_RFS_DTL[intDetailIndex].XXSHP_KDS_T_RFS_ITM.length; i++) {
        // Cari Index-nya.
        if (objData.XXSHP_KDS_T_RFS_DTL[intDetailIndex].XXSHP_KDS_T_RFS_ITM[i].intIndex == intIndex) {
            // Ketemu, mulai dari sini:
            objData.XXSHP_KDS_T_RFS_DTL[intDetailIndex].XXSHP_KDS_T_RFS_ITM[i].DEC_UNITPRICE = clsGlobal.parseToDecimal(objCaller.value);

            // Calculate 
            objData = p_CalculateInvoiceAmount(objData, intDetailIndex, i);
            break;
        }
    }
    p_SetHiddenObject(objData);
    p_RefreshDataRow();
}

function p_txtItemWithHoldDescription2_Changed(objCaller, intIndex) {
    
    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());
    for (i = 0; i < objData.XXSHP_KDS_T_RFS_DTL[intDetailIndex].XXSHP_KDS_T_RFS_ITM.length; i++) {
        // Cari Index-nya.
        if (objData.XXSHP_KDS_T_RFS_DTL[intDetailIndex].XXSHP_KDS_T_RFS_ITM[i].intIndex == intIndex) {
            // Ketemu, mulai dari sini:
            objData.XXSHP_KDS_T_RFS_DTL[intDetailIndex].XXSHP_KDS_T_RFS_ITM[i].TXT_WITH_HOLDING_DESC2 = objCaller.value;
             
            break;
        }
    }
    p_SetHiddenObject(objData);
    p_RefreshDataRow();
}


function p_CalculateInvoiceAmount(objData, intDetailIndex, i) {
    objData.XXSHP_KDS_T_RFS_DTL[intDetailIndex].XXSHP_KDS_T_RFS_ITM[i].DEC_AMOUNT = objData.XXSHP_KDS_T_RFS_DTL[intDetailIndex].XXSHP_KDS_T_RFS_ITM[i].DEC_QTYINVOICED * objData.XXSHP_KDS_T_RFS_DTL[intDetailIndex].XXSHP_KDS_T_RFS_ITM[i].DEC_UNITPRICE;
    return objData;
}
 
function p_txtItemCOA_Changed(objCaller, intIndex) {
    
    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());
    for (i = 0; i < objData.XXSHP_KDS_T_RFS_DTL[intDetailIndex].XXSHP_KDS_T_RFS_ITM.length; i++) {
        // Cari Index-nya.
        if (objData.XXSHP_KDS_T_RFS_DTL[intDetailIndex].XXSHP_KDS_T_RFS_ITM[i].intIndex == intIndex) {
            // Ketemu, mulai dari sini:
            objData.XXSHP_KDS_T_RFS_DTL[intDetailIndex].XXSHP_KDS_T_RFS_ITM[i].TXT_COA = objCaller.value;
            break;
        }
    }
    p_SetHiddenObject(objData);
}

function p_chkCOASundry_Changed(objCaller, intIndex) {
    
    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());
    for (i = 0; i < objData.XXSHP_KDS_T_RFS_DTL[intDetailIndex].XXSHP_KDS_T_RFS_ITM.length; i++) {
        // Cari Index-nya.
        if (objData.XXSHP_KDS_T_RFS_DTL[intDetailIndex].XXSHP_KDS_T_RFS_ITM[i].intIndex == intIndex) {
            // Ketemu, mulai dari sini:
            if (objCaller.checked == false) {
                objData.XXSHP_KDS_T_RFS_DTL[intDetailIndex].XXSHP_KDS_T_RFS_ITM[i].BIT_SUNDRYCOA = clsGlobal.ParseBooleanNETToOracle(false);
                objData.XXSHP_KDS_T_RFS_DTL[intDetailIndex].XXSHP_KDS_T_RFS_ITM[i].INT_COA_ID = 0;
                objData.XXSHP_KDS_T_RFS_DTL[intDetailIndex].XXSHP_KDS_T_RFS_ITM[i].TXT_COA = "";

            } else {
                objData.XXSHP_KDS_T_RFS_DTL[intDetailIndex].XXSHP_KDS_T_RFS_ITM[i].BIT_SUNDRYCOA = clsGlobal.ParseBooleanNETToOracle(true);
                clsGlobal.showLoading();
                $.ajax({
                    type: "POST",
                    url: "/Transaction/RFS/COASundry",
                    data: { intDetailIndex: intDetailIndex, intItemIndex: intItemIndex, data: $("#txtHiddenObject").val(), __RequestVerificationToken: $('#frmRFS input[name=__RequestVerificationToken]').val() },
                    datatype: "json",
                    success: function (retDat) {
                        
                        if (retDat.bitSuccess == true) {
                            if (retDat.objData != undefined) {
                                objData.XXSHP_KDS_T_RFS_DTL[intDetailIndex].XXSHP_KDS_T_RFS_ITM[i].BIT_SUNDRYCOA = clsGlobal.ParseBooleanNETToOracle(true);
                                objData.XXSHP_KDS_T_RFS_DTL[intDetailIndex].XXSHP_KDS_T_RFS_ITM[i].INT_COA_ID = retDat.objData.CODE_COMBINATION_ID;
                                objData.XXSHP_KDS_T_RFS_DTL[intDetailIndex].XXSHP_KDS_T_RFS_ITM[i].TXT_COA = retDat.objData.SEGMENT1 + "-" + retDat.objData.SEGMENT2 + "-" + retDat.objData.SEGMENT3 + "-" + retDat.objData.SEGMENT4 + "-" + retDat.objData.SEGMENT5 + "-" + retDat.objData.SEGMENT6 + "-" + retDat.objData.SEGMENT7;

                                p_SetHiddenObject(objData);
                                p_RefreshDataRow();
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
           
            break;
        }
    }
    p_SetHiddenObject(objData);
    p_RefreshDataRow();


    
}

function p_btnLOV_COA_Click(objCaller, intIndex) {
    try {
        
        // Parse dari HiddenObject->JSON
        var objData = JSON.parse(p_UIToData());

        var SubBrandList = "";
        for (i = 0; i < objData.XXSHP_KDS_T_RFS_DTL[intDetailIndex].XXSHP_KDS_T_RFS_ITM.length; i++) {
            // Cari Index-nya.
            var txtCOA = objData.XXSHP_KDS_T_RFS_DTL[intDetailIndex].XXSHP_KDS_T_RFS_ITM[i].TXT_COA;
            var txtCOASplit = clsGlobal.parseToString(txtCOA).split('-');
            if (txtCOASplit.length == 7) {
                SubBrandList += txtCOASplit[4] + ",";
            } 
        }

        for (i = 0; i < objData.XXSHP_KDS_T_RFS_DTL[intDetailIndex].XXSHP_KDS_T_RFS_ITM.length; i++) {
            // Cari Index-nya.
            if (objData.XXSHP_KDS_T_RFS_DTL[intDetailIndex].XXSHP_KDS_T_RFS_ITM[i].intIndex == intIndex) {
                // Ketemu, mulai dari sini:

                // Validasi
                if (objData.TXT_SUPPLIER_SITE_NAME == "") {
                    throw "RFS Detail must be filled!";
                }

                var fancyboxdata = p_GetHiddenObject();
                LOV = clsGlobal.generatePopUpIframe($(location).attr('protocol') + "//" + $(location).attr('host') + "/Master/COA/Index?decAmount=" + objData.XXSHP_KDS_T_RFS_DTL[intDetailIndex].XXSHP_KDS_T_RFS_ITM[i].DEC_AMOUNT + "&SubBrandList="+SubBrandList, "btnCOA", fancyboxdata);
                break;
            }
        }
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
}

function p_ddlPPN_TextChanged(objCaller, intIndex) {
    
    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());
    for (i = 0; i < objData.XXSHP_KDS_T_RFS_DTL[intDetailIndex].XXSHP_KDS_T_RFS_ITM.length; i++) {
        // Cari Index-nya.
        if (objData.XXSHP_KDS_T_RFS_DTL[intDetailIndex].XXSHP_KDS_T_RFS_ITM[i].intIndex == intIndex) {
            // Ketemu, mulai dari sini:
            var resultPPNSplit = clsGlobal.parseToString(objCaller.value).split(';');
            if (resultPPNSplit.length == 2) {
                
                var decPercent = clsGlobal.parseToDecimal(resultPPNSplit[1]);

                var decInvoiceAmount = clsGlobal.parseToDecimal(objData.XXSHP_KDS_T_RFS_DTL[intDetailIndex].XXSHP_KDS_T_RFS_ITM[i].DEC_AMOUNT);
                var decPPNAmount = Math.floor(decInvoiceAmount * decPercent / 100);

                objData.XXSHP_KDS_T_RFS_DTL[intDetailIndex].XXSHP_KDS_T_RFS_ITM[i].TXT_PPNTAXRATE_CODE = clsGlobal.parseToString(resultPPNSplit[0]);
                objData.XXSHP_KDS_T_RFS_DTL[intDetailIndex].XXSHP_KDS_T_RFS_ITM[i].DEC_PPN_PERCENTAGE = decPercent;
                objData.XXSHP_KDS_T_RFS_DTL[intDetailIndex].XXSHP_KDS_T_RFS_ITM[i].DEC_PPN = decPPNAmount;
            }
           
            break;
        }
    }
    p_SetHiddenObject(objData);
    p_RefreshDataRow();
}
 
function p_txtItemNilaiPPN_TextChanged(objCaller, intIndex) {
    
    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());
    for (i = 0; i < objData.XXSHP_KDS_T_RFS_DTL[intDetailIndex].XXSHP_KDS_T_RFS_ITM.length; i++) {
        // Cari Index-nya.
        if (objData.XXSHP_KDS_T_RFS_DTL[intDetailIndex].XXSHP_KDS_T_RFS_ITM[i].intIndex == intIndex) {
            // Ketemu, mulai dari sini:
            objData.XXSHP_KDS_T_RFS_DTL[intDetailIndex].XXSHP_KDS_T_RFS_ITM[i].DEC_PPN = clsGlobal.parseToDecimal(objCaller.value);
            break;
        }
    }
    p_SetHiddenObject(objData);
    p_RefreshDataRow();
}
 
function p_ddlPPH_TextChanged(objCaller, intIndex) {
    
    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());
    for (i = 0; i < objData.XXSHP_KDS_T_RFS_DTL[intDetailIndex].XXSHP_KDS_T_RFS_ITM.length; i++) {
        // Cari Index-nya.
        if (objData.XXSHP_KDS_T_RFS_DTL[intDetailIndex].XXSHP_KDS_T_RFS_ITM[i].intIndex == intIndex) {
            // Ketemu, mulai dari sini:
            var resultPPHSplit = clsGlobal.parseToString(objCaller.value).split(';');
            if (resultPPHSplit.length == 3) {
                var decPercent = clsGlobal.parseToDecimal(resultPPHSplit[2]);

                var decInvoiceAmount = clsGlobal.parseToDecimal(objData.XXSHP_KDS_T_RFS_DTL[intDetailIndex].XXSHP_KDS_T_RFS_ITM[i].DEC_AMOUNT);
                var decPPNAmount = decInvoiceAmount * decPercent / 100;

                objData.XXSHP_KDS_T_RFS_DTL[intDetailIndex].XXSHP_KDS_T_RFS_ITM[i].INT_WITH_HOLDING_GROUP_ID = clsGlobal.parseToDecimal(resultPPHSplit[0]);
                objData.XXSHP_KDS_T_RFS_DTL[intDetailIndex].XXSHP_KDS_T_RFS_ITM[i].TXT_WITH_HOLDING_TYPE = clsGlobal.parseToString(resultPPHSplit[1]);
                objData.XXSHP_KDS_T_RFS_DTL[intDetailIndex].XXSHP_KDS_T_RFS_ITM[i].TXT_WITH_HOLDING_PERCENTAGE = decPercent;
                objData.XXSHP_KDS_T_RFS_DTL[intDetailIndex].XXSHP_KDS_T_RFS_ITM[i].TXT_WITH_HOLDING_AMOUNT = objData.XXSHP_KDS_T_RFS_DTL[intDetailIndex].XXSHP_KDS_T_RFS_ITM[i].DEC_AMOUNT;
                objData.XXSHP_KDS_T_RFS_DTL[intDetailIndex].XXSHP_KDS_T_RFS_ITM[i].TXT_WITH_HOLDING_TAX_AMOUNT = decPPNAmount;
                objData.XXSHP_KDS_T_RFS_DTL[intDetailIndex].XXSHP_KDS_T_RFS_ITM[i].TXT_WITH_HOLDING_RATE = decPercent;
                objData.XXSHP_KDS_T_RFS_DTL[intDetailIndex].XXSHP_KDS_T_RFS_ITM[i].TXT_WITH_HOLDING_TAX_AMOUNT = decPPNAmount;
            } 
            break;
        }
    }
    p_SetHiddenObject(objData);
    p_RefreshDataRow();
}
    
 
function p_ddlPPHDesc_TextChanged(objCaller, intIndex) {
    
    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());
    for (i = 0; i < objData.XXSHP_KDS_T_RFS_DTL[intDetailIndex].XXSHP_KDS_T_RFS_ITM.length; i++) {
        // Cari Index-nya.
        if (objData.XXSHP_KDS_T_RFS_DTL[intDetailIndex].XXSHP_KDS_T_RFS_ITM[i].intIndex == intIndex) {
            // Ketemu, mulai dari sini: 
            objData.XXSHP_KDS_T_RFS_DTL[intDetailIndex].XXSHP_KDS_T_RFS_ITM[i].TXT_WITH_HOLDING_DESC = objCaller.value;

            break;
        }
    }
    p_SetHiddenObject(objData);
    p_RefreshDataRow();
}

function p_ddlPPHDesc2_TextChanged(objCaller, intIndex) {
    
    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());
    for (i = 0; i < objData.XXSHP_KDS_T_RFS_DTL[intDetailIndex].XXSHP_KDS_T_RFS_ITM.length; i++) {
        // Cari Index-nya.
        if (objData.XXSHP_KDS_T_RFS_DTL[intDetailIndex].XXSHP_KDS_T_RFS_ITM[i].intIndex == intIndex) {
            // Ketemu, mulai dari sini: 
            objData.XXSHP_KDS_T_RFS_DTL[intDetailIndex].XXSHP_KDS_T_RFS_ITM[i].TXT_WITH_HOLDING_DESC2 = objCaller.value;

            break;
        }
    }
    p_SetHiddenObject(objData);
    p_RefreshDataRow();
}
    
function p_btnItemDelete_Click(objCaller, intIndex) {
    
    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());
    for (i = 0; i < objData.XXSHP_KDS_T_RFS_DTL[intDetailIndex].XXSHP_KDS_T_RFS_ITM.length; i++) {
        // Cari Index-nya.
        if (objData.XXSHP_KDS_T_RFS_DTL[intDetailIndex].XXSHP_KDS_T_RFS_ITM[i].intIndex == intIndex) {
            // Ketemu, mulai dari sini:
            // Remove from list.
            objData.XXSHP_KDS_T_RFS_DTL[intDetailIndex].XXSHP_KDS_T_RFS_ITM.splice(i, 1);

            oTableItem.row(i).remove().draw(false);
            break;
        }
    }
    p_SetHiddenObject(objData);
    p_RefreshNumberItem();
}

$('#btnAddItem').on('click', function () {
    try {
        p_AddItem();
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
});



function p_setbtnCOA(value1, value2, value3) {
    var intSelectedIndex = p_GetSelectedItemRow();
    var intRowIndex = 0;
    var objDat = p_GetHiddenObject();
    
    // Show ke table.
    oTableItem.rows().every(function (rowIdx, tableLoop, rowLoop) {
        
        var d = this.data();
        if (intRowIndex == intSelectedIndex) {
            d.intIndex = intRowIndex; // update data source for the row 

            
            d.INT_COA_ID = clsGlobal.parseToDecimal(value1);
            d.TXT_COA = clsGlobal.parseToString(value2);
            if (clsGlobal.parseToDecimal(value3) != 0) {
                d.TXT_WITH_HOLDING_TAX_AMOUNT = clsGlobal.parseToDecimal(value3);
                objDat.XXSHP_KDS_T_RFS_DTL[intDetailIndex].XXSHP_KDS_T_RFS_ITM[intRowIndex].TXT_WITH_HOLDING_TAX_AMOUNT = clsGlobal.parseToDecimal(value3);
            }
            objDat.XXSHP_KDS_T_RFS_DTL[intDetailIndex].XXSHP_KDS_T_RFS_ITM[intRowIndex].INT_COA_ID = clsGlobal.parseToDecimal(value1);
            objDat.XXSHP_KDS_T_RFS_DTL[intDetailIndex].XXSHP_KDS_T_RFS_ITM[intRowIndex].TXT_COA = clsGlobal.parseToString(value2);
             
            this.invalidate(); // invalidate the data DataTables has cached for this row         
            p_EnableControl(clsGlobal.ParseBooleanOracleToNET(objDat.BIT_APPLY));
        }

        intRowIndex++;
    });

    p_SetHiddenObject(objDat);
    p_RefreshDataRow();
}

 
function p_ddlPPN_ALL_TextChanged(objCaller) {
    
    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());
    for (i = 0; i < objData.XXSHP_KDS_T_RFS_DTL[intDetailIndex].XXSHP_KDS_T_RFS_ITM.length; i++) {
        // Ketemu, mulai dari sini:
        var resultPPNSplit = clsGlobal.parseToString(objCaller.value).split(';');
        if (resultPPNSplit.length == 2) {
            
            var decPercent = clsGlobal.parseToDecimal(resultPPNSplit[1]);

            var decInvoiceAmount = clsGlobal.parseToDecimal(objData.XXSHP_KDS_T_RFS_DTL[intDetailIndex].XXSHP_KDS_T_RFS_ITM[i].DEC_AMOUNT);
            var decPPNAmount = Math.floor(decInvoiceAmount * decPercent / 100);

            objData.XXSHP_KDS_T_RFS_DTL[intDetailIndex].XXSHP_KDS_T_RFS_ITM[i].TXT_PPNTAXRATE_CODE = clsGlobal.parseToString(resultPPNSplit[0]);
            objData.XXSHP_KDS_T_RFS_DTL[intDetailIndex].XXSHP_KDS_T_RFS_ITM[i].DEC_PPN_PERCENTAGE = decPercent;
            objData.XXSHP_KDS_T_RFS_DTL[intDetailIndex].XXSHP_KDS_T_RFS_ITM[i].DEC_PPN = decPPNAmount;
        } 
    }
    p_SetHiddenObject(objData);
    p_RefreshNumberItem();
}


function p_ddlPPH_ALL_TextChanged(objCaller) {
    
    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());
    for (i = 0; i < objData.XXSHP_KDS_T_RFS_DTL[intDetailIndex].XXSHP_KDS_T_RFS_ITM.length; i++) {
        // Ketemu, mulai dari sini:
        var resultPPHSplit = clsGlobal.parseToString(objCaller.value).split(';');
        if (resultPPHSplit.length == 3) {
            var decPercent = clsGlobal.parseToDecimal(resultPPHSplit[2]);

            var decInvoiceAmount = clsGlobal.parseToDecimal(objData.XXSHP_KDS_T_RFS_DTL[intDetailIndex].XXSHP_KDS_T_RFS_ITM[i].DEC_AMOUNT);
            var decPPNAmount = decInvoiceAmount * decPercent / 100;

            objData.XXSHP_KDS_T_RFS_DTL[intDetailIndex].XXSHP_KDS_T_RFS_ITM[i].INT_WITH_HOLDING_GROUP_ID = clsGlobal.parseToDecimal(resultPPHSplit[0]);
            objData.XXSHP_KDS_T_RFS_DTL[intDetailIndex].XXSHP_KDS_T_RFS_ITM[i].TXT_WITH_HOLDING_TYPE = clsGlobal.parseToString(resultPPHSplit[1]);
            objData.XXSHP_KDS_T_RFS_DTL[intDetailIndex].XXSHP_KDS_T_RFS_ITM[i].TXT_WITH_HOLDING_PERCENTAGE = decPercent;
            objData.XXSHP_KDS_T_RFS_DTL[intDetailIndex].XXSHP_KDS_T_RFS_ITM[i].TXT_WITH_HOLDING_AMOUNT = objData.XXSHP_KDS_T_RFS_DTL[intDetailIndex].XXSHP_KDS_T_RFS_ITM[i].DEC_AMOUNT;
            objData.XXSHP_KDS_T_RFS_DTL[intDetailIndex].XXSHP_KDS_T_RFS_ITM[i].TXT_WITH_HOLDING_TAX_AMOUNT = decPPNAmount;
            objData.XXSHP_KDS_T_RFS_DTL[intDetailIndex].XXSHP_KDS_T_RFS_ITM[i].TXT_WITH_HOLDING_RATE = decPercent;
            objData.XXSHP_KDS_T_RFS_DTL[intDetailIndex].XXSHP_KDS_T_RFS_ITM[i].TXT_WITH_HOLDING_TAX_AMOUNT = decPPNAmount;
        } 
    }
    p_SetHiddenObject(objData);
    p_RefreshNumberItem();
}


function p_ddlPPHDesc_ALL_TextChanged(objCaller) {
    
    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());
    for (i = 0; i < objData.XXSHP_KDS_T_RFS_DTL[intDetailIndex].XXSHP_KDS_T_RFS_ITM.length; i++) {
        // Ketemu, mulai dari sini: 
        objData.XXSHP_KDS_T_RFS_DTL[intDetailIndex].XXSHP_KDS_T_RFS_ITM[i].TXT_WITH_HOLDING_DESC = objCaller.value;
    }
    p_SetHiddenObject(objData);
    p_RefreshNumberItem();
}


function p_txtItemWithHoldDescription2_ALL_Changed(objCaller) {
    
    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());
    for (i = 0; i < objData.XXSHP_KDS_T_RFS_DTL[intDetailIndex].XXSHP_KDS_T_RFS_ITM.length; i++) {
        // Ketemu, mulai dari sini:
        objData.XXSHP_KDS_T_RFS_DTL[intDetailIndex].XXSHP_KDS_T_RFS_ITM[i].TXT_WITH_HOLDING_DESC2 = objCaller.value;
    }
    p_SetHiddenObject(objData);
    p_RefreshNumberItem();
}


// ==========================
// END: Item   
// ==========================


//=======================
// HANDLER
//=======================

$('#btnOK').bind('click', function () {
    try {
        
        parent.$("#txtHiddenObject").val($("#txtHiddenObject").val());
        parent.clsGlobal.closePopUpIframe();
        parent.p_setItem();
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




