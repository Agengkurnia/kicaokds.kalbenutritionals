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
        case "txtID": $("#txtID").val(arr[1]);
            p_txtID_TextChanged();
            break;
        case "txtUserIDKAM":
            $("#txtUserIDKAM").val(arr[1]);
            $("#txtUserKAM").val(arr[2]);
            break;       
        case "txtUserIDAdminKAM":
            $("#txtUserIDAdminKAM").val(arr[1]);
            $("#txtUserAdminKAM").val(arr[2]);
            break;      
        case "txtDetailGroupSupplierId":
            p_settxtDetailGroupSupplierId(arr[1], arr[2], arr[3], arr[4]);
            break;
        
    }
    clsGlobal.closeLOV();
}


function p_DataToUI(objData) {
    
    $("#txtID").val(clsGlobal.parseToInteger(objData.INT_ASSIGN_SUP_HDR_ID));
            
    $("#txtUserIDKAM").val(clsGlobal.parseToString(objData.INT_USER_ID_ASSIGN));

    //$("#txtUserKAM").val(clsGlobal.parseToString(objData.TXT_GROUP_ACCOUNT));

    $.ajax({
        type: "POST",
        url: "/System/User/GetData",
        data: { txtID: $("#txtUserIDKAM").val(), __RequestVerificationToken: $('#frmAssignSupplier input[name=__RequestVerificationToken]').val() },
        datatype: "json",
        success: function (retDat) {
            if (retDat.bitSuccess == true)
            {
                if (retDat.objData != undefined)
                {
                    //p_SetHiddenObject(retDat.objData);
                    //p_DataToUIDetail(retDat.objData.XXSHP_KCO_T_KLAIM_DTL);
                    $("#txtUserKAM").val(clsGlobal.parseToString(retDat.objData.TXT_FULLNAME));
                    //oTable.page('last').draw(false);
                    }
            } else {
                clsGlobal.getAlert(retDat.txtMessage);
            }
        },
        error: function (retDat) {
            clsGlobal.hideLoading();
        }
    });


    $("#txtUserIDAdminKAM").val(clsGlobal.parseToString(objData.INT_ADMINKAM));
    $.ajax({
        type: "POST",
        url: "/System/User/GetData",
        data: { txtID: $("#txtUserIDAdminKAM").val(), __RequestVerificationToken: $('#frmAssignSupplier input[name=__RequestVerificationToken]').val() },
        datatype: "json",
        success: function (retDat) {
            if (retDat.bitSuccess == true) {
                if (retDat.objData != undefined) { 
                    $("#txtUserAdminKAM").val(clsGlobal.parseToString(retDat.objData.TXT_FULLNAME));
                }
            } else {
                clsGlobal.getAlert(retDat.txtMessage);
            }
        },
        error: function (retDat) {
            clsGlobal.hideLoading();
        }
    });
     
        
    $("#txtKeterangan").val(clsGlobal.parseToString(objData.TXT_KETERANGAN));
    $("#txtPeriodAktifFrom").val(clsGlobal.parseToDateTimeFromJSON(objData.DTM_PERIOD_FROM, clsDateFormat));
    $("#txtPeriodAktifTo").val(clsGlobal.parseToDateTimeFromJSON(objData.DTM_PERIOD_TO, clsDateFormat));

    $("#lblDateValue").html(clsGlobal.parseToDateTimeFromJSON(objData.CREATION_DATE, clsDateFormat));

    if (objData.BIT_APPLY=="Y")
        { $("#lblStatusValue").html("Sudah Apply");
    
    } else {
        $("#lblStatusValue").html("Belum Apply");
    }

        
    p_DataToUIDetail(objData.XXSHP_KDS_M_ASSIGN_SUP_DTL);
    p_EnableControl(clsGlobal.ParseBooleanOracleToNET(objData.BIT_APPLY));
    p_SetHiddenObject(objData);

    
}

