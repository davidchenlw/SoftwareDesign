var is_edit = false;

function delete_poi(poi_id) {
    console.log(poi_id,"sdfsdfdsffds")
    var del = confirm("確定刪除?");
    if (del) {
        $('#loading').show();
        url = '/update_poi_drafts/' + poi_id
        console.log(url)
        $.ajax({
            url: url,
            type: "DELETE",
          
            success: function () {
                $('#loading').hide()
                window.location = '/poi_drafts';
            },
            error: function (e) {
                console.log("sdfsdfdsf")
                $('#loading').hide()
                alert("Delete failed!")
            }
        });
    }
}

function finishPOI(poi_id) {
    var del = confirm("確定製作該景點?");
    if (del) {
        $('#loading').show();
        url = '/update_poi_drafts/' + poi_id
        $.ajax({
            url: url,
            type: "PUT",
          
            success: function () {
                $('#loading').hide()
                window.location = '/poi_drafts';
            },
            error: function () {
                $('#loading').hide()
                alert("finish failed!")
            }
        });
    }
}


function edit_poi(poi_id) {

    url = '/session/' + "POIDraft"+"/"+"true"
    $.ajax({
        url: url,
        type: "GET",
        
        success: function () {
            poi = '/' + poi_id + '/poi';
            window.location = '/edit_player' + poi;
        },
        error: function () {
            alert("edit failed!")
        }
    });
    
}

 