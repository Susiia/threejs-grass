/*
 * @Descripttion:
 * @version:
 * @Author: 刘译蓬
 * @Date: 2022-05-26 16:29:25
 * @LastEditors: 刘译蓬
 * @LastEditTime: 2022-07-19 20:51:49
 */
import { Color, EquirectangularReflectionMapping, Mesh, PerspectiveCamera, Scene, TextureLoader, Vector3, WebGLRenderer } from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import { CollisionController } from './octreeCollision'
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import makeGrass from './makeGrass'
export default class ThreeAssets {
    private canvas!:HTMLCanvasElement // canvas
    private renderer!:WebGLRenderer // renderer
    private scene!:Scene // Scene
    private camera!:PerspectiveCamera // camera
    private controls!:CollisionController // 控制器
    private grasses!:makeGrass
    constructor (canvas:HTMLCanvasElement|null) {
      if (canvas) {
        this.canvas = canvas
        this.initThree()
        this.defaultCamera()
        this.defaultLight()
        this.modelLoader('/model/untitled.glb')
        // TODO: 后处理
        // TODO: 粒子
        // TODO: 设备朝向相机
      }
    }

    // 初始化three渲染器和场景
    private initThree () {
      this.renderer = new WebGLRenderer({
        canvas: this.canvas,
        antialias: true
      })
      this.renderer.setSize(window.innerWidth, window.innerHeight)
      this.renderer.setClearColor(new Color(0xbff8ff))
      this.scene = new Scene()
      this.renderer.setAnimationLoop(() => { this.renderLoop() })
      window.addEventListener('resize', () => { this.onWindowResize() })
    }

    // 渲染循环
    private renderLoop () {
      this.renderer.render(this.scene, this.camera)
      this.grasses?.update()
      this.controls?.update()
    }

    // resize
    private onWindowResize () {
      this.renderer.setSize(window.innerWidth, window.innerHeight)
      this.camera.aspect = this.canvas.clientWidth / this.canvas.clientHeight
      this.camera.updateProjectionMatrix()
    }

    // 默认相机
    private defaultCamera () {
      this.camera = new PerspectiveCamera(75, this.canvas.clientWidth / this.canvas.clientHeight, 0.1, 1000)
    }

    // 默认灯光
    private defaultLight () {
      // const light = new HemisphereLight(0xffffff, 0xcccccc, 1)
      const env = new TextureLoader().load('img/Sky_Mirrored_02.jpg')
      env.mapping = EquirectangularReflectionMapping
      this.scene.environment = env
      // this.scene.add(light)
    }

    // 默认控制器
    private defaultControls () {
      this.controls = new CollisionController(
        this.camera,
        this.renderer.domElement,
        {
          start: new Vector3(0, 0.35, 0),
          end: new Vector3(0, 1, 0),
          radius: 0.35
        },
        this.scene.children[this.scene.children.length - 1],
        new Vector3(0,10,0)
      )
      this.controls.update()
    }

    // 模型加载
    private modelLoader (path:string) {
      const loader = new GLTFLoader()
      const dracoLoader = new DRACOLoader()
      dracoLoader.setDecoderPath('/lib/draco/')
      loader.setDRACOLoader(dracoLoader)
      loader.load(
        path,
        model => {
          this.modelTreatment(model)
          this.scene.add(model.scene)
          console.log(this.scene);
          this.defaultControls()
        },
        process => {
          console.log('loading')
        },
        errorInfo => {
          console.log(errorInfo)
        }

      )
    }

    // 模型处理
    private modelTreatment(model:GLTF){
      if(model.scene.getObjectByName('平面')){
        this.grasses = new makeGrass(this.scene,model.scene.getObjectByName('平面') as Mesh,250000)
      }
    }
}
