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
function textToNgrams(normalizedText, ngramSize = 10) {
    var textSplit = normalizedText.split(" ");
    var ngramGroupsAmount = textSplit.length / ngramSize;
    // в хвосте может может оставаться n-грамма с меньшим числом элементов
    ngramGroupsAmount = Math.ceil(ngramGroupsAmount);
    
    var start = 0;
    var ngramGroups = [];
    for (var i = 0; i < ngramGroupsAmount; i++) {
        var ngram = textSplit.slice(start, start + ngramSize);
        ngramGroups.push(ngram)
        start += ngramSize
    }
    return ngramGroups
}

// возможные различия в файлах: 
// edit
// deletion
// inserion
function findDifference(ngramGroups1, ngramGroups2) {
    // var differentNgrams = {};
    // for (var i = 0; i < ngramGroups1.length; i++) {
    //     if (!isArraysEqual(ngramGroups1[i], ngramGroups2[i])) {
    //         differentNgrams[i] = [ngramGroups1[i], ngramGroups2[i]]
    //     }
    // }
    
    return differentNgrams
}

// два текста с небольшими отличиями, нагенерированные LLM
var text1 = "Солнечный луч танцевал на полированной столешнице, освещая крошку от только что съеденного круассана. Но здесь, в уютном полумраке кофейни, царили покой и аромат свежего кофе. Молодая женщина у окна смотрела на пару голубей, деливших брошенную булку. Ее ноутбук был закрыт, а блокнот лежал рядом нетронутый. Она просто наслаждалась редкой минутой бездумного отдыха. В этот момент дверь с колокольчиком распахнулась, впустив порцию свежего морского воздуха. Вошел мужчина в светлом свитере, огляделся и, улыбнувшись, направился к ее столику. «Можно?» — спросил он, и в его глазах читалась добрая, открытая уверенность. Она кивнула, и разговор завязался сам собой, легкий и непринужденный. Они говорили о книгах, о море и о том, как странно иногда встречаются родственные души. Когда он встал, чтобы заказать еще два капучино, она поймала себя на мысли, что это утро стало самым счастливым за долгие месяцы. За окном над гаванью ярко светило солнце, предвещая прекрасный день.";
var text2 = "Солнечный луч танцевал на полированной столешнице, освещая крошку от только что съеденного круассана. За окном кипела жизнь оживленной набережной, но здесь, в уютном полумраке кофейни, царили покой и аромат свежего кофе. Она наблюдала, как старик на скамейке кормит с руки наглых воробьев. Ее ноутбук был закрыт, а блокнот лежал рядом нетронутый. Она просто наслаждалась редкой минутой бездумного отдыха. Вдруг дверь с мелодичным звоном открылась, впустив шум прибоя и крики чаек. Вошел мужчина в светлом свитере, огляделся и, улыбнувшись, направился к ее столику. «Можно?» — спросил он, и в его глазах читалась добрая, открытая уверенность. Она сделала утвердительный жест, и слова потекли легко, будто они были старыми знакомыми. Они говорили о книгах, о море и о том, как странно иногда встречаются родственные души. Пока он шел к стойке, чтобы повторить заказ, она вдруг осознала, что давно не чувствовала такого безоблачного спокойствия. За окном над гаванью ярко светило солнце, предвещая прекрасный день.";

var text1Normalized = textNormalization(text1);
var text2Normalized = textNormalization(text2);

var text1Ngrams = textToNgrams(text1Normalized);
var text2Ngrams = textToNgrams(text2Normalized);

var diff = findDifference(text1Ngrams, text2Ngrams)
console.log(diff)
