import {OpenGLCanvas as Canvas} from "./opengl_canvas";
import {Camera} from "./Camera";
import { Renderer } from "./Renderer";
import { Model } from "./Model";
import { ExampleModels } from "./ModelData";
import { ShaderProgram } from "./ShaderProgram";
import { vsSource, fsSource } from "./Shaders";

class ObjViewer {
    private canvas : Canvas;
    private camera : Camera;
    private renderer : Renderer;
    private shaderProgram : ShaderProgram;
    private model : Model;

    constructor() {
        let canvasElement = document.getElementById('glCanvas');
        this.canvas = new Canvas(canvasElement);

        this.camera = Camera.getDefaultCamera();
        this.camera.translate(0.5, 0.5, 0.0); //move the camera off-center a bit for better viewing

        this.shaderProgram = new ShaderProgram(this.canvas.gl, vsSource, fsSource);

        this.model = this.initModel();

        canvasElement.addEventListener("wheel", this.zoom);

        this.renderer = new Renderer(this.camera, this.canvas, this.model, this.shaderProgram);
        this.renderer.render();
    }

    initModel() {
        let model = new Model(ExampleModels.cube);
        model.load(this.canvas.gl);

        return model;
    }

    private zoom = (event : Event) => {
        let wheelEvent = <WheelEvent> event;
        this.camera.translate(0.0, 0.0, wheelEvent.deltaY*0.2);
        this.renderer.render();
    }

}

const main = new ObjViewer();