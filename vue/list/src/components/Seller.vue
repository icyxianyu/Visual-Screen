<template>
    <div class="com-container">
        <div class="com-chart" ref="Seller_ref"></div>
    </div>
</template>

<script>
import {getmsg}  from "@/API/index.js"
export default {
name:"Seller",
data(){
    return{
        chartInstance:null,
        allData:[],
        currentpage:1,
        totalPages:0,
        timeId:null,
    }
},
mounted(){
    this.initChart();
    // this.getChart();
    this.$socket.send({
        action:'getData',
        socketType:'sellerData',
        chartName:'seller',
        value:'',
    })
    window.addEventListener("resize",this.screenApater)
    this.screenApater()
},
methods:{

    screenApater(){
        let width=this.$refs.Seller_ref.offsetWidth/100*3.6;
        let height=this.$refs.Seller_ref.offsetHeight/100*3.6;
        const newOptions={
            xAxis:{
                axisLabel: {
                    fontSize:(width+height)/3,
                }
            },
            yAxis:{
                axisLabel: {
                    fontSize:(width+height)/3,
                }
            },

            series:[
                {
                    barWidth:height*2,
                    label:{
                        fontSize:(width+height)/3
                    }
                },
            ],
            title:{
                textStyle:{
                    fontSize:(height+width)/2
                        },
                },
        }
        this.chartInstance.setOption(newOptions);
        this.chartInstance.resize()
    },
    //初始化Echart的实例对象
    initChart(){
        this.chartInstance=this.$echarts.init(this.$refs.Seller_ref,"chalk");
        const initOption={
                    xAxis:{
                        type:"value",
                    },
                    yAxis:{
                        type:"category",
                    },

                    series:[{
                        type:"bar",
                        label:{
                            show:true,
                            position:"right"
                        }
                    }],
                    grid:{
                        top:"20%",
                        left:"5%",
                        right:"5%",
                        bottom:"5%",
                        containLabel: true
                    },
                    tooltip:{
                        trigger:"axis",
                        axisPointer:{
                            type:"shadow",
                            z:0,
                        }
                    },
                    legend:{
                        show:true,
                    },
                    itemStyle:{
                        borderRadius:[0,100,100,0]
                    },
                    color:new this.$echarts.graphic.LinearGradient(
                            0,0,1,0,[
                                {
                                    offset:0,
                                    color:'#5052EE'
                                },
                                { offset:1,
                                color:'#AB6EE5'
                                }
                                ]
                        ),
                    title:{
                        show:true,
                        text:"商家信息",
                        textStyle:{
                            fontWeight:"bold",
                            fontStyle:"italic"
                        },
                        top:"20px",
                        left:"50px"
                    },
                }
            
        this.chartInstance.setOption(initOption)
        this.chartInstance.on("mouseover",()=>{
            clearInterval(this.timeId);
        })
        this.chartInstance.on("mouseout",()=>{
            this.startInterval()
        })
    },
     getChart(ret){
         this.allData=ret.sort((a,b)=>
             b.value-a.value
         );
         this.totalPages=Math.ceil(this.allData.length/5);
         this.updateChart()
         this.startInterval()
    },
    
    updateChart(){
            const start=(this.currentpage-1)*5;
            const end=this.currentpage*5

            const showdata=this.allData.slice(start,end)
            const sellerNames=showdata.map((item)=>{
                return item.name;
            })
            const sellerValues=showdata.map((item)=>{
                return item.value;
            })
                const option={
                    yAxis:{
                        data:sellerNames
                    },
                    series:[{
                        data:sellerValues,
                    }],
                }
                this.chartInstance.setOption(option);
                this.currentpage++;
                if(this.currentpage>3)this.currentpage=1
    },
    startInterval(){
        this.timeId=setInterval(this.updateChart,3000)
    }
},
created(){
this.$socket.registerCallBack('sellerData',this.getChart)
},
destroy(){
    clearInterval(this.timeId)
    window.removeEventListener("resize",this.screenApater);
    this.$socket.unregisterCallBack('sellerData')
}
}
</script>

<style lang="less" scoped>

</style>