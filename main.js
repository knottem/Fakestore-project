/*let shop = JSON.parse(localStorage.getItem('shop'));

if(shop === null){
    shop = []
} else {
    if (document.querySelector('.shopping')) {
        shop.forEach(renderInDropdown)
    }
}
*/
//shopping cart
let shop = []

//total price
let totalPrice = 0


//add to checkout function
function addToCheckout(product) {
    if (shop.some(element => element.id === product.id)) {
        shop.find(element => element.id === product.id).quantity += 1;
    } else {
        shop.push(product);
    }

    localStorage.setItem('shop', JSON.stringify(shop));
    //renderInDropdown(product);
    location.href = "checkout.html";
}

function renderProductCard(element) {
    const card = document.createElement('div');
    card.classList.add('col-sm-11', 'col-md-6', 'col-lg-3', 'col-xl-3', 'col-xxl-2', 'mb-4', 'card-container');
    card.innerHTML = `
          <div class="card card-hover" style="border-radius: 15px;">
            <div class="text-center" style="height: 200px">
              <img src="${element.image}" style="border-top-left-radius: 15px; border-top-right-radius: 15px; max-height: 200px;" class="img-fluid" alt="${element.title}"/>
            </div>
            <div class="card-body pb-0">
              <div class="d-flex justify-content-between">
                <div>
                  <p class="title">${element.title}</p>
                  <p class="small text-muted">${element.category}</p>
                </div>
                <div>
                <div class="d-flex flex-row justify-content-end mt-1 mb-4 text-danger">
              </div>
                </div>
              </div>
            </div>
            <hr class="my-0" />
            <div class="card-body pb-0">
              <div class="d-flex justify-content-between">
                <p>$${element.price}</p>
                <p class="small text-muted">${element.rating.rate} rating (${element.rating.count} votes)</p>
              </div>
            </div>
            <hr class="my-0" />
            <div class="card-body pb-0">
            <div class="description-container">
              <p class="text-dark line-clamp">${element.description}</p>
            </div>
          </div>
          <hr class="my-0" />
            <div class="card-body">
              <div class="d-flex justify-content-center align-items-center pb-2 mb-1">
                <button type="button" class="btn btn-primary">Buy now</button>
              </div>
            </div>
          </div>
    `;
    document.querySelector('.row').appendChild(card);

    element.quantity = 1;

    card.querySelector('.btn').addEventListener('click', () => {
        addToCheckout(element);
    });

    const descriptionContainerElement = card.querySelector('.description-container');


    //adds the class 'has-more-text' to the description container if the description is longer than the container and shows a gradient at the bottom when it's not expanded
    if (descriptionContainerElement.scrollHeight > descriptionContainerElement.clientHeight) {
        descriptionContainerElement.classList.add('has-more-text');
    }

    //made the description expand on hover and collapse on mouseleave of the entire card
    descriptionContainerElement.addEventListener('mouseenter', () => {
        descriptionContainerElement.classList.add('expanded');
    });

    card.addEventListener('mouseleave', () => {
        descriptionContainerElement.classList.remove('expanded');
    });
}

function renderCheckoutCard(element) {
    const checkoutCard = document.createElement('div');
    checkoutCard.classList.add('col-8', 'mb-4');
    checkoutCard.innerHTML = `
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
                            <p class="small text-muted">${element.rating.rate} rating (${element.rating.count} votes)</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
`;
    document.querySelector('.checkout').appendChild(checkoutCard);

    totalPrice += element.price * element.quantity;
}

function renderInDropdown(element) {
    let list = document.createElement('li');
    list.classList.add('dropdown-item');
    list.classList.add('dropdown-item-container');
    list.innerHTML = `
        <img src="${element.image}" class="" alt="${element.title}">
        <p class="">${element.title}</p>
        <p>${element.price}</p>
        <button class="btn btn-primary" data-bs-toggle="modal">DELETE</button>
        `;
    document.querySelector('.dropdown-menu').appendChild(list);

    list.querySelector('.btn').addEventListener('click', () => {
        //ta bort från arrayen och localstorage
    });
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

function renderConfirmationCard(element) {
    let card = document.createElement('div');
    card.innerHTML = `
    <img src="${element.image}" alt="${element.title}" class="checkout-image">
    <h4>${element.title}</h4>
    <p>${element.price} $</p>
    <p>${element.rating.rate} rating (${element.rating.count} votes)</p>
    `;

    document.getElementById('item').appendChild(card);
}

if (document.querySelector('.shopping')) {

    const TIMEOUT = 5000;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => { controller.abort(); }, TIMEOUT);

    //https://server.knotten.net/fakestore/
    //https://fakestoreapi.com/products
    fetch('https://server.knotten.net/fakestore/', { signal: controller.signal })
        .then(res => res.json()
            .then(data => {
                console.log("fetch success from api");
                data.forEach(renderProductCard);
                clearTimeout(timeoutId);
            })
            .catch(error => {
                console.log(`Failed to parse response as JSON: ${error}`);
                products.forEach(renderProductCard);
            })
        )
        .catch(error => {
            console.log(`Failed to fetch api after ${TIMEOUT / 1000} seconds, ` + error);
            products.forEach(renderProductCard);
        });
}

