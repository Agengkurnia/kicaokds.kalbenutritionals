//=======================
// CONSTANT
//=======================
var MODULE_MAIN = "MAIN";
var MODULE_MENU = "MENU";
var MODULE_MODULE = "MODULE";
var MODULE_USER = "USER";
var MODULE_USER_ROLE = "USER_ROLE";
var MODULE_SYSTEMCONFIGURATION = "SYSTEMCONFIGURATION";
var MODULE_SYSTEMLANGUAGE = "SYSTEMLANGUAGE";
var MODULE_ROLE = "ROLE";
var MODULE_USERROLE = "USERROLE";
var MODULE_ROLEACCESS = "ROLEACCESS";
var MODULE_PARAMETER = "PARAMETER";
var MODULE_BUDGET = "BUDGET";
var MODULE_BUDGET_BYKAM = "BUDGET BY KAM";
var LOV_BUDGETDETAIL = "BUDGETDETAIL"; 
var MODULE_BUDGETADDITIONAL = "BUDGETADDITIONAL";
var MODULE_BUDGETACCRUED = "BUDGETACCRUED";
var MODULE_BUDGETALLOCATION = "BUDGETALLOCATION";
var MODULE_BUDGETALLOCATION_BYUSER = "BUDGETALLOCATION BYUSER";
var MODULE_BUDGETALLOCATIONADDITION = "BUDGETALLOCATIONADDITION";
var MODULE_PPH = "PPH";
var MODULE_PPH_SUPPLIER_ACTIVITY = "PPH BY SUPPLIER ACTIVITY";
var MODULE_KAMSUPPLIER = "KAMSUPPLIER";

var MODULE_KARYAWAN = "KARYAWAN";
var MODULE_KARYAWAN_BYNAME = "KARYAWAN NAME";
var MODULE_KARYAWAN_GROUP = "KARYAWAN GROUP";
var MODULE_KARYAWAN_ORG = "KARYAWAN ORG";
var MODULE_BRAND = "BRAND";
var MODULE_UMBRAND = "UMBRAND";
var MODULE_BRANCH = "BRANCH";
var MODULE_BRAND_SUBUMBRAND = "BRAND SUBUMBRAND";
var LOV_SUBUMBRAND_BYBUDGET_HEADER = "SUBUMBRAND BY BUDGET HEADER";
var LOV_SUBUMBRAND_BYGROUP_TYPE_PERIOD = "SUBUMBRAND BY GROUP TYPE PERIOD";
var LOV_SUBUMBRAND_BYMKPP_ACTIVITY = "SUBUMBRAND BY MKPP ACTIVITY";
var LOV_SUBBRAND_BYMKPP_ACTIVITY = "SUBBRAND BY MKPP ACTIVITY";
var LOV_SUBUMBRAND_BY_TXT_GROUP_ACCOUNT_BYBUDGET_TYPE_BYPERIOD = "SUBUMBRAND BY GROUP ACCOUNT BY BUDGET TYPE BY TYPE PERIOD";
var LOV_SUBUMBRAND_BY_TXT_GROUP_ACCOUNT_BYBUDGET_TYPE_BYPERIOD_SUBUMBRAND = "SUBUMBRAND BY GROUP ACCOUNT BY BUDGET TYPE BY TYPE PERIOD BY SUBUMBRAND";
var MODULE_GROUP_GROUPBUDGET = "GROUP BUDGET";
var MODULE_BRAND_BRANDBUDGET = "BRAND BUDGET";
var MODULE_APPROVALDELEGATE = "APPROVAL DELEGATE";
var MODULE_SUBBRAND_BRAND = "SUBBRAND BRAND";
var MODULE_ITEMCODE_SUBBRAND = "LOV_CONSO_SKU_BYSUBBRAND";
var LOV_ITEMCODE_PROMAP_SUBBRAND = "LOV_ITEMCODE_PROMAP_SUBBRAND";
var LOV_UMBRAND_PROMAP = "LOV_UMBRAND_PROMAP";
var LOV_BRAND_PROMAP_UMBRAND = "LOV_BRAND_PROMAP_UMBRAND";
var LOV_SUBBRAND_PROMAP_BRAND = "LOV_SUBBRAND_PROMAP_BRAND";
var LOV_SUBBRAND_PROMAP = "LOV_SUBBRAND_PROMAP";

