async function signupFormHandler(event){
    event.preventDefault();

    // const email = document.querySelector('#email-signup').value.trim();
    const username = document.querySelector('#username-signup').value.trim();
    const password = document.querySelector('#password-signup').value.trim();

    if (username && password){
        const response = await fetch('/api/user', {
            method: 'post',
            body: JSON.stringify({
                username,
                password
            }),
            headers: {'Content-Type': 'application/json'}
        });

        if (response.ok) {
            console.log('Logging in');
            document.location.replace('/dashboard');
        } else {
            alert(response.statusText);
        }
    }

}

document.querySelector('.signup-form').addEventListener('submit', signupFormHandler);