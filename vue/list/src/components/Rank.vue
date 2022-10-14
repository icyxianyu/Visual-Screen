<template>
      <div class="com-container">
        <div class="com-chart" ref="Rank_ref"></div>
    </div>
</template>

<script>
import {getmsg} from '@/API/index.js'
export default {
name:"Rank",
data(){
    return{
        Echartinstance:null,
        allData:[],
        startval:0,
        endval:8,
        timeid:null,
    }
},
methods:{
     initEcharts(){
        this.Echartinstance=this.$echarts.init(this.$refs.Rank_ref,'chalk');
    },
      getChart(ret){
         this.allData=ret.sort((a,b)=>b.value-a.value);
         const x=[];
         const y=[];
         this.allData.forEach((item)=>{
             x.push(item.name);
             y.push(item.value);
         })
         const option={
             title:{
                 text:"地区销量排行",
                 left:20,
                 top:20
             },
             grid:{
                top:'40%',
                left:"5%",
                right:"5%",
                bottom:"5%",
                containLabel: true
             },
            tooltip:{},
             xAxis:{
                 type:'category',
                 data:x,
             },
             yAxis:{
                 type:'value'
             },
            itemStyle:{
                        borderRadius:[100,100,0,0]
                    },
             series:[{
                 type:'bar',
                 name:"销量",
                 data:y,
                 itemStyle:{
                     color:(rag)=>{
                         if(rag.data>300)
                         return new this.$echarts.graphic.LinearGradient(0,0,0,1,
                         [{
                             offset:0,
                             color:'#0BA82C'
                         },
                         {
                             offset:1,
                             color:"#4FF778"
                         }]
                         )
                         else if(rag.data>200)
                         return new this.$echarts.graphic.LinearGradient(0,0,0,1,
                         [{
                             offset:0,
                             color:'#2E75BF'
                         },
                         {
                             offset:1,
                             color:"#23E5E5"
                         }]
                         )
                         else
                         return new this.$echarts.graphic.LinearGradient(0,0,0,1,
                         [{
                             offset:0,
                             color:'#5052EE'
                         },
                         {
                             offset:1,
                             color:"#EB6EE5"
                         }]
                         )
                     }
                 }
             }]
         };
        this.updateChart();
        this.startInterval();
        this.Echartinstance.setOption(option);
        this.Echartinstance.on("mouseover",()=>{
            clearInterval(this.timeid)
        })
        this.Echartinstance.on("mouseout",()=>{
            this.startInterval();
        })
         
     },
     updateChart(){
         const options ={
              dataZoom:{
                 show:false,
                 startValue:this.startval,
                 endValue:this.endval
             }
         }
        this.Echartinstance.setOption(options)
     },
     screenApater(){
const width=this.$refs.Rank_ref.offsetWidth/100*3.6;
    const height=this.$refs.Rank_ref.offsetHeight/100*3.6;
    const option={
            title:{
                textStyle:{
                    fontSize:(height+width)/2
                        },
                }
    };
    this.Echartinstance.setOption(option);
    this.Echartinstance.resize()
     },
     startInterval(){
         this.timeid=setInterval(()=>{
             this.startval++;
             this.endval++;
             if(this.endval>21){
                 this.startval=0;
                this.endval=8
             }
              this.updateChart()
         },3000);
         
     },
},
created(){
this.$socket.registerCallBack('rankData',this.getChart)
},
mounted(){
    this.initEcharts();
    // this.getChart();
        this.$socket.send({
        action:'getData',
        socketType:'rankData',
        chartName:'rank',
        value:'',
    })
    window.addEventListener("resize",this.screenApater);

},
destroy(){
     window.removeEventListener("resize",this.screenApater);
     this.$socket.unregisterCallBack('rank')
     clearInterval(this.timeid)
}
}
</script>

<style>

</style>