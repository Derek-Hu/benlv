import React from 'react';
import Controller from '~/decorator/Controller';
import queryString from 'query-string';
import { getArticleById } from '~/service/api';
import MT from 'jsonml.js/lib/html';

@Controller('/detail')
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
    const { pageInfo } = this.state;
    console.log(pageInfo);
    return (
      <>
        {pageInfo && pageInfo.metas ? <h1>{pageInfo.metas.title}</h1> : null}
        <div dangerouslySetInnerHTML={{ __html: pageInfo ? MT.toHTMLText(pageInfo.body) : '' }} />;
      </>
    );
  }
}
