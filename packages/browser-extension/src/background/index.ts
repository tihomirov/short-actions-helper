import browser from 'webextension-polyfill';

console.log('background script');

browser.tabs.onActivated.addListener(function (activeInfo) {
  console.log('!!! onActivated', activeInfo);
});

browser.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  console.log('!!! onUpdated', tabId, changeInfo, tab);
});
