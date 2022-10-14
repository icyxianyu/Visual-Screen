const express=require('express');
const app = express();
const cors=require('cors');
const time=require('./middle/response_mid')
const resBonhend=require('./middle/resbon')
const log=require('./middle/log');
const webSocket=require('./middle/WebSocket')
app.use(cors());
app.use(time);
app.use(resBonhend)
app.use(log)
app.listen(8888,()=>{
console.log("运行在8888")
})
webSocket.listen()