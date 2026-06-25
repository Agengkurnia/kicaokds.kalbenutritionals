//     KKP SCRIPT - SubUmbrand
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
var oTableSubUmbrand;


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
    XXSHP_KDS_T_ONO_BGT = {};
    intActivityIndex = $.getParameter("intActivityIndex");
    intBudgetIndex = $.getParameter("intBudgetIndex");

    p_InitiateSubUmbrand();
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
    //debugger
    var arr = txtValue.split('|');
    switch (arr[0]) {
        case "txtSubUmbrand":
            p_settxtSubUmbrand(arr[1], arr[4], "", arr[2]);
            break;
    }
    clsGlobal.closeLOV();
}

function p_DataToUI(objDat) {

    p_DataToUISubUmbrand(objDat.XXSHP_KDS_T_ONO_ACT[intActivityIndex].XXSHP_KDS_T_ONO_BGT[intBudgetIndex].XXSHP_KDS_T_ONO_SUB);

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
        //$("#btnOK").hide();
        //$("#btnCancel").hide();
        $(".btnSubUmbrandApprovalHistory").show();
        $(".btnRemoveAttachment").hide();
        $(".inputAttachment").hide();
        $("#btnAddSubUmbrand").hide();

        $(".txtAmount").attr("disabled", true);

        $(".inputAttachment").hide();

        if (p_GetHiddenObject().TXT_DOCNO.split('/').length < 4) {
            //$(".txtAmount").each(function (index) {
            //    $(this).attr("disabled", true);
            //});
        } else {
            //$(".txtAmount").attr("disabled", true);
            $("#lblSubUmbrandDelete").text("Approval History");
        }

        $(".btnLOVSubUmbrand").each(function (index) {
            $(this).hide();
        });
        $(".btnSubUmbrandDelete").each(function (index) {
            $(this).hide();
        });
        $(".chkDetailAllBrand").each(function (index) {
            $(this).prop("disabled", true);
        });
    }
    else {
        $("#btnOK").show();
        $("#btnCancel").show();

        if (bitAddendum == false) {
            $("#btnAddSubUmbrand").show();
            $(".txtAmount").each(function (index) {
                $(this).removeAttr("disabled");
            });
            $(".chkDetailAllBrand").each(function (index) {
                $(this).prop("disabled", false);
            });
            $(".btnLOVSubUmbrand").each(function (index) {
                $(this).show();
            });
            $(".btnSubUmbrandDelete").each(function (index) {
                $(this).show();
            });
        } else {
            $("#btnAddSubUmbrand").hide();
            $(".txtAmount").each(function (index) {
                $(this).removeAttr("disabled");
            });
            $(".chkDetailAllBrand").each(function (index) {
                $(this).prop("disabled", false);
            });
            $(".btnLOVSubUmbrand").each(function (index) {
                $(this).hide();
            });
            $(".btnSubUmbrandDelete").each(function (index) {
                $(this).hide();
            });
        }
        
    }
}

