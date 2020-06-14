// default config
module.exports = {
  workers: 1,
  jwt:{
    secret:"cjw-password",
    cookie:"jwt-token",
    expire:3000 //秒
  },
  hostIpPort:"http://127.0.0.1:8360/"
};
