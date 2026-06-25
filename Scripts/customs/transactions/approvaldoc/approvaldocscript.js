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
    p_InitiateDetail();
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
        case "txtDocNo": $("#txtDocNo").val(arr[1]);
            p_txtDocNo_TextChanged();
            break;

    }
    clsGlobal.closeLOV();
}

function p_DataToUI(objData) {
    $("#txtDocNo").val(objData.TXT_DOCNO);
    $("#dtmDate").val(clsGlobal.parseToDateTimeFromJSON(objData.CREATION_DATE, clsDateFormat));

    p_DataToUIDetail(objData.XXSHP_KDS_T_APP_DTL);

    if (objData.TXT_DOCNO == "") {
        p_EnableControl(false);
    } else {
        p_EnableControl(true);
    }

    p_SetHiddenObject(objData);

    if ($("#txtDocNo").val() == "" || $("#txtDocNo").val() == "0") {
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
    $('#chkApproveAll').prop('checked', false);
    $('#chkRejectAll').prop('checked', false);

        clsGlobal.showLoading();
        $.ajax({
            type: "POST",
            url: "/Transaction/ApprovalDoc/InitiateData",
            data: { __RequestVerificationToken: $('#frmApprovalDoc input[name=__RequestVerificationToken]').val() },
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

                    // show if Parameter exist.
                    
                    var p_ID = $.getParameter("ID"); 
                    if (p_ID != undefined) {
                        $("#txtDocNo").val(p_ID);
                        p_txtDocNo_TextChanged();
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
    jsonData.TXT_DOCNO = clsGlobal.parseToString($("#txtDocNo").val());

    p_SetHiddenObject(jsonData);
    return $("#txtHiddenObject").val();

}


function p_EnableControl(bitApply) {
    
    if (bitApply == true) { 
        $("#btnSave").hide();         
         
        $(".chkApproveAll").each(function (index) {
            $(this).attr("disabled", "true");
        });
        $(".chkRejectAll").each(function (index) {
            $(this).attr("disabled", "true");
        });
        $(".chkDetailApprove").each(function (index) {
            $(this).attr("disabled", "true");
        });
        $(".chkDetailReject").each(function (index) {
            $(this).attr("disabled", "true");
        });
        $(".txtDetailRejectReason").each(function (index) {
            $(this).attr("disabled", "true");
        });
    } else { 
        $("#btnSave").show();

        $(".chkApproveAll").each(function (index) {
            $(this).removeAttr("disabled");
        });
        $(".chkRejectAll").each(function (index) {
            $(this).removeAttr("disabled");
        });
        $(".chkDetailApprove").each(function (index) {
            $(this).removeAttr("disabled");
        });
        $(".chkDetailReject").each(function (index) {
            $(this).removeAttr("disabled");
        });
        $(".txtDetailRejectReason").each(function (index) {
            $(this).removeAttr("disabled");
        });
         
    }
}

function p_txtDocNo_TextChanged() {
    clsGlobal.showLoading();
    $.ajax({
        type: "POST",
        url: "/Transaction/ApprovalDoc/GetDataByTxtDocNo",
        data: { txtDocNo: $("#txtDocNo").val(), __RequestVerificationToken: $('#frmApprovalDoc input[name=__RequestVerificationToken]').val() },
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
            $("#txtGUID").val(retDat.txtGUID);
        },
        error: function (retDat) {
            clsGlobal.hideLoading();
        }
    });
}

function p_ValidateBeforeSubmit() {
    var hasSelection = false;

    $('#dtDetail tbody tr').each(function () {
        var isApprove = $(this).find('.chkDetailApprove').is(':checked');
        var isReject = $(this).find('.chkDetailReject').is(':checked');

        if (isApprove || isReject) {
            hasSelection = true;
            return false;
        }
    });

    if (!hasSelection) {
        clsGlobal.alert("Please select at least one document to approve or reject.");
        return false;
    }

    return true;
}

function p_saveData() {

    clsGlobal.showLoading();

    if (!p_ValidateBeforeSubmit()) {
        clsGlobal.hideLoading();
        
        return;
    }

    p_UIToData();
    $.ajax({
        type: "POST",
        url: "/Transaction/ApprovalDoc/SaveData",
        data: { data: $("#txtHiddenObject").val(), txtGUID: $("#txtGUID").val(), __RequestVerificationToken: $('#frmApprovalDoc input[name=__RequestVerificationToken]').val() },
        datatype: "json",
        success: function (retDat) {
            
            if (retDat.bitSuccess == true) {
                //p_DataToUI(retDat.objData);
                p_showBlank();
                clsGlobal.getInformationMessage(retDat.txtMessage);
            } else {
                clsGlobal.getAlert(retDat.txtMessage);
            }
            clsGlobal.hideLoading();
            $("#txtGUID").val(retDat.txtGUID);
        },
        error: function (retDat) {
            
            clsGlobal.hideLoading();
        }
    });
}

// ====================================================
//  DETAIL
// ====================================================

function p_DataToUIDetail(XXSHP_KDS_T_APP_DTL) {
    
    oTableDetail.clear();
    for (var i = 0; i < XXSHP_KDS_T_APP_DTL.length; i++) {
        XXSHP_KDS_T_APP_DTL[i].intIndex = i;
        oTableDetail.row.add(XXSHP_KDS_T_APP_DTL[i]);
    }
    oTableDetail.draw(false);

    var objDat = p_GetHiddenObject();
    objDat.XXSHP_KDS_T_APP_DTL = XXSHP_KDS_T_APP_DTL;
    p_SetHiddenObject(objDat);
}


function p_InitiateDetail() {
    // Format datatable  
    
    oTableDetail = $('#dtDetail').DataTable({
        "bPaginate": true,
        "bSort": false,
        searching: true,
        "aLengthMenu": [[5, 10, 25, 50, 75, 100], [5, 10, 25, 50, 75, 100]],
        "iDisplayLength": 5,
        "type": "POST",
        aoColumnDefs: [
            {
                aTargets: [0],
                mRender: function (data, type, full) {
                    return '<div id="lblDetailNoValue"> ' + (full.intIndex + 1) + ' </div>';
                }
            },
            {
                aTargets: [1],
                sWidth: "200px",
                mRender: function (data, type, full) {
                    return '<div id="lblDetailTypeDoc"> ' + full.TXT_TYPEDOC + ' </div>'
                    ;
                }
            },
           {
               aTargets: [2],
               sWidth: "200px",
               mRender: function (data, type, full) {
                   return '<div id="lblDetailDocNo"><a href="' + full.TXT_LINK + '" target="_blank"> ' + full.TXT_REFDOCNO + ' </a> </div>'
                    + '<div style="display:none;"> ' + full.TXT_REF_DOCNO + ' </div>';
               }
           },
           {
               aTargets: [3],
               sWidth: "200px",
               mRender: function (data, type, full) {
                   return '<div id="lblDetailRequestor"> ' + full.TXT_GROUP_ACCOUNT + ' </div>';
               }
           },
           {
               aTargets: [4],
               sWidth: "200px",
               mRender: function (data, type, full) {
                   return '<div id="lblDetailRequestor" class="text-right"> ' + clsGlobal.FormatMoney(full.DEC_TOTAL_AMOUNT,0) + ' </div>';
               }
           },
           {
               aTargets: [5],
               sWidth: "200px",
               mRender: function (data, type, full) {
                   return '<div id="lblDetailRequestor"> ' + full.TXT_REQUESTORNAME + ' </div>';
               }
           },
           {
               aTargets: [6],
               sWidth: "30px",
               mRender: function (data, type, full) {
                   
                   if (clsGlobal.ParseBooleanOracleToNET(full.BIT_APPROVED)) {
                       return '<div > <input type="checkbox" id="chkDetailApprove" class="chkDetailApprove" onchange="p_chkDetailApprove_Changed(this,' + full.intIndex + ')"  checked="' + clsGlobal.ParseBooleanOracleToNET(full.BIT_APPROVED) + '" >  </div>';
                   } else {
                       return '<div > <input type="checkbox" id="chkDetailApprove" class="chkDetailApprove" onchange="p_chkDetailApprove_Changed(this,' + full.intIndex + ')" >  </div>';
                   }
               }
           },
            {
                aTargets: [7],
                sWidth: "30px",
                mRender: function (data, type, full) {
                    if (clsGlobal.ParseBooleanOracleToNET(full.BIT_REJECTED)) {
                        return '<div > <input type="checkbox" id="chkDetailReject" class="chkDetailReject" onchange="p_chkDetailReject_Changed(this,' + full.intIndex + ')"  checked="' + clsGlobal.ParseBooleanOracleToNET(full.BIT_REJECTED) + '" >  </div>';
                    } else {
                        return '<div > <input type="checkbox" id="chkDetailReject" class="chkDetailReject" onchange="p_chkDetailReject_Changed(this,' + full.intIndex + ')" >  </div>';
                    }
                }
            },
            {
                aTargets: [8],
                sWidth: "200px",
                mRender: function (data, type, full) {
                    return '<div > <input type="textbox" id="txtDetailRejectReason" class="txtDetailRejectReason" onchange="p_txtDetailRejectReason_Changed(this,' + full.intIndex + ')" value="' + full.TXT_REJECTREASON + '" >  </div>';
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

function p_GetSelectedDetailRow() {
    var intIndex = clsGlobal.parseToInteger(oTableDetail.$('tr.selected').find("#lblDetailNoValue").html()) - 1;
    return intIndex;
}

function p_chkDetailApprove_Changed(objCaller, intIndex) {
    
    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());
    for (i = 0; i < objData.XXSHP_KDS_T_APP_DTL.length; i++) {
        // Cari Index-nya.
        if (objData.XXSHP_KDS_T_APP_DTL[i].intIndex == intIndex) {
            // Ketemu, mulai dari sini:
            objData.XXSHP_KDS_T_APP_DTL[i].BIT_APPROVED = clsGlobal.ParseBooleanNETToOracle(objCaller.checked);

            if (objCaller.checked) {
                objData.XXSHP_KDS_T_APP_DTL[i].BIT_REJECTED = "N";

                $(objCaller) // approved/reject checkbox exclusive validator
                    .closest('tr')
                    .find('.chkDetailReject')
                    .prop('checked', false);
            } 
            break;
        }
    } 

    p_SetHiddenObject(objData);
    p_RefreshRowDetail(intIndex);
}

function p_chkDetailReject_Changed(objCaller, intIndex) {
    
    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());
    for (i = 0; i < objData.XXSHP_KDS_T_APP_DTL.length; i++) {
        // Cari Index-nya.
        if (objData.XXSHP_KDS_T_APP_DTL[i].intIndex == intIndex) {
            // Ketemu, mulai dari sini:
            objData.XXSHP_KDS_T_APP_DTL[i].BIT_REJECTED = clsGlobal.ParseBooleanNETToOracle(objCaller.checked);

            if (objCaller.checked) {
                objData.XXSHP_KDS_T_APP_DTL[i].BIT_APPROVED = "N";

                $(objCaller) // approved/reject checkbox exclusive validator
                    .closest('tr')
                    .find('.chkDetailApprove')
                    .prop('checked', false);
            }
            break;
        }
    }

    p_SetHiddenObject(objData);
    p_RefreshRowDetail(intIndex);
}

function p_txtDetailRejectReason_Changed(objCaller, intIndex) {
    
    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());
    for (i = 0; i < objData.XXSHP_KDS_T_APP_DTL.length; i++) {
        // Cari Index-nya.
        if (objData.XXSHP_KDS_T_APP_DTL[i].intIndex == intIndex) {
            // Ketemu, mulai dari sini:
            objData.XXSHP_KDS_T_APP_DTL[i].TXT_REJECTREASON = objCaller.value;
            break;
        }
    }
    p_SetHiddenObject(objData);
}

function p_RefreshNumberDetail() {
    
    var intRowIndex = 0;
    var objDat = p_GetHiddenObject();
    oTableDetail.rows().every(function (rowIdx, tableLoop, rowLoop) {
        //
        //var d = this.data();
        //d.intIndex = intRowIndex; // update data source for the row
        //objDat.XXSHP_KCO_T_APP_DTL[intRowIndex].intIndex = d.intIndex;

        //d.TXT_TYPEDOC = objDat.XXSHP_KCO_T_APP_DTL[intRowIndex].TXT_TYPEDOC;
        //d.TXT_REFDOCNO = objDat.XXSHP_KCO_T_APP_DTL[intRowIndex].TXT_REFDOCNO;
        //d.BIT_APPROVED = objDat.XXSHP_KCO_T_APP_DTL[intRowIndex].BIT_APPROVED;
        //d.BIT_REJECTED = objDat.XXSHP_KCO_T_APP_DTL[intRowIndex].BIT_REJECTED;
        //d.TXT_REJECTREASON = objDat.XXSHP_KCO_T_APP_DTL[intRowIndex].TXT_REJECTREASON;

        //intRowIndex++;
        //this.invalidate(); // invalidate the data DataTables has cached for this row         
        p_RefreshRowDetail(intRowIndex);
    });

    // Draw once all updates are done
    oTableDetail.draw(false);
    p_SetHiddenObject(objDat);
}


function p_RefreshRowDetail(intIndex) {
    var intRowIndex = 0;
    var objDat = p_GetHiddenObject();
    oTableDetail.rows().every(function (rowIdx, tableLoop, rowLoop) {
        
        var d = this.data();
        d.intIndex = intRowIndex; // update data source for the row
        if (intRowIndex == intIndex) {
            objDat.XXSHP_KDS_T_APP_DTL[intRowIndex].intIndex = d.intIndex;

            d.TXT_TYPEDOC = objDat.XXSHP_KDS_T_APP_DTL[intRowIndex].TXT_TYPEDOC;
            d.TXT_REFDOCNO = objDat.XXSHP_KDS_T_APP_DTL[intRowIndex].TXT_REFDOCNO;
            d.BIT_APPROVED = objDat.XXSHP_KDS_T_APP_DTL[intRowIndex].BIT_APPROVED;
            d.BIT_REJECTED = objDat.XXSHP_KDS_T_APP_DTL[intRowIndex].BIT_REJECTED;
            d.TXT_REJECTREASON = objDat.XXSHP_KDS_T_APP_DTL[intRowIndex].TXT_REJECTREASON;

            intRowIndex++;
            this.invalidate(); // invalidate the data DataTables has cached for this row   
        }      
    });
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


$('#btnLOVDocNo').bind('click', function () {
    try {
        LOV = clsGlobal.generateLOV("APPROVAL DOC", "txtDocNo");
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
});


$('#chkApproveAll').bind('change', function () {
    try {
        
        var intRowIndex = 0;
        var objDat = JSON.parse(p_UIToData());
         
        if (this.checked) {
            $('#chkRejectAll').prop('checked', false);
        } 
        for (i = 0; i < objDat.XXSHP_KDS_T_APP_DTL.length; i++) {
            // Ketemu, mulai dari sini:
            objDat.XXSHP_KDS_T_APP_DTL[i].BIT_APPROVED = clsGlobal.ParseBooleanNETToOracle(this.checked);           
            if (this.checked) {
                objDat.XXSHP_KDS_T_APP_DTL[i].BIT_REJECTED = "N";
            }
        }
        oTableDetail.rows().every(function (rowIdx, tableLoop, rowLoop) {
            
            var d = this.data();
            d.intIndex = intRowIndex; // update data source for the row
            objDat.XXSHP_KDS_T_APP_DTL[intRowIndex].intIndex = d.intIndex;  
            d.TXT_TYPEDOC = objDat.XXSHP_KDS_T_APP_DTL[intRowIndex].TXT_TYPEDOC;
            d.TXT_REFDOCNO = objDat.XXSHP_KDS_T_APP_DTL[intRowIndex].TXT_REFDOCNO;
            d.BIT_APPROVED = objDat.XXSHP_KDS_T_APP_DTL[intRowIndex].BIT_APPROVED;
            d.BIT_REJECTED = objDat.XXSHP_KDS_T_APP_DTL[intRowIndex].BIT_REJECTED;
            d.TXT_REJECTREASON = objDat.XXSHP_KDS_T_APP_DTL[intRowIndex].TXT_REJECTREASON;
            intRowIndex++;
            this.invalidate(); // invalidate the data DataTables has cached for this row         
        });
        p_SetHiddenObject(objDat);
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
});

$('#chkRejectAll').bind('change', function () {
    try {
        
        var intRowIndex = 0;
        var objDat = JSON.parse(p_UIToData());
        if (this.checked) {
            $('#chkApproveAll').prop('checked', false);
        }
        for (i = 0; i < objDat.XXSHP_KDS_T_APP_DTL.length; i++) {
            // Ketemu, mulai dari sini:
            objDat.XXSHP_KDS_T_APP_DTL[i].BIT_REJECTED = clsGlobal.ParseBooleanNETToOracle(this.checked);
            if (this.checked) {
                objDat.XXSHP_KDS_T_APP_DTL[i].BIT_APPROVED = "N";
            }
        }
        oTableDetail.rows().every(function (rowIdx, tableLoop, rowLoop) {
            
            var d = this.data();
            d.intIndex = intRowIndex; // update data source for the row
            objDat.XXSHP_KDS_T_APP_DTL[intRowIndex].intIndex = d.intIndex; d.TXT_TYPEDOC = objDat.XXSHP_KDS_T_APP_DTL[intRowIndex].TXT_TYPEDOC;
            d.TXT_REFDOCNO = objDat.XXSHP_KDS_T_APP_DTL[intRowIndex].TXT_REFDOCNO;
            d.BIT_APPROVED = objDat.XXSHP_KDS_T_APP_DTL[intRowIndex].BIT_APPROVED;
            d.BIT_REJECTED = objDat.XXSHP_KDS_T_APP_DTL[intRowIndex].BIT_REJECTED;
            d.TXT_REJECTREASON = objDat.XXSHP_KDS_T_APP_DTL[intRowIndex].TXT_REJECTREASON;
            intRowIndex++;
            this.invalidate(); // invalidate the data DataTables has cached for this row         
        });
        p_SetHiddenObject(objDat);
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
});