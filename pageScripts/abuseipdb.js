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

waitForElm('#report-wrapper').then((report) => {
    let isp = "None"
    let usageType = "None"
    let hostname = "None"
    let domainName = "None"
    let country = "None"
    let city = "None"
    let reports = "0"
    let confidence = "0%"

    let header = report.querySelector('.well')
    let inDatabase = header.firstElementChild.innerText
    let ipAddress = inDatabase.split(" ")[0].trim()
    inDatabase = inDatabase.replace(`${ipAddress} was `, "").replace("our", "AbuseIPDB")
    inDatabase = (inDatabase.charAt(0).toUpperCase() + inDatabase.slice(1)).trim()
    ipAddress = ipAddress.replaceAll(`.`, `[.]`)

    let table = header.querySelector(".table").firstElementChild.children
    for (let item of table) {
        if (item.firstElementChild.innerText.includes("ISP")) {
            isp = item.lastElementChild.innerText.trim()
        }
        else if (item.firstElementChild.innerText.includes("Usage Type")) {
            usageType = item.lastElementChild.innerText.trim()
        }
        else if (item.firstElementChild.innerText.includes("Domain Name")) {
            domainName = item.lastElementChild.innerText.trim().replaceAll(`.`, `[.]`)
        }
        else if (item.firstElementChild.innerText.includes("Hostname(s)")) {
            hostname = item.lastElementChild.innerText.trim().replaceAll(`.`, `[.]`)
            if ((hostname.split("\n").length - 1) == 1) {
                hostname = hostname.replace("\n", "")
            }
        }
        else if (item.firstElementChild.innerText.includes("Country")) {
            country = item.lastElementChild.innerText.trim()
        }
        else if (item.firstElementChild.innerText.includes("City")) {
            city = item.lastElementChild.innerText.trim()
        }
    }

    isReported = header.querySelector("p")
    if (isReported.innerHTML.includes("/faq.html#confidence")) {
        reports = isReported.querySelector("b").innerText
        confidence = isReported.querySelector("b:nth-child(2)").innerText
    }

    text = `| IP Address | ${ipAddress} |\n| --- | --- |\n| In Database | ${inDatabase} |\n| Abuse Reports | ${reports} |\n| Abuse Confidence | ${confidence} |\n| ISP | ${isp} |\n| Usage Type | ${usageType} |\n| Hostname(s) | ${hostname} |\n| Domain Name | ${domainName} |\n| Country | ${country} |\n| City | ${city} |`

    let cloneCopy = header.querySelector(".col-md-6").cloneNode(true)
    let cloneChild = cloneCopy.firstElementChild
    cloneChild.removeAttribute("href")
    cloneChild.removeAttribute("rel")
    cloneChild.innerText = "Copy Table"
    cloneChild.addEventListener("click", () => { navigator.clipboard.writeText(text) })
    header.querySelector(".col-md-6").parentElement.appendChild(cloneCopy)

});