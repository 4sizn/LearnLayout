/**
 * 상품정보
 */
const products = {
  0: {
    id: 0,
    name: '봄옷',
    price: 1000,
    options: {
      sizes: [95, 100, 105],
      colors: ['red', 'blue', 'white']
    }
  },
  1: {
    id: 1,
    name: '여름옷',
    price: 5000,
    options: {
      sizes: [95, 100, 105],
      colors: ['red', 'blue', 'white']
    }
  },
  2: {
    id: 2,
    name: '가을옷',
    price: 10000,
    options: {
      sizes: [95, 100, 105],
      colors: ['red', 'blue', 'white']
    }
  }
}

/**
 * DOM helper
 */
const $ = (() => {
  const DomQuery = class {
    constructor (elems = []) {
      Object.assign(this, elems)
      this.length = elems.length
    }
    toArray () {
      return Array.from(this)
    }
    html (html) {
      if (!html) return this[0].innerHTML
      this.toArray().forEach(el => (el.innerHTML = html))
      return this
    }
    val (val) {
      if (!val) return this[0].value
      this.toArray().forEach(el => (el.value = val))
      return this
    }
    find (selector) {
      const elems = this.toArray()
        .map(el => [...el.querySelectorAll(selector)])
        .reduce((arr, elems) => arr.concat(elems), [])

      return new DomQuery([...new Set(elems)])
    }
    on (name, selector, fn) {
      if (typeof selector === 'function') {
        fn = selector
        selector = null
      }
      const wrapFn = evt => (!selector || evt.target.matches(selector)) && fn(evt)
      this.toArray().forEach(el => el.addEventListener(name, wrapFn))
      return this
    }
    serializeObject () {
      const result = {}
      this.find('select,input').toArray().forEach(el => (result[el.name] = el.value))
      return result
    }
    append (elems) {
      if (typeof elems === 'string') this.toArray().forEach(el => el.insertAdjacentHTML('beforeend', elems))
      return this
    }
    remove () {
      this.toArray().forEach(el => el.remove())
      return this
    }
  }
  return selector => new DomQuery([...document.querySelectorAll(selector)])
})()

/**
 * state, emitter
 */
$.state = {
  cart: {
    _items: {},
    _uuid: -1,
    get (id = null) {
      return id !== null ? this._items[id] : {...this._items}
    },
    remove (id) {
      return delete this._items[id]
    },
    add ({productId, selected}) {
      return (this._items[++this._uuid] = {id: this._uuid, productId, selected, amount: 1})
    },
    find ({productId, selected}) {
      const selectedHash = JSON.stringify(selected)
      return Object.values(this._items).find(item => item.productId === productId && JSON.stringify(item.selected) === selectedHash)
    },
    get totalAmount () {
      return Object.values(this._items).reduce((total, item) => total + item.amount, 0)
    },
    get totalPrice () {
      return Object.values(this._items)
        .reduce((total, {amount, productId}) => total + products[productId].price * amount, 0)
    }
  }
}
$.emitter = {
  _listeners: {},
  on (name, fn) {
    name.split(/\s+/).forEach(name => {
      (this._listeners[name] || (this._listeners[name] = [])).push(fn)
    })
  },
  trigger (name, ...args) {
    (this._listeners[name] || []).forEach(fn => fn(...args))
  }
}

