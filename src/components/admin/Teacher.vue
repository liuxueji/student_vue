<template>
  <div>
    <el-col>
      <el-card>
        <el-select v-model="value"
                   placeholder="请选择查询字段"
                   style="width: 15%">
          <el-option label="工号"
                     value="id"></el-option>
          <el-option label="姓名"
                     value="username"></el-option>
          <el-option label="籍贯"
                     value="address"></el-option>
        </el-select>
        <el-input placeholder="请输入内容"
                  prefix-icon="el-icon-search"
                  v-model="input"
                  style="width:20%">
        </el-input>
        <el-select v-model="selectType"
                   placeholder="请选择查询身份"
                   style="width: 8%">
          <el-option label="管理员"
                     value="1"></el-option>
          <el-option label="教师"
                     value="2"></el-option>
          <el-option label="学生"
                     value="3"></el-option>
        </el-select>
        <el-button type="primary"
                   size="small"
                   style="margin-left:10px"
                   @click="select">搜索</el-button>
        <el-button type="primary"
                   size="small"
                   style="margin-left:10px"
                   @click="clearvalue">重置</el-button>
      </el-card>
      <el-card>
        <el-table :data="tableData"
                  border>
          <el-table-column prop="id"
                           sortable
                           label="工号">
          </el-table-column>
          <el-table-column prop="username"
                           label="姓名">
          </el-table-column>
          <el-table-column prop="sex"
                           label="性别">
          </el-table-column>
          <el-table-column prop="address"
                           label="籍贯">
          </el-table-column>
          <el-table-column label="类型">
            教师
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button style="padding: 3px 0"
                         type="text"
                         @click="deleteBtn(scope.$index, scope.row)">删除</el-button>
              <el-button style="padding: 3px 0"
                         type="text"
                         @click="showEditDialog(scope.$index, scope.row)">编辑</el-button>
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
    <!-- 修改数据的对话框 -->
    <el-dialog title="修改数据"
               :visible.sync="editDialogVisible"
               width="50%"
               @close="editDialogClosed">
      <!-- 添加参数的对话框 -->
      <el-form :model="editForm"
               ref="editFormRef"
               label-width="100px">
        <el-form-item label="用户名">
          <el-input v-model="editForm.username"></el-input>
        </el-form-item>
        <el-form-item label="身份">
          <el-input v-model="editForm.type"></el-input>
        </el-form-item>
        <el-form-item label="地址">
          <el-input v-model="editForm.address"></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-input v-model="editForm.sex"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="editBtn">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      value: '姓名',
      tableData: [],
      input: '',
      pageNum: 5,
      currPage: 1,
      type: 2,
      selectType: 2,
      total: 0,
      editForm: [],
      // 控制修改对话框的显示与隐藏
      editDialogVisible: false
    }
  },
  created () {
    this.getTableData(this.pageNum, this.currPage - 1, this.type)
  },
  methods: {
    // 获取列表信息
    async getTableData (pageNum, currPage, type) {
      const { data: res } = await this.$http.get('users/getUsersByTypePage', { params: { pageNum, currPage, type } })
      this.tableData = res.data
      this.total = res.total
    },
    // 搜索
    async select () {
      if (!this.input) {
        this.$message.error('请输入要搜索的内容')
      } else {
        const { data: res } = await this.$http.get('admin/getUsersByTypeAndChar', { params: { type: this.selectType, CharType: this.value, inputText: this.input, pageNum: this.pageNum, currPage: this.currPage - 1 } })
        this.tableData = res.data
        console.log(res)
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
      await this.$http.get('users/delUserdata', { params: { u_id: row.id } })
      this.getTableData(this.pageNum, this.currPage - 1, this.selectType)
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
    async showEditDialog (index, row) {
      // 根据id获取用户信息
      const { data: res } = await this.$http.get('admin/getUserById', { params: { id: row.id } })
      this.editForm = res[0]
      this.editDialogVisible = true
    },
    // 重置修改的表单
    editDialogClosed () {
      this.$refs.editFormRef.resetFields()
    },
    // 点击按钮，修改参数信息
    async editBtn () {
      await this.$http.post('users/upUserdata', { u_id: this.editForm.id, username: this.editForm.username, email: this.editForm.email, address: this.editForm.address, type: this.editForm.type, sex: this.editForm.sex })
      this.$message.success('修改数据成功！')
      this.editDialogVisible = false
      this.getTableData(this.pageNum, this.currPage - 1, this.selectType)
      console.log(this.editForm.id, this.editForm.username, this.editForm.email, this.editForm.address, this.editForm.type, this.editForm.sex)
    }
  }
}
</script>

<style>
</style>
