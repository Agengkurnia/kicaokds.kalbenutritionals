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
        case "txtSubbrand":
            p_settxtSubbrand(arr[1]);
            break;
        case "txtItemCode":
            p_settxtItemCode(arr[1], arr[2]);
            break;
        case "btnLOVItemCode":
            p_setbtnLOVItemCode(arr[1], arr[2]);
            break;
    }
    clsGlobal.closeLOV();
}

function p_DataToUI(objData) {
    
    $("#txtID").val(clsGlobal.parseToInteger(objData.INT_PROMAP_HDR_ID));

    $("#txtSubbrand").val(clsGlobal.parseToString(objData.TXT_SUBBRAND));
    $("#txtBrand").val(clsGlobal.parseToString(objData.TXT_BRAND));
    $("#txtSubumbrand").val(clsGlobal.parseToString(objData.TXT_SUBUMBRAND));
    $("#txtItemCode").val(clsGlobal.parseToString(objData.TXT_ITEMCODE));
    $("#txtItemDesc").val(clsGlobal.parseToString(objData.TXT_ITEMDESC));
    $("#txtUmbrand").val(clsGlobal.parseToString(objData.TXT_UMBRAND));
    $("#txtLOB").val(clsGlobal.parseToString(objData.TXT_LOB)); 

    p_DataToUIDetail(objData.XXSHP_KDS_M_PROMAP_DTL); 
    p_SetHiddenObject(objData);
     
    //$("#txtHiddenObject").val(JSON.stringify(objData));
    if ($("#txtID").val() == "" || $("#txtID").val() == "0") {
        $("#btnDelete").hide();
    } else {
        $("#btnDelete").show();
    }
}
 
function p_DataToUIDetail(XXSHP_KDS_M_PROMAP_DTL) {
    

    oTableDetail.clear();
    for (var i = 0; i < XXSHP_KDS_M_PROMAP_DTL.length; i++) {
        XXSHP_KDS_M_PROMAP_DTL[i].intIndex = i; 
        oTableDetail.row.add(XXSHP_KDS_M_PROMAP_DTL[i]);
    }
    oTableDetail.draw(false);

    var objDat = p_GetHiddenObject();
    objDat.XXSHP_KDS_M_PROMAP_DTL = XXSHP_KDS_M_PROMAP_DTL;
    p_SetHiddenObject(objDat);

}

function p_UIToData() {
    
    var jsonObj = [];
    jsonData = p_GetHiddenObject();
    jsonData.INT_PROMAP_HDR_ID = clsGlobal.parseToInteger($("#txtID").val());
    jsonData.TXT_SUBBRAND = $("#txtSubbrand").val();
    jsonData.TXT_BRAND = $("#txtBrand").val().toString();
    jsonData.TXT_SUBUMBRAND = $("#txtSubumbrand").val().toString();
    jsonData.TXT_ITEMCODE = $("#txtItemCode").val().toString();
    jsonData.TXT_ITEMDESC = $("#txtItemDesc").val().toString();
    jsonData.TXT_UMBRAND = $("#txtUmbrand").val().toString();
    jsonData.TXT_LOB = $("#txtLOB").val().toString();

    p_SetHiddenObject(jsonData);
    return $("#txtHiddenObject").val();

}

