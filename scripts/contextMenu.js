//---------------------------Basic Functions------------------------
function byte_format(bytes) {
    bytes = bytes.toString().replace(/[^0-9.]/g, '');
    var sizes = ["B", "KiB", "MiB", "GiB", "TiB"];
    bytes = parseInt(bytes);
    if (bytes <= 0 || isNaN(bytes)) return "0 B";
    var i = Math.floor(Math.log(bytes) / Math.log(1000));
    var result = Math.round((bytes / Math.pow(1024, i) + Number.EPSILON) * 100) / 100 + ' ' + sizes[i]
    browser.notifications.create({
        type: 'basic',
        iconUrl: '../img/32.png',
        title: `${bytes} bytes is`,
        message: `${result}`,
        priority: 0
    })
}

function create_bookmarks(array, parentID = 1, title = "Extension bookmarks", url = '') {
    if (array == "" && parentID == 1) {
        array = items
    }
    browser.bookmarks.create(
        { 'parentId': `${parentID}`, 'title': `${title}`, 'url': `${url}` },
        function (newFolder) {
            array.forEach(element => {
                if (typeof element.link == "string" && element.link.startsWith("http")) {
                    browser.bookmarks.create(
                        { 'parentId': `${newFolder.id}`, 'title': `${element.Name.replace("Search", "")}`, 'url': `${element.link.replace("${query}", "")}` },
                        function (child) {
                        },)
                }
                if (element.isParent == true) {
                    create_bookmarks(element.children, newFolder.id, element.Name)
                }
            });
        },
    );

}

//---------------------------Context Menu items------------------------


const IP_Lookup = [
    {
        Name: "Search Multiple Sources for IP",
        isParent: false,
        link: [
            "https://www.abuseipdb.com/check/${query}",
            "https://ipinfo.io/${query}",
            "https://www.virustotal.com/#/search/${query}",
            "https://whois.domaintools.com/${query}",
            "https://urlscan.io/domain/${query}",
            "https://www.shodan.io/host/${query}",
            "https://search.censys.io/hosts/${query}",
            "https://spur.us/context/${query}",
            "https://app.crowdsec.net/cti/${query}",
            "https://www.ipqualityscore.com/free-ip-lookup-proxy-vpn-test/lookup/${query}",
            "https://pulsedive.com/indicator/${query}",
            "https://viz.greynoise.io/ip/${query}",
            "https://www.geolocation.com/?ip=${query}#ipresult",
            "https://exchange.xforce.ibmcloud.com/ip/${query}",
            "https://exchange.xforce.ibmcloud.com/url/${query}",
            "https://talosintelligence.com/reputation_center/lookup?search=${query}",
            "https://www.google.com/search?q=${query}"
        ],
        contexts: ['link', 'selection']
    },
    {
        Name: "Search AbuseIP",
        isParent: false,
        link: "https://www.abuseipdb.com/check/${query}",
        contexts: ['link', 'selection']
    },
    {
        Name: "Search IPInfo",
        isParent: false,
        link: "https://ipinfo.io/${query}",
        contexts: ['selection']
    },

    {
        Name: "Search Virus Total",
        isParent: false,
        link: "https://www.virustotal.com/#/search/${query}",
        contexts: ['link', 'selection']
    },
    {
        Name: "Search IP Co-Host",
        isParent: false,
        link: "https://host.io/ip/${query}",
        contexts: ['link', 'selection']
    },
    {
        Name: "Search Shodan",
        isParent: false,
        link: "https://www.shodan.io/host/${query}",
        contexts: ['link', 'selection']
    },
    {
        Name: "Search Censys",
        isParent: false,
        link: "https://search.censys.io/hosts/${query}",
        contexts: ['link', 'selection']
    },
    {
        Name: "Search Spur",
        isParent: false,
        link: "https://spur.us/context/${query}",
        contexts: ['link', 'selection']
    },
    {
        Name: "Search CrowdSec",
        isParent: false,
        link: "https://app.crowdsec.net/cti/${query}",
        contexts: ['link', 'selection']
    },
    {
        Name: "Search IPQualityScore",
        isParent: false,
        link: "https://www.ipqualityscore.com/free-ip-lookup-proxy-vpn-test/lookup/${query}",
        contexts: ['link', 'selection']
    },
    {
        Name: "Search Cisco Talos",
        isParent: false,
        link: "https://talosintelligence.com/reputation_center/lookup?search=${query}",
        contexts: ['link', 'selection']
    },
    {
        Name: "Search Pulsedive",
        isParent: false,
        link: "https://pulsedive.com/indicator/${query}",
        contexts: ['link', 'selection']
    },
    {
        Name: "Search Greynoise",
        isParent: false,
        link: "https://viz.greynoise.io/ip/${query}",
        contexts: ['link', 'selection']
    },
    {
        Name: "Search Geolocation",
        isParent: false,
        link: "https://www.geolocation.com/?ip=${query}#ipresult",
        contexts: ['link', 'selection']
    },
    {
        Name: "Search IBM Xforce (IP)",
        isParent: false,
        link: "https://exchange.xforce.ibmcloud.com/ip/${query}",
        contexts: ['link', 'selection']
    },
    {
        Name: "Open Bulk IP Lookup",
        isParent: false,
        link: "https://www.infobyip.com/ipbulklookup.php",
        contexts: ['page']
    },
    {
        Name: "Open DIG",
        isParent: false,
        link: "https://toolbox.googleapps.com/apps/dig/",
        contexts: ['page']
    },
    {
        Name: "Open Centralops Network Tools",
        isParent: false,
        link: "https://centralops.net/co/",
        contexts: ['page']
    },
]

