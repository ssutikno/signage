class Node {
    constructor(id, type, data, duration) {
      this.id = id;
      this.type = type;
      this.data = data;
      this.duration = duration;
    }
  
    toHtmlElement() {
      let element;
      switch (this.type) {
        case "text":
          element = document.createElement("div");
          element.innerHTML = this.data;
          
          break;
        case "image":
          element = document.createElement("img");
          element.src = this.data;
          break;
        case "video":
          element = document.createElement("video");
          element.src = this.data;
          element.autoplay = true;
          element.muted = true;
          if (this.duration == 0 ){
          element.addEventListener('loadedmetadata', ()=> {
            this.duration = element.duration;
          })}
          break;
        default:
          element = document.createElement("div");
          element.innerHTML = this.data;
      }
      element.style.position = "absolute";
      element.style.top = 0;
      element.style.left = 0; 
      element.style.width = "100%";
      element.style.height = "100%";
      element.id = this.id;
      return element;
    }
  }
  
  class Playlist {
    constructor(playlistId) {
      this.playlistId = playlistId;
      this.nodes = [];
      this.currentIndex = 0;
      this.nodeCounter = 0;
    }
  
    add(type, data, duration) {
      const id = 'node_${this.nodeCounter++}';
      const node = new Node(id, type, data, duration)
      this.nodes.push(node);
    }
  
    showFirst(parentElementId) {
      this.currentIndex = 0;
      const firstNode = this.nodes[0];
      let parentElement = document.getElementById(parentElementId);
      parentElement.appendChild(firstNode.toHtmlElement());
      setTimeout(() => {
        this.showNext();
      }, firstNode.duration * 1000)
    }
  
    showNext() {
      let parentElement = document.getElementById(this.nodes[this.currentIndex].id).parentNode;
      let oldElementId = this.nodes[this.currentIndex].id;
      this.currentIndex = (this.currentIndex + 1) % this.nodes.length;
      let nextNode = this.nodes[this.currentIndex];
      let newElement = nextNode.toHtmlElement();
      let oldElement = document.getElementById(oldElementId);
      newElement.id = nextNode.id;
      parentElement.replaceChild(newElement, oldElement);
      setTimeout(() => {
        this.showNext();
      }, nextNode.duration * 1000);
    //   console.log(nextNode.duration);
    }
  }
  
  class Layout {
    constructor(layoutId, x, y, width, height, background) {
      this.layoutId = layoutId;
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
      this.zIndex = 0;
      this.playlist = null;
      this.background = background || "white";
    }
  
    setPlaylist(playlist) {
       this.playlist = playlist;
    }
  
    setDimensions(x, y, width, height) {
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
    //   console.log(this.getElement())
      this.getElement().style.left = `${this.x}px`;
      this.getElement().style.top = `${this.y}px`;
      this.getElement().style.width = `${this.width}px`;
      this.getElement().style.height = `${this.height}px`;
    }
  
    setZIndex(zIndex) {
      this.zIndex = zIndex;
      this.getElement().style.zIndex = this.zIndex;
    }
  
    play() {
      if (this.playlist) {
        this.playlist.showFirst(this.layoutId);
        // setInterval(() => {
        //   this.playlist.showNext();
        // }, this.playlist.nodes[this.playlist.currentIndex].duration*1000);
      }
    }
  
    getElement() {
        console.log(this.layoutId)
      return document.getElementById(this.layoutId);
    }
  }
  
  
class Template {
    constructor(layouts = []) {
      this.layouts = layouts;
    }
  
    addLayout(layout) {
      layout.zIndex = this.layouts.length;
      this.layouts.push(layout);
  
      const layoutElement = document.createElement('div');
      layoutElement.id = `${layout.layoutId}`;
      layoutElement.style.position = 'relative';
      layoutElement.style.left = `${layout.x}px`;
      layoutElement.style.top = `${layout.y}px`;
      layoutElement.style.width = `${layout.width}px`;
      layoutElement.style.height = `${layout.height}px`;
      layoutElement.style.zIndex = layout.zIndex;
      layoutElement.style.backgroundColor = layout.background;
  
      document.body.appendChild(layoutElement);
  
    //   layout.setElement(layoutElement);
    }
  
    play() {
      for (const layout of this.layouts) {
        layout.play();
      }
    }
  }
  
let playList = new Playlist('playlist');
playList.add('image','images/AXIOO FIX COLOR.webp', 3)
playList.add('video','videos/Minilemon Opening - Lagu Anak Nusantara.mp4', 0)
playList.add('image','images/logoraineritem.png', 5)

let layout1 = new Layout('layout1',1,1,500,250, "brown");
layout1.setPlaylist(playList);

let template = new Template();
template.addLayout(layout1);
// layout1.setDimensions(1,1,100,20);
template.play();