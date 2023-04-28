async function loginFormHandler(event) {
    console.log('loginFormHandler function called');
    event.preventDefault();

    const email = document.querySelector('#email-login').value.trim();
    const password = document.querySelector('#password-login').value.trim();

    if (email && password) {
        const response = await fetch('/api/users/login', {
            method: 'POST',
            body: JSON.stringify({
                email,
                password
            }),
            headers: { 'Content-Type': 'application/json' }
        });

        console.log(response);

        if (response.ok) {
            console.log('relocating to dashboard');
            document.location.replace('/dashboard');
        } else {
            alert(response.statusText);
        }
        console.log(response.ok);
    }
}

document.querySelector('.login-form').addEventListener('submit', loginFormHandler);