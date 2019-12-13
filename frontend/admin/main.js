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
    xmlhttp.open("POST", '/admin/graphql');
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


function approve(id) {
    sendQuery(`mutation {
        ChangeStatus(id: "${id}", approved: true) {
          id
          approved
        }
      }`);
      getShoutouts();
}

function getShoutouts() {
    const options = ['true', 'false'];
    let status = options[document.getElementById('approved').selectedIndex];

    sendQuery(`query {
        GetShoutouts (approved: ${status}) {
        id
        approved
        shoutout_text
        name
        date_sent
        }
    }`).then((info) => {
        console.log(info);
        console.log(status);
            let feed = document.getElementById('feed');
            let final_feed = '';
            let btn = '';
            if(info.data.GetShoutouts[0].id == "none") {
                final_feed = 'No pending shout-outs!';
            } else {
                info.data.GetShoutouts.forEach( (feed_entry) => {
                    feed_entry.date_sent = timeConverter(feed_entry.date_sent);
                    feed_entry.shoutout_text = escapeHTML(feed_entry.shoutout_text); // prevent dom xss
                    feed_entry.name = escapeHTML(feed_entry.name); // this is not this kind of a challenge

                    if(feed_entry.approved === false) {
                        btn = `<button onclick='approve("${feed_entry.id}")'>Approve</button> <br />`;
                    }

                    final_feed += `
                    <div class="shoutout">
                    ${btn}
                    <span class='date'>${feed_entry.date_sent}</span> <br />
                    <b>From: </b><span id="from">${feed_entry.name}</span> 
                    <br />
                    <b>Shoutout Message: </b> <span id="shoutout_message">${feed_entry.shoutout_text}</span>
                </div>
                    `;
                    
                } )
            }

            feed.innerHTML = final_feed;
        });
}

function logout() {
    document.cookie.split(";").forEach(function(c) { document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); });
    document.location = '/admin';
}