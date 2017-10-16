const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const xmlParser = require('koa-xml-body');
const twilio = require('twilio');


const app = new Koa();
const router = new Router();

let state = {
    lastSMS: null,
    url: 'http://bookmark.ericchu.net',
};

router.get('/', ctx => {
    ctx.body = state;
});

router.post('/', bodyParser(), ctx => {
    if (ctx.request.body.url) {
        state.url = ctx.request.body.url;
        ctx.status = 200;
    }
});

router.get('/redirect', ctx => {
    ctx.redirect(state.url);
});

router.post('/twilio', bodyParser(), ctx => {
    const body = ctx.request.body;
    state.lastSMS = body;
    const url = body.Body;
    state.url = url;

    const message = new twilio.twiml.MessagingResponse();
    message.message('Successfully changed bookmark');
    ctx.body = message.toString();
});

app.use(async (ctx, next) => {
    console.log(ctx.request.method, ctx.request.url);
    try {
        await next();
    } catch (err) {
        console.log(err);
    }
});

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(3000);
