//Ejercicio 9
interface DeviceInt {
    id: number;
    name: string;
    description: string;
    state: number;
    type: number;
}

// Ejercicio 10
class ViewMainPage {
    public myFramework: MyFramework = new MyFramework();
    showDevices(list: Array<DeviceInt>): void {
        // agregar elemento li al elemento ul de id "deviceList"
        // utilizar getelementbyid tdhe myframework
        // usar innerhtml
        // ejecutar metodo shwodecivec luego de parsear JSON
        let ul: HTMLElement = this.myFramework.getElementById('deviceList');
        
        // Vaciar lista
        while (ul.firstChild) {
            ul.removeChild(ul.firstChild);
        }

        // poblar lista
        list.forEach(device => {
            let element = document.createElement('li')
            let checked = !!device.state ? 'checked' : '';
            element.classList.add("collection-item", "avatar")

            element.innerHTML = `
                <img src="images/yuna.jpg" alt="" class="circle">
                <span class="title">${device.name}</span>
                <p>${device.description} <br>
                    ${device.type}
                </p>
                <div class="switch secondary-content">
                    <label>
                        Off
                        <input id="dev_${device.id}" type="checkbox" ${checked}>
                        <span class="lever"></span>
                        On
                    </label>
                </div>
            `;
            ul.appendChild(element)
        });
    }

    getSwitchStateById(id: string): boolean {
        let deviceSwitch: HTMLInputElement = this.myFramework.getElementById(id) as HTMLInputElement;
        return deviceSwitch.checked;
    }
}

class Main implements EventListenerObject, GETResponseListener, POSTResponseListener {
    public myFramework: MyFramework;
    public viewMainPage: ViewMainPage;
    constructor(){}

    main(): void {
        console.log('Mensaje del metodo main()')
        this.myFramework = new MyFramework();

        // Ejercicio 8
        this.myFramework.requestGET('./Devices.txt', this);

        this.viewMainPage = new ViewMainPage();
    }

    mostrarLista() {
        let usersList: Array<User> = new Array<User>()
        let user1: User = new User(1, 'a@a.com', true)
        let user2: User = new User(2, 'b@b.com', false)
        let user3: User = new User(3, 'c@c.com', true)

        usersList.push(user1)
        usersList.push(user2)
        usersList.push(user3)
        
        for(let user of usersList) {
            user.printInfo();
        }
    }
    
    // Ejercicio 4-2
    mostrarUsers(users: Array<User>): void {
        for( let user of users) {
            console.log(user);
        }
    }

    // Ejercicio 5
    evento(ev: Event): void {
        console.log('se hizo click!');
        console.log(this); // devuelve el nodo con el elemento boton
    }

    handleEvent(event: Event): void {
        console.log(this); // muestra el objeto instanciado
        console.log(event.target);
        
        // Ejercicio 7
        let boton: HTMLElement = this.myFramework.getElementByEvent(event);

        if(boton.textContent === 'Listar') {
            // this.mostrarLista();
            let xhr: XMLHttpRequest = new XMLHttpRequest();
            xhr.onreadystatechange = () => {
                if (xhr.readyState == 4) {
                    if (xhr.status == 200) {
                        console.log("Llego la respuesta!!!!");
                        console.log(xhr.responseText);
                        // let parrafo = this.myFramework.getElementById("lista");
                        // parrafo.innerHTML = xhr.responseText;
                        this.myFramework.requestGET("http://localhost:8000/devices/", this);
                    } else {
                        alert("error!!")
                    }
                    
                }
                
            }
            xhr.open("GET","http://localhost:8000/devices", true)
            xhr.send();
            return;
        } 
        if (boton.id.includes("dev_")){
            console.log(boton.id);
            let checked = this.viewMainPage.getSwitchStateById(boton.id);
            let state = checked ? 1 : 0;
            let id = boton.id.slice(4);
            this.myFramework.requestPost("http://localhost:8000/devices/", {id, state}, this);
            return;
        }

        else {
            alert('No hay funcion para ese boton');
        }
    }

    // Ejercicio 8
    handleGETResponse(status: number, response: string): void {
        if (status === 200) {
            // Ejercicio 9
            let data: DeviceInt[] = JSON.parse(response);
            // console.log(`Parsed response: ${JSON.stringify(data, null, 2)}`);
            this.viewMainPage.showDevices(data);
            
            let element: HTMLElement;
            data.forEach(data => {
                console.log(data);
                 element = this.myFramework.getElementById("dev_" + data.id);
                 element.addEventListener("click", this);
            })
            // let parrafo = this.myFramework.getElementById("lista");
            // parrafo.innerHTML = response;
        } else {
            console.log(`Status: ${status}`);
        }
    }

    handlePOSTResponse(status: number, response: string): void {
        alert(`status: ${status} - response: ${response}`);
    }

    
}




window.onload = function () {
    const main = new Main()
    // inicializo myFramework
    main.main();
    // main.mostrarLista();
    let usersList: Array<User> = new Array<User>()
    let user1: User = new User(1, 'a@a.com', true)
    let user2: User = new User(2, 'b@b.com', false)
    let user3: User = new User(3, 'c@c.com', true)

    usersList.push(user1)
    usersList.push(user2)
    usersList.push(user3)

    // Ejercicio 4-2
    // main.mostrarUsers(usersList);

    let btnListar: HTMLElement = main.myFramework.getElementById('btnListar');
    btnListar.textContent = 'Listar'
    let btnLimpiar: HTMLElement = main.myFramework.getElementById('btnLimpiar');
    btnLimpiar.textContent = 'Limpiar'

    // Ejercio 5
    // boton.addEventListener('click', main.evento);

    // Ejercicio 6
    btnListar.addEventListener('click', main);

    // Ejercicio 7
    btnLimpiar.addEventListener('click', main)

}

// window.addEventListener('load', function() {
//     main()
// }) Es lo mismo que con el atributo de window.onload