<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-form :inline="true" :model="listQuery" class="demo-form-inline">
          <el-form-item label="菜单名称">
            <el-input v-model="listQuery.name" placeholder="菜单名称"></el-input>
          </el-form-item>
          <el-form-item label="菜单编码">
            <el-input v-model="listQuery.code" placeholder="菜单编码"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearchList" size="small">查询</el-button>
            <el-button type="primary" @click="handleResetSearch" size="small">重置</el-button>
          </el-form-item>
        </el-form>
        <el-button type="primary" @click="handleAdd()" size="small">添加菜单</el-button>
        <el-button type="primary" @click="handleImport()" size="small">导入</el-button>
        <el-button type="primary" @click="handleExport()" size="small">导出</el-button>
      </div>
      <div class="table-container">
        <el-table :data="menuTree" row-key="id">
          <el-table-column prop="name" label="菜单名称"></el-table-column>
          <el-table-column prop="code" label="菜单编码"></el-table-column>
          <el-table-column prop="url" label="菜单地址"></el-table-column>
          <el-table-column prop="icon" label="菜单图标"></el-table-column>
          <el-table-column prop="sort" label="排序"></el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button type="text" size="small"
                         @click="handleAddSub(scope.row)"
                         icon="el-icon-edit">添加子级
              </el-button>
              <el-button type="text" size="small"
                         @click="handleEdit(scope.row)"
                         icon="el-icon-edit">编辑
              </el-button>
              <el-button type="text" size="small"
                         @click="handleDelete(scope.row)"
                         icon="el-icon-delete">删除
              </el-button>
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
    </el-card>
    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?'修改':'新增'" width="40%">
      <el-form :model="formData" label-width="80px" label-position="left">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="菜单名称">
              <el-input v-model="formData.name" placeholder="菜单名称"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="菜单编码">
              <el-input v-model="formData.code" placeholder="菜单编码"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="菜单地址">
              <el-input v-model="formData.url" placeholder="菜单地址"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="菜单图标:" prop="icon" class="default-form-item">
              <icon-picker v-model="formData.icon"></icon-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
          </el-col>
          <el-col :span="12">
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
  </div>
</template>

<script>
import {deepClone} from '@/utils'
import {deleteById, getMenuPageTreeList, insert, update} from '@/api/menu'

const defaultFormData = {
  id: '',
  name: '',
  code: '',
  url: '',
  icon: '',
  parentId: '',
  status: 1
};
const defaultListQuery = {
  pageNum: 1,
  pageSize: 10,
  keyword: null
};
export default {
  data() {
    return {
      formData: Object.assign({}, defaultFormData),
      listQuery: Object.assign({}, defaultListQuery),
      total: null,
      listLoading: false,
      menuTree: [],
      dialogVisible: false,
      dialogType: 'new',
    }
  },
  created() {
    this.getList()
  },
  mounted() {
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
      getMenuPageTreeList().then(response => {
        this.menuTree = response.data.data;
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
    handleImport() {
      this.$message({
        type: 'success',
        message: '敬请期待！'
      })
    },
    handleExport() {
      this.$message({
        type: 'success',
        message: '敬请期待！'
      })
    },
  }
}
</script>

<style lang="scss" scoped>
</style>
