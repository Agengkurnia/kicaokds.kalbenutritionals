//=======================
// VARIABLE GLOBAL
//=======================
var clsGlobal = new clsGlobalClass();
var LOV;
var bitLoading = false; 
var oTableActivity;
var oTableMatch;


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
    p_InitiateActivity();
    p_InitiateMatch();
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
        case "txtGroupAccount":
            $("#txtGroupAccount").val(arr[1]);
            break;
        case "txtOutlet":
            $("#txtOutlet").val(arr[1]);
            $("#txtSupplierID").val(arr[2]);
            $("#txtSupplierName").val(arr[3]);
            p_txtOutlet_TextChanged();
            break;  
        case "txtActivityCode":
            p_settxtActivityCode(arr[1]);
            break;   
        case "txtRefDocNo":
            p_settxtRefDocNo(arr[1], arr[5], arr[7], arr[8], arr[9], arr[10],arr[4]);
            break;  
        case "txtActivityDocOraType":
            p_settxtActivityDocOraType(arr[1]);
            break; 
        case "KPPMatch":
            p_setKPPMatch(arr[1]);
            break; 
        case "txtSupplierSiteID":
            $("#txtSupplierSiteID").val(arr[1]);
            p_txtSupplierSiteID_TextChanged();
            break; 
    }
    clsGlobal.closeLOV();
}

function p_DataToUI(objData) {
    $("#txtDocNo").val(clsGlobal.parseToString(objData.TXT_DOCNO));
    $("#dtmDate").val(clsGlobal.parseToDateTimeFromJSON(objData.CREATION_DATE, clsDateFormat));
    
    $("#txtGroupAccount").val(clsGlobal.parseToString(objData.TXT_GROUP_ACCOUNT));
    $("#txtOutlet").val(clsGlobal.parseToString(objData.TXT_OULET));

    $("#txtSupplierID").val(clsGlobal.parseToString(objData.TXT_SUPPLIER_ID));
    $("#txtSupplierName").val(clsGlobal.parseToString(objData.TXT_SUPPLIER_NAME));
    $("#txtSupplierSiteID").val(clsGlobal.parseToString(objData.TXT_SUPPLIER_SITE_CODE));
    $("#txtSupplierSiteName").val(clsGlobal.parseToString(objData.TXT_SUPPLIER_SITE_NAME));

    $("#lblStatusFlow").html(clsGlobal.parseToString(objData.TXT_STATUSFLOW));

    p_DataToUIActivity(objData.XXSHP_KDS_T_CMA_DTL);
    p_DataToUIMatch(objData.XXSHP_KDS_T_CMA_MAT);

    p_EnableControl(clsGlobal.ParseBooleanOracleToNET(objData.BIT_APPLY));
    p_ShowCancelButton(objData);
    p_SetHiddenObject(objData);
    p_CalculateTotalKlaim();
    p_CalculateTotalMatching();

    if ($("#txtID").val() == "" || $("#txtID").val() == "0") {
        $("#btnDelete").hide();
    } else {
        $("#btnDelete").show();
    }

    if ($("#txtDocNo").val() == "" || $("#txtDocNo").val() == "0") {
        $("#txtOutlet").parent('.input-group').css('margin-left', '0px');
    } else {
        $("#txtOutlet").parent('.input-group').css('margin-left', '-6px');
    }
}

function p_ShowCancelButton(objData) {
    $("#btnCancel").hide();
    if(clsGlobal.ParseBooleanOracleToNET(objData.BIT_APPROVED) == true && 
       clsGlobal.ParseBooleanOracleToNET(objData.BIT_CANCELLED) == false) {
        $("#btnCancel").show();
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
    $('.autonumeric2').autoNumeric('init', { vMax: '9999999999999.99', vMin: '-9999999999999.99', aSep: ',', dGroup: '3', aDec: '.' });
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
        url: "/Transaction/CMA/InitiateData",
        data: { __RequestVerificationToken: $('#frmCMA input[name=__RequestVerificationToken]').val() },
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
        $("#txtDocNo").val(id);
        p_txtDocNo_TextChanged();
    }
}

function p_UIToData() {
    var jsonObj = [];
    jsonData = p_GetHiddenObject();

    jsonData.TXT_DOCNO = clsGlobal.parseToString($("#txtDocNo").val());
    jsonData.CREATION_DATE = clsGlobal.parseToString($("#dtmDate").val());
    jsonData.TXT_GROUP_ACCOUNT = clsGlobal.parseToString($("#txtGroupAccount").val());
    jsonData.TXT_OULET = clsGlobal.parseToString($("#txtOutlet").val());

    jsonData.TXT_SUPPLIER_ID = clsGlobal.parseToInteger($("#txtSupplierID").val());    
    jsonData.TXT_SUPPLIER_NAME = clsGlobal.parseToString($("#txtSupplierName").val());
    jsonData.TXT_SUPPLIER_SITE_CODE = clsGlobal.parseToString($("#txtSupplierSiteID").val());
    jsonData.TXT_SUPPLIER_SITE_NAME = clsGlobal.parseToString($("#txtSupplierSiteName").val());
      
    p_SetHiddenObject(jsonData);
    return $("#txtHiddenObject").val();

}


function p_EnableControl(bitApply) {
    
    if (bitApply == true) {
        $("#btnSave").hide();
        $("#btnSubmit").hide();
        $("#btnApprovalHistory").show();

        $("#btnLOVGroupAccount").hide();
        $("#btnLOVOutlet").hide(); 
        
        $(".chkActivityPending").each(function (index) {
            $(this).attr("disabled", "true");
        });
        $(".chkSelected").each(function (index) {
            $(this).attr("disabled", "true");
        });
        $(".txtActivityRemark").each(function (index) {
            $(this).attr("disabled", "true");
        }); 
        $(".btnLOVActivityDocOraType").each(function (index) {
            $(this).hide();
        });

        $("#btnAddMatch").hide(); 
        $(".btnLOVRefDocNo").each(function (index) {
            $(this).hide();
        });
        $(".txtMatchAmount").each(function (index) {
            $(this).attr("disabled", "true");
        });
        $(".btnMatchDelete").each(function (index) {
            $(this).hide();
        });
    } else {
        $("#btnSave").show();
        $("#btnSubmit").show();
        $("#btnApprovalHistory").hide();

        $("#btnLOVGroupAccount").show();
        $("#btnLOVOutlet").show();
             
        $(".chkActivityPending").each(function (index) {
            $(this).removeAttr("disabled");
        }); 
        $(".chkSelected").each(function (index) {
            $(this).removeAttr("disabled");
        });
        $(".txtActivityRemark").each(function (index) {
            $(this).removeAttr("disabled");
        });
        $(".btnLOVActivityDocOraType").each(function (index) {
            $(this).show();
        });

        $("#btnAddMatch").show(); 
        $(".btnLOVRefDocNo").each(function (index) {
            $(this).show();
        });
        $(".txtMatchAmount").each(function (index) {
            $(this).removeAttr("disabled");
        });
        $(".btnMatchDelete").each(function (index) {
            $(this).show();
        });
    }
}

