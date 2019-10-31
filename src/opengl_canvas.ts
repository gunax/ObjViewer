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

    constructor(canvas : HTMLElement) {
        this.canvas = <HTMLCanvasElement>canvas;
        this.gl = this.canvas.getContext('webgl');
        this.prepare();
        this.shaderProgram = new ShaderProgram(this.gl, vsSource, fsSource);
        this.my_model = this.initModel();
        this.render(this.gl, this.my_model);
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

    render(gl: WebGLRenderingContext, model : Model) {
        gl.clearColor(0.3, 0.1, 0.1, 1.0);  // Clear to black, fully opaque
        gl.clearDepth(1.0);                 // Clear everything
        gl.enable(gl.DEPTH_TEST);           // Enable depth testing
        gl.depthFunc(gl.LEQUAL);            // Near things obscure far things

        // Clear the canvas before we start drawing on it.
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        let camera = Camera.getDefaultCamera();
        camera.translate(0.1, 0.5, 0.0); //move the camera off-center a bit for better viewing

        // Tell WebGL how to pull out the positions from the position
        // buffer into the vertexPosition attribute.
    {
            const numComponents = 3;  // pull out 2 values per iteration
            const type = gl.FLOAT;    // the data in the buffer is 32bit floats
            const normalize = false;  // don't normalize
            const stride = 0;         // how many bytes to get from one set of values to the next
            // 0 = use type and numComponents above
            const offset = 0;         // how many bytes inside the buffer to start from
            gl.bindBuffer(gl.ARRAY_BUFFER, model.Buffers.vertices);
            gl.vertexAttribPointer(
                this.shaderProgram.getProgramInfo().attribLocations.vertexPosition,
                numComponents,
                type,
                normalize,
                stride,
                offset);
            gl.enableVertexAttribArray(
                this.shaderProgram.getProgramInfo().attribLocations.vertexPosition);
        }

        // Tell WebGL to use our program when drawing
        gl.useProgram(this.shaderProgram.getProgram());

        // Set the shader uniforms

        gl.uniformMatrix4fv(
            this.shaderProgram.getProgramInfo().uniformLocations.projectionMatrix,
            false,
            camera.projection);
        gl.uniformMatrix4fv(
            this.shaderProgram.getProgramInfo().uniformLocations.modelViewMatrix,
            false,
            camera.modelView);

        {
            const offset = 0;
            const vertexCount = 36;
            const type = gl.UNSIGNED_SHORT;
            gl.drawElements(gl.LINE_STRIP, vertexCount, type, offset);
        }
    }
}  