//=======================
// VARIABLE GLOBAL
//=======================
var clsGlobal = new clsGlobalClass();
var LOV;
var bitLoading = false;
var SubBrandList = "";
var decAmount = "";
var Fnc = "";

//=======================
// Confirmation
//======================= 

//=======================
// ON PAGE LOAD
//=======================
$(document).ready(function () { 
    p_InitForm();
    p_validatePage();
    p_GenerateAutoNumeric();
});

//=======================
// FUNCTION
//=======================
function p_InitForm() {
    SubBrandList = $.getParameter("SubBrandList");
    decAmount = $.getParameter("decAmount");
    Fnc = $.getParameter("Fnc");
    $("#txtFunction").val(Fnc);
    $("#txtTotalAmount").val(decAmount);

    p_initiateData(); 
    p_PopulateSegment3();
    p_PopulateSegment5();
    p_PopulateSegment6();
    p_PopulateDetailTax();
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
        // TODO:
    }
    clsGlobal.closeLOV();
}
   
function p_DataToUI(objData) { 
    
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
    });

}

function p_GetHiddenObject() {
    return JSON.parse($("#txtHiddenObject").val());
}

function p_initiateData() {
    p_PopulateGLNatural();
    p_PopulateSegment3();
}

function p_PopulateGLNatural() {
    if ($("#ddlTipe").val() == "TAX") { 
        // TAX
        clsGlobal.showLoading();
        
        $.ajax({
            type: "POST",
            url: "/Master/COA/PopulateSegment2Tax",
            data: { __RequestVerificationToken: $('#frmCOA input[name=__RequestVerificationToken]').val() },
            datatype: "json",
            success: function (retDat) {
                if (retDat.bitSuccess == true) {
                    
                    if (retDat.objData != undefined) {
                        $('#ddlGLNatural').empty();
                        for (var i = 0; i < retDat.objData.length; i++) {
                            $('#ddlGLNatural').append($('<option>').text(retDat.objData[i].GLNATURAL + " - " + retDat.objData[i].DESCRIPTION).prop('value', retDat.objData[i].GLNATURAL));
                        }
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
    } else {
        // EXPENSE
        clsGlobal.showLoading();
        
        $.ajax({
            type: "POST",
            url: "/Master/COA/PopulateSegment2",
            data: { __RequestVerificationToken: $('#frmCOA input[name=__RequestVerificationToken]').val() },
            datatype: "json",
            success: function (retDat) {
                if (retDat.bitSuccess == true) {
                    
                    if (retDat.objData != undefined) {
                        $('#ddlGLNatural').empty();
                        for (var i = 0; i < retDat.objData.length; i++) {
                            $('#ddlGLNatural').append($('<option>').text(retDat.objData[i].SEGMENT2 + " - " + retDat.objData[i].DESCRIPTION).prop('value', retDat.objData[i].SEGMENT2));
                        }
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
    
}

function p_PopulateSegment3() {
    clsGlobal.showLoading();
    
    $.ajax({
        type: "POST",
        url: "/Master/COA/PopulateSegment3",
        data: { __RequestVerificationToken: $('#frmCOA input[name=__RequestVerificationToken]').val() },
        datatype: "json",
        success: function (retDat) {
            if (retDat.bitSuccess == true) {
                
                if (retDat.objData != undefined) {
                    $('#ddlSegment3').empty(); 
                    for (var i = 0; i < retDat.objData.length; i++) {
                        $('#ddlSegment3').append($('<option>').text(retDat.objData[i].KODE_EXPENSE + " - " + retDat.objData[i].DESCRIPTION).prop('value', retDat.objData[i].KODE_EXPENSE));
                    } 
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


function p_PopulateSegment5() {
    clsGlobal.showLoading();
    
    $.ajax({
        type: "POST",
        url: "/Master/COA/PopulateSegment5",
        data: { SubBrandList: SubBrandList , __RequestVerificationToken: $('#frmCOA input[name=__RequestVerificationToken]').val() },
        datatype: "json",
        success: function (retDat) {
            if (retDat.bitSuccess == true) {
                
                  if (retDat.objData != undefined) {
                    $('#ddlSegment5').empty(); 
                    for (var i = 0; i < retDat.objData.length; i++) {
                        $('#ddlSegment5').append($('<option>').text(retDat.objData[i].DEPARTMENT + " - " + retDat.objData[i].DESCRIPTION).prop('value', retDat.objData[i].DEPARTMENT));
                    } 
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

function p_PopulateSegment5Tax() {
    $('#ddlSegment5').empty();
    $('#ddlSegment5').append($('<option>').text("00000").prop('value', "00000"));
}



function p_PopulateSegment6() {
    clsGlobal.showLoading();
    
    $.ajax({
        type: "POST",
        url: "/Master/COA/PopulateSegment6",
        data: { __RequestVerificationToken: $('#frmCOA input[name=__RequestVerificationToken]').val() },
        datatype: "json",
        success: function (retDat) {
            if (retDat.bitSuccess == true) {
                
                if (retDat.objData != undefined) {
                    $('#ddlSegment6').empty(); 
                    for (var i = 0; i < retDat.objData.length; i++) {
                        $('#ddlSegment6').append($('<option>').text(retDat.objData[i].SEGMENT6 + " - " + retDat.objData[i].DESCRIPTION).prop('value', retDat.objData[i].SEGMENT6));
                    } 
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

function p_PopulateDetailTax() {
    clsGlobal.showLoading(); 
    $.ajax({
        type: "POST",
        url: "/Main/PopulateTipePPH",
        data: { __RequestVerificationToken: $('#frmRFA input[name=__RequestVerificationToken]').val() },
        datatype: "json",
        success: function (retDat) {
            if (retDat.bitSuccess == true) {
                
                if (retDat.objData != undefined) {
                    $('#ddlDetailTax').empty();
                    $('#ddlDetailTax').append($('<option>').text("-").prop('value', ""));
                    for (var i = 0; i < retDat.objData.length; i++) {
                        $('#ddlDetailTax').append($('<option>').text(retDat.objData[i].TAX_NAME).prop('value', retDat.objData[i].GROUP_ID + ";" + retDat.objData[i].TAX_NAME + ";" + retDat.objData[i].TAX_RATE));
                    }
                     
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
    
}

function p_Generate() {
    clsGlobal.showLoading();
    $.ajax({
        type: "POST",
        url: "/Master/COA/Generate",
        data: { segment1: $("#txtCompany").val(), 
            segment2: $("#ddlGLNatural").val(), 
            segment3: $("#ddlSegment3").val(),
            segment4: $("#txtSegment4").val(),
            segment5: $("#ddlSegment5").val(),
            segment6: $("#ddlSegment6").val(),
            segment7: $("#txtSegment7").val(),
            __RequestVerificationToken: $('#frmRFA input[name=__RequestVerificationToken]').val()
        },
        datatype: "json",
        success: function (retDat) {
            if (retDat.bitSuccess == true) {
                $("#txtCodeCombinationID").val(retDat.objData.CODE_COMBINATION_ID);
                $("#txtCodeCombination").val(retDat.objData.SEGMENT1 + "-" + retDat.objData.SEGMENT2 + "-" + retDat.objData.SEGMENT3 + "-" + retDat.objData.SEGMENT4 + "-" + retDat.objData.SEGMENT5 + "-" + retDat.objData.SEGMENT6 + "-" + retDat.objData.SEGMENT7);

                var txtReturnVal = "";
                if ($("#ddlTipe").val() == "TAX") {
                    txtReturnVal = $("#txtCodeCombinationID").val() + "|" + $("#txtCodeCombination").val() + "|" + clsGlobal.parseToDecimal($("#txtTaxGrossAmount").val());
                } else {
                    txtReturnVal = $("#txtCodeCombinationID").val() + "|" + $("#txtCodeCombination").val() + "|0";
                }
                
                window.parent.setChooseCOA($("#txtFunction").val() + "|" + txtReturnVal);
            } else {
                $("#txtCodeCombinationID").val(retDat.objData.CODE_COMBINATION_ID);
                $("#txtCodeCombination").val(retDat.objData.SEGMENT1 + "-" + retDat.objData.SEGMENT2 + "-" + retDat.objData.SEGMENT3 + "-" + retDat.objData.SEGMENT4 + "-" + retDat.objData.SEGMENT5 + "-" + retDat.objData.SEGMENT6 + "-" + retDat.objData.SEGMENT7);
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

$('#ddlTipe').bind('change', function () {
    try {
        if ($("#ddlTipe").val() == "TAX") {
            $("#divTAX").show();
            p_PopulateSegment5();
        } else {
            $("#divTAX").hide();
            p_PopulateSegment5();
        }
        p_PopulateGLNatural();
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
});

$('#ddlDetailTax').bind('change', function () {
    try {
        var resultPPHSplit = $("#ddlDetailTax").val().split(';');
        if (resultPPHSplit.length == 3) {
            var decRate = clsGlobal.parseToDecimal(resultPPHSplit[2]);
            var decInvoiceAmount = clsGlobal.parseToDecimal($("#txtTotalAmount").val());
            var decPPHAmount = decInvoiceAmount * decRate / 100;
            $("#txtTaxPercentage").val(clsGlobal.FormatMoney(decRate, 0));
            $("#txtGrossAmount").val(clsGlobal.FormatMoney(decInvoiceAmount, 0));
            $("#txtTaxGrossAmount").val(clsGlobal.FormatMoney(decPPHAmount, 0));
        }
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
});

$('#btnGenerate').bind('click', function () {
    try {
        p_Generate();
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
});

$('#btnOK').bind('click', function () {
    try {
        if ($("#txtCodeCombinationID").val() != "" || $("#txtCodeCombinationID").val() != "0") {
            var txtReturnVal = $("#txtCodeCombinationID").val() + "|" + $("#txtCodeCombination").val() + "|" + clsGlobal.parseToDecimal($("#txtTaxGrossAmount").val());
            window.parent.setChooseCOA($("#txtFunction").val() + "|" + txtReturnVal);
        } else {
            clsGlobal.getAlert("COA belum di generate!");
        } 
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
});

$('#btnCancel').bind('click', function () {
    try {
        window.parent.LOV.hide();
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
});