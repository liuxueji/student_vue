<template>
  <div>
    <el-row>
      <el-col :span="24">
        <el-card>
          <div slot="header"
               class="clearfix">
            <span>填写假条</span>
          </div>
          <el-select v-model="value"
                     placeholder="请选择请假类型">
            <el-option v-for="item in options"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value">
            </el-option>
          </el-select>
          <div style="height:20px"></div>
          <el-date-picker v-model="leaveDate"
                          type="daterange"
                          align="right"
                          unlink-panels
                          range-separator="至"
                          start-placeholder="开始日期"
                          end-placeholder="结束日期">
          </el-date-picker>
          <div style="height:20px"></div>
          <el-input type="textarea"
                    placeholder="请输入内容"
                    v-model="leaveReason"
                    maxlength="100"
                    show-word-limit>
          </el-input>
          <div style="height:20px"></div>
          <div style="float: right">
            <el-button type="primary"
                       @click="onapplication">提交</el-button>
            <div style="height:20px"></div>
          </div>
        </el-card>
        <el-divider><i class="el-icon-loading"></i></el-divider>
        <el-card>
          <h1>我的假条</h1>
          <el-table :data="tableData"
                    border>
            <el-table-column sortable
                             label="申请时间">
              <template slot-scope="scope">
                {{scope.row.createtime | timeFilter}}
              </template>
            </el-table-column>
            <el-table-column prop="leavetype"
                             label="类型">
            </el-table-column>
            <el-table-column prop="reason"
                             label="请假理由">
            </el-table-column>
            <el-table-column label="审核结果">
              <template slot-scope="scope">
                {{scope.row.state | stateFilter}}
              </template>
            </el-table-column>
          </el-table>
          <!-- 分页区域 -->
          <el-pagination @size-change="handleSizeChange"
                         @current-change="handleCurrentChange"
                         :current-page="currPage"
                         :page-sizes="[3, 5, 10, 15]"
                         :page-size="pageNum"
                         layout="total, sizes, prev, pager, next, jumper"
                         :total="total">
          </el-pagination>
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
      token: '',
      options: [{
        value: '病假',
        label: '病假'
      }, {
        value: '事假',
        label: '事假'
      }],
      value: '',
      leaveDate: '',
      leaveReason: '',
      tableData: [],
      pageNum: 5,
      currPage: 1,
      total: 0
    }
  },
  created () {
    this.token = window.sessionStorage.getItem('token')
    this.getLeaveReason()
  },
  methods: {
    onapplication () {
      // console.log(this.leaveDate[0]) // Fri Apr 08 2022 00:00:00 GMT+0800 (中国标准时间)
      const startTime = dayjs(this.leaveDate[0]).format()
      // console.log(startTime)// 2022-04-08T00:00:00+08:00
      const arrStart = startTime.split('T')// (2)['2022-04-08', '00:00:00+08:00']
      const endTime = dayjs(this.leaveDate[1]).format()
      const arrEnd = endTime.split('T')
      this.$http.post('student/setLeave', { token: this.token, reason: this.leaveReason, leavetype: this.value, starttime: arrStart[0], endtime: arrEnd[0] })
      console.log(this.token, this.leaveReason, this.value, arrStart[0], arrEnd[0])
      this.$message.success('请假已发送')
      this.value = ''
      this.leaveDate = ''
      this.leaveReason = ''
      this.getLeaveReason()
    },
    async getLeaveReason () {
      const { data: res } = await this.$http.get('admin/getuserLeave', { params: { token: this.token, currPage: this.currPage - 1, pageNum: this.pageNum } })
      this.tableData = res.data
      this.total = res.total
      console.log(res)
    },
    // 监听 pagesize 改变
    handleSizeChange (newSize) {
      this.pageNum = newSize
      this.getLeaveReason()
    },
    // 监听 pagenum 改变
    handleCurrentChange (newPage) {
      this.currPage = newPage
      this.getLeaveReason()
    }
  },
  filters: {
    stateFilter (state) {
      if (state === 0) { return '未审批' }
      if (state === 1) { return '审批通过' }
      if (state === 2) { return '审批不通过' }
    },
    timeFilter (time) {
      time = dayjs(time).format('YYYY-MM-DD')
      return time
    }
  }
}
</script>

<style>
</style>
