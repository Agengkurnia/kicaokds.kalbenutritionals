//=======================
// VARIABLE GLOBAL
//=======================
var clsGlobal = new clsGlobalClass();
var LOV;
var bitLoading = false;
//var oTable;


//=======================
// Confirmation
//======================= 

//=======================
// ON PAGE LOAD
//=======================
$(document).ready(function () { 
    p_InitForm();
    p_validatePage();
    //p_showPrevData(); 
});

//=======================
// FUNCTION
//=======================
function p_InitForm() {
    p_initiateData();
    //p_showPrevData();
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

    }
    clsGlobal.closeLOV();
}

function p_DataToUI(objData) {
    $("#txtID").val(clsGlobal.parseToInteger(objData.INT_PRM_HDR_ID));
    $("#txtType").val(clsGlobal.parseToString(objData.TXT_TYPE));
    $("#txtDescription").val(clsGlobal.parseToString(objData.TXT_DESCRIPTION));

    p_DataToUIDetail(objData.XXSHP_KDS_M_PRM_DTL);
    p_SetHiddenObject(objData);

    if ($("#txtID").val() == "" || $("#txtID").val() == "0") {
        $("#btnDelete").hide();
    } else {
        $("#btnDelete").show();
    }
}

function p_SetHiddenObject(objDat) {
    $("#txtHiddenObject").val(JSON.stringify(objDat));
}

function p_GetHiddenObject() {
    return JSON.parse($("#txtHiddenObject").val());
}

function p_DataToUIDetail(XXSHP_KDS_M_PRM_DTL) {
    
    oTable.clear();
    for (var i = 0; i < XXSHP_KDS_M_PRM_DTL.length; i++) {
        XXSHP_KDS_M_PRM_DTL[i].intIndex = i;
        oTable.row.add(XXSHP_KDS_M_PRM_DTL[i]);
    }
    oTable.draw(false);

    var objDat = p_GetHiddenObject();
    objDat.XXSHP_KDS_M_PRM_DTL = XXSHP_KDS_M_PRM_DTL;
    p_SetHiddenObject(objDat);
}

