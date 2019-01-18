import React, { Component } from 'react';
import ReactSwing  from 'react-swing';
import './App.css';
import Members from './members.json';

class App extends Component {
  fullStack = React.createRef();
  lastConfidence = 0;
  cards = [];

  constructor(props) {
    super(props);
    this.state  = {
      members: [],
      stack: null,
      best: 0,
      score: 0,
      position: 0
    };
  }

  componentDidUpdate = () => {
    console.log(this.fullStack);
      const children = [...this.fullStack.current.children]; //create a copy before running getCard
      for (let element of children) {
        console.log(element.id);
        let id = parseInt(element.id);
        if (element && element.id && this.state.stack && !this.cards.includes(id)) {
          console.log('Stackifying element ' + element.id);
          this.state.stack.createCard(element, true);
          this.cards.push(id);
        }
      }
  }

  componentDidMount() {
    this.setState({ members: this.shuffle(Members) });
  }

  handleClick = (id, direction) => {
    let position = this.state.position;
    position++;
    this.setState({position});
  }

  dragEnd = (el) => {
    console.log(el);
    //if (!this.lastConfidence)
    //{
    //  for (let attr of el.target.attributes) {
    //    if (attr.localName === "data-lity-target") {
    //      lity(attr.textContent,{},el.target);
    //    }
    //  }
    //  //if (el.target && el.target.attributes && el.target.attributes.style) {
    //  //  let style = el.target.attributes.style.textContent;
    //  //  let url = style.match(/url\(["']([^"']+)/);
    //  //  if (url && url.length > 1) {
    //  //    lity(url[1],{},el.target);
    //  //  }
    //  //}
    //}
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
    let position = 0;
    let position1 = 1;
    let position2 = 2;
   
    if (this.state.members && this.state.members.length > 2) {
      position = this.state.position%this.state.members.length;
      position1 = (this.state.position+1)%this.state.members.length;
      position2 = (this.state.position+2)%this.state.members.length;
    }

    return (
      <div className="App">
          <div id="viewport">
            {this.state.members  && this.state.members.length > 2 &&
              //'linear-gradient(to bottom,hsla(0, 0%, 0%, 0) 0%,hsla(0, 0%, 0%, 0.009) 18.3%,hsla(0, 0%, 0%, 0.036) 33.5%,hsla(0, 0%, 0%, 0.077) 45.8%,hsla(0, 0%, 0%, 0.13) 55.7%,hsla(0, 0%, 0%, 0.194) 63.5%,hsla(0, 0%, 0%, 0.264) 69.5%,hsla(0, 0%, 0%, 0.34) 74%,hsla(0, 0%, 0%, 0.418) 77.5%,hsla(0, 0%, 0%, 0.497) 80.2%,hsla(0, 0%, 0%, 0.574) 82.5%,hsla(0, 0%, 0%, 0.646) 84.8%,hsla(0, 0%, 0%, 0.711) 87.3%,hsla(0, 0%, 0%, 0.766) 90.4%,hsla(0, 0%, 0%, 0.81) 94.6%,hsla(0, 0%, 0%, 0.84) 100%),' +
              //'linear-gradient(to top,hsla(0, 0%, 0%, 0) 0%,hsla(0, 0%, 0%, 0.009) 18.3%,hsla(0, 0%, 0%, 0.036) 33.5%,hsla(0, 0%, 0%, 0.077) 45.8%,hsla(0, 0%, 0%, 0.13) 55.7%,hsla(0, 0%, 0%, 0.194) 63.5%,hsla(0, 0%, 0%, 0.264) 69.5%,hsla(0, 0%, 0%, 0.34) 74%,hsla(0, 0%, 0%, 0.418) 77.5%,hsla(0, 0%, 0%, 0.497) 80.2%,hsla(0, 0%, 0%, 0.574) 82.5%,hsla(0, 0%, 0%, 0.646) 84.8%,hsla(0, 0%, 0%, 0.711) 87.3%,hsla(0, 0%, 0%, 0.766) 90.4%,hsla(0, 0%, 0%, 0.81) 94.6%,hsla(0, 0%, 0%, 0.84) 100%),' +
              //'linear-gradient(to bottom,hsla(0, 0%, 0%, 0) 0%,hsla(0, 0%, 0%, 0.004) 18.7%,hsla(0, 0%, 0%, 0.015) 34.9%,hsla(0, 0%, 0%, 0.034) 48.7%,hsla(0, 0%, 0%, 0.06) 60.4%,hsla(0, 0%, 0%, 0.094) 70.1%,hsla(0, 0%, 0%, 0.135) 78.1%,hsla(0, 0%, 0%, 0.184) 84.5%,hsla(0, 0%, 0%, 0.241) 89.4%,hsla(0, 0%, 0%, 0.305) 93.2%,hsla(0, 0%, 0%, 0.377) 95.9%,hsla(0, 0%, 0%, 0.456) 97.7%,hsla(0, 0%, 0%, 0.543) 98.8%,hsla(0, 0%, 0%, 0.638) 99.5%,hsla(0, 0%, 0%, 0.74) 99.8%,hsla(0, 0%, 0%, 0.85) 100%),' +
              //'linear-gradient(to top,hsla(0, 0%, 0%, 0) 0%,hsla(0, 0%, 0%, 0.004) 18.7%,hsla(0, 0%, 0%, 0.015) 34.9%,hsla(0, 0%, 0%, 0.034) 48.7%,hsla(0, 0%, 0%, 0.06) 60.4%,hsla(0, 0%, 0%, 0.094) 70.1%,hsla(0, 0%, 0%, 0.135) 78.1%,hsla(0, 0%, 0%, 0.184) 84.5%,hsla(0, 0%, 0%, 0.241) 89.4%,hsla(0, 0%, 0%, 0.305) 93.2%,hsla(0, 0%, 0%, 0.377) 95.9%,hsla(0, 0%, 0%, 0.456) 97.7%,hsla(0, 0%, 0%, 0.543) 98.8%,hsla(0, 0%, 0%, 0.638) 99.5%,hsla(0, 0%, 0%, 0.74) 99.8%,hsla(0, 0%, 0%, 0.85) 100%),' +
            <div style={{display: 'contents'}}>
              <p style={{marginTop: '15px'}}>Best: {this.state.best} Score: {this.state.score}</p>
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
                  <div className="card" id={this.state.position} key={position}
                    data-lity-target={this.state.members[position].src}
                    data-lity-desc={'" data-lity-close junk="'}
                    style={{
                      backgroundColor: 'gray',
                      background:
                          'url("' + this.state.members[position].src + '") no-repeat center center',
                      backgroundSize: 'cover',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div style={{marginLeft: '10px', marginRight: '10px' }}>
                      <p style={{ color: 'white', textShadow: '1px 1px #000' }}>{position}</p>
                    </div>
                    <div style={{ position: 'absoulte', bottom: '0', marginLeft: '10px', marginRight: '10px' }}>
                      <p style={{ color: '#fff', textShadow: '1px 1px #000' }}>{this.state.members[position].party}</p>
                    </div>
                  </div>
                  <div className="card" id={this.state.position+1} key={position1}
                    data-lity-target={this.state.members[position1].src}
                    data-lity-desc={'" data-lity-close junk="'}
                    style={{
                      backgroundColor: 'gray',
                      background:
                          'url("' + this.state.members[position1].src + '") no-repeat center center',
                      backgroundSize: 'cover',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div style={{marginLeft: '10px', marginRight: '10px' }}>
                      <p style={{ color: 'white', textShadow: '1px 1px #000' }}>{position1}</p>
                    </div>
                    <div style={{ position: 'absoulte', bottom: '0', marginLeft: '10px', marginRight: '10px' }}>
                      <p style={{ color: '#fff', textShadow: '1px 1px #000' }}>{this.state.members[position1].party}</p>
                    </div>
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