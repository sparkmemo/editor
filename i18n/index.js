const { app } = require("electron");
const _get = require("lodash/get");
const zhCN = require("./zh-CN");
const enUS = require("./en-US");

const lang = {
  zhCN,
  enUS
}

function t(key) {
  const tempLocale = app.getLocale().replace("-", "");
  let locale = "zhCN";
  if (Object.keys(lang).includes(tempLocale)) {
    locale = tempLocale;
  }
  return _get(lang[locale], key) || "";
}

module.exports = {
  t,
};
