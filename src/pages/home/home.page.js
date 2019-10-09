import React from 'react';
import Controller from '~/decorator/Controller';
import { Link } from 'react-router-dom';
import { Card, List, Tag } from 'antd';
import styles from './Articles.module.less';
import Search from '~/component/search';
import { getArticleList } from '~/service/api';

// 访问根路径时的内容
@Controller('/')
export default class extends React.Component {
  constructor() {
    super();
    this.state = {
      loading: false
    };
  }
  componentDidMount = async () => {
    this.setState({
      loading: true
    });
    try {
      const metas = await getArticleList();
      const books = metas.filter(m => m.metas.book).map(m => m.metas.path);
      const articles = metas.filter(m => {
        if (m.metas.book) {
          return true;
        }
        const isBookArticles = books.some(book => {
          return m.path.indexOf(book) === 0;
        });
        if (!isBookArticles) {
          return true;
        }
        return false;
      });
      this.setState({
        metas,
        articles
      });
      this.setState({
        loading: false
      });
    } catch (e) {
      this.setState({
        error: '加载失败'
      });
    }
  };

  render() {
    const { metas, articles, loading, error } = this.state;
    console.log('metas, articles', metas, articles);
    if (loading) {
      return <p style={{ padding: '1em' }}>加载中...</p>;
    }
    if (error) {
      return <p style={{ padding: '1em' }}>加载失败！</p>;
    }
    return (
      <>
        <Search data={metas} history={this.props.history} />
        <Card style={{ marginTop: 0 }} bordered={false} bodyStyle={{ padding: '0 1.5em' }}>
          <List
            size="large"
            rowKey="id"
            itemLayout="vertical"
            dataSource={articles}
            renderItem={item => (
              <List.Item
                key={item.id}
                actions={
                  [
                    //<IconText type="star-o" text={item.star} />,
                    //<IconText type="like-o" text={item.like} />,
                    //<IconText type="message" text={item.message} />
                  ]
                }
              >
                <List.Item.Meta
                  title={
                    item.metas.isExternal ? (
                      <a target="_blank" without="true" rel="noopener noreferrer" href={item.metas.link}>
                        {item.metas.title || '无标题'}
                      </a>
                    ) : item.metas.book ? (
                      <a
                        target="_blank"
                        without="true"
                        rel="noopener noreferrer"
                        href={`/public/resources.html?path=${encodeURIComponent(item.metas.path)}`}
                      >
                        {item.metas.title || '无标题'}
                      </a>
                    ) : (
                      <Link to={`/detail?path=${item.contentUrl}`}>{item.metas.title || '无标题'}</Link>
                    )
                  }
                  description={
                    item.metas.keyword ? (
                      <span>
                        {item.metas.keyword.split(',').map((name, index) => (
                          <Tag key={index}>{name}</Tag>
                        ))}
                      </span>
                    ) : null
                  }
                />
                {item.metas.summary ? (
                  <div className={styles.listContent}>
                    <div className={styles.description}>{item.metas.summary}</div>
                  </div>
                ) : null}
              </List.Item>
            )}
          />
        </Card>
      </>
    );
  }
}
