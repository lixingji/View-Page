/**
 * 任务管理
 * @author 黎兴济
 * @since 2016-6-6
 */
//请求url
var url = preUrl + "Admin/EpCenter/managementTask";
var pageSize = 10;//每页条数，默认10条
var vm = new Vue({
    // 在 `el` 中定义元素
    el: '#app',
    // 在 `data` 对象中定义数据
    data: {
        datas: []
    },
    // 在 `methods` 对象中定义方法
    methods: {
        //查询任务列表
        queryTaskList: function (name, p) {
            p = p ? p : 1;//当前页 默认为1
            //上传参数
            var params = {
                'taskType': name,
                'p': p,
                'pageSize': pageSize
            }
            var self = this;//保存当前对象
            $(".taskDetail").show();
            $(".taskDetail").next("div").hide();
            var success_callback = function (result) {
                if (result != null && result.result.state == 0) {
                    self.datas = result.data;
                    //count数据记录总条数, pageSize每页显示条数 默认10条, p当前页, showSize每页显示的页数, params上传参数
                    $pageNatation = mPage.pageTpl(result.count, pageSize, p, 6, params);
                    $(".pagination").html($pageNatation);
                } else {
                    $(".taskDetail").hide();
                    $(".taskDetail").next("div").show();
                }
            }
            //发起json请求
            postRequest(url, params, success_callback);
        },
        //操作  1开启/关闭  -1删除
        operation: function (op, index) {
            var taskId = this.datas[index].id;
            var isopen = this.datas[index].isopen == 0 ? 1 : 0;//1重新开启  0关闭
            var operation = op;// 1开启/关闭  -1删除 0审核
            var self = this;//保存当前对象
            //发起json请求
            postRequest(url, {taskId: taskId, isopen: isopen, operation: operation}, function (result) {
                if (result.state == 0) {
                    if (operation == -1) {
                        self.datas.splice(index, 1);//删除当前数据
                    }
                    else if (operation == 1) {
                        self.datas[index].isopen = isopen;//更新当前状态数据
                    }
                    alert(result.description);
                } else if (result.state == 2) {
                    location.href = preUrl + "Admin/EpCenter/auditTask";
                } else {
                    //alert("操作失败！");
                }
            });
        }
    }
});
// 初始化任务列表表格
vm.queryTaskList("STUDY");


//医药宝任务获取分页数据 jump跳转的页码  params参数
function getPageData(jump, params) {
    vm.queryTaskList(params.taskType, jump);
}