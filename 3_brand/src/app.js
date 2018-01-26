/// <reference path="../typings/globals/jquery/index.d.ts" />

$(function(){
    var page = 1;
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

    page = $('#section01 ul').attr('data-page'); //page inital

    var result = chunkArray(content, 2);    //divide content array

    $('.prev').on('click', function(e){
        prev();
    });

    $('.next').on('click', function(e){
        next();
    });

function chunkArray(myArray, chunk_size){
    var data = [];

    while(myArray.length){
        data.push(myArray.splice(0, chunk_size));
    }

    return data;
}

function showSlider(datas){
    for(var i =0;i<datas.length;i++){
        ListTemplate(datas[i]);
    }
}

function prev(){
    Math.abs(page++);
    $('#section01 ul').html(''); //delete static data 
    showSlider(result[page%PAGE_LIMIT]);
     
}

function next(){
    Math.abs(page++);
    $('#section01 ul').html(''); //delete static data 
    showSlider(result[page%PAGE_LIMIT]);
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
    var content = $(['<li>',
                        '<figure>',
                            '<img src="'+data.img_url+'" alt="'+data.title+'">',
                        '</figure>',
                        '<div class="notice">',
                        '<h3>' + data.title + '</h3>',
                        '<p>'+data.content+'</p>',
                        '</div>',
        '</li>'].join('\n'));

        content.appendTo('#section01 ul');
    }
});


