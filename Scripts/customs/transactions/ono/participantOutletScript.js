//     KKP SCRIPT - Supplier
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
var intAccountTypeIndex;
var oTableAccountType;

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
    intAccountTypeIndex = Number($.getParameter("intIndex"));
    $("#txtHiddenObject").val(parent.$("#txtHiddenObject").val());
    p_InitiateParticipantOutletDetail();
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
        case "txtSupplier":
            p_settxtSupplier(arr[1], arr[2]);
            break;
    }
    clsGlobal.closeLOV();
}

function p_DataToUI(objDat) {
    
    p_DataToUIParticipantOutletDetail(objDat);
    p_EnableControl(clsGlobal.ParseBooleanOracleToNET(objDat.BIT_APPLY), objDat);

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

        $("#btnAddSupplier").hide();
        $(".chkSupplierActive").each(function (index) {
            $(this).attr("disabled", "true");
        });
        $(".btnLOVSupplier").each(function (index) {
            $(this).hide();
        });
        $(".btnSupplierDelete").each(function (index) {
            $(this).hide();
        });
    } else if (objDat.TXT_REFDOCNO != "") {
        // Ada Parent
        $("#btnOK").show();
        $("#btnCancel").show();

        $("#btnAddSupplier").hide();
        $(".chkSupplierActive").each(function (index) {
            $(this).attr("disabled", "true");
        });
        $(".btnLOVSupplier").each(function (index) {
            $(this).hide();
        });
        $(".btnSupplierDelete").each(function (index) {
            $(this).hide();
        });
    } else {
        $("#btnOK").show();
        $("#btnCancel").show();

        $("#btnAddSupplier").show();
        $(".chkSupplierActive").each(function (index) {
            $(this).removeAttr("disabled");
        });
        $(".btnLOVSupplier").each(function (index) {
            $(this).show();
        });
        $(".btnSupplierDelete").each(function (index) {
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
    var reqDat = $("#txtHiddenObject").val();
    intAccountTypeIndex = Number($.getParameter("intIndex"));

    $.ajax({
        type: "POST",
        url: "/Transaction/ONO/GetOutletTypeByAccoutType",
        data: {
            data: reqDat,
            intAccountTypeIndex: intAccountTypeIndex,
            __RequestVerificationToken: $('#frmONOParticipantOutlet input[name=__RequestVerificationToken]').val()
        },
        datatype: "json",
        success: function (retDat) {
            console.log(retDat);
            if (retDat.bitSuccess == true) {
                if (retDat.objData != undefined) {
                    p_SetHiddenObject(retDat.objData);
                    p_DataToUI(retDat.objData);
                    $("#txtGUID").val(retDat.txtGUID);
                } else {
                    p_showBlank();
                }
                $("#txtGUID").val(retDat.txtGUID);
            } else {
                clsGlobal.getAlert(retDat.txtMessage);
            }
            clsGlobal.hideLoading();
        },
        error: function (retDat) {
            console.log(retDat);
            clsGlobal.hideLoading();
        }
    });

    //$("#txtHiddenObject").val(parent.$("#txtHiddenObject").val());
    //var jsonData = p_GetHiddenObject();
    //p_DataToUI(jsonData);
    //clsGlobal.hideLoading();
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
    //    url: "/Transaction/ONO/SaveData", 
    //    data: { data: $("#txtHiddenObject").val(), __RequestVerificationToken: $('#frmONO input[name=__RequestVerificationToken]').val() },
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
// Supplier  
// ==========================

function p_GetSelectedSupplierRow() {
    var intIndex = clsGlobal.parseToInteger(oTableAccountType.$('tr.selected').find("#lblSupplierNoValue").html()) - 1;
    return intIndex;
}

function p_InitiateParticipantOutletDetail() {
    // Format datatable  
    
    oTableAccountType = $('#dtParticipantOutlet').DataTable({
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
                    return '<div id="lblSupplierNoValue" > ' + (full.intIndex + 1) + ' </div>';
                }
            },
            {
                aTargets: [1],
                //mRender: function (data, type, full) {
                //    if (clsGlobal.ParseBooleanOracleToNET(full.BIT_ACTIVE)) {
                //        return '<div > <input type="checkbox" id="chkSupplierActive" class="chkSupplierActive" onchange="p_chkParticipantOutletDetailActive_Changed(this,' + full.intIndex + ')"  checked="' + clsGlobal.ParseBooleanOracleToNET(full.BIT_ACTIVE) + '" >  </div>';
                //    } else {
                //        return '<div > <input type="checkbox" id="chkSupplierActive" class="chkSupplierActive" onchange="p_chkParticipantOutletDetailActive_Changed(this,' + full.intIndex + ')" >  </div>';
                //    }

                //}
                mRender: function (data, type, full) {
                    const isChecked = clsGlobal.ParseBooleanOracleToNET(full.BIT_ACTIVE);
                    return `
                        <div>
                            <input type="checkbox" 
                                class="chkSupplierActive"
                                ${isChecked ? "checked" : ""}
                            />
                        </div>
                    `;
                }
            },
            {
                aTargets: [2],
                mRender: function (data, type, full) {
                    return '<div id="lblSupplierNameValue" > ' + clsGlobal.parseToString(full.TXT_TYPECUS) + ' </div>'; // IS NOT ACTUALLY CHANNEL BUT TYPECUST
                }
            },
            {
                aTargets: [3],
                mRender: function (data, type, full) {
                    return '<div id="lblSupplierKAMValue" > ' + clsGlobal.parseToString(full.TXT_OUTLETTYPE) + ' </div>';
                }
            }
        ]
    });

    $("#dtParticipantOutlet").css("width", "100%");
    //$('#dtParticipantOutlet tbody').on('click', 'tr', function () {
    //    if (!$(this).hasClass('selected')) {
    //        oTableAccountType.$('tr.selected').removeClass('selected');
    //        $(this).addClass('selected');
    //    }
    //});
    $('#dtParticipantOutlet tbody').on('change', '.chkSupplierActive', function () {
        var tr = $(this).closest('tr');
        var rowData = oTableAccountType.row(tr).data();
        var isChecked = $(this).is(':checked');

        // Update DataTable row data
        rowData.BIT_ACTIVE = clsGlobal.ParseBooleanNETToOracle(isChecked);
        oTableAccountType.row(tr).data(rowData);

        // Update HiddenObject
        var objData = p_GetHiddenObject();
        var dtlList = objData.XXSHP_KDS_T_ONO_ACY[intAccountTypeIndex].XXSHP_KDS_T_ONO_ACY_DTL;

        for (var i = 0; i < dtlList.length; i++) {
            if (dtlList[i].intIndex === rowData.intIndex) {
                dtlList[i].BIT_ACTIVE = rowData.BIT_ACTIVE;
                break;
            }
        }

        p_SetHiddenObject(objData);
    });

}

