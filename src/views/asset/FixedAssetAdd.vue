<template>
  <el-dialog title="增加资产信息" :visible.sync="addFormVisible" :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false" v-loading="dialogLoading">
    <el-form :inline="true" class="add-form" :model="form" :rules="rules" ref="addForm" size="medium" :label-width="formLabelWidth" label-position="right">
      <el-form-item v-for="item in formItemData" :label="models[item].label" :prop="item"  :key="item">
        <el-select :style="formItemWidth" v-if="item=='status'" v-model="form[item]" :placeholder="'请选择'+models[item].label">
          <el-option v-for="i in statusList" :label="i" :value="i" :key="i"></el-option>
        </el-select>
        <el-select :style="formItemWidth" v-else-if="item=='departmentId'" v-model="form[item]" :placeholder="'请选择'+models[item].label">
          <el-option v-for="i in departmentList" :label="i.name" :value="i.id" :key="i.id"></el-option>
        </el-select>
        <el-date-picker :style="formItemWidth" v-else-if="models[item].type=='DATE'" v-model="form[item]" type="date" placeholder="选择日期"></el-date-picker>
        <el-input :style="formItemWidth" v-else-if="models[item].type=='NUMBER'" v-model.number="form[item]" autocomplete="off"></el-input>
        <el-input :style="formItemWidth" v-else v-model="form[item]" autocomplete="off"></el-input>
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
    name:'FixedAssetAdd',
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