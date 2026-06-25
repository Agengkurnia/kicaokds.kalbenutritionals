/*====================== CONSTANTS & GLOBALS ======================*/
var clsGlobal = new clsGlobalClass();
var LOV;
var bitLoading = false;
var AP_AWT_GROUP_TAXES_ALLList = [];
var lastValidEndDate = null;

var MODULE_DETAIL_ACTIVITY = "MODULE_DETAIL_ACTIVITY";
var HIDDEN_HDR_ID = "#txtHdrId";
var lastLovSource = "";


/*====================== INIT FLOW ===============================*/
$(document).ready(function () {
    p_PopulatePPHDropdownList().always(function () {
        p_InitForm();
    });
});

function p_InitForm() {
    //p_initiateData(); 
    p_bindReadonly();
    p_toggleControlsByActivity();
}

function p_bindReadonly() {
    $("#txtCOA").prop("disabled", true);
    $("#ddlPPHJenis").prop("disabled", true);
    $("#txtPPHAmount").prop("disabled", true);
}


/*====================== DATA BINDING (DATA <-> UI) ===============*/
function p_DataToUI(obj) {
    $(HIDDEN_HDR_ID).val(clsGlobal.parseToInteger(obj.INT_KLAIM_DESC_HDR_ID));
    $("#txtProgramActivity").val(clsGlobal.parseToString(obj.TXT_ACTIVITY));
    $("#txtDescription").val(clsGlobal.parseToString(obj.TXT_DESCRIPTION));
    $("#txtCOA").val(clsGlobal.parseToString(obj.TXT_COA));
    $("#txtPPHAmount").val(clsGlobal.parseToDecimal(obj.DEC_PERSEN_PPH));

    $("#txtHiddenObject").val(JSON.stringify(obj));
    p_toggleControlsByActivity();

    if (obj.TXT_PPH_JENIS && obj.INT_PPH_DTL_ID != null) {
        p_SetPPHDropdownSelected(obj.INT_PPH_DTL_ID, obj.TXT_PPH_JENIS, obj.DEC_PERSEN_PPH);
        $("#ddlPPHJenis").prop("disabled", false);
        $("#txtPPHAmount").prop("readonly", true);
    }
}

function p_showBlank() {
    var blank = {
        INT_KLAIM_DESC_HDR_ID: 0,
        TXT_ACTIVITY: "",
        TXT_DESCRIPTION: "",
        INT_PPH_DTL_ID: null,
        TXT_PPH_JENIS: "",
        DEC_PERSEN_PPH: 0,
        TXT_COA: "",
        DTM_START_DATE: null,
        DTM_END_DATE: null,
        BIT_ACTIVE: clsGlobal.ParseBooleanNETToOracle(true)
    };

    $(HIDDEN_HDR_ID).val("");
    $("#txtProgramActivity").val("");
    $("#txtCOA").val("");
    $("#ddlPPHJenis").val("");
    $("#txtPPHAmount").val("");
    $("#txtDescription").val("");
    $("#dtmEndDate").val("");

    $("#txtHiddenObject").val(JSON.stringify(blank));
    p_toggleControlsByActivity();
    $("#btnDelete").hide();
    lastLovSource = "";
}

function p_SetPPHDropdownSelected(pphDtlId, pphJenis, pphPersen) {
    var targetId = String(pphDtlId).trim();
    var targetName = String(pphJenis).trim().toUpperCase();
    var targetRate = clsGlobal.parseToDecimal(pphPersen);

    var ddl = $("#ddlPPHJenis");
    var found = false;

    ddl.find("option").each(function () {
        var val = $(this).val();
        if (!val) return;

        var parts = val.split(";");
        var optId = String(parts[0]).trim();
        var optName = String(parts[1]).trim().toUpperCase();
        var optRate = clsGlobal.parseToDecimal(parts[2]);

        var normOptName = optName.replace(/[_ ]/g, "");
        var normTargetName = targetName.replace(/[_ ]/g, "");

        if (optId == targetId && normOptName == normTargetName && optRate == targetRate) {
            ddl.val(val);
            found = true;
            return false;
        }
    });
}

