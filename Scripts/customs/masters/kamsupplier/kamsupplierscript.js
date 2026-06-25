//=======================
// VARIABLE GLOBAL
//=======================
var clsGlobal = new clsGlobalClass();
var LOV;
var bitLoading = false;
var TypeDistributor = {};

//=======================
// Confirmation
//======================= 

//=======================
// ON PAGE LOAD
//=======================
$(document).ready(function () {
    p_PopulateTypeDistributor();
    p_InitForm();
    p_validatePage();

    $('.dataTables_scrollBody').css('min-height', ($('.dataTables_scrollBody').height() + 100) + 'px');
});

//=======================
// FUNCTION
//=======================
function p_InitForm() {
    p_initiateData();
    p_InitiateDetail();
    p_GenerateChosen();
}

function p_validatePage() {

}

function p_showPrevData() {

}

function p_showBlank() {
    p_initiateData();
}

function p_GenerateChosen() {
    
    $('.chosenTipeDistributor').chosen();
}

function p_PopulateTypeDistributor(txtValue) {
    clsGlobal.showLoading();
    
    $.ajax({
        type: "POST",
        url: "/Main/PopulateTypeDistributor",
        data: { __RequestVerificationToken: $('#frmKAMSupplier input[name=__RequestVerificationToken]').val() },
        datatype: "json",
        success: function (retDat) {
            if (retDat.bitSuccess == true) {
                
                if (retDat.objData != undefined) {
                    TypeDistributor = retDat.objData;
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

function setChooseLOV(txtValue) {
    
    var arr = txtValue.split('|');
    switch (arr[0]) {
        case "txtID": $("#txtID").val(arr[1]);
            p_txtID_TextChanged();
            break;
        case "txtGroupAccount":
            //kosongin supplier nya, cek dulu klo pilih group account sama tidak perlu di hapus
            if ($("#txtGroupAccount").val() != arr[1]) {
                $("#txtSupplierID").val(0);
                $("#txtSupplierName").val(null);
            }
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
        case "txtRegionID":
            p_settxtRegion(arr[1]);
            break;
    }
    clsGlobal.closeLOV();
}

function p_DataToUI(objData) {
    
    $("#txtID").val(clsGlobal.parseToInteger(objData.INT_KSUP_HDR_ID));

    $("#txtGroupAccount").val(clsGlobal.parseToString(objData.TXT_GROUP_ACCOUNT));
    $("#txtSupplierID").val(clsGlobal.parseToInteger(objData.INT_SUPPLIER_ID));
    $("#txtSupplierName").val(clsGlobal.parseToString(objData.TXT_SUPPLIER_NAME));
    $("#txtPrimaryOwner").val(clsGlobal.parseToString(objData.TXT_OWNER));

    p_DataToUIDetail(objData.XXSHP_KDS_M_KSUP_DTL);
    p_SetHiddenObject(objData);

    //if (objData.INT_BGT_HDR_ID != 0) {
    //    p_EnableControl(true);
    //} else {
    //    p_EnableControl(false);
    //}

    //$("#txtHiddenObject").val(JSON.stringify(objData));
    if ($("#txtID").val() == "" || $("#txtID").val() == "0") {
        $("#btnDelete").hide();
    } else {
        $("#btnDelete").show();
    }

    p_GenerateChosen();
    p_PopulateTipeDistribusi();
}

function p_DataToUIDetail(XXSHP_KDS_M_KSUP_DTL) {
    

    oTableDetail.clear();
    for (var i = 0; i < XXSHP_KDS_M_KSUP_DTL.length; i++) {
        XXSHP_KDS_M_KSUP_DTL[i].intIndex = i;

        oTableDetail.row.add(XXSHP_KDS_M_KSUP_DTL[i]);
    }
    oTableDetail.draw(false);

    var objDat = p_GetHiddenObject();
    objDat.XXSHP_KDS_M_KSUP_DTL = XXSHP_KDS_M_KSUP_DTL;
    p_SetHiddenObject(objDat);

}

function p_UIToData() {
    
    var jsonObj = [];
    jsonData = p_GetHiddenObject();
    jsonData.INT_KSUP_HDR_ID = clsGlobal.parseToInteger($("#txtID").val());
    jsonData.INT_SUPPLIER_ID = clsGlobal.parseToInteger($("#txtSupplierID").val());
    jsonData.TXT_GROUP_ACCOUNT = $("#txtGroupAccount").val().toString();
    jsonData.TXT_SUPPLIER_NAME = $("#txtSupplierName").val().toString();
    jsonData.TXT_OWNER = $("#txtPrimaryOwner").val().toString(); 

    p_SetHiddenObject(jsonData);
    return $("#txtHiddenObject").val();

}

function p_initiateData() {
    clsGlobal.showLoading();
    $.ajax({
        type: "POST",
        url: "/Master/KAMSupplier/InitiateData",
        data: { __RequestVerificationToken: $('#frmKAMSupplier input[name=__RequestVerificationToken]').val() },
        datatype: "json",
        success: function (retDat) {
            debugger
            if (retDat.bitSuccess == true) {
                if (retDat.objData != undefined) {
                    p_SetHiddenObject(retDat.objData);
                    //$("#txtHiddenObject").val(JSON.stringify(retDat.objData));
                    p_DataToUI(retDat.objData);
                    $("#txtGUID").val(retDat.txtGUID);

                    p_getParameterID();
                    p_GenerateChosen();
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
                    return '<div > ' + (full.intIndex + 1) + ' </div>';
                }
            },
            {
                aTargets: [1],
                mRender: function (data, type, full) {
                    //return '<div > <input type="text" style="text-transform: uppercase;" class="form-control" id="txtSupplierSite" class="txtSupplierSite" onchange="p_txtSupplierSite_Changed(this,' + full.intIndex + ')"  value="' + full.TXT_SITE + '" >  </div>';
                    return '<div >  <input type="text" style="text-transform: uppercase;" class="form-control text-left txtSupplierSite" id="txtSupplierSite' + full.intIndex + '" onkeyup="uppercase(id)" onchange="p_txtSupplierSite_Changed(this,' + full.intIndex + ')"  value="' + full.TXT_SITE + '" >  </div>';
                }
            },
            {
                aTargets: [2],
                mRender: function (data, type, full) {
                    return '<div > <div class="input-group"> <div class="input-group-btn"> <button type="button" class="btn btn-danger btnRegionLOVID" id="btnRegionLOVID" onclick="p_btnRegionLOVID(' + full.intIndex + ')"> <i class="fa fa-search"></i></button> </div> <input type="text" class="form-control" id="txtRegionID' + full.intIndex + '" class="txtRegionID" onchange="p_txtRegionID_Changed(this,' + full.intIndex + ')"  value="' + full.TXT_REGION_ID + '" disabled> </div> </div>';

                }
            },
            {
                aTargets: [3],
                mRender: function (data, type, full) {
                    return '<div >  <input type="text" class="form-control" id="txtRegionName' + full.intIndex + '" class="txtRegionName" onchange="p_txtRegionName_Changed(this,' + full.intIndex + ')"  value="' + full.TXT_REGION_NAME + '" disabled>  </div>';

                }
            },
            {
                aTargets: [4],
                mRender: function (data, type, full) {
                    return '<div > <div class="input-group"> <div class="input-group-btn"> <button type="button" class="btn btn-danger btnBranchLOVID" id="btnBranchLOVID" onclick="p_btnBranchLOVID(' + full.intIndex + ')"> <i class="fa fa-search"></i></button> </div> <input type="text" class="form-control" id="txtBranchID' + full.intIndex + '" class="txtBranchID" onchange="p_txtBranchID_Changed(this,' + full.intIndex + ')"  value="' + full.TXT_BRANCH_ID + '" disabled> </div> </div>';

                }
            },
            {
                aTargets: [5],
                mRender: function (data, type, full) {
                    return '<div >  <input type="text" class="form-control" id="txtBranchName' + full.intIndex + '" class="txtBranchName" onchange="p_txtBranchName_Changed(this,' + full.intIndex + ')"  value="' + full.TXT_BRANCH_NAME + '" disabled>  </div>';

                }
            },
            {
                aTargets: [6],
                mRender: function (data, type, full) {
                    return '<div >  <input type="text" class="form-control" id="txtSecondaryOwner' + full.intIndex + '" class="txtSecondaryOwner" onchange="p_txtSecondaryOwner_Changed(this,' + full.intIndex + ')"  value="' + full.TXT_SECOND_OWNER + '">  </div>';
                }
            },
            {
                aTargets: [7],
                mRender: function (data, type, full) {
                    debugger
                    var txtReturn = ''
                    txtReturn += '<select data-placeholder="Pilih Tipe Distributor..." id="ddlTipeDistributor' + full.intIndex + '" onchange="p_ddlTipeDistributor_Changed(this,' + full.intIndex + ')" class="chosenTipeDistributor" multiple tabindex="4" style="width:150px;">';
                    for (var i = 0; i < TypeDistributor.length; i++) {
                        txtReturn += '<option value="' + TypeDistributor[i].FLEX_VALUE + '">' + TypeDistributor[i].DESCRIPTION + '</option>';
                    }
                    txtReturn += '</select>'
                    return txtReturn;
                }
            },
            {
                aTargets: [8],
                mRender: function (data, type, full) {
                    return '<div > <input type="button" class="btn btn-warning btnDetailDelete" id="btnDetailDelete" onclick="p_btnDetailDelete_Click(this,' + full.intIndex + ')"  value="Delete" >  </div>';

                }
            }
        ]
    });

    $("#dtDetail").css("width", "100%");

    $('#dtDetail').on('page.dt', function () {
        var info = oTableDetail.page.info();
        oTableDetail.page(info.page).draw(false);
        p_GenerateChosen();
        p_PopulateTipeDistribusi();
    });
}

function uppercase(id) {
    
    //var objDat = p_GetHiddenObject();
    document.getElementById(id).addEventListener("keyup", myFunction);
    function myFunction() {
        var x = document.getElementById(id);
        x.value = x.value.toUpperCase();
    }
}

function p_SetHiddenObject(objDat) {
    $("#txtHiddenObject").val(JSON.stringify(objDat));
}

function p_GetHiddenObject() {
    return JSON.parse($("#txtHiddenObject").val());
}

function p_SetCurrentRowBranch(intIndex) {
    
    $("#txtCurrentBranchRow").val(intIndex);
}

function p_GetCurrentRowBranch() {
    
    var index = $("#txtCurrentBranchRow").val();
    return index;
}

function p_txtSupplierSite_Changed(objCaller, intIndex) {
    
    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());
    for (i = 0; i < objData.XXSHP_KDS_M_KSUP_DTL.length; i++) {
        // Cari Index-nya.
        if (objData.XXSHP_KDS_M_KSUP_DTL[i].intIndex == intIndex) {
            // Ketemu, mulai dari sini:
            objData.XXSHP_KDS_M_KSUP_DTL[i].TXT_SITE = objCaller.value;
            break;
        }
    }
    p_SetHiddenObject(objData);
}


function p_txtSecondaryOwner_Changed(objCaller, intIndex) {
    
    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());
    for (i = 0; i < objData.XXSHP_KDS_M_KSUP_DTL.length; i++) {
        // Cari Index-nya.
        if (objData.XXSHP_KDS_M_KSUP_DTL[i].intIndex == intIndex) {
            // Ketemu, mulai dari sini:
            objData.XXSHP_KDS_M_KSUP_DTL[i].TXT_SECOND_OWNER = objCaller.value;
            break;
        }
    }
    p_SetHiddenObject(objData);
}
 

function p_txtID_TextChanged() {
    clsGlobal.showLoading();
    $.ajax({
        type: "POST",
        url: "/Master/KAMSupplier/GetData",
        data: { txtID: $("#txtID").val(), __RequestVerificationToken: $('#frmKAMSupplier input[name=__RequestVerificationToken]').val() },
        datatype: "json",
        success: function (retDat) {
            
            if (retDat.bitSuccess == true) {
                if (retDat.objData != undefined) {
                    //if (retDat.objData.INT_BGT_HDR_ID != 0) {
                    //    adaID = true;
                    //}
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

function p_settxtBranch(intBranchID) {
    
    clsGlobal.showLoading();
    $.ajax({
        type: "POST",
        url: "/Master/KAMSupplier/GetDataBranch",
        data: { intBranchID: intBranchID, __RequestVerificationToken: $('#frmKAMSupplier input[name=__RequestVerificationToken]').val() },
        datatype: "json",
        success: function (retDat) {
            
            console.log(retDat.objData);
            if (retDat.bitSuccess == true) {
                if (retDat.objData != undefined) {
                    p_txtBranch_Changed_LOV(retDat.objData);
                    //p_EnableControl(false);
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

function p_txtBranch_Changed_LOV(objDat) {
    
    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());
    var IndexBranch = p_GetCurrentRowBranch();

    objData.XXSHP_KDS_M_KSUP_DTL[IndexBranch].TXT_BRANCH_ID = objDat.intBranchID.toString();
    $("#txtBranchID" + IndexBranch).val(objDat.intBranchID.toString());

    objData.XXSHP_KDS_M_KSUP_DTL[IndexBranch].TXT_BRANCH_NAME = objDat.txtBranchName.toString();
    $("#txtBranchName" + IndexBranch).val(objDat.txtBranchName.toString());

    p_SetHiddenObject(objData);
}

function p_settxtRegion(intRegionID) {
    
    clsGlobal.showLoading();
    $.ajax({
        type: "POST",
        url: "/Master/KAMSupplier/GetDataRegion",
        data: { intRegionID: intRegionID, __RequestVerificationToken: $('#frmKAMSupplier input[name=__RequestVerificationToken]').val() },
        datatype: "json",
        success: function (retDat) {
            
            //console.log(retDat.objData);
            if (retDat.bitSuccess == true) {
                if (retDat.objData != undefined) {
                    p_txtRegion_Changed_LOV(retDat.objData);
                    //p_EnableControl(false);
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

function p_txtRegion_Changed_LOV(objDat) {
    
    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());
    var IndexBranch = p_GetCurrentRowBranch();

    //kosongin branch nya, cek dulu apakah pilihan region berubah
    if (objData.XXSHP_KDS_M_KSUP_DTL[IndexBranch].TXT_REGION_ID != objDat.intRegionID.toString()) {
        objData.XXSHP_KDS_M_KSUP_DTL[IndexBranch].TXT_BRANCH_ID = null;
        $("#txtBranchID" + IndexBranch).val(null);

        objData.XXSHP_KDS_M_KSUP_DTL[IndexBranch].TXT_BRANCH_NAME = null;
        $("#txtBranchName" + IndexBranch).val(null);
    }

    objData.XXSHP_KDS_M_KSUP_DTL[IndexBranch].TXT_REGION_ID = objDat.intRegionID.toString();
    $("#txtRegionID" + IndexBranch).val(objDat.intRegionID.toString());

    objData.XXSHP_KDS_M_KSUP_DTL[IndexBranch].TXT_REGION_NAME = objDat.txtRegionCode.toString();
    $("#txtRegionName" + IndexBranch).val(objDat.txtRegionCode.toString());


    p_SetHiddenObject(objData);
}

function p_ddlTipeDistributor_Changed(objCaller, intIndex) {
    
    var objData = JSON.parse(p_UIToData());
    for (i = 0; i < objData.XXSHP_KDS_M_KSUP_DTL.length; i++) {
        // Cari Index-nya.
        if (objData.XXSHP_KDS_M_KSUP_DTL[i].intIndex == intIndex) {
            // Ketemu, mulai dari sini:

            var objArray = $('#ddlTipeDistributor' + intIndex).val();
            var strValue = "";
            for (var j = 0; j < objArray.length; j++) {
                if (j == 0) {
                    strValue = objArray[j];
                } else {
                    strValue += "," + objArray[j];
                }

            }

            objData.XXSHP_KDS_M_KSUP_DTL[i].TXT_TIPE_DISTRIBUTOR = strValue;

            break;
        }
    }
    p_SetHiddenObject(objData);
}

function p_AddDetail() {
    

    p_UIToData();
    var objData = p_GetHiddenObject();
    if (objData.TXT_GROUP_ACCOUNT == 0) {
        throw "Kolom Group Account harus di isi!";
    }
    if (objData.TXT_SUPPLIER_NAME == 0) {
        throw "Kolom Account Name harus di isi!";
    }
    clsGlobal.showLoading();
    $.ajax({
        type: "POST",
        url: "/Master/KAMSupplier/AddRow",
        data: { data: $("#txtHiddenObject").val(), __RequestVerificationToken: $('#frmKAMSupplier input[name=__RequestVerificationToken]').val() },
        datatype: "json",
        success: function (retDat) {
            
            if (retDat.bitSuccess == true) {
                if (retDat.objData != undefined) {
                    p_SetHiddenObject(retDat.objData);
                    p_DataToUIDetail(retDat.objData.XXSHP_KDS_M_KSUP_DTL);
                    oTableDetail.page('last').draw(false);
                    //p_EnableControl(false);

                    p_GenerateChosen();
                    $('.dataTables_scrollBody').css('min-height', ($('.dataTables_scrollBody').height() + 10) + 'px');

                    p_PopulateTipeDistribusi();
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

function p_PopulateTipeDistribusi() {
    debugger
    var objData = p_GetHiddenObject();

    for (i = 0; i < objData.XXSHP_KDS_M_KSUP_DTL.length; i++) {
        var valueSplit = objData.XXSHP_KDS_M_KSUP_DTL[i].TXT_TIPE_DISTRIBUTOR.split(',');

        $('#ddlTipeDistributor' + objData.XXSHP_KDS_M_KSUP_DTL[i].intIndex).val(valueSplit).trigger("chosen:updated");
    }
}

function p_btnDetailDelete_Click(objCaller, intIndex) {
    
    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());
    for (i = 0; i < objData.XXSHP_KDS_M_KSUP_DTL.length; i++) {
        // Cari Index-nya.
        if (objData.XXSHP_KDS_M_KSUP_DTL[i].intIndex == intIndex) {
            // Ketemu, mulai dari sini:
            // Remove from list.
            objData.XXSHP_KDS_M_KSUP_DTL.splice(i, 1);

            oTableDetail.row(i).remove().draw(false);
            break;
        }
    }
    p_SetHiddenObject(objData);
    p_RefreshNumberDetail();
    //p_EnableControl(false);

    p_GenerateChosen();
    $('.dataTables_scrollBody').css('min-height', ($('.dataTables_scrollBody').height() - 10) + 'px');

    p_PopulateTipeDistribusi();
}
function p_RefreshNumberDetail() {
    
    var intRowIndex = 0;
    var objDat = p_GetHiddenObject();
    oTableDetail.rows().every(function (rowIdx, tableLoop, rowLoop) {
        
        var d = this.data();
        d.intIndex = intRowIndex; // update data source for the row
        objDat.XXSHP_KDS_M_KSUP_DTL[intRowIndex].intIndex = d.intIndex;
        //objDat.XXSHP_KDS_M_BGT_HDR[intRowIndex].intIndex = d.intIndex;

        d.TXT_SITE = objDat.XXSHP_KDS_M_KSUP_DTL[intRowIndex].TXT_SITE;
        d.TXT_BRANCH_ID = objDat.XXSHP_KDS_M_KSUP_DTL[intRowIndex].TXT_BRANCH_ID;
        d.TXT_BRANCH_NAME = objDat.XXSHP_KDS_M_KSUP_DTL[intRowIndex].TXT_BRANCH_NAME;
        d.TXT_SECOND_OWNER = objDat.XXSHP_KDS_M_KSUP_DTL[intRowIndex].TXT_SECOND_OWNER;

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
        url: "/Master/KAMSupplier/SaveData",
        data: { data: $("#txtHiddenObject").val(), txtGUID: $("#txtGUID").val(), __RequestVerificationToken: $('#frmKAMSupplier input[name=__RequestVerificationToken]').val() },
        datatype: "json",
        success: function (retDat) {
            
            if (retDat.bitSuccess == true) {
                //p_disabled();
                p_DataToUI(retDat.objData);
                //adaID = true;
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
        url: "/Master/KAMSupplier/DeleteData",
        data: { data: $("#txtHiddenObject").val(), txtGUID: $("#txtGUID").val(), __RequestVerificationToken: $('#frmKAMSupplier input[name=__RequestVerificationToken]').val() },
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

$('#btnLOVID').bind('click', function () {
    try {
        LOV = clsGlobal.generateLOV(MODULE_KAMSUPPLIER, "txtID");
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

$('#btnLOVGroupAccount').bind('click', function () {
    try {
        //LOV = clsGlobal.generateLOV(LOV_XXSHP_KPP_VENDOR_SITE_ALL_V, "txtGroupAccount");
        LOV = clsGlobal.generateLOV(LOV_GROUP_ACCOUNT, "txtGroupAccount");
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
});

//$('#btnLOVSupplier').bind('click', function () {
//    try {
//        LOV = clsGlobal.generateLOV(LOV_XXSHP_VENDOR_SITE_ALL_V, "txtSupplierID");
//        //LOV = clsGlobal.generateLOV(LOV_XXSHP_KPP_VENDOR_SITE_ALL_V, "txtSupplierID");
//    } catch (ex) {
//        clsGlobal.showAlert(ex);
//    }
//});

$('#btnLOVSupplier').bind('click', function () {
    try {
        var txtGroupAccount = $("#txtGroupAccount").val();
        LOV = clsGlobal.generateLOV(LOV_XXSHP_VENDOR_SITE_ALL_V_GROUP_ACCOUNT, "txtSupplierID", txtGroupAccount);
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

function p_btnBranchLOVID(objCaller, intIndex) {
    
    var objData = p_GetHiddenObject()
    p_SetCurrentRowBranch(objCaller);
    var regionId = objData.XXSHP_KDS_M_KSUP_DTL[objCaller].TXT_REGION_ID;

    try {
        LOV = clsGlobal.generateLOV(MODULE_BRANCH_BY_REGION, "txtBranchID", regionId);
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
}

function p_btnRegionLOVID(objCaller, intIndex) {
    
    p_SetCurrentRowBranch(objCaller);
    try {
        LOV = clsGlobal.generateLOV(MODULE_REGION, "txtRegionID");
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
}

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