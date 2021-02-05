var positionInfo = [];
let inputList = document.getElementById('input-list')
let createBtn = document.getElementById('create-btn')
var fileText = document.querySelector('.file-text')
map = new mapconfig();

const trashIconSvg = '<svg t="1605763994929" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2902"><path d="M970.24 256h-301.44L592.64 160H431.36L355.2 256H53.76V192h270.72l76.16-96h222.72L699.52 192h270.72v64zM803.84 928H220.16L144 356.48l64-8.96 67.84 516.48h472.32l67.84-516.48 64 8.96-76.16 571.52z" fill="#ffffff" p-id="2903"></path><path d="M376.96 412.16h64v371.84h-64zM583.04 412.16h64v371.84h-64z" fill="#ffffff" p-id="2904"></path></svg>'

var createRemoveBtn = function (basedom, handlerName = '', handlerEvent = function () {
}) {
    let divEle = document.createElement('div')
    let buttonEle = document.createElement('button')
    buttonEle.classList.add('btn', 'btn-danger')
    buttonEle.innerHTML = trashIconSvg
    buttonEle['on' + handlerName] = handlerEvent
    divEle.appendChild(buttonEle)
    divEle.classList.add('delete-btn')
    basedom.appendChild(divEle)
    return divEle
}

//添加li，className
var createLiItem = function (basedom, classname = '') {
    let liEle = document.createElement('li')
    if (classname) {
        if (classname.constructor === Array) {
            classname.forEach(name => {
                liEle.classList.add(name)
            })
        } else {
            liEle.classList.add(classname)
        }
    }
    basedom.appendChild(liEle)
    return liEle
}

//添加input，value
var createInput = function (basedom, classname = '', value = '') {
    let inputEle = document.createElement('input')

    if (classname) {
        if (classname.constructor === Array) {
            classname.forEach(name => {
                inputEle.classList.add(name)
            })
        } else {
            inputEle.classList.add(classname)
        }
    }
    if (value) inputEle.value = value
    basedom.appendChild(inputEle)
    return inputEle
}

var globalRowNumber = 1
var createFormRow = function () {
    let ulEle = document.createElement('ul')

    const liItemNum = 4
    for (let i = 0; i < liItemNum; i++) {
        var liEle
        switch (i) {
            case 0:
                liEle = createLiItem(ulEle, 'point-input')
                createInput(liEle, 'form-control', globalRowNumber)
                break
            case 1:
                liEle = createLiItem(ulEle, 'latitude-input')
                createInput(liEle, 'form-control')
                break
            case 2:
                liEle = createLiItem(ulEle, 'longitude-input')
                createInput(liEle, 'form-control')
                break
            case 3:
                liEle = createLiItem(ulEle, 'altitude-input')
                createInput(liEle, 'form-control')
                break
        }
        ulEle.appendChild(liEle)
    }

    if (globalRowNumber !== 1) {
        var btnWrapper = createRemoveBtn(ulEle, 'click', function (e) {
            e.preventDefault()
            this.parentNode.parentNode.remove()
            let listDom = inputList.getElementsByTagName('ul')
            for (let i = 0; i < listDom.length; i++) {
                var pointInput = listDom[i].querySelector('.point-input').querySelector('.form-control')
                // 第一个没有删除按钮
                if (i !== 0) {
                    var delBtn = listDom[i].querySelector('.delete-btn').querySelector('button')
                    if (delBtn.number > this.number) {
                        delBtn.number -= 1
                        pointInput.value -= 1
                    }
                }
                // 最后一个
                if (i === listDom.length - 1) {
                    globalRowNumber = i === 0 ? 2 : delBtn.number + 1
                }
            }
            return false
        })
        var btn = btnWrapper.getElementsByTagName('button')[0]
        btn.number = globalRowNumber
    }
    globalRowNumber++

    let parentNode = createBtn.parentNode
    let lastNode = parentNode.lastElementChild
    parentNode.insertBefore(ulEle, lastNode)
}
createFormRow()
createBtn.onclick = createFormRow

//图片本地预览
var preview = document.getElementById('preview');
var file;
var filename;
var blobURL = '';

var fileUploader = document.getElementById('company');
var floorJp = document.querySelector('#jp')
var floorEn = document.querySelector('#en')
var offlce = document.querySelector('#offlce')
var offlceValue = document.querySelector('#offlce-value')
var noteText = document.querySelector('#note-text')

fileUploader.onchange = function (e) {
    window.URL.revokeObjectURL(blobURL)
    file = e.target.files[0]
    filename = file.name
    fileText.innerHTML = filename
    var extname = filename.substr(filename.lastIndexOf('.') + 1, filename.length)
    if (extname !== 'svg') {
        if (file.outerHTML) {
            file.outerHTML = file.outerHTML;
        } else {
            file.value = "";
        }
        return false
    }
    blobURL = window.URL.createObjectURL(file)
    preview.setAttribute('src', blobURL)
}

