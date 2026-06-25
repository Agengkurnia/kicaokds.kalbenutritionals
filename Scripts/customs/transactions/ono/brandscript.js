//     KKP SCRIPT - Umbrand
//
//
//      History.
//
//      18-May-2018                    Initial version.            (nosa)
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
    XXSHP_KDS_T_ONO_BRD = {};
    intActivityIndex = $.getParameter("intActivityIndex");
    intBudgetIndex = $.getParameter("intBudgetIndex");
    intSubUmbrandIndex = $.getParameter("intSubUmbrandIndex");

    p_InitiateBrand();
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
    debugger
    var arr = txtValue.split('|');
    switch (arr[0]) {
        case "txtBrand":
            p_settxtSubbrand(arr[2]);
            break;
    }
    clsGlobal.closeLOV();
}

function p_DataToUI(objDat) {

    $("#txtUmbrand").val((objDat.XXSHP_KDS_T_ONO_ACT[intActivityIndex].XXSHP_KDS_T_ONO_BGT[intBudgetIndex].XXSHP_KDS_T_ONO_SUB[intSubUmbrandIndex].TXT_SUBUMBRAND));
    $("#txtTotalAmount").val(objDat.XXSHP_KDS_T_ONO_ACT[intActivityIndex].XXSHP_KDS_T_ONO_BGT[intBudgetIndex].XXSHP_KDS_T_ONO_SUB[intSubUmbrandIndex].DEC_AMOUNT);

    p_DataToUIBrand(objDat.XXSHP_KDS_T_ONO_ACT[intActivityIndex].XXSHP_KDS_T_ONO_BGT[intBudgetIndex].XXSHP_KDS_T_ONO_SUB[intSubUmbrandIndex].XXSHP_KDS_T_ONO_BRD);

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
            $(this).prop("disabled", true);
        });
    }
    //else {
    //    $("#btnOK").show();
    //    $("#btnCancel").show();

    //    $("#btnAddBrand").hide();
    //    $(".btnLOVSubBrand").each(function (index) {
    //        $(this).hide();
    //    });
    //    $(".btnSubBrandDelete").each(function (index) {
    //        $(this).hide();
    //    });
    //    $(".chkDetailAllSKU").each(function (index) {
    //        $(this).attr("disabled", "true");
    //    });
    //    $(".txtDetailAmount").each(function (index) {
    //        $(this).attr("disabled", "true");
    //    });
    //    $(".chkDetailAllSKU").each(function (index) {
    //        $(this).prop("disabled", false);
    //    });
    //} 
    else {
        $("#btnOK").show();
        $("#btnCancel").show();

        $("#btnAddBrand").show();
        $(".btnLOVSubBrand").each(function (index) {
            $(this).show();
        });
        $(".btnSubBrandDelete").each(function (index) {
            $(this).show();
        });
    }

    //khusus buat case dokumen dari BOSNET
    //if (objDat.TXT_SOURCE_DOC == "BOSNET") {
    //    $("#btnOK").hide();
    //    $("#btnCancel").hide();

    //    $("#btnAddBrand").hide();
    //    $(".btnLOVSubBrand").each(function (index) {
    //        $(this).hide();
    //    });
    //    $(".btnSubBrandDelete").each(function (index) {
    //        $(this).hide();
    //    });
    //    $(".chkDetailAllSKU").each(function (index) {
    //        $(this).attr("disabled", "true");
    //    });
    //    $(".txtDetailAmount").each(function (index) {
    //        $(this).attr("disabled", "true");
    //    });
    //}
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

