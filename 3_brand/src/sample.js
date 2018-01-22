  /* 셀렉트 박스 id로 접근 */
var selectColor = document.getElementById('select-color')
  , selectSize = document.getElementById('select-size')
  , selectAmount = document.getElementById('select-amount')
  
  /* 셀렉트 요소 안의 option 요소 접근 */
  , colorOption = selectColor.getElementsByTagName('option')
  , sizeOption = selectSize.getElementsByTagName('option')
  , amountOption = selectAmount.getElementsByTagName('option')
  
  /* 장바구니 담기 버튼 */
  , cartBtn = document.getElementById('cart-button').getElementsByTagName('button')[0]
  , primeCost = document.getElementById('price').childNodes[0].nodeValue
  , cartList = document.getElementById('cart-list')
  , cartArticle = document.getElementById('cart')
  
  /* 장바구니 총 금액 부분 */
  , subPrice = document.getElementById('sub-total')
  , shipPrice = document.getElementById('shipping')
  , totalPrice = document.getElementById('total-price')
  , subDefault = 0
  , totalDefault = 0
  , shipping = 2500
  
  , payBtn = document.getElementById('pay-button');
  
//primeCost.innerHTML = convertMoney(primeCost.childNodes[0].nodeValue); 


/* 선택 */
function select(){
  var colorIndex = selectColor.selectedIndex
    , sizeIndex = selectSize.selectedIndex
    , amountIndex = selectAmount.selectedIndex
    , indexArray = [colorOption[colorIndex], sizeOption[sizeIndex], amountOption[amountIndex]];

	if(indexArray[0].index == 0 && indexArray[1].index == 0 && indexArray[2].index == 0){
		alert('색상, 사이즈, 수량을 선택해주세요!');
		return false;
	}else{
		for(var i in indexArray){
			if(indexArray[i].index == 0){
				alert(indexArray[i].text + '을 해주세요!');
				return false; 
			}
		}
	}
  createList(colorOption[colorIndex].text, sizeOption[sizeIndex].text, amountOption[amountIndex].text, colorOption[colorIndex].value, sizeOption[sizeIndex].value, amountOption[amountIndex].value);
}
/* function select end */


