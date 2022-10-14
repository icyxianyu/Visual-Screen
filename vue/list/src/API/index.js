import request from './request.js'
export const getmsg=(name)=>{
return request({
    method: 'GET',
    url:name
})
}