/**
 * products render, attach events
 */
{
  const optionHtml = ([name, option]) => (`
  <label>${name}
    <select name="${name}">
      <option value="__NOT-SELECTED__" selected>미선택</option>
      ${option.map(val => `<option value="${val}">${val}</option>`).join('')}
    </select>
  </label>`)

  const productHtml = product => (`
    <li data-product="${product.id}">
      <span>상품명 : ${product.name}</span>
      <span>가격 : &#8361; ${product.price.toLocaleString()}</span>
      ${Object.entries(product.options).map(optionHtml).join('')}
      <button data-action-add-to-cart="${product.id}">담기</button>
    </li>
  `)

  const $products = $('[data-products]')

  // init render
  $products.html(
    Object.values(products).map(productHtml).join('')
  )

  // attach events
  $products.on('click', '[data-action-add-to-cart]', evt => {
    // limit check
    if ($.state.cart.totalAmount === 5) return alert('5개 이상 안됨')

    const productId = evt.target.dataset.actionAddToCart
    const selected = $products.find(`[data-product="${productId}"]`).serializeObject()

    // option check
    const notSelected = (Object.entries(selected).find(([, val]) => val === '__NOT-SELECTED__') || [])[0]
    if (notSelected) return alert(`${notSelected} 옵션 선택안됨`)

    // icrease if exists
    const exists = $.state.cart.find({productId, selected})
    if (exists) {
      exists.amount++
      return $.emitter.trigger('CHANGE_CART_PRODUCT_AMOUNT', exists)
    }
    // add if not exists
    $.emitter.trigger('ADD_CART_PRODUCT', $.state.cart.add({productId, selected}))
  })
}

/**
 * cart render, attach events
 */
{
  const $cart = $('[data-cart]')

  // render for add
  $.emitter.on('ADD_CART_PRODUCT', item => {
    const selectedHtml = ([name, value]) => (`
    <label>${name}
      <select disabled>
        <option>${value}</option>
      </select>
    </label>`)

    $cart.append(`
      <li data-cart-id="${item.id}">
        제품명: ${products[item.productId].name}
        ${Object.entries(item.selected).map(selectedHtml).join('')}
        수량 : <input data-action-change-amount="${item.id}" type="number" value="1" />
        <button data-action-remove="${item.id}">제거</button>
      </li>
    `)
  })

  // render for update
  $.emitter.on('CHANGE_CART_PRODUCT_AMOUNT', ({id, amount}) => {
    $cart.find(`[data-cart-id="${id}"] input[type="number"]`).val(amount)
  })

  // render for remove
  $.emitter.on('REMOVE_CART_PRODUCT', itemId => {
    $cart.find(`[data-cart-id="${itemId}"]`).remove()
  })

  // attach events
  $cart.on('change', '[data-action-change-amount]', evt => {
    const item = $.state.cart.get(evt.target.dataset.actionChangeAmount)

    let newAmount = evt.target.valueAsNumber
    const increase = newAmount - item.amount

    if (newAmount <= 0) {
      if (confirm('정말 제거하시겠습니까?')) {
        return $.state.cart.remove(item.id) && $.emitter.trigger('REMOVE_CART_PRODUCT', item.id)
      }
      newAmount = 1 // change to 1
    }

    // over
    const totalAmount = $.state.cart.totalAmount
    if (totalAmount + increase > 5) {
      alert('총 5개 넘음')
      newAmount -= (totalAmount + increase - 5) // change to max
    }

    // udpate
    item.amount = newAmount
    $.emitter.trigger('CHANGE_CART_PRODUCT_AMOUNT', item)
  })

  $cart.on('click', '[data-action-remove]', evt => {
    const itemId = evt.target.dataset.actionRemove
    return $.state.cart.remove(itemId) && $.emitter.trigger('REMOVE_CART_PRODUCT', itemId)
  })
}

/**
 * price render, attach events
 */
{
  const $price = $('[data-price]')
  const $total = $price.find('[data-price="total"]')
  const $desc = $price.find('[data-price="desc"]')

  // init render
  const render = () => {
    $total.html(`&#8361; ${$.state.cart.totalPrice.toLocaleString()}`)
    $desc.html(
      Object.values($.state.cart.get())
        .map(({productId, amount}) => {
          const {name, price} = products[productId]
          return `${name}: &#8361; ${(price * amount).toLocaleString()} (${amount}개)`
        }).join(' + ')
    )
  }
  render()

  // render for total price
  $.emitter.on('ADD_CART_PRODUCT CHANGE_CART_PRODUCT_AMOUNT REMOVE_CART_PRODUCT', render)
}
