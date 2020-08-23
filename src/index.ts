import axios from 'axios'
import * as WebSocket from 'ws'

export class ElementKit {

    private apiKey: string
    private serviceUrl: string

    constructor(options: ElementApiOptions) {
        if (options.apiKey === undefined || options.apiKey === '') {
            throw new Error("Missing api key")
        }
        if (options.serviceUrl !== undefined &&
            (!options.serviceUrl.startsWith('https') || !options.serviceUrl.startsWith('http'))) {
            throw new Error("serviceUrl must start with https")
        }

        this.apiKey = options.apiKey
        this.serviceUrl = options.serviceUrl || "https://element-iot.com"
    }
    async getDevice(elementDeviceId: string): Promise<ElementResponse<Device>> {
        return (await axios.get(`${this.serviceUrl}/api/v1/devices/${elementDeviceId}?auth=${this.apiKey}`)).data
    }

    async findDeviceByDevEUI(deviceEUI: string): Promise<ElementResponse<Device[]>> {
        return (await axios.get(`${this.serviceUrl}/api/v1/devices/by-eui/${deviceEUI}?auth=${this.apiKey}`)).data
    }

    async getDevicesInTag(tagId: string, options?: Options): Promise<Device[]> {
        if (options?.limit) {
            return (await axios.get<ElementResponse<Device[]>>(`${this.serviceUrl}/api/v1/tags/${tagId}/devices?auth=${this.apiKey}${this.createParams(options)}`)).data.body 
        } else {
            let retrieveAfterId = undefined
            let devices = []

            do {
                const params = this.createParams({
                    limit: 100,
                    retrieveAfterId, ...options
                })
                const response = (await axios.get<ElementResponse<Device[]>>(`${this.serviceUrl}/api/v1/tags/${tagId}/devices?auth=${this.apiKey}${params}`)).data
                devices = devices.concat(response.body)
                retrieveAfterId = response.retrieve_after_id

                await new Promise(resolve => setTimeout(resolve, 1000));

            } while (retrieveAfterId !== undefined)
            return devices
        }
    
    }

    async getTag(tagId: string): Promise<ElementResponse<Tag>> {
        return (await axios.get(`${this.serviceUrl}/api/v1/tags/${tagId}?auth=${this.apiKey}`)).data
    }

    async getTags(options?: Options): Promise<Tag[]> {
        if (options?.limit) {
            return (await axios.get<ElementResponse<Tag[]>>(`${this.serviceUrl}/api/v1/tags?auth=${this.apiKey}${this.createParams(options)}`)).data.body
        } else {
            let retrieveAfterId = undefined
            let tags = []

            do {
                const params = this.createParams({
                    limit: 100,
                    retrieveAfterId, ...options
                })
                const response = (await axios.get<ElementResponse<Tag[]>>(`${this.serviceUrl}/api/v1/tags?auth=${this.apiKey}${params}`)).data
                tags = tags.concat(response.body)
                retrieveAfterId = response.retrieve_after_id

                await new Promise(resolve => setTimeout(resolve, 1000));

            } while (retrieveAfterId !== undefined)
            return tags
        }
    }

    async getDevices(options?: Options): Promise<Device[]> {
        if (options?.limit) {
            return (await axios.get<ElementResponse<Device[]>>(`${this.serviceUrl}/api/v1/devices?auth=${this.apiKey}${this.createParams(options)}`)).data.body
        } else {
            let retrieveAfterId = undefined
            let devices = []

            do {
                const params = this.createParams({
                    limit: 100,
                    retrieveAfterId, ...options
                })
                const response = (await axios.get<ElementResponse<Device[]>>(`${this.serviceUrl}/api/v1/devices?auth=${this.apiKey}${params}`)).data
                devices = devices.concat(response.body)
                retrieveAfterId = response.retrieve_after_id

                await new Promise(resolve => setTimeout(resolve, 1000));

            } while (retrieveAfterId !== undefined)
            return devices
        }
    }


    async getReadings(deviceId: string, options?: Options): Promise<Reading[]> {
        if (options?.limit) {
            return (await axios.get(`https://element-iot.com/api/v1/devices/${deviceId}/readings?auth=${this.apiKey}${this.createParams(options)}`)).data.body
        } else {
            let retrieveAfterId = undefined
            let devices = []

            do {
                const params = this.createParams({
                    limit: 100,
                    retrieveAfterId, ...options
                })
                const response = (await axios.get(`https://element-iot.com/api/v1/devices/${deviceId}/readings?auth=${this.apiKey}${params}`)).data
                devices = devices.concat(response.body)
                retrieveAfterId = response.retrieve_after_id

                await new Promise(resolve => setTimeout(resolve, 1000));

            } while (retrieveAfterId !== undefined)
            return devices
        }
    }

    private createParams(options: Options): string {
        let params = ""
        if (options.limit) {
            params += `&limit=${options.limit}`
        }
        if (options.retrieveAfterId) {
            params += `&retrieve_after=${options.retrieveAfterId}`
        }
        if (options.sort) {
            params += `&sort=${options.sort}`
        }
        if (options.sortDirection) {
            params += `&sort_direction=${options.sortDirection}`
        }
        return params
    }

    async createDevice(name: string, tagId: string): Promise<ElementResponse<Device>> {
        return (await axios.post(`${this.serviceUrl}/api/v1/devices?auth=${this.apiKey}`, {
            device: {
                name: name,
                tags: [{
                    id: tagId
                }]
            }
        })).data
    }

