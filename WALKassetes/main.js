function creat() {
    const walkingrightFrames = [
        { x: '-2422px', y: '-15px', width: '76px', height: '207px' },
        { x: '-2510px', y: '-14px', width: '80px', height: '205px' },
        { x: '-2602px', y: '-14px', width: '77px', height: '208px' },
        { x: '-2690px', y: '-15px', width: '80px', height: '203px' }
    ]
    const walkingrightwithbombs = [ 
        {x: '-430px', y: '-15px', width:'100px', height : '208px'},
        {x: '-542px', y :'-14px', width: '100px', height: '204px'},
        {x: '-654px', y : '-14px', width: '100px', height:'209px'},
        {x: '-766px', y : '15px', width: '100px', height:'203px'}
    ];
    
    const walkingleftwithbombs = [
        {x: '-1227px', y: '-15px', width: '103px', height:'203px'},
        {x: '-1111px', y: '-15px', width:'104px', height:'207px'},
        {x: '-995px', y : '-15px', width: '103px', height:'203px'},
        {x: '-879px', y : '-15px', width:'104px', height:'207px'}
    ];
    
    const walkingleft = [
        {x: '-3051px', y:'-15px', width:'80px', height:'203px'},
        {x: '-2063px', y :'-14px', width: '76px', height:'208px'},
        {x: '-2871px', y : '-15px', width: '79px', height:'203px'},
        {x: '-2783px', y : '-14px', width: '75px', height:'208px'}
    ];
    
    const walkingDown = [
        {x: '-3143px', y: '-14px', width:'107px', height:'208px'},
        {x: '-3263px', y : '-14px', width: '104px', height:'212px'},
        {x: '-3379px', y: '-15px', width:'107px', height:'207px'},
        {x: '-3498px', y : '-14px', width:'104px', height:'213px'}
    ];
    
    const walkingDownwithbombs = [
        {x : '-1343px', y: '-14px', width:'115px', height:'208px'},
        {x: '-1471px', y: '-14px', width:'112px', height:'212px'},
        {x: '-1595px', y : '-14px', width:'116px', height:'208px'},
        {x: '-1723px', y : '-14px', width: '116px', height: '212px'}
    ];
    
    const walkingUp = [
        {x : '-3615px', y:'-14px', width:'107px', height:'208px'},
        {x: '-3735px', y:'-14px', width: '104px', height:'212px'},
        {x: '-3851px', y:'-14px', width:'108px', height:'208px'},
        {x: '-3971px', y: '-14px', width:'103px', height:'212px'}
    ];
    
    const walkingUpwithbombs = [
        {x: '-1851px', y : '-14px', width: '131px', height:'208px'},
        {x: '-1995px', y: '-14px', width: '131px', height:'212px'},
        {x: '-2139px', y :'-15px', width: '131px', height:'207px'},
        {x: '-2283px', y: '-15px', width:'127px', height:'211px'}
    ];
    
    const right = [
        // wa9f taychoof 3la limn
        {x: '-15px', y: '-14px' , width: '75px', height:'209px'}
    ]
    const rightwithbombs = [
        {x: '-15px', y :'208px', width: '99px', height: '208px'}
    ]
    const left = [
        // wa9f taychof 3la lissar 
        {x: '-103px', y:'-15px', width: '75px', height: '208px'}
    ]
    const leftwithbomb = [
        {x: '-127px', y:'-239px', width:'103px', height:'207px'}
    ]
    // chtiha not detect 

    let body = document.querySelector('body');
    let div = document.createElement('div');
    div.className = 'sprite';
    body.appendChild(div);

    const sprite = document.querySelector('.sprite');
    sprite.style.backgroundImage = 'url("player.png")';
    sprite.style.backgroundRepeat = 'no-repeat';
    sprite.style.imageRendering = 'pixelated';
    sprite.style.position = 'absolute';  

    let frameIndex = 0;

    setInterval(() => {
        const frame = walkingDownwithbombs[frameIndex];

        sprite.style.width = frame.width;
        sprite.style.height = frame.height;
        sprite.style.backgroundPosition = `${frame.x} ${frame.y}`;

        frameIndex = (frameIndex + 1) % walkingDownwithbombs.length;
    }, 60);  
}

creat();
