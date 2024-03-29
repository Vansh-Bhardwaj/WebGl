var WebGL = function () {
    var gl, shaderProgram;

    gl = initializeWebGL(gl);

    gl.clearColor(0, 0, 0, 1.0); 
    gl.clear(gl.COLOR_BUFFER_BIT);

    var verticesDataArrayJS = [
        //5
        -0.3,0.2,0, //0
        -0.5,0.2,0, //1
        -0.5,0.0,0, //2
        -0.3,0.0,0, //3
        -0.3,-0.2,0, //4
        -0.5,-0.2,0, //5

        //9
        0.1,-0.2,0, //6
        0.1,-0.0,0, //7
        0.1,0.2,0, //8
        -0.1,0.2,0, //9
        -0.1,0.0,0, //10

        //3
        0.3,0.2,0, //11
        0.5,0.2,0, //12
        0.5,0.0,0, //13
        0.3,0.0,0, //14
        0.5,-0.2,0, //15
        0.3,-0.2,0, //16
        

    ];
    
    var IndicesArrayJS = [
        0,1,1,2,2,3,3,4,4,5, //5
        6,7,7,8,8,9,9,10,10,7,//9
        11,12,12,13,13,14,13,15,15,16 //10

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
