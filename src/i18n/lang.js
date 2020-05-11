const en = require('./en.js');
const zh = require('./zh.js');
const zhTW = require('./zh-TW.js');

const langPack = {
  en,
  zh,
  'zh-TW': zhTW,
};

function selectLanguage(locale = 'en') {
  let finalLocale = locale;
  if (!(finalLocale in langPack)) {
    finalLocale = locale.split('-')[0];
    if (!(finalLocale in langPack)) {
      finalLocale = 'en';
    }
  }
  // console.log(`lang.js > final locale: ${finalLocale}`);
  return langPack[finalLocale];
}

module.exports = {
  selectLanguage,
  availableLang: Object.keys(langPack),
};
