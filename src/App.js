import React, { Component } from 'react';
import ReactSwing  from 'react-swing';
import './App.css';


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
  constructor(props) {
    super(props);
    this.state  = {
      posts: null,
      stack: null,
    };
  }

  componentDidMount() {
    fetch('https://www.reddit.com/r/pics/.json')
      .then(response => response.json())
      .then(data => {
        var promises = [];
        data.data.children && data.data.children.map(cos =>
          promises.push(Promise.all([
            new Promise((resolve, reject) => { 
              fetch('https://www.reddit.com/'+cos.data.permalink+'/.json?sort=controversial&limit=5')
                .then(response => response.json())
                .then(val => resolve(val))
                .catch(err => reject(err))
            }),
            new Promise((resolve, reject) => { 
              fetch('https://www.reddit.com/'+cos.data.permalink+'/.json?limit=5')
                .then(response => response.json())
                .then(val => resolve(val))
                .catch(err => reject(err))
            }),
          ]))
        );

        Promise.all(promises).then((posts) => {
          this.setState({posts});
        });
      })
      .catch(err => console.log(err));
  }

  handleClick = (postId) => {
    var { posts } = this.state;
    for (let i = posts.length - 1; i >= 0; --i) {
      if (posts && posts[i] && posts[i][0] &&  posts[i][0][0]) {
        const data = posts[i][0][0].data;
        if (data && data.children) {
            const { id } = data.children[0].data;
            if (postId === id) {
              console.log(postId);
              posts.splice(i,1);
            }
        }
      }
    }
    this.setState({posts});
  }

  handleThrowEnd = (el) => {
      console.log(el.target.childNodes[0].id);
      this.handleClick(el.target.childNodes[0].id);
  }
  
  getComments = (postComments) => {
    let commentIds = [];
    let comments = [];
    for (let comment of postComments) {
      const { stickied, body, id } = comment.data;
      if (stickied) { continue; }
      if (commentIds.indexOf(id) >= 0) { continue; }
      commentIds.push(id);
      comments.push(<li>{body}</li>);
    }

    return comments;
  }

  render() {
    return (
      <div className="App">
          {this.state.posts && <div id="viewport">
              <ReactSwing
                className="stack"
                tagName="div"
                setStack={stack => this.setState({ stack: stack })}
                ref="stack"
                throwout={e => { 
                  console.log('throwout', e);
                 }}
                throwoutend={this.handleThrowEnd.bind(this)}
                config={{
                  throwOutConfidence: (xOffset, yOffset, element) => {
                    const xConfidence = Math.min(Math.abs(xOffset) / element.offsetWidth / 0.5, 1);
                    const yConfidence = Math.min(Math.abs(yOffset) / element.offsetHeight, 1);
                
                    return Math.max(xConfidence, yConfidence);
                  }
                }}

              >
            {this.state.posts && this.state.posts.map(page => {
              let postRender = null;
              let contraComments = [];
              let topComments = [];
              let postId = 1;

                let p = page[0];
                if (p && p[0] && p[0].data && p[0].data.children[0]) {
                  const postData = p[0].data.children[0].data;
                  const { stickied, id, url, distinguished, thumbnail, title } = postData;
                  const isImage = url.match(/\.(jpeg|png|gif|jpg)$/) != null;
                  postId = id;
                  
                  if (stickied || distinguished === 'moderator' ||
                    !isImage || thumbnail === 'self') {
                    return <div key={id}></div>;
                  }
                  console.log(postData);

                  postRender =
                    <div className="post" id={id} key={id}>
                        <p>{title}</p>
                        <img width="180" alt={id} src={url} />
                        <MyButton id={id} onClick={this.handleClick.bind(this)} />
                    </div>;
                }

                if (p && p[1] && p[1].data && p[1].data.children) {
                  let postComments=p[1].data.children;
                  contraComments = this.getComments(postComments);
                } else {
                  console.log("BBBB");
                  console.log(p);
                }

                p = page[1];
                if (p && p[1] && p[1].data && p[1].data.children) {
                  let postComments=p[1].data.children;
                  topComments = this.getComments(postComments);
                } else {
                  console.log("AAAA");
                  console.log(p);
                }

              return (
                  <div className="card" ref={`render-${postId}`} key={`render-${postId}`}>
                    {postRender}
                    <ul className="contra" key={`contra-${postId}`}>
                      {contraComments}
                    </ul>
                    <ul className="top" key={`top-${postId}`}>
                      {topComments}
                    </ul>
                  </div>
                );
            })}
              </ReactSwing>
        </div>}
        </div>
    );
  }
}

export default App;
