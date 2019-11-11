import {OpenGLCanvas as Canvas} from "./opengl_canvas";
import {Camera} from "./Camera";
import { Renderer } from "./Renderer";
import { Model } from "./Model";
import { ExampleModels } from "./ModelData";
import { ShaderProgram } from "./ShaderProgram";
import { vsSource, fsSource } from "./Shaders";

/* zoom speed, as a scaling portion per mousewheel click
ie 0.20 = increase/decrease size by 20% each click */
const ZOOM_SPEED = 0.10;

/* Sensitivity of dragging the mouse to rotate the object.
    Probably has to be adjusted if the canvas size is changed,
    as this relates the pixels moved by the user mouse to the 
    model change itself. I found fractions close to 0 to be good.
    */
const ROTATE_SPEED = 0.005;

class ObjViewer {
    private canvas : Canvas;
    private camera : Camera;
    private renderer : Renderer;
    private shaderProgram : ShaderProgram;
    private model : Model;

    private drag = false;

    constructor() {
        let canvasElement = document.getElementById('glCanvas');
        this.canvas = new Canvas(canvasElement);

        this.camera = Camera.getDefaultCamera();
        this.camera.translate(0.5, 0.5, 0.0); //move the camera off-center a bit for better viewing

        this.shaderProgram = new ShaderProgram(this.canvas.gl, vsSource, fsSource);

        this.model = this.initModel();

        canvasElement.addEventListener("wheel", this.mouseZoom);
        canvasElement.addEventListener('mousemove', this.mouseMove);
        canvasElement.addEventListener('mousedown', this.mouseDown);
        canvasElement.addEventListener('mouseup', this.mouseUp);
        canvasElement.addEventListener('mouseleave', this.mouseUp);

        this.renderer = new Renderer(this.camera, this.canvas, this.model, this.shaderProgram);
        this.renderer.render();
    }

    initModel() {
        let model = new Model(ExampleModels.cube);
        model.load(this.canvas.gl);

        return model;
    }

    private mouseZoom = (event : Event) => {
        let wheelEvent = <WheelEvent> event;
        this.camera.zoom(wheelEvent.deltaY * ZOOM_SPEED);
        this.renderer.render();
    }

    private mouseMove = (event : Event) => {
        let mouseEvent = <MouseEvent> event;
        if (this.drag) {
            this.camera.rotate(mouseEvent.movementX * ROTATE_SPEED, 
                mouseEvent.movementY * ROTATE_SPEED, 
                0.0);
            this.renderer.render();
        }
    }

    private mouseDown = (event : Event) => {
        this.drag = true;
    }

    private mouseUp = (event : Event) => {
        this.drag = false;
    }

}

const main = new ObjViewer();