function p_UIToData() {
    var htmlJSON = $("#txtHiddenObject").val();
    var data = htmlJSON ? JSON.parse(htmlJSON) : {};

    var existingId = data.INT_KLAIM_DESC_HDR_ID;
    var inputId = clsGlobal.parseToInteger($(HIDDEN_HDR_ID).val());
    data.INT_KLAIM_DESC_HDR_ID = (existingId && existingId > 0) ? existingId : inputId;

    data.TXT_ACTIVITY = $("#txtProgramActivity").val().toString();
    data.TXT_DESCRIPTION = $("#txtDescription").val().toString();
    data.TXT_COA = $("#txtCOA").val().toString();

    var ddlVal = $("#ddlPPHJenis").val();
    if (ddlVal) {
        var parts = ddlVal.split(";");
        if (parts.length === 3) {
          /*  data.INT_PPH_DTL_ID = clsGlobal.parseToInteger(parts[0]);*/
            data.TXT_PPH_JENIS = parts[1];
            data.DEC_PERSEN_PPH = clsGlobal.parseToDecimal(parts[2]);
        }
    } else {
     /*   data.INT_PPH_DTL_ID = null;*/
        data.TXT_PPH_JENIS = "";
        data.DEC_PERSEN_PPH = 0;
    }

    $("#txtPPHAmount").val(data.DEC_PERSEN_PPH);
    data.DTM_END_DATE = $("#dtmEndDate").val();

    $("#txtHiddenObject").val(JSON.stringify(data));
}

function p_RenderPPHDropdown() {
    var ddl = $("#ddlPPHJenis");
    ddl.empty();
    ddl.append('<option value="">-</option>');
    for (var i = 0; i < AP_AWT_GROUP_TAXES_ALLList.length; i++) {
        ddl.append(
            '<option value="' +
            AP_AWT_GROUP_TAXES_ALLList[i].GROUP_ID + ';' +
            AP_AWT_GROUP_TAXES_ALLList[i].TAX_NAME + ';' +
            AP_AWT_GROUP_TAXES_ALLList[i].TAX_RATE +
            '">' + AP_AWT_GROUP_TAXES_ALLList[i].TAX_NAME + '</option>'
        );
    }
    ddl.prop("disabled", true);
}


/*====================== SERVER CALLS =============================*/
function p_initiateData() {
    clsGlobal.showLoading();
    $.ajax({
        type: "POST",
        url: "/Master/ProgramActivity/InitiateData",
        data: { __RequestVerificationToken: $('#frmProgramActivity input[name=__RequestVerificationToken]').val() },
        datatype: "json",
        success: function (ret) {
            if (ret.bitSuccess) {
                if (ret.objData) {
                    p_DataToUI(ret.objData);
                } else {
                    p_showBlank();
                }
                $("#txtGUID").val(ret.txtGUID);
            } else {
                clsGlobal.getAlert(ret.txtMessage);
                p_showBlank();
            }
            clsGlobal.hideLoading();
        },
        error: function () {
            clsGlobal.hideLoading();
            p_showBlank();
        }
    });
}

function p_getDataByID() {
    clsGlobal.showLoading();
    $.ajax({
        type: "POST",
        url: "/Master/ProgramActivity/GetData",
        data: {
            txtID: $("#txtID").val(),
            __RequestVerificationToken: $('#frmProgramActivity input[name=__RequestVerificationToken]').val()
        },
        datatype: "json",
        success: function (ret) {
            if (ret.bitSuccess) {
                if (ret.objData) {
                    p_DataToUI(ret.objData);
                } else {
                    p_showBlank();
                }
                $("#txtGUID").val(ret.txtGUID);
            } else {
                clsGlobal.getAlert(ret.txtMessage);
            }
            clsGlobal.hideLoading();
        },
        error: function () {
            clsGlobal.hideLoading();
        }
    });
}

function p_saveData() {
    p_UIToData();
    clsGlobal.showLoading();
    $.ajax({
        type: "POST",
        url: "/Master/ProgramActivity/SaveData",
        data: {
            data: $("#txtHiddenObject").val(),
            hdrId: $("#txtHdrId").val(),
            txtGUID: $("#txtGUID").val(),
            __RequestVerificationToken: $('#frmProgramActivity input[name=__RequestVerificationToken]').val()
        },
        datatype: "json",
        success: function (ret) {
            if (ret.bitSuccess) {
                p_DataToUI(ret.objData);
                clsGlobal.getInformationMessage(ret.txtMessage);
            } else {
                clsGlobal.getAlert(ret.txtMessage);
            }
            clsGlobal.hideLoading();
        },
        error: function () {
            clsGlobal.hideLoading();
        }
    });
}

