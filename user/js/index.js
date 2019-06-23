var userId;
var userName;
$(function () {
    userId = $("#userId").val();
    userName = $("#userName").val();
    console.log("我是用户id", userId);
    console.log("我是用户name", userName);
    //首页大图 轮播
    $("#slider").responsiveSlides({
        auto: true,
        nav: true,
        speed: 500,
        namespace: "callbacks",
        pager: true,
    });
    //加载首页大图
    //$("#first").attr("src","http://localhost/15548622795139252150_134415115986_2.jpg");
    //加载购物车数量
    $("#goodsNum").text(getGoodsNum());
    var listPath = "/goods/list";
    //展示第一个
    showDiv(1, listPath, "grid1");
    //加载商品列表(男士女士图)
    $(".item1").click(function () {
        console.log("我是男士/女士");
        var shows = ["type1"];
        var hides = ["type2", "type3", "type4", "type5", "type6", "type7", "type8"];
        show(shows);
        hide(hides);
        clearDiv("grid1")
        showDiv(1, listPath, "grid1");
    })
    $(".item2").click(function () {
        console.log("我是儿童/玩具");
        var shows = ["type2"];
        var hides = ["type1", "type3", "type4", "type5", "type6", "type7", "type8"];
        show(shows);
        hide(hides);
        clearDiv("grid2")
        showDiv(2, listPath, "grid2");
    })
    $(".item3").click(function () {
        console.log("我是家电/数码");
        var shows = ["type3"];
        var hides = ["type2", "type1", "type4", "type5", "type6", "type7", "type8"];
        show(shows);
        hide(hides);
        clearDiv("grid3")
        showDiv(3, listPath, "grid3");
    })
    $(".item4").click(function () {
        console.log("我是游戏/动漫");
        var shows = ["type4"];
        var hides = ["type2", "type3", "type1", "type5", "type6", "type7", "type8"];
        show(shows);
        hide(hides);
        clearDiv("grid4")
        showDiv(4, listPath, "grid4");
    })
    $(".item5").click(function () {
        console.log("我是美食/零食");
        var shows = ["type5"];
        var hides = ["type2", "type3", "type4", "type1", "type6", "type7", "type8"];
        show(shows);
        hide(hides);
        clearDiv("grid5")
        showDiv(5, listPath, "grid5");
    })
    $(".item6").click(function () {
        console.log("我是工具/建材");
        var shows = ["type6"];
        var hides = ["type2", "type3", "type4", "type5", "type1", "type7", "type8"];
        show(shows);
        hide(hides);
        clearDiv("grid6")
        showDiv(6, listPath, "grid6");
    })
    $(".item7").click(function () {
        console.log("我是家具/家饰");
        var shows = ["type7"];
        var hides = ["type2", "type3", "type4", "type5", "type6", "type1", "type8"];
        show(shows);
        hide(hides);
        clearDiv("grid7")
        showDiv(7, listPath, "grid7");
    })
    $(".item8").click(function () {
        console.log("我是百货/家庭保健");
        var shows = ["type8"];
        var hides = ["type2", "type3", "type4", "type5", "type6", "type7", "type1"];
        show(shows);
        hide(hides);
        clearDiv("grid8")
        showDiv(8, listPath, "grid8");
    })
    //页面大小
    var menu_ul = $('.menu > li > ul'),
        menu_a = $('.menu > li > a');
    menu_ul.hide();
    menu_a.click(function (e) {
        e.preventDefault();
        if (!$(this).hasClass('active')) {
            menu_a.removeClass('active');
            menu_ul.filter(':visible').slideUp('normal');
            $(this).addClass('active').next().stop(true, true).slideDown('normal');
        } else {
            $(this).removeClass('active');
            $(this).next().stop(true, true).slideUp('normal');
        }
    });
})

var types = [];
//搜索商品
function search() {
    var name = $("#goodsName").val();
    if (!name) {
        types.forEach(function (value) {
            clearDiv("grid" + value);
        })
        var listPath = "/goods/list";
        //展示第一个
        showDiv(1, listPath, "grid1");
    }
    var data = ajaxSendData("/goods/get/name", {goodsName: name}, false);
    if (data) {
        var type = data.type;
        //添加到数组中,用来以后清空
        types.push(type);
        //先全部隐藏
        $("#types").children().each(function (i, n) {
            var obj = $(n).hide();
        })
        //再清空当前的div
        clearDiv("grid" + type);
        //再次渲染当前的产品
        var image = "http://localhost/" + data.previewImage;
        var simgle = data.name;
        var goodsId = data.id;
        var price = Math.floor(data.price) / 100;
        $("#grid" + type).append(appendDiv(image, simgle, price, goodsId))
        //展示当前div
        $("#type" + type).show();
    }
}


