const client = require('./MySQLUtil');

//select user by pnumber
const queryUserByUid = function (pnumber) {
    const sql = "select * from enablermap.user where pnumber = " + "'" + pnumber + "'" + ";";
    return pros(sql);
}

const insertUser = function (mail, pwd, prole, displayicon, displaycolor, pnumber, pname) {
    const sql = "insert ignore into enablermap.user (mail,pwd,prole,displayicon,displaycolor,pnumber,pname) values (" + "'" + mail + "'," + "'" + pwd + "'," + "'" + prole + "'," + "'" + displayicon + "'," + "'" + displaycolor + "'," + "'" + pnumber + "'," + "'" + pname + "');"
    return pros(sql);
}

const updateUserPw = function (pnumber, pwd, newpwd) {
    const sql = "update enablermap.user set pwd = " + "'" + newpwd + "'" + "where pnumber =" + "'" + pnumber + "'and pwd =" + "'" + pwd + "';"
    return pros(sql);
}

const getNewPw = function (pnumber) {
    const sql = "select pwd from enablermap.user where pnumber=" + "'" + pnumber + "';"
    return pros(sql);
}

//パスワードとメールアドレスを使って、個人番号を取得する。
const checker = function (mail, pwd) {
    const sql = "select pnumber from enablermap.user where mail =" + "'" + mail + "' and pwd = " + "'" + pwd + "';"
    return pros(sql);
}

//pnumberを使って、UID取得する。
const checkerpnumber = function (pnumber) {
    const sql = "select * from enablermap.company where pnumber =" + "'" + pnumber + "';"
    return pros(sql);
}

const getuserlist = function (pcompanycode) {
    const sql = "select * from enablermap.company where pcompanycode = " + "'" + pcompanycode + "';"
    return pros(sql);
}

const getcompanydetail = function (companyNo) {
    const sql = "SELECT * FROM enablermap.companydetail where pcompanycode=" + "'" + companyNo + "';"
    return pros(sql);
}

const getcompanyname = function (companyNo) {
    const sql = "SELECT companyname FROM enablermap.servicesetting where companyid=" + "'" + companyNo + "';"
    return pros(sql);
}


const getindoordetail = function (companyNo) {
    const sql = "SELECT * FROM enablermap.indoormap where pcompanycode=" + "'" + companyNo + "';"
    return pros(sql);
}

const updatakeypoints = function (svgfile, keypoints) {
    const sql = "UPDATE enablermap.indoormap SET keypoint=" + "'" + keypoints + "'" + "where svgfile = " + "'" + svgfile + "';"
    return pros(sql);
}

const uploadtime = function (companycode, uploadtime) {
    const sql = "UPDATE enablermap.uploadtime SET uploadtime=" + "'" + uploadtime + "'" + "where companycode = " + "'" + companycode + "';"
    return pros(sql);
}

const newpnumber = function (companycode, officecode, pdep) {
    const sql = "INSERT INTO enablermap.company (pcompanycode,poffice, pdep) VALUES (" + "'" + companycode + "', '" + officecode + "', '" + pdep + "');"
    return pros(sql);
}

const getlastpnumber = function () {
    const sql = "select max(pnumber) as maxpnumber from enablermap.company;"
    return pros(sql);
}

const insertIndoorMap = function (pcompanycode, svgfile, building, floor, position, alt, note, buildingeng) {
    const sql = "insert ignore into enablermap.indoormap values (" + "'" + pcompanycode + "','" + svgfile + "','" + building + "','" + floor + "','" + position + "',null,'" + alt + "','" + note + "','" + buildingeng + "');"
    return pros(sql);
}

const updateindoordetail = function (svgfile, building, floor, position, alt, note, buildingeng) {
    const sql = "Update enablermap.indoormap set building=" + "'" + building + "',floor='" + floor + "',position='" + position + "',alt='" + alt + "',note='" + note + "',buildingeng='" + buildingeng + "' where svgfile ='" + svgfile + "';"
    return pros(sql);
}

