var is_edit = false;

function deleteAOI(id) {
    var del = confirm("確定刪除?");

    
    if (del) {
    
        $('#loading').show();
        url = '/aoi_drafts/' + id
        $.ajax({
            url: url,
            type: "DELETE",
          
            success: function () {
                $('#loading').hide()
                window.location = '/aoi_drafts';
            },
            error: function (e) {
                $('#loading').hide()
                alert("Delete failed!")
            }
        });
    }
}

function finishAOI(id) {
    var del = confirm("確定製作該景區?");
    if (del) {
        $('#loading').show();
        url = '/aoi_drafts/' + id
        $.ajax({
            url: url,
            type: "PUT",
          
            success: function () {
                window.location = '/aoi_drafts';
            },
            error: function () {
                $('#loading').hide()
                alert("finish failed!")
            }
        });
    }
}


function editAOI(id) {

    url = '/session/' + "AOIDraft"+"/"+"true"
    $.ajax({
        url: url,
        type: "GET",
        
        success: function () {
            aoi = '/' + id + '/aoi';
            window.location = '/edit_player' + aoi;
        },
        error: function () {
            alert("edit failed!")
        }
    });
    
}


  