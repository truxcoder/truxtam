<template>
  <el-dialog title="编辑资产信息" :visible.sync="dialogFormVisible" :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false" v-loading="dialogLoading">
    <el-form :inline="true" :model="form" :rules="rules" ref="editForm" size="medium">
      <el-form-item v-for="item in formItemData" :label="models[item].label" :prop="item" :label-width="formLabelWidth" :key="item">
        <el-select v-if="item=='status'" v-model="form[item]" :placeholder="'请选择'+models[item].label">
          <el-option v-for="i in statusList" :label="i" :value="i" :key="i"></el-option>
        </el-select>
        <el-select v-else-if="item=='department'" v-model="form[item]" :placeholder="'请选择'+models[item].label">
          <el-option v-for="i in departmentList" :label="i" :value="i" :key="i"></el-option>
        </el-select>
        <el-date-picker v-else-if="models[item].type=='DATE'" v-model="form[item]" type="date" placeholder="选择日期"></el-date-picker>
        <el-input v-else v-model="form[item]" autocomplete="off"></el-input>
      </el-form-item>
      <!-- <el-form-item label="编号" prop="code" :label-width="formLabelWidth">
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
      </el-form-item>  -->
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
    name:'fixedAssetEdit',
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
        this.form = JSON.parse(JSON.stringify(val))
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
              this.$emit('updateAssetSuccess',this.form)
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