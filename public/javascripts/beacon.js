mapconfig = new mapconfig();


var beacondetail = [];
$.ajax({
    type: 'GET',
    async: false,
    url: mapconfig.getAllBeacondetail(),
    success: function (data) {
        beacondetail = data;
    },
    error: function (err) {
        console.log(err);
    }
})

for (let i = 0; i < beacondetail.length; i++) {
    var temp = [];
    temp[0] = beacondetail[i].b_id;
    temp[1] = beacondetail[i].b_name;
    temp[2] = beacondetail[i].b_uuid;
    temp[3] = beacondetail[i].b_major;
    temp[4] = beacondetail[i].b_minor;
    temp[5] = beacondetail[i].b_txpower;
    temp[6] = beacondetail[i].b_lon;
    temp[7] = beacondetail[i].b_lat;
    temp[8] = beacondetail[i].b_alt;
    temp[9] = beacondetail[i].b_floor;
    temp[10] = beacondetail[i].b_note;
    var tr = `<td>${temp[0]}</td>
        <td>
            <a href="./updateBeacon/${temp[0]}">
                編集
            </a>
        </td>
        <td>${temp[1]}</td>
        <td>${temp[2]}</td>
        <td>${temp[3]}</td>
        <td>${temp[4]}</td>
        <td>${temp[5]}</td>
        <td>${temp[6]}</td>
        <td>${temp[7]}</td>
        <td>${temp[8]}</td>
        <td>${temp[9]}</td>
        <td>${temp[10]}</td>
`

    $("#target-list").append('<tr>' + tr + '</tr>');
}
