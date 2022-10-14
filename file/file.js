const fs=require('fs');
module.exports.findJson=(path)=>{
    return new Promise((resolve, reject)=>{
        fs.readFile(path,"utf-8",(error,item)=>{
            if(error)reject(error);
            else
            resolve(item);
        })
    })
}