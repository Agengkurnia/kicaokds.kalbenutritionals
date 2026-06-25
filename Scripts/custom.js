//this function for LOV
//return value must be in the same order
function ReturnLOV(txtParentTextBox, column1, column2, column3, column4, column5, column6, column7, column8, column9, column10) {
    
    var arr = txtParentTextBox.split(',');
    //looping array
    for (x = 0; x <= arr.length - 1; x++) {
        //return from Child to Parent Model
        if (x == 0) {
            $('#' + arr[x]).val(column1);
        }
        else if (x == 1) {
            $('#' + arr[x]).val(column2);
        }
        else if (x == 2) {
            $('#' + arr[x]).val(column3);
        }
        else if (x == 3) {
            $('#' + arr[x]).val(column4);
        }
        else if (x == 4) {
            $('#' + arr[x]).val(column5);
        }
        else if (x == 5) {
            $('#' + arr[x]).val(column6);
        }
        else if (x == 6) {
            $('#' + arr[x]).val(column7);
        }
        else if (x == 7) {
            $('#' + arr[x]).val(column8);
        }
        else if (x == 8) {
            $('#' + arr[x]).val(column9);
        }
        else if (x == 9) {
            $('#' + arr[x]).val(column10);
        }
    }

    $.fancybox.close();
}

function GenerateScript() {
    $('#txtAutonumeric').autoNumeric('init', { vMax: '999999999', vMin: '-999999999', aSep: ',', dGroup: '3', aDec: '.' });
    $('#txtDatepicker').datepicker({ gotoCurrent: true, changeMonth: true, changeYear: true });
}

function ValidateAndConfirm(message) {
    
    var $form = $('form');
    if($form.valid())
    {
        return confirm(message);
    }
}