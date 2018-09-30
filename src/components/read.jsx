import React from 'react';
import { Link } from 'react-router-dom'
import { Layout, Spin, message, Icon, Modal } from 'antd';
import styles from '../styles/read.less';
import template from './template';
import 'whatwg-fetch';
import * as bookApi from '../method/bookApi';

const { Header, Footer } = Layout;
var _ = require('underscore');

class Read extends React.Component {
  constructor(props) {
    super(props);
    this.needSetScrollTop = true; //标记第一次进入， 判断是否读取上一次阅读的scrollTop
    this.needInitialGetChapter = true;

    this.bookId = this.props.match.params.id; //书籍编号

    this.handleProps(this.props);

    if (this.bookNeedsRefresh) {
      this.props.refreshBook(this.bookId);
    }

    this.readSetting = this.props.readSetting;
    if (!_.has(this.readSetting, 'fontSize')) {
      this.readSetting.fontSize = 18;
    }

    this.state = {
      loading: true,
      chapter: '',
      show: false,
      readSetting: this.readSetting,
      chapterListShow: false,
      readSettingShow: false
    }

    this.getChapter = (index) => {
      if (index < 0) {
        message.info('已经是第一章了！');
        this.index = 0;
        return;
      }
      else if (index >= this.chapterList.length) {
        message.info('已经是最新的一章了！');
        this.index = this.chapterList.length - 1;
        index = this.index;
      }

      this.setState({ loading: true });

      if (_.has(this.props.chapterContent, this.bookId) && _.has(this.props.chapterContent[this.bookId], index))
      {
          return Promise.resolve()
          .then( () => {
            this.props.setBookProgress(this.bookId, index);
            this.setState({ loading: false, chapter: this.props.chapterContent[this.bookId][index] });
          });
      }

      if (this.chapterList[index] == null) {
        message.info('章节内容丢失！');
        return;
      }

      bookApi.getBookChapterContent(this.chapterList[index].link)
        .then(data => {
          if (!data.ok) {
            message.info('章节内容丢失！');
            return this.setState({ loading: false });
          }
          let content = _.has(data.chapter, 'cpContent') ? data.chapter.cpContent : data.chapter.body;
          data.chapter.cpContent = '   ' + content.replace(/\n/g, '\n   ');

          if (this.chapterList[index].title.length > data.chapter.title.length) {
            data.chapter.title = this.chapterList[index].title;
          }

          this.props.setBookProgress(this.bookId, index);
          this.setState({ loading: false, chapter: data.chapter })
        })
        .catch(error => message.info(error))
    }

    this.nextChapter = (e) => {
      e.stopPropagation();
      this.getChapter(++this.index);
    }
    this.preChapter = (e) => {
      e.stopPropagation();
      this.getChapter(--this.index);
    }

    this.targetChapter = (e) => {
      e.stopPropagation();
      this.index = e.target.id
      this.getChapter(this.index);
      this.setState({ chapterListShow: false });
    }

    this.shwoSetting = () => {
      this.setState({ show: !this.state.show });
    }

    this.fontUp = () => {
      this.readSetting.fontSize++;
      this.setState({ readSetting: this.readSetting });
      this.props.setReadSetting(this.readSetting);
    }

    this.fontDown = () => {
      if (this.readSetting.fontSize <= 12) {
        return;
      }
      this.readSetting.fontSize--;
      this.setState({ readSetting: this.readSetting });
      this.props.setReadSetting(this.readSetting);
    }

    this.changeBackgroudnColor = (e) => {
      this.readSetting.backgroundColor = e.target.style.backgroundColor;
      this.setState({ readSetting: this.readSetting });
      this.props.setReadSetting(this.readSetting);
    }

    this.readScroll = () => {
      this.props.notifyBookReadScroll(this.bookId, this.refs.box.scrollTop);
    }

    this.showChapterList = (chapterListShow) => {
      this.setState({ chapterListShow });
    }

    this.downladBook = () => {
      let self = this;

      Modal.confirm({
        title: '缓存',
        content: (
          <div>
            <p>是否缓存后100章节？</p>
          </div>
        ),
        onOk() {
          let chapterContent = self.props.chapterContent[self.bookId] || {};

          let download = (start, end) => {
            if (start > end || start >= self.chapterList.length) {
              message.info('缓存完成');
              return;
            }

            if (_.has(chapterContent, start)) {
              download(++start, end);
              return;
            }

            bookApi.getBookChapterContent(self.chapterList[start].link)
              .then(data => {
                let content = _.has(data.chapter, 'cpContent') ? data.chapter.cpContent : data.chapter.body;
                data.chapter.cpContent = '   ' + content.replace(/\n/g, '\n   ');

                if (self.chapterList[start].title.length > data.chapter.title.length) {
                  data.chapter.title = self.chapterList[start].title;
                }

                self.props.cacheChapterContent(self.bookId, { [start]: data.chapter });
                download(++start, end);
              })
              .catch(error => message.info(error))
          }

          const cacheStart = self.index - 10 > 1 ? self.index - 10 : 1;
          self.props.removeChapterContent(self.bookId, Array.from({ length: cacheStart - 1 }, (_, k) => k));

          download(self.index, self.index + 100);
        },
        onCancel() { }
      });
    }

    this.readSettingShowControl = (e) => {
      e.stopPropagation();
      let value = !this.state.readSettingShow;
      this.setState({ readSettingShow: value });
    }
  }

