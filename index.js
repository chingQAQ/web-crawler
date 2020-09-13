
const express = require('express');
const app = express();
const axios = require('axios');
const cheerio = require('cheerio');
const ironmans = [
  'https://ithelp.ithome.com.tw/users/20107159/ironman/1325',
  'https://ithelp.ithome.com.tw/users/20107356/ironman/1315',
  'https://ithelp.ithome.com.tw/users/20107440/ironman/1355',
  'https://ithelp.ithome.com.tw/users/20107334/ironman/1335',
  'https://ithelp.ithome.com.tw/users/20107329/ironman/1286',
  'https://ithelp.ithome.com.tw/users/20091297/ironman/1330',
  'https://ithelp.ithome.com.tw/users/20075633/ironman/1375',
  'https://ithelp.ithome.com.tw/users/20107247/ironman/1312',
  'https://ithelp.ithome.com.tw/users/20107335/ironman/1337',
  'https://ithelp.ithome.com.tw/users/20106699/ironman/1283',
  'https://ithelp.ithome.com.tw/users/20107420/ironman/1381',
];

const getInfo = async (url) => {
  try {
    const result = await axios.get(url);
    const $ = cheerio.load(result.data);
    const author = $('.profile-header__name').text().trim();
    const view = $('.profile-header__view-num').text().trim();
    const follow = $('.profile-header__follow-link').text().trim().match(/[0-9]+/g)[0];
    const articleTotal = $('.qa-list__info.qa-list__info--ironman.subscription-group span').eq(1).text().trim().match(/[0-9]+/g)[0];
    const articleSubScriptAmount = $('.qa-list__info.qa-list__info--ironman.subscription-group span').eq(2).text().trim().match(/[0-9]+/g)[0];
    const articleList = $('.qa-list.profile-list.ir-profile-list').map((index, obj) => {
      return {
        title: $(obj).find('.qa-list__title .qa-list__title-link').text().trim(),
        link: $(obj).find('.qa-list__title .qa-list__title-link').attr('href').trim(),
        time: $(obj).find('.qa-list__info .qa-list__info-time').text().trim(),
      }
    }).get();
    return {
      author,
      view,
      follow,
      articleTotal,
      articleSubScriptAmount,
      articleList
    }

  } catch (err) {
    throw new Error(err)
  }
};

app.get('/', (req, res) => {
  let result = []
  result.push()
  ironmans.forEach(obj => {
    result.push(getInfo(obj))
  })
  Promise.all(result).then(e=>res.send(e));
})

app.listen(5000, (err) => {
  if (err) throw err;
  console.log('listen...');
})