const getuploadtime = function (companycode) {
    const sql = "select * from enablermap.uploadtime where companycode = " + "'" + companycode + "';"
    return pros(sql);
}

const getcountryname = function () {
    const sql = "select * from enablermap.countryall;"
    return pros(sql);
}

const getofficename = function () {
    const sql = "select * from enablermap.officeall;"
    return pros(sql);
}

const getdepname = function () {
    const sql = "select * from enablermap.depall;"
    return pros(sql);
}

const getbuildname = function (filename) {
    const sql = "select * from enablermap.indoormap where svgfile=" + "'" + filename + "';"
    return pros(sql);
}

const getbuilddetail = function (buildname) {
    const sql = "select * from enablermap.indoormap where building=" + "'" + buildname + "';"
    return pros(sql);
}

const queryallindoordetail = function () {
    const sql = "select * from enablermap.indoormap;"
    return pros(sql);
}

const getroleservicedetail = function () {
    const sql = "SELECT * FROM enablermap.servicerole;"
    return pros(sql);
}

const getallservicedetail = function () {
    const sql = "SELECT * FROM enablermap.servicesetting;"
    return pros(sql);
}

const deleteuser = function (pnumber) {
    let sql = "DELETE  FROM enablermap.user WHERE pnumber = " + "'" + pnumber + "';"
    pros(sql);
    sql = "DELETE  FROM enablermap.company WHERE pnumber = " + "'" + pnumber + "';"
    return pros(sql);
}

const insertservicesetting = function (companyid, companyname, outdoormap, indoormap, beacon, area, calutor, usernumber, conpanynameeng, servicestatus, note) {
    const sql = "insert into enablermap.servicesetting values (" + "'" + companyid + "','" + companyname + "','" + outdoormap + "','" + indoormap + "','" + beacon + "','" + area + "','" + calutor + "','" + usernumber + "','" + conpanynameeng + "','" + servicestatus + "','" + note + "');"
    return pros(sql);
}

const getservicesetting = function (companyid) {
    const sql = "select * from enablermap.servicesetting where companyid = " + "'" + companyid + "';"
    return pros(sql);
}

const updataservicesetting = function (companyid, companyname, outdoormap, indoormap, beacon, area, calutor, usernumber, conpanynameeng, servicestatus, note) {
    const sql = "REPLACE into enablermap.servicesetting values (" + "'" + companyid + "','" + companyname + "','" + outdoormap + "','" + indoormap + "','" + beacon + "','" + area + "','" + calutor + "','" + usernumber + "','" + conpanynameeng + "','" + servicestatus + "','" + note + "');"
    return pros(sql);
}

const deleteservicesetting = function (companyid) {
    const sql = "delete from enablermap.servicesetting where companyid = " + "'" + companyid + "';"
    return pros(sql);
}

const getsysroledetail = function () {
    const sql = "select * from enablermap.systemrole;"
    return pros(sql);
}

const getcompandetailbyoffice = function (poffice) {
    const sql = "select * from enablermap.companydetail where poffice=" + "'" + poffice + "';"
    return pros(sql);
}

const insertofficeall = function (officecode, officename, officenameeng) {
    const sql = "insert into enablermap.officeall values (" + "'" + officecode + "','" + officename + "','" + officenameeng + "');"
    return pros(sql);
}

const insertdepall = function (officecode, depcode, depname, depnameeng) {
    const sql = "insert into enablermap.depall values (" + "'" + depcode + "','" + depname + "','" + depnameeng + "','" + officecode + "');"
    return pros(sql);
}

const insertcompanydetail = function (pcompanycode, poffice, pdep, note, usestatus) {
    const sql = "insert into enablermap.companydetail values (" + "'" + pcompanycode + "','" + poffice + "','" + pdep + "','" + note + "'," + usestatus + ");"
    return pros(sql);
}

