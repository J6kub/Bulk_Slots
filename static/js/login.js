let login = document.getElementById('login');
let register = document.getElementById('register');

function switchView() {
    if (login.hidden) {
        login.hidden = false;
        register.hidden = true;
    } else {
        login.hidden = true;
        register.hidden = false;
    }
}
document.querySelectorAll('a').forEach((a_element) => a_element.onclick = switchView)