// обозначение функций, которые нужно дописать для полноценной работы
function tagsRemoval(text) {
    // нужна функция для удаления тэгов docx/pdf
    return text
}

function OCR(pdf) {
    // нужна реализация OCR
    var text = pdf
    return text
}


// вспомогательные функции
function isArraysEqual(firstArray, secondArray) { 
    return firstArray.toString() === secondArray.toString(); 
}

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

// ngramSize — размер "окна", то есть, количество слов, которое будет в одной группе
function textToNgrams(normalizedText, ngramSize = 10, hopLength = 1) {
    var textSplit = normalizedText.split(" ");
    var ngramGroupsAmount = textSplit.length / ngramSize;
    // в хвосте может может оставаться n-грамма с меньшим числом элементов
    ngramGroupsAmount = Math.ceil(ngramGroupsAmount);
    
    var start = 0;
    var ngramGroups = [];
    for (var i = 0; i < ngramGroupsAmount; i++) {
        var ngram = textSplit.slice(start, start + ngramSize);
        ngramGroups.push(ngram)
        start += hopLength
    }
    return ngramGroups
}

function compareStrings(oldText, newText) {
    // Разбиваем на строки
    const oldLines = oldText.split(" ");
    const newLines = newText.split(" ");
    
    // Создаем Set для быстрого поиска (аналог THashedStringList)
    const oldLinesSet = new Set(oldLines);
    
    // Находим строки, которые есть в новом, но отсутствуют в старом
    const resultLines = newLines.filter(line => {
        return !oldLinesSet.has(line) && line.trim() !== '';
    });
    
    return resultLines.join('\n');
}


function diffText(text1, text2) {
    var wordText1 = text1[0];
    var wordText2 = text2[0];
    
    var countShift = 0
    while (wordText1 != wordText2) {

        countShift++
    }
    return countShift
}


function longestSubsequence(oldTextNgram, newTextNgram) {
    var sameNgramIdxOne = [];
    var sameNgramIdxTwo = [];
    for (var ngramTextOne = 0; ngramTextOne < oldTextNgram.length; ngramTextOne++) {
        for (var ngramTextTwo = 0; ngramTextTwo < newTextNgram.length; ngramTextTwo++) {
            if (isArraysEqual(oldTextNgram[ngramTextOne], newTextNgram[ngramTextTwo])) {
                sameNgramIdxOne.push(ngramTextOne);
                sameNgramIdxTwo.push(ngramTextTwo);
            }
        }
    }
    var idealText1 = [...Array(oldTextNgram.length).keys()];
    var diffNgramIdxOne = idealText1.filter(item => !sameNgramIdxOne.includes(item));

    var idealText2 = [...Array(newTextNgram.length).keys()];
    var diffNgramIdxTwo = idealText2.filter(item => !sameNgramIdxTwo.includes(item));

    // return [sameNgramIdxOne, sameNgramIdxTwo]
    return [diffNgramIdxOne, diffNgramIdxTwo]
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

var text1Ngrams = textToNgrams(text1Normalized);
var text2Ngrams = textToNgrams(text2Normalized);

// console.log(compareStrings(text11Normalized, text1Normalized))
// console.log(compareStrings(text1Normalized, text11Normalized))

// console.log(text11Ngrams[0], text11Ngrams[1], text11Ngrams[2], text11Ngrams[3])
// console.log(text1Ngrams[0], text1Ngrams[1], text1Ngrams[2])

console.table(longestSubsequence(text1Ngrams, text2Ngrams))

console.log(compareStrings(text1Normalized, text2Normalized))
