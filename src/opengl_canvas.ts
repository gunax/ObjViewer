import { vsSource, fsSource } from "./Shaders";
import {ShaderProgram, ProgramInfo} from "./ShaderProgram";
import { mat4 } from "./gl-matrix";
import { Model } from "./Model";
import {ExampleModels} from "./ModelData";
import { Camera } from "./Camera";

export class OpenGLCanvas {
    canvas: HTMLCanvasElement;
    gl: WebGLRenderingContext;
    shaderProgram : ShaderProgram;
    my_model : Model;
    camera : Camera;

    constructor(canvas : HTMLElement) {
        this.canvas = <HTMLCanvasElement>canvas;
        this.camera = Camera.getDefaultCamera();
        this.camera.translate(0.1, 0.5, 0.0); //move the camera off-center a bit for better viewing
        this.canvas.addEventListener("wheel", this.zoom);
        this.gl = this.canvas.getContext('webgl');
        this.prepare();
        this.shaderProgram = new ShaderProgram(this.gl, vsSource, fsSource);
        this.my_model = this.initModel();
        this.render();
    }

    public zoom = (event : Event) => {
        let wheelEvent = <WheelEvent> event;
        this.camera.translate(0.0, 0.0, wheelEvent.deltaY*0.2);
        this.render();
    }

    prepare() {
        if (this.gl === null) {
            document.body.textContent = 'WebGL is not avaiulable';
        }
    }

    initModel() {
        let model = new Model(ExampleModels.cube);
        model.load(this.gl);

        return model;
    }

    render() {
        this.gl.clearColor(0.3, 0.1, 0.1, 1.0);  // Clear to black, fully opaque
        this.gl.clearDepth(1.0);                 // Clear everything
        this.gl.enable(this.gl.DEPTH_TEST);           // Enable depth testing
        this.gl.depthFunc(this.gl.LEQUAL);            // Near things obscure far things

        // Clear the canvas before we start drawing on it.
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

        // Tell WebGL how to pull out the positions from the position
        // buffer into the vertexPosition attribute.
    {
            const numComponents = 3;  // pull out 2 values per iteration
            const type = this.gl.FLOAT;    // the data in the buffer is 32bit floats
            const normalize = false;  // don't normalize
            const stride = 0;         // how many bytes to get from one set of values to the next
            // 0 = use type and numComponents above
            const offset = 0;         // how many bytes inside the buffer to start from
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.my_model.Buffers.vertices);
            this.gl.vertexAttribPointer(
                this.shaderProgram.getProgramInfo().attribLocations.vertexPosition,
                numComponents,
                type,
                normalize,
                stride,
                offset);
            this.gl.enableVertexAttribArray(
                this.shaderProgram.getProgramInfo().attribLocations.vertexPosition);
        }

        // Tell WebGL to use our program when drawing
        this.gl.useProgram(this.shaderProgram.getProgram());

        // Set the shader uniforms

        this.gl.uniformMatrix4fv(
            this.shaderProgram.getProgramInfo().uniformLocations.projectionMatrix,
            false,
            this.camera.projection);
        this.gl.uniformMatrix4fv(
            this.shaderProgram.getProgramInfo().uniformLocations.modelViewMatrix,
            false,
            this.camera.modelView);

        {
            const offset = 0;
            const vertexCount = 36;
            const type = this.gl.UNSIGNED_SHORT;
            this.gl.drawElements(this.gl.LINE_STRIP, vertexCount, type, offset);
        }
    }
}  