const express = require('express');
const router = express.Router();
const {client} = require('../dao/RedisUtil');
const userpro = require('../dao/ProLogin');
const logger = require('../log/Logfilemaker');
const filereader = require('../log/Filereader');
const upload = require('../filepro/svgfile');
const {reader} = require('../filepro/getmap');
const config = require('../config/pathsetting');


//ログイン画面
router.get('/login', function (req, res, next) {
    res.render('login');
});

router.get('/floorselect', function (req, res, next) {
    res.render('floorselect');
});

router.get('/setlocationbeacon', function (req, res, next) {
    res.render('setlocationbeacon');
});

router.get('/indoorfloorbeacon', function (req, res, next) {
    res.render('indoorfloorbeacon');
});

router.get('/mapindoorbeacon', function (req, res, next) {
    res.render('mapindoorbeacon');
});


router.get('/indoormaparea', function (req, res, next) {
    res.render('indoormaparea');
});

router.get('/editindoorarea/:areaid', function (req, res, next) {
    res.render('editindoorarea');
});

router.get('/addarea', function (req, res, next) {
    res.render('addarea');
});

//
router.get('/updataservicesetting/:companycode', function (req, res, next) {
    res.render('updataservicesetting');
});

router.get('/beaconlist', function (req, res, next) {
    res.render('beacon');
});

router.get('/beacon-add', function (req, res, next) {
    res.render('beacon-add');
});

router.get('/updateBeacon/:beaconid', function (req, res, next) {
    res.render('updatebeacon');
});

router.get('/arealist', function (req, res, next) {
    res.render('area');
});

router.get('/editarea/:areaid', function (req, res, next) {
    res.render('editarea');
});


router.get('/addsetting', function (req, res, next) {
    res.render('officesetting');
});


router.get('/updatauserset/:pnumber', function (req, res, next) {
    res.render('updatauserset');
});

//
router.get('/departmentset', function (req, res, next) {
    res.render('departmentset');
});

//
router.get('/updataoffice/:officecode', function (req, res, next) {
    res.render('updataofficedetail');
});

router.get('/userset', function (req, res, next) {
    res.render('userset');
});

//ユーザ一覧
router.get('/userlist', function (req, res, next) {
    res.render('userList');
});

//Map一覧
router.get('/picturelist', function (req, res, next) {
    res.render('picturelist');
});

//enterprise setting
router.get('/enterpriseSettings', function (req, res, next) {
    res.render('enterprisesetting');
});

//service setting
router.get('/servicesetting', function (req, res, next) {
    res.render('servicesetting');
});

//admin-settings画面
router.get('/admin-settings', function (req, res, next) {
    res.render('admin-settings');
});

//insert屋内地図画面
router.get('/insertindoormap', function (req, res, next) {
    res.render('indoor-map');
});

//update屋内地図画面
router.get('/updatebuilding/:filename', function (req, res, next) {
    res.render('updateindoor-map');
});

//屋内地図画面
router.get('/indoorfloor', function (req, res, next) {
    res.render('indoorfloor');
});

//屋内地図画面
router.get('/historyshowfloor', function (req, res, next) {
    res.render('historyshowfloor');
});

//ユーザ設定画面
router.get('/userSettings', function (req, res, next) {
    res.render('userSettings');
});

//indoor画面
router.get('/mapindoor', function (req, res, next) {
    res.render('mapindoor');
});

//履歴表示画面
router.get('/historyshow', function (req, res, next) {
    res.render('historyshow');
});

//ロジック計算画面
router.get('/logic', function (req, res, next) {
    res.render('logic');
});


//ロジック計算画面
router.get('/updatebuilding/logic/logic', function (req, res, next) {
    res.render('logic');
});

//屋内地図履歴表示画面
router.get('/historyshowindoor', function (req, res, next) {
    res.render('historyshowindoor');
});

