export default 
class SocketServer{
static instance =null;
static get Instance(){
    if(!this.instance)
    this.instance=new SocketServer();
    return this.instance
}
callBackMapping={}
connected=false;
connect(){
    if(!window.WebSocket){
        return console.log("error")
    }
    this.ws=new WebSocket("ws://localhost:9998");
    this.ws.onopen=()=>{
        this.connected=true;
        console.log("连接终端成功")
    }
    this.ws.onclose=()=>{
        this.connected=false;
        console.log("关闭连接")
    }
    this.ws.onmessage=(msg)=>{
         const remsg=JSON.parse(msg.data);
        //  console.log(remsg)
         const socketType=remsg.socketType
        if(this.callBackMapping[socketType]){
            const action=remsg.action;
            if(action=='getData'){
                const realData=JSON.parse(remsg.data);
                this.callBackMapping[socketType].call(this,realData);
            }
            else if(action=='fullScreen'){
                this.callBackMapping[socketType].call(this,remsg);
            }
        }
    }
}
send(data){
    if (this.connected==true){
    this.ws.send(JSON.stringify(data));
    }
    else{
       setTimeout(()=>{
        this.send(data)
       },500)
    }
}
registerCallBack(socketType,callback){
this.callBackMapping[socketType]=callback
}
unRegisterCallback(socketType){
this.callBackMapping[socketType]=null
}
}