import { BleManager } from 'react-native-ble-plx';
import { PermissionsAndroid } from 'react-native';

class BLEService{
    constructor(){
        this.bleManager = new BleManager();
    }

    async requestPermissions(){
        const granted = await PermissionsAndroid.request(

        )
    }

    startScanning(callback){
        this.bleManager.startDeviceScan(null, null, (error, device) => {
            if(error){
                console.log(error);
                return;
            }
            callback(device);
        })
    };

}

export default new BLEService();