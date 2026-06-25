//=======================
// VARIABLE GLOBAL
//=======================
var clsGlobal = new clsGlobalClass();
var LOV;
var bitLoading = false;
var oTableDetail;
var adaID = false;


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
        case "txtDocNo": $("#txtDocNo").val(arr[1]);
            p_txtDocNo_TextChanged();
            break;
        case "txtBudgetID": $("#txtBudgetID").val(arr[1]);
            $("#ddlPeriod").val(arr[2]);
            $("#txtGroupAccount").val(arr[3]);
            $("#ddlBudgetType").val(arr[4]);
            p_txtBudgetID_TextChanged();
            break;
        case "txtPeriodAllocation":
            p_txtPeriodAllocation_Changed_LOV(arr[2]);
            break;
        case "txtPeriodMonth":
            $("#txtPeriodMonth").val(arr[2]);
            break;
        //case "txtDetailActivity":
        //    p_txtActivity_Changed_LOV(arr[1]);
        //    break;
        case "txtUmBrand":
            //p_settxtBrandDetail(arr[1]);
            p_settxtUmBrand(arr[1]);
            break;
    }
    clsGlobal.closeLOV();
}

function p_SetHiddenObject(objDat) {
    $("#txtHiddenObject").val(JSON.stringify(objDat));

    //AutoNumeric.
    p_GenerateAutoNumeric();
    p_GenerateDateTimePicker();
}


function p_GenerateAutoNumeric() {
    //
    $('.autonumeric').autoNumeric('init', { vMax: '9999999999999', vMin: '-9999999999999', aSep: ',', dGroup: '3', aDec: '.' });
}

function p_GenerateDateTimePicker() {
    //
    $('.datetimepicker').datepicker({
        autoclose: true,
    });

}
function p_GetHiddenObject() {
    return JSON.parse($("#txtHiddenObject").val());
}

function p_EnableControl(bitApply) {
    //
    if (bitApply == true) {
        $("#btnSave").hide();
        $("#btnSubmit").hide();
        $("#btnApprovalHistory").show();
        $("#fileUploadBudgetAllocationDetail").attr("disabled", "true");
        $(".Upload").attr("disabled", "true");
        $("#btnLOVBudgetID").attr("disabled", "true");
        $("#btnLOVPeriodMonth").attr("disabled", "true");
        $(".ddlPeriodName").attr("disabled", "true");

        $("#btnAddDetail").hide();

        $(".decOpenBalance").each(function (index) {
            $(this).attr("disabled", "true");
        });
        $(".btnLOVPeriodAllocation").each(function (index) {
            $(this).hide();
        });
        //$(".btnLOVDetailActivity").each(function (index) {
        //    $(this).hide();
        //});
        $(".btnUmBrandLOVID").each(function (index) {
            $(this).hide();
        });
        $(".btnDetailDelete").each(function (index) {
            $(this).hide();
        });

    } else {
        $("#btnSave").show();
        $("#btnSubmit").show();
        $("#btnApprovalHistory").hide();
        $("#fileUploadBudgetAllocationDetail").removeAttr("disabled");
        $(".Upload").removeAttr("disabled");
        $("#btnLOVBudgetID").removeAttr("disabled");
        $("#btnLOVPeriodMonth").removeAttr("disabled");
        $(".ddlPeriodName").removeAttr("disabled");

        $("#btnAddDetail").show();

        $(".decOpenBalance").each(function (index) {
            $(this).removeAttr("disabled");
        });
        $(".btnLOVPeriodAllocation").each(function (index) {
            $(this).show();
        });
        //$(".btnLOVDetailActivity").each(function (index) {
        //    $(this).show();
        //});
        $(".btnUmBrandLOVID").each(function (index) {
            $(this).show();
        });
        $(".btnDetailDelete").each(function (index) {
            $(this).show();
        });

    }
}

function p_DataToUI(objData) {
    //
    //$("#txtID").val(clsGlobal.parseToInteger(objData.INT_BGTACR_HDR_ID));
    $("#fileUploadBudgetAllocationDetail").val(objData.empty);
    $("#txtDocNo").val(clsGlobal.parseToString(objData.TXT_DOCNO));
    $("#txtBudgetID").val(clsGlobal.parseToInteger(objData.INT_BGT_HDR_ID));
    $("#lblStatusFlow").html(clsGlobal.parseToString(objData.TXT_STATUSFLOW)); 
    $("#ddlPeriod").val(objData.TXT_PERIOD); 
    $("#txtPeriodMonth").val(objData.TXT_PERIOD_MONTH);

    $("#totalAllocation").val(clsGlobal.parseToRupiah(objData.DEC_AMOUNT));
    $("#txtGroupAccount").val(objData.TXT_GROUP_ACCOUNT);
    $("#ddlBudgetType").val(objData.TXT_BUDGET_TYPE); 
    p_DataToUIDetail(objData.XXSHP_KDS_M_BGTALO_DTL); 
    p_SetHiddenObject(objData);
     
    p_EnableControl(clsGlobal.ParseBooleanOracleToNET(objData.BIT_APPLY));
    p_CheckForCancelCloseDocument(objData);
}
 