function p_ShowBlankParticipantOutletDetail() {
    oTableAccountType.clear();
    oTableAccountType.draw(false);
}

function p_DataToUIParticipantOutletDetail(XXSHP_KDS_T_ONO_HDR) {
    // Step 1: Clear DataTable
    oTableAccountType.clear();

    // Step 2: Get hidden object
    var objDat = p_GetHiddenObject();

    // Step 3: Always reset existing array before adding new
    objDat.XXSHP_KDS_T_ONO_ACY[intAccountTypeIndex].XXSHP_KDS_T_ONO_ACY_DTL = [];

    // Step 4: Fetch the fresh backend list
    var newList = XXSHP_KDS_T_ONO_HDR.XXSHP_KDS_T_ONO_ACY[intAccountTypeIndex].XXSHP_KDS_T_ONO_ACY_DTL || [];

    // Step 5: Normalize fields for consistent matching
    const normalize = (v) => (v === null || v === undefined ? "" : String(v).trim());

    // Step 6: Deduplicate by logical key (TXT_ACCOUNT + TXT_OUTLETTYPE)
    const seen = new Set();
    const uniqueList = [];

    for (const item of newList) {
        const key = normalize(item.TXT_ACCOUNT) + "|" + normalize(item.TXT_OUTLETTYPE);
        if (!seen.has(key)) {
            seen.add(key);
            uniqueList.push(item);
        }
    }

    // Step 7: Replace hidden object array
    objDat.XXSHP_KDS_T_ONO_ACY[intAccountTypeIndex].XXSHP_KDS_T_ONO_ACY_DTL = uniqueList;

    // Step 8: Set indexes and load DataTable
    uniqueList.forEach((itm, i) => {
        itm.intIndex = i;
        oTableAccountType.row.add(itm);
    });

    // Step 9: Draw table and save
    oTableAccountType.draw(false);
    p_SetHiddenObject(objDat);
}


