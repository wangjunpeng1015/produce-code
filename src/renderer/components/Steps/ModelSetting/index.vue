<template lang="pug">
.flex.layout-column__between
  .demo  
    textarea#sqldemo(v-model="sqlStr" cols="120" rows="8")
    br
    el-button(@click="processSql") 生成模型json
    br
    textarea#sqldemo(v-model="resultSqlStr" readOnly="true" cols="120" rows="6")
  el-dialog(
    title="请输入模块名称"
    width="50%"
    :visible.sync="modalVisible"
    @close="cancelModal"
  )
    el-input(placeholder="请输入模块中文名" size="small" v-model="newTabName" style="margin-bottom: 20px;")
    el-input(placeholder="请输入模块英文名, 建议首字母大写并采用驼峰写法" size="small" v-model="newTabNameEn")
    span.dialog-footer(slot="footer")
      el-button(@click="cancelModal" size="small") 取 消
      el-button(@click="addTab" type="primary" size="small") 确 定
  el-dialog(
    title="选择Json文件"
    :visible.sync="jsonShow"
    @close="jsonShow=false"
  )
    a-upload-dragger(
      name="file"
      :remove="handleRemove"
      :fileList="jsonList"
      :beforeUpload="beforeUpload"
    )
      p.ant-upload-drag-icon
        a-icon(type="inbox")
      p.ant-upload-text 选择Json文件
      p.ant-upload-hint 请点击或拖拽Json文件
    .btn-group.right(style="margin-top:10px")
      el-button(
        @click="jsonShow = false"
        size="small"
      ) 取 消
      el-button(
        type="primary"
        @click="setJson"
        size="small"
      ) 确 定 
  el-tabs.flex.layout-column.model-tabs(
    closable
    addable
    v-model="activeTab"
    type="card"
    @tab-remove="removeTab"
    @edit="handleTabsEdit"
  )
    el-tab-pane(
      v-for="pane in panes"
      :label="pane.title"
      :name="pane.title"
      :closable="true"
    ) 
      .layout-row.flex.full-view
        model-list(
          :modelList="pane.modelList"
          @changeItemActive="changeItemActive"
          @addModel="addModel"
        )
        model-form(
          :form="form"
          v-show="!!form"
          @update="updateModel"
        )
  .btn-group.right
    el-button(
      type="text"
      @click="openJson"
    ) 导入Json文件并下一步
    a-button(
      style="margin:0 10px;"
      @click="toPrevious"
    ) 上一步
    a-button(
      type="primary"
      @click="toNext"
      :disabled="panes.length === 0"
    ) 下一步
</template>

