<template>
  <el-dialog title="增加资产信息" :visible.sync="addFormVisible" :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false" v-loading="dialogLoading">
    <el-form :inline="true" :model="form" :rules="rules" ref="addForm" size="medium" label-position="right">
      <!-- <el-form-item v-for="item in formItemData" :label="models[item].label" :prop="item" :label-width="formLabelWidth" :key="item">
        <el-select v-if="item=='status'" v-model="form[item]" :placeholder="'请选择'+models[item].label">
          <el-option v-for="i in statusList" :label="i" :value="i" :key="i"></el-option>
        </el-select>
        <el-select v-else-if="item=='department'" v-model="form[item]" :placeholder="'请选择'+models[item].label">
          <el-option v-for="i in departmentList" :label="i" :value="i" :key="i"></el-option>
        </el-select>
        <el-date-picker v-else-if="models[item].type=='DATE'" v-model="form[item]" type="date" placeholder="选择日期"></el-date-picker>
        <el-input v-else v-model="form[item]" autocomplete="off"></el-input>
      </el-form-item> -->
      <el-form-item label="编号" prop="code" :label-width="formLabelWidth">
        <el-input v-model="form.code" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="名称" prop="name" :label-width="formLabelWidth">
        <el-input v-model="form.name" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="品牌" prop="mfrs" :label-width="formLabelWidth">
        <el-input v-model="form.mfrs" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="型号" prop="model" :label-width="formLabelWidth">
        <el-input v-model="form.model" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="状态" prop="status" :label-width="formLabelWidth">
        <el-select v-model="form.status" placeholder="请选择状态">
          <el-option v-for="item in statusList" :label="item" :value="item" :key="item"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="责任人" prop="manager" :label-width="formLabelWidth">
        <el-input v-model="form.manager" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="所属部门" prop="department" :label-width="formLabelWidth">
        <el-select v-model="form.department" placeholder="请选择部门">
          <el-option v-for="item in departmentList" :label="item" :value="item" :key="item"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="所在位置" prop="position" :label-width="formLabelWidth">
        <el-input v-model="form.position" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="购买时间" prop="buy_time" :label-width="formLabelWidth">
        <el-date-picker v-model="form.buy_time" type="date" placeholder="选择日期"></el-date-picker>
      </el-form-item>
      <el-form-item label="启用时间" prop="use_time" :label-width="formLabelWidth">
        <el-date-picker v-model="form.use_time" type="date" placeholder="选择日期"></el-date-picker>
      </el-form-item>      
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="onCancel">取 消</el-button>
      <el-button type="primary" @click="onSubmit">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { addAsset } from "@/api/asset"
// import rules from '@/common/rules/asset'
// import models from '@/common/model/asset'
import { mixin } from '@/common/mixin/asset'
  export default {
    name:'fixedAssetAdd',
    mixins:[mixin],
    props:{
      addFormVisible:{
        type:Boolean,
        default:false,
      },
    },
    mounted(){
      this.formItemData.forEach(key => this.$set(this.form,key,''))
      // this.formItemData.forEach(key => this.form[key] = "")
    },
    methods:{
      visibleChange(){
        this.$emit('addVisibleChange')
      },
      onSubmit() {
        this.$refs.addForm.validate( valid => {
          if (valid) {
            this.dialogLoading = true
            addAsset(this.form).then(response => {
              this.$message({
                message: response.message,
                type: 'success'
              })
              this.dialogLoading = false
              this.$emit('addAssetSuccess')
              this.$refs.addForm.resetFields()
              // Object.keys(this.form).forEach(key => this.form[key]='')
            }).catch(err => {
                // this.$message.error(err.message)
                this.dialogLoading = false
            })
          } else {
            this.$message.error("请按规则填写表格！")
            return false
          }
        })
      },
      onCancel(){
        this.$emit('addVisibleChange')
        // Object.keys(this.form).forEach(key => this.form[key]='')
        this.$refs.addForm.resetFields()
      }
    }
  }
</script>


<style>

</style>