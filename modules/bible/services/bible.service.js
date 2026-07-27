import bibleRepository from "../repositories/bible.repository.js"


class BibleService {
    getBooks(){
        return bibleRepository.getBooks()
    }
}

export default new BibleService();