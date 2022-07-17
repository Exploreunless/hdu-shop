<template>
  <div>
    <!-- value绑定的是对象，当改变值的可以取item的值，这时候必须制定value-key的值，标识选择框中显示的字段名称 -->
    <el-select v-model="selectedData.province" placeholder="请选择" @change="isChange(selectedData.province,'province')" >
      <el-option v-for="(item, index) in data.provinceData" :key="index" :label="item.name" :value="item.name"></el-option>
    </el-select>&nbsp;&nbsp;
    <el-select v-model="selectedData.city" placeholder="请选择" @change="isChange(selectedData.city,'city')" >
      <el-option v-for="(item, index) in data.cityData" :key="index" :label="item.name" :value="item.name"></el-option>
    </el-select>&nbsp;&nbsp;
    <el-select v-model="selectedData.country" placeholder="请选择" @change="isChange(selectedData.country,'country')" >
      <el-option v-for="(item, index) in data.countryData" :key="index" :label="item.name" :value="item.name"></el-option>
    </el-select>&nbsp;&nbsp;
  </div>
</template>

<script>
import { onMounted, reactive, toRefs } from 'vue'
import axios from 'axios'
export default {
  props:{
    province:{
      default: '',
      type: String
    },
    city:{
      default: '',
      type: String
    },
    country:{
      default: '',
      type: String
    }
  },
  setup (props, {emit}) {
    const url = 'https://yjy-oss-files.oss-cn-zhangjiakou.aliyuncs.com/tuxian/area.json'
    const {province, city, country} = toRefs(props)
    const selectedData = reactive({
      province: province.value,
      city: city.value,
      country:country.value
    })
    const data = reactive({
      provinceData: [],
      cityData: [],
      countryData: []
    })
    const getCityData = ()=>{
      axios({url}).then((response)=>{
        data.provinceData = response.data
      })
    }
    const searchProvince = (province)=>{
      return data.provinceData.find((item)=>{
        return item.name === province
      })
    }

    const searchCity = (city)=>{
      return data.cityData.find((item)=>{
        return item.name === city
      })
    }


    const isChange = (value, type)=>{
      if(type=="province"){
        data.cityData = searchProvince(value).areaList  // 市下拉列表
        data.countryData = []  // 清空区县下拉列表数据
        selectedData.city = '' // 清空市输入框内容
        selectedData.country = ''  // 清空区县输入框内容
        selectedData.province = value
      }else if(type=="city"){
        data.countryData = searchCity(value).areaList // 县区下拉框列表
        selectedData.country = ''  // 清空区县输入框内容
        selectedData.city = value
      }else if(type=="country"){
        selectedData.country = value
      }
      emit('pickerChanged', selectedData)
    }

    onMounted( ()=>{
      getCityData()
    })
    return {
      selectedData,
      data,
      isChange
    }
  }
}
</script>

<style lang="less" scoped>
  .el-select{
    width: 30%;
  }
</style>
