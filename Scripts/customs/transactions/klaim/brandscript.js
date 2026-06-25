//     KKP SCRIPT - Umbrand
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
var intDetailIndex;
var intUmbIndex;
var oTableBrand;

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
    intDetailIndex = $.getParameter("intDetailIndex");
    intUmbIndex = $.getParameter("intIndex");
    p_InitiateUmbrand();  
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
        case "txtSubbrand":  
            p_settxtSubbrand(arr[1]);
            break;   
    }
    clsGlobal.closeLOV(); 
}

function p_DataToUI(objDat) {
    
    $("#txtUmbrand").val((objDat.XXSHP_KDS_T_KLAIM_DTL[intDetailIndex].XXSHP_KDS_T_KLAIM_UMB[intUmbIndex].TXT_UMBRAND)); 
    $("#txtBrand").val((objDat.XXSHP_KDS_T_KLAIM_DTL[intDetailIndex].XXSHP_KDS_T_KLAIM_UMB[intUmbIndex].TXT_BRAND));
    $("#txtTotalAmount").val((clsGlobal.parseToDecimal(objDat.XXSHP_KDS_T_KLAIM_DTL[intDetailIndex].XXSHP_KDS_T_KLAIM_UMB[intUmbIndex].DEC_AMOUNT)));

    p_DataToUIBrand(objDat.XXSHP_KDS_T_KLAIM_DTL[intDetailIndex].XXSHP_KDS_T_KLAIM_UMB[intUmbIndex].XXSHP_KDS_T_KLAIM_BRAN);
     
    p_EnableControl(clsGlobal.ParseBooleanOracleToNET(objDat.BIT_APPLY), objDat);
     
    p_SetHiddenObject(objDat);
    if ($("#txtID").val() == "" || $("#txtID").val() == "0") {
        $("#btnDelete").hide();
    } else {
        $("#btnDelete").show();
    }
}

