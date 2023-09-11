<template>
  <div class="app-container">
    <el-button type="primary" @click="handleAdd()">添加用户</el-button>
    <div class="table-container">
      <el-table ref="userTable"
                :data="list"
                style="width: 100%;"
                v-loading="listLoading" border>
        <el-table-column label="用户名" align="center">
          <template slot-scope="scope">{{ scope.row.userName }}</template>
        </el-table-column>
        <el-table-column label="姓名" align="center">
          <template slot-scope="scope">{{ scope.row.nickName }}</template>
        </el-table-column>
        <el-table-column label="头像" align="center">
          <template slot-scope="scope"><img style="height: 80px" :src="scope.row.avatar"></template>
        </el-table-column>
        <el-table-column label="手机号" align="center">
          <template slot-scope="scope">{{ scope.row.phone }}</template>
        </el-table-column>
        <el-table-column label="邮箱" align="center">
          <template slot-scope="scope">{{ scope.row.email }}</template>
        </el-table-column>
        <el-table-column label="创建时间" align="center">
          <template slot-scope="scope">{{ scope.row.createdTime | formatDateTime }}</template>
        </el-table-column>
        <el-table-column label="状态" align="center">
          <template slot-scope="scope">
            <el-switch
              @change="handleStatusChange(scope.row)"
              :active-value="1"
              :inactive-value="0"
              v-model="scope.row.status">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-row>
              <el-button type="text"
                         @click="handleSelectMenu(scope.row)">分配角色
              </el-button>
            </el-row>
            <el-row>
              <el-button
                type="text"
                @click="handleEdit(scope.row)">
                编辑
              </el-button>
              <el-button
                type="text"
                @click="handleDelete(scope.row)">删除
              </el-button>
            </el-row>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination-container">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        layout="total, sizes,prev, pager, next,jumper"
        :current-page.sync="listQuery.pageNum"
        :page-size="listQuery.pageSize"
        :page-sizes="[5,10,15]"
        :total="total">
      </el-pagination>
    </div>
    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?'修改用户':'新增用户'">
      <el-form :model="user" label-width="60px" label-position="left">
        <el-form-item label="用户名">
          <el-input v-model="user.userName" placeholder="用户名"/>
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="user.nickName" placeholder="姓名"/>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="user.phone" placeholder="手机号"/>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="user.email" placeholder="邮箱"/>
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible=false">
          取消
        </el-button>
        <el-button type="primary" @click="confirmSubmit">
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {deepClone} from '@/utils'
import {insert, list,update} from '@/api/user'

const defaultUser = {
  id: '',
  userName: '',
  nickName: '',
  phone: '',
  email: '',
  avatar: '',
  status: 1
}
const defaultListQuery = {
  pageNum: 1,
  pageSize: 10,
  keyword: null
};

export default {
  data() {
    return {
      user: Object.assign({}, defaultUser),
      list: null,
      total: null,
      listLoading: false,
      listQuery: Object.assign({}, defaultListQuery),
      dialogVisible: false,
      dialogType: 'new'
    }
  },
  created() {
    this.getList()
  },
  methods: {
    handleResetSearch() {
      this.listQuery = Object.assign({}, defaultListQuery);
    },
    handleSearchList() {
      this.listQuery.pageNum = 1;
      this.getList();
    },
    handleSizeChange(val) {
      this.listQuery.pageNum = 1;
      this.listQuery.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.listQuery.pageNum = val;
      this.getList();
    },
    getList() {
      this.listLoading = true;
      list(this.listQuery).then(response => {
        this.list = response.data.data
        this.listLoading = false;
        this.total = response.data.totalNum;
      });
    },
    handleAdd() {
      this.user = Object.assign({}, defaultUser)
      this.dialogType = 'new'
      this.dialogVisible = true
    },
    handleEdit(scope) {
      this.dialogType = 'edit'
      this.dialogVisible = true
      this.user = deepClone(scope)
    },
    handleDelete({row}) {
      this.$confirm('Confirm to remove the role?', 'Warning', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      })
        .then(async () => {
          await deleteRole(row.key)
          this.usersList.splice($index, 1)
          this.$message({
            type: 'success',
            message: 'Delete succed!'
          })
        })
        .catch(err => {
          console.error(err)
        })
    },
    async confirmSubmit() {
      const isEdit = this.dialogType === 'edit'
      if (isEdit) {
        update(this.user).then(response => {
          if (response.code === 0) {
            this.$message({
              type: 'success',
              message: '操作成功!'
            })
          }
          this.dialogVisible = false
          this.getList();
        });
      } else {
        insert(this.user).then(response => {
          if (response.code === 0) {
            this.$message({
              type: 'success',
              message: '操作成功!'
            })
          }
          this.dialogVisible = false
          this.getList();
        });
      }

    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  .roles-table {
    margin-top: 30px;
  }

  .permission-tree {
    margin-bottom: 30px;
  }
}
</style>
