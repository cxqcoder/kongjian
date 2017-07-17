/**
 * Created by Administrator on 2017/6/27.
 */
$(function () {
    $(".dir").hover(function () {
        $(this).find(".isshow").css("display","block");
    },function () {
        $(this).find(".isshow").css("display","none");
    })
    var h=window.screen.availHeight+"px";
    $(".mask").css("height",h);
    $(".createdir").click(function () {
        var open=true;
        if(open){
            $(".mask").css("display","block");
            open=!open;
        }
    })
    $(".pho").hover(function () {
        console.log("111");
        $(this).find(".fm").css("display","block");

    },function () {
        $(this).find(".fm").css("display","none");
    })
});