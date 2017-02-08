const {classes: Cc, interfaces: Ci, utils: Cu} = Components;
Cu.import("resource://gre/modules/Services.jsm");
Cu.import("resource://gre/modules/BookmarkJSONUtils.jsm");
Cu.import("resource://gre/modules/BookmarkHTMLUtils.jsm");

function startup(data, reason) {
  if (reason == APP_STARTUP) {
    try {
      let bookmarksPath = Services.prefs.getCharPref("browser.bookmarks.file");
      if (/^https?:/.test(bookmarksPath)) {
        let uri = Services.io.newURI(bookmarksPath, null, null);
        if (uri.fileExtension && uri.fileExtension == "json") {
          BookmarkJSONUtils.importFromFile(bookmarksPath, true);
        } else {
          BookmarkHTMLUtils.importFromFile(bookmarksPath, true);
        }
      } else {
        let file = Cc["@mozilla.org/file/local;1"].createInstance(Ci.nsILocalFile);
        file.initWithPath(bookmarksPath);
        let uri = Services.io.newFileURI(file);
        if (file.exists() && file.fileSize > 0) {
          if (uri.fileExtension && uri.fileExtension == "json") {
            BookmarkJSONUtils.importFromFile(file, true);
          } else {
            BookmarkHTMLUtils.importFromFile(file, true);
          }
        }
      }
    } catch (e) {}
  }
}

function shutdown(data, reason) {
  if (reason == APP_SHUTDOWN)
  {
    try {
      let bookmarksPath = Services.prefs.getCharPref("browser.bookmarks.file");

      if (!/^https?:/.test(bookmarksPath)) {
        let file = Cc["@mozilla.org/file/local;1"].createInstance(Ci.nsILocalFile);
        file.initWithPath(bookmarksPath);
        let uri = Services.io.newFileURI(file);
        if (uri.fileExtension && uri.fileExtension == "json") {
          BookmarkJSONUtils.exportToFile(file);
        } else {
          BookmarkHTMLUtils.exportToFile(file);
        }
      }
    } catch (e) {}
  }
}
 
function install(data, reason) {
}

function uninstall(data, reason) {
}
