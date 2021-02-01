async function logout() {
    const response = await fetch('/api/users/logout', {
        method: 'post',
        headers: {'Content-Type': 'application/json'}
    });

    if (response.ok) {
        document.location.replace('/');
        alert('You are now logged out!');
    } else {
        alert(response.statusText);
    }
}

// Log user out after 10 minutes
setInterval(logout, 600000);

document.querySelector('#logout').addEventListener('click', logout);