"use strict";

//dom on ready
$(document).ready(function(){
    var lname = document.forms['regFrm']['lname'];
    var rname = document.forms['regFrm']['fname'];
    var ph_email = document.forms['regFrm']['ph_email'];
    var newpsw = document.forms['regFrm']['newpsw'];
    var man = document.forms['regFrm']['man'];
    var woman = document.forms['regFrm']['woman'];
    
    $('#loginFrm').submit(function(){
        //return validationForm();
    });
    
    $('#regFrm').submit(function(e){
       e.preventDefault();
        
        if(validationForm()){
            setTimeout(function(){
                console.log("done");
            $(e).submit();    
        },100);
    }
    });
    
    
    $('.btn_birth').click(function(){
       $('.birth_pointer').removeAttr('data-focus');
    });

    $('.reg_birth_help').click(function(){
        $('.birth_pointer').attr('data-focus', true);
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
    }).click(function(){
        if($(":input:radio[name=sex]:checked")){
           $('.reg_sex').removeAttr('data-invalid');
        }
        
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
            $(this).attr('data-focus', flag);
        }
    });
}

function validationForm(){
    let result = true;

    if(lname.value==''){
        $(lname).attr('data-invalid', true);
        result = false;
    }
    if(fname.value==''){
        $(fname).attr('data-invalid', true);
        result = false;
    }
    if(ph_email.value==''){
        $(ph_email).attr('data-invalid', true);
        result = false;
    }
    if(newpsw.value==''){
        $(newpsw).attr('data-invalid', true);
        result = false;
    }
    if(man.checked + woman.checked<1){
        $('.reg_sex').attr('data-invalid', true);
        result = false;
    }
        //---아니면 Validate-data 변경---
    return result;
}
//
//function validateRadio(){
//    var radios = $(this).children('input[type=radio]');
//    console.log(radios);
//
//    return true;
//}
//
//function validateEmail(inputText)  
//{  
//    var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;  
//
//            if(inputText.value.match(mailformat))  
//            {  
//                document.form1.text1.focus();  
//                return true;  
//            }  
//            else  
//            {  
//                alert("You have entered an invalid email address!");  
//                document.form1.text1.focus();  
//                return false;  
//            }  
//}  