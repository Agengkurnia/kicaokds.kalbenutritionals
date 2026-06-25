//=======================
// VARIABLE GLOBAL
//=======================
var clsGlobal = new clsGlobalClass();
var LOV;
var bitLoading = false;
var oTableDetail;

var TXT_DOCNO = "";

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
    TXT_DOCNO = $.getParameter("TXT_DOCNO");

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
        //case "txtID": $("#txtID").val(arr[1]);
        //    p_txtID_TextChanged();
        //    break; 
    }
    clsGlobal.closeLOV();
}

function p_DataToUI(objData) {

    p_DataToUIDetail(objData);

    p_SetHiddenObject(objData);

    if ($("#txtID").val() == "" || $("#txtID").val() == "0") {
        $("#btnDelete").hide();
    } else {
        $("#btnDelete").show();
    }
}

function p_SetHiddenObject(objDat) {
    $("#txtHiddenObject").val(JSON.stringify(objDat));

    //AutoNumeric.
    p_GenerateAutoNumeric();
    p_GenerateDateTimePicker();
}

function p_GenerateAutoNumeric() {

    $('.autonumeric').autoNumeric('init', { vMax: '9999999999999', vMin: '-9999999999999', aSep: ',', dGroup: '3', aDec: '.' });
}

function p_GenerateDateTimePicker() {

    $('.kalendertarget').datepicker({
        autoclose: true,
        onSelect: function (dateText) {
            display("Selected date: " + dateText + "; input's current value: " + this.value);
        }
    });
}


function p_GetHiddenObject() {
    return JSON.parse($("#txtHiddenObject").val());
}

function p_initiateData() {
    clsGlobal.showLoading();
    $.ajax({
        type: "POST",
        url: "/Transaction/ONO/AddendumHistory",
        data: { txtDocNo: TXT_DOCNO, __RequestVerificationToken: $('#frmONO input[name=__RequestVerificationToken]').val() },
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
                $("#txtGUID").val(retDat.txtGUID);
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

    p_SetHiddenObject(jsonData);
    return $("#txtHiddenObject").val();

}


function p_EnableControl(bitApply) {


}

// ====================================================
//  DETAIL
// ====================================================

function p_DataToUIDetail(XXSHP_KDS_T_ONO_HDR) {
    oTableDetail.clear();
    for (var i = 0; i < XXSHP_KDS_T_ONO_HDR.length; i++) {
        XXSHP_KDS_T_ONO_HDR[i].intIndex = i;
        oTableDetail.row.add(XXSHP_KDS_T_ONO_HDR[i]);
    }
    oTableDetail.draw(false);

    var objDat = p_GetHiddenObject();
    objDat = XXSHP_KDS_T_ONO_HDR;
    p_SetHiddenObject(objDat);
}

function p_InitiateDetail() {
    // Format datatable  

    oTableDetail = $('#dtAddendumHistory').DataTable({
        "bPaginate": true,
        "bSort": false,
        searching: false,
        "iDisplayLength": 5,
        "type": "POST",
        aoColumnDefs: [
            {
                aTargets: [0],
                mRender: function (data, type, full) {
                    return '<div id="lblNo"> ' + (full.intIndex + 1) + ' </div>';
                }
            },
            {
                aTargets: [1],
                mRender: function (data, type, full) {
                    return '<div id="lblNo"> ' + full.TXT_DOCNO + ' </div>';
                }
            },
            {
                aTargets: [2],
                mRender: function (data, type, full) {
                    return '<div id="lblNo"> ' + clsGlobal.parseToDateTimeFromJSON2(full.DTM_APPROVED, clsDateFormat)  + ' </div>';
                }
            },
            {
                aTargets: [3],
                mRender: function (data, type, full) {
                    return '<div id="lblNo"> ' + full.TXT_STATUSFLOW + ' </div>';
                }
            },
            {
                aTargets: [4],
                mRender: function (data, type, full) {
                    return '<div id="lblNo" style="text-align:right;"> ' + clsGlobal.parseToRupiah(full.DEC_AMOUNT) + ' </div>';
                }
            }
        ]
    });

    $("#dtAddendumHistory").css("width", "100%");
    $('#dtAddendumHistory tbody').on('click', 'tr', function () {
        if (!$(this).hasClass('selected')) {
            oTableDetail.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
        }
    });
}

//=======================
// HANDLER
//=======================
