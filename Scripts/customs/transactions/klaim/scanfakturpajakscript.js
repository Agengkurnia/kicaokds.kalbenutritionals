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
    intDetailIndex = $.getParameter("intIndex");
    $("#txtFakturPajakUrl").focus();
    $("#txtHiddenObject").val(parent.$("#txtHiddenObject").val()); 
});
 

function p_SetHiddenObject(objDat) {
    $("#txtHiddenObject").val(JSON.stringify(objDat));
    //
    //AutoNumeric.
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

function p_ScantxtFakturPajakUrl() {
    
    clsGlobal.showLoading();
    $.ajax({
        type: "POST",
        url: "/Transaksi/Klaim/ScanFakturPajakDetail",
        data: { intDetailIndex: intDetailIndex, data: $("#txtHiddenObject").val(), txtUrl: $("#txtFakturPajakUrl").val(), __RequestVerificationToken: $('#frmKlaim input[name=__RequestVerificationToken]').val() },
        datatype: "json",
        success: function (retDat) {
            
            if (retDat.bitSuccess == true) {
                if (retDat.objData != undefined) {
                    p_SetHiddenObject(retDat.objData);
                    parent.$("#txtHiddenObject").val($("#txtHiddenObject").val());
                    parent.setbtnScanFakturPajak();
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
  
// ==========================
// END: Umbrand   
// ==========================
 
    
//=======================
// HANDLER
//=======================
$('#txtFakturPajakUrl').on('keyup', function (e) {
    try {
        
        if (e.keyCode == 13) {
            p_ScantxtFakturPajakUrl();
        }
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
});

//$('#txtFakturPajakUrl').bind('keyup', function (e) {
//    try {
//        
//        if (e.keyCode == 13) {
//            p_ScantxtFakturPajakUrl();
//        }
//    } catch (ex) {
//        clsGlobal.showAlert(ex);
//    } 
//});

 
  


