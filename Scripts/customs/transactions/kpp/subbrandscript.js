//     KPP SCRIPT - Subbrand
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
var LIST_PRODUCT = [];

//=======================
// Confirmation
//======================= 

//=======================
// ON PAGE LOAD
//=======================
$(document).ready(function () {  
    //p_InitForm();
    p_validatePage();
    p_populateProductList();
});

//=======================
// FUNCTION
//=======================
function p_InitForm() {
    XXSHP_KDS_T_KPP_SUB = {};
    intActivityIndex = $.getParameter("intIndex");
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
            //p_settxtSubBrand(arr[1], arr[2], arr[3]);
            //p_settxtSubBrand(arr[1], arr[2], arr[3], arr[4], arr[5]);
            
            p_settxtSubBrand(arr[1], arr[2], arr[3], arr[4], arr[5], arr[6]);
            break; 
    }
    clsGlobal.closeLOV(); 
}

function p_DataToUI(objData) {
    
    p_DataToUISubbrand(objData.XXSHP_KDS_T_KPP_ACT[intActivityIndex].XXSHP_KDS_T_KPP_SUB);
     
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
          
    } else if (clsGlobal.parseToString(objDat.TXT_PARENTDOCNO) != "") {
        // ada Parent.
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
    p_GenerateChosen();
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
    //    url: "/Transaction/KPP/SaveData", 
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
 

function p_populateProductList() {
    clsGlobal.showLoading();
    $.ajax({
        type: "POST",
        url: "/Main/PopulateSKU_ALLByPROMAP",
        data: { data: $("#txtHiddenObject").val(), __RequestVerificationToken: $('#frmKPP input[name=__RequestVerificationToken]').val() },
        datatype: "json",
        success: function (retDat) {
            
            if (retDat.bitSuccess == true) {
                if (retDat.objData != undefined) {
                    LIST_PRODUCT = retDat.objData;
                }
            } else {
                clsGlobal.getAlert(retDat.txtMessage);
            }

            // Initform pindahin ke sini
            p_InitForm();
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

function p_GetSelectedSubbrandRow() {
    var intIndex = clsGlobal.parseToInteger(oTableSubbrand.$('tr.selected').find("#lblSubbrandNoValue").html()) - 1;
    return intIndex;
}

function p_InitiateSubbrand() {
    // Format datatable  
    
    oTableSubbrand = $('#dtSubbrand').DataTable({
        "bPaginate": true,
        "bSort": false,
        searching: true,
        "type": "POST",
        "scrollX": true, 
        "scrollY": '300px',
        scrollCollapse: false,
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
                   return '<div id="lblSubbrandSubUmbrandValue" > ' + clsGlobal.parseToString(full.TXT_SUBUMBRAND) + ' </div>';
               }
           },
           {
               aTargets: [3],
               mRender: function (data, type, full) {
                   
                   var txtResult1 = '';
                   if (full.BIT_SKU == "Y") {
                       txtResult1 += ' <input type="radio" id="rdoSKUAll" name="SKU' + full.intIndex + '" value="Y" onchange="p_rdoSKUAll_TextChanged(this,' + full.intIndex + ')" checked> ';
                   } else {
                       txtResult1 += ' <input type="radio" id="rdoSKUAll" name="SKU' + full.intIndex + '" value="Y" onchange="p_rdoSKUAll_TextChanged(this,' + full.intIndex + ')"> ';
                   }
                   txtResult1 += ' <label for="rdoSKUAll">All</label> ';
                   if (full.BIT_SKU == "N") {
                       txtResult1 += ' <input type="radio" id="rdoSKUNo" name="SKU' + full.intIndex + '" value="N" onchange="p_rdoSKUNo_TextChanged(this,' + full.intIndex + ')" checked> ';
                   } else {
                       txtResult1 += ' <input type="radio" id="rdoSKUNo" name="SKU' + full.intIndex + '" value="N" onchange="p_rdoSKUNo_TextChanged(this,' + full.intIndex + ')" > ';
                   } 
                   txtResult1 += ' <label for="rdoSKUNo">No</label> ';
                    
                   var txtResult2 = "";
                   if (full.BIT_SKU == "Y") {
                       txtResult2 += "<select class='form-control ddlSubbrandSKU' data-placeholder='Pilih SKU...' multiple tabindex='4' style='width:200px;'   id='ddlSubbrandSKU"+ full.intIndex + "' onchange='p_ddlSubbrandSKU_TextChanged(this," + full.intIndex + ")' disabled>";
                   }
                   else {
                       txtResult2 += "<select class='form-control ddlSubbrandSKU' data-placeholder='Pilih SKU...' multiple tabindex='4' style='width:200px;'   id='ddlSubbrandSKU" + full.intIndex + "' onchange='p_ddlSubbrandSKU_TextChanged(this," + full.intIndex + ")' >";
                   }                   
                   //txtResult2 += "<option value=''>-</option>";
                   for (var i = 0; i < LIST_PRODUCT.length; i++) {
                       if (clsGlobal.parseToString(full.TXT_SUBUMBRAND) == clsGlobal.parseToString(LIST_PRODUCT[i].TXT_SUBUMBRAND))
                       txtResult2 += "<option value='" + LIST_PRODUCT[i].TXT_ITEMCODE + "'>" + LIST_PRODUCT[i].TXT_ITEMDESC + "</option>";
                   } 
                   txtResult2 += "</select>";
                   return txtResult1 + txtResult2;
               }
           },
           {
               aTargets: [4],
               mRender: function (data, type, full) {
                   return '<div id="lblSubbrandCOAValue" style="width:250px;" > ' + clsGlobal.parseToString(full.TXT_COA) + ' </div>';
               }
           },
           {
               aTargets: [5],
               mRender: function (data, type, full) {
                   return '<input type="text" class="form-control txtAmount autonumeric text-right" id="txtAmount" onchange="p_txtAmount_Changed(this,' + full.intIndex + ')"  value="' + full.DEC_AMOUNT + '"> ';
               }
           },
           {
               aTargets: [6],
               mRender: function (data, type, full) {                   
                   return '<div id="lblSubbrandCOAValue" style="width:250px;" > ' + clsGlobal.FormatMoney(full.DEC_AVAILABLE,0) + ' </div>';
               }
           },
           {
               aTargets: [7],
               mRender: function (data, type, full) {                   
                   return '<div id="lblSubbrandCOAValue" style="width:250px;" > ' + clsGlobal.FormatMoney(full.DEC_AVAILABLE_GROUP, 0) + ' </div>';
               }
           },
           { 
               aTargets: [8],
               mRender: function (data, type, full) {
                   //    return '<input type="text" class="form-control txtMPPDolphine" id="txtMPPDolphine"  value="' + full.TXT_REFDOCNO_DOLPHINE + '"> ';
                   return '<div id="lblMPPDolphine" style="width:250px;" > ' + full.TXT_REFDOCNO_DOLPHINE + ' </div>';

               }
           },
           { 
               aTargets: [9],
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

function p_GenerateChosen() {
    
    $('.ddlSubbrandSKU').chosen();
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
    
    clsGlobal.showLoading();
    $.ajax({
        type: "POST",
        url: "/Transaction/KPP/AddRowSubbrand",
        data: { intActivityIndex: intActivityIndex, intBudgetIndex: intBudgetIndex, data: $("#txtHiddenObject").val(), __RequestVerificationToken: $('#frmKPP input[name=__RequestVerificationToken]').val() },
        datatype: "json",
        success: function (retDat) {
            
            if (retDat.bitSuccess == true) {
                if (retDat.objData != undefined) {
                    p_SetHiddenObject(retDat.objData);
                    p_DataToUISubbrand(retDat.objData.XXSHP_KDS_T_KPP_ACT[intActivityIndex].XXSHP_KDS_T_KPP_SUB);
                    oTableSubbrand.page('last').draw(false);
                }
            } else {
                clsGlobal.getAlert(retDat.txtMessage);
            }

            p_GenerateChosen();
            clsGlobal.hideLoading();
        },
        error: function (retDat) {
            clsGlobal.hideLoading();
        }
    });
}
 
function p_DataToUISubbrand(XXSHP_KDS_T_KPP_SUB) {
    
    oTableSubbrand.clear();
    for (var i = 0; i < XXSHP_KDS_T_KPP_SUB.length; i++) {
        XXSHP_KDS_T_KPP_SUB[i].intIndex = i;
        oTableSubbrand.row.add(XXSHP_KDS_T_KPP_SUB[i]);
    }
    oTableSubbrand.draw(false);

    // Set chosen
    for (var i = 0; i < XXSHP_KDS_T_KPP_SUB.length; i++) { 
        var valueSplit = clsGlobal.parseToString(XXSHP_KDS_T_KPP_SUB[i].TXT_LIST_SKU_ID).split(',');
        $("#ddlSubbrandSKU" + XXSHP_KDS_T_KPP_SUB[i].intIndex).val(valueSplit).trigger("chosen:updated");
    }

    var objDat = p_GetHiddenObject();
    objDat.XXSHP_KDS_T_KPP_ACT[intActivityIndex].XXSHP_KDS_T_KPP_SUB = XXSHP_KDS_T_KPP_SUB;
    p_SetHiddenObject(objDat);
    p_GenerateChosen();
}
 
function p_RefreshNumberSubbrand() {
    
    var intRowIndex = 0;
    var objDat = p_GetHiddenObject();
    oTableSubbrand.rows().every(function (rowIdx, tableLoop, rowLoop) {
        
        var d = this.data();
        d.intIndex = intRowIndex; // update data source for the row
        objDat.XXSHP_KDS_T_KPP_ACT[intActivityIndex].XXSHP_KDS_T_KPP_SUB[intRowIndex].intIndex = d.intIndex;

        d.TXT_SUBBRAND = objDat.XXSHP_KDS_T_KPP_ACT[intActivityIndex].XXSHP_KDS_T_KPP_SUB[intRowIndex].TXT_SUBBRAND;
        d.DEC_AMOUNT = objDat.XXSHP_KDS_T_KPP_ACT[intActivityIndex].XXSHP_KDS_T_KPP_SUB[intRowIndex].DEC_AMOUNT;
        d.DEC_AVAILABLE = objDat.XXSHP_KDS_T_KPP_ACT[intActivityIndex].XXSHP_KDS_T_KPP_SUB[intRowIndex].DEC_AVAILABLE;
        d.TXT_REFDOCNO_DOLPHINE = objDat.XXSHP_KDS_T_KPP_ACT[intActivityIndex].XXSHP_KDS_T_KPP_SUB[intRowIndex].TXT_REFDOCNO_DOLPHINE;
        d.BIT_SKU = objDat.XXSHP_KDS_T_KPP_ACT[intActivityIndex].XXSHP_KDS_T_KPP_SUB[intRowIndex].BIT_SKU;
        d.TXT_LIST_SKU_ID = objDat.XXSHP_KDDS_T_KPP_ACT[intActivityIndex].XXSHP_KDS_T_KPP_SUB[intRowIndex].TXT_LIST_SKU_NAME;
        d.TXT_LIST_SKU_NAME = objDat.XXSHP_KDS_T_KPP_ACT[intActivityIndex].XXSHP_KDS_T_KPP_SUB[intRowIndex].TXT_LIST_SKU_NAME;
        intRowIndex++;
        this.invalidate(); // invalidate the data DataTables has cached for this row         
    });

    // Draw once all updates are done
    oTableSubbrand.draw(false);
    p_SetHiddenObject(objDat);
    p_GenerateChosen();
}



function p_RefreshSubbrandSelectedRow(intSelectedIndex) {
    var intRowIndex = 0;
    var objDat = p_GetHiddenObject();
    oTableSubbrand.rows().every(function (rowIdx, tableLoop, rowLoop) {
        
        var d = this.data();
        if (intRowIndex == intSelectedIndex) {
            d.intIndex = intRowIndex; // update data source for the row
            objDat.XXSHP_KDS_T_KPP_ACT[intActivityIndex].XXSHP_KDS_T_KPP_SUB[intRowIndex].intIndex = d.intIndex;

            d.TXT_SUBBRAND = objDat.XXSHP_KDS_T_KPP_ACT[intActivityIndex].XXSHP_KDS_T_KPP_SUB[intRowIndex].TXT_SUBBRAND;
            d.DEC_AMOUNT = objDat.XXSHP_KDS_T_KPP_ACT[intActivityIndex].XXSHP_KDS_T_KPP_SUB[intRowIndex].DEC_AMOUNT;
            d.TXT_COA = objDat.XXSHP_KDS_T_KPP_ACT[intActivityIndex].XXSHP_KDS_T_KPP_SUB[intRowIndex].TXT_COA;
            d.TXT_REFDOCNO_DOLPHINE = objDat.XXSHP_KDS_T_KPP_ACT[intActivityIndex].XXSHP_KDS_T_KPP_SUB[intRowIndex].TXT_REFDOCNO_DOLPHINE;
            d.DEC_AVAILABLE = objDat.XXSHP_KDS_T_KPP_ACT[intActivityIndex].XXSHP_KDS_T_KPP_SUB[intRowIndex].DEC_AVAILABLE;
            d.DEC_AVAILABLE_GROUP = objDat.XXSHP_KDS_T_KPP_ACT[intActivityIndex].XXSHP_KDS_T_KPP_SUB[intRowIndex].DEC_AVAILABLE_GROUP;
            d.BIT_SKU = objDat.XXSHP_KDS_T_KPP_ACT[intActivityIndex].XXSHP_KDS_T_KPP_SUB[intRowIndex].BIT_SKU;
            d.TXT_LIST_SKU_ID = objDat.XXSHP_KDS_T_KPP_ACT[intActivityIndex].XXSHP_KDS_T_KPP_SUB[intRowIndex].TXT_LIST_SKU_ID;
            d.TXT_LIST_SKU_NAME = objDat.XXSHP_KDS_T_KPP_ACT[intActivityIndex].XXSHP_KDS_T_KPP_SUB[intRowIndex].TXT_LIST_SKU_NAME;

            this.invalidate(); // invalidate the data DataTables has cached for this row   
        }

        intRowIndex++;
    });

    //AutoNumeric.
    p_GenerateAutoNumeric();
    p_GenerateDateTimePicker();
    p_GenerateChosen();
}
 
function p_btnLOVSubBrand_Click(objCaller, intIndex) {
    var objDat = p_GetHiddenObject();
    var txtQuery = objDat.TXT_REFDOCNO + "|" + objDat.XXSHP_KDS_T_KPP_ACT[intActivityIndex].TXT_ACTIVITYCODE;
    LOV = clsGlobal.generateLOV(LOV_SUBBRAND_BYMKPP_ACTIVITY, "txtSubBrand", txtQuery);
}

function p_settxtSubBrand(txtSubBrand, txtSubUmbrand, decAvailable, decAvailableGroup, txtMPPDolphine, txtDepartment) {
    
    var intSelectedIndex = p_GetSelectedSubbrandRow();
    var intRowIndex = 0;
    var objDat = p_GetHiddenObject();

    for (i = 0; i < objDat.XXSHP_KDS_T_KPP_ACT[intActivityIndex].XXSHP_KDS_T_KPP_SUB.length; i++) {
        //if (objDat.XXSHP_KCO_T_KPP_ACT[intActivityIndex].XXSHP_KCO_T_KPP_SUB[i].intIndex != intRowIndex) {
        if (objDat.XXSHP_KDS_T_KPP_ACT[intActivityIndex].XXSHP_KDS_T_KPP_SUB[i].TXT_SUBBRAND == txtSubBrand
            && objDat.XXSHP_KDS_T_KPP_ACT[intActivityIndex].XXSHP_KDS_T_KPP_SUB[i].TXT_SUBUMBRAND == txtSubUmbrand
            && objDat.XXSHP_KDS_T_KPP_ACT[intActivityIndex].XXSHP_KDS_T_KPP_SUB[i].TXT_DEPARTMENT == txtDepartment
            && objDat.XXSHP_KDS_T_KPP_ACT[intActivityIndex].XXSHP_KDS_T_KPP_SUB[i].TXT_REFDOCNO_DOLPHINE == txtMPPDolphine) {
                clsGlobal.showAlert("Sub Brand " + (txtSubBrand) + ", Sub UmBrand " + (txtSubUmbrand) + " sudah ada di baris ke " + (i + 1) + "!");
                return;
            }
        //}


    }

    oTableSubbrand.rows().every(function (rowIdx, tableLoop, rowLoop) {
        
        var d = this.data();
        if (intRowIndex == intSelectedIndex) {
             
            d.intIndex = intRowIndex; // update data source for the row 

            //d.INT_SUBBRAND_ID = txtValue;
            d.TXT_SUBBRAND = txtSubBrand;
            d.TXT_SUBUMBRAND = txtSubUmbrand;
            d.TXT_REFDOCNO_DOLPHINE = txtMPPDolphine;
            d.TXT_DEPARTMENT = txtDepartment;
            d.DEC_AVAILABLE = decAvailable;
            d.DEC_AVAILABLE_GROUP = decAvailableGroup;
            d.DEC_AMOUNT = objDat.XXSHP_KDS_T_KPP_ACT[intActivityIndex].XXSHP_KDS_T_KPP_SUB[intSelectedIndex].DEC_AMOUNT;     

            //objDat.XXSHP_KCO_T_KPP_ACT[intActivityIndex].XXSHP_KCO_T_KPP_SUB[intRowIndex].INT_SUBBRAND_ID = txtValue;
            objDat.XXSHP_KDS_T_KPP_ACT[intActivityIndex].XXSHP_KDS_T_KPP_SUB[intSelectedIndex].TXT_SUBBRAND = txtSubBrand;
            objDat.XXSHP_KDS_T_KPP_ACT[intActivityIndex].XXSHP_KDS_T_KPP_SUB[intSelectedIndex].TXT_SUBUMBRAND = txtSubUmbrand;
            objDat.XXSHP_KDS_T_KPP_ACT[intActivityIndex].XXSHP_KDS_T_KPP_SUB[intSelectedIndex].TXT_REFDOCNO_DOLPHINE = txtMPPDolphine;
            objDat.XXSHP_KDS_T_KPP_ACT[intActivityIndex].XXSHP_KDS_T_KPP_SUB[intSelectedIndex].TXT_DEPARTMENT = txtDepartment;
            objDat.XXSHP_KDS_T_KPP_ACT[intActivityIndex].XXSHP_KDS_T_KPP_SUB[intSelectedIndex].DEC_AVAILABLE = decAvailable;
            objDat.XXSHP_KDS_T_KPP_ACT[intActivityIndex].XXSHP_KDS_T_KPP_SUB[intSelectedIndex].DEC_AVAILABLE_GROUP = decAvailableGroup;

            p_SetHiddenObject(objDat);
            
            clsGlobal.showLoading();
            $.ajax({
                type: "POST",
                url: "/Transaction/KPP/GetCOA",
                data: { intActivityIndex: intActivityIndex, intBudgetIndex: intSelectedIndex, data: $("#txtHiddenObject").val(), __RequestVerificationToken: $('#frmKPP input[name=__RequestVerificationToken]').val() },
                datatype: "json",
                success: function (retDat) {
                    
                    if (retDat.bitSuccess == true) {
                        if (retDat.objData != undefined) {
                            p_SetHiddenObject(retDat.objData);
                        }
                    } else {
                        clsGlobal.getAlert(retDat.txtMessage);
                        objDat.XXSHP_KDS_T_KPP_ACT[intActivityIndex].XXSHP_KDS_T_KPP_SUB[intSelectedIndex].TXT_SUBBRAND = "";
                        objDat.XXSHP_KDS_T_KPP_ACT[intActivityIndex].XXSHP_KDS_T_KPP_SUB[intSelectedIndex].TXT_SUBUMBRAND = "";
                        objDat.XXSHP_KDS_T_KPP_ACT[intActivityIndex].XXSHP_KDS_T_KPP_SUB[intSelectedIndex].INT_COA = 0;
                        objDat.XXSHP_KDS_T_KPP_ACT[intActivityIndex].XXSHP_KDS_T_KPP_SUB[intSelectedIndex].TXT_COA = "";
                        objDat.XXSHP_KDS_T_KPP_ACT[intActivityIndex].XXSHP_KDS_T_KPP_SUB[intSelectedIndex].TXT_REFDOCNO_DOLPHINE = "";
                        objDat.XXSHP_KDS_T_KPP_ACT[intActivityIndex].XXSHP_KDS_T_KPP_SUB[intSelectedIndex].TXT_DEPARTMENT = "";
                        objDat.XXSHP_KDS_T_KPP_ACT[intActivityIndex].XXSHP_KDS_T_KPP_SUB[intSelectedIndex].DEC_AVAILABLE = 0;
                        objDat.XXSHP_KDS_T_KPP_ACT[intActivityIndex].XXSHP_KDS_T_KPP_SUB[intSelectedIndex].DEC_AVAILABLE_GROUP = 0;
                        d.TXT_SUBBRAND = "";
                        d.TXT_SUBUMBRAND = "";
                        d.INT_COA = 0;
                        d.TXT_COA = "";
                        d.TXT_REFDOCNO_DOLPHINE = "";
                        d.TXT_DEPARTMENT = "";
                        d.DEC_AVAILABLE = 0;
                        d.DEC_AVAILABLE_GROUP = 0;
                        p_SetHiddenObject(objDat);
                    }

                    p_RefreshSubbrandSelectedRow(intSelectedIndex);
                    clsGlobal.hideLoading();
                },
                error: function (retDat) {
                    clsGlobal.hideLoading();
                }
            });
              
            this.invalidate(); // invalidate the data DataTables has cached for this row         
            p_EnableControl(objDat.bitApply, objDat); 
        }

        intRowIndex++;
    });

    p_SetHiddenObject(objDat);
    p_GenerateChosen();
}
  
function p_txtAmount_Changed(objCaller, intIndex) {
    
    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());
    for (i = 0; i < objData.XXSHP_KDS_T_KPP_ACT[intActivityIndex].XXSHP_KDS_T_KPP_SUB.length; i++) {
        // Cari Index-nya.
        if (objData.XXSHP_KDS_T_KPP_ACT[intActivityIndex].XXSHP_KDS_T_KPP_SUB[i].intIndex == intIndex) {
            // Ketemu, mulai dari sini:
            objData.XXSHP_KDS_T_KPP_ACT[intActivityIndex].XXSHP_KDS_T_KPP_SUB[i].DEC_AMOUNT = clsGlobal.parseToDecimal(objCaller.value);
            break;
        }
    }
    p_SetHiddenObject(objData);
}
  
function p_rdoSKUAll_TextChanged(objCaller, intIndex) {
    
    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());
    for (i = 0; i < objData.XXSHP_KDS_T_KPP_ACT[intActivityIndex].XXSHP_KDS_T_KPP_SUB.length; i++) {
        // Cari Index-nya.
        if (objData.XXSHP_KDS_T_KPP_ACT[intActivityIndex].XXSHP_KDS_T_KPP_SUB[i].intIndex == intIndex) {
            // Ketemu, mulai dari sini:
            if (objCaller.checked) {
                objData.XXSHP_KDS_T_KPP_ACT[intActivityIndex].XXSHP_KDS_T_KPP_SUB[i].BIT_SKU = "Y";

                $("#ddlSubbrandSKU" + objData.XXSHP_KDS_T_KPP_ACT[intActivityIndex].XXSHP_KDS_T_KPP_SUB[i].intIndex).prop('disabled', true).trigger("chosen:updated");
            }            
            break;
        }
    }
    p_SetHiddenObject(objData);
}


function p_rdoSKUNo_TextChanged(objCaller, intIndex) {
    
    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());
    for (i = 0; i < objData.XXSHP_KDS_T_KPP_ACT[intActivityIndex].XXSHP_KDS_T_KPP_SUB.length; i++) {
        // Cari Index-nya.
        if (objData.XXSHP_KDS_T_KPP_ACT[intActivityIndex].XXSHP_KDS_T_KPP_SUB[i].intIndex == intIndex) {
            // Ketemu, mulai dari sini:
            if (objCaller.checked) {
                objData.XXSHP_KDS_T_KPP_ACT[intActivityIndex].XXSHP_KDS_T_KPP_SUB[i].BIT_SKU = "N";

                $("#ddlSubbrandSKU" + objData.XXSHP_KDS_T_KPP_ACT[intActivityIndex].XXSHP_KDS_T_KPP_SUB[i].intIndex).prop('disabled', false).trigger("chosen:updated");
            }
            break;
        }
    }
    p_SetHiddenObject(objData);
}
  
function p_ddlSubbrandSKU_TextChanged(objCaller, intIndex) {
    
    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());
    for (i = 0; i < objData.XXSHP_KDS_T_KPP_ACT[intActivityIndex].XXSHP_KDS_T_KPP_SUB.length; i++) {
        // Cari Index-nya.
        if (objData.XXSHP_KDS_T_KPP_ACT[intActivityIndex].XXSHP_KDS_T_KPP_SUB[i].intIndex == intIndex) {
            // Ketemu, mulai dari sini:
            //if (objCaller.checked) {
            //    objData.XXSHP_KCO_T_KPP_ACT[intActivityIndex].XXSHP_KCO_T_KPP_SUB[i].BIT_SKU = "N";
            //}
             
            var objArray = $("#ddlSubbrandSKU" + objData.XXSHP_KDS_T_KPP_ACT[intActivityIndex].XXSHP_KDS_T_KPP_SUB[i].intIndex).val();
            for (var iArray = 0; iArray < objArray.length; iArray++) {
                if (iArray == 0) {
                    objData.XXSHP_KDS_T_KPP_ACT[intActivityIndex].XXSHP_KDS_T_KPP_SUB[i].TXT_LIST_SKU_ID = objArray[iArray];
                } else {
                    objData.XXSHP_KDS_T_KPP_ACT[intActivityIndex].XXSHP_KDS_T_KPP_SUB[i].TXT_LIST_SKU_ID += "," + objArray[iArray];
                } 
            }

            // Set TXT_LIST_SKU_NAME
            for (var iArray = 0; iArray < objArray.length; iArray++) {
                for (var iProduct = 0; iProduct < LIST_PRODUCT.length; iProduct++) {
                    if (objArray[iArray] == LIST_PRODUCT[iProduct].TXT_ITEMCODE) {
                        if (iArray == 0) {
                            objData.XXSHP_KDS_T_KPP_ACT[intActivityIndex].XXSHP_KDS_T_KPP_SUB[i].TXT_LIST_SKU_NAME = LIST_PRODUCT[iProduct].TXT_ITEMDESC;
                        } else {
                            objData.XXSHP_KDS_T_KPP_ACT[intActivityIndex].XXSHP_KDS_T_KPP_SUB[i].TXT_LIST_SKU_NAME += "," + LIST_PRODUCT[iProduct].TXT_ITEMDESC;
                        }
                    }                    
                }                
            }

            break;
        }
    }
    p_SetHiddenObject(objData);
}
  
function p_btnSubbrandDelete_Click(objCaller, intIndex) {
    
    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());
    for (i = 0; i < objData.XXSHP_KDS_T_KPP_ACT[intActivityIndex].XXSHP_KDS_T_KPP_SUB.length; i++) {
        // Cari Index-nya.
        if (objData.XXSHP_KDS_T_KPP_ACT[intActivityIndex].XXSHP_KDS_T_KPP_SUB[i].intIndex == intIndex) {
            // Ketemu, mulai dari sini:
            // Remove from list.
            objData.XXSHP_KDS_T_KPP_ACT[intActivityIndex].XXSHP_KDS_T_KPP_SUB.splice(i, 1);

            oTableSubbrand.row(i).remove().draw(false);
            break;
        }
    }
    p_SetHiddenObject(objData);
    p_RefreshNumberSubbrand();
    p_GenerateChosen();
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
        parent.p_setSubbrand();
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
 
  


