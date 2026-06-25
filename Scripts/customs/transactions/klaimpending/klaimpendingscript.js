//=======================
// VARIABLE GLOBAL
//=======================
var clsGlobal = new clsGlobalClass();
var LOV;
var bitLoading = false;
//var oTable;


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
    //switch (arr[0]) { 
    //}
    clsGlobal.closeLOV();
}
 
function p_DataToUI(XXSHP_KDS_T_KLAIM_DTL) {
    p_DataToUIDetail(XXSHP_KDS_T_KLAIM_DTL);
    p_SetHiddenObject(XXSHP_KDS_T_KLAIM_DTL);
}

function p_SetHiddenObject(objDat) {
    $("#txtHiddenObject").val(JSON.stringify(objDat));
   
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

function p_DataToUIDetail(XXSHP_KDS_T_KLAIM_DTL) { 
    //
    oTable.clear(); 
    for (var i = 0; i < XXSHP_KDS_T_KLAIM_DTL.length; i++) {
        XXSHP_KDS_T_KLAIM_DTL[i].intIndex = i;
        oTable.row.add(XXSHP_KDS_T_KLAIM_DTL[i]);
    }
    oTable.draw(false); 
    p_SetHiddenObject(XXSHP_KDS_T_KLAIM_DTL); 
}

function p_initiateData() {
    clsGlobal.showLoading();
    $.ajax({
        type: "POST",
        url: "/Transaction/KlaimPending/InitiateData",
        data: { __RequestVerificationToken: $('#frmKlaimPending input[name=__RequestVerificationToken]').val() },
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
    //console.log("11");
    jsonData = p_GetHiddenObject();
     
    p_SetHiddenObject(jsonData);
    return $("#txtHiddenObject").val();

}


function p_EnableControl(bitApply, bitApproved) {
    //
    
}
 
function p_InitiateDetail() {
    // Format datatable  
    //
    //if ($.fn.DataTable.isDataTable('#dtDetail')) {
    //    $('#dtDetail').DataTable().destroy();
    //}

    //$('#dtDetail tbody').empty();

    oTable = $('#dtDetail').DataTable({
        "bPaginate": true,
        "bSort": false,
        searching: true,
        "aLengthMenu": [[5, 10, 25, 50, 75, 100], [5, 10, 25, 50, 75, 100]],
        "iDisplayLength": 5,
        "type": "POST",
        "scrollX": true,
        "autoWidth": false,
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
                    var txtResult = "";
                    txtResult += "<select class='form-control' id='ddlDetailStatus' onchange='p_ddlDetailStatus_TextChanged(this," + full.intIndex + ")'>";
                    txtResult += "<option value=''>-</option>";
                    if (full.TXT_STATUSKLAIM == "APPROVED") {
                        txtResult += "<option value='APPROVED' selected>APPROVED</option>";
                    } else {
                        txtResult += "<option value='APPROVED'>APPROVED</option>";
                    }
                    if (full.TXT_STATUSKLAIM == "REJECTED") {
                        txtResult += "<option value='REJECTED' selected>REJECTED</option>";
                    } else {
                        txtResult += "<option value='REJECTED'>REJECTED</option>";
                    }
                    if (full.TXT_STATUSKLAIM == "PENDING") {
                        txtResult += "<option value='PENDING' selected>PENDING</option>";
                    } else {
                        txtResult += "<option value='PENDING'>PENDING</option>";
                    }
                    txtResult += "</select>";
                    return txtResult; 
                }
            },
            {
                aTargets: [2],
                mRender: function (data, type, full) {
                    return "<div >  <input type='text' class='form-control txtDetailStatusDesc' id='txtDetailStatusDesc'  value='" + full.TXT_STATUS_DESC + "' onchange='p_txtDetailStatusDesc_TextChanged(this," + full.intIndex + ")' />  </div>";                    
                }
            },
           {
               aTargets: [3],
               mRender: function (data, type, full) {
                   return '     <div > ' +
                            '       <input type="text" class="form-control txtDetailDocNo" id="txtDetailDocNo"  style="width:150px;"  value="' + full.TXT_DOCNO + '"  readonly> ' +
                            '   </div>';
               }
           },
           {
               aTargets: [4],
               mRender: function (data, type, full) {
                   return '     <div > ' +
                            '       <input type="text" class="form-control txtDetailActivity" id="txtDetailActivity"  style="width:150px;"  value="' + full.TXT_ACTIVITY + '"  readonly> ' +
                            '   </div>';
               }
           },
           {
               aTargets: [5],
               mRender: function (data, type, full) {
                   return '<div >  <input type="text" class="form-control txtDetailProgramDesc text-left" id="txtDetailProgramDesc"   value="' + full.TXT_PROGRAM_DESC + '"  readonly>  </div>';
               }
           },
           {
               aTargets: [6],
               mRender: function (data, type, full) {
                   return '<div >  <input type="text" class="form-control txtDetaildtm_period_from"  style="width:100px;" id="txtDetaildtm_period_from"  value="' + clsGlobal.parseToDateTimeFromJSON(full.DTM_PERIOD_FROM, clsDateFormat) + '"  readonly>  </div>';
               }
           },
           {
               aTargets: [7],
               mRender: function (data, type, full) {
                   return '<div >  <input type="text" class="form-control txtDetaildtm_period_to"  style="width:100px;" id="txtDetaildtm_period_to"   value="' + clsGlobal.parseToDateTimeFromJSON(full.DTM_PERIOD_TO, clsDateFormat) + '" readonly >  </div>';
               }
           },
           {
               aTargets: [8],
               mRender: function (data, type, full) {
                   return '<div >  <input type="text" class="form-control txtDetailInvoiceNo text-left" id="txtDetailInvoiceNo" value="' + full.TXT_INVOICE_NO + '"  readonly>  </div>';
               }
           },
            {
                aTargets: [9],
                mRender: function (data, type, full) {
                    return '<div >  <input type="text" class="form-control txtDetailInvoiceDate" style="width:100px;" id="txtDetailInvoiceDate"  class="txtDetailInvoiceDate" value="' + clsGlobal.parseToDateTimeFromJSON(full.DTM_INVOICE, clsDateFormat) + '"  readonly>  </div>';
                }
            },
            {
                aTargets: [10],
                mRender: function (data, type, full) {
                    return '<div >  <input type="text" class="form-control txtFakturPajakNo text-left" id="txtFakturPajakNo"  value="' + full.TXT_FKT_PJK_NO + '"  readonly>  </div>';
                }
            },
            {
                aTargets: [11],
                mRender: function (data, type, full) {
                    return '<div >  <input type="text" class="form-control txtFakturPajakDate" style="width:100px;" id="txtFakturPajakDate"  value="' + clsGlobal.parseToDateTimeFromJSON(full.DTM_FKT_PJK, clsDateFormat) + '"  readonly>  </div>';
                }
            },
            {
                aTargets: [12],
                mRender: function (data, type, full) {
                    return '<div >  <input type="text" class="form-control txtDetailInvoiceAmount autonumeric text-right" id="txtDetailInvoiceAmount" value="' + full.DEC_INVOICE_AMT + '"  readonly>  </div>';
                }
            },
            {
                aTargets: [13],
                mRender: function (data, type, full) {
                    return '     <div > ' + 
                            '       <input type="text" class="form-control txtDetailPPHType" id="txtDetailPPHType" style="width:150px;"  value="' + full.TXT_PPH_JENIS + '"  readonly> ' +
                            '   </div>';

                }
            },
            {
                aTargets: [14],
                mRender: function (data, type, full) {
                    return '<div >  <input type="text" class="form-control txtDetailPersenPPH autonumeric text-right" style="width:100px; id="txtDetailPersenPPH"   value="' + full.DEC_PERSEN_PPH + '" readonly>  </div>';
                }
            },
            {
                aTargets: [15],
                mRender: function (data, type, full) {
                    return '<div >  <input type="text" class="form-control txtDetailAmountPPH autonumeric text-right" id="txtDetailAmountPPH"  value="' + full.DEC_PPH + '" readonly>  </div>';
                }
            },
            {
                aTargets: [16],
                mRender: function (data, type, full) {
                    return '<div >  <input type="text" class="form-control txtDetaiFinalAmount autonumeric text-right" id="txtDetaiFinalAmount"  value="' + (clsGlobal.parseToDecimal(full.DEC_PPH) + clsGlobal.parseToDecimal(full.DEC_INVOICE_AMT)) + '" readonly>  </div>';
                }
            },
            {
                aTargets: [17],
                mRender: function (data, type, full) {
                    return '     <div > ' +
                               '       <input type="text" class="form-control txtDetailPPN  autonumeric text-right" id="txtDetailPPN autonumeric text-right" style="width:100px;"  value="0" disabled> ' +
                               '   </div>';
                }
            },
            {
                aTargets: [18],
                mRender: function (data, type, full) {
                    return '<div >  <input type="text" class="form-control txtDetailTotal autonumeric text-right" id="txtDetailTotal' + full.intIndex + '"  value="' + (clsGlobal.parseToDecimal(full.DEC_INVOICE_AMT) + clsGlobal.parseToDecimal(full.DEC_PPH) + clsGlobal.parseToDecimal(full.DEC_PPN)) + '" ReadOnly >  </div>';
                }
            } 
        ]
    });
    

    $("#dtDetail").css("width", "100%"); 
    $('#dtDetail tbody').on('click', 'tr', function () {
        if (!$(this).hasClass('selected')) {
            oTable.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
        }
    });
}