//MainPage
router.get('/mainmap', function (req, res, next) {
    if (req.session.isLogin == 1) {
        res.render('map');
    } else {
        res.redirect(config.url + 'login');
    }
});

//人位置情報取得(廃棄)
router.get('/getlocation/:uid', async function (req, res, next) {
    const uid = req.params.uid;
    let result = await client.synGet(uid);
    res.json(result);
});

//人(多数)位置情報取得
router.get('/getlocations/:uid', async function (req, res, next) {
    const uid = req.params.uid.split(";");
    let result = await client.synMGet(uid);
    res.send(result);
});

//人位置情報送信
router.post('/location/:uid', function (req, res, next) {
    const uid = req.params.uid;
    if (req.body.data != null) {
        try {
            if (req.body.data.tim != null) {
                logger.logger(uid, req.body.data.tim.toString().substring(0, 10), JSON.stringify(req.body.data));
                var val = req.body.data.lat + ";" + req.body.data.lon + ";" + req.body.data.alt;
                client.Post(uid, val);
                res.json({"result": "success"});
            } else {
                res.json({"result": "failed"});
            }

        } catch (e) {
            console.log(e);
            res.json({"result": "failed"});
        }
    } else {
        res.json({"result": "failed"});
    }
    ;
});

//人過去位置情報送信
router.get('/historical/:date/:uid', async function (req, res, next) {
    const result = await filereader.getFileData(req.params.date, req.params.uid).catch((err) => {
        return null;
    });
    if (result != null) {
        res.send(result.toString());
    } else {
        res.send("null");
    }
});

//ユーザー情報検索
router.get('/user/:pnumber', async function (req, res, next) {
    try {
        const result = await userpro.queryUserByUid(req.params.pnumber);
        var dataString = JSON.stringify(result);
        var data = JSON.parse(dataString);
        res.json(data);
    } catch (e) {
        console.log(e);
        res.json(null);
    }
});

//ユーザ登録
router.post('/newuser', async function (req, res, next) {
    try {
        await userpro.newpnumber(req.body.data.companycode, req.body.data.officecode, req.body.data.depcode);
        var result = await userpro.getlastpnumber();
        var dataString = JSON.stringify(result);
        var data = JSON.parse(dataString);
        var pnumber = data[0].maxpnumber;
        await userpro.insertUser(req.body.data.mail, req.body.data.password, req.body.data.role, req.body.data.icon, req.body.data.color, pnumber, req.body.data.username);
        res.json({"status": "success"});
    } catch (e) {
        console.log(e);
        res.json({"status": "failed"});
    }


});

//ユーザパスワード更新
router.post('/changepw', async function (req, res, next) {
    if (req.body.data != null) {
        try {
            await userpro.updateUserPw(req.body.data.pnumber, req.body.data.pwd, req.body.data.newpwd);
            const result = await userpro.getNewPw(req.body.data.pnumber);
            var dataString = JSON.stringify(result);
            var data = JSON.parse(dataString);
            if (data[0].pwd == req.body.data.newpwd) {
                res.json({"status": "success"});
                res.end();
            } else {
                res.json({"status": "failed"});
                res.end();
            }
        } catch (e) {
            console.log(e);
            res.json({"status": "failed"});
            res.end();
        }

    } else {
        res.json({"status": "failed"});
        res.end();
    }
});

//ユーザ登録パスワード認証
router.post('/loginbypd', async function (req, res, next) {
    try {
        const result = await userpro.checker(req.body.data.mail, req.body.data.pwd);
        if (result.length == 0) {
            res.json({"uid": "error"});
        } else {
            var dataString = JSON.stringify(result);
            var data = JSON.parse(dataString);
            const result1 = await userpro.checkerpnumber(data[0].pnumber);
            if (result1.length != 0) {
                dataString = JSON.stringify(result1);
                data = JSON.parse(dataString);
                var str = data[0].pcompanycode + data[0].poffice + data[0].pdep + data[0].pnumber;
                req.session.isLogin = 1;
                res.json({"uid": str});
            } else {
                res.json({"uid": "error"});
            }
        }
    } catch (e) {
        console.log(e);
        res.json({"uid": "error"});
    }

});

