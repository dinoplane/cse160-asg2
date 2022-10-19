class Solid {
    constructor() {
      if (this.constructor == Solid) {
        throw new Error("Abstract classes can't be instantiated.");
      }
      this.buffer = gl.createBuffer();
      if (!this.buffer) {
        console.log('Failed to create the buffer object');
        return -1;
      }

      this.triangles = [];
      
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
        throw new Error("Method 'calculateVerts()' must be implemented.");
    }

    render(){
        throw new Error("Method 'render()' must be implemented.");
    }

    pushTriangle3D(vertices){
        this.triangles.push(...vertices);
    }

    drawTriangle3D(vertices) {
        var n = vertices.length/3; // The number of vertices
      
        // Bind the buffer object to target
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
        // Write date into the buffer object
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);
      
        // Assign the buffer object to a_Position variable
        gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
      
        // Enable the assignment to a_Position variable
        gl.enableVertexAttribArray(a_Position);
      
        gl.drawArrays(gl.TRIANGLES, 0, n);
    }
  }