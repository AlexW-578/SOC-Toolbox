import { create_bookmarks, byte_format, items, QuickLinks, Misc, Search_Engines, IP_Lookup, Hash_Lookup, OmniBox_Links } from "./contextMenu.js";

var storage = {}

if (typeof browser == "undefined") {
  // Chrome does not support the browser namespace yet.
  globalThis.browser = chrome;
}

Start();

async function set_options() {
  var options = await browser.storage.local.get({
    download_manager: false,
    email_directory: '',
    PDF_directory: '',
    csv_dir: '',
    zip_dir: '',
    json_dir: '',
  })
  storage["email_directory"] = options.email_directory;
  storage["PDF_directory"] = options.PDF_directory;
  storage["csv_dir"] = options.csv_dir;
  storage["zip_dir"] = options.zip_dir;
  storage["json_dir"] = options.json_dir;
  storage["download_manager"] = options.download_manager
}

function create_children(parent_name, children) {
  for (let child_number = 0; child_number < children.length; child_number++) {
    browser.contextMenus.create({
      title: children[child_number].Name,
      parentId: parent_name,
      id: children[child_number].Name,
      contexts: children[child_number].contexts
    })
    if (children[child_number].isParent) {
      create_children(children[child_number].Name, children[child_number].children)
    }
  }
}


function Start() {
  set_options();
  browser.contextMenus.removeAll();
  for (let item_number = 0; item_number < items.length; item_number++) {
    browser.contextMenus.create({
      title: items[item_number].Name,
      id: items[item_number].Name,
      contexts: items[item_number].contexts
    })
    if (items[item_number].isParent) {
      create_children(items[item_number].Name, items[item_number].children.sort())
    }  }
}



function open_array(query, items_to_open) {
  var items_to_open_v2 = []
  for (let item_number = 0; item_number < items_to_open.length; item_number++) {
    items_to_open_v2.push(items_to_open[item_number].replace("${query}", encodeURIComponent(query)))
  }
  browser.windows.create({
    focused: true,
    url: items_to_open_v2
  }
  )
}



function open_child(tab, id, query, items_to_check) {
  for (let item_number = 0; item_number < items_to_check.length; item_number++) {
    if (id == items_to_check[item_number].Name && !id.includes("|")) {
      if (typeof items_to_check[item_number].link === "function") {
        items_to_check[item_number].link(query)
      }
      else if (items_to_check[item_number].isB64) {
        browser.tabs.create({ url: items_to_check[item_number].link.replace("${query}", btoa(query)), index: tab.index + 1 });
      }
      else if (typeof items_to_check[item_number].link === "object") {
        open_array(query, items_to_check[item_number].link)
      }
      else {
        browser.tabs.create({ url: items_to_check[item_number].link.replace("${query}", encodeURIComponent(query)), index: tab.index + 1 });
      }
    }
    else {
      if (items_to_check[item_number].isParent) {
        open_child(tab, id, query, items_to_check[item_number].children)
      }
    }
  }
}

browser.contextMenus.onClicked.addListener((item, tab) => {
  var id = item.menuItemId
  var query = item.selectionText ?? item.linkUrl ?? ""
  query = query.trim()
  open_child(tab, id, query, items)
}
);


browser.omnibox.onInputEntered.addListener((text) => {
  const query_all = text.split(" ")
  const query_prefix = query_all[0].toLowerCase()
  const query = encodeURIComponent(text.replace("# ", "").replace(`${query_prefix} `, ""))
  if (query_prefix in OmniBox_Links) {
    browser.tabs.create({ url: OmniBox_Links[query_prefix].replace("${query}", query) });
  }
  else {
    browser.tabs.create({ url: OmniBox_Links["at"].replace("${query}", query_all) });
  }
});

browser.storage.onChanged.addListener(
  (changes, areaName) => { set_options(); }
)
if ('object' == typeof browser.downloads.onDeterminingFilename) {
  browser.downloads.onDeterminingFilename.addListener(
    (item, suggestion) => {
      function suggest(filename, conflictAction) {
        suggestion({
          filename: filename,
          conflictAction: conflictAction,
          conflict_action: conflictAction
        });
      }

      if (storage == [] || storage.download_manager == undefined) {
        set_options();
      }
      if (!storage.download_manager) { return; }
      if (storage.email_directory != undefined && (item.mime == "message/rfc822" || item.mime == "text/plain")) {
        const file_name = `${storage.email_directory}\\${item.filename}`
        suggest(file_name, "uniquify");
      }
      if (storage.PDF_directory != undefined && item.mime == "application/pdf") {
        var file_name = `${storage.PDF_directory}\\${item.filename}`
        suggest(file_name, "prompt");
      }
      if (storage.csv_dir != undefined && (item.mime == "text/csv" || item.filename.endsWith(".csv"))) {
        const file_name = `${storage.csv_dir}\\${item.filename}`
        suggest(file_name, "uniquify");
      }
      if (storage.zip_dir != undefined && ((item.mime == "application/octet-stream" && item.filename.endsWith(".zip")) || item.mime == "application/x-7z-compressed")) {
        const file_name = `${storage.zip_dir}\\${item.filename}`
        suggest(file_name, "uniquify");
      }
      if (storage.json_dir != undefined && item.mime == "text/html" && item.filename.endsWith(".json")) {
        const file_name = `${storage.json_dir}\\${item.filename}`
        suggest(file_name, "uniquify");
      }
    }
  )
} else {
  console.log("DOWNLOAD MANAGER NOT SUPPORTED")
  // let downloaded = []
  // browser.downloads.onCreated.addListener(handleCreated);
  // async function handleCreated(item) {
  //   console.log(`Downloading - ${item.url} - ${! downloaded.includes[item.url]}`)
  //   if (! downloaded.includes[item.url]) {
  //     let cancelling = await browser.downloads.cancel(item.id)
  //     console.log(cancelling)
  //     downloaded.push(item.url)
  //     let filename = item.filename.split("\\")[-1]
  //     let downloading = await browser.downloads.download(
  //       { "filename": `${filename}.e`, "url": item.url }
  //     )
  //     console.log(downloading)
  //     await browser.downloads.erase(item.id)
  //     await browser.downloads.removeFile(item.id)
  //     console.log(downloaded)
  //   }
  // }
}


