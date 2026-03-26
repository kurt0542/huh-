const question = document.getElementById('questionContent');
    const success = document.getElementById('successContent');
    const noBtn = document.getElementById('noBtn');
    const yesBtn = document.getElementById('yesBtn');
    const canvas = document.getElementById('confettiCanvas');
    const ctx = canvas.getContext('2d');
    const funnyGif = document.getElementById('funnyGif');
    const convinceMessage = document.getElementById('convinceMessage');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const convinceMessages = [
        "No talaga? :( ",
        "Sige na please? 🥺",
        "Isa lang ehh, promise!",
        "Hala, wrong click ka siguro?",
        "ANG KULIT MO LUCCILE YSABEL DE LEON!!",
        "Yes na ateeeeee",
        "Senyorita Lucky yes mo na",
        "Mali ka lang siguro ng napindot?",
        "Laro Laro Laro, Yes mo na"
    ];
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
    let lastMessageIndex = -1;
    let lastGifIndex = -1;
    let lastAudioIndex = -1;
    let audio;

    // Dodge Logic
    const dodge = () => {
      noBtn.style.position = 'fixed';
      
      const yesBtnRect = yesBtn.getBoundingClientRect();
      const pRect = convinceMessage.getBoundingClientRect();
      let x, y;

      do {
        x = Math.random() * (window.innerWidth - noBtn.offsetWidth);
        y = Math.random() * (window.innerHeight - noBtn.offsetHeight);
      } while (
        (x < yesBtnRect.right &&
        x + noBtn.offsetWidth > yesBtnRect.left &&
        y < yesBtnRect.bottom &&
        y + noBtn.offsetHeight > yesBtnRect.top) ||
        (x < pRect.right &&
        x + noBtn.offsetWidth > pRect.left &&
        y < pRect.bottom &&
        y + noBtn.offsetHeight > pRect.top)
      );

      noBtn.style.left = `${x}px`;
      noBtn.style.top = `${y}px`;
      funnyGif.style.display = 'block';

      let randomMsgIndex;
      do {
        randomMsgIndex = Math.floor(Math.random() * convinceMessages.length);
      } while (randomMsgIndex === lastMessageIndex);
      
      convinceMessage.textContent = convinceMessages[randomMsgIndex];
      lastMessageIndex = randomMsgIndex;

      let randomGifIndex;
      do {
        randomGifIndex = Math.floor(Math.random() * gifSources.length);
      } while (randomGifIndex === lastGifIndex);

      funnyGif.src = gifSources[randomGifIndex];
      lastGifIndex = randomGifIndex;


      // --- SOUND TOGGLE: UNCOMMENT TO ENABLE SOUND ---
      let randomAudioIndex;
      do {
        randomAudioIndex = Math.floor(Math.random() * audioSources.length);
      } while (randomAudioIndex === lastAudioIndex);

      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
      
      const selectedAudio = audioSources[randomAudioIndex];
      audio = new Audio(selectedAudio);
      audio.play();
      lastAudioIndex = randomAudioIndex;

      if (selectedAudio === "audio/ah-faded.mp3") {
        setTimeout(() => {
          if (audio && audio.src.includes("ah-faded.mp3")) {
            audio.pause();
            audio.currentTime = 0;
          }
        }, 2000);
      }
      // --- END SOUND TOGGLE ---

      /* --- SOUND TOGGLE: UNCOMMENT TO DISABLE SOUND ---
      
      // --- END SOUND TOGGLE --- */
    }

    noBtn.addEventListener('mouseover', dodge);
    noBtn.addEventListener('click', dodge);

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