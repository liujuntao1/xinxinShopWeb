<template>
  <div class="app-container">
    <el-button type="primary" @click="handleAdd()" size="small">添加菜单</el-button>
    <el-tree
      :data="menuTree"
      :props="defaultProps"
      :expand-on-click-node="false"
      node-key="id"
      @node-click="handleNodeClick"
    ></el-tree>
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
import {deleteById, getMenuTreeListList, insert, update} from '@/api/menu'

const defaultFormData = {
  id: '',
  name: '',
  code: '',
  url: '',
  icon: '',
  parentId: '',
  status: 1
}
export default {
  data() {
    return {
      formData: Object.assign({}, defaultFormData),
      menuTree: [],
      defaultProps: {
        children: 'children',
        label: 'name',
      },
      dialogVisible: false,
      dialogType: 'new',
    }
  },
  created() {
    this.getListData()
  },
  mounted() {
  },
  methods: {
    getListData() {
      getMenuTreeListList().then(response => {
        this.menuTree = response.data;
      });
    },
    handleNodeClick(node) {
      // 处理节点单击事件
      this.selectedNode = node;
    },
    editNode(node) {
      alert(`编辑菜单项: ${node.name}`);
    },
    deleteNode(node) {
      alert(`删除菜单项: ${node.name}`);
    },
    addSubNode(node) {
      alert(`新增子级菜单项: ${node.name}`);
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
