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
        case "txtDocNo": $("#txtDocNo").val(arr[1]);
            p_txtDocNo_TextChanged();
            break; 
    }
    clsGlobal.closeLOV();
}

function p_DataToUI(objData) {
    p_DataToUIDetail(objData);

    p_SetHiddenObject(objData);
    p_CheckCanProcess(objData);

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
    
    $('.datetimepicker').datepicker({
        autoclose: true,
    });
   
}
function p_GetHiddenObject() {
    return JSON.parse($("#txtHiddenObject").val());
}

function p_initiateData() {
    clsGlobal.showLoading();
    $.ajax({
        type: "POST",
        url: "/Transaction/KPPCloseUploader/InitiateData",
        data: { __RequestVerificationToken: $('#frmIndex input[name=__RequestVerificationToken]').val() },
        datatype: "json",
        success: function (retDat) {
            
            if (retDat.bitSuccess == true) {
                if (retDat.objData != undefined) {
                    p_SetHiddenObject(retDat.objData);
                    p_DataToUI(retDat.objData);
                } else {
                    p_showBlank();
                }

                p_getParameterID();
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

function p_getParameterID() {
    var id = $.getParameter("ID");
    if (id != undefined) {
        //$("#txtDocNo").val(id);
        p_txtDocNo_TextChanged(id);
    }
}


function p_txtDocNo_TextChanged(ID) {
    clsGlobal.showLoading();
    $.ajax({
        type: "POST",
        url: "/Transaction/KPPCloseUploader/GetData", 
        data: { ID: ID, __RequestVerificationToken: $('#frmIndex input[name=__RequestVerificationToken]').val() },
        datatype: "json",
        success: function (retDat) {

            if (retDat.bitSuccess == true) {
                if (retDat.objData != undefined) { 
                    p_DataToUI(retDat.objData);
                    p_CheckCanProcess(retDat.objData);
                    oTableDetail.page('last').draw(false);
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


function p_EnableControl(bitApply, objDat) {
    
    if (bitApply == true) {
        
    } else {
        
    }
}
 
function p_processData() { 
    clsGlobal.showLoading();
    p_UIToData();
    $.ajax({
        type: "POST",
        url: "/Transaction/KPPCloseUploader/ProcessData",
        data: { data: $("#txtHiddenObject").val(), txtGUID: $("#txtGUID").val(), __RequestVerificationToken: $('#frmIndex input[name=__RequestVerificationToken]').val() },
        datatype: "json",
        success: function (retDat) {
            
            if (retDat.bitSuccess == true) {
                p_DataToUI(retDat.objData);
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
//  Detail
// ====================================================

function p_DataToUIDetail(XXSHP_KDS_T_KPC_UPL) {
    
    oTableDetail.clear();
    for (var i = 0; i < XXSHP_KDS_T_KPC_UPL.length; i++) {
        XXSHP_KDS_T_KPC_UPL[i].intIndex = i;
        oTableDetail.row.add(XXSHP_KDS_T_KPC_UPL[i]);
    }
    oTableDetail.draw(false);

    var objDat = p_GetHiddenObject();
    objDat = XXSHP_KDS_T_KPC_UPL;
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
        "scrollX": true,
        aoColumnDefs: [
            {
                aTargets: [0],
                mRender: function (data, type, full) {
                    return '<div id="lblDetailNoValue"> ' + (full.intIndex + 1) + ' </div>';
                }
            },
            {
                aTargets: [1],
                mRender: function (data, type, full) {
                    return '<div id="lblDetailDocNoValue"> ' +  clsGlobal.parseToString(full.TXT_DOCNO) + ' </div>';
                }
            }, 
            {
                aTargets: [2],
                mRender: function (data, type, full) {
                    return '<div id="lblDetailAmountValue"> ' + clsGlobal.parseToString(full.TXT_STATUS) + ' </div>';
                }
            },
            {
                aTargets: [3],
                mRender: function (data, type, full) {
                    return '<div id="lblDetailAmountValue"> ' + clsGlobal.parseToString(full.TXT_MESSAGE) + ' </div>';
                }
            },
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


function p_Upload() {
    clsGlobal.getConfirmation("Upload KPP?", function (result) {
        if (result == true) {
            var data = new FormData();
            var files = $("#fuFileUpload").get(0).files;
            if (files.length > 0) {
                data.append("fuFileUpload", files[0]);
                data.append("txtHiddenObject", $("#txtHiddenObject").val());
            }
            clsGlobal.showLoading();
            $.ajax({
                type: "POST",
                url: "/Transaction/KPPCloseUploader/Upload",
                processData: false,
                contentType: false,
                data: data,
                success: function (retDat) {
                    if (retDat.bitSuccess == true) {
                        if (retDat.objData != undefined) {
                            p_SetHiddenObject(retDat.objData);
                            p_DataToUI(retDat.objData);
                            p_CheckCanProcess(retDat.objData);
                            oTableDetail.page('last').draw(false); 
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
        else {
            return false;
        }
    });
}

function p_CheckCanProcess(XXSHP_KDS_T_KPC_UPL) {
    $("#btnProcess").hide();
    
    var bitFlag = true;
    if (XXSHP_KDS_T_KPC_UPL.length == 0) {
        bitFlag = false;
    }
    for (var i = 0; i < XXSHP_KDS_T_KPC_UPL.length; i++) {
        if (XXSHP_KDS_T_KPC_UPL[i].TXT_STATUS == "E" || XXSHP_KDS_T_KPC_UPL[i].TXT_STATUS == "S") {
            bitFlag = false;
        }       
    } 
    if (bitFlag == true) {
        $("#btnProcess").show();
    } 
}

function p_Download() {
    clsGlobal.getConfirmation("Download Template Upload KPP Close?", function (result) {
        if (result == true) {
            clsGlobal.showLoading();
            $.ajax({
                type: "POST",
                url: "/Transaction/KPPCloseUploader/Download",
                data: { data: $("#txtHiddenObject").val(), txtGUID: $("#txtGUID").val(), __RequestVerificationToken: $('#frmIndexUploader input[name=__RequestVerificationToken]').val() },
                datatype: "json",
                success: function (url) {
                    window.location = url;
                    clsGlobal.hideLoading();
                },
                error: function (url) {
                    clsGlobal.hideLoading();
                }
            });
        }
        else {
            return false;
        }
    });
}
  
function p_DownloadResult() {
    clsGlobal.getConfirmation("Download Result ?", function (result) {
        if (result == true) {
            clsGlobal.showLoading();
            $.ajax({
                type: "POST",
                url: "/Transaction/KPPCloseUploader/DownloadResult",
                data: { data: $("#txtHiddenObject").val(), txtGUID: $("#txtGUID").val(), __RequestVerificationToken: $('#frmIndexUploader input[name=__RequestVerificationToken]').val() },
                datatype: "json",
                success: function (url) {
                    window.location = url;
                    clsGlobal.hideLoading();
                },
                error: function (url) {
                    clsGlobal.hideLoading();
                }
            });
        }
        else {
            return false;
        }
    });
}
  
//=======================
// HANDLER
//=======================

$('#btnDownload').bind('click', function () {
    try{
        p_Download();
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
});

$('#btnDownloadResult').bind('click', function () {
    try{
        p_DownloadResult();
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
});

$('#btnUpload').bind('click', function () {
    try {
        p_Upload();
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
});

$('#btnProcess').bind('click', function () {
    try {
        clsGlobal.getConfirmation("Process this data?", function (result) {
            if (result == true) {
                p_processData();
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
 