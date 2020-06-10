import axios from 'axios'

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
    location: unknown;
    tags: Tag[];
    interfaces: DeviceInterface;
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