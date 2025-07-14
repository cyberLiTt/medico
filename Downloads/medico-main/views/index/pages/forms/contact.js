document.getElementById('contactForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const form = e.target;

  const formData = {
    name: form.name.value.trim(),
    email: form.email.value.trim(),
    subject: form.subject.value.trim(),
    message: form.message.value.trim()
  };

  // UI feedback
  form.querySelector('.loading').style.display = 'block';
  form.querySelector('.error-message').style.display = 'none';
  form.querySelector('.sent-message').style.display = 'none';

  try {
    const response = await fetch('http://localhost:4000/contact/sendEmailAndSave', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    const result = await response.json();

    form.querySelector('.loading').style.display = 'none';

    if (response.ok) {
      form.querySelector('.sent-message').style.display = 'block';
      form.reset();
    } else {
      form.querySelector('.error-message').textContent = result.message || 'Failed to send message.';
      form.querySelector('.error-message').style.display = 'block';
    }
  } catch (error) {
    console.error('❌ Contact form error:', error);
    form.querySelector('.loading').style.display = 'none';
    form.querySelector('.error-message').textContent = 'Network error. Please try again.';
    form.querySelector('.error-message').style.display = 'block';
  }
});
