
const Base = require('../base.js');

module.exports = class extends Base {
    indexAction() {
        return this.display();
    }
    async getrolelistAction() {
        const page = this.get("page") || 1;
        const total = await this.model("auth_role").count();
        console.log(total);
        const rolelist = await this.model("auth_role").page(page, 10).order("id").field("id,desc,status,rule_ids").select();

        this.json({
            rolelist,
            total
        })
    }
    async addroleAction() {
        if (this.method === "POST") {
            const role = this.post();
            await this.model("auth_role").add(role);
            this.json({
                status: 0,
                msg: "添加成功"
            })
        } else {
            this.json({
                status: 1,
                msg: "添加失败"
            })
        }
    }
    async delroleAction() {
        const roleid = this.get("id");
        await this.model("auth_role").where({ id: roleid }).delete();
        this.json({
            msg: "删除成功"
        })
    }
    async roleinfoAction() {
        const id = this.get("id");
        const roleinfo = await this.model("auth_role").where({ id }).field("id,desc,status,rule_ids").find();
        this.json({
            roleinfo
        })
    }
    async updateroleAction() {
        const role = this.post();
        console.log(role);
        if (this.method === "POST") {
            await this.model("auth_role").where({ id: role.id }).update(role);
            this.json({
                status: 0,
                msg: "修改成功"
            })
        } else {
            this.json({
                status: 1,
                msg: "修改失败"
            })
        }
    }

};