function p_SetHiddenObject(objDat) {
    $("#txtHiddenObject").val(JSON.stringify(objDat));
    
    //AutoNumeric.
    p_GenerateAutoNumeric()
    p_GenerateDateTimePicker();
}

function p_GenerateDateTimePicker() {
    
    $('.datetimepicker').datepicker({
        autoclose: true,
    });

}

function p_GenerateAutoNumeric() {
    
    $('.autonumeric').autoNumeric('init', { vMax: '9999999999999', vMin: '-9999999999999', aSep: ',', dGroup: '3', aDec: '.' });
}

function p_GetHiddenObject() {
    return JSON.parse($("#txtHiddenObject").val());
}

function p_DataToUIDetail(XXSHP_KDS_M_ASSIGN_SUP_DTL) {
    
    oTable.clear();
    for (var i = 0; i < XXSHP_KDS_M_ASSIGN_SUP_DTL.length; i++) {
        XXSHP_KDS_M_ASSIGN_SUP_DTL[i].intIndex = i;
        oTable.row.add(XXSHP_KDS_M_ASSIGN_SUP_DTL[i]);
    }
    oTable.draw(false);

    var objDat = p_GetHiddenObject();
    objDat.XXSHP_KDS_M_ASSIGN_SUP_DTL = XXSHP_KDS_M_ASSIGN_SUP_DTL;
    p_SetHiddenObject(objDat);
}

