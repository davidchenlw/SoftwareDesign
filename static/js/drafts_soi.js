var is_edit = false;

function deleteSOI(id) {
    var del = confirm("確定刪除?");

    
    if (del) {
    
        $('#loading').show();
        url = '/soi_drafts/' + id
        $.ajax({
            url: url,
            type: "DELETE",
          
            success: function () {
                $('#loading').hide()
                window.location = '/soi_drafts';
            },
            error: function (e) {
                $('#loading').hide()
                alert("Delete failed!")
            }
        });
    }
}

function finishSOI(id) {
    var del = confirm("確定製作該主題故事?");
    if (del) {
        $('#loading').show();
        url = '/soi_drafts/' + id
        $.ajax({
            url: url,
            type: "PUT",
          
            success: function () {
                window.location = '/soi_drafts';
            },
            error: function () {
                $('#loading').hide()
                alert("finish failed!")
            }
        });
    }
}


function editSOI(id) {

    url = '/session/' + "SOIDraft"+"/"+"true"
    $.ajax({
        url: url,
        type: "GET",
        
        success: function () {
            soi = '/' + id + '/soi';
            window.location = '/edit_player' + soi;
        },
        error: function () {
            alert("edit failed!")
        }
    });
    
}


 