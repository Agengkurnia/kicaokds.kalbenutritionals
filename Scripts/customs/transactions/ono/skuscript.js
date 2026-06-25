//     KKP SCRIPT - SKU
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
var intActivityIndex;
var intSubUmbrandIndex;
var intBrandIndex;
var oTableSKU;

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
    XXSHP_KDS_T_KLAIM_UMB = {};
    intActivityIndex = $.getParameter("intActivityIndex");
    intBudgetIndex = $.getParameter("intBudgetIndex");
    intSubUmbrandIndex = $.getParameter("intSubUmbrandIndex");
    intBrandIndex = $.getParameter("intBrandIndex");
    p_InitiateSKU();  
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
        case "txtItemCode":  
            p_settxtItemCode(arr[1],arr[2]);
            break;   
    }
    clsGlobal.closeLOV(); 
}

function p_DataToUI(objDat) {
    
    $("#txtBrand").val((objDat.XXSHP_KDS_T_ONO_ACT[intActivityIndex].XXSHP_KDS_T_ONO_BGT[intBudgetIndex].XXSHP_KDS_T_ONO_SUB[intSubUmbrandIndex].XXSHP_KDS_T_ONO_BRD[intBrandIndex].TXT_BRAND));
    $("#txtTotalAmount").val(objDat.XXSHP_KDS_T_ONO_ACT[intActivityIndex].XXSHP_KDS_T_ONO_BGT[intBudgetIndex].XXSHP_KDS_T_ONO_SUB[intSubUmbrandIndex].DEC_AMOUNT);

    p_DataToUISKU(objDat.XXSHP_KDS_T_ONO_ACT[intActivityIndex].XXSHP_KDS_T_ONO_BGT[intBudgetIndex].XXSHP_KDS_T_ONO_SUB[intSubUmbrandIndex].XXSHP_KDS_T_ONO_BRD[intBrandIndex].XXSHP_KDS_T_ONO_SKU);
     
    p_EnableControl(clsGlobal.ParseBooleanOracleToNET(objDat.BIT_APPLY), objDat);
     
    p_SetHiddenObject(objDat);
    if ($("#txtID").val() == "" || $("#txtID").val() == "0") {
        $("#btnDelete").hide();
    } else {
        $("#btnDelete").show();
    }
}