if (document.querySelector('.checkout')) {
    shop = JSON.parse(localStorage.getItem('shop'));
    const priceLocation = document.getElementById('totalprice');

    if (shop != null) {
        shop.forEach(renderCheckoutCard);
        priceLocation.innerHTML = `Total Sum: $${totalPrice}`;
    } else {
        priceLocation.innerHTML = `Your cart is empty`;
    }



    const total = {
        name: false,
        email: false,
        phone: false,
        address: false,
        zip: false,
        city: false
    };

    const nameError = document.getElementById("nameError");
    const emailError = document.getElementById("emailError");
    const phoneError = document.getElementById("phoneError");
    const addressError = document.getElementById("addressError");
    const zipError = document.getElementById("zipError");
    const cityError = document.getElementById("cityError");

    const name = document.getElementById("name");
    const email = document.getElementById("email");
    const phone = document.getElementById("phone");
    const address = document.getElementById("address");
    const zip = document.getElementById("zip");
    const city = document.getElementById("city");

    const phonePattern = /[0-9()-]+/;

    //const zipPattern = /^\d{3} \d{2}$/;
    //nya zippattern från en stackoverflow fråga
    const zipPattern = /^(?=(\D*\d){5}\D*$)(?=[^ ]* ?[^ ]*$)[\d ]*$/;

    const sendButton = document.getElementById("sendButton");

    function validateName() {
        if (name.value.length < 2 || name.value.length > 50) {
            nameError.innerHTML = "Name must be filled out and at least 2 characters long and not more than 50 characters";
            total.name = false;
            sendButton.disabled = true;
            return false;
        } else {
            nameError.innerHTML = "&nbsp;";
            total.name = true;
            if (Object.values(total).every((val) => val === true)) {
                sendButton.disabled = false;
            }
            return true;
        }
    }

    function validateEmail() {
        if (!email.value.includes("@") || email.value.length > 50) {
            emailError.innerHTML = "Email must be filled out and contain @ and not more than 50 characters";
            total.email = false;
            sendButton.disabled = true;
            return false;
        } else {
            emailError.innerHTML = "&nbsp;";
            total.email = true;
            if (Object.values(total).every((val) => val === true)) {
                sendButton.disabled = false;
            }
            return true;
        }
    }

    function validatePhone() {
        if (!phonePattern.test(phone.value) || phone.value.length > 50) {
            phoneError.innerHTML = "Phone must be filled out and contain only numbers, () and - and not more than 50 characters";
            total.phone = false;
            sendButton.disabled = true;
            return false;
        } else {
            phoneError.innerHTML = "&nbsp;";
            total.phone = true;
            if (Object.values(total).every((val) => val === true)) {
                sendButton.disabled = false;
            }
            return true;
        }
    }

    function validateAdress() {
        if (address.value.length < 1 || address.value.length > 50) {
            addressError.innerHTML = "Address must be filled out and not more than 50 characters";
            total.address = false;
            sendButton.disabled = true;
            return false;
        } else {
            addressError.innerHTML = "&nbsp;";
            total.address = true;
            if (Object.values(total).every((val) => val === true)) {
                sendButton.disabled = false;
            }
            return true;
        }
    }

    function validateZip() {
        if (!zipPattern.test(zip.value) || zip.value.length > 6) {
            zipError.innerHTML = "Zip must be filled out and contain only numbers in the format of (000 00) and not more than 6 characters";
            total.zip = false;
            sendButton.disabled = true;
            return false;
        } else {
            zipError.innerHTML = "&nbsp;";
            total.zip = true;
            if (Object.values(total).every((val) => val === true)) {
                sendButton.disabled = false;
            }
            return true;
        }
    }

    function validateCity() {
        if (city.value.length < 1 || city.value.length > 50) {
            cityError.innerHTML = "City must be filled out and not more than 50 characters";
            total.city = false;
            sendButton.disabled = true;
            return false;
        } else {
            cityError.innerHTML = "&nbsp;";
            total.city = true;
            if (Object.values(total).every((val) => val === true)) {
                sendButton.disabled = false;
            }
            return true;
        }
    }

    name.addEventListener("blur", validateName);
    email.addEventListener("blur", validateEmail);
    phone.addEventListener("blur", validatePhone);
    address.addEventListener("blur", validateAdress);
    zip.addEventListener("blur", validateZip);
    city.addEventListener("blur", validateCity);

    sendButton.addEventListener("click", validateForm);

    document.getElementById("buttonlocation").addEventListener("mouseover", function () {
        if (!validateName() || !validateEmail() || !validatePhone() || !validateAdress() || !validateZip() || !validateCity()) {
            if (buttonLocation.disabled == false) {
                buttonLocation.disabled = true;
            }
        }
    });

    function validateForm() {
        if (!validateName() || !validateEmail() || !validatePhone() || !validateAdress() || !validateZip() || !validateCity() || shop == null) {
            sendButton.disabled = true;
            if (shop == null) {
                alert("Your cart is empty");
            }
        } else {
            sessionStorage.setItem('customer', JSON.stringify({
                'name': name.value,
                'email': email.value,
                'phone': phone.value,
                'address': address.value,
                'zip': zip.value,
                'city': city.value
            }));
            location.href = "confirmation.html";
        }
    }
}

if (document.querySelector('.confirmation')) {

    const customer = JSON.parse(sessionStorage.getItem('customer'));
    const shop = JSON.parse(localStorage.getItem('shop'))

}