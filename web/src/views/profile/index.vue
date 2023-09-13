<template>
  <div class="app-container">
    <el-card>
      <el-form :model="user" ref="form" label-width="100px">
        <el-row :gutter="20">
          <el-col :span="6" :xs="24">
            <el-form-item label="用户名" prop="name">
              <el-input v-model="user.userName" placeholder="请输入用户名" disabled></el-input>
            </el-form-item>
            <el-form-item label="头像">
              <!-- 替换为您的文件上传接口 -->
              <el-upload
                action="/dev-api/profile/uploadAvatar"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload"
              >
                <img v-if="user.avatar" :src="user.avatar" class="avatar"/>
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
          </el-col>
          <el-col :span="18" :xs="24">
            <el-card>
              <el-tabs v-model="activeTab">
                <el-tab-pane label="个人信息" name="account">
                  <el-form-item label="姓名" prop="name">
                    <el-input v-model="user.nickName" placeholder="请输入姓名"></el-input>
                  </el-form-item>
                  <el-form-item label="邮箱" prop="email">
                    <el-input v-model="user.email" placeholder="请输入邮箱"></el-input>
                  </el-form-item>
                  <el-form-item label="手机号" prop="phoneNumber">
                    <el-input v-model="user.phone" placeholder="请输入手机号"></el-input>
                  </el-form-item>
                  <el-form-item label="性别" prop="name">
                    <el-radio-group v-model="user.sex">
                      <el-radio :label="1">男</el-radio>
                      <el-radio :label="2">女</el-radio>
                      <el-radio :label="3">未知</el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item label="出生日期" prop="name">
                    <el-date-picker
                      v-model="user.birthday"
                      type="datetime"
                      placeholder="选择日期时间">
                    </el-date-picker>
                  </el-form-item>
                  <el-form-item label="个人简介" prop="name">
                    <el-input v-model="user.desc" placeholder="请输入个人简介"></el-input>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" @click="updateProfile">提交</el-button>
                  </el-form-item>
                </el-tab-pane>
                <el-tab-pane label="修改密码" name="updatePwd">
                  <el-form :model="updatePwdModel" ref="form" label-width="100px">
                    <el-form-item label="旧密码" prop="name">
                      <el-input v-model="updatePwdModel.oldPwd" placeholder="请输入旧密码"></el-input>
                    </el-form-item>
                    <el-form-item label="新密码" prop="name">
                      <el-input v-model="updatePwdModel.newPwd" placeholder="请输入新密码"></el-input>
                    </el-form-item>
                    <el-form-item label="再次确认密码" prop="name">
                      <el-input v-model="updatePwdModel.twoNewPWd" placeholder="请输入新密码（再次确认密码）"></el-input>
                    </el-form-item>
                    <el-form-item>
                      <el-button type="primary" @click="updatePwd">提交</el-button>
                    </el-form-item>
                  </el-form>
                </el-tab-pane>
                <el-tab-pane label="其他" name="timeline">
                  <timeline/>
                </el-tab-pane>
              </el-tabs>
            </el-card>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import Timeline from './components/Timeline'
import {updateProfile, updatePwd} from '@/api/profile'
import store from "@/store";


const defaultUpdatePwdModel = {
  id: null,
  oldPwd: null,
  newPwd: null,
  twoNewPWd: null
};
export default {
  name: 'Profile',
  components: {Timeline},
  data() {
    return {
      user: {},
      updatePwdModel: Object.assign({}, defaultUpdatePwdModel),
      activeTab: 'account'
    }
  },
  computed: {
    ...mapGetters([
      'userInfo'
    ])
  },
  created() {
    this.getUser()
  },
  methods: {
    getUser() {
      this.user = Object.assign({}, this.userInfo)
    },
    updateProfile() {
      this.$confirm('请确认是否修改?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        updateProfile(this.user).then(response => {
          if (response.code === 0) {
            this.$message({
              type: 'success',
              message: '操作成功!'
            })
          }
        });
      }).catch(err => {
        console.error(err)
      })
    },
    updatePwd() {
      this.$confirm('请确认是否修改?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        this.updatePwdModel.id = this.user.id;
        updatePwd(this.updatePwdModel).then(response => {
          if (response.code === 0) {
            this.$message({
              type: 'success',
              message: '操作成功!'
            })
            store.dispatch('user/resetToken').then(() => {
              location.reload()
            })
          }
        });
      }).catch(err => {
        console.error(err)
      })
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
      const isLt500K = file.size / 1024 <= 500;

      if (!isJPG) {
        this.$message.error('只能上传 JPG 或 PNG 格式的图片');
      }
      if (!isLt500K) {
        this.$message.error('图片大小不能超过500KB');
      }

      return isJPG && isLt500K;
    },
    handleAvatarSuccess(response, file) {
      // 后端返回的图片Base64数据
      this.user.avatar = response.data;
    },
  }
}
</script>
<style scoped>
.avatar {
  width: 100px;
  height: 100px;
  display: block;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #999;
  width: 100px;
  height: 100px;
  line-height: 100px;
  text-align: center;
  background-color: #ddd;
}
</style>
