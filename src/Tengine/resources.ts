import EventEmitter from "@/utils/EvenEmitter";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'
import { TextureLoader, AudioLoader } from 'three'


export default class Resource extends EventEmitter {
  public loaders: any;
  public sources;
  public items: any;
  public loaded: number;
  public toLoad: number;
  constructor(sources: any[]) {
    super()
    this.sources = sources
    this.items = {}
    this.loaded = 0
    this.toLoad = sources.length
    this.setLoader()
    this.startLoading()
  }
  setLoader() {
    this.loaders = {}
    this.loaders.gltfLoader = new GLTFLoader()
    this.loaders.textureLoader = new TextureLoader()
    this.loaders.rgbeLoader = new RGBELoader()
    this.loaders.audioLoader = new AudioLoader()
  }
  startLoading() {
    const loader:any={
      'gltfModel':this.loaders.gltfLoader,
      'hdrTexture':this.loaders.rgbeLoader,
      'texture':this.loaders.textureLoader,
      'audio':this.loaders.audioLoader

    }
    const loadManager =(type:string,item:any)=>{
      return loader[type].load(item.path, (file: any) => {
        this.sourceLoaded(item, file)
      })
    }
    if (this.sources.length > 0) {
      for (const item of this.sources) {
        loadManager(item.type,item)
      }
    } else {
      setTimeout(() => {
        this.trigger('ready', null)
      }, 0)

    }
  }
  sourceLoaded(source: any, file: any) {
    this.items[source.name] = file
    this.loaded++
    if (this.loaded === this.toLoad) {
      this.trigger('ready', null)
    }
  }
}