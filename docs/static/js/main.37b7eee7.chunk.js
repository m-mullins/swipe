(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{20:function(t,e,n){t.exports=n(42)},25:function(t,e,n){},37:function(t,e,n){},42:function(t,e,n){"use strict";n.r(e);var a=n(0),r=n.n(a),o=n(16),i=n.n(o),l=(n(25),n(4)),c=n(17),s=n(7),d=n(9),u=n(8),f=n(10),h=n(3),m=n(1),p=n.n(m),v=(n(37),n(18)),g=n.n(v),y=n(19),w=n.n(y),b=(a.Component,function(t){function e(t){var n;return Object(s.a)(this,e),(n=Object(d.a)(this,Object(u.a)(e).call(this,t))).fullStack=r.a.createRef(),n.fetchingPosts=!1,n.after=null,n.newPosts=[],n.POST_LIMIT=5,n.COMMENT_LIMIT=20,n.lastConfidence=0,n.requestId=0,n.fetchPosts=function(){n.state.posts.length>10||n.fetchingPosts||(n.requestId++,n.fetchingPosts=!0,console.log("https://www.reddit.com/.json?limit="+n.POST_LIMIT+(null!==n.after?"&after=".concat(n.after):"")),fetch("https://www.reddit.com/.json?limit="+n.POST_LIMIT+(null!==n.after?"&after=".concat(n.after):"")).then(function(t){return t.json()}).then(function(t){var e=[];n.after=t.data.after,t.data.children&&t.data.children.map(function(t){return e.push(Promise.all([new Promise(function(e,a){fetch("https://www.reddit.com/"+t.data.permalink+"/.json?sort=controversial&limit="+n.COMMENT_LIMIT).then(function(t){return t.json()}).then(function(t){return e(t)}).catch(function(t){return a(t)})}),new Promise(function(e,a){fetch("https://www.reddit.com/"+t.data.permalink+"/.json?limit="+n.LIMIT).then(function(t){return t.json()}).then(function(t){return e(t)}).catch(function(t){return a(t)})})]))}),Promise.all(e).then(function(t){var e=n.parsePosts(t);n.newPosts=n.newPosts.concat(e.map(function(t){return t.id})),e=Object(l.a)(e).concat(Object(l.a)(n.state.posts)),n.setState({posts:e}),n.fetchingPosts=!1,n.fetchPosts()})}).catch(function(t){return console.log(t)}))},n.componentDidUpdate=function(){console.log(n.newPosts);var t=Object(l.a)(n.newPosts);n.newPosts=[];var e=!0,a=!1,r=void 0;try{for(var o,i=t[Symbol.iterator]();!(e=(o=i.next()).done);e=!0){var c=o.value,s=Object(l.a)(n.fullStack.current.children[1].children),d=!0,u=!1,f=void 0;try{for(var h,m=s[Symbol.iterator]();!(d=(h=m.next()).done);d=!0){var p=h.value;p.id===c&&(console.log("Stackifying element "+c),n.state.stack.createCard(p,!0))}}catch(v){u=!0,f=v}finally{try{d||null==m.return||m.return()}finally{if(u)throw f}}}}catch(v){a=!0,r=v}finally{try{e||null==i.return||i.return()}finally{if(a)throw r}}},n.parsePosts=function(t){if(!t)return[];var e=[],a=!0,r=!1,o=void 0;try{for(var i,l=t[Symbol.iterator]();!(a=(i=l.next()).done);a=!0){var c=i.value,s={},d=[],u=c[0];if(console.log(u),u&&u[0]&&u[0].data&&u[0].data.children[0]){var f=u[0].data.children[0].data,h=f.stickied,m=f.id,p=f.url,v=f.distinguished,g=f.thumbnail,y=f.title,w=null!=p.match(/\.(jpeg|png|gif|jpg)$/);if(h||"moderator"===v||!w||"self"===g)continue;s.title=y,s.id=m,s.key="render-".concat(m,"-").concat(n.requestId),s.imgUrl=p,s.thumbnail=g,s.num_comments=f.num_comments,s.subreddit=f.subreddit}if(u&&u[1]&&u[1].data&&u[1].data.children){var b=u[1].data.children;d=n.getComments(b,!0)}if((u=c[1])&&u[1]&&u[1].data&&u[1].data.children){var I=u[1].data.children;d=d.concat(n.getComments(I))}if(!(d.length<=0)){d=n.shuffle(d),s.comment=null;var k=!0,x=!1,E=void 0;try{for(var T,C=d[Symbol.iterator]();!(k=(T=C.next()).done);k=!0){var P=T.value;if(P.text&&P.text.split(" ").length<=14){s.comment=P;break}}}catch(S){x=!0,E=S}finally{try{k||null==C.return||C.return()}finally{if(x)throw E}}null!==s.comment&&e.push(s)}}}catch(S){r=!0,o=S}finally{try{a||null==l.return||l.return()}finally{if(r)throw o}}return e},n.handleClick=function(t,e){var a=n.state.posts;if(!(a.length<=0)){for(var r=a.length-1;r>=0;--r)if(a[r].id===t){var o=a[r].comment.contra&&e===p.a.DIRECTION.LEFT||!a[r].comment.contra&&e===p.a.DIRECTION.RIGHT;console.log("direction",e),console.log("left",e===p.a.DIRECTION.LEFT),console.log("right",e===p.a.DIRECTION.RIGHT);var i=n.state.best,l=n.state.score;o?l+=1:(l>i&&(i=l),l=0),n.setState({best:i,score:l}),a.splice(r,1)}n.setState({posts:a})}},n.dragEnd=function(t){if(console.log(t),!n.lastConfidence){var e=!0,a=!1,r=void 0;try{for(var o,i=t.target.attributes[Symbol.iterator]();!(e=(o=i.next()).done);e=!0){var l=o.value;"data-lity-target"===l.localName&&w()(l.textContent,{},t.target)}}catch(c){a=!0,r=c}finally{try{e||null==i.return||i.return()}finally{if(a)throw r}}}},n.handleThrowEnd=function(t){console.log("elelelele",t),n.handleClick(t.target.id,t.throwDirection),n.fetchPosts()},n.getComments=function(t,e){var n=[],a=[],r=!0,o=!1,i=void 0;try{for(var l,c=t[Symbol.iterator]();!(r=(l=c.next()).done);r=!0){var s=l.value.data,d=s.stickied,u=s.body_html,f=s.body,h=s.id;d||(n.indexOf(h)>=0||(n.push(h),a.push({text:f,__html:g()(u),contra:e})))}}catch(m){o=!0,i=m}finally{try{r||null==c.return||c.return()}finally{if(o)throw i}}return a},n.shuffle=function(t){for(var e=t.length-1;e>0;e--){var n=Math.floor(Math.random()*(e+1)),a=[t[n],t[e]];t[e]=a[0],t[n]=a[1]}return t},n.state={posts:[],stack:null,best:0,score:0},n}return Object(f.a)(e,t),Object(c.a)(e,[{key:"componentDidMount",value:function(){this.fetchPosts()}},{key:"render",value:function(){var t=this;return r.a.createElement("div",{className:"App"},r.a.createElement("div",{ref:this.fullStack,id:"viewport"},r.a.createElement("p",{style:{paddingBottom:"3px"}},"Best: ",this.state.best," Score: ",this.state.score),r.a.createElement(p.a,{className:"stack",setStack:function(e){return t.setState({stack:e})},throwout:this.handleThrowEnd.bind(this),dragend:this.dragEnd.bind(this),config:{allowedDirections:[p.a.DIRECTION.LEFT,p.a.DIRECTION.RIGHT],throwOutConfidence:function(e,n,a){var r=Math.min(Math.abs(e)/a.offsetWidth/.5,1),o=Math.min(Math.abs(n)/a.offsetHeight,1);return t.lastConfidence=Math.max(r,o),t.lastConfidence}}},this.state.posts&&this.state.posts.map(function(t){return r.a.createElement("div",{className:"card",id:t.id,key:t.key,"data-lity-target":t.imgUrl,"data-lity-desc":'" data-lity-close junk="',style:{backgroundColor:"gray",background:'url("'+t.imgUrl+'") no-repeat center center',backgroundSize:"cover",display:"flex",flexDirection:"column",justifyContent:"space-between"}},r.a.createElement("div",{style:{marginLeft:"10px",marginRight:"10px"}},r.a.createElement("p",{style:{color:"white",textShadow:"1px 1px 2px #000"}},t.title)),r.a.createElement("div",{style:{position:"absoulte",bottom:"0",marginLeft:"10px",marginRIght:"10px"}},r.a.createElement("p",{style:{color:"#fff",textShadow:"1px 1px 2px #000"}},"\ud83d\udde8 ",t.num_comments," \u2022 /r/",t.subreddit),r.a.createElement("div",{dangerouslySetInnerHTML:t.comment,className:"top"})))}))))}}]),e}(a.Component));Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));i.a.render(r.a.createElement(b,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then(function(t){t.unregister()})}},[[20,2,1]]]);
//# sourceMappingURL=main.37b7eee7.chunk.js.map