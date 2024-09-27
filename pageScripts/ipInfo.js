function waitForElm(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                observer.disconnect();
                resolve(document.querySelector(selector));
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}


function parseJSON(json) {
    let ipAddress = "Unknown"
    let hostname = "Unknown"
    let anycast = "false"
    let city = "Unknown"
    let region = "Unknown"
    let country = "Unknown"
    let asn = "Unknown"
    let asnName = "Unknown"
    let asnType = "Unknown"
    let companyName = "Unknown"
    let companyType = "Unknown"
    let vpn = "Unknown"
    let proxy = "Unknown"
    let tor = "Unknown"
    let relay = "Unknown"
    let hosting = "Unknown"
    let privacyService = "Unknown"
    let totalDomains = "Unknown"
    let domains = "Unknown"
    if (json.ip != undefined) { ipAddress = json.ip.replaceAll(`.`, `[.]`) }
    if (json.hostname != undefined) { hostname = json.hostname.replaceAll(`.`, `[.]`) }
    if (json.anycast != undefined) { anycast = json.anycast }
    if (json.city != undefined) { city = json.city }
    if (json.region != undefined) { region = json.region }
    if (json.country != undefined) { country = json.country }
    if (json.asn.asn != undefined) { asn = json.asn.asn }
    if (json.asn.name != undefined) { asnName = json.asn.name }
    if (json.asn.type != undefined) { asnType = json.asn.type }
    if (json.company.name != undefined) { companyName = json.company.name }
    if (json.company.type != undefined) { companyType = json.company.type }
    if (json.privacy.vpn != undefined) { vpn = json.privacy.vpn }
    if (json.privacy.proxy != undefined) { proxy = json.privacy.proxy }
    if (json.privacy.tor != undefined) { tor = json.privacy.tor }
    if (json.privacy.relay != undefined) { relay = json.privacy.relay }
    if (json.privacy.hosting != undefined) { hosting = json.privacy.hosting }
    if (json.privacy.service != undefined && json.privacy.service != "") { privacyService = json.privacy.service }
    if (json.domains.total != undefined) { totalDomains = json.domains.total }
    if (json.domains.domains != undefined) { if (json.domains.domains.length != 0) { domains = json.domains.domains.toString(); domains = domains.replaceAll(",", "\n").replaceAll(`.`, `[.]`) } else { domains = "None" } }

    let text = `| IP | ${ipAddress} |\n|---|---|\n| Hostname | ${hostname} |\n| Anycast | ${anycast} |\n| City | ${city} |\n| Region | ${region} |\n| Country | ${country} |\n| ASN | ${asn} |\n| ASN Name | ${asnName} |\n| ASN Type | ${asnType} |\n| Company Name | ${companyName} |\n| Company Type | ${companyType} |\n| VPN | ${vpn} |\n| Proxy | ${proxy} |\n| Tor | ${tor} |\n| Relay | ${relay} |\n| Hosting Provider | ${hosting} |\n| Privacy Service | ${privacyService} |\n| Total Domains | ${totalDomains} |\n| Domains | ${domains} |`

    navigator.clipboard.writeText(text)

}

waitForElm('#menu-items').then((elm) => {
    let jsonResponse = ""
    let child = elm.firstElementChild
    let cloned = child.cloneNode(true)
    let cloneChild = cloned.firstElementChild
    cloneChild.className = 'nav-link'
    cloneChild.removeAttribute("href")
    cloneChild.innerText = "Copy Information (Logged In)"
    let ipAddress = document.querySelector('.h1-max').innerText
    fetch(`https://ipinfo.io/account/search?query=${ipAddress}`, { headers: { "Content-Type": "application/json" } })
        .then((response) => response.json())
        .then((json) => {
            jsonResponse = json
        });

    cloned.addEventListener("click", () => {
        cloneChild.className = 'nav-link active'
        if (jsonResponse != "") {
            parseJSON(jsonResponse)
        }
        else {
            fetch(`https://ipinfo.io/account/search?query=${ipAddress}`, { headers: { "Content-Type": "application/json" } })
                .then((response) => response.json())
                .then((json) => {
                    parseJSON(json)
                });
        }
        cloneChild.className = 'nav-link'
    })
    elm.appendChild(cloned)

});