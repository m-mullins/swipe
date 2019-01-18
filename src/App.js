import React, { Component } from 'react';
import ReactSwing  from 'react-swing';
import './App.css';
import lity from 'lity';

class App extends Component {
  fullStack = React.createRef();
  lastConfidence = 0;
  cards = [];
  fetchingMembers = false;
  after = null;
  POST_LIMIT = 12;
  LOWER_COUNT = 5;
  requestId = 0;

  constructor(props) {
    super(props);
    this.state  = {
      members: [],
      stack: null
    };
  }

  componentDidUpdate = () => {
    console.log(this.fullStack);

    if (this.fullStack === null || this.fullStack.current === null) {
      return;
    }

      const children = [...this.fullStack.current.children]; //create a copy before running getCard
      for (let element of children) {
        console.log(element.id);
        if (element && element.id && this.state.stack && !this.cards.includes(element.id)) {
          console.log('Stackifying element ' + element.id);
          this.state.stack.createCard(element, true);
          this.cards.push(element.id);
        }
      }
  }

  componentDidMount() {
    this.fetchPosts();
  }

  
  handleClick = (id) => {
    console.log('handleClick',id);

    var { members } = this.state;
    if (members.length <= 0) { return; }
    console.log('mem',members);
    console.log('removigin',members.shift().key);
    this.setState({members});
    this.fetchPosts();
  }

  dragEnd = (el) => {
    console.log(el);
    if (!this.lastConfidence)
    {
      for (let attr of el.target.attributes) {
        if (attr.localName === "data-lity-target") {
          lity(attr.textContent,{},el.target);
        }
      }
    }
  }
  

  fetchPosts = () => {
    console.log('fetchPosts??? ', this.state.members.length);
    if (this.state.members.length > this.LOWER_COUNT || this.fetchingMembers) {
      return;
    }
    console.log('frethcing data pospotspop??? ', this.state.members.length);

    this.fetchingMembers = true;
    this.requestId++;
    fetch('https://www.reddit.com/r/aww/.json?limit='
        +this.POST_LIMIT+(this.after !== null ? `&after=${this.after}` : ''))
      .then(response => response.json())
      .then(data => {
        console.log('data',data);
        this.after = data.data.after;
        if (data.data.children) {
          console.log('children', data.data.children);
          this.parsePosts(data.data.children);
          this.fetchingMembers = false;
          this.fetchPosts();
        }
      });
  }

  parsePosts = (postList) => {
    let posts = [];

    for (let p of postList) {
      let post = {};
      const { stickied, subreddit, num_comments, id, url, distinguished, thumbnail, title } = p.data;
      const isImage = url.match(/\.(jpeg|png|gif|jpg)$/) != null;
      //console.log('post',id,title,isImage);

      if (stickied || distinguished === 'moderator' ||
        !isImage || thumbnail === 'self') {
          continue;
      }
      
      post.title = title;
      post.id = id;
      post.key = `render-${id}-${this.requestId}`;
      post.imgUrl = url;
      post.thumbnail = thumbnail;
      post.num_comments = num_comments;
      post.subreddit = subreddit;
      posts.push(post);
    }

    this.setState({members: [...this.state.members, ...posts]});
  }


  handleThrowEnd = (el) => {
      this.handleClick(el.target.id,el.throwDirection);
  }
 
