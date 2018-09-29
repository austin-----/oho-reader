import {connect} from 'react-redux';
import * as action from '../redux/action/index'

const Main = (component) => {
  const mapStateToProps = (state) => {
    let {
      searchResults,
      searchResultDetails,
      searchHistory,
      readSetting,
      bookList,
      readingState,
      bookData
    } = state
    return {
      searchResults,
      searchResultDetails,
      searchHistory,
      readSetting,
      bookList,
      readingState,
      bookData
    }
  }

  return connect(
    mapStateToProps,
    action
    )(component)
}

export default Main;