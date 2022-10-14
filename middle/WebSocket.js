const path=require('path')
const WebSocket=require('ws');
const {findJson} =require('../file/file.js')
const wss=new WebSocket.Server({
    port:9998
})
module.exports.listen =function(){
    wss.on("connection",client=>{
        console.log("有客户端连接成功")
        client.on("message",async message=>{
            let payload=JSON.parse(message.toString());
            console.log(payload)
            const action = payload.action;
            if(action==='getData'){
               let filePatg="../data/"+payload.chartName+".json";
               filePatg=path.join(__dirname,filePatg);
               const result=await findJson(filePatg);
               payload.data=result;
               console.log(payload)
               client.send(JSON.stringify(payload))
            }
            else{
                wss.clients.forEach(item=>{
                    item.send(JSON.stringify(payload))
                })
            }
        })
    })
}
