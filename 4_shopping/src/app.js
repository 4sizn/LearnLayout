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
        "nation" : "korea",
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

var Calculator = function(data = 0){
    this.total = data;
}

Calculator.total = function (discount, items){
        console.log(items.length);
        for(var i =0;i<items.length;i++){
            this.total += items[i].price;
        }

        if(discount){
            let num = this.total;
            num = parseInt(num/discount, 10);
            this.total = num;
        }
        return this.total;
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

var Database = function(json){
    this.data = json;
}


Database.prototype.load = function(){
    //arguments search in JSON DATBASE
    //arguments means json level depth
    //TODO:
    if(arguments.length ===0) return;
    return this.data[arguments[0]];
}

Database.prototype.getKeys = getKeys;
Database.prototype.getValues = getValues;
Database.prototype.getObjects = getObjects;

//return an array of values that match on a certain key
function getValues(obj, key) {
    var objects = [];
    for (var i in obj) {
        if (!obj.hasOwnProperty(i)) continue;
        if (typeof obj[i] == 'object') {
            objects = objects.concat(getValues(obj[i], key));
        } else if (i == key) {
            objects.push(obj[i]);
        }
    }
    return objects;
}

//return an array of objects according to key, value, or key and value matching
function getObjects(obj, key, val) {
    var objects = [];
    for (var i in obj) {
        if (!obj.hasOwnProperty(i)) continue;
        if (typeof obj[i] == 'object') {
            objects = objects.concat(getObjects(obj[i], key, val));    
        } else 
        //if key matches and value matches or if key matches and value is not passed (eliminating the case where key matches but passed value does not)
        if (i == key && obj[i] == val || i == key && val == '') { //
            objects.push(obj);
        } else if (obj[i] == val && key == ''){
            //only add if the object is not already in the array
            if (objects.lastIndexOf(obj) == -1){
                objects.push(obj);
            }
        }
    }
    return objects;
}

//return an array of keys that match on a certain value
function getKeys(obj, val) {
    // console.log(obj);
    var objects = [];
    for (var i in obj) {
        if (!obj.hasOwnProperty(i)) continue;
        if (typeof obj[i] == 'object') {
            objects = objects.concat(getKeys(obj[i], val));
        } else if (obj[i] == val) {
            objects.push(i);
        }
    }
    return objects;
}

//control
//Selected item must be initialize in Order constructor...
//User Selected wish item in main page...

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
    let colorTemp;
    let sizeTemp;
    let amountTemp;
    let shipTemp;
    let contentTemp;

    //color Template
    for(var i=0;i<data['color'].length;i++){
        colorTemp +=  '<option value=' +data['color'][i]+'>'+data['color'][i]+data.type + '</option>'
    }
    //size Template
    for(var i =0;i<data['size'].length;i++){
        sizeTemp +=  '<option value=' +data['size'][i]+'>'+ data['size'][i] + '</option>'
    }
    //amount Template
    for(var i=1;i<=data.amount;i++){
        amountTemp += '<option value=' +i+'>'+ i + '개</option>'
    }
    //LINK Order func
    let tomorrow=Calculator.dayCounter(new Date(),data.cooltime);

    if(typeof tomorrow === 'object' && tomorrow instanceof Date){
        shipTemp = tomorrow.getFullYear() +'년 '+ tomorrow.getMonth()+'월 ' + tomorrow.getDay()+'일 ';    
    }
  
    //content Template
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
        li.addEventListener('click', function(e){
            if(e.target && e.target.id == 'add'){     
                console.log(data.idx);
                //var inst = Order(datainstance);
             }
        });
        
        li.addEventListener('change', function(e){
            if(e.target && e.target.name == 'color'){
                console.log("color" +e.target);
            }
            if(e.target && e.target.name == 'size'){
                console.log('size');
            }
        });

        li.setAttribute('data-idx', data['idx']);
        li.innerHTML = contentTemp;

        return li;
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
}

function ListCartTemplate(data){

    var contentTemp = [
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
].join('');


//     li.addEventListener('click', function(e){
//         if(e.target && e.target.id == 'add'){     
//             console.log(data.idx);
//             //var inst = Order(datainstance);
//          }
//     });
    
var li = document.createElement('li');
//         li.addEventListener('click', function(e){
//             if(e.target && e.target.id == 'delete'){     
//                 li.remove();
//                 // console.log(this.parentElement)
//                 // debugger
//             if(e.target.parentElement.querySelectorAll('').length<1){
//                 // debugger
//                 e.target.parentElement.hasAttribute('hidden') && e.target.parentElement.removeAttribute('hidden');
//             }
//         //var inst = Order(datainstance);
//      }
// });
    // var li = document.createElement('li');
    // li.addEventListener('click', function(e){
    //     if(e.target && e.target.id == 'delete'){     
    //         console.log(this.getAttribute('data-idx'));
    //      }
    // });
    
    // li.setAttribute('data-idx', data['idx']);
    // li.innerHTML = contentTemp;
    li.setAttribute('data-idx', data['idx']);
    li.innerHTML = contentTemp;


    // return li;

    //#cart
        //ul
            //li
                //img
                //span*5
                //button
                    //figure
                        //img
                        //figcaption
    return li;
}

