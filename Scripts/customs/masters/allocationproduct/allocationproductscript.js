//=======================
// VARIABLE GLOBAL
//=======================
var clsGlobal = new clsGlobalClass();
var LOV;
var bitLoading = false;
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
    p_initiateData();
    p_InitiateDetail();

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
        case "txtID": $("#txtID").val(arr[1]);
            p_txtID_TextChanged();
            break;
        case "txtGroupAccount":
            $("#txtGroupAccount").val(arr[1]);
            
            break;
        case "txtSupplierID":
            $("#txtSupplierID").val(arr[1]);
            $("#txtSupplierName").val(arr[2]);
            //p_txtSupplierID_TextChanged();
            break;
        case "txtBranchID":
            p_settxtBranch(arr[1]);
            break;
        case "txtSubbrand":
            //p_settxtSubbrand(arr[1]);
            p_txtsubbrand(arr[1], arr[2], arr[3], arr[4], arr[5])
            break;
        case "txtItemCode":
            p_settxtItemCode(arr[1], arr[2]);
            break;
    }
    clsGlobal.closeLOV();
}

function p_DataToUI(objData) {
    
    $("#txtID").val(clsGlobal.parseToInteger(objData.INT_ALOPRO_HDR_ID));

    $("#txtGroupAccount").val(clsGlobal.parseToString(objData.TXT_GROUP_ACCOUNT));
    $("#txtSupplierID").val(clsGlobal.parseToInteger(objData.TXT_SUPPLIER_CODE));
    $("#txtSupplierName").val(clsGlobal.parseToString(objData.TXT_SUPPLIER_NAME));

    p_DataToUIDetail(objData.XXSHP_KDS_M_ALOPRO_DTL);
    p_calculateTotal();
    p_SetHiddenObject(objData);
     
    //$("#txtHiddenObject").val(JSON.stringify(objData));
    if ($("#txtID").val() == "" || $("#txtID").val() == "0") {
        $("#btnDelete").hide();
    } else {
        $("#btnDelete").show();
    }
}

function p_calculateTotal() {
    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());
    var decTotal = 0;
    for (i = 0; i < objData.XXSHP_KDS_M_ALOPRO_DTL.length; i++) {
        decTotal += objData.XXSHP_KDS_M_ALOPRO_DTL[i].DEC_ALOKASI;
    }

    $("#lblTotalAlokasi").html(decTotal.toString() + "%");
}

function p_DataToUIDetail(XXSHP_KDS_M_ALOPRO_DTL) {
    

    oTableDetail.clear();
    for (var i = 0; i < XXSHP_KDS_M_ALOPRO_DTL.length; i++) {
        XXSHP_KDS_M_ALOPRO_DTL[i].intIndex = i;

        oTableDetail.row.add(XXSHP_KDS_M_ALOPRO_DTL[i]);
    }
    oTableDetail.draw(false);

    var objDat = p_GetHiddenObject();
    objDat.XXSHP_KDS_M_ALOPRO_DTL = XXSHP_KDS_M_ALOPRO_DTL;
    p_SetHiddenObject(objDat);

}

function p_UIToData() {
    
    var jsonObj = [];
    jsonData = p_GetHiddenObject();
    jsonData.INT_ALOPRO_HDR_ID = clsGlobal.parseToInteger($("#txtID").val());
    jsonData.TXT_SUPPLIER_CODE = clsGlobal.parseToInteger($("#txtSupplierID").val());
    jsonData.TXT_GROUP_ACCOUNT = $("#txtGroupAccount").val().toString();
    jsonData.TXT_SUPPLIER_NAME = $("#txtSupplierName").val().toString();

    p_SetHiddenObject(jsonData);
    return $("#txtHiddenObject").val();

}

