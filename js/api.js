import {WORKER_URL} from "./config.js";
import cookies from "./cookies.js";


async function api(endpoint, method = "GET", body = undefined) {
    const result = (await fetch(`${WORKER_URL}${endpoint}`, {
        method,
        body: (body === undefined) ? body : JSON.stringify(body),
        headers: {
            authorization: `Bearer ${cookies.get("CF_Authorization")}`,
            'content-type': (body === undefined) ? undefined : 'application/json'
        }
    }));

    return result.status === 201 ? undefined : result.json();
}

/**
 * @return {Promise<Map<string,Email>>}
 */
export async function getEmails() {
    const ids = await api("/mail");
    return new Map(await Promise.all(ids.map(async (id) => [id, await getEmail(id)])));
}


/**
 * @return {Promise<Email>}
 */
export async function getEmail(id) {
    return await api(`/mail/${id}`);
}

/**
 * @param {OutgoingBody} conts
 * @return {Promise<void>}
 */
export async function sendEmail(conts) {
    await api(`/outgoing`, 'POST', conts);
}
