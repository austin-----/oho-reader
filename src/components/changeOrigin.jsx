import React from 'react';
import {Layout, Icon, Spin, Tag} from 'antd';
import { Link } from 'react-router-dom';
import styles from '../styles/changeOrigin.less';
import template from './template';
import {time2Str} from '../method/index';
import * as bookApi from '../method/bookApi';

const { Header, Content } = Layout;

class ChangeOrigin extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      data: []
    }

    this.bookId = this.props.match.params.id; //书籍在列表的序号
    this.sourceId = (this.props.readingState[this.bookId] || {}).sourceId;

    this.changeOrigin = (id) => {
      this.props.changeSource(this.bookId, id);
      this.props.history.goBack();
    }
  }

  componentWillMount() {
    bookApi.getBookSources(this.bookId)
        .then( data => {
          console.log(data)
          this.setState({loading: false, data});
        })
        .catch( error => console.log(error));
  }

  render() {
    return (
      <Spin className='loading' spinning={this.state.loading} tip="书源加载中">
        <Layout >
          <Header className={styles.header}>
            <Link to='' onClick={(e) => { e.preventDefault(); this.props.history.goBack();}}><Icon type="arrow-left" className={styles.pre}/></Link>
            <span className={styles.title}>换源</span>
          </Header>
          <Content className={styles.content}>
            <ul>
              {
                this.state.data.map((item, index) => {
                    return  (
                      <li key={index} onClick={() => this.changeOrigin(item._id)}>
                        <h1>{item.name}{this.sourceId === item._id ? (<Tag  className={styles.originTag} color="#f50">当前书源</Tag>) : ''}</h1>
                        <p>{time2Str(item.updated)}前:{item.lastChapter}</p>
                      </li>
                      )
                  }
                )
              }
              
            </ul>
          </Content>
        </Layout>
      </Spin>
    )
  }
}

export default template(ChangeOrigin);