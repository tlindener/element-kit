import axios from 'axios'

export class ElementKit {

    private apiKey: string
    private serviceUrl: string

    constructor(options: ElementApiOptions) {
        if (options.apiKey === undefined || options.apiKey === '') {
            throw new Error("Missing api key")
        }
        if (options.serviceUrl !== undefined && !options.serviceUrl.startsWith('https')) {
            throw new Error("serviceUrl must start with https")
        }

        this.apiKey = options.apiKey
        this.serviceUrl = options.serviceUrl || "https://element-iot.com"
    }
    async getDevice(elementDeviceId: string): Promise<ElementResponse<Device>> {
        return (await axios.get(`${this.serviceUrl}/api/v1/devices/${elementDeviceId}?auth=${this.apiKey}`)).data
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

    async addInterfaceToDevice(deviceId: string, deviceInterface: ElementDeviceInterface): Promise<ElementDeviceInterface> {
        return (await axios.post(`${this.serviceUrl}/api/v1/devices/${deviceId}/interfaces?auth=${this.apiKey}`, {
            interface: deviceInterface
        })).data
    }

    async deleteInterface(deviceId: string, interfaceId: string): Promise<ElementResponse<unknown>> {
        return (await axios.delete(`${this.serviceUrl}/api/v1/devices/${deviceId}/interfaces/${interfaceId}?auth=${this.apiKey}`)).data
    }

    async listInterfaces(deviceId: string): Promise<ElementResponse<ElementDeviceInterface[]>> {
        return (await axios.get(`${this.serviceUrl}/api/v1/devices/${deviceId}/interfaces?auth=${this.apiKey}`)).data
    }

    async createAction(deviceId: string, interfaceId: string, opts: unknown): Promise<ElementActionResponse> {
        return (await axios.post(`${this.serviceUrl}/api/v1/devices/${deviceId}/interfaces/${interfaceId}/actions/send_down_frame?auth=${this.apiKey}`, {
            opts
        })).data
    }
}
export interface ElementDeviceInterface {
    id?: string;
    name: string;
    driver_instance_id: string;
    opts: unknown;
    enabled: boolean;
}

export interface ElementResponse<T> {
    status: number;
    ok: boolean;
    body: T;
}

export interface Device {
    id: string;
    name: string;
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
    opts: any;
    mandate_id: string;
    interface_id: string;
    inserted_at: Date;
    id: string;
    executed_at: null | Date
    device_id: string
}