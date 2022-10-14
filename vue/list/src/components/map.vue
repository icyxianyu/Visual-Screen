<template>
    <div class="com-container">
        <div class="com-chart" ref="Map_ref"></div>
    </div>
</template>

<script>
import {getmsg} from "@/API/index.js"
export default {
name:"maps",
data(){
  return{
    Echartinstance:null,
    allData:[],
  }
  
},
methods:{
   async initEcharts(){
    this.Echartinstance=this.$echarts.init(this.$refs.Map_ref,"chalk");
    const ret=await getmsg("china");
      this.$echarts.registerMap('china',ret);
       const  options={
         geo:{
           map:'china',
           type:'map' ,
          roam: true,
         },
    };
    this.Echartinstance.setOption(options);
     
  },
   getChart(ret){
      this.allData=ret;
      this.updateChart();
  },
   updateChart(){
    
  const data=this.allData.map((item)=>{
      return {
        type:"effectScatter",
        name:item.name,
        data:item.children,
        coordinateSystem:"geo",
        rippleEffect:{
          scale:5,
          brushType:'stroke'
        }
      }
  })
    const option={
      title:{
        text:"商家分布图",
        left:20,
        top:20,
      },
      tooltip:{
	      trigger:'item',
        formatter:function(params){
          return `${params.marker} ${params.name}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${params.seriesName}`
        }
      },
      geo:{
        type:"map",
        map:'china',
        top:'5%',
        bottom:'5%',
        itemStyle:{
          areaColor:"#2E72BF",
          borderColor:"#ccc"
        }
      },
      series:data,
      legend:{
        left:'5%',
        bottom:"5%",
        orient:"vertical",
      }
    }
    this.Echartinstance.setOption(option)
  },
  screenApater(){
    const width=this.$refs.Map_ref.offsetWidth/100*3.6;
    const height=this.$refs.Map_ref.offsetHeight/100*3.6;
    const option={
            title:{
                textStyle:{
                    fontSize:(height+width)/2
                        },
                },
              legend:{
                itemWidth:width,
                itemHeight:height,
                textStyle:{
                   fontSize:(height+width)/3
                }
              }
    };
    this.Echartinstance.setOption(option);
    this.Echartinstance.resize()
  }
},
mounted(){
  this.initEcharts();
  this.$socket.send({
        action:'getData',
        socketType:'mapData',
        chartName:'map',
        value:'',
    })
  window.addEventListener("resize",this.screenApater)
  this.screenApater();
},
created(){
this.$socket.registerCallBack('mapData',this.getChart)
},
destroy(){
  this.$socket.unregisterCallBack('mapData')
window.removeEventListener("resize",this.screenApater)
}
}
</script>

<style>

</style>