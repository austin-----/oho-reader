var express = require('express');
var proxy = require('http-proxy-middleware');
var path = require('path');

var app = express();
app.use('/static', path.join(__dirname, express.static('static')));
app.use('/assets', path.join(__dirname, express.static('assets')));
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

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/favicon.ico', function (req, res) {
  res.sendFile(path.join(__dirname, 'favicon.ico'));
});

app.listen(3001);