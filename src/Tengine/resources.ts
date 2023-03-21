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
    console.log(this.sources);
    for (const item of this.sources) {
      if (item.type === 'gltfModel') {
        this.loaders.gltfLoader.load(item.path, (file: any) => {
          this.sourceLoaded(item, file)
        })
      } else if (item.type === 'hdrTexture') {
        this.loaders.rgbeLoader.loadAsync(item.path).then((file: any) => {
          this.sourceLoaded(item, file)
        })
      } else if (item.type === 'texture') {
        this.loaders.textureLoader.load(item.path, (file: any) => {
          this.sourceLoaded(item, file)
        })
      } else if (item.type === 'audio') {
        this.loaders.audioLoader.load(item.path, (file: any) => {
          this.sourceLoaded(item, file)
        })
      }
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