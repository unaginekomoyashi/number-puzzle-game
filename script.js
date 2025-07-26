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

    // --- かずをかぞえようゲームのロジック ---
    const countQuestionArea = document.getElementById('count-question-area');
    const countOptionsArea = document.getElementById('count-options-area');
    const feedbackArea = document.getElementById('feedback-area');

    // 仮の乗り物リスト（後で画像に差し替えます）
    const vehicles = ['🚗', '🚌', '🚚', '🚓', '🚑'];
    let correctAnswer = 0;

    function startCountGame() {
        // エリアをクリア
        countQuestionArea.innerHTML = '';
        countOptionsArea.innerHTML = '';
        feedbackArea.innerHTML = '';

        // 1から5までのランダムな数を正解とする
        correctAnswer = Math.floor(Math.random() * 5) + 1;
        
        // ランダムな乗り物を正解の数だけ表示
        const vehicleType = vehicles[Math.floor(Math.random() * vehicles.length)];
        for (let i = 0; i < correctAnswer; i++) {
            const vehicleElement = document.createElement('div');
            vehicleElement.textContent = vehicleType;
            vehicleElement.style.fontSize = '50px';
            vehicleElement.style.margin = '10px';
            countQuestionArea.appendChild(vehicleElement);
        }

        // 選択肢を作成
        const options = generateOptions(correctAnswer);
        options.forEach(option => {
            const button = document.createElement('button');
            button.textContent = option;
            button.addEventListener('click', () => checkAnswer(option));
            countOptionsArea.appendChild(button);
        });
    }

    function generateOptions(correct) {
        const options = [correct];
        while (options.length < 4) {
            const wrongOption = Math.floor(Math.random() * 5) + 1;
            if (!options.includes(wrongOption)) {
                options.push(wrongOption);
            }
        }
        // 選択肢をシャッフル
        return options.sort(() => Math.random() - 0.5);
    }

    function checkAnswer(selectedOption) {
        if (selectedOption === correctAnswer) {
            feedbackArea.textContent = 'せいかい！ 🎉';
            feedbackArea.style.color = 'green';
            // 1.5秒後に次の問題へ
            setTimeout(startCountGame, 1500);
        } else {
            feedbackArea.textContent = 'ちがうよ、もういちど かんがえてみよう 🤔';
            feedbackArea.style.color = 'red';
        }
    }

    // --- すうじをならべようゲームのロジック ---
    const orderPuzzleArea = document.getElementById('order-puzzle-area');
    const orderTargetArea = document.getElementById('order-target-area');
    let draggedItem = null;

    function startOrderGame() {
        orderPuzzleArea.innerHTML = '';
        orderTargetArea.innerHTML = '';
        feedbackArea.innerHTML = '';

        const numbers = [1, 2, 3, 4];
        const shuffledNumbers = [...numbers].sort(() => Math.random() - 0.5);

        // ドロップ先の線路を作成
        numbers.forEach(num => {
            const dropZone = document.createElement('div');
            dropZone.classList.add('train-car');
            dropZone.style.backgroundColor = '#eee';
            dropZone.dataset.correctNumber = num;
            orderTargetArea.appendChild(dropZone);

            dropZone.addEventListener('dragover', (e) => {
                e.preventDefault();
            });

            dropZone.addEventListener('drop', (e) => {
                e.preventDefault();
                if (draggedItem && dropZone.children.length === 0) {
                    dropZone.appendChild(draggedItem);
                    checkOrder();
                }
            });
        });

        // ドラッグする数字の電車を作成
        shuffledNumbers.forEach(num => {
            const trainCar = document.createElement('div');
            trainCar.textContent = num;
            trainCar.classList.add('train-car');
            trainCar.draggable = true;
            trainCar.dataset.number = num;
            orderPuzzleArea.appendChild(trainCar);

            trainCar.addEventListener('dragstart', (e) => {
                draggedItem = e.target;
            });
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
            } else {
                isCorrect = false; // まだ全部埋まっていない
            }
        });

        if (filledZones === 4 && isCorrect) {
            feedbackArea.textContent = 'せいかい！よくできました！ 🚂';
            feedbackArea.style.color = 'green';
            setTimeout(startOrderGame, 2000);
        }
    }
});
