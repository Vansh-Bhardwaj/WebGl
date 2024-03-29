function startHere() {
    var firstName = document.getElementById('Fname').value;
    var lastName = document.getElementById('Lname').value;
    var email = document.getElementById('Email').value;
    var address = document.getElementById('Address').value;
    var city = document.getElementById('City').value;
    var state = document.getElementById('State').value;
    var country = document.getElementById('Country').value;
    var zip = document.getElementById('Zip').value;
    var phone = document.getElementById('Phone').value;
    var donationAmount = document.getElementById('DonationAmount').value;

    alert("Thank you, " + firstName + " " + lastName + ", for your donation of " + donationAmount + ".\n\nWe Collected some of your data you can see below:\n- Email: " + email + "\n- Address: " + address + "\n- City: " + city + "\n- State: " + state + "\n- Country: " + country + "\n- Zip Code: " + zip + "\n- Phone Number: " + phone);
}
