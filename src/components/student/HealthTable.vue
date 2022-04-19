<template>
  <div>
    <el-row>
      <el-col>
        <el-card>
          <h1>个人健康信息</h1>
          <el-table :data="healthData"
                    border>
            <el-table-column prop="u_id"
                             label="学号">
            </el-table-column>
            <el-table-column label="上报时间">
              <template slot-scope="scope">
                {{scope.row.createtime|timeFilter}}
              </template>
            </el-table-column>
            <el-table-column prop="temperature"
                             label="体温">
            </el-table-column>
            <el-table-column prop="warning"
                             label="是否去过中/高风险地区">
            </el-table-column>
          </el-table>
        </el-card>
        <el-divider></el-divider>
        <el-card>
          <el-form ref="form"
                   label-width="200px">
            <el-form-item label="当前体温:">
              <el-input v-model="healthForm.temperature"
                        style="width:130px"></el-input>
            </el-form-item>
            <el-form-item label="是否去过中高风险地区:">
              <el-input v-model="healthForm.warning"
                        style="width:130px"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary"
                         @click="healthFormBtn">提交</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import dayjs from 'dayjs'
export default {
  data () {
    return {
      healthForm: [
        { temperature: 0 },
        { warning: '有' }
      ],
      healthData: [],
      token: ''
    }
  },
  created () {
    this.token = window.sessionStorage.getItem('token')
    this.gethealthData()
  },
  methods: {
    async gethealthData () {
      const { data: res } = await this.$http.get('student/getHealthNowDayByid', { params: { token: this.token } })
      this.healthData = res
      console.log(res)
    },
    async healthFormBtn () {
      if (this.healthData) {
        return this.$message.info('今日健康信息表已经填写！！！')
      }
      await this.$http.post('student/sethealth', { token: this.token, temperature: this.healthForm.temperature, warning: this.healthForm.warning })
      this.$message.success('提交成功！')
      this.healthForm.temperature = ''
      this.healthForm.warning = ''
    }
  },
  filters: {
    timeFilter (time) {
      time = dayjs(time).format('YYYY-MM-DD')
      return time
    }
  }
}
</script>

<style>
</style>
