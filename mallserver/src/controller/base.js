const jsonwebtoken = require("jsonwebtoken");

module.exports = class extends think.Controller {
  __before() {

  }
  failAuth() {
    this.json({ error: "JWT验证失败" });
    return false;
  }
  checkAuth() {
    //从请求头中获取token
    const token = this.header("x-token");
    const { secret, expire, cookie } = this.config("jwt");
    try {
      //解密出tonken转换为对象，将token中用户名保持到状态里
      var tokenObj = token ? jsonwebtoken.verify(token, secret) : {};

      this.ctx.state.username = tokenObj.username;
    } catch (error) {
      this.failAuth();
    }
    //如果不存在用户名,验证失败
    if (!tokenObj || !tokenObj.username) {
      return this.failAuth();
    };
    //不然更新token
    this.updateAuth(tokenObj.username);
  }
  updateAuth(username) {
    const { secret, expire, cookie } = this.config("jwt");
    //将信息放入一个对象中
    const userinfo = {
      username
    }
    //生成token
    const token = jsonwebtoken.sign(userinfo, secret, { expiresIn: expire });
    //放入cookie中
    this.cookie(cookie, token);
    //放入请求头中
    this.header("authorization", token)
    return token

  }
};
