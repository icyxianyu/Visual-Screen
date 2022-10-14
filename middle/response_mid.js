module.exports= async (req, res, next) => {
    const start = new Date().getTime();
    await next();
    const end=new Date().getTime() - start
    res.setHeader('X-Response-Time',end+"ms");
}