const updateofficedetail = function (officecode, officename, officenameeng) {
    const sql = "UPDATE enablermap.officeall set officename=" + "'" + officename + "',officenameeng =" + "'" + officenameeng + "' where officecode = " + "'" + officecode + "';"
    return pros(sql);
}

const deleteindoormap = function (filename) {
    const sql = "Delete from enablermap.indoormap where svgfile=" + "'" + filename + "';"
    return pros(sql);
}

const updatapersontail = function (pnumber, officecode, depcode, username, mail, password, role, icon, color) {
    let sql = "UPDATE enablermap.user SET mail =" + "'" + mail + "',pwd =" + "'" + password + "',prole=" + "'" + role + "',displayicon=" + "'" + icon + "',displaycolor=" + "'" + color + "',pname=" + "'" + username + "'where pnumber =" + "'" + pnumber + "';"
    pros(sql);
    sql = "UPDATE  enablermap.company SET poffice = " + "'" + officecode + "',pdep =" + "'" + depcode + "'where pnumber = " + "'" + pnumber + "';"
    return pros(sql);
}

const updatedepdetail = function (poffice, depcode, depname, depnameeng, note, usestatus) {
    let sql = "UPDATE enablermap.companydetail SET note =" + "'" + note + "',usestatus =" + "'" + usestatus + "'where poffice =" + "'" + poffice + "' and pdep=" + "'" + depcode + "';"
    pros(sql);
    sql = "UPDATE  enablermap.depall SET depname = " + "'" + depname + "',depnameeng =" + "'" + depnameeng + "'where depcode = " + "'" + depcode + "' and officecode = " + "'" + poffice + "';"
    return pros(sql);

}

const updatedepdetailsp = function (poffice, depcode, depname, depnameeng, note, usestatus,pcompanycode) {
    try {
        let sql = "DELETE FROM enablermap.depall where depcode='00000' and officecode = " + "'" + poffice + "';"
        pros(sql);
        sql = "DELETE FROM enablermap.companydetail where poffice=" + "'" + poffice + "' and pdep='00000';"
        pros(sql);
        sql = "insert into enablermap.depall values (" + "'" + depcode + "','" + depname + "','" + depnameeng + "','" + poffice + "');"
        pros(sql);
        sql = "insert into enablermap.companydetail values (" + "'" + pcompanycode + "','" + poffice + "','" + depcode + "','" + note + "'," + usestatus + ");"
        return pros(sql);

    } catch (e) {
        console.log(e);
    }

}

const stopoffice = function (poffice) {
    let sql = "UPDATE enablermap.companydetail SET usestatus = 0 where poffice = " + "'" + poffice + "';"
    return pros(sql);

}


const pros = function (sql) {
    return new Promise((resolve, reject) => {
        client.connection.query(sql, (error, result, fields) => {
            if (error) {
                console.log(error.message);
                reject(error.message);
            } else {
                resolve(result);
            }
        });
    })
};


module.exports = {
    queryUserByUid,
    insertUser,
    updateUserPw,
    checker,
    checkerpnumber,
    getuserlist,
    getcompanydetail,
    getindoordetail,
    updatakeypoints,
    getcompanyname,
    uploadtime,
    newpnumber,
    getlastpnumber,
    insertIndoorMap,
    getNewPw,
    getuploadtime,
    getcountryname,
    getofficename,
    getdepname,
    getbuildname,
    getbuilddetail,
    queryallindoordetail,
    getroleservicedetail,
    deleteuser,
    getallservicedetail,
    insertservicesetting,
    getservicesetting,
    updataservicesetting,
    deleteservicesetting,
    getsysroledetail,
    updatapersontail,
    insertofficeall,
    insertdepall,
    insertcompanydetail,
    getcompandetailbyoffice,
    updateofficedetail,
    updatedepdetail,
    deleteindoormap,
    updateindoordetail,
    stopoffice,
    updatedepdetailsp
}
