mapconfig = new mapconfig();
let map;
const Tokyo = {lat: 35.68, lng: 139.75};
const areadic = {};
var shape;
var latlngString = "";
var lat;
var lng;
var url = window.location.href.toString();
var index = url.lastIndexOf("\/");
var area_id = url.substring(index + 1, url.length);


$.ajax({
    type: 'GET',
    async: false,
    url: mapconfig.getAreaName(),
    success: function (data) {
        for (let i = 0; i < data.length; i++) {
            areadic[data[i].area_type] = data[i].area_name;
            var temp = "<option value='" + data[i].area_type + "'>" + data[i].area_name + "</option>";
            $("#areaDefinition").append(temp);
        }
    },
    error: function (err) {
        console.log(err);
    }
})

$.ajax({
    type: 'GET',
    async: false,
    url: mapconfig.getareadetail() + area_id,
    success: function (data) {
        document.getElementById('jp').value = data[0].area_name;
        document.getElementById('en').value = data[0].area_nameeng;
        document.getElementById('areaDefinition').value = data[0].area_type;
        latlngString = data[0].area_latlng;
        document.getElementById('areaNote').value = data[0].area_note;
        document.getElementById('area_lat').value = data[0].area_lat;
        document.getElementById('area_lng').value = data[0].area_lng;
    },
    error: function (err) {
        console.log(err);
    }
})


var init = function () {
    map = new google.maps.Map(document.getElementById("map"), {
        center: Tokyo,
        zoom: 20,
    });

    //画图
    const drawingManager = new google.maps.drawing.DrawingManager({

        drawingMode: google.maps.drawing.OverlayType.TOP_CENTER,
        drawingControl: true,
        drawingControlOptions: {
            position: google.maps.ControlPosition.TOP_CENTER,
            drawingModes: [
                google.maps.drawing.OverlayType.POLYLINE
            ]
        },
        circleOptions: {
            fillColor: "#dc3545",
            fillOpacity: 0.5,
            strokeWeight: 1,
            clickable: false,
            editable: true,
            zIndex: 1,
        },
    })

    if (document.getElementById('area_lat').value != 0 && document.getElementById('area_lng').value != 0) {
        map.setCenter({
            lat: Number(document.getElementById('area_lat').value),
            lng: Number(document.getElementById('area_lng').value)
        });
        const triangleCoords = [];
        var pointlist = latlngString.split("|");
        for (let i = 0; i < pointlist.length; i++) {
            var temppoint = {lat: Number(pointlist[i].split(";")[0]), lng: Number(pointlist[i].split(";")[1])};
            triangleCoords.push(temppoint);
        }
        shape = new google.maps.Polygon({
            paths: triangleCoords,
            strokeWeight: 1,
            fillColor: "#dc3545",
            fillOpacity: 0.5,
        });
        shape.setMap(map);
    } else {
        drawingManager.setMap(map);
    }


    google.maps.event.addListener(drawingManager, 'overlaycomplete', function (event) {
        shape = event.overlay;
        var length = shape.getPath().getLength();
        for (let i = 0; i < length - 1; i++) {
            if (i == 0) {
                var tempstring = shape.getPath().getAt(i).lat() + ";" + shape.getPath().getAt(i).lng();
                latlngString = latlngString + tempstring;
                document.getElementById('area_lat').value = shape.getPath().getAt(i).lat();
                document.getElementById('area_lng').value = shape.getPath().getAt(i).lng();
            } else {
                var tempstring = "|" + shape.getPath().getAt(i).lat() + ";" + shape.getPath().getAt(i).lng();
                latlngString = latlngString + tempstring;
            }

        }
        drawingManager.setMap(null);
    });

    document.getElementById('redraw').addEventListener('click', function () {
        drawingManager.setMap(map);
        document.getElementById('area_lat').value = "";
        document.getElementById('area_lng').value = "";
        latlngString = "";
        shape.setMap(null);
        shape = null;
    })
}


var editBox = document.querySelector('.area-edit')
var title = editBox.querySelector('.navigation-box')

var x = 0
var y = 0
var l = 0
var t = 0
var isDown = false
//clickの時
title.onmousedown = function (e) {
    x = e.clientX
    y = e.clientY
    l = editBox.offsetLeft
    t = editBox.offsetTop
    isDown = true
    editBox.style.cursor = 'move'
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
    editBox.style.left = nl + 'px'
    editBox.style.top = nt + 'px'
}
//放す問
title.onmouseup = function () {
    isDown = false
    editBox.style.cursor = 'default'
}

document.getElementById('deletebtn').addEventListener('click', function () {
    $.ajax({
        type: 'POST',
        url: mapconfig.deletearea(),
        contentType: "application/json",
        dataType: "text",
        data: JSON.stringify({
            "data": {
                "area_id": area_id
            }
        }),
        success: function (data) {
            if (JSON.parse(data).status == 'success') {
                alert("delete area success!");
                window.location.href = '../arealist';
            } else {
                alert("delete area failed!");
            }
        },
        error: function () {
            alert('Please check your network,if it is still not work.Please look admin for help!');
        }
    })
})

document.getElementById('area-submit-btn').addEventListener('click', function () {
    if (document.getElementById('jp').value != null && document.getElementById('en').value != null) {
        $.ajax({
            type: 'POST',
            url: mapconfig.updateareadetail(),
            contentType: "application/json",
            dataType: "text",
            data: JSON.stringify({
                "data": {
                    "area_id": area_id,
                    "area_name": document.getElementById('jp').value,
                    "area_nameeng": document.getElementById('en').value,
                    "area_type": document.getElementById('areaDefinition').value,
                    "area_latlng": latlngString,
                    "area_note": document.getElementById('areaNote').value,
                    "area_lat": document.getElementById('area_lat').value,
                    "area_lng": document.getElementById('area_lng').value
                }
            }),
            success: function (data) {
                if (JSON.parse(data).status == 'success') {
                    alert("update area success!");
                    window.location.href = '../arealist';
                } else {
                    alert("update area failed!");
                }
            },
            error: function () {
                alert('Please check your network,if it is still not work.Please look admin for help!');
            }
        })
    }

})
