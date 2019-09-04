import React from 'react';
import { Icon, Button, Input, AutoComplete } from 'antd';
import './style.less';

const { Option } = AutoComplete;

function onSelect(value, history) {
  const item = JSON.parse(value);
  if (item.metas.isExternal) {
    window.location.href = item.metas.link;
  } else {
    history.push(`/detail?path=${item.contentUrl}`);
    // window.location.href = "";
  }
}

const MaxMatch = 6;
function searchResult(query, allData) {
  const titleMatchs = [];
  const summaryMatch = [];
  const keywordMatch = [];
  if (allData) {
    allData.forEach(element => {
      if (titleMatchs.length >= MaxMatch) {
        return;
      }
      if (element.metas.title && element.metas.title.indexOf(query) !== -1) {
        titleMatchs.push(element);
      }
      if (element.metas.summary && element.metas.summary.indexOf(query) !== -1) {
        summaryMatch.push(element);
      }
      if (element.metas.keyword && element.metas.keyword.indexOf(query) !== -1) {
        keywordMatch.push(element);
      }
    });
  }

  summaryMatch.forEach(element => {
    if (titleMatchs.length > MaxMatch) {
      return;
    }
    if (titleMatchs.indexOf(element) !== -1) {
      return;
    }
    titleMatchs.push(element);
  });

  keywordMatch.forEach(element => {
    if (titleMatchs.length > MaxMatch) {
      return;
    }
    if (titleMatchs.indexOf(element) !== -1) {
      return;
    }
    titleMatchs.push(element);
  });
  return titleMatchs;
}

function renderOption(item) {
  return (
    <Option key={JSON.stringify(item)}>
      <div className="global-search-item">{item.metas.title}</div>
    </Option>
  );
}

export default class Complete extends React.Component {
  state = {
    dataSource: []
  };

  handleSearch = value => {
    this.setState({
      dataSource: value ? searchResult(value, this.props.data) : []
    });
  };

  render() {
    const { dataSource } = this.state;
    const props = this.props.history;
    return (
      <div
        className="global-search-wrapper"
        style={{
          width: '100%',
          maxWidth: '600px',
          margin: '0.5em auto'
        }}
      >
        <AutoComplete
          className="global-search"
          size="large"
          style={{
            width: '100%',
            paddingLeft: '5px'
          }}
          dataSource={dataSource.map(renderOption)}
          onSelect={value => onSelect(value, props)}
          onSearch={this.handleSearch}
          placeholder="input here"
          optionLabelProp="text"
        >
          <Input
            suffix={
              <Button className="search-btn" style={{ marginRight: -12 }} size="large" type="primary">
                <Icon type="search" />
              </Button>
            }
          />
        </AutoComplete>
      </div>
    );
  }
}
