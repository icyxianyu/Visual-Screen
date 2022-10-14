module.exports=async(req, res, next) =>{
    const contentType="application/json; charset=utf-8";
    res.setHeader('Content-Type', contentType);
    await next()
}