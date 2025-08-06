function creat() {
    const walkingrightFrames = [
        { x: '-457px', y: '-2px', width: '15px', height: '40px' },
        { x: '-473px', y: '-2px', width: '16px', height: '40px' },
        { x: '-491px', y: '-2px', width: '15px', height: '40px' },
        { x: '-507px', y: '-2px', width: '16px', height: '40px' }
    ]
    const walkingrightwithbombs = [ 
        {x: '-81px', y: '-2px', width:'19px', height : '40px'},
        {x: '-192px', y :'-2px', width: '20px', height: '40px'},
        {x: '-123px', y : '-2px', width: '20px', height:'40px'},
        {x: '-144px', y : '-2px', width: '20px', height:'40px'}
    ];
    
    const walkingleftwithbombs = [
        {x: '-231px', y: '-2px', width: '20px', height:'40px'},
        {x: '209-px', y: '-2px', width:'20px', height:'40px'},
        {x: '-187px', y : '-2px', width: '21px', height:'40px'},
        {x: '-165px', y : '-2px', width:'21px', height:'40px'}
    ];
    
    const walkingleft = [
        {x: '-575px', y:'-2px', width:'16px', height:'40px'},
        {x: '-558px', y :'-2px', width: '16px', height:'40px'},
        {x: '-514px', y : '-2px', width: '16px', height:'40px'},
        {x: '-524px', y : '-2px', width: '16px', height:'40px'}
    ];
    
    const walkingDown = [
        {x: '-593px', y: '-2px', width:'21px', height:'40px'},
        {x: '-615px', y : '-2px', width: '21px', height:'41px'},
        {x: '-637px', y: '-2px', width:'21px', height:'40px'},
        {x: '-660px', y : '-2px', width:'20px', height:'41px'}
    ];
    
    const walkingDownwithbombs = [
        {x : '-253px', y: '-2px', width:'23px', height:'40px'},
        {x: '-277px', y: '-2px', width:'22px', height:'41px'},
        {x: '-300px', y : '-2px', width:'23px', height:'40px'},
        {x: '-325px', y : '-2px', width: '22px', height: '41px'}
    ];
    
    const walkingUpwithbombs = [
        {x : '-349px', y:'-2px', width:'25px', height:'40px'},
        {x: '-376px', y:'-2px', width: '26px', height:'41px'},
        {x: '-403px', y:'-2px', width:'26px', height:'40px'},
        {x: '-430px', y: '-2px', width:'25px', height:'41px'}
    ];
    
    const walkingUp = [
        {x: '-682px', y : '-2px', width: '21px', height:'40px'},
        {x: '-704px', y: '-2px', width: '21px', height:'41px'},
        {x: '-726px', y :'-2px', width: '21px', height:'40px'},
        {x: '-749px', y: '-2px', width:'20px', height:'41px'}
    ];
    
    const right = [
        // wa9f taychoof 3la limn
        {x: '-2px', y: '-2px' , width: '15px', height:'40px'}
    ]
    const rightwithbombs = [
        {x: '-2px', y :'-45px', width: '20px', height: '40px'}
    ]
    const left = [
        // wa9f taychof 3la lissar 
        {x: '-18px', y:'-2px', width: '16px', height: '40px'}
    ]
    const leftwithbomb = [
        {x: '-23px', y:'-45px', width:'21px', height:'40px'}
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
