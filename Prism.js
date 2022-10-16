class Prism{
    constructor( numV_=4, h_=1.0, color_=[1.0, 1.0, 1.0, 1.0], matrix_= new Matrix4()){
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

    setMatrix(matrix_){
        this.matrix = matrix_;
    }

    translate(...a){
        this.matrix.translate(...a);
    }

    scale(...a){
        this.matrix.scale(...a);
    }

    rotate(...a){
        this.matrix.rotate(...a);
    }

    calculateVerts(){
        this.vertices = [];

        // Calculate regular polygon
        let facepts = [];
        
        let startAng = -(180-this.cangle)/2;
        for (let currAngle = -startAng; currAngle < 360-startAng; currAngle += this.cangle){
            
            // let nextAngle = currAngle+angleStep;
            let vec1 = [Math.cos(currAngle*Math.PI/180)*this.r, 
                        Math.sin(currAngle*Math.PI/180)*this.r]; // currently their squares add up to r!

            facepts.push(vec1);

            
            // let vec2 = [Math.cos(nextAngle*Math.PI/180)*s*Math.sqrt(2), Math.sin(nextAngle*Math.PI/180)*s*Math.sqrt(2)];
            
            // console.log(vec1, vec2)
            
            // rgba.forEach(function(item, index, array){
            //     array[index] = 0.7*item;
            // })

            // gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

            // drawTriangle3D([vec1[0], -s, vec1[1],      vec2[0],   s, vec2[1],        vec2[0], -s, vec2[1]]);
            // drawTriangle3D([vec1[0], -s, vec1[1],      vec1[0],   s, vec1[1],        vec2[0],   s, vec2[1]]);
            // //drawTriangle3D([-s, -s, -s,        s,   s, -s,        s, -s, -s]);

        }


        console.log(facepts);
        this.topface = this.botface = facepts;
        // Draw top and bottom
    }

    setMaxWidth(w){
        this.r = w/2; // guaranteed
        this.calculateVerts();
    }

    setSideLength(s){
        console.log(this.cangle);
        this.r = (0.5*s)/Math.sin(this.cangle*Math.PI/360);
        console.log(this.r);
        this.calculateVerts();
    }

    setHeight(h_){
        this.h = h_;
    }

    render(){
        var rgba = this.color;
        // generates a kind of fan...
        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
        
        let f = this.h/2;
        console.log(this.topface);
        // Draw lateral faces
        for (let i = 0; i < this.numV; i++){
            drawTriangle3D([this.botface[i][0],     -f, this.botface[i][1], 
                            this.topface[(i+1)%this.numV][0],    f, this.topface[(i+1)%this.numV][1],
                            this.topface[i][0],      f, this.topface[i][1]]); // top lateral

            drawTriangle3D([this.botface[i][0],     -f, this.botface[i][1], 
                            this.botface[(i+1)%this.numV][0],   -f, this.botface[(i+1)%this.numV][1],
                            this.topface[(i+1)%this.numV][0],    f, this.topface[(i+1)%this.numV][1]]); // bot lateral


        }

        rgba.forEach(function(item, index, array){
            array[index] = 0.7*item;
        })

        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

        // Draw top face
        for (let i = 1; i <= this.numV - 2; i++){
            drawTriangle3D([this.topface[i][0],     f, this.topface[i][1], 
                            this.topface[i+1][0],   f, this.topface[i+1][1],
                            this.topface[0][0],     f, this.topface[0][1]]);
        }

        rgba.forEach(function(item, index, array){
            array[index] = 0.7*item;
        })

        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

        // Draw bottom face
        for (let i = 1; i <= this.numV - 2; i++){
            drawTriangle3D([this.botface[i][0],     -f, this.botface[i][1], 
                            this.botface[i+1][0],   -f, this.botface[i+1][1],
                            this.botface[0][0],     -f, this.botface[0][1]]);
        }
    }
/*
    render(){
        var rgba = this.color;
        var s = this.size/2;

        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements)

        let angleStep = 90;
        for (let currAngle = -135; currAngle < 180; currAngle += angleStep){
            let nextAngle = currAngle+angleStep;
            let vec1 = [Math.cos(currAngle*Math.PI/180)*s*Math.sqrt(2), Math.sin(currAngle*Math.PI/180)*s*Math.sqrt(2)];
            let vec2 = [Math.cos(nextAngle*Math.PI/180)*s*Math.sqrt(2), Math.sin(nextAngle*Math.PI/180)*s*Math.sqrt(2)];
            
            console.log(vec1, vec2)
            
            rgba.forEach(function(item, index, array){
                array[index] = 0.7*item;
            })

            gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

            drawTriangle3D([vec1[0], -s, vec1[1],      vec2[0],   s, vec2[1],        vec2[0], -s, vec2[1]]);
            drawTriangle3D([vec1[0], -s, vec1[1],      vec1[0],   s, vec1[1],        vec2[0],   s, vec2[1]]);
            //drawTriangle3D([-s, -s, -s,        s,   s, -s,        s, -s, -s]);

        }

        // gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
        // drawTriangle3D([-s, -s, -s,        s,   s, -s,        s, -s, -s]);
        // drawTriangle3D([-s, -s, -s,      -s,   s, -s,        s,   s, -s]);

        // gl.uniform4f(u_FragColor, rgba[0]*0.5, rgba[1], rgba[2]*0.5, rgba[3]);
        // drawTriangle3D([-s, -s,   s,      -s,   s, -s,      -s, -s, -s]);
        // drawTriangle3D([-s, -s,   s,      -s,   s,   s,      -s,   s, -s]);

        // gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
        // drawTriangle3D([  s, -s,   s,      -s,   s,   s,      -s, -s,   s]);
        // drawTriangle3D([  s, -s,   s,        s,   s,   s,      -s,   s,   s]);

        // gl.uniform4f(u_FragColor, rgba[0]*0.5, rgba[1], rgba[2]*0.5, rgba[3]);
        // drawTriangle3D([  s, -s, -s,        s,   s,   s,       s,  -s,   s]);
        // drawTriangle3D([  s, -s, -s,        s,   s, -s,       s,    s,   s]);

        // gl.uniform4f(u_FragColor, rgba[0]*0.2, rgba[1]*0.2, rgba[2]*0.2, rgba[3]);
        // drawTriangle3D([-s,   s,  -s,        s,   s,   s,       s,    s, -s]);
        // drawTriangle3D([-s,   s, -s,      -s,   s,   s,       s,    s,   s]);

        // gl.uniform4f(u_FragColor, rgba[0]*0.2, rgba[1]*0.2, rgba[2]*0.2, rgba[3]);
        // drawTriangle3D([-s, -s,   s,        s, -s, -s,       s,  -s,   s]);
        // drawTriangle3D([-s, -s,   s,      -s, -s, -s,       s,  -s, -s]);
    }*/
}