function p_PopulatePPHDropdownList() {
    return $.ajax({
        type: "POST",
        url: "/Main/PopulateTipePPH",
        data: { __RequestVerificationToken: $('#frmProgramActivity input[name=__RequestVerificationToken]').val() },
        datatype: "json",
        success: function (ret) {
            if (ret.bitSuccess && ret.objData) {
                AP_AWT_GROUP_TAXES_ALLList = ret.objData;
                p_RenderPPHDropdown();
            }
        }
    });
}

function p_toggleControlsByActivity() {
    var hasActivity = $("#txtProgramActivity").val().trim() !== "";

    if (!hasActivity) {
        $("#txtDescription").prop("disabled", true);
        $("#dtmEndDate").prop("disabled", true);
        $("#ddlPPHJenis").prop("disabled", true);
        $("#txtPPHAmount").prop("disabled", true);
    } else {
        $("#txtDescription").prop("disabled", false);
        $("#dtmEndDate").prop("disabled", false);

        if ($("#ddlPPHJenis option").length > 1) {
            $("#ddlPPHJenis").prop("disabled", false);
        }
        $("#txtPPHAmount").prop("readonly", true);
    }
}

$("#btnDelete").on("click", function () {
    var hdrId = $("#txtHdrId").val();
    if (!hdrId) {
        clsGlobal.getAlert("Tidak ada data yang dipilih!");
        return;
    }

    clsGlobal.getConfirmation("Yakin ingin menghapus data ini?", function (ok) {
        if (ok) {
            clsGlobal.showLoading();
            $.ajax({
                type: "POST",
                url: "/Master/ProgramActivity/DeleteData",
                data: {
                    hdrId: hdrId,
                    __RequestVerificationToken: $('#frmProgramActivity input[name=__RequestVerificationToken]').val()
                },
                success: function (ret) {
                    clsGlobal.hideLoading();
                    if (ret.bitSuccess) {
                        clsGlobal.getInformationMessage(ret.txtMessage);
                        p_showBlank();
                    } else {
                        clsGlobal.getAlert(ret.txtMessage || "Gagal menghapus data!");
                    }
                }
            });
        }
    });
});



