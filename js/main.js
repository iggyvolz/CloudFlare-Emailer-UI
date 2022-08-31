import router from "./router.js";
import {getEmail, getEmails, sendEmail} from "./api.js";
router(new Map([
    [/^\/$/, async () => {
        const emails = await getEmails();
        const newLink = document.body.appendChild(document.createElement("a"));
        newLink.innerText = "Compose email";
        newLink.href = "/new";
        const ul = document.body.appendChild(document.createElement("ul"));
        emails.forEach((email, id) => {
            const from = email.headers.from;
            const subject = email.headers.subject;
            const a = ul.appendChild(document.createElement("a"));
            a.href = `/m/${id}`;
            const li = a.appendChild(document.createElement("li"));
            li.innerText = `From: ${from} ${subject}`
        });
    }],
    [/^\/m\/([A-Z0-9]+)$/, async x => {
        const [_, id] = x
        const email = await getEmail(id)
        const back = document.body.appendChild(document.createElement("a"));
        back.href = "/";
        back.innerText = "<- Back";
        const from = document.body.appendChild(document.createElement("p"));
        from.innerText = `From: ${email.headers.from}`
        const date = document.body.appendChild(document.createElement("p"));
        date.innerText = `Date: ${email.headers.date}`
        const subject = document.body.appendChild(document.createElement("p"));
        subject.innerText = `Subject: ${email.headers.subject}`
        const iframe = document.body.appendChild(document.createElement("iframe"));
        iframe.style.width = "100%";
        iframe.style.maxHeight = "100%";
        iframe.srcdoc = email.html;
        iframe.addEventListener("load", () => {
            iframe.style.height=(iframe.contentWindow.document.body.scrollHeight+20)+'px';
        })
    }],
    /*

interface OutgoingBody
{
    to: string;
    toName?: string;
    subject: string;
    body: string;
}
     */
    [/^\/new$/, async () => {
        const form = document.body.appendChild(document.createElement("form"));
        ["to", "toName", "subject"].forEach(name => {
            const p = form.appendChild(document.createElement("p"));
            const label = p.appendChild(document.createElement("label"));
            label.innerText = name + ": ";
            const element = label.appendChild(document.createElement("input"));
            element.name = name;
        })
        const body = form.appendChild(document.createElement("textarea"));
        body.name = "body";
        const buttonWrapper = form.appendChild(document.createElement("p"));
        const submit = buttonWrapper.appendChild(document.createElement("button"));
        submit.innerText = "Send";
        submit.onclick = async e => {
            e.preventDefault();
            const formData = Object.fromEntries(new FormData(form))
            await sendEmail(formData);
            location.href = "/"
        }
    }]
]));
