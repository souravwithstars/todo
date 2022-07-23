const showError = error => {
  const errorMessage = error.split('%20').join(' ');
  const errorElement = document.getElementById('error');
  errorElement.innerText = errorMessage;
  return;
};

const parseCookie = cookie => {
  const parsedCookies = {};
  if (!cookie) {
    return parsedCookies;
  }
  const cookies = cookie.split(';');
  cookies.forEach(cookie => {
    const [key, value] = cookie.split('=');
    parsedCookies[key.trim()] = value.trim();
  })
  return parsedCookies;
};

const serveError = () => {
  const { error } = parseCookie(document.cookie);
  if (error) {
    showError(error);
  }
  return;
};

window.onload = serveError;