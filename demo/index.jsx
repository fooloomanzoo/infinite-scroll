import React from "react";
import ReactDOM from "react-dom";

import './css/index.css';
import './css/message.css';
import './css/list.css';

import List from "../src/List.jsx";

// create random messages
const users = [ "Peter", "Paul", "Mary" ];
const messageTexts = [ "Yup", "Hi", "U up?", "Let's get started!", "#MeToo", "Uber does not mean 'Über'", "Call me by my name...", "😁", "😉", "😵", "😴", "🌐", "Nam cum ad me in Cumanum salutandi causa uterque venisset, pauca primo inter nos de litteris, quarum summum erat in utroque studium, deinde Torquatus.", "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet. Quisque rutrum. Aenean imperdiet. Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi. Nam eget dui. Etiam rhoncus. Maecenas tempus, tellus eget condimentum rhoncus, sem quam semper libero, sit amet adipiscing sem neque sed ipsum. Nam quam nunc, blandit vel, luctus pulvinar, hendrerit id, lorem. Maecenas nec odio et ante tincidunt tempus. Donec vitae sapien ut libero venenatis faucibus. Nullam quis ante. Etiam sit amet orci eget eros faucibus tincidunt. Duis leo. Sed fringilla mauris sit amet nibh. Donec sodales sagittis magna. Sed consequat, leo eget bibendum sodales, augue velit cursus nunc," ];

const createRandomMessageObj = () => {
  const userId = Math.round(Math.random() * (users.length - 1));
  const msgId = Math.round(Math.random() * (messageTexts.length - 1));
  return {
    user: users[userId],
    text: messageTexts[msgId]
  }
}

const createMultipleRandomMessages = (length) => {
  let items = [];
  for (let i = 0; i < length; i++) {
    items.push(createRandomMessageObj());
  }
  return items;
}

// index-component
class Demo extends React.Component {

  constructor(props) {
    super(props);
    // initial state
    this.state = {
      items: createMultipleRandomMessages(this.props.initialItemLength),
      randomToAdd: 1
    }
    // bind handlers to this
    this.addXRandomMessages = this.addXRandomMessages.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  addXRandomMessages() {
    this.setState({
      items: [...this.state.items, ...createMultipleRandomMessages(this.state.randomToAdd)]
    })
  }

  handleInputChange(event) {
    this.setState({randomToAdd: +event.target.value});
  }

  // custom item renderer
  customItemRenderer(index, item) {
    return <div className={"msg_container"} key={index}><div className="msg_user">({index+1}) {item.user}:</div><div className="msg_text">{item.text}</div></div>;
  }

  render() {
    console.log(this.state.items[0], this.state.items[this.state.items.length-1]);
    return (
      <div className="main">
        <List items={this.state.items} listItemRenderer={this.customItemRenderer}/>
        <div className="bottom">
         <input type="number" value={this.state.randomToAdd} min="1" onChange={this.handleInputChange} />
         <button onClick={this.addXRandomMessages}>Add Random Messages...</button>
         <div className="spacer"></div>
         <div>Total: {this.state.items.length}</div>
        </div>
      </div>
    );
  }
}

// render main-component
ReactDOM.render(<Demo initialItemLength="3000" />, document.getElementById("root"));
