<template>
  <div class="com-container">
        <div class="com-chart" ref="Stock_ref"></div>
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
        begin:0,
        timeId:null,
    }
},
methods:{
     initEcharts(){
        this.Echartinstance=this.$echarts.init(this.$refs.Stock_ref,'chalk');
            this.Echartinstance.on("mouseover",()=>{
                 clearInterval(this.timeId);
    })
    this.Echartinstance.on("mouseout",()=>{
        this.SetInterval();
    })
    },
      getChart(ret){
         this.allData=ret
         const option={
            title:{
                text:"库存销量分析",
                top:"5%",
                left:"2%"
            },
             tooltip:{}
         };
        this.updateChart();
         this.SetInterval();
        this.screenApater()
        this.Echartinstance.setOption(option);
     },
     updateChart(){
          const centerArr=[
             ['18%','40%'],
             ['50%','40%'],
             ['82%','40%'],
             ['34%','75%'],
             ['66%','75%']
         ];
         let temp=this.allData.slice(this.begin,this.begin+5).map((item,index)=>{
             return{
                 type:"pie",
                 center:centerArr[index],
                 data:[
                     {  name:item.name+"\n\n"+"剩余"+(item.stock-item.sales),
                         value:item.sales,
                     },{
                         value:item.stock-item.sales,
                         itemStyle:{
                             color:'#ccc'
                         }
                         }],
                 labelLine:{
                     show:false
                 },
                 label:{
                     position:'center',
                 },
                
             }
         });
        
         const options ={
             series:temp,
         }
        this.Echartinstance.setOption(options)
     },
     screenApater(){
    const width=this.$refs.Stock_ref.offsetWidth/100*3.6;
    const height=this.$refs.Stock_ref.offsetHeight/100*3.6;
    const inner=(width+height)*2;
    const outer=inner*1.125;
    const option={
            title:{
                textStyle:{
                    fontSize:(height+width)/2
                        },
                },
            series:[
                {radius:[inner,outer],
                label:{
                    fontSize:inner/4
                }},
                {radius:[inner,outer],
                label:{
                    fontSize:inner/4
                }},
                {radius:[inner,outer],
                label:{
                    fontSize:inner/4
                }},
                {radius:[inner,outer],
                label:{
                    fontSize:inner/4
                }},
                {radius:[inner,outer],
                label:{
                    fontSize:inner/4
                }},
            ]
            
    };
    this.Echartinstance.setOption(option);
    this.Echartinstance.resize()
     },
     SetInterval(){ 
         const len=Math.floor(this.allData.length/5)
            this.timeId=setInterval(()=>{
            this.begin==len?this.begin=0:this.begin++;
            this.updateChart();
        },3000)
     }
},
mounted(){
    this.initEcharts();
    // this.getChart();
    this.$socket.send({
        action:'getData',
        socketType:'stockData',
        chartName:'stock',
        value:'',
    })
   
    window.addEventListener("resize",this.screenApater);

},
created(){
this.$socket.registerCallBack('stockData',this.getChart)
},
destroy(){
    this.$socket.unregisterCallBack('stockData')
     window.removeEventListener("resize",this.screenApater);
     clearInterval(this.timeId);
}
}

</script>

<style>

</style>