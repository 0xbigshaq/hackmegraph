
/* ==========================================  utils  ========================================== */

function escapeHTML(a) {
    return a.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function timeConverter(timestamp){ 
    var a = new Date(new Number(timestamp));
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
    return time;
  }

/* ========================================== end of utils  ========================================== */


function sendQuery(exec_query) {
    let xmlhttp = new XMLHttpRequest();   
    xmlhttp.open("POST", '/graphql');
    xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xmlhttp.send(JSON.stringify({ query: exec_query }));
    return new Promise( (resolve, reject) => {
        xmlhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                let resp = JSON.parse(this.responseText);
                resolve(resp);
                return;
            };
        }
    });

}


function getApproved() {
    sendQuery(`query {
        shoutouts(approved: true) {
        id
        approved
        shoutout_text
        name
        date_sent
        }
    }`).then((info) => {
        console.log(info);
            let feed = document.getElementById('feed');
            let final_feed = '';
            info.data.shoutouts.forEach( (el) => {
                el.date_sent = timeConverter(el.date_sent);
                el.shoutout_text = escapeHTML(el.shoutout_text); // prevent dom xss
                el.name = escapeHTML(el.name); // it is not THIS kind of a challenge.. (:
                final_feed += `
                <div class="shoutout">
                <span class='date'>${el.date_sent}</span> <br />
                <b>From: </b><span id="from">${el.name}</span> 
                <br />
                <b>Shoutout Message: </b> <span id="shoutout_message">${el.shoutout_text}</span>
            </div>
                `;
                feed.innerHTML = final_feed;
            } )
        });
}

function sendShoutout() {
    let name = document.getElementById('from_input').value;
    let text = document.getElementById('message_input').value;
    if(name.trim().length < 1 || text.trim().length < 1 ) { 
        alert("Please complete all the fields");
        return;
    }
    let stringified = JSON.stringify({ name: name, shoutout_text: text}).replace(/\"([^(\")"]+)\":/g,"$1:");

    sendQuery(`mutation {
        SendShoutout(requestInput: ${stringified}) {
          id
          approved
        }
      }`).then((info) => {
          document.getElementById('send_output').innerHTML = `Your request was sent! The tracking code is: <code>${info.data.SendShoutout.id}</code> <br /> Use it to see if the admin arleady approved your shout-out request.`;

      });
}

function checkStatus() {
    let tracking_id = document.getElementById('tracking_id').value.trim().replace(/\\/g, "\\\\").replace(/\"/g, "\\\"");
    if(tracking_id.length < 1) { 
        alert("Tracking ID can not be empty");
        return;
    }
    sendQuery(` query {
        shoutouts(id: "${tracking_id}") {
          id
          name
          approved
        }
      }
      `).then( (info) => {
          let dom = document.getElementById('status_output');
          info = info.data.shoutouts[0];
          if(info.name != null) {
            info.name = escapeHTML(info.name);
            dom.innerHTML = `Hello ${info.name}, your request `;
            if(info.approved) {
                dom.innerHTML += "was approved!"
            } else {
                dom.innerHTML += "is not approved yet :("
            }
        } else if(info.id.indexOf("You have an error in your SQL syntax; check the") != -1 ) {
            dom.innerHTML = "Something went wrong";
        } else {
            dom.innerHTML = "Request was not found";
        }

      });
}