function p_GetSelectedDetailRow() {
    var intIndex = clsGlobal.parseToInteger(oTable.$('tr.selected').find("#lblDetailNoValue").html()) - 1;
    return intIndex;
}
  
function p_ddlDetailStatus_TextChanged(objCaller, intIndex) {
    //
    // Parse dari HiddenObject->JSON
    var XXSHP_KDS_T_KLAIM_DTL = JSON.parse(p_UIToData());
    for (i = 0; i < XXSHP_KDS_T_KLAIM_DTL.length; i++) {
        // Cari Index-nya.
        if (XXSHP_KDS_T_KLAIM_DTL[i].intIndex == intIndex) {
            // Ketemu, mulai dari sini:
            XXSHP_KDS_T_KLAIM_DTL[i].TXT_STATUSKLAIM = clsGlobal.parseToString(objCaller.value);

            clsGlobal.showLoading();
            $.ajax({
                type: "POST",
                url: "/Transaction/KlaimPending/SetStatusKlaim",
                data: { data: $("#txtHiddenObject").val(), INT_KLAIM_DTL_ID: XXSHP_KDS_T_KLAIM_DTL[i].INT_KLAIM_DTL_ID, txtValue: clsGlobal.parseToString(objCaller.value), txtGUID: $("#txtGUID").val(), __RequestVerificationToken: $('#frmKlaimPending input[name=__RequestVerificationToken]').val() },
                datatype: "json",
                success: function (retDat) {
                    //
                    if (retDat.bitSuccess == true) {
                    }
                    clsGlobal.hideLoading();
                    $("#txtGUID").val(retDat.txtGUID);
                },
                error: function (retDat) {
                    //
                    clsGlobal.hideLoading();
                }
            });
            break;
        }
    } 
    p_SetHiddenObject(objData);
}

