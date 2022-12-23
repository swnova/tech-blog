async function loginFormHandler(event){
    // console.log("two 2")
    event.preventDefault();

    const username =document.querySelector('#username-login').value.trim();
    const password = document.querySelector('#password-login').value.trim();

    if (username && password) {
        const response = await fetch('/api/user/login', {
            method: 'post',
            body: JSON.stringify({
                username,
                password
            }),
            headers: {'Content-Type': 'application/json'}
        });
        console.log(response)
        if (response.ok) {
            console.log('Logging in');
            document.location.replace('/dashboard');
        } else {
            alert(response.statusText);
        }
    }
}
const loginForm = document.querySelector('#login')
console.log('#login', loginForm)
loginForm.addEventListener('click', loginFormHandler);