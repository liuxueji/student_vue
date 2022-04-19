<template>
  <div>
    <el-col>
      <el-card>
        <el-input placeholder="请输入标题"
                  prefix-icon="el-icon-search"
                  v-model="input"
                  style="width:20%">
        </el-input>
        <el-button type="primary"
                   size="small"
                   style="margin-left:20px"
                   @click="select">搜索</el-button>
        <el-button type="success"
                   size="small"
                   style="margin-left:1050px"
                   @click="sendNoticeDialogVisible = true">发布通知</el-button>
      </el-card>
      <el-card>
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
                   @click="editNoticeBtn">修改</el-button>
      </span>
    </el-dialog>
    <!-- 发布通知的对话框 -->
    <el-dialog title="发布通知"
               :visible.sync="sendNoticeDialogVisible"
               width="50%"
               @close="sendNoticeDialogClosed">
      <el-form ref="sendNoticeFormRef"
               label-width="100px">
        <el-form-item label="标题">
          <el-input v-model="sendNoticeForm.title"></el-input>
        </el-form-item>
        <el-form-item label="内容">
          <el-input type="textarea"
                    v-model="sendNoticeForm.content"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="sendNoticeDialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="sendNoticeBtn">发布</el-button>
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
      tableData: [],
      input: '',
      currPage: 1,
      type: 3,
      selectType: 3,
      total: 0,
      editForm: [],
      // 控制修改对话框的显示与隐藏
      editDialogVisible: false,
      sendNoticeDialogVisible: false,
      sendNoticeForm: [{ title: '' }, { content: '' }],
      editNoticeForm: [],
      editNoticeDialogVisible: false
    }
  },
  created () {
    this.getNoticeData()
  },
  methods: {
    // 获取通知信息
    async getNoticeData () {
      const { data: res } = await this.$http.post('admin/getAllNotice', { pageNum: this.pageNum, currPage: this.currPage - 1 })
      this.tableData = res.data
      this.total = res.total
      console.log(res)
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
    // 编辑按钮
    showEditDialog (index, row) {
      this.editNoticeForm = row
      this.editNoticeDialogVisible = true
    },
    // 重置修改的表单
    editNoticeDialogClosed () {
      this.$refs.editNoticeFormRef.resetFields()
    },

    // 重置发布通知的表单
    sendNoticeDialogClosed () {
      this.$refs.sendNoticeFormRef.resetFields()
    },
    // 点击按钮，修改参数信息
    async editBtn () {
      await this.$http.post('users/upUserdata', { u_id: this.editForm.id, username: this.editForm.username, email: this.editForm.email, address: this.editForm.address, type: this.editForm.type, sex: this.editForm.sex })
      this.$message.success('修改数据成功！')
      this.editDialogVisible = false
      this.getTableData(this.pageNum, this.currPage - 1, this.selectType)
      console.log(this.editForm.id, this.editForm.username, this.editForm.email, this.editForm.address, this.editForm.type, this.editForm.sex)
    },
    // 点击按钮，编辑要发布的通知
    async sendNoticeBtn () {
      await this.$http.post('admin/announce', { u_id: 1, title: this.sendNoticeForm.title, content: this.sendNoticeForm.content })
      this.$message.success('修改数据成功！')
      this.sendNoticeDialogVisible = false
      this.getNoticeData()
    },
    // 点击按钮，修改通知
    async editNoticeBtn () {
      await this.$http.post('admin/announce', { u_id: 1, title: this.editNoticeForm.title, content: this.editNoticeForm.content })
      this.$message.success('修改数据成功！')
      this.editNoticeDialogVisible = false
      this.getNoticeData()
    }
  }
}
</script>

<style>
</style>