  handleProps(props) {
    this.bookNeedsRefresh = false;

    if (props.readingState[this.bookId] == null ||
      props.bookData[this.bookId] == null ||
      props.bookData[this.bookId].chapterInfo == null) {
      this.bookNeedsRefresh = true;
    }

    const readingState = props.readingState[this.bookId] || {};
    this.index = readingState.readIndex || 0; //章节号

    const bookData = props.bookData[this.bookId] || {};
    this.chapterList = bookData.chapterInfo == null ? [] : bookData.chapterInfo.chapters;
  }

  componentWillMount() {
    if (!this.bookNeedsRefresh) {
      this.needInitialGetChapter = false;
      this.getChapter(this.index);
    }

    // 刷新最近阅读的书籍列表顺序
    var set = new Set(this.props.bookList);
    set.delete(this.bookId);
    this.props.setBookList([
      this.bookId, 
      ...Array.from(set)
    ]);
  }

  componentWillReceiveProps(nextProps) {

    this.setState({ readSetting: nextProps.readSetting });

    this.handleProps(nextProps);

    if (!this.bookNeedsRefresh && this.needInitialGetChapter) {
      this.needInitialGetChapter = false;
      this.getChapter(this.index);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (!this.bookNeedsRefresh && this.needSetScrollTop && prevState.chapter != this.state.chapter) { //加载上次阅读进度
      let readingState = this.props.readingState[this.bookId];
      this.refs.box.scrollTop = _.has(readingState, 'readScroll') ? readingState.readScroll : 0;
      this.needSetScrollTop = false;
    }
    else if (prevState.loading !== this.state.loading) {
      this.refs.box.scrollTop = 0;
    }
    let list = document.querySelector('.chapterList .ant-modal-body');
    if (list !== null) {
      list.scrollTop = 45 * (this.index - 3);
    }
  }

  render() {
    return (
      <Spin className='loading' spinning={this.state.loading} tip='章节内容加载中'>
        <Layout >
          <Modal
            className='chapterList'
            title='Vertically centered modal dialog'
            visible={this.state.chapterListShow}
            onOk={() => this.showChapterList(false)}
            onCancel={() => this.showChapterList(false)}
          >
            {
              this.chapterList.map((item, index) => (<p id={index} className={parseInt(this.index, 10) == index ? 'choosed' : ''} onClick={this.targetChapter} key={index}>{item.title}</p>))
            }
          </Modal>
          {
            this.state.show ? (() => {
              return (
                <Header className={styles.header}>
                  <Link to='' onClick={(e) => { e.preventDefault(); this.props.history.goBack();}}><Icon type='arrow-left' className={styles.pre} /></Link>
                  <Link to={`/changeOrigin/${this.pos}`}><span className={styles.origin}>换源</span></Link>
                </Header>
              )
            })() : ''
          }
          <div ref='box' className={styles.box} style={this.state.readSetting} onClick={this.shwoSetting} onScroll={this.readScroll}>
            {this.state.loading ? '' : (() => {
              return (
                <div>
                  <h1>{this.state.chapter.title}</h1>
                  <pre >{this.state.chapter.cpContent}</pre>
                  <h1 className={styles.control}>
                    <span onClick={this.preChapter}>上一章</span>
                    <span onClick={this.nextChapter}>下一章</span>
                  </h1>
                </div>
              )
            })()}
          </div>
          {
            this.state.show ? (() => {
              return (
                <Footer className={styles.footer}>
                  <div
                    className={styles.setting}
                    tabIndex='100'
                    onClick={this.readSettingShowControl}
                    onBlur={this.readSettingShowControl}>
                    <Icon type='setting' /><br />设置
                    {
                      this.state.readSettingShow ?
                        (
                          <div onClick={(e) => e.stopPropagation()}>
                            <div className={styles.font}>
                              <span onClick={this.fontDown}>Aa -</span>
                              <span onClick={this.fontUp}>Aa +</span>
                            </div>
                            <div className={styles.color}>
                              <i onClick={this.changeBackgroudnColor} style={{ backgroundColor: 'rgb(196, 196 ,196)' }}></i>
                              <i onClick={this.changeBackgroudnColor} style={{ backgroundColor: 'rgb(162, 157, 137)' }}></i>
                              <i onClick={this.changeBackgroudnColor} style={{ backgroundColor: 'rgb(173, 200, 169)' }}></i>
                            </div>
                          </div>
                        ) : ''
                    }
                  </div>
                  <div onClick={() => this.props.history.push({pathname: '/bookIntroduce/' + this.bookId }) }><Icon type='message' /><br />简介</div>
                  <div onClick={this.downladBook} ><Icon type='download' /><br />下载</div>
                  <div onClick={() => this.showChapterList(true)}><Icon type='bars' /><br />目录</div>
                </Footer>
              )
            })() : ''
          }

        </Layout>
      </Spin>
    )
  }
}

export default template(Read);