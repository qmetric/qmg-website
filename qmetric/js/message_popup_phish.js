
// Creare's 'Implied Consent' EU Cookie Law Banner v:2.4.1
// Conceived by Robert Kent, James Bavington & Tom Foyster

var dropCookie = true;                      // false disables the Cookie, allowing you to style the banner
var cookieDuration = 14;                    // Number of days before the cookie expires, and the banner reappears
var cookieName = 'complianceCookie';        // Name of our cookie
var cookieValue = 'on';                     // Value of cookie

function createDiv(){
    var bodytag = document.getElementsByTagName('body')[0];
    var div = document.createElement('div');
    div.setAttribute('id','cookie-law');
    div.setAttribute('class','message_cookies');
    div.innerHTML = "<div class='container'><h5><strong>Alert</strong><span class='cookie-message-close close-cookie-banner' onclick='removeMe();'>Close<span class='icon icon-cancel'><img src=\"img/cross_large.png\" style='width:15px;height:auto' alt=\"cross\"></span></span></h5><p>If you have received a Policy Expert \"purchase confirmation\" email, but have not bought a policy from us, please delete it immediately and do not click on any of the links. This is a phishing attempt by a third party. </p><p>Policy Expert data remains secure and has not been compromised.</p> <p>We apologise for any inconvenience and can confirm that we are taking action to try and stop any re-occurrence. <a href='http://www.policyexpert.co.uk/alert-phishing-scam'>Read more.</a></p></div>";

     bodytag.appendChild(div); // Adds the Cookie Law Banner just before the closing </body> tag

    document.getElementsByTagName('body')[0].className+=' cookiebanner'; //Adds a class tothe <body> tag when the banner is visible
}


function createCookie(name,value,days) {
    if (days) {
        var date = new Date();
        date.setTime(date.getTime()+(days*24*60*60*1000));
        var expires = "; expires="+date.toGMTString();
    }
    else var expires = "";
    if(window.dropCookie) {
        document.cookie = name+"="+value+expires+"; path=/";
    }
}

function checkCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

function eraseCookie(name) {
    createCookie(name,"",-1);
}

window.onload = function(){
    if(checkCookie(window.cookieName) != window.cookieValue){
        createDiv();
    }
}

function removeMe(){
	// Create the cookie only if the user click on "Close"
	createCookie(window.cookieName,window.cookieValue, window.cookieDuration); // Create the cookie
	// then close the window/
	var element = document.getElementById('cookie-law');
	element.parentNode.removeChild(element);
}
