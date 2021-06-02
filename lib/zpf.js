/*
 * @Author: Brightness
 * @Date: 2021-06-01 15:36:59
 * @LastEditors: Brightness
 * @LastEditTime: 2021-06-02 13:39:44
 * @Description:
 */
var zpf = {
  /**
   * 操作请求
   * @param string url 请求接口
   * @param object data 数据对象
   * @param function successFunc 请求成功的回调
   * @param function failFunc 请求失败的回调
   * @param string type 请求方式 get/post
   * @param bool cache 是否缓存
   **/
  ajaxRequest: function (
    url,
    data,
    successFunc,
    failFunc,
    type = "post",
    cache = false
  ) {
    $.ajax({
      url: url,
      type: type,
      data: data,
      cache: cache,
      success: function (rs) {
        if (200 == rs.ret) {
          if (0 == rs.data.code) {
            successFunc && successFunc(rs.data.result);
          } else {
            failFunc && failFunc(rs.data.errmsg);
          }
        } else {
          failFunc && failFunc(rs.msg);
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        mini.alert(jqXHR.responseText);
      },
    });
  },
  /**
   * 表单数据检验
   * @param  {Object} form miniui form 对象
   * @return {[type]}      [description]
   */
  validateForm: function (form) {
    if (!form) {
      console.error("checkForm not miniui form object");
      return;
    }
    var isvalid = form.validate();
    if (!isvalid) {
      mini.alert(form.getErrorTexts());
    }
    return isvalid;
  },

  /**
   * 打印
   */
  print: function (html) {
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
  },
};
