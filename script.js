const question = document.getElementById('questionContent');
    const success = document.getElementById('successContent');
    const noBtn = document.getElementById('noBtn');
    const yesBtn = document.getElementById('yesBtn');
    const canvas = document.getElementById('confettiCanvas');
    const ctx = canvas.getContext('2d');
    const funnyGif = document.getElementById('funnyGif');
    const convinceMessage = document.getElementById('convinceMessage');
    const flowerDrop = document.getElementById('flowerDrop');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const funMessages = [
        "No talaga? :( ",
        "Sige na please? 🥺",
        "Ito oh flower para maglaro na tayo",
        "Isa lang ehh, promise!",
        "Hala, wrong click ka siguro?",
        "ANG KULIT MO LUCILLE YSABEL DE LEON!!",
        "Yes na ateeeeee",
        "Gagawa ka ng garden dito senyorita lucky?",
        "Senyorita Lucky yes mo na",
        "Mali ka lang siguro ng napindot?",
        "Laro Laro Laro, Yes mo na",
        "Pagbigyan mo na ang penguin, ito oh flower ulit"
    ];
      const yesDodgeMessages = [
        "Akala mo ah😝",
        "Hindi ganon kadali makipaglaro sa penguin",
        "Magmomove pa ulit yung yes button?"
      ];
    const yesFourthDodgeMessage = "Hindi na gagalaw yung Yes button, click mo na!";
    const gifSources = [
        "img/giphy.gif",
        "img/penguin2.gif",
        "img/catto.gif"
    ];
    const audioSources = [
        "audio/tuco-get-out.mp3",
        "audio/ah-faded.mp3",
        "audio/spongebob.mp3",
        "audio/fahhh.mp3"
    ];
    const flowerTriggerMessagePositions = [3, 8, 12];
    const unlockMessage12AfterPositions = [3, 8];
    const seenMessagePositions = new Set();
    let lastMessageIndex = -1;
    let lastGifIndex = -1;
    let lastAudioIndex = -1;
    let yesDodgeCount = 0;
    let yesDodgeMessageIndex = 0;
    let audio;

    const spawnPersistentFlower = () => {
      const flower = document.createElement('div');
      const petalClasses = ['p1', 'p2', 'p3', 'p4', 'p5'];

      petalClasses.forEach((petalClass) => {
        const petal = document.createElement('span');
        petal.className = `petal ${petalClass}`;
        flower.appendChild(petal);
      });

      const center = document.createElement('span');
      center.className = 'center';
      flower.appendChild(center);

      flower.className = 'placed-flower';
      flower.style.left = `${Math.random() * (window.innerWidth - 40)}px`;
      flower.style.top = `${Math.random() * (window.innerHeight - 40)}px`;
      flower.style.setProperty('--flower-size', `${Math.random() * 40 + 72}px`);
      flower.style.transform = `translate(-50%, -50%) rotate(${Math.random() * 40 - 20}deg)`;

      document.body.appendChild(flower);
    };

    // Dodge Logic
    const moveButtonRandomly = (button, avoidRects = []) => {
      button.style.position = 'fixed';
      let x;
      let y;

      do {
        x = Math.random() * (window.innerWidth - button.offsetWidth);
        y = Math.random() * (window.innerHeight - button.offsetHeight);
      } while (
        avoidRects.some((rect) => (
          x < rect.right &&
          x + button.offsetWidth > rect.left &&
          y < rect.bottom &&
          y + button.offsetHeight > rect.top
        ))
      );

      button.style.left = `${x}px`;
      button.style.top = `${y}px`;
    };

    const showFunMessage = () => {
      funnyGif.style.display = 'block';

      let randomMsgIndex;
      do {
        randomMsgIndex = Math.floor(Math.random() * funMessages.length);
      } while (
        randomMsgIndex === lastMessageIndex ||
        (
          randomMsgIndex + 1 === 12 &&
          !unlockMessage12AfterPositions.every((position) => seenMessagePositions.has(position))
        )
      );

      convinceMessage.textContent = funMessages[randomMsgIndex];
      lastMessageIndex = randomMsgIndex;
      seenMessagePositions.add(randomMsgIndex + 1);

      flowerDrop.style.display = 'none';
      if (flowerTriggerMessagePositions.includes(randomMsgIndex + 1)) {
        spawnPersistentFlower();
      }

      let randomGifIndex;
      do {
        randomGifIndex = Math.floor(Math.random() * gifSources.length);
      } while (randomGifIndex === lastGifIndex);

      funnyGif.src = gifSources[randomGifIndex];
      lastGifIndex = randomGifIndex;
    };

    const dodge = () => {
      const pRect = convinceMessage.getBoundingClientRect();
      const yesBtnRect = yesBtn.getBoundingClientRect();

      moveButtonRandomly(noBtn, [yesBtnRect, pRect]);
      showFunMessage();
    }

    const dodgeYes = () => {
      if (yesDodgeCount === 3) {
        funnyGif.style.display = 'block';
        convinceMessage.textContent = yesFourthDodgeMessage;
        yesDodgeCount += 1;
        return;
      }

      if (yesDodgeCount > 3) {
        return;
      }

      const pRect = convinceMessage.getBoundingClientRect();
      const noBtnRect = noBtn.getBoundingClientRect();

      moveButtonRandomly(yesBtn, [noBtnRect, pRect]);

      funnyGif.style.display = 'block';
      convinceMessage.textContent = yesDodgeMessages[yesDodgeMessageIndex];
      yesDodgeMessageIndex = Math.min(yesDodgeMessageIndex + 1, yesDodgeMessages.length - 1);
      yesDodgeCount += 1;

      let randomGifIndex;
      do {
        randomGifIndex = Math.floor(Math.random() * gifSources.length);
      } while (randomGifIndex === lastGifIndex);

      funnyGif.src = gifSources[randomGifIndex];
      lastGifIndex = randomGifIndex;
    }

    noBtn.addEventListener('mouseover', dodge);
    noBtn.addEventListener('click', dodge);
    yesBtn.addEventListener('mouseover', dodgeYes);

    // Confetti Logic
    let confetti = [];
    const colors = ['#FFD700', '#FFFFFF', '#007bff', '#222'];

    class ConfettiParticle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + 10;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.size = Math.random() * 10 + 5;
        this.speedX = Math.random() * 6 - 3;
        this.speedY = Math.random() * -15 - 10;
        this.gravity = 0.4;
        this.opacity = 1;
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.speedY += this.gravity;
        this.opacity -= 0.005;
      }
      draw() {
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.size, this.size);
      }
    }

    const animateConfetti = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      confetti.forEach((p, i) => {
        p.update();
        p.draw();
        if (p.opacity <= 0) confetti.splice(i, 1);
      });
      requestAnimationFrame(animateConfetti);
    }

    // Yes Action
    yesBtn.addEventListener('click', () => {
      document.body.style.backgroundColor = '#fff';
      question.style.display = 'none';
      success.style.display = 'block';
      funnyGif.style.display = 'none';
      setTimeout(() => success.style.opacity = '1', 10);
      
      for (let i = 0; i < 150; i++) {
        setTimeout(() => confetti.push(new ConfettiParticle()), i * 5);
      }
      animateConfetti();
    });

    window.addEventListener('resize', () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    });