import React from 'react';
import { ToolbarAndroid, FlatList, StyleSheet, Image, Text, View } from 'react-native';
import CollectiveTimesApiClient from './api_client';
import ArticleItem from './article_item';

export default class App extends React.Component {

  constructor(props) {
    super(props);
    this.renderArticleItem = this.renderArticleItem.bind(this);
    this.onEndReached = this.onEndReached.bind(this);
    this.onReload = this.onReload.bind(this);
    this.state = {
      refreshing: false,
      page: 1,
      articles: []
    };
  }

  componentDidMount(){
    const client = new CollectiveTimesApiClient();
    client.getArticles(this.state.page, (articles) => {
      this.setState({
        page: this.state.page + 1,
        articles: articles
      });
    });
  }

  renderArticleItem(article){
    return(
        <ArticleItem
          id={article.item.key}
          title={article.item.title}
          description={article.item.description.slice(0, 60)}
          articleUrl={article.item.articleUrl}
          faviconUrl={article.item.faviconUrl}
          imageUrl={article.item.imageUrl}
          sourceUrl={article.item.sourceUrl}
          date={article.item.date}
        />
    );
  }

  onEndReached(){
    const client = new CollectiveTimesApiClient();
    client.getArticles(this.state.page, (articles) => {
      this.setState(
        {
          page: this.state.page + 1,
          articles: this.state.articles.concat(articles)
        }
      );
    });
  }

  onReload(){
    this.setState({
      refreshing: true,
      page: 1,
      articles: []
    });

    const client = new CollectiveTimesApiClient();
    client.getArticles(1, (articles) => {
      this.setState(
        {
          refreshing: false,
          page: this.state.page + 1,
          articles: this.state.articles.concat(articles)
        }
      );
    });
  }

  render() {
    let articleListView = null;
    if(this.state.articles.length !== 0){
      articleListView =
        <FlatList
          data={this.state.articles}
          renderItem={this.renderArticleItem}
          keyExtractor={(item, index) => item.key.toString()}
          onEndReachedThreshold={1}
          onEndReached={this.onEndReached}
          refreshing={this.state.refreshing}
          onRefresh={this.onReload}
        />;
    }

    return (
      <View style={styles.container}>
        <ToolbarAndroid
          style={styles.toolBar}
          logo={require('./img/logo.jpg')}>
          <Text style={styles.appTitle}>CollectiveTimes</Text>
        </ToolbarAndroid>
        { articleListView }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  appTitle: {
    paddingLeft: 12,
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'Roboto',
  },
  toolBar: {
    height: 56,
    elevation: 4,
    backgroundColor: '#c8f277de',
  },
  container: {
    flex: 1,
  },
});
