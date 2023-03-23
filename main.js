let shop = [];

function addToCheckout(product) {
    shop.push(product);
    localStorage.setItem('shop', JSON.stringify(shop));
    location.href = "checkout.html";
}
// hej hej

function renderProductCard(element) {
    let card = document.createElement('div');
    card.classList.add('card');
    card.innerHTML = `
        <img src="${element.image}" alt="${element.title}">
        <h4>${element.title}</h4>
        <p>${element.price} $</p>
        <p class="desc">${element.description}</p>
        <p>${element.category}</p>
        <p>${element.rating.rate} rating (${element.rating.count} votes)</p>
        <button class="btn btn-primary" data-bs-toggle="modal">Buy this item</button>
    `;
    document.querySelector('.shopping').appendChild(card);

    card.querySelector('.btn').addEventListener('click', () => {
        addToCheckout(element);
    });

}

function renderCheckoutCard(element){
    let card = document.createElement('div');
    card.classList.add('card');
    card.innerHTML = `
        <img src="${element.image}" alt="${element.title}">
        <h4>${element.title}</h4>
        <p>${element.price} $</p>
        <p>${element.description}</p>
        <p>${element.category}</p>
        <p>${element.rating.rate} rating (${element.rating.count} votes)</p>
    `;
    document.querySelector('.checkout').appendChild(card);
}

if (document.querySelector('.shopping')) {
    const TIMEOUT = 5000;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {controller.abort();}, TIMEOUT);
    

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
    if (shop != null) {
        shop.forEach(renderCheckoutCard);
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


    function validateForm() {
        console.log("validateForm");
        if (!validateName() || !validateEmail() || !validatePhone() || !validateAdress() || !validateZip() || !validateCity()) {
            sendButton.disabled = true;

        } else {
            sessionStorage.setItem('customer', JSON.stringify({
                'name': name.value,
                'email': email.value,
                'phone': phone.value,
                'address': address.value,
                'zip': zip.value,
                'city': city.value
            }));
            location.href="confirmation.html";
        }
    }
}

// om vi har en modal på sidan
if (document.querySelector('.modal')) {
    console.log('modal found');
    let modal = document.getElementById("myModal");
    let span = document.getElementById("modalClose");
    let button = document.getElementById("modalButton");

    span.onclick = function () {
        modal.style.display = "none";
    }

    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    button.onclick = function () {
        modal.style.display = "none";
    }
}