<script>
const ipc = require('electron').ipcRenderer
import ModelList from './ModelList'
import ModelForm from './ModelForm'
import { constants, futimes } from 'fs';
export default {
  name: 'model-setting',
  components: {
    ModelList,
    ModelForm
  },
  created () {
    let self = this
    ipc.on('set-json-success', function (event, arg) {
      let data = JSON.parse(arg)
      self.$message.success('读取json数据成功')
      self.jsonShow = false

      self.$store.dispatch('updateJson', data)
      self.$store.dispatch('toNext')
      self.$router.push('/produce-code')
    })
  },
  data () {
    return {
      sqlStr: '',
      resultSqlStr: '',
      jsonList: [],
      jsonPath: '',
      jsonShow: false,
      modalVisible: false,
      activeTab: '',
      panes: [],
      newTabName: '',
      newTabNameEn: '',
      form: null
    }
  },
  
  watch: {
    panes: {
      handler: function (val) {
        if (val.length === 0) {
          this.form = null
          return false
        }
        this.$nextTick(() => {
          let pane = val.find((n) => n.title === this.activeTab)
          if (!pane.modelList[0]) {
            this.form = null
          } else {
            pane.modelList.map(item => {
              if (item.active) {
                this.form = _.cloneDeep(item.model)
              }
            })
          }
        })
      },
      deep: true
    }
  },
  methods: {
    processSql () {

      console.error(this.sqlStr)
      let tempStr = this.sqlStr.replace(/`/g,"")
      window.demoStr = tempStr
      let tempStrs = tempStr.split('\n')
      let objs = []
      console.error(tempStrs.length)
      tempStrs.forEach(item => {
        let obj = {
          "FK_Dict": "",
          "FK_Model": "",
          "dataType": "String",
          "displayName": "displayName",
          "length": "5",
          "name": "name",
          "type": "input",
          "validateOptions": "",
          "validateType": "not_null",
          "isSort": 0,
          "isShowInTable": 1,
          "isSearch": 0,
          "isRequired": 1
        }
        console.log('---')
        console.log(item)        
        let elements = item.split(' ')
        elements = elements.filter(function(item){
          return item.length > 0;
        })
        console.log(elements)
        let _name = elements[0]
        let _dataType = elements[1]
        if(_dataType.indexOf('int') >= 0){
          _dataType = 'Integer'
        }
        if(_dataType.indexOf('varchar') >= 0){
          _dataType = 'String'
        }
        if(_dataType.indexOf('date') >= 0){
          _dataType = 'Date'
        }
        if(_name.indexOf('_id') >= 0){
          _dataType = 'FK_Model'       
        }
        if(_name.indexOf('_dict_id') >= 0){
          _dataType = 'FK_Dict'
        }
        obj.name = _name
        obj.dataType = _dataType
        obj.displayName = _name
        if(elements.indexOf('COMMENT') >= 0){
          obj.displayName = elements[elements.length - 1]
        }
        console.log(obj)
        objs.push(obj)      
      })
      this.resultSqlStr = JSON.stringify(objs)
    },
    setJson () {
      ipc.send('set-json', this.jsonPath)
    },
    handleRemove (file) {
      this.jsonList = []
      this.jsonPath = ''
    },
    beforeUpload (file, fileList) {
      this.jsonList = [file]
      this.jsonPath = file.path
      return false
    },
    openJson () {
      this.jsonShow = true
    },
    updateModel (form) {
      let pane = this.panes.find((n) => n.title === this.activeTab)
      let model = pane.modelList.find((n) => n.active)
      model.model = _.cloneDeep(form)
      this.$message.success('模型配置成功')
    },
    addModel (data) {
      let item = this.panes.find((n) => n.title === this.activeTab)
      item.modelList.forEach(model => {
        model.active = false
      })
      data.active = true
      item.modelList.push(data)
    },
    changeItemActive (data) {
      data.data.map(item => {
        item.active = false
      })
      data.item.active = true
    },
    handleTabsEdit (targetName, action) {
      if (action === 'add') {
        this.add()
      }
    },
    removeTab (name) {
      const index = this.panes.findIndex((n) => n.title = name)
      this.panes.splice(index, 1)
    },
    addTab () {
      this.panes.push({
        title: this.newTabName,
        name: this.newTabNameEn,
        modelList: []
      })
      this.cancelModal()
      this.$nextTick(() => {
        this.activeTab = this.panes[this.panes.length - 1].title
      })
    },
    cancelModal () {
      this.modalVisible = false
      this.newTabName = ''
      this.newTabNameEn = ''
    },
    add () {
      this.modalVisible = true
    },
    toPrevious () {
      this.$store.dispatch('toPrevious')
      this.$router.push({
        path: '/choose-folder',
        name: 'choose-folder',
        params: {
          isSetFileList: true
        }
      })
    },
    toNext () {
      this.$store.dispatch('updateJson', this.panes)
      this.$store.dispatch('toNext')
      this.$router.push('/produce-code')
    }
  }
}
</script>

<style lang="scss" scoped>
.add {
  width: fit-content;
  position: absolute;
  right: 15px;
  z-index: 101;
}
.model-tabs {
  /deep/ .el-tabs__content{
    flex: 1;
    width: 100%;
    height: 100%;
    .el-tab-pane{
      width: 100%;
      height: 100%;
    }
  }
}
</style>

