member_id = ""
eventID = ""
function Authorized(event_id, user_id,auth) {
        var urls = '../event_authorized';
        data = {
            auth:auth,
            event_id: event_id,
            user_id: user_id,
        }
        $.ajax({
            headers: {'Content-Type': 'application/json'},
            method: "PUT",
            data: JSON.stringify(data),
            url: urls,
            success: function () {
                //$('input[type="submit"]').disabled = true;
                window.location.reload()
            },
            error: function (data) {
                console.log(data);
                alert("授權失敗")
            }
        });
}
function Kickout(event_id, member_id) { //event_id 可拿掉
    var urls = '../ajax_invite';
    data = {
        action: 'kickout',
        event_id: event_id,
        member_id: member_id,
    }
    $.ajax({
        method: "POST",
        data: data,
        url: urls,
        success: function (data) {
            if (data == 'success') {
                var languages = $('#language').val();
                if (languages == "chinese") {
                    alert('已將用戶移出活動');
                }
                else if (languages == "english") {
                    alert('User removed');
                }
                else if (languages == "japanese") {
                    alert('ユーザーが削除されました');
                }
                $('#member' + member_id).fadeOut();
            } else {
                alert('Error');
            }
        },
        error: function (data) {
            console.log(data);
        }
    });
}

function modify_event() {
    var urls = '../ajax_events';
    var event_name = $('#edit_title').val();
    var opens = $("#event-open").val();
    var event_info = $('#event_info').val();
    var event_start_time = $('#event_start_time').val().replace('T',' ');
    var event_end_time = $('#event_end_time').val().replace('T',' ');

    data = {
        event_id: event_id,
        event_make: 'edit_event',
        event_name: event_name,
        event_info: event_info,
        open: opens, //Check open value in cloud server
        event_start_time: event_start_time,
        event_end_time: event_end_time,
    }
    // console.log(data);
    // alert(data);
    $.ajax({
        method: "POST",
        data: data,
        url: urls,
        success: function (data) {
            if (data == 'success') {
                $('#event_info').delay(1000).fadeOut('slow');
                $('#event_modal').modal('hide');
                location.reload();
            }else if(data == "repeat"){
                alert("repeat event name");
                $('#event_info').delay(1000).fadeOut('slow');
                $('#event_modal').modal('hide');
            }else{
                alert("repeat event name!!!!");
                alert(data)
                $('#event_info').delay(1000).fadeOut('slow');
                $('#event_modal').modal('hide');
            }
        },
        error: function (data) {
            alert("error!!");
            console.log(data);
        }
    });
}
function selectedGroupSubmit(event_id){
    var obj=document.getElementsByName("selectedGroup");
    var len = obj.length;
    var selectedGroupID=[];
    var count=0;

    for(var i = 0; i < len; i++)
    {
        if (obj[i].checked == true)
        {
            selectedGroupID[count]=obj[i].value;
            count++;
        }
    }
    // for(var i = 0; i < count; i++)
    // {
    //     alert(selectedGroupID[i]);
    // }

    /*刪掉[EventsGroup]中原本event_id==這邊的event_id的資料*/
    /*新增這次所選擇的Group到[EventsGroup]中*/
    data = {
        event_id: event_id,
        selectedGroupID: JSON.stringify(selectedGroupID),
    }
    $.ajax({
        method: "POST",
        data: data,
        url: '../event_authority',
        success: function (data) {
            if (data == 'success') {
                alert("成功修改授權群組");
            }
        },
        error: function (data) {
            alert("error!!");
            console.log(data);
        }
    });
}

$('#event-open').change(function() {
    var open = $(this).val();
    var btn = document.getElementById("privateSetting");
    if(open == 1)
    {
        btn.disabled = true;
    }
    else
    {
        btn.disabled = false;
    }
});

$('.authorized-list-item').click((event) => {
    let val = parseInt($(event.target).val());
    let check = parseInt($(event.target).attr('check'));
    let text = $(event.target).text().replace(/\s+/g, "");

    $(event.target).val(val + check);
    $(event.target).attr('check', check * -1);
    $(event.target).removeClass('active');
    if (val % 2 == 0) {
        $(event.target).html('<span class="glyphicon glyphicon-minus" aria-hidden="true" style="padding-right:5px"></span>' + text);
    } else {
        $(event.target).addClass('active');
        $(event.target).html('<span class="glyphicon glyphicon-ok" aria-hidden="true" style="padding-right:5px"></span>' + text);
    }
});
$('#authorized').on('show.bs.modal', (event) => {
    event_id = $(event.relatedTarget).data('event_id')
    member_id = $(event.relatedTarget).data('member_id')
    let url = '/get_all_event_authorized';
    let data = {
        event_id: event_id,
        member_id: member_id,
    };
    $.ajax({
        method: 'POST',
        data: data,
        url: url,
        success: (data) => {
            console.log(data)
            authorized_list = ['出題','評量(問答題)','啟用場次']
            $('.authorized-list-item').each((index, element) => {
                if (data[index]) {
                    $(element).attr('check', 1);
                    $(element).val(2);
                    $(element).addClass('active');
                    $(element).html('<span class="glyphicon glyphicon-ok" aria-hidden="true" style="padding-right:5px"></span>' + authorized_list[index]);
                } else {
                    $(element).attr('check', -1);
                    $(element).val(1);
                    $(element).removeClass('active');
                    $(element).html('<span class="glyphicon glyphicon-minus" aria-hidden="true" style="padding-right:5px"></span>' + authorized_list[index] );
                }
            })
        },
        error: (data) => {
            console.log('Fail');
        },
    });
});
function save() {
    let authorized = []
    $('.authorized-list-item').each((index, element) => {
        let value = $(element).val();
        if (value % 2 == 0 ) {
            authorized.push(index)
        }
    });
    let url = '/save_member_authorized';
    let data = {
        add: JSON.stringify(authorized),
        member_id:member_id,
        event_id: event_id
    }
    
    $('#loading').show();
    $.ajax({
        method: 'POST',
        url: url,
        data: data,

        success: (data) => {
            $('#authorized').modal('hide');
            $('#loading').hide();
        },

        error: (data) => {
            $('#authorized').modal('hide');
            $('#loading').hide();
        }
    });

}