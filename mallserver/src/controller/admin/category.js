
const Base = require('../base.js');

module.exports = class extends Base {
    indexAction() {
        return this.display();
    }
    async getcategorylistAction() {
        const page = this.get("page") || 1;
        const total = await this.model("category").count();
        console.log(total);
        const categorylist = await this.model("category").page(page, 10).order("id").field("id,title").select();

        this.json({
            categorylist,
            total
        })
    }
    async addcategoryAction() {
        if (this.method === "POST") {
            const category = this.post();
            category.name = category.title;
            await this.model("category").add(category);
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
    async delcategoryAction() {
        const categoryid = this.get("id");
        await this.model("category").where({ id: categoryid }).delete();
        this.json({
            msg: "删除成功"
        })
    }
    async categoryinfoAction() {
        const id = this.get("id");
        const categoryinfo = await this.model("category").where({ id }).field("id,desc,status,rule_ids").find();
        this.json({
            categoryinfo
        })
    }
    async updatecategoryAction() {
        const category = this.post();
        if (this.method === "POST") {
            await this.model("category").where({ id: category.id }).update(category);
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
