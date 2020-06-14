
const Base = require('../base.js');

module.exports = class extends Base {
    indexAction() {
        return this.display();
    }
    async getrulelistAction() {
        const total = await this.model("auth_rule").count();
        const rulelist = await this.model("auth_rule").order("id").field("id,name,desc,status").select();
        this.json({
            rulelist,
            total
        })
    }

    async delruleAction() {
        const ruleid = this.get("id");
        await this.model("auth_rule").where({ id: ruleid }).delete();
        this.json({
            msg: "删除成功"
        })
    }

    async addruleAction() {
        if (this.method === "POST") {
            const rule = this.post();
            await this.model("auth_rule").add(rule);
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
    async ruleinfoAction() {
        const id = this.get("id");
        const ruleinfo = await this.model("auth_rule").where({ id }).field("id,name,desc,status").find();
        this.json({
            ruleinfo
        })
    }
    async updateruleAction() {
        const rule = this.post();
        console.log(rule);
        if (this.method === "POST") {
            await this.model("auth_rule").where({ id: rule.id }).update(rule);
            this.json({
                status: 0,
                msg: "修改成功"
            })
        }else{
            this.json({
                status: 1,
                msg: "修改失败"
            })
        }
    }
};