function p_EnableControl(bitApply, objDat) {
    var bitAddendum = clsGlobal.ParseBooleanOracleToNET(objDat.BIT_ADDENDUM);

    if (bitApply == true) {
        $("#btnOK").hide(); 
        $("#btnCancel").hide(); 

        $("#btnAddSKU").hide();
        $(".btnLOVItemCode").each(function (index) {
            $(this).hide(); 
        }); 
        $(".btnSKUDelete").each(function (index) {
            $(this).hide(); 
        });
    } 
    else {
        $("#btnOK").show();
        $("#btnCancel").show();

        $("#btnAddItemCode").show(); 
        $(".btnLOVItemCode").each(function (index) {
            $(this).show();
        });
        $(".btnSKUDelete").each(function (index) {
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
    
    $('.autonumeric').autoNumeric('init', { vMax: '9999999999999', vMin: '-9999999999999', aSep: ',', dGroup: '3', aDec: '.' });
}
 

// ==========================
// SKU  
// ==========================

function p_GetSelectedSKURow() {
    var intIndex = clsGlobal.parseToInteger(oTableSKU.$('tr.selected').find("#lblSKUNoValue").html()) - 1;
    return intIndex;
}

function p_InitiateSKU() {
    // Format datatable  
    
    oTableSKU = $('#dtSKU').DataTable({
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
                      return '<div id="lblSKUNoValue" > ' + (full.intIndex + 1) + ' </div>';
                  }
              },
               { 
                   aTargets: [1],
                   mRender: function (data, type, full) {
                       return '     <div class="input-group"> ' +
                              '       <div class="input-group-btn"> ' +
                              '           <button type="button" class="btn btn-danger btnLOVItemCode" id="btnLOVItemCode" onclick="p_btnLOVItemCode_Click(this,' + full.intIndex + ')"> <i class="fa fa-search"></i></button> ' +
                              '       </div> ' +
                              '       <div class="input-group-btn" style="width:60px;"> ' +
                              '       <input type="text" class="form-control txtItemCode" id="txtItemCode"  value="' + full.TXT_SKU_CODE + '" disabled> ' +
                              '       </div> ' + '<div style="display:none;"> ' + full.TXT_SKU_CODE + ' </div>'
                              '   </div>';
                   }
               },
               {
                   aTargets: [2],
                   mRender: function (data, type, full) {
                       return '   <div>    <input type="text" class="form-control txtBrand" id="txtBrand"  value="' + full.TXT_SKU + '" disabled> </div> <div style="display:none;"> ' + full.TXT_SKU + ' </div> ';
                   }
               }, 
               //{
               //    aTargets: [3],
               //    mRender: function (data, type, full) {
               //        return '<div >  <input type="text" class="form-control txtDetailAmount autonumeric text-right" id="txtDetailAmount' + full.intIndex + '" onchange="p_txtDetailAmount_Changed(this,' + full.intIndex + ')"   value="' + full.DEC_AMOUNT + '" >  </div>';

               //    }
               //}, 
               { 
                   aTargets: [3],
                   mRender: function (data, type, full) {
                       var dat = p_GetHiddenObject();

                       if (clsGlobal.ParseBooleanOracleToNET(dat.BIT_APPLY)) {
                            return '<div></div>';
                       } else {
                            return '<div > <input type="button" class="btn btn-warning btnSKUDelete" id="btnSKUDelete" onclick="p_btnSKUDelete_Click(this,' + full.intIndex + ')"  value="Delete" >  </div>';
                       }
                   }
               }
        ]
    });

    $("#dtSKU").css("width", "100%");
    $('#dtSKU tbody').on('click', 'tr', function () {
        if (!$(this).hasClass('selected')) {  
            oTableSKU.$('tr.selected').removeClass('selected');
            $(this).addClass('selected'); 
        }
    });

}

function p_ShowBlankSKU() {
    oTableSKU.clear();
    oTableSKU.draw(false);
}

