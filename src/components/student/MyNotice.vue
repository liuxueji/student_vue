<template>
  <div>
    <el-col>
      <el-card>
        <h1>我的通知</h1>
        <el-table :data="tableData"
                  border>
          <el-table-column prop="n_id"
                           sortable
                           label="序列号">
          </el-table-column>
          <el-table-column prop="title"
                           label="标题">
          </el-table-column>
          <el-table-column prop="createtime"
                           label="创建时间">
          </el-table-column>
          <el-table-column prop="type"
                           label="状态">
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button style="padding: 3px 0"
                         type="text"
                         @click="deleteBtn(scope.$index, scope.row)">删除</el-button>
              <el-button style="padding: 3px 0"
                         type="text"
                         @click="showEditDialog(scope.$index, scope.row)">查看</el-button>
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
    <!-- 查看数据的对话框 -->
    <el-dialog title="查看数据"
               :visible.sync="editNoticeDialogVisible"
               width="50%"
               @close="editNoticeDialogClosed">
      <el-form ref="editNoticeFormRef"
               label-width="100px">
        <el-form-item label="标题">
          <el-input v-model="editNoticeForm.title"></el-input>
        </el-form-item>
        <el-form-item label="内容">
          <el-input type="textarea"
                    v-model="editNoticeForm.content"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="editNoticeDialogVisible = false">关闭</el-button>
        <el-button type="primary"
                   @click="editNoticeBtn">标为未读</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      value: '姓名',
      pageNum: 5,
      currPage: 1,
      tableData: [],
      input: '',
      type: 3,
      selectType: 3,
      total: 0,
      editForm: [],
      // 控制修改对话框的显示与隐藏
      editDialogVisible: false,
      editNoticeForm: [],
      editNoticeDialogVisible: false,
      token: ''
    }
  },
  created () {
    this.token = window.sessionStorage.getItem('token')
    console.log(this.token)
    this.getNoticeData()
    this.getNoticeDataRead()
  },
  methods: {
    // 获取通知信息
    async getNoticeData () {
      const { data: res } = await this.$http.get('student/getNotice', { params: { token: this.token, pageNum: this.pageNum, currPage: this.currPage - 1 } })
      res.data.forEach((value, index) => {
        value.type = '未读'
      })
      this.tableData = res.data
      this.total = res.total
      console.log(res)
      this.getNoticeDataRead()
    },
    async getNoticeDataRead () {
      const { data: res } = await this.$http.get('student/getNoticeRead', { params: { token: this.token } })
      // 获取该学生的所有通知
      res.forEach((item, index) => {
        // let n_id = item.n_id
        console.log(item.n_id)
        // 获取每个通知是否在阅读表中存在，如果在就是已读，不在就是未读
        this.tableData.forEach(element => {
          if (item.n_id === element.n_id) {
            element.type = '已读'
          }
        })
      })
      console.log(this.tableData)
    },
    // 搜索
    async select () {
      if (!this.input) {
        this.$message.error('请输入要搜索的内容')
      } else {
        console.log('该功能待完善')
      }
    },
    // 重置
    clearvalue () {
      this.getTableData(this.pageNum, this.currPage - 1, this.type)
      this.input = ''
    },
    // 监听 pagesize 改变
    handleSizeChange (newSize) {
      this.pageNum = newSize
      this.getTableData(this.pageNum, this.currPage - 1, this.selectType)
    },
    // 监听 pagenum 改变
    handleCurrentChange (newPage) {
      this.currPage = newPage
      this.getTableData(this.pageNum, this.currPage - 1, this.selectType)
    },
    // 根据id删除数据
    async deleteById (index, row) {
      await this.$http.get('admin/delNotice', { params: { n_id: row.n_id } })
      this.getNoticeData()
    },
    // 根据id编辑数据
    editById (index, row) {

    },
    // 删除按钮
    deleteBtn (index, row) {
      console.log(index, row)
      this.$confirm('此操作将继续, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteById(index, row)
        this.$message.success('删除成功！')
      }).catch(() => {
        this.$message.info('已取消删除！')
      })
    },
    // 编辑按钮，并将未读转为已读
    async showEditDialog (index, row) {
      this.editNoticeForm = row
      await this.$http.get('student/goyidu', { params: { token: this.token, n_id: this.editNoticeForm.n_id } })
      this.getNoticeData()

      this.editNoticeDialogVisible = true
    },
    // 重置修改的表单
    editNoticeDialogClosed () {
      this.$refs.editNoticeFormRef.resetFields()
    },

    // 点击按钮，修改参数信息
    async editBtn () {
      await this.$http.post('users/upUserdata', { u_id: this.editForm.id, username: this.editForm.username, email: this.editForm.email, address: this.editForm.address, type: this.editForm.type, sex: this.editForm.sex })
      this.$message.success('修改数据成功！')
      this.editDialogVisible = false
      this.getTableData(this.pageNum, this.currPage - 1, this.selectType)
      console.log(this.editForm.id, this.editForm.username, this.editForm.email, this.editForm.address, this.editForm.type, this.editForm.sex)
    },
    // 点击按钮，修改通知
    async editNoticeBtn () {
      await this.$http.get('student/goweidu', { params: { token: this.token, n_id: this.editNoticeForm.n_id } })
      this.$message.success('修改数据成功！')
      this.editNoticeDialogVisible = false
      this.getNoticeData()
    }
  }
}
</script>

<style>
</style>
