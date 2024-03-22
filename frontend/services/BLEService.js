import { BleManager } from 'react-native-ble-plx';
import { PermissionsAndroid } from 'react-native';

class BLEService{
    constructor(){
        this.bleManager = new BleManager();
        this.deviceId = null;
    }

    async requestPermissions(){
        const granted = await PermissionsAndroid.request(

        )
    }

    async discoverDevices(){
        manager.startDeviceScan(null, null, (error, device) => {
            if (error) {
                console.error('Error scanning:', error);
                return;
            }
            console.log('Discovered device:', device.name, device.id);
            if(device.name === 'DUO'){
                this.connectToDevice(device.name);
            }
        });
    };

    async connectToDevice(deviceName){
        try {
            const device = await manager.connectToDevice(deviceName);
            console.log('Connected to device:', device.name);
            // Interact with the connected device
        } catch (error) {
            console.error('Error connecting to device:', error);
        }
    };

    async readBattery(deviceId, serviceUUID, characteristicUUID){
        try {
            const device = await manager.deviceById(deviceId);
            const characteristic = await device.readCharacteristicForService(serviceUUID, characteristicUUID);
            console.log('Received data:', characteristic.value);
            return characteristic;
            // Process the received data
        } catch (error) {
            console.error('Error reading data:', error);
        }
    };

    async sendData(data, serviceUUID, characteristicUUID) {
        try {
            const device = await this.manager.deviceById(this.deviceId);
            await device.writeCharacteristicWithoutResponseForService(serviceUUID, characteristicUUID,data);
            console.log('Data sent successfully');
        } catch (error) {
          console.error('Error sending data:', error);
        }
      }

}

export default new BLEService();