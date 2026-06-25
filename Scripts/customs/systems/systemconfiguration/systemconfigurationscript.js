//=======================
// VARIABLE GLOBAL
//=======================
var clsGlobal = new clsGlobalClass(); 
var LOV;
var bitLoading = false;
var oTable;


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
    p_showPrevData();
    p_PopulateModuleAndSet("");
}

function p_validatePage() {
    
}
 
function p_refreshData() {
    clsGlobal.showLoading();
    $('#tbLOV').DataTable().ajax.reload(function () { clsGlobal.hideLoading(); });
}

function p_showPrevData() {  
    // Format datatable  
    oTable = $('#tbLOV').DataTable({ 
        "bPaginate": true,
        "bSort": false,
        searching: true,
        "iDisplayLength": 5, 
        "type": "POST",
        "ajax": {
            "url": "/System/SystemConfiguration/GetDataSourceJSONPaging",
            "method": "POST",
            "data": {
                txtSystemConfigurationID: function () { return $("#ddlSystemConfiguration").val(); },
            }
        },
        aoColumnDefs: [
              {
                  aTargets: [0],
                  mRender: function (data, type, full) {
                      return '<div > ' + full.TXT_KEY + ' </div>';
                  }
              },
           {
               aTargets: [1],
               mRender: function (data, type, full) {
                   return '<div > ' + full.TXT_DESC + ' </div>';
               }
           },
           {
               aTargets: [2],
               mRender: function (data, type, full) {
                   return '<div > <input type="text" class="form-control" id="txtTableValue" class="txtTableValue" onchange="p_txtTableValue_Changed(this,' + full.intIndex + ',\'' + full.TXT_SYSCONFIG + ';' + full.TXT_KEY + '\')"  value="' + clsGlobal.parseToString(full.TXT_VALUE) + '" >  </div>';

               }
           },
           {
               aTargets: [3],
               mRender: function (data, type, full) {
                   return '<div >  ' + full.TXT_DEFAULT_VALUE + '  </div>';
               }
           } 
        ]
    });

    $("#tbLOV").css("width", "100%");

    $('#tbLOV_filter input').unbind();
    $('#tbLOV_filter input').bind('keyup', function (e) {
        if (e.keyCode == 13) {
            oTable.search(this.value).draw();
        }
    });

    $('#tbLOV_filter input').bind('blur', function (e) {
        oTable.search(this.value).draw();
    });
     
}
 
function p_showBlank() { 
   
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
    
}
  
function p_initiateData() { 
    clsGlobal.showLoading();
    $.ajax({
        type: "POST",
        url: "/System/SystemConfiguration/InitiateData",
        data: { __RequestVerificationToken: $('#frm1 input[name=__RequestVerificationToken]').val() },
        datatype: "json",
        success: function (retDat) {
            
            if (retDat.bitSuccess == true) { 
                if (retDat.objData != undefined) {
                    
                    $("#txtHiddenObject").val(JSON.stringify(retDat.objData));
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
    var htmlJSON = $("#txtHiddenObject").val();  
    jsonData = JSON.parse(htmlJSON);
    
    $("#txtHiddenObject").val(JSON.stringify(jsonData));
    
}
 
 
function p_saveData() {
    
    clsGlobal.showLoading();
    p_UIToData(); 
    $.ajax({ 
        type: "POST",
        url: "/System/SystemConfiguration/SaveData", 
        data: { data: $("#txtHiddenObject").val(), txtGUID: $("#txtGUID").val(), __RequestVerificationToken: $('#frm1 input[name=__RequestVerificationToken]').val() },
        datatype: "json",
        success: function (retDat) {
            
            console.log(retDat);
            if (retDat.bitSuccess == true) {
                clsGlobal.getAlert(retDat.txtMessage);
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

function p_generateALL() {

    clsGlobal.showLoading();
    p_UIToData();
    $.ajax({
        type: "POST",
        url: "/System/SystemConfiguration/GenerateAll",
        data: { data: $("#txtHiddenObject").val(), txtGUID: $("#txtGUID").val(), __RequestVerificationToken: $('#frm1 input[name=__RequestVerificationToken]').val() },
        datatype: "json",
        success: function (retDat) {

            console.log(retDat);
            if (retDat.bitSuccess == true) {
                clsGlobal.getAlert(retDat.txtMessage);
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


function p_txtTableValue_Changed(objCaller, intIndex, txtParam) {
    
    //    objCaller.value = 
    var json = oTable.ajax.json();
    json.data[intIndex].TXT_VALUE = objCaller.value;

    clsGlobal.showLoading();
    $.ajax({
        type: "POST",
        url: "/System/SystemConfiguration/UpdateItem",
        data: { data: JSON.stringify(json.data[intIndex]), __RequestVerificationToken: $('#frm1 input[name=__RequestVerificationToken]').val() },
        datatype: "json",
        success: function (retDat) {
            console.log(retDat);
            
            if (retDat.bitSuccess == true) {
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


function p_PopulateModuleAndSet(txtValue) {
    clsGlobal.showLoading();
    $.ajax({
        type: "POST",
        url: "/MAIN/PopulateModule",
        data: { __RequestVerificationToken: $('#FormLogin input[name=__RequestVerificationToken]').val() },
        datatype: "json",
        success: function (retDat) {
            if (retDat.bitSuccess == true) {
                if (retDat.objData != undefined) {
                    $('#ddlSystemConfiguration').empty();
                    $('#ddlSystemConfiguration').append($('<option>').text("-").prop('value', "0"));
                    for (var i = 0; i < retDat.objData.length; i++) {
                        $('#ddlSystemConfiguration').append($('<option>').text(retDat.objData[i]).prop('value', retDat.objData[i]));
                    } 
                    if (txtValue != "") {
                        $("#ddlSystemConfiguration").val(txtValue);
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


$('#btnGenerate').bind('click', function () { 
    try {
        clsGlobal.getConfirmation("Generate All?", function (result) {
            if (result == true) {
                p_generateALL();
            }
            else {
                return false;
            }
        });
    } catch (ex) {
        clsGlobal.showAlert(ex);
    } 
});


$('#ddlSystemConfiguration').bind('change', function () {
    try { 
        p_refreshData();
    } catch (ex) {
        clsGlobal.showAlert(ex);
    }
});
 


    

