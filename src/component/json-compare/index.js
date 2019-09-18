import React from 'react';
import Controller from '~/decorator/Controller';
import compare from './compare';
import { Collapse } from 'antd';
import './style.less';
import styles from './style.module.less';
import outDiffMessage from './code-compare';

const { Panel } = Collapse;

// 访问根路径时的内容
@Controller('/')
export default class extends React.Component {
  constructor() {
    super();
    this.state = {
      loading: false
    };
    this.options = {
      title: '变更详情',
      subTitle: (
        <div>
          Swagger地址： <a href="http://10.18.19.126:22700/swagger-ui.html">http://10.18.19.126:22700/swagger-ui.html</a>
        </div>
      )
    };
  }
  componentDidMount = () => {
    debugger;
    this.setState({
      changes: compare(this.props.original, this.props.current)
    });
  };
  componentWillReceiveProps = nextProps => {
    debugger;
    this.setState({
      changes: compare(nextProps.original, nextProps.current)
    });
  };
  renderCode = (before, after) => {
    return (
      <pre className={styles.diff}>
        <code dangerouslySetInnerHTML={{ __html: outDiffMessage(before, after) }} />
      </pre>
    );
  };
  renderFieldAttr = (change, index) => {
    const { type } = change;
    const action = this.ACTIONS[type];
    return (
      <li key={index}>
        <p className={styles.controller}>
          <span style={{ color: '#000' }}>{action}</span>
          <span>
            &nbsp;配置&nbsp;{change.key}&nbsp;{change.key !== change.attrName ? change.attrName : ''}
          </span>
        </p>
      </li>
    );
  };
  renderFields = (change, index) => {
    const { type } = change;
    const formItem = type === 'remove' ? change.original : change.current;
    const action = this.ACTIONS[type];
    const typeCls = `${styles.type} ${styles[type]}`;
    const descClas = `${styles.detail} ${styles[type]}`;
    const isUpdate = type === 'update';
    return (
      <li key={index}>
        <p className={styles.controller}>
          <span className={typeCls}>{action}</span>
          <span className={descClas}>
            &nbsp;字段&nbsp;{formItem.fieldCode}&nbsp;{formItem.label}
          </span>
        </p>
        {isUpdate ? <ul>{change.changes.map(this.renderFieldAttr)}</ul> : null}
      </li>
    );
  };
  renderAttr = (change, index) => {
    const { type } = change;
    const action = this.ACTIONS[type];
    const isFields = change.key === 'fields';
    return (
      <li key={index}>
        <p className={styles.controller}>
          <span>{action}</span>
          <span>
            &nbsp;属性&nbsp;【{change.key}】{change.key === change.attrName ? '' : change.attrName}
          </span>
        </p>
        {isFields ? <ol>{change.changes.map(this.renderFields)}</ol> : null}
      </li>
    );
  };
  ACTIONS = {
    remove: '删除',
    add: '新增',
    update: '更新'
  };
  renderAddRemove = (changes, formID) => {
    const formItem = changes.type === 'remove' ? changes.original : changes.current;
    const { type } = changes;
    const action = this.ACTIONS[type];
    const descClas = `${styles.detail} ${styles[type]}`;
    const isUpdate = type === 'update';
    const panelCls = {
      remove: 'panel-remove',
      add: 'panel-add',
      update: 'panel-update'
    }[type];
    return (
      <Panel
        key={formID}
        className={styles[panelCls]}
        header={
          <p className={styles.controller}>
            <span>{action}</span>
            <span className={descClas}>
              &nbsp;表单&nbsp;{formItem.formCode}&nbsp;{formItem.label}
            </span>
          </p>
        }
      >
        {isUpdate ? <ol style={{ listStyle: 'none' }}>{changes.changes.map(this.renderAttr)}</ol> : null}
        <div>{this.renderCode(changes.original, changes.current)}</div>
      </Panel>
    );
  };
  renderForm = apiChanges => {
    return Object.keys(apiChanges).map((formID, index) => this.renderAddRemove(apiChanges[formID], formID));
  };
  render() {
    const { title, subTitle } = this.options;
    const apiChanges = this.state.changes;
    if (!apiChanges) {
      return null;
    }
    const openKeys = Object.keys(apiChanges);
    //.filter(key => apiChanges[key].type === 'update');
    return (
      <>
        <h1>{title}</h1>
        <div className={styles.reportSummary}>{subTitle}</div>
        <Collapse defaultActiveKey={openKeys} className={styles.controller}>
          {this.renderForm(apiChanges)}
        </Collapse>
      </>
    );
  }
}
