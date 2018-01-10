"use strict";

//dom on ready
$(document).ready(function(){
    $('#loginFrm').submit(function(){
        alert("submit");
    });
    $('input').click(function(){
        alert(this);
    });
});

function validationForm(){

}

function foo(){
    alert("fopo");
}


//포커싱 후 벨리데이션 체크
//포커싱 후 널값이면 attr-invalid=true 체크
//널값이 아니면 사용자 속성값 없어짐

