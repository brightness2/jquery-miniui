/*
 * @Author: Brightness
 * @Date: 2021-06-01 16:14:10
 * @LastEditors: Brightness
 * @LastEditTime: 2021-06-01 16:14:10
 * @Description:
 */
/*
 * miniui Grid自定义数据列
 * 参考：http://miniui.com/docs/api/index.html#ui=datagrid
 * Name    Type    Description Default
 *  type            indexcolumn|checkcolumn|checkboxcolumn|comboboxcolumn|treeselectcolumn  列类型。创建几个特殊的列。
 *  header          String  表头列文本
 *  field           String  单元格值字段
 *  displayField    String  单元格文本字段
 *  sortField       String  排序字段
 *  name            String  列标识名称
 *  width           Number  列宽度
 *  visible         Boolean 是否显示
 *  hideable        Boolean 是否在表头菜单项显示  false
 *  readOnly        Boolean 是否只读    false
 *  headerAlign     String  表头列文本位置。left/center/right。  left
 *  align           String  单元格文本位置。left/center/right。  left
 *  headerCls       String  表头列样式类。
 *  cellCls         String  单元格样式类
 *  headerStyle     String  表头列样式
 *  cellStyle       String  单元格样式
 *  editor          Object  单元格编辑器。
 *  renderer        Function    单元格绘制处理函数，同drawcell事件。
 *  allowMove       Boolean 是否可移动表头列。   true
 *  allowResize     Boolean 是否拖拽调节表头列宽度。    true
 *  autoShowPopup   Boolean 编辑时是否自动显示下拉框。   false
 *  dataType        string|int|float|date|boolean|currency  数据类型，为客户端排序所用。  string
 *  currencyUnit    String  货币单位。当dataType="currency"有用。如：￥432,432.00。
 *  dateFormat      String  日期格式化。如：yyyy-MM-dd HH:mm:ss。
 *  numberFormat    String  数字格式化。如：
 *                          小数点和千分位：format="n"
 *                          货币格式：format="c"。
 *                          百分比格式：format="p"。
 *                          自定义格式：format="¥#,0.00"。
 *  vtype           String  验证规则，如required,email,url等。具体参考这里。   false http://miniui.com/demo/form/rules.html
 *  summaryType     count|min|max|sum|avg   汇总计算类型。
 *  summaryRenderer Function    汇总单元格渲染函数。
 *  autoEscape      Boolean     是否自动转义Html。 false
 *  decimalPlaces   Number  保留的小数位数，默认2位。
 *
 *  参考：http://miniui.com/docs/tutorial/datagrid_columns.html
 *  Name Type  Description Default
 *   header      String  表头列文本
 *   field       String  单元格值字段
 *   name        String  列标识名称
 *   width       Number  列宽度
 *   headerAlign String  表头列文本位置。left/center/right。  left
 *   align       String  单元格文本位置。left/center/right。  left
 *   headerCls   String  表头列样式类。
 *   cellCls     String  单元格样式类
 *   headerStyle String  表头列样式
 *   cellStyle   String  单元格样式
 *   editor      Object  单元格编辑器。
 *   renderer    Function  单元格绘制处理函数，同drawcell事件。
 *   allowMove   Boolean 是否可移动表头列。 true
 *   allowResize Boolean 是否拖拽调节表头列宽度。  true
 */
