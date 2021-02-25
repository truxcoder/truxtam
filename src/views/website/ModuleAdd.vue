<template>
  <el-dialog title="添加模块" :visible.sync="cpnVisible" :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false" v-loading="dialogLoading">
    <el-form :inline="true" :model="form" :rules="rules" ref="addForm" size="medium" label-position="right" class="moduleForm">
      <el-form-item v-for="formitem in formItemData" :label="models[formitem].label" :prop="formitem" :label-width="formLabelWidth" :key="formitem">
        <el-select v-if="formitem==='rank'" :style="formItemWidth" v-model="form[formitem]" :placeholder="'请选择'+models[formitem].label">
          <el-option v-for="i in rankList" :label="i.label" :value="i.value" :key="i.label"></el-option>
        </el-select>
        <el-select v-else-if="formitem==='parent'" :style="formItemWidth" v-model="form[formitem]" :placeholder="'请选择'+models[formitem].label">
          <el-option v-for="i in newModuleList" :label="i.title" :value="i.id" :key="i.id"></el-option>
        </el-select>
        <el-autocomplete
          v-else-if="formitem==='icon'"
          :style="formItemWidth"
          popper-class="iconList"
          v-model="form[formitem]"
          :fetch-suggestions="querySearch"
          placeholder="请输入内容"
          @select="handleSelect">
          <i class="el-icon-edit" slot="suffix"/>
          <template slot-scope="{ item }">
            <i class="iconItem" :class="item.value"/>
          </template>
        </el-autocomplete>
        <el-input v-else :style="formItemWidth" v-model="form[formitem]" autocomplete="off"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="onCancel">取 消</el-button>
      <el-button type="primary" @click="onSubmit">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { addModule } from '@/api/module'
import { mixin } from '@/common/mixin/module'
export default {
  name: 'UserAdd',
  mixins: [mixin],
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
          if ((this.form.parent === '0' && this.form.rank !== 1) || (this.form.parent !== '0' && this.form.rank === 1)) {
            this.$message.error('模块级别和父组件不匹配！')
            return
          }
          this.dialogLoading = true
          addModule(this.form).then(response => {
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

<style scoped>

</style>
