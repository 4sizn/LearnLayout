"use strict";

//dom on ready
$(document).ready(function(){
    $('#loginFrm').submit(function(){
        return validationForm();
    });

    $('#regFrm').submit(function(){
         return validationForm(()=>validationRadio());
    });
    
    $('input').focusin(function(){
        if(this.value == ''){
            validationTooltip(this.id, true);
        }
    }).focusout(function(){
        if(this.value == ''){
            $(this).attr('data-invalid', true);
        }
        else{
            $(this).removeAttr('data-invalid');
        }
        validationTooltip(this.id, false);
    });
});

function validationTooltip(id, flag){
if(id === 'undefined'){
    console.log(Function.name + 'is undefunded');
    return;
}
    $('.content_layer_pointer').each(function(){
        if($(this).attr('data-target') === id)
        {
            console.log("validation tooltip" + id);
            $(this).attr('data-focus', flag);
        }
    });
}

function validationForm(){
    return validateRadio();
        //성
        //이름
        //휴대폰 번호 또는 이메일
        //새비밀번호
        //생일
        //성
        //---아니면 Validate-data 변경---
    return false;
}

function validateRadio(){
    var radios = $(this).children('input[type=radio]');
    console.log(radios);

    return true;
}

function validateEmail(inputText)  
{  
    var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;  

            if(inputText.value.match(mailformat))  
            {  
                document.form1.text1.focus();  
                return true;  
            }  
            else  
            {  
                alert("You have entered an invalid email address!");  
                document.form1.text1.focus();  
                return false;  
            }  
}  
//포커싱 후 벨리데 체크
//포커싱 후 널값이면 attr-invalid=true 체크
//널값이 아니면 사용자 속성값 없어짐

