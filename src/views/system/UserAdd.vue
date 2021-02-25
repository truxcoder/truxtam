<template>
  <el-dialog title="添加用户" :visible.sync="addFormVisible" :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false" v-loading="dialogLoading">
    <el-form :inline="true" :model="form" :rules="rules" ref="addForm" size="medium" label-position="right">
      <el-form-item v-for="item in formItemData" :label="models[item].label" :prop="item" :label-width="formLabelWidth" :key="item">
        <el-select v-if="item=='status'" :style="formItemWidth" v-model="form[item]" :placeholder="'请选择'+models[item].label">
          <el-option v-for="i in statusList" :label="i.label" :value="i.value" :key="i.label"></el-option>
        </el-select>
        <el-select v-else-if="item=='departmentId'" :style="formItemWidth" v-model="form[item]" :placeholder="'请选择'+models[item].label">
          <el-option v-for="i in departmentList" :label="i.name" :value="i.id" :key="i.id"></el-option>
        </el-select>
        <el-input v-else :style="formItemWidth" v-model="form[item]" autocomplete="off"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="onCancel">取 消</el-button>
      <el-button type="primary" @click="onSubmit">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { addUser } from '@/api/user'
import { mixin } from '@/common/mixin/user'
export default {
  name: 'UserAdd',
  mixins: [mixin],
  props: {
    addFormVisible: {
      type: Boolean,
      default: false
    }
  },
  mounted() {
    this.formItemData.forEach(key => this.$set(this.form, key, ''))
  },
  methods: {
    visibleChange() {
      this.$emit('addVisibleChange')
    },
    onSubmit() {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          this.dialogLoading = true
          addUser(this.form).then(response => {
            this.$message({
              message: response.message,
              type: 'success'
            })
            this.dialogLoading = false
            this.$emit('addDataSuccess')
            this.$refs.addForm.resetFields()
          }).catch(err => {
            console.log('err:', err)
            this.dialogLoading = false
          })
        } else {
          this.$message.error('请按规则填写表格！')
          return false
        }
      })
    },
    onCancel() {
      this.$emit('addVisibleChange')
      this.$refs.addForm.resetFields()
    }
  }
}
</script>

<style>

</style>
