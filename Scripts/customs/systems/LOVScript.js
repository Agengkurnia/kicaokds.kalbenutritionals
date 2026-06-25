//=======================
// VARIABLE GLOBAL
//=======================
var Mdl = stringempty;
var Fnc = stringempty;
var Query = stringempty;

var clsGlobal = new clsGlobalClass();

//=======================
// ON PAGE LOAD
//=======================
$(document).ready(function () {
    p_initForm();
    p_validatePage();
    p_showPrevData();
    p_ReinitialComponent();
});

//=======================
// FUNCTION
//=======================
function p_initForm() {
    Mdl = $.getParameter("Mdl");
    Fnc = $.getParameter("Fnc");
    Query = $.getParameter("Query");

    $("#txtFunction").val(Fnc);
}

function p_validatePage() {

}

function p_showPrevData() {
     
    if (Mdl != undefined && Fnc != undefined) { 
        // Format datatable
        var oTable = $('#tbLOV').DataTable({
            "bPaginate": true,
            "bSort": false, 
            "iDisplayLength": 10,
            "processing": true,
            "serverSide": true,
            "type": "POST",
            "ajax": {
                "url": "/System/LOV/GetDataSourceJSONPaging?data=" + GetLOVParameter(),
                "method": "POST",
                "dataSrc": function (json) {
                    // Check for any success condition or custom response fields
                    if (json.bitSuccess) {
                        // Custom logic if success condition is met
                        return json.data;
                    } else {
                        // Handle cases where the response has errors but AJAX call was successful
                        alert("Error Message: " + json.txtMessage);
                        return json.data;
                    }
                }
            },
            aoColumnDefs: [
                  {
                      aTargets: [0],
                      mRender: function (data, type, full) {
                          $("#lblPilih").html("Pilih"); 
                          return '<input type="button" class="btnSelect" value="Pilih" onclick="btnSelect_Click(\'' + clsGlobal.parseToString(full.txtColumn1).replace('\'', '').replace(/(?:\r\n|\r|\n)/g, '') + '|' + clsGlobal.parseToString(full.txtColumn2).replace('\'', '').replace(/(?:\r\n|\r|\n)/g, '') + '|' + clsGlobal.parseToString(full.txtColumn3).replace('\'', '').replace(/(?:\r\n|\r|\n)/g, '') + '|' + clsGlobal.parseToString(full.txtColumn4).replace('\'', '').replace(/(?:\r\n|\r|\n)/g, '') + '|' + clsGlobal.parseToString(full.txtColumn5).replace('\'', '').replace(/(?:\r\n|\r|\n)/g, '') + '|' + clsGlobal.parseToString(full.txtColumn6).replace('\'', '').replace(/(?:\r\n|\r|\n)/g, '') + '|' + clsGlobal.parseToString(full.txtColumn7).replace('\'', '').replace(/(?:\r\n|\r|\n)/g, '') + '|' + clsGlobal.parseToString(full.txtColumn8).replace('\'', '').replace(/(?:\r\n|\r|\n)/g, '') + '|' + clsGlobal.parseToString(full.txtColumn9).replace('\'', '').replace(/(?:\r\n|\r|\n)/g, '') + '|' + clsGlobal.parseToString(full.txtColumn10).replace('\'', '').replace(/(?:\r\n|\r|\n)/g, '') + '\')" >';
                      }
                  },
               {
                   aTargets: [1],
                   mRender: function (data, type, full) {
                       $("#lblColumnName1").html(full.txtColumnName1);
                       if (full.bitColumnRight1) {
                           return '<div class="text-right" style="display:block;" > ' + clsGlobal.parseToString(full.txtColumn1) + ' </div>';
                       } else {
                           return '<div > ' + clsGlobal.parseToString(full.txtColumn1) + ' </div>';
                       } 
                   }
               },
               {
                   aTargets: [2],
                   mRender: function (data, type, full) {
                       $("#lblColumnName2").html(full.txtColumnName2);
                       if (full.bitColumnRight2) {
                           return '<div class="text-right" style="display:block;"  >  ' + clsGlobal.parseToString(full.txtColumn2) + '  </div>';
                       } else {
                           return '<div >  ' + clsGlobal.parseToString(full.txtColumn2) + '  </div>';
                       }
                       
                   }
               },
               {
                   aTargets: [3],
                   mRender: function (data, type, full) {
                       $("#lblColumnName3").html(full.txtColumnName3);
                       if (full.bitColumnRight3) {
                           return '<div class="text-right" style="display:block;"  >  ' + clsGlobal.parseToString(full.txtColumn3) + '  </div>';
                       } else {
                           return '<div >  ' + clsGlobal.parseToString(full.txtColumn3) + '  </div>';
                       }
                       
                   }
               },
               {
                   aTargets: [4],
                   mRender: function (data, type, full) {
                       $("#lblColumnName4").html(full.txtColumnName4);
                       if (full.bitColumnRight4) {
                           return '<div class="text-right" style="display:block;"  >  ' + clsGlobal.parseToString(full.txtColumn4) + '  </div>';
                       } else {
                           return '<div >  ' + clsGlobal.parseToString(full.txtColumn4) + '  </div>';
                       }
                       
                   }
               },
               {
                   aTargets: [5],
                   mRender: function (data, type, full) {
                       $("#lblColumnName5").html(full.txtColumnName5);
                       if (full.bitColumnRight5) {
                           return '<div class="text-right" style="display:block;"  >  ' + clsGlobal.parseToString(full.txtColumn5) + '  </div>';
                       } else {
                           return '<div >  ' + clsGlobal.parseToString(full.txtColumn5) + '  </div>';
                       }
                       
                   }
               },
               {
                   aTargets: [6],
                   mRender: function (data, type, full) {
                       $("#lblColumnName6").html(full.txtColumnName6);
                       if (full.bitColumnRight6) {
                           return '<div class="text-right" style="display:block;"  >  ' + clsGlobal.parseToString(full.txtColumn6) + '  </div>';
                       } else {
                           return '<div >  ' + clsGlobal.parseToString(full.txtColumn6) + '  </div>';
                       }
                       
                   }
               },
               {
                   aTargets: [7],
                   mRender: function (data, type, full) {
                       $("#lblColumnName7").html(full.txtColumnName7);
                       if (full.bitColumnRight7) {
                           return '<div class="text-right" style="display:block;"  >  ' + clsGlobal.parseToString(full.txtColumn7) + '  </div>';
                       } else {
                           return '<div >  ' + clsGlobal.parseToString(full.txtColumn7) + '  </div>';
                       }
                       
                   }
               },
               {
                   aTargets: [8],
                   mRender: function (data, type, full) {
                       $("#lblColumnName8").html(full.txtColumnName8);
                       if (full.bitColumnRight8) {
                           return '<div class="text-right" style="display:block;"  >  ' + clsGlobal.parseToString(full.txtColumn8) + '  </div>';
                       } else {
                           return '<div >  ' + clsGlobal.parseToString(full.txtColumn8) + '  </div>';
                       }
                       
                   }
               },
               {
                   aTargets: [9],
                   mRender: function (data, type, full) {
                       $("#lblColumnName9").html(full.txtColumnName9);
                       if (full.bitColumnRight9) {
                           return '<div class="text-right" style="display:block;"  >  ' + clsGlobal.parseToString(full.txtColumn9) + '  </div>';
                       } else {
                           return '<div >  ' + clsGlobal.parseToString(full.txtColumn9) + '  </div>';
                       }
                       
                   }
               },
               {
                   aTargets: [10],
                   mRender: function (data, type, full) {
                       $("#lblColumnName10").html(full.txtColumnName10);
                       if (full.bitColumnRight10) {
                           return '<div class="text-right" style="display:block;"  >  ' + clsGlobal.parseToString(full.txtColumn10) + '  </div>';
                       } else {
                           return '<div >  ' + clsGlobal.parseToString(full.txtColumn10) + '  </div>';
                       }
                       
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

       //$('#tbLOV_filter input').bind('blur', function (e) {                   
       //    oTable.search(this.value).draw();
       // }); 
    }   
}
   
function ChooseLOV(intCounter, txtValue, txtDescription) {
    //alert("choose " + intCounter + " " + txtValue + " " + txtDescription);
}

function GetLOVParameter() { 
    var htmlJSON = $("#txtHiddenObject").val();
    var jsonObj = [];
    if (htmlJSON == '') { htmlJSON = "[{}]"; } 
    jsonObj = JSON.parse(htmlJSON); 
    jsonObj[0].Mdl = Mdl;
    jsonObj[0].Fnc = Fnc;
    jsonObj[0].Query = Query;
      
    return JSON.stringify(jsonObj);
}
 
//=======================
// HANDLER
//=======================
function p_ReinitialComponent() {
   
}

function btnSelect_Click(val) {
    window.parent.setChooseLOV($("#txtFunction").val() + "|" + val);
}
