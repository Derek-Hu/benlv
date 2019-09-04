import React from 'react';
import Controller from '~/decorator/Controller';
import { Link } from 'react-router-dom';
import { Card, List, Tag } from 'antd';
import styles from './Articles.less';
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
      this.setState({
        metas
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
    const { metas } = this.state;
    return (
      <>
        <Search data={metas} history={this.props.history} />
        <Card style={{ marginTop: 0 }} bordered={false} bodyStyle={{ padding: '0 1.5em' }}>
          <List
            size="large"
            rowKey="id"
            itemLayout="vertical"
            dataSource={metas}
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
                {item.summary ? (
                  <div className={styles.listContent}>
                    <div className={styles.description}>{item.summary}</div>
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