var MODULE_REGION = "REGION";
var MODULE_BRANCH_BY_REGION = "BRANCH BY REGION";

//MASTER
var LOV_LIST_USER_KAM = "LIST USER KAM";
var LOV_ASSIGN_SUPPLIER = "LOV ASSIGN SUPPLIER";
var LOV_ASSIGN_USER_SUPPLIER_SITE_DETAIL = "LOV ASSIGN USER SUPPLIER SITE DETAIL";
var MODULE_ASSIGN_SUPPLIER = "ASSIGN SUPPLIER";
var MODULE_ASSIGN_USER_SUPPLIER_SITE = "ASSIGN USER SUPPLIER SITE";
var MODULE_BUDGETALLOCATIONRECLASS = "BUDGETALLOCATION_RECLASS";
var LOV_BUDGETALLOCATION_GETPERIOD_BYGROUPACCOUNT = "BUDGETALLOCATION_GETPERIOD_BYGROUPACCOUNT";
var LOV_BUDGETALLOCATION_SUBUMBRAND_BY_GROUPACCOUNT_PERIOD = "BUDGETALLOCATION_SUBUMBRAND_BY_GROUPACCOUNT_PERIOD";
var MODULE_ALLOCATIONPRODUCT = "ALLOCATIONPRODUCT";
var LOV_KSUP_SUPPLIER = "KSUP_SUPPLIER";
var LOV_CONSO_SKU = "LOV_CONSO_SKU";
var LOV_CONSO_SKU_BYSUBUMBRAND = "LOV_CONSO_SKU_BYSUBUMBRAND";
var MODULE_PRODUCTMAPPING = "PRODUCTMAPPING";
var LOV_SUBUMBRAND_BY_TXT_GROUP_ACCOUNT = "SUBUMBRAND BY TXT GROUP ACCOUNT";


//TRANSAKSI
var MODULE_KLAIM = "KLAIM";
var MODULE_KKP = "KKP";
var MODULE_KPP = "KPP";
var MODULE_KPP_MATCHING = "KPP MATCHING";
var MODULE_KPP_MATCHING_KPP = "KPP MATCHING KPP";
var LOV_KPP_PARENT = "KPP PARENT";
var MODULE_MKPP = "MKPP";
var MODULE_ONO = "ONO";
var MODULE_MKPP_MATCHING = "MKPP MATCHING";
var MODULE_MKPP_MATCHING_MKPP = "MKPP MATCHING MKPP";
var MODULE_MKPP_REF = "MKPP REF"
var MODULE_MKPP_PARENT = "MKPP PARENT"
var MODULE_MKPP_PARENT_BY_USER = "MKPP PARENT BY USER"
var MODULE_MKPP_PARENT_BY_USER_FKPP = "MKPP PARENT BY USER FKPP"
var LOV_MKPP_APPROVED = "MKPP APPROVED"
var MODULE_CMA = "CMA"
var MODULE_RFA = "RFA"
var LOV_RFA_KLAIM_REFF = "RFA KLAIM REFF"
var LOV_RFP_KLAIM_REFF = "RFP KLAIM REFF"
var LOV_RFP_ADD_INVOICE = "RFP ADD INVOICE" 
var MODULE_RFA_DTL = "RFA DTL"
var MODULE_RFS = "RFS"
var MODULE_FPR = "FPR"; 

var LOV_ORG_ACCT_PERIODS_V = "ORG_ACCT_PERIODS_V";
var LOV_XXSHP_VENDOR_SITE_ALL_V = "XXSHP_VENDOR_SITE_ALL_V";
var LOV_XXSHP_VENDOR_SITE_ALL_MTR_V = "XXSHP_VENDOR_SITE_ALL_MTR_V";
var LOV_DOLPHINE_PP = "LOV_DOLPHINE_PP";

var LOV_XXSHP_VENDOR_SITE_ALL_V_GROUP_ACCOUNT = "XXSHP_VENDOR_SITE_ALL_V GROUP ACCOUNT";


