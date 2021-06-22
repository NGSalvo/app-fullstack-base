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
      let checked = !!device.state ? 'checked' : '';
      // Agrega clases al elemento
      element.classList.add('collection-item', 'avatar');
      // Agrega id
      element.id = `dev_${device.id}`;
      // Agrega el resto del contenido
      element.innerHTML = `
                <img src="images/yuna.jpg" alt="" class="circle">
                <span class="title">${device.name}</span>
                <p>${device.description} <br>
                    ${device.type}
                </p>
                <div class="switch secondary-content">
                    <label>
                        Off
                        <input id="status_${device.id}" type="checkbox" ${checked}>
                        <span class="lever"></span>
                        On
                    </label>
                    <a href="#modal1" class="waves-effect waves-light modal-trigger"><i id="edit_${device.id}" class="material-icons edit_dev">edit</i></a>
                    <a href="#modal2" class="waves-effect waves-light modal-trigger"><i id="delete_${device.id}" class="material-icons delete_dev">delete</i></a>
                </div>
            `;
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
}
