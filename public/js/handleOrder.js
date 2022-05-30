const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const products = [];
const cart = document.getElementById('demo');

function render() {
    if (products.length === 0) {
        cart.innerHTML = 'Bạn chưa thêm sản phẩm nào';
    } else {
        let content = products.map((item) => {
            return `
            <div class="cart-product" id="cart-${item.id}">
            <h4 class="cart-product-name">${item.name}</h4>
            <div class="cart-product-row">
                <div class="cart-product-size">
                    <label for="">Size</label>
                    <select name="size">
                        <option value="M">M</option>
                        <option value="L">L</option>
                    </select>
                </div>
                <div class="cart-product-price">
                    <input
                        type="number"
                        name="quantity"
                        class="card-product-quantity"
                        value="1"
                    />
                    x ${item.price}
                </div>
            </div>
        </div>`;
        });
        cart.innerHTML = content.join('');
    }
}

render();

function addToCart(id) {
    const name = $(`#prod-${id} .right-shared-text-name`).innerHTML;
    const price = $(`#prod-${id} .right-shared-text-price`).innerHTML;
    const data = {
        id,
        name,
        price,
    };
    products.push(data);
    render();
}

const customer_address = $('input[name="customer_address"]');
const phone_number = $('input[name="phone_number"]');
const orderProducts = [];

function handleOrder() {
    const cartProducts = $$('.cart-product');
    const cartProductsArray = Array.from(cartProducts);
    const products = [];
    cartProductsArray.forEach((product) => {
        // console.dir(product.childNodes[3].childNodes[1].children[1].value);
        // console.dir(product.childNodes[3].childNodes[3].children[0].value);
        // console.dir(product.id);

        const id = product.id.split('-')[1];
        const size = product.childNodes[3].childNodes[1].children[1].value;
        const quantity = product.childNodes[3].childNodes[3].children[0].value;

        const productData = {
            id,
            size,
            quantity,
        };

        products.push(productData);
    });
    console.log(products);
    const data = {
        phone_number: phone_number.value,
        customer_address: customer_address.value,
        products,
    };
    fetch('/orders/<%=userId%>', {
        method: 'POST',
        headers: {
            Accept: 'application/json, text/plain, /',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
        .then((data) => {
            console.log(data);
            alert('Tạo đơn hàng thành công');
            document.getElementById('payment-presently').style.display = 'none';
            cart.innerHTML = 'Bạn chưa có sản phẩm nào';
        })
        .catch((err) => alert('Không thể tạo đơn hàng'));
}