var LOV_XXSHP_VENDOR_SITE_ALL_MTR_V_VENDOR_SITE_ID = "XXSHP_VENDOR_SITE_ALL_MTR_V VENDOR_SITE_ID";
var LOV_XXSHP_VENDOR_SITE_ALL_V_VENDOR_SITE_ID = "XXSHP_VENDOR_SITE_ALL_V VENDOR_SITE_ID";
var LOV_XXSHP_KPP_VENDOR_SITE_ALL_V = "XXSHP_KPP_VENDOR_SITE_ALL_V";
var LOV_GROUP_ACCOUNT = "GROUP ACCOUNT";
var LOV_GROUP_ACCOUNT_ALL = "GROUP ACCOUNT ALL";
var LOV_GROUP_ACCOUNT_BY_SUP_SITE = "GROUP ACCOUNT BY SUP SITE";

var LOV_OUTLET = "OUTLET";
var LOV_OUTLET_BY_MKPP = "OUTLET BY MKPP";
var LOV_OUTLET_BY_GRP_ACC = "OUTLET BY GROUP ACC";
var LOV_OUTLET_BY_SUP_SITE = "OUTLET BY SUP SITE";

var LOV_FND_FLEX_VALUES_TL = "FND_FLEX_VALUES_TL";
var LOV_PARAMETER_ORADOCTYPE = "PARAMETER ORADOCTYPE"
var LOV_ONO_BY_BIT_ADDENDUM = "ONO BY ADDENDUM";
var LOV_ONO_CHECK_BUDGET = "ONO CHECK BUDGET";

var MODULE_ACTIVITY = "ACTIVITY";
var MODULE_ACTIVITY_BY_MKPP = "ACTIVITY BY MKPP";
var MODULE_ACTIVITY_BY_GROUP_ACCOUNT = "ACTIVITY BY GROUP ACCOUNT"; // note
var MODULE_ACTIVITY_BY_SUPPLIER = "ACTIVITY BY SUPPLIER";
var MODULE_COA = "COA";
var MODULE_JENISPPH = "JENIS PPH";
var MODULE_TYPEPPH = "TYPE PPH";
var MODULE_MTBUDGETTYPE = "MTBUDGET TYPE";
var MODULE_KPP_REASON = "KPP REASON";
var MODULE_TYPE_PAYMENT = "TYPE PAYMENT";
var MODULE_DEPARTMENT = "DEPARTMENT";
var MODULE_BRANCH2 = "BRANCH2";
var MODULE_PROGRAM_ACTIVITY = "PROGRAM_ACTIVITY";

//var MODULE_MPP_DOLPHINE = "MPP_DOLPHINE";

var MODULE_PERSEN_PPH = "PERSEN PPH BY ACT SUPPLIER SITE";

//=======================
// VARIABLE
//=======================
var stringempty = "";
var clsDateFormat = "MM/dd/yyyy";


//=======================
// FUNCTION
//=======================
$.getParameter = function (name) {
	var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
	if (results == undefined) {
		return undefined;
	} else {
		return results[1] || 0;
	}
}

var clsGlobalClass = function() {
	// Properties Global.
    var URL_LOV = "/System/LOV/Index/"

    if (g_intLoading == undefined) {
        g_intLoading = 0;
    }
    if (g_intFinishloading == undefined) {
        g_intFinishloading = 0;
    }
}


// ================================
// FUNCTION GLOBAL
// ================================

clsGlobalClass.prototype.showAlert = function (txtValue) {
    clsGlobal.setMessageWarning(txtValue);
    if (txtValue == "") {
        txtValue = "!";
    }
    bootbox.alert(txtValue);
}

clsGlobalClass.prototype.getAlert = function (txtValue) {
    //
    if (txtValue == "") {
        txtValue = "!";
    }
    clsGlobal.setMessageWarning(txtValue);
    bootbox.alert(txtValue);
}
clsGlobalClass.prototype.getInformationMessage = function (txtValue) {
    clsGlobal.setMessageInformation(txtValue);
    //alert(txtValue);
    bootbox.alert(txtValue);
}

clsGlobalClass.prototype.getConfirmation = function (txtValue, callback) {
    //
    bootbox.confirm({
        message: txtValue,
        buttons: {
            confirm: {
                label: 'Yes',
                className: 'btn-success'
            },
            cancel: {
                label: 'No',
                className: 'btn-danger'
            }
        },
        callback: function (result) {
            //
            callback(result);
            // ...
        }
    });
}

clsGlobalClass.prototype.setMessageWarning = function (txtValue) {
    p_setMessageWarning(txtValue);
}
function p_setMessageWarning(txtValue) {
    if (txtValue == "") { txtValue = " "; }
    $("#lblMessageWarning").text(txtValue);
    $("#txtWarningSystem").html(txtValue);
    $("#divWarningSystem").show();
}

