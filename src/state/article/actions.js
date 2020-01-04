import EndpointConstants from '../../constants/EndpointConstants';
import types from './types';
import { unauthorized } from '../httpClient';

function updateAsync(isLoading, error = null) {
    return {
        type: types.ARTICLE_ASYNC,
        data: {
            isLoading,
            error
        }
    };
}

function articlesLoaded(articles) {
    return {
        type: types.ARTICLE_LIST,
        data: {
            articles
        }
    };
}

export function loadArticles(options) {
    return async dispatch => {
        dispatch(updateAsync(true, null));
        try {
            const { method, path } = EndpointConstants.ARTICLE_LIST;
            const articles = await unauthorized({
                method,
                path: path(options)
            });
            dispatch(articlesLoaded(articles));
            dispatch(updateAsync(false, null));
        } catch (e) {
            dispatch(updateAsync(false, e));
        }
    };
}
