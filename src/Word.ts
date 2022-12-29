export default class Word {
    constructor(public readonly name: string, public readonly ipa: string, public readonly definitions: string, public needReview = true) {
    }
}
