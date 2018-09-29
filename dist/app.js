var express = require('express');
var proxy = require('http-proxy-middleware');
var path = require('path');

var app = express();
app.use('/static', express.static(path.join(__dirname, 'static')));
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use('/api', proxy({
  target: 'http://api.zhuishushenqi.com/',
  pathRewrite: {'^/api' : '/'}, 
  changeOrigin: true
}
));

app.use('/chapter', proxy({
  target: 'http://chapter2.zhuishushenqi.com/',
  pathRewrite: {'^/chapter' : '/chapter'},
  changeOrigin: true
}
));

app.use('/setting', proxy({
  target: process.env.SETTING_URL,
  pathRewrite: {'^/setting' : '/setting'},
  changeOrigin: true
}));

app.get('/favicon.ico', function (req, res) {
  res.sendFile(path.join(__dirname, 'favicon.ico'));
});

app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(3001);