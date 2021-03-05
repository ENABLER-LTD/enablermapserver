mapconfig = new mapconfig();
let map;
const Tokyo = {lat: 35.68, lng: 139.75};
const areadic = {};
var shape;
var latlngString = "";
var lat;
var lng;
const companycode = $.cookie("enabermap.uid").substring(0, 5);


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
    window.open(mapconfig.getbaseurl() + 'floorselect');
};

var test = null;
var init = function () {
    map = new google.maps.Map(document.getElementById("map"), {
        center: Tokyo,
        zoom: 10,
    });
    getmapdetail(companycode);

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
    drawingManager.setMap(map);

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


document.getElementById('area-submit-btn').addEventListener('click', function () {
    if (document.getElementById('area_lat').value == "" || document.getElementById('area_lat').value == null) {
        lat = 0;
    } else {
        lat = document.getElementById('area_lat').value;
    }

    if (document.getElementById('area_lng').value == "" || document.getElementById('area_lng').value == null) {
        lng = 0;
    } else {
        lng = document.getElementById('area_lng').value;
    }

    if (document.getElementById('jp').value != null && document.getElementById('en').value != null) {
        $.ajax({
            type: 'POST',
            url: mapconfig.addareadetail(),
            contentType: "application/json",
            dataType: "text",
            data: JSON.stringify({
                "data": {
                    "area_name": document.getElementById('jp').value,
                    "area_nameeng": document.getElementById('en').value,
                    "area_type": document.getElementById('areaDefinition').value,
                    "area_latlng": latlngString,
                    "area_note": document.getElementById('areaNote').value,
                    "area_lat": lat,
                    "area_lng": lng
                }
            }),
            success: function (data) {
                if (JSON.parse(data).status == 'success') {
                    alert("add area success!");
                    window.location.href = './arealist';
                } else {
                    alert("add area failed!");
                }
            },
            error: function () {
                alert('Please check your network,if it is still not work.Please look admin for help!');
            }
        })
    }

})
