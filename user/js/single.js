var id;
var userName;
$(function () {
    var localhost = "http://localhost/"
    //获取信息
    id = Number($("#goodsId").val());
    userName = $("#userName").val();
    var path = "/goods/get";
    var param = {
        goodsId: id
    };
    var goods = ajaxSendData(path, param, false);
    if (goods) {
        //商品名
        $("#goodsName").html(goods.name);
        //介绍图
        var referral = localhost + goods.referralImage;
        var datails = goods.detailImage.split(",");
        //详情图
        var simplenessImages = [];
        datails.forEach(function (value) {
            simplenessImages.push(localhost + value);
        })
        //简介
        var simplenessDetail = goods.simplenessDetail;
        //详情
        var detail = goods.detail;
        /*-----赋值------*/
        //简介
        $("#goodsSimgle").html(simplenessDetail);
        //详情
        $("#detail").text(detail);
        //第一个图
        $("#original").attr("src", referral);
        $("#magnify").attr("src", referral);
        //详情图
        for (var i = 0; i < simplenessImages.length; i++) {
            $("#detailImage" + i).attr("src", simplenessImages[i]);
            console.log("我是第" + i + "个", simplenessImages[i])
        }
    }
    //价格
    $("#price").text("¥" + (goods.price / 100).toFixed(2));
    //查询用户评价
    refreshAppraise();
    //下面产品的样式
    $('#horizontalTab').easyResponsiveTabs({
        type: 'default', //Types: default, vertical, accordion
        width: 'auto', //auto or any width like 600px
        fit: true   // 100% fit in a container
    });
    //大图的放大镜
    $('#etalage').etalage({
        thumb_image_width: 300,
        thumb_image_height: 400,
        source_image_width: 900,
        source_image_height: 1200,
        show_hint: true,
        click_callback: function (image_anchor, instance_id) {
            alert('Callback example:\nYou clicked on an image with the anchor: "' + image_anchor + '"\n(in Etalage instance: "' + instance_id + '")');
        }
    });
    //返回首页
    $("#reIndex").attr("href", " /store/index?userId=" + id + "&userName=" + userName);
    //购物车
    $("#goodsNum").text(getGoodsNum());
})

//get it 添加到购物车
function getIt() {
    //查找购物车数量
    var data = ajaxSendData("/shoppingCart/get/shoppingCart", {goodsId: id}, false);
    if (data) {
        var param = {
            id: data.id,
            goodNum: data.goodNum + 1,
        }
        //添加购物车
        var nocart = ajaxSendData("/shoppingCart/update", param, false);
        if (nocart) {
            toastrAlert("success", "添加购物车成功")
        }
    } else {
        //如果没有
        var goodsName = $("#goodsName" + id).text();//商品名字
        var price = $("#priceId" + id).text().replace("/h", "");//商品价格
        var param = {
            goodId: id,
            goodNum: $("#nums").val(),
            goodName: $("#goodsName").text(),
            goodsPrice: $("#price").text().replace("¥", ""),
            userId: Number($("#userId").val())
        }
        //添加购物车
        var aldata = ajaxSendData("/shoppingCart/save", param, false);
        if (aldata) {
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
    var data = ajaxSendData("/shoppingCart/list", {userId: Number($("#userId").val())}, false);
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
    loadPageData("carTable", "/shoppingCart/page", columns, {userId: Number($("#userId").val())});
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
                    var data = ajaxSendData("/order/save", {userId: Number($("#userId").val())}, false);
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

//直接提交订单
$("#saveOrder").click(function () {
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
                    var data = ajaxSendData("/order/save/goods", {
                        goodsId: id,
                        userId: Number($("#userId").val()),
                        userName: ($("#userName").val()),
                        num: Number($("#nums").val())
                    }, false);
                    if (data) {
                        //用户
                        var src = "http://localhost:8080/store/index?userId=" + $("#userId").val() + "&userName=" + $("#userName").val()
                        window.location.href = src;
                        window.event.returnValue = false
                    }
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

//渲染用户评价
function refreshAppraise() {
    //查询用户评价
    var evaluateList = ajaxSendData("/evaluate/list", {id: id}, false)
    //渲染用户评价
    for (var i = 0; i < evaluateList.length; i++) {
        $("#evaluateId").append("<li><a href='#'>用户[" + evaluateList[i].userName + "]:" + evaluateList[i].detail + "</a></li>")
    }
}

//保存用户评价
function saveAppraise() {
    var param = {
        goodId: id,
        userId: Number($("#userId").val()),
        detail: $("#appraiseDetail").val(),
        userName: $("#userName").val()
    }
    var data = ajaxSendData("/evaluate/save", param, false);
    if (data) {
        //关闭模拟框
        $("#modal").modal("hide");
        //先清空
        $("#evaluateId").html("");
        //后刷新
        refreshAppraise();
    }
}