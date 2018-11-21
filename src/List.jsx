import React from 'react';
import ReactDOM from "react-dom";
import PropTypes from 'prop-types';

/**
 * component declaration
 */
class List extends React.Component {

  static displayName = 'List';

  static propTypes = {
    listItemRenderer: PropTypes.func,
    minHeight: PropTypes.number,
    itemHeight: PropTypes.number,
    itemBuffer: PropTypes.number
  };

  static defaultProps = {
    listItemRenderer: (index, item) => <div key={index}>{item}</div>,
    minHeight: 200,
    itemHeight: 20,
    itemBuffer: 5
  };

  constructor(props) {
    super(props);
    // initiate `state`
    this.state = {
      firstRenderedIndex: 0,
      lastRenderedIndex: -1,
      offsetTop: 0,
      offsetBottom: 0,
      minimumItemHeight: this.props.itemHeight,
      hasReachedBottom: false
    };
    // reference to the container and scroll region
    this.containerRef = React.createRef();
    this.partialRef = React.createRef();
    // bind event handlers
    this.scrollHandler = this.scrollHandler.bind(this);
  }

  /**
   * when component did mount, update and set initial states
   */
  componentDidMount() {
    this.containerNode = ReactDOM.findDOMNode(this.containerRef.current);
    this.partialListNode = ReactDOM.findDOMNode(this.partialRef.current);
    this.resize();
  }

  /**
   * resizeHandler the component
   */
  resize() {
    const {firstRenderedIndex, lastRenderedIndex, hasReachedBottom} = this.computeViewPort();
    const minimumItemHeight = Math.min(this.props.itemHeight, Math.round(Math.max(this.props.itemHeight, this.partialListNode.offsetHeight / (lastRenderedIndex - firstRenderedIndex))));
    const {offsetTop, offsetBottom} = this.estimateOffsetSpace(firstRenderedIndex, lastRenderedIndex, minimumItemHeight);
    this.setState({
      offsetTop,
      offsetBottom,
      minimumItemHeight,
      firstRenderedIndex,
      lastRenderedIndex,
      hasReachedBottom
    })
  }

  /**
   * scroll handler
   * @param {Event} e Scroll event
   */
  scrollHandler(e) {
    const {firstRenderedIndex, lastRenderedIndex, hasReachedBottom} = this.computeViewPort(this.state.minimumItemHeight);
    if (firstRenderedIndex !== this.state.firstRenderedIndex || lastRenderedIndex !== this.state.lastRenderedIndex) {
      const {offsetTop, offsetBottom} = this.estimateOffsetSpace(firstRenderedIndex, lastRenderedIndex);
      this.setState({
        offsetTop,
        offsetBottom,
        firstRenderedIndex,
        lastRenderedIndex,
        hasReachedBottom
      })
    }
  }

  estimateOffsetSpace(firstRenderedIndex = this.state.firstRenderedIndex, lastRenderedIndex = this.state.lastRenderedIndex, minimumItemHeight = this.state.minimumItemHeight) {
    const itemsLength = this.props.items.length;
    const offsetTop = Math.max(0, firstRenderedIndex) * minimumItemHeight;
    const offsetBottom = Math.max(0, itemsLength - 1 - lastRenderedIndex) * minimumItemHeight;
    return {offsetTop, offsetBottom};
  }

  computeViewPort(minimumItemHeight = this.state.minimumItemHeight) {
    const {scrollTop, offsetHeight} = this.containerNode;
    const itemBuffer = this.props.itemBuffer;
    const itemsLength = this.props.items.length - 1;
    const estimatedFirstRenderedIndex = Math.min(Math.floor(scrollTop / minimumItemHeight), itemsLength);
    const estimatedLastRenderedIndex = Math.min(Math.ceil((scrollTop + offsetHeight) / minimumItemHeight), itemsLength);

    if (this.state && !(estimatedFirstRenderedIndex < this.state.firstRenderedIndex || estimatedFirstRenderedIndex > this.state.lastRenderedIndex)) {
      return {};
    }
    // add a safe region around the rendered items
    const visibleItemLength = estimatedLastRenderedIndex - estimatedFirstRenderedIndex;

    const firstRenderedIndex = Math.max(0, estimatedFirstRenderedIndex - itemBuffer);
    const lastRenderedIndex = Math.min(estimatedLastRenderedIndex + itemBuffer, itemsLength);
    const hasReachedBottom = estimatedLastRenderedIndex === itemsLength;

    return {firstRenderedIndex, lastRenderedIndex, hasReachedBottom};
  }

  /**
   * render list
   */
  renderListItems() {
    const {firstRenderedIndex, lastRenderedIndex} = this.state;
    const list = [];
    for (let i = firstRenderedIndex; i <= lastRenderedIndex; i++) {
      list.push(this.props.listItemRenderer(i, this.props.items[i]));
    }
    return list;
  }

  /**
   * render component
   */
  render() {
    const {offsetTop, offsetBottom, minimumItemHeight, hasReachedBottom} = this.state;
    const listItems = this.renderListItems();
    const height = minimumItemHeight * (this.props.items.length || 1);
    return (
      <div className="list_container" style={{overflowY: 'auto', overflowX: 'hidden', position: 'relative', minHeight: `${this.props.minHeight}px`}} ref={this.containerRef} onScroll={this.scrollHandler} tabIndex="1">
        <div style={{position: 'relative', height: `${height}px`}}>
          <div className="list_partial" style={{display: 'flex', flexDirection: 'column', position: 'absolute', top: hasReachedBottom ? 'auto' : 0, bottom: hasReachedBottom ? 0 : 'auto', left: 0, right: 0, transform: `translateY(${hasReachedBottom ? offsetBottom : offsetTop}px)`}} ref={this.partialRef} >
            {listItems}
          </div>
        </div>
      </div>
    );
  }
}

export default List;