function p_initiateData() {
    clsGlobal.showLoading();
    $.ajax({
        type: "POST",
        url: "/AllocationProduct/InitiateData",
        data: { __RequestVerificationToken: $('#frmIndex input[name=__RequestVerificationToken]').val() },
        datatype: "json",
        success: function (retDat) {

            if (retDat.bitSuccess == true) {
                if (retDat.objData != undefined) {
                    p_SetHiddenObject(retDat.objData);
                    //$("#txtHiddenObject").val(JSON.stringify(retDat.objData));
                    p_DataToUI(retDat.objData);
                    $("#txtGUID").val(retDat.txtGUID);

                    p_getParameterID();
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


function p_getParameterID() {
    var id = $.getParameter("id");
    if (id != undefined) {
        $("#txtID").val(id);
        p_txtID_TextChanged();
    }
}

function p_GetSelectedDetail() {
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
        "aLengthMenu": [[5, 10, 25, 50, 75, 100], [5, 10, 25, 50, 75, 100]],
        "iDisplayLength": 5,
        "scrollX": true,
        aoColumnDefs: [
              {
                  aTargets: [0],
                  mRender: function (data, type, full) {
                      return '<div id="lblDetailNoValue"> ' + (full.intIndex + 1) + ' </div>';
                  }
              },
              {
                  aTargets: [1],
                  mRender: function (data, type, full) {
                      return '<div >  <input type="text" style="text-transform: uppercase;" class="form-control text-left txtUmbrand" id="txtUmbrand"  value="' + full.TXT_UMBRAND + '" disabled >  </div>';
                  }
              },
              {
                  aTargets: [2],
                  mRender: function (data, type, full) {
                      return '<div >  <input type="text" style="text-transform: uppercase;" class="form-control text-left txtUmbrand" id="txtBrand"  value="' + full.TXT_BRAND + '" disabled >  </div>';
                  }
              },
              {
                  aTargets: [3],
                  mRender: function (data, type, full) {
                      //return '<div >  <input type="text" style="text-transform: uppercase;" class="form-control text-left txtUmbrand" id="txtBrand"  value="' + full.TXT_SUBBRAND + '" disabled >  </div>';
                      return '     <div class="input-group"> ' +
                          '       <div class="input-group-btn"> ' +
                          '           <button type="button" class="btn btn-danger btnLOVSubbrand" id="btnLOVSubbrand" onclick="p_btnLOVSubbrand_Click(this,' + full.intIndex + ')"> <i class="fa fa-search"></i></button> ' +
                          '       </div> ' +
                          '       <div class="input-group-btn" style="width:60px;"> ' +
                          '       <input type="text" class="form-control txtSubbrand" id="txtSubbrand" value="' + full.TXT_SUBBRAND + '" disabled> ' +
                          '       </div> ' +
                          '   </div>';

                  }
              },
              {
                  aTargets: [4],
                  mRender: function (data, type, full) {
                      return '     <div class="input-group"> ' +
                          '       <div class="input-group-btn"> ' +
                          '           <button type="button" class="btn btn-danger btnLOVProduct" id="btnLOVProduct" onclick="p_btnLOVProduct_Click(this,' + full.intIndex + ')"> <i class="fa fa-search"></i></button> ' +
                          '       </div> ' +
                          '       <div class="input-group-btn" style="width:60px;"> ' +
                          '       <input type="text" class="form-control txtItemCode" id="txtItemCode" value="' + full.TXT_ITEMCODE + '" disabled> ' +
                          '       </div> ' +
                          '   </div>';
                  }
              },
              {
                  aTargets: [5],
                  mRender: function (data, type, full) {
                      return '<div >  <input type="text" style="text-transform: uppercase;" class="form-control text-left txtUmbrand" id="txtItemDesc"  value="' + full.TXT_ITEMDESC + '" disabled >  </div>';
                  }
              },
              {
                  aTargets: [6],
                  mRender: function (data, type, full) {
                      return '<input type="text" class="form-control txtAlokasi autonumeric text-right" id="txtAlokasi" onchange="p_txtAlokasi_Changed(this,' + full.intIndex + ')"  value="' + full.DEC_ALOKASI + '"> ';
                  }
              },
                {
               aTargets: [7],
               mRender: function (data, type, full) {
                   return '<div > <input type="button" class="btn btn-warning btnDetailDelete" id="btnDetailDelete" onclick="p_btnDetailDelete_Click(this,' + full.intIndex + ')"  value="Delete" >  </div>';

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
  
function p_SetHiddenObject(objDat) {
    $("#txtHiddenObject").val(JSON.stringify(objDat));
    p_GenerateAutoNumeric()
    p_GenerateDateTimePicker();
}

function p_GenerateDateTimePicker() {
    //
    $('.datetimepicker').datepicker({
        autoclose: true,
    });

}

function p_GenerateAutoNumeric() {
    //
    $('.autonumeric').autoNumeric('init', { vMax: '9999999999999', vMin: '-9999999999999', aSep: ',', dGroup: '3', aDec: '.' });
}

function p_GetHiddenObject() {
    return JSON.parse($("#txtHiddenObject").val());
}

//function p_SetCurrentRowBranch(intIndex) {
//    
//    $("#txtCurrentBranchRow").val(intIndex);
//}

//function p_GetCurrentRowBranch() {
//    
//    var index = $("#txtCurrentBranchRow").val();
//    return index;
//}

function p_btnLOVSubbrand_Click(objCaller, intIndex) {
    //LOV = clsGlobal.generateLOV(MODULE_BRAND_BRANDBUDGET, "txtSubbrand");
    LOV = clsGlobal.generateLOV(LOV_SUBBRAND_PROMAP, "txtSubbrand");
}

function p_settxtSubbrand(intBrandID) { 
    
    clsGlobal.showLoading();
    $.ajax({
        type: "POST",
        url: "/Master/Budget/GetDataBrand",
        data: { intBrandID: intBrandID, __RequestVerificationToken: $('#frmIndex input[name=__RequestVerificationToken]').val() },
        datatype: "json",
        success: function (retDat) {
            
            console.log(retDat.objData);
            if (retDat.bitSuccess == true) {
                if (retDat.objData != undefined) {
                    p_txtsubbrand_Changed_LOV(retDat.objData); 
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


function p_txtsubbrand_Changed_LOV(objDat) {
    
    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());
    var intIndex = p_GetSelectedDetail();

    objData.XXSHP_KDS_M_ALOPRO_DTL[intIndex].TXT_UMBRAND = objDat.txtumBrandName.toString(); 
    objData.XXSHP_KDS_M_ALOPRO_DTL[intIndex].TXT_SUBUMBRAND = objDat.txtSubUmbrand.toString();  
    objData.XXSHP_KDS_M_ALOPRO_DTL[intIndex].TXT_BRAND = objDat.txtBrandName.toString();  
    objData.XXSHP_KDS_M_ALOPRO_DTL[intIndex].TXT_SUBBRAND = objDat.DescSubBrand.toString(); 
    objData.XXSHP_KDS_M_ALOPRO_DTL[intIndex].TXT_LOB = objDat.KN.toString(); 
      
    p_SetHiddenObject(objData);
    p_RefreshNumberDetail();
}

function p_txtsubbrand(txtValue1, txtValue2, txtValue3, txtValue4, txtValue5) {
    
    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());
    var intIndex = p_GetSelectedDetail();

    objData.XXSHP_KDS_M_ALOPRO_DTL[intIndex].TXT_UMBRAND = txtValue4;
    objData.XXSHP_KDS_M_ALOPRO_DTL[intIndex].TXT_SUBUMBRAND = txtValue3;
    objData.XXSHP_KDS_M_ALOPRO_DTL[intIndex].TXT_BRAND = txtValue2;
    objData.XXSHP_KDS_M_ALOPRO_DTL[intIndex].TXT_SUBBRAND = txtValue1;
    objData.XXSHP_KDS_M_ALOPRO_DTL[intIndex].TXT_LOB = txtValue5;

    p_SetHiddenObject(objData);
    p_RefreshNumberDetail();
}




function p_btnLOVProduct_Click(objCaller, intIndex) {
    
    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());
    for (i = 0; i < objData.XXSHP_KDS_M_ALOPRO_DTL.length; i++) {
        // Cari Index-nya.
        if (objData.XXSHP_KDS_M_ALOPRO_DTL[i].intIndex == intIndex) {
            // Ketemu, mulai dari sini: 
            // LOV = clsGlobal.generateLOV(LOV_CONSO_SKU_BYSUBUMBRAND, "txtItemCode", objData.XXSHP_KCO_M_ALOPRO_DTL[i].TXT_SUBUMBRAND);
            LOV = clsGlobal.generateLOV(LOV_ITEMCODE_PROMAP_SUBBRAND, "txtItemCode", objData.XXSHP_KDS_M_ALOPRO_DTL[i].TXT_SUBBRAND);
            break;
        }
    }
    p_SetHiddenObject(objData);
    p_calculateTotal();

}

function p_settxtItemCode(txtItemCode, txtItemDesc) {
    
    var intSelectedIndex = p_GetSelectedDetail();
    var intRowIndex = 0;
    var objDat = p_GetHiddenObject();
     
    oTableDetail.rows().every(function (rowIdx, tableLoop, rowLoop) {
        
        var d = this.data();
        if (intRowIndex == intSelectedIndex) {

            d.intIndex = intRowIndex; // update data source for the row 

            d.TXT_ITEMCODE = txtItemCode;
            d.TXT_ITEMDESC = txtItemDesc;

            objDat.XXSHP_KDS_M_ALOPRO_DTL[intSelectedIndex].TXT_ITEMCODE = txtItemCode;
            objDat.XXSHP_KDS_M_ALOPRO_DTL[intSelectedIndex].TXT_ITEMDESC = txtItemDesc;

            this.invalidate(); // invalidate the data DataTables has cached for this row   
        }

        intRowIndex++;
    });

    p_SetHiddenObject(objDat); 
}

function p_txtAlokasi_Changed(objCaller, intIndex) {
    
    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());
    for (i = 0; i < objData.XXSHP_KDS_M_ALOPRO_DTL.length; i++) {
        // Cari Index-nya.
        if (objData.XXSHP_KDS_M_ALOPRO_DTL[i].intIndex == intIndex) {
            // Ketemu, mulai dari sini:
            objData.XXSHP_KDS_M_ALOPRO_DTL[i].DEC_ALOKASI = clsGlobal.parseToDecimal(objCaller.value);
            break;
        }
    }
    p_SetHiddenObject(objData);
    p_calculateTotal();
}

function p_txtID_TextChanged() {
    clsGlobal.showLoading();
    $.ajax({
        type: "POST",
        url: "/AllocationProduct/GetData",
        data: { txtID: $("#txtID").val(), __RequestVerificationToken: $('#frmIndex input[name=__RequestVerificationToken]').val() },
        datatype: "json",
        success: function (retDat) {
            
            if (retDat.bitSuccess == true) {
                if (retDat.objData != undefined) { 
                    p_DataToUI(retDat.objData);
                    $("#txtGUID").val(retDat.txtGUID); 
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

//function p_settxtBranch(intBranchID) {
//    
//    clsGlobal.showLoading();
//    $.ajax({
//        type: "POST",
//        url: "/AllocationProduct/GetDataBranch",
//        data: { intBranchID: intBranchID, __RequestVerificationToken: $('#frmIndex input[name=__RequestVerificationToken]').val() },
//        datatype: "json",
//        success: function (retDat) {
//            
//            console.log(retDat.objData);
//            if (retDat.bitSuccess == true) {
//                if (retDat.objData != undefined) {
//                    p_txtBranch_Changed_LOV(retDat.objData);
//                    //p_EnableControl(false);
//                } else {
//                    p_showBlank();
//                }
//            } else {
//                clsGlobal.getAlert(retDat.txtMessage);
//            }
//            clsGlobal.hideLoading();

//        },
//        error: function (retDat) {
//            
//            clsGlobal.hideLoading();
//        }
//    });
//}
 
function p_AddDetail() {
    
    p_UIToData();
    var objData = p_GetHiddenObject();
    if (objData.TXT_GROUP_ACCOUNT == "") {
        throw "Kolom Group Account harus di isi!";
    }
    if (objData.TXT_SUPPLIER_NAME == "") {
        throw "Kolom Account Name harus di isi!";
    }
    clsGlobal.showLoading();
    $.ajax({
        type: "POST",
        url: "/AllocationProduct/AddRow",
        data: { data: $("#txtHiddenObject").val(), __RequestVerificationToken: $('#frmIndex input[name=__RequestVerificationToken]').val() },
        datatype: "json",
        success: function (retDat) {
            
            if (retDat.bitSuccess == true) {
                if (retDat.objData != undefined) {
                    p_SetHiddenObject(retDat.objData);
                    p_DataToUIDetail(retDat.objData.XXSHP_KDS_M_ALOPRO_DTL);
                    oTableDetail.page('last').draw(false); 
                }
            } else {
                clsGlobal.getAlert(retDat.txtMessage);
            }
            $("#txtGUID").val(retDat.txtGUID);
            clsGlobal.hideLoading();
        },
        error: function (retDat) {
            clsGlobal.hideLoading();
        }
    });
}

function p_btnDetailDelete_Click(objCaller, intIndex) {
    
    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());
    for (i = 0; i < objData.XXSHP_KDS_M_ALOPRO_DTL.length; i++) {
        // Cari Index-nya.
        if (objData.XXSHP_KDS_M_ALOPRO_DTL[i].intIndex == intIndex) {
            // Ketemu, mulai dari sini:
            // Remove from list.
            objData.XXSHP_KDS_M_ALOPRO_DTL.splice(i, 1);

            oTableDetail.row(i).remove().draw(false);
            break;
        }
    }
    p_SetHiddenObject(objData);
    p_RefreshNumberDetail();
    p_EnableControl(false);
}

function p_RefreshNumberDetail() {
    
    var intRowIndex = 0;
    var objDat = p_GetHiddenObject();
    oTableDetail.rows().every(function (rowIdx, tableLoop, rowLoop) {
        
        var d = this.data();
        d.intIndex = intRowIndex; // update data source for the row
        objDat.XXSHP_KDS_M_ALOPRO_DTL[intRowIndex].intIndex = d.intIndex;
        //objDat.XXSHP_KCO_M_BGT_HDR[intRowIndex].intIndex = d.intIndex;

        d.TXT_UMBRAND = objDat.XXSHP_KDS_M_ALOPRO_DTL[intRowIndex].TXT_UMBRAND;
        d.TXT_SUBUMBRAND = objDat.XXSHP_KDS_M_ALOPRO_DTL[intRowIndex].TXT_SUBUMBRAND;
        d.TXT_BRAND = objDat.XXSHP_KDS_M_ALOPRO_DTL[intRowIndex].TXT_BRAND;
        d.TXT_SUBBRAND = objDat.XXSHP_KDS_M_ALOPRO_DTL[intRowIndex].TXT_SUBBRAND;
        d.TXT_ITEMCODE = objDat.XXSHP_KDS_M_ALOPRO_DTL[intRowIndex].TXT_ITEMCODE;
        d.TXT_ITEMDESC = objDat.XXSHP_KDS_M_ALOPRO_DTL[intRowIndex].TXT_ITEMDESC;
        d.DEC_ALOKASI = objDat.XXSHP_KDS_M_ALOPRO_DTL[intRowIndex].DEC_ALOKASI;

        intRowIndex++;
        this.invalidate(); // invalidate the data DataTables has cached for this row         
    });

    // Draw once all updates are done
    oTableDetail.draw(false);
    p_SetHiddenObject(objDat);
}

function p_saveData() {
    
    clsGlobal.showLoading();
    p_UIToData();
    $.ajax({
        type: "POST",
        url: "/AllocationProduct/SaveData",
        data: { data: $("#txtHiddenObject").val(), txtGUID: $("#txtGUID").val(), __RequestVerificationToken: $('#frmIndex input[name=__RequestVerificationToken]').val() },
        datatype: "json",
        success: function (retDat) {
            
            if (retDat.bitSuccess == true) { 
                p_DataToUI(retDat.objData); 
                clsGlobal.getInformationMessage(retDat.txtMessage);
            } else {
                clsGlobal.getAlert(retDat.txtMessage);
            }
            $("#txtGUID").val(retDat.txtGUID);
            clsGlobal.hideLoading();
        },
        error: function (retDat) {
            
            clsGlobal.hideLoading();
        }
    });
}

function p_deleteData() {
    clsGlobal.showLoading();
    p_UIToData();
    $.ajax({
        type: "POST",
        url: "/AllocationProduct/DeleteData",
        data: { data: $("#txtHiddenObject").val(), txtGUID: $("#txtGUID").val(), __RequestVerificationToken: $('#frmIndex input[name=__RequestVerificationToken]').val() },
        datatype: "json",
        success: function (retDat) {
            
            if (retDat.bitSuccess == true) {
                p_DataToUI(retDat.objData);
                clsGlobal.getInformationMessage(retDat.txtMessage);
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

//=======================
// HANDLER
//=======================

$('#btnFind').bind('click', function () {
    try {
        LOV = clsGlobal.generateLOV(MODULE_ALLOCATIONPRODUCT, "txtID");
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
});

$('#btnSave').bind('click', function () {
    try {
        clsGlobal.getConfirmation("Save this data?", function (result) {
            if (result == true) {
                p_saveData();
            }
            else {
                return false;
            }
        });
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
});

//$('#btnDelete').bind('click', function () {
//    try {
//        clsGlobal.getConfirmation("Delete this data?", function (result) {
//            if (result == true) {
//                p_deleteData();
//            }
//            else {
//                return false;
//            }
//        });
//    } catch (ex) {
//        clsGlobal.showAlert(ex);
//    }
//});

$('#btnLOVGroupAccount').bind('click', function () {
    try {
        //LOV = clsGlobal.generateLOV(LOV_XXSHP_KPP_VENDOR_SITE_ALL_V, "txtGroupAccount");
        LOV = clsGlobal.generateLOV(LOV_GROUP_ACCOUNT, "txtGroupAccount");
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
});

$('#btnLOVSupplier').bind('click', function () {
    try {
        LOV = clsGlobal.generateLOV(LOV_KSUP_SUPPLIER, "txtSupplierID", $("#txtGroupAccount").val());
        //LOV = clsGlobal.generateLOV(LOV_XXSHP_KPP_VENDOR_SITE_ALL_V, "txtSupplierID");
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
});

//function p_btnBranchLOVID(objCaller, intIndex) {
//    
//    p_SetCurrentRowBranch(objCaller);
//    try {
//        LOV = clsGlobal.generateLOV(MODULE_BRANCH, "txtBranchID");
//    } catch (ex) {
//        clsGlobal.showAlert(ex);
//    }
//}

$('#btnAddDetail').on('click', function () {
    try {
        p_AddDetail();
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
});

$('#btnNew').bind('click', function () {
    try {
        p_showBlank();
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
});