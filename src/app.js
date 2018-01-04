//$(document).ready(){} transfer  IE +9;
document.addEventListener("DOMContentLoaded", function(event){
    domReady();
});

function domReady(){
    document.querySelector('.layout_lst').addEventListener('click', function(e){
        changeLayout(e);
    });
}

//Initial Parameter Not Support in IE, Opera, Safari...
/*function changeImg(e, imgsrc = 'preview_img'){
// document.getElementsByClassName(imgsrc)[0].src = 'images/' + e.target.getAttribute('data-con') + '.gif';
}*/

function changeImg(e){
 document.getElementsByClassName('preview_img')[0].src = 'images/' + e.target.getAttribute('data-con') + '.gif';
}


function changeLayout(e){
 document.getElementById('wrap').className = e.target.getAttribute('data-layout');   
    document.getElementById('container').className = e.target.getAttribute('data-con');
    changeImg(e);
}