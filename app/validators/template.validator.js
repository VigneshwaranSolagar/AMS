function validateTemplate(data) {

    const errors = [];

    if (!data.template_name?.trim())
        errors.push("Template name is required.");

    if (!data.message?.trim())
        errors.push("Message is required.");

    return errors;

}

module.exports = validateTemplate;