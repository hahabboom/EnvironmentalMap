<template>
  <div class="main-body">
    <div class="select">
      <el-select v-model="value" multiple placeholder="请选择" @change="selesctBusiness">
        <el-option
            v-for="item in businessList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
        </el-option>
      </el-select>
    </div>
    <baidu-map :center="center" :zoom="zoom" @ready="handler" style="height:800px" :scroll-wheel-zoom='true'>
      <bm-map-type :map-types="['BMAP_NORMAL_MAP', 'BMAP_HYBRID_MAP']" anchor="BMAP_ANCHOR_TOP_LEFT"></bm-map-type>
      <bm-overview-map anchor="BMAP_ANCHOR_BOTTOM_RIGHT" :isOpen="true"></bm-overview-map>
      <bm-geolocation style="inset: auto 30px 180px auto;" anchor="BMAP_ANCHOR_BOTTOM_RIGHT" :showAddressBar="true" :autoLocation="true"></bm-geolocation>


      <div v-for="(item, i) in markList" v-bind:key="i">
        <bm-marker :position="item.position" :dragging="false" @click="lookDetail(item)">
        </bm-marker>
      </div>
      <bm-info-window	:position="position" :show="show" @close="infoWindowClose" @open="infoWindowOpen">
        <div>公司名称：{{detail.name}}</div>
        <div>公司经纬度：（{{detail.position.lng}}，{{ detail.position.lat }}） </div>
      </bm-info-window>
    </baidu-map>
  </div>
</template>

