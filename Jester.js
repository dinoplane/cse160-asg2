class Jester {
    constructor(){
  
        this.createBody();
        this.transformBody();

    }

    createBody(){
        this.body = {}
        this.rotations = {};
        this.body["abdomen"] = new Pyramid(10, 1,[1, 0, 1, 1]);
        console.log(this.rotations);
        console.log(this.body["abdomen"]);


        this.body["pelvis"] = new Prism(10, 1.0, [1, 0, 1, 1]);
        this.body["pelvis"].setMaxWidth(1);
        this.body["pelvis"].scaleFace("b", 2);
        this.body["pelvis"].setHeight(1.7); // YEEE
        

        this.body["uchest"] = new Prism(10, 1.0, [1, 0, 1, 1]);
        this.body["uchest"].setMaxWidth(1);
        this.body["uchest"].scaleFace("b", 1.3);
        this.body["uchest"].scaleFace("t", 0.8);
        //p5.setHeight();
        //p5.render();      

        // Head

        this.body["head"] = new Cube([1, 0, 1, 1]);
    
        // Right Leg joint

        // Legs

        // Thighs
        const THIGH_LENGTH = 0.7
        this.body["rthigh"] = new Prism(10, THIGH_LENGTH, [1, 1, 1, 1]);
        this.body["rthigh"].setMaxWidth(1);
        this.body["rthigh"].scaleFace("t", 0.4);
        this.body["rthigh"].scaleFace("b", 0.25);

        this.body["lthigh"] = new Prism(10, THIGH_LENGTH, [1, 1, 1, 1]);
        this.body["lthigh"].setMaxWidth(1);
        this.body["lthigh"].scaleFace("t", 0.4);
        this.body["lthigh"].scaleFace("b", 0.25);

        // Knees?
        this.body["rknee"] = new Icosahedron([1, 1, 1, 1], new Matrix4(), true);
        this.body["lknee"] = new Icosahedron([1, 1, 1, 1], new Matrix4(), true);

        // Calves
        this.body["rcalf"] = new Prism(10, 0.8, [1, 1, 0, 1]);
        this.body["rcalf"].setMaxWidth(1);
        this.body["rcalf"].scaleFace("t", 0.4);
        this.body["rcalf"].scaleFace("b", 0.25);
        this.body["lcalf"] = new Prism(10, 0.8, [1, 1, 0, 1]);
        this.body["lcalf"].setMaxWidth(1);
        this.body["lcalf"].scaleFace("t", 0.4);
        this.body["lcalf"].scaleFace("b", 0.25);
    
        // Foot Joint
        this.body["rfjoint"] = new Prism(10, 0.2, [1, 0, 0, 1]);
        this.body["rfjoint"].setMaxWidth(0.2);
        this.body["lfjoint"] = new Prism(10, 0.2, [1, 0, 0, 1]);
        this.body["lfjoint"].setMaxWidth(0.2);

        // Feet
        this.body["rfoot"] = new Prism(4, 0.2, [0.5, 0.5, 0.5, 1]);
        this.body["rfoot"].setMaxWidth(1);
        this.body["lfoot"] = new Prism(4, 0.2, [0.5, 0.5, 0.5, 1]);
        this.body["lfoot"].setMaxWidth(1);

        // Arms
        const ARM_LENGTH = 0.5
        this.body["ruparm"] = new Prism(10, ARM_LENGTH, [1, 1, 1, 1]);
        this.body["ruparm"].setMaxWidth(1);
        this.body["ruparm"].scaleFace("t", 0.3);
        this.body["ruparm"].scaleFace("b", 0.25);
        this.body["luparm"] = new Prism(10, ARM_LENGTH, [1, 1, 1, 1]);
        this.body["luparm"].setMaxWidth(1);
        this.body["luparm"].scaleFace("t", 0.3);
        this.body["luparm"].scaleFace("b", 0.25);

        // // Elbows
        this.body["relbow"] = new Icosahedron([1, 1, 1, 1], new Matrix4(), true);
        this.body["lelbow"] = new Icosahedron([1, 1, 1, 1], new Matrix4(), true);

        // // Calves
        this.body["rfoarm"] = new Prism(10, 0.5, [1, 1, 0, 1]);
        this.body["rfoarm"].setMaxWidth(1);
        this.body["rfoarm"].scaleFace("t", 0.25);
        this.body["rfoarm"].scaleFace("b", 0.2);
        this.body["lfoarm"] = new Prism(10, 0.5, [1, 1, 0, 1]);
        this.body["lfoarm"].setMaxWidth(1);
        this.body["lfoarm"].scaleFace("t", 0.25);
        this.body["lfoarm"].scaleFace("b", 0.2);
    
        // // Foot Joint
        this.body["rwrist"] = new Prism(10, 0.2, [1, 0, 0, 1]);
        this.body["rwrist"].setMaxWidth(0.2);
        this.body["lwrist"] = new Prism(10, 0.2, [1, 0, 0, 1]);
        this.body["lwrist"].setMaxWidth(0.2);

        // // Feet
        this.body["rhand"] = new Prism(4, 0.2, [0.5, 0.5, 0.5, 1]);
        this.body["rhand"].setMaxWidth(1);
        this.body["lhand"] = new Prism(4, 0.2, [0.5, 0.5, 0.5, 1]);
        this.body["lhand"].setMaxWidth(1);


        // Upper Arms
        // Elbows?
        // Forarms
        // Hands

        
        // Left Leg joint
        // Left Thigh
        // Left Calf
        // Left Foot
        console.log(this.rotations);
        console.log(this.body);


        for(let n in this.body){
            this.rotations[n] = {
                                isRotated: false,
                                "X": 0, 
                                "Y": 0,
                                "Z": 0,
                            }
        }





        // Right Arm joint
        // 
        // Left Arm joint


    }

    checkRotation(part, matrix){
        if (this.rotations[part].isRotated){
            matrix.rotate(this.rotations[part]["X"], 1, 0, 0);
            matrix.rotate(this.rotations[part]["Y"], 0, 1, 0);
            matrix.rotate(this.rotations[part]["Z"], 0, 0, 1);    
        }
    }

    transformBody(){
        // Abdomen
        let M_abdomen = new Matrix4();

        this.checkRotation("abdomen", M_abdomen);
        let M_pelvis = new Matrix4(M_abdomen);
        let M_uchest = new Matrix4(M_abdomen);

        M_abdomen.translate(0, -0.15, 0);
        M_abdomen.scale(0.3, -0.3, 0.3);
        
        this.body["abdomen"].matrix = M_abdomen;

        // let M_lchest = new Matrix4(M_pelvis);

        // Pelvis
        this.checkRotation("pelvis", M_pelvis);
        M_pelvis.translate(0, -0.5, 0);
        let M_rthigh = new Matrix4(M_pelvis);
        let M_lthigh = new Matrix4(M_pelvis);

        M_pelvis.scale(0.5, 0.5, 0.5);
        this.body["pelvis"].matrix = M_pelvis;


        // Right thigh
        this.checkRotation("rthigh", M_rthigh);
        M_rthigh.translate(-0.15, -0.05, 0);
        let M_rknee = new Matrix4(M_rthigh);

        M_rthigh.scale(0.5, 0.7, 0.5);
        this.body["rthigh"].matrix = M_rthigh;


        // Right knee
        this.checkRotation("rknee", M_rknee);
        M_rknee.translate(0, -0.29, 0);
        let M_rcalf = new Matrix4(M_rknee);

        M_rknee.scale(0.12, 0.12, 0.12);
        this.body["rknee"].matrix = M_rknee;


        // Right calf
        this.checkRotation("rcalf", M_rcalf);
        M_rcalf.translate(0, -0.23, 0);
        let M_rfjoint = new Matrix4(M_rcalf);

        M_rcalf.scale(0.3, 0.45, 0.3);
        this.body["rcalf"].matrix = M_rcalf;

        // Right foot joint
        this.checkRotation("rfjoint", M_rfjoint);        
        M_rfjoint.translate(0, -0.2, 0);
        M_rfjoint.rotate(90, 0, 0, 1);
        let M_rfoot = new Matrix4(M_rfjoint);

        M_rfjoint.scale(0.4, 0.4, 0.4);
        this.body["rfjoint"].matrix = M_rfjoint;

        // Right foot
        this.checkRotation("rfoot", M_rfoot);     
        M_rfoot.rotate(-90, 0, 0, 1);   
        M_rfoot.translate(0, -0.02, -0.1);

        M_rfoot.scale(0.2, 0.3, 0.25);
        this.body["rfoot"].matrix = M_rfoot;


        // Left Thigh
        this.checkRotation("lthigh", M_lthigh);
        M_lthigh.translate(0.15, -0.05, 0);
        let M_lknee= new Matrix4(M_lthigh);

        M_lthigh.scale(0.5, 0.7, 0.5);
        this.body["lthigh"].matrix = M_lthigh;

        // Left knee
        this.checkRotation("lknee", M_lknee);
        M_lknee.translate(0, -0.29, 0);
        let M_lcalf = new Matrix4(M_lknee);

        M_lknee.scale(0.12, 0.12, 0.12);
        this.body["lknee"].matrix = M_lknee;


        // Left calf
        this.checkRotation("lcalf", M_lcalf);
        M_lcalf.translate(0, -0.23, 0);
        let M_lfjoint = new Matrix4(M_lcalf);

        M_lcalf.scale(0.3, 0.45, 0.3);
        this.body["lcalf"].matrix = M_lcalf;

        // Left foot joint
        this.checkRotation("lfjoint", M_lfjoint);        
        M_lfjoint.translate(0, -0.2, 0);
        M_lfjoint.rotate(90, 0, 0, 1);
        let M_lfoot = new Matrix4(M_lfjoint);

        M_lfjoint.scale(0.4, 0.4, 0.4);
        this.body["lfjoint"].matrix = M_lfjoint;

        // Left foot
        this.checkRotation("lfoot", M_lfoot);     
        M_lfoot.rotate(-90, 0, 0, 1);   
        M_lfoot.translate(0, -0.02, -0.1);
        M_lfoot.scale(0.2, 0.3, 0.25);
        this.body["lfoot"].matrix = M_lfoot;


        //
        
        // torso.setHeight(1.7);
        // //p3.render();
        
        
        // M_lchest.translate(0, 0.9, 0);
        // M_lchest.rotate(45, 0, 0, 1);
        
        
        
        // M_lchest.scale(0.5, -0.5, 0.5);
        // this.body.push(M_lchest);
        //let  = new Pyramid(10, 1.0, [1, 0, 1, 1], M_lchest);
        // p4.setMaxWidth(1);
        // p4.scaleFace(1.2);
        // //p4.render();

        // Chest
        this.checkRotation("uchest", M_uchest);
        M_uchest.translate(0, 0.2, 0);
        let M_head = new Matrix4(M_uchest);
        let M_ruparm = new Matrix4(M_uchest);
        let M_luparm = new Matrix4(M_uchest);
        
        M_uchest.scale(0.5, 0.4, 0.5);
        this.body["uchest"].matrix = M_uchest;

        // Right Upperarm
        this.checkRotation("ruparm", M_ruparm);
        M_ruparm.translate(-0.2, 0.1, 0);
        M_ruparm.rotate(-90, 0, 0, 1);
        let M_relbow = new Matrix4(M_ruparm);

        M_ruparm.scale(0.5, 0.8, 0.5);
        this.body["ruparm"].matrix = M_ruparm;

        // Right Elbow
        this.checkRotation("relbow", M_relbow);
        M_relbow.translate(0, -0.23, 0);
        let M_rfoarm = new Matrix4(M_relbow);

        M_relbow.scale(0.08, 0.08, 0.08);
        this.body["relbow"].matrix = M_relbow;


        // Right Forearm
        this.checkRotation("rfoarm", M_rfoarm);
        M_rfoarm.translate(0, -0.15, 0);
        let M_rwrist = new Matrix4(M_rfoarm);

        M_rfoarm.scale(0.4, 0.5, 0.4);
        this.body["rfoarm"].matrix = M_rfoarm;

        // Right Wrist
        this.checkRotation("rwrist", M_rwrist);        
        M_rwrist.translate(0, -0.15, 0);
        M_rwrist.rotate(-90, 0, 0, 1);
        let M_rhand = new Matrix4(M_rwrist);

        M_rwrist.scale(0.4, 0.4, 0.4);
        this.body["rwrist"].matrix = M_rwrist;

        // Right Hand
        this.checkRotation("rhand", M_rhand);     
        M_rhand.rotate(90, 0, 0, 1); 
        M_rhand.rotate(90, 1, 0, 0); 
        
        M_rhand.translate(0, 0, 0.1);

        M_rhand.scale(0.2, 0.3, 0.25);
        this.body["rhand"].matrix = M_rhand;



        // Left Upperarm
        this.checkRotation("luparm", M_luparm);
        M_luparm.translate(0.2, 0.1, 0);
        M_luparm.rotate(90, 0, 0, 1);
        let M_lelbow = new Matrix4(M_luparm);

        M_luparm.scale(0.5, 0.8, 0.5);
        this.body["luparm"].matrix = M_luparm;

        // Right Elbow
        this.checkRotation("lelbow", M_lelbow);
        M_lelbow.translate(0, -0.23, 0);
        let M_lfoarm = new Matrix4(M_lelbow);

        M_lelbow.scale(0.08, 0.08, 0.08);
        this.body["lelbow"].matrix = M_lelbow;


        // Right Forearm
        this.checkRotation("lfoarm", M_lfoarm);
        M_lfoarm.translate(0, -0.15, 0);
        let M_lwrist = new Matrix4(M_lfoarm);

        M_lfoarm.scale(0.4, 0.5, 0.4);
        this.body["lfoarm"].matrix = M_lfoarm;

        // Right Wrist
        this.checkRotation("lwrist", M_lwrist);        
        M_lwrist.translate(0, -0.15, 0);
        M_lwrist.rotate(-90, 0, 0, 1);
        let M_lhand = new Matrix4(M_lwrist);

        M_lwrist.scale(0.4, 0.4, 0.4);
        this.body["lwrist"].matrix = M_lwrist;

        // Right Hand
        this.checkRotation("lhand", M_lhand);     
        M_lhand.rotate(90, 0, 0, 1); 
        M_lhand.rotate(90, 1, 0, 0); 
        M_lhand.translate(0, 0, 0.1);
        M_lhand.scale(0.2, 0.3, 0.25);
        this.body["lhand"].matrix = M_lhand;


        // Head
        this.checkRotation("head", M_head);
        M_head.translate(0, 0.4, 0);
        M_head.scale(0.3, 0.3, 0.3);
        this.body["head"].matrix = M_head;

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

    rotateAppendage(part, angle, axis){
        console.log(part, axis)
        this.rotations[part][axis] = angle;
        this.rotations[part].isRotated = !( this.rotations[part]["x"] == 0 &&
                                            this.rotations[part]["y"] == 0 &&
                                            this.rotations[part]["z"] == 0 );
        this.transformBody();
    }

    render(){
        console.log(this.body)
        for (let part in this.body){
            this.body[part].render();
        }
    }


}