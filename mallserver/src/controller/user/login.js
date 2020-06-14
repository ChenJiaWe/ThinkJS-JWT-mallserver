const Base = require('../base.js');

module.exports = class extends Base {
    indexAction() {
        return this.display();
    }
    async loginAction() {
        const { username, password } = this.post();
        const userinfo = await this.model("member").where({ username }).find();
        //判断用户是否存在
        if (userinfo) {
            //判断密码是否正确
            if (userinfo.password === this.verifyPassword(password)) {
                //登陆成功，生成token值，将其返回到前端
                const token = this.updateAuth(username);
                this.json({
                    msg: "登陆成功",
                    token
                });
            } else {
                this.json({
                    error: "密码错误"
                })
            }
        } else {
            this.json({
                error:"该用户不存在"
            })
        }
    }
    verifyPassword(password) {
        return think.md5(think.md5("www.cmswing.com") + think.md5(password) + think.md5('Arterli'));
    }
};
