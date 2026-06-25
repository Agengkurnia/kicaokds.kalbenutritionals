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
var oTableUmbrand;

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
    intDetailIndex = $.getParameter("intIndex");
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
        case "txtUmbrand":  
            p_settxtUmbrand(arr[1],arr[2]);
            break;   
        case "txtBrand":
            //p_settxtBrand(arr[2], arr[7]);
            p_settxtBrand(arr[1], arr[2]);
            break;   
    }
    clsGlobal.closeLOV(); 
}

function p_DataToUI(objDat) {
    //$("#txtTotalAmount").val((clsGlobal.parseToDecimal(objDat.XXSHP_KDS_T_KLAIM_DTL[intDetailIndex].DEC_INVOICE_AMT) - clsGlobal.parseToDecimal(objDat.XXSHP_KDS_T_KLAIM_DTL[intDetailIndex].DEC_PPH) + clsGlobal.parseToDecimal(objDat.XXSHP_KDS_T_KLAIM_DTL[intDetailIndex].DEC_PPN)));
    $("#txtTotalAmount").val((clsGlobal.parseToDecimal(objDat.XXSHP_KDS_T_KLAIM_DTL[intDetailIndex].DEC_INVOICE_AMT)));
     
    p_DataToUIUmbrand(objDat.XXSHP_KDS_T_KLAIM_DTL[intDetailIndex].XXSHP_KDS_T_KLAIM_UMB);
     
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

        $("#btnAddUmbrand").hide();  
        $(".btnLOVUmbrand").each(function (index) {
            $(this).hide(); 
        }); 
        $(".btnUmbrandDelete").each(function (index) {
            $(this).hide(); 
        });

    } else if (bitApply == true && clsGlobal.ParseBooleanOracleToNET(objDat.BIT_APPROVED) == false) {
        $("#btnOK").show();
        $("#btnCancel").show();

        $("#btnAddUmbrand").show();
        $(".btnLOVUmbrand").each(function (index) {
            $(this).show();
        });
        $(".btnUmbrandDelete").each(function (index) {
            $(this).show();
        });
    } else if (clsGlobal.ParseBooleanOracleToNET(objDat.BIT_REJECTED) == true) {
        $("#btnOK").hide();
        $("#btnCancel").hide();

        $("#btnAddUmbrand").hide();
        $(".btnLOVUmbrand").each(function (index) {
            $(this).hide();
        });
        $(".btnLOVBrand").each(function (index) {
            $(this).hide();
        });
        $(".btnUmbrandDelete").each(function (index) {
            $(this).hide();
        });
        $(".chkDetailAllSubBrand").each(function (index) {
            $(this).attr("disabled", "true");
        });
        $(".txtDetailAmount").each(function (index) {
            $(this).attr("disabled", "true");
        });
    } else {
        $("#btnOK").show();
        $("#btnCancel").show();

        $("#btnAddUmbrand").show(); 
        $(".btnLOVUmbrand").each(function (index) {
            $(this).show();
        });
        $(".btnUmbrandDelete").each(function (index) {
            $(this).show();
        });

        //kondisi khusus untuk role 1060 admin subdist
        if (objDat.INT_LOGIN_NOW == 1060 && objDat.TXT_STATUSFLOW != "") {
            if (objDat.CREATED_BY != objDat.INT_PEGAWAI_LOGIN_NOW && objDat.TXT_SOURCE_DOC != "BOSNET") {
                //jika dokumen bukan buatan nya admin subdist wajib dikunci semua
                $("#btnOK").hide();
                $("#btnCancel").hide();

                $("#btnAddUmbrand").hide();
                $(".btnLOVUmbrand").each(function (index) {
                    $(this).hide();
                });
                $(".btnLOVBrand").each(function (index) {
                    $(this).hide();
                });
                $(".btnUmbrandDelete").each(function (index) {
                    $(this).hide();
                });
                $(".chkDetailAllSubBrand").each(function (index) {
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

        $("#btnAddUmbrand").hide();
        $(".btnLOVUmbrand").each(function (index) {
            $(this).hide();
        });
        $(".btnUmbrandDelete").each(function (index) {
            $(this).hide();
        });
        $(".btnLOVBrand").each(function (index) {
            $(this).hide();
        });
        $(".chkDetailAllSubBrand").each(function (index) {
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
    var intIndex = clsGlobal.parseToInteger(oTableUmbrand.$('tr.selected').find("#lblUmbrandNoValue").html()) - 1;
    return intIndex;
}

function p_InitiateUmbrand() {
    // Format datatable  
    
    oTableUmbrand = $('#dtUmbrand').DataTable({
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
                      return '<div id="lblUmbrandNoValue" > ' + (full.intIndex + 1) + ' </div>';
                  }
              },
               { 
                   aTargets: [1],
                   mRender: function (data, type, full) {
                       //return '     <div class="input-group"> ' +
                       //       '       <div class="input-group-btn"> ' +
                       //       '           <button type="button" class="btn btn-danger btnLOVUmbrand" id="btnLOVUmbrand" onclick="p_btnLOVUmbrand_Click(this,' + full.intIndex + ')"> <i class="fa fa-search"></i></button> ' +
                       //       '       </div> ' +
                       //       '       <div class="input-group-btn" style="width:60px;"> ' +
                       //       '       <input type="text" class="form-control txtUmbrand" id="txtUmbrand"  value="' + full.TXT_UMBRAND + '" disabled> ' +
                       //       '       </div> ' +
                       //       '   </div>';
                       return '  <div >     <input type="text" class="form-control txtUmbrand" id="txtUmbrand"  value="' + full.TXT_UMBRAND + '" disabled> </div> ' + '<div style="display:none;"> ' + full.TXT_UMBRAND + ' </div>';
                            
                   }
               },
               {
                   aTargets: [2],
                   mRender: function (data, type, full) {
                       return '     <div class="input-group"> ' +
                              '       <div class="input-group-btn"> ' +
                              '           <button type="button" class="btn btn-danger btnLOVBrand" id="btnLOVBrand" onclick="p_btnLOVBrand_Click(this,' + full.intIndex + ')"> <i class="fa fa-search"></i></button> ' +
                              '       </div> ' +
                              '       <div class="input-group-btn" style="width:60px;"> ' +
                              '       <input type="text" class="form-control txtBrand" id="txtBrand"  value="' + full.TXT_BRAND + '" disabled> ' +
                              '       </div> ' + '<div style="display:none;"> ' + full.TXT_BRAND + ' </div>'
                              '   </div>';
                   }
               },
               {
                   aTargets: [3],
                   mRender: function (data, type, full) {
                       if (clsGlobal.ParseBooleanOracleToNET(full.BIT_ALL_SUBRAND)) {
                           return '<div > <input type="checkbox" id="chkDetailAllSubBrand" class="chkDetailAllSubBrand" onchange="p_chkDetailAllSubBrand_Changed(this,' + full.intIndex + ')"  checked >  </div>';
                       } else {
                           return '<div > <input type="checkbox" id="chkDetailAllSubBrand" class="chkDetailAllSubBrand" onchange="p_chkDetailAllSubBrand_Changed(this,' + full.intIndex + ')" >  </div>';
                       }
                   }
               },
               {
                   aTargets: [4],
                   mRender: function (data, type, full) {
                       return '<div >  <input type="text" class="form-control txtDetailAmount autonumeric text-right" id="txtDetailAmount' + full.intIndex + '" onchange="p_txtDetailAmount_Changed(this,' + full.intIndex + ')"   value="' + full.DEC_AMOUNT + '" >  </div>';

                   }
               },
             {
                 aTargets: [5],
                 mRender: function (data, type, full) {
                     if (clsGlobal.ParseBooleanOracleToNET(full.BIT_ALL_SUBRAND)) {
                         return '';
                     } else {
                         return '<div > <input type="button" class="btn btn-info btnDetailSubbrand" id="btnDetailSubbrand" onclick="p_btnDetailSubbrand_Click(this,' + full.intIndex + ')"  value="SubBrand" >  </div>';
                     }
                     
                 }
             },
               { 
                   aTargets: [6],
                   mRender: function (data, type, full) {
                       return '<div > <input type="button" class="btn btn-warning btnUmbrandDelete" id="btnUmbrandDelete" onclick="p_btnUmbrandDelete_Click(this,' + full.intIndex + ')"  value="Delete" >  </div>';
                   }
               }
        ]
    });

    $("#dtUmbrand").css("width", "100%");
    $('#dtUmbrand tbody').on('click', 'tr', function () {
        if (!$(this).hasClass('selected')) {  
            oTableUmbrand.$('tr.selected').removeClass('selected');
            $(this).addClass('selected'); 
        }
    });

}


function p_ShowBlankUmbrand() {
    oTableUmbrand.clear();
    oTableUmbrand.draw(false);
}

function p_AddUmbrand() {
    
    clsGlobal.showLoading();
    $.ajax({
        type: "POST",
        url: "/Transaksi/Klaim/AddRowUmbrand",
        data: { intDetailIndex: intDetailIndex, data: $("#txtHiddenObject").val(), __RequestVerificationToken: $('#frmKlaim input[name=__RequestVerificationToken]').val() },
        datatype: "json",
        success: function (retDat) {
            
            if (retDat.bitSuccess == true) {
                if (retDat.objData != undefined) {
                    p_SetHiddenObject(retDat.objData);
                    p_DataToUIUmbrand(retDat.objData.XXSHP_KDS_T_KLAIM_DTL[intDetailIndex].XXSHP_KDS_T_KLAIM_UMB);
                    oTableUmbrand.page('last').draw(false);
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
 
function p_DataToUIUmbrand(XXSHP_KDS_T_KLAIM_UMB) {
    
    oTableUmbrand.clear();
    for (var i = 0; i < XXSHP_KDS_T_KLAIM_UMB.length; i++) {
        XXSHP_KDS_T_KLAIM_UMB[i].intIndex = i;
        oTableUmbrand.row.add(XXSHP_KDS_T_KLAIM_UMB[i]);
    }
    oTableUmbrand.draw(false);

    var objDat = p_GetHiddenObject();
    objDat.XXSHP_KDS_T_KLAIM_DTL[intDetailIndex].XXSHP_KDS_T_KLAIM_UMB = XXSHP_KDS_T_KLAIM_UMB;
    p_SetHiddenObject(objDat);
}
 
function p_RefreshNumberUmbrand() {
    
    var intRowIndex = 0;
    var objDat = p_GetHiddenObject();
    oTableUmbrand.rows().every(function (rowIdx, tableLoop, rowLoop) {
        
        var d = this.data();
        d.intIndex = intRowIndex; // update data source for the row
        objDat.XXSHP_KDS_T_KLAIM_DTL[intDetailIndex].XXSHP_KDS_T_KLAIM_UMB[intRowIndex].intIndex = d.intIndex;
        
        d.TXT_UMBRAND = objDat.XXSHP_KDS_T_KLAIM_DTL[intDetailIndex].XXSHP_KDS_T_KLAIM_UMB[intRowIndex].TXT_UMBRAND;
        d.TXT_BRAND = objDat.XXSHP_KDS_T_KLAIM_DTL[intDetailIndex].XXSHP_KDS_T_KLAIM_UMB[intRowIndex].TXT_BRAND;
        d.BIT_ALL_SUBRAND = objDat.XXSHP_KDS_T_KLAIM_DTL[intDetailIndex].XXSHP_KDS_T_KLAIM_UMB[intRowIndex].BIT_ALL_SUBRAND;
        d.DEC_AMOUNT = objDat.XXSHP_KDS_T_KLAIM_DTL[intDetailIndex].XXSHP_KDS_T_KLAIM_UMB[intRowIndex].DEC_AMOUNT;

        intRowIndex++;
        this.invalidate(); // invalidate the data DataTables has cached for this row         
    });

    // Draw once all updates are done
    oTableUmbrand.draw(false);
    p_SetHiddenObject(objDat);
}
  

function p_btnLOVUmbrand_Click(objCaller, intIndex) {
    LOV = clsGlobal.generateLOV(MODULE_UMBRAND, "txtUmbrand");
}

function p_settxtUmbrand(txtValue1 ) {
    
    var intSelectedIndex = p_GetSelectedUmbrandRow();
    var intRowIndex = 0;
    var objDat = p_GetHiddenObject();
    oTableUmbrand.rows().every(function (rowIdx, tableLoop, rowLoop) {
        
        var d = this.data();
        if (intRowIndex == intSelectedIndex) {
            d.intIndex = intRowIndex; // update data source for the row 

            d.TXT_UMBRAND = txtValue1; 
            objDat.XXSHP_KDS_T_KLAIM_DTL[intDetailIndex].XXSHP_KDS_T_KLAIM_UMB[intRowIndex].TXT_UMBRAND = txtValue1;
           
            this.invalidate(); // invalidate the data DataTables has cached for this row         
            p_EnableControl(clsGlobal.ParseBooleanOracleToNET(objDat.BIT_APPLY), objDat);
        }

        intRowIndex++;
    });

    p_SetHiddenObject(objDat);
}
  

function p_btnLOVBrand_Click(objCaller, intIndex) {
    //LOV = clsGlobal.generateLOV(MODULE_BRAND, "txtBrand");
    LOV = clsGlobal.generateLOV(LOV_UMBRAND_PROMAP, "txtBrand", $("#txtSubbrand").val());
}

function p_settxtBrand(txtValue1, txtValue2) {
    
    var intSelectedIndex = p_GetSelectedUmbrandRow();
    var intRowIndex = 0;
    var objDat = p_GetHiddenObject();
    oTableUmbrand.rows().every(function (rowIdx, tableLoop, rowLoop) {
        
        var d = this.data();
        if (intRowIndex == intSelectedIndex) {
            d.intIndex = intRowIndex; // update data source for the row 

            d.TXT_BRAND = txtValue1;
            d.TXT_UMBRAND = txtValue2;
            objDat.XXSHP_KDS_T_KLAIM_DTL[intDetailIndex].XXSHP_KDS_T_KLAIM_UMB[intRowIndex].TXT_BRAND = txtValue1;
            objDat.XXSHP_KDS_T_KLAIM_DTL[intDetailIndex].XXSHP_KDS_T_KLAIM_UMB[intRowIndex].TXT_UMBRAND = txtValue2;

            this.invalidate(); // invalidate the data DataTables has cached for this row         
            p_EnableControl(clsGlobal.ParseBooleanOracleToNET(objDat.BIT_APPLY), objDat);
        }

        intRowIndex++;
    });

    p_SetHiddenObject(objDat);
}


function p_chkDetailAllSubBrand_Changed(objCaller, intIndex) {
    
    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());
    for (i = 0; i < objData.XXSHP_KDS_T_KLAIM_DTL[intDetailIndex].XXSHP_KDS_T_KLAIM_UMB.length; i++) {
        // Cari Index-nya.
        if (objData.XXSHP_KDS_T_KLAIM_DTL[intDetailIndex].XXSHP_KDS_T_KLAIM_UMB[i].intIndex == intIndex) {
            // Ketemu, mulai dari sini:
            objData.XXSHP_KDS_T_KLAIM_DTL[intDetailIndex].XXSHP_KDS_T_KLAIM_UMB[i].BIT_ALL_SUBRAND = clsGlobal.ParseBooleanNETToOracle(objCaller.checked);

            if (objData.XXSHP_KDS_T_KLAIM_DTL[intDetailIndex].XXSHP_KDS_T_KLAIM_UMB[i].BIT_ALL_SUBRAND == "Y") {
                objData.XXSHP_KDS_T_KLAIM_DTL[intDetailIndex].XXSHP_KDS_T_KLAIM_UMB[i].XXSHP_KDS_T_KLAIM_BRAN = [];
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
    for (i = 0; i < objData.XXSHP_KDS_T_KLAIM_DTL[intDetailIndex].XXSHP_KDS_T_KLAIM_UMB.length; i++) {
        // Cari Index-nya.
        if (objData.XXSHP_KDS_T_KLAIM_DTL[intDetailIndex].XXSHP_KDS_T_KLAIM_UMB[i].intIndex == intIndex) {
            // Ketemu, mulai dari sini:
            objData.XXSHP_KDS_T_KLAIM_DTL[intDetailIndex].XXSHP_KDS_T_KLAIM_UMB[i].DEC_AMOUNT = clsGlobal.parseToDecimal(objCaller.value);
             
            break;
        }
    }
    p_SetHiddenObject(objData);
    //p_refresh_row_detail(intIndex);
    objCaller.focus();
}


function p_btnDetailSubbrand_Click(objCaller, intIndex) {
    
    try {
        // Parse dari HiddenObject->JSON
        var objData = JSON.parse(p_UIToData());
        for (i = 0; i < objData.XXSHP_KDS_T_KLAIM_DTL[intDetailIndex].XXSHP_KDS_T_KLAIM_UMB.length; i++) {
            // Cari Index-nya.
            if (objData.XXSHP_KDS_T_KLAIM_DTL[intDetailIndex].XXSHP_KDS_T_KLAIM_UMB[i].intIndex == intIndex) {
                // Ketemu, mulai dari sini:

                var fancyboxdata = p_GetHiddenObject();
                LOV = clsGlobal.generatePopUpIframe($(location).attr('protocol') + "//" + $(location).attr('host') + "/Transaksi/Klaim/Brand?intIndex=" + intIndex + "&intDetailIndex=" + intDetailIndex, "btnDetailBrand", fancyboxdata);
                break;
            }
        }
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
}


function p_btnUmbrandDelete_Click(objCaller, intIndex) {
    
    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());
    for (i = 0; i < objData.XXSHP_KDS_T_KLAIM_DTL[intDetailIndex].XXSHP_KDS_T_KLAIM_UMB.length; i++) {
        // Cari Index-nya.
        if (objData.XXSHP_KDS_T_KLAIM_DTL[intDetailIndex].XXSHP_KDS_T_KLAIM_UMB[i].intIndex == intIndex) {
            // Ketemu, mulai dari sini:
            // Remove from list.
            objData.XXSHP_KDS_T_KLAIM_DTL[intDetailIndex].XXSHP_KDS_T_KLAIM_UMB.splice(i, 1);

            oTableUmbrand.row(i).remove().draw(false);
            break;
        }
    }
    p_SetHiddenObject(objData);
    p_RefreshNumberUmbrand();
}
 
$('#btnAddUmbrand').on('click', function () {
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
    for (i = 0; i < objData.XXSHP_KDS_T_KLAIM_DTL[intDetailIndex].XXSHP_KDS_T_KLAIM_UMB.length; i++) {
        decTotalItem += objData.XXSHP_KDS_T_KLAIM_DTL[intDetailIndex].XXSHP_KDS_T_KLAIM_UMB[i].DEC_AMOUNT;
        decTotalUmbrand = objData.XXSHP_KDS_T_KLAIM_DTL[intDetailIndex].XXSHP_KDS_T_KLAIM_UMB[i].DEC_AMOUNT;
        var decTotalBrand = 0;
        if (objData.XXSHP_KDS_T_KLAIM_DTL[intDetailIndex].XXSHP_KDS_T_KLAIM_UMB[i].BIT_ALL_SUBRAND == "N") {
            for (var j = 0; j < objData.XXSHP_KDS_T_KLAIM_DTL[intDetailIndex].XXSHP_KDS_T_KLAIM_UMB[i].XXSHP_KDS_T_KLAIM_BRAN.length; j++) {
                decTotalBrand += objData.XXSHP_KDS_T_KLAIM_DTL[intDetailIndex].XXSHP_KDS_T_KLAIM_UMB[i].XXSHP_KDS_T_KLAIM_BRAN[j].DEC_AMOUNT;
            }
            if (decTotalUmbrand != decTotalBrand) {
                throw "Total SubBrand harus sesuai dengan Amount Umbrand (" + objData.XXSHP_KDS_T_KLAIM_DTL[intDetailIndex].XXSHP_KDS_T_KLAIM_UMB[i].TXT_UMBRAND + ")";
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
//    //var objData = JSON.parse(p_UIToData());

//    for (i = 0; i < objData.XXSHP_KCO_T_KLAIM_DTL[intDetailIndex].XXSHP_KCO_T_KLAIM_UMB.length; i++) {
//        var decTotalPerUmbrand = 0;
//        for (var j = 0; j < objData.XXSHP_KCO_T_KLAIM_DTL[intDetailIndex].XXSHP_KCO_T_KLAIM_UMB[i].XXSHP_KCO_T_KLAIM_BRAN.length; j++) {
//            decTotalPerUmbrand += objData.XXSHP_KCO_T_KLAIM_DTL[intDetailIndex].XXSHP_KCO_T_KLAIM_UMB[i].XXSHP_KCO_T_KLAIM_BRAN[j].DEC_AMOUNT;
//        }
//        objData.XXSHP_KCO_T_KLAIM_DTL[intDetailIndex].XXSHP_KCO_T_KLAIM_UMB[i].DEC_AMOUNT = decTotalPerUmbrand;
//    }
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
 
  