function p_initiateData() {
    clsGlobal.showLoading();
    $.ajax({
        type: "POST",
        url: "/ProductMapping/InitiateData",
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



function p_setbtnLOVItemCode(txtItemCode, txtItemDesc) { 
    $("#txtItemCode").val(clsGlobal.parseToString(txtItemCode));
    $("#txtItemDesc").val(clsGlobal.parseToString(txtItemDesc));
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
                  aTargets: [2],
                  mRender: function (data, type, full) {
                      return '<div >  <input type="text" style="text-transform: uppercase;" class="form-control text-left txtUmbrand" id="txtItemDesc"  value="' + full.TXT_ITEMDESC + '" disabled >  </div>';
                  }
              }, 
                {
               aTargets: [3],
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
  
//function p_btnLOVSubbrand_Click(objCaller, intIndex) {
//    LOV = clsGlobal.generateLOV(MODULE_BRAND_BRANDBUDGET, "txtSubbrand");
//}

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
     
    $("#txtSubbrand").val(objDat.DescSubBrand.toString());
    $("#txtBrand").val(objDat.txtBrandName.toString());
    $("#txtSubumbrand").val(objDat.txtSubUmbrand.toString()); 
    $("#txtUmbrand").val(objDat.txtumBrandName.toString());
    $("#txtLOB").val((objDat.KN ?? "ALL KN").toString());


    p_SetHiddenObject(objData);
    p_RefreshNumberDetail();
}



function p_btnLOVProduct_Click(objCaller, intIndex) {
    
    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());
    for (i = 0; i < objData.XXSHP_KDS_M_PROMAP_DTL.length; i++) {
        // Cari Index-nya.
        if (objData.XXSHP_KDS_M_PROMAP_DTL[i].intIndex == intIndex) {
            // Ketemu, mulai dari sini: 
            LOV = clsGlobal.generateLOV(LOV_CONSO_SKU_BYSUBUMBRAND, "txtItemCode", $("#txtSubumbrand").val());
            break;
        }
    }
    p_SetHiddenObject(objData); 

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

            objDat.XXSHP_KDS_M_PROMAP_DTL[intSelectedIndex].TXT_ITEMCODE = txtItemCode;
            objDat.XXSHP_KDS_M_PROMAP_DTL[intSelectedIndex].TXT_ITEMDESC = txtItemDesc;

            this.invalidate(); // invalidate the data DataTables has cached for this row   
        }

        intRowIndex++;
    });

    p_SetHiddenObject(objDat); 
}
 
function p_txtID_TextChanged() {
    clsGlobal.showLoading();
    $.ajax({
        type: "POST",
        url: "/ProductMapping/GetData",
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
//        url: "/ProductMapping/GetDataBranch",
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
    if (objData.TXT_SUBBRAND == "") {
        throw "Kolom Subbrand harus di isi!";
    }
    if (objData.TXT_ITEMCODE == "") {
        throw "Kolom Item Code harus di isi!";
    }
    clsGlobal.showLoading();
    $.ajax({
        type: "POST",
        url: "/ProductMapping/AddRow",
        data: { data: $("#txtHiddenObject").val(), __RequestVerificationToken: $('#frmIndex input[name=__RequestVerificationToken]').val() },
        datatype: "json",
        success: function (retDat) {
            
            if (retDat.bitSuccess == true) {
                if (retDat.objData != undefined) {
                    p_SetHiddenObject(retDat.objData);
                    p_DataToUIDetail(retDat.objData.XXSHP_KDS_M_PROMAP_DTL);
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
    for (i = 0; i < objData.XXSHP_KDS_M_PROMAP_DTL.length; i++) {
        // Cari Index-nya.
        if (objData.XXSHP_KDS_M_PROMAP_DTL[i].intIndex == intIndex) {
            // Ketemu, mulai dari sini:
            // Remove from list.
            objData.XXSHP_KDS_M_PROMAP_DTL.splice(i, 1);

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
        objDat.XXSHP_KDS_M_PROMAP_DTL[intRowIndex].intIndex = d.intIndex;
        //objDat.XXSHP_KCO_M_BGT_HDR[intRowIndex].intIndex = d.intIndex;
         
        d.TXT_ITEMCODE = objDat.XXSHP_KDS_M_PROMAP_DTL[intRowIndex].TXT_ITEMCODE;
        d.TXT_ITEMDESC = objDat.XXSHP_KDS_M_PROMAP_DTL[intRowIndex].TXT_ITEMDESC; 

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
        url: "/ProductMapping/SaveData",
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
        url: "/ProductMapping/DeleteData",
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
        LOV = clsGlobal.generateLOV(MODULE_PRODUCTMAPPING, "txtID");
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

$('#btnLOVSubbrand').bind('click', function () {
    try {
        LOV = clsGlobal.generateLOV(MODULE_BRAND_BRANDBUDGET, "txtSubbrand");
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
});

$('#btnLOVItemCode').bind('click', function () {
    try {
        LOV = clsGlobal.generateLOV(LOV_CONSO_SKU_BYSUBUMBRAND, "btnLOVItemCode", $("#txtSubumbrand").val());
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