function p_InitiateBrand() {
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
                        '       <input type="text" class="form-control txtSubBrand" id="txtSubBrand"  value="' + full.TXT_BRAND + '" disabled> ' +
                        '       </div> ' + '<div style="display:none;"> ' + full.TXT_BRAND + ' </div>'
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
                }
            },
            //{
            //    aTargets: [3],
            //    mRender: function (data, type, full) {
            //        return '<div >  <input type="text" class="form-control txtDetailAmount autonumeric text-right" id="txtDetailAmount' + full.intIndex + '" onchange="p_txtDetailAmount_Changed(this,' + full.intIndex + ')"   value="' + full.DEC_AMOUNT + '" >  </div>';

            //    }
            //},
            {
                aTargets: [3],
                mRender: function (data, type, full) {
                    if (clsGlobal.ParseBooleanOracleToNET(full.BIT_ALL_SKU)) {
                        return '';
                    } else {
                        return '<div > <input type="button" class="btn btn-info btnDetailSKU" id="btnDetailSKU" onclick="p_btnDetailSKU_Click(this,' + full.intIndex + ')"  value="SKU" >  </div>';
                    }

                }
            },
            {
                aTargets: [4],
                mRender: function (data, type, full) {
                    var dat = p_GetHiddenObject();

                    if (clsGlobal.ParseBooleanOracleToNET(dat.BIT_APPLY)) {
                        return '<div></div>';
                    } else {
                        return '<div > <input type="button" class="btn btn-warning btnSubBrandDelete" id="btnSubBrandDelete" onclick="p_btnSubBrandDelete_Click(this,' + full.intIndex + ')"  value="Delete" >  </div>';
                    }
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
        url: "/Transaction/ONO/AddRowBrand",
        data: {
                intActivityIndex: intActivityIndex, intBudgetIndex: intBudgetIndex, intSubUmbrandIndex: intSubUmbrandIndex,
                data: $("#txtHiddenObject").val(), __RequestVerificationToken: $('#frmONO input[name=__RequestVerificationToken]').val()
        },
        datatype: "json",
        success: function (retDat) {

            if (retDat.bitSuccess == true) {
                if (retDat.objData != undefined) {
                    p_SetHiddenObject(retDat.objData);
                    p_DataToUIBrand(retDat.objData.XXSHP_KDS_T_ONO_ACT[intActivityIndex].XXSHP_KDS_T_ONO_BGT[intBudgetIndex].XXSHP_KDS_T_ONO_SUB[intSubUmbrandIndex].XXSHP_KDS_T_ONO_BRD);
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

function p_DataToUIBrand(XXSHP_KDS_T_ONO_BRD) {

    oTableBrand.clear();
    for (var i = 0; i < XXSHP_KDS_T_ONO_BRD.length; i++) {
        XXSHP_KDS_T_ONO_BRD[i].intIndex = i;
        oTableBrand.row.add(XXSHP_KDS_T_ONO_BRD[i]);
    }
    oTableBrand.draw(false);

    var objDat = p_GetHiddenObject();
    objDat.XXSHP_KDS_T_ONO_ACT[intActivityIndex].XXSHP_KDS_T_ONO_BGT[intBudgetIndex].XXSHP_KDS_T_ONO_BRD = XXSHP_KDS_T_ONO_BRD;
    p_SetHiddenObject(objDat);
}

function p_RefreshNumberUmbrand() {

    var intRowIndex = 0;
    var objDat = p_GetHiddenObject();
    oTableBrand.rows().every(function (rowIdx, tableLoop, rowLoop) {

        var d = this.data();
        d.intIndex = intRowIndex; // update data source for the row
        objDat.XXSHP_KDS_T_ONO_ACT[intActivityIndex].XXSHP_KDS_T_ONO_BGT[intBudgetIndex].XXSHP_KDS_T_ONO_SUB[intSubUmbrandIndex].XXSHP_KDS_T_ONO_BRD[intRowIndex].intIndex = d.intIndex;

        d.TXT_BRAND = objDat.XXSHP_KDS_T_ONO_ACT[intActivityIndex].XXSHP_KDS_T_ONO_BGT[intBudgetIndex].XXSHP_KDS_T_ONO_SUB[intSubUmbrandIndex].XXSHP_KDS_T_ONO_BRD[intRowIndex].TXT_BRAND;
        d.BIT_ALL_SKU = objDat.XXSHP_KDS_T_ONO_ACT[intActivityIndex].XXSHP_KDS_T_ONO_BGT[intBudgetIndex].XXSHP_KDS_T_ONO_SUB[intSubUmbrandIndex].XXSHP_KDS_T_ONO_BRD[intRowIndex].BIT_ALL_SKU;
        d.DEC_AMOUNT = objDat.XXSHP_KDS_T_ONO_ACT[intActivityIndex].XXSHP_KDS_T_ONO_BGT[intBudgetIndex].XXSHP_KDS_T_ONO_SUB[intSubUmbrandIndex].XXSHP_KDS_T_ONO_BRD[intRowIndex].DEC_AMOUNT;

        intRowIndex++;
        this.invalidate(); // invalidate the data DataTables has cached for this row         
    });

    // Draw once all updates are done
    oTableBrand.draw(false);
    p_SetHiddenObject(objDat);
}


function p_btnLOVSubBrand_Click(objCaller, intIndex) {
    //LOV = clsGlobal.generateLOV(LOV_SUBBRAND_PROMAP_BRAND, "txtSubbrand", $("#txtBrand").val());

    var objDat = JSON.parse(p_UIToData());
    //var intSelectedIndex = p_GetSelectedSubUmbrandRow();
    var txtGroup = objDat.TXT_GROUP_ACCOUNT;
    var txtBudgetType = objDat.TXT_BUDGET_TYPE;
    var txtPeriod = moment(objDat.DTM_POSTING).format("YYYY");
    var txtSubUmbrand = objDat.XXSHP_KDS_T_ONO_ACT[intActivityIndex].XXSHP_KDS_T_ONO_BGT[intBudgetIndex].XXSHP_KDS_T_ONO_SUB[intSubUmbrandIndex].TXT_SUBUMBRAND;
    LOV = clsGlobal.generateLOV(LOV_SUBUMBRAND_BY_TXT_GROUP_ACCOUNT_BYBUDGET_TYPE_BYPERIOD_SUBUMBRAND, "txtBrand", txtPeriod + "|" + txtBudgetType + "|" + txtGroup + "|" + txtSubUmbrand);
}

function p_settxtSubbrand(txtValue1) {
    debugger
    var intSelectedIndex = p_GetSelectedUmbrandRow();
    var intRowIndex = 0;
    var objDat = p_GetHiddenObject();
    oTableBrand.rows().every(function (rowIdx, tableLoop, rowLoop) {

        var d = this.data();
        if (intRowIndex == intSelectedIndex) {
            d.intIndex = intRowIndex; // update data source for the row 

            d.TXT_BRAND = txtValue1;
            objDat.XXSHP_KDS_T_ONO_ACT[intActivityIndex].XXSHP_KDS_T_ONO_BGT[intBudgetIndex].XXSHP_KDS_T_ONO_SUB[intSubUmbrandIndex].XXSHP_KDS_T_ONO_BRD[intRowIndex].TXT_BRAND = txtValue1;

            this.invalidate(); // invalidate the data DataTables has cached for this row         
            p_EnableControl(clsGlobal.ParseBooleanOracleToNET(objDat.BIT_APPLY), objDat);
        }

        intRowIndex++;
    });

    p_SetHiddenObject(objDat);
}


function p_chkDetailAllSKU_Changed(objCaller, intIndex) {
    debugger
    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());
    for (i = 0; i < objData.XXSHP_KDS_T_ONO_ACT[intActivityIndex].XXSHP_KDS_T_ONO_BGT[intBudgetIndex].XXSHP_KDS_T_ONO_SUB[intSubUmbrandIndex].XXSHP_KDS_T_ONO_BRD.length; i++) {
        // Cari Index-nya.
        if (objData.XXSHP_KDS_T_ONO_ACT[intActivityIndex].XXSHP_KDS_T_ONO_BGT[intBudgetIndex].XXSHP_KDS_T_ONO_SUB[intSubUmbrandIndex].XXSHP_KDS_T_ONO_BRD[i].intIndex == intIndex) {
            // Ketemu, mulai dari sini:
            objData.XXSHP_KDS_T_ONO_ACT[intActivityIndex].XXSHP_KDS_T_ONO_BGT[intBudgetIndex].XXSHP_KDS_T_ONO_SUB[intSubUmbrandIndex].XXSHP_KDS_T_ONO_BRD[i].BIT_ALL_SKU = clsGlobal.ParseBooleanNETToOracle(objCaller.checked);

            if (objData.XXSHP_KDS_T_ONO_ACT[intActivityIndex].XXSHP_KDS_T_ONO_BGT[intBudgetIndex].XXSHP_KDS_T_ONO_SUB[intSubUmbrandIndex].XXSHP_KDS_T_ONO_BRD[i].BIT_ALL_SKU == "Y") {
                objData.XXSHP_KDS_T_ONO_ACT[intActivityIndex].XXSHP_KDS_T_ONO_BGT[intBudgetIndex].XXSHP_KDS_T_ONO_SUB[intSubUmbrandIndex].XXSHP_KDS_T_ONO_BRD[i].XXSHP_KDS_T_ONO_SKU = [];
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
    for (i = 0; i < objData.XXSHP_KDS_T_ONO_ACT[intActivityIndex].XXSHP_KDS_T_ONO_BGT[intBudgetIndex].XXSHP_KDS_T_ONO_SUB[intSubUmbrandIndex].XXSHP_KDS_T_ONO_BRD.length; i++) {
        // Cari Index-nya.
        if (objData.XXSHP_KDS_T_ONO_ACT[intActivityIndex].XXSHP_KDS_T_ONO_BGT[intBudgetIndex].XXSHP_KDS_T_ONO_SUB[intSubUmbrandIndex].XXSHP_KDS_T_ONO_BRD[i].intIndex == intIndex) {
            // Ketemu, mulai dari sini:
            objData.XXSHP_KDS_T_ONO_ACT[intActivityIndex].XXSHP_KDS_T_ONO_BGT[intBudgetIndex].XXSHP_KDS_T_ONO_SUB[intSubUmbrandIndex].XXSHP_KDS_T_ONO_BRD[i].DEC_AMOUNT = clsGlobal.parseToDecimal(objCaller.value);

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
        console.log(objData.XXSHP_KDS_T_ONO_ACT[intActivityIndex]
            .XXSHP_KDS_T_ONO_BGT[intBudgetIndex]
            .XXSHP_KDS_T_ONO_SUB[intSubUmbrandIndex]
            .XXSHP_KDS_T_ONO_BRD);

        for (i = 0; i < objData.XXSHP_KDS_T_ONO_ACT[intActivityIndex].XXSHP_KDS_T_ONO_BGT[intBudgetIndex].XXSHP_KDS_T_ONO_SUB[intSubUmbrandIndex].XXSHP_KDS_T_ONO_BRD.length; i++) {
            if (i === parseInt(intIndex)) {
                var fancyboxdata = p_GetHiddenObject();
                LOV = clsGlobal.generatePopUpIframe(
                    `${location.protocol}//${location.host}/Transaction/ONO/SKU?intActivityIndex=${intActivityIndex}&intBudgetIndex=${intBudgetIndex}&intSubUmbrandIndex=${intSubUmbrandIndex}&intBrandIndex=${intIndex}`,
                    "btnDetailSKU",
                    fancyboxdata
                );
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
    for (i = 0; i < objData.XXSHP_KDS_T_ONO_ACT[intActivityIndex].XXSHP_KDS_T_ONO_BGT[intBudgetIndex].XXSHP_KDS_T_ONO_SUB[intSubUmbrandIndex].XXSHP_KDS_T_ONO_BRD.length; i++) {
        // Cari Index-nya.
        if (objData.XXSHP_KDS_T_ONO_ACT[intActivityIndex].XXSHP_KDS_T_ONO_BGT[intBudgetIndex].XXSHP_KDS_T_ONO_SUB[intSubUmbrandIndex].XXSHP_KDS_T_ONO_BRD[i].intIndex == intIndex) {
            // Ketemu, mulai dari sini:
            // Remove from list.
            objData.XXSHP_KDS_T_ONO_ACT[intActivityIndex].XXSHP_KDS_T_ONO_BGT[intBudgetIndex].XXSHP_KDS_T_ONO_SUB[intSubUmbrandIndex].XXSHP_KDS_T_ONO_BRD.splice(i, 1);

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
    // Parse dari HiddenObject -> JSON
    var objData = JSON.parse(p_UIToData());

    var arrBrand = objData
        .XXSHP_KDS_T_ONO_ACT[intActivityIndex]
        .XXSHP_KDS_T_ONO_BGT[intBudgetIndex]
        .XXSHP_KDS_T_ONO_SUB[intSubUmbrandIndex]
        .XXSHP_KDS_T_ONO_BRD;

    if (arrBrand.length == 0) {
        throw "Brand tidak boleh kosong jika tidak memilih 'All Brand' di Subumbrand";
    }

    var brandCodes = arrBrand.map(x => ({
        name: clsGlobal.parseToString(x.TXT_BRAND).trim()
    }));

    // Find duplicates
    var duplicates = brandCodes.filter((brand, i, arr) =>
        brand.name &&
        arr.findIndex(x => x.name === brand.name) !== i
    );

    // Remove duplicate duplicate entries (unique list)
    duplicates = [...new Map(duplicates.map(x => [x.name, x])).values()];

    if (duplicates.length > 0) {
        var duplicateNames = duplicates.map(x => x.name).join(", ");
        throw `Brand tidak boleh duplikat: ${duplicateNames}`;
    }

    // check SKU duplicates
    for (var i = 0; i < arrBrand.length; i++) {

        var brand = arrBrand[i];

        // harus pilih minimal 1 SKU
        if (brand.BIT_ALL_SKU == "N") {

            var arrSKU = brand.XXSHP_KDS_T_ONO_SKU;

            if (!arrSKU || arrSKU.length === 0) {
                throw "Jika All SKU tidak di-checklist, harap pilih minimal satu SKU untuk brand: " + (brand.TXT_BRAND || "-");
            }

            // Cek duplikasi SKU
            var seen = {};
            var duplicates = [];

            for (var j = 0; j < arrSKU.length; j++) {
                var sku = (arrSKU[j].TXT_SKU || "").trim().toUpperCase();
                if (sku === "") continue;

                if (seen[sku]) {
                    duplicates.push(sku);
                } else {
                    seen[sku] = true;
                }
            }

            if (duplicates.length > 0) {
                throw "SKU tidak boleh duplikat di brand '" + (brand.TXT_BRAND || "-") + "': " + duplicates.join(", ");
            }
        }
    }

    return true;
}

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




