import emailjs from '@emailjs/browser';

/**
 * EmailJS is the only delivery path for the contact form — this site is a
 * static frontend with no backend of its own. Credentials come from Vite env
 * vars at build time, with the production values as defaults. EmailJS public
 * keys are designed to be exposed in the browser.
 */
export const EMAILJS_CONFIG = {
  serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID,
  templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
  publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
};

const CONTACT_EMAIL = 'qourlexai@gmail.com';

/**
 * Sends a contact form inquiry via EmailJS.
 *
 * @param {Object} formData
 * @param {string} formData.name
 * @param {string} formData.email
 * @param {string} [formData.phone]
 * @param {string} [formData.company]
 * @param {string} [formData.message]
 * @returns {Promise<{success: boolean, message: string}>}
 */
export const sendContactMessage = async (formData) => {
  const templateParams = {
    from_name: formData.name,
    from_email: formData.email,
    phone: formData.phone || 'Not provided',
    company: formData.company || 'Not provided',
    message: formData.message || 'No additional message provided',
  };
  
  console.log('Service ID:', EMAILJS_CONFIG.serviceId);
  try {
    const response = await emailjs.send(
      EMAILJS_CONFIG.serviceId,
      EMAILJS_CONFIG.templateId,
      templateParams,
      EMAILJS_CONFIG.publicKey
    );
    if (response.status === 200 || response.text === 'OK') {
      return {
        success: true,
        message: "Message sent! We'll get back to you within 24 hours.",
      };
    }

    throw new Error(`Unexpected EmailJS response: ${response.status}`);
  } catch (error) {
    console.error('Contact form delivery failed:', error);
    return {
      success: false,
      message: `Something went wrong. Please try again or email us directly at ${CONTACT_EMAIL}.`,
    };
  }
};