function p_initiateData() {
    clsGlobal.showLoading();
    $.ajax({
        type: "POST",
        url: "/Master/AssignSupplier/InitiateData",
        data: { __RequestVerificationToken: $('#frmAssignSupplier input[name=__RequestVerificationToken]').val() },
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
        $("#txtID").val(id);
        p_txtID_TextChanged();
    }
}

function p_UIToData() {
    var jsonObj = [];
    
    jsonData = p_GetHiddenObject();

    jsonData.INT_ASSIGN_SUP_HDR_ID = clsGlobal.parseToInteger($("#txtID").val());
    jsonData.INT_USER_ID_ASSIGN = $("#txtUserIDKAM").val().toString();
    jsonData.INT_ADMINKAM = $("#txtUserIDAdminKAM").val().toString();
    jsonData.TXT_KETERANGAN = $("#txtKeterangan").val().toString();
    jsonData.DTM_PERIOD_FROM = clsGlobal.parseToJSONDateFromDate($("#txtPeriodAktifFrom").val(), clsDateFormat);
    jsonData.DTM_PERIOD_TO = clsGlobal.parseToJSONDateFromDate($("#txtPeriodAktifTo").val(), clsDateFormat);
     
    p_SetHiddenObject(jsonData);
    return $("#txtHiddenObject").val();

}


function p_EnableControl(bitApply) {
    
    if (bitApply == true) {
                
        $("#btnSave").hide();
        $("#btnSubmit").hide();
        $("#btnDelete").hide();

        $("#btnLOVID").hide();
        $("#btnLOVUserKAM").hide();

        $("#btnAddDetail").hide();

        $("#txtKeterangan").attr("disabled", "true");

        $("#txtPeriodAktifFrom").attr("disabled", "true");
        $("#txtPeriodAktifTo").attr("disabled", "true");


        $(".btnDetailDelete").each(function (index) {
            $(this).hide();
        });
        $(".btnLOVDetailGroupSupplier").each(function (index) {
            $(this).hide();
        });

        
    } else {
        $("#btnSave").show();
        $("#btnSubmit").show();
        $("#btnDelete").show();

        $("#btnLOVID").show();
        $("#btnLOVUserKAM").show();
        
        $("#btnAddDetail").show();

        $("#txtKeterangan").removeAttr("disabled");
        $("#txtPeriodAktifFrom").removeAttr("disabled");
        $("#txtPeriodAktifTo").removeAttr("disabled");

        $(".btnDetailDelete").each(function (index) {
            $(this).removeAttr("disabled");
        });
        $(".btnLOVDetailGroupSupplier").each(function (index) {
            $(this).removeAttr("disabled");
        });
       
    }
}



function p_txtID_TextChanged() {
    clsGlobal.showLoading();
    $.ajax({
        type: "POST",
        url: "/Master/AssignSupplier/GetData",
        data: { txtID: $("#txtID").val(), __RequestVerificationToken: $('#frmAssignSupplier input[name=__RequestVerificationToken]').val() },
        datatype: "json",
        success: function (retDat) {

            if (retDat.bitSuccess == true) {
                if (retDat.objData != undefined) {
                    p_DataToUI(retDat.objData);

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



function p_saveData() {

    clsGlobal.showLoading();
    p_UIToData();
    $.ajax({
        type: "POST",
        url: "/Master/AssignSupplier/SaveData",
        data: { data: $("#txtHiddenObject").val(), __RequestVerificationToken: $('#frmAssignSupplier input[name=__RequestVerificationToken]').val() },
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

function p_submitData() {

    clsGlobal.showLoading();
    p_UIToData();


    $.ajax({
        type: "POST",
        url: "/Master/AssignSupplier/SubmitData",
        data: { data: $("#txtHiddenObject").val(), txtGUID: $("#txtGUID").val(), __RequestVerificationToken: $('#frmAssignSupplier input[name=__RequestVerificationToken]').val() },
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

function p_deleteData() {
    clsGlobal.showLoading();
    p_UIToData();
    $.ajax({
        type: "POST",
        url: "/Master/AssignSupplier/DeleteData",
        data: { data: $("#txtHiddenObject").val(), __RequestVerificationToken: $('#frmAssignSupplier input[name=__RequestVerificationToken]').val() },
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


function p_AddRow() {
    
    clsGlobal.showLoading();
    $.ajax({
        type: "POST",
        url: "/Master/AssignSupplier/AddRow",
        data: { data: $("#txtHiddenObject").val(), __RequestVerificationToken: $('#frmAssignSupplier input[name=__RequestVerificationToken]').val() },
        datatype: "json",
        success: function (retDat) {

            if (retDat.bitSuccess == true) {
                if (retDat.objData != undefined) {
                    p_SetHiddenObject(retDat.objData);
                    p_DataToUIDetail(retDat.objData.XXSHP_KDS_M_ASSIGN_SUP_DTL);
                    oTable.page('last').draw(false);
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


function p_InitiateDetail() {
    // Format datatable  
    
    oTable = $('#dtDetail').DataTable({
        "bPaginate": true,
        "bSort": false,
        searching: false,
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
                   return '     <div class="input-group"> ' +
                            '       <div class="input-group-btn"> ' +
                            '           <button type="button" class="btn btn-danger btnLOVDetailGroupSupplier" id="btnLOVDetailGroupSupplier" onclick="p_btnLOVDetailGroupSupplier_Click(this,' + full.intIndex + ')"> <i class="fa fa-search"></i></button> ' +
                            '       </div> ' +
                            '       <input type="text" class="form-control txtDetailGroupSupplierId" id="txtDetailGroupSupplierId"  style="width:150px;"  value="' + full.INT_KSUP_HDR_ID + '" disabled> ' +
                            '   </div>';
               }
           },
           {
               aTargets: [2],
               mRender: function (data, type, full) {
                   return '<div >  <input type="text" class="form-control txtDetailGroupAccount text-left" id="txtDetailGroupAccount' + full.intIndex + '"  onchange="p_txtDetailGroupAccount_Changed(this,' + full.intIndex + ')"   value="' + full.TXT_GROUP_ACCOUNT + '" >  </div>';
               }
           },
           {
               aTargets: [3],
               mRender: function (data, type, full) {
                   return '<div >  <input type="text" class="form-control txtDetailSupplierId text-left"  style="width:100px;" id="txtDetailSupplierId' + full.intIndex + '"  value="' + full.INT_SUPPLIER_ID + '"  disabled>  </div>';
               }
           },
           {
               aTargets: [4],
               mRender: function (data, type, full) {
                   return '<div >  <input type="text" class="form-control txtDetailSupplierName text-left"  style="width:150px;" id="txtDetailSupplierName' + full.intIndex + '"  value="' + full.TXT_SUPPLIER_NAME + '" >  </div>';
               }
           },
            {
                aTargets: [5],
                mRender: function (data, type, full) {
                    return '<div > <input type="button" class="btn btn-warning btnDetailDelete" id="btnDetailDelete"  onclick="p_btnDetailDelete_Click(this,' + full.intIndex + ')"  value="Delete" >  </div>';
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



function p_btnLOVDetailGroupSupplier_Click(objCaller, intIndex) {
    LOV = clsGlobal.generateLOV(LOV_ASSIGN_SUPPLIER, "txtDetailGroupSupplierId");
}


function p_settxtDetailGroupSupplierId(int_ksup_hdr_id,txt_group_account,int_supplier_id,txt_supplier_name) {
    var intSelectedIndex = p_GetSelectedDetailRow();
    var intRowIndex = 0;
    var objDat = p_GetHiddenObject();
    
    for (i = 0; i < objDat.XXSHP_KDS_M_ASSIGN_SUP_DTL.length; i++)
    {
        // if (objDat.XXSHP_KCO_M_ASSIGN_SUP_DTL[i].intIndex != intRowIndex)
        //{
        if (objDat.XXSHP_KDS_M_ASSIGN_SUP_DTL[i].INT_KSUP_HDR_ID == int_ksup_hdr_id) {
            clsGlobal.showAlert("Grup Supplier " + (objCaller.value) + " sudah ada di baris ke " + (i + 1) + "!");
            return;
        }
        //}


    }

    oTable.rows().every(function (rowIdx, tableLoop, rowLoop) {
        
        var d = this.data();



        if (intRowIndex == intSelectedIndex) {
            d.intIndex = intRowIndex; // update data source for the row 

            d.INT_KSUP_HDR_ID = int_ksup_hdr_id;
            d.TXT_GROUP_ACCOUNT = txt_group_account;
            d.INT_SUPPLIER_ID = int_supplier_id;
            d.TXT_SUPPLIER_NAME = txt_supplier_name;

            objDat.XXSHP_KDS_M_ASSIGN_SUP_DTL[intRowIndex].INT_KSUP_HDR_ID = int_ksup_hdr_id;
            objDat.XXSHP_KDS_M_ASSIGN_SUP_DTL[intRowIndex].TXT_GROUP_ACCOUNT = txt_group_account;
            objDat.XXSHP_KDS_M_ASSIGN_SUP_DTL[intRowIndex].INT_SUPPLIER_ID = int_supplier_id;
            objDat.XXSHP_KDS_M_ASSIGN_SUP_DTL[intRowIndex].TXT_SUPPLIER_NAME = txt_supplier_name;
            
            this.invalidate(); // invalidate the data DataTables has cached for this row         
            p_EnableControl(objDat.bitApply);
        }

        intRowIndex++;
    });

    p_SetHiddenObject(objDat);

}

//onclick



//onchange

function p_txtDetailProgramDesc_Changed(objCaller, intIndex) {
    
    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());
    for (i = 0; i < objData.XXSHP_KDS_M_ASSIGN_SUP_DTL.length; i++) {
        // Cari Index-nya.
        if (objData.XXSHP_KDS_M_ASSIGN_SUP_DTL[i].intIndex == intIndex) {
            // Ketemu, mulai dari sini:
            objData.XXSHP_KDS_M_ASSIGN_SUP_DTL[i].TXT_PROGRAM_DESC = objCaller.value;
            break;
        }
    }
    p_SetHiddenObject(objData);
}

function p_txtDetailInvoiceNo_Changed(objCaller, intIndex) {
    
    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());
    for (i = 0; i < objData.XXSHP_KDS_M_ASSIGN_SUP_DTL.length; i++) {
        // Cari Index-nya.
        if (objData.XXSHP_KDS_M_ASSIGN_SUP_DTL[i].intIndex == intIndex) {
            // Ketemu, mulai dari sini:
            objData.XXSHP_KDS_M_ASSIGN_SUP_DTL[i].TXT_INVOICE_NO = objCaller.value;
            break;
        }
    }
    p_SetHiddenObject(objData);
}

function p_txtDetaildtm_period_from_Changed(objCaller, intIndex) {
    
    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());
    for (i = 0; i < objData.XXSHP_KDS_M_ASSIGN_SUP_DTL.length; i++) {
        // Cari Index-nya.
        if (objData.XXSHP_KDS_M_ASSIGN_SUP_DTL[i].intIndex == intIndex) {
            // Ketemu, mulai dari sini:
            objData.XXSHP_KDS_M_ASSIGN_SUP_DTL[i].DTM_PERIOD_FROM = objCaller.value;
            break;
        }
    }
    p_SetHiddenObject(objData);
}

function p_txtDetaildtm_period_to_Changed(objCaller, intIndex) {
    
    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());
    for (i = 0; i < objData.XXSHP_KDS_M_ASSIGN_SUP_DTL.length; i++) {
        // Cari Index-nya.
        if (objData.XXSHP_KDS_M_ASSIGN_SUP_DTL[i].intIndex == intIndex) {
            // Ketemu, mulai dari sini:
            objData.XXSHP_KDS_M_ASSIGN_SUP_DTL[i].DTM_PERIOD_TO = objCaller.value;
            break;
        }
    }
    p_SetHiddenObject(objData);
}



function p_txtDetaildtm_period_to_Changed(objCaller, intIndex) {
    
    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());
    for (i = 0; i < objData.XXSHP_KDS_M_ASSIGN_SUP_DTL.length; i++) {
        // Cari Index-nya.
        if (objData.XXSHP_KDS_M_ASSIGN_SUP_DTL[i].intIndex == intIndex) {
            // Ketemu, mulai dari sini:
            objData.XXSHP_KDS_M_ASSIGN_SUP_DTL[i].DTM_PERIOD_TO = objCaller.value;
            break;
        }
    }
    p_SetHiddenObject(objData);
}

function p_txtDetailInvoiceNo_Changed(objCaller, intIndex) {
    
    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());
    for (i = 0; i < objData.XXSHP_KDS_M_ASSIGN_SUP_DTL.length; i++) {
        // Cari Index-nya.
        if (objData.XXSHP_KDS_M_ASSIGN_SUP_DTL[i].intIndex == intIndex) {
            // Ketemu, mulai dari sini:
            objData.XXSHP_KDS_M_ASSIGN_SUP_DTL[i].TXT_INVOICE_NO = objCaller.value;
            break;
        }
    }
    p_SetHiddenObject(objData);
}

function p_txtDetailInvoiceDate_Changed(objCaller, intIndex) {
    
    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());
    for (i = 0; i < objData.XXSHP_KDS_M_ASSIGN_SUP_DTL.length; i++) {
        // Cari Index-nya.
        if (objData.XXSHP_KDS_M_ASSIGN_SUP_DTL[i].intIndex == intIndex) {
            // Ketemu, mulai dari sini:
            objData.XXSHP_KDS_M_ASSIGN_SUP_DTL[i].DTM_PERIOD_FROM = objCaller.value;
            break;
        }
    }
    p_SetHiddenObject(objData);
}

function p_txtFakturPajakNo_Changed(objCaller, intIndex) {
    
    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());
    for (i = 0; i < objData.XXSHP_KDS_M_ASSIGN_SUP_DTL.length; i++) {
        // Cari Index-nya.
        if (objData.XXSHP_KDS_M_ASSIGN_SUP_DTL[i].intIndex == intIndex) {
            // Ketemu, mulai dari sini:
            objData.XXSHP_KDS_M_ASSIGN_SUP_DTL[i].TXT_FKT_PJK_NO = objCaller.value;
            break;
        }
    }
    p_SetHiddenObject(objData);
}


function p_txtFakturPajakDate_Changed(objCaller, intIndex) {
    
    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());
    for (i = 0; i < objData.XXSHP_KDS_M_ASSIGN_SUP_DTL.length; i++) {
        // Cari Index-nya.
        if (objData.XXSHP_KDS_M_ASSIGN_SUP_DTL[i].intIndex == intIndex) {
            // Ketemu, mulai dari sini:
            objData.XXSHP_KDS_M_ASSIGN_SUP_DTL[i].DTM_FKT_PJK = objCaller.value;
            break;
        }
    }
    p_SetHiddenObject(objData);
}

function p_txtDetailInvoiceAmount_Changed(objCaller, intIndex) {
    
    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());
    for (i = 0; i < objData.XXSHP_KDS_M_ASSIGN_SUP_DTL.length; i++) {
        // Cari Index-nya.
        if (objData.XXSHP_KDS_M_ASSIGN_SUP_DTL[i].intIndex == intIndex) {
            // Ketemu, mulai dari sini:
            objData.XXSHP_KDS_M_ASSIGN_SUP_DTL[i].DEC_INVOICE_AMT = objCaller.value;
            break;
        }
    }
    p_SetHiddenObject(objData);
}

function p_txtDetailInvoiceAmount_Changed(objCaller, intIndex) {
    
    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());
    for (i = 0; i < objData.XXSHP_KDS_M_ASSIGN_SUP_DTL.length; i++) {
        // Cari Index-nya.
        if (objData.XXSHP_KDS_M_ASSIGN_SUP_DTL[i].intIndex == intIndex) {
            // Ketemu, mulai dari sini:
            objData.XXSHP_KDS_M_ASSIGN_SUP_DTL[i].DEC_INVOICE_AMT = objCaller.value;
            break;
        }
    }
    p_SetHiddenObject(objData);
}

function p_txtDetailPersenPPH_Changed(objCaller, intIndex) {
    
    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());
    for (i = 0; i < objData.XXSHP_KDS_M_ASSIGN_SUP_DTL.length; i++) {
        // Cari Index-nya.
        if (objData.XXSHP_KDS_M_ASSIGN_SUP_DTL[i].intIndex == intIndex) {
            // Ketemu, mulai dari sini:
            objData.XXSHP_KDS_M_ASSIGN_SUP_DTL[i].DEC_PERSEN_PPH = objCaller.value;
            break;
        }
    }
    p_SetHiddenObject(objData);
}

function p_txtDetailAmountPPH_Changed(objCaller, intIndex) {
    
    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());
    for (i = 0; i < objData.XXSHP_KDS_M_ASSIGN_SUP_DTL.length; i++) {
        // Cari Index-nya.
        if (objData.XXSHP_KDS_M_ASSIGN_SUP_DTL[i].intIndex == intIndex) {
            // Ketemu, mulai dari sini:
            objData.XXSHP_KDS_M_ASSIGN_SUP_DTL[i].DEC_PPH = objCaller.value;
            break;
        }
    }
    p_SetHiddenObject(objData);
}

function p_chkDetailPPN_Changed(objCaller, intIndex) {
    
    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());
    for (i = 0; i < objData.XXSHP_KDS_M_ASSIGN_SUP_DTL.length; i++) {
        // Cari Index-nya.
        if (objData.XXSHP_KDS_M_ASSIGN_SUP_DTL[i].intIndex == intIndex) {
            // Ketemu, mulai dari sini:
            if (objCaller.checked == true) {

                objData.XXSHP_KDS_M_ASSIGN_SUP_DTL[i].DEC_PPN = clsGlobal.parseToDecimal(objData.XXSHP_KDS_M_ASSIGN_SUP_DTL[i].DEC_INVOICE_AMT) * clsGlobal.parseToDecimal(0.1);
            }
            else {
                objData.XXSHP_KDS_M_ASSIGN_SUP_DTL[i].DEC_PPN = 0;
            }
            //objData.XXSHP_KCO_M_ASSIGN_SUP_DTL[i].TXT_PROGRAM_DESC = objCaller.value;
            break;

        }
    }
    p_SetHiddenObject(objData);
    p_refresh_row_detail(intIndex);
}




function p_txtDetailPPN_Changed(objCaller, intIndex) {
    
    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());
    for (i = 0; i < objData.XXSHP_KDS_M_ASSIGN_SUP_DTL.length; i++) {
        // Cari Index-nya.
        if (objData.XXSHP_KDS_M_ASSIGN_SUP_DTL[i].intIndex == intIndex) {
            // Ketemu, mulai dari sini:
            objData.XXSHP_KDS_M_ASSIGN_SUP_DTL[i].DEC_PPN = objCaller.value;
            objData.XXSHP_KDS_M_ASSIGN_SUP_DTL[i].DEC_AMOUNT = clsGlobal.parseToDecimal(objData.XXSHP_KDS_M_ASSIGN_SUP_DTL[i].DEC_PPN) + clsGlobal.parseToDecimal(objData.XXSHP_KDS_M_ASSIGN_SUP_DTL[i].DEC_DPP);

            break;
        }
    }
    p_DataToUIDetail(objData.XXSHP_KDS_M_ASSIGN_SUP_DTL)
    p_SetHiddenObject(objData);
}

function p_txtDetailDPP_Changed(objCaller, intIndex) {
    
    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());
    for (i = 0; i < objData.XXSHP_KDS_M_ASSIGN_SUP_DTL.length; i++) {
        // Cari Index-nya.
        if (objData.XXSHP_KDS_M_ASSIGN_SUP_DTL[i].intIndex == intIndex) {
            // Ketemu, mulai dari sini:
            objData.XXSHP_KDS_M_ASSIGN_SUP_DTL[i].DEC_DPP = objCaller.value;
            objData.XXSHP_KDS_M_ASSIGN_SUP_DTL[i].DEC_AMOUNT = clsGlobal.parseToDecimal(objData.XXSHP_KDS_M_ASSIGN_SUP_DTL[i].DEC_PPN) + clsGlobal.parseToDecimal(objData.XXSHP_KDS_M_ASSIGN_SUP_DTL[i].DEC_DPP);

            break;
        }
    }
    p_DataToUIDetail(objData.XXSHP_KDS_M_ASSIGN_SUP_DTL)
    p_SetHiddenObject(objData);
}


function p_btnDetailDelete_Click(objCaller, intIndex) {
    
    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());
    for (i = 0; i < objData.XXSHP_KDS_M_ASSIGN_SUP_DTL.length; i++) {
        // Cari Index-nya.
        if (objData.XXSHP_KDS_M_ASSIGN_SUP_DTL[i].intIndex == intIndex) {
            // Ketemu, mulai dari sini:
            // Remove from list.
            objData.XXSHP_KDS_M_ASSIGN_SUP_DTL.splice(i, 1);

            //var row = oTable.row($(this).parents('tr'));
            //var rowNode = row.node();
            //row.remove().draw();
            oTable.row(i).remove().draw(false);
            break;
        }
    }
    p_SetHiddenObject(objData);
    p_RefreshNumberDetail();
}

function p_RefreshNumberDetail() {
    
    var intRowIndex = 0;
    var objDat = p_GetHiddenObject();
    oTable.rows().every(function (rowIdx, tableLoop, rowLoop) {
        
        var d = this.data();
        d.intIndex = intRowIndex; // update data source for the row
        objDat.XXSHP_KDS_M_ASSIGN_SUP_DTL[intRowIndex].intIndex = d.intIndex;

        d.INT_KSUP_HDR_ID = objDat.XXSHP_KDS_M_ASSIGN_SUP_DTL[intRowIndex].INT_KSUP_HDR_ID;
        d.TXT_GROUP_ACCOUNT = objDat.XXSHP_KDS_M_ASSIGN_SUP_DTL[intRowIndex].TXT_GROUP_ACCOUNT;
        d.INT_SUPPLIER_ID = objDat.XXSHP_KDS_M_ASSIGN_SUP_DTL[intRowIndex].INT_SUPPLIER_ID;
        d.TXT_SUPPLIER_NAME = objDat.XXSHP_KDS_M_ASSIGN_SUP_DTL[intRowIndex].TXT_SUPPLIER_NAME;

        intRowIndex++;
        this.invalidate(); // invalidate the data DataTables has cached for this row         
    });

    // Draw once all updates are done
    oTable.draw(false);
    p_SetHiddenObject(objDat);
}

function p_refresh_row_detail(intindex) {

    
    var intRowIndex = 0;
    var objDat = p_GetHiddenObject();
    oTable.rows().every(function (rowIdx, tableLoop, rowLoop) {
        if (intRowIndex == intindex) {
            
            var d = this.data();
            d.intIndex = intRowIndex; // update data source for the row
            objDat.XXSHP_KDS_M_ASSIGN_SUP_DTL[intRowIndex].intIndex = d.intIndex;

            d.TXT_ACTIVITY = objDat.XXSHP_KDS_M_ASSIGN_SUP_DTL[intRowIndex].TXT_ACTIVITY;
            d.TXT_PROGRAM_DESC = objDat.XXSHP_KDS_M_ASSIGN_SUP_DTL[intRowIndex].TXT_PROGRAM_DESC;
            d.TXT_COA = objDat.XXSHP_KDS_M_ASSIGN_SUP_DTL[intRowIndex].TXT_COA;
            d.TXT_PPH_JENIS = objDat.XXSHP_KDS_M_ASSIGN_SUP_DTL[intRowIndex].TXT_PPH_JENIS;
            d.TXT_PPH_TYPE = objDat.XXSHP_KDS_M_ASSIGN_SUP_DTL[intRowIndex].TXT_PPH_TYPE;
            d.DEC_PERSEN_PPH = objDat.XXSHP_KDS_M_ASSIGN_SUP_DTL[intRowIndex].DEC_PERSEN_PPH;
            d.DEC_PPH = objDat.XXSHP_KDS_M_ASSIGN_SUP_DTL[intRowIndex].DEC_PPH;
            d.DEC_PPN = objDat.XXSHP_KDS_M_ASSIGN_SUP_DTL[intRowIndex].DEC_PPN;

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

$('#btnNew').bind('click', function () {
    try {
        p_showBlank();
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
});


$('#btnLOVID').bind('click', function () {
    try {
        LOV = clsGlobal.generateLOV(MODULE_ASSIGN_SUPPLIER, "txtID");
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
});



$('#btnLOVUserKAM').bind('click', function () {
    try {
        
        LOV = clsGlobal.generateLOV(LOV_LIST_USER_KAM, "txtUserIDKAM", $("#txtUserIDKAM").val());
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
});


$('#btnLOVUserAdminKAM').bind('click', function () {
    try {
        
        LOV = clsGlobal.generateLOV(MODULE_USER, "txtUserIDAdminKAM");
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

$('#btnAddDetail').on('click', function () {

    if ($("#txtUserKAM").val() != "") {

        p_AddRow();
    }
    else {
        clsGlobal.showAlert("User KAM blm dipilih!");
    }
});

