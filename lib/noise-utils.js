/*
My almagam of a noise library comes from:
https://mrl.cs.nyu.edu/~perlin/noise/
https://adrianb.io/2014/08/09/perlinnoise.html
https://www.scratchapixel.com/lessons/procedural-generation-virtual-worlds/procedural-patterns-noise-part-1/simple-pattern-examples


*/

class Noise {

    static permutation = [ 151,160,137,91,90,15,
        131,13,201,95,96,53,194,233,7,225,140,36,103,30,69,142,8,99,37,240,21,10,23,
        190, 6,148,247,120,234,75,0,26,197,62,94,252,219,203,117,35,11,32,57,177,33,
        88,237,149,56,87,174,20,125,136,171,168, 68,175,74,165,71,134,139,48,27,166,
        77,146,158,231,83,111,229,122,60,211,133,230,220,105,92,41,55,46,245,40,244,
        102,143,54, 65,25,63,161, 1,216,80,73,209,76,132,187,208, 89,18,169,200,196,
        135,130,116,188,159,86,164,100,109,198,173,186, 3,64,52,217,226,250,124,123,
        5,202,38,147,118,126,255,82,85,212,207,206,59,227,47,16,58,17,182,189,28,42,
        223,183,170,213,119,248,152, 2,44,154,163, 70,221,153,101,155,167, 43,172,9,
        129,22,39,253, 19,98,108,110,79,113,224,232,178,185, 112,104,218,246,97,228,
        251,34,242,193,238,210,144,12,191,179,162,241, 81,51,145,235,249,14,239,107,
        49,192,214, 31,181,199,106,157,184, 84,204,176,115,121,50,45,127, 4,150,254,
        138,236,205,93,222,114,67,29,24,72,243,141,128,195,78,66,215,61,156,180
    ];

    static p = new Uint8Array(Noise.randomShuffle(Noise.permutation.concat(Noise.permutation)));

    static shuffleP() { Noise.randomShuffle(Noise.p); }

