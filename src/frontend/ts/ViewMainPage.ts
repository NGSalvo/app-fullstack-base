class ViewMainPage {
  public myFramework: MyFramework = new MyFramework();
  // Renderiza los items de la lista 'deviceList'
  showDevices(list: Array<DeviceInt>): void {
    let ul: HTMLElement = this.myFramework.getElementById('deviceList');

    // vaciar lista
    this.myFramework.removeChildren(ul);

    // poblar lista
    list.forEach((device) => {
      // Crea elementos <li>
      let element = document.createElement('li');
      // Agrega clases al elemento
      element.classList.add('collection-item', 'avatar');
      // Agrega id
      element.id = `dev_${device.id}`;
      // Agrega el resto del contenido
      let img =
        device.type === 1
          ? './static/images/icons8-light-dimmer-64.png'
          : './static/images/icons8-light-64.png';
      element.innerHTML = `
                <img src="${img}" alt="" class="circle">
                <span class="title">${device.name}</span>
                <p>${device.description}</p>
            `;
      element.innerHTML = element.innerHTML + this.getComponentByType(device);

      // Agrega el boton editar y eliminar
      let actionButtons = `<div class="center-align"><a href="#modal1" id="edit_${device.id}" class="btn-flat edit_dev waves-effect waves-light modal-trigger">Editar</a>
       <a href="#modal2" id="delete_${device.id}"class="btn-flat delete_dev waves-effect waves-light modal-trigger">Eliminar</a></div>
       `;
      element.innerHTML = element.innerHTML + actionButtons;
      // Agrega el elemento <li> al elemento <ul>
      ul.appendChild(element);
    });
  }

  // Devuelve el estado del elemento checkbox
  getSwitchStateById(id: string): boolean {
    let deviceSwitch: HTMLInputElement = this.myFramework.getElementById(
      id,
    ) as HTMLInputElement;
    return deviceSwitch.checked;
  }

  // Devuelve el estado del elemento checkbox
  getRangeValueById(id: string): number {
    let deviceRange: HTMLInputElement = this.myFramework.getElementById(
      id,
    ) as HTMLInputElement;
    return deviceRange.valueAsNumber;
  }

  // Devuelve componente segun tipo de dispositivo
  getComponentByType(device: DeviceInt): string {
    let element: string;
    switch (device.type) {
      case 1:
        element = `<p class="range-field secondary-content">
        <input type="range" id="status_${device.id}" min="0" max="1" step="0.1" value="${device.state}" />
        </p>`;
        break;
      case 2:
        let checked = !!device.state ? 'checked' : '';
        element = `<div class="switch secondary-content">
                    <label>
                        Off
                        <input id="status_${device.id}" type="checkbox" ${checked}>
                        <span class="lever"></span>
                        On
                    </label>
                </div>`;
        break;
      default:
        element = '';
    }
    return element;
  }

  // Devuelve componente segun tipo de dispositivo en el modal
  getComponentModalByType(type: number, device): string {
    let element: string;
    switch (type) {
      case 1:
        element = `<p class="range-field secondary-content">
      <input type="range" id="deviceState" min="0" max="1" step="0.1" value="${device.state}"/>
      </p>`;
        break;
      case 2:
        let checked = !!device.state ? 'checked' : '';
        element = `<div class="switch secondary-content">
                    <label>
                        Off
                        <input id="deviceState" type="checkbox" ${checked}>
                        <span class="lever"></span>
                        On
                    </label>
                </div>`;
        break;
      default:
        element = '';
    }
    return element;
  }

  // Renderiza modal
  showModalComponentType(type: number, device: DeviceInt) {
    let modal: HTMLElement = this.myFramework.getElementById('modal1');
    let element: HTMLElement = modal.querySelector('.secondary-content');
    let parentElement = this.myFramework.getElementParent(element);
    this.myFramework.removeChildren(parentElement);
    let typeComponent = this.getComponentModalByType(type, device);
    parentElement.innerHTML = typeComponent;
  }
}
