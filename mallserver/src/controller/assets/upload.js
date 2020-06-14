const Base = require('../base.js');
const fs = require("fs");
const path = require("path");
module.exports = class extends Base {
    indexAction() {
        return this.display();
    }
    async upImgsAction() {
        const uploadFile = this.file("uploadFile");
        const filepath = uploadFile.path;
        const uploadpath = think.ROOT_PATH + "/www/static/upload";
        //获取图片名称
        const basename = path.basename(filepath);
        //读取文件内容
        const readStream = fs.ReadStream(filepath);
        //写入到当前文件中
        const writeStream = fs.createWriteStream(uploadpath + "/" + basename);
        readStream.pipe(writeStream);
        this.success({
            filename: basename,
            originName: uploadFile.name
        })
    }
    async removeImgAction() {
        const filename = this.post("filename");
        const uploadpath = think.ROOT_PATH + "/www/static/upload";
        fs.unlinkSync(uploadpath + "/" + filename);
        this.success({
            msg: "移除成功"
        })
    }
};
