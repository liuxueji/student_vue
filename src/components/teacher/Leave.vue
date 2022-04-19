<template>
  <div>
    <el-row>
      <el-col>
        <el-card>
          <div>
            <span>请假审批</span>
          </div>
          <el-table :data="tableData"
                    border
                    style="width:100%">
            <el-table-column label="申请时间">
              <template slot-scope="scope">{{ scope.row.createtime | timeFilter}}</template>
            </el-table-column>
            <el-table-column prop="u_id"
                             label="申请人">
              <!--<template slot-scope="scope">{{ scope.row.u_id | username}}</template>-->
            </el-table-column>
            <el-table-column prop="leavetype"
                             label="类型">
            </el-table-column>
            <el-table-column prop="reason"
                             label="详细信息">
            </el-table-column>
            <el-table-column prop="state"
                             label="审核结果">
              <template slot-scope="scope">{{ scope.row.state | stateFilter}}</template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button style="padding: 3px 0"
                           type="text"
                           @click="isOk(scope.row)">同意</el-button>
                <el-button style="padding: 3px 0"
                           type="text"
                           @click="isNoOk(scope.$index, scope.row)">拒绝</el-button>
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
      tableData: [],
      currPage: 1,
      pageNum: 5,
      total: 2
    }
  },
  created () {
    this.getLeaveData()
  },
  methods: {
    async getLeaveData () {
      const { data: res } = await this.$http.get('admin/getLeave', { params: { pageNum: this.pageNum, currPage: this.currPage - 1 } })
      this.tableData = res.data
      this.total = res.total
      console.log(this.tableData)
    },
    // 同意审批
    async isOk (row) {
      await this.$http.get('admin/upLeaveState', { params: { l_id: row.l_id, upState: 1 } })
      this.getLeaveData()
    },
    // 拒绝审批
    async isNoOk (index, row) {
      await this.$http.get('admin/upLeaveState', { params: { l_id: row.l_id, upState: 2 } })
      this.getLeaveData()
    },
    // 监听 pagesize 改变
    handleSizeChange (newSize) {
      this.pageNum = newSize
      this.getLeaveData()
    },
    // 监听 pagenum 改变
    handleCurrentChange (newPage) {
      this.currPage = newPage
      this.getLeaveData()
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
