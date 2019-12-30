<template>
  <div class="report">
    <x-breadcrumbs>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </x-breadcrumbs>

    <el-card>
      <div id="main" style="width:700px; height:400px;"></div>
    </el-card>
  </div>
</template>

<script>
// 1.导入echarts
import echarts from 'echarts'
import _ from 'lodash'

export default {
  name: 'Report',
  data() {
    return {
      // 需要合并的数据
      options: {
        title: {
          text: '实例'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      }
    }
  },
  methods: {

  },
  async mounted() {
    // 3.初始化
    var myChart = echarts.init(document.getElementById('main'))

    const { data: res } = await this.$http.get('reports/type/1')
    if (res.meta.status !== 200) {
      return this.$message.error('获取折线图数据失败')
    }
    console.log(res.data)

    // 4.准备数据和配置项
    /* var option = {
      title: {
        text: '实例'
      },
      tooltip: {},
      legend: {
        data: ['销量']
      },
      xAxis: {
        data: ['1', '2', '3', '4']
      },
      yAxis: {},
      series: [
        {
          name: '销量',
          type: 'bar',
          data: [3, 4, 6, 9]
        }
      ]
    } */
    const result = _.merge(res.data, this.options)
    console.log(result)

    // 5.展示数据
    myChart.setOption(result)
  }
}
</script>

<style lang="less" scoped>
</style>
