class Jester {
    constructor(){
        this.body = []
        this.createBody();
    }

    createBody(){
        let M_abdomen = new Matrix4();
        let M_torso = new Matrix4(M_abdomen);
        M_abdomen.scale(0.5, 0.5, 0.5);
        let abdomen = new Icosahedron([1, 0, 1, 1], M_abdomen, true);
        this.body["abdomen"] = abdomen;

      
        M_torso.translate(0, -0.4, 0);
        let M_lchest = new Matrix4(M_torso);
        M_torso.scale(0.5, 0.5, 0.5);

        let torso = new Prism(10, 1.0, [1, 0, 1, 1], M_torso);
        torso.setMaxWidth(1);
        torso.scaleFace("b", 2);
        this.body["torso"] = torso;
        
        torso.setHeight(1.7);
        // //p3.render();
      
      
        // M_lchest.translate(0, 0.9, 0);
        // M_lchest.rotate(45, 0, 0, 1);
      
        let M_uchest = new Matrix4(M_lchest);
      
        // M_lchest.scale(0.5, -0.5, 0.5);
        // this.body.push(M_lchest);
        //let  = new Pyramid(10, 1.0, [1, 0, 1, 1], M_lchest);
        // p4.setMaxWidth(1);
        // p4.scaleFace(1.2);
        // //p4.render();
        
      
        M_uchest.translate(0, 0.6, 0);
        let M_head = new Matrix4(M_uchest);
      
        M_uchest.scale(0.5, 0.4, 0.5);
        let uchest = new Prism(10, 1.0, [1, 0, 1, 1], M_uchest);
        uchest.setMaxWidth(1);
        uchest.scaleFace("b", 1.4);
        uchest.scaleFace("t", 0.8);
        this.body["uchest"] = uchest;
        //p5.setHeight();
        //p5.render();      

        // Head
        M_head.scale(0.5, 0.5, 0.5);
        let head = new Cube([1, 0, 1, 1], M_head);
        this.body["head"] = head;
    
        // Right Leg joint
        // Right Thigh
        // Right Calf
        // Right Foot
        
        // Left Leg joint
        // Left Thigh
        // Left Calf
        // Left Foot
        



        // Right Arm joint
        // 
        // Left Arm joint


    }

    render(){
        for (let part in this.body){
            this.body[part].render();
        }
    }


}