<template>
  <div class="app-container">
    <el-form :inline="true" :model="listQuery" class="demo-form-inline">
      <el-form-item label="用户名">
        <el-input v-model="listQuery.userName" placeholder="用户名"></el-input>
      </el-form-item>
      <el-form-item label="手机号">
        <el-input v-model="listQuery.phone" placeholder="手机号"></el-input>
      </el-form-item>
      <el-form-item label="用户类型">
        <el-select v-model="listQuery.region" placeholder="用户类型">
          <el-option label="类型一" value="shanghai"></el-option>
          <el-option label="类型二" value="beijing"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearchList">查询</el-button>
        <el-button type="primary" @click="handleResetSearch">重置</el-button>
      </el-form-item>
    </el-form>
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
          <template slot-scope="scope">
            <div class="demo-type">
              <el-avatar :size="60" src="https://empty" @error="errorHandler">
                <img :src="scope.row.avatar">
              </el-avatar>
            </div>
          </template>
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
                         @click="handleSelectRole(scope.row)">分配角色
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
    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?'修改用户':'新增用户'" width="40%">
      <el-form :model="user" label-width="80px" label-position="left">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="用户名">
              <el-input v-model="user.userName" placeholder="用户名"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="姓名">
              <el-input v-model="user.nickName" placeholder="姓名"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="手机号">
              <el-input v-model="user.phone" placeholder="手机号"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="邮箱">
              <el-input v-model="user.email" placeholder="邮箱"/>
            </el-form-item>
          </el-col>
          <!--          TODO 待扩展字段-性别、出生日期-->
          <el-col :span="12">
            <el-form-item label="性别">
              <el-radio-group v-model="user.sex">
                <el-radio-button label="男"/>
                <el-radio-button label="女"/>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="出生日期">
              <el-input v-model="user.birthday" placeholder="出生日期"/>
            </el-form-item>
          </el-col>
        </el-row>
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
    <!--  角色分配-->
    <el-dialog :visible.sync="selectRoleDialogVisible" :title="'角色分配'" width="40%">
      <el-form :model="userRoleListModel" label-width="80px" label-position="left">
        <el-form-item label="角色">
          <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选
          </el-checkbox>
          <div style="margin: 15px 0;"></div>
          <el-checkbox-group v-model="userRoleListModel.roleIds" @change="handleCheckedRolesChange">
            <el-checkbox v-for="role in roleLists" :label="role.id" :key="role.id">{{ role.name }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="selectRoleDialogVisible=false">
          取消
        </el-button>
        <el-button type="primary" @click="handleSelectRoleSubmit">
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {deepClone} from '@/utils'
import {deleteById, insert, insertUserRole, list, update} from '@/api/user'
import {getRoleList} from '@/api/role2'

const defaultUser = {
  id: '',
  userName: '',
  nickName: '',
  phone: '',
  email: '',
  avatar: '',
  birthday: '',
  status: 1
}
const defaultListQuery = {
  pageNum: 1,
  pageSize: 10,
  keyword: null
};
const defaultUserRoleListModel = {
  userId: null,
  roleIds: []
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
      dialogType: 'new',
      //角色分配
      selectRoleDialogVisible: false,
      checkAll: false,
      roleLists: [],
      isIndeterminate: true,
      userRoleListModel: Object.assign({}, defaultUserRoleListModel)
    }
  },
  created() {
    this.getList();
    this.getRoleList();
  },
  methods: {
    getRoleList() {
      getRoleList().then(response => {
        this.roleLists = response.data
      });
    },
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
    handleDelete(row) {
      this.$confirm('确定要删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        deleteById(row.id).then(response => {
          if (response.code === 0) {
            this.$message({
              type: 'success',
              message: '操作成功!'
            })
          }
          this.dialogVisible = false
          this.getList();
        });
      }).catch(err => {
        console.error(err)
      })
    },
    confirmSubmit() {
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
    },
    handleSelectRole(row) {
      this.userRoleListModel = {
        userId: row.id,
        roleIds: row.roleIds,
      };
      const roleListLength = this.roleLists.length;
      this.checkAll = roleListLength === this.userRoleListModel.roleIds.length;
      this.isIndeterminate = roleListLength > 0 && roleListLength < this.userRoleListModel.roleIds.length;
      this.selectRoleDialogVisible = true;
    },
    handleSelectRoleSubmit() {
      if (this.userRoleListModel.roleIds == null || this.userRoleListModel.roleIds.length <= 0) {
        this.$message({
          type: 'error',
          message: '请至少选择一个!'
        });
        return;
      }
      insertUserRole(this.userRoleListModel).then(response => {
        if (response.code === 0) {
          this.$message({
            type: 'success',
            message: '操作成功!'
          })
        }
        this.selectRoleDialogVisible = false
        this.getList();
      });
    },
    handleCheckAllChange(val) {
      this.userRoleListModel.roleIds = val ? this.roleLists.map(item => item.id) : [];
      this.isIndeterminate = false;
    },
    handleCheckedRolesChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.roleLists.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.roleLists.length;
      this.userRoleListModel.roleIds.add(value);
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
