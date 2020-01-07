import React from 'react';
import { Icon, Button, Input, AutoComplete } from 'antd';
import './style.less';
import { func } from 'prop-types';

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
function match(value, key) {
  return value.toLowerCase().indexOf(key.toLowerCase()) !== -1;
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
      if (element.metas.title && match(element.metas.title, query)) {
        titleMatchs.push(element);
      }
      if (element.metas.summary && match(element.metas.summary, query)) {
        summaryMatch.push(element);
      }
      if (element.metas.keyword && match(element.metas.keyword, query)) {
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
        {/* <AutoComplete
          className="certain-category-search"
          dropdownClassName="certain-category-search-dropdown"
          dropdownMatchSelectWidth={false}
          dropdownStyle={{ width: 300 }}
          size="large"
          style={{ width: "100%" }}
          dataSource={options}
          placeholder="input here"
          optionLabelProp="value"
        >
          <Input suffix={<Icon type="search" className="certain-category-icon" />} />
        </AutoComplete> */}
        <AutoComplete
          className="global-search"
          size="large"
          style={{
            width: '100%',
            paddingLeft: '5px'
          }}
          dropdownMatchSelectWidth={false}
          dropdownStyle={{ width: 300 }}
          dataSource={dataSource.map(renderOption)}
          onSelect={value => onSelect(value, props)}
          onSearch={this.handleSearch}
          placeholder="input here"
          optionLabelProp="text"
        >
          <Input suffix={<Icon type="search" className="certain-category-icon" />} />
        </AutoComplete>
      </div>
    );
  }
}
