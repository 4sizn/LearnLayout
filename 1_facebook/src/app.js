"use strict";

//dom on ready
$(document).ready(function(){
    $('#loginFrm').submit(function(){
        alert("submit");
        validationForm();
    });

    $('#regFrm').submit(function(){
        alert("submit()");
        validationForm();
    });

    $('input').focusin(function(){
        if(this.value.length == 0){
            validationTooltip(this.id, true);
        }
    }).focusout(function(){
        if(this.value.length == 0){
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
            console.log("validation tooltip"+id);
            $(this).attr('data-focus', flag);
        }
    });
}

function validationForm(){
    if($(this).parent == $('#loginFrm')){
        
    }
    else if($(this).parent == $('#regFrm')){
    }
}


function foo(){
    alert("fopo");
}


//포커싱 후 벨리데 체크
//포커싱 후 널값이면 attr-invalid=true 체크
//널값이 아니면 사용자 속성값 없어짐

