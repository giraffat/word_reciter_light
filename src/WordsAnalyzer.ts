import Word from './Word';

export default class WordsAnalyzer {
    static async WordsText(wordsRequestInfo: RequestInfo) {
        const wordsTextResponse = await fetch(wordsRequestInfo);
        return await wordsTextResponse.text();
    }

    static async analyzeWords(wordsText: String) {
        const words: Word[] = [];
        for (const line of wordsText.split(new RegExp("\\(\\d+?\\)"))) {
            const phraseMatch = line.match("((?! )(([a-z ]+)(?<! ))) ([\u4e00-\u9fa5；]+)")
            if (phraseMatch != null){
                console.log(phraseMatch)
                words.push(new Word(phraseMatch!![3], "", phraseMatch!![4]))
                continue
            }

            const wordMatch = line.replace("\r\n", "").match("([a-z]+) (/.+/) (([a-z]+\\.) (.+) {0,1})+");
            if (wordMatch != null){
                words.push(new Word(wordMatch!![1], wordMatch!![2], wordMatch!![3]));
            }
        }
        return words;
    }
}