function p_CheckForCancelCloseDocument(objData) {
    $("#btnCancel").hide();
    $("#btnClose").hide();
    if(clsGlobal.ParseBooleanOracleToNET(objData.BIT_APPROVED) == true
        && clsGlobal.ParseBooleanOracleToNET(objData.BIT_CLOSED) == false
        && clsGlobal.ParseBooleanOracleToNET(objData.BIT_CANCELLED) == false)
    {
        $("#btnCancel").show();
    }
}

    function p_DataToUIBudget(objData) {
        //

        $("#txtBudgetID").val(clsGlobal.parseToInteger(objData.INT_BGT_HDR_ID));

        $("#ddlPeriod").val(objData.TXT_PERIOD);

        //$("#txtSupplierName").val(objData.TXT_SUPPLIER_NAME);
        //$("#intSupplierCode").val(objData.TXT_SUPPLIER_CODE);

        //$("#intSupplierSiteCode").val(objData.TXT_SUPPLIER_SITE_CODE);
        //$("#txtSupplierSiteName").val(objData.TXT_SUPPLIER_SITE_NAME);

        //$("#totalAllocation").val(clsGlobal.parseToRupiah(objData.DEC_AMOUNT));
        $("#txtGroupAccount").val(objData.TXT_GROUP_ACCOUNT);
        $("#ddlBudgetType").val(objData.TXT_BUDGET_TYPE);

        //p_DataToUIDetail(objData.XXSHP_KCO_M_BGTACR_DTL);
        p_SetHiddenObject(objData);

    }

    function p_DataToUIDetail(XXSHP_KDS_M_BGTALO_DTL) {
        //

        oTableDetail.clear();
        for (var i = 0; i < XXSHP_KDS_M_BGTALO_DTL.length; i++) {
            XXSHP_KDS_M_BGTALO_DTL[i].intIndex = i;
            XXSHP_KDS_M_BGTALO_DTL[i].DEC_OPENBALANCE = clsGlobal.parseToRupiah(XXSHP_KDS_M_BGTALO_DTL[i].DEC_OPENBALANCE);
            //p_PopulatePeriodNameAndSet(clsGlobal.parseToString(XXSHP_KCO_M_BGTACR_DTL[i].TXT_PERIOD_MONTH));
            //XXSHP_KCO_M_BGTACR_DTL[i].TXT_PERIOD_MONTH = clsGlobal.parseToString(XXSHP_KCO_M_BGTACR_DTL[i].TXT_PERIOD_MONTH);
            //p_PopulatePeriodNameAndSet(XXSHP_KCO_M_BGTACR_DTL[i].TXT_PERIOD_MONTH, XXSHP_KCO_M_BGTACR_DTL[i].intIndex);

            oTableDetail.row.add(XXSHP_KDS_M_BGTALO_DTL[i]);
            
        }
        oTableDetail.draw(false);

        //for (var i = 0; i < XXSHP_KCO_M_BGTACR_DTL.length; i++) {
        //    XXSHP_KCO_M_BGTACR_DTL[i].intIndex = i;

        //    p_PopulatePeriodNameAndSet(XXSHP_KCO_M_BGTACR_DTL[i].TXT_PERIOD_MONTH, XXSHP_KCO_M_BGTACR_DTL[i].intIndex);
        //    
        //}

        var objDat = p_GetHiddenObject();
        objDat.XXSHP_KDS_M_BGTALO_DTL = XXSHP_KDS_M_BGTALO_DTL;
        p_SetHiddenObject(objDat);

    }

    function p_UIToData() {
        //
        var jsonObj = [];
        jsonData = p_GetHiddenObject();
        jsonData.INT_BGTACR_HDR_ID = clsGlobal.parseToInteger($("#txtID").val());
        jsonData.TXT_DOCNO = clsGlobal.parseToString($("#txtDocNo").val());
        jsonData.INT_BGT_HDR_ID = clsGlobal.parseToInteger($("#txtBudgetID").val());
        jsonData.TXT_PERIOD = $("#ddlPeriod").val().toString();
        jsonData.TXT_PERIOD_MONTH = $("#txtPeriodMonth").val().toString();

        //jsonData.TXT_SUPPLIER_CODE = $("#intSupplierCode").val().toString();
        //jsonData.TXT_SUPPLIER_NAME = $("#txtSupplierName").val().toString();
        //jsonData.TXT_SUPPLIER_SITE_CODE = $("#intSupplierSiteCode").val().toString();
        //jsonData.TXT_SUPPLIER_SITE_NAME = $("#txtSupplierSiteName").val().toString();
        jsonData.TXT_GROUP_ACCOUNT = $("#txtGroupAccount").val().toString();
        jsonData.TXT_BUDGET_TYPE = $("#ddlBudgetType").val().toString();
        jsonData.DEC_AMOUNT = clsGlobal.parseToAngka($("#totalAllocation").val());

        p_SetHiddenObject(jsonData);
        return $("#txtHiddenObject").val();

    }

    function p_UploadBudgetAllocationDetail() {
        clsGlobal.getConfirmation("Upload Budget Allocation Detail?", function (result) {
            if (result == true) {
                var data = new FormData();
                var files = $("#fileUploadBudgetAllocationDetail").get(0).files;
                if (files.length > 0) {
                    data.append("fileUploadBudgetAllocationDetail", files[0]);
                    data.append("txtHiddenObject", $("#txtHiddenObject").val());
                }
                clsGlobal.showLoading();
                $.ajax({
                    type: "POST",
                    url: "/Master/BudgetAllocation/UploadBudgetAllocationDetail",
                    processData: false,
                    contentType: false,
                    data: data,
                    success: function (retDat) {
                        if (retDat.bitSuccess == true) {
                            if (retDat.objData != undefined) {
                                p_SetHiddenObject(retDat.objData);
                                p_DataToUIDetail(retDat.objData.XXSHP_KDS_M_BGTALO_DTL);
                                oTableDetail.page('last').draw(false);

                                $("#btnAddDetail").show();

                                var objDat = p_GetHiddenObject();
                                var index = objDat.XXSHP_KDS_M_BGTALO_DTL.length;
                                var Total = 0;

                                for (var i = 0; i <= index - 1; i++) {
                                    //var modulo = i % 5;
                                    Total = Total + clsGlobal.parseToAngka($('#dtDetail').DataTable().cell(i, 5).nodes().to$().find('input').val())
                                }

                                $("#totalAllocation").val(clsGlobal.parseToRupiah(Total));
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

    function p_DownloadBudgetAllocationDetail() {
        clsGlobal.getConfirmation("Download Template Budget Allocation Detail?", function (result) {
            if (result == true) {
                clsGlobal.showLoading();
                $.ajax({
                    type: "POST",
                    url: "/Master/BudgetAllocation/DownloadBudgetAllocationDetail",
                    data: { data: $("#txtHiddenObject").val(), txtGUID: $("#txtGUID").val(), __RequestVerificationToken: $('#frmBudgetAllocation input[name=__RequestVerificationToken]').val() },
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

    function p_initiateData() {
        clsGlobal.showLoading();
        $.ajax({
            type: "POST",
            url: "/Master/BudgetAllocation/InitiateData",
            data: { __RequestVerificationToken: $('#frmBudgetAllocation input[name=__RequestVerificationToken]').val() },
            datatype: "json",
            success: function (retDat) {

                if (retDat.bitSuccess == true) {
                    if (retDat.objData != undefined) {
                        adaID = false;
                        $("#txtHiddenObject").val(JSON.stringify(retDat.objData));
                        //p_InitiateDetail();
                        p_DataToUI(retDat.objData);
                        $("#txtGUID").val(retDat.txtGUID);
                        $("#txtBlankObject").val(JSON.stringify(retDat.objData));


                        p_getParameterID();
                        //$("#btnAddDetail").hide();
                        //$("#fileUploadBudgetAllocationDetail").attr("disabled", "true");
                        //$(".Upload").attr("disabled", "true");
                    } else {
                        p_showBlank();
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

    function p_getParameterID() {
        var id = $.getParameter("ID");
        if (id != undefined) {
            $("#txtDocNo").val(id);
            p_txtDocNo_TextChanged();
        }
    }

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
            "aLengthMenu": [[5, 10, 25, 50, 75, 100], [5, 10, 25, 50, 75, 100]],
            "iDisplayLength": 5,
            aoColumnDefs: [

                  {
                      aTargets: [0],
                      mRender: function (data, type, full) {
                          return '<div id="lblDetailNoValue"> ' + (full.intIndex + 1) + ' </div>';
                      }
                  },
                  //{
                  //    aTargets: [1],
                  //    sWidth: "200px",
                  //    mRender: function (data, type, full) {
                  //        return '    <div class="input-group"> ' +
                  //               '       <div class="input-group-btn"> ' +
                  //               '           <button type="button" class="btn btn-danger btnLOVPeriodAllocation" id="btnLOVPeriodAllocation" onclick="p_btnLOVPeriodAllocation_Click(this,' + full.intIndex + ')"> <i class="fa fa-search"></i></button> ' +
                  //               '       </div> ' +
                  //               '       <input type="text" class="form-control" id="txtPeriodAllocation' + full.intIndex + '" class="txtPeriodAllocation" onchange="p_txtPeriodAllocation_Changed(this,' + full.intIndex + ')"  value="' + full.TXT_PERIOD_MONTH + '" disabled> ' +
                  //               '   </div>';
                  //    }
                  //},              
                  //{
                  //    aTargets: [2],
                  //    mRender: function (data, type, full) {

                  //        return '    <div class="input-group"> ' +
                  //               '       <div class="input-group-btn"> ' +
                  //               '           <button type="button" class="btn btn-danger btnLOVDetailActivity" id="btnLOVDetailActivity" onclick="p_btnLOVDetailActivity_Click(this,' + full.intIndex + ')"> <i class="fa fa-search"></i></button> ' +
                  //               '       </div> ' +
                  //               '       <input type="text" class="form-control" id="txtDetailActivity' + full.intIndex + '" class="txtDetailActivity" onchange="p_txtDetailActivity_Changed(this,' + full.intIndex + ')"  value="' + full.TXT_ACTIVITY + '" disabled> ' +
                  //               '   </div>';
                  //    }
                  //},
                  {
                      aTargets: [1],
                      sWidth: "200px",
                      mRender: function (data, type, full) {
                          //return '<div > <div class="input-group"> <div class="input-group-btn"> <button type="button" class="btn btn-danger btnUmBrandLOVID" id="btnUmBrandLOVID" onclick="p_btnUmBrandLOVID(' + full.intIndex + ')"> <i class="fa fa-search"></i></button> </div> <input type="text" class="form-control" id="txtUmBrand' + full.intIndex + '" class="txtUmBrand" onchange="p_txtUmBrand_Changed(this,' + full.intIndex + ')"  value="' + full.TXT_UMBRAND + '" disabled> </div> </div>';
                          return '<div >  <input type="text" class="form-control" id="txtUmBrand' + full.intIndex + '" class="txtUmBrand" onchange="p_txtUmBrand_Changed(this,' + full.intIndex + ')"  value="' + full.TXT_UMBRAND + '" disabled> </div> '
                              + '<div style="display:none;"> ' + full.TXT_UMBRAND + ' </div>';
                      }
                  },
               {
                   aTargets: [2],
                   sWidth: "200px",
                   mRender: function (data, type, full) {
                       return '<div > <input type="text" class="form-control " id="txtSubUmBrand' + full.intIndex + '" class="txtSubUmBrand" onchange="p_txtSubUmBrand_Changed(this,' + full.intIndex + ')"  value="' + full.TXT_SUBUMBRAND
                           + '" disabled> </div> '
                             + '<div style="display:none;"> ' + full.TXT_SUBUMBRAND + ' </div>';

                   }
               },

               {
                   aTargets: [3],
                   sWidth: "200px",
                   mRender: function (data, type, full) {
                       return '<div >  <input type="text" class="form-control" id="txtLOB' + full.intIndex + '" class="txtLOB" onchange="p_txtLOB_Changed(this,' + full.intIndex + ')"  value="' + full.TXT_LOB + '" disabled>  </div>'
                        + '<div style="display:none;"> ' + full.TXT_LOB + ' </div>';

                   }
               },
               {
                   aTargets: [4],
                   sWidth: "200px",
                   mRender: function (data, type, full) {
                       return '<div >  <input type="text" class="form-control text-right decAvailable autonumeric" id="decAvailable" value="' + clsGlobal.FormatMoney(full.DEC_AVAILABLE, 0) + '" disabled>  </div>';
                   }
               },
               {
                   aTargets: [5],
                   sWidth: "200px",
                   mRender: function (data, type, full) {
                       return '<div >  <input type="text" class="form-control text-right decOpenBalance autonumeric" id="decOpenBalance' + full.intIndex + '" onchange="p_decOpenBalance_Changed(this,' + full.intIndex + ')"  value="' + full.DEC_OPENBALANCE + '" >  </div>';
                   }
               },
              {
                  aTargets: [6],
                  sWidth: "200px",
                  mRender: function (data, type, full) {
                      return '<div >  <input type="text" style="display:none" class="form-control" id="txtBudgetDetailID' + full.intIndex + '" class="txtBudgetDetailID" onchange="p_txtBudgetDetailID_Changed(this,' + full.intIndex + ')"  value="' + full.INT_BGT_DTL_ID + '" disabled>  </div>';

                  }
              }
                  //,
              // {
              //     aTargets: [7],
              //     mRender: function (data, type, full) {
              //         return '<div > <input type="button" class="btn btn-warning btnDetailDelete" id="btnDetailDelete" onclick="p_btnDetailDelete_Click(this,' + full.intIndex + ')"  value="Delete" >  </div>';

              //     }
              // }            

            ],
            "fnDrawCallback": function (oSettings) {
                p_GenerateAutoNumeric();
            }
        });

        $("#dtDetail").css("width", "100%");
        $('#dtDetail tbody').on('click', 'tr', function () {
            if (!$(this).hasClass('selected')) {
                oTableDetail.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
            }
        });
    }

    function p_txtDocNo_TextChanged() {
        clsGlobal.showLoading();
        $.ajax({
            type: "POST",
            url: "/Master/BudgetAllocation/GetData",
            data: { txtDocNo: $("#txtDocNo").val(), __RequestVerificationToken: $('#frmBudgetAllocation input[name=__RequestVerificationToken]').val() },
            datatype: "json",
            success: function (retDat) {
                
                if (retDat.bitSuccess == true) {
                    if (retDat.objData != undefined) {
                        if (retDat.objData.INT_BGTALO_HDR_ID != 0) {
                            adaID = true;
                        }
                        p_DataToUI(retDat.objData);
                        $("#txtGUID").val(retDat.txtGUID);

                    } else {
                        p_showBlank();
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

    function p_txtBudgetID_TextChanged() {
        clsGlobal.showLoading();
        $.ajax({
            type: "POST",
            url: "/Master/BudgetAllocation/GetDataBudget",
            data: {
                txtID: $("#txtBudgetID").val(),
                data: $("#txtBlankObject").val(),
                pTXT_PERIOD: $("#ddlPeriod").val(),
                pTXT_GROUP_ACCOUNT: $("#txtGroupAccount").val(),
                pTXT_BUDGET_TYPE: $("#ddlBudgetType").val(),
                __RequestVerificationToken: $('#frmBudgetAllocation input[name=__RequestVerificationToken]').val()
            },
            datatype: "json",
            success: function (retDat) {
                
                if (retDat.bitSuccess == true) {
                    if (retDat.objData != undefined) {
                        p_SetHiddenObject(retDat.objData);
                    
                        $("#txtBudgetID").val(clsGlobal.parseToInteger(retDat.objData.INT_BGT_HDR_ID));
                        $("#ddlPeriod").val(retDat.objData.TXT_PERIOD);
                        $("#totalAllocation").val(clsGlobal.parseToRupiah(retDat.objData.DEC_AMOUNT));
                        $("#txtGroupAccount").val(retDat.objData.TXT_GROUP_ACCOUNT);
                        $("#ddlBudgetType").val(retDat.objData.TXT_BUDGET_TYPE);
                        p_DataToUIDetail(retDat.objData.XXSHP_KDS_M_BGTALO_DTL);
                        p_SetHiddenObject(retDat.objData);
                        p_EnableControl(clsGlobal.ParseBooleanOracleToNET(retDat.objData.BIT_APPLY));

                        var Total = 0;
                        for (var i = 0; i <= $('#dtDetail tbody tr').length - 1; i++) {
                            Total = Total + clsGlobal.parseToAngka($('#dtDetail').DataTable().cell(i, 5).nodes().to$().find('input').val())
                        }
                        $("#totalAllocation").val(clsGlobal.parseToRupiah(Total));

                        $("#txtGUID").val(retDat.txtGUID); 
                    } else {
                        p_showBlank();
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

    function p_AddDetail() {
        
        clsGlobal.showLoading();
        $.ajax({
            type: "POST",
            url: "/Master/BudgetAllocation/AddRow",
            data: { data: $("#txtHiddenObject").val(), __RequestVerificationToken: $('#frmBudgetAllocation input[name=__RequestVerificationToken]').val() },
            datatype: "json",
            success: function (retDat) {
                
                if (retDat.bitSuccess == true) {
                    if (retDat.objData != undefined) {
                        p_SetHiddenObject(retDat.objData);
                        //p_PopulatePeriodNameAndSet();
                        p_DataToUIDetail(retDat.objData.XXSHP_KDS_M_BGTALO_DTL);
                        oTableDetail.page('last').draw(false);
                        p_EnableControl(false);

                        var index = $('#dtDetail tbody tr').length;
                        var Total = 0;
                        
                        for (var i = 0; i <= $('#dtDetail tbody tr').length - 1; i++) {
                            Total = Total + clsGlobal.parseToAngka($('#dtDetail').DataTable().cell(i, 5).nodes().to$().find('input').val())
                        }
                        $("#totalAllocation").val(clsGlobal.parseToRupiah(Total));
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

    function p_PopulatePeriodNameAndSet(txtValue) {
        clsGlobal.showLoading();
        
        $.ajax({
            type: "POST",
            url: "/Master/BudgetAllocation/PopulatePeriodName",
            data: { __RequestVerificationToken: $('#FormLogin input[name=__RequestVerificationToken]').val() },
            datatype: "json",
            success: function (retDat) {
                if (retDat.bitSuccess == true) {
                    
                    if (retDat.objData != undefined) {
                        $('#ddlPeriodName').empty();
                        $('#ddlPeriodName').append($('<option>').text("-").prop('value', "0"));
                        for (var i = 0; i < retDat.objData.length; i++) {
                            $('.ddlPeriodName').append($('<option>').text(retDat.objData[i].PERIOD_NAME).prop('value', retDat.objData[i].PERIOD_NAME));
                        }

                        if (txtValue != "") {
                            $("#ddlPeriodName").val(txtValue);
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

    function converter(id, intIndex) {
        var objDat = p_GetHiddenObject();
        var index = objDat.XXSHP_KDS_M_BGTALO_DTL.length;
        var Total = 0;

        for (var i = 0; i <= index - 1; i++) {
            Total = Total + clsGlobal.parseToAngka($('#dtDetail').DataTable().cell(i, 5).nodes().to$().find('input').val())
        }

        $("#totalAllocation").val(clsGlobal.parseToRupiah(Total));

        $("#" + id).val(clsGlobal.parseToRupiah(clsGlobal.parseToAngka($('#' + id).val())));

        //p_SetHiddenObject(objDat);
    }

    function p_decOpenBalance_Changed(objCaller, intIndex) {
        
        if (objCaller.value == "") {
            objCaller.value = "0"
        }
        // Parse dari HiddenObject->JSON
        var objData = JSON.parse(p_UIToData());
        for (i = 0; i < objData.XXSHP_KDS_M_BGTALO_DTL.length; i++) {
            // Cari Index-nya.
            if (objData.XXSHP_KDS_M_BGTALO_DTL[i].intIndex == intIndex) {
                // Ketemu, mulai dari sini:
                objData.XXSHP_KDS_M_BGTALO_DTL[i].DEC_OPENBALANCE = objCaller.value;

                break;
            }
        }
        p_SetHiddenObject(objData);
        calculateTotalAllocation();
    }

    function p_ddlPeriodName_Changed(objCaller, intIndex) {
        
        // Parse dari HiddenObject->JSON
        var objData = JSON.parse(p_UIToData());
        for (i = 0; i < objData.XXSHP_KDS_M_BGTALO_DTL.length; i++) {
            // Cari Index-nya.
            if (objData.XXSHP_KDS_M_BGTALO_DTL[i].intIndex == intIndex) {
                // Ketemu, mulai dari sini:
                objData.XXSHP_KDS_M_BGTALO_DTL[i].TXT_PERIOD_MONTH = objCaller.value;

                break;
            }
        }

        p_SetHiddenObject(objData);
    }

    function p_txtUmBrand_Changed(objCaller, intIndex) {
        
        // Parse dari HiddenObject->JSON
        var objData = JSON.parse(p_UIToData());
        for (i = 0; i < objData.XXSHP_KDS_M_BGTALO_DTL.length; i++) {
            // Cari Index-nya.
            if (objData.XXSHP_KDS_M_BGTALO_DTL[i].intIndex == intIndex) {
                // Ketemu, mulai dari sini:
                objData.XXSHP_KDS_M_BGTALO_DTL[i].TXT_UMBRAND = objCaller.value;
                break;
            }
        }
        p_SetHiddenObject(objData);
    }


    //function p_settxtBrand(intUmBrandID) {
    //    //var intSelectedIndex = p_GetSelectedDetailRow();
    //    
    //    //clsGlobal.showLoading();
    //    $.ajax({
    //        type: "POST",
    //        url: "/Master/Budget/GetDataBrand",
    //        data: { intUmBrandID: intUmBrandID, __RequestVerificationToken: $('#frmBudgetAccrued input[name=__RequestVerificationToken]').val() },
    //        datatype: "json",
    //        success: function (retDat) {
    //            
    //            //console.log(retDat.objData);
    //            if (retDat.bitSuccess == true) {
    //                if (retDat.objData != undefined) {
    //                    p_txtBrand_Changed_LOV(retDat.objData);
    //                    p_EnableControl(false);
    //                } else {
    //                    p_showBlank();
    //                }
    //            } else {
    //                clsGlobal.getAlert(retDat.txtMessage);
    //            }
    //            clsGlobal.hideLoading();

    //        },
    //        error: function (retDat) {
    //            
    //            clsGlobal.hideLoading();
    //        }
    //    });

    //}

    function p_settxtUmBrand(INT_BGT_DTL_ID) {
        //var intSelectedIndex = p_GetSelectedDetailRow();
        
        clsGlobal.showLoading();
        $.ajax({
            type: "POST",
            url: "/Master/BudgetAllocation/GetDataBrandByINT_BGT_DTL_ID",
            data: { INT_BGT_DTL_ID: INT_BGT_DTL_ID, __RequestVerificationToken: $('#frmBudgetAllocation input[name=__RequestVerificationToken]').val() },
            datatype: "json",
            success: function (retDat) {
                
                //console.log(retDat.objData);
                if (retDat.bitSuccess == true) {
                    if (retDat.objData != undefined) {
                        p_txtUmBrand_Changed_LOV(retDat.objData);
                        p_EnableControl(false);
                    } else {
                        p_showBlank();
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

    function p_btnDetailDelete_Click(objCaller, intIndex) {
        
        // Parse dari HiddenObject->JSON
        var objData = JSON.parse(p_UIToData());
        for (i = 0; i < objData.XXSHP_KDS_M_BGTALO_DTL.length; i++) {
            // Cari Index-nya.
            if (objData.XXSHP_KDS_M_BGTALO_DTL[i].intIndex == intIndex) {
                // Ketemu, mulai dari sini:
                // Remove from list.
                objData.XXSHP_KDS_M_BGTALO_DTL.splice(i, 1);

                oTableDetail.row(i).remove().draw(false);

                //p_PopulatePeriodNameAndSet();
                var objDat = p_GetHiddenObject();
                var index = objDat.XXSHP_KDS_M_BGTALO_DTL.length;
                var Total = 0;

                for (var i = 0; i <= index - 1; i++) {
                    Total = Total + clsGlobal.parseToAngka($('#dtDetail').DataTable().cell(i, 5).nodes().to$().find('input').val())
                }

                $("#totalAllocation").val(clsGlobal.parseToRupiah(Total));
                break;
            }
        }
        p_SetHiddenObject(objData);
        p_RefreshNumberDetail();
    }

    function p_RefreshNumberDetail() {
        
        var intRowIndex = 0;
        var objDat = p_GetHiddenObject();
        oTableDetail.rows().every(function (rowIdx, tableLoop, rowLoop) {
            
            var d = this.data();
            d.intIndex = intRowIndex; // update data source for the row
            objDat.XXSHP_KDS_M_BGTALO_DTL[intRowIndex].intIndex = d.intIndex;
            //objDat.XXSHP_KCO_M_BGT_HDR[intRowIndex].intIndex = d.intIndex;
            d.TXT_PERIOD_MONTH = objDat.XXSHP_KDS_M_BGTALO_DTL[intRowIndex].TXT_PERIOD_MONTH;
            //d.TXT_ACTIVITY = objDat.XXSHP_KCO_M_BGTACR_DTL[intRowIndex].TXT_ACTIVITY;
            d.TXT_LOB = objDat.XXSHP_KDS_M_BGTALO_DTL[intRowIndex].TXT_LOB;
            d.TXT_UMBRAND = objDat.XXSHP_KDS_M_BGTALO_DTL[intRowIndex].TXT_UMBRAND;
            d.TXT_SUBUMBRAND = objDat.XXSHP_KDS_M_BGTALO_DTL[intRowIndex].TXT_SUBUMBRAND;
            d.DEC_OPENBALANCE = objDat.XXSHP_KDS_M_BGTALO_DTL[intRowIndex].DEC_OPENBALANCE;
            d.DEC_AVAILABLE = objDat.XXSHP_KDS_M_BGTALO_DTL[intRowIndex].DEC_AVAILABLE;

            intRowIndex++;
            this.invalidate(); // invalidate the data DataTables has cached for this row         
        });

        // Draw once all updates are done
        oTableDetail.draw(false);
        p_SetHiddenObject(objDat);
    }

    function p_txtUmBrand_Changed_LOV(objDat) {
        
        // Parse dari HiddenObject->JSON
        var objData = JSON.parse(p_UIToData());
        var IndexUmbrand = p_GetCurrentRowUmbrand();

        objData.XXSHP_KDS_M_BGTALO_DTL[IndexUmbrand].TXT_UMBRAND = objDat.TXT_UMBRAND.toString();
        $("#txtUmBrand" + IndexUmbrand).val(objDat.TXT_UMBRAND.toString());

        objData.XXSHP_KDS_M_BGTALO_DTL[IndexUmbrand].TXT_LOB = objDat.TXT_LOB.toString();
        $("#txtLOB" + IndexUmbrand).val(objDat.TXT_LOB.toString());

        objData.XXSHP_KDS_M_BGTALO_DTL[IndexUmbrand].TXT_SUBUMBRAND = objDat.TXT_SUBUMBRAND.toString();
        $("#txtSubUmBrand" + IndexUmbrand).val(objDat.TXT_SUBUMBRAND.toString());

        objData.XXSHP_KDS_M_BGTALO_DTL[IndexUmbrand].INT_BGT_DTL_ID = objDat.INT_BGT_DTL_ID.toString();
        $("#txtBudgetDetailID" + IndexUmbrand).val(objDat.INT_BGT_DTL_ID.toString());

        p_SetHiddenObject(objData);
    }

    function p_txtPeriodAllocation_Changed_LOV(objDat) {
        
        // Parse dari HiddenObject->JSON
        var objData = JSON.parse(p_UIToData());
        var IndexUmbrand = p_GetCurrentRowUmbrand();

        objData.XXSHP_KDS_M_BGTALO_DTL[IndexUmbrand].TXT_PERIOD_MONTH = objDat;
        $("#txtPeriodAllocation" + IndexUmbrand).val(objDat);

        p_SetHiddenObject(objData);
    }

    //function p_txtActivity_Changed_LOV(objDat) {
    //    
    //    // Parse dari HiddenObject->JSON
    //    var objData = JSON.parse(p_UIToData());
    //    var IndexUmbrand = p_GetCurrentRowUmbrand();

    //    objData.XXSHP_KCO_M_BGTACR_DTL[IndexUmbrand].TXT_ACTIVITY = objDat;
    //    $("#txtDetailActivity" + IndexUmbrand).val(objDat);

    //    p_SetHiddenObject(objData);
    //}

    function p_SetCurrentRowUmbrand(intIndex) {
        
        $("#txtCurrentUmbrandRow").val(intIndex);
    }

    function p_GetCurrentRowUmbrand() {
        
        var index = $("#txtCurrentUmbrandRow").val();
        return index;
    }

    function p_btnLOVPeriodAllocation_Click(objCaller, intIndex) {
        
        p_SetCurrentRowUmbrand(intIndex);
        var PeriodAllocation = $("#ddlPeriod").val();
        try {
            LOV = clsGlobal.generateLOV(LOV_ORG_ACCT_PERIODS_V, "txtPeriodAllocation", PeriodAllocation);
        } catch (ex) {
            clsGlobal.showAlert(ex);
        }
    }


    function p_btnUmBrandLOVID(objCaller, intIndex) {
        
        p_SetCurrentRowUmbrand(objCaller);
        try {
            //LOV = clsGlobal.generateLOV(LOV_BUDGETDETAIL, "txtUmBrand");
            LOV = clsGlobal.generateLOV(LOV_SUBUMBRAND_BYBUDGET_HEADER, "txtUmBrand", $("#txtBudgetID").val());
        } catch (ex) {
            clsGlobal.showAlert(ex);
        }

    }

    //function p_btnLOVDetailActivity_Click(objCaller, intIndex) {
    //    
    //    p_SetCurrentRowUmbrand(intIndex);
    //    try {
    //        LOV = clsGlobal.generateLOV(MODULE_ACTIVITY, "txtDetailActivity");
    //    } catch (ex) {
    //        clsGlobal.showAlert(ex);
    //    }
    //}

    function p_saveData() {
        
        clsGlobal.showLoading();
        p_UIToData();
        $.ajax({
            type: "POST",
            url: "/Master/BudgetAllocation/SaveData",
            data: { data: $("#txtHiddenObject").val(), txtGUID: $("#txtGUID").val(), __RequestVerificationToken: $('#frmBudgetAllocation input[name=__RequestVerificationToken]').val() },
            datatype: "json",
            success: function (retDat) {
                
                if (retDat.bitSuccess == true) {
                    //p_disabled();
                    p_DataToUI(retDat.objData);
                    adaID = true;
                    clsGlobal.getInformationMessage(retDat.txtMessage);
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


    function p_submitData() {
        clsGlobal.showLoading();
        p_UIToData();
        $.ajax({
            type: "POST",
            url: "/Master/BudgetAllocation/SubmitData",
            data: { data: $("#txtHiddenObject").val(), txtGUID: $("#txtGUID").val(), __RequestVerificationToken: $('#frmBudgetAllocation input[name=__RequestVerificationToken]').val() },
            datatype: "json",
            success: function (retDat) {
                
                if (retDat.bitSuccess == true) {
                    p_DataToUI(retDat.objData);
                    clsGlobal.getInformationMessage(retDat.txtMessage);
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


    function p_closeDocument() {

        clsGlobal.showLoading();
        p_UIToData();
        $.ajax({
            type: "POST",
            url: "/Master/BudgetAllocation/CloseDocument",
            data: { data: $("#txtHiddenObject").val(), txtGUID: $("#txtGUID").val(), __RequestVerificationToken: $('#frmBudgetAllocation input[name=__RequestVerificationToken]').val() },
            datatype: "json",
            success: function (retDat) {
                
                if (retDat.bitSuccess == true) {
                    //window.open(retDat.objData,'_blank');
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

    function p_cancelDocument() {

        clsGlobal.showLoading();
        p_UIToData();
        $.ajax({
            type: "POST",
            url: "/Master/BudgetAllocation/CancelDocument",
            data: { data: $("#txtHiddenObject").val(), txtGUID: $("#txtGUID").val(), __RequestVerificationToken: $('#frmBudgetAllocation input[name=__RequestVerificationToken]').val() },
            datatype: "json",
            success: function (retDat) {
                
                if (retDat.bitSuccess == true) {
                    //window.open(retDat.objData,'_blank');
                    p_DataToUI(retDat.objData);
                    clsGlobal.getInformationMessage(retDat.txtMessage);
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

    function calculateTotalAllocation() {
        var objData = JSON.parse(p_UIToData());
        var totalAllocation = 0;
        for (i = 0; i < objData.XXSHP_KDS_M_BGTALO_DTL.length; i++) {
            totalAllocation += clsGlobal.parseToDecimal(objData.XXSHP_KDS_M_BGTALO_DTL[i].DEC_OPENBALANCE);
        }
        objData.DEC_AMOUNT = totalAllocation;
        $("#totalAllocation").val(clsGlobal.parseToRupiah(totalAllocation));
        p_SetHiddenObject(objData);
    }
 
    //=======================
    // HANDLER
    //=======================


    $('#btnLOVDocNo').bind('click', function () {
        try {
            LOV = clsGlobal.generateLOV(MODULE_BUDGETALLOCATION, "txtDocNo");
        } catch (ex) {
            clsGlobal.showAlert(ex);
        }
    });

    $('#btnLOVBudgetID').bind('click', function () {
        try {
            LOV = clsGlobal.generateLOV(MODULE_BUDGET_BYKAM, "txtBudgetID");
        } catch (ex) {
            clsGlobal.showAlert(ex);
        }
    });

    $('#btnLOVPeriodMonth').bind('click', function () {
        try {
            var PeriodAllocation = $("#ddlPeriod").val();
            try {
                LOV = clsGlobal.generateLOV(LOV_ORG_ACCT_PERIODS_V, "txtPeriodMonth", PeriodAllocation);
            } catch (ex) {
                clsGlobal.showAlert(ex);
            }
        } catch (ex) {
            clsGlobal.showAlert(ex);
        }
    });

    $('#btnAddDetail').on('click', function () {
        try {
            p_AddDetail();
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
            LOV = clsGlobal.generateLOV(MODULE_BUDGETALLOCATION, "txtDocNo");
        } catch (ex) {
            clsGlobal.showAlert(ex);
        }
    }); 

    $('#btnApprovalHistory').bind('click', function () {
        try {
            var fancyboxdata = p_GetHiddenObject();
            LOV = clsGlobal.generatePopUpIframeSmall($(location).attr('protocol') + "//" + $(location).attr('host') + "/Master/ApprovalHistory/Index?TXT_TYPEDOC=" + "&TXT_REF_DOCNO=" + fancyboxdata.TXT_DOCNO + "&INT_DOCID=" + fancyboxdata.INT_BGTALO_HDR_ID, "btnApprovalHistory", fancyboxdata);
        
        } catch (ex) {
            clsGlobal.showAlert(ex);
        }
    }); 



    $("#btnClose").on("click", function (e) {
        try {
            clsGlobal.getConfirmation("Close and reverse budget for this document?", function (result) {
                if (result == true) {
                    p_closeDocument();
                }
                else {
                    return false;
                }
            });
        } catch (ex) {
            clsGlobal.showAlert(ex);
        }
    });



    $("#btnCancel").on("click", function (e) {
        try {
            clsGlobal.getConfirmation("Cancel and reverse budget for this document?", function (result) {
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
