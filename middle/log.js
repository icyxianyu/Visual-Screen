const path=require('path');
const {findJson}=require('../file/file.js')
module.exports=async(req, res, next) =>{
    const url=req.url.replace("/api","");
    filepath="../data"+url;
    filepath=path.join(__dirname,filepath+".json");
   
    try{
        let msg=await findJson(filepath)
        res.send(msg)
    }
    catch(err){
        const msg={
            status:404,
            message:"文件不存在，请求错误"
        }
        res.send(JSON.stringify(msg))
    }
    await next();
}