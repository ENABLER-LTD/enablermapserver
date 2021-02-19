class mapconfig {
    constructor() {
        this.url = 'http://localhost/'
        this.baseurl = 'http://localhost:3000/'
        this.beaconurl = 'http://localhost:2999/'
    }

    geturl() {
        return this.url
    }


    getbaseurl() {
        return this.baseurl
    }

    //login html
    getcompanyname() {
        return this.baseurl + 'getcompanyname/'
    }

    loginbypwd() {
        return this.baseurl + 'loginbypd'
    }

    //admin-settings html
    uploadtime() {
        return this.baseurl + 'uploadtime'
    }

    //historyshow html
    getindoordetail() {
        return this.baseurl + 'getindoordetail/'
    }

    gethistorical() {
        return this.baseurl + 'historical/'
    }

    //indoor-map html
    svgupload() {
        return this.baseurl + 'singleUpload'
    }

    //indoorfloor html
    getfloordetail() {
        return this.baseurl + 'getfloordetail/'
    }

    //logic html
    updatakeypoint() {
        return this.baseurl + 'updatakeypoint'
    }

    //mapindoor html
    getlocations() {
        return this.baseurl + 'getlocations/'
    }

    //userSettings html
    getcodnamelist() {
        return this.baseurl + 'getcodnamelist'
    }

    getcompanydetail() {
        return this.baseurl + 'getcompanydetail/'
    }

    newuser() {
        return this.baseurl + 'newuser'
    }

    //index html
    user() {
        return this.baseurl + 'user/'
    }

    getuserlist() {
        return this.baseurl + 'getuserlist/'
    }

    changepw() {
        return this.baseurl + 'changepw'
    }

    getallservicedetail() {
        return this.baseurl + 'getallservicedetail'
    }

    insertservicesetting() {
        return this.baseurl + 'insertservicesetting'
    }

    getservicesetting() {
        return this.baseurl + 'getservicesetting/'
    }

    updataservicesetting() {
        return this.baseurl + 'updataservicesetting'
    }

    deleteservicesetting() {
        return this.baseurl + 'deleteservicesetting'
    }

    getsysroledetail() {
        return this.baseurl + 'getsysroledetail'
    }

    deleteuser() {
        return this.baseurl + 'deleteuser'
    }

    getpersoncompanydetail() {
        return this.baseurl + 'getpersoncompanydetail/'
    }

    updatapersontail() {
        return this.baseurl + 'updatapersontail'
    }

    insertofficeall() {
        return this.baseurl + 'insertofficeall'
    }

    insertdepall() {
        return this.baseurl + 'insertdepall'
    }

    insertcompanydetail() {
        return this.baseurl + 'insertcompanydetail'
    }

    getcompandetailbyoffice() {
        return this.baseurl + 'getcompandetailbyoffice/'
    }

    updateofficedetail() {
        return this.baseurl + 'updateofficedetail'
    }

    updatedepdetail() {
        return this.baseurl + 'updatedepdetail'
    }

    getdetailbyfilename() {
        return this.baseurl + 'getdetailbyfilename/'
    }

    deleteindoormap() {
        return this.baseurl + 'deleteindoormap'
    }

    updateindoordetail() {
        return this.baseurl + 'updateindoordetail'
    }

    stopoffice() {
        return this.baseurl + 'stopoffice'
    }

    getpersondetail() {
        return this.baseurl + 'user/'
    }

    getAllBeacondetail(){
        return this.beaconurl + 'getAllBeacondetail'
    }

    insertnewbeacon(){
        return this.beaconurl + 'insertnewbeacon'
    }

    getBeaconByid(){
        return this.beaconurl + 'getBeaconByid/'
    }

    deleteBeacon(){
        return this.beaconurl + 'deleteBeacon'
    }

    updateBeacon(){
        return this.beaconurl + 'updateBeacon'
    }

    updateBeaconPosition(){
        return this.beaconurl + 'updateBeaconPosition'
    }

    getAllAreadetail(){
        return this.beaconurl + 'getAllAreadetail'
    }

    getAreaName(){
        return this.beaconurl + 'getAreaName'
    }

    addareadetail(){
        return this.beaconurl + 'addareadetail'
    }

    getareadetail(){
        return this.beaconurl + 'getareadetail/'
    }

    deletearea(){
        return this.beaconurl + 'deletearea/'
    }

    updateareadetail(){
        return this.beaconurl + 'updateareadetail'
    }
}
