class Game {
  constructor() {
    this.config = {
      background: 0x282828,
      cubeColor: 0xbebebe,
      cubeWidth: 4,
      cubeHeight: 2,
      cubeDeep: 4,
    };
    this.score = 0;
    this.scene = new THREE.Scene();
    this.camera = new THREE.OrthographicCamera(window.innerWidth / -80, window.innerWidth / 80, window.innerHeight / 80, window.innerHeight / -80, 0, 5000);
    this.cameraPros = {
      current: new THREE.Vector3(0, 0, 0),
      next: new THREE.Vector3(0, 0, 0),
    };
    this.renderer = new THREE.WebGLRenderer({antialias: true});
    this.size = {width: window.innerWidth, height: window.innerHeight};
    this.cubes=[];
    this.cubeStat={
      nextDir:"",
    };

  }

  init() {
    this._setCamera();
    this._setRenderer();
    this._setLight();
    this._createCube();
    this._createCube();
    this._updateCamera();
    this._handleWindowResize();
    window.addEventListener("resize",()=>{
      this._handleWindowResize();
    })
  }
  _handleWindowResize(){
    this._setSize();
    this.camera.left=this.size.width/-80;
    this.camera.right=this.size.width/80;
    this.camera.top=this.size.height/80;
    this.camera.bottom=this.size.height/-80;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.size.width,this.size.height);
    this._render();
  }
  _setCamera(){
    this.camera.position.set(100,100,100);
    this.camera.lookAt(this.cameraPros.current);
  };
  _setRenderer(){
    this.renderer.setSize(this.size.width,this.size.height);
    this.renderer.setClearColor(this.config.background);
    document.body.appendChild(this.renderer.domElement);
  };
  _setLight(){
    let directionalLight=new THREE.DirectionalLight(0xffffff,1.1);
    directionalLight.position.set(2,10,5);
    this.scene.add(directionalLight);
    let light=new THREE.AmbientLight(0xffffff,0.3);
    this.scene.add(light)
  };
  _createCube(){
    let geometry=new THREE.CubeGeometry(this.config.cubeWidth,this.config.cubeHeight,this.config.cubeDeep);
    let material=new THREE.MeshLambertMaterial({color:this.config.cubeColor});
    let cube=new THREE.Mesh(geometry,material);
    if(this.cubes.length){
      cube.position.x=this.cubes[this.cubes.length-1].position.x;
      cube.position.y=this.cubes[this.cubes.length-1].position.y;
      cube.position.z=this.cubes[this.cubes.length-1].position.z;
      this.cubeStat.nextDir=Math.random()>0.5?"left":"right";
      if(this.cubeStat.nextDir=="left"){
        cube.position.x=cube.position.x-Math.round(Math.random()*4+6);
      }else {
        cube.position.z=cube.position.z-Math.round(Math.random()*4+6);
      }
    }
    this.cubes.push(cube);
    if(this.cubes.length>5){
      this.scene.remove(this.cubes.shift());
    }
    this.scene.add(cube);
    if(this.cubes.length>1){
      this._updateCameraPros();
    }
  };
  _updateCamera(){
    let cur={
      x:this.cameraPros.current.x,
      y:this.cameraPros.current.y,
      z:this.cameraPros.current.z,
    };
    let next={
      x:this.cameraPros.next.x,
      y:this.cameraPros.next.y,
      z:this.cameraPros.next.z,
    };
    if(cur.x>next.x||cur.z>next.z){
      this.cameraPros.current.x-=0.1;
      this.cameraPros.current.z-=0.1;
      if(this.cameraPros.current.x-this.cameraPros.next.x<0.05){
        this.cameraPros.current.x=this.cameraPros.next.x;
      }else if(this.cameraPros.current.z-this.cameraPros.next.z<0.05){
        this.cameraPros.current.z=this.cameraPros.next.z;
      }
    };
    this.camera.lookAt(new THREE.Vector3(cur.x,0,cur.z));
    this._render();
    requestAnimationFrame(()=>{
      this._updateCamera();
    })
  };
  _updateCameraPros(){
    let lastIndex=this.cubes.length-1;
    let pointA={
      x:this.cubes[lastIndex].position.x,
      z:this.cubes[lastIndex].position.z,
    };
    let pointB={
      x:this.cubes[lastIndex-1].position.x,
      z:this.cubes[lastIndex-1].position.z,
    };
    this.cameraPros.next=new THREE.Vector3((pointA.x+pointB.x)/2,0,(pointA.z+pointB.z)/2);
  };
  _setSize(){
    this.size.width=window.innerWidth;
    this.size.height=window.innerHeight;
  };
  _render(){
    this.renderer.render(this.scene,this.camera);
  };
}