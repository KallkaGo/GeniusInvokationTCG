import * as dat from 'dat.gui'

export default class Debug{
  public ui;
  public active;
  constructor(){
    this.active = window.location.hash === '#debug'
    if(this.active){
      this.ui = new dat.GUI()
    }
    
  }
}