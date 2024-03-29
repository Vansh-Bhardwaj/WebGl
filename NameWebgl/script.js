var WebGL = function () {
    var gl, shaderProgram;

    gl = initializeWebGL(gl);

    gl.clearColor(0, 0, 0, 1.0); 
    gl.clear(gl.COLOR_BUFFER_BIT);

    var verticesDataArrayJS = [
        // V
        -0.9, 0.3, 0,   // Vertex 0
        -0.8, -0.3, 0,  // Vertex 1
        -0.7, 0.3, 0,   // Vertex 2
    
        // A
        -0.6, -0.3, 0,  // Vertex 3
        -0.55, 0.3, 0,  // Vertex 4
        -0.5, -0.3, 0,  // Vertex 5
        -0.575, 0, 0,   // Vertex 6
        -0.525, 0, 0,   // Vertex 7
    
        // N
        -0.4, -0.3, 0,  // Vertex 8
        -0.4, 0.3, 0,   // Vertex 9
        -0.3, -0.3, 0,  // Vertex 10
        -0.3, 0.3, 0,   // Vertex 11
    
        // S
        -0.15, 0.3, 0,   // Vertex 12
        -0.25, 0.3, 0, // Vertex 13
        -0.25, 0.0, 0, // Vertex 14
        -0.15, 0.0, 0,     // Vertex 15
        -0.25, -0.3, 0,// Vertex 16
        -0.15, -0.3, 0,// Vertex 17
    
        // B
        0.1, 0.3, 0,    // Vertex 18
        0.2, 0.3, 0,    // Vertex 19
        0.2, 0.3, 0,   // Vertex 20
        0.1, 0.0, 0,   // Vertex 21
        0.2, -0.3, 0,  // Vertex 22
        0.1, -0.3, 0,  // Vertex 23
        0.1, -0.3, 0,   // Vertex 24
    
        // H
        0.3, 0.3, 0,    // Vertex 25
        0.3, -0.3, 0,   // Vertex 26
        0.4, 0.3, 0,    // Vertex 27
        0.4, -0.3, 0,   // Vertex 28
        0.3, 0.0, 0,  // Vertex 29
        0.4, 0.0, 0, // Vertex 30
    
        // A
        0.45, -0.3, 0,  // Vertex 31
        0.5, 0.3, 0,    // Vertex 32
        0.55, -0.3, 0,  // Vertex 33
        0.475, 0, 0,    // Vertex 34
        0.525, 0, 0,    // Vertex 35
    
        // R
        0.6, 0.3, 0,    // Vertex 36
        0.6, 0, 0,// Vertex 37
        0.6, -0.3, 0,   // Vertex 38
        0.7, 0.3, 0,    // Vertex 39
        0.7, 0.0, 0,  // Vertex 40
        0.7, -0.3, 0    // Vertex 41
     ];
    
    var IndicesArrayJS = [
        // V
        0, 1, 1, 2,
    
        // A
        3, 4, 4, 5, 6, 7,
    
        // N
        8, 9, 9, 10, 10, 11,
    
        // S
        12, 13, 13, 14, 14, 15, 15, 17, 17, 16,
    
        // // B
        // 18, 19, 19, 20, 20, 21, 21, 18, 21, 22, 22, 23, 23, 24, 24, 18,
    
        // H
        25, 26, 27, 28, 29, 30,
    
        // // A
        // 31, 32, 32, 33, 34, 35,
    
        // // R
        // 36,39,39,40,40,37,37,41,38,36
    ];
    
    
    

    var rectVBO = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, rectVBO);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verticesDataArrayJS), gl.STATIC_DRAW);

    var rectIBO = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, rectIBO);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(IndicesArrayJS), gl.STATIC_DRAW);

    shaderProgram = getShaderProgram(gl);
    gl.useProgram(shaderProgram);

    var positionAttribLocation = gl.getAttribLocation(shaderProgram, 'geometryCoordinatesGPU');
    gl.enableVertexAttribArray(positionAttribLocation);

    gl.vertexAttribPointer(
        positionAttribLocation, 
        3, 
        gl.FLOAT, 
        gl.FALSE,
        3 * Float32Array.BYTES_PER_ELEMENT,
        0
    );
    
    // Draw the lines
    gl.drawElements(gl.LINES, IndicesArrayJS.length, gl.UNSIGNED_SHORT, 0);
};

function initializeWebGL(gl) {
    var canvas = document.getElementById('canvas');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    gl = canvas.getContext('webgl');

    if (!gl) {
        console.log('WebGL not supported, falling back on experimental-webgl');
        gl = canvas.getContext('experimental-webgl');
    }

    if (!gl) {
        alert('Your browser does not support WebGL');
        return;
    }
    return gl;
}

function getShaderProgram(gl) {
    var vertexShaderText = 
    ' precision mediump float; ' +
    ' attribute vec3 geometryCoordinatesGPU; ' +
    ' void main() ' +
    ' { ' +
    '		gl_Position = vec4(geometryCoordinatesGPU, 1.0); ' +
    ' } ';

    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vertexShaderText);
    gl.compileShader(vertexShader);
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
        console.error('ERROR compiling vertex shader!', gl.getShaderInfoLog(vertexShader));
        return;
    }

    var fragmentShaderText =
    ' void main() ' +
    ' { ' +
    '  		gl_FragColor = vec4(0, 1, 1, 1); ' +
    ' } ';

    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fragmentShaderText);
    gl.compileShader(fragmentShader);
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
        console.error('ERROR compiling fragment shader!', gl.getShaderInfoLog(fragmentShader));
        return;
    }

    var shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        console.error('ERROR linking program!', gl.getProgramInfoLog(shaderProgram));
        return;
    }

    gl.validateProgram(shaderProgram);
    if (!gl.getProgramParameter(shaderProgram, gl.VALIDATE_STATUS)) {
        console.error('ERROR validating program!', gl.getProgramInfoLog(shaderProgram));
        return;
    }
    return shaderProgram;
}

WebGL();
