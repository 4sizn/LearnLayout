'use strict';

// [작업 설명]
// 순서는 기초 Mark-up 후 기능 구현하세요.
// 기능은 Native Javascript 만으로 작성하세요.
// [기본 동작 설명]
// 선택 & 추가 : Select option선택 후 [장바구니 담기]를 누르면 장바구니에 해당 상품, 개수, 가격, 삭제 버튼이 추가됨.
// 추가 시 : 장바구니의 상품 금액을 CART TOTALS 에 계산.
// 삭제 시 : 장바구니에서 삭제된 항목은 DOM에서 지워지며, CART TOTALS은 갱신된다.
// 금액은 단위에 맞게 표시
// 이미 장바구니에 존재하는 동일한 품목은 수량만 증가 처리.

// [예외 설명]
// 장바구니 담기 클릭시 옵션을 모두 선택해야 가능하도록 alert 처리하세요. (선택하지 않은 부분을 알려주세요.)
// 결제는 장바구니에 상품이 있을 때만 가능합니다. (alert 처리)
// 상품 갯수는 총 5개 까지만 장바구니에 등록 가능합니다.
//model

var jsonData ={
    "users": [
        {
        "id" : "4sizn",
        "privilege" : "admin",
        "nation" : "korea"
        },
        {"id" : "customer1",
        "privilege" : "bronze",
        "nation" : "japan",
        "wishlist" : ["000001"]
        },
        {"id" : "customer1",
        "privilege" : "silver",
        "nation" : "japan",
        "wishlist" : ["000002"]
        }
    ],

    "items": [
        {
            "id" : "00001",
            "name" : "봄신상니트",
            "type" : "니트",
            "gender" : "남성",
            "cooltime" : "10",
            "price" : "8900",
            "color" : ["곤색", "와인", "헌트"],
            "size" : ["95", "100", "105"],
            "amount" : "5",
            "option" : [
                    ["6", "6", "6"],
                    ["6", "6", "6"],
                    ["6", "6", "6"]
            ]
            ,
            "img" : "./images/item_00001.jpg"
        },
        {
            "id" : "00002",
            "name" : "봄신상카라티",
            "type" : "카라티",
            "gender" : "남성",
            "cooltime" : "11",
            "price" : "10000",
            "color" : ["빨강", "초록", "노랑"],
            "size" : ["95", "100", "105"],
            "amount" : "5",
            "option" : [
                    ["6", "5", "0"],
                    ["6", "5", "0"],
                    ["6", "5", "3"]
            ]
            ,
            "img" : "./images/item_00002.jpg"
        }
    ]
}

var Calculator = function(){
}

Calculator.total = function (items, discount){

    if(items.length == 0) return;

    var result = 0;
    
    for(var i = 0;i<items.length;i++){
        result += parseInt(items[i].price);
    }

    if(discount){
        let num = result;
        num = parseInt(num/discount, 10);
        result = num;
    }

    return result;
}

Calculator.dayCounter = function(date, pass){
    //arguemnt compare
    if(typeof date === 'object' && date instanceof Date){
        var tomorrow = date;
        tomorrow.setDate(tomorrow.getDate() + parseInt(pass));

        return tomorrow;
    }else{
        date += parseInt(pass);
        
        return date;
    }
}

function Order(wishlist){
    this.date = new Date();
    this.wishlist = wishlist;
    this.idx = 0;
    this.bucket = [];
    this.bucketTotal = {
        subTotal :0,
        shipping : 0,
        total : 0
    }
}

Order.prototype.add = function(item, isOrder){

    if(isOrder)
    {
        item.idx = this.idx;
        this.idx++;
    }

    this.bucket.push(item);
}

Order.prototype.delete = function(item){
    //this.wishlist.delete(items);
    this.bucket.delete(item);
}

Order.prototype.drop = function(select){
    //this.wishlist = [];
    this.bucket = [];
}

function ListOrderTemplate(data){
    let colorTemp ='';
    let sizeTemp ='';
    let amountTemp ='';
    let shipTemp ='';
    let contentTemp ='';

    //color Template
    for(var i=0;i<data['color'].length;i++){
        colorTemp +=  '<option value="' +data['color'][i]+'">'+data['color'][i]+data.type + '</option>'
    }
    //size Template
    for(var i =0;i<data['size'].length;i++){
        sizeTemp +=  '<option value="' +data['size'][i]+'">'+ data['size'][i] + '</option>'
    }
    //amount Template
    for(var i=1;i<=data.amount;i++){
        amountTemp += '<option value="' +i+'">'+ i + '개</option>'
    }
    //LINK Order func
    let tomorrow=Calculator.dayCounter(new Date(),data.cooltime);

    if(typeof tomorrow === 'object' && tomorrow instanceof Date){
        shipTemp = tomorrow.getFullYear() +'년 '+ tomorrow.getMonth()+'월 ' + tomorrow.getDay()+'일 ';    
    }

    //content Template
    //#order
        //ul
            //li
                //.notice
                    //img 
                    //h3
                    //p
            //.category
                //select*3
                    //option*4
                //.add_cart
    contentTemp =  [
    '<div class="notice clearfix">',
        '<figure>',
        '<img src="'+data.img+'" alt="'+data.name+'" width="75" height="100">',
        '<figcaption>'+data.name+'('+data.gender+')</figcaption>',
        '</figure>',
        '<p>배송예정일: '+shipTemp+'이후 <br> 생산기간 : '+data.cooltime + '일 <br><strong>코드번호 : ' + data.id + '</strong><p>',
    '</div>',
    '<div class="category">',
        '<select name="color" id="color">',
            '<option value="default" selected="selected">색상 선택</option>',
            colorTemp,
        '</select>',
        '<select name="size" id="size">',
            '<option value="default" selected>사이즈 선택</option>',
            sizeTemp,
        '</select>',
        '<select name="amount" id="amount">',
            '<option value="default" selected>수량 선택</option>',
            amountTemp,
        '</select>',
    '</div>',
    '<div class="add_cart">',
        '<span class="price">'+data.price+'</span><button class="add_btn" id="add" data-idx='+data.idx+'>장바구니 담기</button>',
    '</div>'
    ].join('');

    var li = document.createElement('li');
        li.setAttribute('data-idx', data['idx']);
        li.innerHTML = contentTemp;

        return li;
}