//ユーザ登録パスワード認証携帯用
router.post('/loginbypdphone', async function (req, res, next) {
    try {
        const result = await userpro.checker(req.body.data.mail, req.body.data.pwd);
        if (result.length == 0) {
            res.json({"status": "error"});
        } else {
            var dataString = JSON.stringify(result);
            var data = JSON.parse(dataString);
            const userdetail = await userpro.queryUserByUid(data[0].pnumber);
            const result1 = await userpro.checkerpnumber(userdetail[0].pnumber);
            const result2 = await userpro.getservicesetting(result1[0].pcompanycode);
            const result3 = await userpro.getuploadtime(result1[0].pcompanycode);
            if (result1.length != 0) {
                dataString = JSON.stringify(result1);
                data = JSON.parse(dataString);
                var str = data[0].pcompanycode + data[0].poffice + data[0].pdep + data[0].pnumber;
                req.session.isLogin = 1;
                var enableservicelist = [];
                if (result2[0].outdoormap == 1) {
                    enableservicelist.push("outdoormap");
                }
                if (result2[0].indoormap == 1) {
                    enableservicelist.push("indoormap");
                }
                if (result2[0].beacon == 1) {
                    enableservicelist.push("beacon");
                }
                if (result2[0].area == 1) {
                    enableservicelist.push("area");
                }
                if (result2[0].calutor == 1) {
                    enableservicelist.push("calculation");
                }
                res.json({
                    "uid": str,
                    "role": userdetail[0].prole,
                    "service": enableservicelist,
                    "upload": result3[0].uploadtime
                });
            } else {
                res.json({"status": "error"});
            }
        }
    } catch (e) {
        console.log(e);
        res.json({"status": "error"});
    }
});


//Update File UpLoad
router.post('/updateindoordetail', upload.single('mapsvg'), async function (req, res, next) {
    const result = await userpro.updateindoordetail(req.body.svgfilename, req.body.building, req.body.floor, req.body.position, req.body.alt, req.body.note, req.body.buildingeng);
    res.json({"status": "success"});
    res.end();
});

//SVG File UpLoad
router.post('/singleUpload', upload.single('mapsvg'), async function (req, res, next) {
    try {
        const result = await userpro.insertIndoorMap(req.body.companycode, req.body.svgfilename, req.body.building, req.body.floor, req.body.position, req.body.alt, req.body.note, req.body.buildingeng);
        res.json({"status": "success"});
    } catch (e) {
        console.log(e);
        res.json(null);
    }

});

//GET SVG MAP 廃棄、使用しない
router.get('/getmap/:mapname.svg', function (req, res, next) {
    res.json({"svg": reader(req.params.mapname)});

});

//GET USERLIST
router.get('/getuserlist/:companyNo', async function (req, res, next) {
    try {
        const result = await userpro.getuserlist(req.params.companyNo);
        if (result.length == 0) {
            res.send(null);
        } else {
            var dataString = JSON.stringify(result);
            var data = JSON.parse(dataString);
            res.send(data);
        }
    } catch (e) {
        console.log(e);
        res.send(null);
    }
});

//企業情報取得
router.get('/getcompanydetail/:companyNo', async function (req, res, next) {
    const result = await userpro.getcompanydetail(req.params.companyNo);
    var dataString = JSON.stringify(result);
    var data = JSON.parse(dataString);
    res.send(data);
});

//企業名取得
router.get('/getcompanyname/:companyNo', async function (req, res, next) {
    try {
        const result = await userpro.getcompanyname(req.params.companyNo);
        var dataString = JSON.stringify(result);
        var data = JSON.parse(dataString);
        res.send(data);
    } catch (e) {
        console.log(e);
        res.send(null);
    }
});