function p_EnableControl(bitApply, objDat) {
    
    if (bitApply == true && clsGlobal.ParseBooleanOracleToNET(objDat.BIT_APPROVED) == true) {
        $("#btnOK").hide(); 
        $("#btnCancel").hide(); 

        $("#btnAddBrand").hide();  
        $(".btnLOVSubBrand").each(function (index) {
            $(this).hide(); 
        }); 
        $(".btnSubBrandDelete").each(function (index) {
            $(this).hide(); 
        });

    } else if (bitApply == true && clsGlobal.ParseBooleanOracleToNET(objDat.BIT_APPROVED) == false) {
        $("#btnOK").show();
        $("#btnCancel").show();

        $("#btnAddBrand").show();
        $(".btnLOVSubBrand").each(function (index) {
            $(this).show();
        });
        $(".btnSubBrandDelete").each(function (index) {
            $(this).show();
        });
    } else if (clsGlobal.ParseBooleanOracleToNET(objDat.BIT_REJECTED) == true) {
        $("#btnOK").hide();
        $("#btnCancel").hide();

        $("#btnAddBrand").hide();
        $(".btnLOVSubBrand").each(function (index) {
            $(this).hide();
        });
        $(".btnSubBrandDelete").each(function (index) {
            $(this).hide();
        });
        $(".chkDetailAllSKU").each(function (index) {
            $(this).attr("disabled", "true");
        });
        $(".txtDetailAmount").each(function (index) {
            $(this).attr("disabled", "true");
        });
    } else {
        $("#btnOK").show();
        $("#btnCancel").show();

        $("#btnAddBrand").show(); 
        $(".btnLOVSubBrand").each(function (index) {
            $(this).show();
        });
        $(".btnSubBrandDelete").each(function (index) {
            $(this).show();
        });

        //kondisi khusus untuk role 1060 admin subdist
        if (objDat.INT_LOGIN_NOW == 1060 && objDat.TXT_STATUSFLOW != "") {
            if (objDat.CREATED_BY != objDat.INT_PEGAWAI_LOGIN_NOW && objDat.TXT_SOURCE_DOC != "BOSNET") {
                //jika dokumen bukan buatan nya admin subdist wajib dikunci semua
                $("#btnOK").hide();
                $("#btnCancel").hide();

                $("#btnAddBrand").hide();
                $(".btnLOVSubBrand").each(function (index) {
                    $(this).hide();
                });
                $(".btnSubBrandDelete").each(function (index) {
                    $(this).hide();
                });
                $(".chkDetailAllSKU").each(function (index) {
                    $(this).attr("disabled", "true");
                });
                $(".txtDetailAmount").each(function (index) {
                    $(this).attr("disabled", "true");
                });
            }
        }
    }

    //khusus buat case dokumen dari BOSNET
    if (objDat.TXT_SOURCE_DOC == "BOSNET") {
        $("#btnOK").hide();
        $("#btnCancel").hide();

        $("#btnAddBrand").hide();
        $(".btnLOVSubBrand").each(function (index) {
            $(this).hide();
        });
        $(".btnSubBrandDelete").each(function (index) {
            $(this).hide();
        });
        $(".chkDetailAllSKU").each(function (index) {
            $(this).attr("disabled", "true");
        });
        $(".txtDetailAmount").each(function (index) {
            $(this).attr("disabled", "true");
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
// Umbrand  
// ==========================

function p_GetSelectedUmbrandRow() {
    var intIndex = clsGlobal.parseToInteger(oTableBrand.$('tr.selected').find("#lblSubBrandNoValue").html()) - 1;
    return intIndex;
}

function p_InitiateUmbrand() {
    // Format datatable  
    
    oTableBrand = $('#dtBrand').DataTable({
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
                      return '<div id="lblSubBrandNoValue" > ' + (full.intIndex + 1) + ' </div>';
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
                              '       <input type="text" class="form-control txtSubBrand" id="txtSubBrand"  value="' + full.TXT_SUBBRAND + '" disabled> ' +
                              '       </div> ' + '<div style="display:none;"> ' + full.TXT_SUBBRAND + ' </div>'
                              '   </div>';
                   }
               },
               {
                   aTargets: [2],
                   mRender: function (data, type, full) {
                       if (clsGlobal.ParseBooleanOracleToNET(full.BIT_ALL_SKU)) {
                           return '<div > <input type="checkbox" id="chkDetailAllSKU" class="chkDetailAllSKU" onchange="p_chkDetailAllSKU_Changed(this,' + full.intIndex + ')"  checked >  </div>';
                       } else {
                           return '<div > <input type="checkbox" id="chkDetailAllSKU" class="chkDetailAllSKU" onchange="p_chkDetailAllSKU_Changed(this,' + full.intIndex + ')" >  </div>';
                       }
                       //return '<div > <input type="checkbox" id="chkDetailAllSKU" class="chkDetailAllSKU" onchange="p_chkDetailAllSKU_Changed(this,' + full.intIndex + ')" disabled >  </div>';
                   }
               },
               {
                   aTargets: [3],
                   mRender: function (data, type, full) {
                       return '<div >  <input type="text" class="form-control txtDetailAmount autonumeric text-right" id="txtDetailAmount' + full.intIndex + '" onchange="p_txtDetailAmount_Changed(this,' + full.intIndex + ')"   value="' + full.DEC_AMOUNT + '" >  </div>';

                   }
               },
             {
                 aTargets: [4],
                 mRender: function (data, type, full) {
                     if (clsGlobal.ParseBooleanOracleToNET(full.BIT_ALL_SKU)) {
                         return '';
                     } else {
                         return '<div > <input type="button" class="btn btn-info btnDetailSKU" id="btnDetailSKU" onclick="p_btnDetailSKU_Click(this,' + full.intIndex + ')"  value="SKU" >  </div>';
                     }
                     
                 }
             },
               { 
                   aTargets: [5],
                   mRender: function (data, type, full) {
                       return '<div > <input type="button" class="btn btn-warning btnSubBrandDelete" id="btnSubBrandDelete" onclick="p_btnSubBrandDelete_Click(this,' + full.intIndex + ')"  value="Delete" >  </div>';
                   }
               }
        ]
    });

    $("#dtBrand").css("width", "100%");
    $('#dtBrand tbody').on('click', 'tr', function () {
        if (!$(this).hasClass('selected')) {  
            oTableBrand.$('tr.selected').removeClass('selected');
            $(this).addClass('selected'); 
        }
    });

}

function p_ShowBlankUmbrand() {
    oTableBrand.clear();
    oTableBrand.draw(false);
}

function p_AddUmbrand() {
    
    clsGlobal.showLoading();
    $.ajax({
        type: "POST",
        url: "/Transaksi/Klaim/AddRowBrand",
        data: { intDetailIndex: intDetailIndex, intUmbIndex: intUmbIndex, data: $("#txtHiddenObject").val(), __RequestVerificationToken: $('#frmKlaim input[name=__RequestVerificationToken]').val() },
        datatype: "json",
        success: function (retDat) {
            
            if (retDat.bitSuccess == true) {
                if (retDat.objData != undefined) {
                    p_SetHiddenObject(retDat.objData);
                    p_DataToUIBrand(retDat.objData.XXSHP_KDS_T_KLAIM_DTL[intDetailIndex].XXSHP_KDS_T_KLAIM_UMB[intUmbIndex].XXSHP_KDS_T_KLAIM_BRAN);
                    oTableBrand.page('last').draw(false);
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
 
function p_DataToUIBrand(XXSHP_KDS_T_KLAIM_BRAN) {
    
    oTableBrand.clear();
    for (var i = 0; i < XXSHP_KDS_T_KLAIM_BRAN.length; i++) {
        XXSHP_KDS_T_KLAIM_BRAN[i].intIndex = i;
        oTableBrand.row.add(XXSHP_KDS_T_KLAIM_BRAN[i]);
    }
    oTableBrand.draw(false);

    var objDat = p_GetHiddenObject();
    objDat.XXSHP_KDS_T_KLAIM_DTL[intDetailIndex].XXSHP_KDS_T_KLAIM_UMB[intUmbIndex].XXSHP_KDS_T_KLAIM_BRAN = XXSHP_KDS_T_KLAIM_BRAN;
    p_SetHiddenObject(objDat);
}
 
function p_RefreshNumberUmbrand() {
    
    var intRowIndex = 0;
    var objDat = p_GetHiddenObject();
    oTableBrand.rows().every(function (rowIdx, tableLoop, rowLoop) {
        
        var d = this.data();
        d.intIndex = intRowIndex; // update data source for the row
        objDat.XXSHP_KDS_T_KLAIM_DTL[intDetailIndex].XXSHP_KDS_T_KLAIM_UMB[intUmbIndex].XXSHP_KDS_T_KLAIM_BRAN[intRowIndex].intIndex = d.intIndex;
        
        d.TXT_SUBBRAND = objDat.XXSHP_KDS_T_KLAIM_DTL[intDetailIndex].XXSHP_KDS_T_KLAIM_UMB[intUmbIndex].XXSHP_KDS_T_KLAIM_BRAN[intRowIndex].TXT_SUBBRAND;
        d.BIT_ALL_SKU = objDat.XXSHP_KDS_T_KLAIM_DTL[intDetailIndex].XXSHP_KDS_T_KLAIM_UMB[intUmbIndex].XXSHP_KDS_T_KLAIM_BRAN[intRowIndex].BIT_ALL_SKU;
        d.DEC_AMOUNT = objDat.XXSHP_KDS_T_KLAIM_DTL[intDetailIndex].XXSHP_KDS_T_KLAIM_UMB[intUmbIndex].XXSHP_KDS_T_KLAIM_BRAN[intRowIndex].DEC_AMOUNT;

        intRowIndex++;
        this.invalidate(); // invalidate the data DataTables has cached for this row         
    });

    // Draw once all updates are done
    oTableBrand.draw(false);
    p_SetHiddenObject(objDat);
}
  

function p_btnLOVSubBrand_Click(objCaller, intIndex) {
    //LOV = clsGlobal.generateLOV(MODULE_SUBBRAND_BRAND, "txtSubbrand", $("#txtBrand").val());
    LOV = clsGlobal.generateLOV(LOV_SUBBRAND_PROMAP_BRAND, "txtSubbrand", $("#txtBrand").val());
}

function p_settxtSubbrand(txtValue1) {
    
    var intSelectedIndex = p_GetSelectedUmbrandRow();
    var intRowIndex = 0;
    var objDat = p_GetHiddenObject();
    oTableBrand.rows().every(function (rowIdx, tableLoop, rowLoop) {
        
        var d = this.data();
        if (intRowIndex == intSelectedIndex) {
            d.intIndex = intRowIndex; // update data source for the row 

            d.TXT_SUBBRAND = txtValue1;
            objDat.XXSHP_KDS_T_KLAIM_DTL[intDetailIndex].XXSHP_KDS_T_KLAIM_UMB[intUmbIndex].XXSHP_KDS_T_KLAIM_BRAN[intRowIndex].TXT_SUBBRAND = txtValue1;
           
            this.invalidate(); // invalidate the data DataTables has cached for this row         
            p_EnableControl(clsGlobal.ParseBooleanOracleToNET(objDat.BIT_APPLY), objDat);
        }

        intRowIndex++;
    });

    p_SetHiddenObject(objDat);
}
   

function p_chkDetailAllSKU_Changed(objCaller, intIndex) {
    
    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());
    for (i = 0; i < objData.XXSHP_KDS_T_KLAIM_DTL[intDetailIndex].XXSHP_KDS_T_KLAIM_UMB[intUmbIndex].XXSHP_KDS_T_KLAIM_BRAN.length; i++) {
        // Cari Index-nya.
        if (objData.XXSHP_KDS_T_KLAIM_DTL[intDetailIndex].XXSHP_KDS_T_KLAIM_UMB[intUmbIndex].XXSHP_KDS_T_KLAIM_BRAN[i].intIndex == intIndex) {
            // Ketemu, mulai dari sini:
            objData.XXSHP_KDS_T_KLAIM_DTL[intDetailIndex].XXSHP_KDS_T_KLAIM_UMB[intUmbIndex].XXSHP_KDS_T_KLAIM_BRAN[i].BIT_ALL_SKU = clsGlobal.ParseBooleanNETToOracle(objCaller.checked);

            if (objData.XXSHP_KDS_T_KLAIM_DTL[intDetailIndex].XXSHP_KDS_T_KLAIM_UMB[intUmbIndex].XXSHP_KDS_T_KLAIM_BRAN[i].BIT_ALL_SKU == "Y") {
                objData.XXSHP_KDS_T_KLAIM_DTL[intDetailIndex].XXSHP_KDS_T_KLAIM_UMB[intUmbIndex].XXSHP_KDS_T_KLAIM_BRAN[i].XXSHP_KDS_T_KLAIM_SKU = [];
            }
            break;
        }
    }
    p_SetHiddenObject(objData);
    p_RefreshNumberUmbrand();
}

function p_txtDetailAmount_Changed(objCaller, intIndex) {
    
    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());
    for (i = 0; i < objData.XXSHP_KDS_T_KLAIM_DTL[intDetailIndex].XXSHP_KDS_T_KLAIM_UMB[intUmbIndex].XXSHP_KDS_T_KLAIM_BRAN.length; i++) {
        // Cari Index-nya.
        if (objData.XXSHP_KDS_T_KLAIM_DTL[intDetailIndex].XXSHP_KDS_T_KLAIM_UMB[intUmbIndex].XXSHP_KDS_T_KLAIM_BRAN[i].intIndex == intIndex) {
            // Ketemu, mulai dari sini:
            objData.XXSHP_KDS_T_KLAIM_DTL[intDetailIndex].XXSHP_KDS_T_KLAIM_UMB[intUmbIndex].XXSHP_KDS_T_KLAIM_BRAN[i].DEC_AMOUNT = clsGlobal.parseToDecimal(objCaller.value);
             
            break;
        }
    }
    p_SetHiddenObject(objData);
    //p_refresh_row_detail(intIndex);
    objCaller.focus();
}


function p_btnDetailSKU_Click(objCaller, intIndex) {
    
    try {
        // Parse dari HiddenObject->JSON
        var objData = JSON.parse(p_UIToData());
        for (i = 0; i < objData.XXSHP_KDS_T_KLAIM_DTL[intDetailIndex].XXSHP_KDS_T_KLAIM_UMB[intUmbIndex].XXSHP_KDS_T_KLAIM_BRAN.length; i++) {
            // Cari Index-nya.
            if (objData.XXSHP_KDS_T_KLAIM_DTL[intDetailIndex].XXSHP_KDS_T_KLAIM_UMB[intUmbIndex].XXSHP_KDS_T_KLAIM_BRAN[i].intIndex == intIndex) {
                // Ketemu, mulai dari sini:

                var fancyboxdata = p_GetHiddenObject();
                LOV = clsGlobal.generatePopUpIframe($(location).attr('protocol') + "//" + $(location).attr('host') + "/Transaksi/Klaim/SKU?intIndex=" + intDetailIndex + "&intDetailIndex=" + intUmbIndex + "&intBrandIndex=" + intIndex, "btnDetailSKU", fancyboxdata);
                break;
            }
        }
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
}
 


function p_btnSubBrandDelete_Click(objCaller, intIndex) {
    
    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());
    for (i = 0; i < objData.XXSHP_KDS_T_KLAIM_DTL[intDetailIndex].XXSHP_KDS_T_KLAIM_UMB[intUmbIndex].XXSHP_KDS_T_KLAIM_BRAN.length; i++) {
        // Cari Index-nya.
        if (objData.XXSHP_KDS_T_KLAIM_DTL[intDetailIndex].XXSHP_KDS_T_KLAIM_UMB[intUmbIndex].XXSHP_KDS_T_KLAIM_BRAN[i].intIndex == intIndex) {
            // Ketemu, mulai dari sini:
            // Remove from list.
            objData.XXSHP_KDS_T_KLAIM_DTL[intDetailIndex].XXSHP_KDS_T_KLAIM_UMB[intUmbIndex].XXSHP_KDS_T_KLAIM_BRAN.splice(i, 1);

            oTableBrand.row(i).remove().draw(false);
            break;
        }
    }
    p_SetHiddenObject(objData);
    p_RefreshNumberUmbrand();
}
 
$('#btnAddBrand').on('click', function () {
    try {
        p_AddUmbrand();
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
});
  

function p_ValidateInput() {
    debugger
    var decTotalHeader = clsGlobal.parseToDecimal($("#txtTotalAmount").val());
    var decTotalItem = 0;
    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());
    for (i = 0; i < objData.XXSHP_KDS_T_KLAIM_DTL[intDetailIndex].XXSHP_KDS_T_KLAIM_UMB[intUmbIndex].XXSHP_KDS_T_KLAIM_BRAN.length; i++) {
        decTotalItem += objData.XXSHP_KDS_T_KLAIM_DTL[intDetailIndex].XXSHP_KDS_T_KLAIM_UMB[intUmbIndex].XXSHP_KDS_T_KLAIM_BRAN[i].DEC_AMOUNT;
        decTotalBrand = objData.XXSHP_KDS_T_KLAIM_DTL[intDetailIndex].XXSHP_KDS_T_KLAIM_UMB[intUmbIndex].XXSHP_KDS_T_KLAIM_BRAN[i].DEC_AMOUNT;
        decTotalSKU = 0;
        if (objData.XXSHP_KDS_T_KLAIM_DTL[intDetailIndex].XXSHP_KDS_T_KLAIM_UMB[intUmbIndex].XXSHP_KDS_T_KLAIM_BRAN[i].BIT_ALL_SKU == "N") {
            for (var j = 0; j < objData.XXSHP_KDS_T_KLAIM_DTL[intDetailIndex].XXSHP_KDS_T_KLAIM_UMB[intUmbIndex].XXSHP_KDS_T_KLAIM_BRAN[i].XXSHP_KDS_T_KLAIM_SKU.length; j++) {
                decTotalSKU += objData.XXSHP_KDS_T_KLAIM_DTL[intDetailIndex].XXSHP_KDS_T_KLAIM_UMB[intUmbIndex].XXSHP_KDS_T_KLAIM_BRAN[i].XXSHP_KDS_T_KLAIM_SKU[j].DEC_AMOUNT;
            }
            if (decTotalBrand != decTotalSKU) {
                throw "Total SKU harus sesuai dengan Amount SubBrand (" + objData.XXSHP_KDS_T_KLAIM_DTL[intDetailIndex].XXSHP_KDS_T_KLAIM_UMB[intUmbIndex].XXSHP_KDS_T_KLAIM_BRAN[i].TXT_SUBBRAND + ")";
            }
        }
    }

    if (decTotalItem != decTotalHeader) {
        throw "Total item harus sama dengan total di header!";
    }

    return true;
}

//function p_CalculateAmount(objData) {
//    var decTotalHeader = clsGlobal.parseToDecimal($("#txtTotalAmount").val());

//    for (i = 0; i < objData.XXSHP_KCO_T_KLAIM_DTL[intDetailIndex].XXSHP_KCO_T_KLAIM_UMB[intUmbIndex].XXSHP_KCO_T_KLAIM_BRAN.length; i++) {
//        var decTotalPerSubUmbrand = 0;
//        for (var j = 0; j < objData.XXSHP_KCO_T_KLAIM_DTL[intDetailIndex].XXSHP_KCO_T_KLAIM_UMB[intUmbIndex].XXSHP_KCO_T_KLAIM_BRAN[i].XXSHP_KCO_T_KLAIM_SKU.length; j++) {
//            decTotalPerSubUmbrand += objData.XXSHP_KCO_T_KLAIM_DTL[intDetailIndex].XXSHP_KCO_T_KLAIM_UMB[intUmbIndex].XXSHP_KCO_T_KLAIM_BRAN[i].XXSHP_KCO_T_KLAIM_SKU[j].DEC_AMOUNT;
//        }
//        objData.XXSHP_KCO_T_KLAIM_DTL[intDetailIndex].XXSHP_KCO_T_KLAIM_UMB[intUmbIndex].XXSHP_KCO_T_KLAIM_BRAN[i].XXSHP_KCO_T_KLAIM_SKU[j].DEC_AMOUNT = decTotalPerSubUmbrand;
//    }
//    $("#txtTotalAmount").val(clsGlobal.parseToRupiah(decTotalPerSubUmbrand));
//}

// ==========================
// END: Umbrand   
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
 
  


