const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const xmlParser = require('koa-xml-body');
const twilio = require('twilio');


const app = new Koa();
const router = new Router();

let state = {
    url: null,
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

router.post('/twilio', xmlParser(), ctx => {
    console.log(ctx.request.body);
    const message = new twilio.twiml.MessagingResponse();
    message.message('Url set to asdf');
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
