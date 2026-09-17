export const PHONE_REGEX = /^[+]?[\d\s-]{7,15}$/;
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateQuoteInput(data) {
  const errors = {};

  const fullName = (data.fullName || data.fname || '').trim();
  const phone = (data.phone || data.fphone || '').trim();
  const email = (data.email || data.femail || '').trim();
  const location = (data.location || data.flocation || '').trim();
  const service = (data.serviceRequired || data.fservice || data.service || '').trim();
  const material = (data.material || data.fmaterial || '').trim();
  const projectType = (data.projectType || data.fptype || '').trim();
  const requirements = (data.approximateRequirements || data.freq || '').trim();
  const message = (data.message || data.fmsg || '').trim();

  // Full Name - Mandatory
  if (!fullName || fullName.length < 2) {
    errors.fullName = 'Full Name must contain at least 2 characters.';
  } else if (fullName.length > 100) {
    errors.fullName = 'Full Name must not exceed 100 characters.';
  }

  // Phone - Mandatory
  if (!phone || !PHONE_REGEX.test(phone)) {
    errors.phone = 'Please enter a valid phone number (7-15 digits).';
  }

  // Email - Optional (only validated if provided)
  if (email) {
    if (!EMAIL_REGEX.test(email)) {
      errors.email = 'Please enter a valid email address.';
    } else if (email.length > 150) {
      errors.email = 'Email address must not exceed 150 characters.';
    }
  }

  // Location - Mandatory
  if (!location) {
    errors.location = 'Location / Branch is required.';
  }

  // Service Required - Mandatory
  if (!service) {
    errors.serviceRequired = 'Service selection is required.';
  }

  // Material - Mandatory
  if (!material) {
    errors.material = 'Material selection is required.';
  }

  // Project Type - Mandatory
  if (!projectType) {
    errors.projectType = 'Project type is required.';
  }

  // Approximate Requirements - Mandatory
  if (!requirements) {
    errors.approximateRequirements = 'Approximate requirements (dimensions, quantity, or area) are required.';
  } else if (requirements.length > 500) {
    errors.approximateRequirements = 'Requirements must not exceed 500 characters.';
  }

  // Message - Mandatory
  if (!message) {
    errors.message = 'Project message or description is required.';
  } else if (message.length > 2000) {
    errors.message = 'Message must not exceed 2000 characters.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

export function validateContactInput(data) {
  const errors = {};

  const name = (data.name || data.fullName || '').trim();
  const email = (data.email || '').trim();
  const phone = (data.phone || '').trim();
  const message = (data.message || '').trim();

  if (!name || name.length < 2) {
    errors.name = 'Name must be at least 2 characters.';
  }

  if (!email || !EMAIL_REGEX.test(email)) {
    errors.email = 'Please provide a valid email address.';
  }

  if (phone && !PHONE_REGEX.test(phone)) {
    errors.phone = 'Please provide a valid phone number.';
  }

  if (!message || message.length < 5) {
    errors.message = 'Message must be at least 5 characters.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}
