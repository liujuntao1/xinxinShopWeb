<template>
  <div class="app-container">
    <el-button type="primary" @click="handleAdd()">添加菜单</el-button>
    <div class="table-container">
      <el-table ref="menuTable"
                :data="listData"
                style="width: 100%;"
                v-loading="listLoading" border>
        <el-table-column label="菜单名称" align="center">
          <template slot-scope="scope">{{ scope.row.name }}</template>
        </el-table-column>
        <el-table-column label="菜单编码" align="center">
          <template slot-scope="scope">{{ scope.row.code }}</template>
        </el-table-column>
        <el-table-column label="菜单地址" align="center">
          <template slot-scope="scope">{{ scope.row.url }}</template>
        </el-table-column>
        <el-table-column label="菜单图标" align="center">
          <template slot-scope="scope">{{ scope.row.icon }}</template>
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
            <el-button
              type="text"
              @click="handleEdit(scope.row)">
              编辑
            </el-button>
            <el-button
              type="text"
              @click="handleDelete(scope.row)">删除
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
        :current-page.sync="queryParam.pageNum"
        :page-size="queryParam.pageSize"
        :page-sizes="[5,10,15]"
        :total="totalNum">
      </el-pagination>
    </div>
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
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="菜单地址">
              <el-input v-model="formData.url" placeholder="菜单地址"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="菜单图标">
              <el-input v-model="formData.icon" placeholder="菜单图标"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="上级菜单">
              <el-input v-model="formData.parentId" placeholder="上级菜单"/>
            </el-form-item>
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
import {deleteById, insert, list, update} from '@/api/menu'

const defaultFormData = {
  id: '',
  name: '',
  code: '',
  url: '',
  icon: '',
  parentId: '',
  status: 1
}
const defaultQueryParam = {
  pageNum: 1,
  pageSize: 10,
  keyword: null
};
export default {
  data() {
    return {
      formData: Object.assign({}, defaultFormData),
      listData: null,
      totalNum: null,
      listLoading: false,
      queryParam: Object.assign({}, defaultQueryParam),
      dialogVisible: false,
      dialogType: 'new',
    }
  },
  created() {
    this.getListData()
  },
  methods: {
    getListData() {
      this.listLoading = true;
      list(this.queryParam).then(response => {
        this.listData = response.data.data
        this.listLoading = false;
        this.totalNum = response.data.totalNum;
      });
    },
    handleResetSearch() {
      this.queryParam = Object.assign({}, defaultQueryParam);
    },
    handleSearchList() {
      this.queryParam.pageNum = 1;
      this.getListData();
    },
    handleSizeChange(val) {
      this.queryParam.pageNum = 1;
      this.queryParam.pageSize = val;
      this.getListData();
    },
    handleCurrentChange(val) {
      this.queryParam.pageNum = val;
      this.getListData();
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
          this.getListData();
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
          this.getListData();
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
          this.getListData();
        });
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