// mw = miniuiWrapper Class
var mwColumns = {
  __retColumns: [],

  createBlank: function () {
    var ret = {
      type: "",
      header: "",
      field: "",
      displayField: "",
      sortField: "",
      name: "",
      width: 100,
      visible: true,
      hideable: false,
      readOnly: false,
      headerAlign: "left",
      align: "left",
      headerCls: "",
      cellCls: "",
      headerStyle: "",
      cellStyle: "",
      editor: null,
      renderer: null,
      allowMove: true,
      allowResize: true,
      autoShowPopup: false,
      dataType: "string",
      currencyUnit: "",
      dateFormat: "yyyy-MM-dd",
      numberFormat: "n",
      vtype: "",
      summaryType: "",
      summaryRenderer: null,
      autoEscape: false,
      decimalPlaces: null,
    };

    return ret;
  },

  addIndexCol: function () {
    var ret = { type: "indexcolumn" };
    this.__retColumns.push(ret);
  },

  addCheckCol: function () {
    var ret = { type: "checkcolumn" };
    this.__retColumns.push(ret);
  },

  addCheckBoxCol: function (
    sName,
    sField,
    sHeader,
    iWidth,
    sTrueValue,
    sFalseValue
  ) {
    var ret = {
      type: "checkboxcolumn",
      field: sField,
      header: sHeader,
      width: iWidth,
      trueValue: sTrueValue,
      falseValue: sFalseValue,
      headerAlign: "center",
    };
    this.__retColumns.push(ret);
  },

  footer: function (type, renderer) {
    var ret = {
      sumType: "sum",
      sumRenderFunc: undefined,
    };

    if (type != undefined && type != "sum") ret.sumType = type;

    if (typeof renderer === "function") ret.sumRenderFunc = renderer;

    return ret;
  },

  addCol: function (
    sField,
    sHeader,
    iWidth,
    sDisplayField,
    sDisplayFormat,
    bAllowSort,
    bUseFooter,
    oFooter
  ) {
    var ret = this.createBlank();
    ret.name = sField;
    ret.field = sField;
    ret.displayField = sDisplayField;
    ret.header = sHeader;
    ret.width = iWidth;
    ret.numberFormat = sDisplayFormat;
    ret.allowSort = bAllowSort == false ? false : true;
    ret.headerAlign = "center";
    if (sDisplayField == "" || sDisplayField == undefined) {
      ret.editor = {
        type: "textbox",
      };
    }
    if (bUseFooter) {
      ret.summaryType = oFooter.sumType;
      ret.summaryRenderer = oFooter.sumRenderFunc;
    }
    this.__retColumns.push(ret);
    return this.__retColumns[this.__retColumns.length - 1];
  },

  createAddCol: function (
    sField,
    sHeader,
    iWidth,
    sDisplayField,
    sDisplayFormat,
    bAllowSort,
    bUseFooter,
    oFooter
  ) {
    var ret = this.createBlank();
    ret.name = sField;
    ret.field = sField;
    ret.displayField = sDisplayField;
    ret.header = sHeader;
    ret.width = iWidth;
    ret.numberFormat = sDisplayFormat;
    ret.allowSort = bAllowSort == false ? false : true;
    ret.headerAlign = "center";
    if (sDisplayField == "" || sDisplayField == undefined) {
      ret.editor = {
        type: "textbox",
      };
    }
    if (bUseFooter) {
      ret.summaryType = oFooter.sumType;
      ret.summaryRenderer = oFooter.sumRenderFunc;
    }
    return ret;
  },
  get: function () {
    return this.__retColumns;
  },

  /*
   *  ZPF字段类型转换成miniui Grid数据列的dataType
   *
   *  const FT_UNKNOWN     = -1;
   *	const FT_NULL        = 0;
   *	const FT_INT         = 1;
   *	const FT_STRING      = 2;
   *	const FT_FLOAT       = 3;
   *	const FT_DATE        = 4;
   *	const FT_TIME        = 5;
   *	const FT_DATETIME    = 6;
   *	const FT_MEMO        = 7;
   *	const FT_BINARY      = 8;
   *
   * dataType值：
   * string|int|float|date|boolean|currency
   */
  zpfFieldTypeToDataType: function (zpf_fieldType) {
    var ret = undefined;
    switch (zpf_fieldType) {
      case 1:
        ret = "int";
        break;
      case 2:
        ret = "string";
        break;
      case 3:
        ret = "float";
        break;
      case 4:
      case 5:
      case 6:
        ret = "date";
        break;
      case 0:
      case 7:
      case 8:
      default:
        ret = "";
        break;
    }

    return ret;
  },
};