function p_txtDocNo_TextChanged() {
    clsGlobal.showLoading();
    $.ajax({
        type: "POST",
        url: "/Transaction/CMA/GetDataByTxtDocNo",
        data: { txtDocNo: $("#txtDocNo").val(), __RequestVerificationToken: $('#frmCMA input[name=__RequestVerificationToken]').val() },
        datatype: "json",
        success: function (retDat) {

            if (retDat.bitSuccess == true) {
                if (retDat.objData != undefined) {
                    p_DataToUI(retDat.objData);

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
 
function p_saveData() {

    clsGlobal.showLoading();
    p_UIToData();
    $.ajax({
        type: "POST",
        url: "/Transaction/CMA/SaveData",
        data: { data: $("#txtHiddenObject").val(), txtGUID: $("#txtGUID").val(), __RequestVerificationToken: $('#frmCMA input[name=__RequestVerificationToken]').val() },
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

function p_submitData() {

    clsGlobal.showLoading();
    p_UIToData();
    $.ajax({
        type: "POST",
        url: "/Transaction/CMA/SubmitData",
        data: { data: $("#txtHiddenObject").val(), txtGUID: $("#txtGUID").val(), __RequestVerificationToken: $('#frmCMA input[name=__RequestVerificationToken]').val() },
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
  
function p_txtOutlet_TextChanged() {
    
    p_UIToData();
    clsGlobal.showLoading(); 
    $.ajax({
        type: "POST",
        url: "/Transaction/CMA/GetByOutlet",
        data: { data: $("#txtHiddenObject").val(), txtOutletName: $("#txtOutlet").val(), txtGUID: $("#txtGUID").val(), __RequestVerificationToken: $('#frmCMA input[name=__RequestVerificationToken]').val() },
        datatype: "json",
        success: function (retDat) {
            
            if (retDat.bitSuccess == true) {
                //$("#txtSupplierSiteID").val(retDat.objData.VENDOR_SITE_ID);
                //$("#txtSupplierSiteName").val(retDat.objData.VENDOR_SITE_CODE); 
                if (retDat.objData != undefined) {
                    p_DataToUI(retDat.objData);
                }
            }
            clsGlobal.hideLoading();
            $("#txtGUID").val(retDat.txtGUID);
        },
        error: function (retDat) {
            
            clsGlobal.hideLoading();
        }
    });
}


function p_cancelDocument() {

    clsGlobal.showLoading();
    p_UIToData();
    $.ajax({
        type: "POST",
        url: "/Transaction/CMA/CancelDocument",
        data: { data: $("#txtHiddenObject").val(), txtGUID: $("#txtGUID").val(), __RequestVerificationToken: $('#frmCMA input[name=__RequestVerificationToken]').val() },
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
//  ACTIVITY
// ====================================================

function p_DataToUIActivity(XXSHP_KDS_T_CMA_DTL) {
    
    oTableActivity.clear();
    for (var i = 0; i < XXSHP_KDS_T_CMA_DTL.length; i++) {
        XXSHP_KDS_T_CMA_DTL[i].intIndex = i;
        oTableActivity.row.add(XXSHP_KDS_T_CMA_DTL[i]);
    }
    oTableActivity.draw(false);

    var objDat = p_GetHiddenObject();
    objDat.XXSHP_KDS_T_CMA_DTL = XXSHP_KDS_T_CMA_DTL;
    p_SetHiddenObject(objDat);
}


$('#btnAddActivity').on('click', function () {
    try{
        p_AddRowActivity();
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
});

function p_AddRowActivity() {
    
    p_UIToData();
    var objData = p_GetHiddenObject();
    if (objData.TXT_OULET == "") {
        throw "Kolom Outlet harus di isi!";
    }
    if (objData.TXT_GROUP_ACCOUNT == "") {
        throw "Kolom Group Account harus di isi!";
    } 

    clsGlobal.showLoading(); 
    $.ajax({
        type: "POST",
        url: "/Transaction/CMA/AddRowActivity",
        data: { data: $("#txtHiddenObject").val(), __RequestVerificationToken: $('#frmCMA input[name=__RequestVerificationToken]').val() },
        datatype: "json",
        success: function (retDat) {

            if (retDat.bitSuccess == true) {
                if (retDat.objData != undefined) {
                    p_SetHiddenObject(retDat.objData);
                    p_DataToUIActivity(retDat.objData.XXSHP_KDS_T_CMA_DTL);
                    oTableActivity.page('last').draw(false);
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

function p_InitiateActivity() {
    // Format datatable  
    
    oTableActivity = $('#dtActivity').DataTable({
        "bPaginate": true,
        "bSort": false,
        searching: true,
        "iDisplayLength": 5,
        "type": "POST",
        "scrollX": true,
        aoColumnDefs: [
             {
                 aTargets: [0],
                 mRender: function (data, type, full) { 
                     if (full.bitSelected == true) {
                         return '<div > <input type="checkbox" id="chkSelected" class="chkSelected" onchange="p_chkSelected_Changed(this,' + full.intIndex + ')"  checked>  </div>';
                     } else {
                         return '<div > <input type="checkbox" id="chkSelected" class="chkSelected" onchange="p_chkSelected_Changed(this,' + full.intIndex + ')" >  </div>';
                     }
                 }
             },
             {
                aTargets: [1],
                mRender: function (data, type, full) {
                    return '<div id="lblActivityNoValue"> ' + (full.intIndex + 1) + ' </div>';
                }
            }, 
           {
               aTargets: [2],
               mRender: function (data, type, full) {
                   //return '     <div class="input-group"> ' +
                   //         '       <div class="input-group-btn"> ' +
                   //         '           <button type="button" class="btn btn-danger btnLOVActivityCode" id="btnLOVActivityCode" onclick="p_btnLOVActivityCode_Click(this,' + full.intIndex + ')"> <i class="fa fa-search"></i></button> ' +
                   //         '       </div> ' +
                   //         '       <div class="input-group-btn" style="width:60px;"> ' +
                   //         '       <input type="text" class="form-control txtActivityCode" id="txtActivityCode" onchange="p_txtActivityCode_Changed(this,' + full.intIndex + ')"  value="' + full.TXT_ACTIVITYCODE + '" disabled> ' +
                   //         '       </div> ' + 
                   //         '   </div>';
                   return '<div id="abc"> ' + full.TXT_ACTIVITYCODE + ' </div>';
               }
           },
           {
               aTargets: [3],
               mRender: function (data, type, full) {
                   //return '<div >  <input type="text" class="form-control txtActivityProgramDesc text-uppercase" id="txtActivityProgramDesc' + full.intIndex + '" onchange="p_txtActivityProgramDesc_Changed(this,' + full.intIndex + ')"  value="' + full.TXT_PROGRAMDESC + '" >  </div>';
                   return '<div id="abc"> ' + full.TXT_PROGRAMDESC + ' </div>';
               }
           },
           {
               aTargets: [4],
               mRender: function (data, type, full) {
                   //return '<div >  <input type="text" class="form-control dtActivityPeriodFrom datetimepicker"  style="width:100px;"  id="dtActivityPeriodFrom' + full.intIndex + '" onchange="p_dtActivityPeriodFrom_Changed(this,' + full.intIndex + ')"  value="' + clsGlobal.parseToDateTimeFromJSON(full.DTM_PERIOD_FROM, clsDateFormat) + '" >  </div>';
                   return '<div id="abc"> ' + clsGlobal.parseToDateTimeFromJSON(full.DTM_PERIOD_FROM, clsDateFormat) + ' </div>';
               }
           },
           {
               aTargets: [5],
               mRender: function (data, type, full) {
                   //return '<div >  <input type="text" class="form-control dtActivityPeriodTo datetimepicker" style="width:100px;" id="dtActivityPeriodTo' + full.intIndex + '" onchange="p_dtActivityPeriodTo_Changed(this,' + full.intIndex + ')"  value="' + clsGlobal.parseToDateTimeFromJSON(full.DTM_PERIOD_TO, clsDateFormat) + '" >  </div>';
                   return '<div id="abc" style="text-align: right;"> ' + clsGlobal.parseToDateTimeFromJSON(full.DTM_PERIOD_TO, clsDateFormat) + ' </div>';
               }
           },
           {
               aTargets: [6],
               mRender: function (data, type, full) {
                   //return '<div >  <input type="text" class="form-control txtActivityInvoiceNo"  id="txtActivityInvoiceNo' + full.intIndex + '" onchange="p_txtActivityInvoiceNo_Changed(this,' + full.intIndex + ')"  value="' + clsGlobal.parseToString(full.TXT_INVOICE_NO) + '" >  </div>';
                   return '<div id="abc"> ' + full.TXT_INVOICE_NO + ' </div>';
               }
           },
           {
               aTargets: [7],
               mRender: function (data, type, full) {
                   //return '<div >  <input type="text" class="form-control txtActivityDPP autonumeric text-right" id="txtActivityDPP' + full.intIndex + '" onchange="p_txtActivityDPP_Changed(this,' + full.intIndex + ')"  value="' + full.DEC_DPP + '" >  </div>';
                   return '<div id="abc" style="text-align: right;"> ' + clsGlobal.FormatMoney(full.DEC_DPP, 0) + ' </div>';
               }
           },
           {
               aTargets: [8],
               mRender: function (data, type, full) {
                   //return '<div >  <input type="text" class="form-control txtActivityPPN autonumeric text-right" id="txtActivityPPN' + full.intIndex + '" onchange="p_txtActivityPPN_Changed(this,' + full.intIndex + ')"  value="' + full.DEC_PPN + '" >  </div>';
                   return '<div id="abc" style="text-align: right;"> ' + clsGlobal.FormatMoney(full.DEC_PPN, 0) + ' </div>';
               }
           },
           {
               aTargets: [9],
               mRender: function (data, type, full) {
                   //return '<div id="lblActivityAmount" class="text-right" style="width:100px;"> ' + clsGlobal.FormatMoney(full.DEC_SUBTOTAL, 0) + ' </div>';
                   return '<div id="abc" style="text-align: right;"> ' + clsGlobal.FormatMoney(full.DEC_SUBTOTAL, 0) + ' </div>';
               }
           },
           {
               aTargets: [10],
               mRender: function (data, type, full) {
                   
                   if (clsGlobal.ParseBooleanOracleToNET(full.BIT_PENDING)) {
                       return '<div > <input type="checkbox" id="chkActivityPending" class="chkActivityPending" onchange="p_chkActivityPending_Changed(this,' + full.intIndex + ')"  checked="' + clsGlobal.ParseBooleanOracleToNET(full.BIT_PENDING) + '" >  </div>';
                   } else {
                       return '<div > <input type="checkbox" id="chkActivityPending" class="chkActivityPending" onchange="p_chkActivityPending_Changed(this,' + full.intIndex + ')" >  </div>';
                   }

               }
           },
           {
               aTargets: [11],
               width:"200px",
               mRender: function (data, type, full) {
                   return '<div >  <input type="text" class="form-control txtActivityRemark" style="width:200px;" id="txtActivityRemark' + full.intIndex + '" onchange="p_txtActivityRemark_Changed(this,' + full.intIndex + ')"  value="' + full.TXT_REMARK + '" >  </div>';
               }
           },
           {
               aTargets: [12],
               mRender: function (data, type, full) {
                   return '     <div class="input-group"> ' +
                            '       <div class="input-group-btn"> ' +
                            '           <button type="button" class="btn btn-danger btnLOVActivityDocOraType" id="btnLOVActivityDocOraType" onclick="p_btnLOVActivityDocOraType_Click(this,' + full.intIndex + ')"> <i class="fa fa-search"></i></button> ' +
                            '       </div> ' +
                            '       <div class="input-group-btn" style="width:60px;"> ' +
                            '       <input type="text" style="width:50px;" class="form-control txtActivityDocOraType" id="txtActivityDocOraType" onchange="p_txtActivityDocOraType_Changed(this,' + full.intIndex + ')"  value="' + full.TXT_REFDOCTYPE + '" disabled> ' +
                            '       </div> ' +
                            '   </div>';
               }
           } 
           //,
            //{
            //    aTargets: [12],
            //    mRender: function (data, type, full) {
            //        return '<div > <input type="button" class="btn btn-warning" id="btnActivityDelete" class="btnActivityDelete" onclick="p_btnActivityDelete_Click(this,' + full.intIndex + ')"  value="Delete" >  </div>';
            //    }
            //}
           ]
    });

    $("#dtActivity").css("width", "100%"); 
    $('#dtActivity tbody').on('click', 'tr', function () {
        if (!$(this).hasClass('selected')) {
            oTableActivity.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
        }
    });
}

function p_GetSelectedActivityRow() {
    var intIndex = clsGlobal.parseToInteger(oTableActivity.$('tr.selected').find("#lblActivityNoValue").html()) - 1;
    return intIndex;
}
 
function p_btnLOVActivityCode_Click(objCaller, intIndex) {
    LOV = clsGlobal.generateLOV(MODULE_ACTIVITY, "txtActivityCode");
}

function p_settxtActivityCode(txtValue) {
    
    var intSelectedIndex = p_GetSelectedActivityRow();
    var intRowIndex = 0;
    var objDat = p_GetHiddenObject();
    oTableActivity.rows().every(function (rowIdx, tableLoop, rowLoop) {
        
        var d = this.data();
        if (intRowIndex == intSelectedIndex) {
            d.intIndex = intRowIndex; // update data source for the row 
              
            d.TXT_ACTIVITYCODE = txtValue;
            d.TXT_ACTIVITYNAME = txtValue;
            objDat.XXSHP_KDS_T_CMA_DTL[intRowIndex].TXT_ACTIVITYCODE = txtValue;            
            objDat.XXSHP_KDS_T_CMA_DTL[intRowIndex].TXT_ACTIVITYNAME = txtValue;

            //d.TXT_PROGRAMDESC = objDat.XXSHP_KCO_T_CMA_DTL[intRowIndex].TXT_PROGRAMDESC;
            //d.DTM_PERIOD_FROM = objDat.XXSHP_KCO_T_CMA_DTL[intRowIndex].DTM_PERIOD_FROM;
            //d.DTM_PERIOD_TO = objDat.XXSHP_KCO_T_CMA_DTL[intRowIndex].DTM_PERIOD_TO;
            
            //d.TXT_INVOICE_NO = objDat.XXSHP_KCO_T_CMA_DTL[intRowIndex].TXT_INVOICE_NO;
            //d.DEC_DPP = objDat.XXSHP_KCO_T_CMA_DTL[intRowIndex].DEC_DPP;
            //d.DEC_PPN = objDat.XXSHP_KCO_T_CMA_DTL[intRowIndex].DEC_PPN;
            //d.DEC_SUBTOTAL = objDat.XXSHP_KCO_T_CMA_DTL[intRowIndex].DEC_SUBTOTAL;
            //d.BIT_PENDING = objDat.XXSHP_KCO_T_CMA_DTL[intRowIndex].BIT_PENDING;
            //d.TXT_REMARK = objDat.XXSHP_KCO_T_CMA_DTL[intRowIndex].TXT_REMARK;
            //d.TXT_REFDOCNO = objDat.XXSHP_KCO_T_CMA_DTL[intRowIndex].TXT_REFDOCNO;
            //d.TXT_REFDOCTYPE = objDat.XXSHP_KCO_T_CMA_DTL[intRowIndex].TXT_REFDOCTYPE;
 
            this.invalidate(); // invalidate the data DataTables has cached for this row         
            p_EnableControl(clsGlobal.ParseBooleanOracleToNET(objDat.BIT_APPLY));
        }

        intRowIndex++;
    });
    p_SetHiddenObject(objDat);
    p_RefreshDataRow();
}
 
//function p_btnLOVActivityDocOraType_Click(objCaller, intIndex) {
//    LOV = clsGlobal.generateLOV(LOV_PARAMETER_ORADOCTYPE, "txtActivityDocOraType");
//}

//function p_settxtActivityDocOraType(txtValue) {
//    
//    var intSelectedIndex = p_GetSelectedActivityRow();
//    var intRowIndex = 0;
//    var objDat = p_GetHiddenObject();
//    oTableActivity.rows().every(function (rowIdx, tableLoop, rowLoop) {
//        
//        var d = this.data();
//        if (intRowIndex == intSelectedIndex) {
//            d.intIndex = intRowIndex; // update data source for the row 
              
//            d.TXT_REFDOCTYPE = txtValue; 
//            objDat.XXSHP_KCO_T_CMA_DTL[intRowIndex].TXT_REFDOCTYPE = txtValue; 
             
//            this.invalidate(); // invalidate the data DataTables has cached for this row         
//            p_EnableControl(clsGlobal.ParseBooleanOracleToNET(objDat.BIT_APPLY));
//        }

//        intRowIndex++;
//    });
//    p_SetHiddenObject(objDat);
//    p_RefreshDataRow();
//}
 
function p_chkSelected_Changed(objCaller, intIndex) {
    
    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());
    for (i = 0; i < objData.XXSHP_KDS_T_CMA_DTL.length; i++) {
        // Cari Index-nya.
        if (objData.XXSHP_KDS_T_CMA_DTL[i].intIndex == intIndex) {
            // Ketemu, mulai dari sini:
            objData.XXSHP_KDS_T_CMA_DTL[i].bitSelected = objCaller.checked;
            //break;
        } else {
            // yg lainnya di deselected.
            if (objCaller.checked == true) {
                objData.XXSHP_KDS_T_CMA_DTL[i].bitSelected = false;
            }
        }
    }

    p_SetHiddenObject(objData);
    p_RefreshNumberActivity();
    p_CalculateTotalKlaim()
}

function p_txtActivityProgramDesc_Changed(objCaller, intIndex) {
    
    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());
    for (i = 0; i < objData.XXSHP_KDS_T_CMA_DTL.length; i++) {
        // Cari Index-nya.
        if (objData.XXSHP_KDS_T_CMA_DTL[i].intIndex == intIndex) {
            // Ketemu, mulai dari sini:
            objData.XXSHP_KDS_T_CMA_DTL[i].TXT_PROGRAMDESC = objCaller.value;
            break;
        }
    }
    p_SetHiddenObject(objData);
}

function p_dtActivityPeriodFrom_Changed(objCaller, intIndex) {
    
    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());
    for (i = 0; i < objData.XXSHP_KDS_T_CMA_DTL.length; i++) {
        // Cari Index-nya.
        if (objData.XXSHP_KDS_T_CMA_DTL[i].intIndex == intIndex) {
            // Ketemu, mulai dari sini:
            if (clsGlobal.parseToString(objCaller.value) != "") {
                objData.XXSHP_KDS_T_CMA_DTL[i].DTM_PERIOD_FROM = objCaller.value;
            } else {
                objCaller.value = clsGlobal.parseToDateTimeFromJSON(objData.XXSHP_KDS_T_CMA_DTL[i].DTM_PERIOD_FROM, clsDateFormat)
            }
            break;
        }
    }
    p_SetHiddenObject(objData);
}

function p_dtActivityPeriodTo_Changed(objCaller, intIndex) {
    
    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());
    for (i = 0; i < objData.XXSHP_KDS_T_CMA_DTL.length; i++) {
        // Cari Index-nya.
        if (objData.XXSHP_KDS_T_CMA_DTL[i].intIndex == intIndex) {
            // Ketemu, mulai dari sini:
            if (clsGlobal.parseToString(objCaller.value) != "") {
                objData.XXSHP_KDS_T_CMA_DTL[i].DTM_PERIOD_TO = objCaller.value;
            } else {
                objCaller.value = clsGlobal.parseToDateTimeFromJSON(objData.XXSHP_KDS_T_CMA_DTL[i].DTM_PERIOD_TO, clsDateFormat)
            }
            break;
        }
    }
    p_SetHiddenObject(objData);
}
    

function p_txtActivityInvoiceNo_Changed(objCaller, intIndex) {
    
    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());
    for (i = 0; i < objData.XXSHP_KDS_T_CMA_DTL.length; i++) {
        // Cari Index-nya.
        if (objData.XXSHP_KDS_T_CMA_DTL[i].intIndex == intIndex) {
            // Ketemu, mulai dari sini:
            objData.XXSHP_KDS_T_CMA_DTL[i].TXT_INVOICE_NO = objCaller.value;
            break;
        }
    }
    p_SetHiddenObject(objData);
}


function p_RefreshDataRow() {
    var intSelectedIndex = p_GetSelectedActivityRow();
    var intRowIndex = 0;
    var objDat = p_GetHiddenObject();
    oTableActivity.rows().every(function (rowIdx, tableLoop, rowLoop) {
        
        var d = this.data();
        if (intRowIndex == intSelectedIndex) {
            d.intIndex = intRowIndex; // update data source for the row 
             
            d.TXT_ACTIVITYCODE = objDat.XXSHP_KDS_T_CMA_DTL[intRowIndex].TXT_ACTIVITYCODE;
            d.TXT_ACTIVITYNAME = objDat.XXSHP_KDS_T_CMA_DTL[intRowIndex].TXT_ACTIVITYNAME;          
            d.TXT_PROGRAMDESC = objDat.XXSHP_KDS_T_CMA_DTL[intRowIndex].TXT_PROGRAMDESC;
            d.DTM_PERIOD_FROM = objDat.XXSHP_KDS_T_CMA_DTL[intRowIndex].DTM_PERIOD_FROM;
            d.DTM_PERIOD_TO = objDat.XXSHP_KDS_T_CMA_DTL[intRowIndex].DTM_PERIOD_TO; 
            d.TXT_INVOICE_NO = objDat.XXSHP_KDS_T_CMA_DTL[intRowIndex].TXT_INVOICE_NO;
            d.DEC_DPP = objDat.XXSHP_KDS_T_CMA_DTL[intRowIndex].DEC_DPP;
            d.DEC_PPN = objDat.XXSHP_KDS_T_CMA_DTL[intRowIndex].DEC_PPN;
            d.DEC_SUBTOTAL = objDat.XXSHP_KDS_T_CMA_DTL[intRowIndex].DEC_SUBTOTAL;
            d.BIT_PENDING = objDat.XXSHP_KDS_T_CMA_DTL[intRowIndex].BIT_PENDING;
            d.TXT_REMARK = objDat.XXSHP_KDS_T_CMA_DTL[intRowIndex].TXT_REMARK;
            d.TXT_REFDOCNO = objDat.XXSHP_KDS_T_CMA_DTL[intRowIndex].TXT_REFDOCNO;
            d.TXT_REFDOCTYPE = objDat.XXSHP_KDS_T_CMA_DTL[intRowIndex].TXT_REFDOCTYPE;
            d.bitSelected = objDat.XXSHP_KDS_T_CMA_DTL[intRowIndex].bitSelected;
            d.TXT_SUBBRAND = objDat.XXSHP_KDS_T_CMA_DTL[intRowIndex].TXT_SUBBRAND;
             
            this.invalidate(); // invalidate the data DataTables has cached for this row         
            p_EnableControl(clsGlobal.ParseBooleanOracleToNET(objDat.BIT_APPLY));
        }

        intRowIndex++;
    });
    //AutoNumeric.
    p_GenerateAutoNumeric();
    p_GenerateDateTimePicker();
}

function p_txtActivityDPP_Changed(objCaller, intIndex) {
    
    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());
    for (i = 0; i < objData.XXSHP_KDS_T_CMA_DTL.length; i++) {
        // Cari Index-nya.
        if (objData.XXSHP_KDS_T_CMA_DTL[i].intIndex == intIndex) {
            // Ketemu, mulai dari sini:
            objData.XXSHP_KDS_T_CMA_DTL[i].DEC_DPP = clsGlobal.parseToDecimal(objCaller.value);            
            objData.XXSHP_KDS_T_CMA_DTL[i].DEC_SUBTOTAL = clsGlobal.parseToDecimal(objData.XXSHP_KDS_T_CMA_DTL[i].DEC_DPP) + clsGlobal.parseToDecimal(objData.XXSHP_KDS_T_CMA_DTL[i].DEC_PPN);
            break;
        }
    }
    p_SetHiddenObject(objData);
    p_RefreshDataRow();
}


function p_txtActivityPPN_Changed(objCaller, intIndex) {
    
    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());
    for (i = 0; i < objData.XXSHP_KDS_T_CMA_DTL.length; i++) {
        // Cari Index-nya.
        if (objData.XXSHP_KDS_T_CMA_DTL[i].intIndex == intIndex) {
            // Ketemu, mulai dari sini:
            objData.XXSHP_KDS_T_CMA_DTL[i].DEC_PPN = clsGlobal.parseToDecimal(objCaller.value);             
            objData.XXSHP_KDS_T_CMA_DTL[i].DEC_SUBTOTAL = clsGlobal.parseToDecimal(objData.XXSHP_KDS_T_CMA_DTL[i].DEC_DPP) + clsGlobal.parseToDecimal(objData.XXSHP_KDS_T_CMA_DTL[i].DEC_PPN);
            break;
        }
    }
    p_SetHiddenObject(objData);
    p_RefreshDataRow();
}

function p_chkActivityPending_Changed(objCaller, intIndex) {
    
    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());
    for (i = 0; i < objData.XXSHP_KDS_T_CMA_DTL.length; i++) {
        // Cari Index-nya.
        if (objData.XXSHP_KDS_T_CMA_DTL[i].intIndex == intIndex) {
            // Ketemu, mulai dari sini:
            objData.XXSHP_KDS_T_CMA_DTL[i].BIT_PENDING =  clsGlobal.ParseBooleanNETToOracle(objCaller.checked);
            break; 
        }
    }

    p_SetHiddenObject(objData);
    p_CalculateTotalKlaim();
}

function p_CalculateTotalKlaim() {
    
    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());
    var decTotalKlaim = 0;
    for (i = 0; i < objData.XXSHP_KDS_T_CMA_DTL.length; i++) {
        // Cari Index-nya.
        
        if (objData.XXSHP_KDS_T_CMA_DTL[i].bitSelected == true) {
            // hanya yg dipilih.
            if (clsGlobal.ParseBooleanOracleToNET(objData.XXSHP_KDS_T_CMA_DTL[i].BIT_PENDING) != true) {
                // Hanya yg ga di pending.
                //decTotalKlaim += objData.XXSHP_KCO_T_CMA_DTL[i].DEC_SUBTOTAL;
                decTotalKlaim += objData.XXSHP_KDS_T_CMA_DTL[i].DEC_DPP;
            }
        }
    }
    $("#lblTotalKlaimValue").html(clsGlobal.FormatMoney(decTotalKlaim, 0));
}


function p_txtActivityRemark_Changed(objCaller, intIndex) {
    
    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());
    for (i = 0; i < objData.XXSHP_KDS_T_CMA_DTL.length; i++) {
        // Cari Index-nya.
        if (objData.XXSHP_KDS_T_CMA_DTL[i].intIndex == intIndex) {
            // Ketemu, mulai dari sini:
            objData.XXSHP_KDS_T_CMA_DTL[i].TXT_REMARK = objCaller.value;
            break;
        }
    }
    p_SetHiddenObject(objData);

}

function p_txtActivityRemark_Changed(objCaller, intIndex) {
    
    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());
    for (i = 0; i < objData.XXSHP_KDS_T_CMA_DTL.length; i++) {
        // Cari Index-nya.
        if (objData.XXSHP_KDS_T_CMA_DTL[i].intIndex == intIndex) {
            // Ketemu, mulai dari sini:
            objData.XXSHP_KDS_T_CMA_DTL[i].TXT_REMARK = objCaller.value;
            break;
        }
    }
    p_SetHiddenObject(objData);

}


function p_btnLOVActivityDocOraType_Click(objCaller, intIndex) {
    LOV = clsGlobal.generateLOV(LOV_PARAMETER_ORADOCTYPE, "txtActivityDocOraType");
}

function p_settxtActivityDocOraType(txtValue) {
    
    var intSelectedIndex = p_GetSelectedActivityRow();
    var intRowIndex = 0;
    var objDat = p_GetHiddenObject();
    oTableActivity.rows().every(function (rowIdx, tableLoop, rowLoop) {
        
        var d = this.data();
        if (intRowIndex == intSelectedIndex) {
            d.intIndex = intRowIndex; // update data source for the row 
              
            d.TXT_REFDOCTYPE = txtValue;
            objDat.XXSHP_KDS_T_CMA_DTL[intRowIndex].TXT_REFDOCTYPE = txtValue;

            this.invalidate(); // invalidate the data DataTables has cached for this row         
            p_EnableControl(clsGlobal.ParseBooleanOracleToNET(objDat.BIT_APPLY));
        }

        intRowIndex++;
    });

    p_SetHiddenObject(objDat);
    p_RefreshDataRow();
}

function p_btnActivityDelete_Click(objCaller, intIndex) {
    
    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());
    for (i = 0; i < objData.XXSHP_KDS_T_CMA_DTL.length; i++) {
        // Cari Index-nya.
        if (objData.XXSHP_KDS_T_CMA_DTL[i].intIndex == intIndex) {
            // Ketemu, mulai dari sini:
            // Remove from list.
            objData.XXSHP_KDS_T_CMA_DTL.splice(i, 1);

            //var row = oTableActivity.row($(this).parents('tr'));
            //var rowNode = row.node();
            //row.remove().draw();
            oTableActivity.row(i).remove().draw(false);
            break;
        }
    }
    p_SetHiddenObject(objData);
    p_RefreshNumberActivity();
}

function p_RefreshNumberActivity() {
    
    var intRowIndex = 0;
    var objDat = p_GetHiddenObject();
    oTableActivity.rows().every(function (rowIdx, tableLoop, rowLoop) {
        
        var d = this.data();
        d.intIndex = intRowIndex; // update data source for the row
        objDat.XXSHP_KDS_T_CMA_DTL[intRowIndex].intIndex = d.intIndex;

        d.TXT_ACTIVITYCODE = objDat.XXSHP_KDS_T_CMA_DTL[intRowIndex].TXT_ACTIVITYCODE;
        d.TXT_ACTIVITYNAME = objDat.XXSHP_KDS_T_CMA_DTL[intRowIndex].TXT_ACTIVITYNAME;
        d.TXT_PROGRAMDESC = objDat.XXSHP_KDS_T_CMA_DTL[intRowIndex].TXT_PROGRAMDESC;
        d.DTM_PERIOD_FROM = objDat.XXSHP_KDS_T_CMA_DTL[intRowIndex].DTM_PERIOD_FROM;
        d.DTM_PERIOD_TO = objDat.XXSHP_KDS_T_CMA_DTL[intRowIndex].DTM_PERIOD_TO;
        d.TXT_INVOICE_NO = objDat.XXSHP_KDS_T_CMA_DTL[intRowIndex].TXT_INVOICE_NO;
        d.DEC_DPP = objDat.XXSHP_KDS_T_CMA_DTL[intRowIndex].DEC_DPP;
        d.DEC_PPN = objDat.XXSHP_KDS_T_CMA_DTL[intRowIndex].DEC_PPN;
        d.DEC_SUBTOTAL = objDat.XXSHP_KDS_T_CMA_DTL[intRowIndex].DEC_SUBTOTAL;
        d.BIT_PENDING = objDat.XXSHP_KDS_T_CMA_DTL[intRowIndex].BIT_PENDING;
        d.TXT_REMARK = objDat.XXSHP_KDS_T_CMA_DTL[intRowIndex].TXT_REMARK;
        d.TXT_REFDOCNO = objDat.XXSHP_KDS_T_CMA_DTL[intRowIndex].TXT_REFDOCNO;
        d.TXT_REFDOCTYPE = objDat.XXSHP_KDS_T_CMA_DTL[intRowIndex].TXT_REFDOCTYPE;
        d.bitSelected = objDat.XXSHP_KDS_T_CMA_DTL[intRowIndex].bitSelected;

        intRowIndex++;
        this.invalidate(); // invalidate the data DataTables has cached for this row         
    });

    // Draw once all updates are done
    oTableActivity.draw(false);
    p_SetHiddenObject(objDat);
    p_RefreshDataRow();
}



// ====================================================
//  Match
// ====================================================

function p_DataToUIMatch(XXSHP_KDS_T_CMA_MAT) {
    
    oTableMatch.clear();
    for (var i = 0; i < XXSHP_KDS_T_CMA_MAT.length; i++) {
        XXSHP_KDS_T_CMA_MAT[i].intIndex = i;
        oTableMatch.row.add(XXSHP_KDS_T_CMA_MAT[i]);
    }
    oTableMatch.draw(false);

    var objDat = p_GetHiddenObject();
    objDat.XXSHP_KDS_T_CMA_MAT = XXSHP_KDS_T_CMA_MAT;
    p_SetHiddenObject(objDat);
}

$('#btnAddMatch').on('click', function () {
    try {
        p_AddRowMatch();
    } catch (ex) {
        clsGlobal.showAlert(ex);
    } 
});

function p_AddRowMatch() {
    
    clsGlobal.showLoading();
    $.ajax({
        type: "POST",
        url: "/Transaction/CMA/AddRowMatch",
        data: { data: $("#txtHiddenObject").val(), __RequestVerificationToken: $('#frmCMA input[name=__RequestVerificationToken]').val() },
        datatype: "json",
        success: function (retDat) {

            if (retDat.bitSuccess == true) {
                if (retDat.objData != undefined) {
                    p_SetHiddenObject(retDat.objData);
                    p_DataToUIMatch(retDat.objData.XXSHP_KDS_T_CMA_MAT);
                    oTableMatch.page('last').draw(false);
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

$('#btnAddMatchKPP').on('click', function () {
    try {
        p_AddRowMatchKPP();
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
});

function p_AddRowMatchKPP() {
    
    var objDat = p_GetHiddenObject();
    var txtActivityCode = "";
    for (var i = 0; i < objDat.XXSHP_KDS_T_CMA_DTL.length ; i++) {
        if (objDat.XXSHP_KDS_T_CMA_DTL[i].bitSelected == true) {
            txtActivityCode = objDat.XXSHP_KDS_T_CMA_DTL[i].TXT_ACTIVITYCODE;
            break;
        }
    }
    LOV = clsGlobal.generateLOV(MODULE_KPP_MATCHING_KPP, "KPPMatch", $("#txtGroupAccount").val() + "|" + $("#txtOutlet").val() + "|" + txtActivityCode + "|" + $("#txtSupplierID").val());

    
}
  
function p_setKPPMatch(txtValue) {
    clsGlobal.showLoading();
    $.ajax({
        type: "POST",
        url: "/Transaction/CMA/AddRowMatchKPP",
        data: { txtKPPMatch : txtValue,  data: $("#txtHiddenObject").val(), __RequestVerificationToken: $('#frmCMA input[name=__RequestVerificationToken]').val() },
        datatype: "json",
        success: function (retDat) {

            if (retDat.bitSuccess == true) {
                if (retDat.objData != undefined) {
                    p_SetHiddenObject(retDat.objData);
                    p_DataToUIMatch(retDat.objData.XXSHP_KDS_T_CMA_MAT);
                    oTableMatch.page('last').draw(false);
                    p_CalculateTotalKlaim();
                    p_CalculateTotalMatching();
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

function p_txtSupplierSiteID_TextChanged() {
    clsGlobal.showLoading();
    $.ajax({
        type: "POST",
        url: "/Master/Supplier/GetDataSite",
        data: { txtID: $("#txtSupplierSiteID").val(), __RequestVerificationToken: $('#frmCMA input[name=__RequestVerificationToken]').val() },
        datatype: "json",
        success: function (retDat) {
            if (retDat.bitSuccess == true) {
                if (retDat.objData != undefined) {
                    $("#txtSupplierSiteName").val(clsGlobal.parseToString(retDat.objData.VENDOR_SITE_CODE));                      
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

function p_InitiateMatch() {
    // Format datatable  
    
    oTableMatch = $('#dtMatch').DataTable({
        "bPaginate": true,
        "bSort": false,
        searching: true,
        "iDisplayLength": 5,
        "type": "POST",
        aoColumnDefs: [
            {
                aTargets: [0],
                mRender: function (data, type, full) {
                    return '<div id="lblMatchNoValue"> ' + (full.intIndex + 1) + ' </div>';
                }
            }, 
           {
               aTargets: [1],
               mRender: function (data, type, full) {
                   return '     <div class="input-group"> ' +
                            '       <div class="input-group-btn"> ' +
                            '           <button type="button" class="btn btn-danger btnLOVRefDocNo" id="btnLOVRefDocNo" onclick="p_btnLOVRefDocNo_Click(this,' + full.intIndex + ')"> <i class="fa fa-search"></i></button> ' +
                            '       </div> ' +
                            '       <input type="text" class="form-control txtRefDocNo" id="txtRefDocNo" onchange="p_txtRefDocNo_Changed(this,' + full.intIndex + ')"  value="' + full.TXT_REFDOCNO + '" disabled> ' +
                            '   </div>';
               }
           },
           {
               aTargets: [2],
               mRender: function (data, type, full) {
                   return '<div id="lblMatchActivity"> ' + clsGlobal.parseToString(full.TXT_ACTIVITY_CODE) + ' </div>';
               }
           },
           {
               aTargets: [3],
               mRender: function (data, type, full) {
                   return '<div id="lblMatchSubbrand"> ' + clsGlobal.parseToString(full.TXT_SUBBRAND) + ' </div>';
               }
           },
           {
               aTargets: [4],
               mRender: function (data, type, full) {
                   return '<div id="lblMatchAmountAvailable"> ' + clsGlobal.FormatMoney(full.DEC_AMOUNT_AVAILABLE, 0) + ' </div>';
               }
           },
           {
               aTargets: [5],
               mRender: function (data, type, full) {
                   return '<div id="lblMatchRatio"> ' + clsGlobal.FormatMoney(full.DEC_RATIO, 4) + ' </div>';
               }
           },
           {
               aTargets: [6],
               mRender: function (data, type, full) {
                   return '<div >  <input type="text" class="form-control txtMatchAmount autonumeric text-right" id="txtMatchAmount' + full.intIndex + '"  onchange="p_txtMatchAmount_Changed(this,' + full.intIndex + ')"  value="' + full.DEC_MATCHING + '" >  </div>';
               }
           },
            {
                aTargets: [7],
                mRender: function (data, type, full) {
                    return '<div > <input type="button" class="btn btn-warning btnMatchDelete" id="btnMatchDelete" onclick="p_btnMatchDelete_Click(this,' + full.intIndex + ')"  value="Delete" >  </div>';
                }
            }
        ],
        "fnDrawCallback": function (oSettings) {
            p_GenerateAutoNumeric();
        }
    });

    $("#dtMatch").css("width", "100%");
    $('#dtMatch tbody').on('click', 'tr', function () {
        if (!$(this).hasClass('selected')) {
            oTableMatch.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
        }
    });

    $('#dtMatch').on('page.dt', function () {
        ////alert('go');
        p_GenerateAutoNumeric();
            //var info = table.page.info();
            //$('#pageInfo').html('Showing page: ' + info.page + ' of ' + info.pages);
    });
}

function p_GetSelectedMatchRow() {
    var intIndex = clsGlobal.parseToInteger(oTableMatch.$('tr.selected').find("#lblMatchNoValue").html()) - 1;
    return intIndex;
}

function p_btnLOVRefDocNo_Click(objCaller, intIndex) {
    // LOV = clsGlobal.generateLOV(MODULE_KPP, "txtRefDocNo");
    var objDat = p_GetHiddenObject();
    var txtActivityCode = "";
    for (var i = 0; i < objDat.XXSHP_KDS_T_CMA_DTL.length ; i++) {
        if (objDat.XXSHP_KDS_T_CMA_DTL[i].bitSelected == true) {
            txtActivityCode = objDat.XXSHP_KDS_T_CMA_DTL[i].TXT_ACTIVITYCODE;
            break;
        }
    }
    LOV = clsGlobal.generateLOV(MODULE_KPP_MATCHING, "txtRefDocNo", $("#txtGroupAccount").val() + "|" + $("#txtOutlet").val() + "|" + txtActivityCode + "|" + $("#txtSupplierID").val());
}

function p_settxtRefDocNo(txtValue, txtValue5, txtValue7, txtValue8, txtValue9, txtValue10, txtValue4) {
      
    var intSelectedIndex = p_GetSelectedMatchRow();
    var intRowIndex = 0;
    var objDat = p_GetHiddenObject();
    oTableMatch.rows().every(function (rowIdx, tableLoop, rowLoop) {
        
        var d = this.data();
        if (intRowIndex == intSelectedIndex) {
            d.intIndex = intRowIndex; // update data source for the row 

            d.TXT_REFDOCNO = txtValue;
            d.DEC_AMOUNT_AVAILABLE = clsGlobal.parseToDecimal(txtValue8); 
            d.INT_KPP_RKP_ID = clsGlobal.parseToDecimal(txtValue10);
            d.TXT_SUBBRAND = txtValue4;
            objDat.XXSHP_KDS_T_CMA_MAT[intRowIndex].TXT_REFDOCNO = txtValue; 
            objDat.XXSHP_KDS_T_CMA_MAT[intRowIndex].DEC_AMOUNT_AVAILABLE = d.DEC_AMOUNT_AVAILABLE; 
            objDat.XXSHP_KDS_T_CMA_MAT[intRowIndex].INT_KPP_RKP_ID = d.INT_KPP_RKP_ID;
            objDat.XXSHP_KDS_T_CMA_MAT[intRowIndex].TXT_ACTIVITY_CODE = txtValue5;
            d.TXT_ACTIVITY_CODE = txtValue5;
            objDat.XXSHP_KDS_T_CMA_MAT[intRowIndex].TXT_SUBBRAND = txtValue4;

            this.invalidate(); // invalidate the data DataTables has cached for this row         
            p_EnableControl(clsGlobal.ParseBooleanOracleToNET(objDat.BIT_APPLY));
        }

        intRowIndex++;
    });

    p_SetHiddenObject(objDat);
    p_RefreshDataRow();

}
  

function p_txtMatchAmount_Changed(objCaller, intIndex) {
    
    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());
    for (i = 0; i < objData.XXSHP_KDS_T_CMA_MAT.length; i++) {
        // Cari Index-nya.
        if (objData.XXSHP_KDS_T_CMA_MAT[i].intIndex == intIndex) {
            // Ketemu, mulai dari sini:

            //Check jika lebih dari nilai available.
            //if (clsGlobal.parseToDecimal(objCaller.value) > objData.XXSHP_KCO_T_CMA_MAT[i].DEC_AMOUNT_AVAILABLE) {
            //    objData.XXSHP_KCO_T_CMA_MAT[i].DEC_MATCHING = 0;
            //    clsGlobal.showAlert("Nilai matching tidak boleh lebih besar dari nilai available!");
            //} else if (clsGlobal.parseToDecimal(objCaller.value) < 0) {
            //    objData.XXSHP_KCO_T_CMA_MAT[i].DEC_MATCHING = 0;
            //    clsGlobal.showAlert("Nilai matching tidak boleh lebih kecil dari NOL!");
            //}
            //else {
            //    objData.XXSHP_KCO_T_CMA_MAT[i].DEC_MATCHING = clsGlobal.parseToDecimal(objCaller.value);
            //}
            objData.XXSHP_KDS_T_CMA_MAT[i].DEC_MATCHING = clsGlobal.parseToDecimal(objCaller.value);

            break;
        }
    }
    p_SetHiddenObject(objData);
    p_CalculateTotalMatching();
    p_RefreshMatchRow();

}


function p_CalculateTotalMatching() {
    
    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());
    var decTotalMatching = 0;
    for (i = 0; i < objData.XXSHP_KDS_T_CMA_MAT.length; i++) {
        // Cari Index-nya.
        decTotalMatching += objData.XXSHP_KDS_T_CMA_MAT[i].DEC_MATCHING;
    }
    $("#lblTotalMatchingValue").html(clsGlobal.FormatMoney(decTotalMatching, 0));
}

function p_btnMatchDelete_Click(objCaller, intIndex) {
    
    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());
    for (i = 0; i < objData.XXSHP_KDS_T_CMA_MAT.length; i++) {
        // Cari Index-nya.
        if (objData.XXSHP_KDS_T_CMA_MAT[i].intIndex == intIndex) {
            // Ketemu, mulai dari sini:
            // Remove from list.
            objData.XXSHP_KDS_T_CMA_MAT.splice(i, 1);

            //var row = oTableMatch.row($(this).parents('tr'));
            //var rowNode = row.node();
            //row.remove().draw();
            oTableMatch.row(i).remove().draw(false);
            break;
        }
    }
    p_SetHiddenObject(objData);
    p_RefreshNumberMatch();
}

function p_RefreshNumberMatch() {
    
    var intRowIndex = 0;
    var objDat = p_GetHiddenObject();
    oTableMatch.rows().every(function (rowIdx, tableLoop, rowLoop) {
        
        var d = this.data();
        d.intIndex = intRowIndex; // update data source for the row
        objDat.XXSHP_KDS_T_CMA_MAT[intRowIndex].intIndex = d.intIndex;

        d.TXT_REFDOCNO = objDat.XXSHP_KDS_T_CMA_MAT[intRowIndex].TXT_REFDOCNO;
        d.DEC_MATCHING = objDat.XXSHP_KDS_T_CMA_MAT[intRowIndex].DEC_MATCHING;
        d.TXT_SUBBRAND = objDat.XXSHP_KDS_T_CMA_MAT[intRowIndex].TXT_SUBBRAND;
       
        intRowIndex++;
        this.invalidate(); // invalidate the data DataTables has cached for this row         
    });

    // Draw once all updates are done
    oTableMatch.draw(false);
    p_SetHiddenObject(objDat);
}


function p_RefreshMatchRow() {
    var intSelectedIndex = p_GetSelectedMatchRow();
    var intRowIndex = 0;
    var objDat = p_GetHiddenObject();
    oTableMatch.rows().every(function (rowIdx, tableLoop, rowLoop) {
        
        var d = this.data();
        if (intRowIndex == intSelectedIndex) {
            d.intIndex = intRowIndex; // update data source for the row 

            d.TXT_REFDOCNO = objDat.XXSHP_KDS_T_CMA_MAT[intRowIndex].TXT_REFDOCNO;
            d.DEC_AMOUNT_AVAILABLE = objDat.XXSHP_KDS_T_CMA_MAT[intRowIndex].DEC_AMOUNT_AVAILABLE;
            d.DEC_MATCHING = objDat.XXSHP_KDS_T_CMA_MAT[intRowIndex].DEC_MATCHING;
            d.TXT_SUBBRAND = objDat.XXSHP_KDS_T_CMA_MAT[intRowIndex].TXT_SUBBRAND;
             
            this.invalidate(); // invalidate the data DataTables has cached for this row         
            p_EnableControl(clsGlobal.ParseBooleanOracleToNET(objDat.BIT_APPLY));
        }

        intRowIndex++;
    });
    //AutoNumeric.
    p_GenerateAutoNumeric();
    p_GenerateDateTimePicker();
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

$('#btnSubmit').bind('click', function () {
    try {
        clsGlobal.getConfirmation("Submit this data?", function (result) {
            if (result == true) {
                p_submitData();
            }
            else {
                return false;
            }
        });
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
});


$('#btnFind').bind('click', function () {
    try {
        LOV = clsGlobal.generateLOV(MODULE_CMA, "txtDocNo"); //MODULE_APPROVALHIERARCHY
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
});


//$('#btnLOVRefDocNo').bind('click', function () {
//    try {
//        LOV = clsGlobal.generateLOV(MODULE_MCMA, "txtRefDocNo"); //MODULE_APPROVALHIERARCHY
//    } catch (ex) {
//        clsGlobal.showAlert(ex);
//    }
//});


$('#btnLOVGroupAccount').bind('click', function () {
    try {
        LOV = clsGlobal.generateLOV(LOV_GROUP_ACCOUNT, "txtGroupAccount");
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
});

$('#btnLOVOutlet').bind('click', function () {
    try {
        LOV = clsGlobal.generateLOV(LOV_OUTLET, "txtOutlet", $("#txtRefDocNo").val());
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
});

$('#btnLOVBudgetType').bind('click', function () {
    try {
        LOV = clsGlobal.generateLOV(MODULE_MTBUDGETTYPE, "txtBudgetType");
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
});
$('#btnLOVPaymentType').bind('click', function () {
    try {
        LOV = clsGlobal.generateLOV(MODULE_TYPE_PAYMENT, "txtPaymentType");
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
});
$('#btnDelete').bind('click', function () {
    try {
        clsGlobal.getConfirmation("Delete this data?", function (result) {
            if (result == true) {
                p_deleteData();
            }
            else {
                return false;
            }
        });
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
});



$("#btndtEffectiveFrom").on("changeDate", function (e) { 
    $("#dtEffectiveFrom").val(clsGlobal.parseToDateTimeFromJSON(e.date, clsDateFormat));
});

$("#btndtEffectiveTo").on("changeDate", function (e) {
    $("#dtEffectiveTo").val(clsGlobal.parseToDateTimeFromJSON(e.date, clsDateFormat));
});



$('#btnApprovalHistory').bind('click', function () {
    try {
        var fancyboxdata = p_GetHiddenObject();
        LOV = clsGlobal.generatePopUpIframeSmall($(location).attr('protocol') + "//" + $(location).attr('host') + "/Master/ApprovalHistory/Index?TXT_TYPEDOC=" + "&TXT_REF_DOCNO=" + fancyboxdata.TXT_DOCNO + "&INT_DOCID=" + fancyboxdata.INT_CMA_HDR_ID, "btnApprovalHistory", fancyboxdata);

    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
});


$("#btnCancel").on("click", function (e) {
    try {
        clsGlobal.getConfirmation("Cancel for this document?", function (result) {
            if (result == true) {
                p_cancelDocument();
            }
            else {
                return false;
            }
        });
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
});

$('#btnLOVSupplierSite').bind('click', function () {
    try {
        LOV = clsGlobal.generateLOV(LOV_XXSHP_VENDOR_SITE_ALL_V_VENDOR_SITE_ID, "txtSupplierSiteID", $("#txtSupplierID").val());
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
});