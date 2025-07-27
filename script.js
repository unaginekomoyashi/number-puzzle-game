document.addEventListener('DOMContentLoaded', () => {
    const menuScreen = document.getElementById('menu-screen');
    const countGameScreen = document.getElementById('count-game-screen');
    const orderGameScreen = document.getElementById('order-game-screen');

    const startCountGameBtn = document.getElementById('start-count-game');
    const startOrderGameBtn = document.getElementById('start-order-game');
    const startMathGameBtn = document.getElementById('start-math-game');
    const mathGameScreen = document.getElementById('math-game-screen');
    const backToMenuBtns = document.querySelectorAll('.back-to-menu');

    const screens = [menuScreen, countGameScreen, orderGameScreen, mathGameScreen];

    function showScreen(screenToShow) {
        screens.forEach(screen => {
            screen.classList.remove('active');
        });
        screenToShow.classList.add('active');
    }

    startCountGameBtn.addEventListener('click', () => {
        showScreen(countGameScreen);
        startCountGame();
    });

    startOrderGameBtn.addEventListener('click', () => {
        showScreen(orderGameScreen);
        startOrderGame();
    });

    startMathGameBtn.addEventListener('click', () => {
        showScreen(mathGameScreen);
        startMathGame();
    });

    backToMenuBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            showScreen(menuScreen);
        });
    });

    // Initially show the menu
    showScreen(menuScreen);

    // --- ゲーム共通の変数 ---
    const feedbackOverlay = document.getElementById('feedback-overlay');
    const feedbackIcon = document.getElementById('feedback-icon');
    const feedbackText = document.getElementById('feedback-text');
    const countLevelDisplay = document.getElementById('count-level');
    const orderLevelDisplay = document.getElementById('order-level');
    const mathLevelDisplay = document.getElementById('math-level');
    let countLevel = 1;
    let orderLevel = 1;
    let mathLevel = 1;

    // 楽しいメッセージ
    const successMessages = [
        'すごいね！', 'よくできたね！', 'さすが！', 'かしこいね！', 
        'がんばったね！', 'すばらしい！', 'やったね！', 'えらい！'
    ];
    const encourageMessages = [
        'もういちど！', 'がんばって！', 'できるよ！', 'あとすこし！'
    ];

    // --- かずをかぞえようゲームのロジック ---
    const countQuestionArea = document.getElementById('count-question-area');
    const countOptionsArea = document.getElementById('count-options-area');
    const vehicles = ['🚗', '🚌', '🚚', '🚓', '🚑'];
    let countCorrectAnswer = 0;

    function startCountGame() {
        countQuestionArea.innerHTML = '';
        countOptionsArea.innerHTML = '';
        countLevelDisplay.textContent = countLevel;
        
        const maxItems = countLevel + 4; // レベルに応じて最大数が増える
        countCorrectAnswer = Math.floor(Math.random() * maxItems) + 1;
        
        const vehicleType = vehicles[Math.floor(Math.random() * vehicles.length)];
        for (let i = 0; i < countCorrectAnswer; i++) {
            const vehicleElement = document.createElement('div');
            vehicleElement.textContent = vehicleType;
            vehicleElement.style.fontSize = '50px';
            vehicleElement.style.margin = '10px';
            vehicleElement.style.filter = 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))';
            countQuestionArea.appendChild(vehicleElement);
        }

        const options = generateCountOptions(countCorrectAnswer, maxItems);
        options.forEach(option => {
            const button = document.createElement('button');
            button.textContent = option;
            button.className = 'colorful-number';
            button.addEventListener('click', () => checkCountAnswer(option));
            countOptionsArea.appendChild(button);
        });
    }

    function generateCountOptions(correct, max) {
        const options = [correct];
        while (options.length < 4) {
            const wrongOption = Math.floor(Math.random() * max) + 1;
            if (!options.includes(wrongOption)) {
                options.push(wrongOption);
            }
        }
        return options.sort(() => Math.random() - 0.5);
    }

    function checkCountAnswer(selectedOption) {
        if (selectedOption === countCorrectAnswer) {
            const message = successMessages[Math.floor(Math.random() * successMessages.length)];
            showFeedback(true, message);
            playMelody('correct');
            createCelebrationStars();
            countLevel++;
            setTimeout(startCountGame, 1500);
        } else {
            const message = encourageMessages[Math.floor(Math.random() * encourageMessages.length)];
            showFeedback(false, message);
            playMelody('incorrect');
        }
    }

    // --- すうじをならべようゲームのロジック ---
    const orderPuzzleArea = document.getElementById('order-puzzle-area');
    const orderTargetArea = document.getElementById('order-target-area');
    let draggedItem = null;
    let numToOrder = 0;

    function startOrderGame() {
        orderPuzzleArea.innerHTML = '';
        orderTargetArea.innerHTML = '';
        orderLevelDisplay.textContent = orderLevel;
        
        numToOrder = orderLevel + 3; // レベルに応じて数が増える
        const numbers = Array.from({ length: numToOrder }, (_, i) => i + 1);
        const shuffledNumbers = [...numbers].sort(() => Math.random() - 0.5);

        numbers.forEach(num => {
            const dropZone = document.createElement('div');
            dropZone.classList.add('train-car');
            dropZone.style.backgroundColor = '#eee';
            dropZone.dataset.correctNumber = num;
            orderTargetArea.appendChild(dropZone);

            dropZone.addEventListener('dragover', (e) => e.preventDefault());
            dropZone.addEventListener('drop', (e) => {
                e.preventDefault();
                if (draggedItem && dropZone.children.length === 0) {
                    dropZone.appendChild(draggedItem);
                    checkOrder();
                }
            });
        });

        shuffledNumbers.forEach(num => {
            const trainCar = document.createElement('div');
            trainCar.textContent = num;
            trainCar.classList.add('train-car', 'colorful-number');
            trainCar.draggable = true;
            trainCar.dataset.number = num;
            orderPuzzleArea.appendChild(trainCar);
            trainCar.addEventListener('dragstart', (e) => { draggedItem = e.target; });
        });
    }

    function checkOrder() {
        const dropZones = orderTargetArea.querySelectorAll('.train-car');
        let isCorrect = true;
        let filledZones = 0;

        dropZones.forEach(zone => {
            if (zone.children.length > 0) {
                filledZones++;
                const droppedCar = zone.children[0];
                if (droppedCar.dataset.number != zone.dataset.correctNumber) {
                    isCorrect = false;
                }
            }
        });

        if (filledZones === numToOrder) {
            if (isCorrect) {
                const message = successMessages[Math.floor(Math.random() * successMessages.length)];
                showFeedback(true, message);
                playMelody('correct');
                createCelebrationStars();
                orderLevel++;
                setTimeout(startOrderGame, 1500);
            } else {
                const message = encourageMessages[Math.floor(Math.random() * encourageMessages.length)];
                showFeedback(false, message);
                playMelody('incorrect');
                setTimeout(startOrderGame, 1500);
            }
        }
    }

    // --- さんすうゲームのロジック ---
    const mathQuestionArea = document.getElementById('math-question-area');
    const mathOptionsArea = document.getElementById('math-options-area');
    let mathCorrectAnswer = 0;

    function startMathGame() {
        mathQuestionArea.innerHTML = '';
        mathOptionsArea.innerHTML = '';
        mathLevelDisplay.textContent = mathLevel;
        
        const maxNumber = mathLevel + 3; // レベルに応じて数が増える
        const num1 = Math.floor(Math.random() * maxNumber) + 1;
        const num2 = Math.floor(Math.random() * maxNumber) + 1;
        
        // 足し算または引き算をランダムに選択
        const operation = Math.random() < 0.5 ? '+' : '-';
        
        if (operation === '+') {
            mathCorrectAnswer = num1 + num2;
            mathQuestionArea.innerHTML = `🚗 ${num1} + 🚚 ${num2} = ?`;
        } else {
            // 引き算は正の結果になるよう調整
            const larger = Math.max(num1, num2);
            const smaller = Math.min(num1, num2);
            mathCorrectAnswer = larger - smaller;
            mathQuestionArea.innerHTML = `🚗 ${larger} - 🚚 ${smaller} = ?`;
        }

        const options = generateMathOptions(mathCorrectAnswer);
        options.forEach(option => {
            const button = document.createElement('button');
            button.textContent = option;
            button.className = 'colorful-number';
            button.addEventListener('click', () => checkMathAnswer(option));
            mathOptionsArea.appendChild(button);
        });
    }

    function generateMathOptions(correct) {
        const options = [correct];
        while (options.length < 4) {
            const wrongOption = Math.max(0, correct + Math.floor(Math.random() * 6) - 3);
            if (!options.includes(wrongOption)) {
                options.push(wrongOption);
            }
        }
        return options.sort(() => Math.random() - 0.5);
    }

    function checkMathAnswer(selectedOption) {
        if (selectedOption === mathCorrectAnswer) {
            const message = successMessages[Math.floor(Math.random() * successMessages.length)];
            showFeedback(true, message);
            playMelody('correct');
            createCelebrationStars();
            mathLevel++;
            setTimeout(startMathGame, 1500);
        } else {
            const message = encourageMessages[Math.floor(Math.random() * encourageMessages.length)];
            showFeedback(false, message);
            playMelody('incorrect');
        }
    }

    // --- お祝いエフェクト ---
    function createCelebrationStars() {
        for (let i = 0; i < 8; i++) {
            const star = document.createElement('div');
            star.textContent = '⭐';
            star.className = 'celebration-star';
            star.style.left = Math.random() * window.innerWidth + 'px';
            star.style.top = Math.random() * window.innerHeight + 'px';
            document.body.appendChild(star);
            
            setTimeout(() => {
                if (star.parentNode) {
                    star.parentNode.removeChild(star);
                }
            }, 1000);
        }
    }

    // --- 共通のフィードバック機能 ---
    function showFeedback(isCorrect, message) {
        feedbackIcon.textContent = isCorrect ? '😊' : '🤔';
        feedbackText.textContent = message;
        if (isCorrect) {
            feedbackText.style.color = 'green';
        } else {
            feedbackText.style.color = 'red';
        }
        feedbackOverlay.classList.remove('hidden');

        setTimeout(() => {
            feedbackOverlay.classList.add('hidden');
        }, 1200);
    }

    // --- 楽しい音楽機能 ---
    let audioContext;
    try {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
        console.error('Web Audio API is not supported in this browser');
    }

    function playMelody(type) {
        if (!audioContext) return;

        const notes = {
            'correct': [
                { freq: 523.25, time: 0.0 },   // C5
                { freq: 659.25, time: 0.15 },  // E5
                { freq: 783.99, time: 0.3 },   // G5
                { freq: 1046.5, time: 0.45 }   // C6
            ],
            'incorrect': [
                { freq: 349.23, time: 0.0 },   // F4
                { freq: 329.63, time: 0.2 },   // E4
                { freq: 293.66, time: 0.4 }    // D4
            ]
        };

        const melody = notes[type] || notes['correct'];
        
        melody.forEach(note => {
            setTimeout(() => {
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();

                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);

                oscillator.frequency.value = note.freq;
                oscillator.type = 'sine';

                gainNode.gain.setValueAtTime(0, audioContext.currentTime);
                gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.01);
                gainNode.gain.exponentialRampToValueAtTime(0.00001, audioContext.currentTime + 0.15);

                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.15);
            }, note.time * 1000);
        });
    }
});