clsGlobalClass.prototype.setMessageInformation = function (txtValue) {
    p_setMessageInformation(txtValue);
}
function p_setMessageInformation(txtValue) {
    if (txtValue == "") { txtValue = " "; }
    $("#lblMessageWarning").text(txtValue);
    $("#txtInformationSystem").html(txtValue);
    $("#divInformationSystem").show();
}

clsGlobalClass.prototype.clearMessageWarning = function () {
    p_clearMessageWarning();
}
function p_clearMessageWarning() {
    $("#lblMessageWarning").text("");
    $("#divWarningSystem").hide();
}
clsGlobalClass.prototype.clearMessageInformation = function () {
    p_clearMessageInformation();
}
function p_clearMessageInformation() {
    $("#lblMessageWarning").text("");
    $("#divInformationSystem").hide();
}
clsGlobalClass.prototype.generateLOV = function (txtModule, txtFunction, txtQuery) {
    var txtUrl = $(location).attr('protocol') + "//" + $(location).attr('host') + "/System/LOV/Index?Mdl=" + encodeURIComponent(txtModule) + "&Fnc=" + encodeURIComponent(txtFunction) + "&Query=" + encodeURIComponent(txtQuery);
    LOV = $.fancybox({ modal: false, padding: 0, width: '90%', height: '100%', scrolling: 'false', href: txtUrl, type: 'iframe', autoSize: false });
    return LOV;
}

clsGlobalClass.prototype.generateLOVHistory = function (txtModule, txtFunction, txtQuery) {
    var txtUrl = $(location).attr('protocol') + "//" + $(location).attr('host') + "/System/LOV/Index?Mdl=" + encodeURIComponent(txtModule) + "&Fnc=" + encodeURIComponent(txtFunction) + "&Query=" + encodeURIComponent(txtQuery);
    LOV = $.fancybox({ modal: false, padding: 0, width: '90%', height: '100%', scrolling: 'false', href: txtUrl, type: 'iframe', autoSize: false });
    return LOV;
}


clsGlobalClass.prototype.closeLOV = function () {
    $.fancybox.close();
}


clsGlobalClass.prototype.generatePopUpIframe = function (txtUrl, txtFunction, fancyboxdata) {
    ////
    if (txtUrl.indexOf('?') == -1) {
        txtUrl = txtUrl + "?a=1";
    }
    LOV = $.fancybox({ modal: false, padding: 0, width: '90%', height: '100%', scrolling: 'true', href: txtUrl + "&Fnc=" + txtFunction, type: 'iframe', autoSize: false, ajax: { type: "POST", data: fancyboxdata } });
    return LOV;
}

clsGlobalClass.prototype.generatePopUpIframeSmall = function (txtUrl, txtFunction, fancyboxdata) {
    ////
    if (txtUrl.indexOf('?') == -1) {
        txtUrl = txtUrl + "?a=1";
    }
    LOV = $.fancybox({ modal: false, padding: 0, width: '60%', height: 'auto', scrolling: 'true', href: txtUrl + "&Fnc=" + txtFunction, type: 'iframe', autoSize: false, ajax: { type: "POST", data: fancyboxdata } });
    return LOV;
}

clsGlobalClass.prototype.closePopUpIframe = function () {
    $.fancybox.close();
}


clsGlobalClass.prototype.generatePopUpDivSmall = function (txtUrl, txtFunction, fancyboxdata) {     
    LOV = $.fancybox({ modal: true, padding: 0, width: '60%', height: 'auto', scrolling: 'true', href: txtUrl, type: 'inline', autoSize: false, ajax: { type: "POST", data: fancyboxdata } });
    return LOV;
}

clsGlobalClass.prototype.closePopUpDiv = function () {
    $.fancybox.close();
}



var g_intLoading;
var g_intFinishloading;

clsGlobalClass.prototype.showLoading = function () {
    p_clearMessageWarning();
    p_clearMessageInformation();

    if (g_intLoading == undefined) {
        g_intLoading = 0;
    } else {
        g_intLoading += 1;
    }
    if (g_intFinishloading == undefined) {
        g_intFinishloading = 0;
    }

    $.blockUI({
        css: {
            border: 'none',
            padding: '15px',
            backgroundColor: '#ccc',
            '-webkit-border-radius': '10px',
            '-moz-border-radius': '10px',
            opacity: .3,
            color: '#fff'
        }
    });

    //jQuery.ajaxSetup({ async: false });

}

