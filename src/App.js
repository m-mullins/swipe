import React, { Component } from 'react';
import ReactSwing  from 'react-swing';
import './App.css';
import htmlDecode from 'unescape';
import lity from 'lity';

class MyButton extends Component {

  handleClick = () => {
    this.props.onClick(this.props.id);
  }

  render = () => {
    return (
      <button className="btn btn-primary" onClick={this.handleClick.bind(this)}>Remove</button>
    )
  }
}

class App extends Component {
  fullStack = React.createRef();
  fetchingPosts = false;
  after = null;
  newPosts = []
  POST_LIMIT = 5;
  COMMENT_LIMIT = 20;
  lastConfidence = 0;
  requestId = 0;

  constructor(props) {
    super(props);
    this.state  = {
      posts: [],
      stack: null,
      best: 0,
      score: 0
    };
  }

  fetchPosts = () => {
    if (this.state.posts.length > 10 || this.fetchingPosts) {
      return;
    }
    this.requestId++;

    this.fetchingPosts = true;
    console.log('https://www.reddit.com/.json?limit='
        +this.POST_LIMIT+(this.after !== null ? `&after=${this.after}` : ''));
    fetch('https://www.reddit.com/.json?limit='
        +this.POST_LIMIT+(this.after !== null ? `&after=${this.after}` : ''))
      .then(response => response.json())
      .then(data => {
        var promises = [];
        this.after = data.data.after;
        data.data.children && data.data.children.map(cos =>
          promises.push(Promise.all([
            new Promise((resolve, reject) => { 
              fetch('https://www.reddit.com/'+cos.data.permalink+'/.json?sort=controversial&limit='+this.COMMENT_LIMIT)
                .then(response => response.json())
                .then(val => resolve(val))
                .catch(err => reject(err))
            }),
            new Promise((resolve, reject) => { 
              fetch('https://www.reddit.com/'+cos.data.permalink+'/.json?limit='+this.LIMIT)
                .then(response => response.json())
                .then(val => resolve(val))
                .catch(err => reject(err))
            }),
          ]))
        );

        Promise.all(promises).then((postData) => {
          let posts = this.parsePosts(postData);
          this.newPosts = this.newPosts.concat(posts.map((post)=>post.id));
          posts = [ ...posts, ...this.state.posts ];
          this.setState({posts});
          this.fetchingPosts = false;
          this.fetchPosts();
        });
      })
      .catch(err => console.log(err));
  }
  
  componentDidUpdate = () => {
    console.log(this.newPosts);
    let newIds = [...this.newPosts];
    this.newPosts = [];
    for (let id of newIds) {
      const children = [...this.fullStack.current.children[1].children]; //create a copy before running getCard
      for (let element of children) {
        if (element.id === id) {
          console.log('Stackifying element ' + id);
          this.state.stack.createCard(element, true);
        }
      }
    }
}

  parsePosts = (postList) => {
    if (!postList) { return [] }
    let posts = [];
    for (let page of postList) {
      let post = {};
      let comments = [];

      let p = page[0]; //contraversial comments
      console.log(p);

      if (p && p[0] && p[0].data && p[0].data.children[0]) {
        const postData = p[0].data.children[0].data;
        const { stickied, id, url, distinguished, thumbnail, title } = postData;
        const isImage = url.match(/\.(jpeg|png|gif|jpg)$/) != null;

        if (stickied || distinguished === 'moderator' ||
          !isImage || thumbnail === 'self') {
            continue;
        }

        post.title = title;
        post.id = id;
        post.key = `render-${id}-${this.requestId}`;
        post.imgUrl = url;
        post.thumbnail = thumbnail;
        post.num_comments = postData.num_comments;
        post.subreddit = postData.subreddit;
      }

      if (p && p[1] && p[1].data && p[1].data.children) {
        let postComments = p[1].data.children;
        comments = this.getComments(postComments, true);
      }

      p = page[1];
      if (p && p[1] && p[1].data && p[1].data.children) {
        let postComments = p[1].data.children;
        comments = comments.concat(this.getComments(postComments));
      }

      if (comments.length <= 0) {
        continue;
      }

      comments = this.shuffle(comments);
      post.comment = null;
      for (let c of comments) {
        if (c.text && c.text.split(' ').length <= 14) {
          post.comment = c;
          break;
        }
      }

      if (post.comment === null) {
        continue;
      }

      posts.push(post);
    }
    return posts; //posts.reverse();
  }

