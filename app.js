global._ = require('lodash');
global.jwt = require('jsonwebtoken');
const handler = require('serve-handler');
global.poontFunc = require('./libServer/poontFunction.js');
global.connection_mongo = require('./libServer/mongoBaseConnection.js');
global.sha1 = require('sha1');
var express = require('express')
    ,app = express()
    ,cookieParser = require('cookie-parser')
    ,bodyParser = require('body-parser')
    ,router = express.Router()
    , http = require('http')
    , path = require('path')
    ,favicon = require('serve-favicon')
    ,session = require('express-session')
    , comboboxRoute = require('./routes/combobox')

    ,indexRoute = require('./routes/front-end')
    ,loginRoute = require('./routes/front-end/login')
    ,registerRoute = require('./routes/front-end/register')
    ,adminRoute = require('./routes/front-end/admin')
    ,reportRoute = require('./routes/front-end/report')
    ,profileRoute = require('./routes/front-end/profile')

global.connection_upload = require('./libServer/uploadFile.js');
global.connection_line = require('./libServer/line.js');
global.checkSessionUser = function(req,res,page,param){
    jwt.verify(poontFunc.method.getCookie(req,'desmonitus'), 'Desmonitus-Kitimetha', function(err, decoded) {
        if (err) {
            if(!_.isEmpty(page)){
                res.redirect('/logout');
            }else{
                return false;
            }
        }else{
            if(!_.isEmpty(page)){
                res.render(page, param);
                res.end();
            }else{
                return true;
            }
        }
    });
};

app.set('port', process.env.PORT || 80);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, '/public/images/favicon.ico')))
app.use(session({secret: 'workRecordForPlaning'}));
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.get('/404',function(req, res) {
    res.render('404', {});
    res.end();
});
app.get('/logout',function(req,res){
    poontFunc.method.deleteAllCookies(req,res);
    res.redirect('/login');
});
let comboboxPath = '/combobox';
app.get(comboboxPath,comboboxRoute.get);
app.post(comboboxPath,comboboxRoute.post);

let indexPath = '/';
app.get(indexPath,indexRoute.get);
app.put(indexPath,indexRoute.put);
app.post(indexPath,indexRoute.post);
app.patch(indexPath,indexRoute.patch);
app.delete(indexPath,indexRoute.delete);

let loginPath = '/login';
app.get(loginPath,loginRoute.get);
app.post(loginPath,loginRoute.post);

let registerPath = '/register';
app.get(registerPath,registerRoute.get);

let adminPath = '/admin';
app.get(adminPath,adminRoute.get);
app.post(adminPath,adminRoute.post);
app.patch(adminPath,adminRoute.patch);
app.put(adminPath,adminRoute.put);
app.delete(adminPath,adminRoute.delete);

let reportPath = '/report';
app.get(reportPath,reportRoute.get);
app.post(reportPath,reportRoute.post);

let profilePath = '/profile';
app.get(profilePath,profileRoute.get);
app.post(profilePath,profileRoute.post);
app.patch(profilePath,profileRoute.patch);

app.use('*', function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});


app.use(function(req, res, next) {
    res.status(404);
    if (req.accepts('html')) {
        res.redirect('/404');
        return;
    }

    if (req.accepts('json')) {
        res.send({ error: 'Not found' });
        return;
    }

    res.type('txt').send('Not found');
});

let server = http.createServer(app).listen(app.get('port'), function(){
    let time = poontFunc.method.getNow('dd/mm/yyyy hh:mi:ss');
    console.log("Fitness Start Server port: " + app.get('port')+' '+time);
});