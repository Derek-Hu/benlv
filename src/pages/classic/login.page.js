import React from 'react';
import Controller from '~/decorator/Controller';
import queryString from 'query-string';
import { Icon } from 'antd';
import { getArticleById } from '~/service/api';
import MT from 'jsonml.js/lib/html';
import styles from './Articles.module.less';
import { Config } from '~/constant/config';

@Controller('/login')
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
      const { path } = queryString.parse(this.props.location.search);
      const pageInfo = await getArticleById(path);
      this.setState({
        pageInfo
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
    console.log(styles);
    const { pageInfo } = this.state;
    return (
      <>
        <div className={styles.bookHeader}>
          <a href={`${Config.apiBase}`} className={styles.btn}>
            <Icon className={styles.icons} type="home" />
          </a>
        </div>
        {pageInfo && pageInfo.metas ? <h1 style={{ textAlign: 'center' }}>{pageInfo.metas.title}</h1> : null}
        <div
          style={{
            margin: '0 auto',
            width: '1000px',
            fontSize: '15px',
            padding: '1em',
            width: '100%'
          }}
          dangerouslySetInnerHTML={{ __html: pageInfo ? MT.toHTMLText(pageInfo.body) : '' }}
        />
        ;
      </>
    );
  }
}
