import React from 'react';
import styles from '../styles/bookItem.less';
import Tappable from 'react-tappable/lib/Tappable';
import { Modal } from 'antd';

const confirm = Modal.confirm;

let errorLoading = require('../images/error.jpg')

class BookItem extends React.Component {
  constructor(props) {
    super(props);

    this.state = { bookId: props.bookId, bookData: props.bookData || {} };

    this.showConfirm = () => {
      confirm({
        title: '删除本书',
        content: `确认删除本书《${this.props.bookData.title}》吗？`,
        onOk: () => {
          this.props.deleteBook(this.props.bookId);
        },
        onCancel() { },
      });
    }

    console.log('Props: ' + JSON.stringify(this.props));
  }

  getBookDetails() {
    var details = this.state.bookData[this.state.bookId] == null ? {} :
      this.state.bookData[this.state.bookId].details;

    return details || {};
  }

  handleImageErrored(e) {
    e.target.src = errorLoading;
  }

  componentWillReceiveProps(nextProps){
    this.setState({bookId: nextProps.bookId, bookData: nextProps.bookData || {}})
  }

  render() {
    return (
      <Tappable
        onPress={this.showConfirm}
      >
        <div className={styles.box}>
          <img src={this.getBookDetails().cover} onError={this.handleImageErrored} />
          <p>
            <span>{this.getBookDetails().title}</span><br />
            <span>{this.getBookDetails().lastChapter}</span>
          </p>
        </div>
      </Tappable>
    )
  }
}

export default BookItem;