function p_AddSKU() {
    
    clsGlobal.showLoading();
    $.ajax({
        type: "POST",
        url: "/Transaction/ONO/AddRowSKU",
        data: {
            intActivityIndex: intActivityIndex, intBudgetIndex: intBudgetIndex, intSubUmbrandIndex: intSubUmbrandIndex, intBrandIndex: intBrandIndex,
            data: $("#txtHiddenObject").val(), __RequestVerificationToken: $('#frmONO input[name=__RequestVerificationToken]').val()        },
        datatype: "json",
        success: function (retDat) {
            
            if (retDat.bitSuccess == true) {
                if (retDat.objData != undefined) {
                    p_SetHiddenObject(retDat.objData);
                    p_DataToUISKU(retDat.objData.XXSHP_KDS_T_ONO_ACT[intActivityIndex].XXSHP_KDS_T_ONO_BGT[intBudgetIndex].XXSHP_KDS_T_ONO_SUB[intSubUmbrandIndex].XXSHP_KDS_T_ONO_BRD[intBrandIndex].XXSHP_KDS_T_ONO_SKU);
                    oTableSKU.page('last').draw(false);
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
 
function p_DataToUISKU(XXSHP_KDS_T_ONO_SKU) {
    
    oTableSKU.clear();
    for (var i = 0; i < XXSHP_KDS_T_ONO_SKU.length; i++) {
        XXSHP_KDS_T_ONO_SKU[i].intIndex = i;
        oTableSKU.row.add(XXSHP_KDS_T_ONO_SKU[i]);
    }
    oTableSKU.draw(false);

    var objDat = p_GetHiddenObject();
    objDat.XXSHP_KDS_T_ONO_ACT[intActivityIndex].XXSHP_KDS_T_ONO_BGT[intBudgetIndex].XXSHP_KDS_T_ONO_SUB[intSubUmbrandIndex].XXSHP_KDS_T_ONO_BRD[intBrandIndex].XXSHP_KDS_T_ONO_SKU = XXSHP_KDS_T_ONO_SKU;
    p_SetHiddenObject(objDat);
}
 
function p_RefreshNumberSKU() {
    
    var intRowIndex = 0;
    var objDat = p_GetHiddenObject();
    oTableSKU.rows().every(function (rowIdx, tableLoop, rowLoop) {
        
        var d = this.data();
        d.intIndex = intRowIndex; // update data source for the row
        objDat.XXSHP_KDS_T_ONO_ACT[intActivityIndex].XXSHP_KDS_T_ONO_BGT[intBudgetIndex].XXSHP_KDS_T_ONO_SUB[intSubUmbrandIndex].XXSHP_KDS_T_ONO_BRD[intBrandIndex].XXSHP_KDS_T_ONO_SKU[intRowIndex].intIndex = d.intIndex;
        
        d.TXT_SKU_CODE = objDat.XXSHP_KDS_T_ONO_ACT[intActivityIndex].XXSHP_KDS_T_ONO_BGT[intBudgetIndex].XXSHP_KDS_T_ONO_SUB[intSubUmbrandIndex].XXSHP_KDS_T_ONO_BRD[intBrandIndex].XXSHP_KDS_T_ONO_SKU[intRowIndex].TXT_SKU_CODE;
        d.TXT_SKU = objDat.XXSHP_KDS_T_ONO_ACT[intActivityIndex].XXSHP_KDS_T_ONO_BGT[intBudgetIndex].XXSHP_KDS_T_ONO_SUB[intSubUmbrandIndex].XXSHP_KDS_T_ONO_BRD[intBrandIndex].XXSHP_KDS_T_ONO_SKU[intRowIndex].TXT_SKU;
        d.DEC_AMOUNT = objDat.XXSHP_KDS_T_ONO_ACT[intActivityIndex].XXSHP_KDS_T_ONO_BGT[intBudgetIndex].XXSHP_KDS_T_ONO_SUB[intSubUmbrandIndex].XXSHP_KDS_T_ONO_BRD[intBrandIndex].XXSHP_KDS_T_ONO_SKU[intRowIndex].DEC_AMOUNT;

        intRowIndex++;
        this.invalidate(); // invalidate the data DataTables has cached for this row         
    });

    // Draw once all updates are done
    oTableSKU.draw(false);
    p_SetHiddenObject(objDat);
}
  

function p_btnLOVItemCode_Click(objCaller, intIndex) {
    //LOV = clsGlobal.generateLOV(MODULE_ITEMCODE_SUBBRAND, "txtItemCode", $("#txtSubbrand").val());
    LOV = clsGlobal.generateLOV(LOV_ITEMCODE_PROMAP_SUBBRAND, "txtItemCode", $("#txtBrand").val());
}

function p_settxtItemCode(txtValue1,txtValue2) {
    
    var intSelectedIndex = p_GetSelectedSKURow();
    var intRowIndex = 0;
    var objDat = p_GetHiddenObject();
    oTableSKU.rows().every(function (rowIdx, tableLoop, rowLoop) {
        
        var d = this.data();
        if (intRowIndex == intSelectedIndex) {
            d.intIndex = intRowIndex; // update data source for the row 

            d.TXT_SKU_CODE = txtValue1;
            d.TXT_SKU = txtValue2;
            objDat.XXSHP_KDS_T_ONO_ACT[intActivityIndex].XXSHP_KDS_T_ONO_BGT[intBudgetIndex].XXSHP_KDS_T_ONO_SUB[intSubUmbrandIndex].XXSHP_KDS_T_ONO_BRD[intBrandIndex].XXSHP_KDS_T_ONO_SKU[intRowIndex].TXT_SKU_CODE = txtValue1;
            objDat.XXSHP_KDS_T_ONO_ACT[intActivityIndex].XXSHP_KDS_T_ONO_BGT[intBudgetIndex].XXSHP_KDS_T_ONO_SUB[intSubUmbrandIndex].XXSHP_KDS_T_ONO_BRD[intBrandIndex].XXSHP_KDS_T_ONO_SKU[intRowIndex].TXT_SKU = txtValue2;
           
            this.invalidate(); // invalidate the data DataTables has cached for this row         
            p_EnableControl(clsGlobal.ParseBooleanOracleToNET(objDat.BIT_APPLY), objDat);
        }

        intRowIndex++;
    });

    p_SetHiddenObject(objDat);
}
  
  
function p_txtDetailAmount_Changed(objCaller, intIndex) {


    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());


    for (i = 0; i < objDat.XXSHP_KDS_T_ONO_ACT[intActivityIndex].XXSHP_KDS_T_ONO_BGT[intBudgetIndex].XXSHP_KDS_T_ONO_SUB[intSubUmbrandIndex].XXSHP_KDS_T_ONO_BRD[intBrandIndex].XXSHP_KDS_T_ONO_SKU.length; i++) {
        // Cari Index-nya.
        if (objDat.XXSHP_KDS_T_ONO_ACT[intActivityIndex].XXSHP_KDS_T_ONO_BGT[intBudgetIndex].XXSHP_KDS_T_ONO_SUB[intSubUmbrandIndex].XXSHP_KDS_T_ONO_BRD[intBrandIndex].XXSHP_KDS_T_ONO_SKU[i].intIndex == intIndex) {
            // Ketemu, mulai dari sini:
            objDat.XXSHP_KDS_T_ONO_ACT[intActivityIndex].XXSHP_KDS_T_ONO_BGT[intBudgetIndex].XXSHP_KDS_T_ONO_SUB[intSubUmbrandIndex].XXSHP_KDS_T_ONO_BRD[intBrandIndex].XXSHP_KDS_T_ONO_SKU[i].DEC_AMOUNT = clsGlobal.parseToDecimal(objCaller.value);

            break;
        }
    }
    p_SetHiddenObject(objData);
    //p_refresh_row_detail(intIndex);
    objCaller.focus();
}
 

function p_btnSKUDelete_Click(objCaller, intIndex) {
    
    // Parse dari HiddenObject->JSON
    var objDat = JSON.parse(p_UIToData());
    for (i = 0; i < objDat.XXSHP_KDS_T_ONO_ACT[intActivityIndex].XXSHP_KDS_T_ONO_BGT[intBudgetIndex].XXSHP_KDS_T_ONO_SUB[intSubUmbrandIndex].XXSHP_KDS_T_ONO_BRD[intBrandIndex].XXSHP_KDS_T_ONO_SKU.length; i++) {
        // Cari Index-nya.
        if (objDat.XXSHP_KDS_T_ONO_ACT[intActivityIndex].XXSHP_KDS_T_ONO_BGT[intBudgetIndex].XXSHP_KDS_T_ONO_SUB[intSubUmbrandIndex].XXSHP_KDS_T_ONO_BRD[intBrandIndex].XXSHP_KDS_T_ONO_SKU[i].intIndex == intIndex) {
            // Ketemu, mulai dari sini:
            // Remove from list.
            objDat.XXSHP_KDS_T_ONO_ACT[intActivityIndex].XXSHP_KDS_T_ONO_BGT[intBudgetIndex].XXSHP_KDS_T_ONO_SUB[intSubUmbrandIndex].XXSHP_KDS_T_ONO_BRD[intBrandIndex].XXSHP_KDS_T_ONO_SKU.splice(i, 1);

            oTableSKU.row(i).remove().draw(false);
            break;
        }
    }
    p_SetHiddenObject(objDat);
    p_RefreshNumberSKU();
}
 
$('#btnAddSKU').on('click', function () {
    try {
        p_AddSKU();
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
});

function p_ValidateInput() {
    var objData = JSON.parse(p_UIToData());

    // Get all SKUs from the current selection
    var skuList = objData.XXSHP_KDS_T_ONO_ACT[intActivityIndex]
        .XXSHP_KDS_T_ONO_BGT[intBudgetIndex]
        .XXSHP_KDS_T_ONO_SUB[intSubUmbrandIndex]
        .XXSHP_KDS_T_ONO_BRD[intBrandIndex]
        .XXSHP_KDS_T_ONO_SKU;

    if (skuList.length == 0) {
        throw "SKU tidak boleh kosong jika tidak memilih 'All SKU' di Brand";
    }

    // Normalize SKU codes and map names
    var skuCodes = skuList.map(x => ({
        code: clsGlobal.parseToString(x.TXT_SKU_CODE).trim(),
        name: clsGlobal.parseToString(x.TXT_SKU).trim()
    }));

    // check empty SKU
    var emptySkus = skuCodes.filter(x => !x.code || x.code === "");
    if (emptySkus.length > 0) {
        throw "SKU tidak boleh kosong.";
    }

    // Find duplicates
    var duplicates = skuCodes.filter((sku, i, arr) =>
        sku.code &&
        arr.findIndex(x => x.code === sku.code) !== i
    );

    // Remove duplicate duplicate entries (unique list)
    duplicates = [...new Map(duplicates.map(x => [x.code, x])).values()];

    if (duplicates.length > 0) {
        // Build message like: "SKU tidak boleh duplikat: SKU_NAME1, SKU_NAME2"
        var duplicateNames = duplicates.map(x => x.name || x.code).join(", ");
        throw `SKU tidak boleh duplikat: ${duplicateNames}`;
    }
    return true;
}


//function p_CalculateAmount() {
//    var objData = JSON.parse(p_UIToData());
//    var decTotalPerBrand = 0;
//    for (i = 0; i < objData.XXSHP_KCO_T_KLAIM_DTL[intActivityIndex].XXSHP_KCO_T_KLAIM_UMB[intSubUmbrandIndex].XXSHP_KCO_T_KLAIM_BRAN[intBrandIndex].XXSHP_KCO_T_KLAIM_SKU.length; i++) {
//        decTotalPerBrand += objData.XXSHP_KCO_T_KLAIM_DTL[intActivityIndex].XXSHP_KCO_T_KLAIM_UMB[intSubUmbrandIndex].XXSHP_KCO_T_KLAIM_BRAN[intBrandIndex].XXSHP_KCO_T_KLAIM_SKU[i].DEC_AMOUNT;
//    }
//    objData.XXSHP_KCO_T_KLAIM_DTL[intActivityIndex].XXSHP_KCO_T_KLAIM_UMB[intSubUmbrandIndex].XXSHP_KCO_T_KLAIM_BRAN[intBrandIndex].DEC_AMOUNT = decTotalPerBrand;
//    parent.$("#txtDetailAmount" + intBrandIndex).val(clsGlobal.parseToRupiah(decTotalPerBrand));
//    $("#txtTotalAmount").val(clsGlobal.parseToRupiah(decTotalPerBrand));

//    return objData;
//}

// ==========================
// END: SKU   
// ==========================
 
    
//=======================
// HANDLER
//=======================

$('#btnOK').bind('click', function () {
    try {
        
        if (p_ValidateInput()) { 
            parent.$("#txtHiddenObject").val($("#txtHiddenObject").val());
            parent.clsGlobal.closePopUpIframe();
        }
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
 
//$(document).on("keypress", ".txtDetailAmount", function () {
//    //Recalculate Amount
//    var objData = JSON.parse(p_UIToData());
//    objData = p_CalculateAmount(objData);
//})


