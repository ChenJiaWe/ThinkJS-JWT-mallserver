
const Base = require('../base.js');

module.exports = class extends Base {
    indexAction() {
        return this.display();
    }
    async getproductlistAction() {
        const page = this.get("page") || 1;
        const total = await this.model("product").count();
        console.log(total);
        const productlist = await this.model("product")
            .join({
                table: "category",
                join: "left",
                on: ["categoryid", "id"]
            })
            .page(page, 10).order("id").field("cmswing_product.id,cmswing_product.title,imgs,price,sku,content,cmswing_category.title as category,categoryid").select();

        this.json({
            productlist,
            total
        })
    }
    async addproductAction() {
        if (this.method === "POST") {
            const product = this.post();
            product.sku = JSON.stringify(product.sku);
            product.imgs = JSON.stringify(product.imgs);
            await this.model("product").add(product);
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
    async delproductAction() {
        const productid = this.get("id");
        await this.model("product").where({ id: productid }).delete();
        this.json({
            msg: "删除成功"
        })
    }
    async productinfoAction() {
        const id = this.get("id");
        const productinfo = await this.model("product").where({ id }).field("id,desc,status,rule_ids").find();
        this.json({
            productinfo
        })
    }
    async updateproductAction() {
        const product = this.post();
        product.sku = JSON.stringify(product.sku);
        product.imgs = JSON.stringify(product.imgs);
        if (this.method === "POST") {
            await this.model("product").where({ id: product.id }).update(product);
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