function p_SetHiddenObject(objDat) {
    $("#txtHiddenObject").val(JSON.stringify(objDat));

    clsGlobal.GenerateAutoNumeric();
    clsGlobal.GenerateDateTimePicker();
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

//function p_GenerateAutoNumeric() {
//    
//    $('.autonumeric').autoNumeric('init', { vMax: '9999999999999', vMin: '-9999999999999', aSep: ',', dGroup: '3', aDec: '.' });
//}


// ==========================
// SubUmbrand  
// ==========================

function p_GetSelectedSubUmbrandRow() {
    var intIndex = clsGlobal.parseToInteger(oTableSubUmbrand.$('tr.selected').find("#lblSubUmbrandNoValue").html()) - 1;
    return intIndex;
}

//function p_GetSelectedSubUmbrandRow() {
//    var intIndex = clsGlobal.parseToInteger(oTableSubUmbrand.$('tr.selected').find("#lblSubUmbrandNoValue").html()) - 1;
//    return intIndex;
//}

function p_InitiateSubUmbrand() {
    // Format datatable  
    oTableSubUmbrand = $('#dtSubUmbrand').DataTable({
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
                    return '<div id="lblSubUmbrandNoValue" > ' + (full.intIndex + 1) + ' </div>';
                }
            },
            //{
            //    aTargets: [1],
            //    mRender: function (data, type, full) {
            //        return '<div style="width:64px;">' + full.TXT_LOB + ' </div> ' + '<div style="display:none;"> ' + full.TXT_LOB + ' </div>';
            //    }
            //},
            {
                aTargets: [1],
                mRender: function (data, type, full) {
                    var dat = p_GetHiddenObject();
                    var bitAddendum = clsGlobal.ParseBooleanOracleToNET(dat.BIT_ADDENDUM);
                    if (bitAddendum) {
                        return '     <div class="input-group"> ' +
                            '       <div class="input-group-btn"> ' +
                            '       </div> ' +
                            '       <div class="input-group-btn" style="width:60px;"> ' +
                            '       <input type="text" class="form-control txtSubUmbrand" id="txtSubUmbrand" onchange="p_btnLOVSubUmbrand_Click(this,' + full.intIndex + ')"  value="' + full.TXT_SUBUMBRAND + '" disabled> ' +
                            '       </div> ' +
                            '   </div>'
                            + '<div style="display:none;"> ' + full.TXT_SUBUMBRAND + ' </div>';
                    } else {
                        return '     <div class="input-group"> ' +
                            '       <div class="input-group-btn"> ' +
                            '           <button type="button" class="btn btn-danger btnLOVSubUmbrand" id="btnLOVSubUmbrand" onclick="p_btnLOVSubUmbrand_Click(this,' + full.intIndex + ')"> <i class="fa fa-search"></i></button> ' +
                            '       </div> ' +
                            '       <div class="input-group-btn" style="width:60px;"> ' +
                            '       <input type="text" class="form-control txtSubUmbrand" id="txtSubUmbrand" onchange="p_btnLOVSubUmbrand_Click(this,' + full.intIndex + ')"  value="' + full.TXT_SUBUMBRAND + '" disabled> ' +
                            '       </div> ' +
                            '   </div>'
                            + '<div style="display:none;"> ' + full.TXT_SUBUMBRAND + ' </div>';
                    }
                }
            },
            {
                aTargets: [2],
                mRender: function (data, type, full) {
                    return '<input type="text" class="form-control autonumeric text-end" id="" style="background-color:#00000000;border:none;" value="' + full.DEC_AMOUNT_AVAILABLE + '" disabled> '
                }
            },
            {
                aTargets: [3],
                mRender: function (data, type, full) {
                    return '<input type="text" class="form-control txtAmount autonumeric text-right" id="txtAmount" onchange="p_txtAmount_Changed(this,' + full.intIndex + ')"  value="' + (clsGlobal.ParseBooleanOracleToNET(full.BIT_APPROVED) ? full.DEC_RESERVED : full.DEC_AMOUNT) + '" ' + (clsGlobal.ParseBooleanOracleToNET(full.BIT_APPROVED) ? "disabled" : "") + ' > ';
                }
            },
            {
                aTargets: [4],
                mRender: function (data, type, full) {
                    if (clsGlobal.ParseBooleanOracleToNET(full.BIT_ALL_BRAND)) {
                        return '<div style="text-align:center;"> <input type="checkbox" id="chkDetailAllBrand" class="chkDetailAllBrand" onchange="p_chkDetailAllBrand_Changed(this,' + full.intIndex + ')"  checked >  </div>';
                    } else {
                        return '<div style="text-align:center;"> <input type="checkbox" id="chkDetailAllBrand" class="chkDetailAllBrand text-center" onchange="p_chkDetailAllBrand_Changed(this,' + full.intIndex + ')" >  </div>';
                    }
                }
            },
            {
                aTargets: [5],
                mRender: function (data, type, full) {
                    if (clsGlobal.ParseBooleanOracleToNET(full.BIT_ALL_BRAND)) {
                        return '';
                    } else {
                        return '<div > <input type="button" class="btn btn-info btnBrand" id="btnBrand" onclick="p_btnBrand_Click(this,' + full.intIndex + ')"  value="Brand" >  </div>';
                    }
                }
            },
            {
                aTargets: [6],
                mRender: function (data, type, full) {
                    var dat = p_GetHiddenObject();
                    var bitAddendum = clsGlobal.ParseBooleanOracleToNET(dat.BIT_ADDENDUM);

                    if (clsGlobal.ParseBooleanOracleToNET(dat.BIT_APPLY) || bitAddendum) {
                        return '<div style="display:flex;"></div>';
                    } else {
                        return  '<div style="display:flex;"> ' +
                                '<input type="button" class="btn btn-warning btnSubUmbrandDelete" id="btnSubUmbrandDelete" onclick="p_btnSubUmbrandDelete_Click(this,' + full.intIndex + ')"  value="Delete" > ' +
                                '</div>';
                    }
                }
            }
        ]
    });

    //if (!parent.parent.bitReject) {
    //    $('#dtSubUmbrand').DataTable().column(7).visible(false);
    //}

    $("#dtSubUmbrand").css("width", "100%");
    $('#dtSubUmbrand tbody').on('click', 'tr', function () {
        if (!$(this).hasClass('selected')) {
            oTableSubUmbrand.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
        }
    });

}

