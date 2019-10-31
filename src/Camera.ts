import {mat4} from "./gl-matrix";

export class Camera {
    readonly projection : any;
    readonly modelView : any;

    constructor(fieldOfView : number, aspect : number, zNear : number, zFar : number, 
        xTrans : number, yTrans : number, zTrans : number) {

        this.projection = mat4.create();

        mat4.perspective(this.projection, //destination matrix
            fieldOfView,
            aspect,
            zNear,
            zFar);


        this.modelView = mat4.create();

        mat4.translate(this.modelView,     // destination matrix
            this.modelView,     // matrix to translate
            [xTrans, yTrans, zTrans]);  // amount to translate
    }

    public translate(x : number, y : number, z : number) {
        mat4.translate(this.modelView,
            this.modelView,
            [x, y, z]);
    }
}