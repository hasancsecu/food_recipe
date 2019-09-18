export default class Likes {
    constructor() {
        this.likes = [];
    }
    addLikes(id, title, publisher, img) {
        const like = {
            id,
            title,
            publisher,
            img
        };
        this.likes.push(like);
        this.presisData();
        return like;

    }
    deleteLikes(id) {
        const index = this.likes.findIndex(el => el.id === id);
        this.likes.splice(index, 1);
        this.presisData();
    }
    isLiked(id) {
        return this.likes.findIndex(el => el.id === id) !== -1;
    }
    countLike() {
        return this.likes.length;
    }
    presisData() {
        localStorage.setItem('likes', JSON.stringify(this.likes));
    }
    readStorage() {
        const storage = JSON.parse(localStorage.getItem('likes'));
        if (storage) this.likes = storage;
    }
}