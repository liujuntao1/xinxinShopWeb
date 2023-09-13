<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-form :inline="true" :model="listQuery" class="demo-form-inline">
          <el-form-item label="用户">
            <el-input v-model="listQuery.userId" placeholder="用户"></el-input>
          </el-form-item>
          <el-form-item label="ip">
            <el-input v-model="listQuery.ip" placeholder="ip"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearchList" size="small">查询</el-button>
            <el-button type="primary" @click="handleResetSearch" size="small">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="table-container">
        <el-table ref="logTable"
                  :data="list"
                  style="width: 100%;"
                  v-loading="listLoading" border>
          <el-table-column label="序号" align="center"
                           type="index"
                           width="60">
          </el-table-column>
          <el-table-column label="日志内容" align="center">
            <template slot-scope="scope">{{ scope.row.logContent }}</template>
          </el-table-column>
          <el-table-column label="日志类型" align="center">
            <template slot-scope="scope">{{ scope.row.logType }}</template>
          </el-table-column>
          <el-table-column label="操作人" align="center">
            <template slot-scope="scope">{{ scope.row.userName }}</template>
          </el-table-column>
          <el-table-column label="操作ip" align="center">
            <template slot-scope="scope">{{ scope.row.operationIp }}</template>
          </el-table-column>
          <el-table-column label="创建时间" align="center">
            <template slot-scope="scope">{{ scope.row.createdTime | formatDateTime }}</template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button type="text" size="small"
                         @click="handleEdit(scope.row)"
                         icon="el-icon-view">查看
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
    <!--    查看详情-->
    <el-dialog :visible.sync="dialogVisible" :title="'日志详情'" width="45%">
      <el-form :model="user" label-width="100px" label-position="left">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="日志内容：">
              <el-input v-model="user.logContent" placeholder="日志内容"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="日志类型：">
              <el-input v-model="user.logType" placeholder="日志类型"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="操作人：">
              <el-input v-model="user.userName" placeholder="操作人"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="操作ip：">
              <el-input v-model="user.operationIp" placeholder="操作ip"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="请求地址（待开发）：">
              <el-input v-model="user.phone" placeholder="请求地址（待开发）"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="请求参数（待开发）：">
              <el-input v-model="user.phone" placeholder="请求参数（待开发）"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="返回数据（待开发）：">
              <el-input v-model="user.phone" placeholder="返回数据（待开发）"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="耗时（待开发）：">
              <el-input v-model="user.phone" placeholder="耗时（待开发）"/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible=false">
          关闭
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {deepClone} from '@/utils'
import {list} from '@/api/log'

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
    handleEdit(scope) {
      this.dialogType = 'edit'
      this.dialogVisible = true
      this.user = deepClone(scope)
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
