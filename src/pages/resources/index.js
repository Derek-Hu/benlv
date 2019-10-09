import React from 'react';
import Controller from '~/decorator/Controller';
import { Icon } from 'antd';
import queryString from 'query-string';
import styles from './style.module.less';
import { Config } from '~/constant/config';
import { Link } from 'react-router-dom';
import { getArticleList } from '~/service/api';

// 访问根路径时的内容
@Controller('/')
export default class extends React.Component {
  constructor() {
    super();
    this.state = {
      loading: true,
      menus: []
    };
    const params = queryString.parse(window.location.search);
    this.path = params.path ? decodeURIComponent(params.path) : null;

    console.log(params, this.path);
    if (!this.path) {
      window.location.href = Config.apiBase;
    }
  }

  componentDidMount = async () => {
    this.setState({
      loading: true
    });
    try {
      const metas = await getArticleList();

      this.setState({
        loading: false
      });

      if (!metas || !metas.length) {
        this.setState({
          error: '暂无数据'
        });
        return;
      }
      const pages = metas
        .filter(element => {
          return element.path.indexOf(this.path) === 0;
        })
        .sort((a, b) => {
          return (a.metas.order || 1) - (b.metas.order || 1);
        });
      if (!pages || !pages.length) {
        window.location.href = '';
        return;
      }

      const menus = [];
      const indexes = {};
      pages.forEach(page => {
        if (!page.metas.parentMenu || !page.metas.parentMenu.trim()) {
          menus.push(page);
        } else {
          if (!indexes[page.metas.parentMenu]) {
            menus.push({
              menuName: page.metas.parentMenu,
              children: [page]
            });
            indexes[page.metas.parentMenu] = menus.length - 1;
          } else {
            menus[indexes[page.metas.parentMenu]].children.push(page);
          }
        }
      });

      this.setState({
        menus
      });
    } catch (e) {
      this.setState({
        error: '加载失败'
      });
    }
  };

  renderMenu = menu => {
    if (menu.children) {
      return (
        <li>
          <span>{menu.menuName}</span>
          <ul>
            {menu.children.map(subMenu => (
              <li>
                <Link
                  to={{
                    pathname: '/',
                    search: '?sort=name',
                    hash: '#the-hash',
                    state: { fromDashboard: true }
                  }}
                >
                  {subMenu.metas.title}
                </Link>
              </li>
            ))}
          </ul>
        </li>
      );
    } else {
      return (
        <li>
          <Link href="">{menu.metas.title}</Link>
        </li>
      );
    }
  };
  render() {
    const { loading, menus, error } = this.state;
    if (loading) {
      return <p style={{ padding: '1em' }}>加载中...</p>;
    }
    if (error) {
      return <p style={{ padding: '1em', textAlign: 'center', color: 'red' }}>{this.state.error}</p>;
    }
    return (
      <div className={styles.book}>
        <div className={styles.menus}>
          <h1>xxx</h1>
          <nav>
            <ul className={styles.summary}>{menus.map(this.renderMenu)}</ul>
          </nav>
        </div>
        <div className={styles.body}>
          <div className={styles.bookHeader}>
            <a href="" className={styles.btn}>
              <Icon type="menu" />
            </a>
            <a href="" className={styles.btn}>
              <Icon className={styles.icons} type="home" />
            </a>
          </div>
          <div className={styles.article}>
            <div className={styles.pageInner}>aaa</div>
          </div>
        </div>
      </div>
    );
  }
}
