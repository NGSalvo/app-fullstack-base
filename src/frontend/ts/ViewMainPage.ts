class ViewMainPage {
  public myFramework: MyFramework = new MyFramework();
  // Renderiza los items de la lista 'deviceList'
  showDevices(list: Array<DeviceInt>): void {
    let ul: HTMLElement = this.myFramework.getElementById('deviceList');

    // vaciar lista
    while (ul.firstChild) {
      ul.removeChild(ul.firstChild);
    }

    // poblar lista
    list.forEach((device) => {
      // Crea elementos <li>
      let element = document.createElement('li');
      // Agrega clases al elemento
      element.classList.add('collection-item', 'avatar');
      // Agrega id
      element.id = `dev_${device.id}`;
      // Agrega el resto del contenido
      element.innerHTML = `
                <img src="images/yuna.jpg" alt="" class="circle">
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

  getComponentByType(device: DeviceInt): string {
    let checked = !!device.state ? 'checked' : '';
    let element: string;
    switch (device.type) {
      case 1:
        element = `<p class="range-field secondary-content">
      <input type="range" id="status_${device.id}" min="0" max="100" />
      </p>`;
        break;
      case 2:
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
}