    async deleteDevice(deviceId: string): Promise<ElementResponse<unknown>> {
        return await axios.delete(`${this.serviceUrl}/api/v1/devices/${deviceId}?auth=${this.apiKey}`)
    }

    async addInterfaceToDevice(deviceId: string, deviceInterface: CreateDeviceInterface): Promise<DeviceInterface> {
        return (await axios.post(`${this.serviceUrl}/api/v1/devices/${deviceId}/interfaces?auth=${this.apiKey}`, {
            interface: deviceInterface
        })).data
    }

    async deleteInterface(deviceId: string, interfaceId: string): Promise<ElementResponse<unknown>> {
        return (await axios.delete(`${this.serviceUrl}/api/v1/devices/${deviceId}/interfaces/${interfaceId}?auth=${this.apiKey}`)).data
    }

    async listInterfaces(deviceId: string): Promise<ElementResponse<DeviceInterface[]>> {
        return (await axios.get(`${this.serviceUrl}/api/v1/devices/${deviceId}/interfaces?auth=${this.apiKey}`)).data
    }

    async createAction(deviceId: string, interfaceId: string, opts: unknown): Promise<ElementActionResponse> {
        return (await axios.post(`${this.serviceUrl}/api/v1/devices/${deviceId}/interfaces/${interfaceId}/actions/send_down_frame?auth=${this.apiKey}`, {
            opts
        })).data
    }
}
import { EventEmitter } from 'events'

export class ElementKitWS extends EventEmitter {

    private apiKey: string
    private serviceUrl: string
    pingTimeout: NodeJS.Timeout
    ws: WebSocket
    type: string

    constructor(options: ElementApiOptions, tagId: string, type: 'readings' | 'packets') {
        super()
        if (options.apiKey === undefined || options.apiKey === '') {
            throw new Error("Missing api key")
        }
        if (options.serviceUrl !== undefined &&
            (!options.serviceUrl.startsWith('wss') || !options.serviceUrl.startsWith('ws'))) {
            throw new Error("serviceUrl must start with wss")
        }

        this.apiKey = options.apiKey
        this.serviceUrl = options.serviceUrl || "wss://element-iot.com"
        this.type = type


        this.ws = new WebSocket(`${this.serviceUrl}/api/v1/tags/${tagId}/${type}/socket?auth=${this.apiKey}`);
        this.ws.on('open', this.heartbeat.bind(this));
        this.ws.on('ping', this.heartbeat.bind(this));
        this.ws.on('close', function () {
            clearTimeout(this.pingTimeout);
        }.bind(this));
        this.ws.on('error', function onError(error) {
            this.emit('error', error)
        }.bind(this))
        this.ws.on('message', this.onMessage.bind(this))
    }

    private onMessage(message: WebSocket.Data) {
        const messageString = message.toString('utf-8')
        if (message !== 'pong') {
            try {
                const data = JSON.parse(messageString)[0]
                if (data.event === 'reading_added') {
                    this.emit(this.type, { ...data.body })
                }

            } catch (error) {
                console.error(error);
            }
        }
    }

    private heartbeat() {
        clearTimeout(this.pingTimeout)
        this.pingTimeout = setTimeout(() => {
            //todo handle timeout
            console.log("ping timeout");
        }, 60000 + 1000)
        this.ws.send('ping')
    }


}
export interface Options {
    limit?: number;
    sort?: 'inserted_at' | 'transceived_at';
    sortDirection?: 'asc' | 'desc';
    retrieveAfterId?: string;
}

export interface Reading {
    id: string;
    device_id: string;
    transceived_at: Date;
    payload_encoding: string;
    payload: unknown;
    packet_type: string;
    meta: null | unknown;
    is_meta: boolean;
    interface_id: string;
    inserted_at: Date;
}

export interface CreateDeviceInterface {
    name: string;
    driver_instance_id: string;
    opts: unknown;
    enabled: boolean;
}
export interface DeviceInterface {
    id: string;
    name: string;
    driver_instance_id: string;
    opts: unknown;
    enabled: boolean;
}

export interface ElementResponse<T> {
    status: number;
    ok: boolean;
    retrieve_after_id: null | string;
    body: T;
}

export interface Device {
    id: string;
    mandate_id: string;
    name: string;
    slug: string;
    parser_id: string | null;
    location?: Point;
    tags: Tag[];
    interfaces: DeviceInterface;
}
export interface Point {
    type: 'Point';
    coordinates: [];
}
export interface Tag {
    updated_at: Date;
    slug: string;
    profile_data: [];
    parent_id: string | null;
    name: string;
    mandate_id: string;
    inserted_at: Date;
    id: string;
    group_interface_id: string | null;
    fields: unknown;
    description: string | null;
    default_readings_view_id: string | null;
    default_packets_view_id: string | null;
    default_layers_id: string | null;
    default_graph_preset_id: string | null;
    default_devices_view_id: string | null;
    color_hue: number;
}

export interface ElementApiOptions {
    apiKey: string;
    serviceUrl?: string;
}

export interface ElementActionResponse {
    updated_at: Date;
    type: 'send_down_frame' | unknown;
    state: 'pending' | unknown;
    result: null | unknown;
    order: null | unknown;
    opts: unknown;
    mandate_id: string;
    interface_id: string;
    inserted_at: Date;
    id: string;
    executed_at: null | Date;
    device_id: string;
}