    static randomShuffle(arr){
        for (let i = 0; i < arr.length; i++){
            let j = Math.floor(Math.random()*255);
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }

    static perlin(x=0, y=0, z=0, positive=true){

        // Get the unit cube
        let xi = Math.floor(x) & 255;
        let yi = Math.floor(y) & 255;
        let zi = Math.floor(z) & 255;
        //console.log(xi, yi, zi);

        let xf = x - Math.floor(x);
        let yf = y - Math.floor(y);
        let zf = z - Math.floor(z);
        //console.log(xf, yf, zf);
        
        let u = Noise.fade(xf);
        let v = Noise.fade(yf);
        let w = Noise.fade(zf);
        //console.log(u, v, w);

        // let A = Noise.p[xi    ] + yi;
        // let AA = Noise.p[A] + zi;
        // let AB = Noise.p[A + 1] + zi;      // HASH COORDINATES OF
        // let B = Noise.p[xi + 1] + yi;
        // let BA = Noise.p[B] + zi;
        // let BB = Noise.p[B + 1] + zi;      // THE 8 CUBE CORNERS,

        let aaa = Noise.grad(Noise.hash(xi  , yi    , zi    ), xf   , yf    , zf    );
        let aab = Noise.grad(Noise.hash(xi  , yi    , zi+1  ), xf   , yf    , zf-1  );
        let aba = Noise.grad(Noise.hash(xi  , yi+1  , zi    ), xf   , yf-1  , zf    );
        let abb = Noise.grad(Noise.hash(xi  , yi+1  , zi+1  ), xf   , yf-1  , zf-1  );
        let baa = Noise.grad(Noise.hash(xi+1, yi    , zi    ), xf-1 , yf    , zf    );
        let bab = Noise.grad(Noise.hash(xi+1, yi    , zi+1  ), xf-1 , yf    , zf-1  );
        let bba = Noise.grad(Noise.hash(xi+1, yi+1  , zi    ), xf-1 , yf-1  , zf    );
        let bbb = Noise.grad(Noise.hash(xi+1, yi+1  , zi+1  ), xf-1 , yf-1  , zf-1  );
        
        let x1, x2, y1, y2;
        
        x1 = Noise.lerp(u, aaa, baa);
        x2 = Noise.lerp(u, aba, bba);
        y1 = Noise.lerp(v, x1, x2);

        x1 = Noise.lerp(u, aab, bab);
        x2 = Noise.lerp(u, abb, bbb);
        y2 = Noise.lerp(v, x1, x2);


        if (positive)
            return (Noise.lerp(w, y1, y2) + 1)/ 2;
        return Noise.lerp(w, y1, y2);

        // return Noise.lerp(w, Noise.lerp(v, 
        //                         Noise.lerp(u, Noise.grad(Noise.p[AA  ], xf  , yf  , zf ),  // AND ADD
        //                                     Noise.grad(Noise.p[BA  ], xf-1, yf  , zf )), // BLENDED
        //                         Noise.lerp(u, Noise.grad(Noise.p[AB  ], xf  , yf-1, zf   ),  // RESULTS
        //                                     Noise.grad(Noise.p[BB  ], xf-1, yf-1, zf   ))),// FROM  8
        //                     Noise.lerp(v, 
        //                         Noise.lerp(u, Noise.grad(Noise.p[AA+1], xf  , yf  , zf-1 ),  // CORNERS
        //                                     Noise.grad(Noise.p[BA+1], xf-1, yf  , zf-1 )), // OF CUBE
        //                         Noise.lerp(u, Noise.grad(Noise.p[AB+1], xf  , yf-1, zf-1 ),
        //                                     Noise.grad(Noise.p[BB+1], xf-1, yf-1, zf-1 ))));
    }
    static hash(x, y, z) { return Noise.p[Noise.p[Noise.p[x] + y] + z]}
    static fade(t) { return t * t * t * (t * (t * 6 - 15) + 10); }
    static lerp(t, a, b) { return a + t * (b - a); }
    static grad(hash, x, y, z){
        switch(hash & 0xF)
        {
            case 0x0: return  x + y;
            case 0x1: return -x + y;
            case 0x2: return  x - y;
            case 0x3: return -x - y;
            case 0x4: return  x + z;
            case 0x5: return -x + z;
            case 0x6: return  x - z;
            case 0x7: return -x - z;
            case 0x8: return  y + z;
            case 0x9: return -y + z;
            case 0xA: return  y - z;
            case 0xB: return -y - z;
            case 0xC: return  y + x;
            case 0xD: return -y + z;
            case 0xE: return  y - x;
            case 0xF: return -y - z;
            default: return 0; // never happens
        }
    }


// static grad (hash, x, y, z){
//     let h = hash & 15;                      // CONVERT LO 4 BITS OF HASH CODE
//     let u = h<8 ? x : y;                    // INTO 12 GRADIENT DIRECTIONS.
//     let v = h<4 ? y : h==12||h==14 ? x : z;
//     return ((h&1) == 0 ? u : -u) + ((h&2) == 0 ? v : -v);
// }
    static fBm(x=0, y=0, z=0, lacunarity = 2, persistence=0.5, octaves=5, scale=100){
        let noiseSum = 0;
        let frequency = 1;
        let amplitude = 1;
        let maxNoiseVal = 0;

        for (let i = 0; i < octaves; ++i){
            noiseSum += Noise.perlin(x * frequency / scale, y * frequency/scale, z * frequency/scale) * amplitude;
            maxNoiseVal += amplitude;
            frequency *= lacunarity;
            amplitude *= persistence;
        }

        return noiseSum/maxNoiseVal;
    }

    static sfBm(x=0, y=0, z=0, lacunarity = 2, persistence=0.5, octaves=5, scale=100){
        return this.fBm(x, y, z, lacunarity, persistence, octaves, scale)*2 - 1;
    }

    static turbulence(x=0, y=0, z=0, lacunarity = 2, persistence=0.5, octaves=5, scale=100){
        let noiseSum = 0;
        let frequency = 1;
        let amplitude = 1;
        let maxNoiseVal = 0;

        for (let i = 0; i < octaves; ++i){
            noiseSum += Math.abs(Noise.perlin(x * frequency / scale, y * frequency/scale, z * frequency/scale, false) * amplitude);
            maxNoiseVal += amplitude;
            frequency *= lacunarity;
            amplitude *= persistence;
        }

        return noiseSum/maxNoiseVal;
    }
}