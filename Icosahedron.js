
const PHI = (1 + Math.sqrt(5)) / 2;

class Icosahedron extends Solid{
    constructor(color_=[1.0, 0.1, 1.0, 1.0], matrix_= new Matrix4(), pole=false){
        super();
        this.type='icosahedron';
        this.color = color_;
        this.s = 1.0;
        this.matrix = matrix_; 
        this.pole = pole;
        this.calculateVerts(pole); // You really only need to compute the vertices once!
    }

    calculateVerts(pole=false){
        let l = 0.5;
        let w = 1/(2*PHI);
        this.vertices = [];
        
        // generate the 12 vertices
        // First number the icosahedron's vertices based off of rectangle used
        // An algorithmic way to draw it entails having 4 layers of vertices: a apex, 2 layers of pentagons, and a bottom vertex
        // Draw the caps then middle layers.
        // An easy way is to number the vertices so that one layer is odd number from 2-10 and the other 3-11
        
        this.apex = [ 0,  l,  w]; // 1
        this.bott = [ 0, -l, -w]; // 2

        this.vertices.push([ 0,  l, -w]);    // 0    0
        this.vertices.push([ w,  0, -l]);    // 11   1
        this.vertices.push([ l, +w,  0]);    // 5    2
        this.vertices.push([ l, -w,  0]);    // 7    3
        this.vertices.push([ w,  0,  l]);    // 9    4
        this.vertices.push([ 0, -l,  w]);    // 3    5
        this.vertices.push([-w,  0,  l]);    // 8    6
        this.vertices.push([-l, -w,  0]);    // 6    7
        this.vertices.push([-l, +w,  0]);    // 4    8
        this.vertices.push([-w,  0, -l]);    // 10   9
        console.log(this.vertices);

        let a = Math.atan(w/l);
        let c = Math.cos(a);
        let s = Math.sin(a);
        
        let x = this.apex[1];
        let y = this.apex[2];
        this.apex[1] = x*c - y*s;
        this.apex[2] = x*s + y*c;

        x = this.bott[1];
        y = this.bott[2];
        this.bott[1] = x*c - y*s;
        this.bott[2] = x*s + y*c;

        for (let i = 0; i < this.vertices.length; i++){
             x = this.vertices[i][1];
             y = this.vertices[i][2]; 
             this.vertices[i][1] = x*c - y*s;
             this.vertices[i][2] = x*s + y*c;
        }
    }

    // Is there an algorithmic way of generating 20 triangles? A: yes

    render(){

        let c1 = this.color.slice();
        let c2 = [this.color[0]*2.2, this.color[1]*2.2, this.color[2]*2.2, this.color[3]]
        let c3 = [this.color[0]*3, this.color[1]*3, this.color[2]*3, this.color[3]]
        let c4 = [this.color[0]*0.8, this.color[1]*0.7, this.color[2]*0.7, this.color[3]]
        let c5 = [this.color[0]*0.5, this.color[1]*0.5, this.color[2]*0.5, this.color[3]]
        let tbc = [c1, c2, c3, c4, c5];

        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

        /*
        gl.uniform4f(u_FragColor, 1, 0, 0, 1);
        this.drawTriangle3D([
            ...this.vertices[0], 
            ...this.bott,
            ...this.apex
        ]);

        this.drawTriangle3D([
            ...this.bott,
            ...this.vertices[5],
            ...this.apex
        ]);

        gl.uniform4f(u_FragColor, 0, 0, 1, 1);
        this.drawTriangle3D([
            ...this.vertices[8],
            ...this.vertices[7], 
            ...this.vertices[2]
        ]);
        this.drawTriangle3D([
            ...this.vertices[7],
            ...this.vertices[3], 
            ...this.vertices[2]
        ]);

        gl.uniform4f(u_FragColor, 0, 1, 0, 1);
        this.drawTriangle3D([
            ...this.vertices[6],
            ...this.vertices[9], 
            ...this.vertices[4]
        ]);
        this.drawTriangle3D([
            ...this.vertices[9],
            ...this.vertices[1], 
            ...this.vertices[4]
        ]);*/
        let j = 0;
        for (let i = 0; i < 10; i+=2){
            gl.uniform4f(u_FragColor,   tbc[j % 5][0], 
                                        tbc[j % 5][1], 
                                        tbc[j % 5][2], 
                                        tbc[j % 5][3]);
            j++;
            this.drawTriangle3D([...this.apex, 
                ...this.vertices[i],
                ...this.vertices[(i+2) % 10]]); // top layer

            gl.uniform4f(u_FragColor, 
                tbc[j % 5][0], 
                tbc[j % 5][1], 
                tbc[j % 5][2], 
                tbc[j % 5][3]);
            j++;
            this.drawTriangle3D([...this.vertices[i],
                ...this.vertices[i+1],
                ...this.vertices[(i+2) % 10]]); // middle top lateral

            gl.uniform4f(u_FragColor, 
                tbc[j % 5][0], 
                tbc[j % 5][1], 
                tbc[j % 5][2], 
                tbc[j % 5][3]);
            j++;
            this.drawTriangle3D([...this.vertices[i+1],
                ...this.vertices[(i+3) % 10], 
                ...this.vertices[(i+2) % 10]]); // middle bot lateral

            gl.uniform4f(u_FragColor, 
                tbc[j % 5][0], 
                tbc[j % 5][1], 
                tbc[j % 5][2], 
                tbc[j % 5][3]);
            j++;
            this.drawTriangle3D([...this.vertices[i+1],
                ...this.bott,
                ...this.vertices[(i+3) % 10]]); // bot layer
        }     
    }
}