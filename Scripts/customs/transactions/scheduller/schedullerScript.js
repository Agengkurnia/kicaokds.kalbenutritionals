var clsGlobal = new clsGlobalClass();

$(document).ready(function () {
    $('#btnCallScheduller').click(function () {
        clsGlobal.showLoading();
        $.ajax({
            url: '/Scheduller/CallSchedullerCloseMKPPBOSNET',
            type: 'POST',
            success: function (response) {
                if (response.bitSuccess) {
                    clsGlobal.getAlert("Success!!");
                } else {
                    clsGlobal.getAlert(response.txtMessage);
                }
                clsGlobal.hideLoading();
            },
            error: function (xhr, status, error) {
                clsGlobal.getAlert(error);
                clsGlobal.hideLoading();
            }
        });
    });

    $('#btnCallSchedullerResubmitOnoErrorGateway').click(function () {
        clsGlobal.showLoading();
        $.ajax({
            url: '/Scheduller/CallSchedullerResubmitXXSHP_KCO_T_ONO_HDR',
            type: 'POST',
            success: function (response) {
                if (response.bitSuccess) {
                    clsGlobal.getAlert("Success!!");
                } else {
                    clsGlobal.getAlert(response.txtMessage);
                }
                clsGlobal.hideLoading();
            },
            error: function (xhr, status, error) {
                clsGlobal.getAlert(error);
                clsGlobal.hideLoading();
            }
        });
    });

    $('#btnCallSchedullerRetryBOSNET').click(function () {
        clsGlobal.showLoading();
        $.ajax({
            url: '/Scheduller/CallSchedullerRetryBOSNET',
            type: 'POST',
            success: function (response) {
                if (response.bitSuccess) {
                    clsGlobal.getAlert("Success!!");
                } else {
                    clsGlobal.getAlert(response.txtMessage);
                }
                clsGlobal.hideLoading();
            },
            error: function (xhr, status, error) {
                clsGlobal.getAlert(error);
                clsGlobal.hideLoading();
            }
        });
    });
});