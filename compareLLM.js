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

function levenshteinDistance(a, b) {
  const matrix = [];

  // Initialize the matrix
  for (let i = 0; i <= a.length; i++) {
    matrix[i] = [];
    for (let j = 0; j <= b.length; j++) {
      matrix[i][j] = 0;
    }
  }

  // Base case initialization
  for (let i = 0; i <= a.length; i++) {
    matrix[i][0] = i; // Cost of deleting all characters from a
  }
  for (let j = 0; j <= b.length; j++) {
    matrix[0][j] = j; // Cost of inserting all characters from b
  }

  // Populate the matrix
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,     // deletion
        matrix[i][j - 1] + 1,     // insertion
        matrix[i - 1][j - 1] + (a[i-1] === b[j-1] ? 0 : 1)  // substitution
      );
    }
  }

  // Return the Levenshtein distance, which is
  // located in the bottom-right corner of the matrix
  return matrix[a.length][b.length];
}


// два текста с небольшими отличиями, нагенерированные LLM
var text1 = "Но солнечный луч танцевал на полированной столешнице, освещая крошку от только что съеденного круассана.";
var text11 = "Солнечный луч скользил по полированной столешнице, освещая крошку от съеденного круассана."
var text2 = "Машина летела по трассе и не хотела останавливаться. Все были в ужасе и не знали, что же делать.";

var text1Normalized = textNormalization(text1);
var text11Normalized = textNormalization(text11);
var text2Normalized = textNormalization(text2);

var text1Ngrams = textToNgrams(text1Normalized);
var text11Ngrams = textToNgrams(text11Normalized);
var text2Ngrams = textToNgrams(text2Normalized);

// var text1List = text1Normalized.split(" ");
// var text2List = text2Normalized.split(" ");

function calculateMean(arr) {
  if (arr.length === 0) {
    return 0; // Handle empty array case
  }
  let sum = 0;
  for (const number of arr) {
    sum += number;
  }
  return sum / arr.length;
}

function calcAvgLevenshtein(text1, text2) {
    var lev = []
    for (var elem1 = 0; elem1 < text1.length; elem1++) {
        for (var elem2 = 0; elem2 < text2.length; elem2++) {
                lev.push(levenshteinDistance(text1[elem1].join(" "), text2[elem2].join(" ")))
        }
    }
    return lev
}

console.log(calculateMean(calcAvgLevenshtein(text1Ngrams, text2Ngrams)))
console.log(calculateMean(calcAvgLevenshtein(text1Ngrams, text11Ngrams)))