//indoormap 情報を取得する。
router.get('/getindoordetail/:companyNo', async function (req, res, next) {
    try {
        const result = await userpro.getindoordetail(req.params.companyNo);
        var dataString = JSON.stringify(result);
        var data = JSON.parse(dataString);
        res.send(data);
    } catch (e) {
        console.log(e);
        res.send(null);
    }
});

//updata indoor map keypoint
router.post('/updatakeypoint', async function (req, res, next) {
    const result = await userpro.updatakeypoints(req.body.data.svgfile, req.body.data.keypoints);
    res.send(result);
});

//delete user
router.post('/deleteuser', async function (req, res, next) {
    const result = await userpro.deleteuser(req.body.data.pnumber);
    res.send(result);
});

//updata upload time
router.post('/uploadtime', async function (req, res, next) {
    const result = await userpro.uploadtime(req.body.data.companycode, req.body.data.uploadtime);
    // var dataString = JSON.stringify(result);
    // var data = JSON.parse(dataString);
    res.json({"result": "success"});
    res.end();
});

//get upload time
router.get('/getuploadtime/:companycode', async function (req, res, next) {
        const result = await userpro.getuploadtime(req.params.companycode);
        if (result.length != 0) {
            var dataString = JSON.stringify(result);
            var data = JSON.parse(dataString);
            res.json({"time": data[0].uploadtime});
        } else {
            res.json({"time": "unknow"})
        }
    }
)

//
router.get('/getcodnamelist', async function (req, res, next) {
    try {
        const result = [];
        result.push(JSON.parse(JSON.stringify(await userpro.getofficename())));
        result.push(JSON.parse(JSON.stringify(await userpro.getdepname())));
        res.send(result);
    } catch (e) {
        console.log(e);
        res.send(null);
    }
})

//get upload time
router.get('/getfloordetail/:filename', async function (req, res, next) {
        try {
            const result = await userpro.getbuildname(req.params.filename);
            var dataString = JSON.stringify(result);
            var data = JSON.parse(dataString);
            const result1 = await userpro.getbuilddetail(data[0].building);
            dataString = JSON.stringify(result1);
            data = JSON.parse(dataString);
            res.json(data);
        } catch (e) {
            console.log(e)
        }

    }
)

//get indoormapdetail by filename
router.get('/getdetailbyfilename/:filename', async function (req, res, next) {
        const result = await userpro.getbuildname(req.params.filename);
        res.send(result);
    }
)


//SVGファイル情報取得
router.get('/getallindoordetail', async function (req, res, next) {
    const result = await userpro.queryallindoordetail();
    var dataString = JSON.stringify(result);
    var data = JSON.parse(dataString);
    res.json(data);
});

//role sevice情報
router.get('/getroleservicedetail', async function (req, res, next) {
    const result = await userpro.getroleservicedetail();
    var dataString = JSON.stringify(result);
    var data = JSON.parse(dataString);
    res.json(data);
});

//servicesetting情報
router.get('/getallservicedetail', async function (req, res, next) {
    const result = await userpro.getallservicedetail();
    var dataString = JSON.stringify(result);
    var data = JSON.parse(dataString);
    res.json(data);
});

//insert servicesetting
router.post('/insertservicesetting', async function (req, res, next) {
    const result = await userpro.insertservicesetting(req.body.data.companyid, req.body.data.companyname, req.body.data.outdoormap, req.body.data.indoormap, req.body.data.beacon, req.body.data.area, req.body.data.calutor, req.body.data.usernumber, req.body.data.conpanynameeng, req.body.data.servicestatus, req.body.data.note);
    res.send(result);
});

//updata servicesetting
router.post('/updataservicesetting', async function (req, res, next) {
    const result = await userpro.updataservicesetting(req.body.data.companyid, req.body.data.companyname, req.body.data.outdoormap, req.body.data.indoormap, req.body.data.beacon, req.body.data.area, req.body.data.calutor, req.body.data.usernumber, req.body.data.conpanynameeng, req.body.data.servicestatus, req.body.data.note);
    res.send(result);
});

