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
var MODULE_BUDGETADDITIONAL = "BUDGETADDITIONAL";
var MODULE_PPH = "PPH";

var MODULE_KARYAWAN = "KARYAWAN";
var MODULE_KARYAWAN_BYNAME = "KARYAWAN NAME";
var MODULE_KARYAWAN_GROUP = "KARYAWAN GROUP";
var MODULE_KARYAWAN_ORG = "KARYAWAN ORG";
var MODULE_BRAND = "BRAND";
var MODULE_BRANCH = "BRANCH";

var LOV_ORG_ACCT_PERIODS_V = "ORG_ACCT_PERIODS_V";
var LOV_XXSHP_VENDOR_SITE_ALL_V = "XXSHP_VENDOR_SITE_ALL_V";
var LOV_XXSHP_VENDOR_SITE_ALL_V_VENDOR_SITE_ID = "XXSHP_VENDOR_SITE_ALL_V VENDOR_SITE_ID";
var LOV_FND_FLEX_VALUES_TL = "FND_FLEX_VALUES_TL";

var MODULE_ACTIVITY = "ACTIVITY";
var MODULE_COA = "COA";
var MODULE_JENISPPH = "JENIS PPH";
var MODULE_TYPEPPH = "TYPE PPH";
var MODULE_MTBUDGETTYPE = "MTBUDGET TYPE";
var MODULE_KPP_REASON = "KPP REASON";
var MODULE_TYPE_PAYMENT = "TYPE PAYMENT";
var MODULE_DEPARTMENT = "DEPARTMENT"; 

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
    var txtUrl = $(location).attr('protocol') + "//" + $(location).attr('host') + "/System/LOV/Index?Mdl=" + txtModule + "&Fnc=" + txtFunction + "&Query=" + txtQuery;
    LOV = $.fancybox({ modal: false, padding: 0, width: '90%', height: '100%', scrolling: 'false', href: txtUrl, type: 'iframe', autoSize: false });
    return LOV;
}

clsGlobalClass.prototype.closeLOV = function () {
    $.fancybox.close();
}


clsGlobalClass.prototype.generatePopUpIframe = function (txtUrl, txtFunction, fancyboxdata) {
    //
    LOV = $.fancybox({ modal: false, padding: 0, width: '80%', height: '100%', scrolling: 'true', href: txtUrl, type: 'iframe', autoSize: false, ajax: { type: "POST", data: fancyboxdata } });
    return LOV;
}

clsGlobalClass.prototype.generatePopUpIframeSmall = function (txtUrl, txtFunction, fancyboxdata) {
    //
    LOV = $.fancybox({ modal: false, padding: 0, width: '60%', height: 'auto', scrolling: 'true', href: txtUrl, type: 'iframe', autoSize: false, ajax: { type: "POST", data: fancyboxdata } });
    return LOV;
}

clsGlobalClass.prototype.closePopUpIframe = function () {
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
		if (txtValue == undefined) {
			return 0;
		}
		else {
			if (txtValue == "") {
				return 0;
			} else {
				return parseFloat(txtValue) || 0;
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

clsGlobalClass.prototype.parseToDateTimeFromJSON = function (txtValue, txtFormat) {
    try {
        
        var retDat = convertMSDate(txtValue);
        var txtValue = retDat.toString();
        var intIndex =  txtValue.indexOf('(');
        var txtResult = txtValue;
        if (intIndex > 0) {
            txtResult = txtResult.substr(0, intIndex);
        }
        return $.format.date(txtResult, txtFormat); 
    } catch (ex) {
        return "-";
    }
}

clsGlobalClass.prototype.parseToJSONDateFromDate = function (txtValue, txtFormat) {
    try {
        //
        var dt = $.format.date(txtValue, txtFormat);  //new Date(txtValue);
        return '/Date(' + new Date(dt).getTime() + ')/';
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