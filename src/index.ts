import {OpenGLCanvas as Canvas} from "./opengl_canvas";
import {Camera} from "./Camera";
import { Renderer } from "./Renderer";
import { Model } from "./Model";
import { ExampleModels } from "./ModelData";
import { ShaderProgram } from "./ShaderProgram";
import { vsSource, fsSource } from "./Shaders"; 
import "./assets/style.css";

/* zoom speed, as a scaling portion per mousewheel click
ie 0.20 = increase/decrease size by 20% each click.
Keep 0.0 < ZOOM_SPEED < 1.0 */
const ZOOM_SPEED = 0.10;

/* Sensitivity of dragging the mouse to rotate the object.
Probably has to be adjusted if the canvas size is changed,
as this relates the pixels moved by the user mouse to the 
model change itself. I found fractions close to 0 to be good. */
const ROTATE_SPEED = 0.005;

class ObjViewer {
    private canvas : Canvas;
    private camera : Camera;
    private renderer : Renderer;
    private shaderProgram : ShaderProgram;
    private model : Model;

    /* There is not a native drag listener, so instead we have to combine 
    the mouse move & mouse down/up events. Whenever the mouse goes down, 
    this boolean should be set to true. Then when mouse is moved, we can check
    if we are currently dragging based on this boolean. Should be reset to false
    whenever the mouse goes back up or we leave the screen.*/
    private drag = false;

    constructor() {
        let canvasElement = document.getElementById('glCanvas');
        let resetButton = document.getElementById('resetCamera');
        this.canvas = new Canvas(canvasElement);
        this.camera = this.createCamera();

        this.shaderProgram = new ShaderProgram(this.canvas.gl, vsSource, fsSource);

        this.model = this.initModel();

        canvasElement.addEventListener("wheel", this.mouseZoom);
        canvasElement.addEventListener('mousemove', this.mouseMove);
        canvasElement.addEventListener('mousedown', this.mouseDown);
        canvasElement.addEventListener('mouseup', this.mouseUp);
        canvasElement.addEventListener('mouseleave', this.mouseUp);

        resetButton.addEventListener('click', this.reset);

        this.renderer = new Renderer(this.camera, this.canvas, this.model, this.shaderProgram);
        this.renderer.render();
    }

    initModel() {
        let model = new Model(ExampleModels.cube);
        model.load(this.canvas.gl);

        return model;
    }

    private reset = () => {
        this.camera = this.createCamera();
        this.renderer = new Renderer(this.camera, this.canvas, this.model, this.shaderProgram);
        this.renderer.render();
    }

    private createCamera = () => {
        const camera = Camera.getDefaultCamera();
        camera.translate(0.5, 0.5, 0.0); //move the camera off-center a bit for better viewing

        return camera;
    }

    private mouseZoom = (event : Event) => {
        let wheelEvent = <WheelEvent> event;

        /* The zoom function needs to take in a scale ratio (eg. scale to 80%)
        but since the wheelEvent works on positive/negative
        values, we have to do a bit of conversion.
        For now I am just zooming by ZOOM_SPEED whether the wheel went
        in or out. At some point we may want to actually use the deltaY value
        as this would actually take the user's wheel sensitivity into account */

        if (wheelEvent.deltaY > 0.0) {
            this.camera.zoom(1.0 + ZOOM_SPEED);
        }
        else {
            this.camera.zoom(1.0 - ZOOM_SPEED);
        }
        
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