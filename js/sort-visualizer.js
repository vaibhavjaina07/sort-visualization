// Sort Visualization JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Configuration
    const container = document.getElementById('array-container');
    const generateNewArrayBtn = document.getElementById('generate-array');
    const bubbleSortBtn = document.getElementById('bubble-sort');
    const quickSortBtn = document.getElementById('quick-sort');
    const mergeSortBtn = document.getElementById('merge-sort');
    const speedRange = document.getElementById('speed-range');
    const sizeRange = document.getElementById('size-range');
    
    // Variables
    let array = [];
    let arrayBars = [];
    let animationSpeed = 100 - speedRange.value; // Invert so higher value = faster
    let arraySize = sizeRange.value;
    let isSorting = false;
    
    // Initialize
    generateNewArray();
    
    // Event Listeners
    generateNewArrayBtn.addEventListener('click', function() {
        if (!isSorting) {
            generateNewArray();
        }
    });
    
    bubbleSortBtn.addEventListener('click', function() {
        if (!isSorting) {
            isSorting = true;
            disableButtons(true);
            bubbleSort();
        }
    });
    
    quickSortBtn.addEventListener('click', function() {
        if (!isSorting) {
            isSorting = true;
            disableButtons(true);
            quickSort();
        }
    });
    
    mergeSortBtn.addEventListener('click', function() {
        if (!isSorting) {
            isSorting = true;
            disableButtons(true);
            mergeSort();
        }
    });
    
    speedRange.addEventListener('input', function() {
        animationSpeed = 100 - this.value;
    });
    
    sizeRange.addEventListener('input', function() {
        if (!isSorting) {
            arraySize = this.value;
            generateNewArray();
        }
    });
    
    // Functions
    function generateNewArray() {
        container.innerHTML = '';
        array = [];
        arrayBars = [];
        
        for (let i = 0; i < arraySize; i++) {
            array.push(randomIntFromInterval(5, 100));
        }
        
        for (let i = 0; i < array.length; i++) {
            const bar = document.createElement('div');
            bar.classList.add('array-bar');
            bar.style.height = `${array[i]}%`;
            container.appendChild(bar);
            arrayBars.push(bar);
        }
    }
    
    function randomIntFromInterval(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
    
    function disableButtons(disable) {
        generateNewArrayBtn.disabled = disable;
        bubbleSortBtn.disabled = disable;
        quickSortBtn.disabled = disable;
        mergeSortBtn.disabled = disable;
        sizeRange.disabled = disable;
    }
    
    // Bubble Sort Implementation
    async function bubbleSort() {
        const n = array.length;
        
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n - i - 1; j++) {
                // Change color to indicate comparison
                arrayBars[j].style.backgroundColor = '#FF4136';
                arrayBars[j + 1].style.backgroundColor = '#FF4136';
                
                await new Promise(resolve => setTimeout(resolve, animationSpeed));
                
                if (array[j] > array[j + 1]) {
                    // Swap
                    [array[j], array[j + 1]] = [array[j + 1], array[j]];
                    arrayBars[j].style.height = `${array[j]}%`;
                    arrayBars[j + 1].style.height = `${array[j + 1]}%`;
                    
                    await new Promise(resolve => setTimeout(resolve, animationSpeed));
                }
                
                // Reset color
                arrayBars[j].style.backgroundColor = '#2563eb';
                arrayBars[j + 1].style.backgroundColor = '#2563eb';
            }
            
            // Mark sorted element
            arrayBars[n - i - 1].style.backgroundColor = '#10b981';
        }
        
        sortingComplete();
    }
    
    // Quick Sort Implementation
    async function quickSort() {
        await quickSortHelper(0, array.length - 1);
        
        // Mark all bars as sorted
        for (let i = 0; i < arrayBars.length; i++) {
            arrayBars[i].style.backgroundColor = '#10b981';
            await new Promise(resolve => setTimeout(resolve, animationSpeed / 3));
        }
        
        sortingComplete();
    }
    
    async function quickSortHelper(start, end) {
        if (start >= end) return;
        
        let pivotIndex = await partition(start, end);
        
        // Mark pivot as positioned
        arrayBars[pivotIndex].style.backgroundColor = '#10b981';
        
        await Promise.all([
            quickSortHelper(start, pivotIndex - 1),
            quickSortHelper(pivotIndex + 1, end)
        ]);
    }
    
    async function partition(start, end) {
        // Select pivot (last element)
        const pivotValue = array[end];
        arrayBars[end].style.backgroundColor = '#8b5cf6';
        
        let pivotIndex = start;
        
        for (let i = start; i < end; i++) {
            // Highlight current comparison
            arrayBars[i].style.backgroundColor = '#FF4136';
            await new Promise(resolve => setTimeout(resolve, animationSpeed));
            
            if (array[i] < pivotValue) {
                // Swap elements
                [array[i], array[pivotIndex]] = [array[pivotIndex], array[i]];
                arrayBars[i].style.height = `${array[i]}%`;
                arrayBars[pivotIndex].style.height = `${array[pivotIndex]}%`;
                
                // Highlight swap
                arrayBars[pivotIndex].style.backgroundColor = '#FF851B';
                await new Promise(resolve => setTimeout(resolve, animationSpeed));
                
                // Reset color
                arrayBars[pivotIndex].style.backgroundColor = '#2563eb';
                pivotIndex++;
            }
            
            // Reset color
            arrayBars[i].style.backgroundColor = '#2563eb';
        }
        
        // Place pivot in correct position
        [array[pivotIndex], array[end]] = [array[end], array[pivotIndex]];
        arrayBars[pivotIndex].style.height = `${array[pivotIndex]}%`;
        arrayBars[end].style.height = `${array[end]}%`;
        
        // Reset pivot color
        arrayBars[end].style.backgroundColor = '#2563eb';
        
        return pivotIndex;
    }
    
    // Merge Sort Implementation
    async function mergeSort() {
        const animations = getMergeSortAnimations(array.slice());
        
        for (let i = 0; i < animations.length; i++) {
            const [type, idx1, idx2] = animations[i];
            
            if (type === 'compare') {
                // Comparison animation
                arrayBars[idx1].style.backgroundColor = '#FF4136';
                arrayBars[idx2].style.backgroundColor = '#FF4136';
                
                await new Promise(resolve => setTimeout(resolve, animationSpeed));
                
                arrayBars[idx1].style.backgroundColor = '#2563eb';
                arrayBars[idx2].style.backgroundColor = '#2563eb';
            } else {
                // Overwrite animation
                array[idx1] = idx2; // idx2 is the new height value
                arrayBars[idx1].style.height = `${idx2}%`;
                arrayBars[idx1].style.backgroundColor = '#FF851B';
                
                await new Promise(resolve => setTimeout(resolve, animationSpeed));
                
                arrayBars[idx1].style.backgroundColor = '#2563eb';
            }
        }
        
        // Mark all as sorted
        for (let i = 0; i < arrayBars.length; i++) {
            arrayBars[i].style.backgroundColor = '#10b981';
            await new Promise(resolve => setTimeout(resolve, animationSpeed / 3));
        }
        
        sortingComplete();
    }
    
    function getMergeSortAnimations(arr) {
        const animations = [];
        if (arr.length <= 1) return arr;
        const auxiliaryArray = arr.slice();
        mergeSortHelper(arr, 0, arr.length - 1, auxiliaryArray, animations);
        return animations;
    }
    
    function mergeSortHelper(mainArray, startIdx, endIdx, auxiliaryArray, animations) {
        if (startIdx === endIdx) return;
        const middleIdx = Math.floor((startIdx + endIdx) / 2);
        mergeSortHelper(auxiliaryArray, startIdx, middleIdx, mainArray, animations);
        mergeSortHelper(auxiliaryArray, middleIdx + 1, endIdx, mainArray, animations);
        doMerge(mainArray, startIdx, middleIdx, endIdx, auxiliaryArray, animations);
    }
    
    function doMerge(mainArray, startIdx, middleIdx, endIdx, auxiliaryArray, animations) {
        let k = startIdx;
        let i = startIdx;
        let j = middleIdx + 1;
        
        while (i <= middleIdx && j <= endIdx) {
            // Compare values
            animations.push(['compare', i, j]);
            
            if (auxiliaryArray[i] <= auxiliaryArray[j]) {
                // Overwrite value at index k with value at index i
                animations.push(['overwrite', k, auxiliaryArray[i]]);
                mainArray[k++] = auxiliaryArray[i++];
            } else {
                // Overwrite value at index k with value at index j
                animations.push(['overwrite', k, auxiliaryArray[j]]);
                mainArray[k++] = auxiliaryArray[j++];
            }
        }
        
        while (i <= middleIdx) {
            // Compare with itself (just for visualization)
            animations.push(['compare', i, i]);
            
            // Overwrite value at index k with value at index i
            animations.push(['overwrite', k, auxiliaryArray[i]]);
            mainArray[k++] = auxiliaryArray[i++];
        }
        
        while (j <= endIdx) {
            // Compare with itself (just for visualization)
            animations.push(['compare', j, j]);
            
            // Overwrite value at index k with value at index j
            animations.push(['overwrite', k, auxiliaryArray[j]]);
            mainArray[k++] = auxiliaryArray[j++];
        }
    }
    
    function sortingComplete() {
        isSorting = false;
        disableButtons(false);
    }
});