function ListCartTemplate(data){
    //#cart
        //ul
            //li
                //img
                //span*5
                //button
                    //figure
                        //img
                        //figcaption
    var contentTemp = [
    '<div>',
    '<span class="idx">'+data.idx+'</span>',
    '<span class="name">'+data.name+'</span>',
    '<span class="color">'+data.color+'</span>',
    '<span class="size">'+data.size+'</span>',
    '<span class="size">'+data.price+'</span>',
    '<span class="amount">'+data.amount+'</span>',
    '<span class="total">'+data.price * data.amount+'</span>',
    '<button id ="delete" class="delete">',
        '<figure>',
            '<img src="./images/btn_x.png" alt="삭제">',
            '<figcaption>삭제</figcaption>',
        '</figure>',
    '</button>',
    '</div>',
].join('');

var li = document.createElement('li');
li.setAttribute('data-idx', data['idx']);
li.innerHTML = contentTemp;

return li;
}

var admin = JSON.parse(JSON.stringify(jsonData['users'][0]));
var user = JSON.parse(JSON.stringify(jsonData['users'][1]));

//renderfunction in view
;(function(win, doc, wish, cart){

    function init(){
        document.querySelectorAll('.order_lst li').forEach(elems => elems.remove()); //init data
        document.querySelectorAll('.cart_lst li').forEach(elems => elems.remove()); 
        wish.add(JSON.parse(JSON.stringify(jsonData['items'][0])), true);
        wish.add(JSON.parse(JSON.stringify(jsonData['items'][1])), true);
        wish.add(JSON.parse(JSON.stringify(jsonData['items'][1])), true);
        render(wish, cart);
    }

    function render(datas1, datas2){
        document.querySelectorAll('.order_lst li').forEach(elems => elems.remove());
        document.querySelectorAll('.cart_lst li').forEach(elems => elems.remove());

        var elems = datas1.bucket.map(ListOrderTemplate);
        doc.querySelector('.order_lst').append(...elems);

        var elems = datas2.bucket.map(ListCartTemplate);
        doc.querySelector('.cart_lst').append(...elems);

        let subtotal =  Calculator.total(cart.bucket) || 0;
        let shipping =  (admin.nation != user.nation) ? parseInt(3000) : parseInt(0);
        let total =  subtotal + shipping;

        doc.querySelector('.total_lst #subTotal').innerHTML = subtotal;
        doc.querySelector('.total_lst #shipping').innerHTML = shipping;
        doc.querySelector('.total_lst #total').innerHTML = total;
    
        if(doc.querySelectorAll('.order_lst li').length == 0){
            doc.querySelector('#order p').setAttribute('hidden', false);
        }else{
            doc.querySelector('#order p').setAttribute('hidden', true);
        }

        if(doc.querySelectorAll('.cart_lst li').length == 0){
            doc.querySelector('#cart p').setAttribute('hidden', false);
        }else{
            doc.querySelector('#cart p').setAttribute('hidden', true);
        }

    }

    doc.addEventListener('click', function(e){
        if(e.target && e.target.id == 'add'){
            var li = upTo(e.target, 'li');
            var idx = e.target.getAttribute('data-idx');
            var name = wish.bucket[e.target.getAttribute('data-idx')]['name'];
            var price = wish.bucket[e.target.getAttribute('data-idx')]['price'];
            var color = li.querySelector('#color').value;
            var size = li.querySelector('#size').value;
            var amount = li.querySelector('#amount').value;
        
            var inst ={
                idx : idx,
                name : name,
                color : color,
                size : size,
                amount : amount,
                price : price
            };
            //validation chk
            if(!Object.values(inst).find(function(data){return data == 'default';})){
                cart.add(inst, false);    
                render(wish, cart);
            }else{
                alert("옵션 값을 입력해주세요!");
            }
        }
    });


        doc.addEventListener('click', function(e){
            if(e.target && e.target.id == 'delete'){
                var idx = upTo(e.target, 'li').getAttribute('data-idx');
                var removeIndex = cart.bucket.map(function(item){
                    return item.idx;
                }).indexOf(idx);
                cart.bucket.splice(removeIndex, 1);
                upTo(e.target, 'li').remove();
                render(wish, cart);
            }     
},true);
    //start...
    doc.querySelector('button[id="more"]').onclick=function(){
    };

    doc.querySelector('button[id="pay"]').onclick=function(){
        alert("결재가 완료되었습니다");
    };

    init();

})(this, document, new Order() ,new Order(["00001"]));

function upTo(el, tagName) {
    tagName = tagName.toLowerCase();

    while (el && el.parentNode) {
        el = el.parentNode;
        if (el.tagName && el.tagName.toLowerCase() == tagName) {
        return el;
        }
    }
return null;
}

//내일 할것
// li 없을때 알람
//인풋 버그
// 의류코드, 사이즈, 색이 카트에 있는 값중 동일할 경우를 체크 