function creat() {
    const animations = {
        ArrowRight: {
            withBomb: [
                { x: '-129px', y: '-4px', width: '31px', height: '63px' },
                { x: '-163px', y: '-4px', width: '31px', height: '62px' },
                { x: '-197px', y: '-4px', width: '31px', height: '63px' },
                { x: '-231px', y: '-4px', width: '30px', height: '62px' }
            ],
            withoutBomb: [
                { x: '-730px', y: '-4px', width: '24px', height: '63px' },
                { x: '-757px', y: '-4px', width: '25px', height: '62px' },
                { x: '-784px', y: '-4px', width: '24px', height: '63px' },
                { x: '-811px', y: '-4px', width: '25px', height: '62px' }
            ]
        },
        ArrowLeft: {
            withBomb: [
                { x: '-370px', y: '-4px', width: '32px', height: '62px' },
                { x: '-335px', y: '-4px', width: '31px', height: '63px' },
                { x: '-300px', y: '-4px', width: '31px', height: '62px' },
                { x: '-265px', y: '-4px', width: '31px', height: '63px' }
            ],
            withoutBomb: [
                { x: '-30px', y: '-4px', width: '24px', height: '63px' },
                { x: '-920px', y: '-4px', width: '25px', height: '62px' },
                { x: '-893px', y: '-4px', width: '24px', height: '63px' },
                { x: '-866px', y: '-4px', width: '24px', height: '62px' },
                { x: '-839px', y: '-4px', width: '24px', height: '63px' }
            ]
        },
        ArrowDown: {
            withBomb: [
                { x: '-405px', y: '-4px', width: '35px', height: '63px' },
                { x: '-443px', y: '-4px', width: '35px', height: '64px' },
                { x: '-481px', y: '-4px', width: '35px', height: '63px' },
                { x: '-519px', y: '-4px', width: '36px', height: '64px' }
            ],
            withoutBomb: [
                { x: '-948px', y: '-4px', width: '33px', height: '63px' },
                { x: '-984px', y: '-4px', width: '32px', height: '64px' },
                { x: '-1019px', y: '-4px', width: '33px', height: '63px' },
                { x: '-1055px', y: '-4px', width: '32px', height: '64px' }
            ]
        },
        ArrowUp: {
            withBomb: [
                { x: '-558px', y: '-4px', width: '40px', height: '63px' },
                { x: '-602px', y: '-4px', width: '40px', height: '64px' },
                { x: '-645px', y: '-4px', width: '40px', height: '63px' },
                { x: '-688px', y: '-4px', width: '39px', height: '64px' }
            ],
            withoutBomb: [
                { x: '-1090px', y: '-4px', width: '33px', height: '63px' },
                { x: '-1127px', y: '-4px', width: '31px', height: '64px' },
                { x: '-1162px', y: '-4px', width: '33px', height: '63px' },
                { x: '-1198px', y: '-4px', width: '32px', height: '64px' }
            ]
        },
        chtiha: [
            { x: '-155px', y: '-72px', width: '35px', height: '65px' },
            { x: '-193px', y: '72px', width: '36px', height: '64px' },
            { x: '-232px', y: '-72px', width: '36px', height: '65px' },
            { x: '-270px', y: '-72px', width: '36px', height: '64px' }
        ]

    };
    // static one not walk 
    const down = [ 
        {x: '-57px', y : '-4px', width: '33', height:'63'}
    ]
    const downwithbombs = [
        {x: '-73px', y: '72px', width: '35', height:'63'}
    ]
    const Upwithbombs = [
        {x: '-111px', y: '-72px', width: '41', height:'63'}
    ]
    const Up = [ 
        {x: '-93px', y:'-4px', width:'33', height:'63'}
    ] 
    const right = [
        // wa9f taychoof 3la limn
        {x: '-4px', y: '-4px' , width: '23px', height:'63px'}
    ]
    const rightwithbombs = [
        {x: '-4px', y :'-72px', width: '31px', height: '63px'}
    ]
    const left = [
        // wa9f taychof 3la lissar 
        {x: '-30px', y:'-4px', width: '24px', height: '63px'}
    ]
    const leftwithbomb = [
        {x: '-38px', y:'-72px', width:'32px', height:'63px'}
    ]

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
    var animation = false
    var frame = []
    var detect = 0
    var presskey = []
    document.addEventListener('keydown', (e)=>{
        //console.log(e)
        presskey.push(e.key)
        if(!detect) {
        detect = 1
        
         setTimeout(() => {
        //console.log(e.key)
        var p = animations[e.key]
        //console.log(p)
         
        frame = p.withoutBomb
        //console.log(typeof frame)
        setInterval(() => {
        const f = frame[frameIndex];
        sprite.style.width = f.width;
        sprite.style.height = f.height;
        sprite.style.backgroundPosition = `${f.x} ${f.y}`;
        frameIndex = (frameIndex + 1) % frame.length;
    }, 60);
    detect = 0 
    }, 300) 
    }
    //frame = []
    })
}

creat();
