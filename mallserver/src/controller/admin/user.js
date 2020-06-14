const Base = require('../base.js');

module.exports = class extends Base {
    __before() {
    }
    indexAction() {
        return this.display();
    }
    async getuserAction() {
        const id = this.get("id");
        const userinfo = await this.model("member").where({ "cmswing_member.id": id }).join({
            table: "auth_user_role",
            join: "left",
            as: "l",
            on: ["cmswing_member.id", "user_id"]
        }).join({
            table: "auth_role",
            join: "left",
            as: "c",
            on: ["l.role_id", "c.id"]
        }).field("cmswing_member.id,username,email,mobile,cmswing_member.status,role_id").find();
        this.json({ userinfo })
    }

    async getuserlistAction() {
        let page = this.get("page") || 1;
        const total = await this.model("member").count();
        console.log(total);
        const userlist = await this.model("member").join({
            table: "auth_user_role",
            join: "left",
            as: "l",
            on: ["cmswing_member.id", "user_id"]
        }).join({
            table: "auth_role",
            join: "left",
            as: "c",
            on: ["l.role_id", "c.id"]
        }).page(page, 10).field("cmswing_member.id,username,email,mobile,cmswing_member.status,role_id").select();
        this.json({
            userlist,
            total
        })
    }
    async adduserAction() {
        const Postuser = this.post();
        let { username, password, email, mobile, role_id } = Postuser;
        //先查找是否存在该用户
        if (this.method === "POST") {
            const user = await this.model("member").where({ username }).find();
            if (!user.username) {
                //判断邮箱是否已用过
                const isExitemail = await this.model("member").where({ email }).field("email").find();
                // console.log(isExitemail)
                if (typeof isExitemail.email === "undefined") {
                    //密码需要加密
                    password = this.verifyPassword(password);
                    //设置默认状态
                    const status = 1;
                    //添加用户到数据库
                    await this.model("member").add({ username, password, email, mobile, status });
                    //获取新用户的id
                    const user_id = (await this.model("member").where({ username }).field("id").find()).id;
                    console.log(user_id);
                    //将用户id与角色id关联起来
                    await this.model("auth_user_role").add({ user_id, role_id });
                    this.json({
                        status: 0,
                        msg: "添加成功"
                    })
                } else {
                    this.json({
                        status: 1,
                        msg: "添加失败，该邮箱已用过"
                    })
                }
            } else {
                this.json({
                    status: 1,
                    msg: "添加失败，该用户已存在"
                })
            }

        }
    }
    async deluserAction() {
        const userid = this.get("id");
        await this.model("member").where({ id: userid }).delete();
        this.json({
            msg: "删除成功"
        })
    }
    async updateuserAction() {
        if (this.method === "POST") {
            let { id, username, password, email, mobile, role_id, status } = this.post();
            //是否修改了密码
            if (password) {
                //加密
                password = this.verifyPassword(password);
                await this.model("member").where({ id }).update({ username, password, email, mobile, status });
            } else {
                await this.model("member").where({ id }).update({ username, email, mobile, status });
            }
            //先查找是否有对应的数据
            const user_role_id = (await this.model("auth_user_role").where({ user_id: id }).field("id").find()).id;
            //如果有就更新
            if (user_role_id) {
                await this.model("auth_user_role").where({ user_id: id }).update({ role_id });
            } else {
                //否则添加
                await this.model("auth_user_role").add({ user_id: id, role_id });
            }
            this.json({
                status: 0,
                msg: "修改成功"
            })
        } else {
            this.json({
                status: 1,
                msg: "无法修改"
            })
        }
    }
    verifyPassword(password) {
        return think.md5(think.md5("www.cmswing.com") + think.md5(password) + think.md5('Arterli'));
    }
};
