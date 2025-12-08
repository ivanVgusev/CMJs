// вспомогательные функции

// примитивная нормализация текста
function textNormalization(text) {
    var normalizedText;
    // удаление пунктуации
    normalizedText = text.replace(/[\p{P}\p{S}]/gu, "");
    // удаление двойных+ пробельных символов
    normalizedText = normalizedText.replace(/\s\s+/gu, " ");
    // unicode нормализация
    normalizedText.normalize("NFC");
    // приведение к нижнему регистру
    normalizedText = normalizedText.toLowerCase();

    return normalizedText
}


// сравнение массивов
function isArraysEqual(firstArray, secondArray) { 
    return firstArray.toString() === secondArray.toString(); 
}


// взвешенное сравнение массивов
function isArraysEqualWeighted(firstArray, secondArray) {
    // на значении == 95 результат идентичен простому сравнению isArrayEqual
    var threshold = 95
    var distance = arraysLevenshteinDistance(firstArray, secondArray);
    var maxLength = Math.max(firstArray.length, secondArray.length);
    
    if (maxLength === 0) return true;
    
    var similarity = (1 - distance / maxLength) * 100;
    return similarity >= threshold;
}


// Функция расстояния Левенштейна для массивов
function arraysLevenshteinDistance(arr1, arr2) {
    var m = arr1.length;
    var n = arr2.length;
    
    if (m === 0) return n;
    if (n === 0) return m;
    
    var dp = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));
    
    for (var i = 0; i <= m; i++) dp[i][0] = i;
    for (var j = 0; j <= n; j++) dp[0][j] = j;
    
    for (var i = 1; i <= m; i++) {
        for (var j = 1; j <= n; j++) {
            if (arr1[i - 1] === arr2[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1];
            } else {
                dp[i][j] = Math.min(
                    dp[i - 1][j] + 1,
                    dp[i][j - 1] + 1,
                    dp[i - 1][j - 1] + 1
                );
            }
        }
    }
    
    return dp[m][n];
}


// конвертер текст (строковый) -> чанки
// chunkSize — размер "окна", то есть, количество слов, которое будет в одной группе
// hopLength — размер сдвига (надежнее всего установить = 1)
function textToChunks(normalizedText, chunkSize = 10, hopLength = 1) {
    var textSplit = normalizedText.split(" ");
    var chunkGroups = [];
    
    // Используем цикл while, пока можем создать очередной чанк
    var start = 0;
    while (start + chunkSize <= textSplit.length) {
        var chunk = textSplit.slice(start, start + chunkSize);
        chunkGroups.push(chunk);
        start += hopLength;
    }
    
    // Добавляем последний неполный чанк
    if (start < textSplit.length) {
        var lastChunk = textSplit.slice(start);
        chunkGroups.push(lastChunk);
    }
    
    return chunkGroups;
}


// сравнение чанков
function compareChunks(chunksTextOne, chunksTextTwo, weighted=false) {
    // переключатель weighted/non-weighted (использовать взвешенное сравнение/простое)
    var comparisonFunc;
    if (weighted) {
        comparisonFunc = isArraysEqualWeighted
    } else {
        comparisonFunc = isArraysEqual
    }

    // индексы совпадающих чанков (считаем именно их, потому что при полном переборе индексы несовпадающих непоказательны) 
    var sameChunksIdxOne = [];
    var sameChunksIdxTwo = [];
    for (var chunkTextOne = 0; chunkTextOne < chunksTextOne.length; chunkTextOne++) {
        for (var chunkTextTwo = 0; chunkTextTwo < chunksTextTwo.length; chunkTextTwo++) {
            if (comparisonFunc(chunksTextOne[chunkTextOne], chunksTextTwo[chunkTextTwo])) {
                sameChunksIdxOne.push(chunkTextOne);
                sameChunksIdxTwo.push(chunkTextTwo);
            }
        }
    }
    // сравниваем с полным совпадениям (все индексы в массиве) и берем несовпадения
    var rangeTextOne = [...Array(chunksTextOne.length).keys()];
    var diffChunksIdxOne = rangeTextOne.filter(item => !sameChunksIdxOne.includes(item));

    // сравниваем с полным совпадениям (все индексы в массиве) и берем несовпадения
    var rangeTextTwo = [...Array(chunksTextTwo.length).keys()];
    var diffChunksIdxTwo = rangeTextTwo.filter(item => !sameChunksIdxTwo.includes(item));

    // объединяем
    var mergedUnique = new Set([...diffChunksIdxOne, ...diffChunksIdxTwo])
    return mergedUnique
}


// бьем на группы по изменениям
// (в contextLength можно задать размер окна для конкретной модели; еще лучше было бы реализовать обтекаемость по предложениям,
// то есть, чтобы группа не просто обрезалась на слове, а выбирала ближайшее полное предложение и как-то центрировалась 
// относительно изменений внутри для более полного ответа мождели)
function groupingDiffs(diffs, contextLength=100) {
    var groups = [];
    var newGroup = [];
    for (elem of diffs) {
        if (newGroup.length === 0) {
            newGroup.push(elem)
        } else {
            if (elem - newGroup[0] < contextLength) {
                newGroup.push(elem)
            } else {
            groups.push(newGroup);
            newGroup = [];
            }
        }
    }
    groups.push(newGroup)
    return groups
}


var fs = require('fs');

try {
    var text1 = fs.readFileSync('testTextOneCompareLLM.txt', 'utf8');
} catch (err) {
    console.error('Ошибка чтения файла:', err);
}

try {
    var text2 = fs.readFileSync('testTextTwoCompareLLM.txt', 'utf8');
} catch (err) {
    console.error('Ошибка чтения файла:', err);
}


var text1Normalized = textNormalization(text1);
var text2Normalized = textNormalization(text2);

var text1Chunks = textToChunks(text1Normalized);
var text2Chunks = textToChunks(text2Normalized);

var diffs = compareChunks(text1Chunks, text2Chunks, weighted=true);
var diffsWeighted = compareChunks(text1Chunks, text2Chunks, weighted=false);

var diffsGroups = groupingDiffs(diffs)

console.table(diffsGroups)
