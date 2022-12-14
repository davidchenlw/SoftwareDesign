var web_map;
var mobile_map;
let markers = {
    web: [],
    mobile: [],
    point: [],
};
var platform = new H.service.Platform({
    'apikey': 'KltNt3WCaOrzMwVN4GmggfYufT5-vA3E7Xx3Ocq2ASg'
    });
var defaultLayers = platform.createDefaultLayers({lg:'cht'});

$("a[data-toggle='tab'][href='#web_history']").on('shown.bs.tab', function(e){

    if(web_map == null)
    {
        web_map = new H.Map(
            document.getElementById('web-history-map'),
            defaultLayers.raster.normal.map, {
                zoom: 8,
                center: { lat: 23.5, lng: 121.120850 },
                pixelRatio: window.devicePixelRatio || 1
            });
        var web_mapEvents = new H.mapevents.MapEvents(web_map);
        var web_behavior = new H.mapevents.Behavior(web_mapEvents);
        var web_ui = H.ui.UI.createDefault(web_map, defaultLayers, 'zh-CN')
    }
    
})

$("a[data-toggle='tab'][href='#mobile_history']").on('shown.bs.tab', function(e){
    
    if(mobile_map == null)
    {
        mobile_map = new H.Map(
            document.getElementById('mobile-history-map'),
            defaultLayers.raster.normal.map, {
                zoom: 8,
                center: { lat: 23.5, lng: 121.120850 },
                pixelRatio: window.devicePixelRatio || 1
            });
        var mobile_mapEvents = new H.mapevents.MapEvents(mobile_map);
        var mobile_behavior = new H.mapevents.Behavior(mobile_mapEvents);
        var mobile_ui = H.ui.UI.createDefault(mobile_map, defaultLayers, 'zh-CN')
    }
    
})



$(document).ready(function () {
    $('#web_search').bind('click', () => hisSearch('web'));
    $('#mobile_search').bind('click', () => hisSearch('mobile'));
    initTime();
})

function initTime() {
    let now = new Date();

    let day = ("0" + now.getDate()).slice(-2);
    let month = ("0" + (now.getMonth() + 1)).slice(-2);
    let today = now.getFullYear() + "-" + month + "-" + day;

    let hour = ("0" + now.getHours()).slice(-2);
    let minute = ("0" + now.getMinutes()).slice(-2);
    let time = hour + ":" + minute;

    $('#wend_date').val(today);
    $('#wend_time').val(time);
    $('#mend_date').val(today);
    $('#mend_time').val(time);


    now.setDate(now.getDate() - 1);
    day = ("0" + now.getDate()).slice(-2);
    month = ("0" + (now.getMonth() + 1)).slice(-2);
    today = now.getFullYear() + "-" + month + "-" + day;

    $('#wstart_date').val(today);
    $('#wstart_time').val(time);
    $('#mstart_date').val(today);
    $('#mstart_time').val(time);


}



function hisSearch(type) {
    let contentType = $('#' + type + '_contents').val();
    let startTime = $('#' + type[0] + 'start_date').val() + 'T' + $('#' + type[0] + 'start_time').val();
    let endTime = $('#' + type[0] + 'end_date').val() + 'T' + $('#' + type[0] + 'end_time').val();
    let userName = $('#search_user').val();

    if (startTime.includes('/')) {
        startTime.replace('/', '-');
        endTime.replace('/', '-');
    }

    let data = {
        log_type: type,
        content_type: contentType,
        coi: COI_NAME,
        start_time: startTime,
        end_time: endTime,
        user_name: userName,
    }

    let url = '/ajax_newhistorynew';

    if (startTime.length > 15 && endTime.length > 15 && userName != '') {
        $('#' + type + '_search').prop('disabled', true);
        $.ajax({
            method: 'POST',
            data: data,
            url: url,

            success: data => {
                $('#' + type + '_search').prop('disabled', false);
                if (data.length > 0) {
                    dataAppend(data, type, contentType);
                } else {
                    $('#' + type + '_table').html('<tr><td colspan="2" style="text-align: center">No data</td></tr>');
                }
            },

            error: data => {
                console.log(data);
                $('#' + type + '_search').prop('disabled', false);
            },
        });
    }
}

