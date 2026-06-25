//=======================
// VARIABLE GLOBAL
//=======================
var clsGlobal = new clsGlobalClass(); 
var LOV;
var bitLoading = false; 


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
    switch (arr[0]) {
        case "txtID": $("#txtID").val(arr[1]);
            p_txtID_TextChanged();
            break;
       
    }
    clsGlobal.closeLOV(); 
}

function p_DataToUI(objData) { 
    $("#txtID").val(objData.intTemplate_HeaderID.toString());
    $("#txtType").val(objData.txtType.toString());
    $("#txtDescription").val(objData.txtDescription.toString());

    p_DataToUIDetail(objData.itemList);
    p_SetHiddenObject(objData);
    if ($("#txtID").val() == "" || $("#txtID").val() == "0") {
        $("#btnDelete").hide();
    } else {
        $("#btnDelete").show();
    }
}

function p_SetHiddenObject(objDat) {
    $("#txtHiddenObject").val(JSON.stringify(objDat));
}

function p_GetHiddenObject() {
    return JSON.parse($("#txtHiddenObject").val()); 
}
 
function p_DataToUIDetail(itemList) {
     
    oTable.clear();
    for (var i = 0; i < itemList.length; i++) {
        itemList[i].intIndex = i;
        oTable.row.add(itemList[i]);
    } 
    oTable.draw(false);

    var objDat = p_GetHiddenObject();
    objDat.itemList = itemList;
    p_SetHiddenObject(objDat);
}

