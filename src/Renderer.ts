import { Camera } from "./Camera";
import { OpenGLCanvas as Canvas } from "./opengl_canvas";
import { Model } from "./Model";
import { ShaderProgram } from "./ShaderProgram";

export class Renderer {
    constructor(private camera : Camera, 
        private canvas : Canvas,
        private model : Model,
        private program : ShaderProgram) {}

    render() {
        let gl = this.canvas.gl;
        gl.clearColor(0.3, 0.1, 0.1, 1.0);  // Clear to black, fully opaque

        gl.clearDepth(1.0);                 // Clear everything
        gl.enable(gl.DEPTH_TEST);           // Enable depth testing
        gl.depthFunc(gl.LEQUAL);            // Near things obscure far things

        // Clear the canvas before we start drawing on it.
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        // Tell WebGL how to pull out the positions from the position
        // buffer into the vertexPosition attribute.
    
            const numComponents = 3;  // pull out 2 values per iteration
            const type = gl.FLOAT;    // the data in the buffer is 32bit floats
            const normalize = false;  // don't normalize
            const stride = 0;         // how many bytes to get from one set of values to the next
            // 0 = use type and numComponents above
            const offset = 0;         // how many bytes inside the buffer to start from
            gl.bindBuffer(gl.ARRAY_BUFFER, this.model.Buffers.vertices);
            gl.vertexAttribPointer(
                this.program.getProgramInfo().attribLocations.vertexPosition,
                numComponents,
                type,
                normalize, 
                stride,
                offset);
            gl.enableVertexAttribArray(
                this.program.getProgramInfo().attribLocations.vertexPosition);
        

        // Tell WebGL to use our program when drawing
        gl.useProgram(this.program.getProgram());

        // Set the shader uniforms

        gl.uniformMatrix4fv(
            this.program.getProgramInfo().uniformLocations.projectionMatrix,
            false,
            this.camera.projection);
        gl.uniformMatrix4fv(
            this.program.getProgramInfo().uniformLocations.modelViewMatrix,
            false,
            this.camera.modelView);

        {
            const offset = 0;
            const vertexCount = 36;
            const type = gl.UNSIGNED_SHORT;
            gl.drawElements(gl.LINE_STRIP, vertexCount, type, offset);
        }
    }
}