function p_txtDetailStatusDesc_TextChanged(objCaller, intIndex) {
    //
    // Parse dari HiddenObject->JSON
    var XXSHP_KDS_T_KLAIM_DTL = JSON.parse(p_UIToData());
    for (i = 0; i < XXSHP_KDS_T_KLAIM_DTL.length; i++) {
        // Cari Index-nya.
        if (XXSHP_KDS_T_KLAIM_DTL[i].intIndex == intIndex) {
            XXSHP_KDS_T_KLAIM_DTL[i].TXT_STATUS_DESC = clsGlobal.parseToString(objCaller.value);
            // Ketemu, mulai dari sini:
            clsGlobal.showLoading();
            $.ajax({
                type: "POST",
                url: "/Transaction/KlaimPending/SetStatusDesc",
                data: { data: $("#txtHiddenObject").val(), INT_KLAIM_DTL_ID: XXSHP_KDS_T_KLAIM_DTL[i].INT_KLAIM_DTL_ID, txtValue: clsGlobal.parseToString(objCaller.value), txtGUID: $("#txtGUID").val(), __RequestVerificationToken: $('#frmKlaimPending input[name=__RequestVerificationToken]').val() },
                datatype: "json",
                success: function (retDat) {
                    //
                    if (retDat.bitSuccess == true) { 
                    }
                    clsGlobal.hideLoading();
                    $("#txtGUID").val(retDat.txtGUID);
                },
                error: function (retDat) {
                    //
                    clsGlobal.hideLoading();
                }
            }); 
            break;
        }
    } 
    p_SetHiddenObject(objData);
}
 
