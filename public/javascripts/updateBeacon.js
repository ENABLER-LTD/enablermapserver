mapconfig = new mapconfig();

var url = window.location.href.toString();
var index = url.lastIndexOf("\/");
var b_id = url.substring(index + 1, url.length);

$.ajax({
    type: 'GET',
    url: mapconfig.getBeaconByid() + b_id,
    async: true,
    success: function (data) {
        document.getElementById("name").value = data[0].b_name;
        var templist = data[0].b_uuid.split("-");
        document.getElementById("uuid-one").value = templist[0];
        document.getElementById("uuid-two").value = templist[1];
        document.getElementById("uuid-three").value = templist[2];
        document.getElementById("uuid-four").value = templist[3];
        document.getElementById("uuid-fives").value = templist[4];
        document.getElementById("major").value = data[0].b_major;
        document.getElementById("minor").value = data[0].b_minor;
        document.getElementById("tx-power").value = data[0].b_txpower;
        document.getElementById("lon").value = data[0].b_lon;
        document.getElementById("lat").value = data[0].b_lat;
        document.getElementById("alt").value = data[0].b_alt;
        document.getElementById("floor").value = data[0].b_floor;
        document.getElementById("note").value = data[0].b_note;
    },
    error: function (err) {
        console.log(err)
    }
})

document.getElementById("submit-btn").addEventListener('click', function () {
    var b_name = document.getElementById("name").value;
    var b_uuid = document.getElementById("uuid-one").value + "-" + document.getElementById("uuid-two").value + "-" + document.getElementById("uuid-three").value + "-" + document.getElementById("uuid-four").value + "-" + document.getElementById("uuid-fives").value;
    var b_major = document.getElementById("major").value;
    var b_minor = document.getElementById("minor").value;
    var b_txpower = document.getElementById("tx-power").value;
    var b_lon = document.getElementById("lon").value;
    var b_lat = document.getElementById("lat").value;
    var b_alt = document.getElementById("alt").value;
    var b_floor = document.getElementById("floor").value;
    var b_note = document.getElementById("note").value;

    if(document.getElementById("uuid-one").value.length != 8　|| document.getElementById("uuid-two").value.length != 4 || document.getElementById("uuid-three").value.length != 4 || document.getElementById("uuid-four").value.length != 4 || document.getElementById("uuid-fives").value.length != 12){
        alert("UUIDを桁数を確認ください。")
    }else{
        if (b_name != "" && b_uuid != "" && b_major != "" && b_minor != "" && b_txpower != "") {
            $.ajax({
                type: 'POST',
                url: mapconfig.updateBeacon(),
                contentType: "application/json",
                async: true,
                data: JSON.stringify({
                    "data": {
                        "b_id": b_id,
                        "b_name": b_name,
                        "b_uuid": b_uuid,
                        "b_major": b_major,
                        "b_minor": b_minor,
                        "b_txpower": b_txpower,
                        "b_lon": b_lon,
                        "b_lat": b_lat,
                        "b_alt": b_alt,
                        "b_floor": b_floor,
                        "b_note": b_note
                    }
                }),
                success: function (data) {
                    if (data.status == "success") {
                        alert("update success");
                        window.location.href = '/beaconlist';
                    }
                },
                error: function () {

                }
            })
        }else{
            alert("必要なデータを入力してください。")
        }
    }

})


document.getElementById("danger-btn").addEventListener('click', function () {
    $.ajax({
        type: 'POST',
        url: mapconfig.deleteBeacon(),
        contentType: "application/json",
        data: JSON.stringify({
            "data": {
                "b_id": b_id
            }
        }),
        success: function (data) {
            if (data.status == "success") {
                alert("delete success");
                window.location.href = '/beaconlist';
            }
        },
        error: function () {

        }
    })
})