  componentDidMount() {
    this.fetchPosts();
  }

  handleClick = (postId, direction) => {
    var { posts } = this.state;
    if (posts.length <= 0) { return; }

    for (let i = posts.length - 1; i >= 0; --i) {
      if (posts[i].id === postId) {
        let correct = ((posts[i].comment.contra && direction === ReactSwing.DIRECTION.LEFT) ||
            (!posts[i].comment.contra && direction === ReactSwing.DIRECTION.RIGHT ));
        console.log('direction', direction);
        console.log('left', direction === ReactSwing.DIRECTION.LEFT);
        console.log('right', direction === ReactSwing.DIRECTION.RIGHT);

        let best = this.state.best;
        let score = this.state.score;

        if (correct) {
          score += 1;
        } else {
          if ( score > best  ) {
            best = score;
          }
          score = 0;
        }

        this.setState({best,score});

        posts.splice(i,1);
      }
    }

    this.setState({posts});
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
      //if (el.target && el.target.attributes && el.target.attributes.style) {
      //  let style = el.target.attributes.style.textContent;
      //  let url = style.match(/url\(["']([^"']+)/);
      //  if (url && url.length > 1) {
      //    lity(url[1],{},el.target);
      //  }
      //}
    }

  }

  handleThrowEnd = (el) => {
      console.log('elelelele',el);
      this.handleClick(el.target.id,el.throwDirection);
      this.fetchPosts();
  }
  
  getComments = (postComments, contra) => {
    let commentIds = [];
    let comments = [];
    for (let comment of postComments) {
      const { stickied, body_html, body, id } = comment.data;
      if (stickied) { continue; }
      if (commentIds.indexOf(id) >= 0) { continue; }
      commentIds.push(id);
      comments.push({ text: body, __html: htmlDecode(body_html), contra: contra});
    }

    return comments;
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
          <div ref={this.fullStack} id="viewport">
              <p style={{paddingBottom: '3px'}}>Best: {this.state.best} Score: {this.state.score}</p>
              <ReactSwing
                className="stack"
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
 {this.state.posts && this.state.posts.map((post) => {
              //'linear-gradient(to bottom,hsla(0, 0%, 0%, 0) 0%,hsla(0, 0%, 0%, 0.009) 18.3%,hsla(0, 0%, 0%, 0.036) 33.5%,hsla(0, 0%, 0%, 0.077) 45.8%,hsla(0, 0%, 0%, 0.13) 55.7%,hsla(0, 0%, 0%, 0.194) 63.5%,hsla(0, 0%, 0%, 0.264) 69.5%,hsla(0, 0%, 0%, 0.34) 74%,hsla(0, 0%, 0%, 0.418) 77.5%,hsla(0, 0%, 0%, 0.497) 80.2%,hsla(0, 0%, 0%, 0.574) 82.5%,hsla(0, 0%, 0%, 0.646) 84.8%,hsla(0, 0%, 0%, 0.711) 87.3%,hsla(0, 0%, 0%, 0.766) 90.4%,hsla(0, 0%, 0%, 0.81) 94.6%,hsla(0, 0%, 0%, 0.84) 100%),' +
              //'linear-gradient(to top,hsla(0, 0%, 0%, 0) 0%,hsla(0, 0%, 0%, 0.009) 18.3%,hsla(0, 0%, 0%, 0.036) 33.5%,hsla(0, 0%, 0%, 0.077) 45.8%,hsla(0, 0%, 0%, 0.13) 55.7%,hsla(0, 0%, 0%, 0.194) 63.5%,hsla(0, 0%, 0%, 0.264) 69.5%,hsla(0, 0%, 0%, 0.34) 74%,hsla(0, 0%, 0%, 0.418) 77.5%,hsla(0, 0%, 0%, 0.497) 80.2%,hsla(0, 0%, 0%, 0.574) 82.5%,hsla(0, 0%, 0%, 0.646) 84.8%,hsla(0, 0%, 0%, 0.711) 87.3%,hsla(0, 0%, 0%, 0.766) 90.4%,hsla(0, 0%, 0%, 0.81) 94.6%,hsla(0, 0%, 0%, 0.84) 100%),' +
              //'linear-gradient(to bottom,hsla(0, 0%, 0%, 0) 0%,hsla(0, 0%, 0%, 0.004) 18.7%,hsla(0, 0%, 0%, 0.015) 34.9%,hsla(0, 0%, 0%, 0.034) 48.7%,hsla(0, 0%, 0%, 0.06) 60.4%,hsla(0, 0%, 0%, 0.094) 70.1%,hsla(0, 0%, 0%, 0.135) 78.1%,hsla(0, 0%, 0%, 0.184) 84.5%,hsla(0, 0%, 0%, 0.241) 89.4%,hsla(0, 0%, 0%, 0.305) 93.2%,hsla(0, 0%, 0%, 0.377) 95.9%,hsla(0, 0%, 0%, 0.456) 97.7%,hsla(0, 0%, 0%, 0.543) 98.8%,hsla(0, 0%, 0%, 0.638) 99.5%,hsla(0, 0%, 0%, 0.74) 99.8%,hsla(0, 0%, 0%, 0.85) 100%),' +
              //'linear-gradient(to top,hsla(0, 0%, 0%, 0) 0%,hsla(0, 0%, 0%, 0.004) 18.7%,hsla(0, 0%, 0%, 0.015) 34.9%,hsla(0, 0%, 0%, 0.034) 48.7%,hsla(0, 0%, 0%, 0.06) 60.4%,hsla(0, 0%, 0%, 0.094) 70.1%,hsla(0, 0%, 0%, 0.135) 78.1%,hsla(0, 0%, 0%, 0.184) 84.5%,hsla(0, 0%, 0%, 0.241) 89.4%,hsla(0, 0%, 0%, 0.305) 93.2%,hsla(0, 0%, 0%, 0.377) 95.9%,hsla(0, 0%, 0%, 0.456) 97.7%,hsla(0, 0%, 0%, 0.543) 98.8%,hsla(0, 0%, 0%, 0.638) 99.5%,hsla(0, 0%, 0%, 0.74) 99.8%,hsla(0, 0%, 0%, 0.85) 100%),' +

              return (
                  <div className="card" id={post.id} key={post.key}
                    data-lity-target={post.imgUrl}
                    data-lity-desc={'" data-lity-close junk="'}
                    style={{
                      backgroundColor: 'gray',
                      background:
                          'url("' + post.imgUrl + '") no-repeat center center',
                      backgroundSize: 'cover',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div style={{marginLeft: '10px', marginRight: '10px' }}>
                      <p style={{ color: 'white', textShadow: '1px 1px 2px #000' }}>{post.title}</p>
                    </div>
                    <div style={{ position: 'absoulte', bottom: '0', marginLeft: '10px', marginRIght: '10px' }}>
                      <p style={{ color: '#fff', textShadow: '1px 1px 2px #000' }}>🗨 {post.num_comments} • /r/{post.subreddit}</p>
                      <div dangerouslySetInnerHTML={post.comment} className="top"></div>
                    </div>
                  </div>
              );
            })}


          
          </ReactSwing>
        </div>
        </div>
    );
  }
}

export default App;

/*
            */