//renderfunction in view
;(function(win, doc, wish, cart){

    function init(){
        var database = new Database(jsonData);
        document.querySelectorAll('.order_lst li').forEach(elems => elems.innerHTML = '');
        document.querySelectorAll('.cart_lst li').forEach(elems => elems.innerHTML = '');

        wish.add(JSON.parse(JSON.stringify(jsonData['items'][0])), true);
        wish.add(JSON.parse(JSON.stringify(jsonData['items'][1])), true);
        wish.add(JSON.parse(JSON.stringify(jsonData['items'][1])), true);

 

        // cart.add({
        //     name : "봄신상니트(남성)",
        //     color : "red",
        //     size : 85,
        //     amount : 6,
        //     price : 56
        // })
        // cart.add({
        //     name : "봄신상니트(남성)",
        //     color : "red",
        //     size : 85,
        //     amount : 6,
        //     price : 1000000000
        // })
        
        render(wish, cart);

        // '<span class="amount">'+data.amount+'</span>',
        // '<span class=" total">'+data.total+'</span>',
        // console.log(jsonData['items'][0]);
        //TODO: Load DataObject

        //가 데이터 적재
    }

    function render(datas1, datas2){
        document.querySelectorAll('.order_lst li').forEach(elems => elems.innerHTML = '');
        document.querySelectorAll('.cart_lst li').forEach(elems => elems.innerHTML = '');

        var elems = datas1.bucket.map(ListOrderTemplate);
        doc.querySelector('.order_lst').append(...elems);

        var elems = datas2.bucket.map(ListCartTemplate);
        doc.querySelector('.cart_lst').append(...elems);
    }

    doc.addEventListener('click', function(e){
        if(e.target && e.target.id == 'add'){
            console.log(wish['bucket'][e.target.getAttribute('data-idx')]);
            console.log(e.target.getAttribute('data-idx'));
            debugger;
            cart.add(wish['bucket'][e.target.getAttribute('data-idx')], false);
            // cart.add({
            //     name : "봄신상니트(남성)",
            //     color : "red",
            //     size : 85,
            //     amount : 6,
            //     price : 1000000000
            // })
            render(wish, cart);
        }
        // var instance = new Order(){
            
        // }
        // datas2.add(instance);
    });

    //해당 obejct에 view date ojbect를 가져온다.
    doc.addEventListener('change', function(e){
        console.log(e.target , e.target.id);
        if(e.target && e.target.name == 'color'){
            console.log('color');
        }
        if(e.target && e.target.name == 'size'){
            console.log('size');
        }
    });


        doc.addEventListener('click', function(e){
            if(e.target && e.target.id == 'delete'){
                let ul = e.target.parentNode.parentNode;
                e.target.parentNode.remove();
            }     
                // console.log(this.parentElement)
            // if(e.target.parentNode.parentNode.querySelector('li').length<1){
                // debugger
                // e.target.parentElement.hasAttribute('hidden') && e.target.parentElement.removeAttribute('hidden');
            // }
        //var inst = Order(datainstance);
});
    //start...
   
    doc.querySelector('button[id="more"]').onclick=function(){
        console.log("more");
    }

    doc.querySelector('button[id="pay"]').onclick=function(){
        alert("결재가 완료되었습니다");
        console.log("결재하기");
    }


    // var v1 = doc.querySelector('#subTotal');

    // v1.innerHTML = Calculator.total(false, cart.cart);
    
// function loadJSON(callback) {
//     var xobj = new XMLHttpRequest();
//     xobj.overrideMimeType("application/json");
//     xobj.open('GET', '../src/database.json', true);
//     xobj.onreadystatechange = function() {
//         if (xobj.readyState == 4 && xobj.status == "200") {
//             callback(xobj.responseText);
//         }
//     }
//     xobj.send(null);
// }
// process();

// loadJSON(function(response){
    //     data = JSON.parse(response);
    //     console.log(data);});
    //}
    init();
})(this, document, new Order() ,new Order(["00001"]));
//module load
//1.load customer / cusotmer load wish list & cart list


// var Items = require('../classes/item');
// var Customer = require('../classes/user');
// var Cart =  Customer.cart;
// var itemlist=ItemLoad([1, 2, 3, 4]);

// load Customer item wish list{}

// cart.add(itemlist[i], color, size, amout);
// Customer.Cart의 토탈
// Customer.order(Cart);


