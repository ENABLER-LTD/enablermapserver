mapconfig = new mapconfig();
var companycode = $.cookie("enabermap.uid").toString().substring(0, 5);
const officedic = {};
const depdic = {};
const officediceng = {};
const depdiceng = {};
const roleid = $.cookie("roleid");

$.ajax({
    type: 'GET',
    async: false,
    url: mapconfig.getcodnamelist(),
    success: function (data) {
        for (let i = 0; i < data[0].length; i++) {
            officedic[data[0][i].officecode] = data[0][i].officename;
            officediceng[data[0][i].officecode] = data[0][i].officenameeng;
        }

        for (let i = 0; i < data[1].length; i++) {
            depdic["" + data[1][i].officecode + data[1][i].depcode] = data[1][i].depname;
            depdiceng["" + data[1][i].officecode + data[1][i].depcode] = data[1][i].depnameeng;
        }
    },
    error: function (err) {
        console.log(err);
    }
})


if (roleid == "3") {
    const pnumber = $.cookie("enabermap.uid").substring(15, 20);
    var officetarget = null;
    $.ajax({
        type: 'GET',
        async: false,
        url: mapconfig.getpersoncompanydetail() + pnumber,
        success: function (data) {
            officetarget = data[0].poffice;
        },
        error: function (err) {
            console.log(err);
        }
    })

    $.ajax({
        type: 'GET',
        async: false,
        url: mapconfig.getcompanydetail() + companycode,
        success: function (data) {
            for (let i = 0; i < data.length; i++) {
                if (data[i].poffice == officetarget) {
                    var temp = [];
                    temp[0] = data[i].poffice;
                    temp[1] = officedic[data[i].poffice];
                    temp[2] = officediceng[data[i].poffice];
                    temp[3] = data[i].pdep;
                    temp[4] = depdic["" + data[i].poffice + data[i].pdep];
                    temp[5] = depdiceng["" + data[i].poffice + data[i].pdep];
                    temp[6] = data[i].note;
                    if (data[i].usestatus == 1) {
                        temp[7] = "有効"
                    } else {
                        temp[7] = "無効"
                    }

                    var tr = `<td class="merge">${temp[0]}</td>
        <td class="merge">
            <a href="./updataoffice/${temp[0]}">
                編集
            </a>
        </td>
        <td class="merge">${temp[1]}</td>
        <td class="merge">${temp[2]}</td>
        <td class="merge">${temp[3]}</td>
        <td class="merge">${temp[4]}</td>
        <td class="merge">${temp[5]}</td>
        <td class="merge">${temp[6]}</td>
        <td class="merge">${temp[7]}</td>`

                    $("#target").append('<tr>' + tr + '</tr>');
                }
            }

        },
        error: function (err) {
            console.log(err);
        }
    })

    document.getElementById("hidebtn").style.display = "none";
} else {
    $.ajax({
        type: 'GET',
        async: false,
        url: mapconfig.getcompanydetail() + companycode,
        success: function (data) {
            for (let i = 0; i < data.length; i++) {
                var temp = [];
                temp[0] = data[i].poffice;
                temp[1] = officedic[data[i].poffice];
                temp[2] = officediceng[data[i].poffice];
                temp[3] = data[i].pdep;
                temp[4] = depdic["" + data[i].poffice + data[i].pdep];
                temp[5] = depdiceng["" + data[i].poffice + data[i].pdep];
                temp[6] = data[i].note;
                if (data[i].usestatus == 1) {
                    temp[7] = "有効"
                } else {
                    temp[7] = "無効"
                }

                var tr = `<td class="merge">${temp[0]}</td>
        <td class="merge">
            <a href="./updataoffice/${temp[0]}">
                編集
            </a>
        </td>
        <td class="merge">${temp[1]}</td>
        <td class="merge">${temp[2]}</td>
        <td class="merge">${temp[3]}</td>
        <td class="merge">${temp[4]}</td>
        <td class="merge">${temp[5]}</td>
        <td class="merge">${temp[6]}</td>
<td class="merge">${temp[7]}</td>`

                $("#target").append('<tr>' + tr + '</tr>');
            }
        },
        error: function (err) {
            console.log(err);
        }
    })
}
