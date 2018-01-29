/// <reference path="../typings/globals/jquery/index.d.ts" /> //Use Jquery Intelisence in vscode

$(function(){
    var page = $('#section01 ul').data('page') || 1;  //page inital
    var PAGE_LIMIT = 2;
    var content =[
        {
            img_url : "./images/option_icon.png",
            title : "빠른속도와 안정성",
            content : "인터넷이 연결된 <br>어떤 곳에서도 <br>빠르고 안전하게 <br>원격제어가 가능합니다."
        },
        {
            img_url : "./images/folder_icon.png",
            title : "편리한 파일 전송",
            content : "파일 송수신을 위한 <br>FTP형식의 Drag &amp;Drap을 <br>지원합니다."
        },
        {
            img_url : "./images/phone_icon.png",
            title : "모바일 원격제어",
            content : "Iphone, Android, Windows Mobile 스마트폰을 통해 원격 PC 제어가 가능합니다."
        },
        {
            img_url : "./images/shield_icon.png",
            title : "완벽한 보안",
            content : "원격PC와 주고 받는 모든 데이터는 SSL을 통해 암호화되어 통신합니다."
        }];

    var result = chunkArray(content, PAGE_LIMIT);    //divide content array

    $('.prev').on('click', function(e){
        page--;
        renderSlider(result[Math.abs(page-1) % PAGE_LIMIT]);
    });

    $('.next').on('click', function(e){
        page++;
        renderSlider(result[Math.abs(page-1) % PAGE_LIMIT]);
    });

    function chunkArray(myArray, chunk_size){
        var data = [];
        var i = 0;
    
        while(i < myArray.length){
            data.push(myArray.slice(i, i = i + chunk_size));
        }
    
        return data;
    }

    function renderSlider(datas){
        var html = datas.map(ListTemplate).join('')
        $('#section01 ul').html(html)
    }

 function ListTemplate(data){
     //#section01
        //ul
            //li
                //figure
                    //img
                //.notice
                //h3
                //p
    return ['<li>',
                        '<figure>',
                            '<img src="'+data.img_url+'" alt="'+data.title+'">',
                        '</figure>',
                        '<div class="notice">',
                        '<h3>' + data.title + '</h3>',
                        '<p>'+data.content+'</p>',
                        '</div>',
        '</li>'].join('');
    }
});


