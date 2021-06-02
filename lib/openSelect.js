/*
 * @Author: Brightness
 * @Date: 2020-08-13 09:15:36
 * @LastEditors: Brightness
 * @LastEditTime: 2021-06-02 14:01:45
 * @Description:  表格选择框,需要定制修改
 */

/**
 * 弹出选择框
 * @param {string} dbObj 后台 dbobj 对象
 * @param {string} idField  唯一键
 * @param {function} callBack 回调方法
 * @param {string} params 请求参数   &param=p
 * @param {boolean} multiSelect 是否多选
 * @param {array} columns 显示的列 mwColumns
 * @param {string} title 弹框标题
 * @param {number} width 弹框宽度
 * @param {number} height 弹框高度
 * @param {string} api 数据访问的接口
 * @param {string} apiFunc 数据访问的接口方法
 */
function miniuiOpenSelect(
  dbObj,
  idField,
  callBack = null,
  params = "",
  multiSelect = false,
  columns = null,
  title = "选择框",
  width = 600,
  height = 600,
  api = "Example_Base",
  apiFunc = "getList"
) {
  if ("function" != typeof callBack) {
    console.error("openSelect function callBack not a function");
    return;
  }
  mini.open({
    targetWindow: window, //页面对象。默认是顶级页面。
    url: "./lib/template/openSelect.html", //页面地址
    title: title, //标题
    width: width, //选择框宽度
    height: height, //选择框高度
    //加载弹框时触发
    onload: function () {
      var iframe = this.getIFrameEl();
      var contentWindow = iframe.contentWindow;
      contentWindow.SetGrid(
        dbObj,
        idField,
        params,
        api,
        apiFunc,
        columns,
        multiSelect
      );
    },
    //销毁弹框时触发
    ondestroy: function (acticon) {
      if ("ok" == acticon) {
        var iframe = this.getIFrameEl();
        var contentWindow = iframe.contentWindow;
        selectData = contentWindow.GetData();
        selectData = mini.clone(selectData); //必须
        callBack && callBack(selectData);
      }
    },
  });
}
///////////////////////////////////////////////////////
/**
 * 控件调用 弹出选择框
 * @desc 以下参数 都定义在 控件 的 data-options 属性上
 * @param {string} edbObj 后台 dbobj 对象
 * @param {string} idField  唯一键
 * @param {function} callBack 回调方法
 * @param {string} params 请求参数   &param=p
 * @param {boolean} multiSelect 是否多选
 * @param {array} columns 显示的列 mwColumns
 * @param {string} title  弹框标题
 * @param {number} selWidth 弹框宽度
 * @param {number} selHeight 弹框高度
 * @param {string} api 数据访问的接口
 * @param {string} apiFunc 数据访问的接口方法
 *
 */
function miniuiButtonClick(e) {
  var sender = e.sender;
  miniuiOpenSelect(
    sender.dbObj,
    sender.idField,
    sender.callBack,
    sender.params || "",
    sender.multiSelect || false,
    sender.columns || null,
    sender.title || "选择框",
    sender.selWidth || 600,
    sender.selHeight || 600,
    sender.api || "Example_Base",
    sender.apiFunc || "getList"
  );
}
///////////////////////////////////////////////////////
/**
 * buttonedit 组件 点击事件
 * @desc 以下参数 都定义在 控件 的 data-options 属性上
 * @param {string} edbObj 后台 dbobj 对象
 * @param {string} idField  值字段
 * @param {string} textField  显示字段
 * @param {function} callBack 回调方法
 * @param {string} params 请求参数   &param=p
 * @param {boolean} multiSelect 是否多选
 * @param {array} columns 显示的列 mwColumns
 * @param {string} title  弹框标题
 * @param {number} selWidth 弹框宽度
 * @param {number} selHeight 弹框高度
 * @param {string} api 数据访问的接口
 * @param {string} apiFunc 数据访问的接口方法
 */
function miniuiButtonEditClick(e) {
  var btnEdit = this;
  var sender = e.sender;
  if (!sender.idField) {
    console.error("buttonEditClick no idField attribute");
    return;
  }
  if (!sender.textField) {
    console.error("buttonEditClick no textField attribute");
    return;
  }

  //把数据设置到 buttonedit 组件上
  function setData(data) {
    btnEdit.setValue(data[0][sender.idField]);
    btnEdit.setText(data[0][sender.textField]);
  }

  //buttonEdit 弹出选择框默认回调方法
  var callBack = function (data) {
    sender.callBack && sender.callBack(data);
    setData(data);
    btnEdit.doValueChanged(); //必须添加，否则无法触发valuechanged事件
  };

  //调用 弹框方法
  miniuiOpenSelect(
    sender.dbObj,
    sender.idField,
    callBack,
    sender.params || "",
    sender.multiSelect || false,
    sender.columns || null,
    sender.title || "选择框",
    sender.selWidth || 600,
    sender.selHeight || 600,
    sender.api || "Example_Base",
    sender.apiFunc || "getList"
  );
}