//get it 添加到购物车
function getIt(obj) {
    var goodId = obj.id;
    //查找购物车数量
    var data = ajaxSendData("/shoppingCart/get/shoppingCart", {goodsId: goodId}, false);
    if (data) {
        var param = {
            id: data.id,
            goodNum: data.goodNum + 1,
        }
        //添加购物车
        var res = ajaxSendData("/shoppingCart/update", param, false);
        if (res) {
            toastrAlert("success", "添加购物车成功")
        }
    } else {
        //如果没有
        var goodsName = $("#goodsName" + goodId).text();//商品名字
        var price = $("#priceId" + goodId).text().replace("/h", "");//商品价格
        var num = 1;
        var param = {
            goodId: goodId,
            goodNum: num,
            goodName: goodsName,
            goodsPrice: price,
            userId: userId
        }
        //添加购物车
        var datacart = ajaxSendData("/shoppingCart/save", param, false);
        if (datacart) {
            toastrAlert("success", "添加购物车成功")
        }
        reGoodsNum();
    }

}

//刷新购物车数量
function reGoodsNum() {
    $("#goodsNum").text(getGoodsNum());
}

//购物车数量
function getGoodsNum() {
    var data = ajaxSendData("/shoppingCart/list", {userId: Number(userId)}, false);
    if (!data) {
        return "(0)";
    } else
        return "(" + data.length + ")";
}

//当打开购物车的时候展示
$("#myModal").on('show.bs.modal', function () {
    var columns = [
        {"data": "goodName"},
        {"data": "goodNum"}];
    loadPageData("carTable", "/shoppingCart/page", columns, {userId: userId});
})

//购物车提交订单
$("#updateCart").click(function () {
    swal(
        {
            title: "您确定要提交订单?",
            text: "确认后无法回退，请谨慎操作！",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "确认提交！",
            cancelButtonText: "取消",
            closeOnConfirm: false,
            closeOnCancel: false
        },
        function (isConfirm) {
            if (isConfirm) {
                swal({
                    title: "操作成功！",
                    text: "购买成功。",
                    type: "success"
                }, function () {
                    //提交订单
                    var data = ajaxSendData("/order/save", {userId: userId}, false);
                    if (data) {
                        toastrAlert("success", "购买成功")
                    }
                    //关闭模拟框
                    $("#myModal").modal("hide");
                    reGoodsNum();
                })
            }
            else {
                swal({
                    title: "已取消",
                    text: "您取消了操作！",
                    type: "error"
                })
            }
        }
    )
})

//显示div
function show(data) {
    data.forEach(function (res) {
        $("#" + res).show();
    })
}

//隐藏div
function hide(data) {
    data.forEach(function (res) {
        $("#" + res).hide();
    })
}

//发送请求 渲染div内部内容
function showDiv(type, listPath, id) {

    var param = {
        type: type
    }
    var data = ajaxSendData(listPath, param, false);
    if (data) {
        for (var i = 0; i < data.length; i++) {
            var image = "http://localhost/" + data[i].previewImage;
            var simgle = data[i].name;
            var goodsId = data[i].id;
            var price = Math.floor(data[i].price) / 100;
            $("#" + id).append(appendDiv(image, simgle, price, goodsId))
            if (i != 0 && i % 2 == 0) {
                $("#" + id).append(interval());
            }
        }
    }
}

//渲染需要的元素
function appendDiv(image, simple, price, id) {
    var div = " <div class='col-md-4 top_grid1-box1'>\n" +
        "                            <div class='grid_1'>\n" +
        "                                <div class='b-link-stroke b-animate-go  thickbox' style='width: 242px;height: 151px'>\n" +
        "                                  <a href='/user/single?goodsId=" + id + "&userId=" + userId + "&userName=" + userName + "'><img src='" + image + "' class='img-responsive' alt='' style='width: 233px'/></a></div>\n" +
        "                                <div class='grid_2'>\n" +
        "                                    <p id='goodsName" + id + "'>" + simple + "</p>\n" +
        "                                    <ul class='grid_2-bottom'>\n" +
        "                                        <li class='grid_2-left'>\n" +
        "                                            <p id='priceId" + id + "'>" + price + "/h" +
        "                                            </p>\n" +
        "                                        </li>\n" +
        "                                        <li class='grid_2-right'>\n" +
        "                                            <div class='btn btn-primary btn-normal btn-inline ' target='_self' onclick='getIt(this)' id=" + id + " \n" +
        "                                                 title='Get It'>购物车\n" +
        "                                            </div>\n" +
        "                                        </li>\n" +
        "                                        <div class='clearfix'></div>\n" +
        "                                    </ul>\n" +
        "                                </div>\n" +
        "                            </div>\n" +
        "                        </a></div>"
    return div;
}

//渲染需要的间隔
function interval() {
    var div = " <div class=\"clearfix\"></div>"
    return div;
}

//清空div缓存
function clearDiv(id) {
    $("#" + id).empty();
}

//取出数组中的重复id
Array.prototype.getEle = function () {
    var newArr = this;
    var ids = []
    for (var i = newArr.length - 1; i >= 0; i--) {
        var targetNode = newArr[i];
        for (var j = 0; j < i; j++) {
            if (targetNode == newArr[j]) {
                newArr.splice(i, 1);
                ids.push(newArr[j])
                break;
            }
        }
    }
    return ids;
}

//删除重复
Array.prototype.deleteEle = function () {
    var newArr = this;
    for (var i = newArr.length - 1; i >= 0; i--) {
        var targetNode = newArr[i];
        for (var j = 0; j < i; j++) {
            if (targetNode == newArr[j]) {
                newArr.splice(i, 1);
                break;
            }
        }
    }
    return newArr;
}