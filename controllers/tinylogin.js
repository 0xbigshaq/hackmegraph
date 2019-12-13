module.exports = {
    tinylogin: `
    
    <html>
    <head> 
        <title>Admin Backoffice Login</title>
        <script>
            function login() {
                let usr = document.getElementById('usr').value;
                let pwd = document.getElementById('pwd').value;

                let xmlhttp = new XMLHttpRequest();   
                xmlhttp.open("POST", '/superuser/session');
                xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
                xmlhttp.send(JSON.stringify({ username: usr, password: pwd }));
                xmlhttp.onreadystatechange = function() {
                    if (this.status == 200 && this.readyState == XMLHttpRequest.DONE) {
                        document.location = '/admin';
                        return;
                    } 
                    if(this.status == 403 && this.readyState == XMLHttpRequest.DONE) {
                        alert('nope');
                        return;
                    }
                }
                
            }
        </script>
    </head>
    <body>
<h1>Admin Portal</h1>
    Username: <input type='text' id='usr'>
    <Br />
    Password: <input type='password' id='pwd' />
    <br />
    <button onclick='login()'>Login</button>
    </body>
    </html>
    
    `
}