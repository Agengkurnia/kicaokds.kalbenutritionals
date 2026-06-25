//=======================
// VARIABLE GLOBAL
//=======================
var clsGlobal = new clsGlobalClass();
var LOV;
var bitLoading = false;
var oTableDetail; 

var TXT_TYPEDOC = "";
var INT_DOCID = 0;
var TXT_REF_DOCNO = ""; 

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
    TXT_TYPEDOC = $.getParameter("TXT_TYPEDOC");
    INT_DOCID = $.getParameter("INT_DOCID");
    TXT_REF_DOCNO = $.getParameter("TXT_REF_DOCNO");

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
        url: "/Master/ApprovalHistory/InitiateData",
        data: { TXT_TYPEDOC : TXT_TYPEDOC, TXT_REF_DOCNO: TXT_REF_DOCNO, INT_DOCID :INT_DOCID , __RequestVerificationToken: $('#frmApprovalHistory input[name=__RequestVerificationToken]').val() },
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

function p_DataToUIDetail(XXSHP_KDS_M_APPROVED) {
    
    oTableDetail.clear();
    for (var i = 0; i < XXSHP_KDS_M_APPROVED.length; i++) {
        XXSHP_KDS_M_APPROVED[i].intIndex = i;
        oTableDetail.row.add(XXSHP_KDS_M_APPROVED[i]);
    }
    oTableDetail.draw(false);

    var objDat = p_GetHiddenObject();
    objDat = XXSHP_KDS_M_APPROVED;
    p_SetHiddenObject(objDat);
}
 
function p_InitiateDetail() {
    // Format datatable  
    
    oTableDetail = $('#dtApprovalHistory').DataTable({
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
                    if(clsGlobal.ParseBooleanOracleToNET(full.BIT_APPROVED)){
                        return '<div id="lblNo"> ' + full.TXT_APPROVERNAME + ' </div>';
                    } if (clsGlobal.ParseBooleanOracleToNET(full.BIT_REJECTED)) {
                        return '<div id="lblNo"> ' + full.TXT_REJECTERNAME + ' </div>';
                    } else {
                        return '<div id="lblNo"> ' + full.TXT_NEXTAPPROVER + ' </div>';
                    }
                }
            },
           {
               aTargets: [2],
               mRender: function (data, type, full) {
                   if (clsGlobal.ParseBooleanOracleToNET(full.BIT_APPROVED)) {
                       return '<div id="lblNo"> ' + full.TXT_APPROVEDATE + ' </div>';
                   } if (clsGlobal.ParseBooleanOracleToNET(full.BIT_REJECTED)) {
                       return '<div id="lblNo"> ' + full.TXT_REJECTDATE + ' </div>';
                   } else {
                       return '<div id="lblNo">  </div>';
                   }
               }
           },
           {
               aTargets: [3],
               mRender: function (data, type, full) {
                   if (clsGlobal.ParseBooleanOracleToNET(full.BIT_APPROVED)) {
                       return '<div id="lblNo"> APPROVED </div>';
                   } if (clsGlobal.ParseBooleanOracleToNET(full.BIT_REJECTED)) {
                       return '<div id="lblNo"> REJECTED </div>';
                   } else {
                       return '<div id="lblNo">  </div>';
                   }
               }
           } 
        ]
    });

    $("#dtApprovalHistory").css("width", "100%"); 
    $('#dtApprovalHistory tbody').on('click', 'tr', function () {
        if (!$(this).hasClass('selected')) {
            oTableDetail.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
        }
    });
}
  
//=======================
// HANDLER
//=======================
 