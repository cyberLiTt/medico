document.getElementById('appointmentForm').addEventListener('submit', async function (e) {
  e.preventDefault(); // prevent page reload

  const form = e.target;

  const formData = {
    name: form.name.value.trim(),
    email: form.email.value.trim(),
    phone: form.phone.value.trim(),
    dateAndTimeBooked: form.date.value,
    department: form.department.value,
    doctor: form.doctor.value,
    subject: `Appointment with ${form.doctor.value} in ${form.department.value}`,
    message: form.message.value.trim()
  };

  // Show loading
  form.querySelector('.loading').style.display = 'block';
  form.querySelector('.error-message').style.display = 'none';
  form.querySelector('.sent-message').style.display = 'none';

  try {
    const response = await fetch('http://localhost:4000/appointments/book', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });

    const result = await response.json();

    form.querySelector('.loading').style.display = 'none';

    if (response.ok) {
      form.querySelector('.sent-message').style.display = 'block';
      form.reset();
    } else {
      form.querySelector('.error-message').textContent = result.message || 'Something went wrong!';
      form.querySelector('.error-message').style.display = 'block';
    }
  } catch (error) {
    console.error('Error:', error);
    form.querySelector('.loading').style.display = 'none';
    form.querySelector('.error-message').textContent = 'Network error. Please try again.';
    form.querySelector('.error-message').style.display = 'block';
  }
});