/* li 생성 */
function createList(color, size, amount, colorValue, sizeValue, amountValue){
    /* 요소 생성 */
	var listLi = document.createElement('li')
		, img = document.createElement('img')
		, nameSpan = document.createElement('span')
	  , colorSpan = document.createElement('span')
	  , sizeSpan = document.createElement('span')
	  , amountSpan = document.createElement('span')
	  , priceSpan = document.createElement('span')
	  , cancelBtn = document.createElement('button')
	  , cancelImg = document.createElement('img')
	  
	  /* 단가 * 수량 후 변환 */
	  , extendedNum = primeCost * parseInt(amount,10)
	  , extendedPrice = convertMoney(extendedNum)
	  
	  /* span 안의 텍스트 노드 생성 */
	  , nameTextNode = document.createTextNode('봄신상니트(남성)')
    , colorTextNode = document.createTextNode(color)
    , sizeTextNode = document.createTextNode(size)
    , amountTextNode = document.createTextNode(amount)
    , priceTextNode = document.createTextNode(extendedPrice)
    , cancelValue = document.createTextNode('삭제')
    , defaultMent = document.getElementById('default-ment');
             
        
	/* img 지정 */
	img.setAttribute('src', 'img/'+colorValue+'_'+sizeValue+'.gif');
	img.setAttribute('alt', color);
	
	
	/* cancel 버튼 안의 이미지 요소에 속성 지정 */
	cancelImg.setAttribute('src', 'img/x-button.gif');
	cancelImg.setAttribute('width', '19');
	cancelImg.setAttribute('height', '19');
	cancelImg.setAttribute('alt', '삭제 이미지');
	
	
	/* 기본 멘트 없애기 */
	if(defaultMent){
    cart.removeChild(defaultMent);
  }
	
	
	/* 요소에 텍스트 노드 붙이기 */
	nameSpan.appendChild(nameTextNode);
	colorSpan.appendChild(colorTextNode);
	sizeSpan.appendChild(sizeTextNode);
	amountSpan.appendChild(amountTextNode);
	priceSpan.appendChild(priceTextNode);
	cancelBtn.appendChild(cancelImg);
	cancelBtn.appendChild(cancelValue);
	
	
	/* li에 요소 노드 붙이기 */
	listLi.appendChild(img);  
  listLi.appendChild(nameSpan);
  listLi.appendChild(colorSpan);
  listLi.appendChild(sizeSpan);
  listLi.appendChild(amountSpan);
  listLi.appendChild(priceSpan);
  listLi.appendChild(cancelBtn);
  
  cartList.appendChild(listLi);
  
  
	/* 클래스 네임 지정 */
  giveClassName(img, nameSpan, colorSpan, sizeSpan, amountSpan, priceSpan, cancelBtn);

  
  /* 삭제 버튼 클릭시 */
  cancelBtn.onclick = function(){
  	var deleteLi = this.parentNode;
  	
  	if(cartList.childNodes.length == 1){
  		subPrice.innerHTML = 0;
  		shipPrice.innerHTML = 0;
  		totalPrice.innerHTML = 0;
  		cartList.removeChild(deleteLi);
  		cart.insertBefore(defaultMent, cart.lastChild);

  	}else{
  		cartList.removeChild(deleteLi);
  		deleteTotal(extendedNum);
  	}
  }
  
  
  /* 처음 생성된 li 스타일 지정, 수량 제한 */
  if(cartList.childNodes.length == 1){
  	listLi.style.borderTop = 'none';
  	showTotal(extendedNum);
  }else if(cartList.childNodes.length <= 5){
  	showTotal(extendedNum);
  }else if(cartList.childNodes.length > 5){
  	cartList.removeChild(cartList.lastChild);
  	alert('장바구니는 5개까지 담을 수 있습니다.');
  }
}
/* function createList end */




/* span 요소에 class 지정 */
function giveClassName(img, name, color, size, amount, price, cancel){
	img.className = 'product-img';
	name.className = 'name';
	color.className = 'color';
	size.className = 'size';
	amount.className = 'amount';
	price.className = 'total-price';
	cancel.className = 'cancel';
}


/* 문자를 화폐 단위로 변환 */
function convertMoney(price){
	var explode = String(price).split('')
    , changed = [];
	
	for(var i = 0; i<explode.length; i++){  
    changed.unshift(explode[explode.length-i-1]);
    if( i != explode.length-1 && (i+1)%3 == 0){
        changed.unshift(',');
    }
	}
	changed.unshift('￦');
	return changed.join('');	
}


/* 장바구니 안의 상품의 합을 보여주기 */
function showTotal(extendedNum){
	subDefault += extendedNum;
  subPrice.innerHTML = convertMoney(subDefault);
	shipPrice.innerHTML = convertMoney(shipping);
	totalDefault = subDefault + shipping;
	totalPrice.innerHTML = convertMoney(totalDefault);
}


/* 장바구니에서 상품을 삭제하면 다시 합을 갱신하기 */
function deleteTotal(extendedNum){
	subDefault -= extendedNum;
	subPrice.innerHTML = convertMoney(subDefault);
	shipPrice.innerHTML = convertMoney(shipping);
	totalDefault = subDefault + shipping;
	totalPrice.innerHTML = convertMoney(totalDefault);
}


/* 장바구니에 담기 버튼 클릭 */
cartBtn.onclick = select;


/* 결제 버튼 클릭 */
payBtn.onclick = function(){
  if(cartList.childNodes.length == 0){
    alert('장바구니에 상품이 없습니다.');
  }else{
    confirm('주문하시겠습니까?');
  }

};