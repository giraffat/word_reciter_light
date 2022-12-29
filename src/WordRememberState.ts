import Word from "./Word";

export default class WordRememberState {
    private static words = new Map<Word, Boolean>()

    static setNeedReview(word: Word, value: Boolean) {
        this.words.set(word, value)
    }

    static NeedReview(word: Word){
        return this.words.get(word)
    }
}