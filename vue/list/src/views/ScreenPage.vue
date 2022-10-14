<template>
  <div class="screen-container">
      <header class="screen-header">
          <div class="screen-header-left"></div>
          <div class="screen-header-center">
              <h1 class="text">商家商品信息</h1>
          </div>
          <div class="screen-header-right">
              <h2 class="text">{{times}}</h2>
          </div>
      </header>
    <main class="screen-main">
        <div class="mainLeft total">
        <div class="HotPage Page icon "
        :class="{
            'fullScreen':fullScreen.Hot}"
            >
            <Hot ref="Hot"/>
            <div class="res" @click="change('Hot')">
                <span class="iconfont icon-suofang-youxiang"></span>
            </div>
        </div>
        <div class="RankPage Page icon"
                :class="{
            'fullScreen':fullScreen.Rank}"
        >
            <Rank ref="Rank"/>
            <div class="res" @click="change('Rank')">
                <span class="iconfont icon-suofang-youxiang"></span>
            </div>
        </div>
        </div>
        <div class="mainCenter total">
        <div class="MapPage icon"
                :class="{
            'fullScreen':fullScreen.Map}">
            <Map ref="Map"/>
                <div class="res" @click="change('Map')">
                <span class="iconfont icon-suofang-youxiang"></span>
            </div>
        </div>
        <div class="SellerPage icon"
                :class="{
            'fullScreen':fullScreen.Seller}">
            <Seller ref="Seller"/>
                        <div class="res" @click="change('Seller')">
                <span class="iconfont icon-suofang-youxiang"></span>
            </div>
        </div>
        </div>
        <div class="mainRight total">
        <div class="StockPage Page icon"
                :class="{
            'fullScreen':fullScreen.Stock}">
            <Stock ref="Stock"/>
                        <div class="res" @click="change('Stock')">
                <span class="iconfont icon-suofang-youxiang"></span>
            </div>
        </div>
        <div class="TrendPage Page icon"
                :class="{
            'fullScreen':fullScreen.Trend}">
            <Trend ref="Trend"/>
                        <div class="res" @click="change('Trend')">
                <span class="iconfont icon-suofang-youxiang"></span>
            </div>
        </div>
        </div>
    </main>
  </div>
</template>

<script>
import Hot from "@/components/Hot.vue"
import Map from '@/components/map.vue'
import Rank from '@/components/Rank.vue'
import Seller from '@/components/Seller.vue'
import Stock from '@/components/Stock.vue'
import Trend from '@/components/Trend.vue'
export default { 
name:"screen",
components:{
    Hot,
    Map,
    Rank,
    Seller,
    Stock,
    Trend
},
data(){
    return{
         times:null,
         fullScreen:{
             Hot:false,
             Trend:false,
             Map:false,
             Rank:false,
             Stock:false,
             Seller:false,
         }
    }
   
},
mounted(){
this.doitself();
},
created(){
    this.$socket.registerCallBack('fullScreen',this.recvData)
},
destroy(){
    this.$socket.unregisterCallBack('fullScreen')
},
methods:{
 doitself(){
    setInterval(()=>{
        this.times=new Date().toLocaleString();
    },1000)
    },
    change(res){
    const targetValue=this.fullScreen[res];
    this.$socket.send({
        action:'fullScreen',
        socketType:"fullScreen",
        chartName:res,
        value:!targetValue,
    })
},
recvData(res){
    const msg=res.chartName;
    const targetValue=res.value;
    this.fullScreen[msg]=targetValue
    this.$nextTick(()=>{
        this.$refs[msg].screenApater()
    });
}
}

}
</script>

<style lang="less" scoped>
.screen-container{
    width: 100%;
    height: 100%;
    background-color:rgb(22, 21, 35);
    .screen-header{
        width: 100%;
        height:8%;
        display: flex;
        justify-content:space-between;
        text-align:center;
        .text{
            color:white
        }
        .screen-header-left{
            width:25%;
        }
        .screen-header-center{
            width:50%;
        }
        .screen-header-right{
            width:25%;
        }
    } 
    .screen-main{
        width:98%;
        margin:0 auto;
        height:92%;
        display: flex;
        .mainLeft{
        width:25%;
        
    }
    .mainCenter{
        width:50%;
        div{
            margin:0 auto;
            width:98%;
        }
        .MapPage{
            height:75%
        }
        .SellerPage{
            height:20%
        }
    }
    .mainRight{
        width:25%;
    }
    .total{
        display: flex;
        flex-direction:column;
        justify-content:space-around;
    }
    .Page{
        margin:0 auto;
        width:100%;
        height:48%;
    }
    .icon{
         position: relative;
        .icon-suofang-youxiang{
            cursor: pointer;
            position:absolute;
            top:3%;
            right:3%;
            color:white;
        }
    }
    }

}
.fullScreen{
    position:fixed !important;
    top:0!important;
    left:0!important;
    width:100%!important;
    height:100%!important;
    margin:0!important;
    z-index:100;
}
</style>