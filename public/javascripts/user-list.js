mapconfig = new mapconfig();

var companycode = $.cookie("enabermap.uid").toString().substring(0, 5);
var officecode = $.cookie("enabermap.uid").toString().substring(5, 10);
var depcode = $.cookie("enabermap.uid").toString().substring(5, 15);
var userpnumber = $.cookie("enabermap.uid").toString().substring(15.20);
var companydetail = null
var pnumberlist = []
var userdetaillist = []

$.ajax({
    type: 'GET',
    async: false,
    url: mapconfig.getuserlist() + companycode,
    success: function (data) {
        if (data != null) {
            companydetail = data;
            for (let i = 0; i < data.length; i++) {
                pnumberlist.push(data[i].pnumber);
            }
        }
    },
    error: function (err) {
        console.log(err);
    }
})

for (let i = 0; i < pnumberlist.length; i++) {
    $.ajax({
        type: 'GET',
        async: false,
        url: mapconfig.user() + pnumberlist[i],
        success: function (data) {
            userdetaillist.push(data);
        },
        error: function (err) {
            console.log(err);
        }
    })
}

const officedic = {};
const depdic = {};
$.ajax({
    type: 'GET',
    async: false,
    url: mapconfig.getcodnamelist(),
    success: function (data) {
        for (let i = 0; i < data[0].length; i++) {
            officedic[data[0][i].officecode] = data[0][i].officename;
        }

        for (let i = 0; i < data[1].length; i++) {
            depdic["" + data[1][i].officecode + data[1][i].depcode] = data[1][i].depname;
        }
    },
    error: function (err) {
        console.log(err);
    }
})

const rolename = {};
$.ajax({
    type: 'GET',
    async: false,
    url: mapconfig.getsysroledetail(),
    success: function (data) {
        for (let i = 0; i < data.length; i++) {
            rolename[data[i].roleid] = data[i].rolename;
        }
    },
    error: function (err) {
        console.log(err);
    }
})

for (let i = 0; i < userdetaillist.length; i++) {
    var temp = [];
    temp[0] = officedic[companydetail[i].poffice];
    temp[1] = depdic["" + companydetail[i].poffice + companydetail[i].pdep];
    temp[2] = userdetaillist[i][0].pnumber;
    temp[3] = userdetaillist[i][0].pname;
    temp[4] = userdetaillist[i][0].mail;
    temp[5] = rolename[userdetaillist[i][0].prole];
    temp[6] = userdetaillist[i][0].displayicon;
    temp[7] = userdetaillist[i][0].note;
    var tr = `<td class="officecode-${companydetail[i].poffice}">${temp[0]}</td>
        <td class="depcode-${"" + companydetail[i].poffice + companydetail[i].pdep}">${temp[1]}</td>
        <td>
            <a href="./updatauserset/${temp[2]}">
                編集
            </a>
        </td>
        <td class="pnumber-${temp[2]}">${temp[2]}</td>
        <td>${temp[3]}</td>
        <td>${temp[4]}</td>
        <td class="roleid-${userdetaillist[i][0].prole}">${temp[5]}</td>
        <td>${temp[6]}</td>
        <td>${temp[7]}</td>`

    $("#target").append('<tr class="madetr">' + tr + '</tr>');
}

var roleid = $.cookie("roleid");
if (roleid == 4) {
    document.querySelectorAll('.madetr').forEach(function (item) {
        item.style.display = 'none';
    })
    var tempclass = '.depcode-' + depcode;
    document.querySelectorAll(tempclass).forEach(function (item) {
        if (item.nextElementSibling.nextElementSibling.innerText != userpnumber && item.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.className == 'roleid-4') {

        } else {
            item.parentNode.style.display = "";
        }
    })
    document.querySelectorAll('.roleid-3').forEach(function (item) {
        item.parentNode.remove();
    })
    document.querySelectorAll('.roleid-2').forEach(function (item) {
        item.parentNode.remove();
    })
    document.querySelectorAll('.roleid-1').forEach(function (item) {
        item.parentNode.remove();
    })
}

if (roleid == 3) {
    document.querySelectorAll('.madetr').forEach(function (item) {
        item.style.display = 'none';
    })
    var tempclass = '.officecode-' + officecode;
    document.querySelectorAll(tempclass).forEach(function (item) {
        if (item.nextElementSibling.nextElementSibling.nextElementSibling.innerText != userpnumber && item.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.className == 'roleid-3') {

        } else {
            item.parentNode.style.display = "";
        }

    })
    document.querySelectorAll('.roleid-2').forEach(function (item) {
        item.parentNode.remove();
    })
    document.querySelectorAll('.roleid-1').forEach(function (item) {
        item.parentNode.remove();
    })
}

if (roleid == 2) {
    document.querySelectorAll('.roleid-1').forEach(function (item) {
        item.parentNode.remove();
    })
}


