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

    public rotate(x : number, y : number, z : number) {
        mat4.rotateX(this.modelView,
            this.modelView,
            x);
        mat4.rotateY(this.modelView,
            this.modelView,
            y);
        mat4.rotateZ(this.modelView,
            this.modelView,
            z);
        }

    public translate(x : number, y : number, z : number) {
        mat4.translate(this.modelView,
            this.modelView,
            [x, y, z]);
    }

    //4:3 aspect ratio camera, backed up 8 units
    static getDefaultCamera() {
        return new Camera(45 * Math.PI / 180,
            4.0 / 3.0,
            0.1,
            100.0, 
            0.0, //x
            0.0, //y
            -8.0); //z
    }
}