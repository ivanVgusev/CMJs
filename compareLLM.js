var natural = require('natural');
var tokenizer = new natural.WordTokenizer();

function tagsRemoval(text) {
    // нужна функция для удаления тэгов docx/pdf
    return text
}

function OCR(pdf) {
    // нужна реализация OCR
    var text = pdf
    return text
}


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
function textToNgrams(normalizedText, ngramSize = 6, hopLength = 3) {
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

var text1 = "Но солнечный луч танцевал на полированной столешнице, освещая крошку от только что съеденного круассана.";
var text11 = "Солнечный луч скользил по полированной столешнице, освещая крошку от съеденного круассана."
var text2 = "Машина летела по трассе и не хотела останавливаться. Все были в ужасе и не знали, что же делать.";

var text1Normalized = textNormalization(text1);
var text11Normalized = textNormalization(text11);
var text2Normalized = textNormalization(text2);

var text1Ngrams = textToNgrams(text1Normalized);
var text11Ngrams = textToNgrams(text11Normalized);
var text2Ngrams = textToNgrams(text2Normalized);

console.log(compareStrings(text11Normalized, text1Normalized))
