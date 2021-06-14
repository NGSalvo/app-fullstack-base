interface GETResponseListener {
    handleGETResponse(status: number, response: string): void;
}

interface POSTResponseListener {
    handlePOSTResponse(status: number, response: string): void;
}

class MyFramework {
    constructor(){}

    getElementById(elementId: string): HTMLElement {
        return document.getElementById(elementId)
    }

    getElementByEvent(event: Event): HTMLElement {
        return event.target as HTMLElement;
    }

    requestGET(url: string, listener: GETResponseListener) {
        let xhr: XMLHttpRequest;
        xhr = new XMLHttpRequest();
        xhr.onreadystatechange = () => {
            if(xhr.readyState === 4) {
                if(xhr.status === 200) {
                    listener.handleGETResponse(xhr.status, xhr.responseText);
                } else {
                    listener.handleGETResponse(xhr.status, null);
                }
            }
        }
        xhr.open('GET', url, true);
        xhr.send(null);
    }

    requestPost(url: string, data: object, listener: POSTResponseListener) {
        let xhr: XMLHttpRequest;
        xhr = new XMLHttpRequest();
        xhr.onreadystatechange = () => {
            if(xhr.readyState === 4) {
                if(xhr.status === 200) {
                    listener.handlePOSTResponse(xhr.status, xhr.responseText);
                } else {
                    listener.handlePOSTResponse(xhr.status, null);
                }
            }
        }
        xhr.open('POST', url);
        // xhr.send(null);

        // envio JSON en body de request (NodeJS)
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhr.send(JSON.stringify(data));
        console.log(`Lo que se envia como BODY: ${JSON.stringify(data)}`)

        // envio Formdata en body de request (Apache, PythonWS, etc)
        // let formData: FormData = new FormData();
        // for (let key in data) {
        //     formData.append(key, data[key]);
        // }
        // xhr.send(formData);

    }
}