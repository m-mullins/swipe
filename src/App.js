import React, { Component } from 'react';
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

  render() {
    return (
      <div className="App">
          {this.state.posts && this.state.posts.map(page => {
              let postRender = null;
              let comments = [];
              let commentIds = [];
              let postId = 1;

              for (let p of page) {
                if (postRender === null && p && p[0] && p[0].data && p[0].data.children[0]) {
                  const postData = p[0].data.children[0].data;
                  const { stickied, id, url, distinguished, thumbnail, title } = postData;
                  const isImage = url.match(/\.(jpeg|png|gif|jpg)$/) != null;
                  postId = id;
                  
                  if (stickied || distinguished === 'moderator' ||
                    !isImage || thumbnail === 'self') {
                    continue;
                  }
                  console.log(postData);

                  postRender =
                    <div className="row" id={id} key={id}>
                      <div className="col-md-2" key={`${id}-thumbnail`}>
                        <img width="400" alt={id} src={url} />
                      </div>
                      <div className="col-md-2" key={`${id}-remove`}>
                        <MyButton id={id} onClick={this.handleClick.bind(this)} />
                      </div>

                      <div className="col-md-auto" key={`${id}-title}`}>
                        <p>{title}</p>
                      </div>
                    </div>;
                }

                if (p && p[1] && p[1].data && p[1].data.children) {
                  let postComments=p[1].data.children;
                  for (let comment of postComments) {
                    const { stickied, body, id } = comment.data;
                    if (stickied) { continue; }
                    if (commentIds.indexOf(id) >= 0) { continue; }
                    commentIds.push(id);

                    comments.push(
                      <div className="row" id={id} key={id}>
                        <div className="col-md-auto" >
                          <p>{body}</p>
                        </div>
                    </div>);
                  }
                }
              }

              return (
                  <div key={`render-${postId}`}>
                    {postRender}
                    {comments}
                  </div>
                );

            })}
      </div>
    );
  }
}

export default App;