function p_RefreshNumberDetail() {
    //
    var intRowIndex = 0;
    var objDat = p_GetHiddenObject();
    oTable.rows().every(function (rowIdx, tableLoop, rowLoop) {
        //
        var d = this.data();
        d.intIndex = intRowIndex; // update data source for the row
        objDat.XXSHP_KDS_T_KLAIM_DTL[intRowIndex].intIndex = d.intIndex;

        d.TXT_ACTIVITY = objDat.XXSHP_KDS_T_KLAIM_DTL[intRowIndex].TXT_ACTIVITY;
        d.TXT_COA = objDat.XXSHP_KDS_T_KLAIM_DTL[intRowIndex].TXT_COA;
        d.TXT_PPH_JENIS = objDat.XXSHP_KDS_T_KLAIM_DTL[intRowIndex].TXT_PPH_JENIS;
        d.TXT_PPH_TYPE = objDat.XXSHP_KDS_T_KLAIM_DTL[intRowIndex].TXT_PPH_TYPE;
        d.TXT_FKT_PJK_NO = objDat.XXSHP_KDS_T_KLAIM_DTL[intRowIndex].TXT_FKT_PJK_NO;
        d.TXT_PROGRAM_DESC = objDat.XXSHP_KDS_T_KLAIM_DTL[intRowIndex].TXT_PROGRAM_DESC;
        d.DTM_PERIOD_FROM = objDat.XXSHP_KDS_T_KLAIM_DTL[intRowIndex].DTM_PERIOD_FROM;
        d.DTM_PERIOD_TO = objDat.XXSHP_KDS_T_KLAIM_DTL[intRowIndex].DTM_PERIOD_TO;
        d.TXT_INVOICE_NO = objDat.XXSHP_KDS_T_KLAIM_DTL[intRowIndex].TXT_INVOICE_NO;
        d.DTM_INVOICE = objDat.XXSHP_KDS_T_KLAIM_DTL[intRowIndex].DTM_INVOICE;
        d.DTM_FKT_PJK = objDat.XXSHP_KDS_T_KLAIM_DTL[intRowIndex].DTM_FKT_PJK;
        d.DEC_INVOICE_AMT = objDat.XXSHP_KDS_T_KLAIM_DTL[intRowIndex].DEC_INVOICE_AMT;
        d.TXT_PPH_JENIS = objDat.XXSHP_KDS_T_KLAIM_DTL[intRowIndex].TXT_PPH_JENIS;
        d.DEC_PERSEN_PPH = objDat.XXSHP_KDS_T_KLAIM_DTL[intRowIndex].DEC_PERSEN_PPH;
        d.BIT_ALLBRAND = objDat.XXSHP_KDS_T_KLAIM_DTL[intRowIndex].BIT_ALLBRAND;

        intRowIndex++;
        this.invalidate(); // invalidate the data DataTables has cached for this row         
    });

    // Draw once all updates are done
    oTable.draw(false);
    p_SetHiddenObject(objDat);
}

function p_refresh_row_detail(intindex)
{

    //
    var intRowIndex = 0;
    var objDat = p_GetHiddenObject();
    oTable.rows().every(function (rowIdx, tableLoop, rowLoop)
    {
        if (intRowIndex == intindex)
        {
            //
            var d = this.data();
            d.intIndex = intRowIndex; // update data source for the row
            objDat.XXSHP_KDS_T_KLAIM_DTL[intRowIndex].intIndex = d.intIndex;

            d.TXT_ACTIVITY = objDat.XXSHP_KDS_T_KLAIM_DTL[intRowIndex].TXT_ACTIVITY;
            d.TXT_PROGRAM_DESC = objDat.XXSHP_KDS_T_KLAIM_DTL[intRowIndex].TXT_PROGRAM_DESC;
            d.TXT_COA = objDat.XXSHP_KDS_T_KLAIM_DTL[intRowIndex].TXT_COA;
            d.TXT_PPH_JENIS = objDat.XXSHP_KDS_T_KLAIM_DTL[intRowIndex].TXT_PPH_JENIS;
            d.TXT_PPH_TYPE = objDat.XXSHP_KDS_T_KLAIM_DTL[intRowIndex].TXT_PPH_TYPE;
            d.TXT_INVOICE_NO = objDat.XXSHP_KDS_T_KLAIM_DTL[intRowIndex].TXT_INVOICE_NO;
            d.TXT_FKT_PJK_NO = objDat.XXSHP_KDS_T_KLAIM_DTL[intRowIndex].TXT_FKT_PJK_NO;
            d.DEC_PERSEN_PPH = objDat.XXSHP_KDS_T_KLAIM_DTL[intRowIndex].DEC_PERSEN_PPH;
            d.DEC_PPH = objDat.XXSHP_KDS_T_KLAIM_DTL[intRowIndex].DEC_PPH;
            d.DEC_PPN = objDat.XXSHP_KDS_T_KLAIM_DTL[intRowIndex].DEC_PPN;
            d.DEC_INVOICE_AMT = objDat.XXSHP_KDS_T_KLAIM_DTL[intRowIndex].DEC_INVOICE_AMT;
            d.DEC_AMOUNT = objDat.XXSHP_KDS_T_KLAIM_DTL[intRowIndex].DEC_AMOUNT;
            d.BIT_ALLBRAND = objDat.XXSHP_KDS_T_KLAIM_DTL[intRowIndex].BIT_ALLBRAND;
           
            this.invalidate(); // invalidate the data DataTables has cached for this row         
        }
            intRowIndex++;
    });

    // Draw once all updates are done
    oTable.draw(false);
    p_SetHiddenObject(objDat);

}


//=======================
// HANDLER
//=======================
 
$('#btnRefresh').bind('click', function () {
    try {
        p_showBlank();
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
});

 