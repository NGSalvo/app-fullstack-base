interface GETResponseListener {
  handleGETResponse(status: number, response: any): void;
}

interface POSTResponseListener {
  handlePOSTResponse(status: number, response: any): void;
}

interface DELETEResponseListener {
  handleDELETEResponse(status: number, response: any): void;
}

interface PUTResponseListener {
  handlePUTResponse(status: number, response: any): void;
}
class MyFramework {
  constructor() {}

  getElementById(elementId: string): HTMLElement {
    return document.getElementById(elementId);
  }

  getElementByEvent(event: Event): HTMLElement {
    return event.target as HTMLElement;
  }

  // Devuelve el elemento padre
  getElementParent(element: HTMLElement): HTMLElement {
    return element.parentElement;
  }

  // Elimina elementos hijos
  removeChildren(element: HTMLElement): void {
    while (element.lastChild) {
      element.removeChild(element.lastChild);
    }
  }

  requestGET(url: string, listener: GETResponseListener) {
    let xhr: XMLHttpRequest;
    xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          listener.handleGETResponse(xhr.status, xhr.response);
        } else {
          listener.handleGETResponse(xhr.status, null);
        }
      }
    };
    xhr.open('GET', url, true);
    xhr.send(null);
  }

  requestPOST(url: string, data: object, listener: POSTResponseListener) {
    let xhr: XMLHttpRequest;
    xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        if (xhr.status === 200 || xhr.status === 201) {
          listener.handlePOSTResponse(xhr.status, xhr.response);
        } else {
          listener.handlePOSTResponse(xhr.status, null);
        }
      }
    };
    xhr.open('POST', url);
    xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    xhr.send(JSON.stringify(data));
  }

  requestDELETE(url: string, listener: DELETEResponseListener) {
    let xhr: XMLHttpRequest;
    xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          listener.handleDELETEResponse(xhr.status, xhr.response);
        } else {
          listener.handleDELETEResponse(xhr.status, null);
        }
      }
    };
    xhr.open('DELETE', url, true);
    xhr.send(null);
  }

  requestPUT(url: string, data: object, listener: PUTResponseListener) {
    let xhr: XMLHttpRequest;
    xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          listener.handlePUTResponse(xhr.status, xhr.response);
        } else {
          listener.handlePUTResponse(xhr.status, null);
        }
      }
    };
    xhr.open('PUT', url);
    xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    xhr.send(JSON.stringify(data));
  }
}
