$('#login-form').submit(function(event) {
  event.preventDefault();

  const username = $('#username').val();
  const password = $('#password').val();

  $.ajax({
    url: '/login',
    method: 'POST',
    data: { username, password },
    success: function(response) {
  if (response.success) {
    const vendorId = response.vendorId;
    window.location.href = `/vendor-login.html?id=${vendorId}`;
  } else {
    alert('Login failed');
  }
},

    error: function(xhr) {
      console.error(xhr.responseText);
    }
  });
});
