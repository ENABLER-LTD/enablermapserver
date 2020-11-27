const express = require('express');
const router = express.Router();
const {client} = require('../dao/RedisUtil');
const userpro = require('../dao/ProLogin');
const logger = require('../log/Logfilemaker');
const filereader = require('../log/Filereader');
const upload = require('../filepro/svgfile');
const {reader} = require('../filepro/getmap');


//ログイン画面
router.get('/login', function (req, res, next) {
    res.render('login');
});

//admin-settings画面
router.get('/admin-settings', function (req, res, next) {
    res.render('admin-settings');
});

//屋内地図画面
router.get('/indoor-map', function (req, res, next) {
    res.render('indoor-map');
});

//ユーザ設定画面
router.get('/userSettings', function (req, res, next) {
    res.render('userSettings');
});

//履歴表示画面
router.get('/historyshow', function (req, res, next) {
    res.render('historyshow');
});

//MainPage
router.get('/mainmap', function (req, res, next) {
    if (req.session.isLogin == 1) {
        res.render('map');
    } else {
        res.redirect('http://localhost:3000/login');
    }
});

//人位置情報取得
router.get('/getlocation/:uid', async function (req, res, next) {
    const uid = req.params.uid;
    let result = await client.synGet(uid);
    res.json(result);
});

//人位置情報送信
router.post('/location/:uid', function (req, res, next) {
    const uid = req.params.uid;
    if (req.body.data != null) {
        logger.logger(uid, JSON.stringify(req.body.data));
        client.synPost(uid, req.body.data);
        res.json({"result": "success"});
    } else {
        res.json({"result": "failed"});
    }
    ;
    res.end();
});

//人過去位置情報送信
router.get('/historical/:uid', async function (req, res, next) {
    const result = await filereader.getFileData(req.params.uid).catch((err) => {
        return null;
    });
    if (result != null) {
        res.send(result.toString());
    } else {
        res.send(null);
    }
});

//ユーザー情報検索
router.get('/user/:pnumber', async function (req, res, next) {
    const result = await userpro.queryUserByUid(req.params.pnumber)
    res.send(result);
});

//ユーザ登録
router.post('/newuser', async function (req, res, next) {
    if (req.body.data.companycode == "" || req.body.data.countrycode == "" || req.body.data.officecode == "" || req.body.data.depcode == "" || req.body.data.username == "" || req.body.data.mail == "" || req.body.data.password == "" || req.body.data.role == "" || req.body.data.icon == "" || req.body.data.color == "") {
        res.json({"status": "failed"});
        res.end();
    } else {
        await userpro.newpnumber(req.body.data.companycode, req.body.data.countrycode, req.body.data.officecode, req.body.data.depcode);
        var result = await userpro.getlastpnumber();
        var dataString = JSON.stringify(result);
        var data = JSON.parse(dataString);
        var pnumber = data[0].maxpnumber;
        const result1 = await userpro.insertUser(req.body.data.mail, req.body.data.password, req.body.data.role, req.body.data.icon, req.body.data.color, pnumber, req.body.data.username);
        dataString = JSON.stringify(result1);
        data = JSON.parse(dataString);
        res.json({"status": "success"});
        res.end();


    }

});

//ユーザパスワード更新
router.post('/changepw', async function (req, res, next) {
    if (req.body.data != null) {
        const result = await userpro.confrimPw(req.body.data);
        var dataString = JSON.stringify(result);
        var data = JSON.parse(dataString);
        if (data[0].pwd == req.body.data.current) {
            const result1 = await userpro.updateUserPw(req.body.data);
            // dataString = JSON.stringify(result1);
            // data = JSON.parse(dataString);
            res.json({"status": "success"});
        } else {
            res.json({"status": "failed"});
        }
    } else {
        res.json({"status": "failed"});
    }
});

//ユーザ登録パスワード認証
router.post('/loginbypd', async function (req, res, next) {
    const result = await userpro.checker(req.body.data.mail, req.body.data.pwd);
    if (result.length == 0) {
        res.json({"uid": "error"});
        res.end();
    } else {
        var dataString = JSON.stringify(result);
        var data = JSON.parse(dataString);
        const result1 = await userpro.checkerpnumber(data[0].pnumber);
        if (result1.length != 0) {
            dataString = JSON.stringify(result1);
            data = JSON.parse(dataString);
            var str = data[0].pcompanycode + data[0].pcountry + data[0].poffice + data[0].pdep + data[0].pnumber;
            req.session.isLogin = 1;
            res.setHeader('Set-Cookie', ['enabermap.uid=' + str]);
            res.json({"uid": str});
            res.end();
        } else {
            res.json({"uid": "unknow! Please check the person number in DB"});
            res.end();
        }
    }

});


//SVG File UpLoad
router.post('/singleUpload', upload.single('mapsvg'), async function (req, res, next) {
    const result = await userpro.insertIndoorMap(req.body.companycode, req.body.countrycode, req.body.svgfilename, req.body.building, req.body.floor, req.body.position);
    res.json({"status": "success"});
    res.end();
});

//GET SVG MAP 廃棄、使用しない
router.get('/getmap/:mapname.svg', function (req, res, next) {
    res.json({"svg": reader(req.params.mapname)});

});

//GET USERLIST
router.get('/getuserlist', async function (req, res, next) {
    const result = await userpro.getuserlist();
    if (result.length == 0) {
        res.status(400);
    } else {
        res.send(result);
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
    const result = await userpro.getcompanyname(req.params.companyNo);
    var dataString = JSON.stringify(result);
    var data = JSON.parse(dataString);
    res.send(data);
});

//indoormap
router.get('/getindoordetail/:companyNo', async function (req, res, next) {
    const result = await userpro.getindoordetail(req.params.companyNo);
    var dataString = JSON.stringify(result);
    var data = JSON.parse(dataString);
    res.send(data);
});

//updata indoor map keypoint
router.post('/updatakeypoint', async function (req, res, next) {
    const result = await userpro.updatakeypoints(req.body.data.svgfile, req.body.data.keypoints);
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


// router.get('/jsontest',function (req,res,next) {
//     res.json({"uid":"00001"});
// })


module.exports = router;
