class Game {
  constructor(){
    //准备需要的一些信息
    this.config={
      background:0x282828,//清屏的背景颜色
      ground:-1,//地面的坐标
      cubeColor:0xbebebe,
      cubeWidth:4,
      cubeHeight:2,
      cubeDeep:4,
      jumperColor:0x232323,
      jumperWidth:1,
      jumperHeight:2,
      jumperDeep:1,
    };
    this.scene=new THREE.Scene();
    this.camera=new THREE.OrthographicCamera(window.innerWidth/-50,window.innerWidth/50,window.innerHeight/50,window.innerHeight/-50,0,5000);
    this.renderer=new THREE.WebGLRenderer({antialias:true});
    this.size={width:window.innerWidth,height:window.innerHeight};
    this.cubes=[];
    this.cubeStat={nextDir:""};
    this.cameraPros={current:new THREE.Vector3(0,0,0),next:new THREE.Vector3()};

  };
  init(){
    this._setCamera();
    this._setRenderer();
    this._setLight();
    this._createCube();
    this._createCube();
    this._createJumper();
    this._updateCamera();
    this._handleWindowResize();
    window.addEventListener("resize",()=>{
      this._handleWindowResize();
    });
  };
  //设置相机位置
  _setCamera(){
    this.camera.position.set(100,100,100);//将相机固定在这 去改变相机的镜头
    this.camera.lookAt(this.cameraPros.current);
  };
  //设置渲染器
  _setRenderer(){
    this.renderer.setSize(this.size.width,this.size.height);
    this.renderer.setClearColor(this.config.background);
    document.body.appendChild(this.renderer.domElement);
  };
  //设置光照
  _setLight(){
    let directionalLight=new THREE.DirectionalLight(0xffffff,1.1);
    directionalLight.position.set(3,10,5);
    this.scene.add(directionalLight);
    let light=new THREE.AmbientLight(0xffffff,0.3);
    this.scene.add(light);
  };
  //创建方块
  _createCube(){
    let geometry=new THREE.CubeGeometry(this.config.cubeWidth,this.config.cubeHeight,this.config.cubeDeep);
    let material=new THREE.MeshLambertMaterial({color:this.config.cubeColor});
    let cube=new THREE.Mesh(geometry,material);
    if(this.cubes.length){
      this.cubeStat.nextDir=Math.random()>0.5?"left":"right";
      if(this.cubeStat.nextDir=="left"){
        //改变x的值
        cube.position.x=this.cubes[this.cubes.length-1].position.x-Math.round(Math.random()*4+6);
        cube.position.z=this.cubes[this.cubes.length-1].position.z;
        cube.position.y=0;
      }else {
        //改变z的值
        cube.position.z=this.cubes[this.cubes.length-1].position.z-Math.round(Math.random()*4+6);
        cube.position.x=this.cubes[this.cubes.length-1].position.x;
        cube.position.y=0;
      }
    }
    this.cubes.push(cube);
    this.scene.add(cube);
    if(this.cubes.length>1){
      //更新镜头的下一个位置坐标
      this._updateCameraPros();
    }
  };
  //创建跳块
  _createJumper(){};
  //渲染
  _render(){
    this.renderer.render(this.scene,this.camera);
  };
  //设置窗口大小
  _setSize(){
    this.size.width=window.innerWidth;
    this.size.height=window.innerHeight;
  };

  _handleWindowResize(){
    this._setSize();
    this.camera.left=this.size.width/-50;
    this.camera.right=this.size.width/50;
    this.camera.top=this.size.height/50;
    this.camera.bottom=this.size.height/-50;
    this.renderer.setSize(this.size.width,this.size.height);
    this._render();
  };

  _updateCameraPros(){
    //next:最后俩个块中间
    let lastIndex=this.cubes.length-1;
    //最后一个块的位置
    let pointA={
      x:this.cubes[lastIndex].position.x,
      z:this.cubes[lastIndex].position.z
    };
    //倒数第二个块的位置
    let pointB={
      x:this.cubes[lastIndex-1].position.x,
      z:this.cubes[lastIndex-1].position.z
    };
    this.cameraPros.next=new THREE.Vector3((pointA.x+pointB.x)/2,0,(pointA.z+pointB.z)/2)
  }

  //改变镜头位置
  _updateCamera(){
    let cur={
      x:this.cameraPros.current.x,
      z:this.cameraPros.current.z,
    };
    let next={
      x:this.cameraPros.next.x,
      z:this.cameraPros.next.z,
    }
    if(cur.x>next.x||cur.z>next.z){
      if(this.cubeStat.nextDir=="left"){
        this.cameraPros.current.x-=0.1;
      }else {
        this.cameraPros.current.z-=0.1;
      }
      this.camera.lookAt(new THREE.Vector3(this.cameraPros.current.x,0,this.cameraPros.current.z));
      this._render();
      requestAnimationFrame(()=>{
        this._updateCamera();
      })
    }
  }

  //创建jumper
  _createJumper(){
    let geometry=new THREE.CubeGeometry(this.config.jumperWidth,this.config.jumperHeight,this.config.jumperDeep);
    let material=new THREE.MeshLambertMaterial({color:this.config.jumperColor});
    this.jumper=new THREE.Mesh(geometry,material);
    this.jumper.position.y=2;
    this.scene.add(this.jumper);
  }

}