/*====================== LOV HANDLER ==============================*/
function setChooseLOV(txtValue) {
    try {
        var arr = txtValue.split("|");
        var target = arr[0];

        if (target === "txtProgramActivity") {
            var activity = arr[1] || "";
            var coa = arr[2] || "";
            var pphJenis = arr[3] || "";
            var pphPersen = arr[4] || "0";
            var desc = arr[5] || "";
            var endDate = arr[6] || "";
            var hdrIdRaw = arr[7] || "0";
            var pphDtlId = arr[8] || null;

            var hdrId = parseInt(String(hdrIdRaw).replace(/[^\d]/g, ""), 10) || 0;

            $(HIDDEN_HDR_ID).val(hdrId);
            $("#txtProgramActivity").val(activity);
            $("#txtCOA").val(coa);
            $("#txtPPHAmount").val(pphPersen);
            $("#txtDescription").val(desc);
            $("#dtmEndDate").val(endDate);

            p_toggleControlsByActivity();

            if (!pphDtlId) {
                var match = AP_AWT_GROUP_TAXES_ALLList.find(function (x) {
                    return String(x.TAX_NAME).trim().toUpperCase() === String(pphJenis).trim().toUpperCase() &&
                           parseFloat(x.TAX_RATE) == parseFloat(pphPersen);
                });
                if (match) pphDtlId = match.GROUP_ID;
            }

            if (pphDtlId) {
                var trySet = setInterval(function () {
                    var ddl = $("#ddlPPHJenis");
                    if (ddl.find("option").length > 1) {
                        p_SetPPHDropdownSelected(pphDtlId, pphJenis, pphPersen);
                        $("#ddlPPHJenis").prop("disabled", false);
                        $("#txtPPHAmount").prop("readonly", true);
                        clearInterval(trySet);
                    }
                }, 100);
            }

            $("#ddlPPHJenis").prop("disabled", false);
            $("#txtPPHAmount").prop("readonly", true);

            var data = JSON.parse($("#txtHiddenObject").val() || "{}");
            data.TXT_ACTIVITY = activity;
            data.TXT_COA = coa;
            data.TXT_PPH_JENIS = pphJenis;
            data.DEC_PERSEN_PPH = clsGlobal.parseToDecimal(pphPersen);
       /*     data.INT_PPH_DTL_ID = pphDtlId ? clsGlobal.parseToInteger(pphDtlId) : null;*/
            data.TXT_DESCRIPTION = desc;
            data.DTM_END_DATE = endDate;
            data.INT_KLAIM_DESC_HDR_ID = hdrId;

            $("#txtHiddenObject").val(JSON.stringify(data));
            if (lastLovSource === "FIND") {
                $("#btnDelete").show();   
            } else {
                $("#btnDelete").hide(); 
            }

        }

        clsGlobal.closeLOV();
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
}


/*====================== EVENTS ===================================*/
$("#btnSave").on("click", function () {
    try {
        clsGlobal.getConfirmation("Save this data?", function (ok) {
            if (ok) p_saveData();
        });
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
});

$("#btnNew").on("click", function () {
    try {
        p_showBlank();
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
});

$("#btnLOVID").on("click", function () {
    try {
        LOV = clsGlobal.generateLOV(MODULE_PROGRAM_ACTIVITY, "txtID");
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
});

$("#btnFind").on("click", function () {
    try {
        lastLovSource = "FIND";
        LOV = clsGlobal.generateLOV(MODULE_PROGRAM_ACTIVITY, "txtProgramActivity");
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
});

//$("#btnLOVProgramActiviy").on("click", function () {
//    try {
//        lastLovSource = "SUPPLIER";   
//        LOV = clsGlobal.generateLOV(MODULE_ACTIVITY_BY_SUPPLIER, "txtProgramActivity");
//    } catch (ex) {
//        clsGlobal.showAlert(ex);
//    }
//});

$("#btnLOVProgramActiviy").on("click", function () {
    try {
        lastLovSource = "SUPPLIER";

        var supplierCode = $("#txtSupplierID").val(); // bisa kosong

        LOV = clsGlobal.generateLOV(MODULE_ACTIVITY_BY_SUPPLIER, "txtProgramActivity", supplierCode || "");
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
});


$("#txtProgramActivity").on("input", function () {
    if (!$(this).val()) {
        $("#txtCOA").val("");
        $("#ddlPPHJenis").val("");
        $("#txtPPHAmount").val("");

        var htmlJSON = $("#txtHiddenObject").val();
        var data = htmlJSON ? JSON.parse(htmlJSON) : {};
        data.TXT_ACTIVITY = "";
        data.TXT_COA = "";
        data.TXT_PPH_JENIS = "";
        data.DEC_PERSEN_PPH = 0;
    /*    data.INT_PPH_DTL_ID = null;*/
        $("#txtHiddenObject").val(JSON.stringify(data));

        $("#ddlPPHJenis").prop("disabled", true);
        p_toggleControlsByActivity();
    }
});

$("#ddlPPHJenis").on("change", function () {
    var val = $(this).val();
    var arr = val.split(";");
    var data = JSON.parse($("#txtHiddenObject").val() || "{}");

    if (arr.length == 3) {
        data.TXT_PPH_JENIS = arr[1];
        data.DEC_PERSEN_PPH = parseFloat(arr[2]);
        /*data.INT_PPH_DTL_ID = parseInt(arr[0]);*/
        $("#txtPPHAmount").val(arr[2]);
    } else {
        data.TXT_PPH_JENIS = "";
        data.DEC_PERSEN_PPH = 0;
/*        data.INT_PPH_DTL_ID = null;*/
        $("#txtPPHAmount").val("0");
    }

    $("#txtHiddenObject").val(JSON.stringify(data));
});




$(function () {
    $("#dtmEndDate").datepicker({
        autoclose: true,
        format: "dd-mm-yyyy"
    }).on("show", function () {
        lastValidEndDate = $(this).val();   
    }).on("change", function () {
        if (!$(this).val()) {
            $(this).val(lastValidEndDate);  
        }
    }).on("blur", function () {
        if (!$(this).val()) {
            $(this).val(lastValidEndDate);
        }
    });
});