function p_ShowBlankSubUmbrand() {
    oTableSubUmbrand.clear();
    oTableSubUmbrand.draw(false);
}

function p_AddSubUmbrand() {

    clsGlobal.showLoading();
    $.ajax({
        type: "POST",
        url: "/Transaction/ONO/AddRowSubUmbrand",
        data: { intActivityIndex: intActivityIndex, intBudgetIndex: intBudgetIndex, data: $("#txtHiddenObject").val(), __RequestVerificationToken: $('#frmONO input[name=__RequestVerificationToken]').val() },
        datatype: "json",
        success: function (retDat) {

            if (retDat.bitSuccess == true) {
                if (retDat.objData != undefined) {
                    p_SetHiddenObject(retDat.objData);
                    p_DataToUISubUmbrand(retDat.objData.XXSHP_KDS_T_ONO_ACT[intActivityIndex].XXSHP_KDS_T_ONO_BGT[intBudgetIndex].XXSHP_KDS_T_ONO_SUB);
                    oTableSubUmbrand.page('last').draw(false);
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

function p_DataToUISubUmbrand(XXSHP_KDS_T_ONO_SUB) {

    oTableSubUmbrand.clear();
    for (var i = 0; i < XXSHP_KDS_T_ONO_SUB.length; i++) {
        XXSHP_KDS_T_ONO_SUB[i].intIndex = i;
        oTableSubUmbrand.row.add(XXSHP_KDS_T_ONO_SUB[i]);
    }
    oTableSubUmbrand.draw(false);

    var objDat = p_GetHiddenObject();
    objDat.XXSHP_KDS_T_ONO_ACT[intActivityIndex].XXSHP_KDS_T_ONO_BGT[intBudgetIndex].XXSHP_KDS_T_ONO_SUB = XXSHP_KDS_T_ONO_SUB;
    p_SetHiddenObject(objDat);
}

function p_RefreshNumberSubUmbrand() {

    var intRowIndex = 0;
    var objDat = p_GetHiddenObject();
    oTableSubUmbrand.rows().every(function (rowIdx, tableLoop, rowLoop) {

        var d = this.data();
        d.intIndex = intRowIndex; // update data source for the row
        objDat.XXSHP_KDS_T_ONO_ACT[intActivityIndex].XXSHP_KDS_T_ONO_BGT[intBudgetIndex].XXSHP_KDS_T_ONO_SUB[intRowIndex].intIndex = d.intIndex;

        //Custom
        //d.TXT_LOB = objDat.XXSHP_KDS_T_ONO_ACT[intActivityIndex].XXSHP_KDS_T_ONO_BGT[intBudgetIndex].XXSHP_KDS_T_ONO_SUB[intRowIndex].TXT_LOB;
        //d.TXT_STATUS = objDat.XXSHP_KDS_T_ONO_ACT[intActivityIndex].XXSHP_KDS_T_ONO_BGT[intBudgetIndex].XXSHP_KDS_T_ONO_SUB[intRowIndex].TXT_STATUS;
        d.TXT_SUBUMBRAND = objDat.XXSHP_KDS_T_ONO_ACT[intActivityIndex].XXSHP_KDS_T_ONO_BGT[intBudgetIndex].XXSHP_KDS_T_ONO_SUB[intRowIndex].TXT_SUBUMBRAND;
        d.DEC_AMOUNT_AVAILABLE = objDat.XXSHP_KDS_T_ONO_ACT[intActivityIndex].XXSHP_KDS_T_ONO_BGT[intBudgetIndex].XXSHP_KDS_T_ONO_SUB[intRowIndex].DEC_AMOUNT_AVAILABLE;
        //d.DEC_RESERVED = objDat.XXSHP_KDS_T_ONO_ACT[intActivityIndex].XXSHP_KDS_T_ONO_BGT[intBudgetIndex].XXSHP_KDS_T_ONO_SUB[intRowIndex].DEC_RESERVED;
        d.DEC_AMOUNT = objDat.XXSHP_KDS_T_ONO_ACT[intActivityIndex].XXSHP_KDS_T_ONO_BGT[intBudgetIndex].XXSHP_KDS_T_ONO_SUB[intRowIndex].DEC_AMOUNT;
        d.BIT_ALL_BRAND = objDat.XXSHP_KDS_T_ONO_ACT[intActivityIndex].XXSHP_KDS_T_ONO_BGT[intBudgetIndex].XXSHP_KDS_T_ONO_SUB[intRowIndex].BIT_ALL_BRAND;

        intRowIndex++;
        this.invalidate(); // invalidate the data DataTables has cached for this row         
    });

    // Draw once all updates are done
    oTableSubUmbrand.draw(false);
    p_SetHiddenObject(objDat);
}

function p_btnLOVSubUmbrand_Click(objCaller, intIndex) {
    // Parse dari HiddenObject->JSON

    var objDat = JSON.parse(p_UIToData());
    var intSelectedIndex = p_GetSelectedSubUmbrandRow();
    var txtGroup = objDat.TXT_GROUP_ACCOUNT;
    var txtBudgetType = objDat.TXT_BUDGET_TYPE;
    var txtPeriod = moment(objDat.DTM_POSTING).format("YYYY");
    LOV = clsGlobal.generateLOV(LOV_SUBUMBRAND_BY_TXT_GROUP_ACCOUNT_BYBUDGET_TYPE_BYPERIOD, "txtSubUmbrand", txtPeriod + "|" + txtBudgetType + "|" + txtGroup);
}

function p_btnBudgetSubUmbrand_Click(objCaller, intIndex) {

    try {
        // Parse dari HiddenObject->JSON
        var objData = JSON.parse(p_UIToData());
        var ltOnoSubumbrand = objData.XXSHP_KDS_T_ONO_ACT[intActivityIndex].XXSHP_KDS_T_ONO_BGT[intBudgetIndex].XXSHP_KDS_T_ONO_SUB;
        for (i = 0; i < ltOnoSubumbrand.length; i++) {
            // Cari Index-nya.
            if (ltOnoSubumbrand[i].intIndex == intIndex) {
                // Ketemu, mulai dari sini:

                //Validasi 
                if (ltOnoBrand.TXT_SUBUMBRAND == "") {
                    throw "Brand must be filled!";
                }

                var fancyboxdata = p_GetHiddenObject();
                LOV = clsGlobal.generatePopUpIframe($(location).attr('protocol') + "//" + $(location).attr('host') + "/Transaction/ONO/Sku?intActivityIndex=" + intActivityIndex + "&intBudgetIndex=" + intBudgetIndex + "&intSubUmbrandIndex=" + intIndex, "btnBudgetSubUmbrand", fancyboxdata);
                break;
            }
        }
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
}

function p_chkDetailAllBrand_Changed(objCaller, intIndex) {

    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());
    for (i = 0; i < objData.XXSHP_KDS_T_ONO_ACT[intActivityIndex].XXSHP_KDS_T_ONO_BGT[intBudgetIndex].XXSHP_KDS_T_ONO_SUB.length; i++) {
        // Cari Index-nya.
        if (objData.XXSHP_KDS_T_ONO_ACT[intActivityIndex].XXSHP_KDS_T_ONO_BGT[intBudgetIndex].XXSHP_KDS_T_ONO_SUB[i].intIndex == intIndex) {
            // Ketemu, mulai dari sini:
            objData.XXSHP_KDS_T_ONO_ACT[intActivityIndex].XXSHP_KDS_T_ONO_BGT[intBudgetIndex].XXSHP_KDS_T_ONO_SUB[i].BIT_ALL_BRAND = clsGlobal.ParseBooleanNETToOracle(objCaller.checked);

            if (objData.XXSHP_KDS_T_ONO_ACT[intActivityIndex].XXSHP_KDS_T_ONO_BGT[intBudgetIndex].XXSHP_KDS_T_ONO_SUB[i].BIT_ALL_BRAND == "Y") {
                objData.XXSHP_KDS_T_ONO_ACT[intActivityIndex].XXSHP_KDS_T_ONO_BGT[intBudgetIndex].XXSHP_KDS_T_ONO_SUB[i].XXSHP_KDS_T_ONO_BRD = [];
            }
            break;
        }
    }
    p_SetHiddenObject(objData);
    p_RefreshNumberSubUmbrand();
}

function p_settxtSubUmbrand(txtValue, txtLob, txtSubUmbrand, decAvailable) {
    debugger
    var intSelectedIndex = p_GetSelectedSubUmbrandRow();
    var intRowIndex = 0;
    var objDat = p_GetHiddenObject();
    oTableSubUmbrand.rows().every(function (rowIdx, tableLoop, rowLoop) {

        var d = this.data();
        if (intRowIndex == intSelectedIndex) {
            d.intIndex = intRowIndex; // update data source for the row 

            d.TXT_LOB = txtLob;
            d.TXT_SUBUMBRAND = txtValue;

            d.DEC_AMOUNT = objDat.XXSHP_KDS_T_ONO_ACT[intActivityIndex].XXSHP_KDS_T_ONO_BGT[intBudgetIndex].XXSHP_KDS_T_ONO_SUB[intRowIndex].DEC_AMOUNT;
            d.DEC_AMOUNT_AVAILABLE = objDat.XXSHP_KDS_T_ONO_ACT[intActivityIndex].XXSHP_KDS_T_ONO_BGT[intBudgetIndex].XXSHP_KDS_T_ONO_SUB[intRowIndex].DEC_AMOUNT_AVAILABLE = decAvailable;
            d.DEC_RESERVED = objDat.XXSHP_KDS_T_ONO_ACT[intActivityIndex].XXSHP_KDS_T_ONO_BGT[intBudgetIndex].XXSHP_KDS_T_ONO_SUB[intRowIndex].DEC_RESERVED;

            objDat.XXSHP_KDS_T_ONO_ACT[intActivityIndex].XXSHP_KDS_T_ONO_BGT[intBudgetIndex].XXSHP_KDS_T_ONO_SUB[intRowIndex].TXT_SUBUMBRAND = txtValue;
            objDat.XXSHP_KDS_T_ONO_ACT[intActivityIndex].XXSHP_KDS_T_ONO_BGT[intBudgetIndex].XXSHP_KDS_T_ONO_SUB[intRowIndex].TXT_LOB = txtLob;

            this.invalidate(); // invalidate the data DataTables has cached for this row         
            p_EnableControl(clsGlobal.ParseBooleanOracleToNET(objDat.BIT_APPLY), objDat);
        }


        intRowIndex++;
    });

    p_SetHiddenObject(objDat);

    //p_ValidateData(objDat, intActivityIndex, intBudgetIndex, intSelectedIndex);
}

function p_txtAmount_Changed(objCaller, intIndex) {
    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());
    for (i = 0; i < objData.XXSHP_KDS_T_ONO_ACT[intActivityIndex].XXSHP_KDS_T_ONO_BGT[intBudgetIndex].XXSHP_KDS_T_ONO_SUB.length; i++) {
        // Cari Index-nya.
        if (objData.XXSHP_KDS_T_ONO_ACT[intActivityIndex].XXSHP_KDS_T_ONO_BGT[intBudgetIndex].XXSHP_KDS_T_ONO_SUB[i].intIndex == intIndex) {
            // Ketemu, mulai dari sini:
            // Validasi tidak lebih dari Budget Besar tersedia
            if (p_GetHiddenObject().TXT_DOCNO.split('/').length < 4) {
                var DEC_AMOUNT_AVAILABLE_DUMP = objData.XXSHP_KDS_T_ONO_ACT[intActivityIndex].XXSHP_KDS_T_ONO_BGT[intBudgetIndex].XXSHP_KDS_T_ONO_SUB[i].DEC_AMOUNT_AVAILABLE;
                if (clsGlobal.parseToDecimal(DEC_AMOUNT_AVAILABLE_DUMP) > clsGlobal.parseToDecimal(objCaller.value)) {
                    objData.XXSHP_KDS_T_ONO_ACT[intActivityIndex].XXSHP_KDS_T_ONO_BGT[intBudgetIndex].XXSHP_KDS_T_ONO_SUB[i].DEC_AMOUNT = clsGlobal.parseToDecimal(objCaller.value);
                    //objData.XXSHP_KDS_T_ONO_ACT[intActivityIndex].XXSHP_KDS_T_ONO_BGT[intBudgetIndex].XXSHP_KDS_T_ONO_SUB[i].DEC_RESERVED = clsGlobal.parseToDecimal(objCaller.value);
                } else {
                    $('[onchange="p_txtAmount_Changed(this,' + intIndex + ')"]').val(clsGlobal.parseToDecimal(DEC_AMOUNT_AVAILABLE_DUMP));
                    objData.XXSHP_KDS_T_ONO_ACT[intActivityIndex].XXSHP_KDS_T_ONO_BGT[intBudgetIndex].XXSHP_KDS_T_ONO_SUB[i].DEC_AMOUNT = clsGlobal.parseToDecimal(DEC_AMOUNT_AVAILABLE_DUMP);
                }
            } else {
                var dec_prev = objData.XXSHP_KDS_T_ONO_ACT[intActivityIndex].XXSHP_KDS_T_ONO_BGT[intBudgetIndex].XXSHP_KDS_T_ONO_SUB[i].DEC_RESERVED;
                if (clsGlobal.parseToDecimal(objCaller.value) > dec_prev) {
                    clsGlobal.showAlert(`Perubahan Amount tidak bisa lebih besar dari nilai awal (${clsGlobal.parseToRupiah(dec_prev)})`);
                    objData.XXSHP_KDS_T_ONO_ACT[intActivityIndex].XXSHP_KDS_T_ONO_BGT[intBudgetIndex].XXSHP_KDS_T_ONO_SUB[i].DEC_AMOUNT = clsGlobal.parseToDecimal(objCaller.value);
                } else {
                    objData.XXSHP_KDS_T_ONO_ACT[intActivityIndex].XXSHP_KDS_T_ONO_BGT[intBudgetIndex].XXSHP_KDS_T_ONO_SUB[i].DEC_AMOUNT = clsGlobal.parseToDecimal(objCaller.value);
                }
            }
            break;
        }
    }
    p_SetHiddenObject(objData);
}

function p_btnBrand_Click(objCaller, intIndex) {

    try {
        // Parse dari HiddenObject->JSON
        var objData = JSON.parse(p_UIToData());
        for (i = 0; i < objData.XXSHP_KDS_T_ONO_ACT[intActivityIndex].XXSHP_KDS_T_ONO_BGT[intBudgetIndex].XXSHP_KDS_T_ONO_SUB.length; i++) {
            // Cari Index-nya.
            if (objData.XXSHP_KDS_T_ONO_ACT[intActivityIndex].XXSHP_KDS_T_ONO_BGT[intBudgetIndex].XXSHP_KDS_T_ONO_SUB[i].intIndex == intIndex) {
                // Ketemu, mulai dari sini:

                //Validasi 
                if (objData.XXSHP_KDS_T_ONO_ACT[intActivityIndex].XXSHP_KDS_T_ONO_BGT[intBudgetIndex].XXSHP_KDS_T_ONO_SUB[i].TXT_SUBUMBRAND == "") {
                    throw "SubUmbrand must be filled!";
                }

                var fancyboxdata = p_GetHiddenObject();
                LOV = clsGlobal.generatePopUpIframe($(location).attr('protocol') + "//" + $(location).attr('host') + "/Transaction/ONO/Brand?intActivityIndex=" + intActivityIndex + "&intBudgetIndex=" + intBudgetIndex + "&intSubUmbrandIndex=" + intIndex, "btnBudgetBrand", fancyboxdata);
                break;
            }
        }
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
}

function p_btnSubUmbrandDelete_Click(objCaller, intIndex) {

    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());
    for (i = 0; i < objData.XXSHP_KDS_T_ONO_ACT[intActivityIndex].XXSHP_KDS_T_ONO_BGT[intBudgetIndex].XXSHP_KDS_T_ONO_SUB.length; i++) {
        // Cari Index-nya.
        if (objData.XXSHP_KDS_T_ONO_ACT[intActivityIndex].XXSHP_KDS_T_ONO_BGT[intBudgetIndex].XXSHP_KDS_T_ONO_SUB[i].intIndex == intIndex) {
            // Ketemu, mulai dari sini:
            // Remove from list.
            objData.XXSHP_KDS_T_ONO_ACT[intActivityIndex].XXSHP_KDS_T_ONO_BGT[intBudgetIndex].XXSHP_KDS_T_ONO_SUB.splice(i, 1);

            oTableSubUmbrand.row(i).remove().draw(false);
            break;
        }
    }
    p_SetHiddenObject(objData);
    p_RefreshNumberSubUmbrand();
}

$('#btnAddSubUmbrand').on('click', function () {
    try {
        p_AddSubUmbrand();
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
});


function p_ValidateData(dat, intActivityIndex, intBudgetIndex, intSubUmbrandIndex) {
    clsGlobal.showLoading();
    $.ajax({
        type: "POST",
        url: "/Transaction/ONO/ValidateDataClientSideSubUmbrand",
        data: {
            intActivityIndex: intActivityIndex,
            intBudgetIndex: intBudgetIndex,
            intSubUmbrandIndex: intSubUmbrandIndex,
            data: JSON.stringify(dat),
            __RequestVerificationToken: $('#frmONO input[name=__RequestVerificationToken]').val()
        },
        datatype: "json",
        success: function (retDat) {

            if (retDat.bitSuccess == true) {
                if (retDat.objData != undefined) {
                    p_SetHiddenObject(retDat.objData);
                    p_DataToUISubUmbrand(retDat.objData.XXSHP_KDS_T_ONO_ACT[intActivityIndex].XXSHP_KDS_T_ONO_BGT[intBudgetIndex].XXSHP_KDS_T_ONO_SUB);
                    oTableSubUmbrand.page('last').draw(false);
                }
            } else {
                p_SetHiddenObject(retDat.objData);
                p_DataToUISubUmbrand(retDat.objData.XXSHP_KDS_T_ONO_ACT[intActivityIndex].XXSHP_KDS_T_ONO_BGT[intBudgetIndex].XXSHP_KDS_T_ONO_SUB);
                oTableSubUmbrand.page('last').draw(false);
                clsGlobal.getAlert(retDat.txtMessage);
            }
            clsGlobal.hideLoading();
        },
        error: function (retDat) {
            clsGlobal.hideLoading();
        }
    });
}

function p_DownloadAttahcment(INT_ONO_SUB_ID) {
    $.ajax({
        type: "POST",
        url: "/Transaction/ONO/DownloadAttachment",
        data: {
            INT_ONO_SUB_ID: INT_ONO_SUB_ID,
            __RequestVerificationToken: $('#frmONO input[name=__RequestVerificationToken]').val()
        },
        datatype: "json",
        success: function (retDat) {
            if (retDat.bitSuccess) {
                var dat = retDat.objData;
                for (var i = 0; i < dat.length; i++) {
                    if (clsGlobal.parseToString(dat[i].TXT_FILE_DIRECTORY) != "") {
                        if (clsGlobal.parseToString(dat[i].TXT_FILE_DIRECTORY) != "") {
                            window.open(dat[i].TXT_FILE_DIRECTORY, '_self');
                        }
                    }
                }
            } else {
                clsGlobal.setMessageWarning(retDat.txtMessage);
            }
        },
        error: function (retDat) {
            clsGlobal.hideLoading();
        }
    });
}

function p_ValidateSubUmbrandInput() {
    // Parse dari HiddenObject->JSON
    var isValid = true;
    var objDat = JSON.parse(p_UIToData());
    var arrSubumbrand = objDat.XXSHP_KDS_T_ONO_ACT[intActivityIndex]
        .XXSHP_KDS_T_ONO_BGT[intBudgetIndex]
        .XXSHP_KDS_T_ONO_SUB;
    var bitAddendum = clsGlobal.ParseBooleanOracleToNET(objDat.BIT_ADDENDUM);

    if (arrSubumbrand.length > 0) {
        // Check duplicate SubUmbrand
        var subSeen = {};
        var duplicateSubs = [];

        for (var i = 0; i < arrSubumbrand.length; i++) {
            var sub = (arrSubumbrand[i].TXT_SUBUMBRAND || "").trim().toUpperCase();
            if (sub === "") continue;

            if (subSeen[sub]) {
                duplicateSubs.push(sub);
            } else {
                subSeen[sub] = true;
            }
        }

        if (duplicateSubs.length > 0) {
            throw "SubUmbrand tidak boleh duplikat: " + duplicateSubs.join(", ");
        }

        //validasi amount tidak boleh 0 dan minus
        for (i = 0; i < arrSubumbrand.length; i++) {
            // validasi amount tidak boleh 0 dan minus
            if (arrSubumbrand[i].BIT_ALL_BRAND == "N") {
                if (arrSubumbrand[i].XXSHP_KDS_T_ONO_BRD.length == 0)
                    throw "Jika All Brand tidak di-checklist harap pilih satu Brand!";

                // Cek duplikasi brand
                var seen = {};
                var duplicates = [];

                for (var j = 0; j < arrSubumbrand[i].XXSHP_KDS_T_ONO_BRD.length; j++) {
                    var brand = (arrSubumbrand[i].XXSHP_KDS_T_ONO_BRD[j].TXT_BRAND || "").trim().toUpperCase();
                    if (brand === "") continue;

                    if (seen[brand]) {
                        duplicates.push(brand);
                    } else {
                        seen[brand] = true;
                    }
                }

                if (duplicates.length > 0) {
                    isValid = false;
                    throw "Brand tidak boleh duplikat di Subumbrand '" + (arrSubumbrand[i].TXT_SUBUMBRAND || "-") + "': " + duplicates.join(", ");
                }
            }

            if (bitAddendum == false) {
                if (arrSubumbrand[i].DEC_AMOUNT == 0) {
                    clsGlobal.setMessageWarning("Data SubUmbrand ke " + [i + 1] + " Amount tidak boleh 0 !");
                    isValid = false;
                }
            }

            if (arrSubumbrand[i].DEC_AMOUNT < 0) {
                clsGlobal.setMessageWarning("Data SubUmbrand ke " + [i + 1] + " Amount tidak boleh Minus !");
                isValid = false;
            }
 
        }
        if (isValid) {
            parent.$("#txtHiddenObject").val($("#txtHiddenObject").val());
            parent.clsGlobal.closePopUpIframe();
            parent.p_setSubUmbrand();
        }

    } else {
        clsGlobal.setMessageWarning("Data tidak boleh kosong !");
    }
    
}

// ==========================
// END: SubUmbrand   
// ==========================


//=======================
// HANDLER
//=======================

$('#btnOK').bind('click', function () {
    try {
        p_ValidateSubUmbrandInput();
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
