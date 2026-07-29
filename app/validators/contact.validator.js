function validateContact(contact) {

    const errors = [];

    if (!contact.first_name || contact.first_name.trim() === "") {
        errors.push("First name is required.");
    }

    if (!contact.phone || contact.phone.trim() === "") {
        errors.push("Phone number is required.");
    }

    if (
        contact.phone &&
        !/^[0-9]{10,15}$/.test(contact.phone)
    ) {
        errors.push("Phone number must contain 10-15 digits.");
    }

    if (
        contact.email &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email)
    ) {
        errors.push("Invalid email address.");
    }

    return errors;

}

module.exports = validateContact;