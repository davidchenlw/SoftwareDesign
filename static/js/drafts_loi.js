var is_edit = false;

function deleteLOI(id) {
    var del = confirm("確定刪除?");

    
    if (del) {
    
        $('#loading').show();
        url = '/loi_drafts/' + id
        $.ajax({
            url: url,
            type: "DELETE",
          
            success: function () {
                $('#loading').hide()
                window.location = '/loi_drafts';
            },
            error: function (e) {
                $('#loading').hide()
                alert("Delete failed!")
            }
        });
    }
}

function finishLOI(id) {
    var del = confirm("確定製作該景線?");
    if (del) {
        $('#loading').show();
        url = '/loi_drafts/' + id
        $.ajax({
            url: url,
            type: "PUT",
          
            success: function () {
                window.location = '/loi_drafts';
            },
            error: function () {
                $('#loading').hide()
                alert("finish failed!")
            }
        });
    }
}


function editLOI(id) {

    url = '/session/' + "LOIDraft"+"/"+"true"
    $.ajax({
        url: url,
        type: "GET",
        
        success: function () {
            loi = '/' + id + '/loi';
            window.location = '/edit_player' + loi;
        },
        error: function () {
            alert("edit failed!")
        }
    });
    
}


 