const Domain_lookup = [
    {
        Name: "Open in Browserling",
        isParent: false,
        link: "https://www.browserling.com/browse/win10/chrome122/${query}",
        contexts: ['link', 'selection']
    },
    {
        Name: "Search IBM Xforce (URL)",
        isParent: false,
        link: "https://exchange.xforce.ibmcloud.com/url/${query}",
        contexts: ['link', 'selection']
    },
    {
        Name: "Search URLscan",
        isParent: false,
        link: "https://urlscan.io/domain/${query}",
        contexts: ['link', 'selection']
    },
    {
        Name: "Search Domain Information",
        isParent: false,
        link: "https://host.io/${query}",
        contexts: ['link', 'selection']
    },
    {
        Name: "Search WhoIS",
        isParent: false,
        link: "https://whois.domaintools.com/${query}",
        contexts: ['link', 'selection']
    },
    {
        Name: "Search DNS Records",
        isParent: false,
        link: "https://www.nslookup.io/domains/${query}/dns-records/",
        contexts: ['link', 'selection']
    },
    {
        Name: "Open Passive DNS History",
        isParent: false,
        link: "https://passivedns.mnemonic.no/",
        contexts: ['page']
    },
    {
        Name: "Open DNS Dumpster",
        isParent: false,
        link: "https://dnsdumpster.com/",
        contexts: ['page']
    },
]

const Hash_Lookup = [
    {
        Name: "Search Multiple Sources for Hash",
        isParent: false,
        link: [
            "https://www.virustotal.com/#/search/${query}",
            "https://exchange.xforce.ibmcloud.com/malware/${query}",
            "https://www.hybrid-analysis.com/search?query=${query}",
            "https://www.echotrail.io/insights/search/${query}",
            "https://talosintelligence.com/reputation_center/lookup?search=${query}"
        ],
        contexts: ['link', 'selection']
    },
    {
        Name: "Search Virus Total (Hash)",
        isParent: false,
        link: "https://www.virustotal.com/#/search/${query}",
        contexts: ['link', 'selection']
    },
    {
        Name: "Search IBM Xforce",
        isParent: false,
        link: "https://exchange.xforce.ibmcloud.com/malware/${query}",
        contexts: ['link', 'selection']
    },
    {
        Name: "Search Hybrid Analysis",
        isParent: false,
        link: "https://www.hybrid-analysis.com/search?query=${query}",
        contexts: ['link', 'selection']
    },
    {
        Name: "Search Echo Trail",
        isParent: false,
        link: "https://www.echotrail.io/insights/search/${query}",
        contexts: ['link', 'selection']
    },
    {
        Name: "Search Cisco Talos (Hash)",
        isParent: false,
        link: "https://talosintelligence.com/reputation_center/lookup?search=${query}",
        contexts: ['link', 'selection']
    },
]

