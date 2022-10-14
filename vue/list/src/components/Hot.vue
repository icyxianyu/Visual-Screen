<template>
      <div class="com-container">
        <div class="com-chart" ref="Hot_ref"></div>
        <div class="box">
            <span class="bef" @click="change(-1)" :style=textSt>< </span>
            <span class="name" :style=textSt>{{allData.name}}</span>
            <span class="aft" @click="change(1)" :style=textSt> ></span>
        </div>
    </div>
</template>

<script>
import {getmsg} from "@/API/index.js"
export default {
name:"hot",
data(){
    return{
        Echartinstance:null,
        allData:[],
        index:0,
        wid:null,
        datas:[],
    }
},
computed:{
    textSt(){
        return{
             fontSize:this.wid+"px"
        }
    }
},
methods:{
     initEcharts(){
        this.Echartinstance=this.$echarts.init(this.$refs.Hot_ref,'chalk');
    },
      getChart(ret){
         this.datas=ret
         const options ={
            title:{
                 text:"热销商品占比",
                 left:20,
                 top:10
             },
             
             legend:{
                 left:15,
                 bottom:'5%',
                 orient:"vertical",
             },
             series:[{
                     type:'pie',
             }],
            tooltip:{
                 formatter:(arg)=>{
                     const len=arg.data.children.map((item)=>{
                        return arg.marker+item.name+":"+item.value+"<p>"; 
                     })
                     return arg.name+" :总计"+arg.value+"<p>"+len.join("")
                 }
             },
         };
         this.Echartinstance.setOption(options);
         this.screenApater()
         this.updateChart();
     },
     updateChart(){
        this.allData=this.datas[this.index]
         const options ={
             series:[{
                 name:this.allData.name,
                 data:this.allData.children,
             },
             ],
         }
        this.Echartinstance.setOption(options)
     },
     change(x){
         this.index+=x;
         if(this.index<0||this.index>this.datas.length-1)
                this.index=0
         this.updateChart()
     },
     screenApater(){
        const width=this.$refs.Hot_ref.offsetWidth/100*3.6;
        const height=this.$refs.Hot_ref.offsetHeight/100*3.6;
        this.wid=(width+height)/2;
        const option={
            title:{
                textStyle:{
                    fontSize:(height+width)/2
                        },
                },
                series:[
                    {
                        radius:(width+height)*3,
                        center:["50%", "50%"]
                    }
                ],
            legend:{
                 textStyle:{
                    fontSize:(height+width)/3
                        },
            }
            
        };
        this.Echartinstance.setOption(option);
        this.Echartinstance.resize()
     }
},
mounted(){
    this.initEcharts();
    // this.getChart();
    this.$socket.send({
        action:'getData',
        socketType:'hotData',
        chartName:'hotproduct',
        value:'',
    })
    window.addEventListener("resize",this.screenApater);

},
created(){
this.$socket.registerCallBack('hotData',this.getChart);
},
destroy(){
    this.$socket.unregisterCallBack('hotData')
     window.removeEventListener("resize",this.screenApater);
}
}
</script>

<style scoped lang="less">
.com-container{
    position: relative;
        .box{
            position:absolute;
            right:10%;
            bottom:10%;
            color:#ccc;
            font-weight: bold;
            cursor: pointer;
            user-select:none;
        }
}
</style>