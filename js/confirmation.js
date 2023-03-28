const customer = JSON.parse(sessionStorage.getItem('customer'));
const shop = JSON.parse(localStorage.getItem('shop'))


if(shop == null || customer == null){
    if(shop == null){
    document.getElementById('item').innerHTML = `Your cart is empty, please go back to the shop and add some items to your cart.`;
    }
    if(customer == null){
        document.getElementById('customer').innerHTML = `Please fill in your information to complete your order.`;
    }
} else {

shop.forEach(getProducts);

function getProducts(element){
    //"https://server.knotten.net/fakestore/" + id
    fetch('https://fakestoreapi.com/products/' + element[0])
    .then(res=>res.json())
        .then(data=>renderConfirmationCard(data, element[1]))
        .then(renderCustomer(customer))
}

function renderConfirmationCard(element, quantity) {
    const confirmationCard = document.createElement('div');
    confirmationCard.classList.add('col-sm-11', 'col-md-11', 'col-lg-7', 'mb-4');
    confirmationCard.innerHTML = `
    <div class="card" style="border-radius: 15px;">
        <div class="row g-0">
            <div class="col-md-2">
                <img src="${element.image}" style="border-top-left-radius: 15px; border-bottom-left-radius: 15px; max-height: 150px; object-fit: cover;" class="img-fluid" alt="${element.title}" />
            </div>
            <div class="col-md-10">
                <div class="card-body">
                    <div class="d-flex justify-content-between">
                        <div>
                            <p class="title">${element.title}</p>
                            <p class="small text-muted">${element.category}</p>
                        </div>
                        <div>
                            <p>$${element.price}</p>
                            <p>Quantity: ${quantity}</p>
                            <p class="small text-muted">${element.rating.rate} rating (${element.rating.count} votes)</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
`;
    document.getElementById('item').appendChild(confirmationCard);
}



function renderCustomer(customer) {
    let card = document.createElement('div');
    card.innerHTML = `
        <p>${customer.name}</p>
        <p>${customer.email}</p>
        <p>${customer.phone}</p>
        <p>${customer.address}</p>
        <p>${customer.zip}</p>
        <p>${customer.city}</p>
    `;

    document.getElementById('customer').appendChild(card);
}
}