function dataAppend(data, platform, type) {
    let table = $('#' + platform + '_table');
    let latlngArray = [];
    let pointArray = [];
    let webCount = 0;
    let mobileCount = 0;

    deleteAllMarker(platform);
    deleteAllMarker('point');
    table.children().remove();

    for (let i = 0; i < data.length; ++i) {
        let date = new Date(data[i].dt);

        let day = ("0" + date.getDate()).slice(-2);
        let month = ("0" + (date.getMonth() + 1)).slice(-2);
        let hour = ("0" + date.getHours()).slice(-2);
        let minute = ("0" + date.getMinutes()).slice(-2);

        let appendStr = '';

        if (platform == 'web') {
            latlngArray.push([parseFloat(data[i].page.lati), parseFloat(data[i].page.long), data[i].page.title, data[i].page.type]);
            appendStr = '<tr onclick="setMapCenter(' + webCount + ', `web`)" ><td>' +
                month + '/' + day + ' ' + hour + ':' + minute + '</td><td>' +
                '<a href="' + COI_URL + type + '_detail/' + data[i].page.id + '">' + data[i].page.title + '<a></td></tr>';
            webCount += 1;
        } else {
            appendStr = '<tr onclick="setMapCenter(' + mobileCount + ', `mobile`)" ><td>' +
                month + '/' + day + ' ' + hour + ':' + minute + '</td><td>';

            if (data[i].page.type != 'search') {
                pointArray.push([parseFloat(data[i].page.lati), parseFloat(data[i].page.long), data[i].page.title, data[i].page.type]);
                let typeStr;
                if (data[i].page.type == 'poi') {
                    typeStr = '(??????)';
                } else if (data[i].page.type == 'loi') {
                    typeStr = '(??????)';
                } else if (data[i].page.type == 'aoi') {
                    typeStr = '(??????)';
                } else if (data[i].page.type == 'soi') {
                    typeStr = '(??????)';
                }

                appendStr += '<a href="' + COI_URL + data[i].page.type + '_detail/' + data[i].page.id + '">' + data[i].page.title + typeStr + '<a></td></tr>';
            } else {
                if (data[i].page.title == 'nearbyPOI') {
                    data[i].page.title = '??????????????????';
                } else if (data[i].page.title == 'nearbyLOI') {
                    data[i].page.title = '??????????????????';
                } else if (data[i].page.title == 'nearbyAOI') {
                    data[i].page.title = '??????????????????';
                } else if (data[i].page.title == 'nearbySOI') {
                    data[i].page.title = '??????????????????';
                } else if (data[i].page.title == 'UserLogin') {
                    data[i].page.title = '????????????';
                } else if (data[i].page.title == 'userPOI') {
                    data[i].page.title = '?????????????????????';
                } else if (data[i].page.title == 'userLOI') {
                    data[i].page.title = '?????????????????????';
                } else if (data[i].page.title == 'userAOI') {
                    data[i].page.title = '?????????????????????';
                } else if (data[i].page.title == 'userSOI') {
                    data[i].page.title = '?????????????????????';
                } else {
                    data[i].page.title = data[i].page.title;
                }

                appendStr += data[i].page.title + '</td></tr>';
            }
            mobileCount += 1;
            latlngArray.push([parseFloat(data[i].ulatitude), parseFloat(data[i].ulongitude), data[i].page.title, 'search']);
        }
        table.append(appendStr);
    }
    setMapMarker(latlngArray, platform);
    setMapMarker(pointArray, 'point');
}


function setMapCenter(index, mapType) {
    map[mapType].setCenter(markers[mapType][index].position);
    google.maps.event.trigger(markers[mapType][index], 'click');
    if (map[mapType].getZoom() < 12) {
        map[mapType].setZoom(12);
    }

    if (mapType == 'mobile') {
        clearAllMarker('point');
        addMapMarker(markers['point'][index], map[mapType]);
    }
}

function setMapMarker(latlng, platform) {
    let content_color;
    for (let i = 0; i < latlng.length; ++i) {
        switch (latlng[i][3]) {
            case 'poi':
                content_color = 'FE6256';
                break;
            case 'loi':
                content_color = '58ABFE';
                break;
            case 'aoi':
                content_color = '1AFD9C';
                break;
            case 'soi':
                content_color = '8080ff';
                break;
            case 'search':
                content_color = 'ffff33';
                break;
            default:
                content_color = '10060f';
                break;
        }

        let marker = new google.maps.Marker({
            position: { lat: latlng[i][0], lng: latlng[i][1] },
            map: map[platform],
            icon: 'http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|' + content_color + '|000000'
        });

        let infowindow = new google.maps.InfoWindow({
            content: latlng[i][2]
        });

        marker.addListener('click', () => {
            infowindow.open(marker.get('map'), marker);
        });

        markers[platform].push(marker);
    }
}

function addMapMarker(marker, markerMap) {
    marker.setMap(markerMap);
}

function clearAllMarker(key) {
    for (let i = 0; i < markers[key].length; ++i) {
        addMapMarker(markers[key][i], null);
    }
}

function deleteAllMarker(key) {
    clearAllMarker(key);
    markers[key] = [];
}
