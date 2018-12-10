var cf = require("../config.js");
module.exports = {
  GetNewsletterList: {
    url: cf.config.configUrl + "newsletterWebService/GetNewsletterList.html",
    post: {wid: cf.config.wid, pageNumber: "?", categoryId: "?", PageSize: "?"}
  },
  GetNewsletter: {
    url: cf.config.configUrl + "newsletterWebService/GetNewsletter.html",
    post: {wid: cf.config.wid, id: "?"}
  },
  GetNewsletterCategory: {
    url: cf.config.configUrl + "newsletterWebService/GetNewsletterCategory.html",
    post: {wid: cf.config.wid, categoryId: "?"}
  },
  submitComment: {
    url: cf.config.configUrl + "newsletterWebService/submitComment.html",
  },
};