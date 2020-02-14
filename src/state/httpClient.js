import { SERVER } from './config';

const buildUrl = (path, query) => `${SERVER}${path}${query || ''}`;
const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json'
};

function isJsonResponse(response) {
    const contentType = response.headers.get('content-type');
    return contentType && contentType.includes('application/json');
}

export async function unauthorized({
    path = '',
    method = '',
    body = undefined,
    query = undefined
}) {
    const response = await fetch(buildUrl(path, query), {
        method,
        headers,
        body
    });

    if (response.ok) {
        return isJsonResponse(response)
            ? response.json().then(data => data)
            : response;
    }

    if (isJsonResponse(response)) {
        throw await response.json();
    }

    throw response;
}
