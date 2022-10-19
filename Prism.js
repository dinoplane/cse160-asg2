class Prism extends Solid{
    constructor( numV_=4, h_=1.0, color_=[1.0, 1.0, 1.0, 1.0], matrix_= new Matrix4()){
        super();
        this.type='prism';
        this.color = color_;
        this.r = 1.0;
        this.matrix = matrix_; 
        this.numV = numV_
        this.cangle=360/numV_;
        this.h = h_;
        this.topface = [];
        this.botface = [];
        
        this.calculateVerts(); // You really only need to compute the vertices once!
    }

    scaleFace(mode="b", scale){
        var face = (mode == 't')? this.topface : this.botface;
        //console.log(face);
        face.forEach(function(item, index, array){
            array[index][0] *= scale;
            array[index][1] *= scale;
        })
        //console.log(face);
    }

    translateFace(mode="b", x, z){
        var face = (mode == "t") ? this.topface : this.botface; 
        face.forEach(function(item, index, array){
            array[index][0] += x;
            array[index][1] += z;
        })
    }

    calculateVerts(){
        this.vertices = [];
        this.topface=[];
        this.botface=[];
        // Calculate regular polygon
        
        let startAng = -(180-this.cangle)/2;
        for (let currAngle = -startAng; currAngle < 360-startAng; currAngle += this.cangle){
            // let nextAngle = currAngle+angleStep;
            this.topface.push([Math.cos(currAngle*Math.PI/180)*this.r, 
                        Math.sin(currAngle*Math.PI/180)*this.r]); // currently their squares add up to r!
            this.botface.push([Math.cos(currAngle*Math.PI/180)*this.r, 
                        Math.sin(currAngle*Math.PI/180)*this.r]);
        }
    }

    setMaxWidth(w){
        this.r = w/2; // guaranteed
        this.calculateVerts();
    }

    setSideLength(s){
        this.r = (0.5*s)/Math.sin(this.cangle*Math.PI/360);
        this.calculateVerts();
    }

    setHeight(h_){
        this.h = h_;
    }

    render(){
        var rgba = this.color;
        var v = this.numV;
        // generates a kind of fan...
        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
        
        let f = this.h/2;
        console.log(this.topface);

        // Draw lateral faces

        for (let i = 0; i < this.numV; i++){
            
            rgba.forEach(function(item, index, array){
                array[index] = lerp(i, 0, v, rgba[index]*0.7, rgba[index]);
            })
            gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

            this.drawTriangle3D([this.botface[i][0],     -f, this.botface[i][1], 
                            this.topface[(i+1)%this.numV][0],    f, this.topface[(i+1)%this.numV][1],
                            this.topface[i][0],      f, this.topface[i][1]]); // top lateral

            this.drawTriangle3D([this.botface[i][0],     -f, this.botface[i][1], 
                            this.botface[(i+1)%this.numV][0],   -f, this.botface[(i+1)%this.numV][1],
                            this.topface[(i+1)%this.numV][0],    f, this.topface[(i+1)%this.numV][1]]); // bot lateral


        }

        rgba.forEach(function(item, index, array){
            array[index] = 0.7*item;
        })

        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

        // Draw top face
        for (let i = 1; i <= this.numV - 2; i++){
            this.drawTriangle3D([this.topface[i][0],     f, this.topface[i][1], 
                            this.topface[i+1][0],   f, this.topface[i+1][1],
                            this.topface[0][0],     f, this.topface[0][1]]);
        }

        rgba.forEach(function(item, index, array){
            array[index] = 0.7*item;
        })

        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

        // Draw bottom face
        for (let i = 1; i <= this.numV - 2; i++){
            this.drawTriangle3D([this.botface[i][0],     -f, this.botface[i][1], 
                            this.botface[i+1][0],   -f, this.botface[i+1][1],
                            this.botface[0][0],     -f, this.botface[0][1]]);
        }
    }
}


function lerp(x, a, b, v, w){ // x is a value between a & b, v & w are corresp. weights to a & b, resp.
    if (a > b) return lerp(x, b, a, w, v);
    let f = (x-a)/(b-a); // Find fraction x has made from a to b
    return v + f * (w - v); // use that fraction to find the associated value for x
}