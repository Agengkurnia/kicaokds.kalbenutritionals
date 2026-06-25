//     KKP SCRIPT - Detail
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
var oTableDetail;
var txtMasaPajak = "";

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
    txtMasaPajak = $.getParameter("txtMasaPajak");
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
        case "txtDetail":  
            p_settxtDetail(arr[1],arr[2]);
            break;   
    }
    clsGlobal.closeLOV(); 
}

function p_DataToUI(objDat) {
    
    p_DataToUIDetail(objDat); 
    p_SetHiddenObject(objDat);
    if ($("#txtID").val() == "" || $("#txtID").val() == "0") {
        $("#btnDelete").hide();
    } else {
        $("#btnDelete").show();
    }
}

function p_EnableControl(bitApply, objDat) {
    
    
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
    $.ajax({
        type: "POST",
        url: "/Transaction/FPR/InitiateAdd",
        data: { txtMasaPajak : txtMasaPajak, __RequestVerificationToken: $('#frmIndex input[name=__RequestVerificationToken]').val() },
        datatype: "json",
        success: function (retDat) {

            if (retDat.bitSuccess == true) {
                if (retDat.objData != undefined) {
                    p_SetHiddenObject(retDat.objData);
                    p_DataToUI(retDat.objData);
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
// Detail  
// ==========================

function p_GetSelectedDetailRow() {
    var intIndex = clsGlobal.parseToInteger(oTableDetail.$('tr.selected').find("#lblDetailNoValue").html()) - 1;
    return intIndex;
}

function p_InitiateDetail() {
    // Format datatable  
    
    oTableDetail = $('#dtDetail').DataTable({
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
                      return '<div > <input type="checkbox" class="chkCheck" id="chkCheck" onclick="p_chkCheck_Click(this,' + full.intIndex + ')" />  </div>';
                  }
              },
           {
               aTargets: [1],
               mRender: function (data, type, full) {
                   return '<div id="lblDetail"> ' + clsGlobal.parseToString(full.TXT_GROUP_ACCOUNT) + ' </div>';
               }
           },
           {
               aTargets: [2],
               mRender: function (data, type, full) {
                   return '<div id="lblDetail"> ' + clsGlobal.parseToString(full.TXT_OUTLET) + ' </div>';
               }
           },
           {
               aTargets: [3],
               mRender: function (data, type, full) {
                   return '<div id="lblDetail"> ' + clsGlobal.parseToString(full.TXT_SUPPLIER_NAME) + ' </div>';
               }
           },
           {
               aTargets: [4],
               mRender: function (data, type, full) {
                   return '<div id="lblDetail"> ' + clsGlobal.parseToString(full.TXT_FKT_PJK_NO) + ' </div>';

               }
           },
           {
               aTargets: [5],
               mRender: function (data, type, full) {
                   return '<div id="lblDetail"> ' + clsGlobal.parseToDateTimeFromJSON(full.DTM_FKT_PJK, clsDateFormat) + ' </div>';

               }
           },
            {
                aTargets: [6],
                mRender: function (data, type, full) {
                    return '<div id="lblDetail" style="text-align:right;"> ' + clsGlobal.FormatMoney(full.DEC_INVOICE_AMT, 0) + ' </div>';
                }
            },
            {
                aTargets: [7],
                mRender: function (data, type, full) {
                    return '<div id="lblDetail" style="text-align:right;"> ' + clsGlobal.FormatMoney(full.DEC_PPN, 0) + ' </div>';
                }
            },
            {
                aTargets: [8],
                mRender: function (data, type, full) {
                    return '<div id="lblDetail"> ' + clsGlobal.parseToString(full.TXT_KLAIM_DOCNO) + ' </div>';
                }
            },
            {
                aTargets: [9],
                mRender: function (data, type, full) {
                    return '<div id="lblDetail"> ' + clsGlobal.parseToString(full.TXT_INVOICE_NO) + ' </div>';
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

function p_ShowBlankDetail() {
    oTableDetail.clear();
    oTableDetail.draw(false);
}
 
function p_DataToUIDetail(XXSHP_KDS_T_KLAIM_DTL) {
    
    oTableDetail.clear();
    for (var i = 0; i < XXSHP_KDS_T_KLAIM_DTL.length; i++) {
        XXSHP_KDS_T_KLAIM_DTL[i].intIndex = i;
        oTableDetail.row.add(XXSHP_KDS_T_KLAIM_DTL[i]);
    }
    oTableDetail.draw(false);

    var objDat = p_GetHiddenObject();
    objDat = XXSHP_KDS_T_KLAIM_DTL;
    p_SetHiddenObject(objDat);
}
   
 
function p_chkCheck_Click(objCaller, intIndex) {
    //
    // Parse dari HiddenObject->JSON
    var XXSHP_KDS_T_KLAIM_DTL = JSON.parse(p_UIToData());
    for (i = 0; i < XXSHP_KDS_T_KLAIM_DTL.length; i++) {
        // Cari Index-nya.
        if (XXSHP_KDS_T_KLAIM_DTL[i].intIndex == intIndex) {
            // Ketemu, mulai dari sini:
            // Remove from list.
            XXSHP_KDS_T_KLAIM_DTL[i].bitCheck = objCaller.checked; 
            break;
        }
    }
    p_SetHiddenObject(XXSHP_KDS_T_KLAIM_DTL);
}

// ==========================
// END: Detail   
// ==========================
 
    
//=======================
// HANDLER
//=======================

$('#btnAdd').bind('click', function () {
    try {
        
        var jsonObj = p_GetHiddenObject();
        var arrayObj = [];
        for (var i = 0; i < jsonObj.length; i++) {
            if (jsonObj[i].bitCheck == true) {
                arrayObj.push(jsonObj[i]);
            }
        }
         
        clsGlobal.showLoading();
        $.ajax({
            type: "POST",
            url: "/Transaction/FPR/AddSelectedDetail",
            data: { data : parent.$("#txtHiddenObject").val(), txtHiddenDetailObject : JSON.stringify(arrayObj),  txtMasaPajak: txtMasaPajak, __RequestVerificationToken: $('#frmIndex input[name=__RequestVerificationToken]').val() },
            datatype: "json",
            success: function (retDat) {
                
                if (retDat.bitSuccess == true) {
                    if (retDat.objData != undefined) {
                        parent.$("#txtHiddenObject").val(JSON.stringify(retDat.objData));
                        parent.clsGlobal.closePopUpIframe();
                        parent.p_DataToUIDetail(retDat.objData.XXSHP_KDS_T_FPR_DTL);
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
 
  