function p_initiateData() { 
    clsGlobal.showLoading();
    $.ajax({
        type: "POST",
        url: "/System/Template/InitiateData",
        data: { __RequestVerificationToken: $('#frm1 input[name=__RequestVerificationToken]').val() },
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
    jsonData.intTemplate_HeaderID = clsGlobal.parseToInteger($("#txtID").val());    
    jsonData.txtType = $("#txtType").val().toString();
    jsonData.txtDescription = $("#txtDescription").val().toString();
        
    p_SetHiddenObject(jsonData);
    return $("#txtHiddenObject").val();
}
 

function p_txtID_TextChanged() {
    clsGlobal.showLoading();
    $.ajax({
        type: "POST",
        url: "/System/Template/GetData",
        data: { txtID: $("#txtID").val(), __RequestVerificationToken: $('#frm1 input[name=__RequestVerificationToken]').val() },
        datatype: "json",
        success: function (retDat) {
            
            if (retDat.bitSuccess == true) {
                if (retDat.objData != undefined) {
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
 
function p_saveData() {
    
    clsGlobal.showLoading();
    p_UIToData(); 
    $.ajax({ 
        type: "POST",
        url: "/System/Template/SaveData", 
        data: { data: $("#txtHiddenObject").val(), txtGUID: $("#txtGUID").val(), __RequestVerificationToken: $('#frm1 input[name=__RequestVerificationToken]').val() },
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
        url: "/System/Template/DeleteData", 
        data: { data: $("#txtHiddenObject").val(), txtGUID: $("#txtGUID").val(), __RequestVerificationToken: $('#frm1 input[name=__RequestVerificationToken]').val() },
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


function p_InitiateDetail() {
    // Format datatable  
    
    oTable = $('#dtDetail').DataTable({
        "bPaginate": true,
        "bSort": false,
        searching: false,
        "iDisplayLength": 5,
        "type": "POST",
        //"ajax": {
        //    "url": "/System/Template/InitiateDetail",
        //    "method": "POST" 
        //},
        aoColumnDefs: [
              {
                  aTargets: [0],
                  mRender: function (data, type, full) {
                      return '<div > ' + (full.intIndex + 1) + ' </div>';
                  }
              },
           {
               aTargets: [1],
               mRender: function (data, type, full) {
                   return '<div > <input type="text" class="form-control" id="txtDetailCode" class="txtDetailCode" onchange="p_txtDetailCode_Changed(this,' + full.intIndex + ')"  value="' + full.txtCode + '" >  </div>';
               }
           },
           {
               aTargets: [2],
               mRender: function (data, type, full) {
                   return '<div > <input type="text" class="form-control" id="txtDetailDesc" class="txtDetailDesc" onchange="p_txtDetailDesc_Changed(this,' + full.intIndex + ')"  value="' + full.txtDesc + '" >  </div>';

               }
           },
           {
               aTargets: [3],
               mRender: function (data, type, full) {
                   if (full.bitActive) {
                       return '<div > <input type="checkbox" id="chkDetailActive" class="chkDetailActive" onchange="p_chkDetailActive_Changed(this,' + full.intIndex + ')"  checked="' + full.bitActive + '" >  </div>';
                   } else {
                       return '<div > <input type="checkbox" id="chkDetailActive" class="chkDetailActive" onchange="p_chkDetailActive_Changed(this,' + full.intIndex + ')" >  </div>';
                   }
                   
               }
           },
           {
               aTargets: [4],
               mRender: function (data, type, full) {
                   return '<div > <input type="button" class="btn btn-warning" id="btnDetailDelete" class="btnDetailDelete" onclick="p_btnDetailDelete_Click(this,' + full.intIndex + ')"  value="Delete" >  </div>';

               }
           }
        ]
    });

    $("#dtDetail").css("width", "100%"); 

}


function p_AddRow() {
    
    clsGlobal.showLoading();
    $.ajax({
        type: "POST",
        url: "/System/Template/AddRow",
        data: { data: $("#txtHiddenObject").val(), __RequestVerificationToken: $('#frm1 input[name=__RequestVerificationToken]').val() },
        datatype: "json",
        success: function (retDat) {

            if (retDat.bitSuccess == true) {
                if (retDat.objData != undefined) {  
                    p_SetHiddenObject(retDat.objData);
                    p_DataToUIDetail(retDat.objData.itemList);
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


function p_txtDetailCode_Changed(objCaller, intIndex)
{
    
    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());
    for (i = 0; i < objData.itemList.length; i++) {
        // Cari Index-nya.
        if (objData.itemList[i].intIndex == intIndex) {
            // Ketemu, mulai dari sini:
            objData.itemList[i].txtCode = objCaller.value;
            break;
        }
    }
    p_SetHiddenObject(objData);
}

function p_txtDetailDesc_Changed(objCaller, intIndex)
{
    
    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());
    for (i = 0; i < objData.itemList.length; i++) {
        // Cari Index-nya.
        if (objData.itemList[i].intIndex == intIndex) {
            // Ketemu, mulai dari sini:
            objData.itemList[i].txtDesc = objCaller.value;
            break;
        }
    }
    p_SetHiddenObject(objData);
}

function p_chkDetailActive_Changed(objCaller, intIndex)
{
    
    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());
    for (i = 0; i < objData.itemList.length; i++) {
        // Cari Index-nya.
        if (objData.itemList[i].intIndex == intIndex) {
            // Ketemu, mulai dari sini:
            objData.itemList[i].bitActive = objCaller.checked;
            break;
        }
    }
    p_SetHiddenObject(objData);
}

function p_btnDetailDelete_Click(objCaller, intIndex) {
    
    // Parse dari HiddenObject->JSON
    var objData = JSON.parse(p_UIToData());
    for (i = 0; i < objData.itemList.length; i++) {
        // Cari Index-nya.
        if (objData.itemList[i].intIndex == intIndex) {
            // Ketemu, mulai dari sini:
            // Remove from list.
            objData.itemList.splice(i, 1);

            //var row = oTable.row($(this).parents('tr'));
            //var rowNode = row.node();
            //row.remove().draw();
            oTable.row(i).remove().draw(false)   ;
            break;
        }
    }
    p_SetHiddenObject(objData);
}


function p_Download() {
    
    clsGlobal.showLoading();
    $.ajax({
        type: "POST",
        url: "/System/Template/Download",
        data: { data: $("#txtHiddenObject").val(), __RequestVerificationToken: $('#frm1 input[name=__RequestVerificationToken]').val() },
        datatype: "json",
        success: function (retDat) {
            
            if (retDat.bitSuccess == true) {
                if (retDat.objData != undefined) {
                    window.open(retDat.objData, '_blank');
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

  $('#btnLOVID').bind('click', function () { 
      try {           
           LOV = clsGlobal.generateLOV(MODULE_TEMPLATE, "txtID");
      }catch(ex) {
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
 

  $('#btnAddRow').on('click', function () {
      try {
          p_AddRow();
      } catch (ex) {
          clsGlobal.showAlert(ex);
      } 
  });

  $('#btnDownload').on('click', function () {
      try {
          p_Download();
      } catch (ex) {
          clsGlobal.showAlert(ex);
      } 
  });