  shuffle = (a) => {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  render() {
    return (
      <div className="App">
          <div id="viewport">
            <p>{console.log(this.state.members)}</p>
            {this.state.members  && this.state.members.length > 2 &&
              //'linear-gradient(to bottom,hsla(0, 0%, 0%, 0) 0%,hsla(0, 0%, 0%, 0.009) 18.3%,hsla(0, 0%, 0%, 0.036) 33.5%,hsla(0, 0%, 0%, 0.077) 45.8%,hsla(0, 0%, 0%, 0.13) 55.7%,hsla(0, 0%, 0%, 0.194) 63.5%,hsla(0, 0%, 0%, 0.264) 69.5%,hsla(0, 0%, 0%, 0.34) 74%,hsla(0, 0%, 0%, 0.418) 77.5%,hsla(0, 0%, 0%, 0.497) 80.2%,hsla(0, 0%, 0%, 0.574) 82.5%,hsla(0, 0%, 0%, 0.646) 84.8%,hsla(0, 0%, 0%, 0.711) 87.3%,hsla(0, 0%, 0%, 0.766) 90.4%,hsla(0, 0%, 0%, 0.81) 94.6%,hsla(0, 0%, 0%, 0.84) 100%),' +
              //'linear-gradient(to top,hsla(0, 0%, 0%, 0) 0%,hsla(0, 0%, 0%, 0.009) 18.3%,hsla(0, 0%, 0%, 0.036) 33.5%,hsla(0, 0%, 0%, 0.077) 45.8%,hsla(0, 0%, 0%, 0.13) 55.7%,hsla(0, 0%, 0%, 0.194) 63.5%,hsla(0, 0%, 0%, 0.264) 69.5%,hsla(0, 0%, 0%, 0.34) 74%,hsla(0, 0%, 0%, 0.418) 77.5%,hsla(0, 0%, 0%, 0.497) 80.2%,hsla(0, 0%, 0%, 0.574) 82.5%,hsla(0, 0%, 0%, 0.646) 84.8%,hsla(0, 0%, 0%, 0.711) 87.3%,hsla(0, 0%, 0%, 0.766) 90.4%,hsla(0, 0%, 0%, 0.81) 94.6%,hsla(0, 0%, 0%, 0.84) 100%),' +
              //'linear-gradient(to bottom,hsla(0, 0%, 0%, 0) 0%,hsla(0, 0%, 0%, 0.004) 18.7%,hsla(0, 0%, 0%, 0.015) 34.9%,hsla(0, 0%, 0%, 0.034) 48.7%,hsla(0, 0%, 0%, 0.06) 60.4%,hsla(0, 0%, 0%, 0.094) 70.1%,hsla(0, 0%, 0%, 0.135) 78.1%,hsla(0, 0%, 0%, 0.184) 84.5%,hsla(0, 0%, 0%, 0.241) 89.4%,hsla(0, 0%, 0%, 0.305) 93.2%,hsla(0, 0%, 0%, 0.377) 95.9%,hsla(0, 0%, 0%, 0.456) 97.7%,hsla(0, 0%, 0%, 0.543) 98.8%,hsla(0, 0%, 0%, 0.638) 99.5%,hsla(0, 0%, 0%, 0.74) 99.8%,hsla(0, 0%, 0%, 0.85) 100%),' +
              //'linear-gradient(to top,hsla(0, 0%, 0%, 0) 0%,hsla(0, 0%, 0%, 0.004) 18.7%,hsla(0, 0%, 0%, 0.015) 34.9%,hsla(0, 0%, 0%, 0.034) 48.7%,hsla(0, 0%, 0%, 0.06) 60.4%,hsla(0, 0%, 0%, 0.094) 70.1%,hsla(0, 0%, 0%, 0.135) 78.1%,hsla(0, 0%, 0%, 0.184) 84.5%,hsla(0, 0%, 0%, 0.241) 89.4%,hsla(0, 0%, 0%, 0.305) 93.2%,hsla(0, 0%, 0%, 0.377) 95.9%,hsla(0, 0%, 0%, 0.456) 97.7%,hsla(0, 0%, 0%, 0.543) 98.8%,hsla(0, 0%, 0%, 0.638) 99.5%,hsla(0, 0%, 0%, 0.74) 99.8%,hsla(0, 0%, 0%, 0.85) 100%),' +
            <div style={{display: 'contents'}}>
              <ReactSwing
                style={{display: 'none'}}
                setStack={stack => this.setState({ stack: stack })}
                throwout={this.handleThrowEnd.bind(this)}
                dragend={this.dragEnd.bind(this)}
                config={{
                  allowedDirections: [ReactSwing.DIRECTION.LEFT, ReactSwing.DIRECTION.RIGHT],
                  throwOutConfidence: (xOffset, yOffset, element) => {
                    const xConfidence = Math.min(Math.abs(xOffset) / element.offsetWidth / 0.5, 1);
                    const yConfidence = Math.min(Math.abs(yOffset) / element.offsetHeight, 1);
                
                    this.lastConfidence = Math.max(xConfidence, yConfidence);
                    return this.lastConfidence;
                  }
                }}
              >
              <div style={{display:'none'}}></div>
          </ReactSwing>
          <div ref={this.fullStack} className="stack">
                  <div className="card" id={this.state.members[0].key} key={this.state.members[0].key}
                    data-lity-target={this.state.members[0].imgUrl}
                    data-lity-desc={'" data-lity-close junk="'}
                    style={{
                      backgroundColor: 'gray',
                      background:
                          'url("' + this.state.members[0].imgUrl + '") no-repeat center center',
                      backgroundSize: 'cover',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                    }}
                  >
                  </div>
                  <div className="card" id={this.state.members[1].key} key={this.state.members[1].key}
                    data-lity-target={this.state.members[1].imgUrl}
                    data-lity-desc={'" data-lity-close junk="'}
                    style={{
                      backgroundColor: 'gray',
                      background:
                          'url("' + this.state.members[1].imgUrl + '") no-repeat center center',
                      backgroundSize: 'cover',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                    }}
                  >
                  </div>
              </div>
            </div>
            }
        </div>
      </div>
    );
  }
}

export default App;

/*
            */