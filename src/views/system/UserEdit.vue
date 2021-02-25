<template>
  <el-dialog title="编辑用户" :visible.sync="editFormVisible" :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false" v-loading="dialogLoading">
    <el-form :inline="true" :model="form" :rules="rules" ref="editForm" size="medium" label-position="right">
      <el-form-item v-for="item in formItemData" :label="models[item].label" :prop="item" :label-width="formLabelWidth" :key="item">
        <el-select v-if="item=='status'" v-model="form[item]" :placeholder="'请选择'+models[item].label">
          <el-option v-for="i in statusList" :label="i.label" :value="i.value" :key="i.label"></el-option>
        </el-select>
        <el-select v-else-if="item=='departmentId'" v-model="form[item]" :placeholder="'请选择'+models[item].label">
          <el-option v-for="i in departmentList" :label="i.name" :value="i.id" :key="i.id"></el-option>
        </el-select>
        <el-input v-else v-model="form[item]" autocomplete="off"></el-input>
      </el-form-item>     
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="onCancel">取 消</el-button>
      <el-button type="primary" @click="onSubmit">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { updateUser } from "@/api/user"
import { mixin } from '@/common/mixin/user'
  export default {
    name:'UserEdit',
    mixins:[mixin],
    props:{
      editFormVisible:{
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
        // this.form = JSON.parse(JSON.stringify(val))
        this.form = {...val}
      }
    },
    methods:{
      onSubmit() {
        this.$refs.editForm.validate( valid => {
          if (valid) {
            this.dialogLoading = true
            updateUser(this.form).then(response => {
              this.$message({
                message: response.message,
                type: 'success'
              })
              this.dialogLoading = false
              this.$emit('updateDataSuccess',this.form)
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