function p_initiateData() {
    clsGlobal.showLoading();
    $.ajax({
        type: "POST",
        url: "/System/Parameter/InitiateData",
        data: { __RequestVerificationToken: $('#frmParameter input[name=__RequestVerificationToken]').val() },
        datatype: "json",
        success: function (retDat) {

            if (retDat.bitSuccess == true) {
                if (retDat.objData != undefined) {
                    p_SetHiddenObject(retDat.objData);
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

function p_UIToData() {
    var jsonObj = [];
    jsonData = p_GetHiddenObject();
    jsonData.INT_PRM_HDR_ID = clsGlobal.parseToInteger($("#txtID").val());
    jsonData.TXT_TYPE = $("#txtType").val().toString();
    jsonData.TXT_DESCRIPTION = $("#txtDescription").val().toString();

    p_SetHiddenObject(jsonData);
    return $("#txtHiddenObject").val();

}


function p_InitiateDetail() {
    // Format datatable  
    
    oTable = $('#dtDetail').DataTable({
        "bPaginate": true,
        "bSort": false,
        searching: false,
        "iDisplayLength": 5,
        "type": "POST",
        aoColumnDefs: [
              {
                  aTargets: [0],
                  mRender: function (data, type, full) {
                      return '<div > ' + (full.intIndex + 1) + ' </div>';
                  }
              },
           {
               aTargets: [1],
               mRender: function (data, type, full) {
                   return '<div > <input type="text" class="form-control" id="txtDetailCode" class="txtDetailCode" onchange="p_txtDetailCode_Changed(this,' + full.intIndex + ')"  value="' + full.TXT_CODE + '" >  </div>';
               }
           },
           {
               aTargets: [2],
               mRender: function (data, type, full) {
                   return '<div > <input type="text" class="form-control" id="txtDetailDesc" class="txtDetailDesc" onchange="p_txtDetailDesc_Changed(this,' + full.intIndex + ')"  value="' + full.TXT_DESC + '" >  </div>';

               }
           },
           {
               aTargets: [3],
               mRender: function (data, type, full) {
                   if (clsGlobal.ParseBooleanOracleToNET(full.BIT_ACTIVE)) {
                       return '<div > <input type="checkbox" id="chkDetailActive" class="chkDetailActive" onchange="p_chkDetailActive_Changed(this,' + full.intIndex + ')"  checked="' + clsGlobal.ParseBooleanOracleToNET(full.BIT_ACTIVE) + '" >  </div>';
                   } else {
                       return '<div > <input type="checkbox" id="chkDetailActive" class="chkDetailActive" onchange="p_chkDetailActive_Changed(this,' + full.intIndex + ')" >  </div>';
                   }

               }
           },
           {
               aTargets: [4],
               mRender: function (data, type, full) {
                   return '<div > <input type="button" class="btn btn-warning" id="btnDetailDelete" class="btnDetailDelete" onclick="p_btnDetailDelete_Click(this,' + full.intIndex + ')"  value="Delete" >  </div>';

               }
           }
        ]
    });

    $("#dtDetail").css("width", "100%");

}

function p_txtID_TextChanged() {
    clsGlobal.showLoading();
    $.ajax({
        type: "POST",
        url: "/System/Parameter/GetData",
        data: { txtID: $("#txtID").val(), __RequestVerificationToken: $('#frmParameter input[name=__RequestVerificationToken]').val() },
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


function p_saveData() {

    clsGlobal.showLoading();
    p_UIToData();
    $.ajax({
        type: "POST",
        url: "/System/Parameter/SaveData",
        data: { data: $("#txtHiddenObject").val(), txtGUID: $("#txtGUID").val(), __RequestVerificationToken: $('#frmParameter input[name=__RequestVerificationToken]').val() },
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

function p_deleteData() {
    clsGlobal.showLoading();
    p_UIToData();
    $.ajax({
        type: "POST",
        url: "/System/Parameter/DeleteData",
        data: { data: $("#txtHiddenObject").val(), txtGUID: $("#txtGUID").val(), __RequestVerificationToken: $('#frmParameter input[name=__RequestVerificationToken]').val() },
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


function p_AddRow() {
    
    clsGlobal.showLoading();
    $.ajax({
        type: "POST",
        url: "/System/Parameter/AddRow",
        data: { data: $("#txtHiddenObject").val(), __RequestVerificationToken: $('#frmParameter input[name=__RequestVerificationToken]').val() },
        datatype: "json",
        success: function (retDat) {

            if (retDat.bitSuccess == true) {
                if (retDat.objData != undefined) {
                    p_SetHiddenObject(retDat.objData);
                    p_DataToUIDetail(retDat.objData.XXSHP_KDS_M_PRM_DTL);
                    oTable.page('last').draw(false);
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

function p_txtDetailCode_Changed(objCaller, intIndex) {
    
    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());
    for (i = 0; i < objData.XXSHP_KDS_M_PRM_DTL.length; i++) {
        // Cari Index-nya.
        if (objData.XXSHP_KDS_M_PRM_DTL[i].intIndex == intIndex) {
            // Ketemu, mulai dari sini:
            objData.XXSHP_KDS_M_PRM_DTL[i].TXT_CODE = objCaller.value;
            break;
        }
    }
    p_SetHiddenObject(objData);
}

function p_txtDetailDesc_Changed(objCaller, intIndex) {
    
    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());
    for (i = 0; i < objData.XXSHP_KDS_M_PRM_DTL.length; i++) {
        // Cari Index-nya.
        if (objData.XXSHP_KDS_M_PRM_DTL[i].intIndex == intIndex) {
            // Ketemu, mulai dari sini:
            objData.XXSHP_KDS_M_PRM_DTL[i].TXT_DESC = objCaller.value;
            break;
        }
    }
    p_SetHiddenObject(objData);
}

function p_chkDetailActive_Changed(objCaller, intIndex) {
    
    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());
    for (i = 0; i < objData.XXSHP_KDS_M_PRM_DTL.length; i++) {
        // Cari Index-nya.
        if (objData.XXSHP_KDS_M_PRM_DTL[i].intIndex == intIndex) {
            // Ketemu, mulai dari sini:
            objData.XXSHP_KDS_M_PRM_DTL[i].BIT_ACTIVE = clsGlobal.ParseBooleanNETToOracle(objCaller.checked);
            break;
        }
    }
    p_SetHiddenObject(objData);
}

function p_btnDetailDelete_Click(objCaller, intIndex) {
    
    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());
    for (i = 0; i < objData.XXSHP_KDS_M_PRM_DTL.length; i++) {
        // Cari Index-nya.
        if (objData.XXSHP_KDS_M_PRM_DTL[i].intIndex == intIndex) {
            // Ketemu, mulai dari sini:
            // Remove from list.
            objData.XXSHP_KDS_M_PRM_DTL.splice(i, 1);

            //var row = oTable.row($(this).parents('tr'));
            //var rowNode = row.node();
            //row.remove().draw();
            oTable.row(i).remove().draw(false);
            break;
        }
    }
    p_SetHiddenObject(objData);
    p_RefreshNumberDetail();
}

function p_RefreshNumberDetail() {
    
    var intRowIndex = 0;
    var objDat = p_GetHiddenObject();
    oTable.rows().every(function (rowIdx, tableLoop, rowLoop) {
        
        var d = this.data();
        d.intIndex = intRowIndex; // update data source for the row
        objDat.XXSHP_KDS_M_PRM_DTL[intRowIndex].intIndex = d.intIndex;

        d.TXT_CODE = objDat.XXSHP_KDS_M_PRM_DTL[intRowIndex].TXT_CODE;
        d.TXT_DESC = objDat.XXSHP_KDS_M_PRM_DTL[intRowIndex].TXT_DESC;
        intRowIndex++;
        this.invalidate(); // invalidate the data DataTables has cached for this row         
    });

    // Draw once all updates are done
    oTable.draw(false);
    p_SetHiddenObject(objDat);
}


//=======================
// HANDLER
//=======================

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

$('#btnNew').bind('click', function () {
    try {
        p_showBlank();
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
});


$('#btnLOVID').bind('click', function () {
    try {
        LOV = clsGlobal.generateLOV(MODULE_PARAMETER, "txtID");
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
});


$('#btnDelete').bind('click', function () {
    try {
        clsGlobal.getConfirmation("Delete this data?", function (result) {
            if (result == true) {
                p_deleteData();
            }
            else {
                return false;
            }
        });
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
});

$('#btnAddDetail').on('click', function () {

        p_AddRow();
});

