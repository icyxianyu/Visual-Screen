<template>
      <div class="com-container">
        <div class="title" :style="comStyle">
            <span>{{selecttext}}</span>
              <span @click="isshow=!isshow">
                  <span class="iconfont titleicon"  :style="comStyle">&#xe87e;</span>
              </span>
              <div class="select-con" v-show="isshow" >
                <div class="select-item" v-for="p of this.select" :key="p.key" 
                @click="changeSelect(p.key,p.text)">{{p.text}}</div>
              </div>
            </div>
        <div class="com-chart" ref="Trend_ref" @click="isshow=false">
        </div>
    </div>
</template>

<script>
import {getmsg} from "@/API/index.js"
export default {
name:"Trend",
data(){
    return{
    chartInstance:null,
    allData:[],
    isshow:false,
    selectval:"",
    selecttext:"",
    wid:0,
    }
},
computed:{
    select(){
        return this.allData.type
    },
    comStyle(){
        return {
            fontSize:this.wid/1.2+"px"
        }
    }
},
mounted(){
    this.initChart();
    // this.getChart();
    this.$socket.send({
        action:'getData',
        socketType:'trendData',
        chartName:'trend',
        value:'',
    })
    window.addEventListener("resize",this.adapt);
    this.screenApater();
},
created(){
this.$socket.registerCallBack('trendData',this.getChart);
},
methods:{
    initChart(){
        this.chartInstance=this.$echarts.init(this.$refs.Trend_ref,"chalk");
        const initOption={};
        this.chartInstance.setOption(initOption);
    },
     getChart(ret){
        // this.allData=await getmsg("trend");
        this.allData=ret;
        this.selectval=this.allData.type[0].key;
        this.selecttext=this.allData.type[0].text;
        this.updateChart();
     },
     updateChart(){
         const color1=[
             "rgba(251, 150, 174 ,0.8)",
             "rgba(135, 247, 207 ,0.8)",
             "rgba(247, 244, 148 ,0.8)",
             "rgba(114, 204, 255 ,0.8)",
             "rgba(247, 197, 160 ,0.8)",
         ];
        const color2=[
             "rgba(251, 150, 174 ,0)",
             "rgba(135, 247, 207 ,0)",
             "rgba(247, 244, 148 ,0)",
             "rgba(114, 204, 255 ,0)",
             "rgba(247, 197, 160 ,0)",
         ]
         const data=this.allData[this.selectval].data.map((item,index)=>{
             
             return {
                type:"line",
                data:item.data,
                name:item.name,
                smooth:true,
                stack:this.selectval,
                areaStyle:{
                 color:new this.$echarts.graphic.LinearGradient(
                     0,0,0,1,
                     [
                    {
                        offset:0,
                        color:color1[index]
                     },{
                         offset:1,
                         color:color2[index]
                     }]
                 )
             },
            emphasis: {
                focus: 'series',
                blurScope: 'coordinateSystem'
            }
             }
         })

         const dataOption={
             xAxis:{
                 type:"category",
                boundaryGap: false,
                 data:this.allData.common.month
             },
             yAxis:{
                 type:"value",
             },
             grid:{
                top:"30%",
                left:"4%",
                right:"4%",
                bottom:"2%",
                containLabel: true
             },
            series:data,
            legend:{
                right:20,
                top:"15%",
                icon:"circle"
            },
            dataZoom:[{
                type:"inside",
                xAxisIndex:0
            }],
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                },
                
            },
         };
         this.chartInstance.setOption(dataOption);
     },
     screenApater(){
         this.wid=this.$refs.Trend_ref.offsetWidth/100*3.6;
        
         const adaptOption={
            legend:{
                itemWidth:this.wid,
                itemHeight:this.wid,
                itemGap:this.wid,
                textStyle:{
                    fontSize:this.wid/2
                }
            },

         };
         this.chartInstance.setOption(adaptOption);
         this.chartInstance.resize();
     },
     changeSelect(key,text){
        this.selecttext=text;
        this.selectval=key;
        this.updateChart()
     }
},
destroy(){
    this.$socket.unRegisterCallback('trendData');
    window.removeEventListener("resize",this.screenApater)
}
}
</script>

<style scoped lang="less">
.com-container{
    position: relative;
}
.title{
    position: absolute;
    z-index: 10;
    color: white;
    left:5%;
    top:2%;
    cursor: pointer;
    user-select:none;
    .titleicon{
        margin-left:10px;
    }
    .select-item:hover{
        opacity: 0.8;
    } 
    
}


</style>