//delete indoormapby filename
router.post('/deleteindoormap', async function (req, res, next) {
        const result = await userpro.deleteindoormap(req.body.data.filename);
        res.send(result);
    }
)

//delete servicesetting
router.post('/deleteservicesetting', async function (req, res, next) {
    const result = await userpro.deleteservicesetting(req.body.data.companyid);
    res.send(result);
});

//GET servicesetting
router.get('/getservicesetting/:companyid', async function (req, res, next) {
    const result = await userpro.getservicesetting(req.params.companyid);
    res.send(result);
});

//GET servicesetting
router.get('/getsysroledetail', async function (req, res, next) {
    const result = await userpro.getsysroledetail();
    res.send(result);
});

//GET
router.get('/getpersoncompanydetail/:pnumber', async function (req, res, next) {
    const result = await userpro.checkerpnumber(req.params.pnumber);
    res.send(result);
});

//GET
router.get('/getcompandetailbyoffice/:poffice', async function (req, res, next) {
    const result = await userpro.getcompandetailbyoffice(req.params.poffice);
    res.send(result);
});

//updata person detail
router.post('/updatapersontail', async function (req, res, next) {
    try {
        const result = await userpro.updatapersontail(req.body.data.pnumber, req.body.data.officecode, req.body.data.depcode, req.body.data.username, req.body.data.mail, req.body.data.password, req.body.data.role, req.body.data.icon, req.body.data.color);
        res.json({status: "success"});
    } catch (e) {
        res.json({status: "failed"});
    }
});

//insert officeall
router.post('/insertofficeall', async function (req, res, next) {
    const result = await userpro.insertofficeall(req.body.data.officecode, req.body.data.officename, req.body.data.officenameeng);
    res.send(result);
});

//insert depall
router.post('/insertdepall', async function (req, res, next) {
    try {
        const result = await userpro.insertdepall(req.body.data.poffice, req.body.data.depcode, req.body.data.depname, req.body.data.depnameeng);
        res.send(result);
    } catch (e) {
        console.log(e);
        res.send(null);
    }
});

//insert companydetail
router.post('/insertcompanydetail', async function (req, res, next) {
    try {
        const result = await userpro.insertcompanydetail(req.body.data.pcompanycode, req.body.data.poffice, req.body.data.pdep, req.body.data.note, Number(req.body.data.usestatus));
        res.send(result);
    } catch (e) {
        console.log(e);
        res.send(null);
    }
});

//update officedetail
router.post('/updateofficedetail', async function (req, res, next) {
    const result = await userpro.updateofficedetail(req.body.data.officecode, req.body.data.officename, req.body.data.officenameeng);
    res.send(result);
});

//update depdetail
router.post('/updatedepdetail', async function (req, res, next) {
    try {
        const result = await userpro.updatedepdetail(req.body.data.poffice, req.body.data.depcode, req.body.data.depname, req.body.data.depnameeng, req.body.data.note, req.body.data.usestatus);
        res.send(result);
    } catch (e) {
        console.log(e);
        res.send(null);
    }
});

//update depdetail
router.post('/updatedepdetailsp', async function (req, res, next) {
    console.log(req.body.data.depcode);
    try {
        const result = await userpro.updatedepdetailsp(req.body.data.poffice, req.body.data.depcode, req.body.data.depname, req.body.data.depnameeng, req.body.data.note, req.body.data.usestatus,req.body.data.pcompanycode);
        res.send(result);
    } catch (e) {
        console.log(e);
        res.send(null);
    }
});

//stopoffice
router.post('/stopoffice', async function (req, res, next) {
    const result = await userpro.stopoffice(req.body.data.officecode);
    res.send(result);
});

module.exports = router;
