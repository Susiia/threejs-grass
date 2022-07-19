/*
 * @Descripttion: 
 * @version: 
 * @Author: 刘译蓬
 * @Date: 2022-07-15 22:48:10
 * @LastEditors: 刘译蓬
 * @LastEditTime: 2022-07-17 22:35:10
 */
import { Clock, DoubleSide, InstancedMesh, Mesh, Object3D, PlaneGeometry, Scene, ShaderMaterial, Vector3 } from "three"
import { MeshSurfaceSampler } from "three/examples/jsm/math/MeshSurfaceSampler"
export default class makeGrass {
  private scene:Scene
  private mesh:Mesh
  private leavesMaterial: ShaderMaterial
  private clock = new Clock
  private sampler!:MeshSurfaceSampler
  private grassesAmount!:number
  /**
   * @Descripttion: 
   * @Author: 刘译蓬
   * @msg: 
   * @param {Scene} scene // 场景
   * @param {Mesh} mesh // 需要生草的网格
   * @param {number} grassesAmount // 草数量
   * @return {*}
   */  
  constructor(scene:Scene,mesh:Mesh,grassesAmount:number,) {
    this.scene = scene
    this.mesh = mesh
    this.initSampler()
    this.leavesMaterial = this.initleavesMaterial()
    this.makegrasses(grassesAmount)
  }

  /**
   * @Descripttion:  初始化材质
   * @Author: 刘译蓬
   * @msg: 
   * @return {*}
   */  
  private initleavesMaterial() {
    const vertexShader = `
    varying vec2 vUv;
    uniform float time;
    
    // 噪波
    float N (vec2 st) {
      return fract( sin( dot( st.xy, vec2(12.9898,78.233 ) ) ) *  43758.5453123);
      }
      
      float smoothNoise( vec2 ip ){
          vec2 lv = fract( ip );
        vec2 id = floor( ip );
        
        lv = lv * lv * ( 3. - 2. * lv );
        
        float bl = N( id );
        float br = N( id + vec2( 1, 0 ));
        float b = mix( bl, br, lv.x );
        
        float tl = N( id + vec2( 0, 1 ));
        float tr = N( id + vec2( 1, 1 ));
        float t = mix( tl, tr, lv.x );
        
        return mix( b, t, lv.y );
      }
    
      void main() {
  
      vUv = uv;
      float t = time * 2.;
      
      // 顶点位置
      
      vec4 mvPosition = vec4( position, 1.0 );
      #ifdef USE_INSTANCING
          mvPosition = instanceMatrix * mvPosition;
      #endif
      
      // 移动
      
      float noise = smoothNoise(mvPosition.xz * 0.5 + vec2(0., t));
      noise = pow(noise * 0.5 + 0.5, 2.) * 2.;
      
      // 叶片顶部晃动力度.
      float dispPower = 1. - cos( uv.y * 3.1416 * 0.5 );
      
      float displacement = noise * ( 0.3 * dispPower );
      mvPosition.z -= displacement;
      
      //
      
      vec4 modelViewPosition = modelViewMatrix * mvPosition;
      gl_Position = projectionMatrix * modelViewPosition;
  
      }
     `;

    const fragmentShader = `
        varying vec2 vUv;
        void main() {
        vec3 baseColor = vec3( 0.41, 1.0, 0.5 );
        float clarity = ( vUv.y * 0.5 ) + 0.5;
        gl_FragColor = vec4( baseColor * clarity, 1 );
        }
    `;

    const uniforms = {
      time: {
        value: 0
      }
    }

    const leavesMaterial = new ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      side: DoubleSide
    });

    return leavesMaterial
  }

  /**
   * @Descripttion: 初始化网格表面取样器
   * @Author: 刘译蓬
   * @msg: 
   * @return {*}
   */  
  private initSampler(){
    this.sampler = new MeshSurfaceSampler(this.mesh)
    .setWeightAttribute(null)
    .build()
  }

  /**
   * @Descripttion: 初始化草
   * @Author: 刘译蓬
   * @msg: 
   * @return {*}
   */  
  private makegrasses(grassesAmount:number){
    const instanceNumber = grassesAmount;
    const dummy = new Object3D();
    const geometry = new PlaneGeometry( 0.1, 1, 1, 1 );
    geometry.translate( 0, 0.5, 0 ); // 吧草叶的最低点设置到0.
    const instancedMesh = new InstancedMesh( geometry, this.leavesMaterial, instanceNumber );
    this.scene.add(instancedMesh)
    const _position = new Vector3();
    const _normal = new Vector3();
    for ( let i=0 ; i<instanceNumber ; i++ ) {
      this.sampler.sample(_position,_normal)
      _normal.add(_position)
      dummy.position.set(
        _position.x,
        _position.y,
        _position.z
      )
      // dummy.lookAt( _normal );
    dummy.scale.setScalar( 0.2 + Math.random() * 0.6 );
    dummy.rotation.y = Math.random() * Math.PI;
    dummy.updateMatrix();
    instancedMesh.setMatrixAt( i, dummy.matrix );
  }
  }

  /**
   * @Descripttion: 草动画更新
   * @Author: 刘译蓬
   * @msg: 
   * @return {*}
   */  
  public update(){
    this.leavesMaterial.uniforms.time.value = this.clock.getElapsedTime();
    this.leavesMaterial.uniformsNeedUpdate = true;
  }
}