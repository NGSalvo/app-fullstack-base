type DeviceInt = {
  id?: string;
  name: string;
  description: string;
  state: number;
  type: number;
};

// Estados del formulario
type FormStatus = 'editing' | 'creating' | 'deleting' | 'none';

class Main
  implements
    EventListenerObject,
    GETResponseListener,
    POSTResponseListener,
    DELETEResponseListener,
    PUTResponseListener
{
  public myFramework: MyFramework;
  public viewMainPage: ViewMainPage;
  public formStatus: FormStatus = 'none';
  public currentDevice: DeviceInt = this.defaultDevice();
  public modalInstances;
  public selectInstances;
  private URI = 'http://localhost:8000/devices';
  public devices: Array<DeviceInt>;
  public elementListener = new WeakMap();
  constructor() {}

  main(): void {
    this.myFramework = new MyFramework();

    this.myFramework.requestGET(this.URI, this);

    this.viewMainPage = new ViewMainPage();

    const modals = document.querySelectorAll('.modal');
    this.modalInstances = M.Modal.init(modals, { dismissible: false });

    const comboboxes = document.querySelectorAll('select');
    this.selectInstances = M.FormSelect.init(comboboxes);
    comboboxes[0].addEventListener('change', this);
  }

  // Manejo de los eventos
  handleEvent(event: Event): void {
    // console.log(event.target);

    let element: HTMLElement = this.myFramework.getElementByEvent(event);

    // Evento del estado del dispositivo
    if (element.id.includes('status_')) {
      let type = element.getAttribute('type') === 'range' ? '1' : '0';
      let value: number | boolean;
      let state: number;
      if (type === '1') {
        value = this.viewMainPage.getRangeValueById(element.id);
      } else {
        value = this.viewMainPage.getSwitchStateById(element.id) ? 1 : 0;
      }
      state = value;
      let id = element.id.slice(7);
      console.log(state);
      this.myFramework.requestPUT(`${this.URI}/${id}`, { state }, this);
      this.currentDevice = this.devices.find((device) => device.id === id);
      this.currentDevice.state = state;
      this.updateDevice(id, this.currentDevice);
      console.log(this.devices);
      return;
    }

    // Evento del boton de editar
    if (element.classList.contains('edit_dev')) {
      // console.log('EDIT:', this.currentDevice);
      this.formStatus = 'editing';
      document.getElementById('modal1').querySelector('h4').textContent =
        'Editar dispositivo';
      let id = element.id.slice(5);
      this.myFramework.requestGET(`${this.URI}/${id}`, this);
      setTimeout(() => {
        this.setFormData();
        let type = this.currentDevice.type;
        this.viewMainPage.showModalComponentType(type, this.currentDevice);
      }, 200);
      return;
    }

    // Evento del boton de eliminar
    if (element.classList.contains('delete_dev')) {
      this.formStatus = 'deleting';
      let id = element.id.slice(7);
      this.currentDevice.id = id;
      return;
    }

    // Evento del boton de guardar (MODAL)
    if (element.classList.contains('btn-save')) {
      // Evento del boton guardar (MODAL) si esta editando
      if (this.formStatus === 'editing') {
        this.currentDevice = this.getFormData();
        let id = this.currentDevice.id;
        this.myFramework.requestPUT(
          `${this.URI}/${id}`,
          this.currentDevice,
          this,
        );
        this.updateDevice(id, this.currentDevice);
        this.clearForm();
      }
      // Evento del boton guardar (MODAL) si esta creando
      if (this.formStatus === 'creating') {
        this.currentDevice = this.getFormData();
        // console.log(this.currentDevice);
        this.myFramework.requestPOST(
          `${this.URI}/create`,
          this.currentDevice,
          this,
        );
        this.addNewDevice(this.currentDevice);
        this.clearForm();
      }

      // Evento del boton guardar (MODAL) si esta eliminando
      if (this.formStatus === 'deleting') {
        let id = this.currentDevice.id;
        this.myFramework.requestDELETE(`${this.URI}/${id}`, this);
        this.removeDevice(id);
        this.clearForm();
      }
      // Se renderiza los elementos creados, modificados u eliminados
      this.getDevices();
      return;
    }

    if (element.classList.contains('btn-cancel')) {
      this.clearForm();
      return;
    }

    if (element.textContent === 'add') {
      this.formStatus = 'creating';
      document.getElementById('modal1').querySelector('h4').textContent =
        'Crear dispositivo';
      return;
    }

    if (element.id === 'deviceType') {
      let type = +(
        this.myFramework.getElementById('deviceType') as HTMLSelectElement
      ).value;
      this.viewMainPage.showModalComponentType(type, this.currentDevice);
    }
  }

  // -------Manejo de AJAX-------
  handleGETResponse(status: number, response: any): void {
    let res = JSON.parse(response);
    if (status === 200) {
      let data: DeviceInt[] | DeviceInt = JSON.parse(response);
      if (Array.isArray(data)) {
        this.devices = data;
        this.viewMainPage.showDevices(data);

        let element: HTMLElement;
        data.forEach((data) => {
          element = this.myFramework.getElementById('dev_' + data.id);
          element.addEventListener('click', this);
        });
      } else {
        this.currentDevice = data;
      }
    }
    if (status === 404) {
      M.toast({ html: `${res.message}`, classes: 'toast-failure' });
    } else {
      console.log(`Error: ${status}`);
    }
  }

  handlePOSTResponse(status: number, response: any): void {
    let res = JSON.parse(response);
    if (status === 200 || status === 201) {
      M.toast({ html: `${res.message}`, classes: 'toast-success' });
    }
    if (status === 400) {
      M.toast({ html: `${res.message}`, classes: 'toast-failure' });
    } else {
      console.log(`Error: ${status}`);
    }
  }

  handleDELETEResponse(status: number, response: any): void {
    let res = JSON.parse(response);
    if (status === 200) {
      M.toast({ html: `${res.message}`, classes: 'toast-success' });
    }
    if (status === 404) {
      M.toast({ html: `${res.message}`, classes: 'toast-failure' });
    } else {
      console.log(`Error: ${status}`);
    }
  }

  handlePUTResponse(status: number, response: any): void {
    let res = JSON.parse(response);
    if (status === 200) {
      M.toast({ html: `${res.message}`, classes: 'toast-success' });
    }
    if (status === 404) {
      M.toast({ html: `${res.message}`, classes: 'toast-failure' });
    } else {
      console.log(`Error: ${status}`);
    }
  }
  // -------Fin manejo de AJAX-------

  // Devuelve un dispositivo con valores por defecto
  defaultDevice(): DeviceInt {
    return {
      name: '',
      description: '',
      state: 0,
      type: 0,
    };
  }

  // -------Manejo de formulario-------
  // Deja el formulario como estaba en un principio
  clearForm() {
    this.currentDevice = this.defaultDevice();
    this.setFormData();
    this.formStatus = 'none';
  }

  // Obtengo todos los datos del modal
  getFormData(): DeviceInt {
    let id = this.currentDevice.id;
    let name = (
      this.myFramework.getElementById('deviceName') as HTMLInputElement
    ).value;
    let description = (
      this.myFramework.getElementById('deviceDescription') as HTMLInputElement
    ).value;
    let type = +(
      this.myFramework.getElementById('deviceType') as HTMLSelectElement
    ).value;
    let state: number;
    if (type === 1) {
      state = state = (
        this.myFramework.getElementById('deviceState') as HTMLInputElement
      ).valueAsNumber;
    } else {
      state = (
        this.myFramework.getElementById('deviceState') as HTMLInputElement
      ).checked
        ? 1
        : 0;
    }

    return { id, name, description, state, type };
  }

  // Configuro todos los datos del modal
  setFormData() {
    // console.log('setFormData', this.currentDevice);
    (this.myFramework.getElementById('deviceName') as HTMLInputElement).value =
      this.currentDevice.name;
    (
      this.myFramework.getElementById('deviceDescription') as HTMLInputElement
    ).value = this.currentDevice.description;
    if (this.currentDevice.type === 1) {
      (this.myFramework.getElementById('deviceState') as HTMLInputElement)
        .valueAsNumber;
    } else {
      (
        this.myFramework.getElementById('deviceState') as HTMLInputElement
      ).checked = this.currentDevice.state === 0 ? false : true;
    }
    (
      this.myFramework.getElementById('deviceType') as HTMLSelectElement
    ).options[this.currentDevice.type].selected = true;
    this.selectInstances = M.FormSelect.init(
      this.myFramework.getElementById('deviceType'),
    );
  }
  // -------Fin manejo de formulario-------

  // -------Manejo de dispositivos en memoria-------
  addNewDevice(device: DeviceInt) {
    this.devices = [...this.devices, device];
  }
  removeDevice(id: string) {
    this.devices = this.devices.filter((device) => device.id !== id);
  }
  updateDevice(id: string, update: DeviceInt) {
    const deviceIndex = this.devices.findIndex((device) => id === device.id);

    if (deviceIndex > -1) {
      this.devices[deviceIndex] = {
        ...this.devices[deviceIndex],
        ...update,
      };
    } else {
      console.log('Error al actualizar. No lo encuentra');
    }
  }
  getDevices() {
    // Se vuelven a renderizar los elementos
    this.viewMainPage.showDevices(this.devices);

    // Se agregan los listener a los nuevos elementos
    let element: HTMLElement;
    this.devices.forEach((device) => {
      element = this.myFramework.getElementById('dev_' + device.id);
      this.elementListener.set(
        element,
        element.addEventListener('click', this),
      );
    });
  }
  // -------Fin manejo de dispositivos en memoria-------
}

window.addEventListener('load', function () {
  const main = new Main();
  main.main();

  // Agregar listener desde otro lugar para demostrar que se puede
  let modal1: HTMLElement = main.myFramework.getElementById('modal1');
  modal1.addEventListener('click', main);
  let modal2: HTMLElement = main.myFramework.getElementById('modal2');
  modal2.addEventListener('click', main);
  let btnCreateDevice: HTMLElement =
    main.myFramework.getElementById('btnCreateDevice');
  btnCreateDevice.addEventListener('click', main);
  // main.viewMainPage.showModalComponentType(main.currentDevice);
});
