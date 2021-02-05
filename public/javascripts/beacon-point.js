var beaconBox = document.querySelector('.beacon-point')
var beaconTitle = beaconBox.querySelector('.beacon-title')
var beaconMeunBtn = document.querySelector('#beacon-point')

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

function displayDom(ele) {
    if (ele.style.display == 'none') {
        ele.style.display = 'block'
        // getBeacon()
    } else {
        ele.style.display = 'none'
    }
}
beaconMeunBtn.onclick = function(){
    displayDom(beaconBox)
}
btn.onclick = function() {
    displayDom(beaconBox)
}

//getBeaconData
function getBeacon(){
    $.ajax({
        type: 'GET',
        url: './javascripts/beaconData.json',
        async: false,
        dataType: 'json',
        success: function(data){
            for(var i = 0; i < data.length; i++){
                var beaconFrom = document.querySelector('.beacon-from')
                var tableEle = beaconFrom.querySelector('table')
                var tr = document.createElement('tr')
                var tdNum = document.createElement('td')
                var icons = document.createElement('td')
                var name = document.createElement('td')
                var uuId = document.createElement('td')
                var major = document.createElement('td')
                var minor = document.createElement('td')
                var note = document.createElement('td')
                var iconImg = document.createElement('img')

                tr.classList.add('text')
                iconImg.classList.add('imgs')
                uuId.classList.add('uuid')
                note.classList.add('note-text')

                tableEle.appendChild(tr)
                tr.appendChild(tdNum)
                tr.appendChild(icons)
                tr.appendChild(name)
                tr.appendChild(uuId)
                tr.appendChild(major)
                tr.appendChild(minor)
                tr.appendChild(note)
                icons.appendChild(iconImg)

                var eight = data[i].uuid.substring(8,0)
                var fourOne = data[i].uuid.substring(12,8)
                var fourTwo = data[i].uuid.substring(12,16)
                var fourThree = data[i].uuid.substring(16,20)
                var twelve = data[i].uuid.substring(20,32)
                var slice = eight + '-' + fourOne + '-' + fourTwo + '-' + fourThree + '-' + twelve

                tdNum.innerText = i + 1
                iconImg.src = './icon/Positioning.png'
                uuId.innerText = slice
                name.innerText = data[i].name
                major.innerText = data[i].major
                minor.innerText = data[i].minor
                note.innerText = data[i].note
            }
            edit()
        },
        error: function(err){
            console.log(err)
        }
    })
}
//获取当前点击的第几个icon
function edit() {
    var beaconFrom = document.querySelector('.beacon-from')
    var imgData = beaconFrom.querySelectorAll('.imgs')
    for (var i = 0; i < imgData.length; i++) {
        imgData[i].index = i
        imgData[i].addEventListener('mousedown', function () {
            if(beaconBox.style.display == 'block') {
                pointGet(imgData[this.index])

                //通过子级tdBtn，获取父级下的uuid
                var fatherNode = imgData[this.index].parentNode.parentNode
                var uuId = fatherNode.querySelector('.uuid')
                console.log(uuId)
                // var imgData = beaconBox.querySelectorAll('.imgs')
            }
        })
    }
}