const Search_Engines = [
    {
        Name: "Search Google",
        isParent: false,
        link: "https://www.google.com/search?q=${query}",
        contexts: ['link', 'selection']
    },
    {
        Name: "Search Bing",
        isParent: false,
        link: "https://www.bing.com/search?q=${query}",
        contexts: ['link', 'selection']
    },
    {
        Name: "Search SearXNG",
        isParent: false,
        link: "https://searx.alexw-578.co.uk/search?q=${query}&language=auto&time_range=&safesearch=0&categories=general",
        contexts: ['link', 'selection']
    },
]

const CyberChef = [
    {
        Name: "Open in Cyber Chef",
        isParent: false,
        link: "https://gchq.github.io/CyberChef/#input=${query}",
        isB64: true,
        contexts: ['page', 'selection']
    },
    {
        Name: "De-fang IP/URL",
        isParent: false,
        link: "https://gchq.github.io/CyberChef/#recipe=Defang_IP_Addresses()Defang_URL(true,true,true,'Valid%20domains%20and%20full%20URLs')&input=${query}",
        isB64: true,
        contexts: ['page', 'selection']
    },
    {
        Name: "Decode encoded PS command",
        isParent: false,
        link: "https://gchq.github.io/CyberChef/#recipe=From_Base64('A-Za-z0-9%2B/%3D',true)Decode_text('UTF-16LE%20(1200)')&input=${query}",
        isB64: true,
        contexts: ['page', 'selection']
    },
]

const Misc = [
    {
        Name: "Parse User Agent",
        isParent: false,
        link: "https://Henard.tech/ua-parser.html?ua=${query}",
        contexts: ['selection']
    },
    {
        Name: "Convert from Bytes",
        isParent: false,
        link: byte_format,
        contexts: ['selection']
    },
    {
        Name: "Open Joe Sandbox (Paid)",
        isParent: false,
        link: "https://jbxcloud.joesecurity.org/login",
        contexts: ['page', 'selection']
    },
]

// const Extension_Pages = [
//     {
//         Name: "Open Extensions FTB",
//         isParent: false,
//         link: "mainFTB.html",
//         contexts: ['page', 'selection']
//     },
//     {
//         Name: "Open Mail Stripper",
//         isParent: false,
//         link: "parsing/mail_stripper.html",
//         contexts: ['page', 'selection']
//     },
// ]

const QuickLinks = [
    {
        Name: "Search LOLBAS",
        isParent: false,
        link: "https://lolbas-project.github.io/#${query}",
        contexts: ['page', 'selection']
    },
    {
        Name: "Open Parse User Agent",
        isParent: false,
        link: "https://explore.whatismybrowser.com/useragents/parse/",
        contexts: ['page', 'selection']
    },
    {
        Name: "Open MAC OUI Lookup",
        isParent: false,
        link: "https://www.wireshark.org/tools/oui-lookup.html",
        contexts: ['page', 'selection']
    },
    {
        Name: "Open Microsoft Error Lookup",
        isParent: false,
        link: "https://login.microsoftonline.com/error",
        contexts: ['page', 'selection']
    },
    {
        Name: "Search Windows Event ID",
        isParent: false,
        link: "https://www.ultimatewindowssecurity.com/securitylog/encyclopedia/event.aspx?eventid=${query}",
        contexts: ['page', 'selection']
    },
    {
        Name: "Windows Failed Login Sub-status",
        isParent: false,
        link: "https://www.ultimatewindowssecurity.com/securitylog/encyclopedia/event.aspx?eventID=4625",
        contexts: ['page', 'selection']
    },
    {
        Name: "Entra Auth Error codes",
        isParent: false,
        link: "https://learn.microsoft.com/en-us/entra/identity-platform/reference-error-codes",
        contexts: ['page', 'selection']
    },
]

