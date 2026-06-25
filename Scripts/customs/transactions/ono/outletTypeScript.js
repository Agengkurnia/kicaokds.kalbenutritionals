//=======================
// VARIABLE GLOBAL
//=======================
var clsGlobal = new clsGlobalClass();
var LOV;
var bitLoading = false;
var intActivityIndex;
var oTableOutletType;
var XXSHP_KDS_T_ONO_ACY;

//=======================
// Confirmation
//======================= 

//=======================
// ON PAGE LOAD
//=======================
$(document).ready(function () {
    p_InitForm();
    //p_validatePage();
});

//=======================
// FUNCTION
//=======================
function p_InitForm() {
    XXSHP_KDS_T_ONO_ACY = {};
    intAccTypeIndex = $.getParameter("intIndex");
    p_InitiateOutletType();
    p_initiateData();
}

//function p_validatePage() {

//}

function p_showPrevData() {

}

function p_showBlank() {
    p_initiateData();
}

function setChooseLOV(txtValue) {
    var arr = txtValue.split('|');
    switch (arr[0]) {
        case "txtDepartment":
            p_settxtDepartment(arr[1]);
            break;
        case "txtMPPDolphine":
            p_settxtMPPDolphine(arr[1]);
            break;
        case "txtPPH":
            p_settxtPPH(arr[1], arr[2]);
            break;
    }
    clsGlobal.closeLOV();
}

