/**
 * Service for submitting quotes to the backend API.
 * If VITE_API_URL is configured, performs a real fetch POST.
 * Otherwise, simulates an asynchronous submission allowing frontend demonstration.
 */
export async function submitQuote(formData) {
  const apiUrl = import.meta.env.VITE_API_URL;

  if (apiUrl) {
    const baseUrl = apiUrl.replace(/\/+$/, '');
    const endpoint = baseUrl.endsWith('/quote') || baseUrl.endsWith('/quotes')
      ? baseUrl
      : `${baseUrl}/quote`;

    const response = await fetch(endpoint, {
      method: 'POST',
      body: formData instanceof FormData ? formData : JSON.stringify(formData),
      headers: formData instanceof FormData ? {} : { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to submit quote: ${response.statusText}`);
    }

    return await response.json();
  }

  // Frontend simulation fallback if backend URL is not configured
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, message: 'Quote submitted successfully.' });
    }, 400);
  });
}

export default {
  submitQuote
};
