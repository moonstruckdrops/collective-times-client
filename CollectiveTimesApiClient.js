import axios from 'axios';

export default class CollectiveTimesApiClient {

  static get API_ENDPOINT() { return "https://collective-times-api.herokuapp.com/v1/"; };

  async getArticles(page, callback) {
    const res = await axios.get(`${CollectiveTimesApiClient.API_ENDPOINT}articles?page=${page}`);
    if (res.status !== 200) {
      callback([]);
    } else {
      callback(res.data.articles);
    }
  };

  async saveVisitedArticleBy(articleId) {
    const res = await axios.post(`${CollectiveTimesApiClient.API_ENDPOINT}histories`, {
      article_id: articleId
    });
    if (res.status !== 200) {
      console.log('fail');
    } else {
      console.log('success');
    }
  };
}