function p_DataToUI(objDat) {

    p_DataToUIBudget(objDat.XXSHP_KDS_T_ONO_ACT[intActivityIndex].XXSHP_KDS_T_ONO_BGT);

    p_EnableControl(clsGlobal.ParseBooleanOracleToNET(objDat.BIT_APPLY), objDat);

    p_SetHiddenObject(objDat);
    if ($("#txtID").val() == "" || $("#txtID").val() == "0") {
        $("#btnDelete").hide();
    } else {
        $("#btnDelete").show();
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
    $.ajax({
        type: "POST",
        url: "/Transaction/ONO/GetOutletTypeByAccoutType",
        data: {
            // testing
            data: jsonData,
            intAccountTypeIndex: 0,
            txtAccountType: "APOTIK",
            __RequestVerificationToken: $('#frmONO input[name=__RequestVerificationToken]').val()
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
// Budget  
// ==========================

function p_GetSelectedBudgetRow() {
    var intIndex = clsGlobal.parseToInteger(oTableBudget.$('tr.selected').find("#lblBudgetNoValue").html()) - 1;
    return intIndex;
}

function p_InitiateOutletType() {
    // Format datatable  

    oTableOutletType = $('#dtOutletType').DataTable({
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
                    return '<div id="lblBudgetNoValue" >  </div>'; // TODO: MAKE CHECHLIST
                }
            },
            {
                aTargets: [1],
                mRender: function (data, type, full) {
                    return '<div id="" class="" style=""  > ' + full.TXT_ACCOUNTTYPE + ' </div>';
                }
            },
            {
                aTargets: [2],
                mRender: function (data, type, full) {
                    return '<div id="" class="" style=""  > ' + full.TXT_CHANNELTYPE_ID + ' </div>';
                }
            },
            {
                aTargets: [3],
                mRender: function (data, type, full) {
                    return '<div id="" class="" style=""  > ' + full.TXT_CHANNELTYPE + ' </div>';
                }
            },
        ]
    });

    $("#dtOutletType").css("width", "100%");
    $('#dtOutletType tbody').on('click', 'tr', function () {
        if (!$(this).hasClass('selected')) {
            oTableBudget.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
        }
    });

}

function p_ShowBlankOutletType() {
    oTableOutletType.clear();
    oTableOutletType.draw(false);
}

function p_DataToUI(XXSHP_KDS_T_ONO_ACY) {

    oTableOutletType.clear();
    for (var i = 0; i < XXSHP_KDS_T_ONO_ACY.length; i++) {
        XXSHP_KDS_T_ONO_ACY[i].intIndex = i;
        oTableOutletType.row.add(XXSHP_KDS_T_ONO_ACY[i]);
    }
    oTableOutletType.draw(false);

    var objDat = p_GetHiddenObject();
    objDat.XXSHP_KDS_T_ONO_ACY = XXSHP_KDS_T_ONO_ACY;
    p_SetHiddenObject(objDat);
}

function p_settxtDepartment(txtValue) {

    var intSelectedIndex = p_GetSelectedBudgetRow();
    var intRowIndex = 0;
    var objDat = p_GetHiddenObject();
    oTableBudget.rows().every(function (rowIdx, tableLoop, rowLoop) {

        var d = this.data();
        if (intRowIndex == intSelectedIndex) {
            d.intIndex = intRowIndex; // update data source for the row 

            d.TXT_DEPARTMENT = txtValue;
            objDat.XXSHP_KDS_T_ONO_ACT[intActivityIndex].XXSHP_KDS_T_ONO_BGT[intRowIndex].TXT_DEPARTMENT = txtValue;

            if (txtValue != "MARKETING") {
                d.TXT_REFDOCNO_DOLPHINE = "";
                objDat.XXSHP_KDS_T_ONO_ACT[intActivityIndex].XXSHP_KDS_T_ONO_BGT[intRowIndex].TXT_REFDOCNO_DOLPHINE = "";

                // Jika dipilih KAM, otomatis akan mengambil semua budget tersedia.

                p_SetHiddenObject(objDat);
                clsGlobal.showLoading();
                $.ajax({
                    type: "POST",
                    url: "/Transaction/ONO/PopulateAvailableSubUmbrand",
                    data: { intActivityIndex: intActivityIndex, intBudgetIndex: intRowIndex, data: $("#txtHiddenObject").val(), __RequestVerificationToken: $('#frmONO input[name=__RequestVerificationToken]').val() },
                    datatype: "json",
                    success: function (retDat) {

                        if (retDat.bitSuccess == true) {
                            if (retDat.objData != undefined) {
                                p_SetHiddenObject(retDat.objData);
                                p_RefreshNumberBudget();
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

            this.invalidate(); // invalidate the data DataTables has cached for this row         
            p_EnableControl(clsGlobal.ParseBooleanOracleToNET(objDat.BIT_APPLY), objDat);
        }


        intRowIndex++;
    });

    p_SetHiddenObject(objDat);

    p_ValidateData(objDat, intActivityIndex, intRowIndex);
}

function p_chkPostingBudget_Changed(objCaller, intIndex) {

    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());
    for (i = 0; i < objData.XXSHP_KDS_T_ONO_ACT[intActivityIndex].XXSHP_KDS_T_ONO_BGT.length; i++) {
        // Cari Index-nya.
        if (objData.XXSHP_KDS_T_ONO_ACT[intActivityIndex].XXSHP_KDS_T_ONO_BGT[i].intIndex == intIndex) {
            // Ketemu, mulai dari sini:
            objData.XXSHP_KDS_T_ONO_ACT[intActivityIndex].XXSHP_KDS_T_ONO_BGT[i].BIT_POSTINGBUDGET = clsGlobal.ParseBooleanNETToOracle(objCaller.checked);
            break;
        }
    }
    p_SetHiddenObject(objData);
}

function p_btnBudgetSubUmbrand_Click(objCaller, intIndex) {

    try {
        // Parse dari HiddenObject->JSON
        var objData = JSON.parse(p_UIToData());
        for (i = 0; i < objData.XXSHP_KDS_T_ONO_ACT[intActivityIndex].XXSHP_KDS_T_ONO_BGT.length; i++) {
            // Cari Index-nya.
            if (objData.XXSHP_KDS_T_ONO_ACT[intActivityIndex].XXSHP_KDS_T_ONO_BGT[i].intIndex == intIndex) {
                // Ketemu, mulai dari sini:

                //Validasi 
                if (objData.XXSHP_KDS_T_ONO_ACT[intActivityIndex].XXSHP_KDS_T_ONO_BGT[i].TXT_DEPARTMENT == "") {
                    throw "Department must be filled!";
                }

                var fancyboxdata = p_GetHiddenObject();
                LOV = clsGlobal.generatePopUpIframe($(location).attr('protocol') + "//" + $(location).attr('host') + "/Transaction/ONO/SubUmbrand?intActivityIndex=" + intActivityIndex + "&intBudgetIndex=" + intIndex, "btnBudgetSubUmbrand", fancyboxdata);
                break;
            }
        }
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
}

function p_CalculateBrandTotal() {

}

function p_setSubUmbrand() {

    var intSelectedIndex = p_GetSelectedBudgetRow();
    var intRowIndex = 0;
    var objDat = p_GetHiddenObject();
    // Calculate Total Alokasi.
    objDat.XXSHP_KDS_T_ONO_ACT[intActivityIndex].XXSHP_KDS_T_ONO_BGT[intSelectedIndex].DEC_ALOKASI = 0;
    for (i = 0; i < objDat.XXSHP_KDS_T_ONO_ACT[intActivityIndex].XXSHP_KDS_T_ONO_BGT[intSelectedIndex].XXSHP_KDS_T_ONO_SUB.length; i++) {
        //var decAmount = clsGlobal.parseToDecimal(objDat.XXSHP_KDS_T_ONO_ACT[intActivityIndex].XXSHP_KDS_T_ONO_BGT[intRowIndex].XXSHP_KDS_T_ONO_SUB[i].DEC_AMOUNT);
        objDat.XXSHP_KDS_T_ONO_ACT[intActivityIndex].XXSHP_KDS_T_ONO_BGT[intSelectedIndex].DEC_ALOKASI += objDat.XXSHP_KDS_T_ONO_ACT[intActivityIndex].XXSHP_KDS_T_ONO_BGT[intSelectedIndex].XXSHP_KDS_T_ONO_SUB[i].DEC_AMOUNT;
    }
    //p_CalculateSubTotal(objDat.XXSHP_KDS_T_ONO_ACT[intActivityIndex].XXSHP_KDS_T_ONO_BGT[intSelectedIndex]);

    // Show ke table.
    oTableBudget.rows().every(function (rowIdx, tableLoop, rowLoop) {

        var d = this.data();
        if (intRowIndex == intSelectedIndex) {
            d.intIndex = intRowIndex; // update data source for the row 

            d.DEC_ALOKASI = objDat.XXSHP_KDS_T_ONO_ACT[intActivityIndex].XXSHP_KDS_T_ONO_BGT[intSelectedIndex].DEC_ALOKASI;
            d.TXT_DEPARTMENT = objDat.XXSHP_KDS_T_ONO_ACT[intActivityIndex].XXSHP_KDS_T_ONO_BGT[intSelectedIndex].TXT_DEPARTMENT;
            d.TXT_REFDOCNO_DOLPHINE = objDat.XXSHP_KDS_T_ONO_ACT[intActivityIndex].XXSHP_KDS_T_ONO_BGT[intSelectedIndex].TXT_REFDOCNO_DOLPHINE;

            this.invalidate(); // invalidate the data DataTables has cached for this row         
            p_EnableControl(clsGlobal.ParseBooleanOracleToNET(objDat.BIT_APPLY), objDat);
        }

        intRowIndex++;
    });

    p_SetHiddenObject(objDat);
}

function p_btnBudgetDelete_Click(objCaller, intIndex) {

    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());
    for (i = 0; i < objData.XXSHP_KDS_T_ONO_ACT[intActivityIndex].XXSHP_KDS_T_ONO_BGT.length; i++) {
        // Cari Index-nya.
        if (objData.XXSHP_KDS_T_ONO_ACT[intActivityIndex].XXSHP_KDS_T_ONO_BGT[i].intIndex == intIndex) {
            // Ketemu, mulai dari sini:
            // Remove from list.
            objData.XXSHP_KDS_T_ONO_ACT[intActivityIndex].XXSHP_KDS_T_ONO_BGT.splice(i, 1);

            oTableBudget.row(i).remove().draw(false);
            break;
        }
    }
    p_SetHiddenObject(objData);
    p_RefreshNumberBudget();
}

$('#btnAddBudget').on('click', function () {
    try {
        p_AddBudget();
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
});

function p_ValidateData(dat, intActivityIndex, intBudgetIndex) {
    clsGlobal.showLoading();
    $.ajax({
        type: "POST",
        url: "/Transaction/ONO/ValidateDataClientSideBudget",
        data: {
            intActivityIndex: intActivityIndex,
            intBudgetIndex: intBudgetIndex,
            data: JSON.stringify(dat),
            __RequestVerificationToken: $('#frmONO input[name=__RequestVerificationToken]').val()
        },
        datatype: "json",
        success: function (retDat) {

            if (retDat.bitSuccess == true) {
                if (retDat.objData != undefined) {
                    p_SetHiddenObject(retDat.objData);
                    p_DataToUIBudget(retDat.objData.XXSHP_KDS_T_ONO_ACT[intActivityIndex].XXSHP_KDS_T_ONO_BGT);
                    oTableBudget.page('last').draw(false);
                }
            } else {
                p_SetHiddenObject(retDat.objData);
                p_DataToUIBudget(retDat.objData.XXSHP_KDS_T_ONO_ACT[intActivityIndex].XXSHP_KDS_T_ONO_BGT);
                oTableBudget.page('last').draw(false);
                clsGlobal.getAlert(retDat.txtMessage);
            }
            clsGlobal.hideLoading();
        },
        error: function (retDat) {
            clsGlobal.hideLoading();
        }
    });
}

function p_ValidateBudgetInput() {
    // Parse dari HiddenObject->JSON

    var intActivityIndex = parent.p_GetSelectedActivityRow();
    var isValid = true;
    var objData = JSON.parse(p_UIToData());
    if (objData.XXSHP_KDS_T_ONO_ACT[intActivityIndex].XXSHP_KDS_T_ONO_BGT.length > 0) {
        for (i = 0; i < objData.XXSHP_KDS_T_ONO_ACT[intActivityIndex].XXSHP_KDS_T_ONO_BGT.length; i++) {
            // Cari Index-nya.
            if (objData.XXSHP_KDS_T_ONO_ACT[intActivityIndex].XXSHP_KDS_T_ONO_BGT[i].DEC_ALOKASI == 0) {
                clsGlobal.setMessageWarning("Data Budget ke " + [i + 1] + " Alokasi tidak boleh 0 !");
                isValid = false;
            } else if (objData.XXSHP_KDS_T_ONO_ACT[intActivityIndex].XXSHP_KDS_T_ONO_BGT[i].DEC_ALOKASI < 0) {
                clsGlobal.setMessageWarning("Data Budget ke " + [i + 1] + " Alokasi tidak boleh Minus !");
                isValid = false;
            }
        }
        if (isValid) {
            var intSelectedIndex = p_GetSelectedBudgetRow();
            var intRowIndex = 0;
            var objDat = p_GetHiddenObject();

            var decTotal = 0;
            for (i = 0; i < objDat.XXSHP_KDS_T_ONO_ACT[intActivityIndex].XXSHP_KDS_T_ONO_BGT.length; i++) {
                decTotal += objDat.XXSHP_KDS_T_ONO_ACT[intActivityIndex].XXSHP_KDS_T_ONO_BGT[i].DEC_ALOKASI;
            }
            objDat.XXSHP_KDS_T_ONO_ACT[intActivityIndex].DEC_AMOUNT = decTotal;

            parent.$("#txtHiddenObject").val($("#txtHiddenObject").val());
            parent.clsGlobal.closePopUpIframe();
            parent.p_setBudget();
        }
    } else {
        clsGlobal.setMessageWarning("Data tidak boleh kosong !");
    }

}

// ==========================
// END: Budget   
// ==========================


//=======================
// HANDLER
//=======================

$('#btnOK').bind('click', function () {
    try {
        //p_ValidateBudgetInput();
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