clsGlobalClass.prototype.hideLoading = function () {

    g_intFinishloading += 1;
    if (g_intLoading == g_intFinishloading) {
        $.unblockUI();
    }
}


clsGlobalClass.prototype.GenerateAutoNumeric = function () {
    $('.autonumeric').autoNumeric('init', { vMax: '9999999999999.99', vMin: '-9999999999999.99', aSep: ',', dGroup: '3', aDec: '.' });
}
clsGlobalClass.prototype.GenerateDateTimePicker = function () {
    $('.datetimepicker').datepicker({autoclose: true});
}

// PARSING

clsGlobalClass.prototype.parseToString = function (txtValue) {
	try {
		if (txtValue == undefined) {
			return "";
		}
		else {
			return txtValue.toString();
		}
	}catch(ex){
		return "";
	} 
}
 
clsGlobalClass.prototype.parseToInteger = function (txtValue) {
	try {
		if (txtValue == undefined) {
			return 0;
		}
		else {
			if (txtValue == "") {
				return 0;
			} else {
				return parseInt(txtValue) || 0;
			}            
		}
	} catch (ex) {
		return 0;
	}
}

clsGlobalClass.prototype.parseToDecimal = function (txtValue) {
    try {
        //
		if (txtValue == undefined) {
			return 0;
		}
		else {
			if (txtValue == "") {
				return 0;
			} else {
			    if (!isNaN(txtValue)) {
			        return parseFloat(txtValue);
			    } else {
			        return parseFloat(txtValue.replace(/,/g, '')) || 0;
			    } 
			}
		}
	} catch (ex) {
		return 0;
	}
}

clsGlobalClass.prototype.parseToBoolean = function (txtValue) {
	try {
		if (txtValue == undefined) {
			return false;
		}
		else {
			if (txtValue == "") {
				return false;
			} else {
				if(txtValue == "on")
				{
					return true;
				} else {
					if (txtValue == "1") {
						return true;
					} else {
						return false;
					}
				}
			}
		}
	} catch (ex) {
		return false;
	}
}

clsGlobalClass.prototype.parseToRupiah = function (txtValue) {
    try {
        if (txtValue == undefined) {
            return 0;
        }
        else {
            if (txtValue == "") {
                return 0;
            } else {
                var rupiah = '';
                var angkarev = txtValue.toString().split('').reverse().join('');
                for (var i = 0; i < angkarev.length; i++) if (i % 3 == 0) rupiah += angkarev.substr(i, 3) + ',';
                return rupiah.split('', rupiah.length - 1).reverse().join('');
            }
        }
    } catch (ex) {
        return 0;
    }
};

clsGlobalClass.prototype.parseToAngka = function (txtValue) {
    try {
        if (txtValue == undefined) {
            return 0;
        }
        else {
            if (txtValue == "") {
                return 0;
            } else {
                return parseInt(txtValue.replace(/[^0-9]/g, ''), 10);
            }
        }
    } catch (ex) {
        return 0;
    }
};

clsGlobalClass.prototype.parseJSONdate = function ConvertJsonDateString(jsonDate) {
    var shortDate = null;
    if (jsonDate) {
        var regex = /-?\d+/;
        var matches = regex.exec(jsonDate);
        var dt = new Date(parseInt(matches[0]));
        var month = dt.getMonth() + 1;
        var monthString = month > 9 ? month : '0' + month;
        var day = dt.getDate();
        var dayString = day > 9 ? day : '0' + day;
        var year = dt.getFullYear();
        shortDate = monthString + '/' + dayString + '/' + year;
    }
    return shortDate;
};


clsGlobalClass.prototype.encrypt = function rijndaelEncrypt(id) {
	var response;
	$.ajax({
		url: '/Home/Encrypt/',
		type: 'POST',
		async: false,
		context: this,
		data: {
			id: id
		},
		success: function (data) {
			response = data;
		}
	});
	return response;
};

clsGlobalClass.prototype.decrypt = function rijndaelDecrypt(text) {
	var response;
	$.ajax({
		url: '/Home/Decrypt/',
		type: 'POST',
		async: false,
		context: this,
		data: {
			text: text
		},
		success: function (data) {
			response = data;
		}
	});
	return response;
};


