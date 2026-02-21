        // DOM Elements
        const display = document.getElementById('display');
        const startBtn = document.getElementById('startBtn');
        const pauseBtn = document.getElementById('pauseBtn');
        const resetBtn = document.getElementById('resetBtn');
        const lapBtn = document.getElementById('lapBtn');
        const lapsList = document.getElementById('lapsList');
        const noLapsMessage = document.getElementById('noLapsMessage');
        
        // Stopwatch variables
        let startTime = 0;
        let elapsedTime = 0;
        let timerInterval = null;
        let isRunning = false;
        let lapTimes = [];
        let lastLapTime = 0;
        
        // Format time to HH:MM:SS
        function formatTime(timeInMilliseconds) {
            const totalSeconds = Math.floor(timeInMilliseconds / 1000);
            const hours = Math.floor(totalSeconds / 3600);
            const minutes = Math.floor((totalSeconds % 3600) / 60);
            const seconds = totalSeconds % 60;
            
            return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
        
        // Update the display
        function updateDisplay() {
            const currentTime = Date.now();
            elapsedTime = currentTime - startTime;
            display.textContent = formatTime(elapsedTime);
        }
        
        // Start the stopwatch
        function startTimer() {
            if (!isRunning) {
                isRunning = true;
                startTime = Date.now() - elapsedTime;
                timerInterval = setInterval(updateDisplay, 100);
                
                // Update button states
                startBtn.disabled = true;
                pauseBtn.disabled = false;
                resetBtn.disabled = false;
                lapBtn.disabled = false;
                
                startBtn.innerHTML = '<i class="fas fa-play"></i> Running';
            }
        }
        
        // Pause the stopwatch
        function pauseTimer() {
            if (isRunning) {
                isRunning = false;
                clearInterval(timerInterval);
                
                // Update button states
                startBtn.disabled = false;
                pauseBtn.disabled = true;
                startBtn.innerHTML = '<i class="fas fa-play"></i> Resume';
            }
        }
        
        // Reset the stopwatch
        function resetTimer() {
            isRunning = false;
            clearInterval(timerInterval);
            elapsedTime = 0;
            display.textContent = '00:00:00';
            lapTimes = [];
            lastLapTime = 0;
            
            // Update button states
            startBtn.disabled = false;
            pauseBtn.disabled = true;
            resetBtn.disabled = true;
            lapBtn.disabled = true;
            
            startBtn.innerHTML = '<i class="fas fa-play"></i> Start';
            
            // Clear laps display
            lapsList.innerHTML = '';
            lapsList.appendChild(noLapsMessage);
            noLapsMessage.style.display = 'block';
        }
        
        // Record a lap time
        function recordLap() {
            if (isRunning) {
                const currentTime = Date.now();
                const lapTime = currentTime - startTime;
                const lapDuration = lastLapTime === 0 ? lapTime : lapTime - lastLapTime;
                
                // Add lap to array
                lapTimes.unshift({
                    lapNumber: lapTimes.length + 1,
                    time: lapTime,
                    duration: lapDuration
                });
                
                lastLapTime = lapTime;
                
                // Update laps display
                updateLapsDisplay();
            }
        }
        
        // Update the laps display
        function updateLapsDisplay() {
            // Hide the no laps message
            noLapsMessage.style.display = 'none';
            
            // Clear current laps display (except header)
            const lapsHeader = lapsList.querySelector('.laps-header');
            lapsList.innerHTML = '';
            if (lapsHeader) {
                lapsList.appendChild(lapsHeader);
            } else {
                // Recreate header if it doesn't exist
                const newHeader = document.createElement('div');
                newHeader.className = 'laps-header';
                newHeader.innerHTML = '<span>Lap</span><span>Time</span><span>Duration</span>';
                lapsList.appendChild(newHeader);
            }
            
            // Add lap items
            lapTimes.forEach(lap => {
                const lapItem = document.createElement('div');
                lapItem.className = 'lap-item';
                
                // Determine fastest and slowest laps for highlighting
                let fastestLap = null;
                let slowestLap = null;
                
                if (lapTimes.length > 1) {
                    const durations = lapTimes.map(l => l.duration);
                    const minDuration = Math.min(...durations);
                    const maxDuration = Math.max(...durations);
                    
                    fastestLap = lapTimes.find(l => l.duration === minDuration);
                    slowestLap = lapTimes.find(l => l.duration === maxDuration);
                }
                
                // Apply color based on lap performance
                let lapDurationClass = '';
                if (lap === fastestLap) {
                    lapDurationClass = 'style="color: #96c93d;"';
                } else if (lap === slowestLap) {
                    lapDurationClass = 'style="color: #ff7e5f;"';
                }
                
                lapItem.innerHTML = `
                    <span class="lap-number">${lap.lapNumber}</span>
                    <span class="lap-time">${formatTime(lap.time)}</span>
                    <span class="lap-duration" ${lapDurationClass}>${formatTime(lap.duration)}</span>
                `;
                
                lapsList.appendChild(lapItem);
            });
            
            // Scroll to the top to see the latest lap
            lapsList.scrollTop = 0;
        }
        
        // Event listeners
        startBtn.addEventListener('click', startTimer);
        pauseBtn.addEventListener('click', pauseTimer);
        resetBtn.addEventListener('click', resetTimer);
        lapBtn.addEventListener('click', recordLap);
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (event) => {
            // Spacebar to start/pause
            if (event.code === 'Space') {
                event.preventDefault(); // Prevent spacebar from scrolling page
                if (isRunning) {
                    pauseTimer();
                } else {
                    startTimer();
                }
            }
            
            // 'L' key to record lap
            if (event.code === 'KeyL' && isRunning) {
                recordLap();
            }
            
            // 'R' key to reset
            if (event.code === 'KeyR' && !isRunning) {
                resetTimer();
            }
        });
        
        // Initialize the stopwatch
        resetTimer();