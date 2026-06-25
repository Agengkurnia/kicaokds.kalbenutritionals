//=======================
// VARIABLE GLOBAL
//=======================
 

//=======================
// ON PAGE LOAD
//=======================
$(document).ready(function () {
    p_InitForm();
    p_validatePage();
    p_showPrevData();
});

//=======================
// FUNCTION
//=======================
function p_InitForm() { 
     
}

function p_validatePage() {
    
}

function p_showPrevData() {

}
  
 
//=======================
// HANDLER
//=======================

$(document).ready(function () {
    $('#txtUserName').focus();

    //$('#txtUserName').bind('change', function () {
    //    p_PopulateRole();
    //});
});

function p_PopulateRole() {
    //$.blockUI();
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
    $.ajax({
        type: "POST",
        url: "/Account/PopulateRole",
        data: { txtUserName: $("#txtUserName").val(), __RequestVerificationToken: $('#FormLogin input[name=__RequestVerificationToken]').val() },
        datatype: "json",
        success: function (itemList) { 
            $('#txtRole').empty();
            $.each(itemList, function (i, data) {
                $('#txtRole').append($('<option>').text(data.txtRoleName).attr('value', data.intRoleID));
            });
            $.unblockUI();
        }
    });
}