const User_OSINT = [
    {
        Name: "Email lookup (EPIEOS)",
        isParent: false,
        link: "https://epieos.com/?q=${query}&t=email",
        contexts: ['page', 'selection']
    },
    {
        Name: "Username Lookup (Whats my name)",
        isParent: false,
        link: "https://whatsmyname.app/#",
        contexts: ['page', 'selection']
    },
]

const General_Info = [
    {
        Name: "Country ISO Codes",
        isParent: false,
        link: "https://en.wikipedia.org/wiki/List_of_ISO_3166_country_codes",
        contexts: ['page']
    },
    {
        Name: "MITRE ATTACK Matrix",
        isParent: false,
        link: "https://attack.mitre.org/matrices/enterprise/",
        contexts: ['page']
    },
    {
        Name: "OSINT Framework",
        isParent: false,
        link: "https://osintframework.com/",
        contexts: ['page']
    },
    {
        Name: "Living off the False Positive (LoFP)",
        isParent: false,
        link: "https://br0k3nlab.com/LoFP/",
        contexts: ['page']
    },
    {
        Name: "RegEx101",
        isParent: false,
        link: "https://regex101.com/",
        contexts: ['page']
    },
]

// Array of all items in the Context Menu
const items = [
    {
        Name: "Create Bookmarks",
        isParent: false,
        link: create_bookmarks,
        contexts: ['action']
    },
    {
        Name: "IP OSINT",
        isParent: true,
        children: IP_Lookup,
        contexts: ['link', 'selection','page']
    },
    {
        Name: "Domain OSINT",
        isParent: true,
        children: Domain_lookup,
        contexts: ['link', 'selection','page']
    },
    {
        Name: "Hash OSINT",
        isParent: true,
        children: Hash_Lookup,
        contexts: ['link', 'selection']
    },
    {
        Name: "User OSINT",
        isParent: true,
        children: User_OSINT,
        contexts: ['page','page']
    },
    {
        Name: "Cyber Chef",
        isParent: true,
        children: CyberChef,
        contexts: ['page', 'selection']
    },
    {
        Name: "Misc Items",
        isParent: true,
        children: Misc,
        contexts: ['page', 'selection']
    },
    {
        Name: "Quick Links",
        isParent: true,
        children: QuickLinks,
        contexts: ['page', 'selection']
    },
    {
        Name: "Search Engines",
        isParent: true,
        children: Search_Engines,
        contexts: ['link', 'selection']
    },
    {
        Name: "General Info/Links",
        isParent: true,
        children: General_Info,
        contexts: ['page']
    },
    // {
    //     Name: "Extension Pages",
    //     isParent: true,
    //     children: Extension_Pages,
    //     contexts: ['page']
    // },
]

// Array to use in the OmniBox.
const OmniBox_Links = {
    "ip": "https://www.abuseipdb.com/check/${query}",
    "ipi": "https://ipinfo.io/${query}",
    "vt": "https://www.virustotal.com/#/search/${query}",
    "br": "https://www.browserling.com/browse/win10/chrome116/${query}",
    "g": "https://www.google.com/search?q=${query}",
    "we": "https://www.ultimatewindowssecurity.com/securitylog/encyclopedia/event.aspx?eventid=${query}",
}

export { create_bookmarks, byte_format, items, QuickLinks, Misc, Search_Engines, IP_Lookup, Hash_Lookup, OmniBox_Links }