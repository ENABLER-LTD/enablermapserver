//屋内地図Map上に書く
var getmapdetail = function (companycode) {
    $.ajax({
        type: 'GET',
        url: mapconfig.getindoordetail() + companycode,
        success: function (data) {
            if (data != null) {
                indoordetail = data;
                for (let i = 0, len = indoordetail.length; i < len; i++) {
                    var templist = indoordetail[i].position.split("|");
                    var areaCoords = [];
                    for (let j = 0, len = templist.length; j < len; j++) {
                        var tempstring = {
                            lat: Number(templist[j].split(",")[0]),
                            lng: Number(templist[j].split(",")[1])
                        }
                        areaCoords.push(tempstring);
                    }
                    var areaTriangle = new google.maps.Polygon({
                        paths: areaCoords,
                        strokeColor: "#FF0000",
                        strokeOpacity: 0.8,
                        strokeWeight: 3,
                        fillColor: "#FF0000",
                        fillOpacity: 0.35,
                    });
                    areaTriangle.setMap(map);
                    areaTriangle.addListener("click", function () {
                        showindoormap(indoordetail[i].svgfile, indoordetail[i].keypoint);
                    });
                }
            }
        },
        error: function (err) {
            console.log(err);
        }
    })
};

var showindoormap = function (filename, keypoint) {
    $.cookie('filename', filename);
    $.cookie('keypoints', keypoint);
    window.open(mapconfig.getbaseurl() + 'indoorfloorbeacon');
};




//画面初期化
var init = function () {
    const companycode=$.cookie("enabermap.uid").substring(0,5);

    const Tokyo = {lat: 35.68, lng: 139.75};
    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 10,
        center: Tokyo,
    });
    getBeacon();
    getmapdetail(companycode);
}
mapconfig = new mapconfig();




var beaconBox = document.querySelector('.beacon-point')
var beaconTitle = beaconBox.querySelector('.beacon-title')

var btn = document.querySelector('.beacon-shut')
var x = 0
var y = 0
var l = 0
var t = 0
var isDown = false
//clickの時
beaconTitle.onmousedown = function (e) {
    x = e.clientX
    y = e.clientY
    l = beaconBox.offsetLeft
    t = beaconBox.offsetTop
    isDown = true
    beaconBox.style.cursor = 'move'
}
//モバイルの時
window.onmousemove = function (e) {
    if (isDown == false) {
        return
    }
    var nx = e.clientX
    var ny = e.clientY
    //计算移动后的左偏移量和顶部的偏移量
    var nl = nx - (x - l)
    var nt = ny - (y - t)
    beaconBox.style.left = nl + 'px'
    beaconBox.style.top = nt + 'px'
}
//放す問
beaconTitle.onmouseup = function () {
    isDown = false
    beaconBox.style.cursor = 'default'
}

//getBeaconData
function getBeacon() {
    document.querySelectorAll('.removeflag').forEach(function (item) {
        item.remove()
    })
    $.ajax({
        type: 'GET',
        url: mapconfig.getAllBeacondetail(),
        async: false,
        dataType: 'json',
        success: function (data) {
            for (var i = 0; i < data.length; i++) {
                var temp = [];
                temp[0] = data[i].b_id;
                temp[1] = './icon/Positioning.png'
                temp[2] = data[i].b_name;
                temp[3] = data[i].b_uuid;
                temp[4] = data[i].b_major;
                temp[5] = data[i].b_minor;
                temp[6] = data[i].b_note;


                var tr = `<td>${i + 1}</td>
                        <td class="imgs">
                        <img src="${temp[1]}" onclick='latlngedit(${temp[0]})'/>
                        </td>
                        <td>${temp[2]}</td>
                        <td>${temp[3]}</td>
                        <td>${temp[4]}</td>
                        <td>${temp[5]}</td>
                        <td class="note-text">${temp[6]}</td>`

                $("#beacondetailtb").append('<tr class="text removeflag">' + tr + '</tr>');
            }
            // edit()
        },
        error: function (err) {
            console.log(err)
        }
    })
}


var beaconmarker = null;

//获取当前点击的第几个icon
function latlngedit(b_id) {
    $.cookie('selectbid', b_id);
    $.ajax({
        type: 'GET',
        url: mapconfig.getBeaconByid() + b_id,
        dataType: 'json',
        success: function (data) {
            if (beaconmarker != null) {
                beaconmarker.setMap(null);
                beaconmarker = null;
            }
            if ((data[0].b_lat != 0 && data[0].b_lon != 0) && (data[0].b_lat != null && data[0].b_lon != null)) {
                beaconmarker = new google.maps.Marker({
                    map,
                    draggable: true,
                    position: {lat: Number(data[0].b_lat), lng: Number(data[0].b_lon)},
                });

                var temppoint = {lat: Number(data[0].b_lat), lng: Number(data[0].b_lon)};
                map.setCenter(temppoint);

                google.maps.event.addListener(beaconmarker, "click", function (e) {
                    var result = window.confirm("この位置でBeacon設定ですか？");
                    if (result == true) {
                        $.ajax({
                            type: 'POST',
                            url: mapconfig.updateBeaconPosition(),
                            contentType: "application/json",
                            dataType: "text",
                            data: JSON.stringify({
                                "data": {
                                    "b_id": b_id,
                                    "b_lon": beaconmarker.position.lng(),
                                    "b_lat": beaconmarker.position.lat(),
                                    "b_alt": "0",
                                    "b_floor": "0"
                                }
                            }),
                            success: function (data) {
                                if (JSON.parse(data).status == 'success') {
                                    alert("Beacon Position updata success!");
                                    beaconmarker.setMap(null);
                                    beaconmarker = null;
                                    getBeacon();
                                } else {
                                    alert("Beacon Position updata failed!");
                                }
                            },
                            error: function () {
                                alert('Please check your network,if it is still not work.Please look admin for help!');
                            }
                        })
                    }

                })
            } else {
                alert("Beacon position is not exist!Add now");
                var updateBeaconListener = google.maps.event.addListener(map, "dblclick", function (event) {
                    if (beaconmarker != null) {
                        beaconmarker.setMap(null);
                        beaconmarker = null;
                    }

                    var lat = event.latLng.lat();
                    var lng = event.latLng.lng();
                    beaconmarker = new google.maps.Marker({
                        map,
                        draggable: true,
                        position: {lat: lat, lng: lng},
                    });


                    google.maps.event.addListener(beaconmarker, "click", function (e) {
                        var result = window.confirm("この位置でBeacon設定ですか？");
                        if (result == true) {
                            $.ajax({
                                type: 'POST',
                                url: mapconfig.updateBeaconPosition(),
                                contentType: "application/json",
                                dataType: "text",
                                data: JSON.stringify({
                                    "data": {
                                        "b_id": b_id,
                                        "b_lon": beaconmarker.position.lng(),
                                        "b_lat": beaconmarker.position.lat(),
                                        "b_alt": "0",
                                        "b_floor": "0"
                                    }
                                }),
                                success: function (data) {
                                    if (JSON.parse(data).status == 'success') {
                                        alert("Beacon Position updata success!");
                                        google.maps.event.removeListener(updateBeaconListener);
                                        beaconmarker.setMap(null);
                                        beaconmarker = null;
                                        getBeacon();
                                    } else {
                                        alert("Beacon Position updata failed!");
                                    }
                                },
                                error: function () {
                                    alert('Please check your network,if it is still not work.Please look admin for help!');
                                }
                            })
                        }

                    })
                });
            }
        }
        ,
        error: function (err) {
            console.log(err)
        }

    })

}


