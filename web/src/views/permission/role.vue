<template>
  <div class="app-container">
    <el-button type="primary" @click="handleAdd()">添加角色</el-button>
    <div class="table-container">
      <el-table ref="roleTable"
                :data="list"
                style="width: 100%;"
                v-loading="listLoading" border>
        <el-table-column label="角色名称" align="center">
          <template slot-scope="scope">{{ scope.row.name }}</template>
        </el-table-column>
        <el-table-column label="角色编码" align="center">
          <template slot-scope="scope">{{ scope.row.code }}</template>
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
                         @click="handleSelectMenu(scope.row)">授权
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
    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?'修改角色':'新增角色'" width="40%">
      <el-form :model="formData" label-width="80px" label-position="left">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="角色名称">
              <el-input v-model="formData.name" placeholder="角色名称"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="角色编码">
              <el-input v-model="formData.code" placeholder="角色编码"/>
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
    <!--  授权-->
    <el-dialog :visible.sync="selectMenuDialogVisible" :title="'菜单授权'" width="45%">
      <el-form :model="roleMenuListModel" label-width="60px" label-position="left">
        <el-form-item>
          <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选
          </el-checkbox>
          <div style="margin: 15px 0;"></div>
          <el-checkbox-group v-model="roleMenuListModel.menuIds" @change="handleCheckedMenusChange">
            <el-checkbox v-for="menu in menuLists" :label="menu.id" :key="menu.id">{{ menu.name }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="selectMenuDialogVisible=false">
          取消
        </el-button>
        <el-button type="primary" @click="handleSelectMenuSubmit">
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {deepClone} from '@/utils'
import {deleteById, insert, list, update,insertRoleMenu} from '@/api/role2'
import {getMenuList} from '@/api/menu'

const defaultFormData = {
  id: '',
  name: '',
  code: '',
  status: 1
}
const defaultListQuery = {
  pageNum: 1,
  pageSize: 10,
  keyword: null
};
const defaultRoleMenuListModel = {
  roleId: null,
  menuIds: []
};
export default {
  data() {
    return {
      formData: Object.assign({}, defaultFormData),
      list: null,
      total: null,
      listLoading: false,
      listQuery: Object.assign({}, defaultListQuery),
      dialogVisible: false,
      dialogType: 'new',
      //角色分配
      selectMenuDialogVisible: false,
      checkAll: false,
      menuLists: [],
      isIndeterminate: true,
      roleMenuListModel: Object.assign({}, defaultRoleMenuListModel)

    }
  },
  created() {
    this.getList();
    this.getMenuList();
  },
  methods: {
    getMenuList() {
      getMenuList().then(response => {
        this.menuLists = response.data
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
      this.formData = Object.assign({}, defaultFormData)
      this.dialogType = 'new'
      this.dialogVisible = true
    },
    handleEdit(scope) {
      this.dialogType = 'edit'
      this.dialogVisible = true
      this.formData = deepClone(scope)
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
        update(this.formData).then(response => {
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
        insert(this.formData).then(response => {
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
    handleSelectMenu(row) {
      this.roleMenuListModel = {
        roleId: row.id,
        menuIds: row.menuIds,
      };
      const menuListLength = this.menuLists.length;
      this.checkAll = menuListLength === this.roleMenuListModel.menuIds.length;
      this.isIndeterminate = menuListLength > 0 && menuListLength < this.roleMenuListModel.menuIds.length;
      this.selectMenuDialogVisible = true;
    },
    handleSelectMenuSubmit() {
      if (this.roleMenuListModel.menuIds == null || this.roleMenuListModel.menuIds.length <= 0) {
        this.$message({
          type: 'error',
          message: '请至少选择一个!'
        });
        return;
      }
      insertRoleMenu(this.roleMenuListModel).then(response => {
        if (response.code === 0) {
          this.$message({
            type: 'success',
            message: '操作成功!'
          })
        }
        this.selectMenuDialogVisible = false
        this.getList();
      });
    },
    handleCheckAllChange(val) {
      this.roleMenuListModel.menuIds = val ? this.menuLists.map(item => item.id) : [];
      this.isIndeterminate = false;
    },
    handleCheckedMenusChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.menuLists.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.menuLists.length;
      this.roleMenuListModel.menuIds.add(value);
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
