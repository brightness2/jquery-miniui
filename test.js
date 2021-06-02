/*
 * @Author: Brightness
 * @Date: 2021-06-01 16:29:10
 * @LastEditors: Brightness
 * @LastEditTime: 2021-06-02 13:59:20
 * @Description:
 */
mini.parse();
let grid = mini.get("grid1");
mwColumns.addIndexCol();
mwColumns.addCheckCol();
mwColumns.addCol("name", "姓名");
mwColumns.addCol("name2", "姓名2");
mwColumns.addCol("name3", "姓名3");

let cols = mwColumns.get();

let obj = new Grid(grid, null, "name");

obj.init(cols);
grid.addRow({ name: "test", name2: "test2", name3: "test3" });
obj.setShowCols(["name", "name2", "name3"]);
let table = obj.rendenPrintTable();
// zpf.print(table);
