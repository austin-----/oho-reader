import 'whatwg-fetch';
import {
    time2Str,
    url2Real,
    wordCount2Str
} from './index.js';

export const searchBook = (name) => {
    return fetch(`/api/book/fuzzy-search?query=${name}&start=0`)
        .then(res => res.json())
        .then(data => {
            data.books.map((item) => { item.cover = url2Real(item.cover) })
            return data;
        });
}

export const getBookDetails = (id) => {
    return fetch(`/api/book/${id}`)
        .then(res => res.json())
        .then(data => {
            data.cover = url2Real(data.cover);
            data.wordCount = wordCount2Str(data.wordCount);
            data.updated = time2Str(data.updated);
            return data;
        });
}

export const getBookSources = (id) => {
    return fetch(`/api/toc?view=summary&book=${id}`)
        .then(res => res.json());
}

export const getBookSourceId = (id) => {
    return getBookSources(id)
        .then(data => {
            let sourceId = data.length > 1 ? data[1]._id : data[0]._id;
            for (let item of data) {
                if (item.source === 'my176') {
                    sourceId = item._id;
                }
            }
            return sourceId;
        });
}

export const getBookChapters = (sourceId) => {
    return fetch(`/api/toc/${sourceId}?view=chapters`)
        .then(res => res.json());
}

export const getBookChapterContent = (link) => {
    return fetch(`/chapter/${encodeURIComponent(link)}?k=2124b73d7e2e1945&t=1468223717`)
        .then(res => res.json())
}