import React from 'react';
import { Form, Button, Input, Col, Row } from 'antd';
import { Link } from 'react-router-dom';
import { Toast } from 'antd-mobile';
import outDiffMessage from '~/component/json-compare/code-compare';
import FormDiff from '~/component/json-compare/index';

const { TextArea } = Input;

const isArray = value => {
  return Object.prototype.toString.call(value) === '[object Array]';
};
const isObject = value => {
  return Object.prototype.toString.call(value) === '[object Object]';
};

const getValidForms = value => {
  if (isArray(value)) {
    return value;
  }
  if (isObject(value)) {
    if ('code' in value && 'data' in value) {
      return value.data.forms;
    }
    if ('result' in value && 'content' in value) {
      return value.content.forms;
    }
    return value.forms;
  }
  return null;
};

const convert2Json = value => {
  let json;
  try {
    json = JSON.parse(value);
  } catch (e) {}
  try {
    json = new Function(`return ${value}`)();
  } catch (e) {}
  if (!json) {
    Toast.fail('其提供合法的JSON对象');
  }
  return json;
};
@Form.create()
export default class App extends React.Component {
  state = {};

  handleSubmit = e => {
    e && e.preventDefault();
    const { getFieldValue, setFieldsValue } = this.props.form;
    this.props.form.validateFields(err => {
      if (!err) {
        let original = convert2Json(getFieldValue('original'));
        if (!original) {
          return;
        }
        let current = convert2Json(getFieldValue('current'));
        if (original && current) {
          if (this.props.normal) {
            this.setState({
              original,
              current
            });
            setFieldsValue({
              original: JSON.stringify(original, null, 2),
              current: JSON.stringify(current, null, 2)
            });
          } else {
            const validOriginal = getValidForms(original);
            const validCurrent = getValidForms(current);
            if (validOriginal && validCurrent) {
              this.setState({
                original: validOriginal,
                current: validCurrent
              });
            } else {
              Toast.fail('请提供正确的Form配置');
            }
          }
          setFieldsValue({
            original: JSON.stringify(original, null, 2),
            current: JSON.stringify(current, null, 2)
          });
        }
      }
    });
  };
  render() {
    const { original, current } = this.state;
    const { getFieldDecorator } = this.props.form;
    const htmls =
      original && current ? this.props.normal ? outDiffMessage(original, current) : <FormDiff original={original} current={current} /> : null;
    return (
      <div style={{ padding: '20px' }}>
        <h1>{this.props.normal ? '普通JSON比对工具' : 'Form比对工具'}</h1>
        <h2 style={{ textAlign: 'right' }}>
          {this.props.normal ? <Link to={`/`}>Form表单比对工具&gt;&gt;</Link> : <Link to={`/normal`}>普通JSON比对工具&gt;&gt;</Link>}
        </h2>
        <Form onSubmit={this.handleSubmit}>
          <Row gutter={20} justify={'space-between'}>
            <Col span={12}>
              <Form.Item>
                {getFieldDecorator('original', {
                  rules: [{ required: true, message: '请提供旧版本数据!' }]
                })(<TextArea rows={20} placeholder="旧版本数据" />)}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item>
                {getFieldDecorator('current', {
                  rules: [{ required: true, message: '请提供新版本数据!' }]
                })(<TextArea rows={20} placeholder="新版本数据" />)}
              </Form.Item>
            </Col>
          </Row>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              开始比对
            </Button>
          </Form.Item>
        </Form>
        {this.props.normal ? (
          htmls ? (
            <div>
              <pre className="diff">
                <code dangerouslySetInnerHTML={{ __html: htmls }} />
              </pre>
            </div>
          ) : null
        ) : (
          htmls
        )}
      </div>
    );
  }
}
