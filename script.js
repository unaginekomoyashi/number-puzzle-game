document.addEventListener('DOMContentLoaded', () => {
    const menuScreen = document.getElementById('menu-screen');
    const countGameScreen = document.getElementById('count-game-screen');
    const orderGameScreen = document.getElementById('order-game-screen');

    const startCountGameBtn = document.getElementById('start-count-game');
    const startOrderGameBtn = document.getElementById('start-order-game');
    const backToMenuBtns = document.querySelectorAll('.back-to-menu');

    const screens = [menuScreen, countGameScreen, orderGameScreen];

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
    let countLevel = 1;
    let orderLevel = 1;

    // --- かずをかぞえようゲームのロジック ---
    const countQuestionArea = document.getElementById('count-question-area');
    const countOptionsArea = document.getElementById('count-options-area');
    const vehicles = ['🚗', '🚌', '🚚', '🚓', '🚑'];
    let countCorrectAnswer = 0;

    function startCountGame() {
        countQuestionArea.innerHTML = '';
        countOptionsArea.innerHTML = '';
        
        const maxItems = countLevel + 4; // レベルに応じて最大数が増える
        countCorrectAnswer = Math.floor(Math.random() * maxItems) + 1;
        
        const vehicleType = vehicles[Math.floor(Math.random() * vehicles.length)];
        for (let i = 0; i < countCorrectAnswer; i++) {
            const vehicleElement = document.createElement('div');
            vehicleElement.textContent = vehicleType;
            vehicleElement.style.fontSize = '50px';
            vehicleElement.style.margin = '10px';
            countQuestionArea.appendChild(vehicleElement);
        }

        const options = generateCountOptions(countCorrectAnswer, maxItems);
        options.forEach(option => {
            const button = document.createElement('button');
            button.textContent = option;
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
            showFeedback(true, 'せいかい！');
            playSound('correct');
            countLevel++;
            setTimeout(startCountGame, 1500);
        } else {
            showFeedback(false, 'ちがうよ');
            playSound('incorrect');
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
            trainCar.classList.add('train-car');
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
                showFeedback(true, 'よくできました！');
                playSound('correct');
                orderLevel++;
                setTimeout(startOrderGame, 1500);
            } else {
                showFeedback(false, 'じゅんばんが ちがうよ');
                playSound('incorrect');
                setTimeout(startOrderGame, 1500);
            }
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

    // --- サウンド機能 ---
    let audioContext;
    try {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
        console.error('Web Audio API is not supported in this browser');
    }

    function playSound(type) {
        if (!audioContext) return;

        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.5, audioContext.currentTime + 0.01);

        if (type === 'correct') {
            oscillator.frequency.value = 800;
            oscillator.type = 'sine';
        } else if (type === 'incorrect') {
            oscillator.frequency.value = 200;
            oscillator.type = 'square';
        }

        oscillator.start(audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.00001, audioContext.currentTime + 0.5);
        oscillator.stop(audioContext.currentTime + 0.5);
    }
});