var convertMSDate = (function () {
    ////
    var pattern = /Date/,
        replacer = /\D+/g;
    return function (date) {
        if (typeof date === "string" && pattern.test(date)) {
            date = +date.replace(replacer, "");
            date = new Date(date);
            if (!date.valueOf()) {
                throw new Error("Invalid Date: " + date);
            }
        }
        return date;
    }
}());
var convertMSDate2 = (function () {
    var pattern = /\/Date\((\d+)\)\//;
    return function (date) {
        if (typeof date === "string" && pattern.test(date)) {
            var ms = parseInt(date.match(pattern)[1], 10);
            // Construct as UTC date, not local
            var utcDate = new Date(ms);
            return new Date(
                utcDate.getUTCFullYear(),
                utcDate.getUTCMonth(),
                utcDate.getUTCDate(),
                utcDate.getUTCHours(),
                utcDate.getUTCMinutes(),
                utcDate.getUTCSeconds()
            );
        }
        return date instanceof Date ? date : new Date(date);
    };
}());


clsGlobalClass.prototype.parseToDateTimeFromJSON = function (txtValue, txtFormat) {
    try {
        ////
        //var retDat = convertMSDate(txtValue);
        //return $.format.date(retDat.toString(), txtFormat);
        //
        var retDat = convertMSDate(txtValue);
        var txtValue = retDat.toString();
        var intIndex = txtValue.indexOf('(');
        var txtResult = txtValue;
        if (intIndex > 0) {
            txtResult = txtResult.substr(0, intIndex);
        }
        return $.format.date(txtResult, txtFormat);
    } catch (ex) {
        return "-";
    }
}
clsGlobalClass.prototype.parseToDateTimeFromJSON2 = function (txtValue, txtFormat) {
    try {
        var date = convertMSDate2(txtValue);
        if (!date || isNaN(date.getTime())) {
            throw new Error("Invalid Date: " + txtValue);
        }
        return $.format.date(date, txtFormat);
    } catch (ex) {
        console.warn(ex.message);
        return "-";
    }
};

clsGlobalClass.prototype.parseToJSONDateFromDate = function (txtValue, txtFormat) {
    try {
        ////
        var dt = $.format.date(txtValue, txtFormat);  //new Date(txtValue);
        return '/Date(' + new Date(dt).getTime() + ')/';
    } catch (ex) {
        return "-";
    }
}

clsGlobalClass.prototype.parseToJSONDateFromDatePlus7Hours = function (txtValue, txtFormat) {
    try {
        // Convert input text into a normalized date string based on format
        var dt = $.format.date(txtValue, txtFormat);

        // Convert to JS Date
        var d = new Date(dt);

        // ⭐ Add +7 hours timezone adjustment before storing to MS format
        var adjusted = new Date(d.getTime() + (7 * 60 * 60 * 1000));

        return '/Date(' + adjusted.getTime() + ')/';
    } catch (ex) {
        return "-";
    }
}


clsGlobalClass.prototype.ParseBooleanNETToOracle = function (txtValue) {
    try {
        if (txtValue == undefined) {
            return "N";
        }
        else {
            if (txtValue == true) {
                return "Y";
            } else {
                return "N";
            } 
        }
    } catch (ex) {
        return "N";
    }
}

clsGlobalClass.prototype.ParseBooleanOracleToNET = function (txtValue) {
    try {
        if (txtValue == undefined) {
            return false;
        }
        else {
            if (txtValue == "Y") {
                return true;
            } else {
                return false;
            }
        }
    } catch (ex) {
        return false;
    }
}

clsGlobalClass.prototype.FormatMoney = function (txtValue, intDec) {
    try {
        ////
        var intDec = isNaN(intDec = Math.abs(intDec)) ? 2 : intDec,
          d = d == undefined ? "." : d,
          t = t == undefined ? "," : t,
          s = txtValue < 0 ? "-" : "",
          i = String(parseInt(txtValue = Math.abs(Number(txtValue) || 0).toFixed(intDec))),
          j = (j = i.length) > 3 ? j % 3 : 0;
        return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (intDec ? d + Math.abs(txtValue - i).toFixed(intDec).slice(2): "");
         
    } catch (ex) {
        return "0";
    }
}