function p_RefreshNumberParticipantOutletDetail() {
    
    var intRowIndex = 0;
    var objDat = p_GetHiddenObject();
    oTableAccountType.rows().every(function (rowIdx, tableLoop, rowLoop) {
        
        var d = this.data();
        d.intIndex = intRowIndex; // update data source for the row
        objDat.XXSHP_KDS_T_ONO_ACY[intAccountTypeIndex].XXSHP_KDS_T_ONO_ACY_DTL[intRowIndex].intIndex = d.intIndex;

        d.TXT_ACCOUNT_SITE = objDat.XXSHP_KDS_T_ONO_ACY[intAccountTypeIndex].XXSHP_KDS_T_ONO_ACY_DTL[intRowIndex].TXT_ACCOUNT_SITE;
        d.TXT_ACCOUNT_NAME = objDat.XXSHP_KDS_T_ONO_ACY[intAccountTypeIndex].XXSHP_KDS_T_ONO_ACY_DTL[intRowIndex].TXT_ACCOUNT_NAME;
        d.BIT_ACTIVE = objDat.XXSHP_KDS_T_ONO_ACY[intAccountTypeIndex].XXSHP_KDS_T_ONO_ACY_DTL[intRowIndex].BIT_ACTIVE;

        intRowIndex++;
        this.invalidate(); // invalidate the data DataTables has cached for this row         
    });

    // Draw once all updates are done
    oTableAccountType.draw(false);
    p_SetHiddenObject(objDat);
}

function p_chkParticipantOutletDetailActive_Changed(objCaller, intIndex) {
    
    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());
    for (i = 0; i < objData.XXSHP_KDS_T_ONO_ACY[intAccountTypeIndex].XXSHP_KDS_T_ONO_ACY_DTL.length; i++) {
        // Cari Index-nya.
        if (objData.XXSHP_KDS_T_ONO_ACY[intAccountTypeIndex].XXSHP_KDS_T_ONO_ACY_DTL[i].intIndex == intIndex) {
            objData.XXSHP_KDS_T_ONO_ACY[intAccountTypeIndex].XXSHP_KDS_T_ONO_ACY_DTL[i].BIT_ACTIVE = clsGlobal.ParseBooleanNETToOracle(objCaller.checked);
            break;
        }
    }
    p_SetHiddenObject(objData);
    oTableAccountType.rows().invalidate().draw(false);
}

// ==========================
// END: Supplier   
// ==========================


//=======================
// HANDLER
//=======================

$('#btnOK').bind('click', function () {
    try {
        var objData = p_GetHiddenObject();

        // Keep only items where BIT_ACTIVE == 'Y'
        var dtlList = objData.XXSHP_KDS_T_ONO_ACY[intAccountTypeIndex].XXSHP_KDS_T_ONO_ACY_DTL;
        dtlList = dtlList.filter(function (item) {
            return item.BIT_ACTIVE === clsGlobal.ParseBooleanNETToOracle(true);
        });

        objData.XXSHP_KDS_T_ONO_ACY[intAccountTypeIndex].XXSHP_KDS_T_ONO_ACY_DTL = dtlList;
        p_SetHiddenObject(objData);

        // Sync back to parent
        parent.$("#txtHiddenObject").val($("#txtHiddenObject").val());
        parent.clsGlobal.closePopUpIframe();
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

$('#chkOutletTypeAll').bind('click', function () {
    try {
        var objData = p_GetHiddenObject();
        for (var i = 0; i < objData.XXSHP_KDS_T_ONO_ACY[intAccountTypeIndex].XXSHP_KDS_T_ONO_ACY_DTL.length; i++) {
            objData.XXSHP_KDS_T_ONO_ACY[intAccountTypeIndex].XXSHP_KDS_T_ONO_ACY_DTL[i].BIT_ACTIVE = 'Y';
        }
        p_DataToUI(objData);
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
});