//upData btn
const submitBtn = document.getElementById('submit-btn')
submitBtn.addEventListener('click', function () {
    let inputList = document.getElementById('input-list');
    const ulList = inputList.querySelectorAll('ul');
    //获取ul孙节点input.vaule
    for (let i = 0; i < ulList.length; i++) {
        var inputLists = ulList[i].querySelectorAll('input')
        var rowInputValue = {}
        inputLists.forEach(function (ele, index) {
            if (index === 0) {
                rowInputValue.pos = ele.value
            }
            if (index === 1) {
                rowInputValue.lng = ele.value
            }
            if (index === 2) {
                rowInputValue.lag = ele.value
            }
            if (index === 3) {
                rowInputValue.height = ele.value
            }
        })
        positionInfo.push(rowInputValue)
    }
    var position = '';
    for (let i = 0; i < positionInfo.length; i++) {
        for (let j = 0; j < 3; j++) {
            switch (j) {
                case 0:
                    position = position + positionInfo[i].lng;
                    position = position + ',';
                    break;
                case 1:
                    position = position + positionInfo[i].lag;
                    position = position + ',';
                    break;
                case 2:
                    position = position + positionInfo[i].height;
                    break;
            }
        }
        if (i != positionInfo.length - 1) {
            position = position + '|';
        }
    }

    var cookie_value = $.cookie("enabermap.uid");
    var companycode = cookie_value.substring(0, 5);
    var buildingname = document.getElementById("jp").value;
    var buildingnameeng = document.getElementById("en").value;
    var floor = document.getElementById("floor").value;
    var note = document.getElementById("note-text").value;
    var alt = positionInfo[0].height;

    var formData = new FormData();
    formData.append('mapsvg', file);
    formData.append('position', position);
    formData.append('svgfilename', targetfilename);
    formData.append('building', buildingname);
    formData.append('floor', floor);
    formData.append('alt', alt);
    formData.append('note', note);
    formData.append('buildingeng', buildingnameeng);

    $.ajax({
        timeout: 8000,
        type: 'POST',
        url: map.updateindoordetail(),
        data: formData,
        contentType: false,
        processData: false,
        dataType: "json",
        mimeType: "multipart/form-data",
        success: function (data) {
            if (data.status == 'success') {
                alert("update success!Please add keypoints next!");
                $.cookie('setkeyfilename', targetfilename);
                window.location.href = '/updatebuilding/logic/logic';
            }
        },
        error: function () {
            alert('Please check your network,if it is still not work.Please look admin for help!');
        }
    })
})

//获取数据
var cookie_value = $.cookie("enabermap.uid");
var companycode = cookie_value.substring(0, 5);

var url = window.location.href.toString();
var index = url.lastIndexOf("\/");
var targetfilename = url.substring(index + 1, url.length);

function dataGet() {
    $.ajax({
        type: 'GET',
        url: map.getdetailbyfilename() + targetfilename,
        async: false,
        success: function (data) {
            console.log(data);
            var alt = data[0].alt;
            document.getElementById('jp').value = data[0].building;
            document.getElementById('en').value = data[0].buildingeng;
            document.getElementById('floor').value = data[0].floor;
            fileText.innerHTML = data[0].svgfile;
            // document.getElementById('company').innerText =data[0].svgfile;
            preview.src = map.geturl() + data[0].svgfile;
            targetfilename = data[0].svgfile;
            document.getElementById('note-text').value = data[0].note;
            var coordinatelist = data[0].position.split('|');
            ulDom(createFormRow, coordinatelist);
            var ulEle = inputList.querySelectorAll('ul');
            for (var i = 0; i < coordinatelist.length; i++) {
                var point = coordinatelist[i].split(',')
                var lon = point[0]
                var lat = point[1]
                pointSet(ulEle[i], lon, lat, alt);
            }
        },
        error: function (err) {
            console.log(err)
        }
    })
}

dataGet()

function ulDom(fn, list) {
    for (var i = 0; i < list.length - 1; i++) {
        fn()
    }
}

function pointSet(target, lon, lat, alt) {
    var inputValue = target.querySelectorAll('.form-control')
    for (var n = 0; n < inputValue.length; n++) {
        inputValue[1].value = lon
        inputValue[2].value = lat
        inputValue[3].value = alt
    }
}

//delete btn
document.getElementById('danger-btn').addEventListener('click', function () {
    $.ajax({
        timeout: 3000,
        type: 'POST',
        url: map.deleteindoormap(),
        contentType: "application/json",
        dataType: "text",
        data: JSON.stringify({
            "data": {
                "filename": targetfilename
            }
        }),
        success: function () {
            alert("delete file:" + targetfilename + " success!");
            window.location.href = '../picturelist';

        },
        error: function () {
            alert('Please check your network,if it still does not work.Please look admin for help!');
        }
    })
})
