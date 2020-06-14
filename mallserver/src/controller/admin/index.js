const Base = require('../base.js');

module.exports = class extends Base {
    __before() {
        //检查是否含有token，并分析出其中的username
        return this.checkAuth()
    }
    indexAction() {
        return this.display();
    }
    async userinfoAction() {
        const username = this.ctx.state.username;
        //获取当前登陆用户的信息
        // const userinfo = await this.model("member").where({ username }).find();
        const userinfo = await this.model("member").where({ username }).join({
            table: "auth_user_role",
            join: "left",
            as: "l",
            on: ["cmswing_member.id", "user_id"]
        }).join({
            table: "auth_role",
            join: "left",
            as: "c",
            on: ["l.role_id", "c.id"]
        }).field("cmswing_member.id,username,email,mobile,cmswing_member.status,role_id,rule_ids").find();
        const rulelst = await this.model("auth_rule").order("id").select();
        //判断服务器中是否有该用户的头像
        let filepath = think.ROOT_PATH + "/www/static/image/avatar/avatar" + userinfo.id + ".png";
        if (think.isFile(filepath)) {
            var avatar = this.config("hostIpPort") + "static/image/avatar/avatar" + userinfo.id + ".png";
        } else {
            avatar = this.config("hostIpPort") + "static/image/avatar/avatar.jpg";
        }
        //返回头像与用户信息
        this.json({ userinfo, avatar,rulelst })
    }
};
