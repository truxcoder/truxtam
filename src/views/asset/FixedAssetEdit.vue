<template>
  <el-dialog title="编辑资产信息" :visible.sync="dialogFormVisible" :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false" v-loading="dialogLoading">
    <el-form :inline="true" :model="form" :rules="rules" ref="editForm" size="medium" :label-width="formLabelWidth" label-position="right">
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
import { updateAsset } from "@/api/asset"
import { mixin } from '@/common/mixin/asset'
// import rules from '@/common/rules/asset'
// import models from '@/common/model/asset'
  export default {
    name:'FixedAssetEdit',
    mixins:[mixin],
    props:{
      dialogFormVisible:{
        type:Boolean,
        default:false,
      },
      rowdata:{
        type:Object,
        default(){
          return {}
        }
      },
    },
    watch:{
      rowdata: function(val,oldval){
        //因为Vue中父向子传值，数组和对象会传引用。直接修改props里面的值会直接影响父组件数据。Vue官方推荐用计算属性。
        //这里想办法建立一个本地属性。用Json方法生生造了一个对象。
        //重构：用spread语法
        // this.form = JSON.parse(JSON.stringify(val))
        this.form = {...val}
        if (typeof this.form.buy_time == 'string') {
          //为了解决date组件的验证问题，传过来的字符串类型转化为date类型。
          this.form.buy_time = new Date(this.form.buy_time)
          this.form.use_time = new Date(this.form.use_time)
        }
      }
    },
    methods:{
      onSubmit() {
        this.$refs.editForm.validate( valid => {
          if (valid) {
            this.dialogLoading = true
            updateAsset(this.form).then(response => {
              this.$message({
                message: response.message,
                type: 'success'
              })
              this.dialogLoading = false
              this.$emit('updateAssetSuccess',response.modifiedRow)
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
        this.$emit('visibleChange')
        this.$refs.editForm.resetFields()
      }
    }
  }
</script>


<style>

</style>