<script>
export default {
  name: 'mapContent',
  data() {
    return {
      mapJson: null,
      mainData: [],
      option: null,
      center: {lng: 104.079964, lat: 30.578283},
      zoom: 6,
      show: false,
      businessList: [
        {
          name: '第一家有限公司',
          label: '第一家有限公司',
          value: 'business1',
          position: {lng: 103.076083, lat: 30.477494}
        },
        {
          name: '第二家有限公司',
          label: '第二家有限公司',
          value: 'business2',
          position: {lng: 103.086083, lat: 30.477494}
        },
        {
          name: '第三家有限公司',
          label: '第三家有限公司',
          value: 'business3',
          position: {lng: 103.096083, lat: 30.577494}
        }],
      value: ['business1','business2','business3'],
      markList: [],
      detail: {
        name: null,
        position: {
          lng: null,
          lat: null
        }
      },
      position: {}
    }
  },
  props: {},
  watch: {},
  methods: {
    // getMapData () {
    //   this.$axios({
    //     url: '/province.json',
    //     method: 'get'
    //   }).then(({ data }) => {
    //     console.log(data)
    //     this.mapJson = data
    //     this.mapJson.features.forEach(item => {
    //       if (item.geometry.coordinates.forEach(i => { i === null })) { return }
    //       var sglProvinceProperties = item.properties
    //       var sglProvinceName = sglProvinceProperties.name
    //       switch (sglProvinceName) {
    //         case '内蒙古':
    //           sglProvinceProperties.cp = []
    //           sglProvinceProperties.cp[0] = 113.57351
    //           sglProvinceProperties.cp[1] = 43.04574
    //           break
    //         case '香港特别行政区市区':
    //           sglProvinceProperties.cp = []
    //           sglProvinceProperties.cp[0] = 115.29503
    //           sglProvinceProperties.cp[1] = 21.71835
    //           break
    //         case '澳门特别行政区市区':
    //           sglProvinceProperties.cp = []
    //           sglProvinceProperties.cp[0] = 113.91075
    //           sglProvinceProperties.cp[1] = 21.00213
    //           break
    //         case '河北省':
    //           sglProvinceProperties.cp = []
    //           sglProvinceProperties.cp[0] = 117.85463
    //           sglProvinceProperties.cp[1] = 39.36659
    //           break
    //         case '天津市':
    //           sglProvinceProperties.cp = []
    //           sglProvinceProperties.cp[0] = 118.66762
    //           sglProvinceProperties.cp[1] = 38.71517
    //           break
    //         case '甘肃省':
    //           sglProvinceProperties.cp = []
    //           sglProvinceProperties.cp[0] = 103.91298
    //           sglProvinceProperties.cp[1] = 36.27492
    //           break
    //         case '黑龙江省':
    //           sglProvinceProperties.cp = []
    //           sglProvinceProperties.cp[0] = 127.64345
    //           sglProvinceProperties.cp[1] = 47.66139
    //           break
    //       }
    //     })
    //     this.$echarts.registerMap(this.name, this.mapJson)
    //     this.setChart()
    //   })
    // },
    // setChart () {
    //   console.log(this.mapJson)
    //   for (let i = 0; i < this.mapJson.features.length; i++) {
    //     this.mainData.push({
    //       name: this.mapJson.features[i].properties.name,
    //       code: this.mapJson.features[i].properties.CODE
    //     })
    //   }
    //   console.log(this.mainData)
    //   this.option = {
    //     grid: [{
    //       // show: true,
    //       left: '1%',
    //       right: '1%',
    //       bottom: '1%',
    //       top: '1%',
    //       borderColor: 'red'
    //     }],
    //     xAxis: [],
    //     yAxis: [],
    //     visualMap: {
    //       left: 'right',
    //       pieces: [
    //         {
    //           value: 100,
    //           color: '#17FF84'
    //         },
    //         {
    //           gte: 86,
    //           lte: 99,
    //           color: '#F0FF4C'
    //         },
    //         {
    //           gte: 76,
    //           lte: 85,
    //           color: '#FFBB6A'
    //         },
    //         {
    //           gte: 0,
    //           lte: 75,
    //           color: '#FE4200'
    //         },
    //         {
    //           value: -1,
    //           color: '#F23AFC'
    //         },
    //         {
    //           lt: 0,
    //           color: '#0aafc8'
    //         }
    //       ],
    //       type: 'piecewise',
    //       min: -1,
    //       max: 100,
    //       show: false,
    //       inRange: {
    //         color: ['#0E94BA', '#ffffff']
    //       },
    //       text: ['High', 'Low'],
    //       calculable: true
    //     },
    //     color: ['RGBA(2, 201, 142, 0.8)', 'RGBA(251, 231, 0, 0.8)', 'RGBA(235, 105, 11, 0.8)', 'RGBA(19, 145, 255, 0.8)', 'RGBA(19, 145, 255, 0.8)'],
    //     geo: {
    //       map: this.mapName,
    //       zoom: 1,
    //       roam: true,
    //       aspectScale: 1,
    //       layoutSize: '100%',
    //       layoutCenter: ['50%', '55%'],
    //       label: {
    //         normal: {
    //           show: true,
    //           textStyle: {
    //             color: 'rgba(255, 255, 255, 0.3)'
    //           }
    //         },
    //         emphasis: {
    //           show: false,
    //           color: '#ABCFFF',
    //           fontSize: 12,
    //           fontFamily: 'Microsoft YaHei',
    //           fontWeight: 300
    //         }
    //       },
    //       regions: [
    //         {
    //           name: '南海诸岛',
    //           value: 0,
    //           itemStyle: {
    //             normal: {
    //               opacity: 0
    //             }
    //           },
    //           label: {
    //             normal: {
    //               show: false
    //             }
    //           }
    //         }
    //       ],
    //       itemStyle: {
    //         normal: {
    //           borderColor: '#031525',
    //           borderWidth: 1.5,
    //           areaColor: {
    //             type: 'radial',
    //             x: 0.5,
    //             y: 0.5,
    //             r: 4.5,
    //             colorStops: [{
    //               offset: 0,
    //               color: '#5E9281' // 0% 处的颜色
    //             }, {
    //               offset: 1,
    //               color: '#5E9281' // 50% 处的颜色
    //             }]
    //           }
    //         },
    //         emphasis: {
    //           show: false,
    //           areaColor: '#37b4b6'
    //         }
    //       },
    //       zlevel: 3
    //     },
    //     legend: {
    //       show: true,
    //       orient: 'vertical',
    //       data: ['100分', '86~99分', '76~85分', '低于75分', '无数据'],
    //       left: 'left',
    //       animation: false,
    //       bottom: '10%',
    //       itemHeight: 20,
    //       itemWidth: 30,
    //       itemGap: 15,
    //       textStyle: {
    //         color: 'rgba(201,236,255,1)',
    //         fontSize: 16,
    //         fontFamily: 'Microsoft YaHei',
    //         fontWeight: 300
    //       },
    //       icon: 'rect'
    //     },
    //     tooltip: {
    //       show: true,
    //       backgroundColor: 'none',
    //       padding: 0,
    //       position: 'top',
    //       trigger: 'item',
    //       textStyle: {
    //         fontSize: 12,
    //         fontFamily: 'Microsoft YaHei',
    //         fontWeight: 'bold',
    //         color: '#FFFFFF'
    //       },
    //       formatter: function (params) {
    //         if (params.seriesType === 'scatter') {
    //           const inner = `<div>${params.data.name}</div><div style="color: #F0FF4C">${(params.data.value[2] !== -1 ? params.data.value[2] + '分' : '无数据')}</div>`
    //           const url = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEIAAAAtCAMAAAAtKE1VAAAAQlBMVEUAAAAAAAAAAFUAAGYAAFUAFGIAJ2ILIGoOImcJIWgLI2oKI2kOI2kLImkMImkNJGkNImkNImgNJGgNJGkMImkOJGqnWx+NAAAAFnRSTlMAAQMFBg0NGCU2SElJWmhyd3h4en6ATSU6SQAAAG5JREFUSMft1jkOgDAQQ1ETtjBsgeD7X5UCIUQDUtzOr61XG8EShZIFGMUMu0rsoJwTTjjhhBNOOOHEm5AvStKP0ohgmwJsFvDR9CwnlFXNtzBXhQTq5RKWBsW1K0muHYT6TOYeUvE4IsSG4W9xAkzB0G4hySqtAAAAAElFTkSuQmCC'
    //           const bg = `<div style='min-width:75px; min-height:50px;text-align: center;background:url("${url}");background-repeat: no-repeat;-webkit-background-size: 100% 100%;background-size: 100% 100%;background-position: center'>${inner}</div>`
    //           return bg
    //         }
    //       }
    //     },
    //     series: [
    //       {
    //         type: 'map',
    //         map: this.mapName,
    //         aspectScale: 1,
    //         layoutSize: '95%',
    //         layoutCenter: ['50%', '48%'],
    //         geoIndex: 0,
    //         tooltip: {
    //           show: false
    //         },
    //         data: this.regionData,
    //         label: {
    //           emphasis: {
    //             show: false,
    //             color: '#fff'
    //           }
    //         },
    //         zoom: 1,
    //         roam: false,
    //         itemStyle: {
    //           normal: {
    //             borderColor: '#00FEFF',
    //             borderWidth: 0,
    //             areaColor: {
    //               type: 'radial',
    //               x: 0.5,
    //               y: 0.5,
    //               r: 3,
    //               colorStops: [{
    //                 offset: 0,
    //                 color: '#69c5d8' // 0% 处的颜色
    //               }, {
    //                 offset: 1,
    //                 color: '#11347C' // 50% 处的颜色
    //               }],
    //               global: true // 缺省为 false
    //             },
    //             opacity: 1
    //           },
    //           emphasis: {
    //             show: false,
    //             areaColor: '#11347C'
    //           }
    //         }
    //       },
    //       {
    //         type: 'scatter',
    //         coordinateSystem: 'geo',
    //         symbolSize: 8,
    //         itemStyle: {
    //           // color: '#ffffff',
    //           // borderColor: '#E8FB55',
    //           // borderWidth: 2,
    //           // shadowColor: '#E8FB55',
    //           // shadowBlur: 8
    //         },
    //         zlevel: 4,
    //         data: null
    //       }
    //     ]
    //   }
    //   this.myChart = this.$echarts.init(document.getElementById('map'))
    //   this.myChart.setOption(this.option)
    // },
    handler ({BMap, map}) {
      var point = new BMap.Point(104.079964, 30.578283)
      map.centerAndZoom(point, 6)
    },
    infoWindowClose () {
      this.show = false
    },
    infoWindowOpen () {
      this.show = true
    },
    lookDetail (item) {
      this.detail = item
      this.position = item.position
      this.show = true
    },
    selesctBusiness (v) {
      this.$nextTick(() => {
        this.markList = this.businessList.filter((item) => {
          return item.value === v[0]
        })
      })
    },
  },
  computed: {},
  created() {
  },
  mounted() {
    this.markList = this.businessList
  }
}
</script>

<style scoped>
.main-body{
  width: 100%;
  height: 100%;
  background-color: seashell;
  padding-top: 10px;
}
.select{
  position: absolute;
  right: 30px;
  z-index: 3;
}
#map{
  width: 100%;
  height: 100%;
}
</style>
