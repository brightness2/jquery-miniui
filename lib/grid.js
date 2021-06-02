/*
 * @Author: Brightness
 * @Date: 2020-03-22 15:30:55
 * @LastEditors: Brightness
 * @LastEditTime: 2021-06-02 12:59:09
 * @Description: 基于miniui 的表格对象
 */

/**
 * 表格对象
 * @param       {Object} grid                             miniui 的表格对象
 * @param       {String} url                              表格数据请求url
 * @param       {String} [idField=null]              唯一字段 存在时，添加数据会检验数据是否存在
 * @param       {Number} [pageSize=18]                    每页显示多数行
 * @param       {Array}  [sizeList=[50,100,200,500]]       每页显示选项
 * @param       {String} [dataField='data.result.data']   数据子字段
 * @param       {String} [totalField='data.result.total'] 总条数字段
 * @constructor
 */
function Grid(
  grid,
  url,
  idField = null,
  pageSize = 50,
  sizeList = [50, 100, 200, 500],
  dataField = "data.result.data",
  totalField = "data.result.total"
) {
  (this.grid = grid),
    (this.config = {
      url: url,
      idField: idField,
      dataField: dataField,
      totalField: totalField,
      emptyText: "暂无数据",
      showEmptyText: true,
      allowResize: true,
      sizeList: sizeList,
      pageSize: pageSize,
      columns: {},
      editNextOnEnterKey: true,
      allowAlternating: true, //显示间行色
      multiSelect: true,
      allowUnselect: true,
      fitColumns: false, //使用过滤行必须设定这个全充满，否则会有列对齐问题。
      allowCellEdit: false,
      allowCellSelect: true,
      showFilterRow: false,
      showModified: true,
      allowMoveColumn: false,
      allowSortColumn: false,
    });

  /**
   * 初始化表格
   * @param {*} columns
   * @param {*} config
   * @param {*} load
   * @returns
   */
  this.init = function (columns, config = null, isLoad = true) {
    var gridConfig = this.config;
    if (null != config) {
      if ("object" != typeof config) {
        console.error("Grid init error: " + config + "not a json object");
        return;
      }
      // 合并和替换配置
      gridConfig = Object.assign(gridConfig, config);
    }
    gridConfig.columns = columns;
    this.grid.set(gridConfig);

    if (isLoad) this.grid.load();
  };
}

/**
 * 删除表格勾选的数据
 * @return {[type]} [description]
 */
Grid.prototype.removeSelecteds = function () {
  var grid = this.grid;
  var rows = grid.getSelecteds();
  if (0 >= rows.length) {
    mini.alert("请勾选行");
    return false;
  }
  mini.confirm("请确定是否要移除记录", "删除记录", function (action) {
    if ("ok" == action) {
      grid.removeRows(rows);
    }
  });
};

/**
 * 根据主键选中数据
 * @param  {Array}   [ids=[]]           主键值
 * @param  {[type]}  [idField=null]    	主键
 * @param  {Boolean} [returnRows=false] 是否返回选中的数据
 * @param  {Boolean} [fireEvent=false]  是否激发选择事件，miniui的事件
 * @return {[type]}                     [description]
 */
Grid.prototype.selectByField = function (
  ids = [],
  idField = null,
  returnRows = false,
  fireEvent = false
) {
  var grid = this.grid;
  var rows = [];
  ids.forEach(function (id) {
    var row = grid.findRow(function (row) {
      if (row[idField] == id) return true;
    });
    if (row) {
      grid.select(row, fireEvent);
      rows.push(row);
    }
  });
  if (returnRows) {
    return rows;
  } else {
    return true;
  }
};

/**
 * 动态切换显示的列
 * @param {*} cols
 */
Grid.prototype.setShowCols = function (cols = []) {
  var grid = this.grid;
  for (let col of grid.columns) {
    if (col.type === "indexcolumn" || col.type === "checkcolumn") {
      continue;
    }
    col.visible = false;
    for (let i of cols) {
      if (i === col.field) {
        col.visible = true;
      }
    }
  }
  grid.set({ columns: grid.columns });
};

/**获取当前页数据 */
Grid.prototype.getCurrPageData = function () {
  let grid = this.grid;
  let multiSelect = grid.multiSelect;
  grid.select({ multiSelect: true });
  grid.selectAll();
  let data = grid.getSelecteds();
  grid.deselectAll();
  grid.set({ multiSelect: multiSelect });
  return data;
};

/**获取当前显示的列 */
Grid.prototype.getShowCols = function () {
  let cols = this.grid.columns;
  let arr = [];
  for (const col of cols) {
    if (col.visible === true) {
      arr.push(col);
    }
  }

  return arr;
};

/**生成打印表格 */
Grid.prototype.rendenPrintTable = function (title = "打印") {
  let data = this.getCurrPageData();
  let cols = this.getShowCols();
  let showCols = [];

  let table = `<table width="96%" class="table">`;
  table += "<caption> <h2>" + title + "</h2> </caption>";

  //表头
  let headHtml = `<thead><tr>`;
  for (const col of cols) {
    if (col.type != "indexcolumn" && col.type != "checkcolumn") {
      headHtml += " <th>" + col.header + "</th>";
      showCols.push(col);
    }
  }
  headHtml += "</tr></thead>";
  table += headHtml;

  //表格数据
  let dataHtml = ``;
  for (const row of data) {
    dataHtml += "<tr>";
    for (const item of showCols) {
      let val = row[item.field] ? row[item.field] : "";
      if (typeof val.getFullYear == "function") {
        val =
          val.getFullYear() + "-" + (val.getMonth() + 1) + "-" + val.getDate();
      }
      if (typeof val != "string" && typeof val != "number") {
        val = "";
      }
      dataHtml += "<td>" + val + "</td>";
    }
  }

  table += dataHtml;
  table += `</table>`;

  return table;
};

/**
 * 打印
 */
Grid.prototype.print = function (html) {
  let tpl = `<style>
 html, body{
 margin:0;padding:0;border:0;width:100%;height:100%;overflow:hidden;
}
form {
 display: inline;
}

   @media print{
     .NoPrint{
       display: none;
     }

     .NextPage{
       page-break-after: always;
     }
     /*  */
     .table{
         border-collapse: collapse;
         margin: 0 auto;
         text-align: center;
         page-break-inside:auto;
         table-layout:fixed; 
         word-break: break-all; 
         word-wrap: break-word;
     }

     table tr{
       page-break-inside:auto;
     }

     table td, table th
     {
         border: 1px solid #cad9ea;
         color: #666;
         height: 1.2cm;
         font-weight: lighter;
     }

     table thead th
     {
       width: 4cm;
       height: 1.4cm;
       font-size: 0.6cm;
       font-weight:bold;
     }
     table td {
       padding: 0.2cm;
     }
   }
 </style>

 `;
  tpl = tpl + html;
  let ifrm = $("<iframe id='print-iframe' style='display:none;'> </iframe>");
  $("body").append(ifrm);
  let printIframe = document.getElementById("print-iframe");
  printIframe.contentWindow.document.body.innerHTML = tpl;
  printIframe.contentWindow.print();
  printIframe.remove();
};
